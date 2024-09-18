const { isMessageInstance } = require('@sapphire/discord.js-utilities');
const { Command } = require('@sapphire/framework');

class CoinTossCommand extends Command {

    constructor(context, options) {
        super(context, { ...options, fullCategory: ['Games'] });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder.setName('cointoss')
                .setDescription('Play head or tails')
        );
    }

    async chatInputRun(interaction) {
        const msg = await interaction.reply({
            content: 'Tossing coin...',
            ephemeral: false,
            fetchReply: true
        });

        if (isMessageInstance(msg)) {
            const sideName = Math.floor(Math.random() * 100) % 2 == 0 ? 'Head' : 'Tail';
            return interaction.editReply(`You got \`${sideName}\`!`);
        }

        return interaction.editReply('Your poor... you literally have no coin :<');
    }

}

module.exports = { CoinTossCommand }

