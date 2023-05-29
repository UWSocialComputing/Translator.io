const { SlashCommandBuilder } = require('discord.js');
const { Server } = require('./../../models');
const languages = require('./../../../resource/languages.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('default')
        .setDescription('sets server default language')
        .addStringOption(option =>
            option.setName('language')
                .setDescription('default language')
                .setRequired(true)),

    async execute(interaction) {
        const language = interaction.options.getString('language').toUpperCase();
        const serverId = interaction.guildId;

        // eslint-disable-next-line no-prototype-builtins
        if (languages.hasOwnProperty(language)) {
            await Server.upsert({
                serverId: serverId,
                defaultLanguage: language,
            });
            await interaction.reply('Set server default to ' + languages[language]);
        }
        else {
            await interaction.reply('Invalid input language');
        }
    },
};