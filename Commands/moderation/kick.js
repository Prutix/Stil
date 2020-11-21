const Command = require('../../base/Commands');

class Kick extends Command {
    static cooldown = 0;
    static file = __filename;
    static name = "kick";
    static help = {};
    static perm = {
        user: ["KICK_MEMBERS"],
        bot: ["KICK_MEMBERS"]
    };

    doRun() {
        const message = this.message;
        const user = message.mentions.users.first();
        if(!user)
        {
            message.channel.send("**Vous devez indiquer un utilisateur ! **");
            return
        }
        else
        {
            const member = message.guild.member(user)
            member
                .kick()
                .then(() => {
                    message.channel.send(`**L'utilisateur ${user.tag} a été kick avec succès !** :white_check_mark:`)
                })
        }
    };
};

Command.register(Kick);