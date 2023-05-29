const { SlashCommandBuilder } = require('discord.js');
const languages = require('./../../../resource/languages.json');
const { User } = require('./../../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('sets user registered language')
        .addStringOption(option =>
            option.setName('language')
                .setDescription('registered language')
                .setRequired(true)),

    async execute(interaction) {
        const input = interaction.options.getString('language').toUpperCase();
        // eslint-disable-next-line no-prototype-builtins
        const languageExists = languages.hasOwnProperty(input);
        const userId = interaction.user.id;
        const serverId = interaction.guildId;
        if (languageExists) {
            await User.upsert({
                serverId: serverId,
                userId: userId,
                language: input,
            });
            await interaction.reply({ content: 'You have registered for the ' + languages[input] + ' language', ephemeral: true });
        }
        else {
            await interaction.reply({ content: 'Invalid input language', ephemeral: true });
        }
    },
};