import methods from '../modules/methods';

let object = {};

let loadDist = 300;
let objectList = [];
let iplList = [];
let objectDelList = [];

object.load = function () {
    const start = new Date().getTime();

    //Dock Mapping
    object.create(1524671283, new mp.Vector3(-426.3395, -2638.948, 7.62), new mp.Vector3(0, 0, 28.9998), false, false);
    object.create(1576342596, new mp.Vector3(-428.1002, -2640.67, 7.5), new mp.Vector3(0, 0, 50.99985), false, false);
    object.create(1935071027, new mp.Vector3(-424.359, -2636.884, 7.5), new mp.Vector3(0, 0, 44.90015), false, false);
    object.create(300547451, new mp.Vector3(-420.5733, -2640.223, 8.26), new mp.Vector3(0, 0, -38.99992), false, false);
    object.create(153748523, new mp.Vector3(-422.7863, -2642.506, 7.51), new mp.Vector3(0, 0, 133.0002), false, false);
    object.create(-188983024, new mp.Vector3(-424.9482, -2644.421, 7.5), new mp.Vector3(0, 0, -44.00007), false, false);
    object.create(1524671283, new mp.Vector3(-431.6065, -2643.968, 7.62), new mp.Vector3(0, 0, 50.99967), false, false);
    object.create(-188983024, new mp.Vector3(-426.1255, -2645.613, 7.5), new mp.Vector3(0, 0, -47.00003), false, false);
    object.create(-188983024, new mp.Vector3(-427.364, -2646.901, 7.5), new mp.Vector3(0, 0, -43.40001), false, false);
    object.create(1524671283, new mp.Vector3(-433.2048, -2645.564, 7.63), new mp.Vector3(0, 0, 37.99947), false, false);
    object.create(300547451, new mp.Vector3(-399.1165, -2639.074, 5.76), new mp.Vector3(0, 0, 42.00002), false, false);
    object.create(1524671283, new mp.Vector3(-401.9056, -2636.135, 5.13), new mp.Vector3(0, 0, 53.99917), false, false);
    object.create(153748523, new mp.Vector3(-400.4529, -2637.686, 5.000217), new mp.Vector3(0, 0, 127.8999), false, false);
    object.create(1935071027, new mp.Vector3(-403.6677, -2635.208, 5.00835), new mp.Vector3(0, 0, 63.89999), false, false);
    object.create(-188983024, new mp.Vector3(-402.352, -2643.216, 5.000216), new mp.Vector3(0, 0, -132.4995), false, false);
    object.create(-188983024, new mp.Vector3(-404.0558, -2644.229, 5.000216), new mp.Vector3(0, 0, -60.00001), false, false);
    object.create(1576342596, new mp.Vector3(-405.3622, -2645.786, 5.000217), new mp.Vector3(0, 0, 43.79976), false, false);
    object.create(-1286880215, new mp.Vector3(-406.5015, -2650.262, 5.000217), new mp.Vector3(0, 0, -134.6452), false, false);
    object.create(-1286880215, new mp.Vector3(-409.755, -2653.563, 5.000217), new mp.Vector3(0, 0, -134.6452), false, false);
    object.create(-1286880215, new mp.Vector3(-413.0188, -2656.853, 5.000217), new mp.Vector3(0, 0, -135.2446), false, false);
    object.create(-1286880215, new mp.Vector3(-397.9273, -2641.651, 5.000217), new mp.Vector3(0, 0, -135.8452), false, false);

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

    //Большой замок на горе
    object.delete(3341997491,-1788.89, 409.9336, 112.3862);

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

    //Binco
    //object.delete(868499217, -818.7643, -1079.545, 11.47806);
    //object.delete(3146141106, -816.7932, -1078.406, 11.47806);

    // Основной маппинг малого склада Stock

    object.create(-1134789989, new mp.Vector3(1103.438, -3102.897, -39.7), new mp.Vector3(0, 0, 0), false, false, 75);
    object.create(-1719363059, new mp.Vector3(1104.908, -3102.896, -39.62), new mp.Vector3(0, 0, 0), false, false, 76);
    object.create(-1719363059, new mp.Vector3(1103.28, -3102.9, -38.73), new mp.Vector3(1.001786E-05, 5.008955E-06, -90.04958), false, false, 77);
    object.create(-1134789989, new mp.Vector3(1104.8, -3102.88, -38.82), new mp.Vector3(1.001782E-05, 5.008955E-06, -179.9256), false, false, 78);
    object.create(-1134789989, new mp.Vector3(1103.44, -3102.87, -37.93), new mp.Vector3(0, 0, 0), false, false, 79);
    object.create(-1719363059, new mp.Vector3(1104.613, -3102.9, -37.84), new mp.Vector3(0, 0, 0), false, false, 80);
    object.create(1089807209, new mp.Vector3(1102.14, -3103.26, -39.26), new mp.Vector3(0, -5.008956E-06, -180), false, false, 81, 1);

    object.create(-1659828682, new mp.Vector3(1105.48, -3101.43, -38.84), new mp.Vector3(-1.384231E-12, -5.008955E-06, -89.99998), false, false);
    object.create(-1653844078, new mp.Vector3(1104.01, -3103, -39.99993), new mp.Vector3(0, 0, 0), false, false);
    object.create(347760077, new mp.Vector3(1104.103, -3103.102, -38.13803), new mp.Vector3(0, 0, -67.99998), false, false);
    object.create(871161084, new mp.Vector3(1104.248, -3103.024, -39.91068), new mp.Vector3(0, 0, -136.999), false, false);
    object.create(-2004926724, new mp.Vector3(1103.994, -3102.783, -39.03558), new mp.Vector3(0, 0, -179.4991), false, false);
    object.create(-1659670616, new mp.Vector3(1102.872, -3103.059, -39.91068), new mp.Vector3(0, 0, -10.99999), false, false);
    object.create(647318656, new mp.Vector3(1104.209, -3103.114, -39.03558), new mp.Vector3(0, 0, -37.99995), false, false);
    object.create(510965455, new mp.Vector3(1103.996, -3102.932, -39.91068), new mp.Vector3(0, 0, -23.99994), false, false);
    object.create(510965455, new mp.Vector3(1103.76, -3103.087, -39.03558), new mp.Vector3(0, 0, 17.00003), false, false);
    object.create(2086814937, new mp.Vector3(1102.816, -3102.939, -39.03558), new mp.Vector3(0, 0, -21.99993), false, false);

    object.delete(-200982847, 1087.956, -3102.626, -40.00024);
    object.delete(-1069975900, 1087.405, -3102.546, -39.59656);
    object.delete(-1738103333, 1087.467, -3103.16, -39.55749);
    object.delete(171954244, 1087.416, -3103.19, -38.90747);
    object.delete(-288941741, 1087.969, -3103.318, -39.76682);
    object.delete(2057223314, 1087.786, -3100.579, -39.11903);
    object.delete(176137803, 1087.46, -3101.968, -39.19104);
    object.delete(-339081347, 1087.49, -3101.738, -39.18203);
    object.delete(740404217, 1105.251, -3101.934, -39.77567);
    object.delete(-1069975900, 1105.251, -3102.386, -39.59656);

    object.delete(572449021, 1104.012, -3103.057, -39.98313);
    object.delete(572449021, 1101.108, -3103.027, -39.99387);
    object.delete(774227908, 1105.354, -3101.44, -39.06805);

// Основной маппинг среднего склада Stock

    object.create(1089807209, new mp.Vector3(1048.12, -3107.83, -39.32492), new mp.Vector3(-4.46236E-05, 2.231179E-05, 89.99999), false, false, 75, 1);
    object.create(1089807209, new mp.Vector3(1048.116, -3106.941, -39.32492), new mp.Vector3(-4.46236E-05, 2.231179E-05, 89.99999), false, false, 76, 2);
    object.create(-1719363059, new mp.Vector3(1050.986, -3111.007, -39.615), new mp.Vector3(0, 0, 0), false, false, 77);
    object.create(-1719363059, new mp.Vector3(1049.357, -3111, -39.615), new mp.Vector3(0, 0, 90.69976), false, false, 78);
    object.create(-1134789989, new mp.Vector3(1049.751, -3111.112, -38.82), new mp.Vector3(0, 0, -88.49972), false, false, 79);
    object.create(-1134789989, new mp.Vector3(1050.877, -3111.005, -38.82), new mp.Vector3(0, 0, -0.09966588), false, false, 80);
    object.create(-1719363059, new mp.Vector3(1049.666, -3110.977, -37.845), new mp.Vector3(0, 0, 0), false, false, 81);
    object.create(-1719363059, new mp.Vector3(1050.97, -3111.026, -37.845), new mp.Vector3(0, 0, 90.69976), false, false, 82);
    object.create(-1134789989, new mp.Vector3(1048.328, -3110.107, -39.705), new mp.Vector3(0, 0, -88.49972), false, false, 83);
    object.create(-1134789989, new mp.Vector3(1048.322, -3108.908, -37.93), new mp.Vector3(0, 0, -88.49972), false, false, 84);
    object.create(-1134789989, new mp.Vector3(1048.24, -3110.31, -37.93), new mp.Vector3(0, 0, -179.4995), false, false, 85);
    object.create(-1134789989, new mp.Vector3(1048.33, -3108.893, -39.705), new mp.Vector3(0, 0, 88.50024), false, false, 86);
    object.create(-1719363059, new mp.Vector3(1048.359, -3108.869, -38.735), new mp.Vector3(0, 0, -0.3002918), false, false, 87);
    object.create(-1719363059, new mp.Vector3(1048.338, -3110.121, -38.735), new mp.Vector3(0, 0, 89.69965), false, false, 88);

    object.create(-1659828682, new mp.Vector3(1073.51, -3099.978, -38.7), new mp.Vector3(-2.564906E-12, -5.008952E-06, -89.99995), false, false);
    object.create(-1683917950, new mp.Vector3(1048.07, -3094.63, -36.28839), new mp.Vector3(2.564906E-12, -5.008952E-06, 89.99995), false, false);
    object.create(-1683917950, new mp.Vector3(1047.83, -3094.64, -36.3), new mp.Vector3(3.732026E-12, -5.008951E-06, 89.99993), false, false);
    object.create(-1653844078, new mp.Vector3(1050.2, -3111.12, -39.99993), new mp.Vector3(0, 0, 0), false, false);
    object.create(-1653844078, new mp.Vector3(1048.22, -3109.628, -39.99993), new mp.Vector3(-5.97114E-13, -5.008956E-06, -89.99999), false, false);
    object.create(2147289143, new mp.Vector3(1056.401, -3111.64, -35.39232), new mp.Vector3(0, 0, -177.6021), false, false);
    object.create(479783305, new mp.Vector3(1050.09, -3108.62, -34.56526), new mp.Vector3(1.001791E-05, 2.23118E-05, -5.008959E-06), false, false);
    object.create(347760077, new mp.Vector3(1048.284, -3109.535, -39.91675), new mp.Vector3(0, 0, 6.999997), false, false);
    object.create(871161084, new mp.Vector3(1049.167, -3110.846, -39.03558), new mp.Vector3(0, 0, -177.7994), false, false);
    object.create(-2004926724, new mp.Vector3(1048.44, -3109.493, -39.03558), new mp.Vector3(0, 0, 88.99989), false, false);
    object.create(-1659670616, new mp.Vector3(1050.286, -3111.129, -39.03558), new mp.Vector3(0, 0, -21.99999), false, false);
    object.create(510965455, new mp.Vector3(1048.186, -3110.709, -39.03558), new mp.Vector3(0, 0, -53.99994), false, false);
    object.create(510965455, new mp.Vector3(1049.115, -3111.279, -39.03558), new mp.Vector3(0, 0, -103.9998), false, false);
    object.create(1914482766, new mp.Vector3(1050.154, -3110.992, -39.03558), new mp.Vector3(0, 0, -50.99995), false, false);
    object.create(-1987404681, new mp.Vector3(1050.337, -3110.965, -38.1441), new mp.Vector3(0, 0, -129.9999), false, false);
    object.create(-1458189440, new mp.Vector3(1049.988, -3111.124, -39.91675), new mp.Vector3(0, 0, -17.99999), false, false);
    object.create(-1693896857, new mp.Vector3(1050.128, -3111.179, -39.91675), new mp.Vector3(0, 0, 0), false, false);
    object.create(-2067594533, new mp.Vector3(1050.198, -3111.02, -39.91675), new mp.Vector3(0, 0, 2.999955), false, false);
    object.create(-1469896790, new mp.Vector3(1050.307, -3111.279, -39.91675), new mp.Vector3(0, 0, -12.99999), false, false);
    object.create(123488498, new mp.Vector3(1050.486, -3111.2, -39.9), new mp.Vector3(0, 0, -60.99997), false, false);
    object.create(-1960568157, new mp.Vector3(1049.108, -3111.084, -38.13), new mp.Vector3(0, 0, -44.99998), false, false);
    object.create(-1119158544, new mp.Vector3(1048.389, -3109.669, -38.13), new mp.Vector3(0, 0, -40.99998), false, false);

    object.delete(2040839490, 1048.537, -3101.301, -39.47729);
    object.delete(1623033797, 1048.604, -3094.659, -39.97461);
    object.delete(-13720938, 1047.957, -3098.591, -40);
    object.delete(740895081, 1047.908, -3104.158, -39.01764);
    object.delete(1343261146, 1049.849, -3111.289, -39.08353);
    object.delete(1343261146, 1073.177, -3107.978, -39.08353);
    object.delete(-1853453107, 1070.802, -3109.343, -40);
    object.delete(895484294, 1071.861, -3096.517, -40);
    object.delete(2057223314, 1048.376, -3100.055, -39.11857);
    object.delete(176137803, 1048.41, -3101.416, -39.19058);
    object.delete(-339081347, 1048.074, -3101.168, -39.18158);
    object.delete(-2096130282, 1047.932, -3105.301, -39.09033);

    object.delete(3694551461, 1051.075, -3109.071, -40);
    object.delete(1350712180, 1049.091, -3108.253, -39.21489);
    object.delete(3529086555, 1047.978, -3094.091, -37.23187);

// Основной маппинг большого склада Stock
    object.create(-1134789989, new mp.Vector3(1017.13, -3112.86, -37.93), new mp.Vector3(0, 0, 0), false, false, 75);
    object.create(-1134789989, new mp.Vector3(1017.02, -3112.84, -39.7), new mp.Vector3(1.001782E-05, 5.008956E-06, -179.9236), false, false, 76);
    object.create(-1134789989, new mp.Vector3(1017.069, -3112.93, -38.82), new mp.Vector3(0, 0, -87.99982), false, false, 77);
    object.create(-1719363059, new mp.Vector3(1015.624, -3112.88, -39.61), new mp.Vector3(0, 0, 88.89981), false, false, 78);
    object.create(-1719363059, new mp.Vector3(1015.474, -3112.884, -37.84405), new mp.Vector3(1.001786E-05, 5.008956E-06, -91.10022), false, false, 79);
    object.create(-1719363059, new mp.Vector3(1015.85, -3112.89, -38.73), new mp.Vector3(1.001789E-05, -5.008957E-06, -0.02585409), false, false, 80);
    object.create(1089807209, new mp.Vector3(1000.29, -3113.02, -39.26), new mp.Vector3(0, -5.008956E-06, -180), false, false, 81, 1);
    object.create(1089807209, new mp.Vector3(997.3, -3113.02, -39.26), new mp.Vector3(0, -5.008956E-06, -180), false, false, 82, 2);
    object.create(1089807209, new mp.Vector3(998.8, -3113.02, -39.26), new mp.Vector3(0, -5.008956E-06, -180), false, false, 83, 3);
    object.create(-1719363059, new mp.Vector3(1022.705, -3112.87, -39.61), new mp.Vector3(0, 0, 0), false, false, 84);
    object.create(-1719363059, new mp.Vector3(1021.6, -3112.88, -39.61), new mp.Vector3(0, 0, 88.89981), false, false, 85);
    object.create(-1134789989, new mp.Vector3(1022.32, -3112.85, -38.82), new mp.Vector3(0, 0, 0), false, false, 86);
    object.create(-1134789989, new mp.Vector3(1020.97, -3112.93, -38.81), new mp.Vector3(1.001788E-05, 5.008954E-06, -89.29992), false, false, 87);
    object.create(-1134789989, new mp.Vector3(1021.549, -3112.87, -37.92), new mp.Vector3(0, 0, -179.3004), false, false, 88);
    object.create(-1719363059, new mp.Vector3(1022.72, -3112.87, -37.84), new mp.Vector3(1.001785E-05, 5.008956E-06, -91.10022), false, false, 89);
    object.create(-1134789989, new mp.Vector3(1002.95, -3112.97, -39.7), new mp.Vector3(1.001789E-05, -5.008956E-06, 90.14932), false, false, 90);
    object.create(-1719363059, new mp.Vector3(1004.311, -3112.88, -39.61), new mp.Vector3(1.00179E-05, -5.008954E-06, 90.02467), false, false, 91);
    object.create(-1134789989, new mp.Vector3(1004.34, -3112.85, -38.82), new mp.Vector3(1.001784E-05, -5.008956E-06, -179.8241), false, false, 92);
    object.create(-1719363059, new mp.Vector3(1002.91, -3112.88, -38.73), new mp.Vector3(1.00179E-05, 5.008956E-06, 90.09966), false, false, 93);
    object.create(-1134789989, new mp.Vector3(1004.56, -3112.84, -37.93), new mp.Vector3(0, 0, 0), false, false, 94);
    object.create(-1719363059, new mp.Vector3(1003.429, -3112.88, -37.84), new mp.Vector3(1.001791E-05, 5.008956E-06, -179.9513), false, false, 95);

    object.create(-1659828682, new mp.Vector3(1028.12, -3098.818, -38.52463), new mp.Vector3(0, 0, -90.39985), false, false);
    object.create(347760077, new mp.Vector3(1020.728, -3112.954, -38.14285), new mp.Vector3(0, 0, 50.99998), false, false);
    object.create(871161084, new mp.Vector3(1003.608, -3112.99, -39.03433), new mp.Vector3(0, 0, -139.9998), false, false);
    object.create(510965455, new mp.Vector3(1021.668, -3112.962, -39.03433), new mp.Vector3(0, 0, 148.9997), false, false);
    object.create(1611172902, new mp.Vector3(1022.93, -3113.083, -39.03433), new mp.Vector3(0, 0, 29.99998), false, false);
    object.create(1142765633, new mp.Vector3(1004.927, -3112.966, -39.03433), new mp.Vector3(0, 0, 24.99992), false, false);
    object.create(845878493, new mp.Vector3(1005.041, -3112.892, -39.03433), new mp.Vector3(0, 0, 0), false, false);
    object.create(-1653844078, new mp.Vector3(1016.28, -3112.98, -39.99989), new mp.Vector3(0, 0, 0), false, false);
    object.create(347760077, new mp.Vector3(1003.629, -3113.037, -39.9155), new mp.Vector3(0, 0, -30.99997), false, false);
    object.create(347760077, new mp.Vector3(1004.998, -3113.089, -39.9155), new mp.Vector3(0, 0, -161.9997), false, false);
    object.create(347760077, new mp.Vector3(1016.277, -3113.043, -38.14405), new mp.Vector3(0, 0, -142.9996), false, false);
    object.create(-2004926724, new mp.Vector3(1015.198, -3112.973, -39.03553), new mp.Vector3(0, 0, 161.0007), false, false);
    object.create(-1659670616, new mp.Vector3(1016.443, -3113.014, -39.03553), new mp.Vector3(0, 0, -141.9995), false, false);
    object.create(240285960, new mp.Vector3(1015.972, -3113.005, -38.14405), new mp.Vector3(0, 0, -16.99995), false, false);
    object.create(-1951015928, new mp.Vector3(1016.093, -3112.986, -39.9167), new mp.Vector3(0, 0, 25.99999), false, false);
    object.create(-1951015928, new mp.Vector3(1016.302, -3112.981, -39.9167), new mp.Vector3(0, 0, -126.9995), false, false);
    object.create(845878493, new mp.Vector3(1021.48, -3112.859, -39.03433), new mp.Vector3(0, 0, -20.99998), false, false);
    object.create(-1987404681, new mp.Vector3(1022.173, -3113.059, -39.9155), new mp.Vector3(0, 0, -164.9998), false, false);
    object.create(-1458189440, new mp.Vector3(1015.143, -3112.979, -39.9167), new mp.Vector3(0, 0, -15.99995), false, false);
    object.create(-1469896790, new mp.Vector3(1003.389, -3112.796, -39.03433), new mp.Vector3(0, 0, -44.99998), false, false);

    object.delete(1343261146, 996.3063, -3112.344, -39.11191);
    object.delete(-509973344, 992.0818, -3102.724, -38.61679);
    object.delete(1268458364, 994.6763, -3099.17, -39.94958);
    object.delete(176137803, 995.4335, -3100.887, -39.19104);
    object.delete(895484294, 999.1875, -3093.501, -39.99869);
    object.delete(-130812911, 997.8042, -3089.944, -40.00491);
    object.delete(-1738103333, 999.114, -3090.1, -39.56229);
    object.delete(3980350, 998.4703, -3089.788, -38.97379);
    object.delete(2040839490, 1000.234, -3089.944, -39.47586);
    object.delete(1343261146, 996.5288, -3095.898, -39.11191);
    object.delete(38230152, 996.7981, -3097.769, -40.00165);
    object.delete(548760764, 996.5059, -3094.706, -37.40491);
    object.delete(2040839490, 996.5199, -3101.169, -39.47586);
    object.delete(-13720938, 996.5199, -3100.583, -40.00784);
    object.delete(548760764, 1028.243, -3098.224, -36.18852);
    object.delete(-1999230727, 1022.777, -3112.889, -39.04367);
    object.delete(1951313592, 1022.436, -3112.948, -39.7678);
    object.delete(-130812911, 1019.859, -3112.965, -40.00491);
    object.delete(1343261146, 1017.649, -3113.142, -39.11191);
    object.delete(1974409830, 1002.726, -3112.927, -38.84708);
    object.delete(-1890319650, 1002.996, -3113.119, -39.04764);
    object.delete(1005516815, 1004.502, -3112.933, -39.82828);
    object.delete(-1321159957, 1004.091, -3113.066, -39.76736);
    object.delete(-832601639, 1004.868, -3113.002, -39.81144);
    object.delete(-1321159957, 999.9357, -3113.013, -38.00833);
    object.delete(-1134789989, 999.5406, -3112.927, -39.70865);
    object.delete(456071379, 998.1865, -3112.855, -39.08329);
    object.delete(1974409830, 998.2366, -3112.927, -37.9556);
    object.delete(-1853453107, 1022.348, -3090.632, -40.00271);
    object.delete(1298403575, 1024.832, -3089.79, -39.56229);
    object.delete(-1738103333, 1024.25, -3089.946, -39.56229);
    object.delete(-742198632, 993.6818, -3095.474, -40.00269);

    object.delete(572449021, 999.0031, -3113.013, -39.99869);
    object.delete(1350712180, 1001.339, -3111.927, -39.22092);
    object.delete(1350712180, 1020.715, -3090.816, -39.22092);

    // Удалённые объекты у Складов
    object.delete(1524671283, 161.2158, -2927.26, 5.12748); // Stock 266
    object.delete(897494494, 160.9235, -2913.135, 5.002159); // Stock 267
    object.delete(-2022916910, 160.9624, -2879.667, 5.008682); // Stock 268
    object.delete(-2022916910, 161.1873, -2878.103, 6.305614); // Stock 268
    object.delete(307713837, 161.3963, -2878.06, 5.107948); // Stock 268
    object.delete(1165008631, 159.0375, -2879.869, 6.243019); // Stock 268
    object.delete(-191836989, 162.8135, -2876.947, 4.99305); // Stock 268
    object.delete(307713837, 161.0776, -2862.33, 5.102982); // Stock 269
    object.delete(-2022916910, 161.0839, -2862.477, 6.300652); // Stock 269
    object.delete(51866064, 161.1701, -2860.711, 5.0019); // Stock 269
    object.delete(-2022916910, 161.0767, -3055.063, 4.984848); // Stock 251
    object.delete(-2022916910, 161.0988, -3058.411, 4.986435); // Stock 251
    object.delete(-58485588, 159.7639, -3147.5, 5.005356); // Stock 249
    object.delete(1165008631, 157.0757, -3253.88, 6.03376); // Stock 246
    object.delete(531440379, 157.3098, -3255.458, 6.032524); // Stock 246
    object.delete(1280771616, 160.7615, -3272.31, 4.987); // Stock 245
    object.delete(1165008631, 157.0759, -3290.441, 6.033428); // Stock 244
    object.delete(531440379, 157.3097, -3292.02, 6.031948); // Stock 244
    object.delete(307713837, 157.6941, -3308.312, 5.11248); // Stock 243
    object.delete(-2022916910, 157.6514, -3308.168, 6.31654); // Stock 243
    object.delete(1165008631, 156.6977, -3306.511, 5.025047); // Stock 243
    object.delete(1923262137, 1050.771, -2414.525, 28.63155); // Stock 18
    object.delete(856312526, 1049.77, -2421.132, 29.30719); // Stock 18
    object.delete(897494494, 1049.146, -2421.495, 29.32722); // Stock 18
    object.delete(218085040, 1049.64, -2423.154, 29.32181); // Stock 18
    object.delete(666561306, 1049.425, -2425.197, 29.3078); // Stock 18
    object.delete(-1187286639, 1048.937, -2429.877, 29.30898); // Stock 18
    object.delete(-58485588, 1048.94, -2431.2, 29.30988); // Stock 18
    object.delete(-994492850, 1049.549, -2429.717, 29.31932); // Stock 18
    object.delete(-994492850, 1049.826, -2426.361, 29.31694); // Stock 18
    object.delete(-2022916910, 1092.043, -2233.912, 29.33582); // Stock 32
    object.delete(1165008631, 1091.902, -2233.757, 30.48395); // Stock 32
    object.delete(1524671283, 1092.899, -2231.866, 29.43689); // Stock 32
    object.delete(-1894042373, 1094.485, -2231.171, 29.27421); // Stock 32
    object.delete(741629727, 1009.621, -2054.605, 30.89452); // Stock 48
    object.delete(1679057497, 1010.029, -2052.875, 30.53959); // Stock 48
    object.delete(-1738103333, 925.1641, -1584.828, 29.77762); // Stock 97
    object.delete(1576342596, 926.061, -1586.127, 29.2942); // Stock 97
    object.delete(666561306, 928.165, -1586.391, 29.27202); // Stock 97
    object.delete(-58485588, 930.3281, -1586.393, 29.27154); // Stock 97
    object.delete(300547451, 923.9932, -1586.04, 30.08851); // Stock 97
    object.delete(-1738103333, 922.3282, -1586.018, 29.78518); // Stock 97
    object.delete(-1738103333, 1001.168, -1537.387, 30.2801); // Stock 109
    object.delete(1935071027, 1002.636, -1537.372, 29.84152); // Stock 109
    object.delete(300547451, 1000.79, -1539.148, 30.60371); // Stock 109
    object.delete(1576342596, 998.3571, -1536.667, 29.8381); // Stock 109
    object.delete(-1738103333, 1003.327, -1539.918, 30.28962); // Stock 109
    object.delete(-1738103333, 999.7537, -1536.195, 30.28068); // Stock 109
    object.delete(830159341, 1001.662, -1535.896, 30.68001); // Stock 109
    object.delete(-2022916910, 729.2911, -1190.415, 23.28482); // Stock 122
    object.delete(1524671283, 730.9893, -1190.664, 23.42249); // Stock 122
    object.delete(1165008631, 729.4171, -1190.242, 24.4309); // Stock 122
    object.delete(-2022916910, 734.1782, -1190.164, 23.27924); // Stock 123
    object.delete(1165008631, 734.8708, -1190.21, 24.4246); // Stock 123
    object.delete(1165008631, 736.4197, -1191.388, 23.27353); // Stock 123
    object.delete(-2022916910, 737.3339, -1190.252, 24.56714); // Stock 123
    object.delete(307713837, 737.4841, -1190.272, 23.36158); // Stock 123
    object.delete(-1853453107, -256.2062, 304.7977, 91.10983); // Stock 342
    object.delete(-1853453107, -258.7368, 304.2122, 91.07887); // Stock 342
    object.delete(740895081, -258.3695, 301.9275, 91.12428,); // Stock 342
    object.delete(143291855, -250.0353, 304.7988, 91.44221); // Stock 344
    object.delete(218085040, 235.8152, 100.023, 92.85185); // Stock 388
    object.delete(1524671283, 493.4144, -585.9753, 23.82936); // Stock 173
    object.delete(-191836989, 494.1568, -578.1782, 23.59377);  // Stock 175
    object.delete(1165008631, 494.0229, -576.7005, 23.58439); // Stock 175
    object.delete(-2022916910, 494.5356, -575.2502, 23.59749); // Stock 175
    object.delete(-188983024, -325.9549, -2464.881, 6.295746); // Stock 230
    object.delete(-188983024, -324.8839, -2466.632, 6.296318); // Stock 230
    object.delete(-188983024, -279.0764, -2468.278, 6.295738); // Stock 236
    object.delete(-188983024, -280.1474, -2466.528, 6.296303); // Stock 236
    object.delete(4088277111, -558.9433, 307.343, 82.29415); // Stock 348
    object.delete(4088277111, -558.6872, 310.0255, 82.25837); // Stock 348
    object.delete(3945129724, -557.6844, 307.3023, 82.29713); // Stock 348
    object.delete(3945129724, -557.4282, 309.9846, 82.25019); // Stock 348
    object.delete(143291855, -558.3568, 311.8253, 82.5661); // Stock 348
    object.delete(1948359883, -557.1702, 311.9332, 82.23843); // Stock 348
    object.delete(897494494, -555.8669, 310.4435, 82.21516); // Stock 348

    object.delete(969847031, -1057.767, -237.484, 43.021); // InvaderDelete
    object.delete(969847031, -1063.842, -240.6464, 43.021); // InvaderDelete

    object.delete(267648181, -72.77863, -682.169, 34.5284); // UnionDepository
    //object.delete(3717863426, 25.06954, -664.5161, 30.98253); // UnionDepository

    const end = new Date().getTime();
    methods.debug('Count Objects Loaded: ' + objectList.length + '  | ' + (end - start) + 'ms');
    object.process();
};

object.create = function (model, pos, rotation, dynamic, placeOnGround, invType = 0, safe = 0) {
    //if (mp.game.streaming.isModelValid(model)) {
    //mp.game.streaming.requestModel(model);
    objectList.push({model: model, pos: pos, rotation: rotation, dynamic: dynamic, placeOnGround: placeOnGround, isCreate: false, handle: -1, invType: invType, safe: safe});
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

    object.openDoor(9467943, 630,4265, -238.4376);
    object.openDoor(1425919976, 631,9554, -236.3333);
    object.openDoor(2271212864, -447.7092, 6006.717, 31.86633);
    object.openDoor(2271212864, -449.5486, 6008.556, 31.86633);
    object.openDoor(2271212864, -440.9874, 6012.765, 31.86633);
    object.openDoor(2271212864, -442.8268, 6010.925, 31.86633);

    //Army
    object.openDoor(1286392437, 492.2758, -3115.934, 5.162354);
    object.openDoor(1286392437, 476.3276, -3115.925, 5.162354);
    object.openDoor(110411286, 260.6432, 203.2052, 106.4049);
    object.openDoor(110411286, 258.2022, 204.1005, 106.4049);

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
        try {
            if (methods.distanceToPos(playerPos, new mp.Vector3(item.x, item.y, item.z)) < loadDist)
                mp.game.entity.createModelHide(item.x, item.y, item.z, 2, item.model, true);
        }
        catch (e) {
            methods.debug(e);
        }
    });

    iplList.forEach(item => {
        try {
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
        }
        catch (e) {
            methods.debug(e);
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

                    if (item.invType > 0)
                        item.handle.invType = item.invType;
                    if (item.safe > 0)
                        item.handle.safe = item.safe;

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
    try {
        if (isClose == undefined)
            isClose = false;
        if (methods.distanceToPos(mp.players.local.position, new mp.Vector3(x, y, z)) < loadDist) {
            mp.game.object.doorControl(hash, x, y, z, isClose, 0.0, 50.0, 0);
            if (isClose == true)
                mp.game.invoke(methods.FREEZE_ENTITY_POSITION, mp.game.object.getClosestObjectOfType(x, y, z, 1, hash, false, false, false));
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

export default object;