export default {
    name: 'Initial migration',
    timestamp: 1585607389908,
    migration: async (client) => {
        await client.query(`
            CREATE TABLE Word(
                id SERIAL PRIMARY KEY,
                romaji TEXT,
                english_meaning TEXT,
                kanji TEXT,
                created_dt TIMESTAMP,
                updated_dt TIMESTAMP
            );
        `);
        await client.query(`
            CREATE INDEX ON Word("romaji");
        `);
        await client.query(`
            CREATE INDEX ON Word("updated_dt");
        `);
    },
};
