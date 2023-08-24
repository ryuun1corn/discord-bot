require('dotenv').config();
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kitty')
		.setDescription('Get a random cat image.'),
	async execute(interaction) {
        await interaction.deferReply();
        const data = await loadImage(interaction.user.id);
        await interaction.followUp(data.url);
	},
};

async function loadImage(sub_id) {
    const headers = { // Header for API key
        'X-API-KEY': process.env.CAT_API_KEY,
    }
    var query_params = {
        'has_breeds': true,
        'sub_id': sub_id, // pass the message senders username so you can see how many images each user has asked for in the stats
        'limit' : 1       // only need one
    }

    let _url = process.env.CAT_API_URL+`v1/images/search?${JSON.stringify(query_params)}`;

    try {
        const response = await axios.get(_url, { headers });
        return response.data[0]; // Return the data
    } catch (err) {
        throw err; // Rethrow the error to handle it outside the function if needed
    }
}