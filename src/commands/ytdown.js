const { ytmp4 } = require('@vreden/youtube_scraper');

module.exports = {
    async run(message) {
        const args = message.content.split(' ');
        args.shift();
        const youtubeUrl = args.join(' ');

        if (!youtubeUrl) {
            return message.reply('Por favor, proporciona una URL de YouTube válida.');
        }

        try {
            const data = await ytmp4(youtubeUrl, 360); // El número es la calidad predeterminada
            const qualities = data.download.availableQuality;

            const qualityList = qualities.map(q => `• ${q}p`).join('\n');

            await message.reply({
                content: `📺 Video: **${data.metadata.title}**\n\nCalidades disponibles:\n${qualityList}\n\nResponde con el comando:\n\`!ytselect [calidad]\`\nEjemplo: \`!ytselect 720\``
            });

            // Guarda temporalmente la info en algún lado (en memoria o base de datos)
            // Aquí se puede usar un Map global, por ejemplo:
            global.ytDownloads = global.ytDownloads || new Map();
            global.ytDownloads.set(message.author.id, {
                url: youtubeUrl,
                metadata: data.metadata,
                qualities: data.download.availableQuality
            });

        } catch (error) {
            console.error('Error al obtener información del video:', error);
            message.reply('Hubo un error al obtener información del video.');
        }
    }
}