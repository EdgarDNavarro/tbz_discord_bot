// Dice.js
class Dice {
    constructor(type, faces, element = null) {
        this.type = type; // Ej: 'D6', 'D8', etc
        this.faces = faces; // Array de valores o funciones para cada cara
        this.element = element; // Ej: 'fire', 'water', null
    }

    roll() {
        // Estrategia simple: número aleatorio dentro de faces
        const index = Math.floor(Math.random() * this.faces.length);
        const result = this.faces[index];

        // Si la cara es función (efecto), ejecutarla, si no, valor simple
        return typeof result === "function" ? result() : result;
    }
}

// DiceFactory.js
class DiceFactory {
    static createDice(type) {
        switch (type) {
            case "D4":
                return new Dice("D4", [1, 2, 3, 4]);
            case "D6":
                return new Dice("D6", [1, 2, 3, 4, 5, 6]);
            case "D8":
                return new Dice("D8", [1, 2, 3, 4, 5, 6, 7, 8]);
            case "D12":
                return new Dice("D12", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
            case "D20":
                return new Dice("D20", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
            case "fireD6":
                return new Dice(
                    "fireD6", [1, 2, 3, 4, 5, 6], "fire"
                );
            default:
                throw new Error("Tipo de dado no soportado");
        }
    }
}

// Item.js
class Item {
    constructor(name, type, effect) {
        this.name = name;
        this.type = type; // 'consumible', 'pasivo', 'activo'
        this.effect = effect; // función o clase que modifique dados o scores
    }

    applyEffect(gameSession) {
        // Aplica efecto sobre la sesión de juego
        if (typeof this.effect === "function") {
            this.effect(gameSession);
        }
    }
}

// ItemFactory.js
class ItemFactory {
    static createItem(name) {
        switch (name) {

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
        this.currentRound = 1;
        this.status = "playing"; // 'playing', 'lost', 'won'
        this.limitDiceBag = 10;
        this.limitDiceRound = 3;
        this.limitRounds = 3;
        this.targetScore = 20;
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

    rollDice() {
        let total = 0;
        this.diceInHand.forEach((dice) => {
            total += dice.roll();
        });
        this.score += total;

        // Aplicar efectos de items
        this.items.forEach((item) => item.applyEffect(this));

        return total;
    }

    nextRound() {
        this.currentRound++;
        if (this.currentRound > this.limitRounds) {
            this.status =
                this.score >= this.targetScore ? "won" : "lost";
        }
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

        this.shopInventory = [];
        this.coins = 0;

        Shop.instance = this;
    }

    agregarItem(item) {
        this.shopInventory.push(item);
    }

    comprarItem(userSession, itemName) {
        // Lógica de compra: verificar coins, agregar a usuario
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