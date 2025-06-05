const { getVoiceConnection } = require('@discordjs/voice')

module.exports = {
    async run(message) {
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
}