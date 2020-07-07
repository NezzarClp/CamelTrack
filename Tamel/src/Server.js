import DiscordMessage from './common/DiscordMessage';

export default class Server {
    constructor(discordBotToken, client, app, port, routers, logger) {
        this._discordBotToken = discordBotToken;
        this._client = client;
        this._app = app;
        this._port = port;
        this._routers = routers;
        this._logger = logger;
    }

    _log(content, options) {
        const logChannel = this._logChannel;

        if (logChannel) {
            const message = new DiscordMessage(logChannel);
            message.send(content, options);
        } else {
            this._logger.info('Cannot find logging channel');
        }
    }

    async start() {
        this._client.on('ready', () => {
            this._logger.info(`Logged in as ${this._client.user.tag}`);
            this._logChannel = this._client.channels.cache.find((channel) => (channel.name === "bot-logs"));

            const startTime = (new Date()).toISOString();

            this._log(`Deployed at ${startTime}`, { imageUrl: 'hamster/bi.png' });

            this._routers.forEach(async ({ prefix, router }) => {
                if (router.onStart) {
                    try {
                        this._log(`Deploying start function for router '${prefix}'` , { imageUrl: 'hamster/quote.png' });
                        await router.onStart();
                    } catch (err) {
                        this._log(`Deploy failed`, { imageUrl: 'hamster/dead.png' });
                        this._log(`${err}`);
                    }
                }
            });
        });
        this._client.on('message', message => {
            this._routers.forEach(async ({ prefix, router }) => {
                if (message.content.startsWith(`!${prefix}`)) {
                    try {
                        await router.onMessage(message);
                    } catch (err) {
                        this._log(`ERR ${err}`, { imageUrl: 'hamster/dead.png' });

                        throw err;
                    }
                }
            });
        });
        this._client.on('error', err => {
            console.error(err);

            tihs._log(`ERR ${err}`, { imageUrl: 'hamster/bluescreen.png' });

            throw err;
        });

        this._client.on('warn', (message) => {
            console.log('DEBUG', message);
        });

        await this._client.login(this._discordBotToken);
        console.log('Connecting to Express App');
        await this._app.listen(this._port);
        console.log(`Connected; listening to ${this._port}`);
    }
}
