const { Client } = require('pg');
const path = require('path');
const DATABASE_EXISTS_CODE = "42P04";

// Capture the first command line agrument passed to this script
const envName = process.argv.slice(2)[0];

const loadEnv = (envName) => {
    const { NODE_ENV } = process.env;
    if (NODE_ENV != 'production') {
        const envFile = envName === 'test' ? '../.env.test' : '../.env';

        require('dotenv').config({ path:  path.join(__dirname, envFile) });

        // Capture the name of the database so we can create it
        const databaseName = process.env.PGDATABASE;

        // Delete the database name from the environment so pg doesn't connect to a db which doesn't exist yet
        delete process.env.PGDATABASE;

        return databaseName;
    } 
}

const createDatabase = async (databaseName) => {
    const client = new Client();
    try {
        await client.connect();

        console.log(`Creating ${databaseName} database...`);

        await client.query(`CREATE DATABASE ${databaseName}`);

        console.log('Database created!');
    } catch (err) {
        switch (err.code) {
            case DATABASE_EXISTS_CODE:
                console.log("Database already exists!");
                break;
            default:
                console.log('Hello!');
                console.log(err);
        }
    } finally {
        client.end();
    }
}

const databaseName = loadEnv(envName);
createDatabase(databaseName);