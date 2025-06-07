const { Store } = require("../../systems/gameEngine.js");
const { buildGameEmbed } = require("../../utils/buildGameEmbed.js");

module.exports = {
    async run(message) {
        try {
            const userId = message.author.id;
            const store = new Store();

            const session = store.getSession(userId);

            if (session.diceInHand.length === 0) {
                return await message.reply(
                    "❌ No tienes dados en la mano para tirar. Usa el comando para agregar dados a la mano."
                );
            }

            const roundTotal = await session.rollDice(message);

            const extraFields = [
                { name: "🔥 Total lanzado esta ronda", value: `${roundTotal}`, inline: false }
            ];

            session.nextRound();
            session.startRound()

            const embed = buildGameEmbed(session, message.author.username, extraFields);
            await message.reply({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            await message.reply(
                "❌ Hubo un error al tirar los dados. Intenta nuevamente."
            );
        }
    },
};
