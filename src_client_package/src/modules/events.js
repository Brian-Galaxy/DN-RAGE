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
        login = login.toLowerCase();
    } else {
        login = login.replace(/[^a-zA-Z\s]/ig, '');
    }
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

mp.events.add('client:events:loginAccount:success', function() {
    ui.callCef('authMain','{"type": "showCreatePage"}');
    //ui.callCef('ChangePlayer','{"type": "show"}');
});

mp.events.add('client:events:createNewPlayer', function() {
    ui.callCef('authMain','{"type": "hide"}');
    ui.callCef('customization','{"type": "show"}');
    methods.debug('CUSTOM');
    //ui.callCef('ChangePlayer','{"type": "show"}');
});

mp.events.add('client:events:selectPlayer', function(name) {
    ui.callCef('authMain','{"type": "hide"}');
    mp.gui.cursor.show(false, false);
    methods.debug(name);
    //ui.callCef('ChangePlayer','{"type": "show"}');
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

mp.events.add('client:events:custom:set', function(stats, input_editor_face, input_editor_nose, input_editor_eyes_lips, input_editor_face_last, cheked_sex, mother, father, mix1, mix2) {
    methods.debug('CUSTOM', stats, input_editor_face, input_editor_nose, input_editor_eyes_lips, input_editor_face_last, cheked_sex, mother, father, mix1, mix2);

    methods.debug('' + cheked_sex);
    methods.debug('' + user.getSex());

    if (cheked_sex && user.getSex() == 0) {
        user.showLoadDisplay();
        setTimeout(function () {
            user.setCache('SKIN_SEX', 1);
            user.setPlayerModel(mp.game.joaat('mp_f_freemode_01'));
            setTimeout(function () {
                user.hideLoadDisplay();
            }, 500)
        }, 500);
    }
    if (cheked_sex === false && user.getSex() == 1) {
        user.showLoadDisplay();
        setTimeout(function () {
            user.setCache('SKIN_SEX', 0);
            user.setPlayerModel(mp.game.joaat('mp_m_freemode_01'));
            setTimeout(function () {
                user.hideLoadDisplay();
            }, 500)
        }, 500);
    }

});

mp.events.add('client:events:custom:register', function(name, surname, age) {
    if (age < 18) {
        ui.notify('Возраст не может быть меньше 18 лет', 1);
        return;
    }
    else if (age > 60) {
        ui.notify('Возраст не может быть больше 60 лет', 1);
        return;
    }
    //TODO национальность
    mp.events.callRemote('server:user:createUser', name, surname, age);
});

mp.events.add('client:events:loginUser:finalCreate', function() {
    user.setLogin(true);
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