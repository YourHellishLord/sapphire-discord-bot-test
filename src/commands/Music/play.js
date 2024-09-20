const { Command } = require('@sapphire/framework');
const { useMainPlayer } = require('discord-player')
const { joinVoiceChannel } = require('discord-voip');

class MusicPlayCommand extends Command {

    constructor(context, options) {
        super(context, { ...options, fullCategory: ['Music'] });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder.setName('play')
                .setDescription('Play the requested youtube link or search by title')
                .addStringOption(option =>
                    option.setName('link-or-query')
                        .setDescription('youtube link or video\'s name')
                        .setRequired(true)
                )
        );
    }

    async chatInputRun(interaction) {
        const player = useMainPlayer();
        const channel = interaction.member.voice.channel;
        const linkOrQuery = interaction.options.getString('link-or-query');
        
        if (!channel) return interaction.reply('You are not connected to a voice channel!');
        await interaction.deferReply();

        if(!this.container.channelConnection) {
            this.container.channelConnection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });
        }

        const queue = player.nodes.create(interaction.guild.id);

        if(!queue.dispatcher)
            queue.createDispatcher(this.container.channelConnection);


        const result = await player.search(linkOrQuery, { requestedBy: interaction.user });
        if(!result.hasTracks()) return interaction.editReply(`unable to find \`${linkOrQuery}\``);

        const entry = queue.tasksQueue.acquire();
        await entry.getTask();

        queue.addTrack(result.tracks[0]);

        const currentQueueString = [queue.tracks.toArray()].map((track, index) => `${index+1}. **${track.title} - ${track.author} - (${track.duration})**`).join('\n');
        await interaction.editReply(`Queue:\n\n${currentQueueString}`)

        try {
            if(!queue.isPlaying()){
                await queue.node.play();                
                await interaction.editReply(`Now playing: **${queue.currentTrack.cleanTitle} - ${queue.currentTrack.author} - (${queue.currentTrack.duration})**.`)
            }
        } finally {
            queue.tasksQueue.release()
        }
    }

}

module.exports = { MusicPlayCommand }

