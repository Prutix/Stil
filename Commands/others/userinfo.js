const Command = require('../../base/Commands.js');
const moment = require('moment')
const {MessageEmbed} = require('discord.js')

class UserInfo extends Command {
    static cooldown = 0;
    static file = __filename;
    static name = "userinfo";
    static help = {};
    static perm = {
        user: [],
        bot: []
    };

    doRun() {
        const message = this.message;
        const member = message.guild.member(message.author);
        const embed = new MessageEmbed()
        embed
            .setTitle(member.user.tag)
            .setFooter(`${moment(Date.now()).format("DD[/]MM[/]YYYY HH[:]mm[:]ss")}`)
            .setColor(0xCD2020)
            .addField('Informations : ', `**Compte creer le ${member.user.createdAt}**\n**A rejoins le serveur le ${message.guild.member(message.author).joinedAt}**`)
        message.channel.send(embed)
    };
};

Command.register(UserInfo);