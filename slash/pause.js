const { SlashCommandBuilder} = require("@discordjs/builders")



module.exports={
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pausa la musica."),
    run: async({client,interaction}) =>{
        const queue = client.player.getQueue(interaction.guild)

        if(!queue) 
            return await interaction.editReply("No hay canciones en la cola.")
    
        queue.setPaused(true)
        await interaction.editReply("La musica se pauso! Usa /resume para seguir reproduciendola")
    },    
}