// src/commands/initgame.js
const { Store, DiceFactory } = require("../../systems/gameEngine.js");
const { buildGameEmbed } = require("../../utils/buildGameEmbed.js");

module.exports = {
    async run(message) {
        try {
            const userId = message.author.id;
            const store = new Store();

            const session = store.getSession(userId);

            const embed = buildGameEmbed(session, message.author.username);
            await message.reply({ embeds: [embed] });

        } catch (err) {
            console.error(err);
            await message.reply(err.message || "❌ Hubo un error.")
        }
    },
};
