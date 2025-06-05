const { EmbedBuilder } = require("discord.js")
const { getMonitor } = require("consulta-dolar-venezuela");

module.exports = {
    name: "monitor",
    description: "Preguntar precio del dolar Monitor EnParaleloVzla",
    async execute(client, interaction){
        await interaction.deferReply();
        const precios = await getMonitor("null");
        const precioMonitor = precios?.enparalelovzla?.price;

        const embed = new EmbedBuilder()
            .setColor('Purple')
            .setDescription(`Monitor EnParaleloVzla: ${precioMonitor}`)
        interaction.editReply({ embeds: [embed]})
    }
}