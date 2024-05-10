const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'bancosolar',
    password: 'xxxxx',
    port: 5432,
});

module.exports = pool;
