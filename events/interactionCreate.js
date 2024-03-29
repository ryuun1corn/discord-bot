const { Events } = require('discord.js');
const { handleError } = require("../utils.js");
const { getErrorEmbed } = require('../data/embeds.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand() && !interaction.isMessageContextMenuCommand()) return;
        
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.log(client.commands);
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) { // For error handling (still needs fixes)
            if (error.stack) {
                handleError(interaction, error);
            }

            if (interaction.replied || interaction.deferred) { // If message a message has already been sent
                await interaction.editReply({embeds: [getErrorEmbed(interaction, error)], ephemeral: true});
            } else { // If there was no message
                await interaction.reply({embeds: [getErrorEmbed(interaction, error)], ephemeral: true});
            }
        }
    }
}
