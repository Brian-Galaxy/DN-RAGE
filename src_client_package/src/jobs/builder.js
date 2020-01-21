import Container from '../modules/data';
import methods from '../modules/methods';
import ui from '../modules/ui';

import user from '../user';

import jobPoint from '../manager/jobPoint';

let builder = {};

let isProcess = false;
let pickupId = 0;
let count = 0;

let checkpointList = [];

builder.markers = [
    // Дом в Миррор-Парке
    [
        [1319.654, -758.9153, 66.41479, -101.8577, 0],
        [1325.236, -759.3268, 66.41479, -92.99884, 0],
        [1319.363, -765.6208, 66.41479, 170.0991, 0],
        [1312.635, -762.8484, 66.41479, 82.99935, 0],
        [1315.281, -751.2244, 66.41479, 23.09978, 0],
        [1324.8, -753.8275, 66.41479, 9.300035, 0],
        [1333.4, -754.7108, 67.45516, 27.00003, 2],
        [1335.961, -747.3639, 67.10794, 140.9993, 2],
        [1317.951, -741.853, 65.70862, -39.99989, 2],
        [1325.064, -743.9174, 66.1043, 12.99983, 2],
    ],

// Дом в Миррор-Парке 2
    [
        [1296.887, -756.4341, 64.67731, -10.2014, 0],
        [1303.597, -749.3416, 64.81474, 70.79977, 0],
        [1304.03, -742.4603, 64.60286, 157.5989, 0],
        [1295.809, -738.5833, 64.71445, 168.3983, 0],
        [1288.688, -752.5519, 64.55276, -19.29978, 0],
        [1295.004, -751.4446, 65.58344, -108.5989, 0],
        [1291.863, -745.9203, 65.58344, -12.29988, 0],
        [1299.866, -744.7457, 65.58344, 70.49976, 0],
        [1295.636, -732.675, 64.63458, -69.99986, 2],
        [1304.246, -735.7852, 64.83653, -15.00013, 2],
        [1283.082, -754.6094, 66.21072, 24.99999, 2],
        [1291.121, -728.4846, 64.79617, -79.9999, 2],
    ],

// Дом в Миррор-Парке 3
    [
        [1325.333, -706.0499, 66.07366, -5.099996, 0],
        [1334.442, -708.6014, 66.04459, -8.099977, 0],
        [1335.548, -692.613, 66.00746, 167.9995, 0],
        [1329.855, -691.0842, 66.07873, 170.7984, 0],
        [1332.182, -696.5422, 66.92719, -93.99956, 0],
        [1325.746, -704.1909, 66.92696, 82.49976, 0],
        [1320.941, -684.6578, 68.22581, 114.9996, 2],
        [1318.683, -700.5161, 67.53908, 149.9997, 2],
        [1322.649, -710.8958, 65.739, -169.9996, 2],
        [1333.901, -714.2339, 65.92496, 149.9997, 2],
    ],

// Дом на каналлах Веспуччи
    [
        [-1119.251, -971.8564, 6.632142, 129.3982, 0],
        [-1119.441, -971.4724, 2.150193, 123.9985, 0],
        [-1122.076, -966.9278, 2.150193, 123.6996, 0],
        [-1130.991, -961.7217, 2.150193, -146.9976, 0],
        [-1117.585, -974.6388, 2.150193, 118.9995, 0],
        [-1128.233, -968.4297, 2.150194, 122.8997, 0],
        [-1115.969, -971.2846, 2.150193, -46.99967, 1],
        [-1125.502, -954.7999, 2.150193, -51.59957, 1],
        [-1130.174, -950.6095, 2.150193, -76.79955, 1],
        [-1133.308, -959.7548, 6.632132, 124.2996, 1],
        [-1127.728, -969.4923, 6.632132, 122.7988, 1],
        [-1121.812, -961.0847, 6.632133, -60.49985, 1],
        [-1123.833, -978.5441, 2.150193, -60.7997, 1],
        [-1131.107, -963.797, 2.150193, 110.4994, 1],
    ],

// Дом на пляже Веспуччи
    [
        [-1106.964, -1662.176, 7.357074, 45.29961, 0],
        [-1098.833, -1656.457, 7.347819, 43.49989, 0],
        [-1105.548, -1661.124, 7.357074, 34.99997, 0],
        [-1103.984, -1660.085, 6.87002, 37.89968, 0],
        [-1095.833, -1659.194, 4.418779, -131.5985, 1],
        [-1104.943, -1667.844, 7.357074, 179.4978, 1],
        [-1097.738, -1662.56, 7.347819, -148.9988, 1],
        [-1097.028, -1656.849, 7.355258, 138.8997, 1],
        [-1098.14, -1657.354, 10.18323, -33.19981, 1],
        [-1104.349, -1660.174, 10.16256, 106.6987, 1],
        [-1092.726, -1651.927, 10.15671, -0.4999079, 1],
        [-1095.307, -1654.238, 4.398428, -45.29953, 1],
    ],

// Дом на Ричмане
    [
        [-957.6935, 388.1384, 73.33763, 116.9993, 0],
        [-951.2736, 383.7269, 73.33763, -158.7986, 0],
        [-954.8706, 397.3014, 76.24708, 28.89979, 0],
        [-950.8623, 398.694, 76.24708, 16.79995, 0],
        [-944.3598, 385.328, 76.24708, -151.6995, 0],
        [-949.6802, 383.1745, 76.24708, 123.0001, 0],
        [-941.3406, 395.3351, 77.73315, 24.39986, 0],
        [-936.6279, 397.0924, 77.73315, 16.79995, 0],
        [-938.4719, 402.3141, 77.73316, -52.89908, 0],
        [-945.7827, 395.0122, 77.73316, -155.1987, 0],
        [-937.2137, 402.6682, 79.14648, 121.1995, 0],
        [-932.4396, 389.9279, 79.14558, 123.6992, 0],
        [-931.759, 400.4615, 82.03772, -153.1996, 0],
        [-937.2684, 402.5737, 82.03772, 116.4987, 0],
        [-943.762, 384.2794, 77.01281, 34.99982, 0],
        [-934.4285, 391.599, 77.73315, -61.29952, 0],
        [-956.4676, 381.2277, 73.25426, -53.69973, 1],
        [-951.7418, 386.2088, 73.33763, 29.59963, 1],
        [-951.465, 387.3468, 76.24708, 178.4991, 1],
        [-945.6675, 389.5628, 76.24708, -78.79972, 1],
        [-944.238, 389.292, 77.73315, 101.7996, 1],
        [-936.7148, 388.2739, 77.61674, 17.39938, 1],
        [-945.1553, 400.9707, 77.65186, -158.1981, 1],
        [-943.2672, 395.9485, 77.73316, -155.9997, 1],
        [-932.7448, 393.5325, 79.14558, 16.49995, 1],
        [-922.4257, 403.3893, 79.12647, -46.00058, 1],
        [-935.9122, 398.6154, 79.14648, -178.9018, 1],
        [-932.4396, 403.8191, 82.03772, -3.899996, 1],
        [-928.9263, 395.0361, 82.03772, 13.2, 1],
        [-939.2235, 394.4309, 81.23738, 16.99993, 1],
    ],

// Дом на Ричмане 2
    [
        [-927.8237, 157.2523, 65.81316, -31.39986, 0],
        [-920.7242, 153.9428, 66.1125, 153.3985, 0],
        [-901.3657, 158.3711, 65.90343, -179.2998, 0],
        [-912.6424, 156.97, 66.22661, 0.9000084, 0],
        [-895.679, 144.3406, 65.97916, -174.9996, 0],
        [-906.3356, 144.2644, 65.98102, 179.9996, 0],
        [-898.5499, 143.0483, 65.90685, 2.999998, 0],
        [-898.6653, 158.36, 65.90339, -170.7982, 0],
        [-898.4691, 152.8319, 63.18032, -91.19954, 1],
        [-909.318, 150.4066, 63.28427, 81.99928, 1],
        [-918.621, 157.5607, 63.46962, 34.59985, 1],
        [-914.1603, 144.1322, 63.4532, 68.99953, 1],
        [-923.8707, 163.1965, 66.1125, 41.19981, 1],
        [-910.816, 150.0255, 65.98102, 75.49957, 1],
        [-894.8643, 150.1317, 65.97916, -25.39938, 1],
        [-902.6181, 156.0648, 66.22536, -75.6996, 1],
        [-897.5568, 157.3048, 69.01086, 67.19948, 1],
        [-893.9035, 143.3105, 68.82381, 72.09911, 1],
        [-903.2048, 150.1058, 68.74388, 67.99958, 1],
        [-914.0648, 143.9445, 68.76591, 143.7978, 1],
    ],

// Дом на Ель-Бурро-Хайтс
    [
        [1285.604, -1767.416, 52.21444, -155.3222, 0],
        [1279.435, -1765.73, 52.0997, 116.4993, 0],
        [1275.38, -1756.191, 52.05131, 116.6992, 0],
        [1275.952, -1747.141, 52.20795, 36.8997, 0],
        [1283.207, -1749.325, 52.02766, 8.999994, 2],
        [1285.041, -1754.13, 52.02699, -123.9995, 2],
        [1284.396, -1762.656, 52.07474, -4.000078, 2],
        [1277.071, -1751.626, 52.02649, -120.9996, 2],
        [1279.135, -1757.749, 52.02649, -41.00003, 2],
        [1288.49, -1761.269, 52.11733, 69.99979, 2],
    ],

// Дом в Миррор-Парке 5
    [
        [934.1216, -570.4389, 57.96523, 30.99994, 0],
        [936.5952, -569.1401, 58.07235, 28.69983, 0],
        [946.6057, -563.8587, 58.49413, 27.69982, 0],
        [949.1534, -562.5096, 58.57453, 27.99981, 0],
        [933.0768, -559.6258, 59.04123, -36.99998, 2],
        [932.0881, -553.6394, 59.12377, 50.00013, 2],
        [938.0007, -555.7948, 59.38983, 84.99989, 2],
        [938.0663, -551.1802, 59.42675, -44.99998, 2],
        [942.5103, -554.458, 59.58833, -49.99997, 2],
        [947.627, -551.3201, 59.79933, -84.99989, 2],
        [950.9563, -557.0236, 59.05235, 0, 2],
        [941.8927, -561.1447, 58.78587, 49.99997, 2],
    ],

// Дом в Миррор-Парке 6
    [
        [1040.71, -409.3441, 66.4334, 31.59491, 0],
        [1043.752, -406.8673, 66.61205, 42.19982, 0],
        [1047.431, -404.0233, 66.82318, 41.39972, 0],
        [1053.099, -398.7393, 67.07169, 43.09984, 0],
        [1038.447, -397.5638, 67.16997, 0, 2],
        [1036.017, -392.1829, 67.00436, 91.00002, 2],
        [1040.852, -389.3054, 67.27596, 10.00004, 2],
        [1045.083, -397.6248, 67.39544, 46.00013, 2],
        [1046.312, -400.5969, 66.79202, -31.99958, 2],
        [1046.979, -391.4271, 67.74877, -154.9997, 2],
        [1052.776, -391.8832, 67.54451, 35.00023, 2],
        [1048.23, -387.8896, 67.76292, -79.9999, 2],
    ],

// Дом в Миррор-Парке 4
    [
        [1203.078, -651.1874, 61.97462, -76.99948, 0],
        [1202.398, -647.5613, 62.12228, -76.99977, 0],
        [1201.185, -641.8484, 62.33128, -74.59892, 0],
        [1199.874, -635.3405, 62.63878, -76.79918, 0],
        [1210.272, -632.6838, 65.55605, 1.499999, 0],
        [1218.596, -631.8834, 65.55167, 0, 0],
        [1217.3, -635.934, 64.71825, -17.99998, 0],
        [1218.992, -642.4859, 64.63078, -79.9999, 2],
        [1211.026, -637.3768, 64.54552, 34.99998, 2],
        [1214.15, -644.8294, 64.53351, -69.99993, 2],
        [1214.282, -640.8159, 64.53733, -59.99996, 2],
        [1206.139, -643.145, 63.46938, -39.99995, 2],
        [1213.179, -650.3434, 64.243, -41.99992, 2],
        [1207.08, -651.8749, 62.61017, -75.99986, 2],
    ],

// Дом на Ричмане 3
    [
        [-2016.09, 534.3516, 110.3593, 166.9991, 0],
        [-2004.914, 546.0021, 110.1813, -101.5478, 0],
        [-2003.541, 559.1052, 112.6116, -6.299994, 0],
        [-2001.759, 550.5906, 112.6116, -103.8997, 0],
        [-2004.744, 540.181, 112.6117, -95.59966, 0],
        [-2020.213, 534.1354, 109.7281, -18.39277, 0],
        [-2022.653, 543.119, 110.1676, -121.5985, 1],
        [-2024.526, 536.464, 110.1676, -118.3986, 1],
        [-2011.37, 539.0804, 110.1676, 71.99943, 1],
        [-2001.659, 546.2925, 110.1676, 68.5989, 1],
        [-2008.106, 553.29, 110.1564, -47.09983, 1],
        [-2023.658, 536.2849, 113.3867, 136.999, 1],
        [-2016.754, 536.2499, 113.3867, -125.4985, 1],
        [-2006.783, 532.5588, 112.6117, -128.6992, 1],
        [-1997.488, 551.4334, 112.6116, -126.6994, 1],
        [-2010.407, 545.1667, 113.0475, -118.0995, 1],
        [-2006.604, 539.4285, 115.509, -24.09993, 1],
        [-2002.762, 546.5573, 115.509, -33.29971, 1],
    ],

// Объект в Палето-Бей
    [
        [103.1092, 6547.967, 31.66302, 46.10007, 0],
        [101.0465, 6545.911, 31.66302, 46.90001, 0],
        [99.3147, 6544.198, 31.66302, 47.90076, 0],
        [96.35081, 6541.204, 31.66302, 52.50024, 0],
        [94.58824, 6539.479, 31.66302, 47.60044, 0],
        [91.94775, 6548.633, 31.68146, -40.79977, 0],
        [93.68455, 6550.336, 31.68146, 137.2998, 0],
        [97.95025, 6542.807, 31.66302, 54.5994, 0],
        [102.2715, 6549.786, 31.68146, -109.3992, 1],
        [100.6414, 6548.116, 31.68146, -115.9995, 1],
        [99.07789, 6546.513, 31.68146, -132.6991, 1],
        [95.80901, 6543.309, 31.68146, -113.2995, 1],
        [94.38331, 6541.847, 31.68146, -124.5991, 1],
        [92.94566, 6540.43, 31.68146, -122.5987, 1],
    ],

// Объект в Палето-Бей 2
    [
        [71.63313, 6580.688, 28.43958, -33.79959, 0],
        [72.71086, 6579.453, 28.2865, -42.99987, 0],
        [73.96198, 6578.235, 28.38157, -40.59985, 0],
        [76.25269, 6575.985, 28.40372, -42.99987, 0],
        [65.70107, 6573.131, 28.51079, -59.99964, 2],
        [68.32157, 6576.471, 28.43664, -135.9995, 2],
        [70.87939, 6578.843, 28.47023, 149.0003, 2],
        [74.00532, 6575.749, 28.475, 162.0003, 2],
        [73.69226, 6572.263, 28.44452, 65.00012, 2],
        [68.64804, 6571.008, 28.44241, -72.99853, 2],
        [58.48848, 6566.883, 27.90023, -30.99999, 2],
        [72.61728, 6568.223, 28.44088, 44.99998, 2],
    ],

// Объект в Сэнди-Шорес
    [
        [872.976, 2373.836, 54.47061, 0, 0],
        [872.991, 2376.295, 54.47061, 177, 0],
        [871.7532, 2386.445, 54.29726, -90.69943, 0],
        [874.1868, 2386.331, 54.29726, 92.29925, 0],
        [879.0829, 2390.561, 53.91253, 116.9998, 2],
        [877.9172, 2381.05, 53.99179, -75.99991, 2],
        [878.4622, 2370.296, 54.04411, 13.99953, 2],
        [868.3951, 2369.879, 54.15253, 175.0003, 2],
        [863.9543, 2380.601, 54.22946, -144.9997, 2],
        [863.1296, 2390.188, 54.10276, -79.9999, 2],
    ],

// Объект в Сэнди-Шорес 2
    [
        [1133.027, 2101.981, 55.7701, -83.64466, 0],
        [1133.017, 2098.877, 55.76696, -86.24826, 0],
        [1132.987, 2096.413, 55.76696, -87.49956, 0],
        [1132.951, 2092.369, 55.76696, -88.82909, 0],
        [1135.122, 2087.57, 55.69267, -0.0009227486, 0],
        [1138.879, 2087.52, 55.74779, -1.865798, 0],
        [1142.033, 2087.519, 55.7202, -0.0005061183, 0],
        [1146.375, 2087.496, 55.71118, 0.1785061, 0],
        [1141.293, 2094.403, 55.80001, 0, 0],
        [1141.383, 2096.827, 55.80001, 178.8004, 0],
        [1148.348, 2089.325, 55.80001, -164.4979, 1],
        [1143.719, 2089.243, 55.80001, 173.9986, 1],
        [1139.311, 2089.312, 55.80001, 176.8, 1],
        [1135.322, 2089.194, 55.80001, 154.9992, 1],
        [1134.746, 2093.316, 55.80001, 93.19947, 1],
        [1134.758, 2097.677, 55.80001, 87.6996, 1],
    ],

// Объект в Сэнди-Шорес 3
    [
        [1211.942, 2409.312, 66.61346, -2.271916, 0],
        [1212.254, 2411.722, 66.61346, 177.7002, 0],
        [1222.18, 2410.238, 66.78584, -87.89961, 0],
        [1224.643, 2410.149, 66.78584, 89.5998, 0],
        [1226.818, 2405.529, 66.38024, 135.9997, 2],
        [1217.985, 2412.443, 66.38187, -160.0003, 2],
        [1208.514, 2405.464, 66.1323, -115.9997, 2],
        [1218.027, 2405.702, 66.31964, 27.91076, 2],
    ],

// Дом на Вайнвуде
    [
        [-748.1058, 691.0052, 147.5332, -76.39977, 0],
        [-754.7005, 693.4879, 147.5403, 132.6994, 0],
        [-756.5144, 695.2946, 147.5403, 135.699, 0],
        [-766.4678, 703.6653, 147.5083, -30.29987, 0],
        [-751.1839, 682.6692, 144.7139, -155.4971, 1],
        [-747.9458, 685.5643, 144.7466, 4.000081, 1],
        [-749.2336, 697.7051, 144.7466, 130.6989, 1],
        [-764.6758, 710.9636, 144.9406, 129.199, 1],
        [-761.8643, 704.4203, 144.7466, -127.0987, 1],
        [-752.9077, 684.7461, 147.5332, 71.79866, 1],
        [-749.9022, 692.8644, 147.5332, 7.100007, 1],
        [-754.0762, 701.0549, 147.5301, -74.99992, 1],
        [-762.1812, 702.4881, 147.5301, 54.09919, 1],
        [-768.4501, 706.9998, 147.5301, 94.99987, 1],
        [-764.4658, 701.6954, 150.4749, -59.2998, 1],
        [-756.995, 704.1836, 150.4454, -81.49946, 1],
    ],

// Объект в Маленьком Сеуле [Южный)
    [
        [-501.9676, -1012.652, 52.47618, -87.4995, 0],
        [-501.9457, -1017.194, 52.47618, -90.59965, 0],
        [-501.9728, -1020.893, 52.47618, -86.59937, 0],
        [-501.9751, -1024.273, 52.47618, -91.9997, 0],
        [-495.323, -992.3663, 52.47618, -86.99984, 0],
        [-495.3145, -988.618, 52.47618, -86.39887, 0],
        [-493.4757, -994.3737, 52.47618, 92.8995, 0],
        [-493.5064, -990.6657, 52.47618, 90.79978, 0],
        [-489.5624, -1024.818, 52.47618, 95.19978, 0],
        [-489.5806, -1021.783, 52.47618, 93.99934, 0],
        [-489.6021, -1018.691, 52.47618, 93.49976, 0],
        [-491.3756, -1018.842, 52.47618, -90.59967, 0],
        [-491.4112, -1022.471, 52.47618, -95.19962, 0],
        [-491.3848, -1025.538, 52.47618, -90.49841, 0],
        [-505.5036, -1026.294, 29.13589, -97.89779, 1],
        [-495.8102, -1005.103, 29.13172, -102.099, 1],
        [-503.9651, -985.4041, 28.97769, 89.49922, 1],
        [-482.8858, -985.8332, 29.1326, 86.39979, 1],
        [-482.8773, -1017.087, 29.1327, 79.59961, 1],
        [-493.9442, -1033.149, 29.13172, -62.29972, 1],
        [-487.1276, -1054.249, 29.13648, -41.09946, 1],
        [-464.4534, -1043.142, 29.13276, 127.6987, 1],
        [-449.1931, -1056.634, 28.97769, -49.19892, 1],
        [-459.9737, -1070.255, 29.13172, 128.9985, 1],
        [-452.6572, -1057.099, 40.81401, -38.5997, 1],
        [-470.8419, -1066.662, 40.81401, -51.99932, 1],
        [-471.2982, -1050.067, 40.81406, 144.5991, 1],
        [-493.2745, -1034.65, 40.81401, -53.89961, 1],
        [-504.6905, -1015.535, 40.70811, 177.6994, 1],
        [-503.9691, -985.3807, 40.65998, 89.49801, 1],
        [-483.9492, -987.4487, 40.81401, 102.7001, 1],
        [-492.908, -1007.401, 40.81414, 82.49925, 1],
        [-495.6864, -1006.502, 40.81401, -89.99988, 1],
        [-460.4704, -1069.914, 40.81401, 150.799, 1],
        [-460.062, -1070.039, 52.47618, 143.6989, 1],
        [-470.0925, -1050.946, 52.47618, 136.899, 1],
        [-493.8483, -1033.401, 52.47618, -71.29967, 1],
        [-492.8284, -1007.48, 52.47632, 77.69969, 1],
        [-483.8134, -986.6264, 52.47618, 77.5996, 1],
        [-501.6773, -986.5701, 52.47618, 84.59935, 1],
    ],

// Объект в Маленьком Сеуле 2 [Северный)
    [
        [-439.3965, -958.3222, 29.39303, 78.39938, 1],
        [-465.1329, -958.9738, 29.39298, 0.5004182, 1],
        [-457.633, -952.27, 29.39283, -94.19898, 1],
        [-439.3727, -930.5513, 29.39321, 93.19962, 1],
        [-455.3112, -930.5587, 29.39283, 93.99992, 1],
        [-465.1109, -879.3798, 29.39283, 5.300015, 1],
        [-439.3039, -878.9072, 29.39335, 100.7998, 1],
        [-455.2941, -897.6555, 29.39283, 103.7986, 1],
        [-456.9693, -906.2135, 29.39283, -84.09964, 1],
        [-457.6045, -883.8183, 29.39283, -93.7991, 1],
        [-454.632, -882.8673, 38.68874, 81.89918, 1],
        [-456.9598, -896.8073, 38.69303, -85.49899, 1],
        [-455.3983, -907.1619, 38.68874, 88.39928, 1],
        [-456.9619, -918.382, 38.68874, -84.09912, 1],
        [-465.0221, -959.1534, 38.68874, 10.3, 1],
        [-448.5202, -958.9617, 38.68874, -5.099974, 1],
        [-454.5862, -954.3602, 38.68874, 86.69954, 1],
        [-456.9871, -948.4168, 38.69303, -83.2994, 1],
        [-455.3314, -930.5909, 38.68874, 97.29934, 1],
        [-457.7371, -934.0372, 38.68874, -87.09908, 1],
        [-457.7243, -882.5593, 47.98894, -93.19973, 1],
        [-454.4936, -902.2426, 47.98894, 90.89954, 1],
        [-457.6862, -934.2347, 47.98464, -94.69922, 1],
        [-454.5526, -953.8848, 47.98465, 90.69954, 1],
        [-453.0057, -891.8168, 23.66429, 132.8446, 1],
        [-466.616, -891.3295, 23.69154, -60.99995, 1],
        [-454.1771, -908.9648, 23.66429, -45.99997, 2],
        [-465.7262, -910.4275, 23.68365, 14.99987, 2],
        [-454.9362, -928.3844, 23.66429, 34.99998, 2],
        [-466.5616, -929.6164, 23.68365, -52.99995, 2],
        [-453.6798, -948.2737, 23.66429, 39.99992, 2],
        [-467.3375, -948.6442, 23.68365, -64.99994, 2],
        [-454.2462, -919.2231, 23.66429, -34.99998, 2],
        [-453.6291, -940.5283, 23.66429, 59.99997, 2],
        [-454.485, -874.9351, 23.77288, 79.9999, 2],
        [-462.9703, -874.3631, 23.77378, -107.9998, 2],
        [-461.6357, -867.0763, 23.8666, -37.99947, 2],
        [-444.98, -985.501, 23.76909, 49.99997, 2],
        [-456.3292, -970.7206, 23.54542, 153.9993, 2],
        [-456.9998, -987.8858, 23.54526, -41.99986, 2],
    ],

// Объект на ДавнТауне [Южный)
    [
        [-146.4778, -1085.479, 30.13941, 164.4992, 0],
        [-148.7386, -1084.655, 36.13934, 161.7992, 0],
        [-151.7301, -1083.587, 42.13926, 163.9992, 0],
        [-151.8155, -1081.186, 30.13941, 78.3997, 0],
        [-150.9235, -1078.88, 36.13934, 69.59972, 0],
        [-149.8775, -1075.896, 42.13926, 78.59962, 0],
        [-148.7209, -1075.377, 30.13941, -14.59981, 0],
        [-145.1172, -1076.689, 36.13934, -17.99998, 0],
        [-142.0459, -1077.801, 42.13926, -14.7999, 0],
        [-141.4136, -1078.828, 30.13941, -105.3991, 0],
        [-142.7146, -1082.318, 36.13934, -110.9997, 0],
        [-143.8805, -1085.608, 42.13926, -104.7995, 0],
        [-177.1, -1092.919, 30.13941, 71.99993, 0],
        [-173.5324, -1085.819, 30.13941, -19.09997, 0],
        [-166.2457, -1089.219, 30.13941, -104.5996, 0],
        [-169.864, -1096.434, 30.13941, 164.199, 0],
        [-168.11, -1062.49, 36.13934, 162.8976, 0],
        [-166.2296, -1054.786, 36.13934, 69.99966, 0],
        [-158.4522, -1056.766, 36.13934, -21.19992, 0],
        [-160.2844, -1064.507, 36.13934, -106.4994, 0],
        [-161.5997, -1055.618, 42.13926, -21.99997, 0],
        [-164.9624, -1063.639, 42.13926, 164.2988, 0],
        [-175.851, -1089.505, 42.13926, 70.89979, 0],
        [-167.5435, -1092.734, 42.13926, -110.5995, 0],
        [-145.8855, -1095.456, 30.13941, 154.9, 1],
        [-150.467, -1106.145, 30.13941, -20.29981, 1],
        [-161.0447, -1102.227, 30.13941, -20.09985, 1],
        [-156.4662, -1091.43, 30.13941, 162.599, 1],
        [-158.8478, -1095.575, 36.13934, -101.399, 1],
        [-156.435, -1103.848, 36.13934, -30.09991, 1],
        [-148.0265, -1101.93, 36.13934, 69.09973, 1],
        [-150.6221, -1093.62, 36.13934, 160.6989, 1],
        [-152.0099, -1093.326, 42.13926, -137.1993, 1],
        [-147.6675, -1100.494, 42.13926, 132.7976, 1],
        [-154.9067, -1104.36, 42.13926, 48.99989, 1],
        [-159.2977, -1097.148, 42.13926, -46.59952, 1],
        [-172.5597, -1092.074, 43.47319, 30.99996, 1],
        [-170.6279, -1090.235, 43.47319, -150.2997, 1],
        [-162.999, -1060.879, 43.45073, -34.39994, 1],
        [-163.1706, -1058.568, 43.45073, 143.1989, 1],
    ],

// Объект на ДавнТауне 2 [Северный, 16 этаж)
    [
        [-167.0284, -990.9614, 114.1366, 155.4985, 0],
        [-159.336, -993.7475, 114.1366, 167.6989, 0],
        [-137.476, -975.795, 114.1366, 166.6991, 0],
        [-132.7867, -966.1022, 114.1366, 163.0992, 0],
        [-138.4009, -963.4318, 114.1366, 145.4993, 0],
        [-141.1266, -960.6482, 114.1366, 126.2993, 0],
        [-142.3918, -957.6176, 114.1366, 93.89944, 0],
        [-142.5757, -973.915, 114.1366, 159.7986, 0],
        [-136.2449, -964.7864, 114.1366, 160.4991, 0],
        [-139.9938, -974.8474, 114.1366, 163.2994, 0],
        [-159.1974, -1022.171, 114.3047, -8.699866, 1],
        [-177.7674, -990.0428, 114.1366, 69.79978, 1],
        [-166.0084, -957.0257, 114.1366, 141.8983, 1],
        [-126.4269, -957.7247, 114.1366, 59.59972, 1],
        [-134.8929, -981.0641, 114.1366, 69.99979, 1],
        [-127.2799, -980.9467, 114.1366, -13.89982, 1],
        [-111.4604, -986.7813, 114.1366, -11.19987, 1],
        [-106.3116, -974.5163, 114.1366, 164.0982, 1],
        [-122.0647, -968.7106, 114.1366, 155.0003, 1],
        [-130.2922, -968.0658, 114.1366, 144.6987, 1],
    ],

// Объект на ДавнТауне 3 [Северный, 48 этаж)
    [
        [-171.0652, -1006.17, 254.1315, -9.999994, 0],
        [-165.5793, -1008.174, 254.1315, -11.99999, 0],
        [-173.9807, -991.9033, 254.1315, -104.5986, 0],
        [-174.6895, -994.6105, 254.1315, -101.299, 0],
        [-149.832, -969.3801, 254.1315, 164.5988, 0],
        [-155.1479, -967.4499, 254.1315, 163.5989, 0],
        [-143.723, -952.2783, 254.1315, 164.9993, 0],
        [-151.4614, -949.3979, 254.1315, 160.5986, 0],
        [-150.8547, -942.0295, 254.1315, -107.4997, 0],
        [-152.7565, -947.2146, 254.1315, -110.9997, 0],
        [-144.6097, -965.749, 254.1315, -11.99999, 0],
        [-155.185, -971.4749, 259.1327, -18.49994, 0],
        [-149.9056, -973.3877, 259.1327, -21.8999, 0],
        [-145.2165, -971.3356, 259.1327, 69.99993, 0],
        [-142.7804, -964.6512, 259.1327, 69.99993, 0],
        [-139.0238, -958.0713, 259.1327, -15.09998, 0],
        [-148.2025, -953.0483, 259.1327, 157.9996, 0],
        [-145.9838, -953.8077, 259.1327, 164.9997, 0],
        [-157.2884, -970.6661, 264.1339, -19.99998, 0],
        [-154.9872, -971.4641, 264.1339, -17.99998, 0],
        [-146.0797, -962.7109, 264.1339, -109.9994, 0],
        [-144.1328, -957.3748, 264.1339, -111.9996, 0],
        [-145.0648, -971.0991, 264.1339, 162.6992, 0],
        [-141.8675, -945.3227, 264.1339, 65.99923, 0],
        [-143.2322, -948.9966, 264.1339, 69.19969, 0],
        [-151.4436, -974.3719, 269.1352, -12.99999, 0],
        [-162.9144, -1008.075, 254.1315, 109.6978, 1],
        [-170.9209, -1004.772, 254.1315, -135.9989, 1],
        [-151.7327, -970.1432, 254.1315, 43.29988, 1],
        [-154.7844, -968.6389, 254.1315, -69.59957, 1],
        [-141.968, -965.6848, 254.1315, 110.9996, 1],
        [-150.2211, -951.2862, 254.1315, 50.69978, 1],
        [-146.4079, -952.4125, 254.1315, -61.19962, 1],
        [-151.5181, -946.8073, 254.1315, 26.69983, 1],
        [-150.5859, -945.3303, 254.1315, 128.9994, 1],
        [-151.2822, -971.4882, 259.1327, -120.0986, 1],
        [-156.412, -969.5392, 259.1327, -132.2993, 1],
        [-144.6723, -965.9767, 259.1327, -33.09977, 1],
        [-145.4473, -968.177, 259.1327, -32.39992, 1],
        [-138.8377, -956.6945, 259.1327, -126.7992, 1],
        [-143.246, -956.3309, 259.1327, 42.19992, 1],
        [-150.872, -953.1217, 259.1327, -68.0998, 1],
        [-144.1457, -961.4289, 264.1339, 140.4981, 1],
        [-143.37, -959.2428, 264.1339, 137.9996, 1],
        [-143.7864, -946.5248, 264.1339, -41.99981, 1],
        [-145.7046, -951.7669, 264.1339, -40.2998, 1],
        [-142.2105, -973.531, 264.1339, 55.59959, 1],
        [-151.6425, -971.17, 264.1339, -136.7996, 1],
        [-157.6728, -969.3073, 264.1339, 122.7993, 1],
        [-154.3003, -971.9179, 269.3249, -124.9997, 1],
        [-172.217, -990.4549, 254.1315, 147.299, 1],
        [-174.8327, -998.756, 254.1315, 21.30018, 1],

    ],
// Объект на Альте [Южный)
    [
        [26.73492, -429.3568, 45.55724, -108.2997, 0],
        [28.34982, -424.8274, 45.55653, -109.8988, 0],
        [13.8473, -424.433, 45.56277, -16.39997, 0],
        [16.91992, -425.5557, 45.56277, -16.69991, 0],
        [43.71614, -390.6467, 45.56373, 162.8987, 0],
        [48.2707, -392.3352, 45.56373, 166.9994, 0],
        [53.33947, -381.078, 45.56425, 80.99972, 0],
        [53.91795, -379.6277, 45.56425, 71.29987, 0],
        [38.79488, -370.3617, 55.28927, -106.599, 0],
        [36.59266, -376.4093, 55.28927, -105.6987, 0],
        [33.86966, -381.7426, 55.22804, 167.6988, 0],
        [29.33794, -380.0878, 55.22804, 161.9992, 0],
        [32.30288, -437.7917, 55.23164, -18.29986, 0],
        [35.30083, -438.903, 55.23283, -18.59991, 0],
        [25.46263, -448.6775, 55.28996, 76.19964, 0],
        [27.15607, -444.0239, 55.28996, 74.69952, 0],
        [30.37382, -442.6862, 65.035, -105.0994, 0],
        [29.82511, -444.2059, 65.035, -101.6994, 0],
        [30.13532, -438.5231, 65.035, 165.9995, 0],
        [25.60544, -436.8375, 65.035, 164.9995, 0],
        [30.37952, -380.8244, 64.72368, -13.99996, 0],
        [33.47681, -382.0057, 64.72368, -19.99998, 0],
        [55.67422, -376.627, 64.80591, 72.99989, 0],
        [55.13015, -378.1061, 64.80592, 76.99981, 0],
        [29.42474, -388.1353, 73.94826, -16.69997, 0],
        [35.46195, -390.3346, 73.94826, -14.59995, 0],
        [28.36999, -450.1134, 73.98136, 75.99991, 0],
        [29.51864, -446.9569, 73.98136, 76.09962, 0],
        [43.39829, -392.0198, 45.55194, 39.79981, 1],
        [53.66785, -376.319, 45.56424, -43.4996, 1],
        [28.62428, -427.4843, 45.56396, 40.39985, 1],
        [13.44506, -423.1215, 45.56396, 121.3978, 1],
        [38.72086, -438.6368, 55.28997, -141.5996, 1],
        [24.71355, -446.7509, 55.28996, -52.09983, 1],
        [33.5604, -383.13, 55.28927, 38.49987, 1],
        [39.03706, -373.5507, 55.28927, 142.1992, 1],
        [36.09903, -381.8011, 64.80508, 115.5997, 1],
        [52.68054, -381.6093, 64.80591, -147.9995, 1],
        [28.239, -439.2933, 65.035, 39.99995, 1],
        [30.03795, -447.6028, 65.035, 132.8993, 1],
        [27.62401, -448.1698, 73.98136, -53.09983, 1],
        [33.59012, -388.4792, 73.94786, 124.7999, 1],
    ],

// Объект на Альте 2 [Северный)
    [
        [109.0412, -369.1403, 55.50181, 165.0003, 0],
        [105.9207, -368.0052, 55.50181, 160.8987, 0],
        [106.7483, -358.0161, 55.50181, -18.39992, 0],
        [112.8255, -360.2364, 55.50181, -21.89993, 0],
        [66.74252, -346.1361, 55.51337, 72.19946, 0],
        [67.86727, -343.0612, 55.51337, 70.09956, 0],
        [80.24636, -328.5413, 55.51337, -104.8996, 0],
        [79.67431, -330.1301, 55.51337, -105.8996, 0],
        [64.54382, -331.6213, 67.20216, -21.09981, 0],
        [66.02006, -332.1693, 67.20216, -16.39995, 0],
        [67.92767, -343.6909, 67.20216, 74.99992, 0],
        [67.34213, -345.3282, 67.20216, 71.69936, 0],
        [110.0987, -363.4116, 67.31776, 157.7992, 0],
        [107.1252, -362.3051, 67.31776, 161.7985, 0],
        [120.8842, -354.7135, 67.17327, -116.6994, 0],
        [119.2027, -359.3914, 67.17327, -115.8997, 0],
        [65.9948, -344.2933, 55.51337, -37.99987, 1],
        [64.83966, -347.3786, 55.51337, -45.59975, 1],
        [79.21635, -334.3132, 55.51336, 21.89995, 1],
        [80.43458, -332.045, 55.51336, 131.2981, 1],
        [103.2979, -368.094, 55.50181, -69.89991, 1],
        [110.3587, -370.9732, 55.50181, 55.39974, 1],
        [111.5646, -358.3909, 55.50181, -122.7996, 1],
        [109.3545, -357.8519, 55.50181, 115.6998, 1],
        [108.3417, -364.1709, 67.31776, 56.99916, 1],
        [112.8698, -365.9113, 67.31776, 43.69983, 1],
        [119.9773, -360.6154, 67.17327, 31.59984, 1],
        [121.7015, -356.5244, 67.17327, 139.1992, 1],
        [65.425, -346.646, 67.20216, -36.69989, 1],
        [67.64652, -341.1002, 67.20216, -144.4989, 1],
        [70.87222, -332.4707, 67.20216, -129.9994, 1],
        [68.73421, -331.9827, 67.20216, 123.6985, 1],
    ],
];

builder.start = function() {
    if (isProcess) {
        mp.game.ui.notifications.show('~r~Вы уже получили задание');
        return;
    }
    builder.findRandomPickup();
};

builder.take = function(type) {
    Container.Data.SetLocally(0, 'tool', type);
    if (type == 0)
        mp.game.ui.notifications.show('~r~Вы взяли набор инструментов');
    else if (type == 1)
        mp.game.ui.notifications.show('~g~Вы взяли набор инструментов');
    else
        mp.game.ui.notifications.show('~b~Вы взяли набор инструментов');
};

builder.stop = function() {
    checkpointList.forEach(function (item, i) {
        try {
            jobPoint.deleteById(item.id);
        }
        catch (e) {
            methods.debug(e);
        }
    });
    checkpointList = [];
    isProcess = false;

    if (count == 0) {
        user.removeCashMoney(100, 'Штраф на работе садовника');
        mp.game.ui.notifications.show('~r~С вас сняли штраф за то, что вы завершили досрочно работу');
    }
    else {
        mp.game.ui.notifications.show('~r~Вы завершили работу досрочно');
    }
    count = 0;
};

builder.findRandomPickup = function() {
    try {
        isProcess = true;
        count = 0;
        pickupId = methods.getRandomInt(0, builder.markers.length - 1);

        builder.markers[pickupId].forEach((item, i) => {

            if (i == 0)
                user.setWaypoint(item[0], item[1]);

            let _checkpointId = 0;
            let pos = new mp.Vector3(item[0], item[1], item[2] - 1);
            if (item[4] == 0)
                _checkpointId = jobPoint.createList(pos, false, 1, ui.MarkerRed);
            else if (item[4] == 1)
                _checkpointId = jobPoint.createList(pos, false, 1, ui.MarkerGreen);
            else
                _checkpointId = jobPoint.createList(pos, false, 1, ui.MarkerBlue);

            checkpointList.push({id: _checkpointId, type: item[4], rot: item[3], pos: pos});
        });

        mp.game.ui.notifications.showWithPicture('Работа', "Начальник", `Скинул координаты точки, для ясности разделил маркера по цветам.`, "CHAR_JOSEF", 1);
    }
    catch (e) {
        methods.debug(e);
    }
};

builder.workProcess = function(id) {

    let newList = [];

    checkpointList.forEach(function (item, i) {

        if (id == item.id) {

            if (!Container.Data.HasLocally(0, 'tool') || Container.Data.GetLocally(0, 'tool') != item.type) {
                mp.game.ui.notifications.show('~r~У Вас нет инструментов или вы взяли не те.');
                newList.push(item);
                return;
            }

            mp.players.local.freezePosition(true);
            jobPoint.deleteById(item.id);

            count++;

            methods.blockKeys(true);
            pickupId = 0;

            mp.players.local.position = new mp.Vector3(item.pos.x, item.pos.y, item.pos.z + 1);
            mp.players.local.setRotation(0, 0, item.rot, 0, true);

            if (item.type == 0)
                user.playScenario("WORLD_HUMAN_HAMMERING");
            else if (item.type == 1)
                user.playScenario("WORLD_HUMAN_WELDING");
            else
                user.playScenario("WORLD_HUMAN_CONST_DRILL");

            setTimeout(function () {

                mp.players.local.freezePosition(false);
                methods.blockKeys(false);
                user.stopScenario();
                user.giveJobMoney(methods.getRandomInt(20, 25) + methods.getRandomFloat());

                user.giveJobSkill();
            }, 20000);
        }
        else
            newList.push(item);
    });

    if (newList.length < 1) {
        count = 0;
        isProcess = false;
    }

    checkpointList = newList;
};

mp.events.add("playerEnterCheckpoint", (checkpoint) => {
    if (!isProcess) return;
    builder.workProcess(checkpoint.id);
});

export default builder;