var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 5,
    host: 'localhost',
    user: 'db_user',
    password: 'db_user'
});

module.exports = pool;
