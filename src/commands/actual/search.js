const { SlashCommandBuilder } = require('discord.js');
const languages = require('./../../../resource/languages.json');
const { User } = require('./../../models');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('search')
		.setDescription('See every user who has registered for a language')
		.addStringOption(option =>
			option.setName('language')
				.setDescription('Language to look up')
				.setRequired(true)),
	async execute(interaction) {
		const serverId = interaction.guildId;
		const languageQuery = interaction.options.getString('language').toUpperCase();

		if (languages[languageQuery] === undefined) {
			await interaction.reply({ content: 'Invalid input language', ephemeral: true });
			return;
		}

		const output = await User.findAll({ where: { serverId: serverId, language: languageQuery } });

		let users = '';
		for (let i = 0; i < output.length; i++) {
			const queryUserId = output[i].userId;
			users = users + `<@${queryUserId}>\n`;

			// Switch in when Searchable DB works
			// const isAllowed = await Searchable.findOne({ where: { serverId: serverId, userId: queryUserId } });
			// if (isAllowed.length != 0) {
			//     users = users + `<@${queryUserId}>\n`
			// }
		}

		const embed = {
			color: 0x0099ff,
			title: 'Search',
			fields: [{ 'name': 'Users in this server who registered for ' + languages[languageQuery], 'value': users }],
		};

		await interaction.reply({ embeds: [embed] });
	},
};