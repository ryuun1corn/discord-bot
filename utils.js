const fs = require("node:fs");
const path = require("node:path");

function iterateCommands() { // Iterate through files
    let commands=[];

    const commandsFoldersPath=path.join(__dirname, "commands"); // Get commands foler
    const commandsFolders = fs.readdirSync(commandsFoldersPath); // Read all the folders inside the 'command' folder

    for (const folder of commandsFolders) {
        const commandsPath = path.join(commandsFoldersPath, folder); // Loop through the folders
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); // Read all the .js files inside the folder

        for (const file of commandFiles) { // Loop through the files
            const filePath = path.join(commandsPath, file); // Get the path of the file
            const command = require(filePath); // Acquire the command

            // Check if it has data and execute function
            if ('data' in command && 'execute' in command) {
                commands.push(command);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
    return commands;
}

function underMaintenance(interaction) {
    interaction.reply("This command is currently under maintenance. Apologies for the inconvenience.");
}

module.exports = {
    iterateCommands,
    underMaintenance
};