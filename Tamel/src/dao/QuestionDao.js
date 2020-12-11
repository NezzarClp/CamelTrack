export default class QuestionDao {
    constructor(postgresPool) {
        this._postgresPool = postgresPool;
    }

    async getCount() {
        try {
            const { rows } = await this._postgresPool.query(`
                SELECT COUNT(*) as count from "Questions";
            `);
        
            return rows[0].count;
        } catch (err) {
            console.error('Failed to get count');
            console.error(err);

            throw err;
        }
    }

    async getById(id) {
        try {
            const { rows } = await this._postgresPool.query(`
                SELECT * FROM "Questions"
                WHERE "id" = $1;
            `, [id]);

            return rows;
        } catch (err) {
            console.error('Failed to get by ID');
            console.error(err);

            throw err;
        }
    }

    async delete(id) {
        try {
            const { rows } = await this._postgresPool.query(`
                DELTE FROM "Questions"
                WHERE "id" = $1;
            `, [id]);
        } catch (err) {
            console.error('Failed to delete by ID');
            console.error(err);
            console.error(id);

            throw err;
        }
    }

    async getByWordId(wordId) {
        try {
            const { rows } = await this._postgresPool.query(`
                SELECT * FROM "Questions"
                WHERE "wordId" = $1;
            `, [wordId]);

            return rows;
        } catch (err) {
            console.error('Failed to get by word ID');
            console.error(err);
            console.error({ wordId });

            throw err;
        }
    }

    async updateStatus(id, status) {
        try {
            await this._postgresPool.query(`
                UPDATE "Questions"
                SET "result" = $2
                WHERE "id" = $1;
            `, [id, status]);
        } catch (err) {
            console.error('Failed to update status by ID');
            console.error(err);
            console.error({ id, status });

            throw err;
        }
    }

    async getLatestQuestion() {
        try {
            const { rows } = await this._postgresPool.query(`
                SELECT * FROM "Questions"
                ORDER BY "created_dt" DESC
                LIMIT 1;
            `);

            return rows;
        } catch (err) {
            console.error('Failed to get latest question');
            console.error(err);
 
            throw err;
        }
    }

    async getByTimestamp(timestamp) {
        try {
            const { rows } = await this._postgresPool.query(`
                SELECT * FROM "Questions"
                WHERE "created_dt" >= TO_TIMESTAMP($1);
            `, [timestamp]);

            return rows;
        } catch (err) {
            console.error('Failed to get questions by timestamp');
            console.error(err);
 
            throw err;
        }
    }

    async insert(record) {
        try {
            const { wordId } = record;
            const currentTimestamp = Date.now() / 1000;

            const { rows } = await this._postgresPool.query(`
                INSERT INTO "Questions"("wordId", "created_dt")
                VALUES ($1, TO_TIMESTAMP($2))
                RETURNING id;
            `, [wordId, currentTimestamp]);


            return rows[0].id;
        } catch (err) {
            console.error('Failed to insert record');
            console.error(err);
            console.error(record);

            throw err;
        }
    }
};
