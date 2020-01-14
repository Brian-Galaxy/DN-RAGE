import methods from '../modules/methods';
import enums from "../enums";

let object = {};

let loadDist = 300;
let objectList = [];
let iplList = [];
let objectDelList = [];

object.load = function () {
    const start = new Date().getTime();

    //Galaxy
    object.create(1873958683, new mp.Vector3(5.12, 221.3692, 111.1681), new mp.Vector3(1.00179E-05, -5.008956E-06, 69.94978), false, false);
    object.create(-62459927, new mp.Vector3(3.640865, 218.7829, 106.7872), new mp.Vector3(0, 0, 65.09992), false, false);
    object.create(-62459927, new mp.Vector3(3.344031, 217.5904, 106.7872), new mp.Vector3(0, 0, -105.9), false, false);
    object.create(-62459927, new mp.Vector3(2.891121, 216.7459, 106.7872), new mp.Vector3(0, 0, 71.10005), false, false);
    object.create(-62459927, new mp.Vector3(2.662874, 215.7804, 106.7872), new mp.Vector3(0, 0, -108.8998), false, false);
    object.create(-62459927, new mp.Vector3(0.7765616, 210.9651, 106.116), new mp.Vector3(0, 0, 71.10004), false, false);
    object.create(-62459927, new mp.Vector3(1.297037, 212.0501, 106.116), new mp.Vector3(0, 0, -108.8998), false, false);
    object.create(-62459927, new mp.Vector3(1.594715, 213.2014, 106.116), new mp.Vector3(0, 0, 71.10004), false, false);
    object.create(-62459927, new mp.Vector3(2.124307, 214.2887, 106.116), new mp.Vector3(0, 0, -108.8998), false, false);

    //Sheriff LS
    //object.delete(mp.game.joaat("prop_sec_gate_01c"), 375.9481, -1632.531, 27.24899);

    //SAPD Банкомат
    object.create(-870868698, new mp.Vector3(436.36, -988.04, 29.68959), new mp.Vector3(0, 0, 179.8003), false, false);

    //1125
    object.delete(256791144, -1383.038, 476.2039, 105.1749);
    //1127
    object.delete(62686511, -1262.418, 454.9982, 93.71999);
    object.delete(62686511, -1271.905, 446.8963, 93.71999);
    //1128
    object.delete(1875234307, -1065.943, 791.6977, 165.5848);
    object.delete(1875234307, -1062.719, 791.9962, 165.5848);
    object.delete(1875234307, -1037.598, 800.7673, 165.9778);
    //1129
    object.delete(950819638, -1350.465, 565.9646, 129.7136);
    object.delete(950819638, -1351.902, 563.8221, 129.7136);
    //1130
    object.delete(-1258814178, -559.3168, 828.5708, 196.512);
    object.delete(-1258814178, -547.3046, 826.7041, 196.4687);
    //1132
    object.delete(1875234307, -409.4202, 533.9944, 121.2892);
    object.delete(1875234307, -434.9148, 542.8821, 121.0423);
    //1134
    object.delete(1875234307, -167.8585, 432.1422, 110.2436);
    object.delete(1875234307, -176.0664, 424.4883, 110.2434);
    //1135
    object.delete(950819638, 68.90746, 383.5768, 115.517);
    object.delete(950819638, 40.17747, 362.2587, 115.2082);
    //1136
    object.delete(950819638, 184.1877, 578.3342, 184.2537);

    //TheLost
    object.delete(2104026129, 981.7929, -117.7915, 79.14376);

    object.delete(267648181, -72.77863, -682,1697, 34.5284);
    object.delete(3717863426, 25.06954, -664,5161, 30.98253);

    //Trucker
    object.delete(-1340926540, 598.834, -2774.979, 5.058189);
    object.delete(1152297372, 586.0738, -2764.908, 5);
    object.delete(-1654693836, 578.3677, -2759.602, 4.851677);
    object.delete(764282027, 574.5524, -2757.531, 5.05706);
    object.delete(-1098506160, 566.8364, -2752.622, 5.056572);
    object.delete(-531344027, 551.111, -2744.125, 4.988312);
    object.delete(1723816705, 554.5585, -2746.729, 5.049309);
    object.delete(2096990081, 556.3549, -2746.204, 5.049797);
    object.delete(2096990081, 553.9969, -2744.615, 5.049187);
    object.delete(-1098506160, 527.8654, -2730.121, 5.056572);
    object.delete(-1036807324, 532.2209, -2725.449, 5.057899);
    object.delete(-1036807324, 529.6422, -2724.043, 5.057899);
    object.delete(1152297372, 501.6503, -2719.297, 5.059914);
    object.delete(-1654693836, 496.8779, -2718.387, 5.068657);
    object.delete(-1340926540, 489.5278, -2712.863, 5.05648);
    object.delete(-1036807324, 498.0302, -2713.531, 5.057976);
    object.delete(-1036807324, 500.1441, -2714.91, 5.05825);
    object.delete(-531344027, 655.1033, -2780.435, 5.114044);
    object.delete(1152297372, 650.8763, -2775.096, 5.105347);
    object.delete(-531344027, 647.1339, -2769.713, 5.104088);
    object.delete(-531344027, 643.2132, -2764.875, 5.10051);
    object.delete(1152297372, 634.9495, -2754.546, 5.100655);
    object.delete(-328261803, -153.3487, -2416.379, 6.62532);
    object.delete(1152297372, -156.8004, -2416.041, 5.001884);

    const end = new Date().getTime();
    methods.debug('Count Objects Loaded: ' + objectList.length + '  | ' + (end - start) + 'ms');
    object.process();
};

object.create = function (model, pos, rotation, dynamic, placeOnGround) {
    //if (mp.game.streaming.isModelValid(model)) {
    //mp.game.streaming.requestModel(model);
    objectList.push({model: model, pos: pos, rotation: rotation, dynamic: dynamic, placeOnGround: placeOnGround, isCreate: false, handle: -1});
    //}
};

object.createIpl = function (ipl, pos, radius) {
    mp.game.streaming.removeIpl(ipl);
    iplList.push({ipl: ipl, pos: pos, radius: radius, isLoad: false});
};

object.delete = function (model, x, y, z) {
    objectDelList.push({model: model, x: x, y: y, z: z});
};

object.process = function () {

    object.openDoor(9467943, 630,4265, -238.4376, 38.2065);
    object.openDoor(1425919976, 631,9554, -236.3333, 38.20653);
    object.openDoor(2271212864, -447.7092, 6006.717, 31.86633);
    object.openDoor(2271212864, -449.5486, 6008.556, 31.86633);
    object.openDoor(2271212864, -440.9874, 6012.765, 31.86633);
    object.openDoor(2271212864, -442.8268, 6010.925, 31.86633);

    //Army
    object.openDoor(1286392437, 492.2758, -3115.934, 5.162354),
    object.openDoor(1286392437, 476.3276, -3115.925, 5.162354),
    object.openDoor(110411286, 260.6432, 203.2052, 106.4049),
    object.openDoor(110411286, 258.2022, 204.1005, 106.4049),

    //Other
    object.openDoor(1991494706, 523.8579, 167.7482, 100.5352);
    object.openDoor(1196685123, 1730.032, 6412.072, 35.18717);
    object.openDoor(997554217, 1732.362, 6410.917, 35.18717);
    object.openDoor(-868672903, 1699.661, 4930.278, 42.21359);
    object.openDoor(2065277225, 1698.172, 4928.146, 42.21359);
    object.openDoor(1196685123, 1963.917, 3740.075, 32.49369);
    object.openDoor(997554217, 1966.17, 3741.376, 32.49369);
    object.openDoor(-1212951353, 1392.927, 3599.469, 35.13078);
    object.openDoor(-1212951353, 1395.371, 3600.358, 35.13078);
    object.openDoor(1196685123, 2681.292, 3281.427, 55.39108);
    object.openDoor(997554217, 2682.558, 3283.698, 55.39108);
    object.openDoor(-1212951353, 1167.129, 2703.754, 38.30173);
    object.openDoor(1196685123, 545.504, 2672.745, 42.30644);
    object.openDoor(997554217, 542.9252, 2672.406, 42.30644);
    object.openDoor(1196685123, -3240.128, 1003.157, 12.98064);
    object.openDoor(997554217, -3239.905, 1005.749, 12.98064);
    object.openDoor(1196685123, -3038.219, 588.2872, 8.058861);
    object.openDoor(997554217, -3039.012, 590.7643, 8.058861);
    object.openDoor(-1212951353, -2973.535, 390.1414, 15.18735);
    object.openDoor(-868672903, -1823.285, 787.3687, 138.3624);
    object.openDoor(2065277225, -1821.369, 789.1273, 138.3124);
    object.openDoor(1196685123, 375.3528, 323.8015, 103.7163);
    object.openDoor(997554217, 377.8753, 323.1672, 103.7163);
    object.openDoor(1196685123, 2559.201, 384.0875, 108.7729);
    object.openDoor(997554217, 2559.304, 386.6865, 108.7729);
    object.openDoor(2065277225, 1160.925, -326.3612, 69.35503);
    object.openDoor(-868672903, 1158.364, -326.8165, 69.35503);
    object.openDoor(-1212951353, 1141.038, -980.3225, 46.55986);
    object.openDoor(-868672903, -53.96111, -1755.717, 29.57094);
    object.openDoor(2065277225, -51.96669, -1757.387, 29.57094);
    object.openDoor(1196685123, 27.81761, -1349.169, 29.64696);
    object.openDoor(997554217, 30.4186, -1349.169, 29.64696);
    object.openDoor(-868672903, -713.0732, -916.5409, 19.36553);
    object.openDoor(2065277225, -710.4722, -916.5372, 19.36553);
    object.openDoor(-1212951353, -1226.894, -903.1218, 12.47039);
    object.openDoor(-1212951353, -1490.411, -383.8453, 40.30745);
    object.openDoor(-1844444717, 132.5569, -1710.996, 29.44157);
    object.openDoor(-1844444717, -1287.857, -1115.742, 7.140073);
    object.openDoor(-1844444717, 1932.952, 3725.154, 32.9944);
    object.openDoor(-1844444717, 1207.873, -470.0363, 66.358);
    object.openDoor(-1844444717, -29.86917, -148.1571, 57.22648);
    object.openDoor(-1844444717, -280.7851, 6232.782, 31.84548);
    object.openDoor(-1212951353, -289.1752, 6199.112, 31.63704);
    object.openDoor(-1212951353, 1859.894, 3749.786, 33.18181);
    object.openDoor(2631455204, -823.2001, -187.0831, 37.81895);
    object.openDoor(145369505, -822.4442, -188.3924, 37.81895);
    object.openDoor(543652229, -3167.789, 1074.867, 20.92086);
    object.openDoor(543652229, 1321.286, -1650.597, 52.36629);
    object.openDoor(543652229, 321.8085, 178.3599, 103.6782);
    object.openDoor(543652229, -1155.454, -1424.008, 5.046147);
    object.openDoor(97297972, -326.1122, 6075.27, 31.6047);
    object.openDoor(4286093708, -324.2731, 6077.109, 31.6047);
    object.openDoor(97297972, 1698.176, 3751.506, 34.85526);
    object.openDoor(4286093708, 1699.937, 3753.42, 34.85526);
    object.openDoor(97297972, -1114.009, 2689.77, 18.70407);
    object.openDoor(4286093708, -1112.071, 2691.505, 18.70407);
    object.openDoor(97297972, -3164.845, 1081.392, 20.98866);
    object.openDoor(4286093708, -3163.812, 1083.778, 20.98866);
    object.openDoor(97297972, 2570.905, 303.3556, 108.8848);
    object.openDoor(4286093708, 2568.304, 303.3556, 108.8848);
    object.openDoor(97297972, 244.7275, -44.07911, 70.09098);
    object.openDoor(4286093708, 243.8379, -46.52324, 70.09098);
    object.openDoor(97297972, -1313.826, -389.1259, 36.84573);
    object.openDoor(4286093708, -1314.465, -391.6472, 36.84573);
    object.openDoor(97297972, -665.2424, -944.3256, 21.97915);
    object.openDoor(4286093708, -662.6415, -944.3256, 21.97915);
    object.openDoor(97297972, 16.12787, -1114.606, 29.94694);
    object.openDoor(4286093708, 18.572, -1115.495, 29.94694);
    object.openDoor(97297972, 845.3694, -1024.539, 28.34478);
    object.openDoor(4286093708, 842.7685, -1024.539, 28.34478);
    object.openDoor(97297972, 813.1779, -2148.27, 29.76892);
    object.openDoor(4286093708, 810.5769, -2148.27, 29.76892,);
    object.openDoor(3941780146, -111.48, 6463.94, 31.98499);
    object.openDoor(2628496933, -109.65, 6462.11, 31.98499);
    object.openDoor(2253282288, 231.5075, 216.5148, 106.4049);
    object.openDoor(2253282288, 232.6054, 214.1584, 106.4049);

    object.openDoor(993120320, -565.1712, 276.6259, 83.28626);
    object.openDoor(993120320, -561.2866, 293.5044, 87.77851);
    object.openDoor(190770132, 981.1506, -103.2552, 74.99358);
    object.openDoor(3178925983, 127.9552, -1298.503, 29.41962);
    object.openDoor(668467214, 96.09197, -1284.854, 29.43878);
    object.openDoor(4104186511, 431.4056, -1001.169, 26.71261);
    object.openDoor(4104186511, 436.2234, -1001.169, 26.71261);
    object.openDoor(4104186511, 447.486, -1001.171, 26.71261);
    object.openDoor(4104186511, 452.2993, -1001.169, 26.71261);
    object.openDoor(4104186511, 459.5504, -1014.646, 29.10957);
    object.openDoor(4104186511, 459.5504, -1019.699, 29.08874);
    object.openDoor(4007304890, 1991.106, 3053.105, 47.36528);

    //Магазины одежды
    object.openDoor(2372686273, -157.1293, -306.4341, 39.99308);
    object.openDoor(2372686273, -156.439, -304.4294, 39.99308);
    object.openDoor(2372686273, -716.6755, -155.42, 37.67493);
    object.openDoor(2372686273, -715.6154, -157.2561, 37.67493);
    object.openDoor(2372686273, -1454.782, -231.7927, 50.05648);
    object.openDoor(2372686273, -1456.201, -233.3682, 50.05648);
    object.openDoor(1780022985, 617.2458, 2751.022, 42.75777);
    object.openDoor(1780022985, -3167.75, 1055.536, 21.53288);
    object.openDoor(1780022985, -1201.435, -776.8566, 17.99184);
    object.openDoor(1780022985, 127.8201, -211.8274, 55.22751);
    object.openDoor(868499217, 418.5713, -806.3979, 29.64108);
    object.openDoor(3146141106, 418.5713, -808.674, 29.64108);
    object.openDoor(868499217, -818.7643, -1079.545, 11.47806);
    object.openDoor(3146141106, -816.7932, -1078.406, 11.47806);
    object.openDoor(868499217, 82.38156, -1392.752, 29.52609);
    object.openDoor(3146141106, 82.38156, -1390.476, 29.52609);
    object.openDoor(868499217, -1096.661, 2705.446, 19.25781);
    object.openDoor(3146141106, -1094.965, 2706.964, 19.25781);
    object.openDoor(868499217, 1196.825, 2703.221, 38.37257);
    object.openDoor(3146141106, 1199.101, 2703.221, 38.37257);
    object.openDoor(868499217, 1686.983, 4821.741, 42.21305);
    object.openDoor(3146141106, 1687.282, 4819.484, 42.21305);
    object.openDoor(868499217, -0.05637026, 6517.461, 32.02779);
    object.openDoor(3146141106, -1.725257, 6515.914, 32.02779);

    //
    object.openDoor(3472067116, 114.3135, 6623.233, 32.67305);
    object.openDoor(3472067116, 108.8502, 6617.876, 32.67305);
    object.openDoor(1335311341, 105.1518, 6614.655, 32.58521);
    object.openDoor(1544229216, 106.2797, 6620.02, 32.08532);
    object.openDoor(3472067116, 1174.654, 2645.222, 38.63961);
    object.openDoor(3472067116, 1182.306, 2645.232, 38.63961);
    object.openDoor(1335311341, 1187.202, 2644.95, 38.55176);
    object.openDoor(1544229216, 1182.645, 2641.903, 38.05187);
    object.openDoor(270330101, 723.116, -1088.831, 23.23201);
    object.openDoor(1544229216, 735.6767, -1075.977, 22.50473);
    object.openDoor(3744620119, -356.0905, -134.7714, 40.01295);
    object.openDoor(1544229216, -330.4327, -143.393, 39.30275);
    object.openDoor(3744620119, -1145.898, -1991.144, 14.18357);
    object.openDoor(1544229216, -1164.555, -2010.755, 13.47336);
    object.openDoor(4104186511, 484.5642, -1315.574, 30.20331);
    object.openDoor(3630385052, 482.8112, -1311.953, 29.35057);
    object.openDoor(3867468406, -205.6828, -1310.683, 30.29572);

    object.openDoor(2529918806, 1855.685, 3683.93, 34.59282);
    object.openDoor(2793810241, -442.66, 6015.222, 31.86633);
    object.openDoor(2793810241, -444.4985, 6017.06, 31.86633);
    object.openDoor(3649760794, -661.8653, -854.6265, 24.68869);
    object.openDoor(2427807429, -778.3578, 313.5395, 86.14334);
    object.openDoor(911651337, -776.1967, 313.5395, 86.14334);
    object.openDoor(2615085319, -1083.62, -260.4166, 38.1867);
    object.openDoor(3249951925, -1080.974, -259.0203, 38.1867);
    object.openDoor(3954737168, -1042.518, -240.6915, 38.11796);
    object.openDoor(1104171198, -1045.12, -232.004, 39.43794);
    object.openDoor(2869895994, -1046.516, -229.3581, 39.43794);
    object.openDoor(2473190209, -1048.285, -236.8171, 44.171);
    object.openDoor(2473190209, -1047.084, -239.1246, 44.171);
    object.openDoor(1335309163, 258.2093, 204.119, 106.4328);
    object.openDoor(1335309163, 260.6518, 203.2292, 106.4328);

    //Fleeca
    object.openDoor(73386408, 152.0632, -1038.124, 29.71909);
    object.openDoor(3142793112, 149.6298, -1037.231, 29.71915);
    object.openDoor(73386408, 316.3925, -276.4888, 54.5158);
    object.openDoor(3142793112, 313.9587, -275.5965, 54.51586);
    object.openDoor(73386408, -348.8109, -47.26213, 49.38759);
    object.openDoor(3142793112, -351.2598, -46.41221, 49.38765);
    object.openDoor(73386408, -2965.71, 484.2195, 16.0481);
    object.openDoor(3142793112, -2965.821, 481.6297, 16.04816);
    object.openDoor(73386408, 1173.903, 2703.613, 38.43904);
    object.openDoor(3142793112, 1176.495, 2703.613, 38.43911);

    //Close Doors
    object.openDoor(486670049, -107.5373, -9.018098, 70.67085, true);
    object.openDoor(3687927243, -1149.709, -1521.088, 10.78267, true);
    object.openDoor(443058963, 1972.51, 3813.948, 32.433, true);
    object.openDoor(1145337974, 1273.815, -1720.697, 54.92143, true);

    object.openDoor(961976194, 255.2283, 223.976, 102.3932, false);

    //Армия
    object.openDoor(1286392437, 492.2758, -3115.934, 5.162354);
    object.openDoor(1286392437, 476.3276, -3115.925, 5.162354);
    object.openDoor(110411286, 260.6432, 203.2052, 106.4049);
    object.openDoor(110411286, 258.2022, 204.1005, 106.4049);

    let playerPos = mp.players.local.position;

    objectDelList.forEach(function(item) {
        if (methods.distanceToPos(playerPos, new mp.Vector3(item.x, item.y, item.z)) < loadDist)
            mp.game.entity.createModelHide(item.x, item.y, item.z, 2, item.model, true);
    });

    iplList.forEach(item => {
        let dist = methods.distanceToPos(playerPos, item.pos);
        let radius = item.radius;
        if (dist < radius && !item.isLoad) {
            mp.game.streaming.requestIpl(item.ipl);
            item.isLoad = true;
        }
        else if (dist > radius + 50 && item.isLoad) {
            mp.game.streaming.removeIpl(item.ipl);
            item.isLoad = false;
        }
    });

    objectList.forEach(async function(item) {
        /*if (methods.distanceToPos(playerPos, item.pos) < loadDist + 300 && !item.isCreate) {
            try {
                if (!mp.game.streaming.hasModelLoaded(item.model))
                    mp.game.streaming.requestModel(item.model);
            }
            catch (e) {
                methods.debug(`Exeption: objectList.forEach.loadModel`);
                methods.debug(e);
            }
        }*/
        let dist = methods.distanceToPos(playerPos, item.pos);
        if (dist < loadDist && !item.isCreate) {
            try {
                if (mp.game.streaming.hasModelLoaded(item.model)) {

                    item.handle = mp.objects.new(item.model, item.pos,
                        {
                            rotation: item.rotation,
                            alpha: 255,
                            dimension: -1
                        });

                    /*item.handle = mp.game.invoke('0x9A294B2138ABB884', item.model, item.pos.x, item.pos.y, item.pos.z, false, true, false);
                    mp.game.invoke('0x8524A8B0171D5E07', item.handle, item.rotation.x, item.rotation.y, item.rotation.z, 2, true);
                    mp.game.invoke('0x428CA6DBD1094446', item.handle, true);*/
                    //mp.game.invoke('0xE532F5D78798DAAB', item.model);
                    methods.debug(`Execute: objectList.forEach.create`);
                    item.isCreate = true;
                }
                else if(item.didRequest !== true) {
                    item.didRequest = true;
                    mp.game.streaming.requestModel(item.model);
                }
            }
            catch (e) {
                methods.debug(`Exeption: objectList.forEach.create`);
                methods.debug(e);
            }
        }
        else if (dist > loadDist + 50 && item.isCreate) {
            try {
                //mp.game.object.object.openDoor(item.handle);
                if (mp.objects.exists(item.handle)) {
                    item.handle.destroy();
                    item.handle = -1;
                    item.isCreate = false;
                }

                if(item.didRequest === true) {
                    item.didRequest = false;
                    mp.game.streaming.setModelAsNoLongerNeeded(item.model);
                }
            }
            catch (e) {
                methods.debug(`Exeption: objectList.forEach.destroy`);
                methods.debug(e);
            }
        }
    });

    setTimeout(object.process, 5000);
};

object.openDoor = function (hash, x, y, z, isClose) {
    if (isClose == undefined)
        isClose = false;
    if (methods.distanceToPos(mp.players.local.position, new mp.Vector3(x, y, z)) < loadDist) {
        mp.game.object.doorControl(hash, x, y, z, isClose, 0.0, 50.0, 0);
        if (isClose == true)
            mp.game.invoke(methods.FREEZE_ENTITY_POSITION, mp.game.object.getClosestObjectOfType(x, y, z, 1, hash, false, false, false));
    }
};

export default object;