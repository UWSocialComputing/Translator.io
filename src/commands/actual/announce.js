const { SlashCommandBuilder } = require('discord.js');
const { apiKey } = require('./../../config.json');
const deepl = require('deepl-node');
const translator = new deepl.Translator(apiKey);
const { User, Server } = require('./../../models');

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

        let languageArray = []

        if (languages !== null) {
            let splitlanguages = languages.split(" ")
            splitlanguages.map(s => s.trim())
            languageArray = splitlanguages.filter(s => s !== '');
        }

		let output = '';
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

        if (languageArray === []) {
            if (server != null) {
                languageArray = [server['defaultLanguage']];
            }
            else {
                languageArray = ['EN'];
                message = '\n*User language and server default not set, using English';
            }
        }

		try {
            for (i = 0; i < languageArray.length; i++) {
                const translation = await translator.translateText(input, null, languageArray[i]);
			    output += languageArray[i] + ": " + translation.text + '\n';
            }
		}
		catch (error) {
			console.log(error);
			output = 'Sorry, there is a problem with our translator.';
		}
        console.log(output)
		await interaction.reply({ content: '**Original:** ' + input + '\n' + output + message });
	},
};
