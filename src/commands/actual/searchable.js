const { SlashCommandBuilder } = require('discord.js');
const { User } = require('./../../models');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('searchable')
		.setDescription('makes the user searchable from the search command')
		.addStringOption(option =>
			option.setName('setting')
				.setDescription('opt in or out of searchable')
				.setRequired(true)
				.addChoices(
					{ name: 'allow', value: 'allow' },
					{ name: 'disallow', value: 'disallow' },
				)),

	async execute(interaction) {
		const setting = interaction.options.getString('setting');
		const searchable = setting == 'allow';
		const serverId = interaction.guildId;
		const userId = interaction.user.id;
		let replyMessage;
		await User.upsert({
			userId: userId,
			serverId: serverId,
			searchable: searchable,
		});
		if (searchable) {
			replyMessage = 'You will show up in search queries';
		}
		else {
			replyMessage = 'You will not show up in search queries';
		}
		await interaction.reply({ content: replyMessage, ephemeral: true });
	},
};