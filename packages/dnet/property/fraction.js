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
        sumMax: 120000,
        sumMin: 110000,
        pos: [
            [808.8968, -2159.189, 28.61901, 6.53001],
        ]
    },
    {
        bId: 41,
        name: "Los Santos Tattoo",
        sumMax: 120000,
        sumMin: 110000,
        pos: [
            [1325.094, -1650.716, 51.27528, 133.9299],
        ]
    },
    {
        bId: 94,
        name: "Robs Liquor Murrieta Heights",
        sumMax: 120000,
        sumMin: 110000,
        pos: [
            [1134.14, -982.4875, 45.41582, 284.5632],
        ]
    },
    {
        bId: 30,
        name: "Herr Kutz Devis",
        sumMax: 120000,
        sumMin: 110000,
        pos: [
            [134.455, -1707.691, 28.29161, 151.1897],
        ]
    },
    {
        bId: 104,
        name: "LTD Gasoline Davis",
        sumMax: 64000,
        sumMin: 56000,
        pos: [
            [-47.89329, -1759.359, 28.42101, 87.38793],
            [-46.6761, -1758.042, 28.42101, 58.77755],
        ]
    },
    {
        bId: 64,
        name: "Discount Store Strawberry",
        sumMax: 58000,
        sumMin: 38000,
        pos: [
            [73.85292, -1392.154, 28.37614, 283.6447],
            [74.91823, -1387.565, 28.37614, 185.8019],
            [78.02972, -1387.558, 28.37614, 184.6837],
        ]
    },
    {
        bId: 89,
        name: "24/7 Strawberry",
        sumMax: 64000,
        sumMin: 56000,
        pos: [
            [24.31314, -1347.342, 28.49703, 274.6689],
            [24.29523, -1345, 28.49703, 271.7999],
        ]
    },
    {
        bId: 40,
        name: "The Pit Tattoo",
        sumMax: 120000,
        sumMin: 110000,
        pos: [
            [-1151.652, -1424.404, 3.954463, 132.5959],
        ]
    },
    {
        bId: 33,
        name: "Beachcombover",
        sumMax: 120000,
        sumMin: 110000,
        pos: [
            [-1151.652, -1424.404, 3.954463, 132.5959],
        ]
    },
    {
        bId: 67,
        name: "Binco Vespucci Canals",
        sumMax: 58000,
        sumMin: 38000,
        pos: [
            [-822.4609, -1071.843, 10.32811, 216.5726],
            [-817.9464, -1070.503, 10.32811, 120.5435],
            [-816.4236, -1073.197, 10.32811, 122.9058],
        ]
    },
    {
        bId: 95,
        name: "Robs Liquor Vespucci Canals",
        sumMax: 120000,
        sumMin: 110000,
        pos: [
            [-1222.079, -908.4241, 11.32635, 26.30677],
        ]
    },
    {
        bId: 106,
        name: "LTD Gasoline Little Seoul",
        sumMax: 64000,
        sumMin: 56000,
        pos: [
            [-706.0416, -915.4315, 18.2156, 121.0112],
            [-705.9542, -913.6546, 18.2156, 91.24891],
        ]
    },
    {
        bId: 74,
        name: "Ammu-Nation Little Seoul",
        sumMax: 120000,
        sumMin: 110000,
        pos: [
            [-660.9584, -933.4232, 20.82923, 182.273],
        ]
    },
    {
        bId: 92,
        name: "-660.9584, -933.4232, 20.82923, 182.273",
        sumMax: 120000,
        sumMin: 110000,
        pos: [
            [-2966.386, 390.7784, 14.04331, 73.20607],
        ]
    },
    {
        bId: 82,
        name: "24/7 Banham Canyon",
        sumMax: 64000,
        sumMin: 56000,
        pos: [
            [-3039.08, 584.3269, 6.908932, 358.8096],
            [-3041.149, 583.6489, 6.908932, 22.88623],
        ]
    },
    {
        bId: 83,
        name: "24/7 Chumash",
        sumMax: 64000,
        sumMin: 56000,
        pos: [
            [-3244.603, 1000.006, 11.83071, 355.5228],
            [-3242.168, 999.9278, 11.83075, 359.23],
        ]
    },
    {
        bId: 58,
        name: "Suburban Chumash",
        sumMax: 58000,
        sumMin: 38000,
        pos: [
            [-3170.013, 1041.548, 19.86322, 75.12622],
            [-3169.305, 1043.154, 19.86322, 74.92207],
            [-3168.563, 1044.739, 19.86322, 70.76829],
        ]
    },
    {
        bId: 42,
        name: "Ink Inc Tattoo",
        sumMax: 120000,
        sumMin: 110000,
        pos: [
            [-3171.197, 1073.201, 19.82917, 343.623],
        ]
    },
    {
        bId: 78,
        name: "Ammu-Nation Chumash",
        sumMax: 120000,
        sumMin: 110000,
        pos: [
            [-3173.123, 1089.66, 19.83874, 247.4527],
        ]
    },
    {
        bId: 108,
        name: "LTD Gasoline Richman Glen",
        sumMax: 64000,
        sumMin: 56000,
        pos: [
            [-1818.927, 792.9451, 137.0822, 169.9128],
            [-1820.002, 794.2521, 137.0863, 134.8464],
        ]
    },
    {
        bId: 79,
        name: "Ammu-Nation Great Chaparral",
        sumMax: 120000,
        sumMin: 110000,
        pos: [
            [-1118.094, 2700.753, 17.55414, 225.373],
        ]
    },
    {
        bId: 65,
        name: "Discount Store Great Chaparral",
        sumMax: 58000,
        sumMin: 38000,
        pos: [
            [-1101.912, 2712.19, 18.10786, 229.5424],
            [-1097.746, 2714.485, 18.10786, 138.8698],
            [-1095.678, 2712.181, 18.10786, 140.0079],
        ]
    },
    {
        bId: 86,
        name: "24/7 Harmony",
        sumMax: 64000,
        sumMin: 56000,
        pos: [
            [549.2157, 2671.359, 41.15651, 100.8311],
            [549.5192, 2669.066, 41.15651, 100.3135],
        ]
    },
    {
        bId: 60,
        name: "Suburban Harmony",
        sumMax: 58000,
        sumMin: 38000,
        pos: [
            [612.6832, 2764.496, 41.08812, 276.5388],
            [612.8069, 2762.66, 41.08812, 283.3486],
            [612.9492, 2760.931, 41.08812, 279.4291],
        ]
    },
    {
        bId: 96,
        name: "Scoops Liquor Barn",
        sumMax: 120000,
        sumMin: 110000,
        pos: [
            [1165.981, 2710.884, 37.15769, 180.4475],
        ]
    },
    {
        bId: 61,
        name: "Discount Store Grand Senora Desert",
        sumMax: 58000,
        sumMin: 38000,
        pos: [
            [1197.434, 2711.755, 37.22262, 188.5901],
            [1202.03, 2710.732, 37.22262, 101.2999],
            [1202.06, 2707.603, 37.22262, 98.07609],
        ]
    },
    {
        bId: 77,
        name: "Ammu-Nation Tataviam Mountains",
        sumMax: 120000,
        sumMin: 110000,
        pos: [
            [2566.637, 292.4502, 107.7349, 4.131579],
        ]
    },
    {
        bId: 90,
        name: "24/7 Tataviam Mountains",
        sumMax: 64000,
        sumMin: 56000,
        pos: [
            [2554.851, 380.7508, 107.623, 358.886],
            [2557.135, 380.7416, 107.623, 357.6542],
        ]
    },
    {
        bId: 85,
        name: "24/7 Grand Senora Desert",
        sumMax: 64000,
        sumMin: 56000,
        pos: [
            [2675.927, 3280.391, 54.24115, 332.3407],
            [2677.966, 3279.257, 54.24115, 333.0592],
        ]
    },
    {
        bId: 62,
        name: "Discount Store Grapeseed",
        sumMax: 58000,
        sumMin: 38000,
        pos: [
            [1695.544, 4822.227, 41.0631, 106.2861],
            [1695.11, 4817.554, 41.0631, 13.15722],
            [1691.959, 4817.184, 41.0631, 14.44859],
        ]
    },
    {
        bId: 105,
        name: "LTD Gasoline Grapeseed",
        sumMax: 64000,
        sumMin: 56000,
        pos: [
            [1696.593, 4923.86, 41.06366, 6.185347],
            [1697.936, 4922.814, 41.06366, 327.2919],
        ]
    },
    {
        bId: 87,
        name: "24/7 Mount Chiliad",
        sumMax: 64000,
        sumMin: 56000,
        pos: [
            [1728.755, 6417.411, 34.03724, 245.723],
            [1727.664, 6415.288, 34.03724, 245.5537],
        ]
    }
];

fraction.warVehPos = [
    [1870.082, 298.3746, 162.3346, -124.8814], // East BC
    [1896.424, 412.0526, 162.3378, -4.591704], // East BC
    [1993.255, 496.8024, 163.0947, 53.31678], // East BC
    [2808.715, -619.4117, 3.042876, -148.2264], // East BC
    [2830.751, -793.5372, 1.768237, 107.0505], // East BC
    [2372.163, -568.6808, 78.94184, -66.70097], // East BC
    [2546.143, 1098.502, 65.319, -87.69911], // East BC
    [2436.517, 1351.142, 48.21091, -2.759004], // East BC
    [2725.208, 1354.907, 24.2615, 0.5711061], // East BC
    [2846.512, 1524.621, 24.305, 57.1941], // East BC
    [2526.179, 2404.379, 50.79271, -60.5872], // Northeastern BC
    [2364.736, 2734.847, 44.27731, 63.13626], // Northeastern BC
    [2703.672, 2994.222, 35.31195, 81.06208], // Northeastern BC
    [2623.019, 3000.074, 39.24618, 75.34029], // Northeastern BC
    [2518.539, 3133.927, 49.26498, -158.8873], // Northeastern BC
    [2698.627, 3362.313, 56.80704, -154.5147], // Northeastern BC
    [2490.877, 3293.257, 51.63654, 163.6505], // Northeastern BC
    [2309.01, 3203.323, 48.53867, 162.0135], // Northeastern BC
    [2833.331, 3927.366, 46.33087, 76.07546], // Northeastern BC
    [2722.111, 3778.254, 43.62608, -73.46407], // Northeastern BC
    [2599.976, 4496.924, 36.26006, -30.36485], // Grapeseed
    [2511.435, 4838.765, 35.47731, -15.75592], // Grapeseed
    [2264.874, 4910.021, 40.68339, 15.61627], // Grapeseed
    [2358.013, 5008.499, 42.97598, 123.0206], // Grapeseed
    [2182.581, 5066.679, 44.14911, 56.53646], // Grapeseed
    [2103.671, 5133.179, 48.50955, 46.26224], // Grapeseed
    [2034.205, 4912.188, 41.25378, 50.33447], // Grapeseed
    [1945.093, 4993.532, 42.19816, -7.24361], // Grapeseed
    [1929.582, 4840.355, 45.48512, -177.6844], // Grapeseed
    [1854.518, 4914.193, 44.92831, 167.0235], // Grapeseed
    [1422.353, 6595.212, 12.30073, 80.47939], // Paleto Bay
    [1278.421, 6608.941, 0.9136851, 79.97983], // Paleto Bay
    [874.2178, 6583.313, 5.998014, 64.23732], // Paleto Bay
    [640.0947, 6654.481, 6.322682, 113.5851], // Paleto Bay
    [462.2226, 6747.779, 1.776442, 141.8092], // Paleto Bay
    [166.1704, 6968.729, 9.658717, 103.9271], // Paleto Bay
    [75.77062, 7076.842, 1.713074, 60.75148], // Paleto Bay
    [17.9405, 6851.714, 12.94489, 148.9224], // Paleto Bay
    [123.5249, 6717.721, 40.09267, -173.9498], // Paleto Bay
    [214.7288, 7030.315, 2.441566, 27.06781], // Paleto Bay
    [-826.2584, 5772.151, 4.241761, 59.7108], // Northwestern BC
    [-970.7736, 5532.121, 5.416851, 82.82072], // Northwestern BC
    [-1069.131, 5458.614, 3.492951, 0.2004236], // Northwestern BC
    [-472.531, 5517.609, 79.71832, 30.30912], // Northwestern BC
    [-733.5109, 5362.463, 60.48499, -2.553496], // Northwestern BC
    [-413.2389, 5162.115, 108.915, 111.2487], // Northwestern BC
    [-1632.405, 4736.869, 52.98143, 36.60846], // Northwestern BC
    [-1707.369, 5040.811, 30.42309, -56.09746], // Northwestern BC
    [-1681.224, 4599.285, 48.90196, -66.52148], // Northwestern BC
    [-2196.254, 4584.213, 1.673657, -90.72962], // Northwestern BC
    [-2502.712, 2703.665, 1.376871, -145.1805], // Logo Zancudo
    [-2576.344, 2488.536, 0.9203494, -152.1933], // Logo Zancudo
    [-2335.763, 2436.943, 5.189456, -3.544878], // Logo Zancudo
    [-2281.071, 2678.393, 1.766204, -57.08541], // Logo Zancudo
    [-2122.812, 2539.186, 2.875674, -110.2537], // Logo Zancudo
    [-2189.286, 2682.892, 2.61702, -71.71084], // Logo Zancudo
    [-1954.691, 2644.694, 2.64593, -141.9069], // Logo Zancudo
    [-1881.617, 2537.36, 2.548225, -64.28069], // Logo Zancudo
    [-1836.898, 2556.347, 3.449423, -46.74959], // Logo Zancudo
    [-1728.43, 2643.229, 1.181955, -55.04958], // Logo Zancudo
    [-2835.302, 1604.851, 40.08301, 135.3932], // West BC
    [-2667.052, 1737.443, 81.59503, 131.8065], // West BC
    [-2785.78, 1222.146, 110.8425, 53.05136], // West BC
    [-2283.421, 823.7731, 216.5667, -60.02339], // West BC
    [-1747.831, 1990.126, 117.0882, -37.98998], // West BC
    [-1344.053, 1491.82, 143.6574, 39.46989], // West BC
    [-1804.866, 1180.761, 192.1481, -115.5075], // West BC
    [-987.5235, 1861.951, 148.2501, -88.78628], // West BC
    [-1069.976, 2453.866, 45.35464, 31.14936], // West BC
    [-442.0548, 2121.462, 200.3653, -108.6176], // West BC
    [930.803, 2993.985, 39.31632, -102.5824],  // West BC
    [1329.069, 2873.024, 41.39872, -155.1515],  // West BC
    [1627.524, 2983.506, 52.19984, -165.3867],  // West BC
    [1873.676, 3413.927, 40.61953, -159.3947],  // West BC
    [1312.363, 2232.864, 84.16484, 134.2716],  // West BC
    [33.06804, 2937.186, 56.04153, 178.2496],  // West BC
    [-301.4055, 3783.338, 66.84783, -117.2053],  // West BC
    [848.2012, 2987.074, 42.51862, -109.5408],  // West BC
    [447.2396, 2795.004, 50.85566, -10.29027],  // West BC
    [564.9754, 2278.31, 60.52063, -1.453646],  // West BC
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

fraction.getCount = function() {
    methods.debug('fraction.getCount');
    return count;
};

fraction.createCargoWar = function() {
    methods.notifyWithPictureToFractions2('Борьба за груз', `~r~ВНИМАНИЕ!`, 'Началась война за груз, груз отмечен на карте');
    isCargo = true;

    currentWarPos = [];
    let spawnList = [];
    spawnList.push(methods.getRandomInt(0, fraction.warVehPos.length));
    spawnList.push(methods.getRandomInt(0, fraction.warVehPos.length));
    spawnList.push(methods.getRandomInt(0, fraction.warVehPos.length));

    timer = 600;

    spawnList.forEach((item, i) => {
        let posVeh = new mp.Vector3(fraction.warVehPos[item][0], fraction.warVehPos[item][1], fraction.warVehPos[item][2]);

        currentWarPos.push(posVeh);

        mp.players.forEach(p => {
            if (!user.isLogin(p))
                return;
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

    if (timer === 120) {
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

    if (timer > 120) {
        currentWarPos.forEach(item => {
            mp.players.forEachInRange(item, 15, p => {
                if (!user.isLogin(p))
                    return;

                if (p.health > 0) {
                    user.setHealth(p, p.health - 25);
                }
            });
        });
    }

    currentWarPos.forEach(item => {
        mp.vehicles.forEachInRange(item, 60, v => {
            if (!vehicles.exists(v))
                return;

            if (v.getVariable('box1') !== null && v.getVariable('box1') !== undefined) {
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

    if (weather.getHour() < 23 && weather.getHour() > 4) {
        player.notify('~r~Доступно только с 23 до 4 утра IC времени');
        return;
    }

    let dateTime = new Date();
    if (dateTime.getHours() < 18) {
        player.notify('~r~Доступно только с 18 до 24 ночи ООС времени');
        return;
    }

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

    if (!user.isLeader2(player)) {
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

