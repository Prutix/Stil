const Discord = require ("discord.js");
const config = require('../config.json');
const type = "ready";

/**
 *
 * @param {Discord.Client} client
 */

function run (client) {
    console.log (`${client.user.tag} est en ligne sur ${client.guilds.cache.size} server`);
    client.channels.cache.get(config.channels["dev-zone"]).send(`**${client.user.tag}** viens de se réveiller ! :wink:`);
    client.channels.cache.get(config.channels["dev-zone"]).send(`Je suis en ligne sur ${client.guilds.cache.size} serveurs !`);
    client.user.setActivity(".help | By Prutix_666#6476", {type: "WATCHING"});
};

module.exports = {
    type,
    run
};
