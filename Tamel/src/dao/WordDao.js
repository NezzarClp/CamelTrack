export default class WordDao {
    constructor(postgresPool) {
        this._postgresPool = postgresPool;
    }

    async wordCount() {
        try {
            const { rows } = await this._postgresPool.query(`
                SELECT COUNT(*) FROM "word";
            `);

            return rows[0].count;
        } catch (err) {
            console.error('Failed to count number of words');
            console.error(err);
            
            throw err;
        }
    }

    async getByKanji(kanji) {
        try {
            const { rows } = await this._postgresPool.query(`
                SELECT * FROM "word"
                WHERE "kanji" = $1;
            `, [kanji]);
            
            return rows;
        } catch (err) {
            console.error('Failed to get by kanji');
            console.error(err);
            console.error(kanji);

            throw err;
        }
    }

    async insert(record) {
        try {
            const { romaji, kanji, english } = record;
            const currentTimestamp = Date.now() / 1000;

            await this._postgresPool.query(`
                INSERT INTO "word"("romaji", "kanji", "english_meaning", "created_dt", "updated_dt")
                VALUES
                    ($1, $2, $3, TO_TIMESTAMP($4), TO_TIMESTAMP($4));
            `, [romaji, kanji, english, currentTimestamp]);
        } catch (err) {
            console.error('Failed to insert record');
            console.error(err);
            console.error(record);

            throw err;
        }
        // TODO implementation
    }

    async pingByIds(ids) {
        try {
            const currentTimestamp = Math.floor(Date.now() / 1000);
            await this._postgresPool.query(`
                UPDATE "word"
                SET "updated_dt" = TO_TIMESTAMP($1)
                WHERE "id" = ANY ($2);
            `, [currentTimestamp, ids]);
        } catch (err) {
            console.error('Failed to ping by IDs');
            console.error(err);
            console.error(ids);

            throw err;
        }
    }
};
