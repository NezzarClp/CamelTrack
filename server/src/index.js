import express from 'express';
import pg from 'pg';
import bodyParser from 'body-parser';
import multer from 'multer';

import Server from './Server';

import GraphQLRoute from './GraphQLRoute';
import busboy from 'connect-busboy';

import createCollectionRoute from './routes/createCollectionRoute';

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

    const jsonParser = bodyParser.json()
    const urlencodedParser = bodyParser.urlencoded({ extended: false })
    const uploadMulter = multer({
        limit: {
            fileSize: 1000 * 1000 * 50, // 50 MB
        },
    });

    app.use(jsonParser);
    app.use(urlencodedParser);

    const collectionRoute = createCollectionRoute(uploadMulter);
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
