"use strict";
var mysql = require('mysql');

const pool = mysql.createPool({
    host: '173.249.7.147', // Тестовый сервак Debian 10
    socketPath: '/var/run/mysqld/mysqld.sock',
    user: 'admin',
    password: 'PO~w~^vI2*m?:JZQ&`$0',
    database: 'dNet_haskell',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 500,
    queueLimit: 0,
    timeout: 300000
});

pool.on('connection', function (connection) {
    //console.log('New MySQL connection id: ' + connection.threadId)
});

pool.on('enqueue', function (connection) {
    //console.log('Waiting for available connection slot');
});

pool.on('release', function (connection) {
    //console.log('Connection %d released', connection.threadId);
});

pool.on('acquire', function (connection) {
    //console.log('Connection %d acquired', connection.threadId);
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
    //console.log(query);
    const preQuery = new Date().getTime();
    try {
        pool.getConnection(function (err, connection) {
            if(!err) {
                connection.query(query, values, function (err, rows, fields) {
                    if (!err) {
                        callback(null, rows, fields);
                    } else {
                        console.log("[DATABASE ERROR] " + query + " | Error: " + err);
                        callback(err);
                    }
                    connection.release();
                });
            } else { console.log(err)}
            const postQuery = new Date().getTime();
            //console.log(`executeQuery: ${postQuery - preQuery}ms`);
        });
    } catch (e) {
        console.log(e);
    }
};


setInterval(function () {
    mysql.executeQuery('SELECT * FROM accounts', function (err, rows, fields) {
        rows.forEach(function (item) {
            //console.log(item.username);
        })
    });
    //console.log(pool._connectionQueue.length)
}, 10);
