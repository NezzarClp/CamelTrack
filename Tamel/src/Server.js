export default class Server {
    constructor(discordBotToken, client, routers, logger) {
        this._discordBotToken = discordBotToken;
        this._client = client;
        this._routers = routers;
        this._logger = logger;
    }

    async start() {
        this._client.on('ready', () => {
            this._logger.info(`Logged in as ${this._client.user.tag}`);
        });
        this._client.on('message', message => {
            this._routers.forEach(({ prefix, router }) => {
                if (message.content.startsWith(`!${prefix}`)) {
                    router.onMessage(message);
                }
            });
        });
        this._client.on('error', err => {
            console.error(err);

            throw err;
        });

        this._client.on('warn', (message) => {
            console.log('DEBUG', message);
        });

        await this._client.login(this._discordBotToken);
    }
}
