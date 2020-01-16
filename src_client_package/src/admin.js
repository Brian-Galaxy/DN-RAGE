import methods from './modules/methods';

let admin = {};

let noClipEnabled = false;
let noClipSpeed = 1;
let noClipSpeedNames = ["Die", "Slow", "Medium", "Fast", "Very Fast", "Extremely Fast", "Snail Speed!"];

admin.noClip = function(enable) {
    try {
        methods.debug('Execute: admin.noClip');
        noClipEnabled = enable;
        if (noClipEnabled)
            mp.game.ui.notifications.show(`~b~Нажмите ~s~H~b~ чтобы выключить No Clip`);

        if (!noClipEnabled) {
            if (mp.players.local.vehicle) {
                let plPos = mp.players.local.vehicle.position;
                mp.players.local.vehicle.position = new mp.Vector3(plPos.x, plPos.y, plPos.z - mp.players.local.getHeightAboveGround() + 1);
            }
            else {
                let plPos = mp.players.local.position;
                mp.players.local.position = new mp.Vector3(plPos.x, plPos.y, plPos.z - mp.players.local.getHeightAboveGround() + 1);
            }
        }

    } catch (e) {
        methods.debug('Exception: admin.noClip');
        methods.debug(e);
    }
};

admin.isNoClipEnable = function() {
    return noClipEnabled;
};

admin.getNoClipSpeedName = function() {
    return noClipSpeedNames[noClipSpeed];
};

mp.events.add('render', () => {
    if (noClipEnabled) {
        try {
            let noClipEntity = mp.players.local.isSittingInAnyVehicle() ? mp.players.local.vehicle : mp.players.local;

            noClipEntity.freezePosition(true);
            noClipEntity.setInvincible(true);

            mp.game.controls.disableControlAction(0, 8, true);
            mp.game.controls.disableControlAction(0, 9, true);
            mp.game.controls.disableControlAction(0, 30, true);
            mp.game.controls.disableControlAction(0, 31, true);
            mp.game.controls.disableControlAction(0, 32, true);
            mp.game.controls.disableControlAction(0, 33, true);
            mp.game.controls.disableControlAction(0, 34, true);
            mp.game.controls.disableControlAction(0, 35, true);
            mp.game.controls.disableControlAction(0, 36, true);
            mp.game.controls.disableControlAction(0, 63, true);
            mp.game.controls.disableControlAction(0, 64, true);
            mp.game.controls.disableControlAction(0, 71, true);
            mp.game.controls.disableControlAction(0, 72, true);
            mp.game.controls.disableControlAction(0, 77, true);
            mp.game.controls.disableControlAction(0, 78, true);
            mp.game.controls.disableControlAction(0, 78, true);
            mp.game.controls.disableControlAction(0, 87, true);
            mp.game.controls.disableControlAction(0, 88, true);
            mp.game.controls.disableControlAction(0, 89, true);
            mp.game.controls.disableControlAction(0, 90, true);
            mp.game.controls.disableControlAction(0, 129, true);
            mp.game.controls.disableControlAction(0, 130, true);
            mp.game.controls.disableControlAction(0, 133, true);
            mp.game.controls.disableControlAction(0, 134, true);
            mp.game.controls.disableControlAction(0, 136, true);
            mp.game.controls.disableControlAction(0, 139, true);
            mp.game.controls.disableControlAction(0, 146, true);
            mp.game.controls.disableControlAction(0, 147, true);
            mp.game.controls.disableControlAction(0, 148, true);
            mp.game.controls.disableControlAction(0, 149, true);
            mp.game.controls.disableControlAction(0, 150, true);
            mp.game.controls.disableControlAction(0, 151, true);
            mp.game.controls.disableControlAction(0, 232, true);
            mp.game.controls.disableControlAction(0, 266, true);
            mp.game.controls.disableControlAction(0, 267, true);
            mp.game.controls.disableControlAction(0, 268, true);
            mp.game.controls.disableControlAction(0, 269, true);
            mp.game.controls.disableControlAction(0, 278, true);
            mp.game.controls.disableControlAction(0, 279, true);
            mp.game.controls.disableControlAction(0, 338, true);
            mp.game.controls.disableControlAction(0, 339, true);
            mp.game.controls.disableControlAction(0, 44, true);
            mp.game.controls.disableControlAction(0, 20, true);
            mp.game.controls.disableControlAction(0, 47, true);

            let yoff = 0.0;
            let zoff = 0.0;

            if (mp.game.controls.isDisabledControlJustPressed(0, 22)) {
                noClipSpeed++;
                if (noClipSpeed >= noClipSpeedNames.length)
                    noClipSpeed = 0;
            }

            if (mp.game.controls.isDisabledControlPressed(0, 32)) {
                yoff = 0.5;
            }

            if (mp.game.controls.isDisabledControlPressed(0, 33)) {
                yoff = -0.5;
            }

            if (mp.game.controls.isDisabledControlPressed(0, 34)) {
                noClipEntity.setRotation(0, 0, noClipEntity.getRotation(0).z + 3, 0, true);
            }

            if (mp.game.controls.isDisabledControlPressed(0, 35)) {
                noClipEntity.setRotation(0, 0, noClipEntity.getRotation(0).z - 3, 0, true);
            }

            if (mp.game.controls.isDisabledControlPressed(0, 44)) {
                zoff = 0.21;
            }

            if (mp.game.controls.isDisabledControlPressed(0, 20)) {
                zoff = -0.21;
            }

            if (mp.game.controls.isDisabledControlPressed(0, 74)) {
                if(!noClipEntity.getVariable('isTyping')) {
                    admin.noClip(false);
                }
            }

            let newPos = noClipEntity.getOffsetFromInWorldCoords(0, yoff * (noClipSpeed * 0.7), zoff * (noClipSpeed * 0.7));
            let heading = noClipEntity.getRotation(0).z;

            noClipEntity.setVelocity(0, 0, 0);
            noClipEntity.setRotation(0, 0, heading, 0, false);
            noClipEntity.setCollision(false, false);
            noClipEntity.setCoordsNoOffset(newPos.x, newPos.y, newPos.z, true, true, true);

            noClipEntity.freezePosition(false);
            noClipEntity.setInvincible(false);
            noClipEntity.setCollision(true, true);
        }
        catch (e) {

        }
    }
});

export default admin;