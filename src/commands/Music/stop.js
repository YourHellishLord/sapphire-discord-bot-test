const { Command } = require('@sapphire/framework');
const { useQueue } = require('discord-player')

class MusicStopCommand extends Command {

    constructor(context, options) {
        super(context, { ...options, fullCategory: ['Music'] });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder.setName('stop')
                .setDescription('stops the music player')
        );
    }

    async chatInputRun(interaction) {
        const queue = useQueue(interaction.guild.id);
        await interaction.reply({
            content:  'Stopping the player...',
            ephemeral: true
        });
        queue.clear();
        this.container.channelConnection.disconnect();
        await interaction.editReply('Player stopped.');
        this.container.channelConnection = null;
    }

}

module.exports = { MusicStopCommand }

