import user from '../user';
import phone from "../phone";
import inventory from "../inventory";

import ui from "../modules/ui";

import jobPoint from "./jobPoint";
import weather from "./weather";

import vehicles from "../property/vehicles";
import methods from "../modules/methods";

let quest = {};

let questNames = [
    'role_0',
    'standart',
    'gang',
    'fish',
    'business',
    /*'work',
    'top',*/
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
    role_0: {
        name: "Иммигрант",
        skin: "s_m_y_dockwork_01",
        skinRot: 316.27508544921875,
        anim: "WORLD_HUMAN_CLIPBOARD",
        pos: new mp.Vector3(-415.9264831542969, -2645.4287109375, 6.000219345092773),
        tasks: [
            ["Подработка", "Перенесите 20 ящиков", "$200", -415, -2645],
            ["Work ID", "Получить Work ID в здании правительства", "Work ID 2 уровня", -1381, -477],
        ],
        canSee: () => { return user.getCache('role') === 0 }
    },
    standart: {
        name: "Первые шаги",
        skin: "a_f_y_business_02",
        skinRot: 277.5157775878906,
        anim: "WORLD_HUMAN_CLIPBOARD",
        pos: new mp.Vector3(-1380.45458984375, -527.6905517578125, 30.6591854095459),
        tasks: [
            ["Лицензия", "Купить лицензию категории B", "$100", -1381, -477],
            ["Work ID", "Получить Work ID в здании правительства", "$200", -1381, -477],
            ["Первая работа", "Устроиться на работу садовника или разнорабочего в здании правительства", "$200", -1381, -477],
            ["Банк", "Получить банковскую карту в любом из доступных банков", "$200", 0, 99],
            ["Урчащий животик", "Купить еду и воду в магазине 24/7", "$200", 0, 98],
            ["Приодеться", "Купить любую одежду", "$200", 0, 97],
            ["Первый транспорт", "Купить любой транспорт", "$500", 1661, 3820],
            ["Кчау", "Поучаствовать в гонках на Maze Bank Arena", "$1500", -255, -2026],
        ],
        canSee: () => { return true }
    },
    gang: {
        name: "Тёмная сторона",
        skin: "ig_lamardavis",
        skinRot: 43.398406982421875,
        anim: "WORLD_HUMAN_SMOKING",
        pos: new mp.Vector3(-218.75608825683594, -1368.4576416015625, 31.25823402404785),
        tasks: [
            ["E-Coin", "Найти Ламара и получить доступ к консоли", "Доступ к консоли в телефоне", -218, -1368],
            ["Помощь", "Все подробности узнайте у Ламара", "$200", -218, -1368],
            ["Разведка", "Все подробности узнайте у Ламара", "$100", -218, -1368],
            ["Перевозка", "Все подробности узнайте у Ламара", "$500", -218, -1368],
            ["Вопросы", "Узнайте что происходит", "Доступ к криминальным возможностям ECorp", -218, -1368],
            /*["Первое дело", "Угоните транспорт", "$150"],
            ["Только ночью", "Получите наводку у Ламара", "$150"],*/
        ],
        canSee: () => { return true }
    },
    fish: {
        name: "Рыболов",
        skin: "",
        skinRot: 0,
        anim: "",
        pos: new mp.Vector3(0, 0, 0),
        tasks: [
            ["Лицензия", "Приобрести лицензию на рыболовство в здании правительства", "$500", -1381, -477],
            ["Удочка", "Купить удочку в рыболовном магазине", "$100", -1599, 5202],
            ["Ловля рыбы", "Поймать 10шт любой рыбы", "$200"],
            ["Сбыт", "Продать рыбу в любом 24/7", "$500", 0, 98],
            ["По-крупному", "Поймать Американская палия 25шт", "Рецепт крафта улучшенной удочки + $1000"],
            ["Крафт", "Скрафтить улучшенную удочку", "$250"],
            ["Макрель", "Поймать Калифорнийский макрель 5шт", "$1500"],
            ["Тунец", "Поймать Желтопёрый тунец 5шт", "$5000"],
        ],
        canSee: () => { return true }
    },
    business: {
        name: "Бизнесмен",
        skin: "",
        skinRot: 0,
        anim: "",
        pos: new mp.Vector3(0, 0, 0),
        tasks: [
            ["Лицензия", "Приобрести лицензию на предпренимательство в здании правительства", "$500", -1381, -477],
            ["В горы", "Купить любой бизнес", "$500", -158, -605],
            ["Выручка", "Снять выручку в размере $10,000 за одну операцию", "$5000", -158, -605],
        ],
        canSee: () => { return true }
    },
    /*work: {
        name: "Работяга",
        skin: "",
        skinRot: 0,
        anim: "",
        pos: new mp.Vector3(0, 0, 0),
        tasks: [
            ["Лицензия", "Приобрести лицензию на предпренимательство в здании правительства", "$500"],
            ["В горы", "Купить любой бизнес", "$500"],
            ["Выручка", "Снять выручку в размере $10,000 за одну операцию", "$1000"],
        ],
        canSee: () => { return true }
    },
    top: {
        name: "Миллионер",
        skin: "",
        skinRot: 0,
        anim: "",
        pos: new mp.Vector3(0, 0, 0),
        tasks: [
            ["Первый шаг", "Иметь на руках ", "$500"],
            ["В горы", "Купить любой бизнес", "$500"],
            ["Выручка", "Снять выручку в размере $10,000 за одну операцию", "$1000"],
        ],
        canSee: () => { return true }
    },*/
};

quest.loadAllBlip = function() {
    quest.getQuestAllNames().forEach(item => {
        try {
            if (!quest.getQuestCanSee(item))
                return;

            if (user.getQuestCount(item) >= quest.getQuestLineMax(item))
                return;

            if (questList[item].skin === '')
                return;

            if (user.getQuestCount(item) > 0) {
                mp.blips.new(280, quest.getQuestPos(item),
                    {
                        color: 5,
                        scale: 0.6,
                        drawDistance: 100,
                        shortRange: true,
                        dimension: -1
                    });
            }
            else {
                mp.blips.new(280, quest.getQuestPos(item),
                    {
                        color: 5,
                        scale: 0.6,
                        drawDistance: 100,
                        shortRange: false,
                        dimension: -1
                    });
            }
        }
        catch (e) {
            methods.debug('LOAD_ALL_QUESTS_BLIPS', e.toString())
        }
    });
};

quest.gang = function(isBot = false, start = -1) {

    try {
        if (weather.getHour() < 22 && weather.getHour() > 4) {
            ui.showDialog('Приходи ночью, с 22 до 4 утра', 'Ламар');
            return;
        }

        let qName = 'gang';

        if (start < 0)
            start = user.getQuestCount(qName);

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
                user.setQuest(qName, 1);
                setTimeout(function () {
                    mp.events.callRemote('server:user:generateCryptoCard');
                }, 500);
                ui.showDialog('Ватсап друг, вот держи ссылку, теперь у тебя есть доступ к приложению E-Corp, мы все сейчас через него работаем, крутая штука. Если подробнее, то открой консоль в телефоне и впиши команду ecorp', 'Ламар');
                break;
            }
            case 1: {

                if (isBoxPut) {
                    user.setQuest(qName, 2);
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

                    user.setQuest(qName, 3);
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

                    user.setQuest(qName, 4);
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
                user.setQuest(qName, 5);
                ui.showDialog('В общем, вся криминальная жизнь проходит через приложение E-Corp. Люди сами выбирают как будет выглядеть их организация и чем она будет заниматься, но чтобы ты смог в неё попасть или создать свою, тебе необходимо иметь соответсвующую репутацию. Все наводки от меня, у тебя доступны в приложении E-Corp, я буду тебе всё присылать.', 'Ламар');
                break;
            }
        }
    }
    catch (e) {
        methods.debug('Q_GANG', e.toString())
    }
};

quest.role0 = function(isBot = false, start = -1) {

    try {
        if (user.getCache('role') !== 0)
            return;

        let qName = 'role_0';

        if (start < 0)
            start = user.getQuestCount(qName);

        if (start >= quest.getQuestLineMax(qName))
            return;

        switch (start) {
            case 0: {
                if (!isBot)
                    return;
                user.showCustomNotify('Список ваших квестов можно посмотреть через M -> Квесты', 0, 5, 20000);
                ui.showDialog('Привет, я смотрю ты только приехал, у меня для тебя работка есть, уверен лишние деньги тебе не помешают. В общем, необходимо разгрузить 20 ящиков с корабля, как будешь готов, я выдам тебе форму', 'Каспер');
                break;
            }
            case 1: {
                if(user.getCache('work_lic') != '') {
                    mp.game.ui.notifications.show(`~b~Вы выполнили квест ~s~"${quest.getQuestLineName(qName, start)}"~b~, вы получили награду ~s~${quest.getQuestLinePrize(qName, start)}`);
                    user.set('work_lvl', user.getCache('work_lic') + 1);
                    user.setQuest(qName, 2);
                    return;
                }
                if (!isBot)
                    return;
                ui.showDialog('Ты не плохо справился, езжай теперь к зданию правительства, подойди к стойке регистрации и тебе помогут оформить Word ID', 'Каспер');
                user.setWaypoint(-1379.659, -499.748);
                break;
            }
        }
    }
    catch (e) {
        methods.debug('Q_ROLE', e.toString());
    }
};

quest.standart = function(isBot = false, start = -1, done = 0) {

    try {
        let qName = 'standart';

        if (start < 0)
            start = user.getQuestCount(qName);

        if (start >= quest.getQuestLineMax(qName))
            return;

        switch (start) {
            case 0: {

                if(user.getCache('b_lic')) {
                    mp.game.ui.notifications.show(`~b~Вы выполнили квест ~s~"${quest.getQuestLineName(qName, start)}"~b~, вы получили награду ~s~${quest.getQuestLinePrize(qName, start)}`);
                    user.setQuest(qName, start + 1);
                    user.addCashMoney(100);
                    quest.standart();
                    return;
                }

                if (!isBot)
                    return;
                user.showCustomNotify('Список ваших квестов можно посмотреть через M -> Квесты', 0, 5, 20000);
                ui.showDialog('Привет, тебе необходимо сейчас в здании правительства, которое находиться позади меня, оформить лицензию категории B, заодно можешь получить WorkID. И да, не забудь экипировать телефон, он у тебя в инвентаре.', 'Сюзанна');
                break;
            }
            case 1: {
                if(user.getCache('work_lic') != '') {
                    mp.game.ui.notifications.show(`~b~Вы выполнили квест ~s~"${quest.getQuestLineName(qName, start)}"~b~, вы получили награду ~s~${quest.getQuestLinePrize(qName, start)}`);
                    user.setQuest(qName, start + 1);
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
                    user.setQuest(qName, start + 1);
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
                    user.setQuest(qName, start + 1);
                    user.addCashMoney(200);
                    quest.standart();
                    return;
                }
                if (!isBot)
                    return;
                ui.showDialog('Оформи банковскую карту в любом из выбранных тобой банка', 'Сюзанна');
                break;
            }
            case 4:
            case 5: {
                if (done === start) {
                    mp.game.ui.notifications.show(`~b~Вы выполнили квест ~s~"${quest.getQuestLineName(qName, start)}"~b~, вы получили награду в ~s~${quest.getQuestLinePrize(qName, start)}`);
                    user.setQuest(qName, start + 1);
                    user.addCashMoney(200);
                    quest.standart();
                    return;
                }
                if (!isBot)
                    return;
                ui.showDialog(quest.getQuestLineInfo(qName, start), 'Сюзанна');
                break;
            }
            case 6: {
                if(user.getCache('car_id1') > 0 || user.getCache('car_id2') > 0 || user.getCache('car_id3') > 0) {
                    mp.game.ui.notifications.show(`~b~Вы выполнили квест ~s~"${quest.getQuestLineName(qName, start)}"~b~, вы получили награду в ~s~${quest.getQuestLinePrize(qName, start)}`);
                    user.setQuest(qName, start + 1);
                    user.addCashMoney(500);
                    quest.standart();
                    return;
                }
                if (!isBot)
                    return;
                ui.showDialog('Осталось тебе купить транспорт и дело в шляпе!', 'Сюзанна');
                break;
            }
            case 7: {
                if (done === start) {
                    mp.game.ui.notifications.show(`~b~Вы выполнили квест ~s~"${quest.getQuestLineName(qName, start)}"~b~, вы получили награду в ~s~${quest.getQuestLinePrize(qName, start)}`);
                    user.setQuest(qName, start + 1);
                    user.addCashMoney(1500);
                    quest.standart();
                    return;
                }
                if (!isBot)
                    return;
                ui.showDialog(quest.getQuestLineInfo(qName, start), 'Сюзанна');
                break;
            }
        }
    }
    catch (e) {
        methods.debug('Q_ST', e.toString());
    }
};

quest.fish = function(isBot = false, start = -1, done = 0) {

    try {
        let qName = 'fish';

        if (start < 0)
            start = user.getQuestCount(qName);

        if (start >= quest.getQuestLineMax(qName))
            return;

        switch (start) {
            case 0: {
                if(user.getCache('fish_lic')) {
                    mp.game.ui.notifications.show(`~b~Вы выполнили квест ~s~"${quest.getQuestLineName(qName, start)}"~b~, вы получили награду ~s~${quest.getQuestLinePrize(qName, start)}`);
                    user.setQuest(qName, start + 1);
                    user.addCashMoney(500);
                    return;
                }
                break;
            }
            case 1: {
                if(done === start) {
                    mp.game.ui.notifications.show(`~b~Вы выполнили квест ~s~"${quest.getQuestLineName(qName, start)}"~b~, вы получили награду ~s~${quest.getQuestLinePrize(qName, start)}`);
                    user.setQuest(qName, start + 1);
                    user.addCashMoney(100);
                    return;
                }
                break;
            }
            case 2: {
                if(done === start) {
                    let qParams = user.getQuestParams(qName);
                    if (methods.parseInt(qParams[0]) === 10) {
                        mp.game.ui.notifications.show(`~b~Вы выполнили квест ~s~"${quest.getQuestLineName(qName, start)}"~b~, вы получили награду ~s~${quest.getQuestLinePrize(qName, start)}`);
                        user.setQuest(qName, start + 1);
                        user.addCashMoney(200);
                    }
                    else {
                        qParams[0] = methods.parseInt(qParams[0]) + 1;
                        user.setQuest(qName, start, qParams);
                        mp.game.ui.notifications.show(`Квест\n~b~Вы поймали: ${qParams[0]}шт рыбы`);
                    }
                    return;
                }
                break;
            }
            case 3: {
                if(done === start) {
                    mp.game.ui.notifications.show(`~b~Вы выполнили квест ~s~"${quest.getQuestLineName(qName, start)}"~b~, вы получили награду ~s~${quest.getQuestLinePrize(qName, start)}`);
                    user.setQuest(qName, start + 1);
                    user.addCashMoney(200);
                    return;
                }
                break;
            }
            case 4: {
                if(done === start) {
                    let qParams = user.getQuestParams(qName);
                    if (methods.parseInt(qParams[1]) === 25) {
                        mp.game.ui.notifications.show(`~b~Вы выполнили квест ~s~"${quest.getQuestLineName(qName, start)}"~b~, вы получили награду ~s~${quest.getQuestLinePrize(qName, start)}`);
                        user.setQuest(qName, start + 1);
                        user.addCashMoney(1000);
                        inventory.addItem(474, 1, 1, user.getCache('id'), 1, 0, JSON.stringify({id:3}));
                    }
                    else {
                        qParams[1] = methods.parseInt(qParams[1]) + 1;
                        user.setQuest(qName, start, qParams);
                        mp.game.ui.notifications.show(`Квест\n~b~Вы поймали: ${qParams[1]}шт американская палии`);
                    }
                    return;
                }
                break;
            }
            case 5: {
                if(done === start) {
                    mp.game.ui.notifications.show(`~b~Вы выполнили квест ~s~"${quest.getQuestLineName(qName, start)}"~b~, вы получили награду ~s~${quest.getQuestLinePrize(qName, start)}`);
                    user.setQuest(qName, start + 1);
                    user.addCashMoney(250);
                    return;
                }
                break;
            }
            case 6: {
                let qParams = user.getQuestParams(qName);
                if (methods.parseInt(qParams[2]) === 5) {
                    mp.game.ui.notifications.show(`~b~Вы выполнили квест ~s~"${quest.getQuestLineName(qName, start)}"~b~, вы получили награду ~s~${quest.getQuestLinePrize(qName, start)}`);
                    user.setQuest(qName, start + 1);
                    user.addCashMoney(1500);
                }
                else {
                    qParams[2] = methods.parseInt(qParams[2]) + 1;
                    user.setQuest(qName, start, qParams);
                    mp.game.ui.notifications.show(`Квест\n~b~Вы поймали: ${qParams[2]}шт американская палии`);
                }
                break;
            }
            case 7: {
                let qParams = user.getQuestParams(qName);
                if (methods.parseInt(qParams[3]) === 5) {
                    mp.game.ui.notifications.show(`~b~Вы выполнили квест ~s~"${quest.getQuestLineName(qName, start)}"~b~, вы получили награду ~s~${quest.getQuestLinePrize(qName, start)}`);
                    user.setQuest(qName, start + 1);
                    user.addCashMoney(5000);
                }
                else {
                    qParams[3] = methods.parseInt(qParams[3]) + 1;
                    user.setQuest(qName, start, qParams);
                    mp.game.ui.notifications.show(`Квест\n~b~Вы поймали: ${qParams[3]}шт американская палии`);
                }
                break;
            }
        }
    }
    catch (e) {
        methods.debug('Q_FISH', e.toString());
    }
};

quest.business = function(isBot = false, start = -1, done = 0) {

    try {
        let qName = 'business';

        if (start < 0)
            start = user.getQuestCount(qName);

        if (start >= quest.getQuestLineMax(qName))
            return;

        switch (start) {
            case 0: {
                if(user.getCache('biz_lic')) {
                    mp.game.ui.notifications.show(`~b~Вы выполнили квест ~s~"${quest.getQuestLineName(qName, start)}"~b~, вы получили награду ~s~${quest.getQuestLinePrize(qName, start)}`);
                    user.setQuest(qName, start + 1);
                    user.addCashMoney(500);
                    return;
                }
                break;
            }
            case 1: {
                if(user.getCache('business_id') > 0) {
                    mp.game.ui.notifications.show(`~b~Вы выполнили квест ~s~"${quest.getQuestLineName(qName, start)}"~b~, вы получили награду ~s~${quest.getQuestLinePrize(qName, start)}`);
                    user.setQuest(qName, start + 1);
                    user.addCashMoney(500);
                    return;
                }
                break;
            }
            case 2: {
                if(done === start) {
                    mp.game.ui.notifications.show(`~b~Вы выполнили квест ~s~"${quest.getQuestLineName(qName, start)}"~b~, вы получили награду ~s~${quest.getQuestLinePrize(qName, start)}`);
                    user.setQuest(qName, start + 1);
                    user.addCashMoney(5000);
                    return;
                }
                break;
            }
        }
    }
    catch (e) {
        methods.debug('Q_BIZ', e.toString());
    }
};

quest.getQuestAllNames = function() {
    return questNames;
};

quest.getQuestAll = function() {
    return questList;
};

quest.getQuestName = function(type) {
    try {
        return questList[type].name;
    }
    catch (e) {}
    return '';
};

quest.getQuestPos = function(type) {
    try {
        return questList[type].pos;
    }
    catch (e) {}
    return new mp.Vector3(0,0,0);
};

quest.getQuestCanSee = function(type) {
    try {
        return questList[type].canSee();
    }
    catch (e) {}
    return false;
};

quest.getQuestLineMax = function(type) {
    try {
        return questList[type].tasks.length;
    }
    catch (e) {}
    return 0;
};

quest.getQuestLineName = function(type, lineId) {
    try {
        return questList[type].tasks[lineId][0];
    }
    catch (e) {}
    return 'Квест завершён';
};

quest.getQuestLinePos = function(type, lineId) {
    try {
        return {x: methods.parseInt(questList[type].tasks[lineId][3]), y: methods.parseInt(questList[type].tasks[lineId][4])};
    }
    catch (e) {}
    return {x: 0, y: 0};
};

quest.getQuestLineInfo = function(type, lineId) {
    try {
        return questList[type].tasks[lineId][1];
    }
    catch (e) {}
    return 'Квест завершён';
};

quest.getQuestLinePrize = function(type, lineId) {
    try {
        return questList[type].tasks[lineId][2];
    }
    catch (e) {}
    return 'Квест завершён';
};

mp.events.add("playerEnterCheckpoint", (checkpoint) => {
    try {
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
    }
    catch (e) {
        
    }
});

mp.events.add('client:events:dialog:onClose', function () {

});

mp.events.add('client:events:dialog:click', function () {

});

export default quest;