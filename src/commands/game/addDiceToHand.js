const { Store } = require("../../systems/gameEngine.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    async run(message) {
        try {
            const userId = message.author.id;
            const store = new Store();

            // Obtener sesión
            const session = store.getSession(userId);

            // Obtener índice del dado seleccionado
            const args = message.content.split(" ");
            const diceIndex = parseInt(args[1], 10);

            if (
                isNaN(diceIndex) ||
                diceIndex < 0 ||
                diceIndex >= session.bolsoDados.length
            ) {
                return await message.reply(
                    "❌ Por favor, proporciona un índice válido de dado para mostrar."
                );
            }

            const selectedDice = session.bolsoDados[diceIndex];
            session.addDiceToHand(selectedDice);

            // Contar dados en bolso
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

            const diceInHandText = session.dadosMano.map((dice) => {
                const elementText = dice.element
                    ? ` (Elemento: ${dice.element})`
                    : "";

                return `Tipo: ${dice.type}, Caras: ${dice.faces.join(
                    ","
                )}${elementText}`;
            }).join("\n");

            const diceDescription = `
                    **Tipo:** ${selectedDice.type}
                    **Caras:** ${selectedDice.faces.join(", ")}
                    ${
                        selectedDice.element
                            ? `**Elementos:** ${selectedDice.element}`
                            : ""
                    }
            `.trim();

            const embed = new EmbedBuilder()
                .setTitle(`🎲 Dados en bolso y dado seleccionado`)
                .setColor("Purple")
                .addFields(
                    {
                        name: "Dados en bolso",
                        value: diceWhitIndexIntText || "Ninguno",
                        inline: true,
                    },
                    {
                        name: `Dado seleccionado (#${diceIndex})`,
                        value: diceDescription || "Sin detalles disponibles",
                        inline: false,
                    },
                    {
                        name: "Dados en mano",
                        value: diceInHandText || "Ninguno",
                        inline: false,
                    }
                )
                .setTimestamp();

            await message.reply({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            await message.reply(
                "❌ Hubo un error al mostrar los dados. Intenta nuevamente."
            );
        }
    },
};
