const { SlashCommandBuilder} = require("@discordjs/builders")



module.exports={
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Revuelve la playlist."),
    run: async({client,interaction}) =>{
        const queue = client.player.getQueue(interaction.guild)

        if(!queue) 
            return await interaction.editReply("No hay canciones en la cola.")
    
        queue.shuffle()
        await interaction.editReply(`La cola ${queue.tracks.length} se ha revuelto!`)
    },    
}