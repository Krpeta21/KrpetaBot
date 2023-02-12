const Discord = require('discord.js');
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES",'GUILD_VOICE_STATES'] })
const { REST } = require("@discordjs/rest")
const { Routes } = require('discord-api-types/v9');
const fs = require("fs")
const {Player} = require("discord-player")
require('dotenv').config()
const discordToken = process.env.DISCORD_TOKEN

const LOAD_SLASH = process.argv[2] == "load"

const CLIENT_ID = "977028452899254344"
// ID GUILD BAGRESCHAN
//const GUILD_ID = "296861276485713920"

// ID GUILD TEST
const GUILD_ID = "977027943031271475"
client.slashcommands = new Discord.Collection()
client.player = new Player(client,{
    ytdlOptions:{
        quality:"highestaudio",
        highWaterMark: 1 << 25
    }
})



client.on('messageCreate',async message=>{
    //recibe los mensajes enviados al canal y los muestra por consola
    console.log(message.content);
    if(message.content=== 'ping'){
        message.reply('pong')
    }
    
    if(message.content=== 'hello'){
        message.channel.send(`Hello ${message.author}! `)
    }
    if(message.content.includes('!test')){
        message.channel.send('Gracias por testear!')
        message.delete();
    }

    if(message.content.includes('!carpetsu')){
        message.channel.send('https://github.com/IrvingGlt');
        message.channel.send('https://www.instagram.com/irvinglt21');  
    }
    if(message.content === '!pretty'){
        const embed = new Discord.MessageEmbed()
        .setTitle('Mis Redes Sociales')
        .setColor('#000000')
        .addField('GitHub','https://github.com/IrvingGlt')
        .addField('Instagram','https://www.instagram.com/irvinglt21')        
        .setAuthor('Carpetsu','https://i.pinimg.com/564x/b4/b6/31/b4b63147321fc597d1866a0c419f6eed.jpg')
        ;
            
        message.channel.send({embeds: [embed]})
    }
    if(message.content === '!clear'){       
       message.channel.bulkDelete(10)
       console.log('mensajes eliminados')
    }
})
let commands = []
const slashFiles = fs.readdirSync("./slash").filter(file => file.endsWith(".js"))
for(const file of slashFiles){
    const slashcmd = require(`./slash/${file}`)
    client.slashcommands.set(slashcmd.data.name, slashcmd)
    if(LOAD_SLASH) commands.push(slashcmd.data.toJSON())
}

if (LOAD_SLASH){
    const rest = new REST({version: "9"}).setToken(discordToken)
    rest.put(Routes.applicationGuildCommands(CLIENT_ID,GUILD_ID),{body: commands})    
    .then(()=>{
        console.log("Cargado correctamente")
        process.exit(0)
    })
    .catch((err)=>{
        console.log(err)
        process.exit(1)
       
    })
}
else{
    client.on('ready', ()=> {
        console.log(`El bot se conecto correctamente: ${client.user.tag}`);
        client.user.setStatus('online');
        console.log(client.user.presence.status)
        // const testChannel = client.channels.cache.find(channel => channel.name === 'test');
        // console.log(testChannel.name)
    });
    client.on("interactionCreate",(interaction)=>{
        async function handleCommand(){
            if(!interaction.isCommand()) return
            const slashcmd = client.slashcommands.get(interaction.commandName)
            if(!slashcmd) interaction.reply("Comando invalido")

            await interaction.deferReply()
            await slashcmd.run({ client, interaction})
        }
            handleCommand()
    })
    client.login(discordToken);
}

