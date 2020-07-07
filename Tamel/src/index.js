// Import
import Discord from 'discord.js';
import Redis from 'ioredis';
import pg from 'pg';
import express from 'express';

import config from './config';
import Server from './Server';
import ConsoleLogger from './common/ConsoleLogger';

import WordDao from './dao/WordDao';
import QuestionDao from './dao/QuestionDao';

import LearnRouter from './routers/learn/LearnRouter';
import QuestionRouter from './routers/learn/QuestionRouter';
import OsuRouter from './routers/osu/OsuRouter';
import RollRouter from './routers/roll/RollRouter';
import TimerRouter from './routers/timer/TimerRouter';

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
const questionDao = new QuestionDao(pSQLDbPool);

// Client
const discordClient = new Discord.Client();

// Routers
const rollRouter = new RollRouter();
const learnRouter = new LearnRouter(wordDao);
const osuRouter = new OsuRouter();
const timerRouter = new TimerRouter(discordClient);
const questionRouter = new QuestionRouter(discordClient, wordDao, questionDao);
const routers = [
    {
        prefix: 'roll',
        router: rollRouter,
    },
    {
        prefix: 'timer',
        router: timerRouter,
    },
    {
        prefix: 'word',
        router: learnRouter,
    },
    {
        prefix: 'osu',
        router: osuRouter,
    },
    {
        prefix: 'answer',
        router: questionRouter,
    },
]; 

// Instantcization
// TODO: Proper wrapping for discord client
const logger = new ConsoleLogger(console);
const app = express();
const port = 5555;

const server = new Server(
    config.discordBotToken,
    discordClient,
    app,
    port,
    routers,
    logger,
);

server.start();
