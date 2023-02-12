const { SlashCommandBuilder} = require("@discordjs/builders")



module.exports={
    data: new SlashCommandBuilder()
        .setName("quit")
        .setDescription("Detiene la musica y limpia la cola."),
    run: async({client,interaction}) =>{
        const queue = client.player.getQueue(interaction.guild)

        if(!queue) 
            return await interaction.editReply("No hay canciones en la cola.")
    
        queue.destroy()
        await interaction.editReply("Adios!")
    },    
}