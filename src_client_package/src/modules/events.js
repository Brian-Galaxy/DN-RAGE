"use strict";

import UIMenu from './menu';

import Container from './data';
import methods from './methods';

import user from '../user';
import menuList from '../menuList';
import voice from "../voice";
import enums from "../enums";
import inventory from "../inventory";
import items from "../items";
import phone from "../phone";
import weapons from "../weapons";

import ui from "./ui";

import checkpoint from "../manager/checkpoint";
import weather from "../manager/weather";
import timer from "../manager/timer";
import dispatcher from "../manager/dispatcher";
import jobPoint from "../manager/jobPoint";
import quest from "../manager/quest";

import vehicles from "../property/vehicles";
import business from "../property/business";

mp.gui.chat.enabled = false;

mp.events.__add__ = mp.events.add;

mp.events.add = (eventName, eventCallback) => {
    methods.debug(`Event ${eventName} called`);
    mp.events.__add__(eventName, eventCallback);
};

mp.gui.execute("const _enableChatInput = enableChatInput;enableChatInput = (enable) => { mp.trigger('chatEnabled', enable); _enableChatInput(enable) };");

mp.events.add('chatEnabled', (isEnabled) => {
    mp.gui.chat.enabled = isEnabled;
    methods.disableAllControls(isEnabled);
});

let maxSpeed = 500;
let _playerDisableAllControls = false;
let _playerDisableDefaultControls = false;

mp.events.add('client:cefDebug', function (message) {
    try {
        methods.debug(`[CEF] ${message}`);
    } catch (e) {
    }
});

mp.events.add('client:events:disableAllControls', function (disable) {
    _playerDisableAllControls = disable;
});

mp.events.add('client:events:disableDefaultControls', function (disable) {
    _playerDisableDefaultControls = disable;
});

mp.events.add('client:events:dialog:onClose', function () {

});

mp.events.add('client:events:dialog:click', function () {

});

mp.events.add('client:user:auth:register', function(mail, login, passwordReg, passwordRegCheck, acceptRules) {
    //methods.debug(`'${mail} ${login} ${passwordReg} ${passwordRegCheck} ${acceptRules}'`);
    try {
        var checkMail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!checkMail.test(String(mail).toLowerCase())) {
            mp.game.ui.notifications.show('~r~Email - не валидный адрес');
            return;
        }
        mail = mail.toLowerCase();
        login = login.toLowerCase();
        login = login.replace(/[^a-zA-Z0-9\s]/ig, '');
        if (login === "") {
            user.showCustomNotify('Логин - поле не заполнено', 1);
            return;
        }
        if (passwordReg === "") {
            user.showCustomNotify('Пароль - поле не заполнено', 1);
            return;
        }
        if (passwordReg !== passwordRegCheck) {
            user.showCustomNotify('Пароли не совпадают', 1);
            return;
        }
        if (acceptRules === false) {
            user.showCustomNotify('Вы не согласились с правилами сервера', 1);
            return;
        }
        //user.showCustomNotify('~b~Пожалуйста подождите...');
        //methods.storage.set('login', login);
        mp.events.callRemote('server:user:createAccount', login, passwordReg, mail);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:user:auth:login', function(login, password) {
    methods.debug(`'${login} ${password}'`);
    try {
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
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:events:loginAccount:success', function(data) {
    try {
        ui.callCef('authMain','{"type": "showCreatePage"}');

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
    }
    catch (e) {
        methods.debug(e);
    }
    //ui.callCef('ChangePlayer','{"type": "show"}');
});

mp.events.add('client:events:createNewPlayer', function() {
    try {
        user.hideLoadDisplay();
        ui.callCef('authMain','{"type": "hide"}');
        ui.callCef('customization','{"type": "show"}');

        user.set('SKIN_SEX', 0);
        user.setPlayerModel('mp_m_freemode_01');
        ui.hideHud();
    }
    catch (e) {
        methods.debug(e);
    }
    //ui.callCef('ChangePlayer','{"type": "show"}');
});

mp.events.add('client:events:selectPlayer', function(name, spawnName) {
    try {
        user.login(name, spawnName);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:events:custom:updateAge', function(age) {
    methods.debug(age);
    try {
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
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:events:custom:set', function(input_editor_face, input_editor_nose, input_editor_eyes_lips, input_editor_face_last, cheked_sex, mother, father, mix1, mix2) {
    methods.debug('CUSTOM');

    try {
        let faceEditor = JSON.parse(input_editor_face);
        let noseEditor = JSON.parse(input_editor_nose);
        let eyeEditor = JSON.parse(input_editor_eyes_lips);
        let faceLastEditor = JSON.parse(input_editor_face_last);

        try {
            if (user.getCache('SKIN_FACE_SPECIFICATIONS')) {
                if(JSON.parse(user.getCache('SKIN_FACE_SPECIFICATIONS')).length < 20) {
                    user.set('SKIN_FACE_SPECIFICATIONS', JSON.stringify([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
                }
            }
            else {
                user.set('SKIN_FACE_SPECIFICATIONS', JSON.stringify([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
            }
        }
        catch (e) {
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
        user.set('SKIN_HAIR_COLOR_2', faceLastEditor[2].index_help);
        user.set('SKIN_EYEBROWS', faceLastEditor[3].index_help);
        user.set('SKIN_EYEBROWS_COLOR', faceLastEditor[4].index_help);
        user.set('SKIN_EYE_COLOR', faceLastEditor[5].index_help);
        user.set('SKIN_OVERLAY_9', faceLastEditor[6].index_help - 1);
        user.set('SKIN_OVERLAY_COLOR_9', faceLastEditor[7].index_help);

        /*user.set('SKIN_OVERLAY_1', faceLastEditor[8].index_help - 1);
        user.set('SKIN_OVERLAY_COLOR_1', faceLastEditor[9].index_help);*/

        user.updateCharacterFace(true);
    }
    catch (e) {
        methods.debug(e);
    }
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
    try {
        user.set('stats_strength', strength);
        user.set('stats_endurance', endurance);
        user.set('stats_shooting', shooting);
        user.set('stats_flying', flying);
        user.set('stats_driving', driving);
        user.set('stats_psychics', psychics);
        user.set('stats_lucky', stealth);
        user.set('is_custom', true);

        user.save();
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:events:custom:choiceRole', function(roleIndex) {

    user.showLoadDisplay();

    setTimeout(function () {
        try {
            ui.callCef('authMain','{"type": "hide"}');
            ui.callCef('customization','{"type": "hide"}');
            user.destroyCam();

            mp.players.local.freezePosition(false);
            mp.players.local.setCollision(true, true);
            mp.gui.cursor.show(false, false);
            mp.gui.chat.show(true);
            mp.gui.chat.activate(true);
            mp.game.ui.displayRadar(true);

            user.setLogin(true);

            if (user.getCache('role') > 0) {
                user.set('is_custom', true);
                user.save();
                user.showCustomNotify('Вы уже выбирали роль', 1);

                let roleIdx = user.getCache('role') - 1;
                user.teleport(enums.spawnByRole[roleIdx][0], enums.spawnByRole[roleIdx][1], enums.spawnByRole[roleIdx][2], enums.spawnByRole[roleIdx][3]);
                return;
            }

            switch (roleIndex) {
                case 0:
                    //Еда, вода
                    //Нет регистрации
                    //После квеста 3 уровень рабочего стажа
                    break;
                case 1:
                    //Телефон
                    //Временная регистрация
                    user.addCashMoney(500);
                    break;
                case 2:
                    //Выдадут Гражданство
                    break;
            }

            user.set('role', roleIndex + 1);
            user.set('is_custom', true);
            user.save();

            user.teleport(enums.spawnByRole[roleIndex][0], enums.spawnByRole[roleIndex][1], enums.spawnByRole[roleIndex][2], enums.spawnByRole[roleIndex][3]);
        }
        catch (e) {
            methods.debug(e);
        }
    }, 500);
});

mp.events.add('client:events:custom:camera', function(rot, range, height) {
    try {
        height = height - 50;

        user.getCam().pointAtCoord(9.66692, 528.34783, 171.2 + (height / 100));
        user.camSetDist(range / 100);
        user.camSetRot(rot);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:events:custom:register', function(name, surname, age, promocode, referer, national) {
    try {
        if (age < 18) {
            user.showCustomNotify('Возраст не может быть меньше 18 лет', 1);
            return;
        }
        else if (age > 60) {
            user.showCustomNotify('Возраст не может быть больше 60 лет', 1);
            return;
        }
        mp.events.callRemote('server:user:createUser', name, surname, age, promocode, referer, national);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:events:loginUser:finalCreate', function() {
    try {
        if (user.isLogin()) {
            user.init2();
            mp.players.local.position = new mp.Vector3(9.66692, 528.34783, 170.63504);
            mp.players.local.setRotation(0, 0, 123.53768, 0, true);
        }
        user.hideLoadDisplay();
        setTimeout(ui.hideHud, 500);

        user.setLogin(true);
        ui.callCef('authMain','{"type": "hide"}');
        ui.callCef('customization','{"type": "show"}');
        ui.callCef('customization','{"type": "showFamilyPage"}');

        user.set('SKIN_SEX', 0);
        user.setPlayerModel('mp_m_freemode_01');
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:events:loginUser:success', async function() {
    user.setLogin(true);
    //user.updateCache();

    if (await user.get('is_custom')) {
        user.destroyCam();
        mp.players.local.freezePosition(false);
        mp.players.local.setCollision(true, true);
        mp.gui.cursor.show(false, false);
        mp.gui.chat.show(true);
        mp.gui.chat.activate(true);
        mp.game.ui.displayRadar(true);
    }

    user.showCustomNotify('Если у Вас не рабоатет управление, нажмите ALT+TAB', 0, 5, 15000);

    setTimeout(async function () {
        inventory.getItemList(inventory.types.Player, await user.get('id'));
        quest.loadAllBlip();
    }, 5000);
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
    ui.callCef(name, params);
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

mp.events.add('client:dispatcher:addDispatcherList', (title, desc, time, x, y, z, withCoord) => {
    methods.debug('Event: client:dispatcher:addDispatcherList', title, desc, time, x, y, z, withCoord);
    dispatcher.addDispatcherList(title, desc, time, x, y, z, withCoord);
});

mp.events.add('client:dispatcher:addDispatcherTaxiList', (count, title, desc, time, price, x, y, z) => {
    methods.debug('Event: client:dispatcher:addDispatcherTaxiList', count, title, desc, time, price, x, y, z);
    dispatcher.addDispatcherTaxiList(count, title, desc, time, price, x, y, z);
});

mp.events.add('client:updateCheckpointList', (data) => {
    try {
        methods.debug('Event: client:updateCheckpointList');
        checkpoint.updateCheckpointList(data);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:fixCheckpointList', () => {
    try {
        methods.debug('Event: client:fixCheckpointList');
        checkpoint.fixCheckpointList();
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:updateVehicleInfo', (idx, data) => {
    try {
        methods.debug('Event: client:updateVehicleInfo', idx);
        enums.updateVehicleInfo(idx, data);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:updateItemList', (weaponList, componentList, itemList) => {
    methods.debug('Event: client:updateItemList');

    try {
        items.updateItems(JSON.parse(itemList));
        weapons.setComponentList(JSON.parse(componentList));
        weapons.setMapList(JSON.parse(weaponList));
    }
    catch (e) {
        methods.debug('client:updateItemList', e);
    }
});

mp.events.add('client:showHouseOutMenu', (item) => {
    try {
        methods.debug('Event: client:menuList:showHouseOutMenu');
        menuList.showHouseOutMenu(new Map(item)).then();
    }
    catch (e) {
        methods.debug('Exception: events:client:showHouseOutMenu');
        methods.debug(e);
    }
});

mp.events.add('client:showHouseOutVMenu', (item) => {
    try {
        methods.debug('Event: client:menuList:showHouseOutMenu');
        menuList.showHouseOutVMenu(new Map(item)).then();
    }
    catch (e) {
        methods.debug('Exception: events:client:showHouseOutMenu');
        methods.debug(e);
    }
});

mp.events.add('client:showHouseBuyMenu', (item) => {
    try {
        methods.debug('Event: client:menuList:showHouseBuyMenu');
        menuList.showHouseBuyMenu(new Map(item)).then();
    }
    catch (e) {
        methods.debug('Exception: events:client:showHouseBuyMenu');
        methods.debug(e);
    }
});

mp.events.add('client:showHouseInMenu', (item) => {
    try {
        methods.debug('Event: client:menuList:showHouseInMenu');
        menuList.showHouseInMenu(new Map(item));
    }
    catch (e) {
        methods.debug('Exception: events:client:showHouseInMenu');
        methods.debug(e);
    }
});

mp.events.add('client:showHouseInGMenu', (item) => {
    try {
        methods.debug('Event: client:menuList:showHouseInMenu');
        menuList.showHouseInGMenu(new Map(item));
    }
    catch (e) {
        methods.debug('Exception: events:client:showHouseInMenu');
        methods.debug(e);
    }
});

mp.events.add('client:showHouseInVMenu', (item) => {
    try {
        methods.debug('Event: client:menuList:showHouseInMenu');
        menuList.showHouseInVMenu(new Map(item));
    }
    catch (e) {
        methods.debug('Exception: events:client:showHouseInMenu');
        methods.debug(e);
    }
});

mp.events.add('client:showCondoOutMenu', (item) => {
    try {
        methods.debug('Event: client:menuList:showCondoOutMenu');
        menuList.showCondoOutMenu(new Map(item)).then();
    }
    catch (e) {
        methods.debug('Exception: events:client:showCondoOutMenu');
        methods.debug(e);
    }
});

mp.events.add('client:showCondoBuyMenu', (item) => {
    try {
        methods.debug('Event: client:menuList:showCondoBuyMenu');
        menuList.showCondoBuyMenu(new Map(item)).then();
    }
    catch (e) {
        methods.debug('Exception: events:client:showCondoBuyMenu');
        methods.debug(e);
    }
});

mp.events.add('client:showCondoInMenu', (item) => {
    try {
        methods.debug('Event: client:menuList:showCondoInMenu');
        menuList.showCondoInMenu(new Map(item));
    }
    catch (e) {
        methods.debug('Exception: events:client:showCondoInMenu');
        methods.debug(e);
    }
});

mp.events.add('client:showStockOutMenu', (item) => {
    try {
        methods.debug('Event: client:menuList:showCondoOutMenu');
        menuList.showStockOutMenu(new Map(item)).then();
    }
    catch (e) {
        methods.debug('Exception: events:client:showCondoOutMenu');
        methods.debug(e);
    }
});

mp.events.add('client:showStockBuyMenu', (item) => {
    try {
        methods.debug('Event: client:menuList:showCondoBuyMenu');
        menuList.showStockBuyMenu(new Map(item)).then();
    }
    catch (e) {
        methods.debug('Exception: events:client:showCondoBuyMenu');
        methods.debug(e);
    }
});

mp.events.add('client:showStockInMenu', (item) => {
    try {
        methods.debug('Event: client:menuList:showCondoInMenu');
        menuList.showStockInMenu(new Map(item));
    }
    catch (e) {
        methods.debug('Exception: events:client:showCondoInMenu');
        methods.debug(e);
    }
});

mp.events.add('client:showStockPanelMenu', (item) => {
    try {
        methods.debug('Event: client:menuList:showCondoInMenu');
        menuList.showStockPanelMenu(new Map(item));
    }
    catch (e) {
        methods.debug('Exception: events:client:showCondoInMenu');
        methods.debug(e);
    }
});

mp.events.add('client:showStockOutVMenu', (item) => {
    try {
        methods.debug('Event: client:menuList:showCondoOutMenu');
        menuList.showStockOutVMenu(new Map(item)).then();
    }
    catch (e) {
        methods.debug('Exception: events:client:showCondoOutMenu');
        methods.debug(e);
    }
});

mp.events.add('client:showStockInVMenu', (item) => {
    try {
        methods.debug('Event: client:menuList:showCondoInMenu');
        menuList.showStockInVMenu(new Map(item));
    }
    catch (e) {
        methods.debug('Exception: events:client:showCondoInMenu');
        methods.debug(e);
    }
});

mp.events.add('client:menuList:showShopClothMenu', (shopId, type, menuType, price) => {
    try {
        methods.debug('Event: client:menuList:showShopClothMenu');
        menuList.showShopClothMenu(shopId, type, menuType, price);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:menuList:showTattooShopMenu', (title1, title2, shopId) => {
    try {
        methods.debug('Event: client:menuList:showTattooShopMenu');
        menuList.showTattooShopMenu(title1, title2, shopId);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:menuList:showShopMaskMenu', (shopId) => {
    try {
        methods.debug('Event: client:menuList:showShopMaskMenu');
        menuList.showShopMaskMenu(shopId);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:menuList:showPrintShopMenu', () => {
    try {
        methods.debug('Event: client:menuList:showPrintShopMenu');
        menuList.showPrintShopMenu();
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:menuList:showGunShopMenu', (shopId, price) => {
    try {
        methods.debug('Event: client:menuList:showGunShopMenu');
        menuList.showGunShopMenu(shopId, price);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:menuList:showLscMenu', (shopId, price) => {
    try {
        methods.debug('Event: client:menuList:showLscMenu');
        menuList.showLscMenu(shopId, price);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:menuList:showVehShopMenu', (shopId, carPos, buyPos, carList) => {
    try {
        methods.debug('Event: client:menuList:showVehShopMenu');
        menuList.showVehShopMenu(shopId, JSON.parse(carPos), JSON.parse(buyPos), new Map(carList));
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:menuList:showInvaderShopMenu', () => {
    try {
       methods.debug('Event: client:menuList:showInvaderShopMenu');
       menuList.showInvaderShopMenu();
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:menuList:showRentBikeMenu', (shopId, price) => {
    try {
        methods.debug('Event: client:menuList:showRentBikeMenu');
        menuList.showRentBikeMenu(shopId, price);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:menuList:showBarberShopMenu', (shopId, price) => {
    try {
        methods.debug('Event: client:menuList:showBarberShopMenu');
        menuList.showBarberShopMenu(shopId, price);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:menuList:showBankMenu', (bankId, price) => {
    try {
        methods.debug('Event: client:menuList:showBankMenu');
        menuList.showBankMenu(bankId, price);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:menuList:showShopMenu', (shopId, price, type) => {
    try {
        methods.debug('Event: client:menuList:showShopMenu');
        menuList.showShopMenu(shopId, price, type);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:menuList:showShopAlcMenu', (shopId, price, type) => {
    try {
        methods.debug('Event: client:menuList:showShopAlcMenu');
        menuList.showShopAlcMenu(shopId, price, type);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:menuList:showShopElMenu', (shopId, price) => {
    try {
        methods.debug('Event: client:menuList:showShopElMenu');
        menuList.showShopElMenu(shopId, price);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:menuList:showShopMedMenu', (shopId, price) => {
    try {
        methods.debug('Event: client:menuList:showShopMedMenu');
        menuList.showShopMedMenu(shopId, price);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:menuList:showShopFishMenu', (shopId, price) => {
    try {
        methods.debug('Event: client:menuList:showShopFishMenu');
        menuList.showShopFishMenu(shopId, price);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:menuList:showShopHuntMenu', (shopId, price) => {
    try {
        methods.debug('Event: client:menuList:showShopHuntMenu');
        menuList.showShopHuntMenu(shopId, price);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:menuList:showBarMenu', (shopId, price) => {
    try {
        methods.debug('Event: client:menuList:showBarMenu');
        menuList.showBarMenu(shopId, price);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:menuList:showBarFreeMenu', () => {
    try {
        methods.debug('Event: client:menuList:showBarFreeMenu');
        menuList.showBarFreeMenu();
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:menuList:showBotQuestRole0Menu', () => {
    try {
        methods.debug('Event: client:menuList:showBotQuestRole0Menu');
        menuList.showBotQuestRole0Menu();
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:menuList:showBotQuestRoleAllMenu', () => {
    try {
        methods.debug('Event: client:menuList:showBotQuestRoleAllMenu');
        menuList.showBotQuestRoleAllMenu();
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:menuList:showBotQuestGangMenu', () => {
    try {
        methods.debug('Event: client:menuList:showBotQuestGangMenu');
        menuList.showBotQuestGangMenu();
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:showToPlayerItemListMenu', (data, ownerType, ownerId) => {
    try {
        methods.debug('Event: client:showToPlayerItemListMenu');
        menuList.showToPlayerItemListMenu(data, ownerType, ownerId).then();
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:clearChat', () => {
    user.clearChat();
});

mp.events.add('client:teleport', (x, y, z, rot) => {
    methods.debug('Event: client:teleport', x, y, z, rot);
    user.teleport(x, y, z, rot);
});

mp.events.add('client:teleportVeh', (x, y, z, rot) => {
    methods.debug('Event: client:teleportVeh', x, y, z, rot);
    user.teleportVeh(x, y, z, rot);
});

mp.events.add('client:managers:weather:nextWeather', (weatherName, delay) => {
    try {
        methods.debug('Event: client:user:nextWeather');
        weather.nextWeather(weatherName, delay);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:managers:weather:setCurrentWeather', (weatherName) => {
    try {
        methods.debug('Event: client:user:setCurrentWeather');
        weather.nextWeather(weatherName, 10);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:managers:weather:syncDateTime', (min, hour, day, month, year) => {
    //methods.debug('Event: client:user:syncDateTime', min, hour, day, month, year);
    try {
        weather.syncDateTime(min, hour, day, month, year);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:managers:weather:syncRealTime', (hour) => {
    try {
        //methods.debug('Event: client:user:syncRealTime', hour);
        weather.syncRealHour(hour);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:managers:weather:syncWeatherTemp', (temp) => {
    try {
        //methods.debug('Event: client:user:syncWeatherTemp', temp);
        weather.syncWeatherTemp(temp);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:managers:weather:syncWeatherWind', (windSpeed, windDir) => {
    try {
        //methods.debug('Event: client:user:syncWeatherTemp', temp);
        weather.syncWeatherWind(windSpeed, windDir);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:managers:weather:syncRealFullDateTime', (dateTime) => {
    try {
        //methods.debug('Event: client:user:syncRealFullDateTime', dateTime);
        weather.syncRealFullDateTime(dateTime);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:managers:weather:syncRealTime', (time) => {
    try {
        //methods.debug('Event: client:user:syncRealFullDateTime', dateTime);
        weather.syncRealTime(time);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:managers:weather:syncRealDate', (time) => {
    try {
        //methods.debug('Event: client:user:syncRealFullDateTime', dateTime);
        weather.syncRealDate(time);
    }
    catch (e) {
        methods.debug(e);
    }
});

let handcuffTimerId = null;

mp.events.add('client:handcuffs', (value) => {
    UIMenu.Menu.HideMenu();
    methods.debug('Event: client:handcuffs');
    methods.disableDefaultControls(value);

    /*if (value == false) {
        mp.players.local.clearTasks();
    }*/
    //mp.game.invoke(methods.SET_ENABLE_HANDCUFFS, mp.players.local.handle, value);
    if (value) {
        handcuffTimerId = setInterval(function() {
            if ((user.isCuff() || user.isTie()) && mp.players.local.isPlayingAnim("mp_arresting", "idle", 3) == 0)
                mp.players.local.clearTasks();
            user.playAnimation("mp_arresting", "idle", 49);
        }, 2500);
    } else {
        clearInterval(handcuffTimerId);
        if (mp.players.local.isPlayingAnim("mp_arresting", "idle", 3) == 0)
            user.stopAllAnimation();
        else
            user.playAnimation("mp_arresting", "b_uncuff", 8);
    }
});

mp.events.add('client:user:addDrugLevel', (drugType, level) => {
    user.addDrugLevel(drugType, level);
});

mp.events.add('client:user:removeDrugLevel', (drugType, level) => {
    user.removeDrugLevel(drugType, level);
});

mp.events.add('client:user:setDrugLevel', (drugType, level) => {
    user.setDrugLevel(drugType, level);
});

mp.events.add('client:user:stopAllScreenEffects', () => {
    user.stopAllAnimation();
});

mp.events.add('client:user:revive', (hp) => {
    methods.debug('Event: client:user:revive');
    user.revive(hp);
});

mp.events.add('client:user:createBlip1', (x, y, z, blipId, blipColor, route) => {
    jobPoint.createBlip1(new mp.Vector3(x, y, z), blipId, blipColor, route);
});

mp.events.add('client:user:deleteBlip1', () => {
    jobPoint.deleteBlip1();
});

mp.events.add('client:user:createBlip2', (x, y, z, blipId, blipColor, route) => {
    jobPoint.createBlip2(new mp.Vector3(x, y, z), blipId, blipColor, route);
});

mp.events.add('client:user:deleteBlip2', () => {
    jobPoint.deleteBlip2();
});

mp.events.add('client:user:createBlip3', (x, y, z, blipId, blipColor, route) => {
    jobPoint.createBlip3(new mp.Vector3(x, y, z), blipId, blipColor, route);
});

mp.events.add('client:user:deleteBlip3', () => {
    jobPoint.deleteBlip3();
});

mp.events.add('client:user:sendPhoneNotify', (sender, title, message, pic) => {
    methods.debug('Event: client:user:sendPhoneNotify');
    user.sendPhoneNotify(sender, title, message, pic);
});

mp.events.add('client:jail:jailPlayer', (sec, withIzol) => {
    methods.debug('Event: client:jail:toJail' + sec);
    jail.toJail(sec);
});

mp.events.add('client:user:askDatingToPlayerId', (playerId, nick) => {
    menuList.showPlayerDatingAskMenu(playerId, nick);
});

mp.events.add('client:user:setDating', (key, val) => {
    user.setDating(key, val);
});

mp.events.add('client:user:updateDating', (datingList) => {
    try {
        JSON.parse(datingList).forEach(item => {
            try {
                user.setDating(item.uId, item.uName);
            }
            catch (e) {
                methods.debug(e);
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:menuList:showMenu', (title, desc, menuData) => {
    methods.debug('Event: client:menuList:showMenu');
    menuList.showMenu(title, desc, new Map(menuData));
});

mp.events.add('client:menuList:showMazeOfficeTeleportMenu', () => {
    methods.debug('Event: client:menuList:showMazeOfficeTeleportMenu');
    menuList.showMazeOfficeTeleportMenu();
});

mp.events.add('client:menuList:showCasinoLiftTeleportMenu', () => {
    methods.debug('Event: client:menuList:showCasinoLiftTeleportMenu');
    menuList.showCasinoLiftTeleportMenu();
});

mp.events.add('client:menuList:showFibOfficeTeleportMenu', () => {
    methods.debug('Event: client:menuList:showFibOfficeTeleportMenu');
    menuList.showFibOfficeTeleportMenu();
});

mp.events.add('client:menuList:showGovOfficeTeleportMenu', () => {
    methods.debug('Event: client:menuList:showGovOfficeTeleportMenu');
    menuList.showGovOfficeTeleportMenu();
});

mp.events.add('client:menuList:showBusinessTeleportMenu', () => {
    try {
        methods.debug('Event: client:menuList:showBusinessTeleportMenu');
        menuList.showBusinessTeleportMenu();
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:showBusinessTypeListMenu', (data1, data2, data3) => {
    try {
        methods.debug('Event: client:showBusinessTypeListMenu');
        menuList.showBusinessTypeListMenu(data1, data2, data3);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:showBusinessLogMenu', (data) => {
    try {
        methods.debug('Event: client:showBusinessLogMenu');
        menuList.showBusinessLogMenu(data);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:showInvaderNewsMenu', (data) => {
    try {
        methods.debug('Event: client:showInvaderAdMenu');
        menuList.showInvaderNewsMenu(data);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:showInvaderAdMenu', (data) => {
    try {
        methods.debug('Event: client:showInvaderAdMenu');
        menuList.showInvaderAdMenu(data);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:showInvaderAdTempMenu', (data) => {
    try {
        methods.debug('Event: client:showInvaderAdMenu');
        menuList.showInvaderAdTempMenu(data);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:showBankLogMenu', (data) => {
    try {
        methods.debug('Event: client:showBankLogMenu');
        menuList.showBankLogMenu(data);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:showPlayerHistoryMenu', (data) => {
    try {
        methods.debug('Event: client:showPlayerHistoryMenu');
        menuList.showPlayerHistoryMenu(data);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:menuList:showBusinessMenu', (data) => {
    try {
        methods.debug('Event: client:menuList:showBusinessMenu');
        menuList.showBusinessMenu(new Map(data));
    }
    catch (e) {
        methods.debug('Exception: events:client:showBusinessMenu');
        methods.debug(e);
    }
});

mp.events.add('client:menuList:showMeriaMainMenu', () => {
    methods.debug('Event: client:menuList:showMeriaMainMenu');
    menuList.showMeriaMainMenu();
});

mp.events.add('client:menuList:showMazeOfficeMenu', async () => {
    methods.debug('Event: client:menuList:showMazeOfficeMenu');
    menuList.showBankMenu(1, await business.getPrice(1));
});

mp.events.add('client:menuList:showFractionKeyMenu', (data) => {
    methods.debug('Event: client:menuList:showFractionKeyMenu', data);
    menuList.showFractionKeyMenu(data);
});

mp.events.add('client:menuList:showFractionInfoMenu', () => {
    methods.debug('Event: client:menuList:showFractionInfoMenu');
    menuList.showFractionInfoMenu();
});

mp.events.add('client:menuList:showFractionInvaderMenu', () => {
    methods.debug('Event: client:menuList:showFractionInvaderMenu');
    menuList.showFractionInvaderMenu();
});

mp.events.add('client:menuList:showAskBuyLicMenu', (playerId, lic, licName, price) => {
    methods.debug('Event: client:menuList:showAskBuyLicMenu');
    menuList.showAskBuyLicMenu(playerId, lic, licName, price);
});

mp.events.add('client:menuList:showGovGarderobMenu', () => {
    methods.debug('Event: client:menuList:showGovGarderobMenu');
    menuList.showGovGarderobMenu();
});

mp.events.add('client:menuList:showSapdArsenalMenu', () => {
    methods.debug('Event: client:menuList:showSapdArsenalMenu');
    menuList.showSapdArsenalMenu();
});

mp.events.add('client:menuList:showSapdArrestMenu', () => {
    methods.debug('Event: client:menuList:showSapdArrestMenu');
    menuList.showSapdArrestMenu();
});

mp.events.add('client:menuList:showSapdClearMenu', () => {
    methods.debug('Event: client:menuList:showSapdClearMenu');
    menuList.showSapdClearMenu();
});

mp.events.add('client:menuList:showSapdGarderobMenu', () => {
    methods.debug('Event: client:menuList:showSapdGarderobMenu');
    menuList.showSapdGarderobMenu();
});

mp.events.add('client:menuList:showSapdArrestMenu', () => {
    methods.debug('Event: client:menuList:showSapdArrestMenu');
    //menuList.showSapdArrestMenu();
});

mp.events.add('client:menuList:showSapdClearMenu', () => {
    methods.debug('Event: client:menuList:showSapdClearMenu');
    //menuList.showSapdClearMenu();
});

mp.events.add('client:menuList:showEmsGarderobMenu', () => {
    methods.debug('Event: client:menuList:showEmsGarderobMenu');
    menuList.showEmsGarderobMenu();
});

mp.events.add('client:menuList:showSheriffGarderobMenu', () => {
    methods.debug('Event: client:menuList:showSheriffGarderobMenu');
    menuList.showSheriffGarderobMenu();
});

mp.events.add('client:menuList:showSheriffArsenalMenu', () => {
    methods.debug('Event: client:menuList:showSheriffArsenalMenu');
    menuList.showSheriffArsenalMenu();
});

/*mp.events.add('client:menuList:showFibArsenalMenu', () => {
    methods.debug('Event: client:menuList:showFibArsenalMenu');
    menuList.showFibArsenalMenu();
});

mp.events.add('client:menuList:showUsmcArsenalMenu', () => {
    methods.debug('Event: client:menuList:showPrisonArsenalMenu');
    menuList.showUsmcArsenalMenu();
});*/


mp.events.add('client:menuList:showSpawnJobCarMenu', (price, x, y, z, heading, name, job) => {
    try {
        methods.debug('Event: client:menuList:showSpawnJobCarMenu');
        menuList.showSpawnJobCarMenu(price, x, y, z, heading, name, job);
    }
    catch (e) {
        methods.debug('Exception: events:client:showSpawnJobCarMenu');
        methods.debug(e);
    }
});

mp.events.add('client:menuList:showSpawnJobCarMailMenu', () => {
    try {
        methods.debug('Event: client:menuList:showSpawnJobCarMenu');
        menuList.showSpawnJobCarMailMenu();
    }
    catch (e) {
        methods.debug('Exception: events:client:showSpawnJobCarMenu');
        methods.debug(e);
    }
});

mp.events.add('client:menuList:showVehicleMenu', (data) => {
    try {
        methods.debug('Event: client:menuList:showVehicleMenu');
        menuList.showVehicleMenu(new Map(data));
    }
    catch (e) {
        methods.debug('Exception: events:client:showVehicleMenu');
        methods.debug(e);
    }
});

mp.events.add('client:houses:sellToPlayer', (houseId, name, sum, userId) => {
    menuList.showHouseSellToPlayerMenu(houseId, name, sum, userId);
});

mp.events.add('client:stock:sellToPlayer', (houseId, name, sum, userId) => {
    menuList.showStockSellToPlayerMenu(houseId, name, sum, userId);
});

mp.events.add('client:apartments:sellToPlayer', (houseId, name, sum, userId) => {
    menuList.showApartSellToPlayerMenu(houseId, name, sum, userId);
});

mp.events.add('client:business:sellToPlayer', (houseId, name, sum, userId) => {
    menuList.showBusinessSellToPlayerMenu(houseId, name, sum, userId);
});

mp.events.add('client:condo:sellToPlayer', (houseId, name, sum, userId) => {
    menuList.showCondoSellToPlayerMenu(houseId, name, sum, userId);
});

mp.events.add('client:car:sellToPlayer', (houseId, name, sum, userId, slot) => {
    menuList.showCarSellToPlayerMenu(houseId, name, sum, userId, slot);
});

mp.events.add('client:events:debug', function(val) {
    methods.debug(val);
    //ui.callCef('ChangePlayer','{"type": "show"}');
});

mp.events.add('client:inventory:status', function(status) {
    if (status)
        inventory.show();
    else
        inventory.hide();
});

mp.events.add('client:inventory:statusSecondary', function(status) {
    mp.gui.cursor.show(false, true);
});

mp.events.add('client:inventory:notify', function(text) {
    mp.game.ui.notifications.show(text);
});

mp.events.add('client:inventory:giveItemMenu', function() {
    try {
        let playerList = methods.getListOfPlayerInRadius(mp.players.local.position, 2);
        let tradeArray = [mp.players.local.remoteId];

        playerList.forEach(p => {
            tradeArray.push(p.remoteId);
        });

        ui.callCef('inventory', JSON.stringify({type: "updateTrade", idList: tradeArray}));

    }catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:inventory:use', function(id, itemId) {
    inventory.useItem(id, itemId);
});

mp.events.add('client:inventory:usePlayer', function(id, itemId) {
    inventory.usePlayerItem(id, itemId);
});

mp.events.add('client:inventory:moveTo', function(id, itemId, ownerId, ownerType) {
    if (ownerType == 0) {
        if (mp.players.local.dimension > 0) {
            mp.game.ui.notifications.show("~r~Нельзя выкидывать предметы в интерьере");
            return;
        }
        inventory.dropItem(id, itemId, mp.players.local.position, mp.players.local.getRotation(0));
    }
    else
        inventory.updateOwnerId(id, methods.parseInt(ownerId), ownerType);
});

mp.events.add('client:inventory:moveFrom', function(id, ownerType) {

    if (ownerType == 0) {
        inventory.deleteItemProp(id);
        user.playAnimation("pickup_object","pickup_low", 8);
    }

    inventory.updateOwnerId(id, user.getCache('id'), inventory.types.Player);
});

mp.events.add('client:inventory:drop', function(id, itemId) {
    if (mp.players.local.dimension > 0) {
        mp.game.ui.notifications.show("~r~Нельзя выкидывать предметы в интерьере");
        return;
    }
    inventory.dropItem(id, itemId, mp.players.local.position, mp.players.local.getRotation(0));
});

mp.events.add('client:inventory:openBag', function(id, itemId) {
    if (itemId == 263)
        inventory.getItemList(inventory.types.BagSmall, id);
    else
        inventory.getItemList(inventory.types.Bag, id);
});

mp.events.add('client:inventory:selectWeapon', function(id, itemId, serial) {

    let wpName = items.getItemNameHashById(itemId);
    let wpHash = weapons.getHashByName(wpName);
    let slot = weapons.getGunSlotIdByItem(itemId);

    if (user.getCache('weapon_' + slot) != serial) {
        inventory.updateItemsEquipByItemId(itemId, inventory.types.Player, user.getCache('id'), 0);
        user.set('weapon_' + slot, '');
        user.set('weapon_' + slot + '_ammo', -1);
        return;
    }

    user.setCurrentWeaponByHash(wpHash);
});

mp.events.add('client:inventory:unloadW', function(itemId) {

    let wpName = items.getItemNameHashById(itemId);
    let wpHash = weapons.getHashByName(wpName);
    let slot = weapons.getGunSlotIdByItem(itemId);
    let ammoId = weapons.getGunAmmoNameByItemId(itemId);

    if (ammoId == -1) {
        mp.game.ui.notifications.show(`~r~Данное оружие нельзя разрядить`);
        return;
    }

    inventory.addItemSql(ammoId, 1, inventory.types.Player, user.getCache('id'), user.getAmmoByHash(wpHash));

    user.setAmmo(wpName, 0);
    user.set('weapon_' + slot + '_ammo', -1);
});

mp.events.add('client:inventory:loadWeapon', function(id, itemId, loadItemId, count) {
    let wpName = items.getItemNameHashById(loadItemId);
    let wpHash = weapons.getHashByName(wpName);
    let slot = weapons.getGunSlotIdByItem(loadItemId);

    let currentAmmoId = weapons.getGunAmmoNameByItemId(loadItemId);

    if (currentAmmoId == -1) {
        mp.game.ui.notifications.show(`~r~Это оружие не нуждается в патронах`);
        return;
    }

    if (currentAmmoId != itemId) {
        mp.game.ui.notifications.show(`~r~Оружие использует патроны "${items.getItemNameById(currentAmmoId)}"`);
        return;
    }

    let ammo = user.getAmmoByHash(wpHash);

    if (items.getAmmoCount(currentAmmoId) <= ammo) {
        mp.game.ui.notifications.show(`~r~Превышен максимальный запас патрон`);
        return;
    }

    if (ammo > 0) {
        let newCount = items.getAmmoCount(currentAmmoId) - ammo;
        user.setAmmoByHash(wpHash, ammo + newCount);
        inventory.updateItemCount(id, count - newCount);
        ui.callCef('inventory', JSON.stringify({ type: 'updateItemIdCount', itemId: id, count: count - newCount }));
    }
    else {
        user.setAmmoByHash(wpHash, count);
        inventory.deleteItem(id);
        ui.callCef('inventory', JSON.stringify({ type: 'removeItemId', itemId: id }));
    }
});

mp.events.add('client:inventory:upgradeWeapon', function(id, itemId, weaponStr) {

    let weapon = JSON.parse(weaponStr);

    let wpName = items.getItemNameHashById(weapon.item_id);
    let wpHash = weapons.getHashByName(wpName);

    let wpModifer = items.getItemNameHashById(itemId);
    let hashModifer = items.getItemHashModiferById(itemId);

    if (wpModifer != wpName) {
        mp.game.ui.notifications.show(`~r~Данная модификация не подходит к этому оружию`);
        return;
    }

    let wpSlot = weapons.getUpgradeSlot(wpName, hashModifer);

    if (wpSlot == 1) {
        if (weapon.params.slot1) {
            mp.game.ui.notifications.show(`~r~Слот уже занят`);
            return;
        }
        weapon.params.slot1 = true;
        weapon.params.slot1hash = hashModifer;
    }
    if (wpSlot == 2) {
        if (weapon.params.slot2) {
            mp.game.ui.notifications.show(`~r~Слот уже занят`);
            return;
        }
        weapon.params.slot2 = true;
        weapon.params.slot2hash = hashModifer;
    }
    if (wpSlot == 3) {
        if (weapon.params.slot3) {
            mp.game.ui.notifications.show(`~r~Слот уже занят`);
            return;
        }
        weapon.params.slot3 = true;
        weapon.params.slot3hash = hashModifer;
    }
    if (wpSlot == 4) {
        if (weapon.params.slot4) {
            mp.game.ui.notifications.show(`~r~Слот уже занят`);
            return;
        }
        weapon.params.slot4 = true;
        weapon.params.slot4hash = hashModifer;
    }

    if (wpSlot == -1) {
        mp.game.ui.notifications.show(`~r~Произошла неизвестная ошибка #weapon`);
        return;
    }

    user.giveWeaponComponentByHash(wpHash, hashModifer);

    inventory.updateItemParams(weapon.id, JSON.stringify(weapon.params));
    inventory.deleteItem(id);
    ui.callCef('inventory', JSON.stringify({ type: 'removeItemId', itemId: id }));
    ui.callCef('inventory', JSON.stringify({ type: 'updateWeaponParams', itemId: id, params: weapon.params }));
});

mp.events.add('client:inventory:unEquip', function(id, itemId) {

    if (itemId == 50) {
        let money = user.getBankMoney();
        user.set('bank_card', 0);
        user.set('bank_owner', '');
        user.set('bank_pin', 0);
        user.setBankMoney(0);
        inventory.updateItemCount(id, money);
        user.save();
    }
    else if (items.isWeapon(itemId)) {

        let wpName = items.getItemNameHashById(itemId);
        let wpHash = weapons.getHashByName(wpName);
        let slot = weapons.getGunSlotIdByItem(itemId);

        let ammoId = weapons.getGunAmmoNameByItemId(itemId);

        if (ammoId >= 0) {
            inventory.addItemSql(ammoId, 1, inventory.types.Player, user.getCache('id'), user.getAmmoByHash(wpHash));
        }

        user.setAmmo(wpName, 0);
        mp.game.invoke(methods.REMOVE_WEAPON_FROM_PED, mp.players.local.handle, wpHash);

        user.set('weapon_' + slot, '');
        user.set('weapon_' + slot + '_ammo', -1);

        mp.attachmentMngr.removeLocal('WDSP_' + wpName.toUpperCase());

        user.save();
    }
    else if (itemId == 264 || itemId == 263) {
        user.set("hand", 0);
        user.set("hand_color", 0);
        user.updateCharacterCloth();
        user.save();
    }
    else if (itemId == 265) {
        if (user.getSex() == 0)
        {
            user.set("torso", 15);
            user.set("torso_color", 0);
            user.set("body", 0);
            user.set("body_color", 240);
            user.set("parachute", 0);
            user.set("parachute_color", 240);
            user.set("decal", 0);
            user.set("decal_color", 0);
            user.set("tprint_o", '');
            user.set("tprint_c", '');
            user.updateCharacterCloth();
            user.updateTattoo();
        }
        else
        {
            user.set("torso", 15);
            user.set("torso_color", 0);
            user.set("body", 15);
            user.set("body_color", 0);
            user.set("parachute", 0);
            user.set("parachute_color", 240);
            user.set("decal", 0);
            user.set("decal_color", 0);
            user.set("tprint_o", '');
            user.set("tprint_c", '');
            user.updateCharacterCloth();
            user.updateTattoo();
        }
        user.save();
    }
    else if (itemId == 266) {
        if (user.getSex() == 0)
        {
            user.set("leg", 61);
            user.set("leg_color", 13);
            user.updateCharacterCloth();
        }
        else
        {
            user.set("leg", 15);
            user.set("leg_color", 0);
            user.updateCharacterCloth();
        }
        user.save();
    }
    else if (itemId == 267) {
        if (user.getSex() == 0)
        {
            user.set("foot", 34);
            user.set("foot_color", 0);
            user.updateCharacterCloth();
        }
        else
        {
            user.set("foot", 35);
            user.set("foot_color", 0);
            user.updateCharacterCloth();
        }
        user.save();
    }
    else if (itemId == 268) {
        user.set("accessorie", 0);
        user.set("accessorie_color", 0);
        user.updateCharacterCloth();
        user.save();
    }
    else if (itemId == 269) {
        user.set("hat", -1);
        user.set("hat_color", -1);
        user.updateCharacterCloth();
        user.save();
    }
    else if (itemId == 270) {
        user.set("glasses", -1);
        user.set("glasses_color", -1);
        user.updateCharacterCloth();
        user.save();
    }
    else if (itemId == 271) {
        user.set("ear", -1);
        user.set("ear_color", -1);
        user.updateCharacterCloth();
        user.save();
    }
    else if (itemId == 272) {
        user.set("watch", -1);
        user.set("watch_color", -1);
        user.updateCharacterCloth();
        user.save();
    }
    else if (itemId == 273) {
        user.set("bracelet", -1);
        user.set("bracelet_color", -1);
        user.updateCharacterCloth();
        user.save();
    }
    else if (itemId == 274) {
        user.set("mask", 0);
        user.set("mask_color", 0);
        user.updateCharacterCloth();
        user.save();
    }
    //inventory.updateEquipStatus(id, false);
    inventory.updateItemsEquipByItemId(itemId, inventory.types.Player, user.getCache('id'), 0);
});

mp.events.add('client:inventory:equip', function(id, itemId, count, aparams) {

    inventory.deleteItemProp(id);
    inventory.updateOwnerId(id, inventory.types.Player, user.getCache('id'));

    let params = {};

    try {
        params = JSON.parse(aparams);
    }
    catch (e) {
        methods.debug(e);
    }

    if (itemId == 50) {
        if (user.getCache('bank_card') == 0) {
            user.set('bank_card', methods.parseInt(params.number));
            user.set('bank_owner', params.owner);
            user.set('bank_pin', methods.parseInt(params.pin));
            user.setBankMoney(count);
            user.save();
        }
        else {
            mp.game.ui.notifications.show("~r~Карта уже экипирована, для начала снимите текущую");
            return;
        }
    }
    else if (items.isWeapon(itemId)) {

        let slot = weapons.getGunSlotIdByItem(itemId);
        if (user.getCache('weapon_' + slot) == '') {
            user.set('weapon_' + slot, params.serial);
            user.set('weapon_' + slot + '_ammo', -1);
            user.giveWeapon(items.getItemNameHashById(itemId), 0);
            ui.callCef('inventory', JSON.stringify({type: "updateSelectWeapon", selectId: id}));

            let wpHash = weapons.getHashByName(items.getItemNameHashById(itemId));

            user.removeAllWeaponComponentsByHash(wpHash);
            user.setWeaponTintByHash(wpHash, 0);

            if (params.slot1)
                user.giveWeaponComponentByHash(wpHash, params.slot1hash);
            if (params.slot2)
                user.giveWeaponComponentByHash(wpHash, params.slot2hash);
            if (params.slot3)
                user.giveWeaponComponentByHash(wpHash, params.slot3hash);
            if (params.slot4)
                user.giveWeaponComponentByHash(wpHash, params.slot4hash);
            if (params.superTint)
                user.giveWeaponComponentByHash(wpHash, params.superTint);
            if (params.tint)
                user.setWeaponTintByHash(wpHash, params.tint);

            user.save();
        }
        else {
            ui.callCef('inventory', JSON.stringify({type: "weaponToInventory", itemId: id}));
            mp.game.ui.notifications.show("~r~Слот под оружие уже занят");
            return;
        }
    }
    else if (itemId <= 471 && itemId >= 293) {
        let useItemId = items.getWeaponIdByName(items.getItemNameHashById(itemId));
        let slot = weapons.getGunSlotIdByItem(useItemId);
    }
    else if (itemId == 264 || itemId == 263) {
        user.set("hand", params.hand);
        user.set("hand_color", params.hand_color);
        user.updateCharacterCloth();
        user.save();
    }
    else if (itemId == 265) {
        if (user.getCache('torso') == 15) {
            user.set("torso", params.torso);
            user.set("torso_color", params.torso_color);
            user.set("body", params.body);
            user.set("body_color", params.body_color);
            user.set("parachute", params.parachute);
            user.set("parachute_color", params.parachute_color);
            user.set("decal", 0);
            user.set("decal_color", 0);
            user.set("tprint_o", params.tprint_o);
            user.set("tprint_c", params.tprint_c);
            user.updateCharacterCloth();
            user.updateTattoo();
        }
        else {
            mp.game.ui.notifications.show("~r~Одежда уже экипирована, для начала снимите текущую");
            return;
        }
    }
    else if (itemId == 266) {
        if (user.getCache('leg') == 61 && user.getSex() == 0 || user.getCache('leg') == 15 && user.getSex() == 1) {
            user.set("leg", params.leg);
            user.set("leg_color", params.leg_color);
            user.updateCharacterCloth();
        }
        else {
            mp.game.ui.notifications.show("~r~Одежда уже экипирована, для начала снимите текущую");
            return;
        }
    }
    else if (itemId == 267) {
        if (user.getCache('foot') == 34 && user.getSex() == 0 || user.getCache('leg') == 35 && user.getSex() == 1) {
            user.set("foot", params.foot);
            user.set("foot_color", params.foot_color);
            user.updateCharacterCloth();
        }
        else {
            mp.game.ui.notifications.show("~r~Одежда уже экипирована, для начала снимите текущую");
            return;
        }
    }
    else if (itemId == 268) {
        if (user.getCache('accessorie') == 0) {
            user.set("accessorie", params.accessorie);
            user.set("accessorie_color", params.accessorie_color);
            user.updateCharacterCloth();
        }
        else {
            mp.game.ui.notifications.show("~r~Одежда уже экипирована, для начала снимите текущую");
            return;
        }
    }
    else if (itemId == 269) {
        if (user.getCache('hat') == -1) {
            user.set("hat", params.hat);
            user.set("hat_color", params.hat_color);
            user.updateCharacterCloth();
        }
        else {
            mp.game.ui.notifications.show("~r~Одежда уже экипирована, для начала снимите текущую");
            return;
        }
    }
    else if (itemId == 270) {
        if (user.getCache('glasses') == -1) {
            user.set("glasses", params.glasses);
            user.set("glasses_color", params.glasses_color);
            user.updateCharacterCloth();
        }
        else {
            mp.game.ui.notifications.show("~r~Одежда уже экипирована, для начала снимите текущую");
            return;
        }
    }
    else if (itemId == 271) {
        if (user.getCache('ear') == -1) {
            user.set("ear", params.ear);
            user.set("ear_color", params.ear_color);
            user.updateCharacterCloth();
        }
        else {
            mp.game.ui.notifications.show("~r~Одежда уже экипирована, для начала снимите текущую");
            return;
        }
    }
    else if (itemId == 272) {
        if (user.getCache('watch') == -1) {
            user.set("watch", params.watch);
            user.set("watch_color", params.watch_color);
            user.updateCharacterCloth();
        }
        else {
            mp.game.ui.notifications.show("~r~Одежда уже экипирована, для начала снимите текущую");
            return;
        }
    }
    else if (itemId == 273) {
        if (user.getCache('bracelet') == -1) {
            user.set("bracelet", params.bracelet);
            user.set("bracelet_color", params.bracelet_color);
            user.updateCharacterCloth();
        }
        else {
            mp.game.ui.notifications.show("~r~Одежда уже экипирована, для начала снимите текущую");
            return;
        }
    }
    else if (itemId == 274) {
        if (user.getCache('mask') == -1) {
            user.set("mask", params.bracelet);
            user.set("mask_color", params.bracelet_color);
            user.updateCharacterCloth();
        }
        else {
            mp.game.ui.notifications.show("~r~Одежда уже экипирована, для начала снимите текущую");
            return;
        }
    }
    else {
        return;
    }

    inventory.updateEquipStatus(id, true);
});

mp.events.add('client:phone:showMenu', function(data) {
    try {
        methods.debug(data);
        phone.showMenu(JSON.parse(data));
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:phone:inputModal', function(state) {
    mp.gui.chat.show(!state);
    mp.gui.chat.activate(!state);
    mp.gui.cursor.show(state, true);
});

mp.events.add('client:phone:status', function(status) {
    if (status)
        phone.show();
    else
        phone.hide();
});

mp.events.add('client:phone:rotate', function(status) {
    mp.gui.chat.show(status);
    mp.gui.chat.activate(status);
    mp.gui.cursor.show(!status, true);
    if (status)
        user.rotatePhoneV();
    else
        user.rotatePhoneH();
});

mp.events.add('client:phone:apps', function(action) {
    phone.apps(action);
});

mp.events.add('client:phone:callBack', function(action, menu, id, ...args) {
    phone.callBack(action, menu, id, ...args);
});

mp.events.add("client:vehicle:checker", function (vehicle, seat) {

    try {
        let vehicle = mp.players.local.vehicle;
        if (vehicle) {
            let boost = 0;
            if (vehicle.getMod(18) == 1)
                boost = 5;

            let vehInfo = methods.getVehicleInfo(vehicle.model);
            if (vehInfo.class_name == 'Emergency')
                boost = boost + 10;

            boost = boost + vehicles.getSpeedBoost(vehicle.model);

            maxSpeed = vehicles.getSpeedMax(vehicle.model);
            if (maxSpeed == 1)
                maxSpeed = 350;

            if (vehicle.getVariable('boost') > 0)
                vehicle.setEnginePowerMultiplier(vehicle.getVariable('boost') + boost);
            else if (boost > 1)
                vehicle.setEnginePowerMultiplier(boost);
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add('client:events:dialog:onClose', function () {
    mp.gui.cursor.show(false, false);
});

mp.events.add('client:events:dialog:click', function () {
    mp.gui.cursor.show(false, false);
});

let loadIndicatorDist = 15;
let showIds = true;

mp.events.add('client:showId', () => {
    showIds = !showIds;
    if (showIds)
        mp.game.ui.notifications.show("Вы ~g~включили~s~ ID игроков");
    else
        mp.game.ui.notifications.show("Вы ~r~отключили~s~ ID игроков");
});

mp.events.add('render', () => {
    if (user.isLogin() && showIds) {
        let localPlayer = mp.players.local;
        let __localPlayerPosition__ = mp.players.local.position;

        methods.getStreamPlayerList().forEach((player, i) => {
            if (/*player === localPlayer || */!mp.players.exists(player) || i > 50) {
                return false;
            }

            try {
                const loadIndicatorDistTemp = (i > 25) ? 5 : loadIndicatorDist;
                const __playerPosition__ = player.position;
                const distance = methods.distanceToPos(__localPlayerPosition__, __playerPosition__);

                if (distance <= loadIndicatorDistTemp && player.dimension == localPlayer.dimension) {
                    const isConnected = voice.getVoiceInfo(player, 'stateConnection') === 'connected';
                    const isEnable = voice.getVoiceInfo(player, 'enabled');
                    let indicatorColor = '~r~•';
                    if (isConnected && !isEnable)
                        indicatorColor = '~m~•';
                    else if (isConnected && isEnable)
                        indicatorColor = '~w~•';
                    const headPosition = player.getBoneCoords(12844, 0, 0, 0);

                    let typingLabel = '';
                    let pref = '';
                    if (player.getVariable('enableAdmin'))
                        pref = '~r~';
                    if (player.getVariable('isTyping'))
                        typingLabel += '\n~b~Печатает...';
                    if (player.getVariable('isAfk'))
                        typingLabel += '\n~r~AFK...';

                    let name = '';
                    if (user.hasDating(player.getVariable('id')))
                        name = user.getDating(player.getVariable('id')) + ' | ';
                    //if(!player.getVariable('hiddenId'))

                    const entity = player.vehicle ? player.vehicle : player;
                    const vector = entity.getVelocity();
                    const frameTime = methods.parseFloatHex(mp.game.invoke('0x15C40837039FFAF7').toString(16));
                    ui.drawText3D( pref + name + player.id + ' ' +  indicatorColor + typingLabel, headPosition.x + vector.x * frameTime, headPosition.y + vector.y * frameTime, headPosition.z + vector.z * frameTime + 0.1);
                }
            }
            catch (e) {
                
            }
        });
    }
});


//KEYS
mp.keys.bind(0xDB, true, function() {
    if (!user.isLogin())
        return;
    if (!methods.isBlockKeys() && mp.players.local.vehicle) {
        let actualData = mp.players.local.vehicle.getVariable('vehicleSyncData');
        vehicles.setIndicatorLeftState(!actualData.IndicatorLeftToggle);
        vehicles.setIndicatorRightState(false);
    }
});

mp.keys.bind(0xDD, true, function() {
    if (!user.isLogin())
        return;
    if (!methods.isBlockKeys() && mp.players.local.vehicle) {
        let actualData = mp.players.local.vehicle.getVariable('vehicleSyncData');
        vehicles.setIndicatorRightState(!actualData.IndicatorRightToggle);
        vehicles.setIndicatorLeftState(false);
    }
});

mp.keys.bind(0x38, true, function() {
    //if (!user.isLogin() || !user.isAdmin())
    //    return;
    if (!methods.isBlockKeys())
        menuList.showAdminMenu();
});

mp.keys.bind(0x12, true, function() {
    if (!user.isLogin())
        return;
    if (!methods.isBlockKeys())
        mp.events.callRemote('onKeyPress:LAlt');
});

//E
mp.keys.bind(0x45, true, function() {
    try {
        if (!user.isLogin())
            return;
        if (!methods.isBlockKeys()) {

            let targetEntity = user.getTargetEntityValidate();
            if (targetEntity) {
                inventory.openInventoryByEntity(targetEntity);
            }
            else {
                mp.events.callRemote('onKeyPress:E');
                methods.pressEToPayRespect();
            }
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

//M
mp.keys.bind(0x4D, true, function() {
    if (!user.isLogin())
        return;
    if (!methods.isBlockKeys())
        menuList.showMainMenu();
});

//ESC
mp.keys.bind(0x1B, true, function() {
    if (!user.isLogin())
        return;
    ui.callCef('license', JSON.stringify({type: 'hide'}));
    ui.callCef('certificate', JSON.stringify({type: 'hide'}));
    ui.callCef('dialog', JSON.stringify({type: 'hide'}));
    phone.hide();
    inventory.hide();
});

//BACKSPACE
mp.keys.bind(0x08, true, function() {
    if (!user.isLogin())
        return;
    ui.callCef('license', JSON.stringify({type: 'hide'}));
    ui.callCef('certificate', JSON.stringify({type: 'hide'}));
    ui.callCef('dialog', JSON.stringify({type: 'hide'}));
});

mp.events.add("playerDeath", function (player, reason, killer) {
    UIMenu.Menu.HideMenu();
    inventory.hide();
    phone.hide();

    ui.callCef('license', JSON.stringify({type: 'hide'}));
    ui.callCef('certificate', JSON.stringify({type: 'hide'}));

    mp.game.gameplay.disableAutomaticRespawn(true);
    mp.game.gameplay.ignoreNextRestart(true);
    mp.game.gameplay.setFadeInAfterDeathArrest(true);
    mp.game.gameplay.setFadeOutAfterDeath(false);

    user.stopAllScreenEffect();

    mp.players.local.freezePosition(false);
    mp.players.local.setCollision(true, true);

    Container.Data.ResetLocally(0, 'hasSeat');
    Container.Data.ResetLocally(0, "canRun");

    timer.setDeathTimer(30);
    if (player.getVariable('enableAdmin'))
        timer.setDeathTimer(10);
});

// Commands in 2020......
mp.events.add("playerCommand", async (command) => {
    if (command.toLowerCase().slice(0, 3) === "tph") {
        if (!user.isLogin() || !user.isAdmin())
            return;
        let args = command.toLowerCase().split(' ');
        mp.events.callRemote('server:houses:teleport', args[1]);
    }
    else if (command.toLowerCase().slice(0, 2) === "tp") {
        let args = command.toLowerCase().split(' ');
        user.teleport(parseFloat(args[1]), parseFloat(args[2]), parseFloat(args[3]));
    }
    else if (command.toLowerCase().slice(0, 1) === "a") {
        if (!user.isLogin() || !user.isAdmin())
            return;
        let args = command.toLowerCase().split(' ');
        user.playAnimation(args[1], args[2], args[3]);
    }
    else if (command.toLowerCase().slice(0, 1) === "s") {
        if (!user.isLogin() || !user.isAdmin())
            return;
        let args = command.toLowerCase().split(' ');
        user.playScenario(args[1]);
    }
    else if (command.toLowerCase().slice(0, 1) === "p") {
        if (!user.isLogin() || !user.isAdmin())
            return;
        try {
            let args = command.toLowerCase().split(' ');
            mp.game.streaming.requestNamedPtfxAsset(args[1]);
            while (!mp.game.streaming.hasNamedPtfxAssetLoaded(args[1]))
                await methods.sleep(10);

            mp.game.graphics.setPtfxAssetNextCall(args[1]);

            let posOffset = mp.players.local.getOffsetFromInWorldCoords(0.0, 2.0, 0.5);
            mp.game.graphics.startParticleFxLoopedAtCoord(args[2], posOffset.x, posOffset.y, posOffset.z, 1.0, 1.0, 1.0, 1.0, false, false, false, false);

            mp.gui.chat.push(`Ptx Activate: ${args[1]} | ${args[2]} | ${mp.game.streaming.hasNamedPtfxAssetLoaded(args[1])}`);
        }
        catch (e) {
            methods.debug(e);
        }
    }
    else if (command.toLowerCase().slice(0, 1) === "m") {
        menuList.showAdminMenu();
    }
    else if (command.toLowerCase().slice(0, 2) === "h ") {
        let args = command.split(' ');
        if (args.length != 4) {
            mp.gui.chat.push(`Не верно введено кол-во параметров `);
            mp.gui.chat.push(`/h [ID Интерьера] [№ Дома] [Цена] `);
            return;
        }
        mp.events.callRemote('server:houses:insert', args[1], args[2], args[3], ui.getCurrentZone(), ui.getCurrentStreet())
    }
    else if (command.toLowerCase().slice(0, 2) === "s ") {
        let args = command.split(' ');
        if (args.length != 4) {
            mp.gui.chat.push(`Не верно введено кол-во параметров `);
            mp.gui.chat.push(`/s [ID Интерьера] [№ Дома] [Цена] `);
            return;
        }
        mp.events.callRemote('server:stocks:insert', args[1], args[2], args[3], ui.getCurrentZone(), ui.getCurrentStreet())
    }
    else if (command.toLowerCase().slice(0, 3) === "sc ") {
        let args = command.split(' ');
        if (args.length != 2) {
            mp.gui.chat.push(`Не верно введено кол-во параметров `);
            mp.gui.chat.push(`/sc [ID]`);
            return;
        }
        mp.events.callRemote('server:stocks:insert2', args[1])
    }
    else if (command.toLowerCase().slice(0, 4) === "hc1 ") {
        let args = command.split(' ');
        if (args.length != 3) {
            mp.gui.chat.push(`Не верно введено кол-во параметров `);
            mp.gui.chat.push(`/hc1 [ID] [INT]`);
            return;
        }
        mp.events.callRemote('server:houses:insert1', args[1], args[2])
    }
    else if (command.toLowerCase().slice(0, 4) === "hc2 ") {
        let args = command.split(' ');
        if (args.length != 3) {
            mp.gui.chat.push(`Не верно введено кол-во параметров `);
            mp.gui.chat.push(`/hc2 [ID] [INT]`);
            return;
        }
        mp.events.callRemote('server:houses:insert2', args[1], args[2])
    }
    else if (command.toLowerCase().slice(0, 4) === "hc3 ") {
        let args = command.split(' ');
        if (args.length != 3) {
            mp.gui.chat.push(`Не верно введено кол-во параметров `);
            mp.gui.chat.push(`/hc3 [ID] [INT]`);
            return;
        }
        mp.events.callRemote('server:houses:insert3', args[1], args[2])
    }
    else if (command.toLowerCase().slice(0, 2) === "c ") {
        let args = command.split(' ');
        if (args.length != 5) {
            mp.gui.chat.push(`Не верно введено кол-во параметров `);
            mp.gui.chat.push(`/c [ID Дома] [№ Кв] [Цена] [ID Интерьера]`);
            return;
        }
        mp.events.callRemote('server:condo:insert', args[1], args[2], args[3], args[4], ui.getCurrentZone(), ui.getCurrentStreet())
    }
    else if (command.toLowerCase().slice(0, 3) === "cb ") {
        let args = command.split(' ');
        if (args.length != 2) {
            mp.gui.chat.push(`Не верно введено кол-во параметров `);
            mp.gui.chat.push(`/cb [№ Дома]`);
            return;
        }
        mp.events.callRemote('server:condo:insertBig', args[1], ui.getCurrentZone(), ui.getCurrentStreet())
    }
    else if (command.toLowerCase().slice(0, 4) === "get ") {
        let args = command.split(' ');
        if (args.length != 2) {
            mp.gui.chat.push(`Не верно введено кол-во параметров `);
            mp.gui.chat.push(`/get [name]`);
            return;
        }
        methods.debug(user.getCache(args[1]));
    }
    else if (command.toLowerCase().slice(0, 3) === "gwa") {
        weapons.getMapList().forEach(item => {
            user.giveWeaponByHash(item[1] / 2, 1000);
        });
    }
    else if (command.toLowerCase().slice(0, 3) === "qwe") {
        /*let player = mp.players.local; //TODO Спавн объектов оружия и обвесов на них
        let pos = player.position;
        let object = mp.game.weapon.createWeaponObject(-86904375, 1000, pos.x + 2, pos.y + 2, pos.z, true, player.heading, 0);
        mp.game.weapon.giveWeaponObjectToPed(object, mp.players.local.handle);*/
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


/*
*
* RENDER
*
* */


mp.events.add('render', () => { mp.game.controls.disableControlAction(0,68,true); });

mp.events.add('render', () => {
    try {
        mp.game.controls.disableControlAction(0,68,true); //ATTACK VEHICLE
        mp.game.controls.disableControlAction(0,350,true); //E JUMP

        mp.game.controls.disableControlAction(0,243,true);

        mp.game.controls.disableControlAction(0,44,true); //Q укрытие

        mp.game.controls.disableControlAction(0,53,true); //Фонарик на оружие
        mp.game.controls.disableControlAction(0,54,true);

        //TODO DELUXO FIX
        mp.game.controls.disableControlAction(0,357,true);

        if(_playerDisableAllControls) {
            mp.game.controls.disableAllControlActions(0);
            mp.game.controls.disableAllControlActions(1);
            mp.game.controls.disableAllControlActions(2);
            mp.game.controls.enableControlAction(2, 172, true);
            mp.game.controls.enableControlAction(2, 173, true);
            mp.game.controls.enableControlAction(2, 174, true);
            mp.game.controls.enableControlAction(2, 175, true);
            mp.game.controls.enableControlAction(2, 201, true);
            mp.game.controls.enableControlAction(2, 177, true);
        }
        if(_playerDisableDefaultControls) {
            mp.game.controls.disableControlAction(0,21,true); // disable sprint
            mp.game.controls.disableControlAction(0,24,true); // disable attack
            mp.game.controls.disableControlAction(0,25,true); // disable aim
            //--mp.game.controls.disableControlAction(0,47,true); // disable weapon
            mp.game.controls.disableControlAction(0,58,true); // disable weapon
            mp.game.controls.disableControlAction(0,263,true); // disable melee
            mp.game.controls.disableControlAction(0,264,true); // disable melee
            mp.game.controls.disableControlAction(0,257,true); // disable melee
            mp.game.controls.disableControlAction(0,140,true); // disable melee
            mp.game.controls.disableControlAction(0,141,true); // disable melee
            mp.game.controls.disableControlAction(0,142,true); // disable melee
            mp.game.controls.disableControlAction(0,143,true); // disable melee
            mp.game.controls.disableControlAction(0,75,true); // disable exit vehicle
            mp.game.controls.disableControlAction(27,75,true); // disable exit vehicle
            mp.game.controls.disableControlAction(0,23,true); // disable enter vehicle
            mp.game.controls.disableControlAction(27,23,true); // disable enter vehicle
            mp.game.controls.disableControlAction(0,22,true); // disable jump
            mp.game.controls.disableControlAction(0,32,true); // disable move up
            mp.game.controls.disableControlAction(0,268,true);
            mp.game.controls.disableControlAction(0,33,true); // disable move down
            mp.game.controls.disableControlAction(0,269,true);
            mp.game.controls.disableControlAction(0,34,true); // disable move left
            mp.game.controls.disableControlAction(0,270,true);
            mp.game.controls.disableControlAction(0,35,true); // disable move right
            mp.game.controls.disableControlAction(0,271,true)
        }
        if(ui.DisableMouseControl /*|| ui.isShowMenu()*/) {
            mp.game.controls.disableControlAction(0,12,true); // disable sprint
            mp.game.controls.disableControlAction(0,13,true); // disable sprint
            mp.game.controls.disableControlAction(0,14,true); // disable sprint
            mp.game.controls.disableControlAction(0,15,true); // disable sprint
            mp.game.controls.disableControlAction(0,17,true); // disable sprint
            mp.game.controls.disableControlAction(0,18,true); // disable sprint
            mp.game.controls.disableControlAction(0,24,true); // disable sprint
            mp.game.controls.disableControlAction(0,25,true); // disable sprint

            mp.game.controls.disableControlAction(0,24,true); // Attack
            mp.game.controls.disableControlAction(0,69,true); // Attack
            mp.game.controls.disableControlAction(0,70,true); // Attack
            mp.game.controls.disableControlAction(0,68,true); // Attack
            mp.game.controls.disableControlAction(0,106,true); // Attack
            mp.game.controls.disableControlAction(0,114,true); // Attack
            mp.game.controls.disableControlAction(0,122,true); // Attack
            mp.game.controls.disableControlAction(0,135,true); // Attack
            mp.game.controls.disableControlAction(0,142,true); // Attack
            mp.game.controls.disableControlAction(0,144,true); // Attack
            mp.game.controls.disableControlAction(0,222,true); // Attack
            mp.game.controls.disableControlAction(0,223,true); // Attack
            mp.game.controls.disableControlAction(0,225,true); // Attack
            mp.game.controls.disableControlAction(0,229,true); // Attack
            mp.game.controls.disableControlAction(0,257,true); // Attack
            mp.game.controls.disableControlAction(0,329,true); // Attack
            mp.game.controls.disableControlAction(0,330,true); // Attack
            mp.game.controls.disableControlAction(0,331,true); // Attack
            mp.game.controls.disableControlAction(0,346,true); // Attack
            mp.game.controls.disableControlAction(0,347,true); // Attack

            //Disable Cam
            mp.game.controls.disableControlAction(0, 1, true);
            mp.game.controls.disableControlAction(0, 2, true);
            mp.game.controls.disableControlAction(0, 3, true);
            mp.game.controls.disableControlAction(0, 4, true);
            mp.game.controls.disableControlAction(0, 5, true);
            mp.game.controls.disableControlAction(0, 6, true);
        }

        //Колесо оружия
        mp.game.controls.disableControlAction(0, 12, true);
        mp.game.controls.disableControlAction(0, 14, true);
        mp.game.controls.disableControlAction(0, 15, true);
        mp.game.controls.disableControlAction(0, 16, true);
        mp.game.controls.disableControlAction(0, 17, true);
        mp.game.controls.disableControlAction(0, 37, true);
        mp.game.controls.disableControlAction(0, 53, true);
        mp.game.controls.disableControlAction(0, 54, true);
        mp.game.controls.disableControlAction(0, 56, true);
        mp.game.controls.disableControlAction(0, 99, true);
        mp.game.controls.disableControlAction(0, 115, true); //FLY WEAP
        mp.game.controls.disableControlAction(0, 116, true); //FLY WEAP
        mp.game.controls.disableControlAction(0, 157, true);
        mp.game.controls.disableControlAction(0, 158, true);
        mp.game.controls.disableControlAction(0, 159, true);
        mp.game.controls.disableControlAction(0, 160, true);
        mp.game.controls.disableControlAction(0, 161, true);
        mp.game.controls.disableControlAction(0, 162, true);
        mp.game.controls.disableControlAction(0, 163, true);
        mp.game.controls.disableControlAction(0, 164, true);
        mp.game.controls.disableControlAction(0, 165, true);
        mp.game.controls.disableControlAction(0, 261, true);
        mp.game.controls.disableControlAction(0, 262, true);
        mp.game.controls.disableControlAction(0, 99, true);
        mp.game.controls.disableControlAction(0, 100, true);

        if (!user.isLogin() && !mp.gui.cursor.visible)
            mp.gui.cursor.show(true, true);
    }
    catch (e) {
        
    }
});

mp.events.add('render', () => {
    try {
        let veh = mp.players.local.vehicle;
        if (veh && veh.getClass() != 8) {
            if (veh.getPedInSeat(-1) == mp.players.local.handle) {
                if (user.getCache('stats_shooting') < 99/* && !user.isPolice()*/) { //TODO
                    mp.game.controls.disableControlAction(2, 24, true);
                    mp.game.controls.disableControlAction(2, 25, true);
                    mp.game.controls.disableControlAction(2, 66, true);
                    mp.game.controls.disableControlAction(2, 67, true);
                    mp.game.controls.disableControlAction(2, 69, true);
                    mp.game.controls.disableControlAction(2, 70, true);
                    mp.game.controls.disableControlAction(2, 140, true);
                    mp.game.controls.disableControlAction(2, 141, true);
                    mp.game.controls.disableControlAction(2, 143, true);
                    mp.game.controls.disableControlAction(2, 263, true);
                }
            }
        }
    }
    catch (e) {
        
    }
});

mp.events.add('render', () => {
    try {
        let veh = mp.players.local.vehicle;
        if (veh && veh.getClass() == 8 && methods.getCurrentSpeed() > 50) {
            mp.game.controls.disableControlAction(2, 24, true);
            mp.game.controls.disableControlAction(2, 25, true);
            mp.game.controls.disableControlAction(2, 66, true);
            mp.game.controls.disableControlAction(2, 67, true);
            mp.game.controls.disableControlAction(2, 69, true);
            mp.game.controls.disableControlAction(2, 70, true);
            mp.game.controls.disableControlAction(2, 140, true);
            mp.game.controls.disableControlAction(2, 141, true);
            mp.game.controls.disableControlAction(2, 143, true);
            mp.game.controls.disableControlAction(2, 263, true);
        }
    }
    catch (e) {
        
    }
});

mp.events.add('render', () => {
    /*if (user.getCache('med_time') > 0) {
        mp.game.controls.disableControlAction(2, 24, true);
        mp.game.controls.disableControlAction(2, 25, true);
        mp.game.controls.disableControlAction(2, 66, true);
        mp.game.controls.disableControlAction(2, 67, true);
        mp.game.controls.disableControlAction(2, 69, true);
        mp.game.controls.disableControlAction(2, 70, true);
        mp.game.controls.disableControlAction(2, 140, true);
        mp.game.controls.disableControlAction(2, 141, true);
        mp.game.controls.disableControlAction(2, 143, true);
        mp.game.controls.disableControlAction(2, 263, true);
    }*/
});

//TODO Переделать отдачу стрельбы, для начала переделав IS SHOOOTING, чтобы он после того как закончил стрелять , еще 1 секунду ждал, вдруг игрок снова начнет стрелять
let isShootingActive = false;
mp.events.add('render', async () => {

    try {
        if (mp.players.local.isShooting() && !isShootingActive) {

            isShootingActive = true;
            //mp.game.cam.shakeGameplayCam("ROAD_VIBRATION_SHAKE", 1.2);

            //TODO
            if (user.getCache('stats_shooting') < 20)
                mp.game.cam.shakeGameplayCam("ROAD_VIBRATION_SHAKE", 1.2);
            else if (user.getCache('stats_shooting') < 40)
                mp.game.cam.shakeGameplayCam("ROAD_VIBRATION_SHAKE", 0.8);
            else if (user.getCache('stats_shooting') < 70)
                mp.game.cam.shakeGameplayCam("ROAD_VIBRATION_SHAKE", 0.5);
            else
                mp.game.cam.shakeGameplayCam("ROAD_VIBRATION_SHAKE", 0.2);

        }
        else if (isShootingActive) {
            await methods.sleep(4000);
            if (!mp.players.local.isShooting()) {
                isShootingActive = false;
                mp.game.cam.stopGameplayCamShaking(false);
            }
        }
    }
    catch (e) {

    }
});

mp.events.add('render', () => {
    try {
        let veh = mp.players.local.vehicle;
        if (veh && veh.getClass() != 8) {
            if (veh.getPedInSeat(-1) == mp.players.local.handle) {
                if (user.getCache('stats_shooting') < 99 && !user.isPolice()) {
                    mp.game.controls.disableControlAction(2, 24, true);
                    mp.game.controls.disableControlAction(2, 25, true);
                    mp.game.controls.disableControlAction(2, 66, true);
                    mp.game.controls.disableControlAction(2, 67, true);
                    mp.game.controls.disableControlAction(2, 69, true);
                    mp.game.controls.disableControlAction(2, 70, true);
                    mp.game.controls.disableControlAction(2, 140, true);
                    mp.game.controls.disableControlAction(2, 141, true);
                    mp.game.controls.disableControlAction(2, 143, true);
                    mp.game.controls.disableControlAction(2, 263, true);
                }
            }
        }
    }
    catch (e) {
        
    }
});

mp.events.add('render', () => {
    if (user.isLogin() && user.getCache('stats_shooting') < 70)
        mp.game.ui.hideHudComponentThisFrame(14);
});

/*mp.events.add('render', () => { //Включить свет в больке старой
    let plPos = mp.players.local.position;
    if (mp.game.interior.getInteriorAtCoords(plPos.x, plPos.y, plPos.z) != 0)
    {
        mp.game.graphics.drawLightWithRange(291.9079, -1348.883, 27.03455, 255, 255, 255, 20.0, 0.5);
        mp.game.graphics.drawLightWithRange(279.4622, -1337.024, 27.03455, 255, 255, 255, 20.0, 0.5);
        mp.game.graphics.drawLightWithRange(272.779, -1341.37, 27.03455, 255, 255, 255, 20.0, 0.5);
        mp.game.graphics.drawLightWithRange(264.4822, -1360.97, 27.03455, 255, 255, 255, 20.0, 0.5);
        mp.game.graphics.drawLightWithRange(253.408, -1364.389, 27.03455, 255, 255, 255, 20.0, 0.5);
        mp.game.graphics.drawLightWithRange(254.8074, -1349.439, 27.03455, 255, 255, 255, 20.0, 0.5);
        mp.game.graphics.drawLightWithRange(240.4855, -1368.784, 32.28351, 255, 255, 255, 20.0, 0.5);
        mp.game.graphics.drawLightWithRange(247.7051, -1366.653, 32.34088, 255, 255, 255, 20.0, 0.5);
        mp.game.graphics.drawLightWithRange(257.9836, -1358.863, 41.80476, 255, 255, 255, 20.0, 0.5);
        mp.game.graphics.drawLightWithRange(255.0098, -1383.685, 42.01367, 255, 255, 255, 20.0, 0.5);
        mp.game.graphics.drawLightWithRange(230.9255, -1367.348, 42.03852, 255, 255, 255, 20.0, 0.5);
        mp.game.graphics.drawLightWithRange(243.6069, -1366.777, 26.78872, 255, 255, 255, 20.0, 0.5);
    }
});*/

mp.events.add('render', () => {
    try {
        mp.game.ui.hideHudComponentThisFrame(1); // Wanted Stars
        mp.game.ui.hideHudComponentThisFrame(2); // Weapon Icon
        mp.game.ui.hideHudComponentThisFrame(3); // Cash
        mp.game.ui.hideHudComponentThisFrame(4); // MP Cash
        mp.game.ui.hideHudComponentThisFrame(6); // Vehicle Name
        mp.game.ui.hideHudComponentThisFrame(7); // Area Name
        mp.game.ui.hideHudComponentThisFrame(8);// Vehicle Class
        mp.game.ui.hideHudComponentThisFrame(9); // Street Name
        mp.game.ui.hideHudComponentThisFrame(13); // Cash Change
        mp.game.ui.hideHudComponentThisFrame(17); // Save Game
        mp.game.ui.hideHudComponentThisFrame(20); // Weapon Stats
    }
    catch (e) {

    }

    /*mp.game.controls.mp.game.controls.disableControlAction(0, 157, true);
    mp.game.controls.mp.game.controls.disableControlAction(0, 158, true);
    mp.game.controls.mp.game.controls.disableControlAction(0, 160, true);
    mp.game.controls.mp.game.controls.disableControlAction(0, 164, true);*/

    //TODO
    //if (user.isLogin() && user.getCache('mp0_shooting_ability') < 70)
    //    mp.game.ui.hideHudComponentThisFrame(14);
});

mp.events.add('render', () => {
    try {
        let vehicle = mp.players.local.vehicle;
        if (vehicle && mp.players.local.isInAnyVehicle(false)) {
            // And fix max speed
            vehicle.setMaxSpeed(maxSpeed / 3.6); // fix max speed
            if (vehicle.getVariable('boost') > 0) {
                vehicle.setEngineTorqueMultiplier(vehicle.getVariable('boost'));
            }
            else
                vehicle.setEngineTorqueMultiplier(1.3);
        }
    }
    catch (e) {

    }
});

mp.events.add('render', () => {
    try {
        if (mp.players.local.isBeingStunned(0))
            mp.players.local.setMinGroundTimeForStungun(30000);
    }
    catch (e) {
        
    }
});

mp.events.add('render', () => {
    try {
        mp.game.player.setHealthRechargeMultiplier(0.0);
    }
    catch (e) {
        
    }
});


// Task Follow
let taskFollowed = false;
let timerFollowedId = null;

mp.events.add('client:taskFollow', (nplayer) => {
    if (!mp.players.exists(nplayer))
        return;
    if (!taskFollowed) {

        try {
            if (user.isCuff() || user.isTie())
                user.playAnimation("mp_arresting", "idle", 49);

            mp.game.invoke(methods.TASK_GO_TO_ENTITY, mp.players.local.handle, nplayer.handle, -1, 10.0, 1073741824.0, 0);
            mp.game.invoke(methods.SET_PED_KEEP_TASK, mp.players.local.handle, true);

            mp.game.ui.notifications.show("~r~Человек повел вас за собой");
            mp.events.callRemote("server:user:targetNotify", nplayer, `~g~Вы повели человека за собой (ID: ${user.getCache('id')})`);

            taskFollowed = nplayer;
        }
        catch (e) {
            methods.debug(e);
        }

        timerFollowedId = setInterval(function() {
            try {
                if (mp.players.local.dimension != taskFollowed.dimension) {

                    user.stopAllAnimation();
                    mp.game.ui.notifications.show("~g~Вас отпустили");
                    mp.events.callRemote("server:user:targetNotify", nplayer, `~g~Вы отпустили человека (ID: ${user.getCache('id')})`);

                    taskFollowed = false;
                    clearInterval(timerFollowedId);
                    if (user.isCuff() || user.isTie())
                        user.playAnimation("mp_arresting", "idle", 49);
                }
                if (taskFollowed && methods.distanceToPos(mp.players.local.position, taskFollowed.position) > 50.0) {
                    user.teleportv(taskFollowed.position);
                    if (user.isCuff() || user.isTie())
                        user.playAnimation("mp_arresting", "idle", 49);
                }
                /*if (taskFollowed.getVehicleIsIn() && mp.players.local.vehicle !== taskFollowed.getVehicleIsIn()) {
                    console.log(taskFollowed.vehicle, taskFollowed.getVehicleIsIn(), taskFollowed.position);
                    mp.players.local.taskEnterVehicle(taskFollowed.getVehicleIsIn(), 0, 0, 1.0, 1, 0);
                }
                if (!taskFollowed.vehicle && mp.players.local.vehicle) {
                    mp.players.local.taskLeaveAnyVehicle(1, 1);
                }*/
                if (!mp.players.local.vehicle) {
                    mp.game.invoke(methods.TASK_GO_TO_ENTITY, mp.players.local.handle, taskFollowed.handle, -1, 10.0, 1073741824.0, 0);
                    mp.game.invoke(methods.SET_PED_KEEP_TASK, mp.players.local.handle, true);
                }
            }
            catch (e) {
                methods.debug(e);
            }
        }, 3000);
    } else {
        try {
            user.stopAllAnimation();
            mp.game.ui.notifications.show("~g~Вас отпустили");
            mp.events.callRemote("server:user:targetNotify", nplayer, `~g~Вы отпустили человека (ID: ${user.getCache('id')})`);
            taskFollowed = false;
            clearInterval(timerFollowedId);
            if (user.isCuff() || user.isTie())
                user.playAnimation("mp_arresting", "idle", 49);
        }
        catch (e) {
            methods.debug(e);
        }
    }
});