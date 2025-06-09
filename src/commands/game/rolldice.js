const { Store } = require("../../systems/gameEngine.js");

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

            await session.rollDice(message);
        } catch (err) {
            console.error(err);
            await message.reply(err.message || "❌ Hubo un error.")
        }
    },
};
