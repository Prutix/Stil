const Command = require('../../base/Commands');

class Ping extends Command {
    static cooldown = 0;
    static file = __filename;
    static name = "ping";
    static help = {};
    static perm = {
        user: [],
        bot: []
    };

    doRun() {
        const start = Date.now();
        this.message.channel.send(`\`\`En cours:\`\` **Calcul du ping...** :hourglass:`)
            .then(msg => {
                msg.edit(`\`\`Temps de latence:\`\` ${Date.now() - start} ms`);
            });
    };
};

Command.register(Ping);