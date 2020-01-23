import methods from '../modules/methods';

import Container from '../modules/data';
import ui from '../modules/ui';

import timer from "./timer";

import user from '../user';
import coffer from "../coffer";

let hosp = {};

hosp.pos1 = new mp.Vector3(320.7169494628906, -584.0098876953125, 42.28400802612305);
hosp.pos2 = new mp.Vector3(-259.3686218261719, 6327.6416015625, 31.420677185058594);

let prvTime = 0;

hosp.timer = function() {

    try {
        if (user.isLogin()) {
            if (user.getCache('med_time') > 1) {

                user.set('med_time', user.getCache('med_time') - 1);

                if (prvTime > user.getCache('med_time') + 20)
                {
                    user.kickAntiCheat("Cheat Engine");
                    return;
                }
                prvTime = user.getCache('med_time') + methods.getRandomInt(1, 5);

                if (user.getCache('med_type') == 1) {
                    if (methods.distanceToPos(mp.players.local.position, hosp.pos2) > 60) {
                        mp.game.ui.notifications.show("~r~Вам необходимо проходить лечение");
                        user.teleportv(hosp.pos2);
                    }
                }
                else {
                    if (methods.distanceToPos(mp.players.local.position, hosp.pos1) > 60) {
                        mp.game.ui.notifications.show("~r~Вам необходимо проходить лечение");
                        user.teleportv(hosp.pos1);
                    }
                }

                ui.showSubtitle(`Время лечения~g~ ${user.getCache('med_time')} ~s~сек.`);
            }

            if (user.getCache('med_time') == 1)
                hosp.freePlayer();
        }
    }
    catch (e) {
        methods.debug(e);
    }

    setTimeout(hosp.timer, 1000);
};


hosp.freePlayer = function() {

    user.set('med_time', 0);
    prvTime = 0;
    mp.game.ui.notifications.show("~g~Вы успешно прошли лечение");

    if (user.getCache('med_lic'))
    {
        user.removeMoney(100);
        coffer.addMoney(1, 100);
        mp.game.ui.notifications.show("~g~Стоимость лечения со страховкой ~s~$100");
    }
    else
    {
        if (user.getCache('online_time') < 370) {
            user.removeMoney(50);
            coffer.addMoney(50);
            mp.game.ui.notifications.show("~g~Стоимость лечения ~s~$50");
        }
        else {
            user.removeMoney(1000);
            coffer.addMoney(1,1000);
            mp.game.ui.notifications.show("~g~Стоимость лечения ~s~$1000");
        }
    }
    //user.updateCharacterCloth();
};

hosp.toHospCache = function() {
    try {
        if (user.getCache('med_type') == 1) {
            user.respawn(hosp.pos2.x, hosp.pos2.y, hosp.pos2.z);
        }
        else {
            user.set('med_type', 0);
            user.respawn(hosp.pos1.x, hosp.pos1.y, hosp.pos1.z);
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

hosp.toHosp = function() {
    try {
        user.showLoadDisplay();
        timer.setDeathTimer(0);

        if (methods.distanceToPos(mp.players.local.position, hosp.pos1) > methods.distanceToPos(mp.players.local.position, hosp.pos2)) {
            user.set('med_type', 1);
            user.respawn(hosp.pos2.x, hosp.pos2.y, hosp.pos2.z);
        }
        else {
            user.set('med_type', 0);
            user.respawn(hosp.pos1.x, hosp.pos1.y, hosp.pos1.z);
        }

        if (user.getCache('jail_time') == 0) {
            if (user.getCache('med_lic'))
                user.set('med_time', 200);
            else
                user.set('med_time', 500);
        }

        mp.events.callRemote('playerDeathDone');

        user.setGrabMoney(0);
        user.unCuff();
        user.unTie();
        user.setVirtualWorld(0);

        mp.game.ui.displayRadar(true);
        mp.game.ui.displayHud(true);
        mp.players.local.freezePosition(false);

        setTimeout(function () {
            user.hideLoadDisplay();
        }, 1000);
    }
    catch (e) {
        methods.debug(e);
    }
};

export default hosp;