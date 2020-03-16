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
let timer = 0;

let isCargo = false;

fraction.warVehPos = [
    [-2989.434, 1206.93, 19.08533, 70.15103],
    [-2435.731, 2523.682, 2.518846, 83.1944],
    [-1668.367, 2645.572, 2.979561, 94.16602],
    [350.1584, 4429.85, 63.38568, -105.9183],
    [-315.2474, 2736.321, 67.8849, -147.9187],
    [-1350.313, 2162.407, 52.14052, 44.2464],
    [979.4666, 3096.74, 41.07245, -72.98763],
    [341.0433, 3566.049, 33.17041, -46.338],
    [2055.644, 3453.539, 43.53216, 153.3053],
    [2660.627, 3558.221, 50.43495, -62.438],
    [2975.506, 3485.838, 71.16584, -86.34027],
    [1823.644, 4733.436, 33.31877, 77.89813],
    [978.9515, 4457.739, 50.80576, 84.43235],
    [-1633.405, 4736.897, 52.98176, 4.152024],
    [-853.0948, 5779.731, 3.461468, -101.4297],
    [-919.3998, 6149.975, 5.019467, -1.557356],
    [-571.813, 6344.061, 2.893998, -60.66014],
    [163.4666, 6894.826, 20.52832, -116.7127],
    [1451.464, 6583.246, 12.10559, 166.5721],
    [2388.54, 4139.939, 34.49435, 146.3017],
    [810.6451, 1281.184, 360.1743, -93.71415],
    [757.1536, 2526.078, 72.88009, 84.84418],
    [1074.28, 2361.381, 43.88822, -173.297],
    [1400.453, 2997.436, 40.29012, -78.44015],
    [-600.0387, 5301.059, 69.95197, -163.2113],
];

let currentWarPos = [];

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

    currentWarPos = [];
    let spawnList = [];
    spawnList.push(methods.getRandomInt(0, fraction.warVehPos.length));
    spawnList.push(methods.getRandomInt(0, fraction.warVehPos.length));
    spawnList.push(methods.getRandomInt(0, fraction.warVehPos.length));

    timer = 600;

    spawnList.forEach((item, i) => {
        let posVeh = new mp.Vector3(fraction.warVehPos[item][0], fraction.warVehPos[item][1], fraction.warVehPos[item][2]);

        currentWarPos.push(posVeh);

        methods.debug('SPAWNPOS', posVeh);

        mp.players.forEach(p => {
            if (!user.isLogin(p))
                return;

            methods.debug('FOREACH', posVeh.x, posVeh.y, posVeh.z);
            methods.debug('FOREACH2', posVeh);

            if (user.get(p, 'fraction_id2') > 0 && user.has(p, 'isCargo')) {
                if (i === 1)
                {
                    user.createBlip(p, i, posVeh.x, posVeh.y, posVeh.z, 616, 1);

                    user.createBlipByRadius(p, i, posVeh.x, posVeh.y, posVeh.z, 15, 9, 1);
                    user.createBlipByRadius(p, i + 10, posVeh.x, posVeh.y, posVeh.z, 60, 9, 3);
                }
                else if (i === 2)
                {
                    user.createBlip(p, i, posVeh.x, posVeh.y, posVeh.z, 616, 2);

                    user.createBlipByRadius(p, i, posVeh.x, posVeh.y, posVeh.z, 15, 9, 1);
                    user.createBlipByRadius(p, i + 10, posVeh.x, posVeh.y, posVeh.z, 60, 9, 3);
                }
                else {
                    user.createBlip(p, i, posVeh.x, posVeh.y, posVeh.z, 616, 3);

                    user.createBlipByRadius(p, i, posVeh.x, posVeh.y, posVeh.z, 15, 9, 1);
                    user.createBlipByRadius(p, i + 10, posVeh.x, posVeh.y, posVeh.z, 60, 9, 3);
                }
            }
        });

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
                veh.locked = false;
                veh.setColor(color, color);

                veh.setMod(5, methods.getRandomInt(0, 2));

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
                if (methods.getRandomInt(0, 100) <= 50)
                    veh.setVariable('box3', methods.getRandomInt(3, 5));
                else
                    veh.setVariable('box3', methods.getRandomInt(38, 40));

                veh.setVariable('cargoId', i);
            }
            catch (e) {
                methods.debug(e);
            }

        }, posVeh, fraction.warVehPos[item][3], 'Speedo4');
    });

    setTimeout(fraction.timerCargoWar, 1000);
};

fraction.stopCargoWar = function() {

    //methods.notifyWithPictureToFractions2('Борьба за груз', `~r~ВНИМАНИЕ!`, 'Миссия была завершена');
    isCargo = false;
    timer = 0;

    /*mp.vehicles.forEach(v => {
        if (!vehicles.exists(v))
            return;
        if (v.getVariable('cargoId') !== null && v.getVariable('cargoId') !== undefined) {
            if (v.getOccupants().length == 0)
                vehicles.respawn(v);
        }
    });*/

    mp.players.forEach(p => {
        if (!user.isLogin(p))
            return;

        if (user.get(p, 'fraction_id2') > 0) {
            currentWarPos.forEach((item, i) => {
                user.deleteBlip(p, i);
                user.deleteBlipByRadius(p, i);
                user.deleteBlipByRadius(p, i + 10);
            });
        }
    });
};

fraction.timerCargoWar = function() {

    timer--;

    if (timer === 300) {
        mp.players.forEach(p => {
            if (!user.isLogin(p))
                return;

            if (user.get(p, 'fraction_id2') > 0 && user.has(p, 'isCargo')) {
                currentWarPos.forEach((item, i) => {
                    user.deleteBlipByRadius(p, i);
                });
            }
        });
    }

    if (timer > 300) {
        currentWarPos.forEach(item => {
            mp.players.forEachInRange(item, 15, p => {
                if (!user.isLogin(p))
                    return;

                if (user.get(p, 'fraction_id2') > 0 && p.health > 0) {
                    user.setHealth(p, p.health - 20);
                }
            });
        });
    }

    currentWarPos.forEach(item => {
        mp.vehicles.forEachInRange(item, 60, v => {
            if (!vehicles.exists(v))
                return;

            if (v.getVariable('cargoId') !== null && v.getVariable('cargoId') !== undefined) {
                //...
            }
            else {
                if (v.getOccupants().length > 0)
                    vehicles.respawn(v);
            }
        });
    });

    /*mp.vehicles.forEachInDimension(0, v => {
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
    });*/

    if (timer < 1) {
        fraction.stopCargoWar();
        return;
    }

    setTimeout(fraction.timerCargoWar, 1000);
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

