const { ChannelType, Interaction, Client, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { Data } = require('../MongoDb/Models/Schema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDMPermission(false)
        .setDescription('Bot setup command!')

        //تحديد رومات
        .addChannelOption(channel => channel
            .setName('staffchannel')
            .addChannelTypes(ChannelType.GuildText)
            .setDescription('روم الادارة')
            .setRequired(true)
        )
        .addChannelOption(channel => channel
            .setName('memberchannel')
            .addChannelTypes(ChannelType.GuildText)
            .setDescription('شات ل يقدم الاعضو فية')
            .setRequired(true)
        )
        .addRoleOption(role => role
            .setName('rolemember')
            .setDescription('رتبة ل تجي ل عضو بس ينقبل')
            .setRequired(true)
        )

        //السألة
        .addStringOption(string => string
            .setName('q1')
            .setDescription('سوأل الاول')
            .setRequired(true)
        )
        .addStringOption(string => string
            .setName('q2')
            .setDescription('سوأل ثاني')
            .setRequired(true)
        )
        .addStringOption(string => string
            .setName('q3')
            .setDescription('سوأل ثالث')
            .setRequired(true)
        )
        .addStringOption(string => string
            .setName('q4')
            .setDescription('سوأل رابع')
            .setRequired(true)
        )
        .addStringOption(string => string
            .setName('q5')
            .setDescription('سوأل الخامس')
            .setRequired(true)
        )

        //رسالة البوت
        .addStringOption(string => string
            .setName('donesend')
            .setDescription('رسالة البوت عندك ارسال المسج')
            .setRequired(false)
        )
        .addStringOption(string => string
            .setName('nomessage')
            .setDescription('رسالة الرفض')
            .setRequired(false)
        )
        .addStringOption(string => string
            .setName('yesmessage')
            .setDescription('رسالة القبول')
            .setRequired(false)
        )

        .addStringOption(string => string
            .setName('titie')
            .setDescription('تايتل الامبيد')
            .setRequired(false)
        )
    ,

    /**
     * 
     * @param {Interaction} interaction 
     * @param {Client} client 
     */

    async execute(interaction, client) {

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: 'This action can only be performed by administrators.', ephemeral: true  });
        }

        const staff_channel = interaction.options.getChannel("staffchannel");
        const staff_member = interaction.options.getChannel("memberchannel");
        const staff_role = interaction.options.getRole("rolemember");
        const q1 = interaction.options.getString("q1");
        const q2 = interaction.options.getString("q2");
        const q3 = interaction.options.getString("q3");
        const q4 = interaction.options.getString("q4");
        const q5 = interaction.options.getString("q5");
        const donesend = interaction.options.getString("donesend");
        const nomessage = interaction.options.getString("nomessage");
        const yesmessage = interaction.options.getString("yesmessage");
        const titie = interaction.options.getString("titie");

        const FetchGuild = await Data.findOne({
            ServerID: interaction.guild.id,
        });

        //if (FetchGuild == null) return false;

        if (FetchGuild) {
            return interaction.reply({ content: 'Do you want to clear the data? \`\`/clear\`\`', ephemeral: true });
        } else {
            await Data.create({
                ServerID: interaction.guild.id,
                staffroom: staff_channel.id,
                applyroom: staff_member.id,
                staffid: staff_role.id,
                q1: q1,
                q2: q2,
                q3: q3,
                q4: q4,
                q5: q5,
                title: titie,
                donesend: donesend,
                yesmessage: yesmessage,
                nomessage: nomessage
            });
            return interaction.reply({ content: 'Done Creating Data', ephemeral: true });
        }
    },
};