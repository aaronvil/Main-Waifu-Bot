/**
 * Created by ajvil_000 on 10/2/2017.
 *
 * This is a discord bot
 */

/*
 A ping pong bot, whenever you send "ping", it replies "pong".
 */

// Import the discord.js module
const Discord = require('discord.js');

// Import config files for the bot.
const config = require("./config.json");

// Import file system
const fs = require("fs");

// Create an instance of a Discord client
const client = new Discord.Client();

// Reads data from exp.json file
let points = JSON.parse(fs.readFileSync("exp.json", "utf8"));

// Designate prefix from config file
const prefix = config.prefix;

/**
 * Event that means that your bot will start reactign to information from Discord _after_ ready is emitted.
 * This is vital for making the bot work.
 */
client.on('ready', () => {
    console.log('I am ready!');
});

/**
 * Event listener that looks at messages.
 * Checks whether or not the message starts with the prefix.
 * If false, then just update users experience and update exp.json,
 * else will run a command and output result.
 */
// TODO: Make work so exp is different between servers
client.on('message', message => {
var commands;
//Checks cases that if true disregard commands
if (message.author.bot) return;

//Checks whether a command is being called or not.
if (!message.content.startsWith(prefix))
{
    commands = 0;
}
else commands = 1;

let userData = points[message.author.id];
userData.points++;

if (!points[message.author.id]) points[message.author.id] = {
    points: 0,
    level: 0
};

let curLevel = Math.floor(0.1 * Math.sqrt(userData.points));
if (curLevel > userData.level) {
    // Level up!
    userData.level = curLevel;
    message.reply(`You"ve leveled up to level **${curLevel}**! Ain"t that dandy?`);
}

if(commands === 1) {
    // TODO: Add more command that the bot can do.
    // TODO: Make separate handler to handle commands.
    switch (message.content) {
        case prefix + "ping":
            message.channel.send('pong');
            break;
        case prefix + "level":
            //Embedded message to state users level and experience
            message.channel.send({
                embed: {
                    color: 3447003,
                    author: {
                        name: client.user.username,
                        icon_url: client.user.avatarURL
                    },
                    title: "LEVEL INFO",
                    description: `LVL: ${userData.level} \nEXP: ${userData.points}`,
                    timestamp: new Date(),
                    footer: {
                        icon_url: client.user.avatarURL,
                    }
                }
            });
            break;
        case  prefix + "faq":
            message.channel.send('Q: Who are we \nA: We are a club at University of Hawaii at Manoa');
            message.channel.send('Q: What are the rules \nA: Check out #rules');
            message.channel.send('Q: Can you be my waifu \nA: No');
            break;
        case prefix + "commands":
            message.channel.send('Available commands \n!ping\n!faq');
            break;
    }
}

fs.writeFile("exp.json", JSON.stringify(points), (err) => {
    if (err) console.error(err)
});

});

/**
 * Event that sets what the bot is doing
 */
client.on('ready', () => {
    client.user.setGame("Reading Doujinshi");
});


/**
 * Event listener that will send a message in general when a new user joins.
 */
client.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.find('name', 'general');
// Do nothing if the channel wasn't found on this server
if (!channel) return;
// Send the message, mentioning the member
channel.send(`${member} has joined. Your soul is now mine`);
});

/**
 * Event listner that will send a message in general when a user leaves.
 */
client.on('guildMemberRemove', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.find('name', 'general');
// Do nothing if the channel wasn't found on this server
if (!channel) return;
// Send the message, mentioning the member
channel.send(`${member} has left. I guess you can have your soul back`);
});

// TODO: Make function that logs out the bot when app is closed.


/**
 * Log in the bot.
 */
client.login(config.token);