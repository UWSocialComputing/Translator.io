const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const Keyv = require('keyv');
const channels = path.join(__dirname, '../../aux_files/channels.sqlite');
const channels_keyv = new Keyv('sqlite://' + channels);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('enableauto')
		.setDescription('enables auto translations in specified channel')
		.addStringOption(option =>
			option.setName('setting')
				.setDescription('enable or disable auto translation')
				.setRequired(true)
				.addChoices(
					{ name: 'enable', value: 'enable' },
					{ name: 'disable', value: 'disable' },
				)),

	async execute(interaction) {
		const setting = interaction.options.getString('setting');
		if (setting == 'enable') {
			await channels_keyv.set(interaction.channel.id, 1);
			await interaction.reply('Bot will now translate automatically in this channel');
		}
		else {
			await channels_keyv.delete(interaction.channel.id);
			await interaction.reply('Bot will stop translating automatically in this channel');
		}
	},
};