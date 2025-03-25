const Discord = require('discord.js')
require('dotenv').config();
const { joinVoiceChannel, createAudioPlayer, getVoiceConnection, createAudioResource } = require('@discordjs/voice')
const { loadSlash } = require("./handlers/slashHandler")
const Client = new Discord.Client({
    intents: 3276799
})
const { EmbedBuilder } = require("discord.js")
const youtubesearchapi = require('youtube-search-api');
const path = require('path');
const fs = require('fs');
const { ytmp3 } = require('@vreden/youtube_scraper');
const { default: axios } = require('axios')

// Función para descargar el audio de YouTube y guardar en el sistema de archivos
async function downloadAudioFromYouTube(url, filePath) {
    try {
            const quality = "128"
            const videoData = await ytmp3(url, quality)
            const downloadUrl = videoData.download.url;
        
            const response = await axios({
                url: downloadUrl,
                method: "GET",
                responseType: "stream",
            });
        
            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);
        
            await new Promise((resolve, reject) => {
                writer.on("finish", resolve);
                writer.on("error", reject);
            });
    } catch (error) {
        console.log(error);
    }
}

Client.on('interactionCreate', async (interaction) => {
    if(!interaction.isCommand()) return
    const cmd = Client.slashCommands.get(interaction.commandName)
    if(!cmd) return;

    const args = []
    for(let option of interaction.options.data){
        if(option.type === 1 ) {
            if(option.name) args.push(option.name)
            option.options?.forEach(element => {
                if(element.value) args.push(option.value)
            });
        } else if(option.value) args.push(option.value)
    }
    cmd.execute(Client, interaction, args)
})

Client.slashCommands = new Discord.Collection()

Client.on('messageCreate', async message => {
    if (message.content.startsWith('!join')) {
        const args = message.content.split(' ');
        // Si viene solo !join
        if (args.length === 1) {
            try {
                if (message.guild && message.member?.voice?.channel?.id) {
                    const connection = getVoiceConnection(message.guildId);
                    if (connection) {
                        connection.destroy();
                        message.reply('Mamalo, ¡Me voy!');
                        return
                    }
                    const voiceConnection = joinVoiceChannel({
                        channelId: message.member?.voice?.channel?.id,
                        guildId: message.guildId,
                        adapterCreator: message.guild.voiceAdapterCreator
                    });
                    message.reply('¡El bot se ha unido al canal de voz!');
                } else {
                    message.reply('¡Debes estar en un canal de voz para que el bot se una! ');
                }
            } catch (error) {
                console.error('Error al unirse al canal de voz:', error);
                message.reply('Error: se jodieron porque toca reiniciar el servidor y seguro me dormí, o sino fué que no le pasaron url, si no funciona fué que se partió en dos el bot y toca reiniciar. Esa vaina es culpa de Luis Bastidas');
            }
        }
        // Si viene !join seguido de una URL
        else if (args.length === 2) {
            const youtubeUrl = args[1];
            const filePath = path.join(__dirname, 'testcancion.mp3');
            try {
                if (message.guild && message.member?.voice?.channel?.id) {
                    const connection = getVoiceConnection(message.guildId);
                    if (connection) {
                        connection.destroy();
                    }
                    const voiceConnection = joinVoiceChannel({
                        channelId: message.member?.voice?.channel?.id,
                        guildId: message.guildId,
                        adapterCreator: message.guild.voiceAdapterCreator
                    });

                    await downloadAudioFromYouTube(youtubeUrl, filePath);
                    const player = createAudioPlayer();
                    const resource = createAudioResource(filePath);
                    player.play(resource);

                    voiceConnection.subscribe(player);

                    player.on('stateChange', (oldState, newState) => {
                        if (newState.status === 'idle') {
                            voiceConnection.destroy();
                        }
                    });

                } else {
                    message.reply('¡Debes estar en un canal de voz para que el bot se una! ');
                }
            } catch (error) {
                console.error('Error al unirse al canal de voz:', error);
                message.reply('Error: se jodieron porque toca reiniciar el servidor y seguro me dormí, o sino fué que no le pasaron url, si no funciona fué que se partió en dos el bot y toca reiniciar. Esa vaina es culpa de Luis Bastidas');
            }
        }
        // Si hay más de 2 argumentos (no es un formato válido)
        else {
            message.reply('Formato de comando no válido. Por favor, utiliza `!join` o `!join <URL>`.');
        }
    }

    if (message.content.startsWith('!query')) {
        const args = message.content.split(' ');
        args.shift(); // Remueve !play del array
        const searchTerm = args.join(' ');

        try {
            if (message.guild && message.member?.voice?.channelId) {
                // const connection = getVoiceConnection(message.guildId);
                const searchMessage = await message.reply('Buscando...');
                // Buscar en YouTube
                const searchResults = await youtubesearchapi.GetListByKeyword(searchTerm, true, 5, [{"type":"video"}])

                if (searchResults.items.length === 0) {
                    await searchMessage.edit('No se encontraron resultados en YouTube para ese término de búsqueda.');
                    return;
                }
                
                const firstVideo = searchResults.items.find(item => item.type === 'video');

                if (!firstVideo) {
                    await searchMessage.edit('No se encontraron videos en YouTube para ese término de búsqueda.');
                    return;
                }

                const videoUrl = `https://www.youtube.com/watch?v=${firstVideo.id}`;
                
                // Descargar el audio del primer resultado
                const filePath = path.join(__dirname, 'audio.mp3');
                await downloadAudioFromYouTube(videoUrl, filePath);

                // Unir al canal de voz y reproducir el audio
                const voiceConnection = joinVoiceChannel({
                    channelId: message.member?.voice?.channel?.id,
                    guildId: message.guildId,
                    adapterCreator: message.guild.voiceAdapterCreator
                });

                const player = createAudioPlayer();
                const resource = createAudioResource(filePath);
                player.play(resource);

                voiceConnection.subscribe(player);

                const embed = new EmbedBuilder()
                .setColor('Purple')
                .setAuthor({ name: firstVideo.channelTitle, url: videoUrl })
                .setTitle(firstVideo.title)
                .setDescription(firstVideo.length.simpleText)
                .setThumbnail(firstVideo.thumbnail.thumbnails[0]?.url)

                await message.reply({ embeds: [embed]});
                await searchMessage.delete();

                player.on('stateChange', (oldState, newState) => {
                    if (newState.status === 'idle') {
                        // voiceConnection.destroy();
                    }
                });
            } else {
                message.reply('¡Debes estar en un canal de voz para que el bot se una!');
            }
        } catch (error) {
            console.error('Error al unirse al canal de voz:', error);
        }
    }

    if (message.content.startsWith('!stop')) {
        const voiceChannel = message.member?.voice.channel;
        if (!voiceChannel) {
          return message.reply('Debes estar en un canal de voz para usar este comando.');
        }
      
        const connection = getVoiceConnection(message.guildId);
        if (connection) {
            const player = connection.state.subscription.player;
            if (player) {
              player.pause();
            } else {
              message.reply('No estoy reproduciendo nada en este momento.');
            }
        } else {
          message.reply('No estoy reproduciendo nada en este momento.');
        }
    }

    if (message.content.startsWith('!playlist')) {
        const args = message.content.split(' ');
        args.shift(); // Remueve !play del array
        const searchTerm = args.join(' ');

        try {
            if (message.guild && message.member?.voice?.channelId) {
                const connection = joinVoiceChannel({
                    channelId: message.member?.voice?.channel?.id,
                    guildId: message.guildId,
                    adapterCreator: message.guild.voiceAdapterCreator
                });
                message.reply('Buscando...');
                // Buscar en YouTube
                const searchResultsPlayList = await youtubesearchapi.GetListByKeyword(searchTerm, true, 5, [{"type":"playlist"}]);

                if (searchResultsPlayList.items.length === 0) {
                    message.reply('No hubo resultados para tu búsqueda.');
                    return;
                }
                
                const searchPlayList = await youtubesearchapi.GetPlaylistData(searchResultsPlayList.items[0].id);
                const playlistItems = searchPlayList.items;
    
                if (playlistItems.length === 0) {
                    message.reply('La lista de reproducción está vacía.');
                    return;
                }
    
                for (let i = 0; i < playlistItems.length; i++) {
                    const item = playlistItems[i];
                    const videoId = item.id;
                    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
                    const filePath = path.join(__dirname, `audio.mp3`);
                    await downloadAudioFromYouTube(videoUrl, filePath);
    
                    const resource = createAudioResource(filePath);
                    const player = createAudioPlayer();
    
                    // Crear una promesa para resolver cuando la canción termine de reproducirse
                    const songEndPromise = new Promise(resolve => {
                        player.on('stateChange', (oldState, newState) => {
                            if (newState.status === 'idle') {
                                resolve();
                            }
                        });
                    });
    
                    player.play(resource);
                    connection.subscribe(player);

                    const embed = new EmbedBuilder()
                    .setColor('Purple')
                    .setTitle(item.title)
                    .setDescription(item.length.simpleText)
                    .setThumbnail(item.thumbnail.thumbnails[0]?.url)
    
                    await message.reply({ embeds: [embed]});
    
                    // Esperar a que la canción actual termine de reproducirse
                    await songEndPromise;
    
                    // Destruir la conexión de voz antes de reproducir la siguiente canción si es la última en la lista
                    if (i === playlistItems.length - 1) {
                        connection.destroy();
                    }
                }
    
                message.reply('La lista de reproducción ha sido reproducida.');
            } else {
                message.reply('¡Debes estar en un canal de voz para que el bot se una!');
            }
        } catch (error) {
            console.error('Error al unirse al canal de voz:', error);
            message.reply('Hubo un error al reproducir la lista de reproducción.');
        }
    }
});
Client.login(process.env.DISCORD_KEY)
    .catch((error) => console.log(error))

Client.on("ready", async () => {
    await loadSlash(Client)
    .then(() => {
        console.log("Comandos iniciados con exito")
    })
    .catch((error) => {
        console.log(`Error: ${error}`)
    })
})