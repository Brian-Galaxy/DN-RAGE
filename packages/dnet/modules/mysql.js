"use strict";

let mysql2 = require('mysql');
let methods = require('./methods');

let mysql = exports;

/*let host = '54.37.128.202';
let dbuser = 'admin';
let password = 'mtWkh03ur0ywxwXj';
let database = 'admin_rage';*/

/*
**Конкурс**
- На сервер добавлена система розыгрыша
- Каждый час разыгрывается VIP HARD
- Каждые два часа разыгрывается Маска
- Каждые 24 часа (В 8 вечера по МСК) проходит розыгрыш транспорта
- Отыграв 8 часов на сервере, вы получите $50.000
- Переделано колесо удачи, теперь с него выпадают маски, автомобили (От 30.000$ до 5.000.000$)

**Интерфейс (Обновление, Часть 2)**
- В инвентаре теперь можно перетаскивать предметы с помощью мыши
- Полностью переработан интерфейс, отказ от NativeUI в пользу CEF
- Добавлена кастомизация интерфейса
- -  То есть, можно любой элемент худа подвинуть куда угодно

**Организации (Обновление, Часть 3)**
- Добавлена больница в Sandy Shoers
- Добавлено второе здание FireDepartment в PaletoBay
- Добавлено новое здание Sheriff Department в Los Santos
- Обновлены зарплаты у гос. структур
- Добавлено 2 дополнительных кода в "Коды департамента" у гос. фракций
- Пикапы ареста, очистки розыска теперь доступны фракциям BCSD / LSPD в любом офисе, в которых они есть (То есть, Шерифы могут производить арест в полицейском участке, чтобы не ехать до своего)
- У гос. организаций (EMS / BCSD / LSPD и Правительство) приходит зарплата только в том случае, если они находятся в форме
- Убраны маски с формы Tactical Division, теперь их можно надеть самостоятельно, купив маску в магазие
- На каптах гетто системно запрещено первое лицо
- Фургоны Ламара теперь можно возить чаще (Раз в 10 минут)
- Доля с прибыли от фургона идет на счет вашей организации
- Так же, теперь доля с угона транспорта, идет в общак вашей организации
- Для EMS сделана новая система выписок, теперь каждый сотрудник EMS получает премию, за выписку игрока и тем самым, пополняется бюджет организации
- Теперь вместо 5 фургонов, 3 фургона
- Ящиков в фургонах стало побольше
- Изменен заработок с гетто территорий
- Обновлена система прибыли с бизнесов у мафий (Скорее всего, будет балансироваться)
- Лидерам гос. организаций доступно снятие деньги из бюджета
- У гос. фракций теперь есть своя частота, в диапазоне от 900.000 до 999.999, к которой подключатся могут только они

**Разное (Обновление, Часть 4)**
- Добавлены маски, их более 1000 штук
- Добавлена система предупреждений, когда игрок получает 3 предупреждения, он автоматически будет забанен системой на 7 дней. При получении предупреждения, игрок сидит в тюрьме 120 минут
- Добавлена синхронизация цвета салона
- Добавлена синхронизация цвета приборной панели
- Добавлена синхронизация цвета дыма от покрышек
- Добавлена синхронизация цвета цвета фар
- Добавлен интерьер автосалона мотоциклов
- Добавлен новый тюнинг в ЛСК
- - Изменения цвета фар (Во вкладке модули)
- - Специальное напыление на покрышки (Во вкладке модули)
- - Изменение цвета салона
- - Изменение цвета приборной панели
- У неона теперь есть заготовленные цвета, которые можно использовать в панели транспорта, не пользуясь RGB панелью
- Добавлены новые трассы для гонок (Теперь их более 70)
- - Количество людей в лобби расширенно до 30
- - Обновлена система гонок, теперь есть стартовый призовой фонд и он подымается за счет взноса игроков)
- - - Система общего призового фонда, который делится на победителей в процентом соотношение: 1 - 40%, 2 - 20%, 3 - 10%, 4-5 - 5%, 6-10 - 2.5%, 10-15 - 1.5%
- - Гонки теперь проходят 2 раза в игровой день
- - - Первая гонка, регистрация открывается в 9:00 по игровому, закрывается в 11:00
- - - Вторая гонка, регистрация открывается в 19:00 по игровому, закрывается в 21:00
- - Некоторые гонки теперь имеют несколько кругов
- - В гонках, можно управлять транспортом в полете

**Разное (Обновление, Часть 5)**
- Переделана система обыска, теперь можно снимать экипированное оружие
- Теперь разрешен обыск игроков в коме
- Минимальный налог с прибыли LSC теперь 26%, остальное регулирует губернатор
- Стрелять с водительского места теперь функционально запрещено, только полицейским разрешено стрелять с водительского места, на скорости
- Обновлены цены в магазинах одежды
- Обновлены цены на татуировки
- Обновлены цены на некоторые алкогольные напитки
- В GPS были добавлены авторынки
- Починил кнопку "Вытащить из ТС"
- Починил ecorp -user -getpos
- Фикс багов по интерьерам
- Фикс кастомной синхронизации компонентов автомобилей
- Различные фиксы и правки
- Оптимизация ряда моментов по серверной части

*
* */

let host = 'localhost';
let dbuser = 'dNet_python';
let database = 'dNet_python';
let password = 'b3282a2f2a28757b3a18ab833de16a9c54518c0b0cf493e3f0a7cf09386f326a';

const pool = mysql2.createPool({
    //host: host,
    socketPath: '/var/run/mysqld/mysqld.sock',
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
    mysql.executeQuery(`UPDATE monitoring SET online = ${mp.players.length}, last_update = ${Math.round(new Date().getTime()/1000)}`);
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