const { Command } = require('@sapphire/framework');
const { useQueue } = require('discord-player')

class MusicPauseCommand extends Command {

    constructor(context, options) {
        super(context, { ...options, fullCategory: ['Music'] });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder.setName('pause')
                .setDescription('pauses the music player')
        );
    }

    async chatInputRun(interaction) {
        const queue = useQueue(interaction.guild.id);
        await interaction.reply({
            content: 'Pausing the player...',
            ephemeral: true
        });

        if (queue.node.isPaused()) {
            queue.node.setPaused(false);
            await interaction.editReply(`Player resumed\ncurrent track: **${queue.currentTrack.cleanTitle}**.`)
        } else {
            queue.node.setPaused(true);
            await interaction.editReply(`Player paused\ncurrent track: **${queue.currentTrack.cleanTitle}**.`)
        }

    }

}

module.exports = { MusicPauseCommand }

