require('dotenv').config(); // Config
const { REST, Routes } = require("discord.js");
const { iterateCommands } = require("./utils"); // To get commands from files
const botToken = process.env.BOT_TOKEN, appId = process.env.APP_ID, guildId = process.env.GUILD_ID;

// Get the commands
const commands = iterateCommands().map(command => command.data);

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(botToken);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(appId, guildId),
			{ body: commands },
		);

		console.log(`Successfully refreshed ${data.length} commands.`);
	} catch (err) {
		// Log and throw error
		console.log(err);
		throw err;
	}
})();