const { SlashCommandBuilder } = require('discord.js');
const languages = require('./../../../resource/languages.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('helplanguage')
		.setDescription('Displays a set of supported languages'),
	async execute(interaction) {
		let result = 'Language Id - Language Name\n';
		for (const language in languages) {
			result += `${language} - ${languages[language]}\n`;
		}
		return interaction.reply({ content: result, ephemeral: true });
	},
};