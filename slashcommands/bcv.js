const { EmbedBuilder } = require("discord.js")
const { getMonitor } = require("consulta-dolar-venezuela");

module.exports = {
    name: "bcv",
    description: "Preguntar precio del BCV",
    async execute(client, interaction){
        await interaction.deferReply();
        const precios = await getMonitor("null");
        const precioBCV = precios.bcv.price;
        const embed = new EmbedBuilder()
            .setColor('Purple')
            .setDescription(`BCV: ${precioBCV}`)
        interaction.editReply({ embeds: [embed]})
    }
}