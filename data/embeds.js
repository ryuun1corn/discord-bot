const { EmbedBuilder } = require("discord.js");

const errorEmbed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("An error occured.")

const waitEmbed = new EmbedBuilder()
    .setColor(0xffff40)
    .setTitle("Waiting for reply")
    .setDescription("Please wait for a while...")

function getErrorEmbed(interaction, error) {
    errorEmbed
        .setDescription(error.message)
        .setFooter({text: `${interaction.user.globalName} | '${interaction.commandName ?? "-"}' by urmom~`})
    return errorEmbed
}

function getWaitEmbed(interaction) {
    waitEmbed.setFooter({text: `${interaction.user.globalName} | '${interaction.commandName}' by urmom~`});
    return waitEmbed;
}

module.exports = {
    getWaitEmbed,
    getErrorEmbed
}