require('dotenv').config();
const { ApplicationCommandType, ContextMenuCommandBuilder, ActionRowBuilder, ComponentType } = require('discord.js');
const axios = require('axios');
const { getSnippet } = require("../../utils.js");
const { getLanguagesSelect, getCompilerSelect } = require("../../components.js");
const components = require('../../components.js');

module.exports = { 
	data: new ContextMenuCommandBuilder()
		.setName('Compile')
        .setType(ApplicationCommandType.Message),
	async execute(interaction) {
        await interaction.reply({content: "Please wait...", ephemeral: true})
        const data = getSnippet(interaction.targetMessage.content);
        if (!data.code) {
            interaction.editReply({content: "Couldn't find any code blocks.", ephemeral :true});
            return;
        }

        if (!data.lang) {
            langRow = new ActionRowBuilder()
                .addComponents(getLanguagesSelect());
            const langResponse = await interaction.editReply({content: "Select a language.", components: [langRow], ephemeral: true});
            try {
                const tempLang = await langResponse.awaitMessageComponent({time: 20_000, componentType: ComponentType.StringSelect});
                data.lang = tempLang.values[0];
                interaction = tempLang;
            } catch (err) {
                interaction.editReply({ content: 'Confirmation not received within 20 seconds, cancelling', components: [] });
                return;
            }
        }

        compilerRow = new ActionRowBuilder()
            .addComponents(getCompilerSelect(data.lang))
        
        let rowResponse;

        if (interaction.componentType !== ComponentType.StringSelect) {
            rowResponse = await interaction.editReply({content: "Select a compiler", components: [compilerRow], ephemeral: true});
        } else {
            rowResponse = await interaction.update({content: "Select a compiler", components: [compilerRow], ephemeral: true});
        }
        
        try {
            const tempCompiler = await rowResponse.awaitMessageComponent({time: 20_000, componentType: ComponentType.StringSelect});
            data.compiler = tempCompiler.values[0];
            await tempCompiler.update({content: "Please wait...", components: []});
            interaction = tempCompiler;
        } catch (err) {
            interaction.editReply({ content: 'Confirmation not received within 20 seconds, cancelling', components: [] });
            return;
        }

        res = await getOutput(data.code, data.compiler, data.lang);
        let finalText = "";
        for (const line of res.data.stdout) {
            finalText += line.text + "\n";
        }

        await interaction.editReply({content: `Here are the results: \n\`\`\`${finalText||" "}\`\`\``, components: []});
	},
};

async function getOutput(code, compiler, lang) {
    const godboltUrl = process.env.GODBOLT_URL;
    const query_params = {
        "source": `${code}`,
        "options": {
            "compilerOptions": {
                "skipAsm": true,
                "executorRequest": true,
            },
        },
        "filters": {
            "execute": true,
        },
        "lang": `${lang}`,
        "allowStoreCodeDebug": true
    }
    const _url = godboltUrl+`api/compiler/${compiler}/compile`;

    try {
        const res = await axios.post(_url, query_params);
        return res;
    } catch (err) {
        throw err;
    }
}