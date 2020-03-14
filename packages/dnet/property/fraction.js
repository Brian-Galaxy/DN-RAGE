let Container = require('../modules/data');
let mysql = require('../modules/mysql');
let methods = require('../modules/methods');

let user = require('../user');
let coffer = require('../coffer');
let enums = require('../enums');

let weather = require('../managers/weather');

let vehicles = require('./vehicles');
let stocks = require('./stocks');

let fraction = exports;

let count = 0;

let isCargo = false;

fraction.warVehPos = [
    //Фургоны в восточной Лос-Сантосе
    [1284.412, -2562.505, 43.83063, -36.63657],
    [1053.312, -2608.937, 9.851141, -56.01677],
    [996.0185, -2583.85, 10.14943, 151.8933],
    [1513.847, -2544.22, 56.28567, 33.15221],
    [1388.558, -2227.142, 60.92342, 92.44827],
    [1397.376, -2086.557, 54.16666, -101.7612],
    [1521.296, -2074.909, 76.9946, -69.07748],
    [1545.756, -2122.983, 76.85365, 13.27696],
    [1619.13, -2244.363, 106.8808, -67.10762],
    [1623.18, -2355.145, 93.05376, -21.24549],
    [1466.493, -1936.431, 70.9256, -111.3197],
    [1502.129, -1887.479, 71.71597, -88.50042],
    [1632.802, -1871.507, 105.5722, -70.0257],
    [1691.953, -1926.639, 114.8481, -127.4184],
    [1616.755, -1954.797, 102.1076, -41.67207],
    [1703.422, -1735.318, 112.3792, -25.8264],
    [1693.43, -1585.956, 112.2516, 72.1459],
    [1719.064, -1467.06, 112.6215, 84.74844],
    [1500.878, -1602.025, 72.393, 145.9209],
    [1446.138, -1687.285, 65.78502, 146.502],
    [1474.037, -1762.107, 69.18562, -26.77013],
    [2808.085, -665.2219, 2.028548, 94.31238],
    [2799.65, -722.3316, 4.803776, 16.45073],
    [1877.605, -1055.122, 79.71928, -100.6846],
    [1848.389, -1174.274, 90.71579, -72.83471],
    [1833.384, -1209.979, 93.82596, -134.4801],
    [1802.363, -1340.312, 97.42056, -136.1064],
    [1701.142, -1430.79, 112.4832, -141.2349],
    [1565.106, -1603.841, 89.60545, -78.08073],
    [1559.278, -1644.876, 87.71635, 155.0907],
    [1619.266, -1703.325, 87.80341, -125.0511],
    [1586.625, -1785.636, 88.18788, -54.72275],
    [1456.671, -1884.955, 71.40792, -20.92794],
    [1262.324, -2005.816, 43.52903, -142.2624],
    [1283.878, -1934.512, 42.99994, -115.3089],
    [1237.679, -1887.748, 38.23188, -63.60649],
    [1347.393, -1839.922, 56.82596, -138.3909],
    [1366.679, -1892.139, 55.07649, 132.3133],
    [1300.011, -1957.28, 43.47281, -34.81757],
    [1259.459, -1853.713, 39.027, -9.726606],
    [1025.837, -1860.314, 30.62588, 81.18579],
    [1041.558, -1981.54, 30.7752, 83.46424],
    [1033.338, -2108.286, 31.84642, 22.76865],
    [1098.406, -2143.829, 30.87126, -6.286349],
    [1125.621, -2219.208, 30.37634, -163.7125],
    [1124.092, -2274.232, 30.4031, 151.6338],
    [1114.573, -2330.858, 30.28429, -177.8334],
    [1087.859, -2346.242, 29.99094, -125.6519],
    [1125.424, -2407.943, 31.45861, -1.187174],
    [1201.05, -2451.108, 40.47718, 104.1647],
    [1054.616, -2476.793, 28.23879, -17.06372],
    [1075.155, -2322.64, 30.03405, -151.4904],
    [1095.172, -2246.691, 30.02515, -69.79123],
    [1043.832, -2134.769, 32.43813, -72.75335],
    [977.4545, -2200.464, 30.28762, 151.9499],
    [975.7733, -2252.405, 30.28711, -84.11659],
    [858.8075, -2323.121, 30.08187, 156.8057],
    [832.0176, -2485.012, 24.04469, 78.80958],
    [912.868, -2536.874, 28.04411, 111.9985],
    [813.451, -2411.067, 23.41664, 8.128593],
    [837.7443, -2183.759, 30.04157, -109.2308],
    [879.1472, -2175.197, 30.25541, 178.57],
    [676.308, -2391.995, 20.16596, -176.4707],
    [703.3188, -2314.68, 26.30861, -25.94203],
    [713.3339, -2193.832, 28.22674, -6.564633],
    [730.8076, -2104.021, 29.02122, 56.76257],
    [719.1534, -2023.493, 29.0281, -82.37481],
    [733.3599, -1905.748, 29.03141, 177.2992],
    [851.476, -1950.116, 28.89178, 97.56916],
    [821.9283, -1978.327, 29.02731, -16.77202],
    [987.6639, -1922.211, 30.8716, 99.63115],
    [897.4866, -1967.853, 30.28576, 118.296],
    [732.1341, -1846.338, 29.02762, -161.6938],
    [849.3237, -1820.583, 28.73772, 24.75363],
    [905.4409, -1811.432, 30.35223, 24.23425],
    [1044.388, -1735.857, 35.26185, 78.50023],
    [892.3665, -1738.008, 29.89845, -100.3134],
    [898.6934, -1589.867, 30.00261, 104.8271],
    [816.1191, -1591.672, 31.18703, 110.4221],
    [756.6956, -1677.214, 29.02188, -15.81823],
    [877.3115, -1664.2, 30.15549, 69.32368],
    [1002.737, -1479.941, 30.96305, -115.8962],
    [898.6485, -1515.867, 29.88873, -145.6292],
    [864.2883, -1554.577, 30.03737, -92.53886],
    [721.7896, -1414.518, 26.09423, -5.37512],
    [719.2797, -1326.354, 25.90149, 57.8864],
    [755.4477, -1229.28, 24.52608, -23.81271],
    [677.1609, -1112.5, 22.25954, -47.79648],
    [653.265, -1008.812, 22.08197, -44.7346],
    [689.4568, -955.1542, 23.20165, -161.3763],
    [691.822, -862.2318, 23.54235, -52.53639],
    [677.4414, -704.4966, 25.00106, -18.83814],
    [799.3968, -491.4879, 30.04647, 120.1592],
    [738.0315, -533.0871, 26.71601, 155.0916],
    [817.0236, -751.7454, 26.46974, -171.4789],
    [837.0898, -797.9225, 26.01003, 117.0928],
    [861.1312, -865.5109, 25.28624, -159.6487],
    [852.0226, -1045.994, 28.16097, -173.5839],
    [962.6868, -1152.836, 25.23951, -93.66661],
    [1113.049, -1235.988, 20.39177, -113.4681],

//Фургоны в заподном Лос-Сантосе
    [-1171.034, -1739.93, 3.793711, -142.2869],
    [-1184.979, -2076.29, 14.23817, 0.6186491],
    [-1183.286, -1393.028, 4.35911, -56.66013],
    [-1027.413, -1341.582, 5.189387, -104.2479],
    [-870.3502, -1644.037, 0.8977345, -89.9232],
    [-553.2255, -1545.375, 0.8955802, -83.47353],
    [-619.5817, -1083.356, 21.91418, -55.32938],
    [-47.15611, -1964.647, 5.219172, 45.83226],
    [72.24914, -2198.141, 1.336646, 20.21401],
    [104.703, -2199.556, 5.775236, 6.364048],
    [-455.6477, -2283.417, 7.344173, -86.7207],
    [-373.7623, -2282.312, 7.344237, 16.71027],
    [-159.1584, -2233.123, 7.547728, -142.3162],
    [-128.153, -2148.058, 16.44089, 20.65855],
    [-22.43376, -2085.93, 16.44089, 107.4085],
    [-508.4128, -1453.115, 12.77456, 177.9402],
    [-1319.172, -1137.827, 4.234948, 91.65598],
    [-1269.749, -1102.479, 7.396731, 25.11834],
    [-1184.656, -1116.437, 5.436871, 177.4996],
    [-1479.76, -901.3563, 9.759636, 64.55099],
    [-1706.25, -927.3159, 7.412461, -61.49226],
    [-1638.236, -838.0179, 9.742117, 138.9587],
    [-1605.604, -917.2547, 8.686437, 139.3945],
    [-1708.727, -899.2267, 7.560183, 139.2121],
    [-1519.809, -707.0603, 27.62566, -0.9478624],
    [-1495.417, -321.8352, 46.6779, 45.95013],
    [-1667.819, -230.7926, 54.58983, -106.7826],
    [-1630.263, -206.6789, 54.80412, -23.46479],
    [-1648.777, -255.0058, 54.23555, -17.11508],
    [-2018.965, -339.9747, 47.84237, -121.826],
    [-1982.159, -308.496, 47.84237, -127.1435],
    [-1985.96, -292.3831, 43.84217, 53.63601],
    [-2020.914, -362.3437, 43.84208, 28.65689],
    [-1244.551, -648.1159, 40.09359, -50.23072],
    [-1207.781, -657.9344, 40.09359, 130.1919],
    [-1197.607, -671.1828, 30.45553, 129.2918],
    [-1247.165, -644.3863, 30.45565, 132.9615],
    [-1204.785, -654.6891, 25.63734, 132.9608],
    [-1194.561, -686.5256, 25.63734, 42.55063],
    [-1109.117, -449.071, 34.94747, -61.47041],
    [-1115.877, -577.1115, 31.39141, -62.5416],
    [-1186.177, -542.3298, 28.54761, -153.7852],
    [-1141.316, -215.8572, 37.6727, 84.72752],
    [-902.0679, -159.8689, 41.61607, -155.4717],
    [-939.5305, -177.7266, 41.61283, 25.42445],
    [-983.3362, -187.6047, 37.53179, 27.65218],
    [-728.3618, -67.96933, 41.48614, 23.65667],
    [-748.8247, -78.57289, 41.48571, -145.1379],
    [-387.6065, -53.41399, 54.1642, -111.1346],
    [-365.58, -68.2326, 54.1642, 134.0181],
    [-362.5632, -101.0283, 45.39998, -18.89934],
    [-317.812, -56.63837, 54.1642, 162.7589],
    [-180.7171, -178.3345, 43.36065, -21.81789],
    [-336.4502, -720.9579, 52.98275, -20.75546],
    [-307.3804, -772.9871, 52.98215, -18.71091],
    [-274.3571, -765.1773, 48.16035, -109.542],
    [-305.4535, -741.6896, 48.16027, 161.8811],
    [-315.4728, -769.5223, 43.34115, 167.5913],
    [-277.2423, -752.5801, 33.70067, 158.3796],
    [508.8899, -68.4664, 88.59274, 62.16983],
    [484.5892, -34.19862, 88.59274, 61.76955],
    [490.548, -27.81437, 77.45441, 65.005],
    [469.9704, -72.33024, 77.19704, -15.49859],
    [253.7348, 75.07968, 99.62952, -14.57791],
    [313.0677, 67.48168, 94.09838, -16.18696],
    [275.3084, 67.37128, 94.10736, -16.49138],
    [181.2162, 393.0361, 108.4933, 171.7589],
    [188.7902, 306.6815, 105.1283, -67.81759],
    [-80.41048, 205.1604, 95.59529, -4.499876],
    [-128.5452, 193.5265, 89.45716, -16.63773],
    [-268.3997, 177.928, 79.21733, -9.372472],
    [-598.0497, 344.5136, 84.85287, -2.82899],
    [-611.8755, 331.0367, 84.854, 174.3893],
    [-547.5738, 336.1473, 84.10722, -3.754587],
    [-376.6843, 297.5757, 84.62811, 179.9707],
    [-329.3921, 288.9274, 85.86851, -81.83524],
    [-269.1443, 312.1568, 92.99589, 178.4511],
    [-292.3145, 325.26, 92.99071, 178.1521],
    [305.6774, 366.735, 105.021, 56.28183],
    [371.0824, 285.2519, 102.9979, 163.1077],
    [372.0646, 267.9296, 102.7736, -30.26089],
    [653.533, 181.8203, 94.84443, -121.2255],
    [616.113, 161.6799, 97.03565, -97.5375],
    [606.5275, 126.301, 92.63591, -109.8327],
    [619.837, 108.0773, 92.38464, 74.95962],
    [699.3533, 221.9812, 92.19356, 61.95568],
    [686.8479, 269.9641, 93.15625, 62.21208],
    [137.4175, -243.387, 51.26731, -175.8168],
    [-1709.524, 55.07069, 65.79138, 110.3618],
    [-1669.819, 65.22163, 63.26652, -67.54897],
    [-1684.304, 78.42423, 64.14209, -63.34391],
    [-1292.593, -1313.333, 4.303809, 2.013109],
    [-730.6105, -910.4559, 18.78025, 175.104],
    [-703.6298, -751.9243, 29.53929, -177.2541],
    [-674.2451, -732.6983, 31.95256, -1.866058],
    [-670.2855, -751.8094, 34.89005, 7.897429],
    [-708.3808, -744.0453, 36.731, -11.67235],
    [-686.4935, -880.0286, 24.23512, -120.0362],
    [-810.1141, -768.6065, 21.01695, -105.2277],
    [-455.844, -456.0225, 32.83823, -27.60899],

// Фургоны в округе Блейн
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

    let spawnList = [];
    spawnList.push(methods.getRandomInt(0, fraction.warVehPos.length));
    spawnList.push(methods.getRandomInt(0, fraction.warVehPos.length));
    spawnList.push(methods.getRandomInt(0, fraction.warVehPos.length));

    spawnList.forEach((item, i) => {
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
                veh.numberPlateType = methods.getRandomInt(0, 3);
                veh.locked = false;
                veh.setColor(color, color);

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
                if (methods.getRandomInt(0, 100) < 40)
                    rare = 1;
                if (methods.getRandomInt(0, 100) < 15)
                    rare = 2;
                boxRandom = stocks.boxList.filter((item) => { return item[7] === rare; });
                veh.setVariable('box3', boxRandom[methods.getRandomInt(0, boxRandom.length)][2]);

                veh.setVariable('cargoId', i);
            }
            catch (e) {
                methods.debug(e);
            }

        }, new mp.Vector3(fraction.warVehPos[item][0], fraction.warVehPos[item][1], fraction.warVehPos[item][2]), fraction.warVehPos[item][3], 'Speedo4');
    });

    setTimeout(fraction.timerCargoWar, 1000);
};

fraction.stopCargoWar = function() {

    if (!isCargo)
        return;

    methods.notifyWithPictureToFractions2('Борьба за груз', `~r~ВНИМАНИЕ!`, 'Миссия была завершена по времени');
    isCargo = false;

    mp.vehicles.forEach(v => {
        if (!vehicles.exists(v))
            return;
        if (v.getVariable('cargoId') !== null && v.getVariable('cargoId') !== undefined) {
            if (v.getOccupants().length == 0)
                vehicles.respawn(v);
        }
    });

    mp.players.forEach(p => {
        if (!user.isLogin(p))
            return;

        if (user.get(p, 'fraction_id2') > 0) {
            user.deleteBlip1(p);
            user.deleteBlip2(p);
            user.deleteBlip3(p);
        }
    });
};

fraction.timerCargoWar = function() {
    if (!isCargo)
        return;

    isCargo = false;

    mp.players.forEach(p => {
        if (!user.isLogin(p))
            return;

        if (user.get(p, 'fraction_id2') > 0 && user.has(p, 'isCargo')) {
            user.deleteBlip1(p);
            user.deleteBlip2(p);
            user.deleteBlip3(p);
        }
    });

    mp.vehicles.forEachInDimension(0, v => {
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
    });

    if (!isCargo) {

        methods.notifyWithPictureToFractions2('Борьба за груз', `~r~Конец поставкам`, 'Весь груз был доставлен, ждите следующую партию');

        mp.players.forEach(p => {
            if (!user.isLogin(p))
                return;

            if (user.get(p, 'fraction_id2') > 0) {
                user.deleteBlip1(p);
                user.deleteBlip2(p);
                user.deleteBlip3(p);
            }
        });
    }

    setTimeout(fraction.timerCargoWar, 5000);
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
    user.removeCryptoMoney(player, 100, 'Создание организации');

    setTimeout(function () {
        if (!user.isLogin(player))
            return;
        user.save(player);
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

