import user from "../user";
import weapons from "../weapons";
import inventory from "../inventory";
import phone from "../phone";
import enums from "../enums";

import methods from "../modules/methods";
import Container from "../modules/data";
import ui from "../modules/ui";

import checkpoint from "./checkpoint";

import vehicles from "../property/vehicles";

import vSync from "./vSync";
import license from "./license";
import weather from './weather';
import hosp from './hosp';

import fuel from "../business/fuel";

//import dispatcher from "./dispatcher";

let EntityFleeca = 0;
let EntityOther1 = 0;
let EntityOther2 = 0;
let EntityOther3 = 0;
let EntityFuel = 0;

let isDisableControl = false;
let allModelLoader = false;
let allVehiclesLoader = false;
let afkTimer = 0;
let afkLastPos = new mp.Vector3(0, 0, 0);

let deathTimer = 0;

let timer = {};

timer.setDeathTimer = function(sec) {
    deathTimer = sec;
    ui.showSubtitle(`Время до возрождения~g~ ${deathTimer} ~s~сек.`);
};

timer.getDeathTimer = function() {
    return deathTimer;
};

timer.updateTempLevel = function() {

    let clothList = user.getSex() == 1 ? JSON.parse(enums.get('clothF')) : JSON.parse(enums.get('clothM'));

    if (weather.getWeatherTemp() < 18 && user.getCache('torso') == 15) {
        mp.game.ui.notifications.show("~y~У Вас замерз торс");
        mp.players.local.setHealth(mp.players.local.getHealth() + 100 - 2);
        return;
    }
    else {
        for (let i = 0; i < clothList.length; i++) {
            if (clothList[i][1] != 11) continue;
            if (clothList[i][2] != user.getCache('body')) continue;
            if (clothList[i][10] > weather.getWeatherTemp())
            {
                mp.game.ui.notifications.show("~y~У Вас замерз торс");
                mp.players.local.setHealth(mp.players.local.getHealth() + 100 - 1);
                break;
            }
        }
    }

    for (let i = 0; i < clothList.length; i++) {
        if (clothList[i][1] != 4) continue;
        if (clothList[i][2] != user.getCache('leg')) continue;
        if (clothList[i][10] > weather.getWeatherTemp())
        {
            mp.game.ui.notifications.show("~y~У Вас замерзли ноги");
            mp.players.local.setHealth(mp.players.local.getHealth() + 100 - 1);
            break;
        }
    }

    for (let i = 0; i < clothList.length; i++) {
        if (clothList[i][1] != 6) continue;
        if (clothList[i][2] != user.getCache('foot')) continue;
        if (clothList[i][10] > weather.getWeatherTemp())
        {
            mp.game.ui.notifications.show("~y~У Вас замерзли ступни");
            mp.players.local.setHealth(mp.players.local.getHealth() + 100 - 1);
            break;
        }
    }
};

timer.updateEatLevel = function() {
    if (user.isLogin()) {
        user.removeEatLevel(10);
        user.removeWaterLevel(20);

        if (user.getEatLevel() < 200 || user.getWaterLevel() < 200) {
            mp.game.cam.shakeGameplayCam("ROAD_VIBRATION_SHAKE", 1.5);
            setTimeout(function () {
                mp.game.cam.stopGameplayCamShaking(false);
            }, 7000);
        }
        if (user.getEatLevel() < 100 || user.getWaterLevel() < 100)
            user.setRagdoll(2000);

        if (user.getEatLevel() < 10)
            mp.players.local.setHealth(mp.players.local.getHealth() + 100 - 5);
        if (user.getWaterLevel() < 10)
            mp.players.local.setHealth(mp.players.local.getHealth() + 100 - 5);
    }
};

timer.twoMinTimer = function() {
    //methods.showHelpNotify();

    let veh = mp.players.local.vehicle; //TODO
    if (veh && mp.vehicles.exists(veh) && veh.getClass() == 18 && !user.isGos()) {
        if (veh.getPedInSeat(-1) == mp.players.local.handle) {
            user.giveWanted(10, 'Угон служебного ТС');
            //dispatcher.send(`Код 0`, `Неизвестный угнал служебный трансопрт`);
        }
    }

    timer.updateEatLevel();

    try {
        if (user.isLogin() && user.getCache('jail_time') < 1) {
            if (mp.players.local.vehicle)
            {
                if (methods.getVehicleInfo(mp.players.local.vehicle.model).class_name == "Cycles" ||
                    methods.getVehicleInfo(mp.players.local.vehicle.model).class_name == "Boats" ||
                    methods.getVehicleInfo(mp.players.local.vehicle.model).class_name == "Motorcycles"
                )
                    timer.updateTempLevel();
            }
            else if (
                mp.players.local.dimension == 0 &&
                mp.game.interior.getInteriorAtCoords(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z) == 0
            )
                timer.updateTempLevel();
        }
    }
    catch (e) {
        methods.debug(e);
    }
    setTimeout(timer.twoMinTimer, 1000 * 60 * 2);
};

timer.min15Timer = function() {

    license.checker();

    user.save();
    setTimeout(timer.min15Timer, 1000 * 60 * 16);
};

timer.ms50Timer = function() {

    try {
        isDisableControl = vehicles.checkerControl();

        ui.updateVehValues();
        ui.updateValues();

        if (Container.Data.HasLocally(mp.players.local.remoteId, 'hasSeat')) {
            mp.players.local.freezePosition(true);
            mp.players.local.setCollision(false, false);
        }
    }
    catch (e) {
        methods.debug(e);
    }

    setTimeout(timer.ms50Timer, 50);
};

timer.twoSecTimer = function() {

    try {

        let plPos = mp.players.local.position;

        EntityFleeca = mp.game.object.getClosestObjectOfType(plPos.x, plPos.y, plPos.z, 0.68, 506770882, false, false, false);
        EntityOther1 = mp.game.object.getClosestObjectOfType(plPos.x, plPos.y, plPos.z, 0.68, -1126237515, false, false, false);
        EntityOther2 = mp.game.object.getClosestObjectOfType(plPos.x, plPos.y, plPos.z, 0.68, -1364697528, false, false, false);
        EntityOther3 = mp.game.object.getClosestObjectOfType(plPos.x, plPos.y, plPos.z, 0.68, -870868698, false, false, false);

        EntityFuel = 0;

        fuel.hashList.forEach(hash => {
            if (EntityFuel == 0)
                EntityFuel = mp.game.object.getClosestObjectOfType(plPos.x, plPos.y, plPos.z, 3, hash, false, false, false);
        });

        if (EntityFleeca != 0 || EntityOther1 != 0 || EntityOther2 != 0 || EntityOther3 != 0)
            mp.game.ui.notifications.show("Нажмите ~g~E~s~ чтобы открыть меню банкомата");
        if (EntityFuel != 0) {
            checkpoint.emitEnter(99999);
            mp.game.ui.notifications.show("Нажмите ~g~E~s~ чтобы открыть меню заправки");
        }
        else
            checkpoint.emitExit(99999);

        if (user.isLogin() && !user.isAdmin()) {
            if (mp.game.player.getInvincible() || mp.players.local.getMaxHealth() >= 1000 || mp.players.local.health >= 1000) {
                user.kickAntiCheat('GodMode');
            }
        }

        let drawId = mp.players.local.getPropIndex(0);
        if (user.getSex() == 1 && drawId != 116 && drawId != 118)
            mp.game.graphics.setNightvision(false);
        if (user.getSex() == 0 && drawId != 117 && drawId != 119)
            mp.game.graphics.setNightvision(false);
    }
    catch (e) {
        methods.debug(e);
    }

    setTimeout(timer.twoSecTimer, 2000);
};

timer.allModelLoader = function() {
    allModelLoader = !allModelLoader;
    if (allModelLoader)
        mp.game.ui.notifications.show("Прогрузка моделей ~g~включена");
    else
        mp.game.ui.notifications.show("Прогрузка моделей ~r~выключена");
};

timer.allVehiclesLoader = function() {
    allVehiclesLoader = !allVehiclesLoader;
    if (allVehiclesLoader)
        mp.game.ui.notifications.show("Прогрузка моделей транспорта ~g~включена");
    else
        mp.game.ui.notifications.show("Прогрузка моделей транспорта ~r~выключена");
};

timer.tenSecTimer = function() {

    if (user.isLogin())
        vSync.syncToServer();

    mp.events.call('client:vehicle:checker');

    if (methods.distanceToPos(afkLastPos, mp.players.local.position) < 1) {
        afkTimer++;
        if (afkTimer > 600 && mp.players.local.getVariable('isAfk') !== true)
            user.setVariable('isAfk', true);
    }
    else {
        if (mp.players.local.getVariable('isAfk') === true)
            user.setVariable('isAfk', false);
        afkTimer = 0;
    }
    afkLastPos = mp.players.local.position;

    if (allModelLoader) {
        try {
            mp.game.invoke("0xBD6E84632DD4CB3F");
        }
        catch (e) {
            methods.debug(e);
        }
    }

    if (allVehiclesLoader) {
        let vehInfo = enums.get('vehicleInfo');
        for (let item in vehInfo) {
            try {
                let vItem = vehInfo[item];
                mp.game.streaming.requestModel(mp.game.joaat(vItem.display_name.toString().toLowerCase()));
            }
            catch (e) {
                methods.debug(e);
            }
        }
    }

    weapons.getMapList().forEach(item => {
        let hash = item[1] / 2;
        if (!mp.game.invoke(methods.HAS_PED_GOT_WEAPON, mp.players.local.handle, hash, false)) {
            if (Container.Data.HasLocally(0, hash.toString())) {
                Container.Data.ResetLocally(0, hash.toString());
                Container.Data.Reset(mp.players.local.remoteId, hash.toString());
            }
        }
    });

    setTimeout(timer.tenSecTimer, 10000);
};

let prevPos = new mp.Vector3(0, 0, 0);
let prevWpPos = new mp.Vector3(0, 0, 0);

timer.secTimer = function() {

    try {
        phone.timer();

        if (user.isOpenPhone()) {
            if (mp.players.local.isPlayingAnim("cellphone@in_car@ds@first_person", "cellphone_horizontal_base", 3) === 0 &&
                mp.players.local.isPlayingAnim("cellphone@female", "cellphone_call_listen_base", 3) === 0 &&
                mp.players.local.isPlayingAnim("cellphone@female", "cellphone_text_read_base", 3) === 0)
                user.hidePhone();
        }

        if (deathTimer > 0) {
            timer.setDeathTimer(deathTimer - 1);

            if (deathTimer == 0)
                hosp.toHosp();
            if (!user.isDead())
                timer.setDeathTimer(0);
        }

        /*
            Drug Types
            - Amf 0
            - Coca 1
            - Dmt 2
            - Ket 3
            - Lsd 4
            - Mef 5
            - Marg 6
        */

        let drugId = 0;

        if (user.getDrugLevel(drugId) > 0) {
            user.removeDrugLevel(drugId, 1);

            if (user.getDrugLevel(drugId) > 1000) {
                mp.gui.chat.push(`!{03A9F4}Вы в коме от передозировки`);
                //user.setHeal(0); //TODO
            }

            if (!mp.game.graphics.getScreenEffectIsActive("DrugsMichaelAliensFightIn"))
                mp.game.graphics.startScreenEffect("DrugsMichaelAliensFightIn", 0, true);

            if (user.getDrugLevel(drugId) < 1) {
                mp.game.graphics.stopScreenEffect("DrugsMichaelAliensFightIn");
                mp.game.graphics.startScreenEffect("DrugsMichaelAliensFightOut", 0, false);
                setTimeout(function () {
                    mp.game.graphics.stopScreenEffect("DrugsMichaelAliensFightOut");
                }, 10000);
            }
        }

        drugId = 1;
        if (user.getDrugLevel(drugId) > 0) {
            user.removeDrugLevel(drugId, 1);

            if (user.getDrugLevel(drugId) > 1000) {
                mp.gui.chat.push(`!{03A9F4}Вы в коме от передозировки`);
                //user.setHeal(0); //TODO
            }

            if (!mp.game.graphics.getScreenEffectIsActive("DrugsTrevorClownsFightIn"))
                mp.game.graphics.startScreenEffect("DrugsTrevorClownsFightIn", 0, true);

            if (user.getDrugLevel(drugId) < 1) {
                mp.game.graphics.stopScreenEffect("DrugsTrevorClownsFightIn");
                mp.game.graphics.startScreenEffect("DrugsTrevorClownsFightOut", 0, false);
                setTimeout(function () {
                    mp.game.graphics.stopScreenEffect("DrugsTrevorClownsFightOut");
                }, 10000);
            }
        }

        drugId = 2;
        if (user.getDrugLevel(drugId) > 0) {
            user.removeDrugLevel(drugId, 1);

            if (user.getDrugLevel(drugId) > 1000) {
                mp.gui.chat.push(`!{03A9F4}Вы в коме от передозировки`);
                //user.setHeal(0); //TODO
            }

            if (!mp.game.graphics.getScreenEffectIsActive("DMT_flight"))
                mp.game.graphics.startScreenEffect("DMT_flight", 0, true);

            if (user.getDrugLevel(drugId) < 1) {
                mp.game.graphics.stopScreenEffect("DMT_flight");
            }
        }

        drugId = 3;
        if (user.getDrugLevel(drugId) > 0) {
            user.removeDrugLevel(drugId, 1);

            if (user.getDrugLevel(drugId) > 1000) {
                mp.gui.chat.push(`!{03A9F4}Вы в коме от передозировки`);
                //user.setHeal(0); //TODO
            }

            if (!mp.game.graphics.getScreenEffectIsActive("Rampage"))
                mp.game.graphics.startScreenEffect("Rampage", 0, true);

            if (user.getDrugLevel(drugId) < 1) {
                mp.game.graphics.stopScreenEffect("Rampage");
            }
        }

        drugId = 4;
        if (user.getDrugLevel(drugId) > 0) {
            user.removeDrugLevel(drugId, 1);

            if (user.getDrugLevel(drugId) > 1000) {
                mp.gui.chat.push(`!{03A9F4}Вы в коме от передозировки`);
                //user.setHeal(0); //TODO
            }

            if (!mp.game.graphics.getScreenEffectIsActive("DrugsDrivingIn"))
                mp.game.graphics.startScreenEffect("DrugsDrivingIn", 0, true);

            if (user.getDrugLevel(drugId) < 1) {
                mp.game.graphics.stopScreenEffect("DrugsDrivingIn");
                mp.game.graphics.startScreenEffect("DrugsDrivingOut", 0, false);
                setTimeout(function () {
                    mp.game.graphics.stopScreenEffect("DrugsDrivingOut");
                }, 10000);
            }
        }

        drugId = 5;
        if (user.getDrugLevel(drugId) > 0) {
            user.removeDrugLevel(drugId, 1);

            if (user.getDrugLevel(drugId) > 1000) {
                mp.gui.chat.push(`!{03A9F4}Вы в коме от передозировки`);
                //user.setHeal(0); //TODO
            }

            if (!mp.game.graphics.getScreenEffectIsActive("PeyoteEndIn"))
                mp.game.graphics.startScreenEffect("PeyoteEndIn", 0, true);

            if (user.getDrugLevel(drugId) < 1) {
                mp.game.graphics.stopScreenEffect("PeyoteEndIn");
                mp.game.graphics.startScreenEffect("PeyoteEndOut", 0, false);
                setTimeout(function () {
                    mp.game.graphics.stopScreenEffect("PeyoteEndOut");
                }, 10000);
            }
        }

        drugId = 99;
        if (user.getDrugLevel(drugId) > 0) {
            user.removeDrugLevel(drugId, 1);

            if (user.getDrugLevel(drugId) > 1500) {
                mp.gui.chat.push(`!{03A9F4}Вы в коме от передозировки`);
                //user.setHeal(0); //TODO
            }

            if (!mp.game.graphics.getScreenEffectIsActive("ChopVision"))
                mp.game.graphics.startScreenEffect("ChopVision", 0, true);

            if (user.getDrugLevel(drugId) < 1) {
                mp.game.graphics.stopScreenEffect("ChopVision");
            }
        }

        if (user.getCashMoney() < -15000 || user.getBankMoney() < -15000) {
            user.kick(`Anti-Cheat System: Пожалуйста, свяжитесь с администрацией`);
            methods.saveLog('CheaterMoney', `${user.getCache('name')} (${user.getCache('id')})`);
            return;
        }

        let isKick = false;
        weapons.getMapList().forEach(item => {
            if (mp.game.invoke(methods.HAS_PED_GOT_WEAPON, mp.players.local.handle, (item[1] / 2), false)) {
                if (isKick)
                    return;
                if (!Container.Data.HasLocally(0, (item[1] / 2).toString()) && item[0] != 'weapon_unarmed') {
                    user.kickAntiCheat(`Try Gun ${item[0]}`);
                    methods.saveLog('Cheater', `${user.getCache('name')} (${user.getCache('id')}) gun: ${item[0]}`);
                    isKick = true;
                }
            }
        });

        let wpPos = methods.getWaypointPosition();
        if (mp.players.local.vehicle && wpPos.x != 0 && wpPos.y != 0) {
            if (prevWpPos.x != wpPos.x && prevWpPos.y != wpPos.y)
                mp.events.callRemote('server:changeWaypointPos', wpPos.x, wpPos.y);
        }
        prevWpPos = wpPos;

        /*if (!user.isAdmin() && (user.getCache('age') == 18 && user.getCache('exp_age') > 5 || user.getCache('age') > 18)) {
            let newPos = mp.players.local.position;
            let dist = mp.players.local.vehicle ? methods.getCurrentSpeed() + 100 : 100;
            if (methods.distanceToPos2D(prevPos, newPos) > dist && prevPos.x != 0) {
                if (!user.isTeleport)
                    user.kickAntiCheat(`Teleport`);
            }
            prevPos = newPos;
        }*/
    }
    catch (e) {
        methods.debug(e);
    }

    setTimeout(timer.secTimer, 1000);
};

timer.loadAll = function () {
    timer.min15Timer();
    timer.twoMinTimer();
    timer.twoSecTimer();
    timer.tenSecTimer();
    timer.ms50Timer();
    timer.secTimer();
};

timer.isFleecaAtm = function () {
    return user.getCache('bank_card') > 0 && EntityFleeca != 0;
    //return user.getCache('bank_card') == 2222 && EntityFleeca != 0;
};

timer.isOtherAtm = function () {
    return user.getCache('bank_card') > 0 && (EntityOther1 != 0 || EntityOther2 != 0 || EntityOther3 != 0);
};

timer.isFuel = function () {
    return EntityFuel != 0;
};

mp.events.add('render', () => {
    if (isDisableControl) {
        mp.game.controls.disableControlAction(0, 21, true); //disable sprint
        mp.game.controls.disableControlAction(0, 24, true); //disable attack
        mp.game.controls.disableControlAction(0, 25, true); //disable aim
        mp.game.controls.disableControlAction(0, 47, true); //disable weapon
        mp.game.controls.disableControlAction(0, 58, true); //disable weapon
        mp.game.controls.disableControlAction(0, 263, true); //disable melee
        mp.game.controls.disableControlAction(0, 264, true); //disable melee
        mp.game.controls.disableControlAction(0, 257, true); //disable melee
        mp.game.controls.disableControlAction(0, 140, true); //disable melee
        mp.game.controls.disableControlAction(0, 141, true); //disable melee
        mp.game.controls.disableControlAction(0, 142, true); //disable melee
        mp.game.controls.disableControlAction(0, 143, true); //disable melee
        //mp.game.controls.disableControlAction(0, 75, true); //disable exit vehicle
        //mp.game.controls.disableControlAction(27, 75, true); //disable exit vehicle
        mp.game.controls.disableControlAction(0, 32, true); //move (w)
        mp.game.controls.disableControlAction(0, 34, true); //move (a)
        mp.game.controls.disableControlAction(0, 33, true); //move (s)
        mp.game.controls.disableControlAction(0, 35, true); //move (d)
        mp.game.controls.disableControlAction(0, 59, true);
        mp.game.controls.disableControlAction(0, 60, true);
    }
});

export default timer;