const { PermissionsBitField, ActionRowBuilder, EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const { Data } = require('../MongoDb/Models/Schema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send')
        .setDescription('..')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ,
    async execute(interaction) {

        const FetchGuild = await Data.findOne({
            ServerID: interaction.guild.id,
        });

        if (FetchGuild == null) return false;

        const embed = new EmbedBuilder()
            .setTitle(test || "yes")
            .setDescription('أضـغـط فـي الاسـفـل للتقـديـم')
            .setColor(color || "Aqua")
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Success)
                    .setLabel(test || "yes")
                    .setCustomId('apply')
            )

        const channel = interaction.guild.channels.cache.get(FetchGuild.applyroom);
        if (!channel) return;
        await channel.send({
            embeds: [embed],
            components: [row]
        });

       return await interaction.reply({ content: `Done sending to ${channel.name}`, ephemeral: true });
    },
};