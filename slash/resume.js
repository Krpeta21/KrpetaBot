const { SlashCommandBuilder} = require("@discordjs/builders")



module.exports={
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Sigue reproduciendo la musica."),
    run: async({client,interaction}) =>{
        const queue = client.player.getQueue(interaction.guild)

        if(!queue) 
            return await interaction.editReply("No hay canciones en la cola.")
    
        queue.setPaused(false)
        await interaction.editReply("La cancion se reanudo! Usa /pause para pausar la musica")
    },    
}