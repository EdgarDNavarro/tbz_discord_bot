const { EmbedBuilder } = require("discord.js");

function buildGameEmbed(session, username, extraFields = []) {
    const diceBagText = session.getDiceWhitIndexIntText() || "🎲 Ninguno";
    const diceInHandText = session.getDiceInHandText() || "🖐️ Aún no hay dados en mano";
    const dicePlayedText = session.getDicePlayedText() || "🤓 Aún no hay dados jugados";

    const battle = session.currentBattle
    
    const itemsText = session.items.length
        ? session.items.map((item, i) => `#${i} - ${item.name}`).join(", ")
        : "🎒 Ninguno";

    const statusText = {
        playing: "🟢 Jugando",
        won: "🏆 Ganaste",
        lost: "💀 Perdiste",
    }[session.status] || "❓ Desconocido";

    const baseFields = [
        {
            name: "🎯 Puntaje",
            value: `${session.score} / ${battle.targetScore}`,
            inline: true,
        },
        {
            name: "💰 Monedas",
            value: `${session.coins}`,
            inline: true,
        },
        {
            name: "🔄 Ronda",
            value: `${battle.currentRound} / ${battle.maxRounds}`,
            inline: true,
        },
        {
            name: ":fist: Tamaño de mano",
            value: `${session.diceInHand.length} / ${session.limitDiceRound}`,
            inline: true,
        },
        {
            name: ":seedling: Seed",
            value: `${session.rng.seed}`,
            inline: false,
        },
    ];

    const customSeparator = extraFields.length
        ? [{ name: "—", value: "✨ Info adicional", inline: false }, ...extraFields, { name: "—", value: "👤 Info del jugador", inline: false }]
        : [];

    const extraInfoFields = [
        {
            name: "🎒 Dados en bolso",
            value: diceBagText,
            inline: false,
        },
        {
            name: "🖐️ Dados en mano",
            value: diceInHandText,
            inline: false,
        },
        {
            name: "🪦 Dados jugados",
            value: dicePlayedText,
            inline: false,
        },
        {
            name: "📦 Items",
            value: itemsText,
            inline: false,
        },
        {
            name: "📊 Estado de juego",
            value: statusText,
            inline: true,
        },
    ];

    return new EmbedBuilder()
        .setTitle(`🎲 Estado de la partida de ${username}`)
        .setColor("Blurple")
        .addFields(...baseFields, ...customSeparator, ...extraInfoFields)
        .setTimestamp();
}

module.exports = { buildGameEmbed };
