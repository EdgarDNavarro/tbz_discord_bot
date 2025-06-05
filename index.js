const Discord = require('discord.js')
require('dotenv').config();
const { loadSlash } = require("./handlers/slashHandler");
const { handleMessageCreate } = require('./src/events/messageCreate');
const Client = new Discord.Client({
    intents: 3276799
})

Client.on('interactionCreate', async (interaction) => {
    if(!interaction.isCommand()) return
    const cmd = Client.slashCommands.get(interaction.commandName)
    if(!cmd) return;

    const args = []
    for(let option of interaction.options.data){
        if(option.type === 1 ) {
            if(option.name) args.push(option.name)
            option.options?.forEach(element => {
                if(element.value) args.push(option.value)
            });
        } else if(option.value) args.push(option.value)
    }
    cmd.execute(Client, interaction, args)
})

Client.slashCommands = new Discord.Collection()

Client.on('messageCreate', message => handleMessageCreate(Client, message));


Client.login(process.env.DISCORD_KEY)
    .catch((error) => console.log(error))

Client.on("ready", async () => {
    await loadSlash(Client)
    .then(() => {
        console.log("Comandos iniciados con exito")
    })
    .catch((error) => {
        console.log(`Error: ${error}`)
    })
})