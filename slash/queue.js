const { SlashCommandBuilder} = require("@discordjs/builders")
const {MessageEmbed} = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Muestra la cola de canciones actual.")
    .addNumberOption((option)=>option.setName("pagina").setDescription("Pagina numero de la cola").setMinValue(1)),

    run: async ({client, interaction}) =>{
        const queue = client.player.getQueue(interaction.guild)
        if(!queue|| !queue.playing){
            return await interaction.editReply("No hay canciones en la cola.")
        }

        const totalPages = Math.ceil(queue.tracks.length / 10) || 1
        const page = (interaction.options.getNumber("page") || 1) - 1

        if(page > totalPages)
            return await interaction.editReply(`Pagina invalida. Solo existen un total de ${totalPages} paginas de canciones.`)
        
            const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i)=>{
                return `**${page * 10 + i + 1}.** \`[${song.duration}]\` ${song.title} -- <@>`
            }).join("\n")

            const currentSong = queue.current   
            
            await interaction.editReply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`**Actualmente reproduciendo **\n` +
                    (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@>` : "None") +
                    `\n\n**Cola**\n${queueString}`                    
                    )
                    .setFooter({
                        text: `Pagina ${page + 1} de ${totalPages}` 
                    })
                    .setThumbnail(currentSong.thumbnail)
                ]
            })
    }
}