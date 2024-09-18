const { isMessageInstance } = require('@sapphire/discord.js-utilities');
const { Command } = require('@sapphire/framework');

class DiceCommand extends Command {

    constructor(context, options) {
        super(context, { ...options, fullCategory: ['Games'] });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder.setName('dice')
                .setDescription('Throw a dice')
                .addIntegerOption(option =>
                    option.setName('faces')
                        .setDescription('Number of faces of the dice')
                )
        );
    }

    async chatInputRun(interaction) {
        const diceFaces = interaction.options.getInteger('faces') || 6;

        const msg = await interaction.reply({
            content: 'Throwing dice...',
            ephemeral: false,
            fetchReply: true
        });

        if (isMessageInstance(msg)) {
            const diceValue = Math.floor(Math.random() * diceFaces) + 1;
            return interaction.editReply(`You got a ${diceValue} 🎲!`);
        }

        return interaction.editReply('Your dice broke...');
    }

}

module.exports = { DiceCommand }

