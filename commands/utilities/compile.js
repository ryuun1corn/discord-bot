require('dotenv').config();
const { ApplicationCommandType, ContextMenuCommandBuilder } = require('discord.js');
const axios = require('axios');
const { underMaintenance, checkSnippet, getSnippet } = require("../../utils.js");

const languangesId = ["csharp", "c", "c++", "go", "rust", "python", "ruby", "java", "javascript"];

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Compile')
        .setType(ApplicationCommandType.Message),
	async execute(interaction) {
        const res = getSnippet(interaction.targetMessage.content);
        if (res.code) {
            console.log(getOutput(res.code).stdout);
        } 
        underMaintenance(interaction);
        // console.log(JSON.parse(`"${text}"`));
        // const res = await getOutput("def test(a):\n    return a*a  \n\nprint(test(5))");
        // await interaction.reply(res.data.stdout[0].text);
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
            "tools": [],
            "libraries": []
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