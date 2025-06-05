const { Store } = require("../../systems/gameEngine.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    async run(message) {
        try {
            const userId = message.author.id;
            const store = new Store();

            const session = store.getSession(userId);

            if (session.dadosMano.length === 0) {
                return await message.reply(
                    "❌ No tienes dados en la mano para tirar. Usa el comando para agregar dados a la mano."
                );
            }

            const roundTotal = session.rollDice();

            session.nextRound();

            const dadosTiradosTexto = session.dadosMano
                .map(
                    (dado, i) =>
                        `${i + 1}. ${dado.type} (caras: ${
                            dado.faces?.join(", ") || "N/A"
                        })`
                )
                .join("\n");

            const estadoMap = {
                jugando: "🎮 Jugando",
                ganado: "🏆 Ganaste",
                perdido: "💀 Perdiste",
            };
            const estadoAmigable = estadoMap[session.estado] || session.estado;

            // Crear embed con info completa
            const embed = new EmbedBuilder()
                .setTitle(`🎲 Tirada de dados completada`)
                .setColor("Purple")
                .addFields(
                    {
                        name: "Dados tirados esta ronda",
                        value: dadosTiradosTexto || "No hay dados",
                        inline: false,
                    },
                    {
                        name: "Puntaje de esta tirada",
                        value: roundTotal.toString(),
                        inline: true,
                    },
                    {
                        name: "Puntaje total acumulado",
                        value: session.puntaje.toString(),
                        inline: true,
                    },
                    {
                        name: "Ronda actual",
                        value: session.rondaActual.toString(),
                        inline: true,
                    },
                    {
                        name: "Estado del juego",
                        value: estadoAmigable,
                        inline: true,
                    }
                )
                .setTimestamp();

            await message.reply({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            await message.reply(
                "❌ Hubo un error al tirar los dados. Intenta nuevamente."
            );
        }
    },
};
