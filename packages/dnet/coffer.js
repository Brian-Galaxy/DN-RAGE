let mysql = require('./modules/mysql');
let Container = require('./modules/data');
let methods = require('./modules/methods');

let coffer = exports;
let containerId = 99999;

coffer.load = function() {
    methods.debug('coffer.load');
    mysql.executeQuery(`SELECT * FROM coffers WHERE id = 1`, function (err, rows, fields) {
        Container.Data.Set(containerId, 'cofferMoney', rows[0]['money']);
        Container.Data.Set(containerId, 'cofferMoneyBomj', rows[0]['moneyBomj']);
        Container.Data.Set(containerId, 'cofferNalog', rows[0]['nalog']);
        Container.Data.Set(containerId, 'cofferNalogBizz', rows[0]['nalog_bizz']);
        Container.Data.Set(containerId, 'cofferMoneyLimit', rows[0]['moneyLimit']);
        Container.Data.Set(containerId, 'cofferMoneyOld', rows[0]['moneyOld']);

        methods.debug('Coffer loaded: ' + rows[0]['money']);
    });
};

coffer.save = function() {
    methods.debug('coffer.save');
    let Money = Container.Data.Get(containerId, 'cofferMoney');
    let MoneyBomj = Container.Data.Get(containerId, 'cofferMoneyBomj');
    let Nalog = Container.Data.Get(containerId, 'cofferNalog');
    let BizzNalog = Container.Data.Get(containerId, 'cofferNalogBizz');
    let MoneyOld = Container.Data.Get(containerId, 'cofferMoneyLimit');
    let MoneyLimit = Container.Data.Get(containerId, 'cofferMoneyOld');

    mysql.executeQuery("UPDATE coffers SET  money = '" + Money + "', moneyBomj = '" +
        MoneyBomj + "', nalog = '" + Nalog + "', nalog_bizz = '" + BizzNalog + "', moneyOld = '" + MoneyOld + "', moneyLimit = '" + MoneyLimit + "' WHERE id = '1'");
};

coffer.get = function(key) {
    return Container.Data.Get(containerId, key);
};

coffer.addMoney = function(money) {
    coffer.setMoney(coffer.getMoney() + methods.parseInt(money));
};

coffer.removeMoney = function(money) {
    coffer.setMoney(coffer.getMoney() - methods.parseInt(money));
};

coffer.setMoney = function(money) {
    Container.Data.Set(containerId, 'cofferMoney', methods.parseInt(money));
};

coffer.getMoney = function() {
    if (Container.Data.Has(containerId, 'cofferMoney'))
        return methods.parseInt(Container.Data.Get(containerId, 'cofferMoney'));
    return 0;
};

coffer.getMoneyOld = function() {
    if (Container.Data.Has(containerId, 'cofferMoneyOld'))
        return methods.parseInt(Container.Data.Get(containerId, 'cofferMoneyOld'));
    return 50;
};

coffer.getPosob = function() {
    if (Container.Data.Has(containerId, 'cofferMoneyBomj'))
        return methods.parseInt(Container.Data.Get(containerId, 'cofferMoneyBomj'));
    return 50;
};

coffer.getNalog = function() {
    if (Container.Data.Has(containerId, 'cofferNalog'))
        return methods.parseInt(Container.Data.Get(containerId, 'cofferNalog'));
    return 5;
};