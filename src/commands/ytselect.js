const { ytmp4 } = require('@vreden/youtube_scraper');

module.exports = {
    async run(message) {
        const args = message.content.split(' ');
        const quality = parseInt(args[1]);

        if (!quality || isNaN(quality)) {
            return message.reply('Debes especificar una calidad numérica. Ej: `!ytselect 720`');
        }

        const userData = global.ytDownloads?.get(message.author.id);
        if (!userData) {
            return message.reply('No encontré una solicitud previa. Usa `!ytdown [url]` primero.');
        }

        if (!userData.qualities.includes(quality)) {
            return message.reply(`La calidad ${quality}p no está disponible para este video.`);
        }

        try {
            // Llamamos de nuevo con la calidad deseada
            const data = await ytmp4(userData.url, quality);

            await message.reply({
                content: `🎬 **${data.metadata.title}**\n📥 Calidad: **${quality}p**\n\n[Haz clic para descargar](${data.download.url})`
            });

            // Limpia la info si quieres evitar spam
            global.ytDownloads.delete(message.author.id);
        } catch (error) {
            console.error('Error al procesar descarga:', error);
            message.reply('Ocurrió un error al intentar obtener el video con esa calidad.');
        }
    }
}