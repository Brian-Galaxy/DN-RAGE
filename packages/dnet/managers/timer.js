let methods = require('../modules/methods');
let Container = require('../modules/data');
let mysql = require('../modules/mysql');

let vehicles = require('../property/vehicles');

let bank = require('../business/bank');

let inventory = require('../inventory');
let user = require('../user');

let timer = exports;

timer.loadAll = function() {
    timer.min60Timer();
    timer.min30Timer();
    timer.sec10Timer();
};

timer.min30Timer = function() {

    inventory.deleteWorldItems();

    mp.vehicles.forEach(function (v) {
        try {
            if (vehicles.exists(v) && vehicles.getFuel(v) < 2 && v.getOccupants().length == 0) {
                if (!v.getVariable('trId'))
                    vehicles.respawn(v);
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });

    mp.players.forEach(function (p) {
        if (user.isLogin(p)) {
            if (user.hasById(user.getId(p), 'grabVeh'))
                user.resetById(user.getId(p), 'grabVeh');
        }
    });

    setTimeout(timer.min30Timer, 1000 * 60 * 30);
};

timer.min60Timer = function() {

    for (let i = 1; i < 1300; i++)
    {
        try {

            for (let j = 1; j < 1300; j++)
            {
                try {
                    if (Container.Data.Has(i, "isMail" + j))
                        Container.Data.Reset(i, "isMail" + j);
                    if (Container.Data.Has(i, "isMail2" + j))
                        Container.Data.Reset(i, "isMail2" + j);
                }
                catch (e) {
                    methods.debug(e);
                }
            }
        }
        catch (e) {
            methods.debug(e);
        }
    }

    setTimeout(timer.min30Timer, 1000 * 60 * 60);
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

            if (p.ping > 500)
                user.kickAntiCheat(p, `Ping: ${p.ping}ms`);
        }
    });

    setTimeout(timer.sec10Timer, 1000 * 10);
};