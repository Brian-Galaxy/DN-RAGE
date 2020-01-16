import methods from '../modules/methods';

import user from '../user';
import chat from "../chat";

let vShop = {};

let vPos = new mp.Vector3(198.04959106445312, -1000.5430297851562, -99.67317199707031);
let vRot = 180;

let vCurrent = null;

let insidePos = new mp.Vector3(-1507.416259765625, -3005.405029296875, -82.55733489990234);
let exitPos = new mp.Vector3(-1507.416259765625, -3005.405029296875, -82.55733489990234);
let currentShop = 0;

let carList = new Map();

let color1 = 111;
let color2 = 111;
let openAllDoor = false;

vShop.goToInside = function(shopId, x, y, z, rot, bx, by, bz, cars) {
    try {
        carList = cars;

        user.setVirtualWorld(mp.players.local.remoteId + 1);
        vPos = new mp.Vector3(x, y, z);
        exitPos = new mp.Vector3(bx, by, bz);
        vRot = rot;

        currentShop = shopId;
        user.teleportv(insidePos);

        chat.sendLocal(`!{${chat.clBlue}}Подсказка`);
        chat.sendLocal(`Если вы вдруг закрыли меню, то не переживайте, подойдите к транспорту, наведитесь и нажмите E`);
        chat.sendLocal(`Чтобы выйти из автосалона, в самом низу есть пункт меню выхода`);
    }
    catch (e) {
        methods.debug(e);
    }
};

vShop.exit = function() {
    try {
        vShop.destroyVehicle();
        user.setVirtualWorld(0);
        currentShop = 0;
        user.teleportv(exitPos);
    }
    catch (e) {
        methods.debug(e);
    }
};

vShop.createVehicle = function(model, c1 = 111, c2 = 111) {
    vShop.destroyVehicle();

    color1 = c1;
    color2 = c2;

    try {
        vCurrent = mp.vehicles.new(mp.game.joaat(model), vPos, { heading: vRot, engine: false, locked: true, numberPlate: "CAR SHOP", dimension: mp.players.local.remoteId + 1 });
        vCurrent.setRotation(0, 0, vRot, 0, true);
        vCurrent.setCanBeDamaged(false);
        vCurrent.setInvincible(true);
        vCurrent.freezePosition(true);
        vCurrent.setColours(color1, color2);
    }
    catch (e) {
        methods.debug(e);
    }
};

vShop.setColor1 = function(color) {
    try {
        if (vCurrent && mp.vehicles.exists(vCurrent)) {
            color1 = color;
            vCurrent.setColours(color1, color2);
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

vShop.getColor1 = function() {
    return color1;
};

vShop.setColor2 = function(color) {
    try {
        if (vCurrent && mp.vehicles.exists(vCurrent)) {
            color2 = color;
            vCurrent.setColours(color1, color2);
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

vShop.getColor2 = function() {
    return color2;
};

vShop.openAllDoor = function() {
    try {
        if (vCurrent && mp.vehicles.exists(vCurrent)) {
            openAllDoor = true;
            for (let i = 0; i < 8; i++)
                vCurrent.setDoorOpen(i, false, true);
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

vShop.closeAllDoor = function() {
    try {
        if (vCurrent && mp.vehicles.exists(vCurrent)) {
            openAllDoor = false;
            for (let i = 0; i < 8; i++)
                vCurrent.setDoorShut(i, true);
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

vShop.isOpenAllDoor = function() {
    return openAllDoor;
};

vShop.destroyVehicle = function() {
    try {
        if (vCurrent && mp.vehicles.exists(vCurrent))
            vCurrent.destroy();
        vCurrent = null;
    }
    catch (e) {
        methods.debug(e);
    }
};

vShop.getShopId = function() {
    return currentShop;
};

vShop.getCarList = function() {
    return carList;
};

export default vShop;
