const { SlashCommandBuilder } = require('discord.js');
const languages = require('./../../../resource/languages.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Displays more information about the bot'),
	async execute(interaction) {
		let result = '```'
		result += 'Here are my commands:\n--------------------';
		result += '\\default <language Id>:\n'
		result += 'Sets the server default language to the specified language\n\n'
		result += '\\enable auto <enable/disable>\n'
		result += 'Enables or disables auto translations within the channel the command is run in\n\n'
		result += '\\help\n'
		result += 'Displays information about the bot\'s commands\n\n'
		result += '\\helplanguage\n'
		result += 'DMs information about the bot\'s supported languages\n\n'
		result += '\\register <language Id>\n'
		result += 'Registers you for your preferred language. This is not preserved across servers\n\n'
		result += '\\translate [text] (language)\n'
		result += 'Translates the given text. If language is not specified,' +
		          ' translates to the user registered language.' +
				  ' Otherwise translates to the specified language\n\n'
		result += '```'
		interaction.user.send({ content: result });
		return interaction.reply({ content: "I have DM'd you information about me.", ephemeral: true });
	},
};