const { SlashCommandBuilder} = require("@discordjs/builders")
const {MessageEmbed} = require("discord.js")


module.exports={
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Desplega informacion de la cancion actual."),
    run: async({client,interaction}) =>{
        const queue = client.player.getQueue(interaction.guild)

        if(!queue) return await interaction.editReply("No hay canciones en la cola.")
    
        let bar = queue.createProgressBar({
            queue: false,
            length: 19,
            
        })

        const song = queue.current

        await interaction.editReply({
            embeds: [new MessageEmbed()
            .setThumbnail(song.thumbnail)
            .setDescription(`Actualmente reproduciendo [${song.title}](${song.url})\n\n` + bar)
            .setFooter({text: `Duration: ${song.duration}`}) 
        ],
        })
    },    
}