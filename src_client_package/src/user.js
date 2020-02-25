"use strict";

import Container from './modules/data';
import methods from './modules/methods';
import ui from "./modules/ui";

import weapons from "./weapons";
import enums from "./enums";
import items from "./items";
import phone from "./phone";
import inventory from "./inventory";
import chat from "./chat";

import quest from "./manager/quest";
import bind from "./manager/bind";
import object from "./manager/object";

let user = {};

let _isLogin = false;

let userData = new Map();
let datingList = new Map();

user.godmode = false;
//user.isTeleport = true;
user.currentId = 0;
user.targetEntity = undefined;
user.socialClub = 'socialclub';

let currentCamDist = 0.2;
let currentCamRot = -2;
let targetEntityPrev = undefined;

let isTeleport = true;

let cam = null;

/*
0 - Third Person Close
1 - Third Person Mid
2 - Third Person Far
4 - First Person
* */

mp.events.add('render', () => {
    try {
        let entity = user.getTargetEntityValidate();
        if (user.isLogin() && entity) {
            if (user.getCache('s_hud_raycast')) {
                let pos = entity.position;
                ui.drawText3D(`•`, pos.x, pos.y, pos.z, 0.7);
            }
            else
                ui.drawText(`•`, 0.5, 0.5, 0.3, 255, 255, 255, 200, 0, 1, false, true);
        }
    }
    catch (e) {

    }
});

user.timerRayCast = function() {

    try {
        if (!mp.players.local.isSittingInAnyVehicle()) {
            switch (mp.game.invoke(methods.GET_FOLLOW_PED_CAM_VIEW_MODE)) {
                case 4:
                    user.targetEntity = user.pointingAtRadius(3);
                    //if (user.getTargetEntityValidate() === undefined)
                    //    user.targetEntity = user.pointingAtRadius(2);
                    break;
                case 1:
                    user.targetEntity = user.pointingAtRadius(6.8);
                    //if (user.getTargetEntityValidate() === undefined)
                    //    user.targetEntity = user.pointingAtRadius(6.8);
                    break;
                case 2:
                    user.targetEntity = user.pointingAtRadius(9);
                    //if (user.getTargetEntityValidate() === undefined)
                    //    user.targetEntity = user.pointingAtRadius(9);
                    break;
                default:
                    user.targetEntity = user.pointingAtRadius(5);
                    //if (user.getTargetEntityValidate() === undefined)
                    //    user.targetEntity = user.pointingAtRadius(5);
                    break;
            }

            let target = user.getTargetEntityValidate();
            if (target && target != targetEntityPrev)
                mp.game.ui.notifications.show(`Нажмите ~g~${bind.getKeyName(user.getCache('s_bind_do'))}~s~ для взаимодействия`);
            targetEntityPrev = target;
        }
        else
            user.targetEntity = null;
    }
    catch (e) {

    }

    setTimeout(user.timerRayCast, 200);
};

user.timer1sec = function() {

    ui.updateZoneAndStreet();
    ui.updateDirectionText();

    try {
        for (let n = 54; n < 138; n++)
        {
            weapons.getMapList().forEach(item => {
                if (item[0] !== items.getItemNameHashById(n)) return;
                let hash = item[1] / 2;
                if (!mp.game.invoke(methods.HAS_PED_GOT_WEAPON, mp.players.local.handle, hash, false)) return;

                let ammoCount = user.getAmmoByHash(hash);
                let slot = weapons.getGunSlotIdByItem(n);

                //if (user.getCache('weapon_' + slot + '_ammo') == -1)
                //    return;

                if (methods.parseInt(user.getCache('weapon_' + slot + '_ammo')) != methods.parseInt(ammoCount)) {
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
            user.targetEntity.entity.getType() != 3 &&
            !user.targetEntity.entity.getVariable('useless')
        )
            return user.targetEntity.entity;
        else if (
            user.targetEntity &&
            user.targetEntity.entity &&
            user.targetEntity.entity.getVariable('isDrop')
        )
            return user.targetEntity.entity;
        else if (
            user.targetEntity &&
            user.targetEntity.entity &&
            user.targetEntity.entity.getVariable('emsType') !== undefined &&
            user.targetEntity.entity.getVariable('emsType') !== null
        )
            return user.targetEntity.entity;
        else if (
            user.targetEntity &&
            user.targetEntity.entity &&
            user.targetEntity.entity.invType !== undefined &&
            user.targetEntity.entity.invType !== null
        )
            return user.targetEntity.entity;
        else if (
            user.targetEntity &&
            user.targetEntity.entity &&
            user.targetEntity.entity.getVariable('stockId')
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
        return mp.raycasting.testCapsule(position, farAway, radius, mp.players.local);
    }
    catch (e) {
    }
    return undefined;
};

user.setTeleport = function(state) {
    isTeleport = state;
};

user.isTeleport = function() {
    return isTeleport;
};

user.removeAllWeapons = function() {
    mp.players.local.removeAllWeapons();

    weapons.getMapList().forEach(item => {
        try {
            let hash = item[1] / 2;
            if (Container.Data.HasLocally(0, hash.toString())) {
                Container.Data.ResetLocally(0, hash.toString());
                Container.Data.Reset(mp.players.local.remoteId, hash.toString());
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });

    user.setCurrentWeapon('weapon_unarmed');
    inventory.deleteItemsRange(54, 136);
};

user.giveWeaponByHash = function(model, pt) {
    try {
        if (pt < 0)
            pt = 0;
        mp.game.invoke(methods.GIVE_WEAPON_TO_PED, mp.players.local.handle, model, methods.parseInt(pt), false, true);
        Container.Data.SetLocally(0, model.toString(), true);
        Container.Data.Set(mp.players.local.remoteId, model.toString(), methods.parseInt(pt));
    }
    catch (e) {
        methods.debug(e);
    }
};

user.giveWeaponComponentByHash = function(model, component) {
    //mp.game.invoke(methods.GIVE_WEAPON_COMPONENT_TO_PED, mp.players.local.handle, model, component);
    mp.events.callRemote('server:user:giveWeaponComponent', model.toString(), component.toString());
};

user.giveWeaponComponent = function(model, component) {
    user.giveWeaponComponentByHash(weapons.getHashByName(model), component);
};

user.removeWeaponComponentByHash = function(model, component) {
    //mp.game.invoke(methods.GIVE_WEAPON_COMPONENT_TO_PED, mp.players.local.handle, model, component);
    mp.events.callRemote('server:user:removeWeaponComponent', model.toString(), component.toString());
};

user.removeWeaponComponent = function(model, component) {
    user.removeWeaponComponentByHash(weapons.getHashByName(model), component);
};

user.removeAllWeaponComponents = function(model) {
    user.removeAllWeaponComponentsByHash(weapons.getHashByName(model));
};

user.removeAllWeaponComponentsByHash = function(model) {
    mp.events.callRemote('server:user:removeAllWeaponComponents', model.toString());
};

user.setCurrentWeapon = function(model) {
    user.setCurrentWeaponByHash(weapons.getHashByName(model));
};

user.setCurrentWeaponByHash = function(model) {
    try {
        mp.game.invoke(methods.SET_CURRENT_PED_WEAPON, mp.players.local.handle, model, true);
    }
    catch (e) {
        methods.debug(e);
    }
};

user.setWeaponTintByHash = function(model, tint) {
    mp.events.callRemote('server:user:setWeaponTint', model.toString(), methods.parseInt(tint));
};

user.setWeaponTint = function(model, tint) {
    user.setWeaponTintByHash(weapons.getHashByName(model), tint);
};

user.giveWeapon = function(model, pt) {
    user.giveWeaponByHash(weapons.getHashByName(model), pt);
};

user.addAmmo = function(name, count) {
    user.addAmmoByHash(weapons.getHashByName(name), count);
};

user.addAmmoByHash = function(name, count) {
    try {
        mp.game.invoke(methods.ADD_AMMO_TO_PED, mp.players.local.handle, name, methods.parseInt(count));
    }
    catch (e) {
        methods.debug(e)
    }
};

user.setAmmo = function(name, count) {
    user.setAmmoByHash(weapons.getHashByName(name), count);
};

user.setAmmoByHash = function(name, count) {
    try {
        mp.game.invoke(methods.SET_PED_AMMO, mp.players.local.handle, name, methods.parseInt(count));
    }
    catch (e) {
        methods.debug(e);
    }
};

user.getAmmo = function(name) {
    return user.getAmmoByHash(weapons.getHashByName(name));
};

user.getAmmoByHash = function(name) {
    return mp.game.invoke(methods.GET_AMMO_IN_PED_WEAPON, mp.players.local.handle, name);
};

user.getCurrentAmmoInClip = function() {ammo
    return mp.players.local.getAmmoInClip(user.getCurrentWeapon());
};

user.getCurrentAmmo = function() {
    return user.getAmmoByHash(user.getCurrentWeapon());
};

user.getCurrentWeapon = function() {
    return mp.game.invoke(methods.GET_SELECTED_PED_WEAPON, mp.players.local.handle);
};

user.revive = function(hp = 20) {
    isTeleport = true;
    let hospPos = mp.players.local.position;
    //mp.players.local.resurrect();
    //mp.players.local.position = hospPos;
    mp.events.callRemote('server:user:respawn', hospPos.x, hospPos.y, hospPos.z);
    mp.players.local.health = hp;
    mp.players.local.freezePosition(false);
};

user.respawn = function(x, y, z) {
    isTeleport = true;
    mp.events.callRemote('server:user:respawn', x, y, z);
};

user.teleportv = function(pos, rot, isHud = true) {
    isTeleport = true;
    mp.game.streaming.requestCollisionAtCoord(pos.x, pos.y, pos.z);
    user.showLoadDisplay(500, isHud);
    //methods.wait(500);
    setTimeout(function () {
        mp.attachmentMngr.shutdownFor(mp.players.local);
        mp.players.local.position = pos;
        if (rot != undefined)
            mp.players.local.setRotation(0, 0, methods.parseInt(rot), 0, true);
        //methods.wait(500);
        setTimeout(function () {
            object.process();
            mp.attachmentMngr.initFor(mp.players.local);
            user.hideLoadDisplay(500, isHud);
        }, 1000);
    }, 500);
};

user.teleportVehV = function(pos, rot) {
    isTeleport = true;
    mp.game.streaming.requestAdditionalCollisionAtCoord(pos.x, pos.y, pos.z);
    mp.game.streaming.requestCollisionAtCoord(pos.x, pos.y, pos.z);
    user.showLoadDisplay(500);
    let camMode = mp.game.invoke(methods.GET_FOLLOW_VEHICLE_CAM_VIEW_MODE);
    //methods.wait(500);
    setTimeout(function () {
        try {
            mp.attachmentMngr.shutdownFor(mp.players.local);
            mp.game.streaming.requestAdditionalCollisionAtCoord(pos.x, pos.y, pos.z);
            mp.game.streaming.requestCollisionAtCoord(pos.x, pos.y, pos.z);
            mp.game.invoke(methods.SET_FOLLOW_VEHICLE_CAM_VIEW_MODE, 4);
            if (mp.players.local.vehicle) {
                mp.players.local.vehicle.position = pos;
                if (rot != undefined)
                    mp.players.local.vehicle.setRotation(0, 0, methods.parseInt(rot), 0, true);
                setTimeout(function () {
                    mp.players.local.vehicle.setOnGroundProperly();
                }, 100);
            }
            else {
                if (rot != undefined)
                    mp.players.local.setRotation(0, 0, methods.parseInt(rot), 0, true);
                mp.players.local.position = pos;
            }
        }
        catch (e) {
            methods.debug(e);
        }
        //methods.wait(500);
        setTimeout(function () {
            object.process();
            mp.attachmentMngr.initFor(mp.players.local);
            mp.game.invoke(methods.SET_FOLLOW_VEHICLE_CAM_VIEW_MODE, camMode);
            user.hideLoadDisplay(500);
        }, 500);
    }, 500);
};

user.teleport = function(x, y, z, rot, isHud = true) {
    user.teleportv(new mp.Vector3(x, y, z), rot, isHud);
};

user.teleportVeh = function(x, y, z, rot) {
    user.teleportVehV(new mp.Vector3(x, y, z), rot);
};

user.tpToWaypoint = function() { //TODO машина
    try {
        let pos = methods.getWaypointPosition();

        isTeleport = true;
        let entity = mp.players.local.vehicle ? mp.players.local.vehicle : mp.players.local;
        entity.position = new mp.Vector3(pos.x, pos.y, pos.z + 20);
        let interval = setInterval(function () {
            try {
                mp.game.streaming.requestCollisionAtCoord(pos.x, pos.y, pos.z);
                entity.position = new mp.Vector3(pos.x, pos.y, entity.position.z + 20);
                let zPos = mp.game.gameplay.getGroundZFor3dCoord(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, 0, false);
                if (entity.position.z > 1000 || zPos != 0) {
                    entity.position = new mp.Vector3(pos.x, pos.y, zPos + 2);

                    if (mp.players.local.vehicle)
                        mp.players.local.vehicle.setOnGroundProperly();

                    clearInterval(interval);
                }
            }
            catch (e) {
                methods.debug(e);
            }
        }, 1);
    } catch(e) {
        methods.debug(e);
    }
};

user.setWaypoint = function(x, y) {
    mp.game.ui.setNewWaypoint(methods.parseInt(x), methods.parseInt(y));
    ui.showSubtitle('Метка в ~g~GPS~s~ была установлена');
};

user.removeWaypoint = function() {
    user.setWaypoint(mp.players.local.position.x, mp.players.local.position.y);
};

user.hideLoadDisplay = function(dur = 500, isHud = true) {
    mp.game.cam.doScreenFadeIn(dur);
    setTimeout(function () {
        if (isHud && user.isLogin())
            ui.showHud();
    }, dur);
};

user.showLoadDisplay = function(dur = 500, isHud = true) {
    mp.game.cam.doScreenFadeOut(dur);
    if (isHud)
        ui.hideHud();
};

user.clearChat = function() {
    chat.clear();
};

user.notify = function (message) {
    try {
        mp.events.callRemote('server:clientDebug', `${message}`)
    } catch (e) {
    }
};

user.sendPhoneNotify = function(sender, title, message, pic = 'CHAR_BLANK_ENTRY') {
    if (phone.getType() > 0)
        phone.sendNotify(sender, title, message, pic);
};

user.init = function() {

    try {
        mp.nametags.enabled = false;
        mp.game.graphics.transitionFromBlurred(false);
        user.timerRayCast();
        user.timer1sec();
        user.stopAllScreenEffect();
        user.hideLoadDisplay();
        user.clearChat();
        user.setAlpha(255);

        user.init2();
    }
    catch (e) {
        methods.debug(e);
    }
};

user.init2 = function() {

    try {
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
    }
    catch (e) {
        methods.debug(e);
    }
};

user.destroyCam = function() {
    try {
        if (cam) {
            cam.destroy();
            cam = null;
        }
    }
    catch (e) {
        methods.debug(e);
    }

    mp.game.cam.renderScriptCams(false, true, 500, true, true);
};

user.getCam = function() {
    return cam;
};

user.camSetRot = function(idx) {
    try {
        let coords = new mp.Vector3(9.66692, 528.34783, 171.3);
        currentCamRot = (idx / 180) * -2;
        let newCoords = new mp.Vector3((1 + currentCamDist) * Math.sin(currentCamRot) + coords.x, (1 + currentCamDist) * Math.cos(currentCamRot) + coords.y, coords.z);
        cam.setCoord(newCoords.x, newCoords.y, newCoords.z);
    }
    catch (e) {
        methods.debug(e);
    }
};

user.camSetDist = function(idx) {
    try {
        currentCamDist = idx;
        let coords = new mp.Vector3(9.66692, 528.34783, 171.3);
        let newCoords = new mp.Vector3((1 + currentCamDist) * Math.sin(currentCamRot) + coords.x, (1 + currentCamDist) * Math.cos(currentCamRot) + coords.y, coords.z);
        cam.setCoord(newCoords.x, newCoords.y, newCoords.z);
    }
    catch (e) {
        methods.debug(e);
    }
};

user.setVariable = function(key, value) {
    mp.events.callRemote('server:user:serVariable', key, value);
};

user.setVirtualWorld = function(worldId) {
    mp.events.callRemote('server:user:setVirtualWorld', worldId);
};

user.setVirtualWorldVeh = function(worldId) {
    mp.events.callRemote('server:user:setVirtualWorldVeh', worldId);
};

user.setAlpha = function(alpha) {
    mp.events.callRemote('server:user:setAlpha', alpha);
};

user.setPlayerModel = function(model) {
    mp.events.callRemote('server:user:setPlayerModel', model);
};

user.setHeal = function(level) {
    mp.events.callRemote('server:user:setHeal', level);
};

user.setDecoration = function(slot, type, isLocal = false) {
    try {
        if (!isLocal)
            mp.events.callRemote('server:user:setDecoration', slot, type);
        else
            mp.players.local.setDecoration(mp.game.joaat(slot), mp.game.joaat(type));
    }
    catch (e) {
        methods.debug(e);
    }
};

user.clearDecorations = function(isLocal = false) {
    try {
        if (!isLocal)
            mp.events.callRemote('server:user:clearDecorations');
        else
            mp.players.local.clearDecorations();
    }
    catch (e) {
        methods.debug(e);
    }
};

user.save = function() {
    mp.events.callRemote('server:user:save');
};

user.login = function(name, spawnName) {
    user.showLoadDisplay();

    setTimeout(function () {
        try {
            ui.callCef('authMain','{"type": "hide"}');
            ui.callCef('customization','{"type": "hide"}');

            user.setLogin(true);

            mp.events.callRemote('server:user:loginUser', name, spawnName);
        }
        catch (e) {
            methods.debug(e);
        }
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

user.updateCache = async function() {
    userData = await Container.Data.GetAll(mp.players.local.remoteId);
};

user.getDating = function(item) {
    try {
        if (datingList.has(item))
            return datingList.get(item);
        return item;
    }
    catch (e) {
        methods.debug('Exception: user.getDating');
        methods.debug(e);
        datingList = new Map();
        return item;
    }
};

user.hasDating = function(item) {
    return datingList.has(item);
};

user.setDating = function(key, value) {
    datingList.set(key, value);
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

user.getSex = function() {
    try {
        if (mp.players.local.model === mp.game.joaat('mp_f_freemode_01'))
            return 1;
        else if (mp.players.local.model === mp.game.joaat('mp_m_freemode_01'))
            return 0;
        else if (user.isLogin()) {
            let skin = JSON.parse(user.getCache('skin'));
            return skin['SKIN_SEX'];
        }
    }
    catch (e) {
        methods.debug(e);
    }

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

            mp.players.local.setHairColor(user.getCache('SKIN_HAIR_COLOR'), user.getCache('SKIN_HAIR_COLOR_2'));
            mp.players.local.setEyeColor(user.getCache('SKIN_EYE_COLOR'));
            mp.players.local.setHeadOverlayColor(2, 1, user.getCache('SKIN_EYEBROWS_COLOR'), 0);

            mp.players.local.setHeadOverlay(9, user.getCache('SKIN_OVERLAY_9'), 1.0, user.getCache('SKIN_OVERLAY_COLOR_9'), 0);

            try {
                if (user.getSex() == 0) {
                    mp.players.local.setHeadOverlay(10, user.getCache('SKIN_OVERLAY_10'), 1.0, user.getCache('SKIN_OVERLAY_COLOR_10'), 0);
                    mp.players.local.setHeadOverlay(1, user.getCache('SKIN_OVERLAY_1'), 1.0, user.getCache('SKIN_OVERLAY_COLOR_1'), 0);
                }
                else if (user.getSex() == 1) {
                    mp.players.local.setHeadOverlay(4, user.getCache('SKIN_OVERLAY_4'), 1.0, user.getCache('SKIN_OVERLAY_COLOR_4'), 0);
                    mp.players.local.setHeadOverlay(5, user.getCache('SKIN_OVERLAY_5'), 1.0, user.getCache('SKIN_OVERLAY_COLOR_5'), 0);
                    mp.players.local.setHeadOverlay(8, user.getCache('SKIN_OVERLAY_8'), 1.0, user.getCache('SKIN_OVERLAY_COLOR_8'), 0);
                }
            }
            catch (e) {
                methods.debug('user.updateCharacterFaceLocal');
                methods.debug(e);
            }

            user.updateTattoo(true);
        }
    } catch(e) {
        console.log('updateCharacterFace', e);
    }
};

user.updateCharacterCloth = function() {
    mp.events.callRemote('server:user:updateCharacterCloth');
};

user.updateTattoo = function(isLocal = false, updateTattoo = true, updatePrint = true, updateHair = true) {
    if (!isLocal)
        mp.events.callRemote('server:user:updateTattoo');
    else {
        try {
            user.clearDecorations(true);

            if (updateTattoo) {
                let tattooList = JSON.parse(user.getCache( 'tattoo'));
                if (tattooList != null) {
                    try {
                        tattooList.forEach(function (item) {
                            if (user.getCache('tprint_c') != "" && item[2] == 'ZONE_TORSO')
                                return;
                            user.setDecoration(item[0], item[1], true);
                        });
                    }
                    catch (e) {
                        methods.debug(e);
                    }
                }
            }

            if (updateHair) {
                if (user.getCache('SKIN_HAIR_2')) {
                    let data = JSON.parse(enums.get('overlays'))[user.getSex()][user.getCache( "SKIN_HAIR")];
                    user.setDecoration(data[0], data[1], true);
                }

                let data = JSON.parse(enums.get('overlays'))[user.getSex()][methods.parseInt(user.getCache( "SKIN_HAIR_3"))];
                user.setDecoration(data[0], data[1], true);
            }

            if (updatePrint) {
                if (user.getCache('tprint_c') != "" && user.getCache( 'tprint_o') != "")
                    user.setDecoration( user.getCache( 'tprint_c'), user.getCache( 'tprint_o'), true);
            }
        }
        catch (e) {
            methods.debug('user.updateTattoo', e);
        }
    }
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

user.kick = function(reason) {
    mp.events.callRemote('server:user:kick', reason);
};

user.kickAntiCheat = function(reason) {
    mp.events.callRemote('server:user:kickAntiCheat', reason);
};

user.stopAllScreenEffect = function() {
    mp.game.graphics.setNightvision(false);
    mp.game.graphics.setSeethrough(false);
    mp.game.graphics.setTimecycleModifierStrength(0);

    mp.game.graphics.setNoiseoveride(false);
    mp.game.graphics.setNoisinessoveride(0);

    mp.game.invoke(methods.ANIMPOSTFX_STOP_ALL);
};

user.buyLicense = function(type, price, month = 12)
{
    if (type === "b_lic") {
        setTimeout(function () {
            quest.standart();
        }, 5000);
    }
    mp.events.callRemote('server:user:buyLicense', type, price, month);
};

user.addHistory = function(type, reason) {
    mp.events.callRemote('server:user:addHistory', type, reason);
};

user.sendSms = function(sender, title, text, pic) {
    mp.events.callRemote('server:user:sendSms', sender, title, text, pic);
};

user.addMoney = function(money, text = 'Финансовая операция') {
    mp.events.callRemote('server:user:addMoney', money, text);
};

user.removeMoney = function(money, text = 'Финансовая операция') {
    mp.events.callRemote('server:user:removeMoney', money, text);
};

user.setMoney = function(money) {
    mp.events.callRemote('server:user:setMoney', money);
};

user.getMoney = function() {
    return user.getCashMoney();
};

user.addBankMoney = function(money, text = "Операция со счетом") {
    mp.events.callRemote('server:user:addBankMoney', money, text);
};

user.removeBankMoney = function(money, text = "Операция со счетом") {
    mp.events.callRemote('server:user:removeBankMoney', money, text);
};

user.setBankMoney = function(money) {
    mp.events.callRemote('server:user:setBankMoney', money);
};

user.getBankMoney = function() {
    return methods.parseFloat(user.getCache('money_bank'));
};

user.addCashMoney = function(money, text = 'Финансовая операция') {
    mp.events.callRemote('server:user:addCashMoney', money, text);
};

user.removeCashMoney = function(money, text = 'Финансовая операция') {
    mp.events.callRemote('server:user:removeCashMoney', money, text);
};

user.setCashMoney = function(money) {
    mp.events.callRemote('server:user:setCashMoney', money);
};

user.getCashMoney = function() {
    return methods.parseFloat(user.getCache('money'));
};

user.addCryptoMoney = function(money, text = "Операция со счетом") {
    mp.events.callRemote('server:user:addCryptoMoney', money, text);
};

user.removeCryptoMoney = function(money, text = "Операция со счетом") {
    mp.events.callRemote('server:user:removeCryptoMoney', money, text);
};

user.setCryptoMoney = function(money) {
    mp.events.callRemote('server:user:setCryptoMoney', money);
};

user.getCryptoMoney = function() {
    return methods.parseFloat(user.getCache('money_crypto'));
};

user.addPayDayMoney = function(money, text = 'Финансовая операция') {
    mp.events.callRemote('server:user:addPayDayMoney', money, text);
};

user.removePayDayMoney = function(money, text = 'Финансовая операция') {
    mp.events.callRemote('server:user:removePayDayMoney', money, text);
};

user.setPayDayMoney = function(money) {
    mp.events.callRemote('server:user:setPayDayMoney', money);
};

user.getPayDayMoney = function() {
    return methods.parseFloat(user.getCache('money_payday'));
};

user.addRep = function(rep) {
    mp.events.callRemote('server:user:addRep', rep);
};

user.removeRep= function(rep) {
    mp.events.callRemote('server:user:removeRep', rep);
};

user.setRep = function(rep) {
    mp.events.callRemote('server:user:setRep', rep);
};

user.getRep= function() {
    return methods.parseInt(user.getCache('rep'));
};

user.addWorkExp = function(rep) {
    mp.events.callRemote('server:user:addWorkExp', rep);
};

user.removeWorkExp= function(rep) {
    mp.events.callRemote('server:user:removeWorkExp', rep);
};

user.setWorkExp = function(rep) {
    mp.events.callRemote('server:user:setWorkExp', rep);
};

user.getWorkLvl = function() {
    return methods.parseInt(user.getCache('work_lvl'));
};

user.getWorkExp= function() {
    return methods.parseInt(user.getCache('work_lvl'));
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

// Water Level
user.addWaterLevel = function(level) {
    if (user.getWaterLevel() + level > 1000) {
        user.setWaterLevel(1000);
        return true;
    }
    user.setWaterLevel(user.getWaterLevel() + level);
    return true
};

user.removeWaterLevel = function(level) {
    if (user.getWaterLevel() - level < 0) {
        user.setWaterLevel(0);
        return true;
    }
    user.setWaterLevel(user.getWaterLevel() - level);
    return true;
};

user.setWaterLevel = function(level) {
    user.set("water_level", level);
    return true;
};

user.getWaterLevel = function() {
    return user.getCache("water_level");
};

// Eat Level
user.addEatLevel = function(level) {
    if (user.getEatLevel() + level > 1000) {
        user.setEatLevel(1000);
        return true;
    }
    user.setEatLevel(user.getEatLevel() + level);
    return true
};

user.removeEatLevel = function(level) {
    if (user.getEatLevel() - level < 0) {
        user.setEatLevel(0);
        return true;
    }
    user.setEatLevel(user.getEatLevel() - level);
    return true;
};

user.setEatLevel = function(level) {
    user.set("eat_level", level);
    return true;
};

user.getEatLevel = function() {
    return user.getCache("eat_level");
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
    return user.isLogin() && user.getCache('job') == 10;
};

user.giveWanted = function(level, reason) {
    mp.events.callRemote('server:user:giveMeWanted', level, reason);
};

user.getRegStatusName = function() {
    switch (user.getCache('reg_status'))
    {
        case 1:
            return "Регистрация";
        case 2:
            return "Гражданство США";
        default:
            return "Нет";
    }
};

user.getRepName = function() {
    let rep = user.getCache('rep');
    if (rep > 900)
        return 'Идеальная';
    if (rep > 800 && rep <= 900)
        return 'Очень хорошая';
    if (rep > 700 && rep <= 800)
        return 'Хорошая';
    if (rep > 600 && rep <= 700)
        return 'Положительная';
    if (rep >= 400 && rep <= 600)
        return 'Нейтральная';
    if (rep >= 300 && rep < 400)
        return 'Отрицательная';
    if (rep >= 200 && rep < 300)
        return 'Плохая';
    if (rep >= 100 && rep < 200)
        return 'Очень плохая';
    if (rep < 100)
        return 'Наихудшая';
};

user.getRepColorName = function() {
    let rep = user.getCache('rep');
    if (rep > 900)
        return '~b~Идеальная';
    if (rep > 800 && rep <= 900)
        return '~g~Очень хорошая';
    if (rep > 700 && rep <= 800)
        return '~g~Хорошая';
    if (rep > 600 && rep <= 700)
        return '~g~Положительная';
    if (rep >= 400 && rep <= 600)
        return 'Нейтральная';
    if (rep >= 300 && rep < 400)
        return '~y~Отрицательная';
    if (rep >= 200 && rep < 300)
        return '~o~Плохая';
    if (rep >= 100 && rep < 200)
        return '~o~Очень плохая';
    if (rep < 100)
        return '~r~Наихудшая';
};

user.giveJobSkill = function() {
    //mp.events.callRemote('server:user:giveJobSkill'); TODO
};

user.giveJobMoney = function(money) {

    //if (user.getCache('skill_' + user.getCache('job')) >= 500)
    //    money = methods.parseInt(money * 1.5);

    if (user.getCache('bank_card') == 0) {
        user.addCashMoney(money, 'Зарплата');
        mp.game.ui.notifications.show('~y~Оформите банковскую карту');
    }
    else {
        user.addBankMoney(money, 'Зарплата');
        user.sendSmsBankOperation(`Зачисление средств: ~g~${methods.moneyFormat(money)}`);
    }
};

user.getFractionName = function() {
    if (!user.isLogin())
        return false;
    return enums.fractionListId[user.getCache( 'fraction_id')].fractionNameShort;
};

user.getFractionNameL = function() {
    if (!user.isLogin())
        return false;
    return enums.fractionListId[user.getCache( 'fraction_id')].fractionName;
};

user.getDepartmentName = function() {
    try {
        if (!user.isLogin())
            return 'Отсуствует';
        if (user.getCache('is_leader'))
            return 'Руководство';
        else if (user.getCache('is_sub_leader'))
            return 'Руководство';
        return enums.fractionListId[user.getCache('fraction_id')].departmentList[user.getCache('rank_type')];
    }
    catch (e) {
        methods.debug(e);
    }
    return 'Отсуствует';
};

user.getRankName = function() {
    try {
        if (!user.isLogin())
            return 'Отсуствует';
        if (user.getCache('is_leader'))
            return enums.fractionListId[user.getCache('fraction_id')].leaderName;
        else if (user.getCache('is_sub_leader'))
            return enums.fractionListId[user.getCache('fraction_id')].subLeaderName;
        return enums.fractionListId[user.getCache('fraction_id')].rankList[user.getCache('rank_type')][user.getCache('rank')];
    }
    catch (e) {
        methods.debug(e);
    }
    return 'Отсуствует';
};


user.sendSmsBankOperation = function(text, title = 'Операция со счётом') {
    methods.debug('bank.sendSmsBankOperation');
    if (!user.isLogin())
        return;

    let prefix = user.getBankCardPrefix();

    try {
        switch (prefix) {
            case 6000:
                user.sendPhoneNotify('~r~Maze Bank', '~g~' + title, text, 'CHAR_BANK_MAZE', 2);
                break;
            case 7000:
                user.sendPhoneNotify('~o~Pacific Bank', '~g~' + title, text, 'CHAR_STEVE_MIKE_CONF', 2);
                break;
            case 8000:
                user.sendPhoneNotify('~g~Fleeca Bank', '~g~' + title, text, 'CHAR_BANK_FLEECA', 2);
                break;
            case 9000:
                user.sendPhoneNotify('~b~Blaine Bank', '~g~' + title, text, 'CHAR_STEVE_TREV_CONF', 2);
                break;
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

user.getBankCardPrefix = function(bankCard = 0) {
    methods.debug('bank.getBankCardPrefix');
    if (!user.isLogin())
        return;

    if (bankCard == 0)
        bankCard = user.getCache('bank_card');

    return methods.parseInt(bankCard.toString().substring(0, 4));
};

user.playAnimationWithUser = function(toId, animType) {
    if (mp.players.local.getVariable("isBlockAnimation") || mp.players.local.isInAnyVehicle(false) || user.isDead()) return;
    mp.events.callRemote('server:playAnimationWithUser', toId, animType);
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

user.setRagdoll = function(timeout = 1000) {
    if (mp.players.local.getVariable("isBlockAnimation") || mp.players.local.isInAnyVehicle(false) || user.isDead()) return;
    mp.events.callRemote('server:setRagdoll', timeout);
};

user.stopAllAnimation = function() {

    if (methods.isBlockKeys())
        return;

    if (!mp.players.local.getVariable("isBlockAnimation")) {
        //mp.players.local.clearTasks();
        //mp.players.local.clearSecondaryTask();
        mp.events.callRemote('server:stopAllAnimation');
    }
};

user.playScenario = function(name) {
    //mp.events.callRemote('server:playScenario', name);

    try {
        let remotePlayer = mp.players.local;
        remotePlayer.clearTasks();
        if (name == 'PROP_HUMAN_SEAT_BENCH') {
            let pos = remotePlayer.getOffsetFromInWorldCoords(0, -0.5, -0.5);
            let heading = remotePlayer.getRotation(0).z;
            remotePlayer.taskStartScenarioAtPosition(name, pos.x, pos.y, pos.z, heading, -1, true, false);
        }
        else {
            remotePlayer.taskStartScenarioInPlace(name, 0, true);
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

user.stopScenario = function() {
    mp.players.local.clearTasks();
};

let isOpenPhone = false;

user.openPhone = function(type) {
    user.playAnimation("cellphone@female", "cellphone_text_read_base", 49);
    mp.attachmentMngr.addLocal('phone' + type);
    isOpenPhone = true;
    user.setCurrentWeapon('weapon_unarmed');
};

user.rotatePhoneV = function() {
    user.playAnimation("cellphone@female", "cellphone_text_read_base", 49);
};

user.rotatePhoneH = function() {
    user.playAnimation("cellphone@in_car@ds@first_person", "cellphone_horizontal_base", 49);
};

user.callPhone = function() {
    user.playAnimation("cellphone@female", "cellphone_call_listen_base", 49);
};

user.isOpenPhone = function() {
    return isOpenPhone;
};

user.hidePhone = function() {
    mp.attachmentMngr.removeLocal('phone1');
    mp.attachmentMngr.removeLocal('phone2');
    mp.attachmentMngr.removeLocal('phone3');
    //user.playAnimation("cellphone@female", "cellphone_text_out", 48);
    user.stopAllAnimation();
    isOpenPhone = false;
};

/*
* StyleType
* 0 = Info
* 1 = Warn
* 2 = Success
* 3 = White
*
* ['top', 'topLeft', 'topCenter', 'topRight', 'center', 'centerLeft', 'centerRight', 'bottom', 'bottomLeft', 'bottomCenter', 'bottomRight'];
*
* */
user.showCustomNotify = function(text, style = 0, layout = 5, time = 5000) {
    ui.callCef('notify', JSON.stringify({type: style, layout: layout, text: text, time: time}));
};

user.isDead = function() {
    return mp.players.local.getHealth() <= 0;
};

user.isAdmin = function(level = 1) {
    return user.getCache('admin_level') >= level;
};

user.isHelper = function(level) {
    return user.getCache('helper_level') >= level;
};

user.isGos = function() {
    return user.isLogin() && (user.isSapd() || user.isFib() || user.isUsmc() || user.isGov() || user.isEms() || user.isSheriff());
};

user.isPolice = function() {
    return user.isLogin() && (user.isSapd() || user.isFib() || user.isUsmc() || user.isSheriff());
};

user.isGov = function() {
    return user.isLogin() && user.getCache('fraction_id') == 1;
};

user.isSapd = function() {
    return user.isLogin() && user.getCache('fraction_id') == 2;
};

user.isFib = function() {
    return user.isLogin() && user.getCache('fraction_id') == 3;
};

user.isUsmc = function() {
    return user.isLogin() && user.getCache('fraction_id') == 4;
};

user.isSheriff = function() {
    return user.isLogin() && user.getCache('fraction_id') == 5;
};

user.isEms = function() {
    return user.isLogin() && user.getCache('fraction_id') == 6;
};
user.isNews = function() {
    return user.isLogin() && user.getCache('fraction_id') == 7;
};

user.isLeader = function() {
    return user.isLogin() && user.getCache('is_leader');
};

user.isSubLeader = function() {
    return user.isLogin() && user.getCache('is_sub_leader');
};

user.isDepLeader = function() {
    return user.isLogin() && user.getCache('fraction_id') > 0 && user.getCache('rank') === 0;
};

user.isDepSubLeader = function() {
    return user.isLogin() && user.getCache('fraction_id') > 0 && user.getCache('rank') === 1;
};

user.isLeader2 = function() {
    return user.isLogin() && user.getCache('is_leader2');
};

user.isSubLeader2 = function() {
    return user.isLogin() && user.getCache('is_sub_leader2');
};

user.isDepLeader2 = function() {
    return user.isLogin() && user.getCache('fraction_id2') > 0 && user.getCache('rank2') === 0;
};

user.isDepSubLeader2 = function() {
    return user.isLogin() && user.getCache('fraction_id2') > 0 && user.getCache('rank2') === 1;
};

user.cuff = function() {
    mp.events.callRemote('server:user:cuff');
};

user.unCuff = function() {
    mp.events.callRemote('server:user:unCuff');
};

user.isCuff = function() {
    return mp.players.local.getVariable('isCuff') === true;
};

user.tie = function() {
    mp.events.callRemote('server:user:tie');
};

user.unTie = function() {
    mp.events.callRemote('server:user:unTie');
};

user.isTie = function() {
    return mp.players.local.getVariable('isCuff') === true;
};

user.isKnockout = function() {
    return mp.players.local.getVariable('isKnockout') === true;
};

export default user;