const Command = require('../../base/Commands.js');

class Mute extends Command {
    static cooldown = 0;
    static file = __filename;
    static help = {};
    static name = "mute";
    static perm = {
        user: ["MANAGE_ROLES"],
        bot: ["MANAGE_ROLES"]
    };

    async doRun() {
        const message = this.message;
        const user = message.mentions.users.first()
        const role = message.guild.roles.cache.find(r => r.name === "Muted")
        if(!role) {
            message.guild.roles.create({ "data": { "name": "Muted" }}).then(role => {
                message.guild.channels.cache.each(chnl => chnl.createOverwrite(role, {'SEND_MESSAGES': false}));
            });
        }
        if(user) {
            const member = message.guild.member(user)
            member.roles.add(role)
            message.channel.send(`**Le droit de parole de ${member.user.tag} a été retiré avec succès.** :white_check_mark:`)
        }
        else {
            message.channel.send("**Vous devez préciser un utilisateur !** :x:")
        }
    };
};

Command.register(Mute);
