import methods from '../modules/methods';

import ui from '../modules/ui';

import timer from "./timer";

import user from '../user';

let jail = {};

jail.pos = new mp.Vector3(1707.69, 2546.69, 45.56);
jail.posFree = new mp.Vector3(1849.444, 2601.747, 45.60717);

let prvTime = 0;

jail.timer = function() {

    try {
        if (user.isLogin()) {
            if (user.getCache('jail_time') > 1) {

                user.set('jail_time', user.getCache('jail_time') - 1);

                if (prvTime > user.getCache('jail_time') + 20)
                {
                    user.kickAntiCheat("Cheat Engine");
                    return;
                }
                prvTime = user.getCache('jail_time') + methods.getRandomInt(1, 5);

                if (methods.distanceToPos(mp.players.local.position, jail.pos) > 200) {
                    mp.game.ui.notifications.show("~r~Вас поймали ;)");
                    user.teleportv(jail.pos);
                    jail.updateCloth();
                }

                ui.showSubtitle(`Время в тюрьме~g~ ${user.getCache('jail_time')} ~s~сек.`);
            }

            if (user.getCache('jail_time') == 1)
                jail.freePlayer();
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

jail.freePlayer = function() {
    user.teleportv(jail.posFree);
    user.set('jail_time', 0);
    prvTime = 0;
    mp.game.ui.notifications.show("~g~Вы отсидели в тюрьме, теперь вы свободны!");
    user.updateCharacterCloth();
};

jail.updateCloth = function() {
    if (user.getSex() == 1) {
        user.setComponentVariation(4, 3, 15);
        user.setComponentVariation(6, 5, 0);
        user.setComponentVariation(8, 60, 500);
        user.setComponentVariation(11, 0, 0);
        user.setComponentVariation(3, 0, 0);
    }
    else {
        if (methods.getRandomInt(0, 2) == 0) {
            user.setComponentVariation( 3, 15, 0);
            user.setComponentVariation( 11, 56, 1);
        }
        else {
            user.setComponentVariation( 3, 0, 0);
            user.setComponentVariation( 11, 56, 0);
        }
        user.setComponentVariation( 4, 7, 15);
        user.setComponentVariation( 8, 60, 500);
        user.setComponentVariation( 6, 6, 0);
    }
};

jail.toJail = function(sec) {
    try {

        if (sec < 1) {
            jail.freePlayer();
            return;
        }

        user.showLoadDisplay();
        timer.setDeathTimer(0);

        user.respawn(jail.pos.x, jail.pos.y, jail.pos.z);

        prvTime = sec;
        user.set('jail_time', sec);

        user.setGrabMoney(0);
        user.unCuff();
        user.unTie();
        user.setVirtualWorld(0);

        user.set('wanted_level', 0);

        mp.game.ui.displayRadar(true);
        mp.game.ui.displayHud(true);
        mp.players.local.freezePosition(false);

        user.removeAllWeapons();

        jail.updateCloth();

        setTimeout(function () {
            user.hideLoadDisplay();
        }, 1000);
    }
    catch (e) {
        methods.debug(e);
    }
};

export default jail;