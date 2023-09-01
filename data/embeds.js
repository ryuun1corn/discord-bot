const { EmbedBuilder } = require("discord.js");


const waitEmbed = new EmbedBuilder()
    .setColor(0xf5500f)
    .setTitle("Waiting for reply")
    .setDescription("Please wait for a while...")

function getWaitEmbed(interaction) {
    waitEmbed.setFooter({text: `${interaction.user.globalName} | '${interaction.commandName}' by urmom~`});
    return waitEmbed;
}

module.exports = {
    getWaitEmbed
}