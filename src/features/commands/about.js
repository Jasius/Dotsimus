const { SlashCommandBuilder } = require('@discordjs/builders'),
    { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js'),
    Topgg = require('@top-gg/sdk'),
    api = new Topgg.Api(process.env.TOPGG_TOKEN),
    fs = require('fs'),
    apiDateToTimestamp = (date) => {
        const dateObj = new Date(date);
        return Math.floor(dateObj.getTime() / 1000);
    };

module.exports = {
    type: 'slash',
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Find out more about Dotsimus.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('me')
                .setDescription('Shows general information about bot and its commands.'))
        .addSubcommand(subcommand => subcommand
            .setName('uptime')
            .setDescription('Shows how long bot stayed up since the last restart.'))
        .addSubcommand(subcommand => subcommand
            .setName('ping')
            .setDescription('Shows bots latency.'))
        .addSubcommand(subcommand => subcommand
            .setName('restart')
            .setDescription('⚠️ [Owner command] Restarts the bot.'))
        .addSubcommand(subcommand => subcommand
            .setName('usage')
            .setDescription('Shows how many times commands were used and when they were used last.')),
    async execute (client, interaction) {
        switch (interaction.options.getSubcommand()) {
            case 'me':
                const guilds = await client.guilds.cache,
                    addUpJSONData = (data) => {
                        let total = 0;
                        for (let i = 0; i < data.length; i++) {
                            total += data[i];
                        }
                        return total;
                    },
                    buttonsRow = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setLabel('Join Dotsimus Server')
                                .setURL('https://discord.gg/XAFXecKFRG')
                                .setStyle('LINK'),
                            new MessageButton()
                                .setLabel('Get Dotsimus')
                                .setURL('https://Dotsimus.com')
                                .setStyle('LINK')
                        ),
                    embedResponse = new MessageEmbed()
                        .setTitle('Dotsimus and its functionality')
                        .setDescription(`Dotsimus is a machine learning powered chat moderation bot, its primary goal is to help monitor, protect the server while its secondary goal is to enhance user experience.`)
                        .setColor('#ffbd2e')
                        .addFields(
                            { name: 'Dotsimus servers', value: `${guilds.size}`, inline: true },
                            { name: 'Dotsimus users', value: `${new Intl.NumberFormat().format(addUpJSONData(guilds.map(guild => guild.memberCount)))}`, inline: true },
                            { name: 'Slash commands', value: 'You can see available slash commands and their use by typing `/` in the chat.', inline: false },
                            { name: '!watch', value: 'Sends a direct message to you whenever keyword that you track gets mentioned. \nUsage: `!watch <keyword>`' },
                            { name: '!repeat', value: 'Admin only command which repeats what you say. \nUsage: `!repeat <phrase>`' },
                            { name: '!dotprefix', value: 'Changes bot prefix. \nUsage: `!dotprefix <prefix>`' },
                            { name: 'Test change', value: "itsWindows11's test' }
                        );
                if (process.env.DEVELOPMENT !== 'true') api.postStats({
                    serverCount: guilds.size
                });
                interaction.reply({
                    type: 4,
                    embeds: [embedResponse],
                    components: [buttonsRow]
                });
                break;
            case 'uptime':
                const startupTimestamp = Math.round((Date.now() - client.uptime) / 1000);
                interaction.reply({
                    content: `Bot restarted <t:${startupTimestamp}:R>.`
                });
                break;
            case 'ping':
                const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
                interaction.editReply(`Websocket heartbeat: ${client.ws.ping}ms\nRoundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
                break;
            case 'restart':
                if (interaction.member.id === process.env.OWNER) {
                    interaction.reply('Restarting..').then(() => process.exit(0));
                } else {
                    interaction.reply({
                        content: 'You are not authorized to use this command.',
                        ephemeral: true
                    });
                }
                break;
            case 'usage':
                const analyticsFile = fs.readFileSync("./events.json", "utf8"),
                    parsedAnalytics = JSON.parse(analyticsFile),
                    usageEmbed = new MessageEmbed()
                        .setTitle('Dotsimus Commands usage')
                        .setFooter('Partial analytics collection started since August 20th, 2021.')
                        .setColor('#ffbd2e');
                parsedAnalytics.sort((a, b) => (a.used - b.used)).reverse()
                usageEmbed.addFields(parsedAnalytics.map((command, key) => {
                    return {
                        name: `${key + 1} - ${command.name}`,
                        value: `Used ${command.used > 1 ? `${command.used} times` : `${command.used} time`} | Last used <t:${apiDateToTimestamp(command.lastUsed)}:R>`,
                        inline: false
                    }
                }).slice(0, 25))
                interaction.reply({
                    embeds: [usageEmbed],
                    ephemeral: true
                });
                break;
            default:
                break;
        }
    },
};
