const { EmbedBuilder } = require("discord.js")
const { default: axios } = require("axios");

const urlBase = 'https://exchange.vcoud.com/'; // Hello World xD

module.exports = {
    name: "all",
    description: "Pregunta el precio de todas las monedas",
    async execute(client, interaction){
        await interaction.deferReply();
        let insertCoin = { name: 'Error consultando, intenta de nuevo', value: `Algo salio mal`, inline: true }
        try {
            const response = await axios.get(urlBase + 'coins/latest');
            insertCoin = response.data
            .filter(coin => {
                // Filtrar las monedas con type 'bolivar'
                if (coin.type === 'bolivar') {
                    return true;
                }
                
                // Filtrar las monedas con type 'currency' y slug 'euro' o 'peso-colombiano'
                if (coin.type === 'currency' && ['euro', 'peso-colombiano'].includes(coin.slug)) {
                    return true;
                }
        
                return false;
            })
            .slice(0, 25)
            .map(coin => {
                const roundedPrice = parseFloat(coin.price).toFixed(3);
                return (
                    { name: coin.name, value: `${coin.symbol}: ${roundedPrice}`, inline: false }
                )
            });
        } catch (error) {
            insertCoin = { name: 'Error consultando, intenta de nuevo', value: `Algo salio mal Error: ${error}`, inline: true }
        }

        const embed = new EmbedBuilder()
            .setColor('Purple')
            .setTitle('Precio de todo')
            .setDescription(`Resultado de todas las monedas`)
            .addFields(insertCoin)
        interaction.editReply({ embeds: [embed]})
    }
}