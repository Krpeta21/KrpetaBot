const { SlashCommandBuilder} = require("@discordjs/builders")
const {MessageEmbed} = require("discord.js")
const {QueryType} = require("discord-player")

module.exports={
    data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Cargar canciones de youtube")
    .addSubcommand((subcommand)=>
        subcommand
            .setName("song")
            .setDescription("Carga una cancion con un url")
            .addStringOption((option)=> option.setName("url").setDescription("El url de la cancion").setRequired(true))
            
        )
    .addSubcommand((subcommand)=>
        subcommand
            .setName("playlist")
            .setDescription("Carga una playlist desde un url")
            .addStringOption((option)=> option.setName("url").setDescription("El url de la playlist").setRequired(true))
            )
    .addSubcommand((subcommand)=> 
        subcommand.setName("search").setDescription("Busqueda de cancion basada en palabras")
        .addStringOption((option) =>
             option.setName("searchterms").setDescription("busqueda por palabra").setRequired(true))
        ),
        run: async({client, interaction})=>{
            if(!interaction.member.voice.channel)
            return interaction.editReply("Debes estar en un canal para usar este comando.")
        
            const queue = await client.player.createQueue(interaction.guild)
            if(!queue.connection) await queue.connect(interaction.member.voice.channel)

            let embed = new MessageEmbed()

            if(interaction.options.getSubcommand()=="song"){
                let url = interaction.options.getString("url")
                const result = await client.player.search(url,{
                    requestBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_VIDEO
                })
                if(result.tracks.length === 0)
                    return interaction.editReply("Sin resultados")

                    const song = result.tracks[0]
                    await queue.addTrack(song)
                    embed
                        .setDescription(`**[${song.title}](${song.url}) se añadio a la cola`)
                        .setThumbnail(song.thumbnail)
                        .setFooter({text: `Duration: ${song.duration}`})


            } else if(interaction.options.getSubcommand()=="playlist"){
                let url = interaction.options.getString("url")
                const result = await client.player.search(url,{
                    requestBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_PLAYLIST
                })
                if(result.tracks.length === 0)
                    return interaction.editReply("Sin resultados")

                    const playlist = result.playlist
                    await queue.addTracks(result.tracks)
                    embed
                        .setDescription(`**[${result.tracks.length}] canciones de (${playlist.url}) se añadieron a la cola`)
                        .setThumbnail(playlist.thumbnail)                        
            }else if(interaction.options.getSubcommand()=="search"){
                let url = interaction.options.getString("searchterms")
                const result = await client.player.search(url,{
                    requestBy: interaction.user,
                    searchEngine: QueryType.AUTO
                })
                if(result.tracks.length === 0)
                    return interaction.editReply("Sin resultados")

                    const song = result.tracks[0]
                    await queue.addTrack(song)
                    embed
                        .setDescription(`**[${song.title}](${song.url}) se añadio a la cola`)
                        .setThumbnail(song.thumbnail)
                        .setFooter({text: `Duration: ${song.duration}`}) 
            }
            if(!queue.playing) await queue.play()
            await interaction.editReply({
                embeds: [embed]
            })
        },
}