const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { color } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Ping the bot')
        .setDMPermission(false),

    async execute(interaction,client) {

        let embed = new EmbedBuilder()

        const pingTime = Math.round(client.ws.ping);
        const messageTime = Math.abs(Date.now() - interaction.createdTimestamp);
        embed.setDescription(`> **Bot API: ${pingTime}ms Message: ${messageTime}ms**`);
        embed.setColor(color)

        await interaction.reply({embeds : [embed]});
    },
};