let user = require('../user');
let weather = require('./weather');
let methods = require('../modules/methods');

let dispatcher = exports;

let countTaxi = 0;

dispatcher.sendPos = function (title, desc, pos, withCoord = true) {

    if (methods.isBlackout()) {
        return;
    }

    methods.debug('dispatcher.sendPos');
    let time = methods.digitFormat(weather.getHour()) + ':' + methods.digitFormat(weather.getMin());
    mp.players.forEach(function (player) {
        try {
            if (user.isFib(player) || user.isEms(player) || user.isSapd(player) || user.isSheriff(player) || user.isUsmc(player))
                player.call("client:dispatcher:addDispatcherList", [title, desc, time, pos.x, pos.y, pos.z, withCoord]);
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

dispatcher.sendLocalPos = function (title, desc, pos, fractionId, withCoord = true) {
    if (methods.isBlackout()) {
        return;
    }
    methods.debug('dispatcher.sendLocalPos');
    let time = methods.digitFormat(weather.getHour()) + ':' + methods.digitFormat(weather.getMin());
    mp.players.forEach(function (player) {
        if (user.get(player,'fraction_id') == fractionId)
            player.call("client:dispatcher:addDispatcherList", [title, desc, time, pos.x, pos.y, pos.z, withCoord]);
    });
};

dispatcher.sendTaxiPos = function (title, desc, pos, taxiType = 'taxi1') {
    if (methods.isBlackout()) {
        return;
    }
    methods.debug('dispatcher.sendTaxiPos');
    let time = methods.digitFormat(weather.getHour()) + ':' + methods.digitFormat(weather.getMin());
    mp.players.forEach(function (player) {
        if (methods.distanceToPos(player.position, pos) < 1000) {
            if (user.get(player, 'job') == taxiType)
                player.call("client:dispatcher:addDispatcherTaxiList", [title, desc, time, pos.x, pos.y, pos.z]);
        }
    });
};

dispatcher.sendTaxiPosForPlayer = function (player, title, desc, price, pos, taxiType = 'taxi1') {
    if (methods.isBlackout()) {
        return;
    }
    methods.debug('dispatcher.sendTaxiPos');
    let time = methods.digitFormat(weather.getHour()) + ':' + methods.digitFormat(weather.getMin());
    player.call("client:dispatcher:addDispatcherTaxiList", [countTaxi++, title, desc, time, price, pos.x, pos.y, pos.z]);
};