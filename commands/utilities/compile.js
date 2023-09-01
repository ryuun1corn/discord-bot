require('dotenv').config();
const { ApplicationCommandType, ContextMenuCommandBuilder, ActionRowBuilder, ComponentType } = require('discord.js');
const axios = require('axios');
const { getSnippet } = require("../../utils.js");
const { getLanguagesSelect, getCompilerSelect } = require("../../data/components.js");
const { getWaitEmbed } = require('../../data/embeds.js');

module.exports = { 
	data: new ContextMenuCommandBuilder()
		.setName('Compile')
        .setType(ApplicationCommandType.Message),
	async execute(interaction) {

        await interaction.reply({embeds: [getWaitEmbed(interaction)], ephemeral: true})
        const data = getSnippet(interaction.targetMessage.content);
        if (!data.code) {
            throw {
                name: "CodeBlockMissing",
                message: "Couldn't find any code blocks.",
                timestamp: new Date()
            }
        }
        let tempLang = null;

        if (!data.lang) {
            langRow = new ActionRowBuilder()
                .addComponents(getLanguagesSelect());
            const langResponse = await interaction.editReply({components: [langRow], embeds:[], ephemeral: true});
            try {
                tempLang = await langResponse.awaitMessageComponent({time: 20_000, componentType: ComponentType.StringSelect});
                data.lang = tempLang.values[0];
            } catch (err) {
                interaction.editReply({ content: 'Confirmation not received within 20 seconds, cancelling', components: [] });
                return;
            }
        }

        compilerRow = new ActionRowBuilder()
            .addComponents(getCompilerSelect(data.lang))
        
        let rowResponse;

        if (!tempLang) {
            rowResponse = await interaction.editReply({components: [compilerRow], embeds: [], ephemeral: true});
        } else {
            rowResponse = await tempLang.update({components: [compilerRow], ephemeral: true});
        }
        
        try {
            const tempCompiler = await rowResponse.awaitMessageComponent({time: 20_000, componentType: ComponentType.StringSelect});
            data.compiler = tempCompiler.values[0];
            await tempCompiler.update({embeds: [getWaitEmbed(interaction)], components: []});
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

        await interaction.editReply({content: `Here is the result: \n\`\`\`${finalText||" "}\`\`\``, embeds: [], components: []});
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