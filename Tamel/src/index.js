// Import
import Discord from 'discord.js';
import Redis from 'ioredis';
import pg from 'pg';

import config from './config';
import Server from './Server';
import ConsoleLogger from './common/ConsoleLogger';

import WordDao from './dao/WordDao';

import LearnRouter from './routers/learn/LearnRouter';
import OsuRouter from './routers/osu/OsuRouter';
import RollRouter from './routers/roll/RollRouter';

// Config
const discordBotToken = config.discordBotToken;
const redisConfig = config.redis;
const pSQLDbConfig = config.pSQLDbConfig;

// DB Clients
const redisClient = new Redis({
    host: redisConfig.host,
    port: redisConfig.port,
    password: redisConfig.password,
});
const pSQLDbPool = new pg.Pool({
    host: pSQLDbConfig.host,
    user: pSQLDbConfig.username,
    database: pSQLDbConfig.database,
    password: pSQLDbConfig.password,
});

// DAOs
const wordDao = new WordDao(pSQLDbPool);

// Routers
const rollRouter = new RollRouter();
const learnRouter = new LearnRouter(wordDao);
const osuRouter = new OsuRouter();
const routers = [
    {
        prefix: 'roll',
        router: rollRouter,
    },
    {
        prefix: 'word',
        router: learnRouter,
    },
    {
        prefix: 'osu',
        router: osuRouter,
    },
]; 

// Instantcization
// TODO: Proper wrapping for discord client
const discordClient = new Discord.Client();
const logger = new ConsoleLogger(console);

const server = new Server(
    config.discordBotToken,
    discordClient,
    routers,
    logger,
);

server.start();
