"use strict";

var mysql2 = require('mysql');
let methods = require('./methods');

let mysql = exports;

let host = '54.37.128.202';
let dbuser = 'admin';
let password = 'mtWkh03ur0ywxwXj';
let database = 'admin_rage';

/*let host = 'localhost';
let dbuser = 'dNet_python';
let database = 'dNet_python';
let password = 'b3282a2f2a28757b3a18ab833de16a9c54518c0b0cf493e3f0a7cf09386f326a';*/

const pool = mysql2.createPool({
    host: host,
    //socketPath: '/var/run/mysqld/mysqld.sock',
    user: dbuser,
    password: password,
    database: database,
    port: 3306,
    waitForConnections: true,
    connectionLimit: 500,
    queueLimit: 0,
    timeout: 300000
});

pool.on('connection', function (connection) {
    connection.query('SET SESSION sql_mode=\'\'');
    console.log('New MySQL connection id: ' + connection.threadId);
});

pool.on('enqueue', function (connection) {
    console.log('Waiting for available connection slot, waiting count: ' + pool._connectionQueue.length);
});

pool.on('release', function (connection) {
    //console.log('Connection %d released', connection.threadId);
});

pool.on('acquire', function (connection) {
    //console.log('Connection %d acquired', connection.threadId);
});

mysql.stressTest = async function() {
    let i = 0;
    while (i < 5) {
        mysql.executeQuery(`SELECT * FROM accounts`, function (err, rows, fields) {
            console.log(err.code)
        });
        i++;
    }
};

setInterval(function() {
    mysql.executeQueryOld(`SELECT * FROM accounts`);
}, 5000);

mysql.getTime = function() {
    let dateTime = new Date();
    return `${methods.digitFormat(dateTime.getHours())}:${methods.digitFormat(dateTime.getMinutes())}:${methods.digitFormat(dateTime.getSeconds())}`;
};

mysql.isConnected = function () {
    return isConnected;
};

mysql.executeQuery = async function (query, values, callback) {
    console.log('SQL Query: ' + query);
    const preQuery = new Date().getTime();
    try {
        pool.getConnection(function (err, connection) {
            try {
                if(!err) {
                    connection.query({
                        sql: query,
                        timeout: 60000
                    }, values, function (err, rows, fields) {
                        if (!err) {
                            callback(null, rows, fields);
                        } else {
                            console.log("[DATABASE ERROR] " + query + " | Error: " + err);
                            callback(err);
                        }
                    });
                } else { console.log(err)}
                const postQuery = new Date().getTime();
                console.log(`SQL query done in: ${postQuery - preQuery}ms`);
                connection.release();
            }
            catch (e) {
                console.log(e);
            }
        });
    } catch (e) {
        setTimeout(function () {
            mysql.executeQuery(query, values, callback);
        }, 2000);
        console.log('DBERROR', e);
    }
};

mysql.executeQueryOld = function(query, values, callback) {
    //methods.debug(query);
    const start = new Date().getTime();
    pool.query(query, values, function(err, rows, fields) {
        if (!err) {
            callback(null, rows, fields);
        } else {
            console.log("[DATABASE | ERROR | " + mysql.getTime() + "]");
            console.log(query);
            console.log(err);
            callback(err);
        }
    });
    const end = new Date().getTime();
    //methods.debug(`${query}`, `Time: ${end - start}ms`);
};

/*setInterval(function () {
    mysql.executeQuery('SELECT * FROM accounts', function (err, rows, fields) {
        rows.forEach(function (item) {
            console.log(item.username);
        })
    });
}, 1000);
*/