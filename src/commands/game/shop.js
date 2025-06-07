const { Store, Shop } = require("../../systems/gameEngine.js");

module.exports = {
    async run(message) {
        try {
            const userId = message.author.id;
            const store = new Store();
            const session = store.getSession(userId);

            const shop = new Shop();
            await shop.showShop(session, message);

        } catch (err) {
            console.error(err);
            await message.reply(err.message || "❌ Hubo un error.");
        }
    },
};
