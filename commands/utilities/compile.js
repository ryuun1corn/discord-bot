require('dotenv').config();
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { underMaintenance } = require("../../utils.js");

const languangesId = ["csharp", "c", "c++", "go", "rust", "python", "ruby", "java", "javascript"];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('compile')
		.setDescription('Shows the output of a snippet of code.')
        .addStringOption(option => 
            option
                .setName("text")
                .setDescription("The snippet to execute.")
                .setRequired(true)),
	async execute(interaction) {
        const text = interaction.options.getString('text');
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