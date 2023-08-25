require('dotenv').config();
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const { iterateCommands, initiateEvents } = require("./utils.js");

const client = new Client({ // Declare intents
    intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
    ],
});

client.commands = new Collection(); // Get available commands

for (const command of iterateCommands()) {
	client.commands.set(command.data.name, command); 
}

initiateEvents(client);


client.login(process.env.BOT_TOKEN);