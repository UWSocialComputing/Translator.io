const { SlashCommandBuilder } = require('discord.js');
const languages = require('./../../../resource/languages.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('helplanguage')
		.setDescription('Displays a set of supported languages'),
	async execute(interaction) {
		let result = '```\nLanguage Id: Language Name\n--------------------------\n';
		for (const language in languages) {
			result += `${language}: ${languages[language]}\n`;
		}
		result += "```"
		interaction.user.send({ content: result });
		return interaction.reply({ content: "I have DM'd you a list of supported languages", ephemeral: true });
	},
};