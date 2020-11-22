const Command = require('../../base/Commands');
const {MessageEmbed} = require('discord.js')

class Help extends Command {
    static cooldown = 0;
    static file = __filename;
    static name = "help";
    static help = {};
    static perm = {
        user: [],
        bot: []
    };

    doRun() {
        const helpEmbed = new MessageEmbed()
        helpEmbed
            .setTitle('Help')
            .setColor(0xCD2020)
            .setFooter('Bot by Prutix_666#6476')
            .setDescription('Prefix : `?`')
            .addField('Modération', '**`kick @user` : permet de kick un utilisateur du serveur discord. \n`ban @user` : permet de bannir un utilisateur de ce serveur. \n`mute @user` : permet de rendre muet un utilisateur. \n`unmute @user` permet de rendre la parole a un utilisateur. \n`clear [nombre]` : permet de nettoyer un channel.**', false)
            .addField('Informations', '**`botinfo` : permet d\'afficher les informations relatives au bot.\n`userinfo` : permet d\'afficher les informations d\'utilisateur**', false)
            .addField('Musique', '**`play [lien youtube]` : permet de lancer une musique\n`stop` : permet d\'arreter la musique en cours\n`skip` : permet de passer a la prochaine musique**')
            .addField('Autres', '**`ping` : permet d\'afficher le ping du bot \n**', false)
        this.message.channel.send(helpEmbed)
    };
};

Command.register(Help);