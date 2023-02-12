const { SlashCommandBuilder} = require("@discordjs/builders")



module.exports={
    data: new SlashCommandBuilder()
        .setName("skipto")
        .setDescription("Salta a una cancion especifica #.")
        .addNumberOption((option)=>
            option.setName("tracknumber").setDescription("La cancion a la que saltaras es").setMinValue(1).setRequired(true)
        ),
    run: async({client,interaction}) =>{
        const queue = client.player.getQueue(interaction.guildId)

        if(!queue) return await interaction.editReply("No hay canciones en la cola.")
        const trackNum = interaction.option.getNumber("tracknumber")
        
        if(trackNum > queue.tracks.length)
            return await interaction.editReply("Numero de cancion invalido")
        queue.skipTo(trackNum - 1)
        await interaction.editReply(`Saltando a la cancion numero ${trackNum}`)
    },    
}