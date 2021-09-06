const { SlashCommandBuilder } = require('@discordjs/builders'),
      db = require('../../db');

module.exports = {
    type: 'slash',
    data: new SlashCommandBuilder()
        .setName('unwatch')
        .setDescription('Removes a keyword or all keywords that you have watched before.')
        .addStringOption(option =>
            option.setName('keyword')
                .setDescription('The keyword you will untrack, if keyword is unspecified then Dotsimus will remove all of your tracked keywords.')
        ),
    async execute (client, interaction) {
        const keyword = interaction.options.getString("keyword");
        const server = interaction.guild;
        let watchedKeywordsCollection = db.getWatchedKeywords();
        const refreshWatchedCollection = () => (
             watchedKeywordsCollection = db.getWatchedKeywords()
        );
        if (keyword) {
           try {
             db.removeWatchedKeyword(interaction.member.id, server.id).then(resp => {
                 refreshWatchedCollection();
                 interaction.reply({ content: `Keyword removed successfully.`, ephemeral: true });
             });
           } catch (error) {
              interaction.reply({ content: `Something went horribly wrong while removing keyword.`, ephemeral: true });
           }
         }
       }
    },
};
