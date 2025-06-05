

module.exports = {
    async run(message) {
        const helpMessage = `
            🎧 **Comandos del bot TBZ** 🎧

            🤖 **IA**
            • \`!ia [pregunta]\` — Pregunta algo a una IA local (Deshabilitado). Ej: \`!ia ¿quién fue Nikola Tesla?\`

            🔊 **Audio y YouTube**
            • \`!join\` — El bot se une a tu canal de voz.
            • \`!join [URL de YouTube]\` — El bot se une a tu canal y reproduce el audio de ese video.
            • \`!query [término]\` — Busca en YouTube y reproduce el primer resultado. Ej: \`!query never gonna give you up\`
            • \`!playlist [URL de playlist]\` — Reproduce toda una playlist de YouTube.
            • \`!playmix [URL de mix]\` — Reproduce un mix de YouTube (tipo autoplay de canciones relacionadas).
            • \`!stop\` — Detiene la reproducción actual (pausa el audio).

            📥 **Descarga de videos de YouTube**
            • \`!ytdown [URL]\` — Muestra las calidades disponibles para descargar un video.
            • \`!ytselect [calidad]\` — Elige la calidad y genera un link de descarga. Ej: \`!ytselect 720\`

            ❓ **Ayuda**
            • \`!tbzhelp\` — Muestra este mensaje de ayuda.

            📌 _Asegúrate de estar en un canal de voz para los comandos que reproducen audio._

            😎 _Desarrollado por MCube21. Cualquier error o sugerencia, contáctalo. 0426_
        `;
        
        message.reply(helpMessage);
    }
}