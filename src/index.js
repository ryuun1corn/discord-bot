require('dotenv').config();
const { Client, IntentsBitField } = require("discord.js");

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on("ready", (e) => {
    console.log(`${e.user.tag} is online.`);
});

client.on("messageCreate", (message) => {
    if (!message.author.bot) message.reply(`Hello ${message.author.globalName}, did you say.. ${message.content}`);
});

client.login(process.env.DISCORD_TOKEN);