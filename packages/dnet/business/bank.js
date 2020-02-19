let methods = require('../modules/methods');
let Container = require('../modules/data');
let mysql = require('../modules/mysql');

let business = require('../property/business');

let weather = require('../managers/weather');

let user = require('../user');
let coffer = require('../coffer');
let inventory = require('../inventory');

let bank = exports;

bank.markers = [
    [253.4611, 220.7204, 106.2865, 2],
    [251.749, 221.4658, 106.2865, 2],
    [248.3227, 222.5736, 106.2867, 2],
    [246.4875, 223.2582, 106.2867, 2],
    [243.1434, 224.4678, 106.2868, 2],
    [241.1435, 225.0419, 106.2868, 2],

    [148.5, -1039.971, 29.37775, 3],
    [1175.054, 2706.404, 38.09407, 3],
    [-1212.83, -330.3573, 37.78702, 3],
    [314.3541, -278.5519, 54.17077, 3],
    [-2962.951, 482.8024, 15.7031, 3],
    [-350.6871, -49.60739, 49.04258, 3],

    [-111.1722, 6467.846, 31.62671, 4],
    [-113.3064, 6469.969, 31.62672, 4]
];
bank.fleecaMarkers = [
    [148.5, -1039.971, 29.37775],
    [1175.054, 2706.404, 38.09407],
    [-1212.83, -330.3573, 37.78702],
    [-2962.951, 482.8024, 14.7031],
    [-350.6871, -49.60739, 48.04258],
    [314.3541, -278.5519, 54.17077]
];
bank.blainePos = new mp.Vector3(-110.9777, 6470.198, 31.62671);
bank.pacificPos = new mp.Vector3(235.5093, 216.8752, 106.2867);
bank.mazePos = new mp.Vector3(-66.66476, -802.0474, 44.22729);

let pos1 = new mp.Vector3(592.0863037109375, -3280.79931640625, 5.069560527801514);

bank.grabPos = [
    [265.7952, 213.5179, 100.6834, 1000],
    [148.2362, -1050.56, 28.34637, 200],
    [312.5701, -288.8269, 53.14306, 200],
    [ -352.3924, -59.68721, 48.01485, 200],
    //[-2952.724, 484.4081, 14.67539, 500],
    [1173.16, 2716.468, 37.0663, 200],
    [591.1983642578125, -3276.912353515625, 5.069560527801514, 500]
];

bank.doorPos = [
    [961976194, 255.2283, 223.976, 102.3932],
    [2121050683, 148.0266, -1044.364, 29.506930],
    [2121050683, 312.358, -282.7301, 54.30365],
    [2121050683, -352.7365, -53.57248, 49.17543],
    //[2121050683, -2958.538, 482.2705, 15.83594],
    [2121050683, 1175.542, 2710.861, 38.22689]
];

bank.bombPos = [
    [254.0034, 225.1687, 100.8757],
    [147.2123, -1044.969, 28.36802],
    [311.5067, -283.4736, 53.16475],
    [-353.559, -54.34758, 48.03654],
    //[-2957.552, 481.6652, 14.69703],
    [1175.989, 2711.895, 37.088]
];

bank.loadAll = function() {
    methods.debug('bank.loadAll');

    methods.createBlip(bank.pacificPos, 374, 65, 0.8, 'Bank - Pacific Standard');
    methods.createBlip(bank.blainePos, 374, 67, 0.8, 'Bank - Blaine County Savings');
    methods.createBlip(bank.mazePos, 374, 59, 0.8, 'Bank - Maze');

    //methods.createStaticCheckpointV(pos1, "~y~Место для ограбления C4", 2, -1, [33, 150, 243, 100], 0.3);

    bank.fleecaMarkers.forEach(function (item) {
        let bankPos = new mp.Vector3(item[0], item[1], item[2]);
        methods.createBlip(bankPos, 374, 69, 0.8, 'Bank - Fleeca');
    });

    bank.markers.forEach(function (item) {
        let bankPos = new mp.Vector3(item[0], item[1], item[2] - 1);
        methods.createStaticCheckpointV(bankPos, "Нажмите ~g~Е~s~ чтобы открыть меню");
    });

    /*bank.bombPos.forEach(function (item) {
        let bankPos = new mp.Vector3(item[0], item[1], item[2]);
        methods.createStaticCheckpointV(bankPos, "~y~Место для установки взрывчатки", 1, -1, [0,0,0,0]);
    });

    let idx = 0;
    bank.grabPos.forEach(function (item) {
        try {
            let bankPos = new mp.Vector3(item[0], item[1], item[2]);
            methods.createStaticCheckpointV(bankPos, "~y~Место для ограбления", 2, -1, [33, 150, 243, 100], 0.3);
            idx++;
        }
        catch (e) {
            methods.debug(e);
        }
    });*/

    methods.debug('LOAD ALL BANKS');
};

bank.loadGrabCounts = function() {
    try {
        for (let i = 0; i < 5; i++)
            if (i == 0)
                bank.grabPos[i][3] = 1000;
            else if (i == 5)
                bank.grabPos[i][3] = 500;
            else
                bank.grabPos[i][3] = 200;
    }
    catch (e) {
        methods.debug(e);
    }
};

bank.addBankHistory = function(userId, card, text, price) {

    userId = methods.parseInt(userId);
    card = methods.parseInt(card);
    text = methods.removeQuotes(text);
    price = methods.parseFloat(price);

    let rpDateTime = weather.getRpDateTime();
    let timestamp = methods.getTimeStamp();

    mysql.executeQuery(`INSERT INTO log_bank_user (user_id, card, text, price, timestamp, rp_datetime) VALUES ('${userId}', '${card}', '${text}', '${price}', '${timestamp}', '${rpDateTime}')`);
};

bank.transferMoney = function(player, bankNumber, money) {
    methods.debug('bank.transferMoney');
    if (!user.isLogin(player))
        return;

    if (money < 1) {
        player.notify('~r~Сумма должна быть больше нуля');
        user.updateClientCache(player);
        return;
    }
    if (bankNumber < 1) {
        player.notify('~r~Номер карты должен быть больше нуля');
        user.updateClientCache(player);
        return;
    }

    if (user.getBankMoney(player) < money) {
        player.notify('~r~У Вас недостаточно средств');
        user.updateClientCache(player);
        return;
    }

    let sumForBiz = methods.parseInt(money * 0.005);
    let sumFinal = methods.parseInt(money * 0.99);

    let isOnline = false;
    let isEquip = false;

    methods.saveLog('GiveBank', `${user.getRpName(player)} (${user.getId(player)}) [${user.get(player, 'bank_card')}] to ${bankNumber} count $${money}`);

    mp.players.forEach((pl) => {
        if (!user.isLogin(pl))
            return;
        if (user.get(pl, 'bank_card') == bankNumber) {
            isOnline = true;

            bank.addBusinessBankMoneyByCard(bankNumber, sumForBiz);
            bank.addBusinessBankMoneyByCard(user.getBankCardPrefix(player), sumForBiz);

            user.sendSmsBankOperation(player, 'Перевод: ~g~$' + methods.numberFormat(sumFinal));
            user.sendSmsBankOperation(pl, 'Зачисление: ~g~$' + methods.numberFormat(sumFinal));
            user.removeBankMoney(player, money, 'Перевод ' + bankNumber);
            user.addBankMoney(pl, sumFinal, 'Перевод от ' + user.get(player, 'bank_card'));

            user.save(pl);
            user.save(player);
        }
    });

    if (!isOnline) {

        mysql.executeQuery(`SELECT * FROM users WHERE bank_card = ${bankNumber}`, function (err, rows, fields) {
            rows.forEach(function (item) {

                bank.addBusinessBankMoneyByCard(bankNumber, sumForBiz);
                bank.addBusinessBankMoneyByCard(user.getBankCardPrefix(player), sumForBiz);

                user.sendSmsBankOperation(player, 'Перевод: ~g~$' + methods.numberFormat(sumFinal));
                user.removeBankMoney(player, money, 'Перевод ' + bankNumber);
                bank.addBankHistory(0, bankNumber, 'Перевод от ' + user.get(player, 'bank_card'), sumFinal);

                mysql.executeQuery("UPDATE users SET money_bank = '" + (item["money_bank"] + sumFinal) + "' where id = '" + item["id"] + "'");
                isEquip = true;
            });
        });

        if (!isEquip) {

            mysql.executeQuery(`SELECT * FROM items WHERE params LIKE '%"number": ${bankNumber}%'`, function (err, rows, fields) {
                rows.forEach(function (item) {

                    bank.addBusinessBankMoneyByCard(bankNumber, sumForBiz);
                    bank.addBusinessBankMoneyByCard(user.getBankCardPrefix(player), sumForBiz);

                    user.sendSmsBankOperation(player, 'Перевод: ~g~$' + methods.numberFormat(sumFinal));
                    user.removeBankMoney(player, money, 'Перевод ' + bankNumber);
                    bank.addBankHistory(0, bankNumber, 'Перевод от ' + user.get(player, 'bank_card'), sumFinal);

                    mysql.executeQuery("UPDATE items SET count = '" + (item["count"] + sumFinal) + "' where id = '" + item["id"] + "'");
                    isEquip = true;
                });

                if (!isOnline && !isEquip)
                    user.sendSmsBankOperation(player, 'Счёт не был найден', '~r~Ошибка перевода');
            });
        }
    }

    user.updateClientCache(player);
};

bank.changePin = function(player, pin) {
    methods.debug('bank.changePin');
    if (!user.isLogin(player))
        return;

    let bankNumber = user.get(player, 'bank_card');
    mysql.executeQuery(`SELECT * FROM items WHERE params LIKE '%"number": ${bankNumber}%'`, function (err, rows, fields) {
        rows.forEach(function (item) {
            if (user.isLogin(player)) {
                user.set(player, 'bank_pin', pin);
                let params = JSON.parse(item['params']);
                params.pin = pin;
                inventory.updateItemParams(item['id'], JSON.stringify(params));

                bank.addBankHistory(user.getId(player), bankNumber, 'Смена пинкода', 0);
                user.sendSmsBankOperation(player, 'Вы успешно сменили пинкод', 'Смена пинкода');
                user.save(player);
            }
        });
    });

};

/*bank.changeCardNumber = function(player, bankNumber) {
    methods.debug('bank.changeCardNumber');
    if (!user.isLogin(player))
        return;

    let money = 100000;

    if (user.getCashMoney(player) < money) {
        player.notify('~r~У Вас недостаточно средств');
        return;
    }
    if (bankNumber < 9999) {
        player.notify('~r~Номер карты должен быть больше 4-х цифр');
        return;
    }


    let bankPrefix = user.get(player, 'bank_prefix');

    mysql.executeQuery(`SELECT * FROM users WHERE bank_number = ${bankNumber} AND bank_prefix = ${bankPrefix}`, function (err, rows, fields) {
        if (rows.length === 0) {
            mysql.executeQuery(`SELECT * FROM items WHERE number = ${bankNumber} AND prefix = ${bankPrefix}`, function (err, rows, fields) {
                if (rows.length === 0) {
                    user.set(player, 'bank_number', bankNumber);
                    user.removeCashMoney(player, money);
                    bank.addBusinessBankMoneyByCard(bankPrefix, money);
                    user.sendSmsBankOperation(player, 'Ваш номер карты был изменён');
                    user.save(player);
                }
                else
                    user.sendSmsBankOperation(player, 'Номер карты уже существует', '~r~Ошибка');
            });
        }
        else
            user.sendSmsBankOperation(player, 'Номер карты уже существует', '~r~Ошибка');
    });
};*/

bank.withdraw = function(player, money, procent = 0) {
    methods.debug('bank.withdraw');

    //setTimeout(function () {

    procent = methods.parseInt(procent);
    if (!user.isLogin(player))
        return;

    if (money < 1) {
        player.notify('~r~Сумам должна быть больше нуля');
        return;
    }

    if (user.getBankMoney(player) < money) {
        player.notify('~r~У Вас недостаточно средств');
        return;
    }

    if (procent == 0) {
        user.sendSmsBankOperation(player, 'Вывод: ~g~$' + methods.numberFormat(money));
        user.addCashMoney(player, money, 'Вывод средств через отделение банка');
        user.removeBankMoney(player, money, 'Вывод средств через отделение банка');
    }
    else {
        let sum = methods.parseInt(money * ((100 - procent) / 100));
        let sumBank = methods.parseInt(money * (procent / 100));

        user.sendSmsBankOperation(player, 'Вывод: ~g~$' + methods.numberFormat(sum));
        bank.addBusinessBankMoneyByCard(user.getBankCardPrefix(player), sumBank);
        user.addCashMoney(player, sum, 'Вывод средств через банкомат');
        user.removeBankMoney(player, money, 'Вывод средств через банкомат');
    }
    user.save(player);
    //}, 1500);
};

bank.deposit = function(player, money, procent = 0) {
    methods.debug('bank.deposit');
    procent = methods.parseInt(procent);
    if (!user.isLogin(player))
        return;

    if (money < 1) {
        player.notify('~r~Сумам должна быть больше нуля');
        return;
    }

    if (user.getCashMoney(player) < money) {
        player.notify('~r~У Вас недостаточно средств');
        return;
    }

    if (procent == 0) {
        user.sendSmsBankOperation(player, 'Зачисление: ~g~$' + methods.numberFormat(money));
        user.addBankMoney(player, money, 'Зачисление в отделении банка');
        user.removeCashMoney(player, money, 'Зачисление в отделении банка');
    }
    else {
        let sum = methods.parseInt(money * ((100 - procent) / 100));
        let sumBank = methods.parseInt(money * (procent / 100));

        user.sendSmsBankOperation(player, 'Зачисление: ~g~$' + methods.numberFormat(sum));
        bank.addBusinessBankMoneyByCard(user.getBankCardPrefix(player), sumBank);
        user.addBankMoney(player, sum, 'Зачисление через банкомат');
        user.removeCashMoney(player, money, 'Зачисление через банкомат');
    }
    user.save(player);
};

bank.addBusinessBankMoneyByCard = function(prefix, money) {
    methods.debug('bank.addBusinessBankMoneyByCard');
    switch (prefix)
    {
        case 6000:
            business.addMoney(1, money);
            break;
        case 7000:
            business.addMoney(2, money);
            break;
        case 8000:
            business.addMoney(3, money);
            break;
        case 9000:
            business.addMoney(4, money);
            break;
        default:
            coffer.addMoney(money);
            break;
    }
};

bank.openCard = function(player, bankId, price) {
    methods.debug('bank.openCard');
    if (!user.isLogin(player))
        return;

    if (user.getMoney(player) < price) {
        player.notify('~r~У Вас недостаточно средств');
        return;
    }

    if (!business.isOpen(bankId)) {
        player.notify('~r~К сожалению у банка сейчас нет возможности выдать Вам карту.');
        return;
    }

    if (price < 0)
        return;

    let bankPrefix = 6000;

    switch (bankId)
    {
        case 1:
            bankPrefix = 6000;
            break;
        case 2:
            bankPrefix = 7000;
            break;
        case 3:
            bankPrefix = 8000;
            break;
        case 4:
            bankPrefix = 9000;
            break;
    }

    let number = methods.getRandomBankCard(bankPrefix);

    methods.saveLog('BuyCardNumber', `${user.getRpName(player)} (${user.getId(player)}): ${number}`);

    user.removeCashMoney(player, price, 'Смена номера карты');
    business.addMoney(bankId, price);
    business.removeMoneyTax(bankId, price / business.getPrice(bankId));

    bank.sendSmsBankOpenOperation(player);
    bank.addBankHistory(user.getId(player), number, 'Открытие счёта на имя ' + user.getRpName(player), price * -1);

    inventory.addItem(50, 1, 1, user.getId(player), 0, 0, `{"number": ${number}, "pin": 1234, "owner": "${user.getRpName(player)}"}`);

    player.notify('~g~Вы оформили карту, она лежит в инвентаре, экипируйте её');
    player.notify('~g~Ваш пинкод от карты:~s~ 1234');
};

bank.closeCard = function(player) {
    methods.debug('bank.closeCard');
    if (!user.isLogin(player))
        return;
    bank.sendSmsBankCloseOperation(player);

    let number = user.get(player, 'bank_card');
    user.set(player, 'bank_card', 0);
    let currentBankMoney = user.getBankMoney(player);
    user.removeBankMoney(player, currentBankMoney);
    bank.addBankHistory(user.getId(player), number, 'Закрытие счёта', 0);
    user.addCashMoney(player, currentBankMoney);

    mysql.executeQuery(`DELETE FROM items WHERE params LIKE '%"number": ${number}%'`);
    //inventory.updateItemsEquipByItemId(50, user.getId(player), 1, 0);
};

bank.sendSmsBankCloseOperation = function(player) {
    user.sendSmsBankOperation(player, 'Ваш счёт в банке был закрыт. СМС оповещения были отключены, всего Вам хорошего!');
};

bank.sendSmsBankOpenOperation = function(player) {
    user.sendSmsBankOperation(player, 'Поздравляем с открытием счёта! Надеемся на долгое сотрудничество!');
};

bank.getInRadius = function(pos, radius = 2) {
    let stationId = -1;
    bank.markers.forEach(function (item) {
        let fuelStationShopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(pos, fuelStationShopPos) < radius)
            stationId = methods.parseInt(item[3]);
    });
    return stationId;
};

bank.getGrabInRadius = function(pos, radius = 5) {
    let idx = 0;
    let result = -1;
    bank.grabPos.forEach(function (item) {
        let fuelStationShopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(pos, fuelStationShopPos) < radius)
            result = idx;
        idx++;
    });
    return result;
};

bank.getBombInRadius = function(pos, radius = 2) {
    let idx = 0;
    let result = -1;
    bank.bombPos.forEach(function (item) {
        let fuelStationShopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(pos, fuelStationShopPos) < radius)
            result = idx;
        idx++;
    });
    return result;
};

bank.checkPosForOpenMenu = function(player) {
    methods.debug('bank.checkPosForOpenMenu');
    try {
        let playerPos = player.position;
        let shopId = bank.getInRadius(playerPos, 2);
        if (shopId == -1) {
            return;
        }
        player.call('client:menuList:showBankMenu', [shopId, business.getPrice(shopId)]);
    }
    catch (e) {
        methods.debug(e);
    }
};

bank.findNearest = function(pos) {
    methods.debug('bank.findNearest');
    let prevPos = new mp.Vector3(9999, 9999, 9999);
    bank.markers.forEach(function (item,) {
        let fuelPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(fuelPos, pos) < methods.distanceToPos(prevPos, pos))
            prevPos = fuelPos;
    });
    return prevPos;
};

bank.findNearestFleeca = function(pos) {
    methods.debug('bank.findNearestFleeca');
    let prevPos = new mp.Vector3(9999, 9999, 9999);
    bank.fleecaMarkers.forEach(function (item,) {
        let fuelPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(fuelPos, pos) < methods.distanceToPos(prevPos, pos))
            prevPos = fuelPos;
    });
    return prevPos;
};