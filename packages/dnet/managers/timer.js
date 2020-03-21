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
    timer.min10Timer();
    timer.sec10Timer();
};

timer.min30Timer = function() {

    inventory.deleteWorldItems();

    mp.players.forEach(function (p) {
        if (user.isLogin(p)) {
            if (user.hasById(user.getId(p), 'grabVeh'))
                user.resetById(user.getId(p), 'grabVeh');
        }
    });

    setTimeout(timer.min30Timer, 1000 * 60 * 30);
};

timer.min10Timer = function() {

    mp.vehicles.forEach(function (v) {
        try {
            if (vehicles.exists(v) && (vehicles.getFuel(v) == 0 && v.getOccupants().length == 0 || v.dead)) {
                if (!v.getVariable('trId'))
                    vehicles.respawn(v);
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });
    setTimeout(timer.min30Timer, 1000 * 60 * 10);
};

timer.min60Timer = function() {

    /*for (let i = 1; i < 1300; i++)
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
    }*/

    mp.players.forEach(function (p) {
        if (user.isLogin(p)) {
            try {
                if (user.hasById(user.getId(p), 'grabLamar'))
                    user.resetById(user.getId(p), 'grabLamar');
            }
            catch (e) {
                
            }

            try {
                for (let j = 1; j < 1000; j++)
                {
                    try {
                        if (user.hasById(user.getId(p), 'isMail' + j))
                            user.resetById(user.getId(p), 'isMail' + j);
                        if (user.hasById(user.getId(p), 'isMail2' + j))
                            user.resetById(user.getId(p), 'isMail2' + j);
                    }
                    catch (e) {
                        methods.debug(e);
                    }
                }
            }
            catch (e) {
                
            }
        }
    });

    let arrayRandom = [
        'Администрация желает вам приятной игры <3',
        'Ув. игроки, если у Вас возникли трудности, обращайтесь в М - Вопрос',
        'Ув. игроки, помните, что мы прислушиваемся к вам и стараемся для вас',
        'Администрация желает вам хорошего настроения, улыбнитесь ;)',
        'Администрация желает вам приятной игры :3',
        'Администрация желает вам приятной игры c:',
    ];

    methods.notifyWithPictureToAll('Ув. игроки', 'Администрация', arrayRandom[methods.getRandomInt(0, arrayRandom.length)], 'CHAR_ACTING_UP');

    setTimeout(timer.min60Timer, 1000 * 60 * 60);
};

timer.sec10Timer = function() {

    mp.players.forEach(function (p) {
        if (user.isLogin(p)) {
            let userId = user.getId(p);

            if (p.ping > 500)
                user.kickAntiCheat(p, `Ping: ${p.ping}ms`);

            if (methods.distanceToPos(new mp.Vector3(-1507.416259765625, -3005.405029296875, -82.55733489990234), p.position) < 10)
                return;

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