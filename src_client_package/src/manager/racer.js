
import methods from "../modules/methods";

import vehicles from "../property/vehicles";

import inventory from "../inventory";
import phone from "../phone";
import menuList from "../menuList";
import user from "../user";
import UIMenu from "../modules/menu";
import hosp from "./hosp";
import ui from "../modules/ui";
import Container from "../modules/data";
import timer from "./timer";

let racer = {};

let currentRace = null;
let currentCpId = 0;
let currentCp = null;
let nextCp = null;
let inRace = false;

racer.createCurrentCp = function(type, pos, dir) {
    try {
        racer.currentCpDestroy();
        currentCp = mp.checkpoints.new(type, pos, 12,{direction: dir, color: [ 255, 235, 59, 150 ], visible: true, dimension: 9999});
    }
    catch (e) {
        console.log(e);
    }
};

racer.createNextCp = function(type, pos, dir) {
    try {
        racer.nextCpDestroy();
        nextCp = mp.checkpoints.new(type, pos, 5,{direction: dir, color: [ 255, 235, 59, 70 ], visible: true, dimension: 9999});
    }
    catch (e) {
        console.log(e);
    }
};

racer.currentCpDestroy = function() {
    try {
        if (typeof currentCp == 'object' && mp.checkpoints.exists(currentCp))
            currentCp.destroy();
    }
    catch (e) {
        console.log(e);
    }
};

racer.nextCpDestroy = function() {
    try {
        if (typeof nextCp == 'object' && mp.checkpoints.exists(nextCp))
            nextCp.destroy();
    }
    catch (e) {
        console.log(e);
    }
};

mp.events.add("client:raceUpdate", (json) => {
    try {
        racer.currentCpDestroy();
        racer.nextCpDestroy();
    }
    catch (e) {

    }
    try {

        currentCpId = 0;
        currentCp = null;
        nextCp = null;
        inRace = true;
        currentRace = JSON.parse(json);

        inventory.hide();
        phone.hide();
        menuList.hide();

        methods.blockKeys(true);
        mp.players.local.setConfigFlag(32, false);

        let posCurrent = currentRace.posList[currentCpId];
        let posNext = currentRace.posList[currentCpId + 1];

        racer.createCurrentCp(0, new mp.Vector3(posCurrent[0], posCurrent[1], posCurrent[2] + currentRace.offsetZ), new mp.Vector3(posNext[0], posNext[1], posNext[2]));
    } catch (e) {

        inRace = false;
        mp.events.callRemote('server:race:exit');
        user.addCashMoney(1000, 'Возврат средств');
        mp.game.ui.notifications.show(`~r~Произошла ошибка, взнос был возвращен`);

        methods.debug(e);
    }
});

mp.events.add("playerEnterCheckpoint", (checkpoint) => {
    if (!inRace)
        return;

    if (!mp.players.local.vehicle)
        return;

    currentCpId++;

    try {
        user.setHealth(100);
    }
    catch (e) {

    }
    try {
        let posCurrent = currentRace.posList[currentCpId];

        if (currentCpId === currentRace.posList.length) {
            racer.nextCpDestroy();
            racer.createCurrentCp(4, new mp.Vector3(posCurrent[0], posCurrent[1], posCurrent[2] + currentRace.offsetZ), new mp.Vector3(0, 0, 0));
        }
        else if (currentCpId > currentRace.posList.length) {
            racer.currentCpDestroy();
            mp.events.callRemote('server:race:finish');
            inRace = false;
            methods.blockKeys(false);
        }
        else {
            racer.nextCpDestroy();

            if (currentCpId < currentRace.posList.length - 1) {
                let posNext = currentRace.posList[currentCpId + 1];
                racer.createCurrentCp(0, new mp.Vector3(posCurrent[0], posCurrent[1], posCurrent[2] + currentRace.offsetZ), new mp.Vector3(posNext[0], posNext[1], posNext[2]));
                racer.createNextCp(0, new mp.Vector3(posNext[0], posNext[1], posNext[2] + currentRace.offsetZ), new mp.Vector3(posNext[0], posNext[1], posNext[2]));
            }
            else {
                racer.createCurrentCp(4, new mp.Vector3(posCurrent[0], posCurrent[1], posCurrent[2] + currentRace.offsetZ), new mp.Vector3(0, 0, 0));
            }
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add("playerDeath", function (player, reason, killer) {
    if (!user.isLogin() || !inRace)
        return;
    try {
        inRace = false;
        mp.events.callRemote('server:race:exit');
        methods.blockKeys(false);
    }
    catch (e) {

    }
});

mp.events.add('render', () => {
    try {
        if (inRace) {
            mp.game.controls.disableControlAction(0,75,true);
        }
    }
    catch (e) {

    }
});

mp.keys.bind(0x46, true, function() {
    if (!user.isLogin() || !inRace)
        return;
    try {
        let posCurrent = currentRace.posList[currentCpId - 1];
        user.teleportVeh(posCurrent[0], posCurrent[1], posCurrent[2], posCurrent[3]);
        mp.events.callRemote('server:user:fixNearestVehicle');
    }
    catch (e) {
        
    }
});

mp.keys.bind(0x42, true, function() {
    if (!user.isLogin() || !inRace)
        return;
    try {
        vehicles.engineVehicle();
    }
    catch (e) {

    }
});

mp.keys.bind(0x1B, true, function() {
    if (!user.isLogin() || !inRace)
        return;
    try {
        inRace = false;
        mp.events.callRemote('server:race:exit');
        methods.blockKeys(false);
    }
    catch (e) {

    }
});

export default racer;