require('dotenv').config();
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('facts')
		.setDescription('Get a random fact.'),
	async execute(interaction) {
		await interaction.deferReply();
		const res = await getFact();
		await interaction.followUp(res.data[0].fact);
	},
};

async function getFact() {
	const headers = {
		'X-Api-Key': process.env.NINJA_API_KEY,
	}

	let _url = process.env.NINJA_API_URL+`v1/facts?limit=1`;
	try {
		const response = await axios.get(_url, { headers });
		return response;
	} catch (err) {
		throw err;
	}
}
