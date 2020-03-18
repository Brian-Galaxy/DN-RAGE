let Container = require('../modules/data');
let mysql = require('../modules/mysql');
let methods = require('../modules/methods');

let user = require('../user');
let coffer = require('../coffer');
let enums = require('../enums');
let inventory = require('../inventory');

let weather = require('../managers/weather');
let dispatcher = require('../managers/dispatcher');

let vehicles = require('./vehicles');
let stocks = require('./stocks');

let fraction = exports;

let count = 0;
let timer = 0;

let isCargo = false;

fraction.shopList = [
    {
        bId: 76,
        name: "Ammu-Nation Cypress Flats",
        sumMax: 60000,
        sumMin: 55000,
        pos: [
            [808.8968, -2159.189, 28.61901, 6.53001],
        ]
    },
    {
        bId: 41,
        name: "Los Santos Tattoo",
        sumMax: 60000,
        sumMin: 55000,
        pos: [
            [1325.094, -1650.716, 51.27528, 133.9299],
        ]
    },
    {
        bId: 94,
        name: "Robs Liquor Murrieta Heights",
        sumMax: 60000,
        sumMin: 55000,
        pos: [
            [1134.14, -982.4875, 45.41582, 284.5632],
        ]
    },
    {
        bId: 30,
        name: "Herr Kutz Devis",
        sumMax: 60000,
        sumMin: 55000,
        pos: [
            [134.455, -1707.691, 28.29161, 151.1897],
        ]
    },
    {
        bId: 104,
        name: "LTD Gasoline Davis",
        sumMax: 32000,
        sumMin: 28000,
        pos: [
            [-47.89329, -1759.359, 28.42101, 87.38793],
            [-46.6761, -1758.042, 28.42101, 58.77755],
        ]
    },
    {
        bId: 64,
        name: "Discount Store Strawberry",
        sumMax: 24000,
        sumMin: 19000,
        pos: [
            [73.85292, -1392.154, 28.37614, 283.6447],
            [74.91823, -1387.565, 28.37614, 185.8019],
            [78.02972, -1387.558, 28.37614, 184.6837],
        ]
    },
    {
        bId: 89,
        name: "24/7 Strawberry",
        sumMax: 32000,
        sumMin: 28000,
        pos: [
            [24.31314, -1347.342, 28.49703, 274.6689],
            [24.29523, -1345, 28.49703, 271.7999],
        ]
    },
    {
        bId: 40,
        name: "The Pit Tattoo",
        sumMax: 60000,
        sumMin: 55000,
        pos: [
            [-1151.652, -1424.404, 3.954463, 132.5959],
        ]
    },
    {
        bId: 33,
        name: "Beachcombover",
        sumMax: 60000,
        sumMin: 55000,
        pos: [
            [-1151.652, -1424.404, 3.954463, 132.5959],
        ]
    },
    {
        bId: 67,
        name: "Binco Vespucci Canals",
        sumMax: 24000,
        sumMin: 19000,
        pos: [
            [-822.4609, -1071.843, 10.32811, 216.5726],
            [-817.9464, -1070.503, 10.32811, 120.5435],
            [-816.4236, -1073.197, 10.32811, 122.9058],
        ]
    },
    {
        bId: 95,
        name: "Robs Liquor Vespucci Canals",
        sumMax: 60000,
        sumMin: 55000,
        pos: [
            [-1222.079, -908.4241, 11.32635, 26.30677],
        ]
    },
    {
        bId: 106,
        name: "LTD Gasoline Little Seoul",
        sumMax: 32000,
        sumMin: 28000,
        pos: [
            [-706.0416, -915.4315, 18.2156, 121.0112],
            [-705.9542, -913.6546, 18.2156, 91.24891],
        ]
    },
    {
        bId: 74,
        name: "Ammu-Nation Little Seoul",
        sumMax: 60000,
        sumMin: 55000,
        pos: [
            [-660.9584, -933.4232, 20.82923, 182.273],
        ]
    },
    {
        bId: 92,
        name: "-660.9584, -933.4232, 20.82923, 182.273",
        sumMax: 60000,
        sumMin: 55000,
        pos: [
            [-2966.386, 390.7784, 14.04331, 73.20607],
        ]
    },
    {
        bId: 82,
        name: "24/7 Banham Canyon",
        sumMax: 32000,
        sumMin: 28000,
        pos: [
            [-3039.08, 584.3269, 6.908932, 358.8096],
            [-3041.149, 583.6489, 6.908932, 22.88623],
        ]
    },
    {
        bId: 83,
        name: "24/7 Chumash",
        sumMax: 32000,
        sumMin: 28000,
        pos: [
            [-3244.603, 1000.006, 11.83071, 355.5228],
            [-3242.168, 999.9278, 11.83075, 359.23],
        ]
    },
    {
        bId: 58,
        name: "Suburban Chumash",
        sumMax: 24000,
        sumMin: 19000,
        pos: [
            [-3170.013, 1041.548, 19.86322, 75.12622],
            [-3169.305, 1043.154, 19.86322, 74.92207],
            [-3168.563, 1044.739, 19.86322, 70.76829],
        ]
    },
    {
        bId: 42,
        name: "Ink Inc Tattoo",
        sumMax: 60000,
        sumMin: 55000,
        pos: [
            [-3171.197, 1073.201, 19.82917, 343.623],
        ]
    },
    {
        bId: 78,
        name: "Ammu-Nation Chumash",
        sumMax: 60000,
        sumMin: 55000,
        pos: [
            [-3173.123, 1089.66, 19.83874, 247.4527],
        ]
    },
    {
        bId: 108,
        name: "LTD Gasoline Richman Glen",
        sumMax: 32000,
        sumMin: 28000,
        pos: [
            [-1818.927, 792.9451, 137.0822, 169.9128],
            [-1820.002, 794.2521, 137.0863, 134.8464],
        ]
    },
    {
        bId: 79,
        name: "Ammu-Nation Great Chaparral",
        sumMax: 60000,
        sumMin: 55000,
        pos: [
            [-1118.094, 2700.753, 17.55414, 225.373],
        ]
    },
    {
        bId: 65,
        name: "Discount Store Great Chaparral",
        sumMax: 24000,
        sumMin: 19000,
        pos: [
            [-1101.912, 2712.19, 18.10786, 229.5424],
            [-1097.746, 2714.485, 18.10786, 138.8698],
            [-1095.678, 2712.181, 18.10786, 140.0079],
        ]
    },
    {
        bId: 86,
        name: "24/7 Harmony",
        sumMax: 32000,
        sumMin: 28000,
        pos: [
            [549.2157, 2671.359, 41.15651, 100.8311],
            [549.5192, 2669.066, 41.15651, 100.3135],
        ]
    },
    {
        bId: 60,
        name: "Suburban Harmony",
        sumMax: 24000,
        sumMin: 19000,
        pos: [
            [612.6832, 2764.496, 41.08812, 276.5388],
            [612.8069, 2762.66, 41.08812, 283.3486],
            [612.9492, 2760.931, 41.08812, 279.4291],
        ]
    },
    {
        bId: 96,
        name: "Scoops Liquor Barn",
        sumMax: 60000,
        sumMin: 55000,
        pos: [
            [1165.981, 2710.884, 37.15769, 180.4475],
        ]
    },
    {
        bId: 61,
        name: "Discount Store Grand Senora Desert",
        sumMax: 24000,
        sumMin: 19000,
        pos: [
            [1197.434, 2711.755, 37.22262, 188.5901],
            [1202.03, 2710.732, 37.22262, 101.2999],
            [1202.06, 2707.603, 37.22262, 98.07609],
        ]
    },
    {
        bId: 77,
        name: "Ammu-Nation Tataviam Mountains",
        sumMax: 60000,
        sumMin: 55000,
        pos: [
            [2566.637, 292.4502, 107.7349, 4.131579],
        ]
    },
    {
        bId: 90,
        name: "24/7 Tataviam Mountains",
        sumMax: 32000,
        sumMin: 28000,
        pos: [
            [2554.851, 380.7508, 107.623, 358.886],
            [2557.135, 380.7416, 107.623, 357.6542],
        ]
    },
    {
        bId: 85,
        name: "24/7 Grand Senora Desert",
        sumMax: 32000,
        sumMin: 28000,
        pos: [
            [2675.927, 3280.391, 54.24115, 332.3407],
            [2677.966, 3279.257, 54.24115, 333.0592],
        ]
    },
    {
        bId: 62,
        name: "Discount Store Grapeseed",
        sumMax: 24000,
        sumMin: 19000,
        pos: [
            [1695.544, 4822.227, 41.0631, 106.2861],
            [1695.11, 4817.554, 41.0631, 13.15722],
            [1691.959, 4817.184, 41.0631, 14.44859],
        ]
    },
    {
        bId: 105,
        name: "LTD Gasoline Grapeseed",
        sumMax: 32000,
        sumMin: 28000,
        pos: [
            [1696.593, 4923.86, 41.06366, 6.185347],
            [1697.936, 4922.814, 41.06366, 327.2919],
        ]
    },
    {
        bId: 87,
        name: "24/7 Mount Chiliad",
        sumMax: 32000,
        sumMin: 28000,
        pos: [
            [1728.755, 6417.411, 34.03724, 245.723],
            [1727.664, 6415.288, 34.03724, 245.5537],
        ]
    }
];

fraction.warVehPos = [
    [-2989.434, 1206.93, 19.08533, 70.15103],
    [-2435.731, 2523.682, 2.518846, 83.1944],
    [-1668.367, 2645.572, 2.979561, 94.16602],
    [350.1584, 4429.85, 63.38568, -105.9183],
    [-315.2474, 2736.321, 67.8849, -147.9187],
    [-1350.313, 2162.407, 52.14052, 44.2464],
    [979.4666, 3096.74, 41.07245, -72.98763],
    [341.0433, 3566.049, 33.17041, -46.338],
    [2055.644, 3453.539, 43.53216, 153.3053],
    [2660.627, 3558.221, 50.43495, -62.438],
    [2975.506, 3485.838, 71.16584, -86.34027],
    [1823.644, 4733.436, 33.31877, 77.89813],
    [978.9515, 4457.739, 50.80576, 84.43235],
    [-1633.405, 4736.897, 52.98176, 4.152024],
    [-853.0948, 5779.731, 3.461468, -101.4297],
    [-919.3998, 6149.975, 5.019467, -1.557356],
    [-571.813, 6344.061, 2.893998, -60.66014],
    [163.4666, 6894.826, 20.52832, -116.7127],
    [1451.464, 6583.246, 12.10559, 166.5721],
    [2388.54, 4139.939, 34.49435, 146.3017],
    [810.6451, 1281.184, 360.1743, -93.71415],
    [757.1536, 2526.078, 72.88009, 84.84418],
    [1074.28, 2361.381, 43.88822, -173.297],
    [1400.453, 2997.436, 40.29012, -78.44015],
    [-600.0387, 5301.059, 69.95197, -163.2113],
];

let currentWarPos = [];

fraction.loadAll = function() {
    methods.debug('fraction.loadAll');

    mysql.executeQuery(`SELECT * FROM fraction_list`, function (err, rows, fields) {
        rows.forEach(function(item) {
            fraction.set(item['id'], 'id', item['id']);
            fraction.set(item['id'], 'owner_id', item['owner_id']);
            fraction.set(item['id'], 'name', item['name']);
            fraction.set(item['id'], 'money', item['money']);
            fraction.set(item['id'], 'is_bank', item['is_bank']);
            fraction.set(item['id'], 'is_shop', item['is_shop']);
            fraction.set(item['id'], 'is_war', item['is_war']);
            fraction.set(item['id'], 'is_kill', item['is_kill']);
            fraction.set(item['id'], 'rank_leader', item['rank_leader']);
            fraction.set(item['id'], 'rank_sub_leader', item['rank_sub_leader']);
            fraction.set(item['id'], 'rank_list', item['rank_list']);
            fraction.set(item['id'], 'rank_type_list', item['rank_type_list']);
        });
        count = rows.length;
        methods.debug('All Fraction Loaded: ' + count);
    });
};

fraction.removeTaxAndSave = function() {
    methods.debug('fraction.removeTax');

    mysql.executeQuery(`SELECT * FROM fraction_list`, function (err, rows, fields) {
        rows.forEach(function(item) {
            let sum = 5;
            if (item['is_war'])
                sum += 10;
            if (item['is_shop'])
                sum += 5;
            fraction.removeMoney(item['id'], sum, 'Взнос за существование');
            fraction.save(item['id']);
        });
    });
};

fraction.saveAll = function() {
    methods.debug('fraction.saveAll');
    mysql.executeQuery(`SELECT * FROM fraction_list`, function (err, rows, fields) {
        rows.forEach(function(item) {
            fraction.save(item['id']);
        });
    });
};

fraction.createCargoWar = function() {
    methods.notifyWithPictureToFractions2('Борьба за груз', `~r~ВНИМАНИЕ!`, 'Началась война за груз, груз отмечен на карте');
    isCargo = true;

    currentWarPos = [];
    let spawnList = [];
    spawnList.push(methods.getRandomInt(0, fraction.warVehPos.length));
    spawnList.push(methods.getRandomInt(0, fraction.warVehPos.length));
    spawnList.push(methods.getRandomInt(0, fraction.warVehPos.length));

    timer = 400;

    spawnList.forEach((item, i) => {
        let posVeh = new mp.Vector3(fraction.warVehPos[item][0], fraction.warVehPos[item][1], fraction.warVehPos[item][2]);

        currentWarPos.push(posVeh);

        methods.debug('SPAWNPOS', posVeh);

        mp.players.forEach(p => {
            if (!user.isLogin(p))
                return;

            methods.debug('FOREACH', posVeh.x, posVeh.y, posVeh.z);
            methods.debug('FOREACH2', posVeh);

            if (user.get(p, 'fraction_id2') > 0 && user.has(p, 'isCargo')) {
                if (i === 1)
                {
                    user.createBlip(p, i, posVeh.x, posVeh.y, posVeh.z, 616, 1);

                    user.createBlipByRadius(p, i, posVeh.x, posVeh.y, posVeh.z, 15, 9, 1);
                    user.createBlipByRadius(p, i + 10, posVeh.x, posVeh.y, posVeh.z, 60, 9, 3);
                }
                else if (i === 2)
                {
                    user.createBlip(p, i, posVeh.x, posVeh.y, posVeh.z, 616, 2);

                    user.createBlipByRadius(p, i, posVeh.x, posVeh.y, posVeh.z, 15, 9, 1);
                    user.createBlipByRadius(p, i + 10, posVeh.x, posVeh.y, posVeh.z, 60, 9, 3);
                }
                else {
                    user.createBlip(p, i, posVeh.x, posVeh.y, posVeh.z, 616, 3);

                    user.createBlipByRadius(p, i, posVeh.x, posVeh.y, posVeh.z, 15, 9, 1);
                    user.createBlipByRadius(p, i + 10, posVeh.x, posVeh.y, posVeh.z, 60, 9, 3);
                }
            }
        });

        vehicles.spawnCarCb(veh => {

            if (!vehicles.exists(veh))
                return;

            let rare = 0;
            if (methods.getRandomInt(0, 100) < 40)
                rare = 1;
            if (methods.getRandomInt(0, 100) < 15)
                rare = 2;

            try {
                let color = methods.getRandomInt(0, 150);
                veh.locked = false;
                veh.setColor(color, color);

                veh.setMod(5, methods.getRandomInt(0, 2));

                let rare = 0;
                if (methods.getRandomInt(0, 100) < 40)
                    rare = 1;
                if (methods.getRandomInt(0, 100) < 15)
                    rare = 2;
                let boxRandom = stocks.boxList.filter((item) => { return item[7] === rare; });
                veh.setVariable('box1', boxRandom[methods.getRandomInt(0, boxRandom.length)][2]);

                rare = 0;
                if (methods.getRandomInt(0, 100) < 40)
                    rare = 1;
                if (methods.getRandomInt(0, 100) < 15)
                    rare = 2;
                boxRandom = stocks.boxList.filter((item) => { return item[7] === rare; });
                veh.setVariable('box2', boxRandom[methods.getRandomInt(0, boxRandom.length)][2]);

                rare = 0;
                if (methods.getRandomInt(0, 100) <= 50)
                    veh.setVariable('box3', methods.getRandomInt(3, 5));
                else
                    veh.setVariable('box3', methods.getRandomInt(38, 40));

                veh.setVariable('cargoId', i);
            }
            catch (e) {
                methods.debug(e);
            }

        }, posVeh, fraction.warVehPos[item][3], 'Speedo4');
    });

    setTimeout(fraction.timerCargoWar, 1000);
};

fraction.stopCargoWar = function() {

    //methods.notifyWithPictureToFractions2('Борьба за груз', `~r~ВНИМАНИЕ!`, 'Миссия была завершена');
    isCargo = false;
    timer = 0;

    /*mp.vehicles.forEach(v => {
        if (!vehicles.exists(v))
            return;
        if (v.getVariable('cargoId') !== null && v.getVariable('cargoId') !== undefined) {
            if (v.getOccupants().length == 0)
                vehicles.respawn(v);
        }
    });*/

    mp.players.forEach(p => {
        if (!user.isLogin(p))
            return;

        if (user.get(p, 'fraction_id2') > 0) {
            currentWarPos.forEach((item, i) => {
                user.deleteBlip(p, i);
                user.deleteBlipByRadius(p, i);
                user.deleteBlipByRadius(p, i + 10);
            });
        }
    });
};

fraction.timerCargoWar = function() {

    timer--;

    if (timer === 100) {
        mp.players.forEach(p => {
            if (!user.isLogin(p))
                return;

            if (user.get(p, 'fraction_id2') > 0 && user.has(p, 'isCargo')) {
                currentWarPos.forEach((item, i) => {
                    user.deleteBlipByRadius(p, i);
                });
            }
        });
    }

    if (timer > 100) {
        currentWarPos.forEach(item => {
            mp.players.forEachInRange(item, 15, p => {
                if (!user.isLogin(p))
                    return;

                if (user.get(p, 'fraction_id2') > 0 && p.health > 0) {
                    user.setHealth(p, p.health - 20);
                }
            });
        });
    }

    currentWarPos.forEach(item => {
        mp.vehicles.forEachInRange(item, 60, v => {
            if (!vehicles.exists(v))
                return;

            if (v.getVariable('cargoId') !== null && v.getVariable('cargoId') !== undefined) {
                //...
            }
            else {
                if (v.getOccupants().length > 0)
                    vehicles.respawn(v);
            }
        });
    });

    /*mp.vehicles.forEachInDimension(0, v => {
        if (!vehicles.exists(v))
            return;

        if (v.bodyHealth === 0 || v.engineHealth === 0 || v.dead)
            return;

        if (v.getVariable('cargoId') !== null && v.getVariable('cargoId') !== undefined) {
            let cargoId = methods.parseInt(v.getVariable('cargoId'));
            let vPos = v.position;

            isCargo = true;

            mp.players.forEach(p => {
                if (!user.isLogin(p))
                    return;

                if (user.get(p, 'fraction_id2') > 0 && user.has(p, 'isCargo')) {
                    if (cargoId === 1)
                        user.createBlip1(p, vPos.x, vPos.y, vPos.z, 616, 1);
                    else if (cargoId === 2)
                        user.createBlip2(p, vPos.x, vPos.y, vPos.z, 616, 2);
                    else
                        user.createBlip3(p, vPos.x, vPos.y, vPos.z, 616, 3);
                }
            });
        }
    });*/

    if (timer < 1) {
        fraction.stopCargoWar();
        return;
    }

    setTimeout(fraction.timerCargoWar, 1000);
};

fraction.getShopGang = function(player) {
    if (!user.isLogin(player))
        return;

    if (user.get(player, 'fraction_id2') < 1) {
        player.notify('~r~Вы не состоите в организации');
        return;
    }
    if (fraction.get(user.get(player, 'fraction_id2'), 'cantGrab')) {
        player.notify('~r~Вы уже сегодня совершали ограбление');
        return;
    }
    if (!user.isLeader2(player) && !user.isSubLeader2(player)) {
        player.notify('~r~Начать захват может только лидер или заместитель лидера');
        return;
    }

    /*if (weather.getHour() < 23 && weather.getHour() > 4) {
        player.notify('~r~Доступно только с 23 до 4 утра IC времени');
        return;
    }*/

    /*let dateTime = new Date();
    if (dateTime.getHours() < 18) {
        player.notify('~r~Доступно только с 18 до 24 ночи ООС времени');
        return;
    }*/

    let frId = user.get(player, 'fraction_id2');

    fraction.set(frId, 'cantGrab', true);

    let shopItem = fraction.shopList[methods.getRandomInt(0, fraction.shopList.length)];

    fraction.set(frId, 'currentGrabShop', shopItem);

    mp.players.forEach(p => {
        if (user.isLogin(p) && user.get(p, 'fraction_id2') === frId) {
            shopItem.pos.forEach((pos, i) => {
                user.createBlip(p, i + 1000, pos[0], pos[1], pos[2], 628, 0);
            });
        }
    });

    shopItem.pos.forEach((pos, i) => {
        fraction.set(frId, 'currentGrabShop' + i, false);
    });

    player.notify('~b~Ламар скинул кооринаты на магазин');
};

fraction.startGrabShopGang = function(player, itemId = 0) {
    if (!user.isLogin(player))
        return;

    if (user.get(player, 'fraction_id2') < 1) {
        player.notify('~r~Вы не состоите в организации');
        return;
    }

    let frId = user.get(player, 'fraction_id2');

    if (!fraction.has(frId, 'currentGrabShop')) {
        player.notify('~r~Необходимо начать задание');
        return;
    }

    let shopItem = fraction.get(frId, 'currentGrabShop');

    shopItem.pos.forEach((pos, i) => {
        if (methods.distanceToPos(new mp.Vector3(pos[0], pos[1], pos[2]), player.position) < 1.5) {

            if (fraction.has(frId, 'currentGrabShopActive' + i)) {
                player.notify('~r~Касса сейчас уже взламывается');
                return;
            }
            if (fraction.get(frId, 'currentGrabShop' + i)) {
                player.notify('~r~Эту кассу уже взламывали');
                return;
            }

            dispatcher.sendPos(`Код 0`, `Срочно, всем патрулям, происходит ограбление магазина ${shopItem.name}`, player.position);

            player.position = new mp.Vector3(pos[0], pos[1], pos[2]);
            player.heading = pos[3];

            user.playAnimation(player, "missheistfbisetup1", "unlock_loop_janitor", 9);
            user.blockKeys(player, true);

            fraction.set(frId, 'currentGrabShopActive' + i, true);

            setTimeout(function () {

                if (!user.isLogin(player))
                    return;

                try {
                    user.blockKeys(player, false);
                    user.stopAnimation(player);

                    fraction.reset(frId, 'currentGrabShopActive' + i);

                    if (methods.getRandomInt(0, 100) < 40) {
                        inventory.addItem(141, 1, inventory.types.Player, user.getId(player), methods.getRandomInt(shopItem.sumMax, shopItem.sumMin), 0, "{}", 2);
                        mp.players.forEach(p => {
                            if (user.isLogin(p) && user.get(p, 'fraction_id2') === frId) {
                                user.deleteBlip(p, i + 1000);
                            }
                        });
                        player.notify('~g~Вы успешно взломали кассу');

                        fraction.set(frId, 'currentGrabShop' + i, true);
                    }
                    else {
                        player.notify('~r~Вы сломали отмычку');
                        inventory.deleteItem(itemId);
                    }
                }
                catch (e) {
                    methods.debug(e);
                }
            }, 60000)
        }
    });
};

fraction.save = function(id) {

    return new Promise((resolve) => {
        methods.debug('fraction.save');

        if (!fraction.has(id, "id")) {
            resolve();
            return;
        }

        let sql = "UPDATE fraction_list SET";

        sql = sql + " name = '" + methods.removeQuotes(fraction.get(id, "name")) + "'";
        sql = sql + ", money = '" + methods.parseInt(fraction.get(id, "money")) + "'";
        sql = sql + ", is_bank = '" + methods.parseInt(fraction.get(id, "is_bank")) + "'";
        sql = sql + ", is_shop = '" + methods.parseInt(fraction.get(id, "is_shop")) + "'";
        sql = sql + ", is_war = '" + methods.parseInt(fraction.get(id, "is_war")) + "'";
        sql = sql + ", is_kill = '" + methods.parseInt(fraction.get(id, "is_kill")) + "'";
        sql = sql + ", rank_leader = '" + methods.removeQuotes(fraction.get(id, "rank_leader")) + "'";
        sql = sql + ", rank_sub_leader = '" + methods.removeQuotes(fraction.get(id, "rank_sub_leader")) + "'";
        sql = sql + ", rank_list = '" + methods.removeQuotes(fraction.get(id, "rank_list")) + "'";
        sql = sql + ", rank_type_list = '" + methods.removeQuotes(fraction.get(id, "rank_type_list")) + "'";

        sql = sql + " where id = '" + methods.parseInt(fraction.get(id, "id")) + "'";
        mysql.executeQuery(sql, undefined, function () {
            resolve();
        });
    });
};

fraction.getData = function(id) {
    return Container.Data.GetAll(enums.offsets.fraction + methods.parseInt(id));
};

fraction.get = function(id, key) {
    return Container.Data.Get(enums.offsets.fraction + methods.parseInt(id), key);
};

fraction.has = function(id, key) {
    return Container.Data.Has(enums.offsets.fraction + methods.parseInt(id), key);
};

fraction.set = function(id, key, val) {
    Container.Data.Set(enums.offsets.fraction + methods.parseInt(id), key, val);
};

fraction.reset = function(id, key, val) {
    Container.Data.Reset(enums.offsets.fraction + methods.parseInt(id), key, val);
};

fraction.getName = function(id) {
    return fraction.get(id, 'name');
};

fraction.addMoney = function(id, money, name = "Операция со счетом") {
    fraction.addHistory('Система', name, `Зачисление в бюждет: ${methods.cryptoFormat(money)}`, id);
    fraction.setMoney(id, fraction.getMoney(id) + methods.parseFloat(money));
};

fraction.removeMoney = function(id, money, name = "Операция со счетом") {
    fraction.addHistory('Система', name, `Потрачено из бюджета: ${methods.cryptoFormat(money * -1)}`, id);
    fraction.setMoney(id, fraction.getMoney(id) - methods.parseFloat(money));
};

fraction.setMoney = function(id, money) {
    id = methods.parseInt(id);
    Container.Data.Set(enums.offsets.fraction + id, 'money', methods.parseFloat(money));
};

fraction.getMoney = function(id) {
    id = methods.parseInt(id);
    if (Container.Data.Has(enums.offsets.fraction + id, 'money'))
        return methods.parseFloat(Container.Data.Get(enums.offsets.fraction + id, 'money'));
    return 0;
};

fraction.addHistory = function (name, doName, text, fractionId) {
    doName = methods.removeQuotes(doName);
    text = methods.removeQuotes(text);
    name = methods.removeQuotes(name);
    mysql.executeQuery(`INSERT INTO log_fraction_2 (name, text, text2, fraction_id, timestamp, rp_datetime) VALUES ('${name}', '${doName}', '${text}', '${fractionId}', '${methods.getTimeStamp()}', '${weather.getRpDateTime()}')`);
};

fraction.editFractionName = function(player, text) {
    if (!user.isLogin(player))
        return;

    let id = user.get(player, 'fraction_id2');
    fraction.set(id, "name", methods.removeQuotes2(methods.removeQuotes(text)));
    player.notify('~g~Вы сменили название организации');

    fraction.save(id);
};

fraction.editFractionLeader = function(player, text) {
    if (!user.isLogin(player))
        return;

    let id = user.get(player, 'fraction_id2');
    fraction.set(id, "rank_leader", methods.removeQuotes2(methods.removeQuotes(text)));
    player.notify('~g~Вы обновили название ранга');

    fraction.save(id);
};

fraction.editFractionSubLeader = function(player, text) {
    if (!user.isLogin(player))
        return;

    let id = user.get(player, 'fraction_id2');
    fraction.set(id, "rank_sub_leader", methods.removeQuotes2(methods.removeQuotes(text)));
    player.notify('~g~Вы обновили название ранга');

    fraction.save(id);
};

fraction.editFractionRank = function(player, text, rankId, depId) {
    if (!user.isLogin(player))
        return;

    text = methods.removeQuotes2(methods.removeQuotes(text));

    let id = user.get(player, 'fraction_id2');
    let rankList = JSON.parse(fraction.get(id, 'rank_list'));
    rankList[depId][rankId] = text;
    fraction.set(id, "rank_list", JSON.stringify(rankList));

    player.notify('~g~Вы обновили название ранга');

    fraction.save(id);
};

fraction.editFractionDep = function(player, text, depId) {
    if (!user.isLogin(player))
        return;

    text = methods.removeQuotes2(methods.removeQuotes(text));

    let id = user.get(player, 'fraction_id2');
    let depList = JSON.parse(fraction.get(id, 'rank_type_list'));
    depList[depId] = text;
    fraction.set(id, "rank_type_list", JSON.stringify(depList));

    player.notify('~g~Вы обновили название раздела');

    fraction.save(id);
};

fraction.deleteFractionDep = function(player) {
    if (!user.isLogin(player))
        return;

    let id = user.get(player, 'fraction_id2');

    let depList = JSON.parse(fraction.get(id, 'rank_type_list'));
    let rankList = JSON.parse(fraction.get(id, 'rank_list'));
    depList.pop();
    rankList.pop();

    fraction.set(id, "rank_type_list", JSON.stringify(depList));
    fraction.set(id, "rank_list", JSON.stringify(rankList));

    player.notify('~g~Вы удалили раздел');

    fraction.save(id);
};

fraction.addFractionRank = function(player, text, depId) {
    if (!user.isLogin(player))
        return;

    text = methods.removeQuotes2(methods.removeQuotes(text));

    let id = user.get(player, 'fraction_id2');
    let rankList = JSON.parse(fraction.get(id, 'rank_list'));
    rankList[depId].push(text);
    fraction.set(id, "rank_list", JSON.stringify(rankList));

    player.notify('~g~Вы добавили должность');

    fraction.save(id);
};

fraction.editFractionDep = function(player, text, depId) {
    if (!user.isLogin(player))
        return;

    text = methods.removeQuotes2(methods.removeQuotes(text));

    let id = user.get(player, 'fraction_id2');
    let depList = JSON.parse(fraction.get(id, 'rank_type_list'));
    depList[depId] = text;
    fraction.set(id, "rank_type_list", JSON.stringify(depList));

    player.notify('~g~Вы обновили название раздела');

    fraction.save(id);
};

fraction.createFractionDep = function(player, text) {
    if (!user.isLogin(player))
        return;

    let id = user.get(player, 'fraction_id2');

    text = methods.removeQuotes2(methods.removeQuotes(text));

    let depList = JSON.parse(fraction.get(id, 'rank_type_list'));
    depList.push(text);

    let rankList = JSON.parse(fraction.get(id, 'rank_list'));
    rankList.push(["Глава отдела", "Зам. главы отдела"]);

    fraction.set(id, "rank_type_list", JSON.stringify(depList));
    fraction.set(id, "rank_list", JSON.stringify(rankList));

    player.notify('~g~Вы сменили добавили новый раздел');

    fraction.save(id);
};

fraction.updateOwnerInfo = function (id, userId) {
    methods.debug('fraction.updateOwnerInfo');
    id = methods.parseInt(id);
    userId = methods.parseInt(userId);

    fraction.set(id, "owner_id", userId);

    if (userId == 0) {
        fraction.set(id, "rank_leader", 'Лидер');
        fraction.set(id, "rank_sub_leader", 'Заместитель');
        fraction.set(id, "rank_type_list", '["Основной состав"]');
        fraction.set(id, "rank_list", '[["Глава отдела", "Зам. главы отдела", "Соучастник"]]');
    }
    else
        mysql.executeQuery("UPDATE fraction_list SET owner_id = '" + userId + "' where id = '" + id + "'");

    fraction.save(id);
};

fraction.create = function (player, id) {
    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    methods.debug('fraction.create');

    if (user.get(player, 'fraction_id2') > 0) {
        player.notify('~r~Вы уже состоите в организации');
        return;
    }
    if (fraction.get(id, 'owner_id') > 0) {
        player.notify('~r~У организации уже есть владелец');
        return;
    }
    if (user.getCryptoMoney(player) < 100) {
        player.notify('~r~У Вас не достаточно валюты E-COIN для создания организации');
        return;
    }

    user.set(player, 'fraction_id2', id);
    user.set(player, 'is_leader2', true);

    fraction.setMoney(id, 100);
    fraction.addHistory(user.getRpName(player), 'Создал организацию', '', id);
    fraction.updateOwnerInfo(id, user.getId(player));
    fraction.set(id, "name", 'Группировка');
    user.removeCryptoMoney(player, 100, 'Создание организации');

    setTimeout(function () {
        if (!user.isLogin(player))
            return;
        user.save(player);
        fraction.save(id);
        player.notify('~g~Поздравляем с созданием организации');
    }, 500);
};

fraction.destroy = function (player, id) {
    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    methods.debug('fraction.destroy');

    if (fraction.get(id, 'owner_id') != user.getId(player)) {
        player.notify('~r~Эта организация вам не приналдежит');
        return;
    }

    fraction.set(id, "name", 'Слот свободен');
    fraction.set(id, "money", 0);
    fraction.set(id, "is_bank", false);
    fraction.set(id, "is_shop", false);
    fraction.set(id, "is_war", false);
    fraction.set(id, "is_kill", false);
    fraction.set(id, "rank_leader", 'Лидер');
    fraction.set(id, "rank_sub_leader", 'Заместитель');
    fraction.set(id, "rank_type_list", '["Основной состав"]');
    fraction.set(id, "rank_list", '[["Глава отдела", "Зам. главы отдела", "Соучастник"]]');

    user.set(player, 'fraction_id2', 0);
    user.set(player, 'is_leader2', false);

    fraction.updateOwnerInfo(id, 0);

    mysql.executeQuery("UPDATE users SET fraction_id2 = '" + 0 + "' where fraction_id2 = '" + id + "'");

    mp.players.forEach(p => {
        if (!user.isLogin(p))
            return;

        if (user.get(p, 'fraction_id2') == id) {
            user.set(p, 'fraction_id2', 0);
            user.set(p, 'is_leader2', false);
            p.notify('~y~Организация была расфомирована');
        }
    });

    setTimeout(function () {
        if (!user.isLogin(player))
            return;
        user.save(player);
        player.notify('~y~Организация была расфомирована');
    }, 500);
};

