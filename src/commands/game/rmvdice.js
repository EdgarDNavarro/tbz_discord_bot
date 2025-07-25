const { Store } = require("../../systems/gameEngine.js");
const { buildGameEmbed } = require("../../utils/buildGameEmbed.js");

module.exports = {
    async run(message) {
        try {
            const userId = message.author.id;
            const store = new Store();

            // Obtener sesión
            const session = store.getSession(userId);

            // Obtener índice del dado seleccionado
            const args = message.content.split(" ");
            const diceIndex = Number(args[1])

            if (
                isNaN(diceIndex) ||
                diceIndex < 0 ||
                diceIndex >= session.diceInHand.length
            ) {
                return await message.reply(
                    "❌ Por favor, proporciona un índice válido de dado para mostrar."
                );
            }

            const selectedDice = session.diceInHand[diceIndex];

            session.addDiceFromBag(selectedDice)
            session.removeDiceFromHand(diceIndex)

            const diceDescription = session.getDiceDescription(selectedDice);

            const extraFields = [
                { name: "🎲 Dado seleccionado", value: diceDescription, inline: false }
            ];

            const embed = buildGameEmbed(session, message.author.username, extraFields);
            await message.reply({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            await message.reply(err.message || "❌ Hubo un error al agregar el dado a la mano. Intenta nuevamente.");
        }
    },
};
