require('dotenv').config();
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const fs = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('qrcode')
		.setDescription('Turn a text into QR code.')
        .addStringOption(option => 
            option
                .setName("text")
                .setDescription("The text to convert to QR code")
                .setRequired(true)),
	async execute(interaction) {
        const text=interaction.options.getString('text');
        await interaction.reply({
            content: `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(text)}&size=300x300`,
        });
	},
};

