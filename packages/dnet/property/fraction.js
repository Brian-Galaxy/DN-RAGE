let Container = require('../modules/data');
let mysql = require('../modules/mysql');
let methods = require('../modules/methods');

let user = require('../user');
let coffer = require('../coffer');
let enums = require('../enums');

let weather = require('../managers/weather');

let vehicles = require('./vehicles');
let stocks = require('./stocks');

let fraction = exports;

let count = 0;

let isCargo = false;

fraction.warVehPos = [
    [2928.988, 4326.465, 50.24669, 110.217],
    [2435.031, 5849.181, 58.25533, 212.8665],
    [6.348791, 6991.53, 2.57166, 127.8678],
    [-510.0732, 5264.707, 80.42155, 142.493],
    [-1132.549, 2694.568, 18.61222, 136.3167],
    [2792.521, -586.8479, 4.593227, 202.1658],
    [2610.733, 1779.282, 14.89643, 54.15783],
    [3821.329, 4495.155, 4.003921, 200.5734],
    [3346.39, 5460.819, 21.0535, 152.928],
    [2548.83, 4646.1, 33.8904, 318.3983],
    [2313.962, 4856.113, 41.62167, 226.6534],
    [2015.526, 4980.063, 41.0751, 211.3261],
    [1705.282, 4820.805, 41.82844, 358.1678],
    [1638.058, 4858.017, 41.83628, 152.9237],
    [1376.23, 4294.902, 36.58451, 34.89478],
    [764.3878, 4153.446, 32.82285, 257.7639],
    [-217.1819, 3643.204, 51.57141, 198.9409],
    [448.8071, 3523.698, 33.37255, 96.53196],
    [895.5853, 3610.553, 32.63937, 282.7461],
    [1377.589, 3620.44, 34.70487, 179.3007],
    [1709.564, 3318.991, 40.99873, 44.82842],
];

fraction.loadAll = function() {
    methods.debug('fraction.loadAll');

    mysql.executeQuery(`SELECT * FROM fraction_list`, function (err, rows, fields) {
        rows.forEach(function(item) {
            fraction.set(item['id'], 'id', item['id']);
            fraction.set(item['id'], 'owner_id', item['owner_id']);
            fraction.set(item['id'], 'name', item['name']);
            fraction.set(item['id'], 'money', item['money']);
            fraction.set(item['id'], 'is_bank', item['is_bank']);
            fraction.set(item['id'], 'is_shop', item['is_shop']);
            fraction.set(item['id'], 'is_war', item['is_war']);
            fraction.set(item['id'], 'is_kill', item['is_kill']);
            fraction.set(item['id'], 'rank_leader', item['rank_leader']);
            fraction.set(item['id'], 'rank_sub_leader', item['rank_sub_leader']);
            fraction.set(item['id'], 'rank_list', item['rank_list']);
            fraction.set(item['id'], 'rank_type_list', item['rank_type_list']);
        });
        count = rows.length;
        methods.debug('All Fraction Loaded: ' + count);
    });
};

fraction.removeTaxAndSave = function() {
    methods.debug('fraction.removeTax');

    mysql.executeQuery(`SELECT * FROM fraction_list`, function (err, rows, fields) {
        rows.forEach(function(item) {
            let sum = 5;
            if (item['is_war'])
                sum += 10;
            if (item['is_shop'])
                sum += 5;
            fraction.removeMoney(item['id'], sum, 'Взнос за существование');
            fraction.save(item['id']);
        });
    });
};

fraction.saveAll = function() {
    methods.debug('fraction.saveAll');
    mysql.executeQuery(`SELECT * FROM fraction_list`, function (err, rows, fields) {
        rows.forEach(function(item) {
            fraction.save(item['id']);
        });
    });
};

fraction.createCargoWar = function() {
    methods.notifyWithPictureToFractions2('Борьба за груз', `~r~ВНИМАНИЕ!`, 'Началась война за груз, груз отмечен на карте');
    isCargo = true;

    let spawnList = [];
    spawnList.push(methods.getRandomInt(0, fraction.warVehPos.length));
    spawnList.push(methods.getRandomInt(0, fraction.warVehPos.length));
    spawnList.push(methods.getRandomInt(0, fraction.warVehPos.length));

    spawnList.forEach((item, i) => {
        vehicles.spawnCarCb(veh => {

            if (!vehicles.exists(veh))
                return;

            let rare = 0;
            if (methods.getRandomInt(0, 100) < 40)
                rare = 1;
            if (methods.getRandomInt(0, 100) < 15)
                rare = 2;

            try {
                let color = methods.getRandomInt(0, 150);
                veh.numberPlateType = methods.getRandomInt(0, 3);
                veh.locked = false;
                veh.setColor(color, color);

                let rare = 0;
                if (methods.getRandomInt(0, 100) < 40)
                    rare = 1;
                if (methods.getRandomInt(0, 100) < 15)
                    rare = 2;
                let boxRandom = stocks.boxList.filter((item) => { return item[7] === rare; });
                veh.setVariable('box1', boxRandom[methods.getRandomInt(0, boxRandom.length)][2]);

                rare = 0;
                if (methods.getRandomInt(0, 100) < 40)
                    rare = 1;
                if (methods.getRandomInt(0, 100) < 15)
                    rare = 2;
                boxRandom = stocks.boxList.filter((item) => { return item[7] === rare; });
                veh.setVariable('box2', boxRandom[methods.getRandomInt(0, boxRandom.length)][2]);

                rare = 0;
                if (methods.getRandomInt(0, 100) < 40)
                    rare = 1;
                if (methods.getRandomInt(0, 100) < 15)
                    rare = 2;
                boxRandom = stocks.boxList.filter((item) => { return item[7] === rare; });
                veh.setVariable('box3', boxRandom[methods.getRandomInt(0, boxRandom.length)][2]);

                veh.setVariable('cargoId', i);
            }
            catch (e) {
                methods.debug(e);
            }

        }, new mp.Vector3(fraction.warVehPos[item][0], fraction.warVehPos[item][1], fraction.warVehPos[item][2]), fraction.warVehPos[item][3], 'Speedo4');
    });

    setTimeout(fraction.timerCargoWar, 1000);
};

fraction.stopCargoWar = function() {

    if (!isCargo)
        return;

    methods.notifyWithPictureToFractions2('Борьба за груз', `~r~ВНИМАНИЕ!`, 'Миссия была завершена по времени');
    isCargo = false;

    mp.vehicles.forEach(v => {
        if (!vehicles.exists(v))
            return;
        if (v.getVariable('cargoId') !== null && v.getVariable('cargoId') !== undefined) {
            if (v.getOccupants().length == 0)
                vehicles.respawn(v);
        }
    });

    mp.players.forEach(p => {
        if (!user.isLogin(p))
            return;

        if (user.get(p, 'fraction_id2') > 0) {
            user.deleteBlip1(p);
            user.deleteBlip2(p);
            user.deleteBlip3(p);
        }
    });
};

fraction.timerCargoWar = function() {
    if (!isCargo)
        return;

    isCargo = false;

    mp.players.forEach(p => {
        if (!user.isLogin(p))
            return;

        if (user.get(p, 'fraction_id2') > 0 && user.has(p, 'isCargo')) {
            user.deleteBlip1(p);
            user.deleteBlip2(p);
            user.deleteBlip3(p);
        }
    });

    mp.vehicles.forEachInDimension(0, v => {
        if (!vehicles.exists(v))
            return;

        if (v.bodyHealth === 0 || v.engineHealth === 0 || v.dead)
            return;

        if (v.getVariable('cargoId') !== null && v.getVariable('cargoId') !== undefined) {
            let cargoId = methods.parseInt(v.getVariable('cargoId'));
            let vPos = v.position;

            isCargo = true;

            mp.players.forEach(p => {
                if (!user.isLogin(p))
                    return;

                if (user.get(p, 'fraction_id2') > 0 && user.has(p, 'isCargo')) {
                    if (cargoId === 1)
                        user.createBlip1(p, vPos.x, vPos.y, vPos.z, 616, 1);
                    else if (cargoId === 2)
                        user.createBlip2(p, vPos.x, vPos.y, vPos.z, 616, 2);
                    else
                        user.createBlip3(p, vPos.x, vPos.y, vPos.z, 616, 3);
                }
            });
        }
    });

    if (!isCargo) {

        methods.notifyWithPictureToFractions2('Борьба за груз', `~r~Конец поставкам`, 'Весь груз был доставлен, ждите следующую партию');

        mp.players.forEach(p => {
            if (!user.isLogin(p))
                return;

            if (user.get(p, 'fraction_id2') > 0) {
                user.deleteBlip1(p);
                user.deleteBlip2(p);
                user.deleteBlip3(p);
            }
        });
    }

    setTimeout(fraction.timerCargoWar, 5000);
};

fraction.save = function(id) {

    return new Promise((resolve) => {
        methods.debug('fraction.save');

        if (!fraction.has(id, "id")) {
            resolve();
            return;
        }

        let sql = "UPDATE fraction_list SET";

        sql = sql + " name = '" + methods.removeQuotes(fraction.get(id, "name")) + "'";
        sql = sql + ", money = '" + methods.parseInt(fraction.get(id, "money")) + "'";
        sql = sql + ", is_bank = '" + methods.parseInt(fraction.get(id, "is_bank")) + "'";
        sql = sql + ", is_shop = '" + methods.parseInt(fraction.get(id, "is_shop")) + "'";
        sql = sql + ", is_war = '" + methods.parseInt(fraction.get(id, "is_war")) + "'";
        sql = sql + ", is_kill = '" + methods.parseInt(fraction.get(id, "is_kill")) + "'";
        sql = sql + ", rank_leader = '" + methods.removeQuotes(fraction.get(id, "rank_leader")) + "'";
        sql = sql + ", rank_sub_leader = '" + methods.removeQuotes(fraction.get(id, "rank_sub_leader")) + "'";
        sql = sql + ", rank_list = '" + methods.removeQuotes(fraction.get(id, "rank_list")) + "'";
        sql = sql + ", rank_type_list = '" + methods.removeQuotes(fraction.get(id, "rank_type_list")) + "'";

        sql = sql + " where id = '" + methods.parseInt(fraction.get(id, "id")) + "'";
        mysql.executeQuery(sql, undefined, function () {
            resolve();
        });
    });
};

fraction.getData = function(id) {
    return Container.Data.GetAll(enums.offsets.fraction + methods.parseInt(id));
};

fraction.get = function(id, key) {
    return Container.Data.Get(enums.offsets.fraction + methods.parseInt(id), key);
};

fraction.has = function(id, key) {
    return Container.Data.Has(enums.offsets.fraction + methods.parseInt(id), key);
};

fraction.set = function(id, key, val) {
    Container.Data.Set(enums.offsets.fraction + methods.parseInt(id), key, val);
};

fraction.getName = function(id) {
    return fraction.get(id, 'name');
};

fraction.addMoney = function(id, money, name = "Операция со счетом") {
    fraction.addHistory('Система', name, `Зачисление в бюждет: ${methods.cryptoFormat(money)}`, id);
    fraction.setMoney(id, fraction.getMoney(id) + methods.parseFloat(money));
};

fraction.removeMoney = function(id, money, name = "Операция со счетом") {
    fraction.addHistory('Система', name, `Потрачено из бюджета: ${methods.cryptoFormat(money * -1)}`, id);
    fraction.setMoney(id, fraction.getMoney(id) - methods.parseFloat(money));
};

fraction.setMoney = function(id, money) {
    id = methods.parseInt(id);
    Container.Data.Set(enums.offsets.fraction + id, 'money', methods.parseFloat(money));
};

fraction.getMoney = function(id) {
    id = methods.parseInt(id);
    if (Container.Data.Has(enums.offsets.fraction + id, 'money'))
        return methods.parseFloat(Container.Data.Get(enums.offsets.fraction + id, 'money'));
    return 0;
};

fraction.addHistory = function (name, doName, text, fractionId) {
    doName = methods.removeQuotes(doName);
    text = methods.removeQuotes(text);
    name = methods.removeQuotes(name);
    mysql.executeQuery(`INSERT INTO log_fraction_2 (name, text, text2, fraction_id, timestamp, rp_datetime) VALUES ('${name}', '${doName}', '${text}', '${fractionId}', '${methods.getTimeStamp()}', '${weather.getRpDateTime()}')`);
};

fraction.editFractionName = function(player, text) {
    if (!user.isLogin(player))
        return;

    let id = user.get(player, 'fraction_id2');
    fraction.set(id, "name", methods.removeQuotes2(methods.removeQuotes(text)));
    player.notify('~g~Вы сменили название организации');

    fraction.save(id);
};

fraction.editFractionLeader = function(player, text) {
    if (!user.isLogin(player))
        return;

    let id = user.get(player, 'fraction_id2');
    fraction.set(id, "rank_leader", methods.removeQuotes2(methods.removeQuotes(text)));
    player.notify('~g~Вы обновили название ранга');

    fraction.save(id);
};

fraction.editFractionSubLeader = function(player, text) {
    if (!user.isLogin(player))
        return;

    let id = user.get(player, 'fraction_id2');
    fraction.set(id, "rank_sub_leader", methods.removeQuotes2(methods.removeQuotes(text)));
    player.notify('~g~Вы обновили название ранга');

    fraction.save(id);
};

fraction.editFractionRank = function(player, text, rankId, depId) {
    if (!user.isLogin(player))
        return;

    text = methods.removeQuotes2(methods.removeQuotes(text));

    let id = user.get(player, 'fraction_id2');
    let rankList = JSON.parse(fraction.get(id, 'rank_list'));
    rankList[depId][rankId] = text;
    fraction.set(id, "rank_list", JSON.stringify(rankList));

    player.notify('~g~Вы обновили название ранга');

    fraction.save(id);
};

fraction.editFractionDep = function(player, text, depId) {
    if (!user.isLogin(player))
        return;

    text = methods.removeQuotes2(methods.removeQuotes(text));

    let id = user.get(player, 'fraction_id2');
    let depList = JSON.parse(fraction.get(id, 'rank_type_list'));
    depList[depId] = text;
    fraction.set(id, "rank_type_list", JSON.stringify(depList));

    player.notify('~g~Вы обновили название раздела');

    fraction.save(id);
};

fraction.deleteFractionDep = function(player) {
    if (!user.isLogin(player))
        return;

    let id = user.get(player, 'fraction_id2');

    let depList = JSON.parse(fraction.get(id, 'rank_type_list'));
    let rankList = JSON.parse(fraction.get(id, 'rank_list'));
    depList.pop();
    rankList.pop();

    fraction.set(id, "rank_type_list", JSON.stringify(depList));
    fraction.set(id, "rank_list", JSON.stringify(rankList));

    player.notify('~g~Вы удалили раздел');

    fraction.save(id);
};

fraction.addFractionRank = function(player, text, depId) {
    if (!user.isLogin(player))
        return;

    text = methods.removeQuotes2(methods.removeQuotes(text));

    let id = user.get(player, 'fraction_id2');
    let rankList = JSON.parse(fraction.get(id, 'rank_list'));
    rankList[depId].push(text);
    fraction.set(id, "rank_list", JSON.stringify(rankList));

    player.notify('~g~Вы добавили должность');

    fraction.save(id);
};

fraction.editFractionDep = function(player, text, depId) {
    if (!user.isLogin(player))
        return;

    text = methods.removeQuotes2(methods.removeQuotes(text));

    let id = user.get(player, 'fraction_id2');
    let depList = JSON.parse(fraction.get(id, 'rank_type_list'));
    depList[depId] = text;
    fraction.set(id, "rank_type_list", JSON.stringify(depList));

    player.notify('~g~Вы обновили название раздела');

    fraction.save(id);
};

fraction.createFractionDep = function(player, text) {
    if (!user.isLogin(player))
        return;

    let id = user.get(player, 'fraction_id2');

    text = methods.removeQuotes2(methods.removeQuotes(text));

    let depList = JSON.parse(fraction.get(id, 'rank_type_list'));
    depList.push(text);

    let rankList = JSON.parse(fraction.get(id, 'rank_list'));
    rankList.push(["Глава отдела", "Зам. главы отдела"]);

    fraction.set(id, "rank_type_list", JSON.stringify(depList));
    fraction.set(id, "rank_list", JSON.stringify(rankList));

    player.notify('~g~Вы сменили добавили новый раздел');

    fraction.save(id);
};

fraction.updateOwnerInfo = function (id, userId) {
    methods.debug('fraction.updateOwnerInfo');
    id = methods.parseInt(id);
    userId = methods.parseInt(userId);

    fraction.set(id, "owner_id", userId);

    if (userId == 0) {
        fraction.set(id, "rank_leader", 'Лидер');
        fraction.set(id, "rank_sub_leader", 'Заместитель');
        fraction.set(id, "rank_type_list", '["Основной состав"]');
        fraction.set(id, "rank_list", '[["Глава отдела", "Зам. главы отдела", "Соучастник"]]');
    }
    else
        mysql.executeQuery("UPDATE fraction_list SET owner_id = '" + userId + "' where id = '" + id + "'");

    fraction.save(id);
};

fraction.create = function (player, id) {
    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    methods.debug('fraction.create');

    if (user.get(player, 'fraction_id2') > 0) {
        player.notify('~r~Вы уже состоите в организации');
        return;
    }
    if (fraction.get(id, 'owner_id') > 0) {
        player.notify('~r~У организации уже есть владелец');
        return;
    }
    if (user.getCryptoMoney(player) < 100) {
        player.notify('~r~У Вас не достаточно валюты E-COIN для создания организации');
        return;
    }

    user.set(player, 'fraction_id2', id);
    user.set(player, 'is_leader2', true);

    fraction.setMoney(id, 100);
    fraction.addHistory(user.getRpName(player), 'Создал организацию', '', id);
    fraction.updateOwnerInfo(id, user.getId(player));
    user.removeCryptoMoney(player, 100, 'Создание организации');

    setTimeout(function () {
        if (!user.isLogin(player))
            return;
        user.save(player);
        player.notify('~g~Поздравляем с созданием организации');
    }, 500);
};

fraction.destroy = function (player, id) {
    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    methods.debug('fraction.destroy');

    if (fraction.get(id, 'owner_id') != user.getId(player)) {
        player.notify('~r~Эта организация вам не приналдежит');
        return;
    }

    fraction.set(id, "name", 'Слот свободен');
    fraction.set(id, "money", 0);
    fraction.set(id, "is_bank", false);
    fraction.set(id, "is_shop", false);
    fraction.set(id, "is_war", false);
    fraction.set(id, "is_kill", false);
    fraction.set(id, "rank_leader", 'Лидер');
    fraction.set(id, "rank_sub_leader", 'Заместитель');
    fraction.set(id, "rank_type_list", '["Основной состав"]');
    fraction.set(id, "rank_list", '[["Глава отдела", "Зам. главы отдела", "Соучастник"]]');

    user.set(player, 'fraction_id2', 0);
    user.set(player, 'is_leader2', false);

    fraction.updateOwnerInfo(id, 0);

    mysql.executeQuery("UPDATE users SET fraction_id2 = '" + 0 + "' where fraction_id2 = '" + id + "'");

    mp.players.forEach(p => {
        if (!user.isLogin(p))
            return;

        if (user.get(p, 'fraction_id2') == id) {
            user.set(p, 'fraction_id2', 0);
            user.set(p, 'is_leader2', false);
            p.notify('~y~Организация была расфомирована');
        }
    });

    setTimeout(function () {
        if (!user.isLogin(player))
            return;
        user.save(player);
        player.notify('~y~Организация была расфомирована');
    }, 500);
};

