"use strict";

import Container from './modules/data';
import methods from './modules/methods';
import ui from "./modules/ui";
import weapons from "./weapons";

let user = {};

let _isLogin = false;

user.removeAllWeapons = function() {
    mp.players.local.removeAllWeapons();

    weapons.hashesMap.forEach(item => {
        let hash = item[1] / 2;
        if (Container.Data.HasLocally(0, hash.toString())) {
            Container.Data.ResetLocally(0, hash.toString());
            Container.Data.Reset(mp.players.local.remoteId, hash.toString());
        }
    });
};

user.giveWeaponByHash = function(model, pt) {
    mp.game.invoke(methods.GIVE_WEAPON_TO_PED, mp.players.local.handle, model, pt, true, false);
    Container.Data.SetLocally(0, model.toString(), true);
    Container.Data.Set(mp.players.local.remoteId, model.toString(), pt);
};

user.giveWeapon = function(model, pt) {
    let isGive = false;
    weapons.hashesMap.forEach(item => {
        if ("WEAPON_" + item[0].toUpperCase() == model.toUpperCase()) {
            let hash = item[1] / 2;
            mp.game.invoke(methods.GIVE_WEAPON_TO_PED, mp.players.local.handle, hash, pt, true, false);
            Container.Data.SetLocally(0, hash.toString(), true);
            Container.Data.Set(mp.players.local.remoteId, hash.toString(), pt);
            isGive = true;
            return true;
        }
    });
};

user.teleportv = function(pos) {
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

user.teleportVehV = function(pos) {
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

user.teleport = function(x, y, z) {
    user.teleportv(new mp.Vector3(x, y, z));
};

user.teleportVeh = function(x, y, z) {
    user.teleportVehV(new mp.Vector3(x, y, z));
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

let cam = null;

user.init = function() {

    cam = mp.cameras.new('customization', new mp.Vector3(8.243752, 527.4373, 171.6173), new mp.Vector3(0, 0, 0), 20);
    cam.pointAtCoord(9.66692, 528.34783, 171.2);
    cam.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, false, false);

    user.setVirtualWorld(mp.players.local.remoteId + 1);
    mp.players.local.position = new mp.Vector3(9.66692, 528.34783, 170.63504);
    mp.players.local.setRotation(0, 0, 123.53768, 0, true);
    mp.players.local.freezePosition(true);
    mp.players.local.setVisible(true, false);
    mp.players.local.setCollision(true, false);

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

user.setVariable = function(key, value) {
    mp.events.callRemote('server:user:serVariable', key, value); //TODO
};

user.setVirtualWorld = function(worldId) {
    mp.events.callRemote('server:user:setVirtualWorld', worldId); //TODO
};

user.setPlayerModel = function(model) {
    mp.events.callRemote('server:user:setPlayerModel', model); //TODO
};

let skin = {
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
    SKIN_SPECIFICATIONS: [],
};

/*
0               Blemishes             0 - 23, 255
1               Facial Hair           0 - 28, 255
2               Eyebrows              0 - 33, 255
3               Ageing                0 - 14, 255
4               Makeup                0 - 74, 255
5               Blush                 0 - 6, 255
6               Complexion            0 - 11, 255
7               Sun Damage            0 - 10, 255
8               Lipstick              0 - 9, 255
9               Moles/Freckles        0 - 17, 255
10              Chest Hair            0 - 16, 255
11              Body Blemishes        0 - 11, 255
12              Add Body Blemishes    0 - 1, 255
* */

user.updateCharacterFace = function(isLocal = false) {
    try {
        if (!isLocal)
            mp.events.callRemote('server:user:updateCharacterFace');
        else {

            mp.players.local.setHeadBlendData(
                user.get('SKIN_MOTHER_FACE'),
                user.get('SKIN_FATHER_FACE'),
                0,
                user.get('SKIN_MOTHER_SKIN'),
                user.get('SKIN_FATHER_SKIN'),
                0,
                user.get('SKIN_PARENT_FACE_MIX'),
                user.get('SKIN_PARENT_SKIN_MIX'),
                0,
                true
            );

            let specifications = user.get('SKIN_FACE_SPECIFICATIONS');
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

            mp.players.local.setComponentVariation(2, user.get('GTAO_HAIR'), 0, 2);
            mp.players.local.setHeadOverlay(2, user.get('GTAO_EYEBROWS'), 1.0, user.get('GTAO_EYEBROWS_COLOR'), 0);

            mp.players.local.setHairColor(user.get('GTAO_HAIR_COLOR'), 0);
            mp.players.local.setEyeColor(user.get('GTAO_EYE_COLOR'));
            mp.players.local.setHeadOverlayColor(2, 1, user.get('GTAO_EYEBROWS_COLOR'), 0);

            mp.players.local.setHeadOverlay(9, user.get('GTAO_OVERLAY9'), 1.0, user.get('GTAO_OVERLAY9_COLOR'), 0);

            if (user.getSex() == 0) {
                mp.players.local.setHeadOverlay(10, user.get('GTAO_OVERLAY10'), 1.0, user.get('GTAO_OVERLAY10_COLOR'), 0);
                mp.players.local.setHeadOverlay(1, user.get('GTAO_OVERLAY'), 1.0, user.get('GTAO_OVERLAY_COLOR'), 0);
            }
            else if (user.getSex() == 1) {
                mp.players.local.setHeadOverlay(4, user.get('GTAO_OVERLAY4'), 1.0, user.get('GTAO_OVERLAY4_COLOR'), 0);
                mp.players.local.setHeadOverlay(5, user.get('GTAO_OVERLAY5'), 1.0, user.get('GTAO_OVERLAY5_COLOR'), 0);
                mp.players.local.setHeadOverlay(8, user.get('GTAO_OVERLAY8'), 1.0, user.get('GTAO_OVERLAY8_COLOR'), 0);
            }
        }
    } catch(e) {
        console.log('updateCharacterFace', e);
    }
};

user.isLogin = function(){
    return _isLogin;
};

user.setLogin = function(value){
    _isLogin = value;
};

user.isAdmin = function(){
    return true; //TODO
};

export default user;