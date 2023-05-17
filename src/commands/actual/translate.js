const { SlashCommandBuilder } = require('discord.js');
const { apiKey } = require('./../../config.json');
const deepl = require('deepl-node');
const translator = new deepl.Translator(apiKey);
const { User, Server } = require('./../../models');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('translate')
		.setDescription('translates input message')
		.addStringOption(option =>
			option.setName('input')
				.setDescription('Text to translate')
				.setRequired(true)),

	async execute(interaction) {
		const input = interaction.options.getString('input');
		let output;
		let language;
		let message = '';
		const userId = interaction.user.id;
		const serverId = interaction.guildId;
		const user = await User.findOne({
			where: {
				serverId: serverId,
				userId: userId,
			},
		});
		const server = await Server.findOne({
			where: {
				serverId: serverId,
			},
		});
		if (user != null) {
			language = user['language'];
		}
		else if (server != null) {
			language = server['defaultLanguage'];
			message = '\n*User language not set, using server default';
		}
		else {
			language = 'EN';
			message = '\n*User language and server default not set, using English';
		}
		try {
			const result = await translator.translateText(input, null, language);
			output = result.text;
		}
		catch (error) {
			console.log(error);
			output = 'Sorry, there is a problem with our translator.';
		}
		await interaction.reply({ content: '**Original:** ' + input + '\n**Translation:** ' + output + message, ephemeral: true });
	},
};
