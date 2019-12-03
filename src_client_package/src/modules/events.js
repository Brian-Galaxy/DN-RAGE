"use strict";

import methods from './methods';
import user from '../user';
import menuList from '../menuList';
import ui from "./ui";

mp.events.add('client:cefDebug', function (message) {
    try {
        methods.debug(`[CEF] ${message}`);
    } catch (e) {
    }
});

mp.events.add('client:user:auth:register', function(mail, login, passwordReg, passwordRegCheck, acceptRules) {
    methods.debug(`'${mail} ${login} ${passwordReg} ${passwordRegCheck} ${acceptRules}'`);
    var checkMail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!checkMail.test(String(mail).toLowerCase())) {
        mp.game.ui.notifications.show('~r~Email - не валидный адрес');
        return;
    }
    mail = mail.toLowerCase();
    login = login.toLowerCase();
    login = login.replace(/[^a-zA-Z0-9\s]/ig, '');
    if (login === "") {
        mp.game.ui.notifications.show('~r~Логин - поле не заполнено');
        return;
    }
    if (passwordReg === "") {
        mp.game.ui.notifications.show('~r~Пароль - поле не заполнено');
        return;
    }
    if (passwordReg !== passwordRegCheck) {
        mp.game.ui.notifications.show('~r~Пароли не совпадают');
        return;
    }
    if (acceptRules === false) {
        mp.game.ui.notifications.show('~r~Вы не согласились с правилами сервера');
        return;
    }
    mp.game.ui.notifications.show('~b~Пожалуйста подождите...');
    //methods.storage.set('login', login);
    mp.events.callRemote('server:user:createAccount', login, passwordReg, mail);
});

mp.events.add('client:user:auth:login', function(login, password) {
    methods.debug(`'${login} ${password}'`);
    let usingEmail = false;
    if(login.includes('@')) {
        var checkMail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!checkMail.test(String(login).toLowerCase())) {
            mp.game.ui.notifications.show('~r~Не валидный E-Mail адрес');
            return;
        }
        usingEmail = true;
    } else {
        login = login.replace(/[^a-zA-Z0-9\s]/ig, '');
    }
    login = login.toLowerCase();
    if (login === "") {
        mp.game.ui.notifications.show('~r~Логин - поле не заполнено');
        return;
    }
    if (password === "") {
        mp.game.ui.notifications.show('~r~Пароль - поле не заполнено');
        return;
    }
    mp.game.ui.notifications.show('~b~Пожалуйста подождите...');
    //methods.storage.set('login', login);
    mp.events.callRemote('server:user:loginAccount', login, password, usingEmail);
});

mp.events.add('client:events:loginAccount:success', function(data) {
    ui.callCef('authMain','{"type": "showCreatePage"}');

    methods.debug(data);

    let playerList = JSON.parse(data);

    let isShow1 = false;
    let isShow2 = false;
    let isShow3 = false;

    let players = [];

    if (playerList.length >= 1) {
        isShow1 = true;
        players.push({
            player: {
                name: playerList[0].name,
                old: playerList[0].age,
                money: methods.moneyFormat(playerList[0].money),
                date: playerList[0].lastLogin,
                sex: playerList[0].sex,
                spawn: playerList[0].spawnList,
                index_spawn: 0
            }
        });
    }

    if (playerList.length >= 2) {
        isShow2 = true;
        players.push({
            player: {
                name: playerList[1].name,
                old: playerList[1].age,
                money: methods.moneyFormat(playerList[1].money),
                date: playerList[1].lastLogin,
                sex: playerList[1].sex,
                spawn: playerList[1].spawnList,
                index_spawn: 0
            }
        });
    }
    if (playerList.length >= 3) {
        isShow3 = true;
        players.push({
            player: {
                name: playerList[2].name,
                old: playerList[2].age,
                money: methods.moneyFormat(playerList[2].money),
                date: playerList[2].lastLogin,
                sex: playerList[2].sex,
                spawn: playerList[2].spawnList,
                index_spawn: 0
            }
        });
    }

    ui.callCef('ChangePlayer','{"type": "updatePlayers", "isShow1": ' + isShow1 + ', "isShow2": ' +  isShow2 + ', "isShow3": ' + isShow3 + ', "players": ' + JSON.stringify(players) + '}');

    mp.players.local.position = new mp.Vector3(9.66692, 528.34783, 170.63504);
    mp.players.local.setRotation(0, 0, 123.53768, 0, true);
    //ui.callCef('ChangePlayer','{"type": "show"}');
});

mp.events.add('client:events:createNewPlayer', function() {
    ui.callCef('authMain','{"type": "hide"}');
    ui.callCef('customization','{"type": "show"}');
    methods.debug('CUSTOM');
    //ui.callCef('ChangePlayer','{"type": "show"}');
});

mp.events.add('client:events:selectPlayer', function(name, spawnName) {
    user.login(name, spawnName);
});

mp.events.add('client:events:custom:updateAge', function(age) {
    methods.debug(age);
    if (age> 72)
        mp.players.local.setHeadOverlay(3, 14, 1, 1, 1);
    else if (age> 69)
        mp.players.local.setHeadOverlay(3, 14, 0.7, 1, 1);
    else if (age> 66)
        mp.players.local.setHeadOverlay(3, 12, 1, 1, 1);
    else if (age> 63)
        mp.players.local.setHeadOverlay(3, 11, 0.9, 1, 1);
    else if (age> 60)
        mp.players.local.setHeadOverlay(3, 10, 0.9, 1, 1);
    else if (age> 57)
        mp.players.local.setHeadOverlay(3, 9, 0.9, 1, 1);
    else if (age> 54)
        mp.players.local.setHeadOverlay(3, 8, 0.8, 1, 1);
    else if (age> 51)
        mp.players.local.setHeadOverlay(3, 7, 0.7, 1, 1);
    else if (age> 48)
        mp.players.local.setHeadOverlay(3, 6, 0.6, 1, 1);
    else if (age> 45)
        mp.players.local.setHeadOverlay(3, 5, 0.5, 1, 1);
    else if (age> 42)
        mp.players.local.setHeadOverlay(3, 4, 0.4, 1, 1);
    else if (age> 39)
        mp.players.local.setHeadOverlay(3, 4, 0.4, 1, 1);
    else if (age> 36)
        mp.players.local.setHeadOverlay(3, 3, 0.3, 1, 1);
    else if (age> 33)
        mp.players.local.setHeadOverlay(3, 1, 0.2, 1, 1);
    else if (age> 30)
        mp.players.local.setHeadOverlay(3, 0, 0.1, 1, 1);
    else
        mp.players.local.setHeadOverlay(3, 0, 0.0, 1, 1);
});

mp.events.add('client:events:custom:set', function(input_editor_face, input_editor_nose, input_editor_eyes_lips, input_editor_face_last, cheked_sex, mother, father, mix1, mix2) {
    methods.debug('CUSTOM');

    let faceEditor = JSON.parse(input_editor_face);
    let noseEditor = JSON.parse(input_editor_nose);
    let eyeEditor = JSON.parse(input_editor_eyes_lips);
    let faceLastEditor = JSON.parse(input_editor_face_last);

    if (user.getCache('SKIN_FACE_SPECIFICATIONS')) {
        if(JSON.parse(user.getCache('SKIN_FACE_SPECIFICATIONS')).length < 20) {
            user.set('SKIN_FACE_SPECIFICATIONS', JSON.stringify([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
        }
    }
    else {
        user.set('SKIN_FACE_SPECIFICATIONS', JSON.stringify([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
    }

    let skinSpec = JSON.parse(user.getCache('SKIN_FACE_SPECIFICATIONS'));

    skinSpec[11] = eyeEditor[0].value / 100;
    skinSpec[12] = eyeEditor[1].value / 100;

    skinSpec[0] = noseEditor[0].value / 100;
    skinSpec[1] = noseEditor[1].value / 100;
    skinSpec[2] = noseEditor[2].value / 100;
    skinSpec[4] = noseEditor[3].value / 100;
    skinSpec[3] = noseEditor[4].value / 100;
    skinSpec[5] = noseEditor[5].value / 100;

    skinSpec[6] = faceEditor[0].value / 100;
    skinSpec[7] = faceEditor[1].value / 100;
    skinSpec[8] = faceEditor[2].value / 100;
    skinSpec[9] = faceEditor[3].value / 100;
    skinSpec[10] = faceEditor[4].value / 100;
    skinSpec[13] = faceEditor[5].value / 100;
    skinSpec[14] = faceEditor[6].value / 100;
    skinSpec[15] = faceEditor[7].value / 100;
    skinSpec[17] = faceEditor[8].value / 100;
    skinSpec[16] = faceEditor[9].value / 100;
    skinSpec[18] = faceEditor[10].value / 100;
    skinSpec[19] = faceEditor[11].value / 100;

    user.set('SKIN_FACE_SPECIFICATIONS', JSON.stringify(skinSpec));

    let fatherList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 42, 43, 44];
    let motherList = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 45];

    user.set('SKIN_MOTHER_FACE', motherList[mother]);
    user.set('SKIN_MOTHER_SKIN', mother);
    user.set('SKIN_FATHER_FACE', fatherList[father]);
    user.set('SKIN_FATHER_SKIN', father);

    user.set('SKIN_PARENT_FACE_MIX', mix1 / 20);
    user.set('SKIN_PARENT_SKIN_MIX', mix2 / 20);

    user.set('SKIN_HAIR', faceLastEditor[0].index_help);
    user.set('SKIN_HAIR_COLOR', faceLastEditor[1].index_help);
    user.set('SKIN_EYEBROWS', faceLastEditor[2].index_help);
    user.set('SKIN_EYEBROWS_COLOR', faceLastEditor[3].index_help);
    user.set('SKIN_EYE_COLOR', faceLastEditor[4].index_help);
    user.set('SKIN_OVERLAY_9', faceLastEditor[5].index_help - 1);
    user.set('SKIN_OVERLAY_9_COLOR', faceLastEditor[6].index_help);

    user.set('SKIN_OVERLAY_1', faceLastEditor[7].index_help - 1);
    user.set('SKIN_OVERLAY_1_COLOR', faceLastEditor[8].index_help);

    user.updateCharacterFace(true);
});

mp.events.add('client:events:custom:setSex', function(sex) {

    if (sex === false) {
        user.showLoadDisplay();
        setTimeout(function () {
            user.set('SKIN_SEX', 1);
            user.setPlayerModel('mp_f_freemode_01');
            setTimeout(function () {
                user.updateCharacterFace(true);
                user.hideLoadDisplay();
            }, 500)
        }, 500);
    }
    else {
        user.showLoadDisplay();
        setTimeout(function () {
            user.set('SKIN_SEX', 0);
            user.setPlayerModel('mp_m_freemode_01');
            setTimeout(function () {
                user.updateCharacterFace(true);
                user.hideLoadDisplay();
            }, 500)
        }, 500);
    }

});

mp.events.add('client:events:custom:save', function(endurance, driving, flying, psychics, shooting, stealth, strength) {
    let data = {
        endurance: endurance,
        driving: driving,
        flying: flying,
        psychics: psychics,
        shooting: shooting,
        stealth: stealth,
        strength: strength,
    };

    user.set('stats_strength', data.strength);
    user.set('stats_endurance', data.endurance);
    user.set('stats_shooting', data.shooting);
    user.set('stats_flying', data.flying);
    user.set('stats_driving', data.driving);
    user.set('stats_psychics', data.psychics);
    user.set('stats_lucky', data.stealth);
    user.set('is_custom', true);

    user.save();
});

mp.events.add('client:events:custom:camera', function(rot, range, height) {

    height = height - 50;

    user.getCam().pointAtCoord(9.66692, 528.34783, 171.2 + (height / 100));
    user.camSetDist(range / 100);
    user.camSetRot(rot);
});

mp.events.add('client:events:custom:register', function(name, surname, age, national) {
    if (age < 18) {
        ui.notify('Возраст не может быть меньше 18 лет', 1);
        return;
    }
    else if (age > 60) {
        ui.notify('Возраст не может быть больше 60 лет', 1);
        return;
    }
    mp.events.callRemote('server:user:createUser', name, surname, age, national);
});

mp.events.add('client:events:loginUser:finalCreate', function() {
    user.setLogin(true);
    ui.callCef('authMain','{"type": "hide"}');
    ui.callCef('customization','{"type": "show"}');
    ui.callCef('customization','{"type": "showFamilyPage"}');
});

mp.events.add('client:user:updateCache', (data) => {
    try {
        methods.debug('Event: client:user:updateCache');
        user.setCacheData(new Map(data));
    }
    catch (e) {
        methods.debug('Exception: events:client:user:updateCache');
        methods.debug(e);
    }
});


mp.events.add('client:user:callCef', (name, params) => {
    methods.debug('Event: client:user:callCef');
    ui.callCef(name, params)
});

mp.events.add('client:user:setWaypoint', (x, y) => {
    methods.debug('Event: client:user:setWaypoint');
    user.setWaypoint(x, y);
});

mp.events.add('client:user:hideLoadDisplay', () => {
    methods.debug('Event: client:user:hideLoadDisplay');
    user.hideLoadDisplay();
});

mp.events.add('client:user:showLoadDisplay', () => {
    methods.debug('Event: client:user:showLoadDisplay');
    user.showLoadDisplay();
});


mp.events.add('client:events:debug', function(val) {
    methods.debug(val);
    //ui.callCef('ChangePlayer','{"type": "show"}');
});

//KEYS

// ~ Key Code
mp.keys.bind(0xC0, true, function() {
    menuList.showAuthMenu();
});

// Commands in 2019......
mp.events.add("playerCommand", async (command) => {
    if (command.toLowerCase().slice(0, 2) === "tp") {
        if (!user.isLogin() || !user.isAdmin())
            return;
        let args = command.toLowerCase().split(' ');
        user.teleport(parseFloat(args[1]), parseFloat(args[2]), parseFloat(args[3]));
    }
    else if (command.toLowerCase().slice(0, 1) === "a") {
        if (!user.isLogin() || !user.isAdmin())
            return;
        let args = command.toLowerCase().split(' ');
        user.playAnimation(args[1], args[2], args[2]);
    }
    else if (command.slice(0, 5) === "eval ") {
        if (!user.isLogin() || !user.isAdmin(5))
            return;
        let evalCmd = command.substring(5);
        mp.gui.chat.push(`Eval ${evalCmd}`);
        let result;

        try {
            result = eval(evalCmd);
            mp.gui.chat.push(`Result ${result}`);
        } catch (e) {
            result = e;
            mp.gui.chat.push(`Result ${result}`);
        }
    }
});