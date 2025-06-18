const { Store, Shop } = require("../../systems/gameEngine.js");

module.exports = {
    async run(message) {
        try {
            const userId = message.author.id;
            const store = new Store();
            const session = store.getSession(userId);

            const args = message.content.split(" ");
            const dieIndex = Number(args[1])
            if (
                isNaN(dieIndex) ||
                dieIndex < 0 ||
                dieIndex >= session.diceBag.length
            ) {
                return await message.reply(
                    "❌ Por favor, proporciona un índice válido de dado en la bolsa."
                );
            }

            const shop = new Shop();
            await shop.upgradeDieFace(session, message, dieIndex);

        } catch (err) {
            console.error(err);
            await message.reply(err.message || "❌ Hubo un error.");
        }
    },
};
