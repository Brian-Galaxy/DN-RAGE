let methods = require('../modules/methods');
let mysql = require('../modules/mysql');
let Container = require('../modules/data');

let user = require('../user');

let vSync = require('../managers/vSync');

let vehicles = require('../property/vehicles');
let business = require('../property/business');

let lsc = exports;

lsc.carPos = [[-1159.827,-2015.182,12.16598,338.3167],[-330.8568,-137.6985,38.00612,95.85743],[732.1998,-1088.71,21.15658,89.10553],[-222.6972,-1329.915,29.87796,269.8108],[1174.876,2640.67,36.7454,0.5306945],[110.3291,6626.977,30.7735,223.695],[-147.4434,-599.0691,166.0058,315.3235],[481.2153,-1317.698,28.09073,296.715]];
lsc.list = [[-1148.878,-2000.123,12.18026,14],[-347.0815,-133.3432,38.00966,54],[726.0679,-1071.613,27.31101,55],[-207.0201,-1331.493,33.89437,56],[1187.764,2639.15,37.43521,57],[101.0262,6618.267,31.43771,71],[-146.2072,-584.2731,166.0002,121],[472.2666,-1310.529,28.22178,123]];

lsc.loadAll = function() {
    methods.debug('lsc.loadAll');
    lsc.list.forEach(function (item) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        methods.createBlip(shopPos, 446, 0, 0.6, 'Автомастерская');
    });

    lsc.carPos.forEach(function (item) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        let cId = methods.createStaticCheckpoint(shopPos.x, shopPos.y, shopPos.z, "~b~Нажмите ~s~L.ALT~b~ чтобы открыть меню тюнинга", 4, -1, [33, 150, 243, 100], 0.3);

        Container.Data.Set(999999, 'resetTunning' + cId, true);
    });
};

lsc.getInRadius = function(pos, radius = 2) {
    methods.debug('lsc.getInRadius');
    let shopId = -1;
    lsc.list.forEach(function (item, idx) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(pos, shopPos) < radius)
            shopId = methods.parseInt(item[3]);
    });
    return shopId;
};

lsc.checkPosForOpenMenu = function(player) {
    methods.debug('lsc.checkPosForOpenMenu');
    try {
        let playerPos = player.position;
        let shopId = -1;
        lsc.carPos.forEach(function (item, i) {
            let shopPos = new mp.Vector3(item[0], item[1], item[2]);
            if (methods.distanceToPos(playerPos, shopPos) < 2) {
                shopId = methods.parseInt(lsc.list[i][3]);

                try {
                    player.call('client:menuList:showLscMenu', [shopId, business.getPrice(shopId)]);
                }
                catch (e) {
                    methods.debug(e);
                }
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

lsc.findNearest = function(pos) {
    methods.debug('lsc.findNearest');
    let prevPos = new mp.Vector3(9999, 9999, 9999);
    lsc.list.forEach(function (item,) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(shopPos, pos) < methods.distanceToPos(prevPos, pos))
            prevPos = shopPos;
    });
    return prevPos;
};

lsc.repair = function(player, price, shopId) {
    methods.debug('lsc.repair');
    if (!user.isLogin(player))
        return;
    let veh = player.vehicle;
    if (!vehicles.exists(veh))
        return;

    if (user.getMoney(player) < price) {
        player.notify('~r~У вас недостаточно средств');
        return;
    }

    if (price < 1)
        return;

    veh.repair();
    user.removeMoney(player, price);
    business.addMoney(shopId, price, 'Ремонт транспорта');

    player.notify('~g~Вы отремонтировали трансопрт');

};

lsc.buyNeon = function(player, price, shopId) {
    methods.debug('lsc.buyNeon');
    if (!user.isLogin(player))
        return;
    let veh = player.vehicle;
    if (!vehicles.exists(veh))
        return;

    if (user.getMoney(player) < price) {
        player.notify('~r~У вас недостаточно средств');
        return;
    }

    if (price < 1)
        return;

    if (veh.getVariable('user_id') < 1) {
        player.notify('~r~Транспорт должен быть личный');
        return;
    }
    if (veh.getVariable('user_id') != user.getId(player)) {
        player.notify('~r~Это должен быть ваш транспорт');
        return;
    }

    if (veh.getVariable('user_id') < 1) {
        player.notify('~r~Транспорт должен быть личный');
        return;
    }
    if (veh.getVariable('user_id') != user.getId(player)) {
        player.notify('~r~Это должен быть ваш транспорт');
        return;
    }
    if (vehicles.get(veh.getVariable('container'), 'neon_r') > 0) {
        player.notify('~r~На транспорте уже установлен неон');
        return;
    }

    vehicles.set(veh.getVariable('container'), 'neon_r', 255);
    vehicles.set(veh.getVariable('container'), 'neon_g', 255);
    vehicles.set(veh.getVariable('container'), 'neon_b', 255);

    vehicles.neonStatus(player, veh);
    veh.neonEnabled = true;

    user.removeMoney(player, price);
    business.addMoney(shopId, price, 'Неоновая подсветка');

    player.notify('~g~Вы установили неон');

    user.save(player);
    vehicles.save(veh.getVariable('container'));
};

lsc.buySpecial = function(player, price, shopId) {
    methods.debug('lsc.buyNeon');
    if (!user.isLogin(player))
        return;
    let veh = player.vehicle;
    if (!vehicles.exists(veh))
        return;

    if (user.getMoney(player) < price) {
        player.notify('~r~У вас недостаточно средств');
        return;
    }

    if (price < 1)
        return;

    if (veh.getVariable('user_id') < 1) {
        player.notify('~r~Транспорт должен быть личный');
        return;
    }
    if (veh.getVariable('user_id') != user.getId(player)) {
        player.notify('~r~Это должен быть ваш транспорт');
        return;
    }

    if (veh.getVariable('user_id') < 1) {
        player.notify('~r~Транспорт должен быть личный');
        return;
    }
    if (veh.getVariable('user_id') != user.getId(player)) {
        player.notify('~r~Это должен быть ваш транспорт');
        return;
    }
    if (vehicles.get(veh.getVariable('container'), 'is_special') > 0) {
        player.notify('~r~На транспорте уже установлена модификация');
        return;
    }

    vehicles.set(veh.getVariable('container'), 'is_special', 1);
    vehicles.neonStatus(player, veh);
    user.removeMoney(player, price);
    business.addMoney(shopId, price, 'Дистанционное управление');

    player.notify('~g~Вы установили модификацию');

    user.save(player);
    vehicles.save(veh.getVariable('container'));
};

lsc.buyNumber = function(player, shopId, newNumber) {
    methods.debug('lsc.buyNumber');
    if (!user.isLogin(player))
        return;
    let veh = player.vehicle;
    if (!vehicles.exists(veh))
        return;

    if (veh.getVariable('user_id') < 1) {
        player.notify('~r~Транспорт должен быть личный');
        return;
    }
    if (veh.getVariable('user_id') != user.getId(player)) {
        player.notify('~r~Это должен быть ваш транспорт');
        return;
    }
    if (newNumber.length < 1) {
        player.notify('~r~Минимум 1 символ');
        return;
    }

    if (!lsc.checkValidNumber(newNumber)) {
        player.notify('~r~Вы не правильно ввели номер');
        player.notify('~r~Только цифры (0-9) и буквы на англ. (A-Z)');
        return;
    }

    if (newNumber.length == 1 && user.getMoney(player) < 1000000) {
        player.notify('~r~Номер из 1 символа стоит $1.000.000');
        return;
    }
    else if (newNumber.length == 2 && user.getMoney(player) < 500000) {
        player.notify('~r~Номер из 2 символов стоит $500.000');
        return;
    }
    else if (newNumber.length == 3 && user.getMoney(player) < 250000) {
        player.notify('~r~Номер из 3 символов стоит $250.000');
        return;
    }
    else if (newNumber.length == 4 && user.getMoney(player) < 100000) {
        player.notify('~r~Номер из 4 символов стоит $100.000');
        return;
    }
    else if(user.getMoney(player) < 40000) {
        player.notify('~r~Номер сстоит $40.000');
        return;
    }

    mysql.executeQuery(`SELECT id FROM cars WHERE number = ? LIMIT 1`, newNumber, function (err, rows, fields) {
        if (rows.length === 0) {

            let valid = true;
            mp.vehicles.forEach(function (v) {
                if (!vehicles.exists(v))
                    return;
                if (v.numberPlate == newNumber)
                    valid = false;
            });

            if (valid) {

                if (newNumber.length == 1) {
                    user.removeMoney(player, 1000000);
                    business.addMoney(shopId, 500000, 'Смена номера');
                }
                else if (newNumber.length == 2) {
                    user.removeMoney(player, 500000);
                    business.addMoney(shopId, 200000, 'Смена номера');
                }
                else if (newNumber.length == 3) {
                    user.removeMoney(player, 250000);
                    business.addMoney(shopId, 100000, 'Смена номера');
                }
                else if (newNumber.length == 4) {
                    user.removeMoney(player, 100000);
                    business.addMoney(shopId, 50000, 'Смена номера');
                }
                else {
                    user.removeMoney(player, 40000);
                    business.addMoney(shopId, 40000, 'Смена номера');
                }

                mysql.executeQuery(`UPDATE items SET owner_id = '${mp.joaat(newNumber)}' where owner_id = '${mp.joaat(veh.numberPlate)}' and (owner_type = '2' or owner_type = '3' or owner_type = '4')`);

                vehicles.set(veh.getVariable('container'), 'number', newNumber);
                veh.numberPlate = newNumber;

                user.save(player);
                vehicles.save(veh.getVariable('container'));

                player.notify('~g~Вы изменили номер');
                return;
            }
        }
        player.notify('~r~Номер уже занят');
    });
};

lsc.showTun = function(player, modType, idx) {
    methods.debug('lsc.showTun');
    if (!user.isLogin(player))
        return;
    let veh = player.vehicle;
    if (!vehicles.exists(veh))
        return;
    if (modType == 69)
        veh.windowTint = idx;
    else if (modType == 76)
        veh.livery = idx;
    else if (modType == 78)
        veh.wheelType = idx;
    else
        veh.setMod(modType, idx);
};

lsc.buyTun = function(player, modType, idx, price, shopId, itemName) {
    methods.debug('lsc.buyTun');
    if (!user.isLogin(player))
        return;

    if (user.getMoney(player) < price) {
        player.notify('~r~У вас недостаточно средств');
        return;
    }

    if (price < 0)
        return;

    let veh = player.vehicle;

    if (!vehicles.exists(veh))
        return;

    if (veh.getVariable('user_id') < 1) {
        player.notify('~r~Транспорт должен быть личный');
        return;
    }
    if (veh.getVariable('user_id') != user.getId(player)) {
        player.notify('~r~Это должен быть ваш транспорт');
        return;
    }

    if (modType == 76) {
        vehicles.set(veh.getVariable('container'), 'livery', idx);
    }
    else {
        let car = vehicles.getData(veh.getVariable('container'));
        let upgrade = JSON.parse(car.get('upgrade'));
        upgrade[modType.toString()] = idx;
        vehicles.set(veh.getVariable('container'), 'upgrade', JSON.stringify(upgrade));
    }

    user.removeMoney(player, price);
    if (price > 5) {
        business.addMoney(shopId, price, itemName);
        player.notify('~g~Вы установили деталь, цена: ~s~' + methods.moneyFormat(price));
        veh.setMod(modType, -1);
    }

    //vehicles.setTunning(veh);
    vehicles.save(veh.getVariable('container'));
};

lsc.showColor1 = function(player, idx) {
    methods.debug('lsc.showColor1');
    if (!user.isLogin(player))
        return;
    let veh = player.vehicle;
    if (!vehicles.exists(veh))
        return;
    if (veh.getVariable('user_id') < 1) {
        player.notify('~r~Транспорт должен быть личный');
        return;
    }
    veh.setColor(idx, veh.getColor(1));
};

lsc.showColor2 = function(player, idx) {
    methods.debug('lsc.showColor2');
    if (!user.isLogin(player))
        return;
    let veh = player.vehicle;
    if (!vehicles.exists(veh))
        return;
    if (veh.getVariable('user_id') < 1) {
        player.notify('~r~Транспорт должен быть личный');
        return;
    }
    veh.setColor(veh.getColor(0), idx);
};

lsc.buyColor1 = function(player, idx, price, shopId, itemName) {
    methods.debug('lsc.buyColor1');
    if (!user.isLogin(player))
        return;

    if (user.getMoney(player) < price) {
        player.notify('~r~У вас недостаточно средств');
        return;
    }

    if (price < 1)
        return;

    let veh = player.vehicle;

    if (!vehicles.exists(veh))
        return;

    if (veh.getVariable('user_id') < 1) {
        player.notify('~r~Транспорт должен быть личный');
        return;
    }

    veh.setColor(veh.getColor(0), idx);
    vehicles.set(veh.getVariable('container'), 'color1', idx);

    user.removeMoney(player, price);
    business.addMoney(shopId, price, itemName);

    player.notify('~g~Вы изменили цвет транспорта');

    vehicles.setTunning(veh);
    vehicles.save(veh.getVariable('container'));
};

lsc.buyColor2 = function(player, idx, price, shopId, itemName) {
    methods.debug('lsc.buyColor2');
    if (!user.isLogin(player))
        return;
    if (user.getMoney(player) < price) {
        player.notify('~r~У вас недостаточно средств');
        return;
    }

    if (price < 1)
        return;

    let veh = player.vehicle;

    if (!vehicles.exists(veh))
        return;

    if (veh.getVariable('user_id') < 1) {
        player.notify('~r~Транспорт должен быть личный');
        return;
    }

    veh.setColor(veh.getColor(0), idx);
    vehicles.set(veh.getVariable('container'), 'color2', idx);

    user.removeMoney(player, price);
    business.addMoney(shopId, price, itemName);

    player.notify('~g~Вы изменили цвет транспорта');

    vehicles.setTunning(veh);
    vehicles.save(veh.getVariable('container'));
};

lsc.checkValidNumber = function(number) {
    methods.debug('lsc.checkValidNumber');
    number = number.toUpperCase();
    let chars = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let i = 0; i < number.length; i++) {

        let isValid = false;
        for (let j = 0; j < chars.length; j++)
        {
            if (number.charAt(i) == chars.charAt(j))
                isValid = true;
        }

        if (!isValid)
            return false;
    }
    return true;
};