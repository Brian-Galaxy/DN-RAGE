import methods from '../modules/methods';

import enums from '../enums';

import user from '../user';

let vShop = {};

let vPos = new mp.Vector3(198.04959106445312, -1000.5430297851562, -99.67317199707031);
let vRot = 180;

let vCurrent = null;

let insidePos = new mp.Vector3(206.8355712890625, -999.1096801757812, -99.99992370605469);
let exitPos = new mp.Vector3(0, 0, 0);
let currentShop = 0;

let color1 = 111;
let color2 = 111;
let openAllDoor = false;

vShop.goToInside = function(shopId, x, y, z) {
    user.setVirtualWorld(mp.players.local.remoteId + 1);

    if (currentShop == 0) {
        exitPos = new mp.Vector3(x, y, z);
        user.teleportv(insidePos);
        currentShop = shopId;
    }
};

vShop.createVehicle = function(model, c1 = 111, c2 = 111) {
    vShop.destroyVehicle();

    color1 = c1;
    color2 = c2;

    vCurrent = mp.vehicles.new(mp.game.joaat(model), vPos, { heading: vRot, locked: true, numberPlate: "CAR SHOP", dimension: mp.players.local.remoteId + 1 });
    vCurrent.setRotation(0, 0, 180, 0, true);
    vCurrent.setCanBeDamaged(false);
    vCurrent.setInvincible(true);
    vCurrent.freezePosition(true);
    vCurrent.setColours(color1, color2);
};

vShop.setColor1 = function(color) {
    if (vCurrent && mp.vehicles.exists(vCurrent)) {
        color1 = color;
        vCurrent.setColours(color1, color2);
    }
};

vShop.getColor1 = function() {
    return color1;
};

vShop.setColor2 = function(color) {
    if (vCurrent && mp.vehicles.exists(vCurrent)) {
        color2 = color;
        vCurrent.setColours(color1, color2);
    }
};

vShop.getColor2 = function() {
    return color2;
};

vShop.openAllDoor = function() {
    if (vCurrent && mp.vehicles.exists(vCurrent)) {
        openAllDoor = true;
        for (let i = 0; i < 8; i++)
            vCurrent.setDoorOpen(i, false, true);
    }
};

vShop.closeAllDoor = function() {
    if (vCurrent && mp.vehicles.exists(vCurrent)) {
        openAllDoor = false;
        for (let i = 0; i < 8; i++)
            vCurrent.setDoorShut(i, true);
    }
};

vShop.isOpenAllDoor = function() {
    return openAllDoor;
};

vShop.destroyVehicle = function() {
    if (vCurrent && mp.vehicles.exists(vCurrent))
        vCurrent.destroy();
    vCurrent = null;
};

export default vShop;
