const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const fs = require("fs");
const boxen = require("boxen");
const moment = require("moment");
const chalk = require("chalk");

console.stdlog = console.log;
console.stdwarn = console.warn;
console.stderr = console.error;
console.logs = new Array();

console.log = function() {
    const args = Object.values(arguments);
    const msg = (`[${moment(Date.now()).format("DD[/]MM[/]YYYY HH[:]mm[:]ss")}] [Log  ]: ${args.join(" ")}`).replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
    console.logs.push({msg: msg, type: "log"});
    console.stdlog(chalk.green(msg));
};

console.warn = function() {
    const args = Object.values(arguments);
    const msg = (`[${moment(Date.now()).format("DD[/]MM[/]YYYY HH[:]mm[:]ss")}] [Warn ]: ${args.join(" ")}`).replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
    console.logs.push({msg: msg, type: "warn"});
    console.stdwarn(chalk.hex("#f3af22")(msg));
};

console.error = function() {
    const args = Object.values(arguments);
    const err = new Error(args.join(" "));
    const msg = `[${moment(Date.now()).format("DD[/]MM[/]YYYY HH[:]mm[:]ss")}] [Error]:`;

    console.logs.push({type: "error", text: `${msg}
${String(boxen(err.stack), {padding: 1})}`});

    console.stderr(`${chalk.red(msg)}
${boxen(chalk.red(err.stack), {borderColor: "red", padding: 1})}`);
};

fs.readdir("./Events", function(err, files) {
    if(err) {
        console.error(err);
    } else {
        files = files.filter(file => file.endsWith(".js"));
        console.log(`${files.length} évenement trouvé`);

        files.forEach (function (file){
            console.log(`${file} évenement chargé`);
            const event = require(`./Events/${file}`);

            client.on(event.type, function(...args) {
                event.run(client,...args);
            });
        });
    };
});

fs.readdir("./Commands", function(err, dirs) {
    if(err) {
        console.error(err);
    } else {
        dirs.forEach(function(dir) {
            fs.readdir(`./Commands/${dir}`, function(err, files) {
                if(err) {
                    console.error(err);
                } else {
                    files = files.sort(file => file.endsWith(".js"));

                    files.forEach(function(file) {
                        require(`./Commands/${dir}/${file}`);
                    });
                };
            });
        });
    };
});

client.login(config.token);
