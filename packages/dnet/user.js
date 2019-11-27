let mysql = require('./modules/mysql');
let methods = require('./modules/methods');
let Container = require('./modules/data');

let user = exports;

user.createAccount = function(player, login, pass, email) {

    methods.debug('user.createAccount');

    if (!mp.players.exists(player))
        return;

    user.doesExistAccount(login, email, player.socialClub, function (cb) {

        methods.debug(cb);

        if (cb == 1) {
            user.showCustomNotify(player, 'Аккаунт с такими SocialClub уже существует', 4);
            return;
        }
        else if (cb == 2) {
            user.showCustomNotify(player, 'Логин уже занят', 4);
            return;
        }
        else if (cb == 3) {
            user.showCustomNotify(player, 'Email уже занят', 4);
            return;
        }

        pass = methods.sha256(pass);
        let sql = "INSERT INTO accounts (login, email, social, serial, password, reg_ip, reg_timestamp) VALUES ('" + login +
            "', '" + email + "', '" + player.socialClub + "', '" + player.serial + "', '" + pass + "', '" + player.ip + "', '" + methods.getTimeStamp() + "')";
        mysql.executeQuery(sql);
    });
};

user.loginAccount = function(player, login, pass) {

    methods.debug('user.loginAccount');
    if (!mp.players.exists(player))
        return false;
    user.validateAccount(login, pass, function (callback) {

        //user.showCustomNotify(player, 'Проверяем данные...', 1);

        if (callback == false) {
            user.showCustomNotify(player, 'Ошибка пароля или аккаунт еще не был создан', 4);
            return;
        }

        if (mp.players.exists(player))
            player.call('client:events:loginAccount:success');
        else
            user.showCustomNotify(player, 'Произошла неизвестная ошибка. Код ошибки #9999', 4);
        //player.notify('~b~Входим в аккаунт...');
    });
};

user.validateUser = function(name, pass, callback) {
    methods.debug('user.validateUser');
    mysql.executeQuery(`SELECT date_ban, password FROM users WHERE name = ? LIMIT 1`, name, function (err, rows, fields) {
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

user.doesExistUser = function(name, callback) {
    methods.debug('user.doesExistUser');
    name = methods.removeQuotes(name);
    mysql.executeQuery(`SELECT id FROM users WHERE name = '${name}' LIMIT 1`, function (err, rows, fields) {
        if (err) {
            methods.debug('[DATABASE | ERROR]');
            methods.debug(err);
            return callback(true);
        }

        if (rows.length === 0)
            return callback(false);
        return callback(true);
    });
};

user.validateAccount = function(login, pass, callback) {
    methods.debug('user.validateAccount');
    mysql.executeQuery(`SELECT password FROM accounts WHERE login = ? LIMIT 1`, login, function (err, rows, fields) {
        if (err) {
            methods.debug('[DATABASE | ERROR]');
            methods.debug(err);
            return callback(false);
        }

        rows.forEach(function(item) {
            if (item.password !== methods.sha256(pass))
                return callback(false);
            return callback(true);
        });

        if (rows.length === 0)
            return callback(false);
    });
};

user.doesExistAccount = function(login, email, social, callback) {
    methods.debug('user.doesExistAccount');
    login = methods.removeQuotes(login);
    email = methods.removeQuotes(email);
    social = methods.removeQuotes(social);
    mysql.executeQuery(`SELECT login, email, social FROM accounts WHERE login = '${login}' OR email = '${email}' OR social = '${social}' LIMIT 1`, function (err, rows, fields) {
        if (err) {
            methods.debug('[DATABASE | ERROR]');
            methods.debug(err);
            return callback(1);
        }

        if (rows.length === 0)
            return callback(0);
        else if (login == rows[0].login)
            return callback(2);
        else if (email == rows[0].email)
            return callback(3);
        return callback(1);
    });
};

/*
* StyleType = HEX
* 0 = White
* 1 = Blue
* 2 = Green
* 3 = Yellow
* 4 = Red
* */
user.showCustomNotify = function(player, text, style = 0) {
    methods.debug('user.showCustomNotify', text);
    if (!mp.players.exists(player))
        return;
    //Number.isInteger(style)
    player.notify(text);
    //player.call('client:ui:showCustomNotify', [text]);
};

user.setById = function(id, key, val) {
    Container.Data.Set(id, key, val);
};

user.hasById = function(id, key) {
    return Container.Data.Has(id, key);
};

user.getById = function(id, key) {
    try {
        return Container.Data.Get(id, key);
    } catch (e) {
        methods.debug(e);
    }
    return null;
};

user.set = function(player, key, val) {
    //methods.debug('user.set');
    if (!mp.players.exists(player))
        return false;
    Container.Data.Set(player.id, key, val);
};

user.reset = function(player, key) {
    //methods.debug('user.reset');
    if (!mp.players.exists(player))
        return false;
    Container.Data.Reset(player.id, key);
};

user.get = function(player, key) {
    //methods.debug('user.get');
    if (!mp.players.exists(player))
        return null;
    try {
        return Container.Data.Get(player.id, key);
    } catch (e) {
        methods.debug(e);
    }
    return null;
};

user.has = function(player, key) {
    if (!mp.players.exists(player))
        return false;
    return Container.Data.Has(player.id, key);
};

user.getId = function(player) {
    if (!mp.players.exists(player))
        return -1;
    if (player.getVariable('id'))
        return methods.parseInt(player.getVariable('id'));
    return -1;
};

user.getPlayerById = function(id) {
    let player = null;
    mp.players.forEach(pl => {
        if (user.isLogin(pl) && user.getId(pl) == id)
            player = pl;
    });
    return player;
};

user.getVehicleDriver = function(vehicle) {
    let driver = null;
    if (!mp.vehicles.exists(vehicle))
        return driver;
    vehicle.getOccupants().forEach((p) => {
        if (p.seat == -1)
            driver = p;
    });
    return driver;
};