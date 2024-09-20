const { Listener } = require('@sapphire/framework');
const { Player } = require('discord-player');
const { YoutubeiExtractor } = require('discord-player-youtubei');

class ReadyListener extends Listener {
  constructor(context, options) {
    super(context, {
      ...options,
      once: true,
      event: 'ready'
    });
  }

  async setupMusicPlayer(container) {
    container.player = Player.singleton(container.client);
    const { player, logger } = container;

    logger.info(`Player up and running...`);
    await player.extractors.loadDefault((ext) => ext != 'YouTubeExtractor');
    logger.info(`Loading default player extractors...`);
    await player.extractors.register(YoutubeiExtractor, {});
    logger.info(`YouTubei player extractor registered.`);
    
    player.events.on('playerStart', (queue, track) => {
      queue.metadata.channel.send(`Started playing **${track.cleanTitle}**!`);
    })

    player.events.on('playerError', (queue, track) => {
      queue.metadata.channel.send(`Unable to play the requested track (if it is a youtube +18 video won't work for now)`);
    })

  }

  async run(client) {
    const { username, id } = client.user;
    this.container.logger.info(`Successfully logged in as ${username} (${id})`);
    this.setupMusicPlayer(this.container)
  }
}

module.exports = {
  ReadyListener
};