const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const Keyv = require('keyv');
const user_default = path.join(__dirname, './../../../database/user_default.sqlite');
const user_default_keyv = new Keyv('sqlite://' + user_default);
const languageFile = path.join(__dirname, './../../../resource/languages.json');
const languages = require(languageFile);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('sets user registered language')
		.addStringOption(option =>
			option.setName('language')
				.setDescription('registered language')
				.setRequired(true)),

	async execute(interaction) {
		const input = interaction.options.getString('language');
		// eslint-disable-next-line no-prototype-builtins
		if (languages.hasOwnProperty(input)) {
			await user_default_keyv.set(interaction.user.id, input);
			await interaction.reply({ content: 'You have registered for the ' + languages[input] + ' language', ephemeral: true });
		}
		else {
			await interaction.reply({ content: 'Invalid input language', ephemeral: true });
		}
	},
};