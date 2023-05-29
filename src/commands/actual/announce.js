const { SlashCommandBuilder } = require('discord.js');
const { apiKey } = require('./../../config.json');
const deepl = require('deepl-node');
const translator = new deepl.Translator(apiKey);
const { User, Server } = require('./../../models');
const flags = require('./../../../resource/flags.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('announce')
		.setDescription('translates input message to all specified languages in a public comment')
		.addStringOption(option =>
			option.setName('input')
				.setDescription('Text to translate')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('languages')
				.setDescription('Languages to translate to')
				.setRequired(false)),

	async execute(interaction) {
		const input = interaction.options.getString('input');
		const languages = interaction.options.getString('languages');

		let languageArray = [];

		if (languages !== null) {
			const splitlanguages = languages.split(' ');
			splitlanguages.map(s => s.trim());
			languageArray = splitlanguages.filter(s => s !== '');
		}

		const output = '';
		let message = '';
		const userId = interaction.user.id;
		const serverId = interaction.guildId;
		const server = await Server.findOne({ where: { serverId: serverId } });

		if (Object.keys(languageArray).length === 0) {
			if (server['defaultLanguage'] != null) {
				languageArray = [server['defaultLanguage']];
			}
			else {
				languageArray = ['EN'];
				message = '\n*User language and server default not set, using English';
			}
		}
		let embed;

		try {
			const translations = [];
			for (i = 0; i < languageArray.length; i++) {
				const translation = await translator.translateText(input, null, languageArray[i]);
				translations.push({ 'name': flags[languageArray[i]], 'value': translation.text });
			}

			embed = {
				color: 0x0099ff,
				title: 'Announcement',
				description: `From <@${userId}>:\n` + input,
				fields: translations,
			};
		}
		catch (error) {
			console.log(error);
			embed = {
				color: 0x0099ff,
				title: 'Announcement',
				description: `From <@${userId}>:\n` + input,
				fields: [{ 'name': 'Error', 'value': 'Sorry, there is a problem with our translator.' }],
			};
		}

		await interaction.reply({ embeds: [embed] });
	},
};
