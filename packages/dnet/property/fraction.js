let Container = require('../modules/data');
let mysql = require('../modules/mysql');
let methods = require('../modules/methods');

let user = require('../user');
let coffer = require('../coffer');
let enums = require('../enums');

let weather = require('../managers/weather');

let fraction = exports;

let count = 0;

let offset = enums.offsets.fraction;

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

fraction.save = function(id) {

    return new Promise((resolve) => {
        methods.debug('fraction.save');

        if (!fraction.has(id, "id")) {
            resolve();
            return;
        }

        let sql = "UPDATE fraction_list SET";

        sql = sql + " name = '" + methods.parseFloat(fraction.get(id, "name")) + "'";
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

fraction.set = function(id, key, val) {
    Container.Data.Set(enums.offsets.fraction + methods.parseInt(id), key, val);
};

fraction.addMoney = function(id, money, name = "Операция со счетом") {
    fraction.addHistory(id, name, money * -1);
    fraction.setMoney(id, fraction.getMoney(id) + methods.parseFloat(money));
};

fraction.removeMoney = function(id, money, name = "Операция со счетом") {
    fraction.addHistory(id, name, money * -1);
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

fraction.addHistory = function(id, name, price) {

    id = methods.parseInt(id);
    name = methods.removeQuotes(name);
    price = methods.parseFloat(price);

    let rpDateTime = weather.getRpDateTime();
    let timestamp = methods.getTimeStamp();

    mysql.executeQuery(`INSERT INTO log_fraction_2 (fraction_id, name, price, timestamp, rp_datetime) VALUES ('${id}', '${name}', '${price}', '${timestamp}', '${rpDateTime}')`);
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
    if (user.getCryptoMoney(player) < 50) {
        player.notify('~r~У Вас не достаточно валюты E-COIN для создания организации');
        return;
    }

    user.set(player, 'fraction_id2', id);
    user.set(player, 'is_leader2', true);

    fraction.updateOwnerInfo(id, user.getId(player));
    user.removeCryptoMoney(player, 50, 'Создание организации');

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

