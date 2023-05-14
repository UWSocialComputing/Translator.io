const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const Keyv = require('keyv');
const server_default = path.join(__dirname, './../../../database/server_default.sqlite');
const server_default_keyv = new Keyv('sqlite://' + server_default);
const languageFile = path.join(__dirname, './../../../resource/languages.json');
const languages = require(languageFile);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('default')
		.setDescription('sets server default language')
		.addStringOption(option =>
			option.setName('language')
				.setDescription('default language')
				.setRequired(true)),

	async execute(interaction) {
		const input = interaction.options.getString('language');

		// eslint-disable-next-line no-prototype-builtins
		if (languages.hasOwnProperty(input)) {
			await server_default_keyv.set(interaction.guild.id, input);
			await interaction.reply('Set server default to ' + languages[input]);
		}
		else {
			await interaction.reply('Invalid input language');
		}
	},
};