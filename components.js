const { ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const compilerVersions = require("./data/compilerVersions");

module.exports = {
    getCompilerSelect,
    getLanguagesSelect,
    compileBtn: new ButtonBuilder()
        .setCustomId("compile")
        .setLabel("Compile")
        .setStyle(ButtonStyle.Primary)
}

function getLanguagesSelect() {
    const languages = {
        "Python": "python", 
        "Java": "java", 
        "Javascript": "javascript", 
        "Ruby": "ruby", 
        "C#": "csharp", 
        "C++": "c++", 
        "C": "c", 
        "Rust": "rust", 
        "Golang": "go"
    }
    const languagesSelect = new StringSelectMenuBuilder()
        .setCustomId("languages")
        .setPlaceholder("Select a language!");
    for (const lang in languages) {
        languagesSelect.addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel(lang)
                .setValue(languages[lang])
        )
    }
    return languagesSelect;
}

function getCompilerSelect(lang) {
    const compilerSelect = new StringSelectMenuBuilder()
        .setCustomId("compiler")
        .setPlaceholder("Select a version!");
    let currLang = compilerVersions[lang];
    for (const ver in currLang) {
        compilerSelect.addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel(ver)
                .setValue(currLang[ver])
        );
    }
    return compilerSelect;
}