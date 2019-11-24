let mysql = require('./modules/mysql');
let methods = require('./modules/methods');
let Container = require('./modules/data');

let user = exports;


user.createAccount = function(player, login, pass, email) {
    methods.debug('user.createAccount');
    pass = methods.sha256(pass);
    let sql = "INSERT INTO accounts (login, email, social, serial, password, reg_ip, reg_timestamp) VALUES ('" + login +
        "', '" + email + "', '" + player.socialClub + "', '" + player.serial + "', '" + pass + "', '" + player.ip + "', '" + methods.getTimeStamp() + "')";
    mysql.executeQuery(sql);
};

user.authAccount = function(player, nick, pass, spawnPos) {

    methods.debug('user.authAccount');
    if (!mp.players.exists(player))
        return false;
    user.validateAccount(nick, pass, function (callback) {
        player.notify('~b~Проверяем данные...');
        callback = methods.parseInt(callback);
        if (callback == -1) {
            player.notify('~r~ОШИБКА~s~\nОшибка пароля или аккаунт еще не был создан');
        }
        else if (callback > 10) {
            var date = new Date(parseInt(callback) * 1000);
            var hours = "0" + date.getHours();
            var minutes = "0" + date.getMinutes();
            var formattedTime = hours.substr(-2) + ':' + minutes.substr(-2);
            player.notify(`~r~ВЫ ЗАБАНЕНЫ~s~\nРазбан: ${formattedTime} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`);
            user.set(player, 'isBan', true);
        }
        else {
            player.notify('~b~Входим в аккаунт...');
            //user.loadAccount(player, nick, spawnPos);
            //setTimeout(function() { user.loadAccount(player, nick); }, 500);
        }
    });
};

user.validateAccount = function(nick, pass, callback) {
    methods.debug('user.validateAccount');
    mysql.executeQuery(`SELECT date_ban, password FROM users WHERE rp_name = ? LIMIT 1`, nick, function (err, rows, fields) {
        if (err) {
            methods.debug('[DATABASE | ERROR]');
            methods.debug(err);
            return callback(-1);
        }

        rows.forEach(function(item) {
            if (item.password !== methods.sha256(pass))
                return callback(-1);
            return callback(1);
        });

        if (rows.length === 0)
            return callback(-1);
    });
};