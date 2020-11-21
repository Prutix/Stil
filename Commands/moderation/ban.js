const Command = require('../../base/Commands.js');
const fonctions = require('../../fonctions.js');

class Ban extends Command {
    static cooldown = 0;
    static file = __filename;
    static help = {};
    static name = "ban";
    static perm = {
        user: ["BAN_MEMBERS"],
        bot: ["BAN_MEMBERS"]
    };

    doRun() {
        const message = this.message;

        if(!message.member.hasPermission("BAN_MEMBERS")) {
            message.reply('**Vous n\'avez pas la permission pour executer cette commande !** :x:')
        } else {
            try {
                const user = message.mentions.users.first();
                if(user) {
                    const member = message.guild.member(user)
                    member
                        .ban()
                        .then(() => {
                            message.reply(`**${user.tag}, a été banni avec succès !** :white_check_mark:`)
                        })
                }
            }
            catch (e) {
                console.log(e)
            }
        }

    };
};

Command.register(Ban);
