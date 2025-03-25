const { readdirSync } = require('fs');
const path = require('path');

module.exports = {
    async loadSlash(client) {
        const slashCommandsDir = path.join(__dirname, '..', 'slashcommands');

        readdirSync(slashCommandsDir).forEach(fileName => {
            const command = require(path.join(slashCommandsDir, fileName));
            client.slashCommands.set(command.name, command);
        });

        await client.application?.commands.set(client.slashCommands.map((x) => x))
    }
}
