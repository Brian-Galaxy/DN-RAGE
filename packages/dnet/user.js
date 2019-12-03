let mysql = require('./modules/mysql');
let methods = require('./modules/methods');
let Container = require('./modules/data');
let enums = require('./enums');

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
    SKIN_SPECIFICATIONS: [],
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

        let sql = "INSERT INTO users (name, age, social, national, skin, login_ip, login_date, reg_ip, reg_timestamp) VALUES ('" + name + ' ' + surname +
            "', '" + newAge + "', '" + player.socialClub + "', '" + national + "', '" + JSON.stringify(skin) + "', '" + player.ip + "', '" + methods.getTimeStamp() + "', '" + player.ip + "', '" + methods.getTimeStamp() + "')";
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
                        players.push({name: row['name'], age: row['lvl'], money: row['money'], sex: sex, spawnList: ['Стандарт', 'Стандарт2'], lastLogin: methods.unixTimeStampToDate(row['login_date'])})
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
        skin.SKIN_SPECIFICATIONS = user.get(player, "GTAO_FACE_SPECIFICATIONS");
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

                /*user.updateCharacterFace(player);
                setTimeout(function () {
                    user.updateCharacterCloth(player);
                }, 200);*/
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
                    user.showLoadDisplay(player);
                    methods.debug(spawn, name)
                }
                //user.setOnlineStatus(player, 1);
            }, 600);

            //if (user.get(player, 'walkietalkie_num') && methods.parseInt(user.get(player, 'walkietalkie_num')) != 0)
            //    mp.events.call('voice.server.initRadio', player, user.get(player, 'walkietalkie_num'));

        }, 1000);
    });
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
        skin.SKIN_SPECIFICATIONS = user.get(player, "GTAO_FACE_SPECIFICATIONS");
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

    return;

    methods.debug('user.updateCharacterFace');
    if (!mp.players.exists(player))
        return;
    try {
        let health = player.health;
        let skin = {};

        skin.GTAO_SHAPE_FIRST_ID = methods.parseInt(user.get(player, "GTAO_SHAPE_FIRST_ID"));
        skin.GTAO_SHAPE_SECOND_ID = methods.parseInt(user.get(player, "GTAO_SHAPE_SECOND_ID"));
        skin.GTAO_SHAPE_THRID_ID = methods.parseInt(user.get(player, "GTAO_SHAPE_THRID_ID"));
        skin.GTAO_SKIN_FIRST_ID = methods.parseInt(user.get(player, "GTAO_SKIN_FIRST_ID"));
        skin.GTAO_SKIN_SECOND_ID = methods.parseInt(user.get(player, "GTAO_SKIN_SECOND_ID"));
        skin.GTAO_SKIN_THRID_ID = methods.parseInt(user.get(player, "GTAO_SKIN_THRID_ID"));
        skin.GTAO_SHAPE_MIX = parseFloat(user.get(player, "GTAO_SHAPE_MIX"));
        skin.GTAO_SKIN_MIX = parseFloat(user.get(player, "GTAO_SKIN_MIX"));
        skin.GTAO_THRID_MIX = parseFloat(user.get(player, "GTAO_THRID_MIX"));
        skin.GTAO_HAIR = methods.parseInt(user.get(player, "GTAO_HAIR"));
        skin.GTAO_HAIR_COLOR = methods.parseInt(user.get(player, "GTAO_HAIR_COLOR"));
        skin.GTAO_HAIR_COLOR2 = methods.parseInt(user.get(player, "GTAO_HAIR_COLOR2"));
        skin.GTAO_EYE_COLOR = methods.parseInt(user.get(player, "GTAO_EYE_COLOR"));
        skin.GTAO_EYEBROWS = methods.parseInt(user.get(player, "GTAO_EYEBROWS"));
        skin.GTAO_EYEBROWS_COLOR = methods.parseInt(user.get(player, "GTAO_EYEBROWS_COLOR"));
        skin.GTAO_OVERLAY = methods.parseInt(user.get(player, "GTAO_OVERLAY"));
        skin.GTAO_OVERLAY_COLOR = methods.parseInt(user.get(player, "GTAO_OVERLAY_COLOR"));
        skin.GTAO_OVERLAY4 = methods.parseInt(user.get(player, "GTAO_OVERLAY4"));
        skin.GTAO_OVERLAY4_COLOR = methods.parseInt(user.get(player, "GTAO_OVERLAY4_COLOR"));
        skin.GTAO_OVERLAY5 = methods.parseInt(user.get(player, "GTAO_OVERLAY5"));
        skin.GTAO_OVERLAY5_COLOR = methods.parseInt(user.get(player, "GTAO_OVERLAY5_COLOR"));
        skin.GTAO_OVERLAY6 = methods.parseInt(user.get(player, "GTAO_OVERLAY6"));
        skin.GTAO_OVERLAY6_COLOR = methods.parseInt(user.get(player, "GTAO_OVERLAY6_COLOR"));
        skin.GTAO_OVERLAY7 = methods.parseInt(user.get(player, "GTAO_OVERLAY7"));
        skin.GTAO_OVERLAY7_COLOR = methods.parseInt(user.get(player, "GTAO_OVERLAY7_COLOR"));
        skin.GTAO_OVERLAY8 = methods.parseInt(user.get(player, "GTAO_OVERLAY8"));
        skin.GTAO_OVERLAY8_COLOR = methods.parseInt(user.get(player, "GTAO_OVERLAY8_COLOR"));
        skin.GTAO_OVERLAY9 = methods.parseInt(user.get(player, "GTAO_OVERLAY9"));
        skin.GTAO_OVERLAY9_COLOR = methods.parseInt(user.get(player, "GTAO_OVERLAY9_COLOR"));
        skin.GTAO_OVERLAY10 = methods.parseInt(user.get(player, "GTAO_OVERLAY10"));
        skin.GTAO_OVERLAY10_COLOR = methods.parseInt(user.get(player, "GTAO_OVERLAY10_COLOR"));
        skin.GTAO_FACE_SPECIFICATIONS = user.get(player, "GTAO_FACE_SPECIFICATIONS");
        skin.SEX = methods.parseInt(user.get(player, "SEX"));

        player.setCustomization(
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
        );
        player.setClothes(2, skin.GTAO_HAIR, 0, 0);
        player.setHeadOverlay(2, [skin.GTAO_EYEBROWS, 1, skin.GTAO_EYEBROWS_COLOR, 0]);

        if (skin.GTAO_FACE_SPECIFICATIONS) {
            try {
                JSON.parse(skin.GTAO_FACE_SPECIFICATIONS).forEach((item, i) => {
                    try {
                        player.setFaceFeature(methods.parseInt(i), parseFloat(item));
                    }
                    catch (e) {
                        methods.debug(e);
                    }
                })
            } catch(e) {
                methods.debug(e);
                methods.debug(skin.GTAO_FACE_SPECIFICATIONS);
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

        if (skin.GTAO_OVERLAY9 != -1 && skin.GTAO_OVERLAY9 != undefined)
            player.setHeadOverlay(9, [skin.GTAO_OVERLAY9, 1, skin.GTAO_OVERLAY9_COLOR, skin.GTAO_OVERLAY9_COLOR]);

        if (skin.SEX == 0) {
            if (skin.GTAO_OVERLAY10 != undefined)
                player.setHeadOverlay(10, [skin.GTAO_OVERLAY10, 1, skin.GTAO_OVERLAY10_COLOR, skin.GTAO_OVERLAY10_COLOR]);
            if (skin.GTAO_OVERLAY != undefined)
                player.setHeadOverlay(1, [skin.GTAO_OVERLAY, 1, skin.GTAO_OVERLAY_COLOR, 0]);
        }
        else if (skin.SEX == 1) {
            if (skin.GTAO_OVERLAY4 != undefined)
                player.setHeadOverlay(4, [skin.GTAO_OVERLAY4, 1, skin.GTAO_OVERLAY4_COLOR, skin.GTAO_OVERLAY4_COLOR]);
            if (skin.GTAO_OVERLAY5 != undefined)
                player.setHeadOverlay(5, [skin.GTAO_OVERLAY5, 1, skin.GTAO_OVERLAY5_COLOR, skin.GTAO_OVERLAY5_COLOR]);
            if (skin.GTAO_OVERLAY8 != undefined)
                player.setHeadOverlay(8, [skin.GTAO_OVERLAY8, 1, skin.GTAO_OVERLAY8_COLOR, skin.GTAO_OVERLAY8_COLOR]);
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

user.updateCharacterCloth = function(player) {

    return;

    methods.debug('user.updateCharacterCloth');
    if (!mp.players.exists(player))
        return;
    try {

        user.updateTattoo(player);
        user.clearAllProp(player);
        /*let cloth_list = ['torso', 'torso_color', 'leg', 'leg_color',
            'hand', 'hand_color', 'foot', 'foot_color',
            'accessorie', 'accessorie_color', 'parachute', 'parachute_color',
            'armor', 'armor_color', 'decal', 'decal_color',
            'body', 'body_color', 'mask', 'mask_color',
            'hat', 'hat_color', 'glasses', 'glasses_color',
            'ear', 'ear_color', 'watch', 'watch_color', 'bracelet', 'bracelet_color'];*/

        let cloth_data = {};
        /*for(var i = 0; i < cloth_list.length; i++){
        cloth_data[cloth_list[i]] = user.get(player, cloth_list[i]);
        }*/
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
        }, 100);
    } catch (e) {
        methods.debug(e);
    }
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