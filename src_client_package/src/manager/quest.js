import user from '../user';
import phone from "../phone";

import ui from "../modules/ui";

import jobPoint from "./jobPoint";
import weather from "./weather";

import vehicles from "../property/vehicles";

let quest = {};

let questNames = [
    'quest_role_0',
    'quest_standart',
    'quest_gang',
];

let gangTakeBoxPos = new mp.Vector3(10.247762680053711, -1902.8265380859375, 21.602693557739258);
let gangPutBoxPos = new mp.Vector3(-119.17330932617188, -1769.6900634765625, 28.85245704650879);
let isBoxTake = false;
let isBoxPut = false;

let _checkpointId = -1;
let _currentCheckpointId = 0;

let isLamar = false;

let questLamarShop = [
    new mp.Vector3(-50.390804290771484, -1756.2313232421875, 28.421005249023438),
    new mp.Vector3(-46.387550354003906, -1754.6119384765625, 28.421005249023438),
    new mp.Vector3(-51.22553253173828, -1748.652587890625, 28.421005249023438),
    new mp.Vector3(-55.16693115234375, -1751.56396484375, 28.421005249023438),
    new mp.Vector3(-119.17330932617188, -1769.6900634765625, 28.85245704650879),
];

let questList = {
    quest_role_0: {
        name: "Иммигрант",
        pos: new mp.Vector3(-415.9264831542969, -2645.4287109375, 6.000219345092773),
        tasks: [
            ["Подработка", "Перенесите 30 ящиков", "$100"],
            ["Work ID", "Получить Work ID в здании правительства", "WorkID 2 уровня"],
        ],
        canSee: () => { return user.getCache('role') === 0 }
    },
    quest_standart: {
        name: "Первые шаги",
        pos: new mp.Vector3(-1373.781494140625, -501.8981018066406, 33.157405853271484),
        tasks: [
            ["Лицензия", "Купить лицензию категории B", "$100"],
            ["Work ID", "Получить Work ID в здании правительства", "$200"],
            ["Первая работа", "Устроиться на работу садовника или разнорабочего", "$200"],
            ["Банк", "Получить банковскую карту в любом из доступных банков", "$200"],
            ["Первый транспорт", "Купить любой транспорт", "$500"],
        ],
        canSee: () => { return true }
    },
    quest_gang: {
        name: "Тёмная сторона",
        pos: new mp.Vector3(-218.75608825683594, -1368.4576416015625, 30.25823402404785),
        tasks: [
            ["E-Coin", "Найти Ламара и получить доступ к консоли", "Доступ к консоли в телефоне"],
            ["Помощь", "Необходимо помочь Ламару", "$200"],
            ["Разведка", "Необходимо помочь Ламару", "$100"],
            ["Перевозка", "Необходимо помочь Ламару", "$500"],
            ["Вопросы", "Узнайте что происходит", "Доступ к криминальным возможностям ECorp"],
            /*["Первое дело", "Угоните транспорт", "$150"],
            ["Только ночью", "Получите наводку у Ламара", "$150"],*/
        ],
        canSee: () => { return true }
    },
};

quest.loadAllBlip = function() {
    quest.getQuestAllNames().forEach(item => {
        if (!quest.getQuestCanSee(item))
            return;

        if (user.getCache(item) >= quest.getQuestLineMax(item))
            return;

        mp.blips.new(280, quest.getQuestPos(item),
        {
            color: 5,
            scale: 0.6,
            drawDistance: 100,
            shortRange: true,
            dimension: -1
        });
    });
};

quest.gang = function(isBot = false, start = -1) {

    if (weather.getHour() < 22 && weather.getHour() > 4) {
        ui.showDialog('Приходи ночью, с 22 до 4 утра', 'Ламар');
        return;
    }

    let qName = 'quest_gang';

    if (start < 0)
        start = user.getCache(qName);

    if (start >= quest.getQuestLineMax(qName))
        return;

    switch (start) {
        case 0: {

            if (phone.getType() == 0) {
                mp.game.ui.notifications.show(`~r~Для того, чтобы начать квест, необходимо иметь телефон`);
                return;
            }
            if (!isBot)
                return;
            user.set(qName, 1);
            setTimeout(function () {
                mp.events.callRemote('server:user:generateCryptoCard');
            }, 500);
            ui.showDialog('Ватсап друг, вот держи ссылку, теперь у тебя есть доступ к приложению E-Corp, мы все сейчас через него работаем, крутая штука. Если подробнее, то открой консоль в телефоне и впиши команду ecorp', 'Ламар');
            break;
        }
        case 1: {

            if (isBoxPut) {
                user.set(qName, 2);
                user.addCashMoney(200, 'Помощь Ламару');

                isBoxPut = false;
                jobPoint.delete();

                mp.game.ui.notifications.show(`~b~Вы выполнили квест ~s~"${quest.getQuestLineName(qName, start)}"~b~, вы получили награду ~s~${quest.getQuestLinePrize(qName, start)}`);

                mp.attachmentMngr.removeLocal('loader');
                user.stopAllAnimation();
                return;
            }

            if (!isBot)
                return;
            isBoxTake = true;
            ui.showDialog('У друга лежит коробка на заднем дворе, мне надо чтобы ты помог её забрать, принесешь сюда, я тебе заплачу', 'Ламар');

            _checkpointId = jobPoint.create(gangTakeBoxPos);
            break;
        }
        case 2: {

            if (isLamar) {
                isLamar = false;
                jobPoint.delete();

                user.set(qName, 3);
                user.addCashMoney(100, 'Помощь Ламару');
                mp.game.ui.notifications.show(`~b~Вы выполнили квест ~s~"${quest.getQuestLineName(qName, start)}"~b~, вы получили награду ~s~${quest.getQuestLinePrize(qName, start)}`);
                return;
            }

            if (!isBot)
                return;
            isLamar = true;
            ui.showDialog('Слушай, можешь зайти в магазин, посмотреть, спит ли продавец', 'Ламар');
            _checkpointId = jobPoint.create(questLamarShop[_currentCheckpointId]);
            break;
        }
        case 3: {

            if (isLamar) {
                isLamar = false;
                jobPoint.delete();

                vehicles.destroy();

                user.set(qName, 4);
                user.addCashMoney(500, 'Помощь Ламару');
                mp.game.ui.notifications.show(`~b~Вы выполнили квест ~s~"${quest.getQuestLineName(qName, start)}"~b~, вы получили награду ~s~${quest.getQuestLinePrize(qName, start)}`);
                return;
            }

            if (!isBot)
                return;
            isLamar = true;
            ui.showDialog('Мне надо чтобы ты отвёз фургон до точки, вот ключи', 'Ламар');
            _checkpointId = jobPoint.create(new mp.Vector3(330.46771240234375, 2615.75439453125, 43.49345016479492), true, 3);
            vehicles.spawnJobCar(-216.03062438964844, -1363.7830810546875, 31.010269165039062, 29.823272705078125, "Speedo4", 0);
            break;
        }
        case 4: {
            user.set(qName, 5);
            ui.showDialog('В общем, вся криминальная жизнь проходит через приложение E-Corp. Люди сами выбирают как будет выглядеть их организация и чем она будет заниматься, но чтобы ты смог в неё попасть или создать свою, тебе необходимо иметь соответсвующую репутацию. Все наводки от меня, у тебя доступны в приложении E-Corp, я буду тебе всё присылать.', 'Ламар');
            break;
        }
    }
};

quest.role0 = function(isBot = false, start = -1) {

    if (user.getCache('role') !== 0)
        return;

    let qName = 'quest_role_0';

    if (start < 0)
        start = user.getCache(qName);

    if (start >= quest.getQuestLineMax(qName))
        return;

    switch (start) {
        case 0: {
            if (!isBot)
                return;
            user.showCustomNotify('Список ваших квестов можно посмотреть через M -> Квесты', 0, 5, 20000);
            ui.showDialog('Привет, я смотрю ты только приехал, у меня для тебя работка есть, уверен лишние деньги тебе не помешают. В общем, необходимо разгрузить 30 ящиков с корабля, как будешь готов, я выдам тебе форму', 'Каспер');
            break;
        }
        case 1: {
            if(user.getCache('work_lic') != '') {
                mp.game.ui.notifications.show(`~b~Вы выполнили квест ~s~"${quest.getQuestLineName(qName, start)}"~b~, вы получили награду ~s~${quest.getQuestLinePrize(qName, start)}`);
                user.set('work_lvl', user.getCache('work_lic') + 1);
                user.set(qName, 2);
                return;
            }
            if (!isBot)
                return;
            ui.showDialog('Ты не плохо справился, езжай теперь к зданию правительства, подойди к стойке регистрации и тебе помогут оформить Word ID', 'Каспер');
            user.setWaypoint(-1379.659, -499.748);
            break;
        }
    }
};

quest.standart = function(isBot = false, start = -1) {

    let qName = 'quest_standart';

    if (start < 0)
        start = user.getCache(qName);

    if (start >= quest.getQuestLineMax(qName))
        return;

    switch (start) {
        case 0: {

            if(user.getCache('b_lic')) {
                mp.game.ui.notifications.show(`~b~Вы выполнили квест ~s~"${quest.getQuestLineName(qName, start)}"~b~, вы получили награду ~s~${quest.getQuestLinePrize(qName, start)}`);
                user.set(qName, 1);
                user.addCashMoney(100);
                quest.standart();
                return;
            }

            if (!isBot)
                return;
            user.showCustomNotify('Список ваших квестов можно посмотреть через M -> Квесты', 0, 5, 20000);
            ui.showDialog('Привет, тебе необходимо сейчас в здании правительства, которое находиться позади меня, оформить лицензию категории B, заодно можешь получить WorkID', 'Сюзанна');
            break;
        }
        case 1: {
            if(user.getCache('work_lic') != '') {
                mp.game.ui.notifications.show(`~b~Вы выполнили квест ~s~"${quest.getQuestLineName(qName, start)}"~b~, вы получили награду ~s~${quest.getQuestLinePrize(qName, start)}`);
                user.set(qName, 2);
                user.addCashMoney(200);
                quest.standart();
                return;
            }
            if (!isBot)
                return;
            ui.showDialog('Теперь тебе необходимо оформить Work ID в здании правительства', 'Сюзанна');
            break;
        }
        case 2: {
            if(user.getCache('job') > 0) {
                mp.game.ui.notifications.show(`~b~Вы выполнили квест ~s~"${quest.getQuestLineName(qName, start)}"~b~, вы получили награду ~s~${quest.getQuestLinePrize(qName, start)}`);
                user.set(qName, 3);
                user.addCashMoney(200);
                quest.standart();
                return;
            }
            if (!isBot)
                return;
            ui.showDialog('Устройся на работу садовника или разнорабочего, чтобы заработать свои первые деньги', 'Сюзанна');
            break;
        }
        case 3: {
            if(user.getCache('bank_card') > 0) {
                mp.game.ui.notifications.show(`~b~Вы выполнили квест ~s~"${quest.getQuestLineName(qName, start)}"~b~, вы получили награду ~s~${quest.getQuestLinePrize(qName, start)}`);
                user.set(qName, 4);
                user.addCashMoney(200);
                quest.standart();
                return;
            }
            if (!isBot)
                return;
            ui.showDialog('Оформи банковскую карту в любом из выбранных тобой банка', 'Сюзанна');
            break;
        }
        case 4: {
            if(user.getCache('car_id1') > 0 || user.getCache('car_id2') > 0 || user.getCache('car_id3') > 0) {
                mp.game.ui.notifications.show(`~b~Вы выполнили квест ~s~"${quest.getQuestLineName(qName, start)}"~b~, вы получили награду в ~s~${quest.getQuestLinePrize(qName, start)}`);
                user.set(qName, 5);
                user.addCashMoney(500);
                quest.standart();
                return;
            }
            if (!isBot)
                return;
            ui.showDialog('Осталось тебе купить транспорт и дело в шляпе!', 'Сюзанна');
            break;
        }
    }
};

quest.getQuestAllNames = function() {
    return questNames;
};

quest.getQuestName = function(type) {
    return questList[type].name;
};

quest.getQuestPos = function(type) {
    return questList[type].pos;
};

quest.getQuestCanSee = function(type) {
    return questList[type].canSee();
};

quest.getQuestLineMax = function(type) {
    return questList[type].tasks.length;
};

quest.getQuestLineName = function(type, lineId) {
    try {
        return questList[type].tasks[lineId][0];
    }
    catch (e) {
    }
    return 'Квест завершён';
};

quest.getQuestLineInfo = function(type, lineId) {
    try {
        return questList[type].tasks[lineId][1];
    }
    catch (e) {
    }
    return 'Квест завершён';
};

quest.getQuestLinePrize = function(type, lineId) {
    try {
        return questList[type].tasks[lineId][2];
    }
    catch (e) {
    }
    return 'Квест завершён';
};

mp.events.add("playerEnterCheckpoint", (checkpoint) => {
    if (_checkpointId == -1 || _checkpointId == undefined)
        return;
    if (checkpoint.id == _checkpointId) {
        if (isBoxTake) {
            isBoxTake = false;
            isBoxPut = true;
            _checkpointId = jobPoint.create(gangPutBoxPos);

            mp.attachmentMngr.addLocal('loader');
            user.playAnimation("anim@heists@box_carry@", "idle", 49);
            mp.game.ui.notifications.show(`~b~Отнестие коробку Ламару`);
        }
        else if (isBoxPut) {
            quest.gang();
        }
        else if (isLamar) {

            if (mp.players.local.vehicle) {
                quest.gang();
                return;
            }

            _currentCheckpointId++;
            if (_currentCheckpointId >= questLamarShop.length) {
                quest.gang();
                return;
            }
            _checkpointId = jobPoint.create(questLamarShop[_currentCheckpointId]);
        }
    }
});

mp.events.add('client:events:dialog:onClose', function () {

});

mp.events.add('client:events:dialog:click', function () {

});

export default quest;