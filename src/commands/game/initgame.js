// src/commands/initgame.js
const { Store, DiceFactory } = require("../../systems/gameEngine.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    async run(message) {
        try {
            const userId = message.author.id;
            const store = new Store();

            // Crear o resetear sesión
            const session = store.getSession(userId);

            // Resetear estado manualmente si quieres reiniciar la partida
            session.bolsoDados = [];
            session.dadosMano = [];
            session.items = [];
            session.puntaje = 0;
            session.monedas = 0;
            session.rondaActual = 1;
            session.estado = "jugando";

            session.addDice(DiceFactory.createDice("D6"));
            session.addDice(DiceFactory.createDice("D6"));
            session.addDice(DiceFactory.createDice("D4"));

            const diceWhitIndexIntText = session.bolsoDados
                .map((dado, index) => {
                    const elementText = dado.element
                        ? ` (Elemento: ${dado.element})`
                        : "";
                    return `#${index} - Tipo: ${dado.type}, Caras: ${dado.faces.join(
                        ", "
                    )}${elementText}`;
                })
                .join("\n");

            const embed = new EmbedBuilder()
                .setTitle(`🎲 Partida iniciada para ${message.author.username}`)
                .setColor("Purple")
                .addFields(
                    {
                        name: "Puntaje",
                        value: session.puntaje.toString(),
                        inline: true,
                    },
                    {
                        name: "Dados en bolso",
                        value: diceWhitIndexIntText || "Ninguno",
                        inline: false,
                    },
                    {
                        name: "Items",
                        value: session.items.length
                            ? session.items.join(", ")
                            : "Ninguno",
                        inline: false,
                    },
                    { name: "Estado", value: session.estado, inline: true }
                )
                .setTimestamp();

            await message.reply({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            await message.reply(
                "❌ Hubo un error al iniciar la partida. Intenta nuevamente."
            );
        }
    },
};
