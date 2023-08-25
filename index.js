require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, IntentsBitField, Collection, Events, TextChannel } = require("discord.js");
const { iterateCommands } = require("./utils.js");

const client = new Client({ // Declare intents
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.commands = new Collection(); // Get available commands
iterateCommands().forEach(command => {
    client.commands.set(command.data.name, command); 
});

client.once("ready", (e) => { // Online event text prompt
    console.log(`${e.user.tag} is online.`);
});

client.on(Events.InteractionCreate, async interaction => { // Handle commands
	const errorChannel= await client.channels.fetch(process.env.ERROR_CHANNEL_ID);
    if (!interaction.isChatInputCommand()) return;
    
    const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
        console.log(client.commands);
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) { // For error handling
		await errorChannel.send({
			content: `=====ERROR REPOT======\nError name: ${error.name}\nMessage: ${error.message}\nStack:
			\`\`\`${error.stack}\`\`\`
			`
		}); 

		if (interaction.replied || interaction.deferred) { // If message a message has already been sent
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else { // If there was no message
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.login(process.env.BOT_TOKEN);