const Discord = require('discord.js');
const moment = require('moment');
const config = require('../config.json');
const functions = require('../fonctions.js');

class Command {
    /**
     * @param {Discord.Client} client Discord client
     * @param {Discord.Message} message Discord Message
     * @param {Array<String>} args The arguments of the command
     * @param {Number} receive The timestamp when the message is receive
     * @param {Map} queue
     */

    constructor(client, message, args, receive) {
        this.args = args;
        this.client = client;
        this.message = message;
        this.receive = receive;
    };

    run(klass) {
        const permBot = new Array();
        const permUser = new Array();

        klass.perm.bot.forEach((perm) => {
            if(!this.message.channel.permissionsFor(this.client.user).has(perm)) {
                permBot.push(perm);
            };
        });

        klass.perm.user.forEach((perm) => {
            if(perm == "TEAM") {
                let permVerif = false;
                config.devId.forEach((devId) => {
                    if(devId == this.message.author.id) {
                        permVerif = true;
                    };
                });

                if(permVerif == false) {
                    permUser.push(perm);
                };
            } else if(perm == "OWNER") {
                if(config.ownerId != this.message.author.id) {
                    permUser.push(perm);
                };
            } else {
                if(!this.message.member.hasPermission(perm)) {
                    permUser.push(perm);
                };
            };
        });

        if(permBot.length != 0) {
            if(permBot.includes("SEND_MESSAGES")) return;
            this.message.channel.send(`\`\`Erreur:\`\` **Il me manque les permissions suivantes pour executer la commande: \`\`${permBot.join(" ")}\`\`** :x:`);
        } else if(permUser.length != 0) {
            this.message.channel.send(`\`\`Erreur:\`\` **Vous n'avez pas les permissions nécessaire pour executer cette commande ! Permissions manquantes : \`\`${permUser.join(" ")}\`\`** :x:`);
        } else {
            const thiss = this;
            catchError.call(thiss);
        };

        function catchError() {
            try {
                this.doRun.call(this);
            } catch (err) {
                if(err) {
                    console.error(err.stack);

                    this.message.channel.stopTyping();
                    this.message.channel.send(`\`\`Erreur:\`\` **Une erreur s'est produite durant l'exécution de la commande** :x:`);
                };
            };
        };
    };

    doRun() {
        try {
            this.message.channel.send(`\`\`Erreur:\`\` **La commande ${this.name} n'a pas de code** :x:`);
            throw new Error(`La commande ${this.name} n'a pas de code executable`);
        } catch (err) {
            if (err) {
                console.error(err);
            };
        };
    };

    /**
     * @type {Discord.Collection<String, Command>}
     */

    static commands = new Discord.Collection();

    /**
     * Run a command with her name
     * @param {String} name The name of the command
     * @param {Discord.Client} client Discord client
     * @param {Discord.Message} message The discord Message
     * @param {Array<String>} args The arguments
     * @param {Number} receive The timestamp when the message is receive
     */

    static runByName(name, client, message, args, receive) {
        const cmdClass = this.commands.get(name);
        if(cmdClass) {
            const cmd = new cmdClass(client, message, args, receive);
            cmd.name = name;
            cmd.run(cmdClass);
        };
    };

    static register(klass) {
        if(isNaN(klass.cooldown)) {
            klass.cooldown = 0;
        };

        if(klass.help === undefined) {
            klass.help = {
                desc: "Aucune description.",
                util: "",
                exems: []
            };
        } else {
            if(klass.help.desc === undefined) {
                klass.help.desc = "Aucune description.";
            };

            if(klass.help.util === undefined) {
                klass.help.util = "";
            };

            if(klass.help.exems === undefined) {
                klass.help.exems = [];
            };
        };

        if(klass.perm === undefined) {
            klass.perm = {
                user: [],
                bot: []
            };
        } else {
            if(klass.perm.user === undefined) {
                klass.permUser.user = [];
            };

            if(klass.perm.bot === undefined) {
                klass.perm.bot = [];
            };
        };

        if(klass.file === undefined) {
            console.error(`La commande ${klass.name} n'a pas de fichier.`);
            process.exit(1);
        } else {
            klass.perm.bot.push("SEND_MESSAGES");
            klass.perm.bot.forEach(function(perm) {
                if(!Object.keys(Discord.Permissions.FLAGS).includes(perm)) {
                    console.error(`${cmd.name} permission ${perm} n'existe pas (perm/bot).`);
                    process.exit(1);
                };
            });

            klass.perm.user.forEach(function(perm) {
                if(!Object.keys(Discord.Permissions.FLAGS).includes(perm)) {
                    if(perm != "OWNER" && perm != "TEAM") {
                        console.error(`${klass.name} permission ${perm} n'existe pas (perm/user).`);
                        process.exit(1);
                    };
                };
            });

            console.log(`La commande ${klass.name} s'est correctement enregistrer.`);
            this.commands.set(klass.name, klass);
        };
    };
};

module.exports = Command;
