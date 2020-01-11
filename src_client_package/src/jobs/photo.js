import methods from '../modules/methods';

import user from '../user';

import jobPoint from '../manager/jobPoint';

let photo = {};

let isProcess = false;
let isCheckpoint = false;
let _checkpointId = -1;
let price = 0;
let pickupId = 0;

photo.markers = [
    ["Крокодил", -2147.697, -500.8055, 1.808812, 0],
    ["Цирк", -1802.926, -979.5959, 0.8247299, 0],
    ["Хуесос", -1529.48, -1170.853 ,0.6652265, 0]
];

photo.start = function() {
    if (isProcess) {
        mp.game.ui.notifications.show('~r~Вы уже получили задание');
        return;
    }
    photo.findRandomPickup();
};

photo.ask = function() {
    mp.game.ui.notifications.showWithPicture('Life Invader', "Начальник", `Необходимо сфотографировать ~y~${photo.markers[pickupId][0]}`, "CHAR_LIFEINVADER", 1);
};

photo.findRandomPickup = function() {
    try {
        isProcess = true;
        pickupId = methods.getRandomInt(0, photo.markers.length - 1);
        let pos = new mp.Vector3(photo.markers[pickupId][1], photo.markers[pickupId][2], photo.markers[pickupId][3]);
        price = methods.parseFloat(methods.distanceToPos(pos, mp.players.local.position) / 50);
        if (price > 400)
            price = 400;
        _checkpointId = jobPoint.create(pos, true, 3);
        mp.game.ui.notifications.showWithPicture('Life Invader', "Начальник", `Необходимо сфотографировать ~y~${photo.markers[pickupId][0]}`, "CHAR_LIFEINVADER", 1);
    }
    catch (e) {
        methods.debug(e);
    }
};

photo.getDirectionPosition = function(rot) {
    let dgr = rot + 180;
    if (dgr >= 22.5 && dgr < 67.5)
        return "SE";
    if (dgr >= 67.5 && dgr < 112.5)
        return "E";
    if (dgr >= 112.5 && dgr < 157.5)
        return "NE";
    if (dgr >= 157.5 && dgr < 202.5)
        return "N";
    if (dgr >= 202.53 && dgr < 247.5)
        return "NW";
    if (dgr >= 247.5 && dgr < 292.5)
        return "W";
    if (dgr >= 292.5 && dgr < 337.5)
        return "SW";
    return "S";
};

photo.workProcess = function() {
    isCheckpoint = false;
    let pos = mp.players.local.position;
    photo.markers.forEach(function (item, i) {
        let pPos = new mp.Vector3(item[1], item[2], item[3]);
        if (methods.distanceToPos(pPos, pos) < 2) {

            let playerPos = photo.getDirectionPosition(mp.players.local.getRotation(0).z);
            let pointPos = photo.getDirectionPosition(item[4]);

            isProcess = true;
            methods.disableAllControls(true);
            try {
                jobPoint.delete();
            }
            catch (e) {
                methods.debug(e);
            }
            _checkpointId = -1;
            pickupId = 0;

            user.playScenario("WORLD_HUMAN_PAPARAZZI");

            setTimeout(function () {
                isProcess = false;
                methods.disableAllControls(false);
                user.stopScenario();

                if (pointPos == playerPos) {
                    mp.game.ui.notifications.showWithPicture('Life Invader', "Начальник", `Отличный кардр, за него ты получишь премию!`, "CHAR_LIFEINVADER", 1);
                    user.giveJobMoney(methods.getRandomInt(100, 200) + price);
                }
                else if (playerPos.indexOf(pointPos) >= 0 || pointPos.indexOf(playerPos) >= 0) {
                    mp.game.ui.notifications.showWithPicture('Life Invader', "Начальник", `Не плохой кадр, но можно и лучше`, "CHAR_LIFEINVADER", 1);
                    user.giveJobMoney(methods.getRandomInt(40, 70) + price);
                }
                else {
                    mp.game.ui.notifications.showWithPicture('Life Invader', "Начальник", `Я промолчу... Вот твои деньги`, "CHAR_LIFEINVADER", 1);
                    user.giveJobMoney(price);
                }

                user.giveJobSkill();
                price = 0;
            }, 30000);
        }
    });
};

mp.events.add("playerEnterCheckpoint", (checkpoint) => {
    if (!isProcess) return;
    if (_checkpointId == -1 || _checkpointId == undefined)
        return;
    if (checkpoint.id == _checkpointId) {
        isCheckpoint = true;
        mp.game.ui.notifications.show('~b~Когда выставите позицию, нажмите ~s~E');
    }
});

//E
mp.keys.bind(0x45, true, function() {
    try {
        if (!user.isLogin())
            return;
        if (isCheckpoint) {
            photo.workProcess();
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

export default photo;