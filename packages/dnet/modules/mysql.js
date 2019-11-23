"use strict";
var mysql2 = require('mysql');

const pool = mysql2.createPool({
    host: '173.249.7.147', // Тестовый сервак Debian 10
    //socketPath: '/var/run/mysqld/mysqld.sock', // Коммент для тестов
    user: 'admin',
    password: 'PO~w~^vI2*m?:JZQ&`$0',
    database: 'dNet_haskell',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 500,
    queueLimit: 0,
    timeout: 300000
});

let mysql = exports;

pool.on('connection', function (connection) {
    console.log('New MySQL connection id: ' + connection.threadId);
});

pool.on('enqueue', function (connection) {
    console.log('Waiting for available connection slot, waiting count: ' + pool._connectionQueue.length);
});

pool.on('release', function (connection) {
    console.log('Connection %d released', connection.threadId);
});

pool.on('acquire', function (connection) {
    console.log('Connection %d acquired', connection.threadId);
});



/*mysql.stressTest = async function() {
    let i = 0;
    while (i < 50000) {
        mysql.executeQuery(`SELECT * FROM accounts`, function (err, rows, fields) {
            console.log(err.code)
        });
        i++;
    }
};

setTimeout(function() {
    mysql.stressTest();
}, 3000);*/

mysql.executeQuery = async function (query, values, callback) {
    console.log('SQL Query: ' + query);
    const preQuery = new Date().getTime();
    try {
        pool.getConnection(function (err, connection) {
            if(!err) {
                connection.query({
                    sql: query,
                    timeout: 60000,
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
        });
    } catch (e) {
        console.log(e);
    }
};


/*setInterval(function () {
    mysql.executeQuery('SELECT * FROM accounts', function (err, rows, fields) {
        rows.forEach(function (item) {
            console.log(item.username);
        })
    });
}, 1000);*/
