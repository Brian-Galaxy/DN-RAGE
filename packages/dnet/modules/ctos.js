let Container = require('../modules/data');
let methods = require('./methods');
let mysql = require('./mysql');
let enums = require('../enums');

let ctos = exports;

let isBlackout = false;
let isNetwork = false;

let timeoutBlackout = 0;
let timeoutNetwork = 0;

ctos.loadAll = function () {
    setInterval(ctos.secTimer, 1000);
};

ctos.getData = function() {
    return Container.Data.GetAll(enums.offsets.ctos);
};

ctos.get = function(key) {
    return Container.Data.Get(enums.offsets.ctos, key);
};

ctos.has = function(key) {
    return Container.Data.Has(enums.offsets.ctos, key);
};

ctos.set = function(key, val) {
    Container.Data.Set(enums.offsets.ctos, key, val);
};

ctos.reset = function(key, val) {
    Container.Data.Reset(enums.offsets.ctos, key, val);
};

ctos.secTimer = function () {
    if (timeoutBlackout > 0) {
        timeoutBlackout--;
        if (timeoutBlackout === 0)
            ctos.setBlackout(false);
    }
    if (timeoutNetwork > 0) {
        timeoutNetwork--;
        if (timeoutNetwork === 0)
            ctos.setNoNetwork(false);
    }
};

ctos.setBlackout = function (enable) {
    isBlackout = enable;
    ctos.setNoNetwork(enable);
    mp.players.call('client:ctos:setBlackout', [enable]);
    if (enable)
        timeoutBlackout = 300;
};

ctos.isBlackout = function () {
    return isBlackout;
};

ctos.setNoNetwork = function (disable) {
    isNetwork = disable;
    mp.players.call('client:ctos:setNoNetwork', [disable]);
    if (disable)
        timeoutBlackout = 300;
};

ctos.isDisableNetwork = function () {
    return isNetwork;
};