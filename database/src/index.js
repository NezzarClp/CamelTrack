import fs from 'fs';
import pg from 'pg';
import Promise from 'bluebird';

import config from './config';

const { postgresConfig } = config;

const client = new pg.Client({
    user: postgresConfig.user,
    password: postgresConfig.password,
    database: postgresConfig.database,
    host: postgresConfig.host,
});

const MIGRATION_TABLE_NAME = 'database_migration';

async function createMigrationTableIfNotExist(client) {
    const { rows } = await client.query(`
        SELECT * FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_TYPE='BASE TABLE'
        AND TABLE_NAME='${MIGRATION_TABLE_NAME}';
    `);

    if (rows.length === 0) {
        console.log('Creating database...');
        
        await client.query(`
            CREATE TABLE ${MIGRATION_TABLE_NAME} (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                created_dt TIMESTAMP
            );
        `); 
    
        await client.query(`
            CREATE INDEX ON "${MIGRATION_TABLE_NAME}" ("name");
        `);

        console.log('Created database');
    }
}

async function migrateIfNotDone({ name, timestamp, migration }) {
    const { rows } = await client.query(`
        SELECT COUNT(*) FROM "${MIGRATION_TABLE_NAME}"
        WHERE "name" = $1;
    `, [name]);
    const { count } = rows[0];

    if (count === '0') {
        try {
            console.log(`Migrating ${name}`);
            await client.query(`
                INSERT INTO "${MIGRATION_TABLE_NAME}"("name", "created_dt")
                VALUES
                    ($1, TO_TIMESTAMP($2));
            `, [name, timestamp / 1000]);
            await migration(client);

            console.log(`Migrate ${name} done`);
        } catch (err) {
            console.log(`Migrate ${name} failed`);

            await client.query(`
                DELETE FROM "${MIGRATION_TABLE_NAME}"
                WHERE name=$1
            `, [name]);

            throw err;
        }
    }
}

(async() => {
    try {
        console.log('Migration start');

        await client.connect();
        await createMigrationTableIfNotExist(client);

        const filenames = fs.readdirSync('./build/migrations');
        const migrations = filenames.map((filename) => {
            return require(`./migrations/${filename}`).default;
        });

        const sortedMigrations = migrations.sort((a, b) => {
            return a.timestamp - b.timestamp;
        });

        await Promise.each(sortedMigrations, migrateIfNotDone);
 
        await client.end();

        console.log('Migration end');

        process.exit(0);
    } catch (err) {
        console.error('Migration failed');
        console.error(err);

        client.end();

        process.exit(1);
    }
})();

process.on('beforeExit', (code) => { console.log('DQ', code); });
