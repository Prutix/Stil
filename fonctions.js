const Discord = require('discord.js');
const moment = require('moment');

/**
 * Convert millisecondes to time string
 * @param {Number} time Millisecondes to time to convert
 * @returns {String}
 */

function convertMs(time) {
    const tempTime = moment.duration(time);
    let timeString = "";

    if(tempTime.years() != 0) {
        timeString = `${timeString} ${tempTime.years()} Année${(tempTime.years() < 2 ? "" : "s")}`;
    };
    if(tempTime.months() != 0) {
        timeString = `${timeString} ${tempTime.months()} Mois`;
    };
    if(tempTime.days() != 0) {
        timeString = `${timeString} ${tempTime.days()} Jour${(tempTime.days() < 2 ? "" : "s")}`;
    };
    if(tempTime.hours() != 0) {
        timeString = `${timeString} ${tempTime.hours()} Heure${(tempTime.hours() < 2 ? "" : "s")}`;
    };
    if(tempTime.minutes() != 0) {
        timeString = `${timeString} ${tempTime.minutes()} Minute${(tempTime.minutes() < 2 ? "" : "s")}`;
    };
    if(tempTime.seconds() != 0) {
        timeString = `${timeString} ${tempTime.seconds()} Seconde${(tempTime.seconds() < 2 ? "" : "s")}`;
    };
    if(timeString == "") {
        timeString = `${timeString} ${tempTime.milliseconds()} Milliseconde${(tempTime.milliseconds() < 2 ? "" : "s")}`;
    };

    timeString = timeString.slice(1);

    return timeString;
};

/**
 * Get a channel with the id or a search
 * @param {Discord.Guild} guild The discord guild
 * @param {String | Number} search The search
 * @returns {Promise<Discord.Channel>}
 */

function getChannel(guild, search) {
    return new Promise(async function(resolve, reject) {
        if(!(guild instanceof Discord.Guild)) {
            reject("the \"guild\" param must be a discord guild");
        } else if(!search) {
            reject("you muste indicate a \"search\" argument");
        } else {
            let channel = null;

            if(isNaN(search)) {
                channel = guild.channels.resolve(search.slice(2, search.length - 1));
            } else {
                channel = guild.channels.resolve(search);
            };

            if(channel) {
                resolve(channel);
            } else {
                reject(`Channel "${search}" not found`);
            };
        };
    });
};

/**
 * Get a user
 * @param {Discord.Client} client Discord client
 * @param {String | Number} search The search of the user
 * @returns {Promise<Discord.User>}
 */

function getUser(client, search) {
    return new Promise(async function(resolve, reject) {
        if(client instanceof Discord.Client) {
            if(search != undefined) {
                let user = null;

                if(isNaN(search)) {
                    user = await client.users.fetch(search.slice(2, search.length - 1)).catch(err => {});
                } else {
                    user = await client.users.fetch(search).catch(err => {});
                };

                if(user) {
                    resolve(user);
                } else {
                    reject("User not found");
                };
            } else {
                reject("You must indicate a \"search\" value");
            };
        } else {
            reject("The parameter \"client\" must be a discord client");
        };
    });
};

async function execute(message, serverQueue) {
    const args = message.content.split(" "); // On récupère les arguments dans le message pour la suite

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) // Si l'utilisateur n'est pas dans un salon vocal
    {
            return message.channel.send(
                "Vous devez être dans un salon vocal!"
            );
    }
    const permissions = voiceChannel.permissionsFor(message.client.user); // On récupère les permissions du bot pour le salon vocal
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) { // Si le bot n'a pas les permissions
            return message.channel.send(
                "J'ai besoin des permissions pour rejoindre le salon et pour y jouer de la musique!"
            );
    }

    const songInfo = await ytdl.getInfo(args[1]);
    const song     = {
            title: songInfo.videoDetails.title,
            url  : songInfo.videoDetails.video_url,
    };

    if (!serverQueue) {
            const queueConstruct = {
                    textChannel : message.channel,
                    voiceChannel: voiceChannel,
                    connection  : null,
                    songs       : [],
                    volume      : 1,
                    playing     : true,
            };

            // On ajoute la queue du serveur dans la queue globale:
            queue.set(message.guild.id, queueConstruct);
            // On y ajoute la musique
            queueConstruct.songs.push(song);

            try {
                    // On connecte le bot au salon vocal et on sauvegarde l'objet connection
                    var connection           = await voiceChannel.join();
                    queueConstruct.connection = connection;
                    // On lance la musique
                    play(message.guild, queueConstruct.songs[0]);
            }
            catch (err) {
                    //On affiche les messages d'erreur si le bot ne réussi pas à se connecter, on supprime également la queue de lecture
                    console.log(err);
                    queue.delete(message.guild.id);
                    return message.channel.send(err);
            }
    }
    else {
            serverQueue.songs.push(song);
            console.log(serverQueue.songs);
            return message.channel.send(`${song.title} has been added to the queue!`);
    }

}

module.exports = {
    convertMs,
    getChannel,
    getUser
};
