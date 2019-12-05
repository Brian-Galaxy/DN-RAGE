let Container = require('../modules/data');
let mysql = require('../modules/mysql');
let methods = require('../modules/methods');
let user = require('../user');
let coffer = require('../coffer');
let houses = exports;

let hBlips = new Map();
let count = 0;

houses.interiorList = [
    [-1150.642,-1520.649,9.63273], //0
    [346.6588,-1012.286,-100.19624], //1
    [-110.2899,-14.17893,69.51956], //2
    [1274.026,-1719.583,53.77145], //3
    [-1908.66,-572.692,18.09722], //4
    [265.9925,-1007.13,-101.9903], //5
    [151.2914,-1007.358,-100], //6
];

houses.loadAll = function() {
    methods.debug('houses.loadAll');

    mysql.executeQuery(`SELECT * FROM houses`, function (err, rows, fields) {
        rows.forEach(function(item) {

            Container.Data.Set(100000 + methods.parseInt(item['id']), 'id', item['id']);
            Container.Data.Set(100000 + methods.parseInt(item['id']), 'number', item['number']);
            Container.Data.Set(100000 + methods.parseInt(item['id']), 'address', item['address']);
            Container.Data.Set(100000 + methods.parseInt(item['id']), 'street', item['street']);
            Container.Data.Set(100000 + methods.parseInt(item['id']), 'price', item['price']);
            Container.Data.Set(100000 + methods.parseInt(item['id']), 'user_id', item['user_id']);
            Container.Data.Set(100000 + methods.parseInt(item['id']), 'user_name', item['user_name']);
            Container.Data.Set(100000 + methods.parseInt(item['id']), 'pin', item['user_name']);
            Container.Data.Set(100000 + methods.parseInt(item['id']), 'is_safe', item['is_safe']);
            Container.Data.Set(100000 + methods.parseInt(item['id']), 'is_sec', item['is_sec']);
            Container.Data.Set(100000 + methods.parseInt(item['id']), 'is_lock', item['is_lock']);
            Container.Data.Set(100000 + methods.parseInt(item['id']), 'interior', item['interior']);
            Container.Data.Set(100000 + methods.parseInt(item['id']), 'x', item['x']);
            Container.Data.Set(100000 + methods.parseInt(item['id']), 'y', item['y']);
            Container.Data.Set(100000 + methods.parseInt(item['id']), 'z', item['z']);
            Container.Data.Set(100000 + methods.parseInt(item['id']), 'tax_money', item['tax_money']);
            Container.Data.Set(100000 + methods.parseInt(item['id']), 'tax_score', item['tax_score']);

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

            Container.Data.Set(100000 + methods.parseInt(item['id']), 'id', item['id']);
            Container.Data.Set(100000 + methods.parseInt(item['id']), 'number', item['number']);
            Container.Data.Set(100000 + methods.parseInt(item['id']), 'address', item['address']);
            Container.Data.Set(100000 + methods.parseInt(item['id']), 'street', item['street']);
            Container.Data.Set(100000 + methods.parseInt(item['id']), 'price', item['price']);
            Container.Data.Set(100000 + methods.parseInt(item['id']), 'user_id', item['user_id']);
            Container.Data.Set(100000 + methods.parseInt(item['id']), 'user_name', item['user_name']);
            Container.Data.Set(100000 + methods.parseInt(item['id']), 'pin', item['user_name']);
            Container.Data.Set(100000 + methods.parseInt(item['id']), 'is_safe', item['is_safe']);
            Container.Data.Set(100000 + methods.parseInt(item['id']), 'is_sec', item['is_sec']);
            Container.Data.Set(100000 + methods.parseInt(item['id']), 'is_lock', item['is_lock']);
            Container.Data.Set(100000 + methods.parseInt(item['id']), 'interior', item['interior']);
            Container.Data.Set(100000 + methods.parseInt(item['id']), 'x', item['x']);
            Container.Data.Set(100000 + methods.parseInt(item['id']), 'y', item['y']);
            Container.Data.Set(100000 + methods.parseInt(item['id']), 'z', item['z']);
            Container.Data.Set(100000 + methods.parseInt(item['id']), 'tax_money', item['tax_money']);
            Container.Data.Set(100000 + methods.parseInt(item['id']), 'tax_score', item['tax_score']);

            let hBlip = methods.createBlip(new mp.Vector3(parseFloat(item['x']), parseFloat(item['y']), parseFloat(item['z'])), 40, item['user_id'] > 0 ? 59 : 69, 0.4);
            methods.createStaticCheckpoint(hBlip.position.x, hBlip.position.y, hBlip.position.z, "Нажмите ~g~Е~s~ чтобы открыть меню");
            //methods.createStaticCheckpoint(parseFloat(item['int_x']), parseFloat(item['int_y']), parseFloat(item['int_z']) - 1, "Нажмите ~g~Е~s~ чтобы открыть меню", 1, methods.parseInt(item['id']));

            mp.players.forEach(p => {
                methods.updateCheckpointList(p);
            });

            hBlips.set(item['id'], hBlip);
        });
        count = rows.length;
        methods.debug(`Last House Loaded`);
    });
};

houses.insert = function(player, number, street, zone, x, y, z, interior, price) {
    methods.debug('houses.insert');

    player.outputChatBox(`Дом добавлен. Int: ${interior}. Price: ${methods.moneyFormat(price)}`);

    mysql.executeQuery(`INSERT INTO houses (number, street, address, x, y, z, interior, price) VALUES ('${number}', '${street}', '${zone}', '${x}', '${y}', '${z - 1}', '${interior}', '${price}')`);
    setTimeout(houses.loadLast, 1000);
};

houses.getHouseData = function(id) {
    return Container.Data.GetAll(100000 + methods.parseInt(id));
};

houses.get = function(id, key) {
    return Container.Data.Get(100000 + methods.parseInt(id), key);
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

    Container.Data.Set(100000 + id, "user_name", userName);
    Container.Data.Set(100000 + id, "user_id", userId);

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
    Container.Data.Set(100000 + id, 'pin', pin);
    mysql.executeQuery("UPDATE houses SET pin = '" + pin + "' where id = '" + id + "'");
};


houses.lockStatus = function (id, lockStatus) {
    methods.debug('houses.lockStatus');
    id = methods.parseInt(id);
    Container.Data.Set(100000 + id, 'is_lock', lockStatus);
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

    let nalog = methods.parseInt(hInfo.get('price') * (100 - coffer.get('cofferNalog')) / 100);

    user.set(player, 'house_id', 0);

    /*if (user.get(player, 'reg_status') != 3) //TODO
    {
        user.set(player, "reg_time", 28);
        user.set(player, "reg_status", 1);
    }*/

    houses.updateOwnerInfo(hInfo.get('id'), 0, '');

    coffer.removeMoney(nalog);
    user.addMoney(player, nalog);

    setTimeout(function () {
        if (!user.isLogin(player))
            return;
        user.addHistory(player, 3, 'Продал дом ' + hInfo.get('address') + ' №' + hInfo.get('id') + '. Цена: $' + methods.numberFormat(nalog));
        player.notify('~g~Вы продали недвижимость');
        player.notify(`~g~Налог:~s~ ${coffer.get('cofferNalog')}%\n~g~Получено:~s~ $${methods.numberFormat(nalog)}`);
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

    /*if (user.get(player, 'reg_status') != 3) { //TODO
        user.set(player, 'reg_time', 372);
        user.set(player, 'reg_status', 2);
    }*/

    houses.updateOwnerInfo(id, user.get(player, 'id'), user.get(player, 'name'));

    coffer.addMoney(hInfo.get('price'));
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
    user.teleport(player, houses.interiorList[intId][0], houses.interiorList[intId][1], houses.interiorList[intId][2]);
};