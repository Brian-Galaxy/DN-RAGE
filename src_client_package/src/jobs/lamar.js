import methods from '../modules/methods';

import user from '../user';

import jobPoint from '../manager/jobPoint';
import vehicles from "../property/vehicles";
import fraction from "../property/fraction";

let lamar = {};

let _checkpointId = -1;
let isProcess = false;
let price = 0;
let pickupId = 0;

lamar.markers = [
    [788.2786, 1293.704, 360.0327, -132.9073],
    [729.5004, 1299.122, 360.032, -139.1344],
    [219.0299, 1256.261, 225.196, -159.3472],
    [249.1746, 1147.942, 225.196, 18.42905],
    [-2328.833, 1863.397, 182.6805, 61.40778],
    [-1550.64, 2154.501, 53.98185, 151.9236],
    [-1340.771, 2337.776, 37.9356, 44.09138],
    [-1633.75, 2636.606, 2.254246, 1.157098],
    [-1928.596, 2552.07, 2.165231, -23.86739],
    [-2218.167, 2720.567, 2.619408, -27.25981],
    [-2351.303, 2717.612, 1.404935, 10.54202],
    [-2473.969, 2638.689, 2.531411, 3.211791],
    [-2635.117, 2538.252, 2.627851, 57.01103],
    [-2300.224, 2347.665, 0.9722511, 25.38334],
    [-1099.442, 2855.433, 13.73371, -8.590519],
    [-1289.771, 2726.104, 9.331508, 5.716774],
    [-621.4196, 2915.376, 14.83956, 11.41749],
    [-347.4163, 2999.027, 16.80013, -5.617449],
    [-485.6483, 3004.059, 26.92008, -7.931552],
    [-925.862, 2878.284, 23.06909, -104.136],
    [-322.5608, 2744.185, 67.34596, -151.0216],
    [-200.9538, 2581.294, 63.83043, 108.3985],
    [-184.4608, 2199.451, 121.9658, -51.68319],
    [-212.1135, 1901.56, 194.0836, -17.65158],
    [8.061603, 1821.477, 208.153, -27.79884],
    [909.135, 1781.222, 160.6055, 80.76891],
    [883.356, 1832.067, 141.8251, 51.2224],
    [801.2924, 1990.521, 102.5579, -157.76],
    [837.9244, 2084.711, 68.15742, -154.1594],
    [1209.735, 1885.793, 77.44439, -150.5607],
    [1472.666, 1863.877, 107.0384, 176.6263],
    [1417.463, 2060.794, 115.8534, -119.1763],
    [1744.094, 2083.729, 62.41471, -158.9896],
    [1339.182, 2754.6, 51.23727, -134.6336],
    [1442.808, 2804.438, 52.5323, -128.3042],
    [1723.628, 3038.409, 60.33885, -43.60233],
    [2046.949, 3164.025, 44.98334, 56.74911],
    [1901.622, 3005.205, 45.77384, 86.74986],
    [2404.964, 3165.388, 47.64724, 17.86746],
    [2428.785, 3130.166, 47.93001, -69.97028],
    [2381.341, 3035.1, 47.88874, -5.673274],
    [2343.12, 3052.066, 47.88802, -73.1987],
    [2678.269, 3531.863, 51.93076, 101.0446],
    [2622.613, 3467.94, 54.71867, -126.8518],
    [2617.351, 3654.577, 100.7108, 174.2924],
    [2709.006, 3876.051, 43.46852, 2.630836],
    [2669.943, 3924.511, 42.3693, 6.029293],
    [3091.451, 3843.086, 74.85166, -141.6079],
    [2985.487, 3469.528, 71.10059, -112.336],
    [3355.893, 3694.145, 38.50191, 161.1416],
    [3035.418, 4280.368, 60.41352, 154.8484],
    [2968.017, 4728.127, 49.08373, 165.4037],
    [2767.431, 4950.972, 30.0621, 136.1172],
    [3377.311, 4972.393, 32.34451, 118.9272],
    [3708.126, 4425.81, 21.1981, 52.77946],
    [3784.669, 4474.312, 5.739949, 161.8038],
    [3782.624, 4450.098, 4.910291, -37.7503],
    [3344.561, 5480.259, 20.05222, 145.5519],
    [3134.619, 5297.801, 30.78851, -135.4783],
    [3251.287, 5201.424, 19.86279, -145.5],
    [2627.219, 5481.511, 66.4688, -141.6354],
    [2483.249, 5775.969, 69.68807, -147.9589],
    [2245.001, 5982.321, 49.79222, -98.53708],
    [1850.492, 6401.098, 45.81226, 80.17921],
    [1683.578, 6434.861, 31.96161, -146.9437],
    [1594.42, 6557.389, 13.22636, -145.4325],
    [1447.788, 6588.7, 11.88055, 159.9739],
    [1420.284, 6594.096, 12.41886, -0.8619367],
    [1383.524, 6542.065, 16.01047, -46.59949],
    [1408.934, 6352.661, 24.19554, -8.108045],
    [48.49767, 7109.216, 2.822064, -174.9766],
    [73.09971, 7031.086, 12.69759, -95.30156],
    [254.8287, 6928.156, 8.793348, 159.2944],
    [-212.0924, 6547.178, 10.82952, -150.7059],
    [-196.784, 6561.908, 10.82215, 65.87528],
    [-569.5876, 6167.562, 6.288081, 111.5162],
    [-560.4016, 6186.402, 6.737375, -151.3016],
    [-673.7984, 5783.043, 17.07015, -119.6667],
    [-772.0937, 5572.324, 33.22175, -92.97621],
    [-763.6323, 5548.108, 33.22256, -179.8689],
    [-596.4337, 5323.44, 70.03362, 157.5703],
    [-547.6897, 5384.415, 70.04295, 166.4999],
    [-517.2601, 5239.267, 79.95191, 74.63306],
    [-810.7168, 5258.169, 88.00703, 106.7727],
    [-540.2828, 5024.315, 126.6177, 25.28845],
    [-400.2957, 4898.066, 191.6238, -31.90718],
    [-1298.7, 4611.613, 119.3669, -100.1198],
    [-1134.504, 4663.508, 243.0128, -58.90733],
    [-1956.095, 4446.956, 36.01814, -34.02043],
    [-2128.075, 4506.854, 29.01701, -92.8494],
    [-765.3171, 4057.578, 152.2891, -116.7365],
    [-960.7422, 4172.189, 135.24, -138.2368],
    [-509.2093, 4352.555, 67.42554, -132.6737],
    [-217.1692, 4250.008, 32.07029, 75.89645],
    [375.2598, 4390.572, 63.74653, 102.0582],
    [352.732, 4439.284, 62.86222, -49.37626],
    [499.3904, 4268.181, 53.47611, -81.17719],
    [832.3311, 4431.332, 51.89278, -134.6044],
    [1288.021, 4339.417, 38.81464, -135.8381],
    [1366.089, 4380.849, 44.06273, -165.6646],
    [1730.253, 4769.819, 41.58814, -167.4938],
    [1641.756, 4772.111, 41.80426, -176.0338],
    [1640.387, 4839.834, 41.76075, 122.6712],
    [1637.222, 4859.217, 41.75795, 166.3124],
    [1659.911, 4961.578, 42.10412, -177.2039],
    [1793.068, 4910.437, 42.31192, -133.2411],
    [1843.79, 4594.15, 30.40579, -31.2745],
    [1972.447, 5178.682, 47.56669, -67.51839],
    [2514.642, 4951.981, 44.31661, 33.19258],
    [2507.933, 4993.829, 44.6368, 37.63845],
    [2631.492, 4768.112, 33.50302, -2.768564],
    [2571.104, 4698.789, 33.77922, 76.4161],
    [2540.669, 4663.857, 33.81284, 24.50603],
    [2714.843, 4307.141, 46.36026, -23.16775],
    [2143.364, 3892.805, 32.92138, 87.0929],
    [1999.468, 3942.884, 31.4857, 120.0408],
    [1732.689, 3963.941, 31.60807, 114.6486],
    [1559.705, 3796.106, 33.84575, 28.25399],
    [1412.363, 3818.083, 31.92677, 156.8996],
    [1272.302, 3621.821, 32.7823, -66.89346],
    [1354.392, 3619.798, 34.51796, -64.7569],
    [1491.103, 3565.008, 34.94533, 27.74394],
    [1636.11, 3661.165, 34.4527, 54.34898],
    [1680.534, 3408.32, 37.95232, -62.8542],
    [1898.731, 3387.908, 41.62757, -52.93598],
    [1896.335, 3486.483, 43.76552, -36.14838],
    [2033.48, 3452.682, 43.60516, -126.9321],
    [2027.335, 3440.025, 43.81192, 83.7831],
    [2478.353, 3820.734, 40.01583, 99.73766],
    [2413.495, 3745.017, 41.37707, -147.3316],
    [1750.364, 3324.634, 40.83094, -121.0627],
    [1612.887, 3181.79, 40.54782, 78.10912],
    [1211.66, 2729.145, 37.74082, 143.2298],
    [1248.72, 2715.47, 37.74174, -24.55012],
    [979.5964, 2537.065, 55.20864, -4.297702],
    [1087.909, 2545.288, 54.48449, -59.65891],
    [565.4, 2808.638, 41.85749, -126.671],
    [618.1336, 2792.305, 41.89676, 96.63239],
    [535.3057, 2877.27, 42.97771, 127.3223],
    [148.8704, 3654.638, 32.10825, -135.8527],
    [-122.8208, 4612.211, 124.1522, -119.2354],
    [-942.3787, 4610.32, 238.489, 46.33743],
    [-201.7305, 3663.65, 51.473, 0.6330091],
    [181.186, 2719.08, 41.88306, -135.3762],
    [214.5534, 2804.069, 45.39122, -71.67338],
    [756.8608, 2535.128, 72.9508, -92.30256],
    [737.5856, 2512.874, 72.96102, -91.68521],
    [869.3011, 2336.956, 51.40865, -87.2644],
    [868.9075, 2348.093, 51.42866, 90.40859],
];

lamar.start = async function() {
    if (isProcess) {
        mp.game.ui.notifications.show('~r~Вы уже получили задание');
        return;
    }

    if (mp.players.local.dimension > 0) {
        mp.game.ui.notifications.show('~r~В интерьерах данное действие запрещено');
        return;
    }

    if (await user.hasById('grabLamar')) {
        mp.game.ui.notifications.show('~r~Вы недавно уже возили фургон');
        return;
    }

    if (user.hasCache('isSellUser')) {
        mp.game.ui.notifications.show(`~r~Вы уже получили задание на похищение`);
        return;
    }

    if (user.hasCache('isSellCar')) {
        mp.game.ui.notifications.show(`~r~Вы уже получили задание на угон`);
        return;
    }

    if (user.hasCache('isSellMoney')) {
        mp.game.ui.notifications.show(`~r~Вы уже получили задание отмыв денег`);
        return;
    }

    lamar.findRandomPickup();
};

lamar.findRandomPickup = function() {
    try {
        user.setCache('isSellLamar', true);
        isProcess = true;
        pickupId = methods.getRandomInt(0, lamar.markers.length - 1);
        let pos = new mp.Vector3(lamar.markers[pickupId][0], lamar.markers[pickupId][1], lamar.markers[pickupId][2] - 1);
        price = methods.getRandomInt(600, 800);
        _checkpointId = jobPoint.create(pos, true, 3);
        vehicles.spawnLamarCar(-216.03062438964844, -1363.7830810546875, 31.010269165039062, 29.823272705078125, "Speedo4");
        user.setById('grabLamar', true);
    }
    catch (e) {
        methods.debug(e);
    }
};

lamar.finish = async function() {
    try {
        user.removeRep(5);
        isProcess = false;
        vehicles.destroy();
        user.addCryptoMoney(price / 1000, 'Помощь Ламару');

        if (user.getCache('fraction_id2') > 0)
            fraction.addMoney(user.getCache('fraction_id2'), price / 1000, `Доля от фургона Ламара (${user.getCache('name')})`);

        mp.game.ui.notifications.show(`~b~Вы довезли груз и заработали ${methods.cryptoFormat(price / 1000)}`);
        user.setCache('isSellLamar', null);

        if (user.getCache('fraction_id2') > 0)
            fraction.set(user.getCache('fraction_id2'), 'orderLamar', await fraction.get(user.getCache('fraction_id2'), 'orderLamar') + 1);

        setTimeout(function () {
            mp.events.callRemote('server:rent:buy', -1842748181, 0.1, 0);
        }, 5000);
    }
    catch (e) {
        methods.debug(e);
    }
    try {
        jobPoint.delete();
    }
    catch (e) {
        methods.debug(e);
    }
};

mp.events.add("playerEnterCheckpoint", (checkpoint) => {
    try {
        if (!mp.players.local.vehicle)
            return;
        if (!mp.players.local.vehicle.getVariable('lamar'))
            return;
        if (_checkpointId == -1 || _checkpointId == undefined)
            return;
        if (checkpoint.id == _checkpointId)
            lamar.finish();
    }
    catch (e) {
        
    }
});

export default lamar;