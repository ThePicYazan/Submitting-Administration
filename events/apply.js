const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, Client, Events, ButtonBuilder, ButtonStyle } = require("discord.js")
const { Data } = require('../MongoDb/Models/Schema');
const { color } = require('../config.json')

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {

        const FetchGuild = await Data.findOne({
            ServerID: interaction.guild.id,
        });

        if (interaction.isButton()) {
            if (interaction.customId === 'apply') {
                const modal = new ModalBuilder()
                    .setTitle('التـقديـم لللأدارة')
                    .setCustomId('staff_apply')
                const nameComponent = new TextInputBuilder()
                    .setCustomId('q1')
                    .setLabel(`${FetchGuild.q1}`)
                    .setMinLength(2)
                    .setMaxLength(25)
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                const ageComponent = new TextInputBuilder()
                    .setCustomId('q2')
                    .setLabel(`${FetchGuild.q2}`)
                    .setMinLength(1)
                    .setMaxLength(2)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                const whyYou = new TextInputBuilder()
                    .setCustomId(`q3`)
                    .setLabel(`${FetchGuild.q3}`)
                    .setMinLength(2)
                    .setMaxLength(120)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                const q4 = new TextInputBuilder()
                    .setCustomId('q4')
                    .setLabel(`${FetchGuild.q4}`)
                    .setMaxLength(400)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                const q5 = new TextInputBuilder()
                    .setCustomId('q5')
                    .setLabel(`${FetchGuild.q5}`)
                    .setMaxLength(400)
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                const rows = [nameComponent, ageComponent, whyYou, q4, q5].map(
                    (component) => new ActionRowBuilder().addComponents(component)
                )
                modal.addComponents(...rows);
                interaction.showModal(modal);
            }

            if (interaction.customId === 'staff_accept') {

                const newDisabledRow = new ActionRowBuilder()
                    .setComponents(
                        new ButtonBuilder()
                            .setCustomId('staff_accept_ended')
                            .setDisabled()
                            .setStyle(ButtonStyle.Success)
                            .setLabel('قبول')
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('staff_deny_ended')
                            .setDisabled()
                            .setStyle(ButtonStyle.Danger)
                            .setLabel('رفض')
                    )
                await interaction.message.edit({ components: [newDisabledRow] })
            }
            if (interaction.customId === 'staff_deny') {

                const newDisabledRow = new ActionRowBuilder()
                    .setComponents(
                        new ButtonBuilder()
                            .setCustomId('staff_accept_ended')
                            .setDisabled()
                            .setStyle(ButtonStyle.Success)
                            .setLabel('قبول')
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('staff_deny_ended')
                            .setDisabled()
                            .setStyle(ButtonStyle.Danger)
                            .setLabel('رفض')
                    )
                await interaction.message.edit({ components: [newDisabledRow] })
            }
        }
        if (interaction.isModalSubmit()) {
            if (interaction.customId === 'staff_apply') {
                const q1 = interaction.fields.getTextInputValue('q1');
                const q2 = interaction.fields.getTextInputValue('q2');
                const q3 = interaction.fields.getTextInputValue('q3');
                const q4 = interaction.fields.getTextInputValue('q4');
                const q5 = interaction.fields.getTextInputValue('q5');

                const staffSubmitChannel = interaction.guild.channels.cache.get(FetchGuild.staffroom);
                if (!staffSubmitChannel) return;
                const embed = new EmbedBuilder()
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                    .setColor(color)
                    .setFooter({ text: interaction.user.id })
                    .setTimestamp()
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .addFields(
                        {
                            name: `${FetchGuild.q1}`,
                            value: q1,
                            inline: true
                        },
                        {
                            name: `${FetchGuild.q2}`,
                            value: q2,
                            inline: true
                        },
                        {
                            name: `${FetchGuild.q3}`,
                            value: q3,
                            inline: true
                        },
                        {
                            name: `${FetchGuild.q4}`,
                            value: q4,
                            inline: true
                        },
                        {
                            name: `${FetchGuild.q5}`,
                            value: q5,
                            inline: true
                        }
                    )
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('staff_accept')
                            .setLabel('قبول')
                            .setStyle(ButtonStyle.Success)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('staff_deny')
                            .setLabel('رفض')
                            .setStyle(ButtonStyle.Danger)
                    )

                await staffSubmitChannel.send({
                    embeds: [embed],
                    components: [row]
                }).then(async (c) => {
                    return await interaction.reply({ content: `Done Sending your apply in <#${FetchGuild.staffroom}>`, ephemeral: true })
                })
            }

            client.on(Events.InteractionCreate, async interaction => {
                if (!interaction.isButton()) return;
                if (interaction.customId === 'staff_accept') {

                    const getIdFromFooter = interaction.message.embeds[0].footer?.text;
                    const getMember = await interaction.guild.members.fetch(getIdFromFooter);

                    await getMember.roles.add(FetchGuild.staffid);

                    await getMember.send({
                        content: `${FetchGuild.donesend || "✅ **تم قبولك في الادارة **"}`,
                        ephemeral: true
                    }).catch(er => null);
                    return await interaction.reply({ content: `تم قبول ${getMember} في الاداره`, ephemeral: true });
                }

                if (interaction.customId === 'staff_deny') {
                    const getIdFromFooter = interaction.message.embeds[0].footer?.text;
                    const getMember = await interaction.guild.members.fetch(getIdFromFooter);

                    await getMember.send({
                        content: `${FetchGuild.nomessage || ":x: نعتذر لقد تم رفضك لتقديم الأدارة."} ${getMember.user}.`
                    }).catch(er => null);
                    return await interaction.reply({ content: `تم رفض ${getMember} من الاداره`, ephemeral: true });
                }
            });
        }
    },
};