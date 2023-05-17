const { SlashCommandBuilder } = require('discord.js');
const { apiKey } = require('./../../config.json');
const deepl = require('deepl-node');
const translator = new deepl.Translator(apiKey);

const path = require('node:path');
const Keyv = require('keyv');
const user_default = path.join(__dirname, './../../../database/user_default.sqlite');
const user_default_keyv = new Keyv('sqlite://' + user_default);
const server_default = path.join(__dirname, './../../../database/server_default.sqlite');
const server_default_keyv = new Keyv('sqlite://' + server_default);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('announce')
		.setDescription('announces message in given languages')
		.addStringOption(option =>
			option.setName('message')
				.setDescription('Message you want to send')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('languages')
				.setDescription('list of languages you want your message translated to')),

	async execute(interaction) {
		const input = interaction.options.getString('input');
		let output;
		let lang;
		let message = '';
		const userDefaultLang = await user_default_keyv.get(interaction.user.id);
		const serverDefaultLang = await server_default_keyv.get(interaction.guild.id);
		if (userDefaultLang) {
			lang = userDefaultLang;
		}
		else if (serverDefaultLang) {
			lang = serverDefaultLang;
			message = '\n*User language not set, using server default';
		}
		else {
			lang = 'EN';
			message = '\n*User language and server default not set, using English';
		}
		await translator
			.translateText(input, null, lang)
			.then((result) => {
				output = result.text;
			})
			.catch((error) => {
				console.log(error);
				output = 'Something went wrong';
			});
		await interaction.reply({ content: '**Original:** ' + input + '\n**Translation:** ' + output + message, ephemeral: true });
	},
};

// command = {data: actual_data, execute_function}