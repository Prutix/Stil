const Command = require('../../base/Commands.js');

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
        
    };
};

Command.register(Clear);