require('dotenv').config();
const fs = require("node:fs");
const path = require("node:path");

function getSnippet(text) { // Checking if there is a code snippet and get the language (if there's any)
    const languangesId = ["csharp", "c", "c++", "go", "rust", "python", "ruby", "java", "javascript"];
    const checkRegEx = /```([\s\S]*?)```/;
    const match = text.match(checkRegEx);
    let language = null, code=null;
    if (match) {
        code = match[1];
        const lines = match[1].split('\n');
        const lang = lines[0];
        if (languangesId.includes(lang)) {
            language = lang;
            code = lines.slice(1).join('\n');
        }
    }
    return {lang: language, code: code};
}

async function handleError(interaction, error) {
    const errorChannel = await interaction.client.channels.fetch(process.env.ERROR_CHANNEL_ID);
    let errorMessage = `=====ERROR REPOT======\n`+
    `Command name: ${interaction.commandName}\n` +
    `Command type: ${interaction.commandType}\n` +
    `Invoked by: ${interaction.user.globalName}\n` +
    `\nError name: ${error.name}\n` +
    `Message: ${error.message}\n` + 
    `Stack:\`\`\`${error.stack}\`\`\``; 
    await errorChannel.send(errorMessage); 
}

function initiateEvents(client) {
    const eventsPath = path.join(__dirname, "events");
    const eventsFolder = fs.readdirSync(eventsPath);

    for (const events of eventsFolder) {
        const filePath = path.join(eventsPath, events);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
}

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

function maintenanceMessage() {
    return {content: "This command is currently under maintenance. Apologies for the inconvenience.", ephemeral: true};
}

module.exports = {
    iterateCommands,
    maintenanceMessage,
    handleError,
    initiateEvents,
    getSnippet
};