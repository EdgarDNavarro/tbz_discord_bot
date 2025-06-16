const { buildGameEmbed } = require("../utils/buildGameEmbed.js");

const DICE_TYPES = [
    "D4", "D6", "D8", "D20",
    "fireD4", "fireD6", "fireD8",
    "+D4", "+D6", "+D8",
    "undeadD4", "undeadD6", "undeadD8",
    "iceD4", "iceD6", "iceD8",
    "goldD4", "goldD6",

    //Curency
    "euro", "peso"
];

const ITEMS_TYPES = [
    "doubleFire", 
    "endurance",
    "gemelos",
    "reflejo",
    "contador",
    "ultimo",
    "boxeador",
    "manodelmuerto"
];

const REROLL_COST = 3;

// Dice.js
class Dice {
    constructor(type, faces, purchasePrice, sellingPrice, element = null, effect = null) {
        this.type = type; // Ej: 'D6', 'D8', etc
        this.faces = faces; // Array de valores o funciones para cada cara
        this.purchasePrice = purchasePrice;
        this.sellingPrice = sellingPrice;
        this.element = element; // Ej: 'fire', 'water', null
        this.effect = effect
    }

    roll() {
        // Estrategia simple: número aleatorio dentro de faces
        const index = Math.floor(Math.random() * this.faces.length);
        const result = this.faces[index];

        // Si la cara es función (efecto), ejecutarla, si no, valor simple
        return result;
    }
}

// DiceFactory.js
class DiceFactory {
    static createDice(type) {
        switch (type) {
            case "D4":
                return new Dice("D4", [1, 2, 3, 4], 4, 1);
            case "D6":
                return new Dice("D6", [1, 2, 3, 4, 5, 6], 4, 1);
            case "D8":
                return new Dice("D8", [1, 2, 3, 4, 5, 6, 7, 8], 5, 2);
            case "D20":
                return new Dice("D20", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], 7, 3);
            case "fireD4":
                return new Dice(
                    "fireD4", 
                    [1, 2, 3, 4], 
                    10,
                    4,
                    "fire",
                    (acc) => Math.ceil(acc * 0.5)
                );
            case "fireD6":
                return new Dice(
                    "fireD6", 
                    [1, 2, 3, 4, 5, 6], 
                    11,
                    4,
                    "fire",
                    (acc) => Math.ceil(acc * 0.5)
                );
            case "fireD8":
                return new Dice(
                    "fireD8", 
                    [1, 2, 3, 4, 5, 6, 7, 8], 
                    12,
                    5,
                    "fire",
                    (acc) => Math.ceil(acc * 0.5)
                );
            case "+D4":
                return new Dice("+D4", [3, 4, 5, 6], 6, 2);
            case "+D6":
                return new Dice("+D6", [3, 4, 5, 6, 7, 8], 7, 3);
            case "+D8":
                return new Dice("+D8", [3, 4, 5, 6, 7, 8, 9, 10], 8, 3);
            case "undeadD4":
                return new Dice(
                    "undeadD4", 
                    [1, 2, 3, 4], 
                    6,
                    3,
                    "undead",
                    (playedDice) => (playedDice + 1) * 2
                );
            case "undeadD6":
                return new Dice(
                    "undeadD6", 
                    [1, 2, 3, 4, 5, 6], 
                    7,
                    3,
                    "undead",
                    (playedDice) => (playedDice + 1) * 2
                );
            case "undeadD8":
                return new Dice(
                    "undeadD8", 
                    [1, 2, 3, 4, 5, 6, 7, 8], 
                    7,
                    3,
                    "undead",
                    (playedDice) => (playedDice + 1) * 2
                );
            case "iceD4":
                return new Dice(
                    "iceD4", 
                    [6, 7, 8, 9], 
                    7,
                    2,
                    "ice",
                    function () {
                        this.faces = this.faces.map(face => Math.max(1, face - 1));
                    }
                );
            case "iceD6":
                return new Dice(
                    "iceD6", 
                    [6, 7, 8, 9, 10, 11], 
                    7,
                    2,
                    "ice",
                    function () {
                        this.faces = this.faces.map(face => Math.max(1, face - 1));
                    }
                );
            case "iceD8":
                return new Dice(
                    "iceD8", 
                    [6, 7, 8, 9, 10, 11, 12, 13], 
                    7,
                    2,
                    "ice",
                    function () {
                        this.faces = this.faces.map(face => Math.max(1, face - 1));
                    }
                );
            case "goldD4":
                return new Dice(
                    "goldD4", 
                    [1, 2, 3, 4], 
                    8,
                    3,
                    "gold",
                    (session, face) => {
                        if (Math.random() < 0.5) {
                            session.coins += face
                            return true
                        }
                        return false
                    }
                );
            case "goldD6":
                return new Dice(
                    "goldD6", 
                    [1, 2, 3, 4, 5, 6], 
                    8,
                    3,
                    "gold",
                    (session, face) => {
                        if (Math.random() < 0.5) {
                            session.coins += face
                            return true
                        }
                        return false
                    }
                );
            case "euro":
                return new Dice(
                    "euro", 
                    [true, false], 
                    11,
                    5,
                    "currency",
                    (total) => total * 2
                );
            case "peso":
                return new Dice(
                    "peso", 
                    [true, false], 
                    11,
                    5,
                    "currency"
                );
            // case "fireD6":
            //     return new Dice(
            //         "fireD6", 
            //         [
            //             {type: "effect", function: (acc) => Math.ceil(acc * 0.5), description: "🔥 Fuego: Mitad del total acumulado" },
            //         ], 
            //         "fire",
            //         (acc) => Math.ceil(acc * 0.5)
            //     );
            default:
                throw new Error("Tipo de dado no soportado");
        }
    }
}

// Item.js
class Item {
    constructor(name, type, effect) {
        this.name = name;
        this.type = type; // 'beforeRoll', 'inRoll', 'afterRoll'
        this.effect = effect; // función o clase que modifique dados o scores
    }

    async applyEffect (properties) {
        // properties = {session, dice, dieFace, total, diePoints, message}
        // Aplica efecto sobre la sesión de juego
        if (typeof this.effect === "function") {
            return await this.effect(properties);
        }
    }
}

// ItemFactory.js
class ItemFactory {
    static createItem(name) {
        switch (name) {
            //beforeRoll

            //afterRoll
            case "endurance":
                return new Item("Endurance Medal", "afterRoll", async ({ total, session, message }) => {
                    if (total > 15) {
                        session.roundTotalScore += 5;
                        await message.reply("🏅 Endurance Medal: +5 puntos por una ronda intensa.!");
                        return 0;
                    }
                    return 0;
                });

            //inRollFace
            case "hakael":
                return new Item("Hakael el gato", "inRollFace", async ({ message }) => {
                    if (Math.random() < 0.5) {

                        await message.reply(`😼🤡 hakael el gato payaso: ¡El gato anda jodiendo por ahi, no le prestes atencion!`);
                        return 0;
                    }
                    return 0;
                });
            case "reflejo":
                return new Item("Reflejo", "inRollFace", async ({ die, dieFace, total, session, diePoints, message, rollResult }) => {
                    //Probabiliad de 50% de que esa cara puntue dos veces
                    if (Math.random() < 0.5) {
                        const extra = dieFace;

                        await message.reply(`🔮 Reflejo: ¡La cara de tu dado puntúa dos veces! +${extra} puntos a la cara.!`);
                        return extra;
                    }
                    return 0;
                });
            case "corazon":
                return new Item("Corazon de acero", "inRollFace", async ({ session, message }) => {

                    if(!session.itemStacks.corazon) {
                        session.itemStacks.corazon = 1;
                    }
                    
                    const extra = session.itemStacks.corazon;
                    
                    await message.reply(`❤️‍🔥 Corazon de acero: ¡Sumas los puntos acumulados! +${extra} puntos a la cara.!`);
                    return extra;

                });

            //inRollPoints
            case "doubleFire":
                return new Item("Double Fire", "inRollPoints", async ({ die, total, message }) => {
                    if (die.element === "fire") {
                        const extra = Math.ceil(total * 0.5);
                        await message.reply(`🔥 Double Fire: ¡El fuego arde más fuerte! +${extra} puntos extra.!`);
                        return extra;
                    }
                    return 0;
                });

            case "gemelos":
                return new Item("Gemelos", "inRollPoints", async ({ die, dieFace, total, session, diePoints, message, rollResult }) => {
                    //si es multiplo de 2 mupltiplica por 2
                    if (rollResult % 2 === 0) {
                        const extra = diePoints * 0.5;
                        
                        await message.reply(`👯 Gemelos: ¡Multiplicaste el total del dado por 1.5! +${dieFace} puntos.!`);
                        return extra;
                    }
                    return 0;
                });

            case "contador":
                return new Item("Contador de la Mafia", "inRollPoints", async ({ die, dieFace, total, session, diePoints, message, rollResult }) => {
                    //Probabiliad de 50% de que esa cara puntue dos veces
                    const extra = die.faces.length * 0.5;

                    await message.reply(`🧾 Contador de la Mafia: ¡+0,5 punto por cada cara del dado! +${extra} puntos.!`);
                    return extra;
                });
            
            case "ultimo":
                return new Item("El ultimo promogenito", "inRollPoints", async ({ message, session, index, diePoints }) => {
                    if(session.diceInHand.length >= 2 && index === session.diceInHand.length - 1) {
                        const extra = diePoints
                        await message.reply(`👨‍👦 El ultimo heredero: ¡El ultimo dado se multiplica su total por 2! +${extra} puntos.!`);
                        return extra;
                    }
                    return 0;
                });

            //specials
            case "boxeador":
                return new Item("Boxeador italiano", "specials", async ({ message, session }) => {
                    const battle = session.currentBattle
                    battle.maxRounds += 1
                    await message.reply(`🥊 Boxeador italiano: ¡Te da una ronda mas al comienzo de cada batalla`);
                    return 0;
                });

            case "manodelmuerto":
                return new Item("La Mano del muerto", "specials", async ({ message, session }) => {
                    session.diceBag = session.diceBag.map(die => {
                        if(!die.element) {
                            die.type = "undead"+die.type
                            die.element = "undead"
                            die.effect = (playedDice) => (playedDice + 1) * 2
                            return die
                        }
                        return die
                    })
                    await message.reply(`🪬 La Mano del muerto: ¡Todos los dados sin elemento en la bolsa se convierten en undead!`);
                    return 0;
                });

            default:
                throw new Error("Item no soportado");
        }
    }
}

class Battle {
    constructor(id, targetScore, maxRounds) {
        this.id = id;
        this.targetScore = targetScore;
        this.maxRounds = maxRounds;
        this.currentRound = 0;
    }

    nextRound() {
        this.currentRound++;
    }

    isOver() {
        return this.currentRound >= this.maxRounds;
    }

    isVictory(score) {
        return score >= this.targetScore;
    }

    coinsWonPerRound() {
        return (this.maxRounds - this.currentRound) * 4
    }
}


// GameSession.js
class GameSession {
    constructor(userId) {
        this.userId = userId;
        this.diceBag = []; // Dados que tiene el jugador
        this.diceInHand = []; // Dados usados en la ronda
        this.dicePlayed = []; // Dados que ya se han jugado
        this.items = []; // Items que tiene el jugador
        this.itemStacks = {}; 
        this.score = 0;
        this.coins = 10;
        this.inflation = 0;
        this.currentShopInventory = [];
        this.status = "playing"; // 'playing', 'lost', 'won'
        this.limitDiceBag = 10;
        this.limitDiceRound = 3;

        this.roundTotalScore = 0;

        this.caricias = 0;
        this.itemsTypes = ITEMS_TYPES;

        this.currentBattleIndex = 0;
        this.battles = [
            new Battle(1, 40, 3),
            new Battle(2, 50, 3),
            new Battle(3, 60, 3),
            new Battle(4, 80, 3),
            new Battle(4, 100, 3),
            new Battle(4, 150, 3),
            new Battle(5, 200, 3),
            new Battle(5, 250, 3),
            new Battle(5, 300, 3),
            new Battle(5, 450, 3),
            new Battle(5, 600, 3),
            new Battle(5, 800, 3),
            new Battle(5, 1000, 3)
        ]
    }

    get currentBattle() {
        return this.battles[this.currentBattleIndex];
    }

    initGame() {
        this.diceBag = []; // Dados que tiene el jugador
        this.diceInHand = []; // Dados usados en la ronda
        this.dicePlayed = []; // Dados que ya se han jugado
        this.items = []; // Items que tiene el jugador
        this.itemStacks = {}; 
        this.score = 0;
        this.coins = 10;
        this.inflation = 0;
        this.currentShopInventory = [];
        this.status = "playing"; // 'playing', 'lost', 'won'
        this.limitDiceBag = 10;
        this.limitDiceRound = 3;

        this.roundTotalScore = 0;

        this.caricias = 0;
        this.itemsTypes = ITEMS_TYPES;

        this.currentBattleIndex = 0;
        this.battles = [
            new Battle(1, 40, 3),
            new Battle(2, 50, 3),
            new Battle(3, 60, 3),
            new Battle(4, 80, 3),
            new Battle(4, 100, 3),
            new Battle(4, 150, 3),
            new Battle(5, 200, 3),
            new Battle(5, 250, 3),
            new Battle(5, 300, 3),
            new Battle(5, 450, 3),
            new Battle(5, 600, 3),
            new Battle(5, 800, 3),
            new Battle(5, 1000, 3)
        ]

        this.addDiceFromBag(DiceFactory.createDice("D6"));
        this.addDiceFromBag(DiceFactory.createDice("D6"));
        this.addDiceFromBag(DiceFactory.createDice("D4"));

        // this.addItem(ItemFactory.createItem("hakael"));
    }

    async resetFirstRound(message) {
        this.diceBag.push(...this.dicePlayed);
        this.dicePlayed = [];
        this.diceBag.push(...this.diceInHand);
        this.diceInHand = [];
        this.score = 0;
        this.inflation = 0;
        this.currentShopInventory = [];

        const boxeador = this.items.find(item => item.name === "Boxeador italiano")
        if(boxeador) {
            await boxeador.applyEffect({message, session: this})
        }
    }

    startRound() {
        if(this.diceInHand.length > 0) {
            this.dicePlayed.push(...this.diceInHand);
            this.diceInHand = [];
        }
        
        if(this.diceInHand.length === 0 && this.diceBag.length === 0) {
            this.diceBag = this.dicePlayed;
            this.dicePlayed = [];
        }
    }

    async nextRound(message) {
        const battle = this.currentBattle;
        battle.nextRound();

        const corazon = this.items.find(item => item.name === "Corazon de acero")
        if(corazon) {
            this.itemStacks.corazon += 1;
            await message.reply("💔 ¡CLING! Explotaste un corazon, una carga mas para el ❤️‍🔥 Corazon de acero!");
        }

        if (battle.isOver()) {
            if (battle.isVictory(this.score)) {
                this.currentBattleIndex++;
                await this.resetFirstRound(message)

                const coinsWonPerRound = battle.coinsWonPerRound()
                const interest = Math.floor(coinsWonPerRound / 5);
                const totalCoins = coinsWonPerRound + interest;

                this.coins += totalCoins + 5;
                await message.reply(`🪙 ganaste ${coinsWonPerRound} por las rondas sobrantes + 5 de cortesía `)
                if (this.currentBattleIndex >= this.battles.length) {
                    // Puedes generar más batallas o quedarte en la última
                    await message.reply("🎉 ¡Superaste todas las batallas actuales!");
                } else {
                    await message.reply(`✅ Superaste la batalla ${battle.id}. Comienza la batalla ${this.currentBattle.id}!`);
                }
            } else {
                this.status = "lost";
                await message.reply("❌ Perdiste la batalla. No alcanzaste el puntaje requerido.");
            }
        }else if (battle.isVictory(this.score)) {
            this.currentBattleIndex++;
            await this.resetFirstRound(message)

            const coinsWonPerRound = battle.coinsWonPerRound()
            const interest = Math.floor(coinsWonPerRound / 5);
            const totalCoins = coinsWonPerRound + interest;

            this.coins += totalCoins + 5;
            await message.reply(`🪙 ganaste ${coinsWonPerRound} por las rondas sobrantes + ${interest} + 5 de cortesía `)

            if (this.currentBattleIndex >= this.battles.length) {
                // Puedes generar más batallas o quedarte en la última
                
                await message.reply("🎉 ¡Superaste todas las batallas actuales!");
            } else {
                await message.reply(`✅ Superaste la batalla ${battle.id}. Comienza la batalla ${this.currentBattle.id}!`);
            }
        }
    }

    addItem(item) {
        this.items.push(item);
    }

    addDiceFromBag(dice) {
        if (this.diceBag.length < this.limitDiceBag) {
            this.diceBag.push(dice);
        } else {
            throw new Error("Límite de dados en bolsillo alcanzado");
        }
    }

    removeDiceFromBag(diceIndex) {
        if (diceIndex < 0 || diceIndex >= this.diceBag.length) {
            throw new Error("Índice de dado no válido");
        }
        this.diceBag.splice(diceIndex, 1);
    }

    addDiceFromHand(dice) {
        if (this.diceInHand.length < this.limitDiceRound) {
            this.diceInHand.push(dice);
        } else {
            throw new Error("Límite de dados por ronda alcanzado");
        }
    }

    removeDiceFromHand(diceIndex) {
        if (diceIndex < 0 || diceIndex >= this.diceInHand.length) {
            throw new Error("Índice de dado no válido en mano");
        }
        this.diceInHand.splice(diceIndex, 1);
    }

    async applyCombinationsBeforeRolls(dice, message) {
        let bonus = 0;

        // 🎯 Regla : Si dos dados son del mismo tipo → +3 puntos
        const typeCounts = {};
        for (const dice of this.diceInHand) {
            typeCounts[dice.type] = (typeCounts[dice.type] || 0) + 1;
        }
        if (Object.values(typeCounts).some(count => count >= 2)) {
            bonus += 3;
            await message.reply(`🎯 Bonus: 2 dados del mismo tipo → +3 puntos`);
        }

        // 🔥 Regla: Por cada dado con elemento fuego → +1 punto
        const fireCount = this.diceInHand.filter(( dice ) => dice.element === "fire").length;
        if (fireCount > 0) {
            bonus += fireCount;
            await message.reply(`🔥 Bonus: ${fireCount} dado(s) de fuego → +${fireCount} punto(s)`);
        }

        // 🪙 Regla: Por cada dado con elemento oro → +1 punto por cada moneda
        const goldCount = this.diceInHand.filter(( dice ) => dice.element === "gold").length;
        if (goldCount > 0) {
            bonus += goldCount * this.coins;
            await message.reply(`🪙 Bonus: ${goldCount} dado(s) de oro → +${goldCount * this.coins} punto(s). 1 punto por cada moneda por cada dado`);
        }

        // 👻 Regla: Por cada dado con elemento undead → +2 punto por cada dado en el cementerio
        const undeadCount = this.diceInHand.filter(( dice ) => dice.element === "undead").length;
        if (undeadCount > 0) {
            bonus += undeadCount * (this.dicePlayed.length || 0);
            await message.reply(`👻 Bonus: ${undeadCount} dado(s) undead → +${undeadCount * (this.dicePlayed.length || 0)} punto(s). 1 punto por cada dado en cementerio por cada dado`);
        }

        // 🧊 Regla: Por cada dado con elemento ice → +2 punto por cada dado
        const iceCount = this.diceInHand.filter(( dice ) => dice.element === "ice").length;
        if (iceCount > 0) {
            bonus += iceCount * 2;
            await message.reply(`🧊 Bonus: ${iceCount} dado(s) de hielo → +${iceCount * 2} punto(s). 1 punto por cada dado de hielo`);
        }

        this.roundTotalScore += bonus;
    }

    async applyCombinationsAfterRolls(results, message) {
        let bonus = 0;

        // 🧮 Regla: Solo un dado lanzado → multiplicar por 1.5
        if (results.length === 1) {
            const extra = Math.ceil(this.roundTotalScore * 0.5);
            bonus += extra;
            await message.reply(`🧮 Bonus: Al lanzar solo 1 dado, se aplica x1.5 → +${extra} puntos`);
        }

        let appliedBonus = false;

        // Si lanzaste 3 dados y el resultado de los 3 fue igual → x2
        if (results.length === 3 && results.every(result => result.rollResult === results[0].rollResult)) {
            const extra = (this.roundTotalScore + bonus) * 2; 
            bonus += extra;
            await message.reply(`🎲 Bonus: Los 3 dados sacaron ${results[0].rollResult}, se multiplica el total por 2 y se suma → +${extra} puntos`);
            appliedBonus = true;
        }

        // Si lanzaste 2 o más y dos sacaron la misma cara (pero no todos) → x1.5
        if (!appliedBonus && results.length >= 2) {
            const faceCounts = {};
            results.forEach(result => {
                faceCounts[result.rollResult] = (faceCounts[result.rollResult] || 0) + 1;
            });

            const hasPair = Object.values(faceCounts).some(count => count === 2);
            if (hasPair) {
                const extra = Math.ceil((this.roundTotalScore + bonus) * 0.5);
                bonus += extra;
                await message.reply(`🧮 Bonus: Dos dados sacaron la misma cara, se aplica x1.5 → +${extra} puntos`);
            }
        }

        return bonus;
    }

    async rollDice(message) {
        if(this.status === "lost") return message.reply("❌ Ya pardiste esta partida. Escribe \`!initgame \` para empezar otra")

        let results = []; 

        await this.applyCombinationsBeforeRolls(this.diceInHand, message)

        this.items
            .filter(item => item.type === "beforeRoll")
            .forEach(item => item.applyEffect({ session: this, message }));

        let index = 0;
        let loopCount = 0;

        while (index < this.diceInHand.length) {
            const die = this.diceInHand[index];

            if(loopCount === 4 || index >= this.diceInHand.length) break

            if(die.element !== "currency") {
                const rollResult = die.roll();
                await message.reply(`🎲 Tiraste el dado ${die.type} y cayo: ${rollResult}`);
                let dicePoints = 0;
                let dieFace = rollResult

                for (const item of this.items.filter(item => item.type === "inRollFace")) {
                    const itemResult = await item.applyEffect({
                        session: this,
                        die,
                        dieFace,
                        total: this.roundTotalScore,
                        diePoints: dicePoints,
                        message,
                        rollResult,
                    });

                    if (itemResult) {
                        dieFace += itemResult;
                    }
                }


                if(die.element === "fire") {
                    dicePoints += dieFace;
                    this.roundTotalScore += dieFace;

                    const effectResult = die.effect(this.roundTotalScore)

                    this.roundTotalScore += effectResult;
                    dicePoints += effectResult;
                    await message.reply(`+ 🔥 Fuego: Mitad del total de la ronda: ${effectResult}`);
                } else if (die.element === "undead") {
                    dicePoints += dieFace;
                    this.roundTotalScore += dieFace;

                    const effectResult = die.effect(this.dicePlayed.length)
                    this.roundTotalScore += effectResult;
                    dicePoints += effectResult;
                    await message.reply(`+ 👻 No Muerto: Multiplica por 2 la cantidad de dados jugados + 1: ${this.dicePlayed.length} + 1 * 2 = ${effectResult}`);
                } else if (die.element === "ice") {
                    dicePoints += dieFace;
                    this.roundTotalScore += dieFace;

                    die.effect()

                    await message.reply(`+ 🧊 Dado de hielo: Se empeiza a derretir, -1 punto en cada cara del dado`);
                } else if (die.element === "gold") {
                    dicePoints += dieFace;
                    this.roundTotalScore += dieFace;

                    const luck = die.effect(this, dieFace)

                    if(luck) {
                        await message.reply(`🪙 Dado de oro: La cara del dado se convierte en oro! +${dieFace} monedas`);
                    }

                } else if (dieFace && typeof dieFace === "object" && typeof dieFace.function === "function") {
                    dicePoints += dieFace.function(this.roundTotalScore);
                    this.roundTotalScore += dicePoints;
                    await message.reply(`El Dado ${die.type} obtuvo un total de cara de: ${dicePoints} (${dieFace.description})`);
                } else {
                    dicePoints += dieFace;
                    this.roundTotalScore += dicePoints;
                }

                for (const item of this.items.filter(item => item.type === "inRollPoints")) {
                    const itemResult = await item.applyEffect({ session: this, die, dieFace, total: this.roundTotalScore, diePoints: dicePoints, message, rollResult, index });

                    if (itemResult) {
                        this.roundTotalScore += itemResult;
                        dicePoints += itemResult;
                    }
                }

                results.push({ die, points: dicePoints, rollResult });

            } else {
                const currency = die;
                const tossResult = currency.roll();
                await message.reply(`🪙 Tiraste la moneda ${currency.type} y cayo: ${tossResult ? "Cara, Que Suerte🍀!" : "Sello, Mala suerte sorry 😕"}`);

                if(!tossResult) {
                    index++;
                    continue
                }

                if(currency.type === "euro") {
                    const effectResult = currency.effect(this.roundTotalScore)
                    this.roundTotalScore += effectResult;
                    await message.reply(`💶🇪🇺 +${effectResult} puntos! El total de la ronda * 3`)
                }

                if(currency.type === "peso") {
                    await message.reply(`🇨🇴🪙 Vuelves a lanzar los dados!!!`)
                    index = 0;
                    loopCount++;
                    results = [];
                    continue;
                }

            }

            index++;
        }

        const bonus = await this.applyCombinationsAfterRolls(results, message, this.roundTotalScore);

        this.roundTotalScore += bonus;

        for (const item of this.items.filter(item => item.type === "afterRoll")) {
            await item.applyEffect({ session: this, total: this.roundTotalScore, message })
        }

        this.score += this.roundTotalScore;

        const extraFields = [
            { name: "🔥 Total lanzado esta ronda", value: `${this.roundTotalScore}`, inline: false }
        ];

        await this.nextRound(message);
        this.startRound()

        const embed = buildGameEmbed(this, message.author.username, extraFields);
        await message.reply({ embeds: [embed] });
        this.roundTotalScore = 0;
    }

    currentStatus() {
        return {
            ronda: this.playedRounds,
            score: this.score,
            status: this.status,
        };
    }

    getDiceWhitIndexIntText() {
        return this.diceBag.map((dice, index) => {
            const elementText = dice.element ? ` (Elemento: ${dice.element})` : "";

            return `#${index} - Tipo: ${dice.type}, Caras: ${dice.faces.join(", ")}${elementText}`;

        }).join("\n");
    }

    getDiceInHandText() {
        return this.diceInHand.map((dice, index) => {
            const elementText = dice.element ? ` (Elemento: ${dice.element})` : "";

            return `#${index} - Tipo: ${dice.type}, Caras: ${dice.faces.join(",")}${elementText}`;
        }).join("\n");
    }

    getDicePlayedText() {
        return this.dicePlayed.map((dice) => {
            const elementText = dice.element ? ` (Elemento: ${dice.element})` : "";

            return `#Tipo: ${dice.type}, Caras: ${dice.faces.join(",")}${elementText}`;
        }).join("\n");
    }

    getDiceDescription(dice) {
        return `
            **Tipo:** ${dice.type}
            **Caras:** ${dice.faces.join(", ")}
            ${dice.element ? `**Elementos:** ${dice.element}` : ""}
        `.trim();
    }

    async acariciar(session, message) {
        session.caricias += 1
        if(session.caricias === 1) {
            session.coins += 10;
            return message.reply("Hakael te devuelve el favor y deja caer 10 monedas para ti, que Puta")
        }
        await message.reply("Hakael te mira con cariño, le gustan mucho las caricias")
    }
}

class Shop {
    constructor() {
        if (Shop.instance) return Shop.instance;

        Shop.instance = this;
    }

    showShop(session, message) {
        // Generar 3 dados aleatorios
        const battle = session.currentBattle;
        if(battle.currentRound !== 0 ) throw new Error("❌ Solo puedes usar el comando `!shop` cuando estas en la ronda 0");

        const haveShopInventory = session.currentShopInventory && session.currentShopInventory.length > 0;
        
        const randomDiceTypes = DICE_TYPES.sort(() => Math.random() - 0.5).slice(0, 3);
        const randomItemsType = session.itemsTypes.sort(() => Math.random() - 0.5).slice(0, 3);

        const dice = haveShopInventory
            ? session.currentShopInventory.filter(x => x.kind === "die")
            : randomDiceTypes.map(type => ({
                kind: "die",
                data: DiceFactory.createDice(type),
            }));

        const items = haveShopInventory
            ? session.currentShopInventory.filter(x => x.kind === "item")
            : randomItemsType.map(type => ({
                kind: "item",
                data: {
                    type: type,
                    price: 10,
                }
            }))

        // Guardar esta "oferta" temporal en la sesión del jugador
        if(!haveShopInventory) {
            session.currentShopInventory = [...dice, ...items];
        }

        // Formatear el texto
        const textoTienda = [
            `🛒 **¡Bienvenido a la Tienda de Dados e Items!**`,
            `Tienes 🪙 ${session.coins} monedas.`,
            ``,
            ...dice.map((entry, index) => {
                const die = entry.data;
                const elementText = die.element ? ` | Elemento: ${die.element}` : "";
                return `**#${index}** - 🎲 ${die.type} (Caras: ${die.faces.join(", ")})${elementText} | 💰 ${die.purchasePrice} monedas`;
            }),
            ``,
            ...items.map((entry, index) => {
                const item = entry.data;
                return `**#${index + dice.length}** - 🧩 Ítem: ${item.type} | 💰 ${item.price} monedas`
            }),
            ``,
            `Escribe \`!buy <número>\` para comprar uno.`,
            `Escribe \`!reroll\` para hacer reroll de la tienda. Coste actual mas inflacion: ${REROLL_COST + session.inflation}`,
            `Escribe \`!acariciar\` para darle cariño a la mascota de la tienda Hakael el gato 🐈`,
        ].join("\n");

        return message.reply(textoTienda);
    }

    async buy(session, index, message) {
        const battle = session.currentBattle;
        if(battle.currentRound !== 0 ) throw new Error("❌ Solo puedes usar el comando `!shop` cuando estas en la ronda 0");

        const shop = session.currentShopInventory;
        if (!shop || !Array.isArray(shop) || shop.length === 0) {
            throw new Error("❌ No hay tienda activa. Usa `!shop` para ver opciones.");
        }

        if (                
            isNaN(index) ||
            index < 0 ||
            index >= session.currentShopInventory.length
        ) throw new Error("❌ Índice de dado no válido.");

        const entry = session.currentShopInventory[index];

        if (entry.kind === "die") {
            const die = entry.data;
            if (session.coins < die.purchasePrice) throw new Error("❌ No tienes suficientes monedas.");
            if (session.diceBag.length >= session.limitDiceBag) throw new Error("❌ Límite de dados en el bolsillo alcanzado.");
            
            session.coins -= die.purchasePrice;
            session.addDiceFromBag(die);
            session.currentShopInventory.splice(index, 1);

            const manodelmuerto = session.items.find(item => item.name === "La Mano del muerto")
            if(manodelmuerto) {
                await manodelmuerto.applyEffect({message, session})
            }

            return `✅ Compraste el dado ${die.type} por ${die.purchasePrice} monedas.`;
        }

        if (entry.kind === "item") {
            const item = entry.data;
            if (session.coins < item.price) throw new Error("❌ No tienes suficientes monedas.");

            session.itemsTypes = session.itemsTypes.filter(x => x !== item.type)

            session.coins -= item.price;
            const createdItem = ItemFactory.createItem(item.type)
            session.addItem(createdItem);
            session.currentShopInventory.splice(index, 1);

            if(item.type === "boxeador") {
                await createdItem.applyEffect({message, session})
            }

            if(item.type === "manodelmuerto") {
                await createdItem.applyEffect({message, session})
            }

            return `✅ Compraste el ítem ${item.type} por ${item.price} monedas.`;
        }

    }

    reroll(session, message) {
        const battle = session.currentBattle;
        if(battle.currentRound !== 0 ) throw new Error("❌ Solo puedes usar el comando `!shop` cuando estas en la ronda 0");

        const shop = session.currentShopInventory;
        if (!shop || !Array.isArray(shop) || shop.length === 0) {
            throw new Error("❌ No hay tienda activa. Usa `!shop` para ver opciones.");
        }

        const costInflation = REROLL_COST + session.inflation

        if(session.coins < costInflation) throw new Error(`❌ No tiene monedas suficiente. el reroll cuesta ${REROLL_COST} + inflacion: ${session.inflation}`);
        session.coins -= costInflation;

        const randomDiceTypes = DICE_TYPES.sort(() => Math.random() - 0.5).slice(0, 3);
        const randomItemsType = session.itemsTypes.sort(() => Math.random() - 0.5).slice(0, 3);

        const dice = randomDiceTypes.map(type => ({
            kind: "die",
            data: DiceFactory.createDice(type),
        }));
        const items = randomItemsType.map(type => ({
            kind: "item",
            data: {
                type: type,
                price: 10,
            }
        }))

        session.currentShopInventory = [...dice, ...items];

        // Formatear el texto
        const textoTienda = [
            `🛒 **¡Nuevo stock en la Tienda!**`,
            `Tienes 🪙 ${session.coins} monedas.`,
            ``,
            ...dice.map((entry, index) => {
                const die = entry.data;
                const elementText = die.element ? ` | Elemento: ${die.element}` : "";
                return `**#${index}** - 🎲 ${die.type} (Caras: ${die.faces.join(", ")})${elementText} | 💰 ${die.purchasePrice} monedas`;
            }),
            ``,
            ...items.map((entry, index) => {
                const item = entry.data;
                return `**#${index + dice.length}** - 🧩 Ítem: ${item.type} | 💰 ${item.price} monedas`
            }),
            ``,
            `Escribe \`!buy <número>\` para comprar uno.`,
            `Escribe \`!reroll\` para hacer reroll de la tienda. Coste actual más inflación: ${REROLL_COST + session.inflation}`,
            `Escribe \`!acariciar\` para darle cariño a la mascota de la tienda Hakael el gato 🐈`,
        ].join("\n");
        session.inflation += 1;
        return message.reply(textoTienda);
    }
}

// Store.js (singleton)
class Store {
    constructor() {
        if (Store.instance) return Store.instance;
        this.sessions = new Map();
        Store.instance = this;
    }

    getSession(userId) {
        if (!this.sessions.has(userId)) {
            this.sessions.set(userId, new GameSession(userId));
        }
        return this.sessions.get(userId);
    }
}

module.exports = {
    Dice,
    DiceFactory,
    Item,
    ItemFactory,
    GameSession,
    Shop,
    Store
}