let mysql = require('./modules/mysql');
let Container = require('./modules/data');
let methods = require('./modules/methods');

let coffer = exports;
let containerId = 99999;

coffer.load = function() {
    methods.debug('coffer.load');
    mysql.executeQuery(`SELECT * FROM official_bank`, function (err, rows, fields) {

        rows.forEach(function(item) {

            Container.Data.Set(containerId + item['id'], 'cofferMoney', item['money']);
            Container.Data.Set(containerId + item['id'], 'cofferScore', item['score']);
            Container.Data.Set(containerId + item['id'], 'cofferName', item['name']);
            Container.Data.Set(containerId + item['id'], 'cofferTaxPayDay', item['tax_pay_day']);
            Container.Data.Set(containerId + item['id'], 'cofferTaxBusiness', item['tax_business']);
            Container.Data.Set(containerId + item['id'], 'cofferTaxProperty', item['tax_property']);
            Container.Data.Set(containerId + item['id'], 'cofferTaxIntermediate', item['tax_intermediate']);
            Container.Data.Set(containerId + item['id'], 'cofferBenefit', item['benefit']);

            methods.debug(`Coffer loaded: ${methods.moneyFormat(item['money'])} | ${item['name']} | ${item['score']}`);
        });
    });
};

coffer.save = function (id) {

    methods.debug('coffer.save', id);

    id = methods.parseInt(id);

    let cofferMoney = coffer.getMoney(id);
    let cofferTaxPayDay = coffer.getTaxPayDay(id);
    let cofferTaxBusiness = coffer.getTaxBusiness(id);
    let cofferTaxProperty = coffer.getTaxProperty(id);
    let cofferIntermediate = coffer.getTaxIntermediate(id);
    let cofferBenefit = coffer.getBenefit(id);

    mysql.executeQuery("UPDATE official_bank SET  money = '" + cofferMoney + "', tax_pay_day = '" +
        cofferTaxPayDay + "', tax_business = '" + cofferTaxBusiness + "', tax_property = '" + cofferTaxProperty + "', tax_intermediate = '" + cofferIntermediate + "', benefit = '" + cofferBenefit + "' WHERE id = '" + id + "'");
};

coffer.get = function(id, key) {
    return Container.Data.Get(containerId + id, key);
};

coffer.addMoney = function(id, money) {
    coffer.setMoney(id, coffer.getMoney(id) + methods.parseFloat(money));
};

coffer.removeMoney = function(id, money) {
    coffer.setMoney(id, coffer.getMoney(id) - methods.parseFloat(money));
};

coffer.setMoney = function(id, money) {
    Container.Data.Set(containerId + id, 'cofferMoney', methods.parseFloat(money));
};

coffer.getMoney = function(id = 1) {
    if (Container.Data.Has(containerId + id, 'cofferMoney'))
        return methods.parseFloat(Container.Data.Get(containerId + id, 'cofferMoney'));
    return 0;
};

coffer.getScore = function(id = 1) {
    if (Container.Data.Has(containerId + id, 'cofferScore'))
        return methods.parseInt(Container.Data.Get(containerId + id, 'cofferScore'));
    return 0;
};

coffer.getTaxProperty = function(id = 1) {
    if (Container.Data.Has(containerId + id, 'cofferTaxProperty'))
        return methods.parseInt(Container.Data.Get(containerId + id, 'cofferTaxProperty'));
    return 5;
};

coffer.getTaxPayDay = function(id = 1) {
    if (Container.Data.Has(containerId + id, 'cofferTaxPayDay'))
        return methods.parseInt(Container.Data.Get(containerId + id, 'cofferTaxPayDay'));
    return 5;
};

coffer.getTaxBusiness = function(id = 1) {
    if (Container.Data.Has(containerId + id, 'cofferTaxBusiness'))
        return methods.parseInt(Container.Data.Get(containerId + id, 'cofferTaxBusiness'));
    return 5;
};

coffer.getTaxIntermediate = function(id = 1) {
    if (Container.Data.Has(containerId + id, 'cofferTaxIntermediate'))
        return methods.parseInt(Container.Data.Get(containerId + id, 'cofferTaxIntermediate'));
    return 5;
};

coffer.getBenefit = function(id = 1) {
    if (Container.Data.Has(containerId + id, 'cofferBenefit'))
        return methods.parseFloat(Container.Data.Get(containerId + id, 'cofferBenefit'));
    return 5;
};

coffer.getIdByFraction = function(fractionId) {
    switch (fractionId) {
        case 1:
            return 2;
        case 2:
            return 3;
        case 3:
            return 5;
        case 4:
            return 7;
        case 5:
            return 4;
        case 6:
            return 6;
        case 7:
            return 8;
    }
    return 1;
};