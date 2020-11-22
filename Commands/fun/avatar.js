const Command = require('../../base/Commands.js');
const {MessageEmbed} = require('discord.js')

class Avatar extends Command {
    static cooldown = 0;
    static file = __filename;
    static help = {};
    static name = "avatar";
    static perm = {
        user: [],
        bot: []
    };

    async doRun() {
        const message = this.message;

        const embed = new MessageEmbed()
            .setThumbnail(message.author.displayAvatarURL())
        
        message.channel.send(embed)
    };
};

Command.register(Avatar);