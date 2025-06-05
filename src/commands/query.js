const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice')
const { EmbedBuilder } = require("discord.js")
const youtubesearchapi = require('youtube-search-api');
const { downloadAudioFromYouTube } = require('../utils/youtube');
const path = require('path');

module.exports = {
    async run(message) {
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
};