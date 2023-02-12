const { SlashCommandBuilder} = require("@discordjs/builders")
const {MessageEmbed} = require("discord.js")


module.exports={
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Salta la cancion actual."),
    run: async({client,interaction}) =>{
        const queue = client.player.getQueue(interaction.guild)

        if(!queue) 
            return await interaction.editReply("No hay canciones en la cola.")
        
        const currentSong = queue.current
        queue.skip()
        await interaction.editReply({
            embeds: [
                new MessageEmbed().setDescription(`${currentSong.title} se ha saltado.`).setThumbnail(currentSong.thumbnail)
            ]
        })
    },    
}