let methods = require('../modules/methods');
let Container = require('../modules/data');
let mysql = require('../modules/mysql');

let vehicles = require('../property/vehicles');

let pickups = require('../managers/pickups');

let bank = require('../business/bank');

let inventory = require('../inventory');
let user = require('../user');

let timer = exports;

timer.loadAll = function() {
    timer.min60Timer();
    timer.min59Timer();
    timer.min2hTimer();
    timer.min30Timer();
    timer.min10Timer();
    timer.sec10Timer();
    timer.sec5Timer();
};

timer.min30Timer = function() {

    inventory.deleteWorldItems();

    mp.players.forEach(function (p) {
        if (user.isLogin(p)) {
            if (user.hasById(user.getId(p), 'grabVeh'))
                user.resetById(user.getId(p), 'grabVeh');
        }
    });
    mp.players.forEach(function (p) {
        if (user.isLogin(p)) {
            if (user.hasById(user.getId(p), 'sellUser'))
                user.resetById(user.getId(p), 'sellUser');
        }
    });

    setTimeout(timer.min30Timer, 1000 * 60 * 30);
};

timer.min10Timer = function() {

    mp.vehicles.forEach(function (v) {
        try {
            if (vehicles.exists(v) && v.dead) {
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
            try {
                if (user.hasById(user.getId(p), 'grabLamar'))
                    user.resetById(user.getId(p), 'grabLamar');
            }
            catch (e) {

            }
        }
    });

    setTimeout(timer.min10Timer, 1000 * 60 * 10);
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

    try {
        mysql.executeQuery(`INSERT INTO stats_online (online) VALUES ('${mp.players.length}')`)
    }
    catch (e) {

    }

    mp.players.forEach(function (p) {
        if (user.isLogin(p)) {
            try {
                if (user.hasById(user.getId(p), 'grabLamar'))
                    user.resetById(user.getId(p), 'grabLamar');
                if (user.hasById(user.getId(p), 'atmTimeout'))
                    user.resetById(user.getId(p), 'atmTimeout');
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
        'Напоминаем, у вас есть возможность кастомизировать чат\n(M - Настройки - Текстовый чат)',
        'Напоминаем, у вас есть возможность кастомизировать интерфейс\n(M - Настройки - Интерфейс)',
        'Напоминаем, у вас есть использовать бинды клавиш\n(M - Настройки - Назначение клавиш)',
    ];

    methods.notifyWithPictureToAll('Ув. игроки', 'Администрация', arrayRandom[methods.getRandomInt(0, arrayRandom.length)], 'CHAR_ACTING_UP');

    setTimeout(timer.min60Timer, 1000 * 60 * 60);
};

timer.min59Timer = function() {
    try {
        let player = methods.getRandomPlayer();
        if (user.isLogin(player)) {
            user.giveVip(player, methods.getRandomInt(1, 7), 2, true);
        }
    }
    catch (e) {
        
    }
    setTimeout(timer.min59Timer, 1000 * 60 * 59);
};

timer.min2hTimer = function() {
    try {
        let player = methods.getRandomPlayer();
        if (user.isLogin(player)) {
            user.giveRandomMask(player, 0, true);
        }
    }
    catch (e) {

    }
    setTimeout(timer.min2hTimer, 1000 * 120 * 59);
};

timer.sec10Timer = function() {

    mp.players.forEach(function (p) {
        if (user.isLogin(p)) {
            try {
                let userId = user.getId(p);

                if (p.ping > 500)
                    user.kickAntiCheat(p, `Ping: ${p.ping}ms`);

                let afkTime = 600;
                if (user.get(p, 'vip_type') === 1)
                    afkTime = 1200;
                if (user.get(p, 'vip_type') === 2)
                    afkTime = 1800;

                if (user.has(p, 'afkLastPos')) {
                    if (methods.distanceToPos(user.get(p, 'afkLastPos'), p.position) < 1) {

                        let timer = methods.parseInt(user.get(p, 'afkTimer'));
                        user.set(p, 'afkTimer', timer + 10);

                        if (timer > afkTime && p.getVariable('isAfk') !== true)
                            p.setVariable('isAfk', true);
                    }
                    else {
                        if (p.getVariable('isAfk') === true)
                            p.setVariable('isAfk', false);
                        user.set(p, 'afkTimer', 0);
                    }
                }

                user.set(p, 'afkLastPos', p.position);

                if (p.dimension > 0)
                    return;

                if (methods.distanceToPos(new mp.Vector3(9.66692, 528.34783, 171.3), p.position) < 5 || methods.distanceToPos(new mp.Vector3(0, 0, 0), p.position) < 5)
                    return;

                user.set(p, 'pos_x', p.position.x);
                user.set(p, 'pos_y', p.position.y);
                user.set(p, 'pos_z', p.position.z);
                user.set(p, 'rotation', p.heading);
            }
            catch (e) {
                
            }
        }
    });

    mp.vehicles.forEach(function (v) {
        if (vehicles.exists(v)) {

            try {
                if (v.getVariable('fraction_id') || v.getVariable('user_id') || v.getVariable('useless') || v.getOccupants().length > 0)
                    return;

                if (vehicles.has(v.id, 'afkLastPos')) {
                    if (methods.distanceToPos(vehicles.get(v.id, 'afkLastPos'), v.position) < 2) {

                        let timer = methods.parseInt(vehicles.get(v.id, 'afkTimer'));
                        vehicles.set(v.id, 'afkTimer', timer + 10);

                        if (timer > 1800) {
                            vehicles.reset(v.id, 'afkTimer');
                            vehicles.reset(v.id, 'afkLastPos');
                            vehicles.respawn(v);
                            return;
                        }
                    }
                    else {
                        vehicles.set(v.id, 'afkTimer', 0);
                    }
                }

                vehicles.set(v.id, 'afkLastPos', v.position);
            }
            catch (e) {
                methods.debug(e);
            }
        }
    });

    setTimeout(timer.sec10Timer, 1000 * 10);
};

timer.sec5Timer = function() {

    let blips = [];

    mp.vehicles.forEach(function (v) {
        if (vehicles.exists(v)) {

            try {

                if (v.getVariable('dispatchMarked')) {
                    if (v.getVariable('fraction_id') === 2 || v.getVariable('fraction_id') === 5 || v.getVariable('fraction_id') === 6) {

                        let vInfo = methods.getVehicleInfo(v.model);

                        let blipId = 672;
                        let color = 0;

                        if (vInfo.display_name === 'Insurgent' || vInfo.display_name === 'Insurgent2' || vInfo.display_name === 'Riot' || vInfo.display_name === 'PoliceT')
                            blipId = 601;
                        if (vInfo.display_name === 'Buzzard' || vInfo.display_name === 'Buzzard2' || vInfo.display_name === 'Polmav')
                            blipId = 353;
                        if (vInfo.display_name === 'Police4' || vInfo.display_name === 'FBI' || vInfo.display_name === 'FBI2')
                            blipId = 724;

                        if (v.getVariable('fraction_id') === 5)
                            color = 16;
                        if (v.getVariable('fraction_id') === 6)
                            color = 1;

                        blips.push({ cl: color, b: blipId, vid: v.id, d: v.getVariable('dispatchMarked'), px: v.position.x, py: v.position.y, pz: v.position.z, h: methods.parseInt(v.heading) })
                    }
                }
            }
            catch (e) {
                methods.debug(e);
            }
        }
    });

    mp.players.forEach(p => {
        if (user.isLogin(p) && user.isGos(p)) {

            try {
                let veh = p.vehicle;
                if (!vehicles.exists(veh)) {
                    if (
                        methods.distanceToPos(p.position, pickups.DispatcherPos1) < 2 ||
                        methods.distanceToPos(p.position, pickups.DispatcherPos2) < 2 ||
                        methods.distanceToPos(p.position, pickups.DispatcherPos3) < 2 ||
                        methods.distanceToPos(p.position, pickups.DispatcherPos4) < 2 ||
                        methods.distanceToPos(p.position, pickups.DispatcherPos5) < 2 ||
                        methods.distanceToPos(p.position, pickups.DispatcherPos6) < 2
                    ) {
                        p.call('client:updateBlips', [JSON.stringify(blips)]);
                    }
                    return;
                }
                if (p.seat > 0)
                    return;
                if (veh.getVariable('fraction_id') === 2 || veh.getVariable('fraction_id') === 5 || veh.getVariable('fraction_id') === 6)
                    p.call('client:updateBlips', [JSON.stringify(blips)]);
            }
            catch (e) {
                
            }
        }
    });

    setTimeout(timer.sec5Timer, 1000 * 5);
};