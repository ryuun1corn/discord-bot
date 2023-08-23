const fs = require("node:fs");
const path = require("node:path");

function iterateCommands(condition) { // Iterate through files
    let commands=[];
    const commandsPath=path.join(__dirname, "commands");
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(__dirname, "commands", file);
        const command = require(filePath);
        // Check if it has data and execute function
        if ('data' in command && 'execute' in command) {
            commands.push(command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
    return commands;
}

module.exports = iterateCommands;