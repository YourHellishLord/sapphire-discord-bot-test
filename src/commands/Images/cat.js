const { isMessageInstance } = require('@sapphire/discord.js-utilities');
const { Command } = require('@sapphire/framework');
const { fetch, FetchResultTypes } = require('@sapphire/fetch')
const { Interaction } = require('discord.js')

class CatCommand extends Command {

    constructor(context, options) {
        super(context, { ...options, fullCategory: ['Images'] });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder.setName('cat')
                .setDescription('Gimme the cat!')
        );
    }

    async chatInputRun(interaction) {
        const msg = await interaction.reply({
            content: 'Kidnapping the cat...',
            ephemeral: false,
            fetchReply: true
        });

        if (isMessageInstance(msg)) {
            const cat = await fetch('https://cataas.com/cat', FetchResultTypes.Buffer);
            return interaction.editReply({content: 'meow!', files: [cat]})
        }

        return interaction.editReply('Your cat broke...');
    }

}

module.exports = { CatCommand }

