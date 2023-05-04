const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('echo')
		.setDescription('Echos input to channel')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('The input to echo back')
		        .setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to echo into')),

	async execute(interaction) {
		const input = interaction.options.getString("input")
        await interaction.reply(input)
	},
};