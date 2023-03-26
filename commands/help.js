const { EmbedBuilder, SlashCommandBuilder, Integration, Client } = require('discord.js');
const { Data } = require('../MongoDb/Models/Schema');
const { color } = require('../config.json');
const fs = require('node:fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Bot commands info')
    .setDMPermission(false),

  async execute(interaction,client) {

    const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    const embed = new EmbedBuilder();

    embed.setTitle(`Activated Commands (${commands.length})`);
    embed.setDescription(`
    • \`/setup\`: Bot setup command!
    • \`/send\`: Message specific user/channel. Admin only.
    • \`/clear\`: Clear database
    • \`/info\`: Information about the bot
    • \`/ping\`: Ping the bot
  `);
    embed.setColor(color);
    embed.setThumbnail(interaction.guild.iconURL({dynamic: true}));
    embed.setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

    return interaction.reply({ embeds: [embed] });
  },
};