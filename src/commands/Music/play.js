const { isMessageInstance } = require('@sapphire/discord.js-utilities');
const { Command } = require('@sapphire/framework');

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
        const linkOrQuery = interaction.options.getString('link-or-query');

        const msg = await interaction.reply({
            content: `Did you want to download: \'${linkOrQuery}\' right?`,
            ephemeral: true,
            fetchReply: true
        });

        if (isMessageInstance(msg)) {
            this.container.logger('Music - play command is not completely implemented') // TODO: complete this feature
            return interaction.editReply(`Eh! you wanted to download ${linkOrQuery}, look at that face! look at that face, he didn't expect it`);
        }

        return interaction.editReply('Failed to retrieve ping TwT');
    }

}

module.exports = { MusicPlayCommand }

