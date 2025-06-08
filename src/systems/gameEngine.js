const DICE_TYPES = ["D4", "D6", "D8", "fireD4", "fireD6", "D4+", "D6+", "undeadD6"];

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
            case "fireD4":
                return new Dice(
                    "fireD4", 
                    [1, 2, 3, 4], 
                    7,
                    3,
                    "fire",
                    (acc) => Math.ceil(acc * 0.5)
                );
            case "fireD6":
                return new Dice(
                    "fireD6", 
                    [1, 2, 3, 4, 5, 6], 
                    7,
                    3,
                    "fire",
                    (acc) => Math.ceil(acc * 0.5)
                );
            case "D4+":
                return new Dice("D4+", [3, 4, 5, 6], 6, 2);
            case "D6+":
                return new Dice("D6+", [3, 4, 5, 6, 7, 8], 8, 3);
            case "undeadD6":
                return new Dice(
                    "undeadD6", 
                    [1, 2, 3, 4, 5, 6], 
                    7,
                    3,
                    "undead",
                    (playedDice) => playedDice * 2
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

    applyEffect(properties) {
        // properties = {session, dice, dieFace, total, diePoints, message}
        // Aplica efecto sobre la sesión de juego
        if (typeof this.effect === "function") {
            this.effect(properties);
        }
    }
}

// ItemFactory.js
class ItemFactory {
    static createItem(name) {
        switch (name) {
            // case "doubleFire":
            //     return new Item("Double Fire", "inRoll", ({ dice, dieFace, total, session, message }) => {
            //         if (dice.element === "fire") {
            //             const extra = Math.ceil(total * 0.5);
            //             session.score += extra;
            //             message.reply(`🔥 Double Fire: ¡El fuego arde más fuerte! +${extra} puntos extra.`);
            //         }
            //     });

            case "endurance":
                return new Item("Endurance Medal", "afterRoll", ({ total, session, message }) => {
                    if (total > 15) {
                        session.score += 2;
                        message.reply("🏅 Endurance Medal: +2 puntos por una ronda intensa.");
                    }
                });

            case "gemelos":
                return new Item("Gemelos", "inRoll", ({ dice, dieFace, total, session, diePoints, message }) => {
                    //si es multiplo de 2 mupltiplica por 2
                    if (dieFace % 2 === 0) {
                        const extra = dieFace * 2;
                        
                        message.reply(`👯 Gemelos: ¡Multiplicaste por 2! +${dieFace} puntos.`);
                        return extra;
                    }
                });

            case "reflejo":
                return new Item("Reflejo", "inRoll", ({ dice, dieFace, total, session, diePoints, message }) => {
                    //Probabiliad de 50% de que esa cara puntue dos veces
                    if (Math.random() < 0.5) {
                        const extra = diePoints;

                        message.reply(`🔮 Reflejo: ¡Tu dado puntúa dos veces! +${diePoints} puntos.`);
                        return extra;
                    }
                });

            default:
                throw new Error("Item no soportado");
        }
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
        this.score = 0;
        this.coins = 5;
        this.currentShopInventory = [];
        this.currentRound = 1;
        this.status = "playing"; // 'playing', 'lost', 'won'
        this.limitDiceBag = 10;
        this.limitDiceRound = 3;
        this.limitRounds = 3;
        this.targetScore = 20;
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

    nextRound() {
        this.currentRound++;
        if (this.currentRound > this.limitRounds) {
            this.status =
                this.score >= this.targetScore ? "won" : "lost";
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

        return bonus;
    }

    async applyCombinationsAfterRolls(results, message, total) {
        let bonus = 0;

        // 🧮 Regla: Solo un dado lanzado → multiplicar por 1.5
        if (results.length === 1) {
            const extra = Math.ceil(total * 0.5);
            bonus += extra;
            await message.reply(`🧮 Bonus: Al lanzar solo 1 dado, se aplica x1.5 → +${extra} puntos`);
        }

        // Si lanzaste 2 o mas y dos de ellos sacaron la misma caras (pero no 3 sacaron las mismas caras) multiplicas por 1.5
        if (results.length >= 2) {
            const faceCounts = {};
            results.forEach(result => {
                faceCounts[result.points] = (faceCounts[result.points] || 0) + 1;
            });

            const pairs = Object.values(faceCounts).filter(count => count >= 2);
            if (pairs.length > 0 && pairs.length < 3) {
                const extra = Math.ceil((total + bonus) * 0.5);
                bonus += extra;
                await message.reply(`🧮 Bonus: Dos Dados sacaron la misma cara, se aplica x1.5 → +${extra} extras puntos`);
            }
        }

        // Si lanzaste 3 dados y el resultado de las 3 fue igual multiplica por 3
        if (results.length === 3 && results.every(result => result.points === results[0].points)) {
            const extra = (total + bonus) * 2; 
            bonus += extra;
            await message.reply(`🎲 Bonus: Los 3 dados sacaron ${results[0].points}, se multiplica el total por 2 y se suma → +${extra} extras puntos`);
        }

        return bonus;
    }


    async rollDice(message) {
        let total = 0;
        let dicePoints = 0;
        const results = []; 

        const preBonus = await this.applyCombinationsBeforeRolls(this.diceInHand, message)
        total += preBonus;

            // 🎯 BEFORE ROLL ITEMS
        this.items
            .filter(item => item.type === "beforeRoll")
            .forEach(item => item.applyEffect({ session: this, message }));

        for (const dice of this.diceInHand) {
            dicePoints = 0
            const diceFace = dice.roll(total);

            if(dice.element === "fire") {
                dicePoints += diceFace;
                total += diceFace;

                const effectResult = dice.effect(total)

                total += effectResult;
                dicePoints += effectResult;
                await message.reply(`Tiraste el dado ${dice.type} y obtuviste: ${diceFace} + 🔥 Fuego: Mitad del total de la ronda: ${effectResult}, Total: ${dicePoints}`);
            } else if (dice.element === "undead") {
                dicePoints += diceFace;
                total += diceFace;

                const effectResult = dice.effect(this.dicePlayed.length)
                total += effectResult;
                dicePoints += effectResult;
                await message.reply(`Tiraste el dado ${dice.type} y obtuviste: ${diceFace} + 👻 No Muerto: Multiplica por 2 la cantidad de dados jugados: ${this.dicePlayed.length} + 2 = ${effectResult}, Total: ${dicePoints}`);
            } else if (typeof diceFace === "object" && diceFace.function) {
                dicePoints += diceFace.function(total);
                total += dicePoints;
                await message.reply(`Tiraste el dado ${dice.type} y obtuviste: ${dicePoints} (${diceFace.description})`);
            } else {
                dicePoints += diceFace;
                total += dicePoints;
                await message.reply(`Tiraste el dado ${dice.type} y obtuviste: ${dicePoints}`);
            }

            this.items
                .filter(item => item.type === "inRoll")
                .forEach(item => {
                    const itemResult = item.applyEffect({ session: this, dice, dieFace: diceFace, total, diePoints: dicePoints, message });
                    if (itemResult) {
                        total += itemResult;
                    }
                });

            results.push({ dice, points: dicePoints });
        }

        // Aplicar efectos de combinación
        const bonus = await this.applyCombinationsAfterRolls(results, message, total);

        total += bonus;

        this.items
            .filter(item => item.type === "afterRoll")
            .forEach(item => item.applyEffect({ session: this, total, message }));

        this.score += total;

        return total;
    }

    currentStatus() {
        return {
            ronda: this.currentRound,
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
}

class Shop {
    constructor() {
        if (Shop.instance) return Shop.instance;

        Shop.instance = this;
    }

    showShop(session, message) {
        // Generar 3 dados aleatorios
        const haveShopInventory = session.currentShopInventory && session.currentShopInventory.length > 0;
        
        const randomDiceTypes = DICE_TYPES.sort(() => Math.random() - 0.5).slice(0, 3);
        const dice = haveShopInventory ? session.currentShopInventory : randomDiceTypes.map(type => DiceFactory.createDice(type));

        // Guardar esta "oferta" temporal en la sesión del jugador
        if(!haveShopInventory) {
            session.currentShopInventory = dice;
        }

        // Formatear el texto
        const textoTienda = [
            `🛒 **¡Bienvenido a la Tienda de Dados!**`,
            `Tienes 🪙 ${session.coins} monedas.`,
            ``,
            ...dice.map((die, index) => {
                const elementText = die.element ? ` | Elemento: ${die.element}` : "";
                return `**#${index}** - ${die.type} (Caras: ${die.faces.join(", ")})${elementText} | 💰 ${die.purchasePrice} monedas`;
            }),
            ``,
            `Escribe \`!buy <número>\` para comprar uno.`
        ].join("\n");

        return message.reply(textoTienda);
    }

    buy(session, index) {
        const shop = session.currentShopInventory;
        if (!shop || !Array.isArray(shop) || shop.length === 0) {
            throw new Error("❌ No hay tienda activa. Usa `!shop` para ver opciones.");
        }

        if (                
            isNaN(index) ||
            index < 0 ||
            index >= session.currentShopInventory.length
        ) throw new Error("❌ Índice de dado no válido.");

        const die = session.currentShopInventory[index];

        if (session.coins < die.purchasePrice) throw new Error("❌ No tienes suficientes monedas.");
        if (session.diceBag.length >= session.limitDiceBag) throw new Error("❌ Límite de dados en el bolsillo alcanzado.");

        

        // Efectuar la compra
        session.coins -= die.purchasePrice;
        session.addDiceFromBag(die);
        session.currentShopInventory.splice(index, 1);

        return `✅ Compraste el dado ${die.type} por ${die.purchasePrice} monedas.`;
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