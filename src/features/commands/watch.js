const { SlashCommandBuilder } = require('@discordjs/builders'),
      db = require('../../db');

module.exports = {
    type: 'slash',
    data: new SlashCommandBuilder()
        .setName('watch')
        .setDescription('Sends a direct message whenever keyword that you track gets mentioned.')
        .addStringOption(option =>
            option.setName('keyword')
                .setDescription('The keyword you track.')
                .setRequired(true)
        ),
    async execute (client, interaction) {
        const keyword = interaction.options.get("keyword");
        const server = interaction.guild;
        let watchedKeywordsCollection = db.getWatchedKeywords();
        const refreshWatchedCollection = () => (
             watchedKeywordsCollection = db.getWatchedKeywords()
        );
        if (keyword.length < 3) {
          interaction.reply({ content: `Keyword ${keyword} cannot be watched because the keyword has fewer than 3 characters.`, ephemeral: true });
        } else {
          /*try {
            db.watchKeyword(interaction.member.id, server.id, keyword.toLowerCase()).then(resp => {
              refreshWatchedCollection().then(resp => db.getWatchedKeywords(message.author.id, server.id).then(keywords => {
                const list = keywords[0].watchedWords.length === 6 ? keywords[0].watchedWords.slice(1) : keywords[0].watchedWords;
                interaction.reply({ content: `Keyword tracked successfully.`, ephemeral: true });
                const userToDM = client.users.cache.get(interaction.member.user.id);
                userToDM.send(`\`${keyword}\` keyword tracking is set up successfully on **${server.name}** server.\nCurrently tracked server keywords:\n${list.map((keyword, index) => `${index + 1}. ${keyword} \n`).join('')}\nYou can track up to 5 keywords.`);
              }))
            });
          } catch (error) {
            interaction.reply({ content: `You must allow direct messages from members in this server for this feature to work.\nEnable direct messages in **Privacy Settings > Allow direct messages from server members**.`, ephemeral: true });
          }*/
          interaction.reply({ content: `Successfully watched test.`, ephemeral: true });
        }
    },
};
