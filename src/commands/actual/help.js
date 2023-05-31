const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Displays more information about the bot'),
	async execute(interaction) {
		let result = '```';
		result += 'Here are my commands:\n--------------------\n';
		result += '\\default <language Id>:\n';
		result += 'Sets the server default language to the specified language\n\n';
		result += '\\enable auto <enable/disable>\n';
		result += 'Enables or disables auto translations within the channel the command is run in\n\n';
		result += '\\help\n';
		result += 'Displays information about the bot\'s commands\n\n';
		result += '\\helplanguage\n';
		result += 'DMs information about the bot\'s supported languages\n\n';
		result += '\\register <language Id>\n';
		result += 'Registers you for your preferred language. This is not preserved across servers\n\n';
		result += '\\translate [text] (language)\n';
		result += 'Translates the given text and sends as a private message.' +
                  ' If language is not specified,' +
                  ' translates to the user registered language.' +
                  ' Otherwise translates to the specified language\n\n';
		result += '\\announce [text] (languages)\n';
		result += 'Translates the given text and sends as a public embed.' +
                  ' Supports multiple languages at the same time' +
                  ' If language is not specified,' +
                  ' translates to the user registered language.' +
                  ' Otherwise translates to the specified language\n\n';
		result += '\\search <language Id>\n';
		result += 'Displays as an embed the users that are registered for same language corresponding to the language Id.\n\n';
		result += '\\searchable <allow/disallow>\n';
		result += 'Allows a user to opt-in to or opt-out from being searchable using the searchable command. ' +
				'By opting in, other users can see what your preferred language is registered as.\n\n';
		result += '```';
		interaction.user.send({ content: result });
		return interaction.reply({ content: 'I have DM\'d you information about me.', ephemeral: true });
	},
};