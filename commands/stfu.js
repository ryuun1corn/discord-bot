const { SlashCommandBuilder, userMention } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stfu')
		.setDescription('Enjoy the silent treatment.')
		.addUserOption(option => 
			option
				.setName("target")
				.setDescription("Who to silence")
				.setRequired(true)),
	async execute(interaction) {
		const target = interaction.options.getUser('target');
		await interaction.reply(`Shut the fuck up ${userMention(target.id)}`);
	},
};
