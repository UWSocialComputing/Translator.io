const { SlashCommandBuilder } = require('discord.js');

const setTranslations = new Map();
setTranslations.set("hola", "hello");
setTranslations.set("hello", "hola");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('translate_mock')
		.setDescription('\"Translates\" the input')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('The input to echo back')
		        .setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to echo into')),

	async execute(interaction) {
		const input = interaction.options.getString("input")
        if (setTranslations.has(input)) {
            await interaction.reply("Translating: " + input + "\n" + setTranslations.get(input))
        } else {
            await interaction.reply("Translating: " + input + "\nNot implemented")
        }
	},
};