require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { getWaitEmbed } = require('../../data/embeds');

// Embeds
const resEmbed = new EmbedBuilder()
	.setColor(0xfc7d5d)
	.setTitle("Facts!")
	.setDescription("Here are some random facts for you: ")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('facts')
		.setDescription('Get a random fact.')
		.addIntegerOption(option => 
			option
				.setName("amount")
				.setDescription("The number of facts")
				.setMinValue(1)
				.setMaxValue(10)),
	async execute(interaction) {
		await interaction.reply({embeds: [getWaitEmbed(interaction)]});
		let finalStr = "";

		let amount = interaction.options.getInteger("amount") ?? 1;
		try {
			const facts = await getFact(amount);
			for (var i = 0; i < facts.data.length; i++) {
				finalStr += `${i+1}. ` + facts.data[i].fact + ".\n\n";
			}
		} catch(error) {
			throw error;
		}

		resEmbed.addFields(
			{name: ":nerd: :nerd: :nerd:", value: finalStr}
		);
		finalStr = "";

		await interaction.editReply({content: "", embeds: [resEmbed]});
	},
};

async function getFact(amount) { // API call
	const headers = {
		'X-Api-Key': process.env.NINJA_API_KEY,
	}

	let _url = process.env.NINJA_API_URL+`v1/facts?limit=${amount}`;
	try {
		const response = await axios.get(_url, { headers });
		return response;
	} catch (err) {
		throw err;
	}
}

