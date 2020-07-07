export default {
    name: 'Add tables',
    timestamp: 1590482593161,
    migration: async (client) => {
        await client.query(`
            CREATE TABLE "Questions"(
                "id" SERIAL PRIMARY KEY,
                "wordId" INTEGER NOT NULL REFERENCES Word(id),
                "created_dt" TIMESTAMP,
                "result" TEXT
            );
        `);
        await client.query(`
            CREATE TABLE "TwitchPings"(
                "id" SERIAL PRIMARY KEY,
                "username" TEXT
            )
        `);
    },
};
