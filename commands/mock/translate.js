const { SlashCommandBuilder } = require('discord.js');
const { apiKey } = require('../../config.json');
const deepl = require('deepl-node');
const translator = new deepl.Translator(apiKey);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('translate')
		.setDescription('translates input message')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Text to translate')),

	async execute(interaction) {
		const input = interaction.options.getString("input")
        var output;
        await translator
            .translateText(input, null, "fr")
            .then((result) => {
                output = result.text
            })
            .catch((error) => {
                console.log(error)
                output = "Something went wrong";
            });
        await interaction.reply({content: "**Original:** " + input + "\n**Translation:** " + output, ephemeral: true})
	},
};