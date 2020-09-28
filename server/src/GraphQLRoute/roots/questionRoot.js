class Question {
    constructor(id, wordId, result) {
        this._id = id;
        this._wordId = wordId;
        this._result = result;
    }

    id() {
        return this._id;
    }

    wordId() {
        return this._wordId;
    }

    result() {
        return this._result;
    }
}

export default function (pgPool) {
    return {
        getQuestions: async () => {
            const { rows } = await pgPool.query(`
                SELECT * FROM "Questions";
            `);

            return rows.map(({ id, wordId, result }) => {
                return new Question(id, wordId, result);
            });
        },
    };
};
