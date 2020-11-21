const Command = require('../../base/Commands');

class MembersCount extends Command {
    static cooldown = 0;
    static file = __filename;
    static name = "members";
    static help = {};
    static perm = {
        user: [],
        bot: []
    };

    doRun() {
        const message = this.message;
        const members = message.guild.memberCount
        console.log(members)
    };
};

Command.register(MembersCount);