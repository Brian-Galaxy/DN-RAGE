let Container = require('../modules/data');
let mysql = require('../modules/mysql');
let methods = require('../modules/methods');
let user = require('../user');
let coffer = require('../coffer');
let enums = require('../enums');
let vehicles = require('./vehicles');
let stocks = exports;

let stockList = new Map();
let count = 0;

stocks.interiorList = [
    [1104.6878662109375, -3099.449462890625, -39.999916076660156, 88.8323745727539, 1101.0675048828125, -3099.64697265625, -39.34011459350586, 91.2125244140625], //0
    [1072.5458984375, -3102.49755859375, -39.99995422363281, 93.9716567993164, 1071.10302734375, -3103.2294921875, -39.2861328125, 359.570556640625], //1
    [1027.242431640625, -3101.391357421875, -39.999900817871094, 89.16166687011719, 1023.4574584960938, -3101.502685546875, -39.34016418457031, 89.84857177734375], //2
];

stocks.loadAll = function() {
    methods.debug('stocks.loadAll');

    mysql.executeQuery(`SELECT * FROM stocks`, function (err, rows, fields) {
        rows.forEach(function(item) {

            stocks.set(item['id'], 'id', item['id']);
            stocks.set(item['id'], 'number', item['number']);
            stocks.set(item['id'], 'address', item['address']);
            stocks.set(item['id'], 'street', item['street']);
            stocks.set(item['id'], 'price', item['price']);
            stocks.set(item['id'], 'user_id', item['user_id']);
            stocks.set(item['id'], 'user_name', item['user_name']);
            stocks.set(item['id'], 'pin', item['pin']);
            stocks.set(item['id'], 'pin1', item['pin1']);
            stocks.set(item['id'], 'pin2', item['pin2']);
            stocks.set(item['id'], 'pin3', item['pin3']);
            stocks.set(item['id'], 'interior', item['interior']);
            stocks.set(item['id'], 'x', item['x']);
            stocks.set(item['id'], 'y', item['y']);
            stocks.set(item['id'], 'z', item['z']);
            stocks.set(item['id'], 'rot', item['rot']);
            stocks.set(item['id'], 'vx', item['vx']);
            stocks.set(item['id'], 'vy', item['vy']);
            stocks.set(item['id'], 'vz', item['vz']);
            stocks.set(item['id'], 'vrot', item['vrot']);
            stocks.set(item['id'], 'tax_money', item['tax_money']);
            stocks.set(item['id'], 'tax_score', item['tax_score']);

            let hBlip = {
                pos: new mp.Vector3(parseFloat(item['x']), parseFloat(item['y']), parseFloat(item['z'])),
                vPos: new mp.Vector3(parseFloat(item['vx']), parseFloat(item['vy']), parseFloat(item['vz']))
            };
            methods.createStaticCheckpoint(hBlip.pos.x, hBlip.pos.y, hBlip.pos.z, "Нажмите ~g~Е~s~ чтобы открыть меню");
            //methods.createStaticCheckpoint(parseFloat(item['int_x']), parseFloat(item['int_y']), parseFloat(item['int_z']) - 1, "Нажмите ~g~Е~s~ чтобы открыть меню", 1, methods.parseInt(item['id']));

            stockList.set(item['id'], hBlip);
        });
        count = rows.length;
        methods.debug('All stocks Loaded: ' + count);
    });

    stocks.interiorList.forEach(function(item) {
        let x = item[0];
        let y = item[1];
        let z = item[2];
        methods.createStaticCheckpoint(x, y, z, "Нажмите ~g~Е~s~ чтобы открыть меню");
    });
};


stocks.loadLast = function() {
    methods.debug('stocks.loadLast');

    mysql.executeQuery(`SELECT * FROM stocks ORDER BY id DESC LIMIT 1`, function (err, rows, fields) {

        rows.forEach(function(item) {

            stocks.set(item['id'], 'id', item['id']);
            stocks.set(item['id'], 'number', item['number']);
            stocks.set(item['id'], 'address', item['address']);
            stocks.set(item['id'], 'street', item['street']);
            stocks.set(item['id'], 'price', item['price']);
            stocks.set(item['id'], 'user_id', item['user_id']);
            stocks.set(item['id'], 'user_name', item['user_name']);
            stocks.set(item['id'], 'pin', item['user_name']);
            stocks.set(item['id'], 'pin1', item['pin1']);
            stocks.set(item['id'], 'pin2', item['pin2']);
            stocks.set(item['id'], 'pin3', item['pin3']);
            stocks.set(item['id'], 'interior', item['interior']);
            stocks.set(item['id'], 'x', item['x']);
            stocks.set(item['id'], 'y', item['y']);
            stocks.set(item['id'], 'z', item['z']);
            stocks.set(item['id'], 'rot', item['rot']);
            stocks.set(item['id'], 'vx', item['vx']);
            stocks.set(item['id'], 'vy', item['vy']);
            stocks.set(item['id'], 'vz', item['vz']);
            stocks.set(item['id'], 'vrot', item['vrot']);
            stocks.set(item['id'], 'tax_money', item['tax_money']);
            stocks.set(item['id'], 'tax_score', item['tax_score']);

            let hBlip = {
                pos: new mp.Vector3(parseFloat(item['x']), parseFloat(item['y']), parseFloat(item['z'])),
                vPos: new mp.Vector3(parseFloat(item['vx']), parseFloat(item['vy']), parseFloat(item['vz']))
            };

            methods.createStaticCheckpoint(hBlip.pos.x, hBlip.pos.y, hBlip.pos.z, "Нажмите ~g~Е~s~ чтобы открыть меню");

            mp.players.broadcast(`Склад добавлен. ID: ${item['id']}. Name: ${item['number']}. Int: ${item['interior']}. Price: ${methods.moneyFormat(item['price'])}`);

            mp.players.forEach(p => {
                methods.updateCheckpointList(p);
            });

            stockList.set(item['id'], hBlip);
        });
        count = rows.length;
        methods.debug(`Last House Loaded`);
    });
};

stocks.insert = function(player, number, street, zone, x, y, z, rot, interior, price) {
    methods.debug('stocks.insert');

    mysql.executeQuery(`INSERT INTO stocks (number, street, address, rot, x, y, z, interior, price) VALUES ('${number}', '${street}', '${zone}', '${rot}', '${x}', '${y}', '${z - 1}', '${interior}', '${price}')`);
    setTimeout(stocks.loadLast, 1000);
};

stocks.insert2 = function(player, id, vx, vy, vz, vrot) {
    methods.debug('stocks.insert2');

    stocks.set(id, 'vx', vx);
    stocks.set(id, 'vy', vy);
    stocks.set(id, 'vz', vz);
    stocks.set(id, 'vrot', vrot);

    mysql.executeQuery(`UPDATE stocks SET vrot = '${vrot}', vx = '${vx}', vy = '${vy}', vz = '${vz}' where id = '${id}'`);

    player.notify('~g~Склад успешно обновлен')
};

stocks.getData = function(id) {
    return Container.Data.GetAll(enums.offsets.stock + methods.parseInt(id));
};

stocks.get = function(id, key) {
    return Container.Data.Get(enums.offsets.stock + methods.parseInt(id), key);
};

stocks.set = function(id, key, val) {
    Container.Data.Set(enums.offsets.stock + methods.parseInt(id), key, val);
};

stocks.getCountLiveUser = function(id, cb) {
    id = methods.parseInt(id);
    mysql.executeQuery(`SELECT id FROM users WHERE stock_id = ${id}`, function (err, rows, fields) {
        cb(rows.length);
    });
};

stocks.getAll = function() {
    methods.debug('stocks.getAll');
    return stockList;
};

stocks.updateOwnerInfo = function (id, userId, userName) {
    methods.debug('stocks.updateOwnerInfo');
    id = methods.parseInt(id);
    userId = methods.parseInt(userId);

    stocks.set(id, "user_name", userName);
    stocks.set(id, "user_id", userId);

    if (userId == 0) {
        stocks.updatePin(id, 0);
        stocks.lockStatus(id, false);
    }

    mysql.executeQuery("UPDATE stocks SET user_name = '" + userName + "', user_id = '" + userId + "', tax_money = '0' where id = '" + id + "'");
};

stocks.updatePin = function (id, pin) {
    methods.debug('stocks.updatePin');
    id = methods.parseInt(id);
    pin = methods.parseInt(pin);
    stocks.set(id, 'pin', pin);
    mysql.executeQuery("UPDATE stocks SET pin = '" + pin + "' where id = '" + id + "'");
};

stocks.updatePin1 = function (id, pin) {
    methods.debug('stocks.updatePin');
    id = methods.parseInt(id);
    pin = methods.parseInt(pin);
    stocks.set(id, 'pin1', pin);
    mysql.executeQuery("UPDATE stocks SET pin1 = '" + pin + "' where id = '" + id + "'");
};

stocks.updatePin2 = function (id, pin) {
    methods.debug('stocks.updatePin');
    id = methods.parseInt(id);
    pin = methods.parseInt(pin);
    stocks.set(id, 'pin2', pin);
    mysql.executeQuery("UPDATE stocks SET pin2 = '" + pin + "' where id = '" + id + "'");
};

stocks.updatePin3 = function (id, pin) {
    methods.debug('stocks.updatePin');
    id = methods.parseInt(id);
    pin = methods.parseInt(pin);
    stocks.set(id, 'pin3', pin);
    mysql.executeQuery("UPDATE stocks SET pin3 = '" + pin + "' where id = '" + id + "'");
};

stocks.sell = function (player) {
    methods.debug('stocks.sell');
    if (!user.isLogin(player))
        return;

    if (user.get(player, 'stock_id') == 0) {
        player.notify('~r~У Вас нет склада');
        return;
    }

    let hInfo = stocks.getData(user.get(player, 'stock_id'));

    if (hInfo.get('user_id') != user.get(player, 'id')) {
        player.notify('~r~Этот дом вам не пренадлежит');
        return;
    }

    let nalog = methods.parseInt(hInfo.get('price') * (100 - coffer.getTaxIntermediate()) / 100);

    user.set(player, 'stock_id', 0);

    stocks.updateOwnerInfo(hInfo.get('id'), 0, '');

    coffer.removeMoney(1, nalog);
    user.addMoney(player, nalog, 'Продажа склада ' + hInfo.get('address') + ' №' + hInfo.get('number'));

    setTimeout(function () {
        if (!user.isLogin(player))
            return;
        user.addHistory(player, 3, 'Продал склад ' + hInfo.get('address') + ' №' + hInfo.get('number') + '. Цена: ' + methods.moneyFormat(nalog));
        player.notify('~g~Вы продали недвижимость');
        player.notify(`~g~Налог:~s~ ${coffer.getTaxIntermediate()}%\n~g~Получено:~s~ ${methods.moneyFormat(nalog)}`);
        user.save(player);
    }, 1000);
};

stocks.buy = function (player, id) {
    methods.debug('stocks.buy');

    if (!user.isLogin(player))
        return;

    let hInfo = stocks.getData(id);
    if (user.get(player, 'stock_id') > 0) {
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

    user.set(player, 'stock_id', id);

    stocks.updateOwnerInfo(id, user.get(player, 'id'), user.get(player, 'name'));

    coffer.addMoney(1, hInfo.get('price'));
    user.removeMoney(player, hInfo.get('price'), 'Покупка склада ' + hInfo.get('address') + ' №' + hInfo.get('number'));
    setTimeout(function () {
        if (!user.isLogin(player))
            return;
        user.addHistory(player, 3, 'Купил склад ' + hInfo.get('address') + ' №' + hInfo.get('number') + '. Цена: ' + methods.moneyFormat(hInfo.get('price')));
        user.save(player);
        player.notify('~g~Поздравляем с покупкой недвижимости!');
    }, 500);
    return true;
};

stocks.enter = function (player, id) {
    methods.debug('stocks.enter', id);

    if (!user.isLogin(player))
        return;
    id = methods.parseInt(id);

    let hInfo = stocks.getData(id);
    player.dimension = id + enums.offsets.stock;
    let intId = hInfo.get('interior');
    user.teleport(player, stocks.interiorList[intId][0], stocks.interiorList[intId][1], stocks.interiorList[intId][2] + 1, stocks.interiorList[intId][3]);
};

stocks.enterv = function (player, id) {
    methods.debug('stocks.enter', id);

    if (!user.isLogin(player))
        return;

    if (!player.vehicle || !vehicles.exists(player.vehicle)) {
        player.notify('~r~Необходимо находится в транспорте');
        return;
    }

    let vInfo = methods.getVehicleInfo(player.vehicle.model);
    if (vInfo.class_name == 'Planes' ||
        vInfo.class_name == 'Boats' ||
        vInfo.class_name == 'Helicopters' ||
        vInfo.class_name == 'Emergency' ||
        vInfo.class_name == 'Commercials' ||
        vInfo.class_name == 'Service' ||
        vInfo.class_name == 'Industrial' ||
        vInfo.class_name == 'Military')
    {
        player.notify('~r~Данному классу авто запрещено заезжать в гараж');
        return;
    }

    id = methods.parseInt(id);

    let hInfo = stocks.getData(id);
    player.dimension = id + enums.offsets.stock;
    player.vehicle.dimension = id + enums.offsets.stock;
    let intId = hInfo.get('interior');
    user.teleportVeh(player, stocks.interiorList[intId][4], stocks.interiorList[intId][5], stocks.interiorList[intId][6], stocks.interiorList[intId][7]);
};