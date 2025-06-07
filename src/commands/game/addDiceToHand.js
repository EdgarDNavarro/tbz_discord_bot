const { Store } = require("../../systems/gameEngine.js");
const { buildGameEmbed } = require("../../utils/buildGameEmbed.js");

module.exports = {
    async run(message) {
        try {
            const userId = message.author.id;
            const store = new Store();
            const session = store.getSession(userId);

            const args = message.content.trim().split(" ").slice(1);
            const requestedIndexes = args.map(i => Number(i));

            const validIndexes = requestedIndexes
                .filter((i, idx, self) =>
                    !isNaN(i) &&
                    i >= 0 &&
                    i < session.diceBag.length &&
                    self.indexOf(i) === idx 
                );

            const remainingSlots = session.limitDiceRound - session.diceInHand.length;

            if (validIndexes.length === 0) {
                return await message.reply("❌ No se proporcionaron índices válidos.");
            }

            if (remainingSlots <= 0) {
                return await message.reply("⚠️ Ya tienes el máximo de dados en la mano.");
            }

            if (validIndexes.length > remainingSlots) {
                return await message.reply(`⚠️ Solo puedes agregar ${remainingSlots} dado(s) más a la mano.`);
            }

            const addedDiceDescriptions = [];
            

            validIndexes.forEach(diceIndex => {
                const selectedDice = session.diceBag[diceIndex];
                session.addDiceFromHand(selectedDice);
                addedDiceDescriptions.push(session.getDiceDescription(selectedDice));
            });

            validIndexes
                .sort((a, b) => b - a)
                .forEach(index => {
                    session.removeDiceFromBag(index);
                });

            const extraFields = addedDiceDescriptions.map((desc, i) => ({
                name: `🎲 Dado #${i} agregado`,
                value: desc,
                inline: false,
            }));

            const embed = buildGameEmbed(session, message.author.username, extraFields);
            await message.reply({ embeds: [embed] });

        } catch (err) {
            console.error(err);
            await message.reply(err.message || "❌ Hubo un error al agregar dados a la mano.");
        }
    },
};
