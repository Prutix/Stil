const Command = require('../../base/Commands.js');
const {MessageEmbed} = require('discord.js');
const fonctions = require('../../fonctions');

class Clear extends Command {
    static cooldown = 0;
    static file = __filename;
    static name = "clear";
    static help = {};
    static perm = {
        user: ["MANAGE_MESSAGES"],
        bot: ["MANAGE_MESSAGES"]
    };

    doRun() {
        const message = this.message;

        const channel = message.channel;

        const args = this.args
        
        if (!message.member.permissions.has("MANAGE_MESSAGES"))
            return message.channel.send(
                `You do not have correct permissions to do this action, ${message.author.username}`
            );
        if (!args[0]) {
            return message.channel.send(`Please enter a amount 1 to 100`)
        }

        let deleteAmount;

        if (parseInt(args[0]) > 100 ) {
            deleteAmount = 99;
        } else {
            deleteAmount = parseInt(args[0]);
        }

        message.channel.bulkDelete(deleteAmount + 1, true);

        const embed = new MessageEmbed()
            .setTitle(`${message.author.username}`)
            .setDescription(`${deleteAmount} messages ont été supprimé !`)
            .setFooter(message.author.username, message.author.displayAvatarURL())
            .setColor('#f2f2f2')
        message.channel.send(embed)
    };
};

Command.register(Clear);