// src/commands/initgame.js
const { Store, DiceFactory, ItemFactory } = require("../../systems/gameEngine.js");
const { buildGameEmbed } = require("../../utils/buildGameEmbed.js");

module.exports = {
    async run(message) {
        try {
            const userId = message.author.id;
            const store = new Store();

            // Crear o resetear sesión
            const session = store.getSession(userId);

            // Resetear estado manualmente si quieres reiniciar la partida
            session.diceBag = [];
            session.diceInHand = [];
            session.items = [];
            session.dicePlayed = [];
            session.score = 0;
            session.coins = 10;
            session.currentRound = 1;
            session.estado = "jugando";

            session.addDiceFromBag(DiceFactory.createDice("D6"));
            session.addDiceFromBag(DiceFactory.createDice("D6"));
            session.addDiceFromBag(DiceFactory.createDice("D4"));
            session.addDiceFromBag(DiceFactory.createDice("fireD6"));
            session.addDiceFromBag(DiceFactory.createDice("undeadD6"));

            session.addItem(ItemFactory.createItem("gemelos"));
            session.addItem(ItemFactory.createItem("reflejo"));
            session.addItem(ItemFactory.createItem("endurance"));

            const embed = buildGameEmbed(session, message.author.username);
            await message.reply({ embeds: [embed] });

        } catch (err) {
            console.error(err);
            await message.reply(
                "❌ Hubo un error al iniciar la partida. Intenta nuevamente."
            );
        }
    },
};
