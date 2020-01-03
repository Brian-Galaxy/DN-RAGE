let mysql = require('./modules/mysql');
let methods = require('./modules/methods');
let Container = require('./modules/data');
let enums = require('./enums');
let coffer = require('./coffer');
let chat = require('./modules/chat');

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

        let sql = "INSERT INTO accounts (login, email, social, serial, password, reg_ip, reg_timestamp) VALUES ('" + login +
            "', '" + email + "', '" + player.socialClub + "', '" + player.serial + "', '" + methods.sha256(pass) + "', '" + player.ip + "', '" + methods.getTimeStamp() + "')";
        mysql.executeQuery(sql);

        setTimeout(function () {
            user.loginAccount(player, login, pass);
        }, 1000)
    });
};

let skin = {
    SKIN_SEX: 0,
    SKIN_MOTHER_FACE: 0,
    SKIN_FATHER_FACE: 0,
    SKIN_MOTHER_SKIN: 0,
    SKIN_FATHER_SKIN: 0,
    SKIN_PARENT_FACE_MIX: 0,
    SKIN_PARENT_SKIN_MIX: 0,
    SKIN_HAIR: 0,
    SKIN_HAIR_COLOR: 0,
    SKIN_EYE_COLOR: 0,
    SKIN_EYEBROWS: 0,
    SKIN_EYEBROWS_COLOR: 0,
    SKIN_OVERLAY_1: -1,
    SKIN_OVERLAY_COLOR_1: -1,
    SKIN_OVERLAY_2: -1,
    SKIN_OVERLAY_COLOR_2: -1,
    SKIN_OVERLAY_3: -1,
    SKIN_OVERLAY_COLOR_3: -1,
    SKIN_OVERLAY_4: -1,
    SKIN_OVERLAY_COLOR_4: -1,
    SKIN_OVERLAY_5: -1,
    SKIN_OVERLAY_COLOR_5: -1,
    SKIN_OVERLAY_6: -1,
    SKIN_OVERLAY_COLOR_6: -1,
    SKIN_OVERLAY_7: -1,
    SKIN_OVERLAY_COLOR_7: -1,
    SKIN_OVERLAY_8: -1,
    SKIN_OVERLAY_COLOR_8: -1,
    SKIN_OVERLAY_9: -1,
    SKIN_OVERLAY_COLOR_9: -1,
    SKIN_OVERLAY_10: -1,
    SKIN_OVERLAY_COLOR_10: -1,
    SKIN_OVERLAY_11: -1,
    SKIN_OVERLAY_COLOR_11: 0,
    SKIN_OVERLAY_12: -1,
    SKIN_OVERLAY_COLOR_12: -1,
    SKIN_FACE_SPECIFICATIONS: [],
};

user.createUser = function(player, name, surname, age, national) {

    methods.debug('user.createUser');

    if (!mp.players.exists(player))
        return;

    user.doesExistUser(name + ' ' + surname, function (cb) {

        if (cb == true) {
            user.showCustomNotify(player, 'Имя и Фамилия уже занята другим пользователем, попробуйте другое', 4);
            return;
        }

        user.showCustomNotify(player, 'Пожалуйста подожите...', 1);

        let newAge = '01.01.' + (2010 - age); //TODO

        let sql = "INSERT INTO users (name, age, social, national, skin, parachute, parachute_color, body_color, leg_color, foot_color, body, leg, foot, login_ip, login_date, reg_ip, reg_timestamp) VALUES ('" + name + ' ' + surname +
            "', '" + newAge + "', '" + player.socialClub + "', '" + national + "', '" + JSON.stringify(skin) + "', '0', '44', '" + methods.getRandomInt(0, 5) + "', '" + methods.getRandomInt(0, 15) + "', '" + methods.getRandomInt(0, 15) + "', '0', '1', '1', '" + player.ip + "', '" + methods.getTimeStamp() + "', '" + player.ip + "', '" + methods.getTimeStamp() + "')";
        mysql.executeQuery(sql);

        setTimeout(function () {
            user.loginUser(player, name + ' ' + surname);
        }, 1000)
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
        {
            let players = [];

            mysql.executeQuery(`SELECT * FROM users WHERE social = ? LIMIT 3`, player.socialClub, function (err, rows, fields) {
                if (!mp.players.exists(player))
                    return;
                if (err) {
                    player.call('client:events:loginAccount:success', [JSON.stringify(players)]);
                }
                else {
                    rows.forEach(row => {
                        let sex = JSON.parse(row['skin'])['SKIN_SEX'] == 0 ? "m" : "w";
                        methods.debug(sex);
                        players.push({name: row['name'], age: row['id'], money: row['money'], sex: sex, spawnList: ['Стандарт', 'Стандарт2'], lastLogin: methods.unixTimeStampToDate(row['login_date'])})
                    });

                    player.call('client:events:loginAccount:success', [JSON.stringify(players)]);
                }
            });
        }
        else
            user.showCustomNotify(player, 'Произошла неизвестная ошибка. Код ошибки #9999', 4);
        //player.notify('~b~Входим в аккаунт...');
    });
};

user.loginUser = function(player, name, spawn = 'Стандарт') {

    methods.debug('user.loginAccount');
    if (!mp.players.exists(player))
        return false;
    user.validateUser(name, function (callback) {

        if (callback == false) {
            user.showCustomNotify(player, 'Ошибка авторизации аккаунта, попробуйте еще раз', 4);
            return;
        }

        if (mp.players.exists(player))
            user.loadUser(player, name, spawn);
        else
            user.showCustomNotify(player, 'Произошла неизвестная ошибка. Код ошибки #9999', 4);
        //player.notify('~b~Входим в аккаунт...');
    });
};

user.save = function(player, withReset = false) {
    return new Promise(resolve => {
        methods.debug('user.saveAccount');

        if (!mp.players.exists(player)) {
            resolve(false);
            return;
        }

        if (!user.isLogin(player)) {
            resolve(false);
            return;
        }

        let sql = "UPDATE users SET social = '" + player.socialClub + "'";

        let skin = {};
        skin.SKIN_MOTHER_FACE = methods.parseInt(user.get(player, "SKIN_MOTHER_FACE"));
        skin.SKIN_FATHER_FACE = methods.parseInt(user.get(player, "SKIN_FATHER_FACE"));
        skin.SKIN_MOTHER_SKIN = methods.parseInt(user.get(player, "SKIN_MOTHER_SKIN"));
        skin.SKIN_FATHER_SKIN = methods.parseInt(user.get(player, "SKIN_FATHER_SKIN"));
        skin.SKIN_PARENT_FACE_MIX = user.get(player, "SKIN_PARENT_FACE_MIX");
        skin.SKIN_PARENT_SKIN_MIX = user.get(player, "SKIN_PARENT_SKIN_MIX");
        skin.SKIN_HAIR = methods.parseInt(user.get(player, "SKIN_HAIR"));
        skin.SKIN_HAIR_COLOR = methods.parseInt(user.get(player, "SKIN_HAIR_COLOR"));
        skin.SKIN_EYE_COLOR = methods.parseInt(user.get(player, "SKIN_EYE_COLOR"));
        skin.SKIN_EYEBROWS = methods.parseInt(user.get(player, "SKIN_EYEBROWS"));
        skin.SKIN_EYEBROWS_COLOR = methods.parseInt(user.get(player, "SKIN_EYEBROWS_COLOR"));
        skin.SKIN_OVERLAY_1 = methods.parseInt(user.get(player, "SKIN_OVERLAY_1"));
        skin.SKIN_OVERLAY_COLOR_1 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_1"));
        skin.SKIN_OVERLAY_2 = methods.parseInt(user.get(player, "SKIN_OVERLAY_2"));
        skin.SKIN_OVERLAY_COLOR_2 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_2"));
        skin.SKIN_OVERLAY_3 = methods.parseInt(user.get(player, "SKIN_OVERLAY_3"));
        skin.SKIN_OVERLAY_COLOR_3 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_3"));
        skin.SKIN_OVERLAY_4 = methods.parseInt(user.get(player, "SKIN_OVERLAY_4"));
        skin.SKIN_OVERLAY_COLOR_4 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_4"));
        skin.SKIN_OVERLAY_5 = methods.parseInt(user.get(player, "SKIN_OVERLAY_5"));
        skin.SKIN_OVERLAY_COLOR_5 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_5"));
        skin.SKIN_OVERLAY_6 = methods.parseInt(user.get(player, "SKIN_OVERLAY_6"));
        skin.SKIN_OVERLAY_COLOR_6 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_6"));
        skin.SKIN_OVERLAY_7 = methods.parseInt(user.get(player, "SKIN_OVERLAY_7"));
        skin.SKIN_OVERLAY_COLOR_7 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_7"));
        skin.SKIN_OVERLAY_8 = methods.parseInt(user.get(player, "SKIN_OVERLAY_8"));
        skin.SKIN_OVERLAY_COLOR_8 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_8"));
        skin.SKIN_OVERLAY_9 = methods.parseInt(user.get(player, "SKIN_OVERLAY_9"));
        skin.SKIN_OVERLAY_COLOR_9 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_9"));
        skin.SKIN_OVERLAY_10 = methods.parseInt(user.get(player, "SKIN_OVERLAY_10"));
        skin.SKIN_OVERLAY_COLOR_10 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_10"));
        skin.SKIN_OVERLAY_11 = methods.parseInt(user.get(player, "SKIN_OVERLAY_11"));
        skin.SKIN_OVERLAY_COLOR_11 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_11"));
        skin.SKIN_OVERLAY_12 = methods.parseInt(user.get(player, "SKIN_OVERLAY_12"));
        skin.SKIN_OVERLAY_COLOR_12 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_12"));
        skin.SKIN_FACE_SPECIFICATIONS = user.get(player, "SKIN_FACE_SPECIFICATIONS");
        skin.SKIN_SEX = user.get(player, "SKIN_SEX");

        user.set(player, 'skin', JSON.stringify(skin));

        enums.userData.forEach(function(element) {
            if (element === 'id') return;
            else if (element === 'name') return;
            else if (element === 'is_online') return;

            if (user.has(player, element)) {
                if (typeof user.get(player, element) == 'boolean')
                    sql += `, ${element} = '${user.get(player, element) === true ? 1 : 0}'`;
                else if (typeof user.get(player, element) != 'object' && typeof user.get(player, element) != 'undefined') {
                    if (typeof(user.get(player, element)) == 'number' && isNaN(user.get(player, element))) return;
                    sql += `, ${element} = '${user.get(player, element)}'`;
                }
            }
        });

        sql = sql + " where id = '" + user.get(player, "id") + "'";
        mysql.executeQuery(sql);

        if (withReset === true) {

        }
        else
            user.updateClientCache(player);
        resolve(true);
        return;
    });

};

user.loadUser = function(player, name, spawn = 'Стандарт') {

    methods.debug('user.loadAccount');
    if (!mp.players.exists(player))
        return false;
    let selectSql = 'id';
    enums.userData.forEach(function(element) {
        selectSql += `, ${element}`;
    });

    let userId = 0;
    if (user.isLogin(player))
        userId = user.getId(player);

    mysql.executeQuery(`SELECT ${selectSql} FROM users WHERE name = ? LIMIT 1`, name, function (err, rows, fields) {

        enums.userData.forEach(function(element) {
            user.set(player, element, rows[0][element]);
        });

        setTimeout(function() {
            //user.updateCharacterFace(player);
            //user.updateCharacterCloth(player);

            if (!mp.players.exists(player))
                return false;

            if (user.get(player, 'date_ban') > methods.getTimeStamp()) {
                user.showCustomNotify(player, 'Аккаунт забанен до: ' + methods.unixTimeStampToDateTime(user.get(player, 'date_ban')), 4);
                return;
            }

            /*if (user.get(player, 'is_online') == 1) {
                user.showCustomNotify(player, 'Аккаунт уже авторизован', 4);
                return;
            }*/

            JSON.parse(user.get(player, 'skin'), function(k, v) {
                user.set(player, k, v);
            });

            user.set(player, 'ping', player.ping);

            try {
                user.set(player, 'login_date', methods.getTimeStamp());
                user.set(player, 'login_ip', player.ip);

                //mysql.executeQuery(`INSERT INTO log_auth (nick, lic, datetime) VALUES ('${user.getRpName(player)}', '${player.serial}', '${methods.getTimeStamp()}')`);
            } catch (e) {
                methods.debug(e);
            }

            setTimeout(function () {
                if (userId > 0)
                    mysql.executeQuery('UPDATE users SET is_online=\'0\' WHERE id = \'' + userId + '\'');

                if (!mp.players.exists(player))
                    return false;

                user.updateCharacterFace(player);
                setTimeout(function () {
                    user.updateCharacterCloth(player);
                }, 200);
                user.updateClientCache(player);

                player.setVariable('idLabel', user.get(player, 'id'));
                player.setVariable('name', user.get(player, 'name'));
                player.dimension = 0;

                //methods.saveLog('PlayerActivity', `[LOGIN] ${player.socialClub} | ${player.serial} | ${player.address} | ${user.getId(player)}`);

                userId = user.getId(player);

                //TODO Оптимизировать
                /*mysql.executeQuery(`SELECT * FROM user_dating WHERE user_owner = '${userId}'`, function (err, rowsD, fields) {
                    rowsD.forEach(rowD => {
                        user.setDating(player, rowD['user_id'], rowD['user_name']);
                    });
                });*/

                mysql.executeQuery('UPDATE users SET is_online=\'1\' WHERE id = \'' + user.getId(player) + '\'');

                if (!user.get(player, 'is_custom'))
                    player.call('client:events:loginUser:finalCreate');
                else {
                    user.spawnByName(player, spawn);
                }
                //user.setOnlineStatus(player, 1);
            }, 600);

            //if (user.get(player, 'walkietalkie_num') && methods.parseInt(user.get(player, 'walkietalkie_num')) != 0)
            //    mp.events.call('voice.server.initRadio', player, user.get(player, 'walkietalkie_num'));

        }, 1000);
    });
};

user.spawnByName = function(player, spawn = 'Стандарт') { //TODO by LVL
    methods.debug('user.spawnByName', spawn);
    if (!user.isLogin(player))
        return false;
    user.showLoadDisplay(player);
    setTimeout(function () {
        if (!user.isLogin(player))
            return false;

        if (spawn == 'Дом') {
            //...
        }
        else {
            let roleId = user.get(player, 'role') - 1;
            player.spawn(new mp.Vector3(enums.spawnByRole[roleId][0], enums.spawnByRole[roleId][1], enums.spawnByRole[roleId][2]));
            player.heading = enums.spawnByRole[roleId][3];
        }

        setTimeout(function () {
            user.hideLoadDisplay(player);
        }, 500);
    }, 500);
};

user.updateClientCache = function(player) {
    if (!mp.players.exists(player))
        return;
    try {
        let skin = {};

        skin.SKIN_MOTHER_FACE = methods.parseInt(user.get(player, "SKIN_MOTHER_FACE"));
        skin.SKIN_FATHER_FACE = methods.parseInt(user.get(player, "SKIN_FATHER_FACE"));
        skin.SKIN_MOTHER_SKIN = methods.parseInt(user.get(player, "SKIN_MOTHER_SKIN"));
        skin.SKIN_FATHER_SKIN = methods.parseInt(user.get(player, "SKIN_FATHER_SKIN"));
        skin.SKIN_PARENT_FACE_MIX = user.get(player, "SKIN_PARENT_FACE_MIX");
        skin.SKIN_PARENT_SKIN_MIX = user.get(player, "SKIN_PARENT_SKIN_MIX");
        skin.SKIN_HAIR = methods.parseInt(user.get(player, "SKIN_HAIR"));
        skin.SKIN_HAIR_COLOR = methods.parseInt(user.get(player, "SKIN_HAIR_COLOR"));
        skin.SKIN_EYE_COLOR = methods.parseInt(user.get(player, "SKIN_EYE_COLOR"));
        skin.SKIN_EYEBROWS = methods.parseInt(user.get(player, "SKIN_EYEBROWS"));
        skin.SKIN_EYEBROWS_COLOR = methods.parseInt(user.get(player, "SKIN_EYEBROWS_COLOR"));
        skin.SKIN_OVERLAY_1 = methods.parseInt(user.get(player, "SKIN_OVERLAY_1"));
        skin.SKIN_OVERLAY_COLOR_1 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_1"));
        skin.SKIN_OVERLAY_2 = methods.parseInt(user.get(player, "SKIN_OVERLAY_2"));
        skin.SKIN_OVERLAY_COLOR_2 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_2"));
        skin.SKIN_OVERLAY_3 = methods.parseInt(user.get(player, "SKIN_OVERLAY_3"));
        skin.SKIN_OVERLAY_COLOR_3 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_3"));
        skin.SKIN_OVERLAY_4 = methods.parseInt(user.get(player, "SKIN_OVERLAY_4"));
        skin.SKIN_OVERLAY_COLOR_4 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_4"));
        skin.SKIN_OVERLAY_5 = methods.parseInt(user.get(player, "SKIN_OVERLAY_5"));
        skin.SKIN_OVERLAY_COLOR_5 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_5"));
        skin.SKIN_OVERLAY_6 = methods.parseInt(user.get(player, "SKIN_OVERLAY_6"));
        skin.SKIN_OVERLAY_COLOR_6 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_6"));
        skin.SKIN_OVERLAY_7 = methods.parseInt(user.get(player, "SKIN_OVERLAY_7"));
        skin.SKIN_OVERLAY_COLOR_7 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_7"));
        skin.SKIN_OVERLAY_8 = methods.parseInt(user.get(player, "SKIN_OVERLAY_8"));
        skin.SKIN_OVERLAY_COLOR_8 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_8"));
        skin.SKIN_OVERLAY_9 = methods.parseInt(user.get(player, "SKIN_OVERLAY_9"));
        skin.SKIN_OVERLAY_COLOR_9 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_9"));
        skin.SKIN_OVERLAY_10 = methods.parseInt(user.get(player, "SKIN_OVERLAY_10"));
        skin.SKIN_OVERLAY_COLOR_10 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_10"));
        skin.SKIN_OVERLAY_11 = methods.parseInt(user.get(player, "SKIN_OVERLAY_11"));
        skin.SKIN_OVERLAY_COLOR_11 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_11"));
        skin.SKIN_OVERLAY_12 = methods.parseInt(user.get(player, "SKIN_OVERLAY_12"));
        skin.SKIN_OVERLAY_COLOR_12 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_12"));
        skin.SKIN_FACE_SPECIFICATIONS = user.get(player, "SKIN_FACE_SPECIFICATIONS");
        skin.SKIN_SEX = user.get(player, "SKIN_SEX");

        user.set(player, 'skin', JSON.stringify(skin));

        player.call('client:user:updateCache', [Array.from(Container.Data.GetAll(player.id))]);
        methods.debug('user.updateClientCache', Array.from(Container.Data.GetAll(player.id)));
    }
    catch (e) {
        methods.debug(e);
    }
};


user.updateCharacterFace = function(player) {

    methods.debug('user.updateCharacterFace');
    if (!mp.players.exists(player))
        return;
    try {
        let health = player.health;
        let skin = {};

        skin.SKIN_MOTHER_FACE = methods.parseInt(user.get(player, "SKIN_MOTHER_FACE"));
        skin.SKIN_FATHER_FACE = methods.parseInt(user.get(player, "SKIN_FATHER_FACE"));
        skin.SKIN_MOTHER_SKIN = methods.parseInt(user.get(player, "SKIN_MOTHER_SKIN"));
        skin.SKIN_FATHER_SKIN = methods.parseInt(user.get(player, "SKIN_FATHER_SKIN"));
        skin.SKIN_PARENT_FACE_MIX = user.get(player, "SKIN_PARENT_FACE_MIX");
        skin.SKIN_PARENT_SKIN_MIX = user.get(player, "SKIN_PARENT_SKIN_MIX");
        skin.SKIN_HAIR = methods.parseInt(user.get(player, "SKIN_HAIR"));
        skin.SKIN_HAIR_COLOR = methods.parseInt(user.get(player, "SKIN_HAIR_COLOR"));
        skin.SKIN_EYE_COLOR = methods.parseInt(user.get(player, "SKIN_EYE_COLOR"));
        skin.SKIN_EYEBROWS = methods.parseInt(user.get(player, "SKIN_EYEBROWS"));
        skin.SKIN_EYEBROWS_COLOR = methods.parseInt(user.get(player, "SKIN_EYEBROWS_COLOR"));
        skin.SKIN_OVERLAY_1 = methods.parseInt(user.get(player, "SKIN_OVERLAY_1"));
        skin.SKIN_OVERLAY_COLOR_1 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_1"));
        skin.SKIN_OVERLAY_2 = methods.parseInt(user.get(player, "SKIN_OVERLAY_2"));
        skin.SKIN_OVERLAY_COLOR_2 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_2"));
        skin.SKIN_OVERLAY_3 = methods.parseInt(user.get(player, "SKIN_OVERLAY_3"));
        skin.SKIN_OVERLAY_COLOR_3 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_3"));
        skin.SKIN_OVERLAY_4 = methods.parseInt(user.get(player, "SKIN_OVERLAY_4"));
        skin.SKIN_OVERLAY_COLOR_4 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_4"));
        skin.SKIN_OVERLAY_5 = methods.parseInt(user.get(player, "SKIN_OVERLAY_5"));
        skin.SKIN_OVERLAY_COLOR_5 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_5"));
        skin.SKIN_OVERLAY_6 = methods.parseInt(user.get(player, "SKIN_OVERLAY_6"));
        skin.SKIN_OVERLAY_COLOR_6 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_6"));
        skin.SKIN_OVERLAY_7 = methods.parseInt(user.get(player, "SKIN_OVERLAY_7"));
        skin.SKIN_OVERLAY_COLOR_7 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_7"));
        skin.SKIN_OVERLAY_8 = methods.parseInt(user.get(player, "SKIN_OVERLAY_8"));
        skin.SKIN_OVERLAY_COLOR_8 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_8"));
        skin.SKIN_OVERLAY_9 = methods.parseInt(user.get(player, "SKIN_OVERLAY_9"));
        skin.SKIN_OVERLAY_COLOR_9 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_9"));
        skin.SKIN_OVERLAY_10 = methods.parseInt(user.get(player, "SKIN_OVERLAY_10"));
        skin.SKIN_OVERLAY_COLOR_10 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_10"));
        skin.SKIN_OVERLAY_11 = methods.parseInt(user.get(player, "SKIN_OVERLAY_11"));
        skin.SKIN_OVERLAY_COLOR_11 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_11"));
        skin.SKIN_OVERLAY_12 = methods.parseInt(user.get(player, "SKIN_OVERLAY_12"));
        skin.SKIN_OVERLAY_COLOR_12 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_12"));
        skin.SKIN_FACE_SPECIFICATIONS = user.get(player, "SKIN_FACE_SPECIFICATIONS");
        skin.SKIN_SEX = user.get(player, "SKIN_SEX");

        //if (skin.SKIN_SEX == 0 )

        if (user.getSex(player) != skin.SKIN_SEX) {
            if (skin.SKIN_SEX == 1)
                player.model =  mp.joaat('mp_f_freemode_01');
            else
                player.model =  mp.joaat('mp_m_freemode_01');
        }

        player.setHeadBlend(
            skin.SKIN_MOTHER_FACE,
            skin.SKIN_FATHER_FACE,
            0,
            skin.SKIN_MOTHER_SKIN,
            skin.SKIN_FATHER_SKIN,
            0,
            skin.SKIN_PARENT_FACE_MIX,
            skin.SKIN_PARENT_SKIN_MIX,
            0
        );

        /*player.setCustomization(
            skin.SEX==0,
            skin.GTAO_SHAPE_THRID_ID,
            skin.GTAO_SHAPE_SECOND_ID,
            skin.GTAO_SHAPE_FIRST_ID,
            skin.GTAO_SKIN_THRID_ID,
            skin.GTAO_SKIN_SECOND_ID,
            skin.GTAO_SKIN_FIRST_ID,
            skin.GTAO_SHAPE_MIX,
            skin.GTAO_SKIN_MIX,
            skin.GTAO_THRID_MIX,
            skin.GTAO_EYE_COLOR,
            skin.GTAO_HAIR_COLOR,
            skin.GTAO_HAIR_COLOR2,
            [
                0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
            ]
        );*/

        player.setClothes(2, skin.SKIN_HAIR, 0, 0);
        player.setHeadOverlay(2, [skin.SKIN_EYEBROWS, 1, skin.SKIN_EYEBROWS_COLOR, 0]);

        if (skin.SKIN_FACE_SPECIFICATIONS) {
            try {
                JSON.parse(skin.SKIN_FACE_SPECIFICATIONS).forEach((item, i) => {
                    try {
                        player.setFaceFeature(methods.parseInt(i), parseFloat(item));
                    }
                    catch (e) {
                        methods.debug(e);
                    }
                })
            } catch(e) {
                methods.debug(e);
                methods.debug(skin.SKIN_FACE_SPECIFICATIONS);
            }
        }

        user.updateTattoo(player);

        if (user.get(player, 'age') > 72)
            player.setHeadOverlay(3, [14, 1, 1, 1]);
        else if (user.get(player, 'age') > 69)
            player.setHeadOverlay(3, [16, 1, 1, 1]);
        else if (user.get(player, 'age') > 66)
            player.setHeadOverlay(3, [12, 1, 1, 1]);
        else if (user.get(player, 'age') > 63)
            player.setHeadOverlay(3, [11, 0.9, 1, 1]);
        else if (user.get(player, 'age') > 60)
            player.setHeadOverlay(3, [10, 0.9, 1, 1]);
        else if (user.get(player, 'age') > 57)
            player.setHeadOverlay(3, [9, 0.9, 1, 1]);
        else if (user.get(player, 'age') > 54)
            player.setHeadOverlay(3, [8, 0.8, 1, 1]);
        else if (user.get(player, 'age') > 51)
            player.setHeadOverlay(3, [7, 0.7, 1, 1]);
        else if (user.get(player, 'age') > 48)
            player.setHeadOverlay(3, [6, 0.6, 1, 1]);
        else if (user.get(player, 'age') > 45)
            player.setHeadOverlay(3, [5, 0.5, 1, 1]);
        else if (user.get(player, 'age') > 42)
            player.setHeadOverlay(3, [4, 0.4, 1, 1]);
        else if (user.get(player, 'age') > 39)
            player.setHeadOverlay(3, [4, 0.4, 1, 1]);
        else if (user.get(player, 'age') > 36)
            player.setHeadOverlay(3, [3, 0.3, 1, 1]);
        else if (user.get(player, 'age') > 33)
            player.setHeadOverlay(3, [1, 0.2, 1, 1]);
        else if (user.get(player, 'age') > 30)
            player.setHeadOverlay(3, [0, 0.1, 1, 1]);

        if (skin.SKIN_OVERLAY_9 != -1 && skin.SKIN_OVERLAY_9 != undefined)
            player.setHeadOverlay(9, [skin.SKIN_OVERLAY_9, 1, skin.SKIN_OVERLAY_COLOR_9, skin.SKIN_OVERLAY_COLOR_9]);

        if (skin.SKIN_SEX == 0) {
            if (skin.SKIN_OVERLAY_10 != undefined)
                player.setHeadOverlay(10, [skin.SKIN_OVERLAY_10, 1, skin.SKIN_OVERLAY_COLOR_10, skin.SKIN_OVERLAY_COLOR_10]);
            if (skin.SKIN_OVERLAY_1 != undefined)
                player.setHeadOverlay(1, [skin.SKIN_OVERLAY_1, 1, skin.SKIN_OVERLAY_COLOR_1, 0]);
        }
        else if (skin.SKIN_SEX == 1) {
            if (skin.SKIN_OVERLAY_4 != undefined)
                player.setHeadOverlay(4, [skin.SKIN_OVERLAY_4, 1, skin.SKIN_OVERLAY_COLOR_4, skin.SKIN_OVERLAY_COLOR_4]);
            if (skin.SKIN_OVERLAY_5 != undefined)
                player.setHeadOverlay(5, [skin.SKIN_OVERLAY_5, 1, skin.SKIN_OVERLAY_COLOR_5, skin.SKIN_OVERLAY_COLOR_5]);
            if (skin.SKIN_OVERLAY_8 != undefined)
                player.setHeadOverlay(8, [skin.SKIN_OVERLAY_8, 1, skin.SKIN_OVERLAY_COLOR_8, skin.SKIN_OVERLAY_COLOR_8]);
        }

        player.health = health;

    } catch (e) {
        methods.debug('Exception: user.updateCharacterFace');
        methods.debug(e);
        setTimeout(function () {
            user.updateCharacterFace(player);
        }, 2500);
    }
};

user.getSex = function(player) {
    if (!mp.players.exists(player))
        return 0;
    if (player.model === mp.joaat('mp_f_freemode_01'))
        return 1;
    else
        return 0;
};

user.updateCharacterCloth = function(player) {

    methods.debug('user.updateCharacterCloth');
    if (!mp.players.exists(player))
        return;
    try {

        user.updateTattoo(player);
        user.clearAllProp(player); //TODO переделать

        let cloth_data = {};

        cloth_data.torso = user.get(player, 'torso');
        cloth_data.torso_color = user.get(player, 'torso_color');
        cloth_data.leg = user.get(player, 'leg');
        cloth_data.leg_color = user.get(player, 'leg_color');
        cloth_data.hand = user.get(player, 'hand');
        cloth_data.hand_color = user.get(player, 'hand_color');
        cloth_data.foot = user.get(player, 'foot');
        cloth_data.foot_color = user.get(player, 'foot_color');
        cloth_data.accessorie = user.get(player, 'accessorie');
        cloth_data.accessorie_color = user.get(player, 'accessorie_color');
        cloth_data.parachute = user.get(player, 'parachute');
        cloth_data.parachute_color = user.get(player, 'parachute_color');
        cloth_data.armor = user.get(player, 'armor');
        cloth_data.armor_color = user.get(player, 'armor_color');
        cloth_data.decal = user.get(player, 'decal');
        cloth_data.decal_color = user.get(player, 'decal_color');
        cloth_data.body = user.get(player, 'body');
        cloth_data.body_color = user.get(player, 'body_color');
        cloth_data.mask = user.get(player, 'mask');
        cloth_data.mask_color = user.get(player, 'mask_color');
        cloth_data.hat = user.get(player, 'hat');
        cloth_data.hat_color = user.get(player, 'hat_color');
        cloth_data.glasses = user.get(player, 'glasses');
        cloth_data.glasses_color = user.get(player, 'glasses_color');
        cloth_data.ear = user.get(player, 'ear');
        cloth_data.ear_color = user.get(player, 'ear_color');
        cloth_data.watch = user.get(player, 'watch');
        cloth_data.watch_color = user.get(player, 'watch_color');
        cloth_data.bracelet = user.get(player, 'bracelet');
        cloth_data.bracelet_color = user.get(player, 'bracelet_color');

        /*if (Container.Data.Has(player.id, 'hasBuyMask')) {
            user.setComponentVariation(player, 1, cloth_data['mask'], cloth_data['mask_color'], 2);
        }*/

        user.setComponentVariation(player, 1, cloth_data['mask'], cloth_data['mask_color'], 2);
        user.setComponentVariation(player, 3, cloth_data['torso'], cloth_data['torso_color'], 2);
        user.setComponentVariation(player, 4, cloth_data['leg'], cloth_data['leg_color'], 2);
        user.setComponentVariation(player, 5, cloth_data['hand'], cloth_data['hand_color'], 2);
        user.setComponentVariation(player, 6, cloth_data['foot'], cloth_data['foot_color'], 2);
        user.setComponentVariation(player, 7, cloth_data['accessorie'], cloth_data['accessorie_color'], 2);
        user.setComponentVariation(player, 8, cloth_data['parachute'], cloth_data['parachute_color'], 2);
        user.setComponentVariation(player, 9, cloth_data['armor'], cloth_data['armor_color'], 2);
        user.setComponentVariation(player, 10, cloth_data['decal'], cloth_data['decal_color'], 2);
        user.setComponentVariation(player, 11, cloth_data['body'], cloth_data['body_color'], 2);

        setTimeout(function () {
            if (!mp.players.exists(player))
                return;
            if (cloth_data['hat'] >= 0) {
                user.setProp(player, 0, cloth_data['hat'], cloth_data['hat_color']);
            }
            if (cloth_data['glasses'] >= 0) {
                user.setProp(player, 1, cloth_data['glasses'], cloth_data['glasses_color']);
            }
            if (cloth_data['ear'] >= 0) {
                user.setProp(player, 2, cloth_data['ear'], cloth_data['ear_color']);
            }
            if (cloth_data['watch'] >= 0) {
                user.setProp(player, 6, cloth_data['watch'], cloth_data['watch_color']);
            }
            if (cloth_data['bracelet'] >= 0) {
                user.setProp(player, 7, cloth_data['bracelet'], cloth_data['bracelet_color']);
            }
        }, 10); //TODO
    } catch (e) {
        methods.debug(e);
    }
};

user.updateTattoo = function(player) {
    methods.debug('user.updateTAttoo');
    if (!user.isLogin(player))
        return;

    user.clearDecorations(player);
    let tattooList = JSON.parse(user.get(player, 'tattoo'));

    if (tattooList != null) {
        try {
            tattooList.forEach(function (item) {
                user.setDecoration(player, item[0], item[1]);
            });
        }
        catch (e) {
            methods.debug(e);
        }
    }

    let data = enums.hairOverlays[methods.parseInt(user.get(player, "SKIN_SEX"))][user.get(player, "SKIN_HAIR")];
    user.setDecoration(player, data[0], data[1]);

    if (user.get(player, 'tprint_c') != "" && user.get(player, 'tprint_o') != "")
        user.setDecoration(player, user.get(player, 'tprint_c'), user.get(player, 'tprint_o'));
};


user.validateUser = function(name, callback) {
    methods.debug('user.validateUser');
    mysql.executeQuery(`SELECT * FROM users WHERE name = ? LIMIT 1`, name, function (err, rows, fields) {
        if (err) {
            methods.debug('[DATABASE | ERROR]');
            methods.debug(err);
            return callback(false);
        }

        if (rows.length === 0)
            return callback(false);
        return callback(true);
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

        if (rows.length === 0)
            return callback(false);
        rows.forEach(function(item) {
            if (item.password !== methods.sha256(pass))
                return callback(false);
            return callback(true);
        });
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

user.clearAllProp = function(player) {
    methods.debug('user.clearAllProp');
    if (!mp.players.exists(player))
        return false;

    for (let i = 0; i < 8; i++)
        user.setProp(player, i, -1, -1);

    let pos = player.position;
    mp.players.forEach((p) => {
        if (methods.distanceToPos(pos, p.position) < 300)
            p.call('client:user:clearAllProp', [player.id]);
    });
    //mp.players.call('client:user:clearAllProp', [player.id]);
};

user.setComponentVariation = function(player, component, drawableId, textureId) {
    methods.debug('user.setComponentVariation');
    if (!mp.players.exists(player))
        return false;
    component = methods.parseInt(component);
    drawableId = methods.parseInt(drawableId);
    textureId = methods.parseInt(textureId);

    if (component == 8 && drawableId == -1 && textureId == 240) {
        textureId = -1;
        drawableId = 0;
    }

    player.setClothes(component, drawableId, textureId, 2);
    //player.call('client:user:setComponentVariation', [component, drawableId, textureId]);
};

user.setProp = function(player, slot, type, color) {
    methods.debug('user.setProp');
    if (!mp.players.exists(player))
        return false;

    slot = methods.parseInt(slot);
    type = methods.parseInt(type);
    color = methods.parseInt(color);

    player.setVariable('propType' + slot, type);
    player.setVariable('propColor' + slot, color);

    player.setProp(slot, type, color);
};

user.clearDecorations = function(player) {
    methods.debug('user.clearDecorations');
    if (!mp.players.exists(player))
        return false;
    player.clearDecorations();

};

user.setDecoration = function(player, slot, overlay) {
    methods.debug('user.setDecoration');
    if (!mp.players.exists(player))
        return false;
    player.setDecoration(mp.joaat(slot), mp.joaat(overlay));
};


user.hideLoadDisplay = function(player) {
    methods.debug('user.hideLoadDisplay');
    if (!mp.players.exists(player))
        return false;
    player.call('client:user:hideLoadDisplay');
};

user.showLoadDisplay = function(player) {
    methods.debug('user.showLoadDisplay');
    if (!mp.players.exists(player))
        return false;
    player.call('client:user:showLoadDisplay');
};

user.removeWaypoint = function(player) {
    methods.debug('user.removeWaypoint');
    if (!mp.players.exists(player))
        return false;
    user.setWaypoint(player.position.x, player.position.y);
};

user.setWaypoint = function(player, x, y) {
    methods.debug('user.setWaypoint');
    if (!mp.players.exists(player))
        return false;
    player.call('client:user:setWaypoint', [x, y]);
};

user.callCef = function(player, name, params) {
    methods.debug('user.callCef');
    if (!mp.players.exists(player))
        return false;
    player.call('client:user:callCef', [name, params]);
};

user.isLogin = function(player) {
    if (!mp.players.exists(player))
        return false;
    return user.has(player, 'id');
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
    player.outputChatBox(text);
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
    if (player.getVariable('idLabel'))
        return methods.parseInt(player.getVariable('idLabel'));
    return -1;
};

user.getSvId = function(player) {
    if (!mp.players.exists(player))
        return -1;
    return player.id;
};

user.getRpName = function(player) {
    methods.debug('user.getRpName');
    if (!mp.players.exists(player))
        return 'NO_NAME';
    if (user.has(player, 'name'))
        return user.get(player, 'name');
    return player.socialClub;
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

user.addMoney = function(player, money) {
    user.addCashMoney(player, money);
};

user.removeMoney = function(player, money) {
    user.removeCashMoney(player, money);
};

user.setMoney = function(player, money) {
    user.setCashMoney(player, money);
};

user.getMoney = function(player) {
    return user.getCashMoney(player);
};

user.addCashMoney = function(player, money) {
    methods.saveLog('Money', `[ADD_CASH] ${user.getRpName(player)} (${user.getId(player)}) ${user.getCashMoney(player)} - ${money}`);
    user.setCashMoney(player, user.getCashMoney(player) + methods.parseFloat(money));
};

user.removeCashMoney = function(player, money) {
    methods.saveLog('Money', `[REMOVE_CASH] ${user.getRpName(player)} (${user.getId(player)}) ${user.getCashMoney(player)} + ${money}`);
    user.setCashMoney(player, user.getCashMoney(player) - methods.parseFloat(money));
};

user.setCashMoney = function(player, money) {
    user.set(player, 'money', methods.parseFloat(money));
    user.updateClientCache(player);
};

user.getCashMoney = function(player) {
    if (user.has(player, 'money'))
        return methods.parseFloat(user.get(player, 'money'));
    return 0;
};

user.addBankMoney = function(player, money) {
    methods.saveLog('Money', `[ADD_BANK] ${user.getRpName(player)} (${user.getId(player)}) ${user.getBankMoney(player)} - ${money}`);
    user.setBankMoney(player, user.getBankMoney(player) + methods.parseFloat(money));
};

user.removeBankMoney = function(player, money) {
    methods.saveLog('Money', `[REMOVE_BANK] ${user.getRpName(player)} (${user.getId(player)}) ${user.getBankMoney(player)} + ${money}`);
    user.setBankMoney(player, user.getBankMoney(player) - methods.parseFloat(money));
};

user.setBankMoney = function(player, money) {
    user.set(player, 'money_bank', methods.parseFloat(money));
    user.updateClientCache(player);
};

user.getBankMoney = function(player) {
    if (user.has(player, 'money_bank'))
        return methods.parseFloat(user.get(player, 'money_bank'));
    return 0;
};

user.addPayDayMoney = function(player, money) {
    user.setPayDayMoney(player, user.getPayDayMoney(player) + methods.parseInt(money));
};

user.removePayDayMoney = function(player, money) {
    user.setPayDayMoney(player, user.getPayDayMoney(player) - methods.parseInt(money));
};

user.setPayDayMoney = function(player, money) {
    user.set(player, 'money_payday', methods.parseInt(money));
};

user.getPayDayMoney = function(player) {
    if (user.has(player, 'money_payday'))
        return methods.parseInt(user.get(player, 'money_payday'));
    return 0;
};

user.addHistory = function(player, type, reason) {
    return; //TODO
    if (!user.isLogin(player))
        return;

    let time = methods.getTimeWithoutSec();
    let date = methods.getDate();
    //let rpDateTime = weather.getRpDateTime();
    let dateTime = time + ' ' + date;
    let rpDateTime = dateTime;

    mysql.executeQuery(`INSERT INTO log_player (user_id, datetime, type, do) VALUES ('${user.getId(player)}', '${rpDateTime} (( ${dateTime} ))', '${type}', '${reason}')`);
};

user.clearChat = function(player) {
    if (!mp.players.exists(player))
        return false;
    player.call('client:clearChat');
};

user.teleport = function(player, x, y, z, rot = 0.1) {
    methods.debug('user.teleport');
    if (!mp.players.exists(player))
        return false;
    if (rot == 0.1)
        rot = player.heading;
    player.call('client:teleport', [x, y, z, rot]);
};

user.teleportVeh = function(player, x, y, z, rot = 0.1) {
    methods.debug('user.teleportVeh');
    if (!mp.players.exists(player))
        return false;
    if (rot == 0.1 && player.vehicle)
        rot = player.vehicle.heading;
    player.call('client:teleportVeh', [x, y, z, rot]);
};

user.setWaypoint = function(player, x, y) {
    methods.debug('user.setWaypoint');
    if (!mp.players.exists(player))
        return false;
    player.call('client:user:setWaypoint', [x, y]);
};

user.sendSmsBankOperation = function(player, text, title = 'Операция со счётом') {
    methods.debug('bank.sendSmsBankOperation');
    if (!user.isLogin(player))
        return;

    let prefix = methods.parseInt(user.get(player, 'bank_card').toString().substring(0, 4));

    try {
        switch (prefix) {
            case 6000:
                player.notifyWithPicture('~r~Maze Bank', '~g~' + title, text, 'CHAR_BANK_MAZE', 2);
                break;
            case 7000:
                player.notifyWithPicture('~g~Fleeca Bank', '~g~' + title, text, 'CHAR_BANK_FLEECA', 2);
                break;
            case 8000:
                player.notifyWithPicture('~b~Blaine Bank', '~g~' + title, text, 'DIA_CUSTOMER', 2);
                break;
            case 9000:
                player.notifyWithPicture('~o~Pacific Bank', '~g~' + title, text, 'WEB_SIXFIGURETEMPS', 2);
                break;
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

user.kick = function(player, reason, title = 'Вы были кикнуты.') {
    if (!mp.players.exists(player))
        return;
    methods.debug('user.kick ' + player.socialClub + ' ' + reason);
    player.outputChatBox('!{f44336}' + title);
    player.outputChatBox('!{f44336}Причина: !{FFFFFF}' + reason);
    player.kick(reason);
};

user.kickAntiCheat = function(player, reason, title = 'Вы были кикнуты.') {
    /*if (!user.isLogin(player))
        return;*/
    methods.debug('user.kickAntiCheat');
    user.kick(player, reason, title);
    if (user.isLogin(player)) {
        methods.saveLog('AntiCheat', `${user.getRpName(player)} (${user.getId(player)}) - ${reason}`);
        chat.sendToAll('Anti-Cheat System', `${user.getRpName(player)} (${user.getId(player)})!{${chat.clRed}} был кикнут с причиной!{${chat.clWhite}} ${reason}`, chat.clRed);
    }
};

user.playAnimation = function(player, dict, anim, flag = 49) {
    methods.debug('user.playAnimation');
    if (!mp.players.exists(player))
        return false;
    let pos = player.position;
    mp.players.forEach((p) => {
        try {
            if (methods.distanceToPos(pos, p.position) < 300)
                p.call('client:syncAnimation', [player.id, dict, anim, flag])
        }
        catch (e) {
            methods.debug(e);
        }
    });
};


user.giveJobSkill = function(player) {
    return;
    if (user.isLogin(player)) {
        let job = user.get(player, 'job');
        let skillCount = 500;

        switch (job) {
            case 'mail':
            case 'mail2':
                skillCount = 1000;
                break;
            case 'taxi1':
            case 'taxi2':
                skillCount = 400;
                job = 'taxi';
                break;
            case 'trucker1':
            case 'trucker2':
            case 'trucker3':
                job = 'trucker';
                skillCount = 1500;
                break;
        }

        if (user.has(player, 'skill_' + job)) {
            let currentSkill = user.get(player, 'skill_' + job);
            if (currentSkill >= skillCount)
                return;

            if (currentSkill == skillCount - 1) {
                user.set(player, 'skill_' + job, skillCount);
                chat.sendToAll('Конкурс', `${user.getRpName(player)} !{${chat.clBlue}} стал одним из лучших работников штата San Andreas, получив вознаграждение $10,000`, chat.clBlue);
                user.addMoney(player, 10000);
                user.save(player);
            }
            else {
                user.set(player, 'skill_' + job, currentSkill + 1);
                player.notify('~g~Навык вашей профессии был повышен');
            }
        }
    }
};

user.isJobMail = function(player) {
    return user.isLogin(player) && user.get(player, 'job') == 4;
};

user.isJobGr6 = function(player) {
    return user.isLogin(player) && user.get(player, 'job') == 8;
};

user.payDay = async function (player) {
    if (!user.isLogin(player))
        return false;
    methods.debug('user.payDay', user.getRpName(player));

    user.set(player, 'online_time', user.get(player, 'online_time') + 1);

    /*if (user.getVipStatus() != "YouTube" && user.getVipStatus() != "Turbo" && user.getVipStatus() != "none" && user.get(player, 'exp_age') % 4 == 0)
        user.set(player, 'exp_age', user.get(player, 'exp_age') + 1);

    if (user.getVipStatus() == "Turbo" && user.get(player, 'exp_age') % 2 == 0)
        user.set(player, 'exp_age', user.get(player, 'exp_age') + 1);

    if (user.getVipStatus() == "YouTube")
        user.set(player, 'exp_age', user.get(player, 'exp_age') + 1);*/

    if (user.get(player, 'reg_time') > 0)
        user.set(player, 'reg_time', user.get(player, 'reg_time') - 1);

    if (user.get(player, 'reg_time') == 0 && user.get(player, 'reg_status') == 1)
        user.set(player, 'reg_status', 0);

    if (user.get(player, 'reg_time') == 0 && user.get(player, 'reg_status') == 2) {
        user.set(player, 'reg_status', 3);
        player.notifyWithPicture("323-555-0001", 'Адвокат', "Поздравляю, Вы получили гражданство США.", 'CHAR_BARRY', 2); //TODO
    }

    if (user.get(player, 'online_time') == 372) {

        /*if (user.get(player, 'age') == 19 && user.get(player, 'referer') != "") { //TODO
            user.addCashMoney(player, 25000);
            player.notify(`~g~Вы получили $25,000 по реферальной системе`);
            player.notify(`~g~Пригласивший ${user.get(player, 'referer')} получил 200ac на личный счёт`);
            mysql.executeQuery(`UPDATE users SET money_donate = money_donate + '200' WHERE name ='${user.get(player, 'referer')}'`);
            mysql.executeQuery(`INSERT INTO log_referrer (name, referrer, money, timestamp) VALUES ('${user.getRpName(player)}', '${user.get(player, 'referer')}', '200', '${methods.getTimeStamp()}')`);
        }

        if (user.get(player, 'age') == 19 && user.get(player, 'promocode') != "") {
            player.notify(`~g~Вы получили ~s~$25000 ~g~по промокоду ~s~${user.get(player, 'promocode')}`);
            user.addCashMoney(player, 25000);
            mysql.executeQuery(`UPDATE users SET money_donate = money_donate + '50' WHERE parthner_promocode = '${user.get(player, 'promocode')}'`);
        }*/
    }

    if (user.get(player, 'bank_card') > 0) {

        if (player.getVariable('isAfk') === true) {
            player.notify('~r~Зарплату вы не получили, связи с тем, что вы AFK');
        }
        else if (user.get(player, 'fraction_id') > 0) {

            let money = methods.getFractionPayDay(user.get(player, 'fraction_id'), user.get(player, 'rank'), user.get(player, 'rank_type'));
            let nalog = money * (100 - coffer.getTaxIntermediate()) / 100;

            let currentCofferMoney = coffer.getMoney(coffer.getIdByFraction(user.get(player, 'fraction_id')));

            if (currentCofferMoney < nalog) {
                player.notify('~r~В бюджете организации не достаточно средств для выплаты ЗП');
            }
            else {
                user.sendSmsBankOperation(player, `Зачисление: ~g~${methods.moneyFormat(nalog)}`, 'Зарплата');
                user.addPayDayMoney(player, nalog);
            }
        }
        else if (user.get(player, 'job') == 0) {

            let currentCofferMoney = coffer.getMoney(1);
            let sum = coffer.getBenefit();

            if (currentCofferMoney < sum) {
                player.notify('~r~В бюджете организации не достаточно средств для выплаты ЗП');
            }
            else {
                user.sendSmsBankOperation(player, `Зачисление: ~g~${methods.moneyFormat(sum)}`, 'Пособие');
                user.addPayDayMoney(player, sum);
            }
        }

        /*if (user.getPayDayMoney(player) > 0) { //TODO
            let nalog = methods.parseInt(user.getPayDayMoney(player) * (100 - coffer.getTaxIntermediate()) / 100);
            fullMoney += nalog;
            user.sendSmsBankOperation(player, `~b~Сумма: ~s~$${nalog}`, "Зачисление средств");
            player.notify(`~y~Налог: ~s~${coffer.getTaxIntermediate()}%`);
            user.setPayDayMoney(player, 0);
        }*/
    }
    else {
        player.notify(`~y~Оформите банковскую карту`);
    }
    return true;
};