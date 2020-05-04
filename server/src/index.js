import express from 'express';
import pg from 'pg';

import Server from './Server';

import GraphQLRoute from './GraphQLRoute';

const config = require('./config');

(async() => {
    const { postgresConfig } = config;

    const pool = new pg.Pool({
        user: postgresConfig.user,
        password: postgresConfig.password,
        database: postgresConfig.database,
        host: postgresConfig.host,
    });

    const app = new express();

    const collectionRoute = express.Router();

    collectionRoute.post('/', (req, res) => {
        res.send({ ok: 'ok' });
    });

    collectionRoute.get('/', (req, res) => {
        res.send({ ok: 'ok' });
    });

    const graphQLRoute = GraphQLRoute(pool);

    const routes = [
        {
            prefix: '/collection',
            route: collectionRoute,
        },
        {
            prefix: '/graphql',
            route: graphQLRoute,
        },
    ];

    const server = new Server(app, routes, 4000);

    await server.start();
})();
