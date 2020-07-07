import DiscordMessage from '../../common/DiscordMessage';

export default class TimerRouter {
    constructor(client) {
        this._client = client;
    }

    async _playSounds(times, message, content, connection, ptr) {
        if (ptr < times.length) {
            return await new Promise((resolve, reject) => {
                setTimeout(async () => {
                    const newContent = `${content} ${times[ptr]}`;
                    await message.modify(newContent);

                    const dp = connection.play('/root/CamelTrack/Tamel/4.mp3');

                    await this._playSounds(times, message, newContent, connection, ptr + 1);
                    resolve();
                }, times[ptr]);
            });
        }
    }

    async onMessage(message) {
        const content = message.content;
        const params = content.split(' ').slice(1);
        const times = params.map((num) => (parseInt(num, 10)));
        const discordMessage = new DiscordMessage(message.channel);

        const musicChannel = this._client.channels.cache.find((channel) => {
            return channel.name === "music" && channel.type === "voice";
        });

        if (!musicChannel) {
            discordMessage.send('ERR No channel found');

            return;
        }

        await discordMessage.send('Initializating...');

        const connection = await musicChannel.join();
        connection.on('error', (err) => {
            const errorMessage = new DiscordMessage(message.channel);
            console.log('err', err);

            errorMessage.send(`ERR ${err}`);
        });
        connection.play('/root/CamelTrack/Tamel/4.mp3');

        await this._playSounds(times, discordMessage, '', connection, 0);
        musicChannel.leave();
    }
}
