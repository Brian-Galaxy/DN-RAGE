let Container = require('../modules/data');
let mysql = require('../modules/mysql');
let methods = require('../modules/methods');
let chat = require('../modules/chat');
let user = require('../user');
let coffer = require('../coffer');
let enums = require('../enums');
let vehicles = require('../property/vehicles');
let houses = exports;

let hBlips = new Map();
let count = 0;

houses.interiorList = [
    [1973.087, 3816.231, 32.42871, 32.09988], //0
    [1973.087, 3816.231, 32.42871, 32.09988], //1
    [151.33824, -1007.64196, -100.00000, -0.800103], //2
    [-1908.757, -572.6663, 18.10679, -123.2994], //3
    [265.15405, -1000.99035, -100.01189, 1.40028], //4
    [-1150.627, -1520.831, 9.63272, 42.19985], //5
    [346.52127, -1002.45306, -100.19626, 1.699997], //6
    [-14.2267, -1440.357, 30.10154, 6.423715], //7
    [7.74072, 538.5586, 175.0281, 158.1992], //8
    [-815.6338, 178.5606, 71.15309, -62.49992], //9
    [-777.3342, 323.6484, 210.9974, -89.99999], //10
    [-758.5388, 619.0275, 143.159, 115.8703], //11
    [-1289.856, 449.4803, 96.90755, -180], //12
    [-781.7711, 318.185, 216.6389, 0], //13
    [-777.33831, 340.02807, 206.62086, 93.02799], //14
    [980.438720703125, 56.759857177734375, 115.1641845703125, 56.140254974365234], //15
    [373.4725646972656, 423.40234375, 144.9078826904297, 169.2933807373047], //16
    [341.7474670410156, 437.6512145996094, 148.39407348632812, 115.6588134765625], //17
    [117.16754913330078, 559.5700073242188, 183.30487060546875, 188.30841064453125], //18
    [-174.2841339111328, 497.3167419433594, 136.66693115234375, 192.0149688720703], //19
    [-571.9983520507812, 661.6953735351562, 144.83985900878906, 165.8435821533203], //20
    [-682.216796875, 592.0908813476562, 144.39306640625, 223.222900390625], //21
    [-859.8622436523438, 690.9188842773438, 151.86073303222656, 187.37477111816406], //22
];

houses.garageList = [
    [220.23667907714844, -1038.711669921875, -90.78311920166016, 88.62765502929688, 220.23667907714844, -1038.711669921875, -90.78311920166016, 88.62765502929688], //0
    [220.72119140625, -1023.2865600585938, -90.7841567993164, 90.07861328125, 220.72119140625, -1023.2865600585938, -90.7841567993164, 90.07861328125], //1
    [171.62208557128906, -1004.2356567382812, -99.34237670898438, 176.3421630859375, 174.87139892578125, -1004.3195190429688, -99.34042358398438, 175.2149658203125], //2
    [194.46551513671875, -1023.3160400390625, -99.34183502197266, 178.6278076171875, 194.46551513671875, -1023.3160400390625, -99.34183502197266, 178.6278076171875], //3
    [202.08786010742188, -1004.32177734375, -99.3424072265625, 179.615478515625, 194.57009887695312, -1003.9288330078125, -99.34040832519531, 179.01983642578125], //4
    [231.94662475585938, -1002.9686889648438, -99.34088897705078, 177.40728759765625, 224.2627716064453, -1002.6691284179688, -99.3412094116211, 179.1136474609375], //5
    [242.027587890625, -1062.6820068359375, -96.04125213623047, 181.24737548828125, 246.3050079345703, -1062.699951171875, -96.04120635986328, 180.39952087402344], //6
    [-850.1660766601562, 276.265625, 32.91801452636719, 185.994873046875, -850.1660766601562, 276.265625, 32.91801452636719, 185.994873046875], //7
    [-810.5316162109375, 306.0752868652344, 32.911216735839844, 189.51881408691406, -806.1517333984375, 307.5685729980469, 32.91827392578125, 215.94622802734375], //8
];

houses.garageIntList = [
    [224.57962036132812, -1041.0115966796875, -91.43866729736328, 356.06982421875], //0
    [224.49180603027344, -1025.9735107421875, -91.43852996826172, 356.19805908203125], //1
    [179.0699005126953, -1000.7018432617188, -99.99992370605469, 166.12240600585938], //2
    [206.85565185546875, -1018.3351440429688, -100, 79.45574188232422], //3
    [206.68206787109375, -999.125732421875, -99.99996948242188, 85.36624145507812], //4
    [240.39942932128906, -1004.7258911132812, -99.99995422363281, 90.05451202392578], //5
    [249.55140686035156, -1058.4586181640625, -96.70084381103516, 178.64881896972656], //6
    [-853.1052856445312, 272.1293029785156, 32.258548736572266, 304.2354736328125], //7
    [-812.22607421875, 301.4500427246094, 32.258548736572266, 37.54323196411133], //8
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
            houses.set(item['id'], 'pin', item['pin']);
            houses.set(item['id'], 'is_safe', item['is_safe']);
            houses.set(item['id'], 'is_sec', item['is_sec']);
            houses.set(item['id'], 'is_lock', item['is_lock']);
            houses.set(item['id'], 'interior', item['interior']);
            houses.set(item['id'], 'x', item['x']);
            houses.set(item['id'], 'y', item['y']);
            houses.set(item['id'], 'z', item['z']);
            houses.set(item['id'], 'rot', item['rot']);

            houses.set(item['id'], 'ginterior1', item['ginterior1']);
            houses.set(item['id'], 'gx1', item['gx1']);
            houses.set(item['id'], 'gy1', item['gy1']);
            houses.set(item['id'], 'gz1', item['gz1']);
            houses.set(item['id'], 'grot1', item['grot1']);

            houses.set(item['id'], 'ginterior2', item['ginterior2']);
            houses.set(item['id'], 'gx2', item['gx2']);
            houses.set(item['id'], 'gy2', item['gy2']);
            houses.set(item['id'], 'gz2', item['gz2']);
            houses.set(item['id'], 'grot2', item['grot2']);

            houses.set(item['id'], 'ginterior3', item['ginterior3']);
            houses.set(item['id'], 'gx3', item['gx3']);
            houses.set(item['id'], 'gy3', item['gy3']);
            houses.set(item['id'], 'gz3', item['gz3']);
            houses.set(item['id'], 'grot3', item['grot3']);

            houses.set(item['id'], 'tax_money', item['tax_money']);
            houses.set(item['id'], 'tax_score', item['tax_score']);

            let sprite = 40;
            let scale = 0.4;
            let name = undefined;
            if (item['ginterior1'] >= 0) {
                sprite = 492;
                scale = 0.55;
                name = '';
            }

            let pos = new mp.Vector3(parseFloat(item['x']), parseFloat(item['y']), parseFloat(item['z']));
            let blip = methods.createBlip(pos, sprite, item['user_id'] > 0 ? 59 : 69, scale, name);

            let hBlip = {
                blip: blip,
                position: pos,
                g1: { int: item['ginterior1'], position: new mp.Vector3(parseFloat(item['gx1']), parseFloat(item['gy1']), parseFloat(item['gz1'])), rot: item['grot1'] },
                g2: { int: item['ginterior2'], position: new mp.Vector3(parseFloat(item['gx2']), parseFloat(item['gy2']), parseFloat(item['gz2'])), rot: item['grot2'] },
                g3: { int: item['ginterior3'], position: new mp.Vector3(parseFloat(item['gx3']), parseFloat(item['gy3']), parseFloat(item['gz3'])), rot: item['grot3'] },
            };

            methods.createStaticCheckpoint(hBlip.position.x, hBlip.position.y, hBlip.position.z, "Нажмите ~g~Е~s~ чтобы открыть меню");

            if (hBlip.g1.int >= 0)
                methods.createStaticCheckpointV(hBlip.g1.position, "Нажмите ~g~Е~s~ чтобы открыть меню гаража", 3, -1, [33, 150, 243, 0]);
            if (hBlip.g2.int >= 0)
                methods.createStaticCheckpointV(hBlip.g2.position, "Нажмите ~g~Е~s~ чтобы открыть меню гаража", 3, -1, [33, 150, 243, 0]);
            if (hBlip.g3.int >= 0)
                methods.createStaticCheckpointV(hBlip.g3.position, "Нажмите ~g~Е~s~ чтобы открыть меню гаража", 3, -1, [33, 150, 243, 0]);

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

    houses.garageIntList.forEach(function(item) {
        let x = item[0];
        let y = item[1];
        let z = item[2];
        methods.createStaticCheckpoint(x, y, z, "Нажмите ~g~Е~s~ чтобы открыть меню");
    });

    houses.garageList.forEach(function(item) {
        let x = item[0];
        let y = item[1];
        let z = item[2];
        methods.createStaticCheckpoint(x, y, z, "Нажмите ~g~Е~s~ чтобы открыть меню гаража", 3, -1, [33, 150, 243, 0]);

        x = item[4];
        y = item[5];
        z = item[6];
        methods.createStaticCheckpoint(x, y, z, "Нажмите ~g~Е~s~ чтобы открыть меню гаража", 3, -1, [33, 150, 243, 0]);
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
            houses.set(item['id'], 'pin', item['pin']);
            houses.set(item['id'], 'is_safe', item['is_safe']);
            houses.set(item['id'], 'is_sec', item['is_sec']);
            houses.set(item['id'], 'is_lock', item['is_lock']);
            houses.set(item['id'], 'interior', item['interior']);
            houses.set(item['id'], 'x', item['x']);
            houses.set(item['id'], 'y', item['y']);
            houses.set(item['id'], 'z', item['z']);
            houses.set(item['id'], 'rot', item['rot']);

            houses.set(item['id'], 'ginterior1', item['ginterior1']);
            houses.set(item['id'], 'gx1', item['gx1']);
            houses.set(item['id'], 'gy1', item['gy1']);
            houses.set(item['id'], 'gz1', item['gz1']);
            houses.set(item['id'], 'grot1', item['grot1']);

            houses.set(item['id'], 'ginterior2', item['ginterior2']);
            houses.set(item['id'], 'gx2', item['gx2']);
            houses.set(item['id'], 'gy2', item['gy2']);
            houses.set(item['id'], 'gz2', item['gz2']);
            houses.set(item['id'], 'grot2', item['grot2']);

            houses.set(item['id'], 'ginterior3', item['ginterior3']);
            houses.set(item['id'], 'gx3', item['gx3']);
            houses.set(item['id'], 'gy3', item['gy3']);
            houses.set(item['id'], 'gz3', item['gz3']);
            houses.set(item['id'], 'grot3', item['grot3']);

            houses.set(item['id'], 'tax_money', item['tax_money']);
            houses.set(item['id'], 'tax_score', item['tax_score']);

            let pos = new mp.Vector3(parseFloat(item['x']), parseFloat(item['y']), parseFloat(item['z']));
            let blip = methods.createBlip(pos, 40, item['user_id'] > 0 ? 59 : 69, 0.4);

            let hBlip = {
                blip: blip,
                position: pos,
                g1: { int: item['ginterior1'], position: new mp.Vector3(parseFloat(item['gx1']), parseFloat(item['gy1']), parseFloat(item['gz1'])), rot: item['grot1'] },
                g2: { int: item['ginterior2'], position: new mp.Vector3(parseFloat(item['gx2']), parseFloat(item['gy2']), parseFloat(item['gz2'])), rot: item['grot2'] },
                g3: { int: item['ginterior3'], position: new mp.Vector3(parseFloat(item['gx3']), parseFloat(item['gy3']), parseFloat(item['gz3'])), rot: item['grot3'] },
            };

            methods.createStaticCheckpoint(hBlip.position.x, hBlip.position.y, hBlip.position.z, "Нажмите ~g~Е~s~ чтобы открыть меню");

            hBlips.set(item['id'], hBlip);

            chat.sendToAll(`Дом добавлен. ID: ${item['id']}. Name: ${item['number']}. Int: ${item['interior']}. Price: ${methods.moneyFormat(item['price'])}`);

            mp.players.forEach(p => {
                methods.updateCheckpointList(p);
            });
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

houses.insert1 = function(player, id, int, gx, gy, gz, grot) {
    methods.debug('houses.insert1');

    houses.set(id, 'gx1', gx);
    houses.set(id, 'gy1', gy);
    houses.set(id, 'gz1', gz);
    houses.set(id, 'grot1', grot);

    mysql.executeQuery(`UPDATE houses SET grot1 = '${grot}', gx1 = '${gx}', gy1 = '${gy}', gz1 = '${gz}', ginterior1 = '${int}' where id = '${id}'`);

    player.outputChatBox(`Дом успешно обновлен (G1 | ID ${id} | INT ${int})`);
};

houses.insert2 = function(player, id, int, gx, gy, gz, grot) {
    methods.debug('houses.insert2');

    houses.set(id, 'gx2', gx);
    houses.set(id, 'gy2', gy);
    houses.set(id, 'gz2', gz);
    houses.set(id, 'grot2', grot);

    mysql.executeQuery(`UPDATE houses SET grot2 = '${grot}', gx2 = '${gx}', gy2 = '${gy}', gz2 = '${gz}', ginterior2 = '${int}' where id = '${id}'`);

    player.outputChatBox(`Дом успешно обновлен (G2 | ID ${id} | INT ${int})`);
};

houses.insert3 = function(player, id, int, gx, gy, gz, grot) {
    methods.debug('houses.insert3');

    houses.set(id, 'gx3', gx);
    houses.set(id, 'gy3', gy);
    houses.set(id, 'gz3', gz);
    houses.set(id, 'grot3', grot);

    mysql.executeQuery(`UPDATE houses SET grot3 = '${grot}', gx3 = '${gx}', gy3 = '${gy}', gz3 = '${gz}', ginterior3 = '${int}' where id = '${id}'`);

    player.outputChatBox(`Дом успешно обновлен (G3 | ID ${id} | INT ${int})`);
};

houses.getHouseData = function(id) {
    return Container.Data.GetAll(enums.offsets.house + methods.parseInt(id));
};

houses.get = function(id, key) {
    return Container.Data.Get(enums.offsets.house + methods.parseInt(id), key);
};

houses.set = function(id, key, val) {
    Container.Data.Set(enums.offsets.house + methods.parseInt(id), key, val);
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

    hBlips.get(id).blip.color = userId > 0 ? 59 : 69;

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

    houses.updateOwnerInfo(hInfo.get('id'), 0, '');

    coffer.removeMoney(1, nalog);
    user.addMoney(player, nalog, 'Продажа дома ' + hInfo.get('address') + ' №' + hInfo.get('number'));

    setTimeout(function () {
        if (!user.isLogin(player))
            return;
        user.addHistory(player, 3, 'Продал дом ' + hInfo.get('address') + ' №' + hInfo.get('number') + '. Цена: ' + methods.moneyFormat(nalog));
        player.notify(`~g~Вы продали недвижимость\nНалог:~s~ ${coffer.getTaxIntermediate()}%\n~g~Получено:~s~ ${methods.moneyFormat(nalog)}`);
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

    houses.updateOwnerInfo(id, user.get(player, 'id'), user.get(player, 'name'));

    coffer.addMoney(1, hInfo.get('price'));
    user.removeMoney(player, hInfo.get('price'), 'Покупка дома ' + hInfo.get('address') + ' №' + hInfo.get('number'));
    setTimeout(function () {
        if (!user.isLogin(player))
            return;
        user.addHistory(player, 3, 'Купил дом ' + hInfo.get('address') + ' №' + hInfo.get('number') + '. Цена: ' + methods.moneyFormat(hInfo.get('price')));
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
    user.teleport(player, houses.interiorList[intId][0], houses.interiorList[intId][1], houses.interiorList[intId][2] + 1, houses.interiorList[intId][3]);
};

houses.enterGarage = function (player, id) {
    if (!user.isLogin(player))
        return;
    user.teleport(player, houses.garageList[id][0], houses.garageList[id][1], houses.garageList[id][2], houses.garageList[id][3])
};

houses.enterv = function (player, id) {
    methods.debug('houses.enter', id);

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

    let hInfo = houses.getHouseData(id);

    let garageId = -1;

    let pos1 = new mp.Vector3(hInfo.get('gx1'), hInfo.get('gy1'), hInfo.get('gz1'));
    let pos2 = new mp.Vector3(hInfo.get('gx2'), hInfo.get('gy2'), hInfo.get('gz2'));
    let pos3 = new mp.Vector3(hInfo.get('gx3'), hInfo.get('gy3'), hInfo.get('gz3'));

    if (methods.distanceToPos(player.position, pos1) < 4)
        garageId = hInfo.get('ginterior1');
    else if (methods.distanceToPos(player.position, pos2) < 4)
        garageId = hInfo.get('ginterior2');
    else if (methods.distanceToPos(player.position, pos3) < 4)
        garageId = hInfo.get('ginterior3');

    if (garageId == -1) {
        player.notify('~r~Произошла неизвестная ошибка');
        return;
    }

    let pos = new mp.Vector3(houses.garageList[garageId][0], houses.garageList[garageId][1], houses.garageList[garageId][2]);
    let v = methods.getNearestVehicleWithCoords(pos, 4, id);

    if (vehicles.exists(v) && player.vehicle) {
        let pos = new mp.Vector3(houses.garageList[garageId][4], houses.garageList[garageId][5], houses.garageList[garageId][6]);
        let v2 = methods.getNearestVehicleWithCoords(pos, 4, id);

        if (vehicles.exists(v2) && player.vehicle) {
            player.notify('~r~К сожалению, сейчас у ворот уже стоит транспорт, необходимо чтобы он отъехал');
            return;
        }

        player.dimension = id;
        if (vehicles.exists(player.vehicle))
            player.vehicle.dimension = id;
        user.teleportVeh(player, houses.garageList[garageId][4], houses.garageList[garageId][5], houses.garageList[garageId][6], houses.garageList[garageId][7]);
        return;
    }

    player.dimension = id;
    if (vehicles.exists(player.vehicle))
        player.vehicle.dimension = id;
    user.teleportVeh(player, houses.garageList[garageId][0], houses.garageList[garageId][1], houses.garageList[garageId][2], houses.garageList[garageId][3]);
};

houses.exitv = function (player, id) {
    methods.debug('houses.enter', id);

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

    let hInfo = houses.getHouseData(id);
    let garageId = -1;

    let pos1 = new mp.Vector3(0, 0, 0);
    let pos11 = new mp.Vector3(0, 0, 0);
    let pos2 = new mp.Vector3(0, 0, 0);
    let pos22 = new mp.Vector3(0, 0, 0);
    let pos3 = new mp.Vector3(0, 0, 0);
    let pos33 = new mp.Vector3(0, 0, 0);


    if (hInfo.get('ginterior1') >= 0) {
        pos1 = new mp.Vector3(houses.garageList[hInfo.get('ginterior1')][0], houses.garageList[hInfo.get('ginterior1')][1], houses.garageList[hInfo.get('ginterior1')][2]);
        pos11 = new mp.Vector3(houses.garageList[hInfo.get('ginterior1')][4], houses.garageList[hInfo.get('ginterior1')][5], houses.garageList[hInfo.get('ginterior1')][6]);
    }
    if (hInfo.get('ginterior2') >= 0) {
        pos2 = new mp.Vector3(houses.garageList[hInfo.get('ginterior2')][0], houses.garageList[hInfo.get('ginterior2')][1], houses.garageList[hInfo.get('ginterior2')][2]);
        pos22 = new mp.Vector3(houses.garageList[hInfo.get('ginterior2')][4], houses.garageList[hInfo.get('ginterior2')][5], houses.garageList[hInfo.get('ginterior2')][6]);
    }
    if (hInfo.get('ginterior3') >= 0) {
        pos3 = new mp.Vector3(houses.garageList[hInfo.get('ginterior3')][0], houses.garageList[hInfo.get('ginterior3')][1], houses.garageList[hInfo.get('ginterior3')][2]);
        pos33 = new mp.Vector3(houses.garageList[hInfo.get('ginterior3')][4], houses.garageList[hInfo.get('ginterior3')][5], houses.garageList[hInfo.get('ginterior3')][6]);
    }

    if (methods.distanceToPos(player.position, pos1) < 4 || methods.distanceToPos(player.position, pos11) < 4)
        garageId = 1;
    else if (methods.distanceToPos(player.position, pos2) < 4 || methods.distanceToPos(player.position, pos22) < 4)
        garageId = 2;
    else if (methods.distanceToPos(player.position, pos3) < 4 || methods.distanceToPos(player.position, pos33) < 4)
        garageId = 3;

    if (garageId == -1) {
        player.notify('~r~Произошла неизвестная ошибка');
        return;
    }

    player.dimension = 0;
    if (vehicles.exists(player.vehicle))
        player.vehicle.dimension = 0;
    user.teleportVeh(player, hInfo.get('gx' + garageId), hInfo.get('gy' + garageId), hInfo.get('gz' + garageId), hInfo.get('grot' + garageId));
};