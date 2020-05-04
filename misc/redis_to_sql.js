const redis = require('ioredis');
const pg = require('pg');
const Promise = require('bluebird');

// TODO read from DB... if I even want to visit this later
const redisClient = new redis({
    host: null, 
    port: null,
    password: null,
});

const client = new pg.Client({
    user: null,
    password: null, 
    database: null, 
    host: null, 
});

(async() => {
    await client.connect();
    const words = await redisClient.smembers('dict');
    await Promise.each(words, async (romaji) => {
        const word = await redisClient.hget('jp', romaji);
        const english = await redisClient.hget('en', romaji);

        const currentTime = Date.now();

        await client.query(`
            INSERT INTO "word"("romaji", "kanji", "english_meaning", "created_dt", "updated_dt")
                VALUES
                    ($1, $2, $3, TO_TIMESTAMP($4), TO_TIMESTAMP($4));
        `, [romaji, word, english, currentTime]); 

        console.log('Migrated', word);
    });
    await client.end();

    console.log('done');
    
    process.exit(0);
})();

