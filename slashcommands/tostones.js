const { EmbedBuilder } = require("discord.js")
module.exports = {
    name: "tostones",
    description: "Preguntar precio de los tostones",
    async execute(client, interaction){

        const embed = new EmbedBuilder()
            .setColor('Purple')
            .setDescription(`Tostones: Ahora el vendedor es fiscal`)
        interaction.reply({ embeds: [embed]})
    }
}