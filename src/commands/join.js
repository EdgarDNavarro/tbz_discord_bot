const { joinVoiceChannel, createAudioPlayer, getVoiceConnection, createAudioResource } = require('@discordjs/voice')
const { downloadAudioFromYouTube } = require('../utils/youtube');
const path = require('path');

module.exports = {
    async run(message) {
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
                message.reply('Se produjo un error. Si necesita ayuda contactar con MCube21');
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
                message.reply('Se produjo un error. Si necesita ayuda contactar con MCube21');
            }
        }
        
        else {
            message.reply('Formato de comando no válido. Por favor, utiliza `!join` o `!join <URL>`.');
        }
    
    }
};