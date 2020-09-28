import express from 'express';

export default function createOAuthRoute() {
    const route = express.Router();

    route.get('/external/osu/callback', (req, res) => {
        console.log('??', req, req.query);

        res.send({ ok: req.query  });
    });

    return route;
}
