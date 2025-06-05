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
        this.effect = effect; // función o clase que modifique dados o puntajes
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
            case "FireCharm":
                return new Item("FireCharm", "pasivo", (session) => {
                    // Modifica dados de fuego para sumar +1 en tiradas
                    session.bolsoDados.forEach((dado) => {
                        if (dado.element === "fire") {
                            dado.roll = () => {
                                const base =
                                    Math.floor(
                                        Math.random() * dado.faces.length
                                    ) + 1;
                                return base + 1;
                            };
                        }
                    });
                });
            case "ExtraDice":
                return new Item("ExtraDice", "activo", (session) => {
                    // Agrega un dado extra a la ronda actual
                    const nuevoDado = DiceFactory.createDice("D6");
                    session.dadosMano.push(nuevoDado);
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
        this.bolsoDados = []; // Dados que tiene el jugador
        this.dadosMano = []; // Dados usados en la ronda
        this.items = []; // Items que tiene el jugador
        this.puntaje = 0;
        this.monedas = 5;
        this.rondaActual = 1;
        this.estado = "jugando"; // 'jugando', 'perdido', 'ganado'
        this.limiteDadosBolsillo = 10;
        this.limiteDadosRonda = 3;
        this.limiteRondas = 3;
        this.puntajeObjetivo = 0;
    }

    addDice(dado) {
        if (this.bolsoDados.length < this.limiteDadosBolsillo) {
            this.bolsoDados.push(dado);
        } else {
            throw new Error("Límite de dados en bolsillo alcanzado");
        }
    }

    startRound() {
        this.dadosMano = [];
    }

    addDiceToHand(dado) {
        if (this.dadosMano.length < this.limiteDadosRonda) {
            this.dadosMano.push(dado);
        } else {
            throw new Error("Límite de dados por ronda alcanzado");
        }
    }

    rollDice() {
        let total = 0;
        this.dadosMano.forEach((dado) => {
            total += dado.roll();
        });
        this.puntaje += total;

        // Aplicar efectos de items
        this.items.forEach((item) => item.applyEffect(this));

        return total;
    }

    nextRound() {
        this.rondaActual++;
        if (this.rondaActual > this.limiteRondas) {
            this.estado =
                this.puntaje >= this.puntajeObjetivo ? "ganado" : "perdido";
        }
    }

    currentStatus() {
        return {
            ronda: this.rondaActual,
            puntaje: this.puntaje,
            estado: this.estado,
        };
    }
}

class Shop {
    constructor() {
        if (Shop.instance) return Shop.instance;

        this.inventario = [];
        this.monedas = 0;

        Shop.instance = this;
    }

    agregarItem(item) {
        this.inventario.push(item);
    }

    comprarItem(userSession, itemName) {
        // Lógica de compra: verificar monedas, agregar a usuario
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

// Uso básico:
// const store = new Store();
// const session = store.getSession("user123");
// const dado1 = DiceFactory.createDice("D6");
// session.agregarDado(dado1);
// session.iniciarRonda();
// session.agregarDadoAMano(dado1);
// console.log("Tirada:", session.tirarDados());
// console.log(session.estadoActual());

module.exports = {
    Dice,
    DiceFactory,
    Item,
    ItemFactory,
    GameSession,
    Shop,
    Store
}