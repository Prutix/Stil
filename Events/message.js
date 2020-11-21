const Discord = require('discord.js');
const Command = require('../base/Commands.js');
const config = require('../config.json');
const ytdl = require('ytdl-core')
const ytdlgetinfo = require('ytdl-getinfo');
const { getInfo } = require('ytdl-getinfo');
const type = "message";

/**
 * The run function
 * @param {Discord.Client} client Discord client
 * @param {Discord.Message} message Discord message
 */

const queue = new Map();

function run(client, message) {
    if(message.guild) {
        if(message.content.startsWith(config.prefix)) {
            const args = message.content.slice(config.prefix.length).split(/ +/g);
            const cmd = args.shift();
            Command.runByName(cmd, client, message, args, Date.now());
        } else if(message.content.startsWith(`<@!${client.user.id}>`)) {
            const args = message.content.slice(`<@!${client.user.id}>`.length).split(/ +/g);
            const cmd = args.shift();
            Command.runByName(cmd, client, message, args, Date.now());
        };
    };
    const serverQueue = queue.get(message.guild.id);

    if (message.content.startsWith(`?play`)) {
        try {
            execute(message, serverQueue);
            return
        } catch (error) {
            console.error(error)
        }
    }
    else if (message.content.startsWith(`?skip`)) {
        skip(message, serverQueue);
        return;
    }
    else if (message.content.startsWith(`?stop`)) {
            stop(message, serverQueue);
            return;
    }
};

async function execute(message, serverQueue) {
    try {
        const args = message.content.split(" "); 

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
    {
            return message.channel.send(
                "Vous devez être dans un salon vocal!"
            );
    }
    const permissions = voiceChannel.permissionsFor(message.client.user); 
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) { 
            return message.channel.send(
                "J'ai besoin des permissions pour rejoindre le salon et pour y jouer de la musique!"
            );
    }

    /**
     * @param {ytdlgetinfo.getInfo} info song info
     */

    const songInfo = await ytdl.getInfo(args[1])
    const song     = {
            title: songInfo.videoDetails.title,
            url  : songInfo.videoDetails.video_url,
    };
    console.log(song)
    if (!serverQueue) {
            const queueConstruct = {
                    textChannel : message.channel,
                    voiceChannel: voiceChannel,
                    connection  : null,
                    songs       : [],
                    volume      : 1,
                    playing     : true,
            };

            queue.set(message.guild.id, queueConstruct);
            queueConstruct.songs.push(song);

            try {
                    var connection           = await voiceChannel.join();
                    queueConstruct.connection = connection;
                    play(message.guild, queueConstruct.songs[0]);
            }
            catch (err) {
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
    } catch (error) {
        message.channel.send('**Impossible de lancer la musique !** :x:')
    }
    

}

function skip(message, serverQueue) {
    if (!message.member.voice.channel) 
    {
            return message.channel.send(
                "Vous devez être dans un salon vocal pour passer une musique!"
            );
    }
    if (!serverQueue) 
    {
            return message.channel.send("Aucune lecture de musique en cours !");
    }
    serverQueue.connection.dispatcher.end(); 
}

function stop(message, serverQueue) {
    if (!message.member.voice.channel) 
    {
            return message.channel.send(
                "Vous devez être dans un salon vocal pour stopper la lecture!"
            );
    }
    if (!serverQueue) 
    {
            return message.channel.send("Aucune lecture de musique en cours !");
    }
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
    console.log(song);
    const serverQueue = queue.get(guild.id); 
    if (!song) {
            serverQueue.voiceChannel.leave();
            queue.delete(guild.id);
            return;
    }
    const dispatcher = serverQueue.connection
        .play(ytdl(song.url, { filter: 'audioonly' }))
        .on("finish", () => { 
                serverQueue.songs.shift();
                play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolume(1);
    serverQueue.textChannel.send(`Démarrage de la musique: **${song.title}**`);
}

module.exports = {
    type,
    run
};