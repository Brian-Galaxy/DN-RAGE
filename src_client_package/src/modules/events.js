"use strict";

import methods from './methods';
import user from '../user';
import menuList from '../menuList';
import ui from "./ui";
import checkpoint from "../manager/checkpoint";
import weather from "../manager/weather";
import enums from "../enums";

mp.gui.chat.enabled = false;

mp.gui.execute("const _enableChatInput = enableChatInput;enableChatInput = (enable) => { mp.trigger('chatEnabled', enable); _enableChatInput(enable) };");

mp.events.add('chatEnabled', (isEnabled) => {
    mp.gui.chat.enabled = isEnabled;
    methods.disableAllControls(isEnabled);
});

let money = "0.00 $";
let moneyBank = "0.00 $";

let timerId = setTimeout(function updateMoney() {
    if(user.isLogin()) {
        //money = '$' + methods.numberFormat(parseInt(user.get('money')));
        //moneyBank = '$' + methods.numberFormat(parseInt(user.get('money_bank')));
        ui.updateZoneAndStreet();
        ui.updateDirectionText();
    }
    timerId = setTimeout(updateMoney, 200);
}, 200);

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

    user.set('SKIN_SEX', 0);
    user.setPlayerModel('mp_m_freemode_01');
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
        user.set('SKIN_EYEBROWS', faceLastEditor[2].index_help);
        user.set('SKIN_EYEBROWS_COLOR', faceLastEditor[3].index_help);
        user.set('SKIN_EYE_COLOR', faceLastEditor[4].index_help);
        user.set('SKIN_OVERLAY_9', faceLastEditor[5].index_help - 1);
        user.set('SKIN_OVERLAY_9_COLOR', faceLastEditor[6].index_help);

        user.set('SKIN_OVERLAY_1', faceLastEditor[7].index_help - 1);
        user.set('SKIN_OVERLAY_1_COLOR', faceLastEditor[8].index_help);

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
    user.set('stats_strength', strength);
    user.set('stats_endurance', endurance);
    user.set('stats_shooting', shooting);
    user.set('stats_flying', flying);
    user.set('stats_driving', driving);
    user.set('stats_psychics', psychics);
    user.set('stats_lucky', stealth);
    user.set('is_custom', true);

    user.save();
});

mp.events.add('client:events:custom:choiceRole', function(roleIndex) {

    user.showLoadDisplay();

    setTimeout(function () {
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
            ui.notify('Вы уже выбрали роль');

            let roleIdx = user.getCache('role') - 1;
            user.teleport(enums.spawnByRole[roleIdx][0], enums.spawnByRole[roleIdx][1], enums.spawnByRole[roleIdx][2], enums.spawnByRole[roleIdx][3]);
            return;
        }

        user.set('role', roleIndex + 1);
        user.set('is_custom', true);
        user.save();

        user.teleport(enums.spawnByRole[roleIndex][0], enums.spawnByRole[roleIndex][1], enums.spawnByRole[roleIndex][2], enums.spawnByRole[roleIndex][3]);
    }, 500);
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

    user.set('SKIN_SEX', 0);
    user.setPlayerModel('mp_m_freemode_01');
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

mp.events.add('client:updateCheckpointList', (data) => {
    methods.debug('Event: client:updateCheckpointList');
    checkpoint.updateCheckpointList(data);
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

mp.events.add('client:menuList:showShopClothMenu', (component, clothColor, ClothData) => {
    methods.debug('Event: client:menuList:showShopClothMenu');
    menuList.showShopClothMenu(component, clothColor, ClothData);
});

mp.events.add('client:menuList:showTattooShopMenu', (title1, title2, shopId) => {
    methods.debug('Event: client:menuList:showTattooShopMenu');
    menuList.showTattooShopMenu(title1, title2, shopId);
});

mp.events.add('client:menuList:showShopMaskMenu', (shopId) => {
    methods.debug('Event: client:menuList:showShopMaskMenu');
    //menuList.showShopMaskMenu(shopId);
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
    methods.debug('Event: client:user:nextWeather');
    weather.nextWeather(weatherName, delay);
});

mp.events.add('client:managers:weather:setCurrentWeather', (weatherName) => {
    methods.debug('Event: client:user:setCurrentWeather');
    weather.nextWeather(weatherName, 1);
});

mp.events.add('client:managers:weather:syncDateTime', (min, hour, day, month, year) => {
    //methods.debug('Event: client:user:syncDateTime', min, hour, day, month, year);
    weather.syncDateTime(min, hour, day, month, year);
});

mp.events.add('client:managers:weather:syncRealTime', (hour) => {
    //methods.debug('Event: client:user:syncRealTime', hour);
    weather.syncRealTime(hour);
});

mp.events.add('client:managers:weather:syncWeatherTemp', (temp) => {
    //methods.debug('Event: client:user:syncWeatherTemp', temp);
    weather.syncWeatherTemp(temp);
});

mp.events.add('client:managers:weather:syncRealFullDateTime', (dateTime) => {
    //methods.debug('Event: client:user:syncRealFullDateTime', dateTime);
    weather.syncRealFullDateTime(dateTime);
});

mp.events.add('client:menuList:showBusinessTeleportMenu', () => {
    methods.debug('Event: client:menuList:showBusinessTeleportMenu');
    menuList.showBusinessTeleportMenu();
});

mp.events.add('client:showBusinessTypeListMenu', (data1, data2, data3) => {
    methods.debug('Event: client:showBusinessTypeListMenu');
    menuList.showBusinessTypeListMenu(data1, data2, data3);
});

mp.events.add('client:showBusinessLogMenu', (data) => {
    methods.debug('Event: client:showBusinessLogMenu');
    menuList.showBusinessLogMenu(data);
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

mp.events.add('client:events:debug', function(val) {
    methods.debug(val);
    //ui.callCef('ChangePlayer','{"type": "show"}');
});

//KEYS

// ~ Key Code
mp.keys.bind(0xC0, true, function() {
    menuList.showAuthMenu();
});

mp.keys.bind(0x38, true, function() {
    //if (!user.isLogin() || !user.isAdmin())
    //    return;
    if (!methods.isBlockKeys())
        menuList.showAdminMenu();
});

//E
mp.keys.bind(0x45, true, function() {
    try {
        if (!user.isLogin())
            return;
        if (!methods.isBlockKeys()) {
            //methods.pressEToPayRespect();
            mp.events.callRemote('onKeyPress:E');
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

// Commands in 2020......
mp.events.add("playerCommand", async (command) => {
    if (command.toLowerCase().slice(0, 2) === "tp") {

        let args = command.toLowerCase().split(' ');
        user.teleport(parseFloat(args[1]), parseFloat(args[2]), parseFloat(args[3]));
    }
    else if (command.toLowerCase().slice(0, 1) === "a") {
        if (!user.isLogin() || !user.isAdmin())
            return;
        let args = command.toLowerCase().split(' ');
        user.playAnimation(args[1], args[2], args[2]);
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


mp.events.add('render', () => {
    mp.game.controls.disableControlAction(0,243,true);

    //TODO DELUXO FIX
    mp.game.controls.disableControlAction(0,357,true);

    /*if(_playerDisableAllControls || phone.ingameBrowser || characterCreator) {
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
        mp.game.controls.disableControlAction(0,21,true) // disable sprint
        mp.game.controls.disableControlAction(0,24,true) // disable attack
        mp.game.controls.disableControlAction(0,25,true) // disable aim
        //--mp.game.controls.disableControlAction(0,47,true) // disable weapon
        mp.game.controls.disableControlAction(0,58,true) // disable weapon
        mp.game.controls.disableControlAction(0,263,true) // disable melee
        mp.game.controls.disableControlAction(0,264,true) // disable melee
        mp.game.controls.disableControlAction(0,257,true) // disable melee
        mp.game.controls.disableControlAction(0,140,true) // disable melee
        mp.game.controls.disableControlAction(0,141,true) // disable melee
        mp.game.controls.disableControlAction(0,142,true) // disable melee
        mp.game.controls.disableControlAction(0,143,true) // disable melee
        mp.game.controls.disableControlAction(0,75,true) // disable exit vehicle
        mp.game.controls.disableControlAction(27,75,true) // disable exit vehicle
        mp.game.controls.disableControlAction(0,23,true) // disable enter vehicle
        mp.game.controls.disableControlAction(27,23,true) // disable enter vehicle
        mp.game.controls.disableControlAction(0,22,true) // disable jump
        mp.game.controls.disableControlAction(0,32,true) // disable move up
        mp.game.controls.disableControlAction(0,268,true)
        mp.game.controls.disableControlAction(0,33,true) // disable move down
        mp.game.controls.disableControlAction(0,269,true)
        mp.game.controls.disableControlAction(0,34,true) // disable move left
        mp.game.controls.disableControlAction(0,270,true)
        mp.game.controls.disableControlAction(0,35,true) // disable move right
        mp.game.controls.disableControlAction(0,271,true)
    }
    if(ui.DisableMouseControl || ui.isShowMenu()) {
        mp.game.controls.disableControlAction(0,12,true); // disable sprint
        mp.game.controls.disableControlAction(0,13,true); // disable sprint
        mp.game.controls.disableControlAction(0,14,true); // disable sprint
        mp.game.controls.disableControlAction(0,15,true); // disable sprint
        mp.game.controls.disableControlAction(0,17,true); // disable sprint
        mp.game.controls.disableControlAction(0,18,true); // disable sprint
        mp.game.controls.disableControlAction(0,24,true); // disable sprint
        mp.game.controls.disableControlAction(0,25,true); // disable sprint

        //Disable Cam
        mp.game.controls.disableControlAction(0, 1, true);
        mp.game.controls.disableControlAction(0, 2, true);
        mp.game.controls.disableControlAction(0, 3, true);
        mp.game.controls.disableControlAction(0, 4, true);
        mp.game.controls.disableControlAction(0, 5, true);
        mp.game.controls.disableControlAction(0, 6, true);
    }
    if ((characterCreator || authBrowser) && !mp.gui.cursor.visible)
        mp.gui.cursor.show(true, true);*/
});

mp.events.add('render', () => {
    let veh = mp.players.local.vehicle;
    if (veh && veh.getClass() != 8) {
        if (veh.getPedInSeat(-1) == mp.players.local.handle) {
            if (user.get('stats_shooting') < 99 && !user.isPolice()) {
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
});

mp.events.add('render', () => {
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
});

mp.events.add('render', () => {
    /*if (user.get('med_time') > 0) {
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

mp.events.add('render', () => {
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
});

mp.events.add('render', () => {
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

    /*mp.game.controls.mp.game.controls.disableControlAction(0, 157, true);
    mp.game.controls.mp.game.controls.disableControlAction(0, 158, true);
    mp.game.controls.mp.game.controls.disableControlAction(0, 160, true);
    mp.game.controls.mp.game.controls.disableControlAction(0, 164, true);*/

    //TODO
    //if (user.isLogin() && user.get('mp0_shooting_ability') < 70)
    //    mp.game.ui.hideHudComponentThisFrame(14);
});

let maxSpeed = 500;
mp.events.add('render', () => {
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
});

mp.events.add('render', () => {
    if (mp.players.local.isBeingStunned(0))
        mp.players.local.setMinGroundTimeForStungun(30000);
});

mp.events.add('render', () => {
    mp.game.player.setHealthRechargeMultiplier(0.0);
});