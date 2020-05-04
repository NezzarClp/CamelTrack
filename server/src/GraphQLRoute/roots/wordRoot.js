class Word {
    constructor(romaji, en, word, id) {
        this._romaji = romaji;
        this._en = en;
        this._word = word;
        this._id = id;
    }

    romaji() {
        return this._romaji;
    }

    en() {
        return this._en;
    }

    word() {
        return this._word;
    }

    id() {
        return this._id;
    }
}

export default function (pgPool) {
    return {
        numWords: async () => {
            const { rows } = await pgPool.query(`
                SELECT COUNT(*) FROM "word";
            `);

            return parseInt(rows[0].count, 10);
        },
        randWords: async ({ numWords }) => {
            const { rows } = await pgPool.query(`
                SELECT "id", "romaji", "kanji", "english_meaning" FROM "word"
                ORDER BY RANDOM()
                LIMIT $1
            `, [numWords]);

            return rows.map(({ id, romaji, kanji, english_meaning: englishMeaning }) => {
                return new Word(romaji, englishMeaning, kanji, id);
            });
        },
        getWords: async ({ lowerDay, higherDay }) => {
            const currentTimestamp = Math.floor(Date.now() / 1000);
            const lowTimestamp = currentTimestamp - lowerDay * 24 * 60 * 60;
            const highTimestamp = currentTimestamp - higherDay * 24 * 60 * 60;

            const { rows } = await pgPool.query(`
                SELECT "id", "romaji", "kanji", "english_meaning" FROM "word"
                WHERE "updated_dt" >= TO_TIMESTAMP($1) AND "updated_dt" <= TO_TIMESTAMP($2)
            `, [lowTimestamp, highTimestamp]);

            return rows.map(({ id, romaji, kanji, english_meaning: englishMeaning }) => {
                return new Word(romaji, englishMeaning, kanji, id);
            });
        },
        updateWord: async({ id, input }) => {
            const fields = [
                { inputName: 'romaji', fieldName: 'romaji', },
                { inputName: 'en', fieldName: 'english_meaning', },
                { inputName: 'word', fieldName: 'kanji', },
            ].filter((field) => {
                return (input[field.inputName] !== undefined);
            });

            if (fields.length === 0) {
                throw new Error('No update fields');
            }

            const setClause = fields.map((field, index) => {
                return `"${field.fieldName}"=$${index + 2}`;
            })
                .concat([`"updated_dt"=TO_TIMESTAMP(${Date.now() / 1000})`])
                .join(',');
            const terms = [id, ...fields.map((field) => (input[field.inputName]))];

            await pgPool.query(`
                UPDATE "word"
                SET ${setClause}
                WHERE id=$1;
            `, terms);
        
            const { rows } = await pgPool.query(`
                SELECT "romaji", "kanji", "english_meaning" FROM "word"
                WHERE id=$1;
            `, [id]);
            const row = rows[0];

            return new Word(row.romaji, row['english_meaning'], row.kanji, id);
        },
        numUpdatedWords: async ({ lowTimestamp, highTimestamp }) => {
            const { rows } = await pgPool.query(`
                SELECT COUNT(*) FROM "word"
                WHERE "updated_dt" >= TO_TIMESTAMP($1) AND "updated_dt" <= TO_TIMESTAMP($2);
            `, [lowTimestamp, highTimestamp]);

            return rows[0].count;
        },
    };
};
