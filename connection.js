const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'neo',
    port: 5432,
    password: '',
    database: 'user1'
});

module.exports = pool;