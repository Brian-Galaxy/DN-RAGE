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
            methods.debug('processVehicleManager', creation.args);
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
        try {
            cb[1](cb[0]);
        }
        catch (e) {
            methods.debug(e);
        }
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
            if (!vehicles.exists(veh))
                return;
            veh.locked = true;
            veh.engine = false;
            veh.setVariable('useless', true);
        }, new mp.Vector3(item[1], item[2], item[3]), item[4], item[0]);
        methods.createStaticCheckpoint(item[1], item[2], item[3], `~b~Название ТС:~s~ ${item[0]}\n~b~Цена: ~g~Скоро будет ;)`, 5, -1, [0, 0, 0, 0]);
    });
};

vehicles.fractionList = [];

vehicles.loadAllUserVehicles = (userId) => {
    mysql.executeQuery(`SELECT * FROM cars WHERE user_id = '${methods.parseInt(userId)}'`, function (err, rows, fields) {
        rows.forEach((item) => {
            try {
                vehicles.loadUserVehicleByRow(item);
            }
            catch (e) {
                methods.debug('vehicles.loadUserById', e)
            }
        });
    });
};

vehicles.loadUserById = (id) => {
    mysql.executeQuery(`SELECT * FROM cars WHERE id = '${methods.parseInt(id)}'`, function (err, rows, fields) {
        rows.forEach((item) => {
            try {
                vehicles.loadUserVehicleByRow(item);
            }
            catch (e) {
                methods.debug('vehicles.loadUserById', e)
            }
        });
    });
};

vehicles.loadUserVehicleByRow = (row) => {
    let parkPos = new mp.Vector3(row['x'], row['y'], row['z']);
    let parkRot = row['rot'];
    if (parkPos.x == 0) {
        let pos = vehicles.getParkPosition(row['class']);
        parkPos = pos.pos;
        parkRot = pos.rot;
        vehicles.park(row['id'], parkPos.x, parkPos.y, parkPos.z, parkRot);
    }

    vehicles.set(row['id'], 'id', row['id']);
    vehicles.set(row['id'], 'user_id', row['user_id']);
    vehicles.set(row['id'], 'user_name', row['user_name']);
    vehicles.set(row['id'], 'name', row['name']);
    vehicles.set(row['id'], 'class', row['class']);
    vehicles.set(row['id'], 'price', row['price']);
    vehicles.set(row['id'], 'fuel', row['fuel']);
    vehicles.set(row['id'], 'color1', row['color1']);
    vehicles.set(row['id'], 'color2', row['color2']);
    vehicles.set(row['id'], 'livery', row['livery']);
    vehicles.set(row['id'], 'neon_r', row['neon_r']);
    vehicles.set(row['id'], 'neon_g', row['neon_g']);
    vehicles.set(row['id'], 'neon_b', row['neon_b']);
    vehicles.set(row['id'], 'number', row['number']);
    vehicles.set(row['id'], 'is_special', row['is_special']);
    vehicles.set(row['id'], 's_mp', row['s_mp']);
    vehicles.set(row['id'], 'x', parkPos.x);
    vehicles.set(row['id'], 'y', parkPos.y);
    vehicles.set(row['id'], 'z', parkPos.z);
    vehicles.set(row['id'], 'rot', parkRot);
    vehicles.set(row['id'], 'upgrade', row['upgrade']);
    vehicles.set(row['id'], 'is_cop_park', row['is_cop_park']);
    vehicles.set(row['id'], 'cop_park_name', row['cop_park_name']);

    vehicles.spawnPlayerCar(row['id']);
};

vehicles.spawnPlayerCar = (id) => {
    vehicles.spawnCarCb(veh => {

        if (!vehicles.exists(veh))
            return;

        try {
            let numberStyle = 0;
            if (id % 3)
                numberStyle = 1;
            else if (id % 4)
                numberStyle = 2;
            else if (id % 5)
                numberStyle = 3;

            veh.numberPlate = vehicles.get(id, 'number').toString();
            veh.numberPlateType = numberStyle;
            veh.locked = true;

            veh.setColor(vehicles.get(id, 'color1'), vehicles.get(id, 'color2'));
            vSync.setEngineState(veh, false);

            veh.setVariable('user_id', vehicles.get(id, 'user_id'));
            veh.setVariable('user_name', vehicles.get(id, 'user_name'));
            veh.setVariable('container', id);
            veh.setVariable('vid', id);
            veh.setVariable('price', vehicles.get(id, 'price'));

            vehicles.setFuel(veh, vehicles.get(id, 'fuel'));
            vehicles.setTunning(veh);
        }
        catch (e) {
            methods.debug(e);
        }

    }, new mp.Vector3(vehicles.get(id, 'x'), vehicles.get(id, 'y'), vehicles.get(id, 'z')), vehicles.get(id, 'rot'), vehicles.get(id, 'name'));
};

vehicles.getParkPosition = (className) => {
    let array = [];
    switch (className) {
        case 'Helicopters':
            array = enums.randomSpawnHeli;
            break;
        case 'Planes':
            array = enums.randomSpawnPlanes;
            break;
        case 'Boats':
            array = enums.randomSpawnBoat;
            break;
        default:
            array = enums.randomSpawnVeh;
            break;
    }
    let randomVal = methods.getRandomInt(0, array.length - 1);
    return { pos: new mp.Vector3(array[randomVal][0], array[randomVal][1], array[randomVal][2]), rot: array[randomVal][3] };
};

vehicles.loadAllFractionVehicles = () => {
    //return; //TODO Падает сервер
    mysql.executeQuery(`SELECT * FROM cars_fraction WHERE is_buy = '1'`, function (err, rows, fields) {
        rows.forEach(function (item) {

            let v = { id: item['id'], x: item['x'], y: item['y'], z: item['z'], rot: item['rot'], is_default: item['is_default'], rank_type: item['rank_type'], rank: item['rank'], fraction_id: item['fraction_id'] };
            vehicles.fractionList.push(v);

            if (item['is_default'] == 1) {

                let color1 = methods.getRandomInt(0, 156);
                let color2 = methods.getRandomInt(0, 156);
                let number = 'SA';
                let numberStyle = 0;
                let fractionId = item['fraction_id'];
                let id = item['id'];
                let livery = 0;
                let model = item['hash'];

                switch (fractionId) {
                    case 1:
                        color1 = 146;
                        color2 = 146;
                        number = "GOV" + id;
                        numberStyle = 4;
                        break;
                    case 2:
                        color1 = 111;
                        color2 = 0;
                        number = "LSPD" + id;
                        livery = methods.getRandomInt(0, 6);
                        numberStyle = 4;

                        switch (model)
                        {
                            case -590854301:
                            case 1982188179:
                            case -1286617882:
                            case -118239187:
                            case 376094636:
                            {
                                livery = methods.getRandomInt(3, 6);
                                break;
                            }
                            case 353883353: {
                                livery = 0;
                                break;
                            }
                            case -561505450:
                            case -271532569:
                            case -660061144:
                            {
                                livery = methods.getRandomInt(2, 4);
                                break;
                            }
                            case 1162796823:
                            case -595004596:
                            case -1973172295:
                            {
                                let colors = [0, 2, 141, 7, 34, 134, 146];

                                color1 = colors[methods.getRandomInt(0, 6)];
                                color2 = color1;
                                break;
                            }
                            case 1127131465:
                            {
                                let colors = [0, 3, 6, 131, 134];
                                color1 = colors[methods.getRandomInt(0, 4)];
                                color2 = color1;
                                break;
                            }
                            case -1647941228:
                                color1 = 112;
                                color2 = 112;
                                break;
                            case 837858166:
                            case 745926877:
                                color1 = 0;
                                color2 = 0;
                                break;
                            case 2071877360:
                                color1 = 3;
                                color2 = 3;
                                break;
                        }
                        break;
                    case 5:
                        color1 = 111;
                        color2 = 0;
                        number = "SHRF" + id;
                        livery = methods.getRandomInt(0, 6);
                        numberStyle = 4;

                        switch (model)
                        {
                            case -590854301:
                            case 1982188179:
                            case -1286617882:
                            case -118239187:
                            case 376094636:
                            {
                                livery = methods.getRandomInt(3, 6);
                                break;
                            }
                            case -561505450:
                            case -271532569:
                            case -660061144:
                            {
                                livery = methods.getRandomInt(2, 4);
                                break;
                            }
                            case 1162796823:
                            case -595004596:
                            case -1973172295:
                            {
                                let colors = [0, 2, 141, 7, 34, 134, 146];

                                color1 = colors[methods.getRandomInt(0, 6)];
                                color2 = color1;
                                break;
                            }
                            case 1127131465:
                            {
                                let colors = [0, 3, 6, 131, 134];
                                color1 = colors[methods.getRandomInt(0, 4)];
                                color2 = color1;
                                break;
                            }
                            case -1647941228:
                                color1 = 112;
                                color2 = 112;
                                break;
                            case 837858166:
                            case 745926877:
                                color1 = 0;
                                color2 = 0;
                                break;
                            case 2071877360:
                                color1 = 152;
                                color2 = 152;
                                break;
                        }
                        break;
                    case 3:
                    {
                        color1 = 0;
                        color2 = 0;
                        number = "FIB" + id;
                        numberStyle = 4;
                        break;
                    }
                    case 4:
                    {
                        color1 = 154;
                        color2 = 154;

                        if (model == -823509173 || model == 321739290 || model == 1074326203 || model == 630371791)
                        {
                            color1 = 111;
                            color2 = 111;
                        }
                        number = "USMC" + id;
                        break;
                    }
                    case 6:
                    {
                        color1 = 27;
                        color2 = 27;
                        number = "EMS" + id;
                        numberStyle = 4;

                        if (model == 1938952078)
                        {
                            color1 = 111;
                            color2 = 111;
                        }
                        else if (model == 353883353)
                            livery = 1;
                        break;
                    }
                    case 7:
                    {
                        color1 = 149;
                        color2 = 149;
                        number = "LIFE" + id;
                        numberStyle = 0;
                        break;
                    }
                }

                vehicles.spawnCarCb(veh => {

                    if (!vehicles.exists(veh))
                        return;

                    veh.numberPlate = number;
                    veh.numberPlateType = numberStyle;
                    veh.livery = livery;
                    veh.setColor(color1, color2);
                    vSync.setEngineState(veh, false);
                    veh.locked = true;
                    veh.setVariable('fraction_id', item['fraction_id']);
                    veh.setVariable('rank', item['rank']);
                    veh.setVariable('rank_type', item['rank_type']);
                    veh.setVariable('veh_id', item['id']);
                    vehicles.setFuel(veh, item['fuel']);

                    if (fractionId == 1) {
                        veh.windowTint = 1;
                    }

                    if (fractionId < 7) {
                        try {
                            veh.setMod(11, 2);
                            veh.setMod(12, 2);
                            veh.setMod(13, 3);
                            veh.setMod(18, 0);
                            veh.setMod(16, 2);
                            veh.setVariable('boost', 1.79);
                        }
                        catch (e) {
                            methods.debug(e);
                        }
                    }

                    if (fractionId == 4 && model == -808457413)
                        veh.setMod(48, methods.getRandomInt(0, 2) == 0 ? 8 : 18);
                    if (fractionId == 4 && model == -121446169)
                        veh.setMod(48, 4);

                }, new mp.Vector3(methods.parseFloat(item['x']), methods.parseFloat(item['y']), methods.parseFloat(item['z'])), methods.parseFloat(item['rot']), item['name']);
            }
        });
    });
};

vehicles.loadAllTestVehicles = () => {
    enums.randomSpawnVeh.forEach(item => {
        vehicles.spawnCarCb(veh => {
            veh.setVariable('useless', true);
        }, new mp.Vector3(item[0], item[1], item[2]), item[3], 'elegy');
    });

    enums.randomSpawnBoat.forEach(item => {
        vehicles.spawnCarCb(veh => {
            veh.setVariable('useless', true);
        }, new mp.Vector3(item[0], item[1], item[2]), item[3], 'jetmax');
    });

    enums.randomSpawnHeli.forEach(item => {
        vehicles.spawnCarCb(veh => {
            veh.setVariable('useless', true);
        }, new mp.Vector3(item[0], item[1], item[2]), item[3], 'buzzard');
    });

    enums.randomSpawnPlanes.forEach(item => {
        vehicles.spawnCarCb(veh => {
            veh.setVariable('useless', true);
        }, new mp.Vector3(item[0], item[1], item[2]), item[3], 'dodo');
    });
};

vehicles.removePlayerVehicle = (userId) => {
    mp.vehicles.forEach(function (v) {
        if (vehicles.exists(v) && v.getVariable('user_id') == userId) {
            vehicles.save(v.getVariable('container'));
            v.destroy();
        }
    })
};

vehicles.save = (id) => {

    return new Promise((resolve) => {
        methods.debug('vehicles.save');

        if (!vehicles.has(id, "id")) {
            resolve();
            return;
        }
        if (!vehicles.has(id, "user_id")) {
            resolve();
            return;
        }

        let sql = "UPDATE cars SET";

        sql = sql + " fuel = '" + methods.parseFloat(vehicles.get(id, "fuel")) + "'";
        sql = sql + ", color1 = '" + methods.parseInt(vehicles.get(id, "color1")) + "'";
        sql = sql + ", color2 = '" + methods.parseInt(vehicles.get(id, "color2")) + "'";
        sql = sql + ", is_special = '" + methods.parseInt(vehicles.get(id, "is_special")) + "'";
        sql = sql + ", neon_r = '" + methods.parseInt(vehicles.get(id, "neon_r")) + "'";
        sql = sql + ", neon_g = '" + methods.parseInt(vehicles.get(id, "neon_g")) + "'";
        sql = sql + ", neon_b = '" + methods.parseInt(vehicles.get(id, "neon_b")) + "'";
        sql = sql + ", number = '" + methods.removeQuotes(vehicles.get(id, "number")) + "'";
        sql = sql + ", is_cop_park = '" + methods.parseInt(vehicles.get(id, "is_cop_park")) + "'";
        sql = sql + ", cop_park_name = '" + vehicles.get(id, "cop_park_name") + "'";
        sql = sql + ", s_mp = '" + methods.parseFloat(vehicles.get(id, "s_mp")) + "'";
        sql = sql + ", livery = '" + methods.parseInt(vehicles.get(id, "livery")) + "'";
        sql = sql + ", x = '" + methods.parseFloat(vehicles.get(id, "x")) + "'";
        sql = sql + ", y = '" + methods.parseFloat(vehicles.get(id, "y")) + "'";
        sql = sql + ", z = '" + methods.parseFloat(vehicles.get(id, "z")) + "'";
        sql = sql + ", rot = '" + methods.parseFloat(vehicles.get(id, "rot")) + "'";
        sql = sql + ", upgrade = '" + vehicles.get(id, "upgrade") + "'";

        sql = sql + " where id = '" + methods.parseInt(vehicles.get(id, "id")) + "'";
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

vehicles.has = function(id, key) {
    //methods.debug('vehicles.get');
    return Container.Data.Has(offset + methods.parseInt(id), key);
};

vehicles.getData = function(id) {
    //methods.debug('vehicles.getData');
    return Container.Data.GetAll(offset + methods.parseInt(id));
};

vehicles.park = function(id, x, y, z, rot) {
    methods.debug('vehicles.park');
    rot = methods.parseInt(rot);
    vehicles.set(id, 'x', methods.parseFloat(x));
    vehicles.set(id, 'y', methods.parseFloat(y));
    vehicles.set(id, 'z', methods.parseFloat(z));
    vehicles.set(id, 'rot', methods.parseFloat(rot));
    mysql.executeQuery("UPDATE cars SET x = '" + methods.parseFloat(x) + "', y = '" + methods.parseFloat(y) + "', z = '" + methods.parseFloat(z) + "', rot = '" + methods.parseFloat(rot) + "' where id = '" + methods.parseInt(id) + "'");
};

vehicles.respawn = (vehicle) => {
    if (!vehicles.exists(vehicle))
        return;

    try {
        methods.debug('vehicles.respawn');
        let containerId = vehicle.getVariable('container');
        if (containerId != undefined && vehicle.getVariable('user_id') > 0)
            vehicles.spawnPlayerCar(containerId);
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

    /*let vInfo = methods.getVehicleInfo(veh.model);
    if (vInfo.fuel_full == 1)
        return;

    if (vInfo.fuel_full < fuel)
        fuel = vInfo.fuel_full;*/

    try {
        vehicles.set(veh.getVariable('container'), 'fuel', fuel);
        veh.setVariable('fuel', fuel);
    }
    catch (e) {
        methods.debug('SetFUEL', e);
    }
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
                let vid = veh.getVariable('vid');
                let car = vehicles.getData(vid);

                veh.neonEnabled = false;
                veh.windowTint = 0;

                for (let i = 0; i < 80; i++)
                    veh.setMod(i, -1);

                if (!car.has('color1'))
                    return;

                let numberStyle = 0;
                if (vid % 3)
                    numberStyle = 1;
                else if (vid % 4)
                    numberStyle = 2;
                else if (vid % 5)
                    numberStyle = 3;

                veh.numberPlateType = numberStyle;

                veh.setColor(car.get('color1'), car.get('color2'));

                if (car.get('neon_r') > 0)
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
                            methods.debug('vehicles.setTunning1', e);
                        }
                    }, 500);
                }
            }
            catch (e) {
                methods.debug('vehicles.setTunning2', e);
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
    veh.setVariable('vid', CountAllCars);
    veh.setVariable('invId', mp.joaat(number));

    vehicles.set(CountAllCars + offsetAll, 'fuel', vInfo.fuel_full);
    vehicles.set(CountAllCars + offsetAll, 'hash', model);

    return veh;
};

vehicles.spawnCarCb = (cb, position, heading, nameOrModel, color1 = -1, color2 = -1, liv = -1, number = undefined) => {
    methods.debug('vehicles.spawnCarCb ' + nameOrModel);
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
        vSync.setEngineState(veh, false);
        veh.locked = false;
        if (liv >= 0)
            veh.livery = liv;
        veh.setColor(color1, color2);

        veh.setVariable('container', CountAllCars + offsetAll);
        veh.setVariable('fuel', vInfo.fuel_full);
        veh.setVariable('vid', CountAllCars);
        veh.setVariable('invId', mp.joaat(number));

        vehicles.set(CountAllCars + offsetAll, 'fuel', vInfo.fuel_full);
        vehicles.set(CountAllCars + offsetAll, 'hash', model);
        vehicles.setFuel(vInfo.fuel_full);

        cb(veh);
    }, [model, position, {heading: parseFloat(heading), numberPlate: number, engine: false, dimension: 0}]);

    //return veh;
};

vehicles.spawnJobCar = (cb2, position, heading, nameOrModel, jobId = 0) => {
    methods.debug('vehicles.spawnJobCar', nameOrModel, jobId);

    if (typeof nameOrModel == "string")
        nameOrModel = nameOrModel.toLowerCase();

    vehicles.spawnCarCb(veh => {

        if (!vehicles.exists(veh))
            return;

        switch (jobId) {
            case 1: {
                veh.numberPlate = 'CNR' + jobId + veh.getVariable('vid');
                veh.setColor(111, 0);
                break;
            }
            case 2: {
                veh.numberPlate = 'MGO' + jobId + veh.getVariable('vid');
                veh.setColor(111, 111);
                break;
            }
            case 3: {
                veh.numberPlate = 'WZN' + jobId + veh.getVariable('vid');
                veh.setColor(111, 111);
                break;
            }
            case 4: {
                veh.numberPlate = 'GOP' + jobId + veh.getVariable('vid');

                if (nameOrModel == 'pony') {
                    veh.setColor(111, 111);
                    veh.livery = 1;
                }
                else {
                    switch (methods.getRandomInt(0, 4)) {
                        case 0:
                            veh.setColor(111, 28);
                            break;
                        case 1:
                            veh.setColor(111, 0);
                            break;
                        case 2:
                            veh.setColor(111, 83);
                            break;
                        case 3:
                            veh.setColor(111, 111);
                            break;
                    }
                }
                break;
            }
            case 5: {
                veh.numberPlate = 'PLJ' + jobId + veh.getVariable('vid');
                break;
            }
            case 6: {
                veh.numberPlate = 'TXI' + jobId + veh.getVariable('vid');
                veh.setColor(42, 42);
                break;
            }
            case 7: {
                veh.numberPlate = 'BUS' + jobId + veh.getVariable('vid');
                if (nameOrModel == 'bus')
                    veh.setColor(70, 0);
                break;
            }
            case 8: {
                veh.numberPlate = 'GRP' + jobId + veh.getVariable('vid');
                veh.setColor(111, 0);
                break;
            }
        }

        veh.locked = true;
        veh.setVariable('jobId', jobId);
        cb2(veh);

    }, position, heading, nameOrModel);
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
    return vehicle && mp.vehicles.exists(vehicle) && vehicle.id;
};