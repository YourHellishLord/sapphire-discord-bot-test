const { Command } = require('@sapphire/framework');
const { useQueue } = require('discord-player')

class MusicSkipCommand extends Command {

    constructor(context, options) {
        super(context, { ...options, fullCategory: ['Music'] });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder.setName('skip')
                .setDescription('skips the current track')
        );
    }

    async chatInputRun(interaction) {
        const queue = useQueue(interaction.guild.id);
        await interaction.reply({
            content: `skipping **${queue.currentTrack.cleanTitle}**...`,
            ephemeral: true
        })

        const entry = queue.tasksQueue.acquire();
        await entry.getTask();

        if(queue.tracks.size > 0){
            try{
                queue.node.skip();
                queue.node.play();
            } finally {
                await interaction.editReply(`Now playing **${queue.currentTrack.cleanTitle}**.`)
            }
        } else {
            await interaction.editReply(`no more tracks byeee!`)
            queue.clear();
            this.container.channelConnection.disconnect()
            this.container.channelConnection = null;
        }
        queue.tasksQueue.release()
    }

}

module.exports = { MusicSkipCommand }

