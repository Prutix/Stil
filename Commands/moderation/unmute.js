const Command = require('../../base/Commands.js');
const { Client, MessageEmbed } = require('discord.js');

class Mute extends Command {
    static cooldown = 0;
    static file = __filename;
    static help = {};
    static name = "unmute";
    static perm = {
        user: ["MANAGE_ROLES"],
        bot: ["MANAGE_ROLES"]
    };

    async doRun() {
        const message = this.message;
        const user = message.mentions.users.first()
        const member = message.guild.member(user)
        const role = member.roles.cache.find(r => r.name === "Muted")
        if(!role) {
            message.reply('**Cet utilisateur ne possède pas le role "Muted" !** :x:');
            return;
        } else {
            message.channel.send(`**${user.tag} a récuperer son droit de parole avec succès !** :white_check_mark:`);
            member.roles.remove(role)
        }
    };
};

Command.register(Mute);
