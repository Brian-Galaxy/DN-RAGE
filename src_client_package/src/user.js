"use strict";

import Container from './modules/data';
import methods from './modules/methods';
import ui from "./modules/ui";
import weapons from "./weapons";
import enums from "./enums";
import inventory from "./inventory";
import items from "./items";

let user = {};

let _isLogin = false;

let userData = new Map();

user.godmode = false;
user.isTeleport = false;
user.currentId = 0;
user.targetEntity = undefined;

let currentCamDist = 0.2;
let currentCamRot = -2;
let targetEntityPrev = undefined;

let cam = null;

/*
0 - Third Person Close
1 - Third Person Mid
2 - Third Person Far
4 - First Person
* */

mp.events.add('render', () => {
    try {
        if (!user.isLogin())
            return;
        if (user.getTargetEntityValidate())
            ui.drawText(`•`, 0.5, 0.5, 0.3, 255, 255, 255, 180, 0, 1, false, true);
    }
    catch (e) {

    }
});

user.timer50ms = function() {
    try {
        switch (mp.game.invoke(methods.GET_FOLLOW_PED_CAM_VIEW_MODE)) {
            case 4:
                user.targetEntity = user.pointingAt(2);
                if (user.getTargetEntityValidate() === undefined)
                    user.targetEntity = user.pointingAtRadius(2);
                break;
            case 1:
                user.targetEntity = user.pointingAt(6.8);
                if (user.getTargetEntityValidate() === undefined)
                    user.targetEntity = user.pointingAtRadius(6.8);
                break;
            case 2:
                user.targetEntity = user.pointingAt(9);
                if (user.getTargetEntityValidate() === undefined)
                    user.targetEntity = user.pointingAtRadius(9);
                break;
            default:
                user.targetEntity = user.pointingAt(5);
                if (user.getTargetEntityValidate() === undefined)
                    user.targetEntity = user.pointingAtRadius(5);
                break;
        }

        let target = user.getTargetEntityValidate();
        if (target && target != targetEntityPrev) {
            mp.game.ui.notifications.show('Нажмите ~g~E~s~ для взаимодействия');
        }

        targetEntityPrev = target;
    }
    catch (e) {

    }

    setTimeout(user.timer50ms, 100);
};

user.timer1sec = function() {

    try {
        for (let n = 54; n < 138; n++)
        {
            weapons.getMapList().forEach(item => {
                if (item[0] !== items.getItemNameHashById(n)) return;
                let hash = item[1] / 2;
                if (!mp.game.invoke(methods.HAS_PED_GOT_WEAPON, mp.players.local.handle, hash, false)) return;

                let ammoCount = mp.game.invoke(methods.GET_AMMO_IN_PED_WEAPON, mp.players.local.handle, hash);
                let slot = weapons.getGunSlotIdByItem(n);

                if (user.set('weapon_' + slot + '_ammo') == -1)
                    return;

                if (methods.parseInt(user.set('weapon_' + slot + '_ammo')) != methods.parseInt(ammoCount)) {
                    user.set('weapon_' + slot + '_ammo', ammoCount);
                }
            });
        }
    }
    catch (e) {
        methods.debug(e);
    }

    setTimeout(user.timer1sec, 1000);
};

user.getTargetEntity = function() {
    return user.targetEntity.entity;
};

user.getTargetEntityValidate = function() {
    try {
        if (
            user.targetEntity &&
            user.targetEntity.entity &&
            user.targetEntity.entity.getType() != 3
        )
            return user.targetEntity.entity;
        else if (
            user.targetEntity &&
            user.targetEntity.entity &&
            user.targetEntity.entity.getVariable('isDrop')
        )
            return user.targetEntity.entity;
    }
    catch (e) {

    }
    return undefined;
};

user.pointingAt = function(distance) {
    try {
        const camera = mp.cameras.new("gameplay");
        let position = camera.getCoord();
        let direction = camera.getDirection();
        let farAway = new mp.Vector3((direction.x * distance) + (position.x), (direction.y * distance) + (position.y), (direction.z * distance) + (position.z));
        return mp.raycasting.testPointToPoint(position, farAway, mp.players.local, (2 | 4 | 8 | 16));
    }
    catch (e) {

    }
    return undefined;
};

user.pointingAtRadius = function(distance, radius = 0.2) {
    try {
        const camera = mp.cameras.new("gameplay");
        let position = camera.getCoord();
        let direction = camera.getDirection();
        let farAway = new mp.Vector3((direction.x * distance) + (position.x), (direction.y * distance) + (position.y), (direction.z * distance) + (position.z));
        let result = mp.raycasting.testCapsule(position, farAway, radius, mp.players.local);
        if (result.entity.getVariable('isDrop'))
            return result;
    }
    catch (e) {
    }
    return undefined;
};

user.removeAllWeapons = function() {
    mp.players.local.removeAllWeapons();

    weapons.getMapList().forEach(item => {
        let hash = item[1] / 2;
        if (Container.Data.HasLocally(0, hash.toString())) {
            Container.Data.ResetLocally(0, hash.toString());
            Container.Data.Reset(mp.players.local.remoteId, hash.toString());
        }
    });
};

user.giveWeaponByHash = function(model, pt) {
    mp.game.invoke(methods.GIVE_WEAPON_TO_PED, mp.players.local.handle, model, pt, false, true);
    Container.Data.SetLocally(0, model.toString(), true);
    Container.Data.Set(mp.players.local.remoteId, model.toString(), pt);
};

user.giveWeaponComponentByHash = function(model, component) {
    //mp.game.invoke(methods.GIVE_WEAPON_COMPONENT_TO_PED, mp.players.local.handle, model, component);
    mp.events.callRemote('server:user:giveWeaponComponent', model.toString(), component.toString());
};

user.giveWeaponComponent = function(model, component) {
    user.giveWeaponComponentByHash(weapons.getHashByName(model), component);
};

user.giveWeapon = function(model, pt) {
    user.giveWeaponByHash(weapons.getHashByName(model), pt);
};

user.addAmmo = function(name, count) {
    user.addAmmoByHash(weapons.getHashByName(name), count);
};

user.addAmmoByHash = function(name, count) {
    mp.game.invoke(methods.ADD_AMMO_TO_PED, mp.players.local.handle, weapons.getHashByName(name), count);
};

user.setAmmo = function(name, count) {
    user.setAmmoByHash(weapons.getHashByName(name), count);
};

user.setAmmoByHash = function(name, count) {
    mp.game.invoke(methods.SET_PED_AMMO, mp.players.local.handle, name, count);
};

user.kickAntiCheat = function(reason, title = 'Вы были кикнуты.') {
    methods.debug(reason, title);
};

user.teleportv = function(pos, rot) {
    user.isTeleport = true;
    mp.game.streaming.requestCollisionAtCoord(pos.x, pos.y, pos.z);
    user.showLoadDisplay(500);
    //methods.wait(500);
    setTimeout(function () {
        mp.players.local.freezePosition(true);
        mp.players.local.position = pos;
        //methods.wait(500);
        setTimeout(function () {
            mp.players.local.freezePosition(false);
            user.hideLoadDisplay(500);
            setTimeout(function () {
                user.isTeleport = false;
            }, 500);
        }, 1000);
    }, 500);
};

user.teleportVehV = function(pos, rot) {
    user.isTeleport = true;
    mp.game.streaming.requestCollisionAtCoord(pos.x, pos.y, pos.z);
    user.showLoadDisplay(500);
    //methods.wait(500);
    setTimeout(function () {
        if (mp.players.local.vehicle)
            mp.players.local.vehicle.position = new mp.Vector3(pos.x, pos.y, pos.z + 0.5);
        else
            mp.players.local.position = pos;
        //methods.wait(500);
        setTimeout(function () {
            user.hideLoadDisplay(500);
            setTimeout(function () {
                user.isTeleport = false;
            }, 1000);
        }, 500);
    }, 500);
};

user.teleport = function(x, y, z, rot) {
    user.teleportv(new mp.Vector3(x, y, z), rot);
};

user.teleportVeh = function(x, y, z, rot) {
    user.teleportVehV(new mp.Vector3(x, y, z), rot);
};

user.clearChat = function() {
    for (let i = 0; i < 100; i++)
        mp.gui.chat.push('');
};

user.tpToWaypoint = function() {

    // find GPS blip

    try {

        let pos = methods.getWaypointPosition();
        if (pos.x != 0) {
            user.teleport(pos.x, pos.y, pos.z);
        }
    } catch(e) {
        console.log(e);
    }
};

user.setWaypoint = function(x, y) {
    mp.game.ui.setNewWaypoint(methods.parseInt(x), methods.parseInt(y));
    //ui.showSubtitle('Метка в ~g~GPS~s~ была установлена');
};

user.removeWaypoint = function() {
    user.setWaypoint(mp.players.local.position.x, mp.players.local.position.y);
};

user.hideLoadDisplay = function() {
    mp.game.cam.doScreenFadeIn(500);
    setTimeout(function () {
        ui.showHud();
    }, 500);
};

user.showLoadDisplay = function() {
    mp.game.cam.doScreenFadeOut(500);
    ui.hideHud();
};

user.notify = function (message) {
    try {
        mp.events.callRemote('server:clientDebug', `${message}`)
    } catch (e) {
    }
};

user.init = function() {

    mp.game.graphics.transitionFromBlurred(false);
    user.timer50ms();
    user.timer1sec();
    user.stopAllScreenEffect();
    user.hideLoadDisplay();
    user.clearChat();

    cam = mp.cameras.new('customization', new mp.Vector3(8.243752, 527.4373, 171.6173), new mp.Vector3(0, 0, 0), 20);
    cam.pointAtCoord(9.66692, 528.34783, 171.2);
    cam.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, false, false);

    user.setVirtualWorld(mp.players.local.remoteId + 1);
    mp.players.local.position = new mp.Vector3(9.66692, 528.34783, 170.63504 + 10);
    mp.players.local.setRotation(0, 0, 123.53768, 0, true);
    mp.players.local.freezePosition(true);
    mp.players.local.setVisible(true, false);
    mp.players.local.setCollision(false, false);

    mp.game.ui.displayRadar(false);
    mp.gui.chat.activate(false);
};

user.destroyCam = function() {
    if (cam) {
        cam.destroy();
        cam = null;

        mp.game.cam.renderScriptCams(false, true, 500, true, true);
    }
};

user.getCam = function() {
    return cam;
};

user.camSetRot = function(idx) {
    let coords = new mp.Vector3(9.66692, 528.34783, 171.3);
    currentCamRot = (idx / 180) * -2;
    let newCoords = new mp.Vector3((1 + currentCamDist) * Math.sin(currentCamRot) + coords.x, (1 + currentCamDist) * Math.cos(currentCamRot) + coords.y, coords.z);
    cam.setCoord(newCoords.x, newCoords.y, newCoords.z);
};

user.camSetDist = function(idx) {
    currentCamDist = idx;
    let coords = new mp.Vector3(9.66692, 528.34783, 171.3);
    let newCoords = new mp.Vector3((1 + currentCamDist) * Math.sin(currentCamRot) + coords.x, (1 + currentCamDist) * Math.cos(currentCamRot) + coords.y, coords.z);
    cam.setCoord(newCoords.x, newCoords.y, newCoords.z);
};

user.setVariable = function(key, value) {
    mp.events.callRemote('server:user:serVariable', key, value);
};

user.setVirtualWorld = function(worldId) {
    mp.events.callRemote('server:user:setVirtualWorld', worldId);
};

user.setPlayerModel = function(model) {
    mp.events.callRemote('server:user:setPlayerModel', model);
};

user.setDecoration = function(slot, type, isLocal = false) {
    if (!isLocal)
        mp.events.callRemote('server:user:setDecoration', slot, type);
    else
        mp.players.local.setDecoration(mp.game.joaat(slot), mp.game.joaat(type));
};

user.clearDecorations = function(isLocal = false) {
    if (!isLocal)
        mp.events.callRemote('server:user:clearDecorations');
    else
        mp.players.local.clearDecorations();
};

user.save = function() {
    mp.events.callRemote('server:user:save');
};

user.login = function(name, spawnName) {
    user.showLoadDisplay();

    setTimeout(function () {
        ui.callCef('authMain','{"type": "hide"}');
        ui.callCef('customization','{"type": "hide"}');
        user.destroyCam();

        user.setLogin(true);

        mp.players.local.freezePosition(false);
        mp.players.local.setCollision(true, true);
        mp.gui.cursor.show(false, false);
        mp.gui.chat.show(true);
        mp.gui.chat.activate(true);
        mp.game.ui.displayRadar(true);
        mp.events.callRemote('server:user:loginUser', name, spawnName);
    }, 500);
};

user.getCache = function(item) {
    try {
        if (userData.has(item))
            return userData.get(item);
        return undefined;
    }
    catch (e) {
        methods.debug('Exception: user.get');
        methods.debug(e);
        userData = new Map();
        return undefined;
    }
};

user.hasCache = function(item) {
    return userData.has(item);
};

user.setCache = function(key, value) {
    userData.set(key, value);
};

user.set = function(key, val) {
    user.setCache(key, val);
    Container.Data.Set(mp.players.local.remoteId, key, val);
};

user.reset = function(key) {
    user.setCache(key, null);
    Container.Data.Reset(mp.players.local.remoteId, key);
};

user.get = async function(key) {
    try {
        return await Container.Data.Get(mp.players.local.remoteId, key);
    } catch (e) {
        methods.debug(e);
    }
    return null;
};

user.has = async function(key) {
    return await Container.Data.Has(mp.players.local.remoteId, key);
};
user.setCacheData = function(data) {
    userData = data;
    user.currentId = data.get('id') + 1000000;
};

user.getCacheData = function() {
    return userData;
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

user.getSex = function() {
    if (mp.players.local.model === mp.game.joaat('mp_f_freemode_01'))
        return 1;
    else if (mp.players.local.model === mp.game.joaat('mp_m_freemode_01'))
        return 0;
    else if (user.isLogin()) {
        let skin = JSON.parse(user.getCache('skin'));
        return skin['SKIN_SEX'];
    }
    else
        return 0;
};

user.updateCharacterFace = function(isLocal = false) {
    try {
        if (!isLocal)
            mp.events.callRemote('server:user:updateCharacterFace');
        else {

            mp.players.local.setHeadBlendData(
                user.getCache('SKIN_MOTHER_FACE'),
                user.getCache('SKIN_FATHER_FACE'),
                0,
                user.getCache('SKIN_MOTHER_SKIN'),
                user.getCache('SKIN_FATHER_SKIN'),
                0,
                user.getCache('SKIN_PARENT_FACE_MIX'),
                user.getCache('SKIN_PARENT_SKIN_MIX'),
                0,
                true
            );

            let specifications = user.getCache('SKIN_FACE_SPECIFICATIONS');
            if (specifications) {
                try {
                    JSON.parse(specifications).forEach((item, i) => {
                        mp.players.local.setFaceFeature(i, item);
                    })
                } catch(e) {
                    methods.debug(e);
                    methods.debug(specifications);
                }
            }

            mp.players.local.setComponentVariation(2, user.getCache('SKIN_HAIR'), 0, 2);
            mp.players.local.setHeadOverlay(2, user.getCache('SKIN_EYEBROWS'), 1.0, user.getCache('SKIN_EYEBROWS_COLOR'), 0);

            mp.players.local.setHairColor(user.getCache('SKIN_HAIR_COLOR'), 0);
            mp.players.local.setEyeColor(user.getCache('SKIN_EYE_COLOR'));
            mp.players.local.setHeadOverlayColor(2, 1, user.getCache('SKIN_EYEBROWS_COLOR'), 0);

            mp.players.local.setHeadOverlay(9, user.getCache('SKIN_OVERLAY_9'), 1.0, user.getCache('SKIN_OVERLAY_9_COLOR'), 0);

            try {
                //TODO Exepted Number
                if (user.getSex() == 0) {
                    mp.players.local.setHeadOverlay(10, user.getCache('SKIN_OVERLAY_10'), 1.0, user.getCache('SKIN_OVERLAY_10_COLOR'), 0);
                    mp.players.local.setHeadOverlay(1, user.getCache('SKIN_OVERLAY_1'), 1.0, user.getCache('SKIN_OVERLAY_1_COLOR'), 0);
                }
                else if (user.getSex() == 1) {
                    mp.players.local.setHeadOverlay(4, user.getCache('SKIN_OVERLAY_4'), 1.0, user.getCache('SKIN_OVERLAY_4_COLOR'), 0);
                    mp.players.local.setHeadOverlay(5, user.getCache('SKIN_OVERLAY_5'), 1.0, user.getCache('SKIN_OVERLAY_5_COLOR'), 0);
                    mp.players.local.setHeadOverlay(8, user.getCache('SKIN_OVERLAY_8'), 1.0, user.getCache('SKIN_OVERLAY_8_COLOR'), 0);
                }
            }
            catch (e) {
                methods.debug(e);
            }

            try {
                let data = JSON.parse(enums.get('overlays'))[user.getSex()][user.getCache('SKIN_HAIR')];

                user.clearDecorations(true);
                user.setDecoration(data[0], data[1], true);
            }
            catch (e) {
                methods.debug(e);
            }
        }
    } catch(e) {
        console.log('updateCharacterFace', e);
    }
};

user.updateCharacterCloth = function() {
    mp.events.callRemote('server:user:updateCharacterCloth');
};

user.updateTattoo = function() {
    mp.events.callRemote('server:user:updateTattoo');
};

user.setComponentVariation = function(component, drawableId, textureId) {
    component = methods.parseInt(component);
    drawableId = methods.parseInt(drawableId);
    textureId = methods.parseInt(textureId);
    mp.events.callRemote('server:user:setComponentVariation', component, drawableId, textureId);
};

user.setProp = function(slot, type, color) {
    methods.debug('user.setProp');

    slot = methods.parseInt(slot);
    type = methods.parseInt(type);
    color = methods.parseInt(color);

    mp.events.callRemote('server:user:setProp', slot, type, color);
};

user.clearAllProp = function() {
    mp.events.callRemote('server:user:clearAllProp');
};

user.stopAllScreenEffect = function() {
    mp.game.invoke(methods.ANIMPOSTFX_STOP_ALL);
};

user.addMoney = function(money) {
    mp.events.callRemote('server:user:addMoney', money);
};

user.removeMoney = function(money) {
    mp.events.callRemote('server:user:removeMoney', money);
};

user.setMoney = function(money) {
    mp.events.callRemote('server:user:setMoney', money);
};

user.getMoney = function() {
    return user.getCashMoney();
};

user.addBankMoney = function(money) {
    mp.events.callRemote('server:user:addBankMoney', money);
};

user.removeBankMoney = function(money) {
    mp.events.callRemote('server:user:removeBankMoney', money);
};

user.setBankMoney = function(money) {
    mp.events.callRemote('server:user:setBankMoney', money);
};

user.getBankMoney = function() {
    return methods.parseFloat(user.getCache('money_bank'));
};

user.addCashMoney = function(money) {
    mp.events.callRemote('server:user:addCashMoney', money);
};

user.removeCashMoney = function(money) {
    mp.events.callRemote('server:user:removeCashMoney', money);
};

user.setCashMoney = function(money) {
    mp.events.callRemote('server:user:setCashMoney', money);
};

user.getCashMoney = function() {
    return methods.parseFloat(user.getCache('money'));
};

user.addGrabMoney = function(money) {
    user.setGrabMoney(user.getGrabMoney() + money);
};

user.removeGrabMoney = function(money) {
    user.setGrabMoney(user.getGrabMoney() - money);
};

user.setGrabMoney = function(money) {
    if (money > 0)
        user.setComponentVariation(5, 45, 0);
    else
        user.setComponentVariation(5, 0, 0);

    Container.Data.SetLocally(0, 'GrabMoney', money);
};

user.getGrabMoney = function() {
    return methods.parseFloat(Container.Data.GetLocally(0, 'GrabMoney'));
};

user.addDrugLevel = function(type, level) {
    user.setDrugLevel(type, user.getDrugLevel(type) + level);
};

user.removeDrugLevel = function(type, level) {
    user.setDrugLevel(type, user.getDrugLevel(type) - level);
};

user.setDrugLevel = function(type, level) {
    Container.Data.SetLocally(0, 'DrugLevel' + type, level);
};

user.getDrugLevel = function(type) {
    return methods.parseInt(Container.Data.GetLocally(0, 'DrugLevel' + type));
};

user.isLogin = function(){
    return _isLogin;
};

user.setLogin = function(value){
    _isLogin = value;
};

user.isJobMail = function() {
    return user.isLogin() && user.getCache('job') == 4;
};

user.isJobGr6 = function() {
    return user.isLogin() && user.getCache('job') == 8;
};

user.giveWanted = function(level, reason) {
    mp.events.callRemote('server:user:giveMeWanted', level, reason);
};

user.giveJobSkill = function() {
    mp.events.callRemote('server:user:giveJobSkill');
};

user.giveJobMoney = function(money) {

    //if (user.getCache('skill_' + user.getCache('job')) >= 500)
    //    money = methods.parseInt(money * 1.5);

    if (user.getCache('bank_card') == 0) {
        user.addCashMoney(money);
        mp.game.ui.notifications.show('~y~Оформите банковскую карту');
    }
    else {
        user.addBankMoney(money);
        user.sendSmsBankOperation(`Зачисление средств: ~g~${methods.moneyFormat(money)}`);
    }
};

user.playAnimation = function(dict, anim, flag = 49, sendEventToServer = true) {
    if (mp.players.local.getVariable("isBlockAnimation") || mp.players.local.isInAnyVehicle(false) || user.isDead()) return;
    mp.events.callRemote('server:playAnimation', dict, anim, methods.parseInt(flag));
    /*
        8 = нормально играть
        9 = цикл
        48 = нормально играть только верхнюю часть тела
        49 = цикл только верхняя часть тела
    */
};

user.isDead = function() {
    return mp.players.local.getHealth() <= 0;
};

user.isAdmin = function(){
    return true; //TODO
};

export default user;