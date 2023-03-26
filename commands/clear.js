const { SlashCommandBuilder, Integration, PermissionFlagsBits } = require('discord.js');
const { Data } = require('../MongoDb/Models/Schema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear database')
        .setDMPermission(false),

    /**
     * 
     * @param {Integration} interaction 
     * @returns 
     */

    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: 'This action can only be performed by administrators.', ephemeral: true });
        }

        const FetchData = await Data.findOne({
            ServerID: interaction.guild.id
        });

        if (FetchData) {
            await Data.deleteMany({
                ServerID: interaction.guild.id,
            });
            return await interaction.reply({ content: 'Data for this server has been successfully deleted.', ephemeral: true });
        } else {
            return await interaction.reply({ content: 'There is no data to delete.', ephemeral: true });
        }
    },
};