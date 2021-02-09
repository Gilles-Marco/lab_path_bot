const Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client();
const reddit = require('./reddit');
const moment = require('moment')
const guildManager = require('./guildManager')
const https = require('https')

//Connect to reddit
const reddit_client = new reddit.RedditClient(
    process.env.REDDIT_USERNAME, 
    process.env.REDDIT_PASSWORD, 
    process.env.REDDIT_CLIENT, 
    process.env.REDDIT_SECRET
);

//Use to let the discord server configure how the bot interact with them
const guildConfig = new guildManager.GuildManager()

//Handler to manager how to treat posts from /r/Lab_path
let labpath_ids = []
function lab_path_handler(posts){
    //Clean labpath_ids
    let post_ids = posts.map(post => post.id)
    labpath_ids.forEach(id => {
        if(!post_ids.includes(id)) labpath_ids.splice(labpath_ids.indexOf(id), 1)
    })

    //Determine if the posts is new or had not been already treated
    let yesterday = moment().subtract(1, 'd')
    posts.forEach((post)=>{
        if(!moment(post.creationDate).isBefore(yesterday) && !labpath_ids.includes(post.id)){
            labpath_ids.push(post.id)
            let message = new Discord.MessageEmbed()
                .setTitle(post.title)
                .setURL(post.link)
                .setDescription(post.content)
                .setImage(post.image)
                .addFields(
                    {name: "Subreddit", value: "r/Lab_path", inline: true}, 
                    {name: "Reddit author", value: post.author, inline: true}, 
                    {name: "Orignal link", value: post.link}
                )
                .setFooter(`Posted at ${moment(post.creationDate).format('YYYY-MM-DD hh:mm')}`)
            client.guilds.cache.forEach(server => {
                let default_channel = guildConfig.getDefaultChannelOutput(server.id)
                if (!default_channel){
                    default_channel = server.channels.cache.find((channel)=>{
                        if(channel.isText()) return channel.name
                    })
                    default_channel = default_channel.name
                }

                if(default_channel){
                    let c = server.channels.cache.find((channel)=>{
                        if(channel.name == default_channel)
                            return channel;
                    })
                    if(c){
                        c.send('A new lab path has been published !')
                        c.send(message)
                    }
                }
            })
        }
    })
}

//Helpers command for this bot
function helpers_command(){
    return `\nAvailable command
    \tlab_path_bot set_channel_ouptut <channel_name>
    `;
}

client.on('ready', ()=>{
    console.log(`logged in as ${client.user.tag}`);
    reddit_client.subscribeToSubReddit('Lab_path', lab_path_handler)
});

client.on('message', (msg)=>{
    if (msg.content.startsWith('lab_path_bot')) {
        let tokens = msg.content.split(' ')
        if(tokens.length < 2){
            msg.reply(helpers_command())
        }
        else{
            switch(tokens[1]){
                case "set_channel_output":
                    guildConfig.setDefaultChannelOutput(msg.guild.id, tokens[2])
                    msg.reply(`Discord Server "${msg.guild.name}" identified by the id ${msg.guild.id} default channel output set to ${tokens[2]}`)
                    break
                default:
                    msg.reply(`Unknow command\n${helpers_command()}`)
                    break
            }
        }
    }
})

client.login(process.env.DISCORD_TOKEN)