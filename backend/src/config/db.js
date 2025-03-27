require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

pool.connect()
    .then(() => console.log('Connected to the PostgreSQL Database'))
    .catch(error => console.error('PostgreSQL connection error:', error));

module.exports = pool;