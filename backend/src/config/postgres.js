const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.POSTGRES_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.POSTGRES_DB || 'my_database',
    password: process.env.POSTGRES_PASSWORD || 'secret',
    port: process.env.DB_PORT || 5432,
});

const query = (text, params) => pool.query(text, params);


pool.on('connect', () => {
    console.log('Database connected');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = {
    query,
    pool,
};