import user from "./user";
import weapons from "./weapons";

import methods from "./modules/methods";
import Container from "./modules/data";

let antiCheat = {};

let prevPos = new mp.Vector3(0, 0, 0);

let prevArrayConfig = [];

let attemptRecoil = 0;
let attemptGm = 0;
let healthPrev = 100;

antiCheat.load = function() {
    setInterval(antiCheat.gmTimer, 1);
    setInterval(antiCheat.secTimer, 1000);
    setInterval(antiCheat.twoSecTimer, 10000);
};

antiCheat.twoSecTimer = function() {
    attemptGm = 0;
};

antiCheat.gmTimer = function() {
    if (user.isLogin()) {
        if (mp.players.local.getHealth() > healthPrev)
            attemptGm++;
        healthPrev = mp.players.local.getHealth();
    }
};

antiCheat.secTimer = function() {

    /*for (let i = 0; i <= 27; i++) {
        try {
            if (i === 6) continue;
            if (prevArrayConfig[i] !== mp.players.local.getCombatFloat(i)) {
                user.kickAntiCheat('Cheat #' + i);
            }
        }
        catch (e) {
        }
    }

    prevArrayConfig = [];
    for (let i = 0; i <= 27; i++) {
        prevArrayConfig.push(mp.players.local.getCombatFloat(i));
    }*/


    if (user.isLogin()) {

        /*if (mp.players.local.getAccuracy() === 100) {
            attemptRecoil++;
            if (attemptRecoil > 3) {
                user.kickAntiCheat('Weapon Recoil');
                attemptRecoil = 0;
            }
        }*/

        if (!user.isAdmin()) {
            if (mp.game.player.getInvincible() || mp.players.local.getMaxHealth() >= 300 || mp.players.local.getHealth() >= 300 || attemptGm > 3) {
                user.kickAntiCheat('GodMode');
            }
            if (!mp.players.local.isVisible()) {
                user.kickAntiCheat('Invision');
            }
            /*if (!mp.players.local.canRagdoll()) {
                user.kickAntiCheat('Ragdoll');
            }*/
        }

        let isKick = false;
        weapons.getMapList().forEach(item => {
            if (mp.game.invoke(methods.HAS_PED_GOT_WEAPON, mp.players.local.handle, (item[1] / 2), false)) {
                if (isKick)
                    return;
                if (!Container.Data.HasLocally(0, (item[1] / 2).toString()) && item[0] != 'weapon_unarmed') {
                    user.kickAntiCheat(`Gun: ${item[0]}`);
                    isKick = true;
                }
            }
        });

        let newPos = mp.players.local.position;
        let dist = mp.players.local.vehicle ? methods.getCurrentSpeed() + 100 : 50;
        if (methods.distanceToPos2D(prevPos, newPos) > dist && prevPos.x != 0) {
            if (!user.isTeleport())
                user.kickAntiCheat(`Teleport`);
            user.setTeleport(false);
        }
        prevPos = newPos;

        /*if (mp.players.local.isSittingInAnyVehicle())
        {
            let veh = mp.players.local.vehicle;
            if (veh.getPedInSeat(-1) === mp.players.local.handle && !veh.isInAir()) {
                let currentSpeed = methods.getCurrentSpeed();
                let maxSpeed = vehicles.getSpeedMax(veh.model);
                if (!user.getCache('s_hud_speed_type'))
                    maxSpeed = methods.parseInt(maxSpeed / 1.609);

                maxSpeed = maxSpeed + 70;

                if (currentSpeed >= maxSpeed) {
                    if (!user.getCache('s_hud_speed_type'))
                        user.kickAntiCheat(`SpeedHack ${currentSpeed} mp/h`);
                    else
                        user.kickAntiCheat(`SpeedHack ${currentSpeed} km/h`);
                }
            }
        }*/
    }
};

export default antiCheat;