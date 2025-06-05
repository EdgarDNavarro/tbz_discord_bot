const { EmbedBuilder } = require("discord.js")
const { default: axios } = require("axios");

const urlBase = 'https://exchange.vcoud.com/'; // Hello World xD

module.exports = {
    name: "pesos",
    description: "Pregunta el precio del peso colombiano",
    async execute(client, interaction){
        await interaction.deferReply();
        let insertCoin = { name: 'Error consultando, intenta de nuevo', value: `Algo salio mal`, inline: true }
        try {
            const response = await axios.get(urlBase + 'coins/latest');
            insertCoin = response.data
            .filter(coin => {
                
                if (coin.type === 'currency' && ['peso-colombiano'].includes(coin.slug)) {
                    return true;
                }
        
                return false;
            })
            .slice(0, 25)
            .map(coin => {
                return (
                    { name: coin.name, value: `${coin.symbol}: ${coin.price}`, inline: false }
                )
            });
        } catch (error) {
            insertCoin = { name: 'Error consultando, intenta de nuevo', value: `Algo salio mal. Error: ${error}`, inline: true }
        }

        const embed = new EmbedBuilder()
            .setColor('Purple')
            .setDescription(`Peso colombiano`)
            .addFields(insertCoin)
        interaction.editReply({ embeds: [embed]})
    }
}