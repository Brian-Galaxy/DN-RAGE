let Container = require('../modules/data');
let mysql = require('../modules/mysql');
let methods = require('../modules/methods');
let user = require('../user');
let coffer = require('../coffer');
let houses = exports;

let hBlips = new Map();
let count = 0;

houses.interiorList = [
    [1973.087, 3816.231, 32.42871, 32.09988], //0
    [1973.087, 3816.231, 32.42871, 32.09988], //1
    [151.3607, -1007.641, -97.99998, -0.800103], //2
    [-1908.757, -572.6663, 18.10679, -123.2994], //3
    [265.1601, -1000.999, -98.00862, 11.40028], //4
    [-1150.627, -1520.831, 9.63272, 42.19985], //5
    [346.5463, -1002.454, -98.19622, 1.699997], //6
    [-14.2267, -1440.357, 30.10154, 6.423715], //7
    [7.74072, 538.5586, 175.0281, 158.1992], //8
    [-815.6338, 178.5606, 71.15309, -62.49992], //9
    [-610.8563, 58.96071, 97.20045, 94.49925], //10
    [-758.4859, 619.0757, 143.148, 115.5004], //11
    [-859.9163, 691.0403, 151.8658, -167.699], //12
    [-781.774, 318.2554, 186.914, 354.9092], //13
    [-601.8134, 42.28962, 92.62612, 269.4444], //14
];

houses.loadAll = function() {
    methods.debug('houses.loadAll');

    mysql.executeQuery(`SELECT * FROM houses`, function (err, rows, fields) {
        rows.forEach(function(item) {

            houses.set(item['id'], 'id', item['id']);
            houses.set(item['id'], 'number', item['number']);
            houses.set(item['id'], 'address', item['address']);
            houses.set(item['id'], 'street', item['street']);
            houses.set(item['id'], 'price', item['price']);
            houses.set(item['id'], 'user_id', item['user_id']);
            houses.set(item['id'], 'user_name', item['user_name']);
            houses.set(item['id'], 'pin', item['user_name']);
            houses.set(item['id'], 'is_safe', item['is_safe']);
            houses.set(item['id'], 'is_sec', item['is_sec']);
            houses.set(item['id'], 'is_lock', item['is_lock']);
            houses.set(item['id'], 'interior', item['interior']);
            houses.set(item['id'], 'x', item['x']);
            houses.set(item['id'], 'y', item['y']);
            houses.set(item['id'], 'z', item['z']);
            houses.set(item['id'], 'rot', item['rot']);
            houses.set(item['id'], 'tax_money', item['tax_money']);
            houses.set(item['id'], 'tax_score', item['tax_score']);

            let hBlip = methods.createBlip(new mp.Vector3(parseFloat(item['x']), parseFloat(item['y']), parseFloat(item['z'])), 40, item['user_id'] > 0 ? 59 : 69, 0.4);
            methods.createStaticCheckpoint(hBlip.position.x, hBlip.position.y, hBlip.position.z, "Нажмите ~g~Е~s~ чтобы открыть меню");
            //methods.createStaticCheckpoint(parseFloat(item['int_x']), parseFloat(item['int_y']), parseFloat(item['int_z']) - 1, "Нажмите ~g~Е~s~ чтобы открыть меню", 1, methods.parseInt(item['id']));

            hBlips.set(item['id'], hBlip);
        });
        count = rows.length;
        methods.debug('All Houses Loaded: ' + count);
    });

    houses.interiorList.forEach(function(item) {
        let x = item[0];
        let y = item[1];
        let z = item[2];
        methods.createStaticCheckpoint(x, y, z, "Нажмите ~g~Е~s~ чтобы открыть меню");
    });
};


houses.loadLast = function() {
    methods.debug('houses.loadLast');

    mysql.executeQuery(`SELECT * FROM houses ORDER BY id DESC LIMIT 1`, function (err, rows, fields) {

        rows.forEach(function(item) {

            houses.set(item['id'], 'id', item['id']);
            houses.set(item['id'], 'number', item['number']);
            houses.set(item['id'], 'address', item['address']);
            houses.set(item['id'], 'street', item['street']);
            houses.set(item['id'], 'price', item['price']);
            houses.set(item['id'], 'user_id', item['user_id']);
            houses.set(item['id'], 'user_name', item['user_name']);
            houses.set(item['id'], 'pin', item['user_name']);
            houses.set(item['id'], 'is_safe', item['is_safe']);
            houses.set(item['id'], 'is_sec', item['is_sec']);
            houses.set(item['id'], 'is_lock', item['is_lock']);
            houses.set(item['id'], 'interior', item['interior']);
            houses.set(item['id'], 'x', item['x']);
            houses.set(item['id'], 'y', item['y']);
            houses.set(item['id'], 'z', item['z']);
            houses.set(item['id'], 'tax_money', item['tax_money']);
            houses.set(item['id'], 'tax_score', item['tax_score']);

            let hBlip = methods.createBlip(new mp.Vector3(parseFloat(item['x']), parseFloat(item['y']), parseFloat(item['z'])), 40, item['user_id'] > 0 ? 59 : 69, 0.4);
            methods.createStaticCheckpoint(hBlip.position.x, hBlip.position.y, hBlip.position.z, "Нажмите ~g~Е~s~ чтобы открыть меню");
            //methods.createStaticCheckpoint(parseFloat(item['int_x']), parseFloat(item['int_y']), parseFloat(item['int_z']) - 1, "Нажмите ~g~Е~s~ чтобы открыть меню", 1, methods.parseInt(item['id']));

            mp.players.broadcast(`Дом добавлен. ID: ${item['id']}. Name: ${item['number']}. Int: ${item['interior']}. Price: ${methods.moneyFormat(item['price'])}`);

            mp.players.forEach(p => {
                methods.updateCheckpointList(p);
            });

            hBlips.set(item['id'], hBlip);
        });
        count = rows.length;
        methods.debug(`Last House Loaded`);
    });
};

houses.insert = function(player, number, street, zone, x, y, z, rot, interior, price) {
    methods.debug('houses.insert');

    mysql.executeQuery(`INSERT INTO houses (number, street, address, rot, x, y, z, interior, price) VALUES ('${number}', '${street}', '${zone}', '${rot}', '${x}', '${y}', '${z - 1}', '${interior}', '${price}')`);
    setTimeout(houses.loadLast, 1000);
};

houses.getHouseData = function(id) {
    return Container.Data.GetAll(100000 + methods.parseInt(id));
};

houses.get = function(id, key) {
    return Container.Data.Get(100000 + methods.parseInt(id), key);
};

houses.set = function(id, key, val) {
    Container.Data.Set(100000 + methods.parseInt(id), key, val);
};

houses.getCountLiveUser = function(id, cb) {
    id = methods.parseInt(id);
    mysql.executeQuery(`SELECT id FROM users WHERE house_id = ${id}`, function (err, rows, fields) {
        cb(rows.length);
    });
};

houses.getAllHouses = function() {
    methods.debug('houses.getAllHouses');
    return hBlips;
};

houses.updateOwnerInfo = function (id, userId, userName) {
    methods.debug('houses.updateOwnerInfo');
    id = methods.parseInt(id);
    userId = methods.parseInt(userId);

    houses.set(id, "user_name", userName);
    houses.set(id, "user_id", userId);

    hBlips.get(id).color = userId > 0 ? 59 : 69;

    if (userId == 0) {
        houses.updatePin(id, 0);
        houses.lockStatus(id, false);
    }

    mysql.executeQuery("UPDATE houses SET user_name = '" + userName + "', user_id = '" + userId + "', tax_money = '0' where id = '" + id + "'");
};

houses.updatePin = function (id, pin) {
    methods.debug('houses.updatePin');
    id = methods.parseInt(id);
    pin = methods.parseInt(pin);
    houses.set(id, 'pin', pin);
    mysql.executeQuery("UPDATE houses SET pin = '" + pin + "' where id = '" + id + "'");
};

houses.lockStatus = function (id, lockStatus) {
    methods.debug('houses.lockStatus');
    id = methods.parseInt(id);
    houses.set(id, 'is_lock', lockStatus);
    mysql.executeQuery("UPDATE houses SET is_lock = '" + methods.boolToInt(lockStatus) + "' where id = '" + id + "'");
};

houses.sell = function (player) {
    methods.debug('houses.sell');
    if (!user.isLogin(player))
        return;

    if (user.get(player, 'house_id') == 0) {
        player.notify('~r~У Вас нет дома');
        return;
    }

    let hInfo = houses.getHouseData(user.get(player, 'house_id'));

    if (hInfo.get('user_id') != user.get(player, 'id')) {
        player.notify('~r~Этот дом вам не пренадлежит');
        return;
    }

    let nalog = methods.parseInt(hInfo.get('price') * (100 - coffer.getTaxIntermediate()) / 100);

    user.set(player, 'house_id', 0);

    if (user.get(player, 'reg_status') != 3)
    {
        user.set(player, "reg_time", 28);
        user.set(player, "reg_status", 1);
    }

    houses.updateOwnerInfo(hInfo.get('id'), 0, '');

    coffer.removeMoney(1, nalog);
    user.addMoney(player, nalog);

    setTimeout(function () {
        if (!user.isLogin(player))
            return;
        user.addHistory(player, 3, 'Продал дом ' + hInfo.get('address') + ' №' + hInfo.get('id') + '. Цена: $' + methods.numberFormat(nalog));
        player.notify('~g~Вы продали недвижимость');
        player.notify(`~g~Налог:~s~ ${coffer.getTaxIntermediate()}%\n~g~Получено:~s~ $${methods.numberFormat(nalog)}`);
        user.save(player);
    }, 1000);
};

houses.buy = function (player, id) {
    methods.debug('houses.buy');

    if (!user.isLogin(player))
        return;

    let hInfo = houses.getHouseData(id);
    if (user.get(player, 'house_id') > 0) {
        player.notify('~r~У Вас есть недвижимость');
        return false;
    }
    if (hInfo.get('price') > user.getMoney(player)) {
        player.notify('~r~У Вас не хватает средств');
        return false;
    }
    if (hInfo.get('user_id') > 0) {
        player.notify('~r~Недвижимость уже куплена');
        return false;
    }

    user.set(player, 'house_id', id);

    if (user.get(player, 'reg_status') != 3) {
        user.set(player, 'reg_time', 372);
        user.set(player, 'reg_status', 2);
    }

    houses.updateOwnerInfo(id, user.get(player, 'id'), user.get(player, 'name'));

    coffer.addMoney(1, hInfo.get('price'));
    user.removeMoney(player, hInfo.get('price'));
    setTimeout(function () {
        if (!user.isLogin(player))
            return;
        user.addHistory(player, 3, 'Купил дом ' + hInfo.get('address') + ' №' + hInfo.get('id') + '. Цена: $' + methods.numberFormat(hInfo.get('price')));
        user.save(player);
        player.notify('~g~Поздравляем с покупкой недвижимости!');
    }, 500);
    return true;
};

houses.enter = function (player, id) {
    methods.debug('houses.enter', id);

    if (!user.isLogin(player))
        return;
    id = methods.parseInt(id);

    let hInfo = houses.getHouseData(id);
    player.dimension = id;
    let intId = hInfo.get('interior');
    user.teleport(player, houses.interiorList[intId][0], houses.interiorList[intId][1], houses.interiorList[intId][2] + 1);
};