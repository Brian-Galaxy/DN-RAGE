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