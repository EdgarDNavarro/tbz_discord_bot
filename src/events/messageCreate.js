const ia = require('../commands/ia');
const join = require('../commands/join');
const query = require('../commands/query');
const stop = require('../commands/stop');
const playlist = require('../commands/playlist');
const playmix = require('../commands/playmix');
const ytdown = require('../commands/ytdown');
const ytselect = require('../commands/ytselect');

//Game
const initgame = require('../commands/game/initgame');
const infogame = require('../commands/game/infogame');
const addDiceToHand = require('../commands/game/addDiceToHand');
const rmvdice = require('../commands/game/rmvdice');
const rolldice = require('../commands/game/rolldice');
const shop = require('../commands/game/shop');
const buy = require('../commands/game/buy');
const reroll = require('../commands/game/reroll');
const acariciar = require('../commands/game/acariciar');
const upgrade = require('../commands/game/upgrade');
const sell = require('../commands/game/sell');

const tbzhelp = require('../commands/tbzhelp');

async function handleMessageCreate(client, message) {
    if (message.author.bot) return;

    if (message.content.startsWith('!ia')) return ia.run(message);
    if (message.content.startsWith('!join')) return join.run(message);
    if (message.content.startsWith('!query')) return query.run(message);
    if (message.content.startsWith('!stop')) return stop.run(message);
    if (message.content.startsWith('!playlist')) return playlist.run(message);
    if (message.content.startsWith('!playmix')) return playmix.run(message);
    if (message.content.startsWith('!ytdown')) return ytdown.run(message);
    if (message.content.startsWith('!ytselect')) return ytselect.run(message);

    if (message.content.startsWith('!initgame')) return initgame.run(message);
    if (message.content.startsWith('!infogame')) return infogame.run(message);
    if (message.content.startsWith('!addd')) return addDiceToHand.run(message);
    if (message.content.startsWith('!rmvdice')) return rmvdice.run(message);
    if (message.content.startsWith('!rolldice')) return rolldice.run(message);
    if (message.content.startsWith('!shop')) return shop.run(message);
    if (message.content.startsWith('!buy')) return buy.run(message);
    if (message.content.startsWith('!reroll')) return reroll.run(message);
    if (message.content.startsWith('!acariciar')) return acariciar.run(message);
    if (message.content.startsWith('!upgrade')) return upgrade.run(message);
    if (message.content.startsWith('!sell')) return sell.run(message);

    if (message.content.startsWith('!tbzhelp')) return tbzhelp.run(message);
    
}

module.exports = { handleMessageCreate };
