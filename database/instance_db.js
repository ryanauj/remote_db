var pool = require(__dirname + '/db.js');

function query_and_results(sql, cb) {
    pool.getConnection(function(err, connection) {
        if (err) {
            err.status = 500;
            return cb(err, null);
        }
        connection.query(sql, function(err, results, fields) {
            connection.release();
            if (err) {
                err.status = 500;
                return cb(err, null);
            }
            return cb(null, results);
        });
    });
}

function get_dbs(cb) {
    query_and_results('SELECT db_name FROM db_user_dbs.dbs;', function(err, results) {
        return cb(err, results);
    });
}

function create_db(name, cb) {
    pool.getConnection(function(err, connection) {
        if (err) {
            err.status = 500;
            return cb(err, null);
        }
        var sql = 'CREATE DATABASE ' + name + ';';
        connection.query(sql, function(err, results, fields) {
            if (err) {
                connection.release();
                err.status = 500;
                return cb(err, null);
            }
            sql = 'INSERT INTO db_user_dbs.dbs (db_name) VALUES (' + name + ');';
            connection.query(sql, function(err, results, fields) {
                connection.release();
                if (err) {
                    err.status = 500;
                    return cb(err, null);
                }
                return cb(null, 'Success');
            });
        });
    });
}   

module.exports = {
    get_dbs: get_dbs,
    create_db: create_db
};
