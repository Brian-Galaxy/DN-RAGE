let Container = require('../modules/data');
let mysql = require('../modules/mysql');
let methods = require('../modules/methods');

let user = require('../user');
let coffer = require('../coffer');
let enums = require('../enums');
let inventory = require('../inventory');

let vehicles = require('./vehicles');

let stocks = exports;

let stockList = new Map();
let count = 0;

stocks.interiorList = [
    [1104.6878662109375, -3099.449462890625, -39.999916076660156, 88.8323745727539, 1101.0675048828125, -3099.64697265625, -39.34011459350586, 91.2125244140625], //0
    [1072.5458984375, -3102.49755859375, -39.99995422363281, 93.9716567993164, 1071.10302734375, -3103.2294921875, -39.2861328125, 359.570556640625], //1
    [1027.242431640625, -3101.391357421875, -39.999900817871094, 89.16166687011719, 1023.4574584960938, -3101.502685546875, -39.34016418457031, 89.84857177734375], //2
];

stocks.pcList = [
    [1088.6097412109375, -3101.404541015625, -39.999942779541016], //0
    [1049.1907958984375, -3100.739013671875, -39.99993133544922], //1
    [994.3892822265625, -3099.96142578125, -39.995849609375], //2
];

//Имя, Model, Объем, OffsetZ, Можно ли юзать, Цена
stocks.boxList = [
    ['Малая коробка', 1165008631, 400000, -0.12, true, 10000],
    ['Средняя коробка', 1875981008, 600000, -0.12, true, 20000],
    ['Большая коробка', -1322183878, 800000, -0.12, true, 30000],
];

stocks.boxPosList = [
    [
        [1088.75, -3096.7, -39.88, 0, 0, 0],
        [1088.757, -3096.428, -37.66, 0, 0, 0],
        [1091.3, -3096.7, -39.88, 0, 0, 0],
        [1091.3, -3096.7, -37.66, 0, 0, 0],
        [1095.05, -3096.7, -39.88, 0, 0, 0],
        [1095.05, -3096.7, -37.66, 0, 0, 0],
        [1097.6, -3096.7, -39.88, 0, 0, 0],
        [1097.6, -3096.7, -37.66, 0, 0, 0],
        [1101.3, -3096.7, -39.88, 0, 0, 0],
        [1101.3, -3096.7, -37.66, 0, 0, 0],
        [1103.8, -3096.7, -39.88, 0, 0, 0],
        [1103.8, -3096.7, -37.66, 0, 0, 0],
    ],
    [
        [1053.1, -3095.6, -39.88, 0, 0, 0],
        [1053.1, -3095.6, -37.66, 0, 0, 0],
        [1055.5, -3095.6, -39.88, 0, 0, 0],
        [1055.5, -3095.6, -37.66, 0, 0, 0],
        [1057.9, -3095.6, -39.88, 0, 0, 0],
        [1057.9, -3095.6, -37.66, 0, 0, 0],
        [1060.3, -3095.6, -39.88, 0, 0, 0],
        [1060.3, -3095.6, -37.66, 0, 0, 0],
        [1062.7, -3095.6, -39.88, 0, 0, 0],
        [1062.7, -3095.6, -37.66, 0, 0, 0],
        [1065.1, -3095.6, -39.88, 0, 0, 0],
        [1065.1, -3095.6, -37.66, 0, 0, 0],
        [1067.6, -3095.6, -39.88, 0, 0, 0],
        [1067.6, -3095.6, -37.66, 0, 0, 0],
        [1053.1, -3102.9, -39.88, 0, 0, 0],
        [1053.1, -3102.9, -37.66, 0, 0, 0],
        [1055.5, -3102.9, -39.88, 0, 0, 0],
        [1055.5, -3102.9, -37.66, 0, 0, 0],
        [1057.9, -3102.9, -39.88, 0, 0, 0],
        [1057.9, -3102.9, -37.66, 0, 0, 0],
        [1060.3, -3102.9, -39.88, 0, 0, 0],
        [1060.3, -3102.9, -37.66, 0, 0, 0],
        [1062.7, -3102.9, -39.88, 0, 0, 0],
        [1062.7, -3102.9, -37.66, 0, 0, 0],
        [1065.1, -3102.9, -39.88, 0, 0, 0],
        [1065.1, -3102.9, -37.66, 0, 0, 0],
        [1067.6, -3102.9, -39.88, 0, 0, 0],
        [1067.6, -3102.9, -37.66, 0, 0, 0],
        [1053.1, -3109.7, -39.88, 1.001779E-05, -5.008956E-06, -179.9985],
        [1053.1, -3109.7, -37.66, 1.001779E-05, -5.008955E-06, -179.9985],
        [1055.5, -3109.7, -39.88, 1.001779E-05, -5.008955E-06, -179.9985],
        [1055.5, -3109.7, -37.66, 1.001779E-05, -5.008955E-06, -179.9985],
        [1057.9, -3109.7, -39.88, 1.001779E-05, -5.008955E-06, -179.9985],
        [1057.9, -3109.7, -37.66, 1.001779E-05, -5.008955E-06, -179.9985],
        [1060.3, -3109.7, -39.88, 1.001779E-05, -5.008955E-06, -179.9985],
        [1060.3, -3109.7, -37.66, 1.001779E-05, -5.008955E-06, -179.9985],
        [1062.7, -3109.7, -39.88, 1.001779E-05, -5.008955E-06, -179.9985],
        [1062.7, -3109.7, -37.66, 1.001779E-05, -5.008955E-06, -179.9985],
        [1065.1, -3109.7, -39.88, 1.001779E-05, -5.008955E-06, -179.9985],
        [1065.1, -3109.7, -37.66, 1.001779E-05, -5.008955E-06, -179.9985],
        [1067.6, -3109.7, -39.88, 1.001779E-05, -5.008955E-06, -179.9985],
        [1067.6, -3109.7, -37.66, 1.001779E-05, -5.008955E-06, -179.9985],
    ],
    [
        [993.4, -3111.302, -39.88, -4.46236E-05, 2.231179E-05, 89.99999],
        [993.4, -3111.302, -37.66, -4.462359E-05, 2.231178E-05, 89.99998],
        [993.4, -3108.9, -39.88, -4.462359E-05, 2.231178E-05, 89.99998],
        [993.4, -3108.9, -37.66, -4.462359E-05, 2.231176E-05, 89.99995],
        [993.4, -3106.5, -39.88, -4.462359E-05, 2.231176E-05, 89.99995],
        [993.4, -3106.5, -37.66, -4.462358E-05, 2.231174E-05, 89.99993],
        [1003.65, -3091.8, -39.88, 0, 0, 0],
        [1003.65, -3091.8, -37.66, 0, 0, 0],
        [1006.05, -3091.8, -39.88, 0, 0, 0],
        [1006.05, -3091.8, -37.66, 0, 0, 0],
        [1008.45, -3091.8, -39.88, 0, 0, 0],
        [1008.45, -3091.8, -37.66, 0, 0, 0],
        [1010.85, -3091.8, -39.88, 0, 0, 0],
        [1010.85, -3091.8, -37.66, 0, 0, 0],
        [1013.25, -3091.8, -39.88, 0, 0, 0],
        [1013.25, -3091.8, -37.66, 0, 0, 0],
        [1015.7, -3091.8, -39.88, 0, 0, 0],
        [1015.7, -3091.8, -37.66, 0, 0, 0],
        [1018.15, -3091.8, -39.88, 0, 0, 0],
        [1018.15, -3091.8, -37.66, 0, 0, 0],
        [1003.65, -3096.7, -39.88, 5.008956E-06, -5.008956E-06, -180],
        [1003.65, -3096.7, -37.66, 5.008956E-06, -5.008956E-06, -180],
        [1006.05, -3096.7, -39.88, 5.008956E-06, -5.008956E-06, -180],
        [1006.05, -3096.7, -37.66, 5.008956E-06, -5.008956E-06, -180],
        [1008.45, -3096.7, -39.88, 5.008956E-06, -5.008956E-06, -180],
        [1008.45, -3096.7, -37.66, 5.008956E-06, -5.008956E-06, -180],
        [1010.85, -3096.7, -39.88, 5.008956E-06, -5.008956E-06, -180],
        [1010.85, -3096.7, -37.66, 5.008956E-06, -5.008956E-06, -180],
        [1013.25, -3096.7, -39.88, 5.008956E-06, -5.008956E-06, -180],
        [1013.25, -3096.7, -37.66, 5.008956E-06, -5.008956E-06, -180],
        [1015.7, -3096.7, -39.88, 5.008956E-06, -5.008956E-06, -180],
        [1015.7, -3096.7, -37.66, 5.008956E-06, -5.008956E-06, -180],
        [1018.15, -3096.7, -39.88, 5.008956E-06, -5.008956E-06, -180],
        [1018.15, -3096.7, -37.66, 5.008956E-06, -5.008956E-06, -180],
        [1003.65, -3103, -39.88, 0, 0, 0],
        [1003.65, -3103, -37.66, 0, 0, 0],
        [1006.05, -3103, -39.88, 0, 0, 0],
        [1006.05, -3103, -37.66, 0, 0, 0],
        [1008.45, -3103, -39.88, 0, 0, 0],
        [1008.45, -3103, -37.66, 0, 0, 0],
        [1010.85, -3103, -39.88, 0, 0, 0],
        [1010.85, -3103, -37.66, 0, 0, 0],
        [1013.25, -3103, -39.88, 0, 0, 0],
        [1013.25, -3103, -37.66, 0, 0, 0],
        [1015.7, -3103, -39.88, 0, 0, 0],
        [1015.7, -3103, -37.66, 0, 0, 0],
        [1018.15, -3103, -39.88, 0, 0, 0],
        [1018.15, -3103, -37.66, 0, 0, 0],
        [1003.65, -3108.3, -39.88, 5.008956E-06, -5.008956E-06, -180],
        [1003.65, -3108.3, -37.66, 5.008956E-06, -5.008956E-06, -180],
        [1006.05, -3108.3, -39.88, 5.008956E-06, -5.008956E-06, -180],
        [1006.05, -3108.3, -37.66, 5.008956E-06, -5.008956E-06, -180],
        [1008.45, -3108.3, -39.88, 5.008956E-06, -5.008956E-06, -180],
        [1008.45, -3108.3, -37.66, 5.008956E-06, -5.008956E-06, -180],
        [1010.85, -3108.3, -39.88, 5.008956E-06, -5.008956E-06, -180],
        [1010.85, -3108.3, -37.66, 5.008956E-06, -5.008956E-06, -180],
        [1013.25, -3108.3, -39.88, 5.008956E-06, -5.008956E-06, -180],
        [1013.25, -3108.3, -37.66, 5.008956E-06, -5.008956E-06, -180],
        [1015.7, -3108.3, -39.88, 5.008956E-06, -5.008956E-06, -180],
        [1015.7, -3108.3, -37.66, 5.008956E-06, -5.008956E-06, -180],
        [1018.15, -3108.3, -39.88, 5.008956E-06, -5.008956E-06, -180],
        [1018.15, -3108.3, -37.66, 5.008956E-06, -5.008956E-06, -180],
        [1026.7, -3106.5, -39.88, -4.46236E-05, -6.329292E-05, -89.99999],
        [1026.65, -3106.5, -37.66, -4.46236E-05, -6.329291E-05, -89.99998],
        [1026.7, -3108.9, -39.88, -4.46236E-05, -6.329291E-05, -89.99998],
        [1026.7, -3108.9, -37.66, -4.462361E-05, -6.329288E-05, -89.99995],
        [1026.7, -3111.3, -39.88, -4.462361E-05, -6.329288E-05, -89.99995],
        [1026.7, -3111.3, -37.66, -4.462361E-05, -6.329285E-05, -89.99993],
        [1026.7, -3096.4, -39.88, -4.46236E-05, -6.329291E-05, -89.99998],
        [1026.7, -3096.4, -37.65501, -4.462361E-05, -6.329288E-05, -89.99995],
        [1026.7, -3094, -39.88, -4.462361E-05, -6.329288E-05, -89.99995],
        [1026.7, -3094, -37.66, -4.462361E-05, -6.329285E-05, -89.99993],
        [1026.7, -3091.6, -39.88, -4.462361E-05, -6.329285E-05, -89.99993],
        [1026.7, -3091.6, -37.66, -4.462362E-05, -6.329282E-05, -89.99989],
    ]
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
            stocks.set(item['id'], 'upgrade', item['upgrade']);
            stocks.set(item['id'], 'tax_money', item['tax_money']);
            stocks.set(item['id'], 'tax_score', item['tax_score']);

            let hBlip = {
                pos: new mp.Vector3(parseFloat(item['x']), parseFloat(item['y']), parseFloat(item['z'])),
                vPos: new mp.Vector3(parseFloat(item['vx']), parseFloat(item['vy']), parseFloat(item['vz']))
            };
            methods.createStaticCheckpoint(hBlip.pos.x, hBlip.pos.y, hBlip.pos.z, "Нажмите ~g~Е~s~ чтобы открыть меню");

            stocks.loadUpgrades(item['upgrade'], item['id'], item['interior']);

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

    stocks.pcList.forEach(function(item) {
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
            stocks.set(item['id'], 'upgrade', item['upgrade']);
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

stocks.upgradeAdd = function(player, id, slot, boxId) {
    if (!user.isLogin(player))
        return;
    let boxPrice = stocks.boxList[boxId][5];

    if (boxPrice > user.getBankMoney(player)) {
        user.sendSmsBankOperation(player, 'На вашем счету не достаточно средств', '~r~Ошибка операции');
        return;
    }

    let upgradeStr = stocks.get(id, 'upgrade');
    let upgrade = upgradeStr.split('_');
    upgrade[slot] = boxId;

    let upgradeNew = '';

    upgrade.forEach(item => {
        upgradeNew += item + '_';
    });

    upgradeNew = upgradeNew.substring(0, upgradeNew.length - 1);

    stocks.set(id, 'upgrade', upgradeNew);
    mysql.executeQuery(`UPDATE stocks SET upgrade = '${upgradeNew}' where id = '${id}'`);

    coffer.addMoney(1, boxPrice);
    user.removeBankMoney(player, boxPrice, 'Покупка ящика на склад');

    stocks.addObject(boxId, slot, id, stocks.get(id, 'interior'));

    player.notify('~g~Поздравляем с покупкой');
};

stocks.loadUpgrades = function(upgradeString, id, interior) {
    upgradeString.split('_').forEach((boxId, slot) => {

        boxId = methods.parseInt(boxId);

        if (boxId == -1)
            return;

        stocks.addObject(boxId, slot, id, interior);
    });
};

stocks.addObject = function(boxId, slot, id, interior) {
    let int = interior;
    let box = stocks.boxList[boxId];
    let boxPos = new mp.Vector3(stocks.boxPosList[int][slot][0], stocks.boxPosList[int][slot][1], stocks.boxPosList[int][slot][2] + box[3]);
    let boxRot = new mp.Vector3(stocks.boxPosList[int][slot][3], stocks.boxPosList[int][slot][4], stocks.boxPosList[int][slot][5]);

    let obj = mp.objects.new(box[1], boxPos,
        {
            rotation: boxRot,
            alpha: 255,
            dimension: id + enums.offsets.stock
        });

    if (box[4] === true) {
        obj.setVariable('stockId', slot + inventory.types.UserStock);
        Container.Data.Set(id + enums.offsets.stock, "invAmountMax:" + (slot + inventory.types.UserStock), box[2]);
    }
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
        player.notify('~r~Этот склад вам не пренадлежит');
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
        player.notify(`~g~Вы продали недвижимость\nНалог:~s~ ${coffer.getTaxIntermediate()}%\n~g~Получено:~s~ ${methods.moneyFormat(nalog)}`);
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

    if (vehicles.exists(player.vehicle)) {
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
    }

    id = methods.parseInt(id);

    let hInfo = stocks.getData(id);
    player.dimension = id + enums.offsets.stock;
    if (vehicles.exists(player.vehicle))
        player.vehicle.dimension = id + enums.offsets.stock;
    let intId = hInfo.get('interior');
    user.teleportVeh(player, stocks.interiorList[intId][4], stocks.interiorList[intId][5], stocks.interiorList[intId][6], stocks.interiorList[intId][7]);
};