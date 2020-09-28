export default {
    name: 'Add system metric table',
    timestamp: 1601074934,
    migration: async (client) => {
        await client.query(`
            CREATE TABLE "SystemMetric"(
                "id" SERIAL PRIMARY KEY,
                "created_dt" TIMESTAMP,
                "machineId" TEXT,
                "data" JSONB
            );
        `);
    },
};
