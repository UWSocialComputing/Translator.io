const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hola')
		.setDescription('input: hola; output: hello'),
	async execute(interaction) {
		return interaction.reply('hello');
	},
};