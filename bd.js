const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    port: 3001,
    user: 'postgres',
    password: 'postgres',
    database: 'dw1-db-2026'
});

module.exports = pool;