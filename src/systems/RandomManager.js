import seedrandom from 'seedrandom';

class RandomManager {
    constructor(seed = null) {
        this.setSeed(seed || Date.now().toString());
    }

    setSeed(seed) {
        this.seed = seed;
        this.rng = seedrandom(seed);
    }

    getRandom() {
        return this.rng(); // entre 0 y 1
    }

    getInt(min, max) {
        return Math.floor(this.getRandom() * (max - min + 1)) + min;
    }

    pickOne(array) {
        return array[this.getInt(0, array.length - 1)];
    }

    chance(probability) {
        return this.getRandom() < probability;
    }

    shuffle(array) {
        const copy = array.slice();
        for (let i = copy.length - 1; i > 0; i--) {
            const j = this.getInt(0, i);
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }
}

export default RandomManager