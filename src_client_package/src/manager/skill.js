import methods from '../modules/methods';
import user from '../user';

let skill = {};

let checkStats = function()
{
    if (!user.isLogin())
        return;

    try {
        let localPlayer = mp.players.local;

        if (mp.players.local.isSprinting() && user.getCache('stats_endurance') < 99) {
            mp.game.ui.notifications.show(`~g~Навык "Выносливость" был повышен`);
            user.set('stats_endurance', user.getCache('stats_endurance') + 1);
            if (user.isUsmc())
                user.set('stats_endurance', user.getCache('stats_endurance') + 1);
        }

        if (mp.players.local.isSprinting() && user.getCache('stats_strength') < 99) {
            mp.game.ui.notifications.show(`~g~Навык "Сила" был повышен`);
            user.set('stats_strength', user.getCache('stats_strength') + 1);
            if (user.isUsmc())
                user.set('stats_strength', user.getCache('stats_strength') + 1);
        }

        /*if (mp.players.local.isSwimming() && user.getCache('stats_lung_capacity') < 99) {
            mp.game.ui.notifications.show(`~g~Навык "Объем легких" был повышен`);
            user.set('stats_lung_capacity', user.getCache('stats_lung_capacity') + 1);
        }*/

        if (user.getCache('stats_driving') < 99)
        {
            if (mp.players.local.isSittingInAnyVehicle())
            {
                let veh = mp.players.local.vehicle;
                if (veh.getPedInSeat(-1) == localPlayer.handle && !veh.isInAir() && methods.getCurrentSpeed() > 10) {
                    mp.game.ui.notifications.show(`~g~Навык вождения был повышен`);

                    if (user.isUsmc())
                        user.set('stats_driving', user.getCache('stats_driving') + 1);
                }
            }
        }

        if (user.getCache('mp0_flying_ability') < 99)
        {
            if (mp.players.local.isSittingInAnyVehicle())
            {
                let veh = mp.players.local.vehicle;
                if (veh.getPedInSeat(-1) == localPlayer.handle && veh.isInAir()) {
                    mp.game.ui.notifications.show(`~g~Навык пилота был повышен`);

                    if (user.isUsmc())
                        user.set('stats_flying', user.getCache('stats_flying') + 1);
                }
            }
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

let checkShooting = function () {
    if (!user.isLogin())
        return;
    try {
        if (mp.players.local.isSwimmingUnderWater() && user.getCache('stats_lung_capacity') < 99)
        {
            mp.game.ui.notifications.show(`~g~Навык "Объем легких" был повышен`);
            user.set('stats_lung_capacity', user.getCache('stats_lung_capacity') + 2);
            if(user.getCache('stats_lung_capacity') > 99)
                user.set('stats_lung_capacity', 99);
        }

        if (!mp.players.local.isInAnyVehicle(false) && mp.players.local.isShooting() && user.getCache('stats_shooting') < 99) {
            mp.game.ui.notifications.show(`~g~Навык стрельбы был повышен`);
            if (user.isUsmc())
                user.set('stats_shooting', user.getCache('stats_shooting') + 1);
            user.set('stats_shooting', user.getCache('stats_shooting') + 1);
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

let updateStats = function(){
    if (!user.isLogin())
        return;

    try {
        mp.game.gameplay.terminateAllScriptsWithThisName('stats_controller﻿');

        mp.game.stats.statSetInt(mp.game.joaat("MP0_STAMINA"), user.getCache('stats_endurance'), true);
        mp.game.stats.statSetInt(mp.game.joaat("MP0_STRENGTH"), user.getCache('stats_strength'), true);
        mp.game.stats.statSetInt(mp.game.joaat("MP0_LUNG_CAPACITY"), user.getCache('stats_lung_capacity'), true);
        mp.game.stats.statSetInt(mp.game.joaat("MP0_WHEELIE_ABILITY"), user.getCache('stats_driving'), true);
        mp.game.stats.statSetInt(mp.game.joaat("MP0_FLYING_ABILITY"), user.getCache('stats_flying'), true);
        mp.game.stats.statSetInt(mp.game.joaat("MP0_STEALTH_ABILITY"), user.getCache('stats_lucky'), true);
        mp.game.stats.statSetInt(mp.game.joaat("MP0_SHOOTING_ABILITY"), user.getCache('stats_shooting'), true);

        mp.game.stats.statSetInt(mp.game.joaat("STAMINA"), user.getCache('stats_endurance'), true);
        mp.game.stats.statSetInt(mp.game.joaat("STRENGTH"), user.getCache('stats_strength'), true);
        mp.game.stats.statSetInt(mp.game.joaat("LUNG_CAPACITY"), user.getCache('stats_lung_capacity'), true);
        mp.game.stats.statSetInt(mp.game.joaat("WHEELIE_ABILITY"), user.getCache('stats_driving'), true);
        mp.game.stats.statSetInt(mp.game.joaat("FLYING_ABILITY"), user.getCache('stats_flying'), true);
        mp.game.stats.statSetInt(mp.game.joaat("STEALTH_ABILITY"), user.getCache('stats_lucky'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SHOOTING_ABILITY"), user.getCache('stats_shooting'), true);

        mp.game.stats.statSetInt(mp.game.joaat("SP0_STAMINA"), user.getCache('stats_endurance'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SP0_STRENGTH"), user.getCache('stats_strength'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SP0_LUNG_CAPACITY"), user.getCache('stats_lung_capacity'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SP0_WHEELIE_ABILITY"), user.getCache('stats_driving'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SP0_FLYING_ABILITY"), user.getCache('stats_flying'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SP0_STEALTH_ABILITY"), user.getCache('stats_lucky'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SP0_SHOOTING_ABILITY"), user.getCache('stats_shooting'), true);

        mp.game.stats.statSetInt(mp.game.joaat("SP1_STAMINA"), user.getCache('stats_endurance'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SP1_STRENGTH"), user.getCache('stats_strength'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SP1_LUNG_CAPACITY"), user.getCache('stats_lung_capacity'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SP1_WHEELIE_ABILITY"), user.getCache('stats_driving'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SP1_FLYING_ABILITY"), user.getCache('stats_flying'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SP1_STEALTH_ABILITY"), user.getCache('stats_lucky'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SP1_SHOOTING_ABILITY"), user.getCache('stats_shooting'), true);

        mp.game.stats.statSetInt(mp.game.joaat("SP2_STAMINA"), user.getCache('stats_endurance'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SP2_STRENGTH"), user.getCache('stats_strength'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SP2_LUNG_CAPACITY"), user.getCache('stats_lung_capacity'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SP2_WHEELIE_ABILITY"), user.getCache('stats_driving'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SP2_FLYING_ABILITY"), user.getCache('stats_flying'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SP2_STEALTH_ABILITY"), user.getCache('stats_lucky'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SP2_SHOOTING_ABILITY"), user.getCache('stats_shooting'), true);
    }
    catch (e) {
        methods.debug(e);
    }
};

skill.loadAll = function() {
    setInterval(checkStats, 180000);
    setInterval(checkShooting, 10000);
    setInterval(updateStats, 10000);
};

export default skill;
