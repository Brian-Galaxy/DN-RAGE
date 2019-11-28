"use strict";

import methods from './methods';
import user from '../user';
import menuList from '../menuList';

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
    mp.events.callRemote('server:user:login', login, password, usingEmail);
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