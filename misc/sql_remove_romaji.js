const wanakana = require('wanakana');
const toHiragana = wanakana.toHiragana;
const Promise = require('bluebird');

const pg = require('pg');
const client = new pg.Client({
    user: null,
    database: null,
    password: null,
});

(async() => {
    await client.connect();

    const { rows } = await client.query(`SELECT "id", "kanji", "romaji" FROM "word";`);

    await Promise.each(rows, async (row) => {
        const { id, romaji, kanji } = row;

        if (romaji.match(/^[a-z]*$/)) {
            const hiragana = toHiragana(romaji);

            await client.query(`UPDATE "word" SET "romaji" = $1 WHERE "id" = $2`, [hiragana, id]);
            console.log('UPDATED', id);
        }
    });
    await client.end();
})();

