require('dotenv').config();
const { ApplicationCommandType, ContextMenuCommandBuilder } = require('discord.js');
const axios = require('axios');
const { maintenanceMessage, getSnippet } = require("../../utils.js");

const languangesId = ["csharp", "c", "c++", "go", "rust", "python", "ruby", "java", "javascript"];

module.exports = { 
	data: new ContextMenuCommandBuilder()
		.setName('Compile')
        .setType(ApplicationCommandType.Message),
	async execute(interaction) {
        await interaction.deferReply({ephemeral: true});
        const data = getSnippet(interaction.targetMessage.content);
        if (data.code) {
            const res = await getOutput(data.code);
            console.log(res.data.stdout[0].text);
        } 
        await interaction.followUp(maintenanceMessage());
	},
};

async function getOutput(text) {
    const godboltUrl = process.env.GODBOLT_URL;
    const query_params = {
        "source": `${text}`,
        "options": {
            "compilerOptions": {
                "skipAsm": true,
                "executorRequest": true,
            },
        },
        "filters": {
            "execute": true,
        },
        "lang": "python",
        "allowStoreCodeDebug": true
    }
    const _url = godboltUrl+`api/compiler/python310/compile`;

    try {
        const res = await axios.post(_url, query_params);
        return res;
    } catch (err) {
        throw err;
    }
}