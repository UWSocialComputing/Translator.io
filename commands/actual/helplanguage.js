const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('helplanguage')
		.setDescription('Displays a set of supported languages'),
	async execute(interaction) {
        console.log(interaction.client)
		return interaction.client.send('TODO');
	},
};