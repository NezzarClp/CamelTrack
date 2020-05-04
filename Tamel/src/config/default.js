const credentials = require('./credentials');

module.exports = {
    discordBotToken: credentials.discordBotToken,
    pSQLDbConfig: credentials.pSQLDbConfig,
    redis: {
        host: credentials.redis.host,
        port: credentials.redis.port,
        password: credentials.redis.password,
    },
    googleApiKey: credentials.googleApiKey,
    osuApiKey: credentials.osuApiKey,
};
