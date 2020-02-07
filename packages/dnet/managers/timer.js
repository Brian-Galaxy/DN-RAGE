let methods = require('../modules/methods');
let Container = require('../modules/data');
let mysql = require('../modules/mysql');

let vehicles = require('../property/vehicles');

let bank = require('../business/bank');

let inventory = require('../inventory');
let user = require('../user');

let timer = exports;

timer.loadAll = function() {
    timer.min30Timer();
    timer.sec10Timer();
    timer.secTimer();
};

timer.min30Timer = function() {

    inventory.deleteWorldItems();

    for (let i = 1; i < 1300; i++)
    {
        try {
            if (Container.Data.Has(i, "isMail"))
                Container.Data.Reset(i, "isMail");
            if (Container.Data.Has(i, "isMail2"))
                Container.Data.Reset(i, "isMail2");
        }
        catch (e) {
            methods.debug(e);
        }
    }

    mp.vehicles.forEach(function (v) {
        try {
            if (vehicles.exists(v) && vehicles.getFuel(v) == 0 && v.getOccupants().length == 0) {
                if (!v.getVariable('trId'))
                    vehicles.respawn(v);
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });

    setTimeout(timer.min30Timer, 1000 * 60 * 30);
};

timer.sec10Timer = function() {

    mp.players.forEach(function (p) {
        if (user.isLogin(p)) {
            let userId = user.getId(p);
            user.setById(userId, 'pos_x', p.position.x);
            user.setById(userId, 'pos_y', p.position.y);
            user.setById(userId, 'pos_z', p.position.z);
            user.setById(userId, 'rot', p.heading);
            user.setById(userId, 'hp', p.health);
            user.setById(userId, 'dimension', p.dimension);
            user.setById(userId, 'timestamp', methods.getTimeStamp());
        }
    });

    setTimeout(timer.sec10Timer, 1000 * 10);
};

timer.secTimer = function() {
    //TODO
    /*mp.players.forEach(function (p) {
        if (user.isLogin(p) && user.has(p, 'ping')) {
            if (user.get(p, 'ping') + 400 < p.ping)
                user.kickAntiCheat(p, 'Ping: ' + p.ping + 'ms')
        }
    });
    setTimeout(timer.secTimer, 1000);*/
};