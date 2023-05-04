const { SlashCommandBuilder } = require('discord.js');
const { apiKey } = require('../../config.json');
const deepl = require('deepl-node');
const translator = new deepl.Translator(apiKey);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('apitest')
		.setDescription('Test API')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('Input to translate')
		        .setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to echo into')),

	async execute(interaction) {
		const input = interaction.options.getString("input")
        var output;
        await translator
            .translateText(input, null, "en-US")
            .then((result) => {
                output = result.text
            })
            .catch((error) => {
                console.log(error)
                output = "Something went wrong";
            });
        await interaction.reply(output)
	},
};