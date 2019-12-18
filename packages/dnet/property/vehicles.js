const Container = require('../modules/data');
const mysql = require('../modules/mysql');
const enums = require('../enums');
const user = require('../user');
const coffer = require('../coffer');
//const fuel = require('./business/fuel');
const methods = require('../modules/methods');
const vSync = require('../managers/vSync');
const vehicles = exports;

const offset = 200000;
const offsetFr = -5000;
const offsetJob = -10000;
const offsetRent = -1000000;
const offsetAll = -2000000;
let jobCount = 0;

let creationQueue = [];
let removalQueue = [];

vehicles.newOrdered = (cb, creationArguments) =>
{
    creationQueue.push({ args: creationArguments, cb : cb });
};

vehicles.destroyOrdered = (vehicle) =>
{
    if(mp.vehicles.exists(vehicle))
    {
        removalQueue.push(vehicle);
    }
};

vehicles.processVehicleManager = () =>
{
    let cbs = [];

    for(let creation of creationQueue)
    {
        try {
            let vehicle = mp.vehicles.new.apply(mp.vehicles, creation.args);
            methods.debug('processVehicleManager');
            vSync.setEngineState(vehicle, false);
            cbs.push([vehicle, creation.cb]);
        }
        catch (e) {
            methods.debug(e);
        }
        //await methods.sleep(100);
    }

    creationQueue = [];

    for(let removal of removalQueue)
    {
        try {
            removal.destroy();
        }
        catch (e) {
            methods.debug(e);
        }
    }

    removalQueue = [];

    for(let cb of cbs)
    {
        cb[1](cb[0]);
    }
};

vehicles.loadAllTimers = () => {
    methods.debug('vehicles.loadAllTimers');
    setInterval(vehicles.processVehicleManager, 600);
};

vehicles.loadAllShop = () => {
    enums.carShopList.forEach(item => {
        if (item.id == 0)
            return;

        let blip = methods.createBlip(new mp.Vector3(item.buyPos[0], item.buyPos[1], item.buyPos[2]), item.blipId, item.blipColor, 0.8, item.name);
        methods.createStaticCheckpoint(blip.position.x, blip.position.y, blip.position.z - 1, "Нажмите ~g~Е~s~ чтобы открыть меню");
    });
};

vehicles.loadAllShopVehicles = () => {
    enums.carShopVehicleList.forEach(item => {
        vehicles.spawnCarCb(veh => {
            veh.locked = true;
            veh.engine = false;
            veh.setVariable('useless', true);
        }, new mp.Vector3(item[1], item[2], item[3]), item[4], item[0]);
        methods.createStaticCheckpoint(item[1], item[2], item[3], `~b~Название ТС:~s~ ${item[0]}\n~b~Цена: ~g~Скоро будет ;)`, 5, -1, [0, 0, 0, 0]);
    });
};

vehicles.loadPlayerVehicle = (player) => {

    methods.debug('vehicles.loadPlayerVehicle');

    const playerId = user.getId(player);
    if (playerId && playerId > 0) {
        mysql.executeQuery(`SELECT * FROM cars WHERE id_user = ${playerId}`, function (err, rows, fields) {
            console.time('loadCarsForPlayer');
            rows.forEach(function (item) {
                vehicles.set(item['id'], 'id', item['id']);
                vehicles.set(item['id'], 'id_user', item['id_user']);
                vehicles.set(item['id'], 'user_name', item['user_name']);
                vehicles.set(item['id'], 'name', item['name']);
                vehicles.set(item['id'], 'class_type', item['class_type']);
                vehicles.set(item['id'], 'hash', item['hash']);
                vehicles.set(item['id'], 'price', item['price']);
                vehicles.set(item['id'], 'stock', item['stock']);
                vehicles.set(item['id'], 'stock_full', item['stock_full']);
                vehicles.set(item['id'], 'stock_item', item['stock_item']);
                vehicles.set(item['id'], 'fuel', item['fuel']);
                vehicles.set(item['id'], 'full_fuel', item['full_fuel']);
                vehicles.set(item['id'], 'fuel_minute', item['fuel_minute']);
                vehicles.set(item['id'], 'color1', item['color1']);
                vehicles.set(item['id'], 'color2', item['color2']);
                vehicles.set(item['id'], 'neon_type', item['neon_type']);
                vehicles.set(item['id'], 'neon_r', item['neon_r']);
                vehicles.set(item['id'], 'neon_g', item['neon_g']);
                vehicles.set(item['id'], 'neon_b', item['neon_b']);
                vehicles.set(item['id'], 'number', item['number']);
                vehicles.set(item['id'], 'wanted_level', item['wanted_level']);
                vehicles.set(item['id'], 'lock_status', item['lock_status']);
                vehicles.set(item['id'], 's_mp', item['s_mp']);
                vehicles.set(item['id'], 's_wh_bk_l', item['s_wh_bk_l']);
                vehicles.set(item['id'], 's_wh_b_l', item['s_wh_b_l']);
                vehicles.set(item['id'], 's_wh_bk_r', item['s_wh_bk_r']);
                vehicles.set(item['id'], 's_wh_b_r', item['s_wh_b_r']);
                vehicles.set(item['id'], 's_engine', item['s_engine']);
                vehicles.set(item['id'], 's_suspension', item['s_suspension']);
                vehicles.set(item['id'], 's_body', item['s_body']);
                vehicles.set(item['id'], 's_candle', item['s_candle']);
                vehicles.set(item['id'], 's_oil', item['s_oil']);
                vehicles.set(item['id'], 'livery', item['livery']);
                vehicles.set(item['id'], 'is_visible', item['is_visible']);
                vehicles.set(item['id'], 'x', item['x']);
                vehicles.set(item['id'], 'y', item['y']);
                vehicles.set(item['id'], 'z', item['z']);
                vehicles.set(item['id'], 'rot', item['rot']);
                vehicles.set(item['id'], 'x_park', item['x_park']);
                vehicles.set(item['id'], 'y_park', item['y_park']);
                vehicles.set(item['id'], 'z_park', item['z_park']);
                vehicles.set(item['id'], 'rot_park', item['rot_park']);
                vehicles.set(item['id'], 'upgrade', item['upgrade']);
                vehicles.set(item['id'], 'money_tax', item['money_tax']);
                vehicles.set(item['id'], 'score_tax', item['score_tax']);
                vehicles.set(item['id'], 'cop_park_name', item['cop_park_name']);
                vehicles.set(item['id'], 'is_cop_park', item['is_cop_park']);
                vehicles.set(item['id'], 'sell_price', item['sell_price']);

                if (item['sell_price'] > 0) {
                    return;
                }

                //if (item['name'] == 'Camper' || item['name'] == 'Journey')
                //if (item['x_park'] != 0)
                //    vehicles.spawnPlayerCar(parseInt(item['id']));
            });
            console.timeEnd('loadCarsForPlayer');
            console.log(`All vehicles loaded for player ${playerId} (${rows.length})`);
        });
    }
};

vehicles.loadPlayerVehicleByPlayerId = (playerId, dim = 0) => {

    methods.debug('vehicles.loadPlayerVehicle');

    if (playerId && playerId > 0) {
        mysql.executeQuery(`SELECT * FROM cars WHERE id_user = ${playerId}`, function (err, rows, fields) {
            console.time('loadCarsForPlayer');
            rows.forEach(function (item) {
                vehicles.set(item['id'], 'id', item['id']);
                vehicles.set(item['id'], 'id_user', item['id_user']);
                vehicles.set(item['id'], 'user_name', item['user_name']);
                vehicles.set(item['id'], 'name', item['name']);
                vehicles.set(item['id'], 'class_type', item['class_type']);
                vehicles.set(item['id'], 'hash', item['hash']);
                vehicles.set(item['id'], 'price', item['price']);
                vehicles.set(item['id'], 'stock', item['stock']);
                vehicles.set(item['id'], 'stock_full', item['stock_full']);
                vehicles.set(item['id'], 'stock_item', item['stock_item']);
                vehicles.set(item['id'], 'fuel', item['fuel']);
                vehicles.set(item['id'], 'full_fuel', item['full_fuel']);
                vehicles.set(item['id'], 'fuel_minute', item['fuel_minute']);
                vehicles.set(item['id'], 'color1', item['color1']);
                vehicles.set(item['id'], 'color2', item['color2']);
                vehicles.set(item['id'], 'neon_type', item['neon_type']);
                vehicles.set(item['id'], 'neon_r', item['neon_r']);
                vehicles.set(item['id'], 'neon_g', item['neon_g']);
                vehicles.set(item['id'], 'neon_b', item['neon_b']);
                vehicles.set(item['id'], 'number', item['number']);
                vehicles.set(item['id'], 'wanted_level', item['wanted_level']);
                vehicles.set(item['id'], 'lock_status', item['lock_status']);
                vehicles.set(item['id'], 's_mp', item['s_mp']);
                vehicles.set(item['id'], 's_wh_bk_l', item['s_wh_bk_l']);
                vehicles.set(item['id'], 's_wh_b_l', item['s_wh_b_l']);
                vehicles.set(item['id'], 's_wh_bk_r', item['s_wh_bk_r']);
                vehicles.set(item['id'], 's_wh_b_r', item['s_wh_b_r']);
                vehicles.set(item['id'], 's_engine', item['s_engine']);
                vehicles.set(item['id'], 's_suspension', item['s_suspension']);
                vehicles.set(item['id'], 's_body', item['s_body']);
                vehicles.set(item['id'], 's_candle', item['s_candle']);
                vehicles.set(item['id'], 's_oil', item['s_oil']);
                vehicles.set(item['id'], 'livery', item['livery']);
                vehicles.set(item['id'], 'is_visible', item['is_visible']);
                vehicles.set(item['id'], 'x', item['x']);
                vehicles.set(item['id'], 'y', item['y']);
                vehicles.set(item['id'], 'z', item['z']);
                vehicles.set(item['id'], 'rot', item['rot']);
                vehicles.set(item['id'], 'x_park', item['x_park']);
                vehicles.set(item['id'], 'y_park', item['y_park']);
                vehicles.set(item['id'], 'z_park', item['z_park']);
                vehicles.set(item['id'], 'rot_park', item['rot_park']);
                vehicles.set(item['id'], 'upgrade', item['upgrade']);
                vehicles.set(item['id'], 'money_tax', item['money_tax']);
                vehicles.set(item['id'], 'score_tax', item['score_tax']);
                vehicles.set(item['id'], 'cop_park_name', item['cop_park_name']);
                vehicles.set(item['id'], 'is_cop_park', item['is_cop_park']);
                vehicles.set(item['id'], 'sell_price', item['sell_price']);

                if (item['sell_price'] > 0) {
                    return;
                }

                //if (item['name'] == 'Camper' || item['name'] == 'Journey')
                if (item['x_park'] != 0)
                    vehicles.spawnPlayerCar(parseInt(item['id']), false, dim);
            });
            console.timeEnd('loadCarsForPlayer');
            console.log(`All vehicles loaded for player ${playerId} (${rows.length})`);
        });
    }
};

vehicles.loadPlayerVehicleById = (player, id) => {

    methods.debug('vehicles.loadPlayerVehicleById');

    const playerId = user.getId(player);
    if (playerId && playerId > 0) {
        mysql.executeQuery(`SELECT * FROM cars WHERE id_user = ${playerId} AND id = ${id}`, function (err, rows, fields) {
            console.time('loadCarsForPlayer');
            rows.forEach(function (item) {
                //if (Container.Data.Has(offset + methods.parseInt(item['id']), 'id'))
                //    return;
                vehicles.set(item['id'], 'id', item['id']);
                vehicles.set(item['id'], 'id_user', item['id_user']);
                vehicles.set(item['id'], 'user_name', item['user_name']);
                vehicles.set(item['id'], 'name', item['name']);
                vehicles.set(item['id'], 'class_type', item['class_type']);
                vehicles.set(item['id'], 'hash', item['hash']);
                vehicles.set(item['id'], 'price', item['price']);
                vehicles.set(item['id'], 'stock', item['stock']);
                vehicles.set(item['id'], 'stock_full', item['stock_full']);
                vehicles.set(item['id'], 'stock_item', item['stock_item']);
                vehicles.set(item['id'], 'fuel', item['fuel']);
                vehicles.set(item['id'], 'full_fuel', item['full_fuel']);
                vehicles.set(item['id'], 'fuel_minute', item['fuel_minute']);
                vehicles.set(item['id'], 'color1', item['color1']);
                vehicles.set(item['id'], 'color2', item['color2']);
                vehicles.set(item['id'], 'neon_type', item['neon_type']);
                vehicles.set(item['id'], 'neon_r', item['neon_r']);
                vehicles.set(item['id'], 'neon_g', item['neon_g']);
                vehicles.set(item['id'], 'neon_b', item['neon_b']);
                vehicles.set(item['id'], 'number', item['number']);
                vehicles.set(item['id'], 'wanted_level', item['wanted_level']);
                vehicles.set(item['id'], 'lock_status', item['lock_status']);
                vehicles.set(item['id'], 's_mp', item['s_mp']);
                vehicles.set(item['id'], 's_wh_bk_l', item['s_wh_bk_l']);
                vehicles.set(item['id'], 's_wh_b_l', item['s_wh_b_l']);
                vehicles.set(item['id'], 's_wh_bk_r', item['s_wh_bk_r']);
                vehicles.set(item['id'], 's_wh_b_r', item['s_wh_b_r']);
                vehicles.set(item['id'], 's_engine', item['s_engine']);
                vehicles.set(item['id'], 's_suspension', item['s_suspension']);
                vehicles.set(item['id'], 's_body', item['s_body']);
                vehicles.set(item['id'], 's_candle', item['s_candle']);
                vehicles.set(item['id'], 's_oil', item['s_oil']);
                vehicles.set(item['id'], 'livery', item['livery']);
                vehicles.set(item['id'], 'is_visible', item['is_visible']);
                vehicles.set(item['id'], 'x', item['x']);
                vehicles.set(item['id'], 'y', item['y']);
                vehicles.set(item['id'], 'z', item['z']);
                vehicles.set(item['id'], 'rot', item['rot']);
                vehicles.set(item['id'], 'x_park', item['x_park']);
                vehicles.set(item['id'], 'y_park', item['y_park']);
                vehicles.set(item['id'], 'z_park', item['z_park']);
                vehicles.set(item['id'], 'rot_park', item['rot_park']);
                vehicles.set(item['id'], 'upgrade', item['upgrade']);
                vehicles.set(item['id'], 'money_tax', item['money_tax']);
                vehicles.set(item['id'], 'score_tax', item['score_tax']);
                vehicles.set(item['id'], 'cop_park_name', item['cop_park_name']);
                vehicles.set(item['id'], 'is_cop_park', item['is_cop_park']);

                if (item['sell_price'] > 0) {
                    return;
                }

                //if (item['name'] == 'Camper' || item['name'] == 'Journey')
                //if (item['x_park'] != 0)
                //    vehicles.spawnPlayerCar(parseInt(item['id']));
            });
            console.timeEnd('loadCarsForPlayer');
            console.log(`All vehicles loaded for player ${playerId} (${rows.length})`);
        });
    }
};

vehicles.removePlayerVehicle = (userId) => {
    mp.vehicles.forEach(function (v) {
        if (vehicles.exists(v) && v.getVariable('id_user') == userId) {
            vehicles.save(v.getVariable('container'));
            v.destroy();
        }
    })
};

vehicles.save = (id) => {

    return new Promise((resolve) => {
        methods.debug('vehicles.save');

        id = offset + id;
        if (!Container.Data.Has(id, "id")) {
            resolve();
            return;
        }
        if (!Container.Data.Has(id, "id_user")) {
            resolve();
            return;
        }

        let sql = "UPDATE cars SET";

        sql = sql + " fuel = '" + parseFloat(Container.Data.Get(id, "fuel")) + "'";
        sql = sql + ", color1 = '" + methods.parseInt(Container.Data.Get(id, "color1")) + "'";
        sql = sql + ", color2 = '" + methods.parseInt(Container.Data.Get(id, "color2")) + "'";
        sql = sql + ", neon_type = '" + methods.parseInt(Container.Data.Get(id, "neon_type")) + "'";
        sql = sql + ", neon_r = '" + methods.parseInt(Container.Data.Get(id, "neon_r")) + "'";
        sql = sql + ", neon_g = '" + methods.parseInt(Container.Data.Get(id, "neon_g")) + "'";
        sql = sql + ", neon_b = '" + methods.parseInt(Container.Data.Get(id, "neon_b")) + "'";
        sql = sql + ", number = '" + methods.removeQuotes(Container.Data.Get(id, "number")) + "'";
        sql = sql + ", wanted_level = '" + methods.parseInt(Container.Data.Get(id, "wanted_level")) + "'";
        sql = sql + ", lock_status = '" + methods.parseInt(Container.Data.Get(id, "lock_status")) + "'";
        sql = sql + ", livery = '" + methods.parseInt(Container.Data.Get(id, "livery")) + "'";
        sql = sql + ", x_park = '" + parseFloat(Container.Data.Get(id, "x_park")) + "'";
        sql = sql + ", y_park = '" + parseFloat(Container.Data.Get(id, "y_park")) + "'";
        sql = sql + ", z_park = '" + parseFloat(Container.Data.Get(id, "z_park")) + "'";
        sql = sql + ", rot_park = '" + parseFloat(Container.Data.Get(id, "rot_park")) + "'";
        sql = sql + ", upgrade = '" + Container.Data.Get(id, "upgrade") + "'";

        sql = sql + " where id = '" + methods.parseInt(Container.Data.Get(id, "id")) + "'";
        mysql.executeQuery(sql, undefined, function () {
            resolve();
        });
    });
};

vehicles.set = function(id, key, val) {
    //methods.debug(`vehicles.set ${id} ${key} ${val} | `);
    Container.Data.Set(offset + methods.parseInt(id), key, val);
};

vehicles.get = function(id, key) {
    //methods.debug('vehicles.get');
    return Container.Data.Get(offset + methods.parseInt(id), key);
};

vehicles.getData = function(id) {
    //methods.debug('vehicles.getData');
    return Container.Data.GetAll(offset + methods.parseInt(id));
};

vehicles.park = function(id, x, y, z, rot) {
    methods.debug('vehicles.park');
    rot = methods.parseInt(rot);
    vehicles.set(id, 'x_park', methods.parseInt(x));
    vehicles.set(id, 'y_park', methods.parseInt(y));
    vehicles.set(id, 'z_park', methods.parseInt(z));
    vehicles.set(id, 'rot_park', methods.parseInt(rot));
    mysql.executeQuery("UPDATE cars SET x_park = '" + methods.parseInt(x) + "', y_park = '" + methods.parseInt(y) + "', z_park = '" + methods.parseInt(z) + "', rot_park = '" + methods.parseInt(rot) + "' where id = '" + methods.parseInt(id) + "'");
};

vehicles.respawn = (vehicle) => {
    if (!vehicles.exists(vehicle))
        return;

    try {
        methods.debug('vehicles.respawn');
        //let containerId = vehicle.getVariable('container');
        //if (containerId != undefined && vehicle.getVariable('id_user') > 0)
        //    vehicles.spawnPlayerCar(containerId, true);
        vehicle.destroy();
    }
    catch (e) {
        methods.debug(e);
    }
};

vehicles.findVehicleByNumber = (number) => {
    methods.debug('vehicles.findVehicleByNumber');
    let returnVehicle = null;
    mp.vehicles.forEach((vehicle) => {
        if (!vehicles.exists(vehicle))
            return;
        if (vehicle.numberPlate == number)
            returnVehicle = vehicle;
    });
    return returnVehicle;
};

vehicles.setFuel = (veh, fuel) => {
    if (!vehicles.exists(veh))
        return;

    let vInfo = methods.getVehicleInfo(veh.model);
    if (vInfo.fuel_full == 1)
        return;

    if (vInfo.fuel_full < fuel)
        fuel = vInfo.fuel_full;

    vehicles.set(veh.getVariable('container'), 'fuel', fuel);
    veh.setVariable('fuel', fuel);
};

vehicles.getFuel = (veh) => {
    if (!vehicles.exists(veh))
        return 0;
    return veh.getVariable('fuel');
};

vehicles.checkVehiclesFuel = () => {
    methods.debug('vehicles.checkVehiclesFuel');
    mp.vehicles.forEach(function (veh) {

        if (!vehicles.exists(veh))
            return;

        if (!vSync.getEngineState(veh))
            return;

        let vInfo = methods.getVehicleInfo(veh.model);
        if (vInfo.fuel_full == 1)
            return;

        let velocity = veh.velocity;
        let speed = Math.sqrt(
            velocity.x * velocity.x +
            velocity.y * velocity.y +
            velocity.z * velocity.z
        );
        let speedMph = Math.round(speed * 2.23693629);
        let fuelMinute = vInfo.fuel_full;
        let fuel = vehicles.getFuel(veh);

        if (fuel <= 0) {
            vehicles.setFuel(veh, 0);
            //veh.engine = false;
            methods.debug('checkVehiclesFuel');
            vSync.setEngineState(veh, false);
            return;
        }

        if (speedMph < 1)
        {
            let result = fuel - fuelMinute * 0.01 / 300;
            vehicles.setFuel(veh, result < 1 ? 0 : result);
        }
        else if (speedMph > 0 && speedMph < 61)
        {
            let result = fuel - fuelMinute * 1.5 / 710;
            vehicles.setFuel(veh, result < 1 ? 0 : result);
        }
        else if (speedMph > 60 && speedMph < 101)
        {
            let result = fuel - fuelMinute * 0.75 / 480;
            vehicles.setFuel(veh, result < 1 ? 0 : result);
        }
        else
        {
            let result = fuel - fuelMinute * 0.75 / 240;
            vehicles.setFuel(veh, result < 1 ? 0 : result);
        }
    });

    setTimeout(vehicles.checkVehiclesFuel, 4500);
};

vehicles.generateNumber = function (length = 8) {
    methods.debug('vehicles.generateNumber');
    let text = "";
    let possible = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};

vehicles.updateOwnerInfo = function (id, userId, userName) {
    id = methods.parseInt(id);
    userId = methods.parseInt(userId);
    mysql.executeQuery("UPDATE cars SET user_name = '" + userName + "', user_id = '" + userId + "', tax_money = '0' where id = '" + id + "'");

    vehicles.set(id, 'user_name', methods.removeQuotes(userName));
    vehicles.set(id, 'user_id', methods.parseInt(userId));

    if (userId == 0) {
        vehicles.park(id, 0, 0, 0, 0);
        mysql.executeQuery("UPDATE cars SET user_name = '" + userName + "', user_id = '" + userId + "', number = '" + vehicles.generateNumber() + "', tax_money = '0', s_oil = '0', s_candle = '0', s_body = '0', s_suspension = '0', s_engine = '0', s_wh_b_r = '0', s_wh_bk_r = '0', s_wh_b_l = '0', s_wh_bk_l = '0', s_mp = '0', wanted_level = '0', lock_status = '0', neon_type = '0', sell_price = '0', upgrade = '{\"18\":-1}' where id = '" + id + "'");
        //Container.Data.ResetAll(id + offset);
    }
};

vehicles.sell = function (player, slot) {
    methods.debug('vehicles.sell');
    if (!user.isLogin(player))
        return;

    if (user.get(player, 'car_id' + slot) == 0) {
        player.notify('~r~У Вас нет транспорта');
        return;
    }

    let isSpawn = false;
    let containerId = user.get(player, 'car_id' + slot);
    mp.vehicles.forEach(function (veh) {

        if (!vehicles.exists(veh))
            return;

        if (veh.getVariable('container') == containerId) {
            let vInfo = vehicles.getData(user.get(player, 'car_id' + slot));
            let nalog = methods.parseInt(vInfo.get('price') * (100 - (coffer.get('cofferNalog') + 20)) / 100);

            user.set(player, 'car_id' + slot, 0);

            vehicles.updateOwnerInfo(vInfo.get('id'), 0, '');

            coffer.removeMoney(nalog);
            user.addMoney(player, nalog);

            veh.destroy();
            isSpawn = true;

            setTimeout(function () {
                if (!user.isLogin(player))
                    return;

                user.addHistory(player, 3, 'Продал транспорт ' + vInfo.get('name') + '. Цена: $' + methods.numberFormat(nalog));
                player.notify('~g~Вы продали транспорт');
                player.notify(`~g~Налог:~s~ ${(coffer.get('cofferNalog') + 20)}\n~g~Получено:~s~ $${methods.numberFormat(nalog)}`);
                user.save(player);
            }, 1000);
        }
    });

    if (!isSpawn)
        player.notify('~r~Для начала зареспавните ТС');
};

vehicles.setTunning = (veh) => {
    setTimeout(function () {
        if (vehicles.exists(veh)) {

            try {
                let car = vehicles.getData(veh.getVariable('container'));
                if (!car.has('color1'))
                    return;

                veh.setColor(car.get('color1'), car.get('color2'));

                if (car.get('neon_type') > 0)
                    veh.setNeonColor(car.get('neon_r'), car.get('neon_g'), car.get('neon_b'));

                veh.livery = car.get('livery');

                if (car.has('upgrade')) {

                    let upgrade = JSON.parse(car.get('upgrade'));
                    for (let tune in upgrade) {
                        if (methods.parseInt(tune) === 78)
                            veh.wheelType = methods.parseInt(upgrade[tune]);
                    }
                    setTimeout(function () {
                        try {
                            if (!vehicles.exists(veh))
                                return;
                            for (let tune in upgrade) {
                                if (methods.parseInt(tune) >= 100)
                                    continue;
                                if (methods.parseInt(tune) === 69)
                                    veh.windowTint = methods.parseInt(upgrade[tune]);
                                else
                                    veh.setMod(methods.parseInt(tune), methods.parseInt(upgrade[tune]));
                            }
                        }
                        catch (e) {
                            console.log(e);
                        }
                    }, 500);
                }
            }
            catch (e) {
                console.log(e);
            }
        }
    }, 10000);
};

let CountAllCars = 0;
vehicles.spawnCar = (position, heading, nameOrModel, number = undefined) => {
    methods.debug('vehicles.spawnCar ' + nameOrModel);
    if (typeof nameOrModel == 'string')
        nameOrModel = mp.joaat(nameOrModel);

    let model = nameOrModel;
    CountAllCars++;

    let color1 = methods.getRandomInt(0, 156);
    let color2 = color1;
    if (number === undefined)
        number = vehicles.generateNumber();

    let veh = mp.vehicles.new(model, position, {heading: parseFloat(heading), numberPlate: number, engine: false, dimension: 0});
    let vInfo = methods.getVehicleInfo(model);

    veh.numberPlate = number;
    //veh.engine = false;
    methods.debug('spawnCar');
    vSync.setEngineState(veh, false);
    veh.locked = false;
    veh.setColor(color1, color2);

    veh.setVariable('container', CountAllCars + offsetAll);
    veh.setVariable('fuel', vInfo.fuel_full);
    veh.setVariable('id', CountAllCars);

    vehicles.set(CountAllCars + offsetAll, 'fuel', vInfo.fuel_full);
    vehicles.set(CountAllCars + offsetAll, 'hash', model);

    return veh;
};

vehicles.spawnCarCb = (cb, position, heading, nameOrModel, color1 = -1, color2 = -1, liv = -1, number = undefined) => {
    methods.debug('vehicles.spawnCar2 ' + nameOrModel);
    if (typeof nameOrModel == 'string')
        nameOrModel = mp.joaat(nameOrModel.toLowerCase());

    let model = nameOrModel;
    CountAllCars++;

    if (color1 == -1)
        color1 = methods.getRandomInt(0, 156);
    if (color2 == -1)
        color2 = color1;
    if (number === undefined)
        number = vehicles.generateNumber();

    //let veh = mp.vehicles.new(model, position, {heading: parseFloat(heading), numberPlate: number, engine: false, dimension: 0});
    vehicles.newOrdered(veh => {

        if (!vehicles.exists(veh))
            return;

        let vInfo = methods.getVehicleInfo(model);

        veh.numberPlate = number;
        //veh.engine = false;
        methods.debug('spawnCarCb');
        vSync.setEngineState(veh, false);
        veh.locked = false;
        if (liv >= 0)
            veh.livery = liv;
        veh.setColor(color1, color2);

        veh.setVariable('container', CountAllCars + offsetAll);
        veh.setVariable('fuel', vInfo.fuel_full);
        veh.setVariable('id', CountAllCars);

        vehicles.set(CountAllCars + offsetAll, 'fuel', vInfo.fuel_full);
        vehicles.set(CountAllCars + offsetAll, 'hash', model);

        cb(veh);
    }, [model, position, {heading: parseFloat(heading), numberPlate: number, engine: false, dimension: 0}]);

    //return veh;
};

vehicles.lockStatus = (player, vehicle) => {
    methods.debug('vehicles.lockStatus');
    if (!user.isLogin(player))
        return;
    if (!vehicles.exists(vehicle))
        return;
    try {
        vehicle.locked = !vehicle.locked;
        //let lockStatus = !vSync.getLockState(vehicle);
        vSync.setLockStatus(vehicle, vehicle.locked);
        if (!vehicle.locked)
            player.notify('Вы ~g~открыли~s~ транспорт');
        else
            player.notify('Вы ~r~закрыли~s~ транспорт');
    }
    catch (e) {
        console.log(e);
    }
};

vehicles.engineStatus = (player, vehicle) => {
    methods.debug('vehicles.engineStatus');
    if (!user.isLogin(player))
        return;
    if (!vehicles.exists(vehicle))
        return;
    try {
        if (vehicle.getVariable('fuel') == 0) {
            player.notify('~r~В транспорте закончился бензин');
            player.notify('~b~Метка на заправку установлена');
            /*let pos = fuel.findNearest(player.position); //TODO
            user.setWaypoint(player, pos.x, pos.y);*/
            methods.debug('engineStatus');
            vSync.setEngineState(vehicle, false);
            return;
        }
        //vehicle.engine = !vehicle.engine;
        let eStatus = !vSync.getEngineState(vehicle);
        vSync.setEngineState(vehicle, eStatus);
        if (eStatus)
            player.notify('Вы ~g~завели~s~ двигатель');
        else
            player.notify('Вы ~r~заглушили~s~ двигатель');
    }
    catch (e) {
        console.log(e);
    }
};

vehicles.neonStatus = (player, vehicle) => {
    methods.debug('vehicles.neonStatus');
    if (!user.isLogin(player))
        return;
    if (!vehicles.exists(vehicle))
        return;
    try {
        vehicle.neonEnabled = !vehicle.neonEnabled;
        if (vehicle.neonEnabled) {
            let car = vehicles.getData(vehicle.getVariable('container'));
            vehicle.setNeonColor(car.get('neon_r'), car.get('neon_g'), car.get('neon_b'));
        }
    }
    catch (e) {
        console.log(e);
    }
};

vehicles.exists = (vehicle) => {
    //methods.debug('vehicles.exists');
    return vehicle && mp.vehicles.exists(vehicle);
};