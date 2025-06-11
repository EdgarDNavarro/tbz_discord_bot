const { Store, Shop } = require("../../systems/gameEngine.js");

module.exports = {
    async run(message) {
        try {
            const userId = message.author.id;
            const store = new Store();
            const session = store.getSession(userId);

            const args = message.content.split(" ");
            const index = Number(args[1])

            const shop = new Shop();
            const bought = await shop.buy(session, index, message)
            await message.reply(bought);
        } catch (err) {
            console.error(err);
            await message.reply(err.message || "❌ Hubo un error.");
        }
    },
};
