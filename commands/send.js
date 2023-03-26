const { ActionRowBuilder, EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const { Data } = require('../MongoDb/Models/Schema');
const { color } = require('../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send')
        .setDescription('Message specific user/channel. Admin only.')
        .setDMPermission(false),

    /**
     * 
     * @param {*} interaction 
     * @returns 
     */
    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: 'This action can only be performed by administrators.', ephemeral: true });
        }

        const FetchGuild = await Data.findOne({
            ServerID: interaction.guild.id,
        });

        if (FetchGuild == null) {
            return interaction.reply({ content: 'No data found, please run the /setup command.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle(FetchGuild.title || "التـقديـم لللأدارة")
            .setDescription('أضـغـط فـي الاسـفـل للتقـديـم')
            .setColor(color)
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Success)
                    .setLabel(FetchGuild.title || "التـقديـم لللأدارة")
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