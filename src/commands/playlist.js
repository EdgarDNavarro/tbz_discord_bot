const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice')
const { EmbedBuilder } = require("discord.js")
const youtubesearchapi = require('youtube-search-api');
const path = require('path');
const { downloadAudioFromYouTube, getListIdFromUrl } = require('../utils/youtube');

module.exports = {
    async run(message) {
        const args = message.content.split(' ');
        args.shift(); // Remueve !play del array
        const searchTerm = args.join(' ');
        const playlistId = getListIdFromUrl(searchTerm);
        
        try {
            if (!playlistId) return message.reply('Por favor, proporciona una URL de lista de reproducción válida de YouTube.');

            if (message.guild && message.member?.voice?.channelId) {
                const connection = joinVoiceChannel({
                    channelId: message.member?.voice?.channel?.id,
                    guildId: message.guildId,
                    adapterCreator: message.guild.voiceAdapterCreator
                });
                message.reply('Buscando...');
                // Buscar en YouTube
                
                const searchPlayList = await youtubesearchapi.GetPlaylistData(playlistId);
                
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
}