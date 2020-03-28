import user from "./user";
import weapons from "./weapons";

import methods from "./modules/methods";
import Container from "./modules/data";

let antiCheat = {};

let prevPos = new mp.Vector3(0, 0, 0);

let prevArrayConfig = [];

let attemptRecoil = 0;
let attemptGm = 0;
let attemptWeapon = 0;
let attemptAmmo = 0;

let healthPrev = 100;
let armorPrev = 100;
let weaponAmmoPrev = 0;

let autoHeal = 100;
let autoArmor = 0;
let autoAmmo = 0;

mp.events.add("playerEnterVehicle", function (vehicle, seat) {
    user.isSetAmmoTrue();
});

mp.events.add("playerLeaveVehicle", function () {
    user.isSetAmmoTrue();
});

antiCheat.load = function() {
    //setInterval(antiCheat.gmTimer, 1);
    setInterval(antiCheat.healTimer, 1);
    setInterval(antiCheat.secTimer, 1000);
    setInterval(antiCheat.tenSecTimer, 10000);
    setInterval(antiCheat.ten3SecTimer, 30000);

    /*prevArrayConfig = [];
    for (let i = 0; i <= 27; i++) {
        prevArrayConfig.push(mp.players.local.getCombatFloat(i));
    }*/
};

antiCheat.tenSecTimer = function() {
    attemptGm = 0;
};

antiCheat.ten3SecTimer = function() {
    attemptWeapon = 0;
};

antiCheat.gmTimer = function() {
    if (user.isLogin()) {
        if (mp.players.local.getHealth() > healthPrev || mp.players.local.getArmour() > armorPrev)
            attemptGm++;
        healthPrev = mp.players.local.getHealth();
        armorPrev = mp.players.local.getArmour();

        /*if (mp.players.local.isShooting()) {
            if (user.getCurrentAmmo() > weaponAmmoPrev)
                attemptWeapon++;
            weaponAmmoPrev = user.getCurrentAmmo();
        }*/
    }
};

antiCheat.healTimer = function() {
    if (user.isLogin() && !methods.isBlockKeys()) {
        if (mp.players.local.getHealth() > autoHeal) {
            if (!user.isHealth())
                user.kickAntiCheat(`Auto Heal (HP)`);
            user.setHealthFalse();
        }
        if (mp.players.local.getArmour() > autoArmor) {
            if (!user.isArmor())
                user.kickAntiCheat(`Auto Heal (AP)`);
            user.setArmorFalse();
        }
        /*if (user.getCurrentAmmo() > autoAmmo && user.getCurrentAmmo() > 0) {
            if (!user.isSetAmmo())
                user.kickAntiCheat(`Full Ammo`);
            user.isSetAmmoFalse();
        }*/
        autoHeal = mp.players.local.getHealth();
        autoArmor = mp.players.local.getArmour();
        autoAmmo = user.getCurrentAmmo();
    }
};

antiCheat.secTimer = function() {

    if (user.isLogin() && !methods.isBlockKeys()) {

        /*for (let i = 0; i <= 27; i++) {
            try {
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

        /*if (mp.players.local.getAccuracy() === 100) {
            attemptRecoil++;
            if (attemptRecoil > 3) {
                user.kickAntiCheat('Weapon Recoil');
                attemptRecoil = 0;
            }
        }*/

        if (attemptWeapon > 3) {
            user.kickAntiCheat('Endless Ammo');
        }

        if (!user.isAdmin()) {
            if (mp.players.local.getHealth() >= 500 || mp.players.local.getArmour() >= 200) {
                user.kickAntiCheat('GodMode');
            }
            if (mp.game.player.getInvincible()) {
                user.warnAntiCheat(`GodMode`);
                try {
                    mp.players.local.setInvincible(false);
                    mp.game.player.setInvincible(false);
                }
                catch (e) {

                }
            }
            /*if (!mp.players.local.isVisible()) {
                user.kickAntiCheat('Invision');
            }*/
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
        let dist = mp.players.local.vehicle ? methods.getCurrentSpeed() + 50 : 50;
        let distNew = methods.distanceToPos(prevPos, newPos);
        if (distNew > dist && !mp.players.local.isFalling() && !mp.players.local.isRagdoll()) {
            if (!user.isTeleport() && !methods.isBlockKeys())
                user.warnAntiCheat(`Teleport (${distNew.toFixed(2)}m)`);
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