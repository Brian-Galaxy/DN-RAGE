let mysql = require('../modules/mysql');
let methods = require('../modules/methods');
let Container = require('../modules/data');

let user = require('../user');
let weather = require('./weather');

let fraction = require('../property/fraction');

let gangWar = exports;

let countZone = 0;
let offset = 600000;
let keyPrefix = 'gangWar';

let currentZone = 0;
let currentAttack = 0;
let currentDef = 0;
let isStartTimer = false;
let timerCounter = 0;
let warPos = new mp.Vector3(0, 0, 0);

let defC = 0;
let attC = 0;

let gangList = [];

gangWar.loadAll = function() {
    methods.debug('gangWar.loadAll');
    mysql.executeQuery(`SELECT * FROM gang_war`, function (err, rows, fields) {

        rows.forEach(row => {
            gangWar.set(row['id'], 'id', row['id']);
            gangWar.set(row['id'], 'x', row['x']);
            gangWar.set(row['id'], 'y', row['y']);
            gangWar.set(row['id'], 'z', row['z']);
            gangWar.set(row['id'], 'zone', row['zone']);
            gangWar.set(row['id'], 'street', row['street']);
            gangWar.set(row['id'], 'fraction_id', row['fraction_id']);
            gangWar.set(row['id'], 'fraction_name', row['fraction_name']);
            gangWar.set(row['id'], 'timestamp', row['timestamp']);
            gangWar.set(row['id'], 'cant_war', row['cant_war']);
            gangWar.set(row['id'], 'on_map', row['on_map']);
            gangWar.set(row['id'], 'canWar', true);
            countZone++;

            gangList.push({ id: row['id'], x: row['x'], y: row['y'], z: row['z']});
        });
    });

    setTimeout(function () {
        gangWar.timer();
        gangWar.timerMoney();
    }, 10000);
};

gangWar.save = function(id, ownerId, name) {
    methods.debug('gangWar.save');
    gangWar.set(id, 'fraction_id', ownerId);
    gangWar.set(id, 'fraction_name', name);
    mysql.executeQuery("UPDATE gang_war SET fraction_id = '" + ownerId + "',  fraction_name = '" + name + "',  timestamp = '" + methods.getTimeStamp() + "' where id = '" + id + "'");
};

gangWar.getZoneList = function() {
    return gangList;
};

gangWar.startWar = function(player, zoneId) {
    methods.debug('gangWar.startWar');
    if (!user.isLogin(player))
        return;

    let id = zoneId;

    if (id == 0) {
        player.notify('~r~Вы слишком далеко от какой либо территории');
        return;
    }

    if (!gangWar.get(id, 'canWar')) {
        player.notify('~r~Захват этой территории сейчас не доступен');
        return;
    }
    if (gangWar.get(id, 'cant_war')) {
        player.notify('~r~Захват этой территории не доступен');
        return;
    }
    if (user.get(player, 'fraction_id2') < 1) {
        player.notify('~r~Вы не состоите в организации');
        return;
    }
    if (!user.isLeader2(player) && !user.isSubLeader2(player) && !user.isDepLeader2(player) && !user.isDepSubLeader2(player)) {
        player.notify('~r~Начать захват может только лидер, заместитель лидера, глава отдела или зам. главы отдела');
        return;
    }
    if (weather.getHour() < 23 && weather.getHour() > 4) {
        player.notify('~r~Доступно только с 23 до 4 утра IC времени');
        return;
    }

    let dateTime = new Date(); //TODO
    if (dateTime.getHours() < 20) {
        player.notify('~r~Доступно только с 20 до 24 ночи ООС времени');
        return;
    }

    if (gangWar.isInZone(player, id)) {
        player.notify('~r~Необходимо находиться на территории');
        return;
    }

    let ownerId = gangWar.get(id, 'fraction_id');
    if (ownerId > 0) {
        if (methods.getTimeStamp() < (gangWar.get(id, 'timestamp') + 244800)) {
            let date = new Date(methods.parseInt(gangWar.get(id, 'timestamp') + 244800) * 1000);
            player.notify('~r~Доступно каждые 3 дня (ООС)');
            player.notify(`~r~А именно:~s~ ${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()}`);
            return;
        }
    }
    else {
        let newOwnerId = user.get(player, 'fraction_id2');
        let fractionName = fraction.getName(newOwnerId);
        gangWar.save(zoneId, newOwnerId, fractionName);
        gangWar.set(zoneId, 'canWar', false);
        player.notify('~g~Вы захватили территорию, т.к. ей никто не владел');
        return;
    }

    if (isStartTimer) {
        player.notify('~r~В данный момент уже происходит захват ~s~#' + currentZone + '~r~ улицы\nДождитесь окончания захвата, чтобы начать следующий');
        player.notify('~r~Осталось: ~s~' + timerCounter + 'сек\n~r~Атака: ~w~' + fraction.getName(currentAttack) + '\n~r~Оборона: ~w~' + fraction.getName(currentDef));
        return;
    }

    isStartTimer = true;
    timerCounter = 600;
    currentZone = zoneId;
    currentAttack = user.get(player, 'fraction_id2');
    currentDef = ownerId;
    warPos = gangWar.getPos(zoneId);

    methods.notifyWithPictureToFraction2('Улица под угрзой', `ВНИМАНИЕ!`, 'Начался захват улицы ~y~#' + zoneId, 'CHAR_DEFAULT', ownerId);
    methods.notifyWithPictureToFraction2('Война за улицу', `ВНИМАНИЕ!`, 'Начался захват улицы ~y~#' + zoneId, 'CHAR_DEFAULT', currentAttack);
};

gangWar.dropTimer = function(player) {
    methods.debug('gangWar.dropTimer');
    if (!user.isLogin(player) && !user.isAdmin(player))
        return;

    isStartTimer = false;
    timerCounter = 600;
    currentZone = 0;
    currentAttack = 0;
    currentDef = 0;
    defC = 0;
    attC = 0;
    warPos = new mp.Vector3(0, 0, 0);

    player.notify('~b~Таймер сброшен');
};

gangWar.timer = function() {
    if (isStartTimer) {
        timerCounter--;

        if (timerCounter % 30 == 0) {
            mp.players.forEachInRange(warPos, 500, p => {
                if (!user.isLogin(p))
                    return;
                let fId = user.get(p, 'fraction_id2');
                if (gangWar.isInZone(p, currentZone)) {
                    if (p.health == 0) return;
                    if (currentDef == fId)
                        defC++;
                    if (currentAttack == fId)
                        attC++;
                }
            });
        }

        mp.players.forEachInRange(warPos, 500, p => {
            if (!user.isLogin(p))
                return;
            let fId = user.get(p, 'fraction_id2');
            if (currentDef == fId || currentAttack == fId) {
                p.call("client:gangWar:sendInfo", [attC, defC, timerCounter]);
            }
        });

        if (timerCounter < 1) {
            timerCounter = 0;
            isStartTimer = false;
            let zoneId = currentZone;
            let ownerId = gangWar.getMaxCounterFractionId(attC, defC);
            let fractionName = fraction.getName(ownerId);
            gangWar.save(zoneId, ownerId, fractionName);
            gangWar.set(zoneId, 'canWar', false);

            methods.notifyWithPictureToFraction2('Итоги войны', `Улица #${currentZone}`, 'Территория под контролем ' + fractionName, 'CHAR_DEFAULT', currentDef);
            methods.notifyWithPictureToFraction2('Итоги войны', `Улица #${currentZone}`, 'Территория под контролем ' + fractionName, 'CHAR_DEFAULT', currentAttack);

            currentZone = 0;
            currentAttack = 0;
            currentDef = 0;
            defC = 0;
            attC = 0;
            warPos = new mp.Vector3(0, 0, 0);
        }
    }
    setTimeout(gangWar.timer, 1000);
};

gangWar.timerMoney = function() {
    for (let i = 1; i <= countZone; i++) {
        if (gangWar.get(i, 'fraction_id') > 0)
            fraction.addMoney(gangWar.get(i, 'fraction_id'), methods.getRandomInt(2, 4), 'Зачисление средств с территории #' + i)
    }
    setTimeout(gangWar.timerMoney, 1000 * 60 * 60 * 2);
};

gangWar.getMaxCounterFractionId = function(at, def) {
    let maxValue = Math.max(at, def);
    if (at == maxValue)
        return currentAttack;
    if (def == maxValue)
        return currentDef;
    return 0;
};

gangWar.set = function(id, key, val) {
    Container.Data.Set(offset + methods.parseInt(id), keyPrefix + key, val);
};

gangWar.reset = function(id, key, val) {
    Container.Data.Reset(offset + methods.parseInt(id), keyPrefix + key, val);
};

gangWar.get = function(id, key) {
    return Container.Data.Get(offset + methods.parseInt(id), keyPrefix + key);
};

gangWar.getData = function(id) {
    return Container.Data.GetAll(offset + methods.parseInt(id));
};

gangWar.has = function(id, key) {
    return Container.Data.Has(offset + methods.parseInt(id), keyPrefix + key);
};

gangWar.getPos = function(id) {
    let pos = new mp.Vector3(gangWar.get(id, 'x'), gangWar.get(id, 'y'), gangWar.get(id, 'z'));
    return pos;
};

gangWar.isInZone = function(player, id) {
    try {
        let list = [];
        let json = JSON.parse(gangWar.get(id, 'on_map'));
        json.forEach(item => {
            list.push(new mp.Vector3(item[0], item[1], 0))
        });
        return methods.isInPoint(player.position, list);
    }
    catch (e) {
    }
    return false;
};