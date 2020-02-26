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
let healthPrev = 100;
let armorPrev = 100;
let weaponAmmoPrev = 0;

let autoHeal = 100;
let autoArmor = 0;
let autoAmmo = 0;

antiCheat.load = function() {
    //setInterval(antiCheat.gmTimer, 1);
    setInterval(antiCheat.healTimer, 50);
    setInterval(antiCheat.secTimer, 1000);
    setInterval(antiCheat.tenSecTimer, 10000);
    setInterval(antiCheat.ten3SecTimer, 30000);

    prevArrayConfig = [];
    for (let i = 0; i <= 27; i++) {
        prevArrayConfig.push(mp.players.local.getCombatFloat(i));
    }
};

antiCheat.tenSecTimer = function() {
    attemptGm = 0;
};

antiCheat.ten3SecTimer = function() {
    attemptWeapon = 0;
};

mp.events.add('render', () => {
    if (user.isLogin()) {
        if (mp.players.local.isShooting()) {
            if (user.getCurrentAmmo() > weaponAmmoPrev)
                attemptWeapon++;
            weaponAmmoPrev = user.getCurrentAmmo();
        }
    }
});

antiCheat.gmTimer = function() {
    if (user.isLogin()) {
        if (mp.players.local.getHealth() > healthPrev || mp.players.local.getArmour() > armorPrev)
            attemptGm++;
        healthPrev = mp.players.local.getHealth();
        armorPrev = mp.players.local.getArmour();
    }
};

antiCheat.healTimer = function() {
    if (user.isLogin()) {
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
        if (user.getCurrentAmmo() > autoAmmo && user.getCurrentAmmo() > 0) {
            if (!user.isSetAmmo())
                user.kickAntiCheat(`Full Ammo`);
            user.isSetAmmoFalse();
        }
        autoHeal = mp.players.local.getHealth();
        autoArmor = mp.players.local.getArmour();
        autoAmmo = user.getCurrentAmmo();
    }
};

antiCheat.secTimer = function() {

    if (user.isLogin()) {

        for (let i = 0; i <= 27; i++) {
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
        }

        /*if (mp.players.local.getAccuracy() === 100) {
            attemptRecoil++;
            if (attemptRecoil > 3) {
                user.kickAntiCheat('Weapon Recoil');
                attemptRecoil = 0;
            }
        }*/

        if (attemptWeapon > 3) {
            user.kickAntiCheat('Endless Ammo #1');
        }

        if (!user.isAdmin()) {
            if (mp.game.player.getInvincible() || mp.players.local.getMaxHealth() >= 300 || mp.players.local.getHealth() >= 300 || mp.players.local.getArmour() >= 101/* || attemptGm > 2*/) {
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
        let dist = mp.players.local.vehicle ? methods.getCurrentSpeed() + 50 : 20;
        if (methods.distanceToPos2D(prevPos, newPos) > dist) {
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