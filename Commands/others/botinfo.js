const Command = require('../../base/Commands.js');
const {MessageEmbed} = require('discord.js')

class BotInfo extends Command {
    static cooldown = 0;
    static file = __filename;
    static name = "botinfo";
    static help = {};
    static perm = {
        user: [],
        bot: []
    };

    doRun() {
        const message = this.message;
        const client = this.client;
        const embed = new MessageEmbed()
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle('BotInfos')
            .setColor('#000000')
            .addFields(
                {
                    name: '🌐 Servers',
                    value: `Ce bot est présent sur ${client.guilds.cache.size} servers.`,
                    inline: false
                },
                {
                    name: '📺 Channels',
                    value: `Le bot est utilisé dans ${client.channels.cache.size} channels.`,
                    inline: false
                },
                {
                    name: '👥 Server Users',
                    value: `${client.users.cache.size} utilisateurs utilisent ce bot`,
                    inline: false
                },
                {
                    name: '⏳ Ping',
                    value: `${Math.round(client.ws.ping)}ms`,
                    inline: false
                },
                {
                    name: 'Join Date',
                    value: client.user.createdAt,
                    inline: false
                }
            )
        message.channel.send(embed)
    };
};

Command.register(BotInfo);