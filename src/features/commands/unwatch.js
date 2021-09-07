const { SlashCommandBuilder } = require('@discordjs/builders'),
      db = require('../../db');

module.exports = {
    type: 'slash',
    data: new SlashCommandBuilder()
        .setName('unwatch')
        .setDescription('Removes a keyword or all keywords that you have watched before.')
        .addStringOption(option =>
            option.setName('keyword')
                .setDescription('The keyword you will specifically unwatch.')
        ),
    async execute (client, interaction) {
        const keyword = interaction.options.getString("keyword", true);
        const server = interaction.guild;
        let watchedKeywordsCollection = db.getWatchedKeywords();
        const refreshWatchedCollection = () => (
             watchedKeywordsCollection = db.getWatchedKeywords()
        );
        if (keyword) {
           try {
             // remove one keyword
             db.removeWatchedKeyword1(interaction.member.id, server.id, keyword).then(resp => {
                 refreshWatchedCollection();
                 interaction.reply({ content: `Keyword "${keyword}" removed successfully.`, ephemeral: true });
             });
           } catch (error) {
              interaction.reply({ content: `Something went horribly wrong while removing keyword.`, ephemeral: true });
           }
         } else {
            try {
              db.removeWatchedKeyword(interaction.member.id, server.id).then(resp => {
                 refreshWatchedCollection();
                 interaction.reply({ content: `All keywords you have watched before has been removed successfully.`, ephemeral: true });
              });
            } catch (error) {
                 interaction.reply({ content: `Something went horribly wrong while removing all keywords.`, ephemeral: true });
            }
         }
    },
};
