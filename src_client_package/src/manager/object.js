import methods from '../modules/methods';
import enums from '../enums';

let object = {};

let loadDist = 150;
let objectList = [];
let iplList = [];
let objectDelList = [];

object.load = function () {
    const start = new Date().getTime();

    enums.customIpl.forEach(item => {
        object.createIpl(item[0], new mp.Vector3(item[1], item[2], item[3]), item[4]);
    });

    // Колонки на заправке LTD Grapeseed
    object.create(-164877493, new mp.Vector3(1690.1, 4927.81, 41.23172), new mp.Vector3(0, 0, -125), false, false);
    object.create(-164877493, new mp.Vector3(1684.59, 4931.65, 41.23172), new mp.Vector3(0, 0, -125), false, false);

    // Удаленные объекты в гараже Arcadius
    object.delete(682074297, -159.213, -577.0652, 31.4243);
    object.delete(765541575, -157.2606, -578.0063, 31.4192);
    object.delete(31071109, -156.353, -577.0887, 31.4192);
    object.delete(765541575, -154.8471, -578.4473, 31.4192);
    object.delete(-2096130282, -154.4395, -577.1686, 32.38988);
    object.delete(1506454359, -155.0695, -577.3192, 32.63888);
    object.delete(-246563715, -158.1, -577.4991, 32.38954);
    object.delete(648185618, -153.6201, -577.7612, 31.42653);
    object.delete(-1784486639, -153.2719, -578.2529, 31.5959);

    // Интерьер Maze Bank Arena
    object.create(1566872341, new mp.Vector3(-252.0165, -2002.122, 29.6), new mp.Vector3(0, 0, -15.59995), false, false);
    object.create(-219578277, new mp.Vector3(-252.43, -2001.81, 29.9), new mp.Vector3(1.001791E-05, 5.008957E-06, -47.99999), false, false);
    object.create(-4948487, new mp.Vector3(-251.5906, -2002.142, 29.875), new mp.Vector3(0, 0, -159.3997), false, false);
    object.create(1152367621, new mp.Vector3(-252.0588, -2002.212, 29.8819), new mp.Vector3(0, 0, -25.99998), false, false);
    object.create(-1814932629, new mp.Vector3(-252.0211, -2002.322, 29.8819), new mp.Vector3(0, 0, -52.99994), false, false);
    object.create(-297480469, new mp.Vector3(-252.2355, -2001.898, 29.8819), new mp.Vector3(0, 0, 140.9996), false, false);
    object.create(-870868698, new mp.Vector3(-258.2263, -2003.512, 29.14564), new mp.Vector3(0, 0, 73.69981), false, false);
    object.create(-870868698, new mp.Vector3(-262.8799, -2013.098, 29.14559), new mp.Vector3(0, 0, 51.59959), false, false);
    object.create(-870868698, new mp.Vector3(-272.8145, -2023.988, 29.14559), new mp.Vector3(0, 0, 36.89944), false, false);
    object.create(144995201, new mp.Vector3(-251.3681, -2001.986, 29.8819), new mp.Vector3(0, 0, -55.99997), false, false);
    object.create(-1510803822, new mp.Vector3(-248.836, -2021.721, 28.94604), new mp.Vector3(0, 0, -40.19993), false, false);
    object.create(-1510803822, new mp.Vector3(-250.8559, -2024.124, 28.94604), new mp.Vector3(0, 0, -40.19996), false, false);
    object.create(-1510803822, new mp.Vector3(-251.765, -2025.206, 28.94604), new mp.Vector3(0, 0, -40.19996), false, false);
    object.create(-1510803822, new mp.Vector3(-249.7391, -2022.783, 28.94604), new mp.Vector3(0, 0, -38.99994), false, false);
    object.create(-1510803822, new mp.Vector3(-252.8401, -2026.481, 28.94604), new mp.Vector3(0, 0, -40.19996), false, false);
    object.create(-1510803822, new mp.Vector3(-254.8995, -2028.932, 28.94604), new mp.Vector3(0, 0, -40.19996), false, false);
    object.create(-1510803822, new mp.Vector3(-253.8613, -2027.697, 28.94604), new mp.Vector3(0, 0, -40.19996), false, false);
    object.create(-1510803822, new mp.Vector3(-255.9588, -2030.205, 28.94604), new mp.Vector3(0, 0, -40.19996), false, false);
    object.create(-1510803822, new mp.Vector3(-258.904, -2033.69, 28.94604), new mp.Vector3(0, 0, -40.19996), false, false);
    object.create(-1510803822, new mp.Vector3(-258.0022, -2032.617, 28.94604), new mp.Vector3(0, 0, -40.19996), false, false);
    object.create(-1510803822, new mp.Vector3(-256.8669, -2031.278, 28.94604), new mp.Vector3(0, 0, -40.19996), false, false);
    object.create(446117594, new mp.Vector3(-252.6071, -2002.094, 29.8819), new mp.Vector3(0, 0, 18.99996), false, false);
    object.create(419741070, new mp.Vector3(-251.5574, -2002.397, 29.8819), new mp.Vector3(0, 0, -35.99998), false, false);

    object.delete(-1126237515, -262.3608, -2012.054, 29.16964);
    object.delete(-1126237515, -273.3665, -2024.208, 29.16964);

    // Стройка на DownTown (Cеверное здание)
    object.create(667319138, new mp.Vector3(-152.5572, -973.0461, 268.1352), new mp.Vector3(0, 0, 70.00006), false, false);
    object.create(667319138, new mp.Vector3(-143.19, -946.334, 263.1339), new mp.Vector3(1.017777E-13, -5.008956E-06, 160), false, false);
    object.create(667319138, new mp.Vector3(-143.962, -972.4, 263.1339), new mp.Vector3(5.008956E-06, -5.008956E-06, -110), false, false);
    object.create(667319138, new mp.Vector3(-143.3905, -957.8922, 263.1339), new mp.Vector3(5.008955E-06, 2.23118E-05, -19.99993), false, false);
    object.create(667319138, new mp.Vector3(-156.8549, -969.8695, 263.1339), new mp.Vector3(0, 0, 70.00006), false, false);
    object.create(667319138, new mp.Vector3(-144.7658, -961.6576, 263.1339), new mp.Vector3(5.008956E-06, 2.23118E-05, -19.99993), false, false);
    object.create(667319138, new mp.Vector3(-153.0588, -971.2097, 263.1339), new mp.Vector3(0, 0, 70.00006), false, false);
    object.create(667319138, new mp.Vector3(-144.5686, -950.0627, 263.1339), new mp.Vector3(1.017777E-13, -5.008956E-06, 160), false, false);
    object.create(667319138, new mp.Vector3(-138.5923, -957.2554, 258.1327), new mp.Vector3(0, 0, 70.00006), false, false);
    object.create(667319138, new mp.Vector3(-150.9606, -972.0338, 258.1327), new mp.Vector3(0, 0, 70.00006), false, false);
    object.create(667319138, new mp.Vector3(-154.7041, -970.6662, 258.1327), new mp.Vector3(0, 0, 70.00006), false, false);
    object.create(667319138, new mp.Vector3(-145.4599, -969.4404, 258.1327), new mp.Vector3(1.017777E-13, -5.008956E-06, 160), false, false);
    object.create(667319138, new mp.Vector3(-144.0922, -965.6717, 258.1327), new mp.Vector3(1.017777E-13, -5.008956E-06, 160), false, false);
    object.create(667319138, new mp.Vector3(-144.8888, -955.1929, 258.1327), new mp.Vector3(5.008956E-06, -5.008956E-06, -110), false, false);
    object.create(667319138, new mp.Vector3(-148.66, -953.8333, 258.1327), new mp.Vector3(5.008956E-06, -5.008956E-06, -110), false, false);
    object.create(667319138, new mp.Vector3(-150.3224, -970.1055, 253.1315), new mp.Vector3(5.008956E-06, -5.008956E-06, -110), false, false);
    object.create(667319138, new mp.Vector3(-154.0854, -968.7345, 253.1315), new mp.Vector3(5.008956E-06, -5.008956E-06, -110), false, false);
    object.create(667319138, new mp.Vector3(-151.991, -947.6589, 253.1315), new mp.Vector3(5.008957E-06, 2.231179E-05, -19.99993), false, false);
    object.create(667319138, new mp.Vector3(-150.6315, -943.8949, 253.1315), new mp.Vector3(5.008958E-06, 2.231179E-05, -19.99993), false, false);
    object.create(667319138, new mp.Vector3(-144.15, -953.0117, 253.1315), new mp.Vector3(5.008956E-06, -5.008956E-06, -110), false, false);
    object.create(667319138, new mp.Vector3(-150.4627, -950.6902, 253.1315), new mp.Vector3(5.008956E-06, -5.008956E-06, -110), false, false);
    object.create(667319138, new mp.Vector3(-144.1992, -965.0032, 253.1315), new mp.Vector3(0, 0, 70.00006), false, false);
    object.create(1925435073, new mp.Vector3(-158.76, -942.28, 115.63), new mp.Vector3(0, 0, -19.99998), false, false);
    object.create(1925435073, new mp.Vector3(-158.79, -942.29, 270.53), new mp.Vector3(0, 0, 160), false, false);
    object.create(1925435073, new mp.Vector3(-158.76, -942.28, 31.38), new mp.Vector3(0, 0, -19.99998), false, false);
    object.create(1925435073, new mp.Vector3(-158.79, -942.29, 31.38), new mp.Vector3(0, 0, 160), false, false);
    object.create(1925435073, new mp.Vector3(-182.22, -1016.46, 115.51), new mp.Vector3(0, 0, -110), false, false);
    object.create(1925435073, new mp.Vector3(-182.21, -1016.42, 31.37), new mp.Vector3(0, 0, 70.09392), false, false);
    object.create(1962326206, new mp.Vector3(-156.7062, -946.9736, 268.1352), new mp.Vector3(0, 0, 170.0938), false, false);
    object.create(1962326206, new mp.Vector3(-155.5352, -943.3564, 268.1352), new mp.Vector3(0, 0, 155.0936), false, false);
    object.create(1962326206, new mp.Vector3(-154.018, -939.8267, 268.1352), new mp.Vector3(0, 0, 175.0933), false, false);
    object.create(-1672689514, new mp.Vector3(-152.0229, -940.0406, 268.1352), new mp.Vector3(0, 0, -24.903), false, false);
    object.create(-1672689514, new mp.Vector3(-157.3094, -949.0589, 268.1352), new mp.Vector3(0, 0, 67.09672), false, false);
    object.create(-1951881617, new mp.Vector3(-155.4206, -943.4492, 113.1366), new mp.Vector3(0, 0, -110.9059), false, false);
    object.create(-1951226014, new mp.Vector3(-180.8983, -1012.624, 113.1366), new mp.Vector3(0, 0, -19.90606), false, false);
    object.create(1867879106, new mp.Vector3(-146.6705, -998.3036, 253.1315), new mp.Vector3(0, 0, 86.99981), false, false);
    object.create(1867879106, new mp.Vector3(-147.8969, -984.6796, 258.2299), new mp.Vector3(0, 0, -108.8), false, false);
    object.create(1867879106, new mp.Vector3(-147.8204, -984.5305, 263.271), new mp.Vector3(0, 0, -108.8), false, false);
    object.create(1867879106, new mp.Vector3(-142.182, -982.5738, 268.2377), new mp.Vector3(0, 0, 114.1999), false, false);
    object.create(1867879106, new mp.Vector3(-150.9086, -941.5202, 268.1352), new mp.Vector3(0, 0, -171.7998), false, false);
    object.create(1867879106, new mp.Vector3(-147.144, -942.1729, 113.1366), new mp.Vector3(0, 0, 172.2002), false, false);
    object.create(1867879106, new mp.Vector3(-144.0376, -963.011, 113.1366), new mp.Vector3(0, 0, 130.1999), false, false);
    object.create(1867879106, new mp.Vector3(-150.4479, -984.6939, 113.1366), new mp.Vector3(0, 0, -94.79985), false, false);
    object.create(1867879106, new mp.Vector3(-153.0053, -1006.198, 113.1366), new mp.Vector3(0, 0, 168.2001), false, false);
    object.create(1867879106, new mp.Vector3(-177.496, -997.6606, 113.1366), new mp.Vector3(0, 0, -119.7997), false, false);
    object.create(1867879106, new mp.Vector3(-160.1077, -971.1824, 113.1366), new mp.Vector3(0, 0, 17.20038), false, false);
    object.create(1925435073, new mp.Vector3(-182.22, -1016.46, 31.37), new mp.Vector3(0, 0, -110), false, false);
    object.create(1925435073, new mp.Vector3(-182.21, -1016.42, 115.51), new mp.Vector3(0, 0, 70.09389), false, false);
    object.create(1925435073, new mp.Vector3(-158.79, -942.29, 115.63), new mp.Vector3(0, 0, 160), false, false);
    object.create(1925435073, new mp.Vector3(-158.76, -942.28, 270.53), new mp.Vector3(0, 0, -19.99998), false, false);
// Стройка на Alta (Южное здание)
    object.create(309416120, new mp.Vector3(15.74857, -424.2195, 44.56396), new mp.Vector3(-4.07111E-13, -5.008956E-06, 70.00001), false, false);
    object.create(309416120, new mp.Vector3(44.91493, -392.0058, 44.56373), new mp.Vector3(5.008954E-06, 2.23118E-05, -110), false, false);
    object.create(309416120, new mp.Vector3(28.58949, -426.7583, 44.56396), new mp.Vector3(-4.46236E-05, 2.23118E-05, -20), false, false);
    object.create(309416120, new mp.Vector3(53.13667, -379.223, 44.56424), new mp.Vector3(-4.462359E-05, -6.329292E-05, 160), false, false);
    object.create(309416120, new mp.Vector3(53.77081, -379.3014, 63.80591), new mp.Vector3(-4.462359E-05, -6.329292E-05, 160), false, false);
    object.create(309416120, new mp.Vector3(31.95427, -381.9546, 54.28927), new mp.Vector3(5.008954E-06, 2.23118E-05, -110), false, false);
    object.create(309416120, new mp.Vector3(38.47226, -373.7392, 54.28927), new mp.Vector3(-4.46236E-05, 2.23118E-05, -20), false, false);
    object.create(309416120, new mp.Vector3(32.2823, -380.6179, 63.80509), new mp.Vector3(-4.07111E-13, -5.008956E-06, 70.00001), false, false);
    object.create(309416120, new mp.Vector3(35.71803, -438.1096, 54.28996), new mp.Vector3(-4.07111E-13, -5.008956E-06, 70.00001), false, false);
    object.create(309416120, new mp.Vector3(25.27581, -446.699, 54.28996), new mp.Vector3(-4.462359E-05, -6.329292E-05, 160), false, false);
    object.create(309416120, new mp.Vector3(28.18129, -438.702, 64.035), new mp.Vector3(5.008954E-06, 2.23118E-05, -110), false, false);
    object.create(309416120, new mp.Vector3(30.57405, -444.622, 64.035), new mp.Vector3(-4.46236E-05, 2.23118E-05, -20), false, false);
    object.create(309416120, new mp.Vector3(28.20287, -448.1382, 72.98136), new mp.Vector3(-4.462359E-05, -6.329292E-05, 160), false, false);
    object.create(309416120, new mp.Vector3(32.83206, -388.4723, 72.94795), new mp.Vector3(-4.07111E-13, -5.008956E-06, 70.00001), false, false);
    object.create(309416120, new mp.Vector3(107.0913, -369.3398, 54.50181), new mp.Vector3(5.008954E-06, 2.23118E-05, -110), false, false);
    object.create(309416120, new mp.Vector3(80.43315, -330.5084, 54.51336), new mp.Vector3(-4.46236E-05, 2.23118E-05, -20), false, false);
    object.create(309416120, new mp.Vector3(65.97516, -345.7104, 54.51337), new mp.Vector3(-4.462359E-05, -6.329292E-05, 160), false, false);
    object.create(309416120, new mp.Vector3(110.1771, -358.349, 54.50181), new mp.Vector3(-4.07111E-13, -5.008956E-06, 70.00001), false, false);
    object.create(309416120, new mp.Vector3(67.98327, -331.9595, 66.20216), new mp.Vector3(-4.07111E-13, -5.008956E-06, 70.00001), false, false);
    object.create(309416120, new mp.Vector3(109.7264, -364.213, 66.31776), new mp.Vector3(5.008954E-06, 2.23118E-05, -110), false, false);
    object.create(309416120, new mp.Vector3(66.5659, -344.9088, 66.20216), new mp.Vector3(-4.462359E-05, -6.329292E-05, 160), false, false);
    object.create(309416120, new mp.Vector3(120.5594, -358.2233, 66.17326), new mp.Vector3(-4.46236E-05, 2.23118E-05, -20), false, false);
    object.create(1867879106, new mp.Vector3(35.09442, -438.6052, 73.19566), new mp.Vector3(0, 0, 154.6997), false, false);
    object.create(1867879106, new mp.Vector3(26.50756, -434.6695, 64.035), new mp.Vector3(0, 0, -124.0002), false, false);
    object.create(1867879106, new mp.Vector3(27.01027, -419.4724, 54.28996), new mp.Vector3(0, 0, 10.50007), false, false);
    object.create(1867879106, new mp.Vector3(49.02978, -418.225, 44.50563), new mp.Vector3(0, 0, -102.9997), false, false);
    object.create(1867879106, new mp.Vector3(42.49611, -402.7191, 54.28996), new mp.Vector3(0, 0, -35.2995), false, false);
    object.create(1867879106, new mp.Vector3(53.83488, -399.106, 63.80647), new mp.Vector3(0, 0, 49.0004), false, false);
    object.create(1867879106, new mp.Vector3(53.5691, -402.9681, 72.94704), new mp.Vector3(0, 0, 55.9003), false, false);
    object.create(-250952474, new mp.Vector3(47.52, -420.46, 71.93), new mp.Vector3(-2.75007, -5.021702E-06, -20.09997), false, false);
// Стройка на Alta2 (Северное здание)
    object.create(309416120, new mp.Vector3(15.74857, -424.2195, 44.56396), new mp.Vector3(-4.07111E-13, -5.008956E-06, 70.00001), false, false);
    object.create(309416120, new mp.Vector3(44.91493, -392.0058, 44.56373), new mp.Vector3(5.008954E-06, 2.23118E-05, -110), false, false);
    object.create(309416120, new mp.Vector3(28.58949, -426.7583, 44.56396), new mp.Vector3(-4.46236E-05, 2.23118E-05, -20), false, false);
    object.create(309416120, new mp.Vector3(53.13667, -379.223, 44.56424), new mp.Vector3(-4.462359E-05, -6.329292E-05, 160), false, false);
    object.create(309416120, new mp.Vector3(53.77081, -379.3014, 63.80591), new mp.Vector3(-4.462359E-05, -6.329292E-05, 160), false, false);
    object.create(309416120, new mp.Vector3(31.95427, -381.9546, 54.28927), new mp.Vector3(5.008954E-06, 2.23118E-05, -110), false, false);
    object.create(309416120, new mp.Vector3(38.47226, -373.7392, 54.28927), new mp.Vector3(-4.46236E-05, 2.23118E-05, -20), false, false);
    object.create(309416120, new mp.Vector3(32.2823, -380.6179, 63.80509), new mp.Vector3(-4.07111E-13, -5.008956E-06, 70.00001), false, false);
    object.create(309416120, new mp.Vector3(35.71803, -438.1096, 54.28996), new mp.Vector3(-4.07111E-13, -5.008956E-06, 70.00001), false, false);
    object.create(309416120, new mp.Vector3(25.27581, -446.699, 54.28996), new mp.Vector3(-4.462359E-05, -6.329292E-05, 160), false, false);
    object.create(309416120, new mp.Vector3(28.18129, -438.702, 64.035), new mp.Vector3(5.008954E-06, 2.23118E-05, -110), false, false);
    object.create(309416120, new mp.Vector3(30.57405, -444.622, 64.035), new mp.Vector3(-4.46236E-05, 2.23118E-05, -20), false, false);
    object.create(309416120, new mp.Vector3(28.20287, -448.1382, 72.98136), new mp.Vector3(-4.462359E-05, -6.329292E-05, 160), false, false);
    object.create(309416120, new mp.Vector3(32.83206, -388.4723, 72.94795), new mp.Vector3(-4.07111E-13, -5.008956E-06, 70.00001), false, false);
    object.create(309416120, new mp.Vector3(107.0913, -369.3398, 54.50181), new mp.Vector3(5.008954E-06, 2.23118E-05, -110), false, false);
    object.create(309416120, new mp.Vector3(80.43315, -330.5084, 54.51336), new mp.Vector3(-4.46236E-05, 2.23118E-05, -20), false, false);
    object.create(309416120, new mp.Vector3(65.97516, -345.7104, 54.51337), new mp.Vector3(-4.462359E-05, -6.329292E-05, 160), false, false);
    object.create(309416120, new mp.Vector3(110.1771, -358.349, 54.50181), new mp.Vector3(-4.07111E-13, -5.008956E-06, 70.00001), false, false);
    object.create(309416120, new mp.Vector3(67.98327, -331.9595, 66.20216), new mp.Vector3(-4.07111E-13, -5.008956E-06, 70.00001), false, false);
    object.create(309416120, new mp.Vector3(109.7264, -364.213, 66.31776), new mp.Vector3(5.008954E-06, 2.23118E-05, -110), false, false);
    object.create(309416120, new mp.Vector3(66.5659, -344.9088, 66.20216), new mp.Vector3(-4.462359E-05, -6.329292E-05, 160), false, false);
    object.create(309416120, new mp.Vector3(120.5594, -358.2233, 66.17326), new mp.Vector3(-4.46236E-05, 2.23118E-05, -20), false, false);
    object.create(1867879106, new mp.Vector3(114.2779, -363.8434, 54.50181), new mp.Vector3(0, 0, 40.70032), false, false);
    object.create(1867879106, new mp.Vector3(97.5201, -346.5287, 66.14909), new mp.Vector3(0, 0, -99.29946), false, false);
// Строительные объекты в Миррор-Парке
    object.create(-226179982, new mp.Vector3(1203.43, -649.6365, 61.08), new mp.Vector3(0.3822106, 3.968742, -78.31068), false, false);
    object.create(-519102073, new mp.Vector3(1201.87, -642.01, 63.49965), new mp.Vector3(0.3365201, 1.909037, -80.00753), false, false);
    object.create(-226179982, new mp.Vector3(1200.6, -635.64, 61.84719), new mp.Vector3(0.3826362, 2.895059, -78.30349), false, false);
    object.create(-226179982, new mp.Vector3(935.19, -569.13, 57.06), new mp.Vector3(0.3827626, -2.589476, 28.05701), false, false);
    object.create(-226179982, new mp.Vector3(947.68, -562.55, 57.6), new mp.Vector3(0.3830457, -1.227684, 28.04785), false, false);
    object.create(-226179982, new mp.Vector3(1042.26, -407.24, 65.31), new mp.Vector3(0, 0, 38.62275), false, false);
    object.create(-519102073, new mp.Vector3(1047.27, -403.32, 67.44314), new mp.Vector3(0, 0, 36.94094), false, false);
    object.create(-226179982, new mp.Vector3(1053.1, -397.95, 65.85), new mp.Vector3(0, 0, 38.63196), false, false);

    // Int 1
    object.create(2079702193, new mp.Vector3(1975.56, 3822.615, 34.21246), new mp.Vector3(1.001791E-05, 5.008956E-06, 30.0498), false, false);
    object.create(2079702193, new mp.Vector3(1978.14, 3818.533, 34.21576), new mp.Vector3(1.00179E-05, 5.008956E-06, -149.9994), false, false);
    object.create(2079702193, new mp.Vector3(1975.25, 3816.847, 34.59501), new mp.Vector3(1.00179E-05, 5.008956E-06, -149.9994), false, false);
    object.create(2079702193, new mp.Vector3(1977.93, 3822.51, 34.15), new mp.Vector3(-14.69982, 0.2406464, -60.07864), false, false);
    object.create(2079702193, new mp.Vector3(1978.92, 3820.79, 34.15), new mp.Vector3(-14.69982, 0.240646, -60.07864), false, false);
    object.create(2079702193, new mp.Vector3(1979.1, 3820.486, 34.15), new mp.Vector3(-14.69982, 0.2406473, -60.07863), false, false);

// Int 4
    object.create(1404517486, new mp.Vector3(264.59, -995.83, -97.3), new mp.Vector3(0, 0, 0), false, false);
    object.create(1404517486, new mp.Vector3(264.59, -996.74, -97.3), new mp.Vector3(0, 0, 0), false, false);
    object.create(1556826721, new mp.Vector3(258.36, -994.7146, -100.0086), new mp.Vector3(0, 0, -29.99981), false, false);
    object.create(2004890126, new mp.Vector3(256.28, -998.28, -100.0086), new mp.Vector3(0, 0, 123.9997), false, false);
    object.create(630784631, new mp.Vector3(262.6944, -1001.486, -98.24239), new mp.Vector3(0, 0, 179.9996), false, false);
    object.create(-1884999004, new mp.Vector3(261.48, -997.8755, -99.78), new mp.Vector3(0, 0, 8.999984), false, false);
    object.create(1398355146, new mp.Vector3(265.78, -1001.55, -98.85782), new mp.Vector3(0, 0, 0), false, false);

// Int 5
    object.create(-1113453233, new mp.Vector3(-1152.59, -1523.245, 10.95272), new mp.Vector3(1.017777E-12, -5.008956E-06, -145.0245), false, false);
    object.create(-856584171, new mp.Vector3(-1148.74, -1513.23, 9.682452), new mp.Vector3(1.001789E-05, 5.008956E-06, -10.00001), false, false);
    object.create(-1350614541, new mp.Vector3(-1156.203, -1525.353, 9.631849), new mp.Vector3(0, 0, -124.0001), false, false);
    object.create(-1113453233, new mp.Vector3(-1161.52, -1521.869, 9.8), new mp.Vector3(1.001791E-05, 5.008956E-06, 124.98), false, false);
    object.create(-1113453233, new mp.Vector3(-1161.52, -1521.869, 10.99), new mp.Vector3(1.001791E-05, 5.008956E-06, 124.98), false, false);
    object.create(-1113453233, new mp.Vector3(-1161.79, -1521.49, 12), new mp.Vector3(1.001791E-05, 5.008956E-06, 124.98), false, false);
    object.create(-1113453233, new mp.Vector3(-1161.79, -1521.49, 9.63), new mp.Vector3(1.001791E-05, 5.008956E-06, 124.98), false, false);
    object.create(-1113453233, new mp.Vector3(-1161.79, -1521.49, 10.81), new mp.Vector3(1.001791E-05, 5.008956E-06, 124.98), false, false);
    object.create(-1113453233, new mp.Vector3(-1158.99, -1525.48, 9.81), new mp.Vector3(1.001791E-05, 5.008956E-06, 124.98), false, false);
    object.create(-1113453233, new mp.Vector3(-1158.99, -1525.48, 11), new mp.Vector3(1.001791E-05, 5.008956E-06, 124.98), false, false);
    object.create(-1113453233, new mp.Vector3(-1160.16, -1523.807, 9.81), new mp.Vector3(1.001791E-05, 5.008956E-06, 124.98), false, false);
    object.create(-1113453233, new mp.Vector3(-1160.16, -1523.807, 11), new mp.Vector3(1.001791E-05, 5.008956E-06, 124.98), false, false);
    object.create(-1113453233, new mp.Vector3(-1157.07, -1516.08, 10.37), new mp.Vector3(5.008956E-06, -5.008956E-06, 34.97549), false, false);
    object.create(-1113453233, new mp.Vector3(-1157.07, -1516.08, 11.56), new mp.Vector3(5.008955E-06, -5.008955E-06, 34.97549), false, false);
    object.create(-1113453233, new mp.Vector3(-1146.44, -1511.069, 9.8), new mp.Vector3(2.035555E-13, -5.008955E-06, -55.02429), false, false);
    object.create(-1113453233, new mp.Vector3(-1146.44, -1511.069, 10.99), new mp.Vector3(2.035555E-13, -5.008955E-06, -55.02429), false, false);
    object.create(-1113453233, new mp.Vector3(-1145.31, -1512.73, 9.8), new mp.Vector3(2.035555E-13, -5.008955E-06, -55.02429), false, false);
    object.create(-1113453233, new mp.Vector3(-1145.31, -1512.73, 10.99), new mp.Vector3(2.035555E-13, -5.008955E-06, -55.02429), false, false);
    object.create(-936729545, new mp.Vector3(-1161.6, -1521.76, 10.57), new mp.Vector3(1.001791E-05, -5.008957E-06, -55.02488), false, false);
    object.create(-936729545, new mp.Vector3(-1161.605, -1521.76, 11.05), new mp.Vector3(1.001791E-05, -5.008957E-06, -55.02487), false, false);
    object.create(-936729545, new mp.Vector3(-1159.13, -1525.29, 10.58), new mp.Vector3(1.00179E-05, -5.008956E-06, -55.07461), false, false);
    object.create(-936729545, new mp.Vector3(-1159.13, -1525.29, 11.05), new mp.Vector3(1.00179E-05, -5.008956E-06, -55.07461), false, false);
    object.create(-936729545, new mp.Vector3(-1146.403, -1511.13, 10.56), new mp.Vector3(1.001791E-05, -5.008945E-06, 124.8749), false, false);
    object.create(-936729545, new mp.Vector3(-1146.405, -1511.13, 11.04), new mp.Vector3(1.001791E-05, -5.008945E-06, 124.8749), false, false);
    object.create(-936729545, new mp.Vector3(-1156.95, -1516.02, 11.16), new mp.Vector3(1.001791E-05, -5.008937E-06, -144.925), false, false);
    object.create(-936729545, new mp.Vector3(-1152.6, -1523.22, 11.23657), new mp.Vector3(1.001789E-05, 5.008955E-06, 35.10036), false, false);
    object.create(1055533654, new mp.Vector3(-1151.98, -1521.43, 10.53337), new mp.Vector3(0, 0, 130), false, false);

    object.delete(1333481871, -1147.072, -1513.776, 10.40341);
    object.delete(1258923146, -1149.182, -1513.149, 9.654871);
    object.delete(797240705, -1149.215, -1512.77, 9.654378);
    object.delete(492521774, -1149.632, -1512.585, 9.655569);
    object.delete(32477783, -1150.278, -1512.184, 10.41471);
    object.delete(419020243, -1147.349, -1513.848, 10.41411);
    object.delete(1319414056, -1147.431, -1514.007, 10.49785);
    object.delete(1013548210, -1147.834, -1514.223, 10.41915);
    object.delete(827254092, -1144.454, -1515.907, 10.08414);
    object.delete(-1077568635, -1143.784, -1515.831, 10.03522);
    object.delete(1319414056, -1161.492, -1520.295, 10.25615);
    object.delete(419020243, -1161.181, -1519.775, 10.25615);
    object.delete(1160787715, -1158.4, -1523.117, 10.54145);
    object.delete(520088227, -1158.26, -1523.191, 10.53249);
    object.delete(1560277278, -1156.226, -1522.208, 10.32687);

// Int 6
    object.create(1978613345, new mp.Vector3(351.479, -996.0478, -100.1962), new mp.Vector3(0, 0, 0), false, false);
    object.create(1978613345, new mp.Vector3(350.53, -996.05, -100.1961), new mp.Vector3(0, 0, 0), false, false);
    object.create(951345131, new mp.Vector3(350.8078, -994.3985, -100.08), new mp.Vector3(1.001785E-05, 5.008952E-06, -132.5001), false, false);
    object.create(2057223314, new mp.Vector3(352.1311, -993.4043, -100.12), new mp.Vector3(0, 0, -36.99995), false, false);
    object.create(-978849650, new mp.Vector3(337.51, -996.68, -99.55), new mp.Vector3(0, 0, -90.00005), false, false);
    object.create(1881864012, new mp.Vector3(341.6673, -996.1204, -99.65), new mp.Vector3(0, 0, -62.99994), false, false);
    object.create(-807401144, new mp.Vector3(341.3907, -996.1807, -99.65697), new mp.Vector3(0, 0, 69.99995), false, false);
    object.create(470212711, new mp.Vector3(341.99, -1004.06, -99.21622), new mp.Vector3(0, 0, 54.99997), false, false);
    object.create(-331509782, new mp.Vector3(342.3735, -1004.137, -99.16), new mp.Vector3(0, 0, 29.99998), false, false);
    object.create(1319392426, new mp.Vector3(342.251, -1004.089, -99.16), new mp.Vector3(0, 0, 104.9999), false, false);
    object.create(-2037843699, new mp.Vector3(341.6503, -1003.813, -99.16), new mp.Vector3(0, 0, 104.9999), false, false);
    object.create(477649989, new mp.Vector3(342.39, -1003.78, -99.21622), new mp.Vector3(1.001788E-05, -5.008956E-06, -179.4498), false, false);
    object.create(-1246711311, new mp.Vector3(352.7462, -992.9322, -100.1962), new mp.Vector3(0, 0, -79.99947), false, false);
    object.create(-2044627725, new mp.Vector3(343.22, -994, -99.71), new mp.Vector3(0, 0, 74.99995), false, false);
    object.create(-1328202619, new mp.Vector3(348.0154, -1002.648, -100.1962), new mp.Vector3(0, 0, 0), false, false);
    object.create(-1769322543, new mp.Vector3(348.7386, -995.0312, -99.43916), new mp.Vector3(0, 0, 21.89992), false, false);
    object.create(-1884999004, new mp.Vector3(343.0679, -998.2321, -99.97), new mp.Vector3(0, 0, 0), false, false);
    object.create(-1989035681, new mp.Vector3(350.644, -999.722, -99.2), new mp.Vector3(0, 0, -166.0001), false, false);
    object.create(-364924791, new mp.Vector3(339.4279, -1003.846, -99.27671), new mp.Vector3(0, -5.008956E-06, -180), false, false);
    object.create(-331509782, new mp.Vector3(339.3438, -995.3307, -99.65813), new mp.Vector3(0, 0, 14.99997), false, false);
    object.create(-331509782, new mp.Vector3(339.5025, -995.2882, -99.65813), new mp.Vector3(0, 0, 144.9998), false, false);
    object.create(-1540767983, new mp.Vector3(351.9503, -999.8756, -99.25986), new mp.Vector3(0, 0, 2.599953), false, false);
    object.create(1398355146, new mp.Vector3(345.86, -1003.03, -99.04), new mp.Vector3(0, -5.008956E-06, -180), false, false);

    object.delete(492521774, 341.5645, -995.9878, -99.65434);
    object.delete(-664859048, 352.6909, -993.5197, -100.2083);
    object.delete(32477783, 341.602, -995.6356, -99.65398);
    object.delete(996113921, 341.5686, -996.3506, -99.63911);
    object.delete(1356866689, 341.6109, -995.6426, -99.62861);
    object.delete(-1158929576, 341.2068, -995.6591, -99.60791);
    object.delete(-502099890, 341.1056, -996.3447, -99.59258);
    object.delete(270388964, 341.6335, -996.7438, -99.65703);
    object.delete(-1264675346, 339.9229, -1001.782, -99.39119);
    object.delete(1160787715, 338.8171, -1001.489, -99.3647);
    object.delete(520088227, 339.4384, -1001.095, -99.37474);
    object.delete(-1264675346, 351.8941, -1000.098, -99.18714);
    object.delete(-1533900808, 341.9066, -1001.67, -99.23304);
    object.delete(-807401144, 341.8589, -1000.846, -99.31647);
    object.delete(-664859048, 345.3659, -992.827, -100.2083);
    object.delete(97410561, 345.5305, -1002.223, -99.30497);

// Int 7
    object.create(2079702193, new mp.Vector3(-10.29, -1442.83, 31.15963), new mp.Vector3(1.001791E-05, 5.008956E-06, -179.6995), false, false);
    object.create(2079702193, new mp.Vector3(-10.29, -1442.83, 31.98463), new mp.Vector3(1.001791E-05, 5.008956E-06, -179.6995), false, false);
    object.create(2079702193, new mp.Vector3(-10.36, -1426.92, 31.77), new mp.Vector3(1.001791E-05, 5.008956E-06, 0.3004003), false, false);
    object.create(2079702193, new mp.Vector3(-13.56, -1441.16, 31.28), new mp.Vector3(0, -5.008956E-06, -180), false, false);
    object.create(2079702193, new mp.Vector3(-13.56, -1441.16, 32.03001), new mp.Vector3(0, -5.008956E-06, -180), false, false);
    object.create(2079702193, new mp.Vector3(-14.91, -1441.16, 32.03001), new mp.Vector3(0, -5.008956E-06, -180), false, false);
    object.create(2079702193, new mp.Vector3(-14.91, -1441.16, 31.205), new mp.Vector3(0, -5.008956E-06, -180), false, false);
    object.create(506946533, new mp.Vector3(-14.92, -1427.13, 31.4), new mp.Vector3(1.001785E-05, 5.008956E-06, -6.899237), false, false);
    object.create(246006942, new mp.Vector3(-14.6, -1427.1, 31.38808), new mp.Vector3(0, 0, 0), false, false);
    object.create(687012144, new mp.Vector3(-14.23, -1427.1, 31.3), new mp.Vector3(0, 0, 13.99999), false, false);
    object.create(-1856393901, new mp.Vector3(-14.55637, -1427.31, 30.59), new mp.Vector3(-18.00005, -5.330159E-06, 1.750024), false, false);

// Int 8
    object.create(-1154592059, new mp.Vector3(-8.15, 513.5, 173.6282), new mp.Vector3(0, 0, -29.31598), true, false);
    object.create(2079702193, new mp.Vector3(15.24, 537.2923, 174.27), new mp.Vector3(1.00179E-05, -5.008956E-06, -155.0239), false, false);
    object.create(2079702193, new mp.Vector3(15.24, 537.2923, 175.38), new mp.Vector3(1.00179E-05, -5.008956E-06, -155.0239), false, false);
    object.create(2079702193, new mp.Vector3(15.24, 537.2923, 176.355), new mp.Vector3(1.00179E-05, -5.008956E-06, -155.0239), false, false);
    object.create(2079702193, new mp.Vector3(14.07, 527.38, 174.2382), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(14.07, 527.38, 175.34), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(14.07, 527.38, 176.44), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(12.68, 526.7334, 174.2382), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(12.68, 526.7334, 175.33), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(12.68, 526.7334, 176.43), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(10.91, 525.79, 174.2382), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(10.91, 525.79, 175.34), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(10.91, 525.79, 176.44), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(9.57, 525.17, 174.2382), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(9.57, 525.17, 175.35), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(9.57, 525.17, 176.46), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(6.86, 524.02, 174.2382), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(6.86, 524.02, 175.34), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(6.86, 524.02, 176.44), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(5.06, 523.18, 174.2382), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(5.06, 523.18, 175.34), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(5.06, 523.18, 176.45), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(5.02, 523.16, 174.2382), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(5.02, 523.16, 175.34), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(5.02, 523.16, 176.24), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(3.19, 522.19, 174.2382), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(3.19, 522.19, 175.34), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(3.19, 522.19, 176.43), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(1.39, 521.35, 174.2382), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(1.39, 521.35, 175.35), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(1.39, 521.35, 176.46), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(1.35, 521.33, 174.2382), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(1.35, 521.33, 175.34), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(1.35, 521.33, 176.44), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(-2.83, 518.67, 174.24), new mp.Vector3(1.831999E-12, -5.008956E-06, -119.3748), false, false);
    object.create(2079702193, new mp.Vector3(-2.83, 518.67, 175.35), new mp.Vector3(1.831999E-12, -5.008956E-06, -119.3748), false, false);
    object.create(2079702193, new mp.Vector3(-2.83, 518.67, 176.45), new mp.Vector3(1.250441E-09, -5.008956E-06, -119.3748), false, false);
    object.create(2079702193, new mp.Vector3(-3.800568, 516.94, 174.24), new mp.Vector3(1.831999E-12, -5.008956E-06, -119.3748), false, false);
    object.create(2079702193, new mp.Vector3(-3.800568, 516.94, 175.35), new mp.Vector3(1.831999E-12, -5.008956E-06, -119.3748), false, false);
    object.create(2079702193, new mp.Vector3(-3.800568, 516.94, 176.46), new mp.Vector3(1.831999E-12, -5.008956E-06, -119.3748), false, false);
    object.create(2079702193, new mp.Vector3(-4.89, 515.21, 174.24), new mp.Vector3(1.831999E-12, -5.008956E-06, -119.3748), false, false);
    object.create(2079702193, new mp.Vector3(-4.89, 515.21, 175.34), new mp.Vector3(1.831999E-12, -5.008956E-06, -119.3748), false, false);
    object.create(2079702193, new mp.Vector3(-4.89, 515.21, 176.44), new mp.Vector3(1.831999E-12, -5.008956E-06, -119.3748), false, false);
    object.create(2079702193, new mp.Vector3(-5.86, 513.48, 174.24), new mp.Vector3(1.831999E-12, -5.008956E-06, -119.3748), false, false);
    object.create(2079702193, new mp.Vector3(-5.86, 513.48, 175.35), new mp.Vector3(1.831999E-12, -5.008956E-06, -119.3748), false, false);
    object.create(2079702193, new mp.Vector3(-5.86, 513.48, 176.46), new mp.Vector3(1.831999E-12, -5.008956E-06, -119.3748), false, false);
    object.create(2079702193, new mp.Vector3(-10.84, 514.89, 174.28), new mp.Vector3(1.001791E-05, 5.008956E-06, 150.5997), false, false);
    object.create(2079702193, new mp.Vector3(-10.84, 514.89, 175.37), new mp.Vector3(1.001791E-05, 5.008956E-06, 150.5997), false, false);
    object.create(2079702193, new mp.Vector3(-10.84, 514.89, 176.48), new mp.Vector3(1.001791E-05, 5.008956E-06, 150.5997), false, false);
    object.create(2079702193, new mp.Vector3(-12.57, 515.865, 174.28), new mp.Vector3(1.001791E-05, 5.008956E-06, 150.5997), false, false);
    object.create(2079702193, new mp.Vector3(-12.57, 515.865, 175.39), new mp.Vector3(1.001791E-05, 5.008956E-06, 150.5997), false, false);
    object.create(2079702193, new mp.Vector3(-12.57, 515.865, 176.5), new mp.Vector3(1.001791E-05, 5.008956E-06, 150.5997), false, false);
    object.create(2079702193, new mp.Vector3(-12.68, 515.93, 174.28), new mp.Vector3(1.001791E-05, 5.008956E-06, 150.5997), false, false);
    object.create(2079702193, new mp.Vector3(-12.68, 515.93, 175.37), new mp.Vector3(1.001791E-05, 5.008956E-06, 150.5997), false, false);
    object.create(2079702193, new mp.Vector3(-12.68, 515.93, 176.47), new mp.Vector3(1.001791E-05, 5.008956E-06, 150.5997), false, false);
    object.create(2079702193, new mp.Vector3(-8.98, 513.95, 174.28), new mp.Vector3(1.001791E-05, 5.008956E-06, 150.5997), false, false);
    object.create(2079702193, new mp.Vector3(-8.98, 513.95, 175.39), new mp.Vector3(1.001791E-05, 5.008956E-06, 150.5997), false, false);
    object.create(2079702193, new mp.Vector3(-8.98, 513.95, 176.5), new mp.Vector3(1.001791E-05, 5.008956E-06, 150.5997), false, false);
    object.create(2079702193, new mp.Vector3(-7.29, 513, 174.28), new mp.Vector3(1.001791E-05, 5.008956E-06, 150.5997), false, false);
    object.create(2079702193, new mp.Vector3(-7.29, 513, 175.38), new mp.Vector3(1.001791E-05, 5.008956E-06, 150.5997), false, false);
    object.create(2079702193, new mp.Vector3(-7.29, 513, 176.49), new mp.Vector3(1.001791E-05, 5.008956E-06, 150.5997), false, false);
    object.create(2079702193, new mp.Vector3(12.99, 533.9, 174.2336), new mp.Vector3(1.001791E-05, -5.008955E-06, -65.02461), false, false);
    object.create(2079702193, new mp.Vector3(12.99, 533.9, 175.34), new mp.Vector3(1.001791E-05, -5.008955E-06, -65.02461), false, false);
    object.create(2079702193, new mp.Vector3(12.99, 533.9, 176.44), new mp.Vector3(1.001791E-05, -5.008955E-06, -65.02461), false, false);
    object.create(2079702193, new mp.Vector3(13.52, 532.7679, 174.2336), new mp.Vector3(1.001791E-05, -5.008955E-06, -65.02461), false, false);
    object.create(2079702193, new mp.Vector3(13.52, 532.7679, 175.34), new mp.Vector3(1.001791E-05, -5.008955E-06, -65.02461), false, false);
    object.create(2079702193, new mp.Vector3(13.52, 532.7679, 176.44), new mp.Vector3(1.001791E-05, -5.008955E-06, -65.02461), false, false);
    object.create(2079702193, new mp.Vector3(14.31, 530.84, 174.2336), new mp.Vector3(1.001791E-05, -5.008955E-06, -65.02461), false, false);
    object.create(2079702193, new mp.Vector3(14.31, 530.84, 175.34), new mp.Vector3(1.001791E-05, -5.008955E-06, -65.02461), false, false);
    object.create(2079702193, new mp.Vector3(14.31, 530.84, 176.44), new mp.Vector3(1.001791E-05, -5.008955E-06, -65.02461), false, false);
    object.create(2079702193, new mp.Vector3(14.91, 529.55, 174.2336), new mp.Vector3(1.001791E-05, -5.008955E-06, -65.02461), false, false);
    object.create(2079702193, new mp.Vector3(14.91, 529.55, 175.34), new mp.Vector3(1.001791E-05, -5.008955E-06, -65.02461), false, false);
    object.create(2079702193, new mp.Vector3(14.91, 529.55, 176.39), new mp.Vector3(1.001791E-05, -5.008955E-06, -65.02461), false, false);
    object.create(2079702193, new mp.Vector3(10.82, 525.85, 170.28), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(10.82, 525.85, 171.38), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(10.82, 525.85, 172.49), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(9.49, 525.23, 170.28), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(9.49, 525.23, 171.38), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(9.49, 525.23, 172.48), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(6.9, 523.94, 170.28), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(6.9, 523.94, 171.39), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(6.9, 523.94, 172.5), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(5.14, 523.12, 170.28), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(5.14, 523.12, 171.38), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(5.14, 523.12, 172.48), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(-1154592059, new mp.Vector3(2.14, 521.84, 169.63), new mp.Vector3(0, 0, 24.88396), false, false);
    object.create(-1154592059, new mp.Vector3(2.15, 521.84, 169.73), new mp.Vector3(0, 0, 24.88396), false, false);
    object.create(2079702193, new mp.Vector3(4.37, 522.87, 170.29), new mp.Vector3(1.001791E-05, -5.008956E-06, -155.0237), false, false);
    object.create(2079702193, new mp.Vector3(4.37, 522.87, 171.4), new mp.Vector3(1.001791E-05, -5.008956E-06, -155.0237), false, false);
    object.create(2079702193, new mp.Vector3(4.37, 522.87, 172.51), new mp.Vector3(1.001791E-05, -5.008956E-06, -155.0237), false, false);
    object.create(2079702193, new mp.Vector3(2.57, 522.03, 170.29), new mp.Vector3(1.001791E-05, -5.008956E-06, -155.0237), false, false);
    object.create(2079702193, new mp.Vector3(2.57, 522.03, 171.4), new mp.Vector3(1.001791E-05, -5.008956E-06, -155.0237), false, false);
    object.create(2079702193, new mp.Vector3(2.57, 522.03, 172.5), new mp.Vector3(1.001791E-05, -5.008956E-06, -155.0237), false, false);
    object.create(2079702193, new mp.Vector3(0.81, 521.2136, 170.29), new mp.Vector3(1.001791E-05, -5.008956E-06, -155.0237), false, false);
    object.create(2079702193, new mp.Vector3(0.81, 521.2136, 171.4), new mp.Vector3(1.001791E-05, -5.008956E-06, -155.0237), false, false);
    object.create(2079702193, new mp.Vector3(0.81, 521.2136, 172.48), new mp.Vector3(1.001791E-05, -5.008956E-06, -155.0237), false, false);

    object.delete(-1154592059, -9.796242, 514.4293, 173.6281);

// Int 9
    object.create(2079702193, new mp.Vector3(-793.81, 181.6, 74.58), new mp.Vector3(1.001791E-05, 5.008957E-06, -69.02483), false, false);
    object.create(2079702193, new mp.Vector3(-793.81, 181.6, 73.47), new mp.Vector3(1.001791E-05, 5.008957E-06, -69.02484), false, false);
    object.create(2079702193, new mp.Vector3(-793.81, 181.6, 72.35), new mp.Vector3(1.001791E-05, 5.008955E-06, -69.02483), false, false);
    object.create(2079702193, new mp.Vector3(-793.72, 181.3724, 72.35), new mp.Vector3(1.001791E-05, 5.008955E-06, -69.02483), false, false);
    object.create(2079702193, new mp.Vector3(-793.72, 181.3724, 73.46), new mp.Vector3(1.001791E-05, 5.008955E-06, -69.02483), false, false);
    object.create(2079702193, new mp.Vector3(-793.72, 181.3724, 74.56), new mp.Vector3(1.001791E-05, 5.008955E-06, -69.02483), false, false);
    object.create(2079702193, new mp.Vector3(-795.69, 187.0083, 73.35403), new mp.Vector3(1.001791E-05, 5.008955E-06, -69.02483), false, false);
    object.create(2079702193, new mp.Vector3(-795.69, 187.0083, 74.46), new mp.Vector3(1.001791E-05, 5.008955E-06, -69.02483), false, false);
    object.create(2079702193, new mp.Vector3(-795.48, 177.63, 74.59), new mp.Vector3(1.001783E-05, -5.008956E-06, -158.8983), false, false);
    object.create(2079702193, new mp.Vector3(-795.48, 177.63, 73.5), new mp.Vector3(1.001783E-05, -5.008956E-06, -158.8983), false, false);
    object.create(2079702193, new mp.Vector3(-795.48, 177.63, 72.4), new mp.Vector3(1.001783E-05, -5.008956E-06, -158.8983), false, false);
    object.create(2079702193, new mp.Vector3(-796.34, 177.3059, 72.57), new mp.Vector3(1.001783E-05, -5.008956E-06, -159.0483), false, false);
    object.create(2079702193, new mp.Vector3(-796.34, 177.3059, 73.62), new mp.Vector3(1.001783E-05, -5.008956E-06, -159.0483), false, false);
    object.create(2079702193, new mp.Vector3(-796.34, 177.3059, 74.14498), new mp.Vector3(1.001783E-05, -5.008956E-06, -159.0483), false, false);
    object.create(2079702193, new mp.Vector3(-798.21, 171.0743, 73.23387), new mp.Vector3(1.001791E-05, 5.008955E-06, -69.02483), false, false);
    object.create(2079702193, new mp.Vector3(-798.21, 171.0743, 74.33), new mp.Vector3(1.001791E-05, 5.008955E-06, -69.02483), false, false);
    object.create(2079702193, new mp.Vector3(-798.21, 171.0743, 75.4), new mp.Vector3(1.001791E-05, 5.008955E-06, -69.02483), false, false);
    object.create(2079702193, new mp.Vector3(-799.1232, 168.9022, 73.32), new mp.Vector3(1.001783E-05, -5.008956E-06, -158.8983), false, false);
    object.create(2079702193, new mp.Vector3(-799.1232, 168.9022, 74.42), new mp.Vector3(1.001783E-05, -5.008956E-06, -158.8983), false, false);
    object.create(2079702193, new mp.Vector3(-799.1232, 168.9022, 74.71999), new mp.Vector3(1.001783E-05, -5.008956E-06, -158.8983), false, false);
    object.create(2079702193, new mp.Vector3(-816.73, 181.8873, 73.01957), new mp.Vector3(1.001789E-05, -5.008955E-06, 21.00013), false, false);
    object.create(2079702193, new mp.Vector3(-816.73, 181.8873, 74.12), new mp.Vector3(1.001789E-05, -5.008954E-06, 21.00013), false, false);
    object.create(1019527301, new mp.Vector3(-802.78, 167.61, 77.58), new mp.Vector3(1.001791E-05, 5.008956E-06, 20.94992), false, false);
    object.create(2079702193, new mp.Vector3(-802.31, 167.7864, 76.94), new mp.Vector3(1.001782E-05, -5.008956E-06, -159.0478), false, false);
    object.create(2079702193, new mp.Vector3(-802.31, 167.7864, 78.04), new mp.Vector3(1.001782E-05, -5.008956E-06, -159.0478), false, false);
    object.create(2079702193, new mp.Vector3(-802.31, 167.7864, 78.23), new mp.Vector3(1.001782E-05, -5.008955E-06, -159.0478), false, false);

// Int 10
    object.create(2079702193, new mp.Vector3(-769.26, 344.1094, 211.06), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-769.26, 344.1094, 212.17), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-769.26, 344.1094, 213.29), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-771.25, 344.1094, 211.06), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-771.25, 344.1094, 212.17), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-771.25, 344.1094, 213.29), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-773.24, 344.1094, 211.06), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-773.24, 344.1094, 212.17), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-773.24, 344.1094, 213.29), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-775.29, 344.1094, 211.06), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-775.29, 344.1094, 212.17), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-775.29, 344.1094, 213.29), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-777.27, 344.1094, 211.06), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-777.27, 344.1094, 212.17), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-777.27, 344.1094, 213.29), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-786.42, 342.47, 210.85), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-786.42, 342.47, 211.96), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-786.42, 342.47, 213.06), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-786.42, 342.48, 214.17), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-784.44, 342.47, 210.85), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-784.44, 342.47, 211.96), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-784.44, 342.47, 213.06), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-784.44, 342.47, 214.17), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-790.44, 336.19, 210.41), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-790.44, 336.19, 211.52), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-792.42, 336.19, 211.52), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-792.42, 336.19, 210.47), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-794.4, 336.19, 211.52), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-794.4, 336.19, 210.41), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-794.4, 336.19, 212.63), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-792.41, 336.19, 212.63), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-790.43, 336.19, 212.63), new mp.Vector3(0, 0, 0), false, false);

// Int 11
    object.create(2079702193, new mp.Vector3(-757.74, 609.0231, 144.7975), new mp.Vector3(1.001788E-05, -5.008957E-06, -161.5), false, false);
    object.create(2079702193, new mp.Vector3(-764.45, 606.827, 144.52), new mp.Vector3(0, 0, -161.4989), false, false);
    object.create(2079702193, new mp.Vector3(-764.45, 606.827, 145.62), new mp.Vector3(0, 0, -161.4989), false, false);
    object.create(2079702193, new mp.Vector3(-766.38, 606.185, 144.52), new mp.Vector3(0, 0, -161.4989), false, false);
    object.create(2079702193, new mp.Vector3(-766.38, 606.185, 145.62), new mp.Vector3(0, 0, -161.4989), false, false);
    object.create(2079702193, new mp.Vector3(-777.81, 611.66, 143.36), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-777.81, 611.66, 144.47), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-777.81, 611.66, 145.58), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-777.18, 609.776, 143.36), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-777.18, 609.776, 144.46), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-777.18, 609.776, 145.57), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-776.55, 607.89, 143.36), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-776.55, 607.89, 144.46), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-776.55, 607.89, 145.56), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-775.92, 606, 143.36), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-775.92, 606, 144.46), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-775.92, 606, 145.56), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-775.315, 604.19, 143.36), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-775.315, 604.19, 144.46), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-775.315, 604.19, 145.56), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-777.83, 611.65, 139.96), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-777.83, 611.65, 141.06), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-777.83, 611.65, 142.16), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-777.19, 609.76, 139.96), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-777.19, 609.76, 141.06), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-777.19, 609.76, 142.16), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-776.56, 607.88, 139.96), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-776.56, 607.88, 141.06), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-776.56, 607.88, 142.17), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-775.93, 605.99, 139.96), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-775.93, 605.99, 141.07), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-775.93, 605.99, 142.18), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-775.33, 604.18, 139.96), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-775.33, 604.18, 141.06), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-775.33, 604.18, 142.16), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-773.11, 603.86, 141.7318), new mp.Vector3(0, 0, -161.4989), false, false);
    object.create(2079702193, new mp.Vector3(-773.1, 603.8708, 140.63), new mp.Vector3(0, 0, -161.4989), false, false);

// Int 12
    object.create(2079702193, new mp.Vector3(-1290.16, 428.36, 97.1), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1290.16, 428.36, 98.2), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1290.16, 428.36, 99.31), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1288.18, 428.36, 97.1), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1288.18, 428.36, 98.2), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1288.18, 428.36, 99.3), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1286.2, 428.36, 97.1), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1286.2, 428.36, 98.2), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1286.2, 428.36, 99.3), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1284.21, 428.36, 97.1), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1284.21, 428.36, 98.21), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1284.21, 428.36, 99.32), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1282.23, 428.36, 97.1), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1282.23, 428.36, 98.2), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1282.23, 428.36, 99.3), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1281.29, 446.65, 98.41), new mp.Vector3(6.329293E-05, 6.329292E-05, -89.99001), false, false);
    object.create(2079702193, new mp.Vector3(-1281.29, 437.49, 98.21005), new mp.Vector3(6.329293E-05, 6.329289E-05, -89.98997), false, false);
    object.create(2079702193, new mp.Vector3(-1281.29, 437.49, 99.32), new mp.Vector3(6.329293E-05, 6.329286E-05, -89.98996), false, false);
    object.create(2079702193, new mp.Vector3(-1281.29, 439.49, 98.21005), new mp.Vector3(6.329293E-05, 6.329286E-05, -89.98996), false, false);
    object.create(2079702193, new mp.Vector3(-1281.29, 439.49, 99.32), new mp.Vector3(6.329293E-05, 6.329281E-05, -89.98991), false, false);
    object.create(2079702193, new mp.Vector3(-1290.16, 428.34, 93.72), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1290.16, 428.34, 94.82), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1290.16, 428.34, 95.93), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1288.18, 428.34, 93.72), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1288.18, 428.34, 94.82), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1288.18, 428.34, 95.92), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1286.2, 428.34, 93.72), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1286.2, 428.34, 94.82), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1286.2, 428.34, 95.92), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1284.21, 428.34, 93.72), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1284.21, 428.34, 94.82), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1284.21, 428.34, 95.92), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1282.23, 428.34, 93.72), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1282.23, 428.34, 94.82), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1282.23, 428.34, 95.92), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1281.28, 430.24, 94.2196), new mp.Vector3(6.329293E-05, 6.329289E-05, -89.98997), false, false);
    object.create(2079702193, new mp.Vector3(-1281.28, 430.24, 95.32), new mp.Vector3(6.329293E-05, 6.329286E-05, -89.98996), false, false);

// Int 13
    object.create(2079702193, new mp.Vector3(-781.37, 343.96, 216.48), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-781.37, 343.96, 217.59), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-781.37, 343.96, 218.7), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-783.35, 343.96, 216.48), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-783.35, 343.96, 217.58), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-783.35, 343.96, 218.68), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-785.33, 343.96, 216.48), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-785.33, 343.96, 217.58), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-785.33, 343.96, 218.68), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-787.31, 343.96, 216.48), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-787.31, 343.96, 217.58), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-787.31, 343.96, 218.69), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-789.29, 343.96, 216.48), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-789.29, 343.96, 217.59), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-789.29, 343.96, 218.7), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-796.37, 340.36, 220.08), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-796.37, 340.36, 221.18), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-796.37, 340.36, 222.29), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-798.35, 340.36, 220.08), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-798.35, 340.36, 221.18), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-798.35, 340.36, 222.29), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-799.97, 340.36, 220.08), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-799.97, 340.36, 221.19), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-799.97, 340.36, 222.3), new mp.Vector3(0, 0, 0), false, false);

// Int 14
    object.create(2079702193, new mp.Vector3(-787.32, 343.54, 205.87), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-787.32, 343.54, 206.98), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-787.32, 343.54, 208.09), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-787.85, 343.54, 205.87), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-787.85, 343.54, 206.98), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-787.85, 343.54, 208.08), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-790.52, 343.54, 205.87), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-790.52, 343.54, 206.98), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-790.52, 343.54, 208.08), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-792.5, 343.54, 205.87), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-792.5, 343.54, 206.98), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-792.5, 343.54, 208.08), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-794.48, 343.54, 205.87), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-794.48, 343.54, 206.98), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-794.48, 343.54, 208.08), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-796.46, 343.54, 205.88), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-796.46, 343.54, 206.98), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-796.46, 343.54, 208.08), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 341.93, 205.88), new mp.Vector3(2.564906E-12, -5.008952E-06, 89.99995), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 341.93, 206.99), new mp.Vector3(3.732026E-12, -5.008951E-06, 89.99993), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 341.93, 208.1), new mp.Vector3(5.292704E-12, -5.008949E-06, 89.99989), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 339.94, 205.88), new mp.Vector3(3.732026E-12, -5.008951E-06, 89.99993), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 339.94, 206.99), new mp.Vector3(5.292704E-12, -5.008949E-06, 89.99989), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 339.94, 208.1), new mp.Vector3(7.844052E-12, -5.008947E-06, 89.99985), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 337.96, 205.88), new mp.Vector3(5.292704E-12, -5.008949E-06, 89.99989), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 337.96, 206.98), new mp.Vector3(7.844052E-12, -5.008947E-06, 89.99985), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 337.96, 208.08), new mp.Vector3(1.116895E-11, -5.008944E-06, 89.99978), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 335.98, 205.88), new mp.Vector3(7.844052E-12, -5.008947E-06, 89.99985), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 335.98, 206.98), new mp.Vector3(1.116895E-11, -5.008944E-06, 89.99978), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 335.98, 208.08), new mp.Vector3(1.448029E-11, -5.008941E-06, 89.9997), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 334, 206.99), new mp.Vector3(1.448029E-11, -5.008941E-06, 89.9997), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 334, 208.1), new mp.Vector3(1.857873E-11, -5.008937E-06, 89.99962), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 334, 205.88), new mp.Vector3(1.857873E-11, -5.008937E-06, 89.99962), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 327.94, 205.88), new mp.Vector3(2.208005E-11, -5.008933E-06, 89.99953), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 327.94, 206.99), new mp.Vector3(2.558136E-11, -5.008929E-06, 89.99945), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 327.94, 208.1), new mp.Vector3(2.928621E-11, -5.008925E-06, 89.99937), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 325.96, 205.88), new mp.Vector3(2.558136E-11, -5.008929E-06, 89.99945), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 325.96, 206.98), new mp.Vector3(2.928621E-11, -5.008925E-06, 89.99937), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 325.96, 208.09), new mp.Vector3(3.299104E-11, -5.008921E-06, 89.99929), false, false);
    object.create(2079702193, new mp.Vector3(-787.32, 343.54, 201.06), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-787.32, 343.54, 202.17), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-787.32, 343.54, 203.28), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-787.85, 343.54, 201.06), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-787.85, 343.54, 202.16), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-787.85, 343.54, 203.27), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-790.52, 343.54, 201.05), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-790.52, 343.54, 202.16), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-790.52, 343.54, 203.26), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-792.5, 343.54, 201.06), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-792.5, 343.54, 202.17), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-792.5, 343.54, 203.28), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-794.48, 343.54, 201.06), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-794.48, 343.54, 202.16), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-794.48, 343.54, 203.26), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-796.46, 343.54, 201.06), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-796.46, 343.54, 202.16), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-796.46, 343.54, 203.26), new mp.Vector3(0, 0, 0), false, false);

    //Clubs
    object.create(-1964135416, new mp.Vector3(-1178.14, -1195.98, 9.233026), new mp.Vector3(2.035555E-13, 5.008956E-06, 10.00001), false, false);
    object.create(-1964135416, new mp.Vector3(-1173.33, -1173.46, 9.965003), new mp.Vector3(1.00179E-05, 5.008956E-06, 15), false, false);
    object.create(-1964135416, new mp.Vector3(-1175.2, -1152.501, 11.08638), new mp.Vector3(1.424888E-12, 5.008948E-06, 105.0995), false, false);
    object.create(1873958683, new mp.Vector3(345.16, -966.5164, 33.99652), new mp.Vector3(5.97114E-13, -5.008956E-06, 89.99999), false, false);
    object.create(1873958683, new mp.Vector3(345.16, -978.5415, 32.49959), new mp.Vector3(1.384231E-12, -5.008955E-06, 89.99998), false, false);
    object.create(1873958683, new mp.Vector3(345.1865, -992.3479, 34), new mp.Vector3(1.384231E-12, -5.008955E-06, 89.99998), false, false);
    object.create(1873958683, new mp.Vector3(332.75, -994.23, 32.69476), new mp.Vector3(5.008951E-06, -5.008956E-06, -5.008955E-06), false, false);
    object.create(-1874162628, new mp.Vector3(-1173.742, -1152.158, 8.116696), new mp.Vector3(-58.75011, 0.07550914, -75.86123), false, false);
    object.create(-1874162628, new mp.Vector3(-1173.221, -1173.51, 12.67857), new mp.Vector3(13.74995, -4.834294E-06, 16.00003), false, false);
    object.create(-1874162628, new mp.Vector3(-1178.13, -1196, 11.73), new mp.Vector3(13.74994, 5.273774E-06, 9.875067), false, false);
    object.create(1449564591, new mp.Vector3(5.06, 221.26, 110.7812), new mp.Vector3(1.001791E-05, 5.008956E-06, 69.95999), false, false);
    object.create(1449564591, new mp.Vector3(-21.69, 219.83, 110.0739), new mp.Vector3(1.001787E-05, 5.008956E-06, -8.999997), false, false);

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

    // Баррикада возле Мейз Офис
    object.create(1603241576, new mp.Vector3(50.99, -781.9912, 43.16505), new mp.Vector3(0, 0, 70.19968), false, false);

    //Sheriff LS
    object.delete(mp.game.joaat("prop_sec_gate_01c"), 375.9481, -1632.531, 27.24899);

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

    // Остановки (Город)
    object.create(1888204845, new mp.Vector3(-25.00374, -1351.213, 28.31467), new mp.Vector3(0, 0, 0), false, false);
    object.create(2142033519, new mp.Vector3(-651.5632, -869.9038, 23.48871), new mp.Vector3(-0.5250403, -0.1499586, 90.82462), false, false);
    object.create(2142033519, new mp.Vector3(-1199.349, -1189.598, 6.687958), new mp.Vector3(0, 0, -81.99986), false, false);
    object.create(2142033519, new mp.Vector3(-1426.916, -438.0547, 34.88), new mp.Vector3(9.661302E-06, 1.425005, -149.1991), false, false);
    object.create(2142033519, new mp.Vector3(-1012.661, -246.9745, 36.73038), new mp.Vector3(9.988492E-06, -0.07489484, -151.9996), false, false);
    object.create(2142033519, new mp.Vector3(-757.9441, -350.8195, 34.88), new mp.Vector3(-0.8251041, -1.424772, 158.3999), false, false);
    object.create(2142033519, new mp.Vector3(-204.6708, -700.7742, 32.95), new mp.Vector3(9.980403E-06, 1.124995, 159.3999), false, false);
    object.create(2142033519, new mp.Vector3(235.123, -692.5045, 35.61), new mp.Vector3(1.124952, 3.399995, -111.1994), false, false);
    object.create(2142033519, new mp.Vector3(351.6387, -310.4411, 51.99164), new mp.Vector3(5.370342E-06, 6.475041, -107.3995), false, false);
    object.create(2142033519, new mp.Vector3(966.4988, -181.2201, 72.10435), new mp.Vector3(8.015111E-06, -2.999882, 148.9995), false, false);
    object.create(2142033519, new mp.Vector3(1178.494, -444.7159, 65.75287), new mp.Vector3(1.155658E-05, -1.499699, 77.59977), false, false);
    object.create(2142033519, new mp.Vector3(817.7294, -996.8601, 25.24501), new mp.Vector3(-0.4500174, 5.007582E-06, 2.699996), false, false);
    object.create(2142033519, new mp.Vector3(321.01, -1033.08, 28.24), new mp.Vector3(1.00179E-05, -0.149904, 5.008956E-06), false, false);

// Остановки (Загород)
    object.create(2142033519, new mp.Vector3(1558.44, 874.3721, 76.4571), new mp.Vector3(0, 0, -140.9992), false, false);
    object.create(1681727376, new mp.Vector3(1957.909, 2987.314, 44.62), new mp.Vector3(-0.8251861, -0.2252273, 13.59998), false, false);
    object.create(1681727376, new mp.Vector3(1091.956, 2695.625, 37.61), new mp.Vector3(1.250645E-09, 4.963255E-05, -2.999964), false, false);
    object.create(1681727376, new mp.Vector3(394.3408, 2676.185, 43.21), new mp.Vector3(2.135166E-07, 1.499987, 11.69997), false, false);
    object.create(1681727376, new mp.Vector3(229.2961, 3070.666, 41.13), new mp.Vector3(0, 0, -85.99977), false, false);
    object.create(1681727376, new mp.Vector3(1936.598, 3699.375, 31.39), new mp.Vector3(0.1500101, -0.749813, -148.9993), false, false);
    object.create(1888204845, new mp.Vector3(1682.902, 4825.715, 40.95), new mp.Vector3(1.000519E-05, 0.1499586, -83.89984), false, false);
    object.create(1681727376, new mp.Vector3(1653.029, 6419.541, 27.82), new mp.Vector3(-0.5251219, -4.200262, -19.09998), false, false);
    object.create(2142033519, new mp.Vector3(-166.6941, 6383.723, 30.48), new mp.Vector3(1.028865E-05, -6.329292E-05, 43.79989), false, false);
    object.create(2142033519, new mp.Vector3(-438.895, 6052.333, 30.5), new mp.Vector3(1.028862E-05, -6.329292E-05, 116.7995), false, false);
    object.create(1681727376, new mp.Vector3(-942.9807, 5432.132, 37.12), new mp.Vector3(0.8250042, 2.549977, 16.99997), false, false);
    object.create(1681727376, new mp.Vector3(-1532.689, 4996.663, 61.08), new mp.Vector3(-0.6751952, 0.5248131, 49.99994), false, false);
    object.create(1681727376, new mp.Vector3(-2234.323, 4319.973, 47.49), new mp.Vector3(2.074609E-05, -3.649816, 67.29963), false, false);
    object.create(1681727376, new mp.Vector3(-2509.702, 3599.954, 13.39), new mp.Vector3(9.873415E-06, 1.049973, 92.19895), false, false);
    object.create(1681727376, new mp.Vector3(-2741.74, 2289.816, 18.45), new mp.Vector3(0.9000043, 2.850124, 80.29944), false, false);
    object.create(1681727376, new mp.Vector3(-3124.893, 1183.931, 19.44), new mp.Vector3(0, 0, 89.69975), false, false);
    object.create(1681727376, new mp.Vector3(-3026.607, 332.7633, 13.62), new mp.Vector3(3.168344E-08, 0.2999769, 86.5997), false, false);
    object.create(1681727376, new mp.Vector3(-1837.992, -607.2737, 10.35), new mp.Vector3(1.015221E-05, -0.4498585, 141.1494), false, false);
    object.create(2142033519, new mp.Vector3(246.44, -574.35, 42.31), new mp.Vector3(9.618499E-06, 0.374986, 69.37473), false, false);

    // Столбики EMS PillboxHill
    object.create(-994492850, new mp.Vector3(299.3083, -579.6682, 42.26086), new mp.Vector3(0, 0, -10.59997), false, false);
    object.create(-994492850, new mp.Vector3(298.9536, -581.5536, 42.26086), new mp.Vector3(0, 0, -14.49999), false, false);
    object.create(-994492850, new mp.Vector3(298.4625, -583.3111, 42.26086), new mp.Vector3(0, 0, -14.49999), false, false);
    object.create(-994492850, new mp.Vector3(297.924, -584.9352, 42.26086), new mp.Vector3(0, 0, -17.19997), false, false);
    object.create(-994492850, new mp.Vector3(297.269, -586.6929, 42.26086), new mp.Vector3(0, 0, -16.59998), false, false);
    object.create(-994492850, new mp.Vector3(296.5572, -588.6815, 42.26086), new mp.Vector3(0, 0, -16.59998), false, false);

    // Блокировка дверей и ворот снизу больницы Pillbox Hill
    object.create(-982531572, new mp.Vector3(343.4154, -566.52, 30.08493), new mp.Vector3(1.00179E-05, 5.008956E-06, -20.00006), false, false);
    object.create(-982531572, new mp.Vector3(338.9554, -564.91, 30.04101), new mp.Vector3(1.00179E-05, 5.008956E-06, -20.00006), false, false);
    object.create(-982531572, new mp.Vector3(325.56, -560.04, 29.86809), new mp.Vector3(1.00179E-05, 5.008956E-06, -20.00006), false, false);
    object.create(-982531572, new mp.Vector3(329.9954, -561.64, 29.95774), new mp.Vector3(1.00179E-05, 5.008956E-06, -20.00006), false, false);
    object.create(-982531572, new mp.Vector3(334.4736, -563.27, 30.00469), new mp.Vector3(1.00179E-05, 5.008956E-06, -20.00006), false, false);
    object.create(-1829309699, new mp.Vector3(359.09, -584.8922, 29.38), new mp.Vector3(1.00179E-05, 5.008956E-06, 69.94945), false, false);
    object.create(-1829309699, new mp.Vector3(355.33, -595.4761, 29.38), new mp.Vector3(1.00179E-05, 5.008956E-06, 69.94945), false, false);
    object.create(1693207013, new mp.Vector3(338.07, -583.8448, 74.40556), new mp.Vector3(1.001791E-05, -5.008956E-06, -110.7243), false, false);

    // Добавленные гаражные двери и простые двери к домам
    object.create(781635019, new mp.Vector3(-2169.67, 5194.76, 17.02), new mp.Vector3(1.001791E-05, 5.008957E-06, -167.6991), false, false); // Дверь в доме на острове
    object.create(-1857663329, new mp.Vector3(-911.8047, 195.3755, 70.26), new mp.Vector3(0, 0, 0), false, false); // Гаражная дверь дома id 543
    object.create(-1857663329, new mp.Vector3(-905.84, 195.37, 70.26), new mp.Vector3(0, 0, 0), false, false); // Гаражная дверь дома id 543
    object.create(-1857663329, new mp.Vector3(-1128.305, 308.3432, 66.95), new mp.Vector3(1.00179E-05, -5.008956E-06, -9.575194), false, false); // Гаражная дверь дома id 556
    object.create(-1082334994, new mp.Vector3(-1130.57, 315.49, 66.57), new mp.Vector3(1.001791E-05, 5.008956E-06, -9.449916), false, false); // Гаражная дверь дома id 556
    object.create(-1212944997, new mp.Vector3(-1587.19, -58.56, 57.43), new mp.Vector3(1.001791E-05, 5.008956E-06, -90.09966), false, false); // Гаражная дверь дома id 566
    object.create(-1429437264, new mp.Vector3(-1596.58, -55.44, 57.40207), new mp.Vector3(1.001789E-05, -5.008955E-06, 89.97427), false, false); // Гаражная дверь дома id 566
    object.create(-1429437264, new mp.Vector3(-1596.58, -56.81, 57.40207), new mp.Vector3(1.001789E-05, -5.008953E-06, 89.97425), false, false); // Гаражная дверь дома id 566
    object.create(-2045308299, new mp.Vector3(-1591.19, -89.04, 54.54069), new mp.Vector3(0, 0, 0), false, false); // Гаражная дверь дома id 565
    object.create(-42303174, new mp.Vector3(-1588.73, -89.04208, 54.53976), new mp.Vector3(0, 0, 0), false, false); // Гаражная дверь дома id 565
    object.create(1693207013, new mp.Vector3(-1582.3, -86.47108, 54.7), new mp.Vector3(-5.97114E-13, -5.008956E-06, -89.99999), false, false); // Гаражная дверь дома id 565
    object.create(1693207013, new mp.Vector3(-1582.3, -80.98515, 54.7), new mp.Vector3(-1.384231E-12, -5.008955E-06, -89.99998), false, false); // Гаражная дверь дома id 565
    object.create(1301550063, new mp.Vector3(-275.01, 599.8553, 182.1845), new mp.Vector3(0, 0, -2.999996), false, false); // Гаражная дверь дома id 507
    object.create(224975209, new mp.Vector3(-273.2677, 594.1454, 181.8125), new mp.Vector3(1.001791E-05, 5.008956E-06, -2.250036), false, false); // Гаражная дверь дома id 507
    object.create(-1212944997, new mp.Vector3(-178.3, 590.79, 198.58), new mp.Vector3(1.463055E-13, -5.008956E-06, 0.8250271), false, false); // Гаражная дверь дома id 505
    object.create(-493122268, new mp.Vector3(-516.87, 576.36, 121.78), new mp.Vector3(1.001791E-05, 5.008955E-06, -79.4995), false, false); // Гаражная дверь дома id 51
    object.create(-1265404967, new mp.Vector3(-627.86, 524.13, 108.6877), new mp.Vector3(1.001791E-05, -5.008957E-06, 10.27498), false, false); // Гаражная дверь дома id 54
    object.create(-1265404967, new mp.Vector3(-633.4645, 523.1584, 108.6877), new mp.Vector3(1.001791E-05, -5.008956E-06, 10.27498), false, false); // Гаражная дверь дома id 54
    object.create(1991494706, new mp.Vector3(-404.51, 340.59, 109.85), new mp.Vector3(1.001791E-05, 5.008956E-06, 0.3001271), false, false); // Гаражная дверь дома id 31
    object.create(1991494706, new mp.Vector3(-398.32, 340.6257, 109.85), new mp.Vector3(1.001791E-05, 5.008956E-06, 0.3001271), false, false); // Гаражная дверь дома id 31
    object.create(1991494706, new mp.Vector3(-494.29, 743.6877, 164), new mp.Vector3(0, 0, 64.59978), false, false); // Гаражная дверь дома id 154
    object.create(1991494706, new mp.Vector3(-491.65, 749.2623, 164), new mp.Vector3(0, 0, 64.59978), false, false); // Гаражная дверь дома id 154
    object.create(-1857663329, new mp.Vector3(-950.39, 690.71, 154.37), new mp.Vector3(1.001791E-05, -5.008955E-06, 1.275014), false, false); // Гаражная дверь дома id 145
    object.create(1991494706, new mp.Vector3(-1355.44, 499.29, 104.24), new mp.Vector3(1.001791E-05, 5.008956E-06, -64.19965), false, false); // Гаражная дверь дома id 100
    object.create(1991494706, new mp.Vector3(-1352.76, 493.74, 104.24), new mp.Vector3(1.001791E-05, -5.008956E-06, -64.12453), false, false); // Гаражная дверь дома id 100
    object.create(-1265404967, new mp.Vector3(-1109.085, 485.002, 81.15), new mp.Vector3(0, -5.008956E-06, -10.72488), false, false); // Гаражная дверь дома id 87
    object.create(-1265404967, new mp.Vector3(-1114.67, 486.05, 81.15), new mp.Vector3(-1.017777E-13, -5.008956E-06, -10.72488), false, false); // Гаражная дверь дома id 87
    object.create(-1212944997, new mp.Vector3(-976.2, 520.59, 82.35), new mp.Vector3(1.00179E-05, 5.008955E-06, -33.14966), false, false); // Гаражная дверь дома N 2128
    object.create(-1265404967, new mp.Vector3(-708.808, 647.228, 154.1753), new mp.Vector3(1.001791E-05, -5.008956E-06, -11.92505), false, false); // Гаражная дверь дома N 2589
    object.create(-1265404967, new mp.Vector3(-714.3678, 648.3885, 154.1753), new mp.Vector3(1.001791E-05, -5.008956E-06, -11.92505), false, false); // Гаражная дверь дома N 2589
    object.create(1991494706, new mp.Vector3(114.4517, 494.24, 148.32), new mp.Vector3(5.008957E-06, 2.23118E-05, 11), false, false); // Гаражная дверь дома N 3688
    object.create(1991494706, new mp.Vector3(108.64, 493.1, 148.32), new mp.Vector3(5.008957E-06, 2.23118E-05, 11), false, false); // Гаражная дверь дома N 3688

    // Лифты в многоуровневом гараже (dedgarage4)
    object.create(-643813287, new mp.Vector3(-852.52, 284.51, 31.37), new mp.Vector3(1.001779E-05, -5.008956E-06, -54.08999), false, false);
    object.create(-883977292, new mp.Vector3(-852.52, 284.51, 31.37), new mp.Vector3(0, 0, -54.19993), false, false);
    object.create(-643813287, new mp.Vector3(-852.52, 284.51, 26.03), new mp.Vector3(1.001779E-05, -5.008957E-06, -54.08998), false, false);
    object.create(-883977292, new mp.Vector3(-852.52, 284.51, 26.03), new mp.Vector3(0, 0, -54.19992), false, false);
    object.create(-643813287, new mp.Vector3(-852.52, 284.51, 20.68), new mp.Vector3(1.001779E-05, -5.008957E-06, -54.08998), false, false);
    object.create(-883977292, new mp.Vector3(-852.52, 284.51, 20.68), new mp.Vector3(0, 0, -54.19992), false, false);
    object.create(-643813287, new mp.Vector3(-812.17, 314.04, 31.36), new mp.Vector3(1.001779E-05, 5.008955E-06, -53.83999), false, false);
    object.create(-883977292, new mp.Vector3(-812.17, 314.04, 31.36), new mp.Vector3(-2.035555E-13, -5.008955E-06, -53.83999), false, false);
    object.create(-643813287, new mp.Vector3(-812.17, 314.04, 26.03), new mp.Vector3(1.001778E-05, 5.008956E-06, -53.83999), false, false);
    object.create(-883977292, new mp.Vector3(-812.17, 314.04, 26.03), new mp.Vector3(4.07111E-13, -5.008955E-06, -53.83999), false, false);
    object.create(-643813287, new mp.Vector3(-812.17, 314.04, 20.68), new mp.Vector3(1.001778E-05, 5.008956E-06, -53.83999), false, false);
    object.create(-883977292, new mp.Vector3(-812.17, 314.04, 20.68), new mp.Vector3(6.106665E-13, -5.008955E-06, -53.83999), false, false);

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

    // Правительство (Экстерьер)
    object.delete(-2008643115, -1415.269, -532.4758, 30.4776);
    object.delete(-1940238623, -1413.75, -534.4888, 30.38552);
    object.delete(-1940238623, -1417.124, -529.5981, 30.70199);
    object.delete(-1940238623, -1420.439, -524.8185, 30.99145);
    object.delete(-1620823304, -1422.041, -522.8961, 31.06964);
    object.delete(1841929479, -1421.549, -523.3159, 31.04547);
    object.delete(-1940238623, -1423.84, -520.0779, 31.29039);
    object.delete(-1940238623, -1427.236, -515.2849, 31.58356);
    object.delete(-1940238623, -1430.389, -510.6808, 31.86384);
    object.delete(-1940238623, -1433.236, -506.5717, 32.09739);
    object.delete(-1940238623, -1436.525, -501.8381, 32.3909);
    object.delete(-1940238623, -1439.299, -497.7716, 32.62413);
    object.delete(720581693, -1440.444, -493.8069, 32.8087);
    object.delete(1211559620, -1440.487, -492.9063, 32.84278);
    object.delete(-756152956, -1440.572, -492.1226, 32.86752);
    object.delete(-2008643115, -1441.886, -488.9724, 33.06442);
    object.delete(-2007495856, -1433.996, -519.2691, 31.4111);
    object.delete(-1940238623, -1333.575, -485.9554, 32.47874);
    object.delete(-1940238623, -1336.526, -481.6532, 32.51909);
    object.delete(-1940238623, -1340.171, -476.5135, 32.53035);
    object.delete(-1940238623, -1343.716, -471.4368, 32.55862);
    object.delete(-1940238623, -1347.087, -466.6847, 32.64202);
    object.delete(-1940238623, -1350.737, -461.4746, 32.8638);
    object.delete(-1940238623, -1354.211, -456.638, 33.06472);
    object.delete(-1940238623, -1357.757, -451.7688, 33.32761);
    object.delete(-1940238623, -1361.513, -446.5331, 33.69582);
    object.delete(-994492850, -1417.148, -474.3772, 32.66023);
    object.delete(-994492850, -1412.984, -480.8206, 32.57825);
    object.delete(1841929479, -1392.478, -523.8038, 30.20782);
    object.delete(200846641, -1415.855, -490.2801, 32.28891);

// LSPD (Экстерьер)
    object.delete(1805980844, 419.1441, -967.956, 28.44407);
    object.delete(1437508529, 419.0363, -969.7165, 28.42242);
    object.delete(1805980844, 419.1441, -971.5034, 28.44937);
    object.delete(-2007495856, 418.9406, -988.4918, 28.17999);
    object.delete(1805980844, 419.2523, -995.0659, 28.28618);
    object.delete(1805980844, 419.2702, -1004.966, 28.24855);
    object.delete(1805980844, 419.338, -1008.28, 28.26529);
    object.delete(1437508529, 419.2487, -1006.582, 28.23309);
    object.delete(1211559620, 419.2334, -997.7922, 28.21798);
    object.delete(-756152956, 419.2334, -996.756, 28.23951);
    object.delete(1437508529, 419.2458, -993.3654, 28.28894);
    object.delete(-1620823304, 416.3028, -961.5961, 28.44399);
    object.delete(1437508529, 415.4013, -961.6148, 28.46598);
    object.delete(-2007495856, 406.9413, -968.04, 28.46596);
    object.delete(1437508529, 445.3829, -966.1437, 27.85644);
    object.delete(1437508529, 437.7459, -966.0104, 28.10277);
    object.delete(1805980844, 436.1377, -966.1867, 28.15036);
    object.delete(1805980844, 446.9347, -966.0593, 27.79777);
    object.delete(1138027619, 473.1961, -966.0472, 27.09299);
    object.delete(856312526, 471.8073, -965.3984, 26.86329);
    object.delete(-1096777189, 471.0575, -966.1581, 26.89985);
    object.delete(600967813, 467.9193, -966.1756, 27.001);
    object.delete(-1096777189, 463.2997, -966.1774, 27.19584);
    object.delete(1388308576, 462.617, -966.1684, 27.21609);
    object.delete(-2007495856, 472.2478, -970.1152, 26.5803);
    object.delete(856312526, 489.4408, -997.3647, 26.76826);
    object.delete(600967813, 489.7764, -996.1569, 26.7373);
    object.delete(666561306, 489.5108, -998.6524, 26.7871);
    object.delete(1948359883, 489.7737, -1000.65, 26.83446);
    object.delete(856312526, 478.2845, -1017.998, 26.96595);
    object.delete(379532277, 477.1805, -1016.741, 27.31062);
    object.delete(666561306, 480.0718, -1017.32, 26.91727);
    object.delete(856312526, 469.4293, -1027.025, 27.23068);
    object.delete(-2007495856, 473.0369, -1017.74, 27.05297);
    object.delete(-2007495856, 421.3152, -1010.042, 28.01066);
    object.delete(-2007495856, 450.0965, -999.5389, 29.69524);
    object.delete(-2007495856, 457.3095, -1006.358, 27.15059);
    object.delete(1923262137, 412.0218, -1032.441, 28.36854);
    object.delete(1437508529, 410.3891, -1032.776, 28.40844);
    object.delete(1948359883, 408.7373, -1031.787, 28.40162);
    object.delete(-1080006443, 428.4463, -971.6927, 29.701);
    object.delete(-1080006443, 423.5486, -981.4382, 29.69661);
    object.delete(-97646180, 494.0963, -968.2924, 26.44581);

    const end = new Date().getTime();
    methods.debug('Count Objects Loaded: ' + objectList.length + '  | ' + (end - start) + 'ms');
    setInterval(object.process, 5000);
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

    // Банки
    object.openDoor(3941780146, -111.48, 6463.94, 31.98499, false); //Блейн Банк
    object.openDoor(2628496933, -109.65, 6462.11, 31.98499, false); //Блейн Банк
    object.openDoor(73386408, -2965.71, 484.2195, 16.0481, false); //Флека Чумаш
    object.openDoor(3142793112, -2965.821, 481.6297, 16.04816, false); //Флека Чумаш
    object.openDoor(73386408, -1213.074, -327.3524, 38.13205, false); //Флека Ричманд
    object.openDoor(3142793112, -1215.386, -328.5237, 38.13211, false); //Флека Ричманд
    object.openDoor(73386408, -348.8109, -47.26213, 49.38759, false); //Флека Бертон
    object.openDoor(3142793112, -351.2598, -46.41221, 49.38765, false); //Флека Бертон
    object.openDoor(73386408, 316.3925, -276.4888, 54.5158, false); //Флека Вайнвуд
    object.openDoor(3142793112, 313.9587, -275.5965, 54.51586, false); //Флека Вайнвуд
    object.openDoor(73386408, 152.0632, -1038.124, 29.71909, false); //Флека ДавнТавн
    object.openDoor(3142793112, 149.6298, -1037.231, 29.71915, false); //Флека ДавнТавн
    object.openDoor(73386408, 1173.903, 2703.613, 38.43904, false); //Флека Гранд Сенора
    object.openDoor(3142793112, 1176.495, 2703.613, 38.43911, false); //Флека Гранд Сенора
    object.openDoor(110411286, 231.5123, 216.5177, 106.4049, false); //Пацифик Главный вход
    object.openDoor(110411286, 232.6054, 214.1584, 106.4049, false); //Пацифик Главный вход
    object.openDoor(110411286, 258.2022, 204.1005, 106.4049, false); //Пацифик Боковой вход
    object.openDoor(110411286, 260.6432, 203.2052, 106.4049, false); //Пацифик Боковой вход
// Магазины одежды и ювилирка
    object.openDoor(868499217, 418.5713, -806.3979, 29.64108, false); //Бинко Текстайл Сити
    object.openDoor(3146141106, 418.5713, -808.674, 29.64108, false); //Бинко Текстайл Сити
    object.openDoor(868499217, -818.7643, -1079.545, 11.47806, false); //Бинко Веспуччи
    object.openDoor(3146141106, -816.7932, -1078.406, 11.47806, false); //Бинко Веспуччи
    object.openDoor(868499217, 82.38156, -1392.752, 29.52609, false); //Дисконт Девис
    object.openDoor(3146141106, 82.38156, -1390.476, 29.52609, false); //Дисконт Девис
    object.openDoor(868499217, -1096.661, 2705.446, 19.25781, false); //Дисконт Лого Занкудо
    object.openDoor(3146141106, -1094.965, 2706.964, 19.25781, false); //Дисконт Лого Занкудо
    object.openDoor(868499217, 1196.825, 2703.221, 38.37257, false); //Дисконт Гранд Сенора
    object.openDoor(3146141106, 1199.101, 2703.221, 38.37257, false); //Дисконт Гранд Сенора
    object.openDoor(868499217, 1686.983, 4821.741, 42.21305, false); //Дисконт Грепсид
    object.openDoor(3146141106, 1687.282, 4819.484, 42.21305, false); //Дисконт Грепсид
    object.openDoor(868499217, -0.05637026, 6517.461, 32.02779, false); //Дисконт Палето-Бей
    object.openDoor(3146141106, -1.725257, 6515.914, 32.02779, false); //Дисконт Палето-Бей
    object.openDoor(1780022985, 617.2458, 2751.022, 42.75777, false); // Сабурбан Хармони
    object.openDoor(1780022985, 127.8201, -211.8274, 55.22751, false); // Сабурбан Хевик
    object.openDoor(1780022985, -1201.435, -776.8566, 17.99184, false); // Сабурбан Дель-Перро
    object.openDoor(1780022985, -3167.75, 1055.536, 21.53288, false); // Сабурбан Каньён Бенкхэм
    object.openDoor(2372686273, -1454.782, -231.7927, 50.05648, false); // Пансонбус Морнингвуд
    object.openDoor(2372686273, -1456.201, -233.3682, 50.05648, false); // Пансонбус Морнингвуд
    object.openDoor(2372686273, -716.6755, -155.42, 37.67493, false); // Пансонбус Рокфорд Хиллс
    object.openDoor(2372686273, -715.6154, -157.2561, 37.67493, false); // Пансонбус Рокфорд Хиллс
    object.openDoor(2372686273, -157.1293, -306.4341, 39.99308, false); // Пансонбус Бертон
    object.openDoor(2372686273, -156.439, -304.4294, 39.99308, false); // Пансонбус Бертон
    object.openDoor(1425919976, -631.9554, -236.3333, 38.20653, false); // Ванжелико
    object.openDoor(9467943, -630.4265, -238.4376, 38.20653, false); // Ванжелико
// Тату Салоны
    object.openDoor(543652229, -1155.454, -1424.008, 5.046147, false); // the pit веспуччи бич
    object.openDoor(543652229, 1321.286, -1650.597, 52.36629, false); // los santos tattoo эль-бурро-хайтс
    object.openDoor(543652229, 321.8085, 178.3599, 103.6782, false); // Blazing Tatto вайнвуд
    object.openDoor(543652229, -3167.789, 1074.867, 20.92086, false); // InkInc Tattoos Каньён Бенкхэм
    object.openDoor(3082015943, -289.1752, 6199.113, 31.63704, false); // Tatto Палето-Бей
    object.openDoor(3082015943, 1859.894, 3749.786, 33.18181, false); // Tatto Сэнди-Шорес
// Барбершопы
    object.openDoor(2450522579, 1932.952, 3725.154, 32.9944, false); // osheas barber Сэнди-Шорес
    object.openDoor(2450522579, -280.7851, 6232.782, 31.84548, false); // herr kutz Палето-Бей
    object.openDoor(2450522579, 1207.873, -470.0363, 66.358, false); // herr kutz Миррор-Парк
    object.openDoor(2450522579, 132.5569, -1710.996, 29.44157, false); // herr kutz Девис
    object.openDoor(2450522579, -1287.857, -1115.742, 7.140073, false); // beachcombover дель-перро
    object.openDoor(2450522579, -29.86917, -148.1571, 57.22648, false); // hair on hawick альта
    object.openDoor(2631455204, -823.2001, -187.0831, 37.81895, false); // bob mulet Рокфорд Хиллс
    object.openDoor(145369505, -822.4442, -188.3924, 37.81895, false); // bob mulet Рокфорд Хиллс
// Бары
    object.openDoor(993120320, -565.1712, 276.6259, 83.28626, false); // tequi-lala главный вход
    object.openDoor(993120320, -561.2866, 293.5044, 87.77851, false); // tequi-lala задний вход
    object.openDoor(190770132, 981.1506, -103.2552, 74.99358, false); // the lost
    object.openDoor(3178925983, 127.9552, -1298.503, 29.41962, false); // vanilla unicorn главный вход
    object.openDoor(668467214, 96.09197, -1284.854, 29.43878, false); // vanilla unicorn задний вход
    object.openDoor(4007304890, 1991.106, 3053.105, 47.36528, false); // yellow jack
// Магазины
    object.openDoor(1196685123, 375.3528, 323.8015, 103.7163, false); // 247 Downtown Vinewood
    object.openDoor(997554217, 377.8753, 323.1672, 103.7163, false); // 247 Downtown Vinewood
    object.openDoor(1196685123, -3240.128, 1003.157, 12.98064, false); // 247 Banham Canyon
    object.openDoor(997554217, -3239.905, 1005.749, 12.98064, false); // 247 Banham Canyon
    object.openDoor(1196685123, -3038.219, 588.2872, 8.058861, false); // 247 Chumash
    object.openDoor(997554217, -3039.012, 590.7642, 8.058861, false); // 247 Chumash
    object.openDoor(1196685123, 1963.917, 3740.075, 32.49369, false); // 247 247 Sandy Shores
    object.openDoor(997554217, 1966.17, 3741.376, 32.49369, false); // 247 Sandy Shores
    object.openDoor(1196685123, 545.504, 2672.745, 42.30644, false); // 247 Harmony
    object.openDoor(997554217, 542.9252, 2672.406, 42.30644, false); // 247 Harmony
    object.openDoor(1196685123, 1730.032, 6412.072, 35.18717, false); // 247 Mount Chiliad
    object.openDoor(997554217, 1732.362, 6410.917, 35.18717, false); // 247 Mount Chiliad
    object.openDoor(1196685123, 2681.292, 3281.427, 55.39108, false); // 247 Grand Senora Desert
    object.openDoor(997554217, 2682.558, 3283.699, 55.39108, false); // 247 Grand Senora Desert
    object.openDoor(1196685123, 27.81761, -1349.169, 29.64696, false); // 247 Strawberry
    object.openDoor(997554217, 30.4186, -1349.169, 29.64696, false); // 247 Strawberry
    object.openDoor(1196685123, 2559.201, 384.0875, 108.7729, false); // 247 Tataviam Mountains
    object.openDoor(997554217, 2559.304, 386.6864, 108.7729, false); // 247 Tataviam Mountains
    object.openDoor(3082015943, 1392.927, 3599.469, 35.13078, false); // Liquor Ace
    object.openDoor(3082015943, 1395.371, 3600.358, 35.13078, false); // Liquor Ace
    object.openDoor(3082015943, -2973.535, 390.1414, 15.18735, false); // Robs Liquor Banham Canyon
    object.openDoor(3082015943, -1490.411, -383.8453, 40.30745, false); // Robs Liquor Morningwood
    object.openDoor(3082015943, 1141.038, -980.3225, 46.55986, false); // Robs Liquor Murrieta Heights
    object.openDoor(3082015943, -1226.894, -903.1218, 12.47039, false); // Robs Liquor Vespucci Canals
    object.openDoor(3082015943, 1167.129, 2703.754, 38.30173, false); // Scoops Liquor Barn
    object.openDoor(3426294393, -53.96112, -1755.717, 29.57094, false); // LTD Gasoline Davis
    object.openDoor(2065277225, -51.96669, -1757.387, 29.57094, false); // LTD Gasoline Davis
    object.openDoor(3426294393, -713.0732, -916.5409, 19.36553, false); // LTD Gasoline Little Seoul
    object.openDoor(2065277225, -710.4722, -916.5372, 19.36553, false); // LTD Gasoline Little Seoul
    object.openDoor(3426294393, 1699.661, 4930.278, 42.21359, false); // LTD Gasoline Grapeseed
    object.openDoor(2065277225, 1698.172, 4928.146, 42.21359, false); // LTD Gasoline Grapeseed
    object.openDoor(3426294393, 1158.364, -326.8165, 69.35503, false); // LTD Gasoline Mirror Park
    object.openDoor(2065277225, 1160.925, -326.3612, 69.35503, false); // LTD Gasoline Mirror Park
    object.openDoor(3426294393, -1823.285, 787.3687, 138.3624, false); // LTD Gasoline Richman Glen
    object.openDoor(2065277225, -1821.369, 789.1274, 138.3124, false); // LTD Gasoline Richman Glen
// Аммунации
    object.openDoor(97297972, 16.12787, -1114.606, 29.94694, false); // GunShop Pillbox
    object.openDoor(4286093708, 18.572, -1115.495, 29.94694, false); // GunShop Pillbox
    object.openDoor(97297972, 244.7275, -44.07911, 70.09098, false); // GunShop Havik
    object.openDoor(4286093708, 243.8379, -46.52324, 70.09098, false); // GunShop Havik
    object.openDoor(97297972, 845.3694, -1024.539, 28.34478, false); // GunShop LaMesa
    object.openDoor(4286093708, 842.7685, -1024.539, 28.34478, false); // GunShop LaMesa
    object.openDoor(97297972, -665.2424, -944.3256, 21.97915, false); // GunShop Seul
    object.openDoor(4286093708, -662.6415, -944.3256, 21.97915, false); // GunShop Seul
    object.openDoor(97297972, -1313.826, -389.1259, 36.84573, false); // GunShop Morningwood
    object.openDoor(4286093708, -1314.465, -391.6472, 36.84573, false); // GunShop Morningwood
    object.openDoor(97297972, 813.1779, -2148.27, 29.76892, false); // GunShop Saipres-Flets
    object.openDoor(4286093708, 810.5769, -2148.27, 29.76892, false); // GunShop Saipres-Flets
    object.openDoor(97297972, 2570.905, 303.3556, 108.8848, false); // GunShop Tataviamskoe
    object.openDoor(4286093708, 2568.304, 303.3556, 108.8848, false); // GunShop Tataviamskoe
    object.openDoor(97297972, -3164.845, 1081.392, 20.98866, false); // GunShop Chumash
    object.openDoor(4286093708, -3163.812, 1083.778, 20.98866, false); // GunShop Chumash
    object.openDoor(97297972, -1114.009, 2689.77, 18.70407, false); // GunShop Zancudo River
    object.openDoor(4286093708, -1112.071, 2691.505, 18.70407, false); // GunShop Zancudo River
    object.openDoor(97297972, 1698.176, 3751.506, 34.85526, false); // GunShop Sandy
    object.openDoor(4286093708, 1699.937, 3753.42, 34.85526, false); // GunShop Sandy
    object.openDoor(97297972, -326.1122, 6075.27, 31.6047, false); // GunShop PaletoBay
    object.openDoor(4286093708, -324.2731, 6077.109, 31.6047, false); // GunShop PaletoBay
// Автомастерские
    object.openDoor(3744620119, -1145.898, -1991.144, 14.18357, false); // Los Santos Customs LSIA
    object.openDoor(3744620119, -356.0905, -134.7714, 40.01295, false); // Los Santos Customs Burton
    object.openDoor(270330101, 723.116, -1088.831, 23.23201, false); // Los Santos Customs La Mesa
    object.openDoor(3472067116, 1182.306, 2645.232, 38.63961, false); // Los Santos Customs Senora
    object.openDoor(3472067116, 1174.654, 2645.222, 38.63961, false); // Los Santos Customs Senora
    object.openDoor(1335311341, 1187.202, 2644.95, 38.55176, false); // Los Santos Customs Senora дверь
    object.openDoor(3867468406, -205.6828, -1310.683, 30.29572, false); // Bennys Original Motor Works
    object.openDoor(4104186511, 484.5642, -1315.574, 30.20331, false); // Beekers Garage
    object.openDoor(3630385052, 482.8112, -1311.953, 29.35057, false); // Beekers Garage дверь
    object.openDoor(2367695858, 500.1746, -1320.543, 28.25339, false); // Beekers Garage ворота перед
    object.openDoor(3472067116, 108.8502, 6617.876, 32.67305, false); // Hayes Autos
    object.openDoor(3472067116, 114.3135, 6623.233, 32.67305, false); // Hayes Autos
    object.openDoor(1335311341, 105.1518, 6614.655, 32.58521, false); // Hayes Autos дверь
// Остальное
    object.openDoor(2059227086, -59.89302, -1092.952, 26.88362, false); //Западная дверь PDM
    object.openDoor(1417577297, -60.54582, -1094.749, 26.88872, false); //Западная дверь PDM
    object.openDoor(2059227086, -39.13366, -1108.218, 26.7198, false); //Южная дверь PDM
    object.openDoor(1417577297, -37.33113, -1108.873, 26.7198, false); //Южная дверь PDM
    object.openDoor(2777093385, 106.3793, -742.6982, 46.18171, false); //Главный вход FIB
    object.openDoor(4204511029, 105.7607, -746.646, 46.18266, false); //Главный вход FIB
    object.openDoor(245182344, 716.7805, -975.4207, 25.00606, false); //Вход на швейную фабрику
    object.openDoor(3613901090, 719.3815, -975.4185, 25.00606, false); //Вход на швейную фабрику
    object.openDoor(2866345169, 1083.547, -1975.435, 31.62222, false); //Дверь литейного завода
    object.openDoor(2866345169, 1065.237, -2006.079, 32.23295, false); //Дверь литейного завода
    object.openDoor(2866345169, 1085.307, -2018.561, 41.62894, false); //Дверь литейного завода
    object.openDoor(2529918806, 1855.685, 3683.93, 34.59282, false); //Дверь Шерифов Сэнди-Шорес
    object.openDoor(2271212864, 1851.249, 3681.846, 34.417, false); //Дверь Шерифов Сэнди-Шорес
    object.openDoor(2271212864, 1849.948, 3684.099, 34.417, false); //Дверь Шерифов Сэнди-Шорес
    object.openDoor(2271212864, 1847.147, 3689.904, 34.417, false); //Дверь Шерифов Сэнди-Шорес
    object.openDoor(2271212864, 1849.4, 3691.204, 34.417, false); //Дверь Шерифов Сэнди-Шорес
    object.openDoor(2271212864, 1857.249, 3690.31, 34.417, false); //Дверь Шерифов Сэнди-Шорес
    object.openDoor(2793810241, -444.4985, 6017.06, 31.86633, false); //Дверь Шерифов Палето-Бей
    object.openDoor(2793810241, -442.66, 6015.222, 31.86633, false); //Дверь Шерифов Палето-Бей
    object.openDoor(2271212864, -440.9874, 6012.765, 31.86633, false); //Дверь Шерифов Палето-Бей
    object.openDoor(2271212864, -442.8268, 6010.925, 31.86633, false); //Дверь Шерифов Палето-Бей
    object.openDoor(2271212864, -447.7092, 6006.717, 31.86633, false); //Дверь Шерифов Палето-Бей
    object.openDoor(2271212864, -449.5486, 6008.556, 31.86633, false); //Дверь Шерифов Палето-Бей
    object.openDoor(2271212864, -450.716, 6016.37, 31.86633, false); //Дверь Шерифов Палето-Бей
    object.openDoor(2615085319, -1083.62, -260.4166, 38.1867, false); //Основные двери LifeInvader
    object.openDoor(3249951925, -1080.974, -259.0203, 38.1867, false); //Основные двери LifeInvader
    object.openDoor(1104171198, -1045.12, -232.004, 39.43794, false); //Задние двери LifeInvader
    object.openDoor(2869895994, -1046.516, -229.3581, 39.43794, false); //Задние двери LifeInvader
    object.openDoor(3954737168, -1042.518, -240.6915, 38.11796, false); //Служебная дверь LifeInvader
    object.openDoor(2795991823, 2509.743, -266.5509, -38.965, false); // Служебная дверь к лестнице в апартаментах Casino

    // Закрытые,Удалённые,Открытые ворота у домов
    object.openDoor(703855057, -25.2784, -1431.061, 30.83955, true); // House id 500
    object.openDoor(30769481, -815.2816, 185.975, 72.99993, true); // House id 539
    object.openDoor(67910261, 1972.787, 3824.554, 32.65174, true); // House id 777
    object.openDoor(4268302743, 2333.235, 2574.973, 47.03088, true); // House id 705
    object.openDoor(914592203, 2329.655, 2576.642, 47.03088, true); //  House id 705
    object.openDoor(2052512905, 18.65038, 546.3401, 176.3448, true); //  House id 12
    object.openDoor(1056781042, 175.8408, 477.0768, 142.4736, true); //  House id 14
    object.openDoor(1056781042, 171.3418, 477.9685, 142.4736, true); //  House id 14
    object.openDoor(3379875310, -674.3669, 907.1718, 231.2129, true); //  House id 150
    object.openDoor(3071729699, -1074.653, -1676.134, 4.658443, true); // Гараж на пляже
    object.openDoor(2642145829, -1067.011, -1665.597, 4.789768, true); // Гараж на пляже
    object.openDoor(1013329911, -1064.759, -1668.76, 4.789768, true); // Гараж на пляже
    object.openDoor(913904359, -689.1114, 506.9815, 110.6122, true); // Гараж N2840
    object.openDoor(4030503004, -400.4116, 513.326, 120.5016, true); // Гараж N3583
    object.openDoor(30769481, -966.759, 106.4263, 56.17257, true); // Гараж N4128
    object.openDoor(3450140131, -875.4845, 18.12612, 44.4434, false); // Ворота N4134
    object.openDoor(2169543803, -844.051, 155.9619, 66.03221, false); // Ворота N4110
    object.openDoor(889818406, 1151.06, -1646.344, 36.56644, true); // Гараж N733

    //IntClose
    object.openDoor(132154435, 1972.769, 3815.366, 33.66326, true); // int 1
    object.openDoor(3687927243, -1149.709, -1521.088, 10.78267, true); // int 5
    object.openDoor(520341586, -14.86892, -1441.182, 31.19323, true); // int 7
    object.openDoor(308207762, 7.518359, 539.5268, 176.1776, true); // int 8
    object.openDoor(159994461, -816.716, 179.098, 72.82738, true); // int 9
    object.openDoor(2608952911, -816.1068, 177.5109, 72.82738, true); // int 9
    object.openDoor(2840207166, -796.5657, 177.2214, 73.04045, true); // int 9
    object.openDoor(1245831483, -794.5051, 178.0124, 73.04045, true); // int 9
    object.openDoor(2840207166, -793.3943, 180.5075, 73.04045, true); // int 9
    object.openDoor(1245831483, -794.1853, 182.568, 73.04045, true); // int 9
    object.openDoor(2731327123, -806.2817, 186.0246, 72.62405, true); // int 9
    object.openDoor(2731327123, -777.9761, 322.9964, 212.1467, true); // int 10
    object.openDoor(3636940819, -757.6743, 618.5995, 144.2903, true); // int 11
    object.openDoor(3636940819, -1289.193, 450.2027, 98.04399, true); // int 12
    object.openDoor(3636940819, -793.9415, 324.5879, 217.1877, true); // int 13
    object.openDoor(2607919673, -793.9415, 324.5879, 217.1877, true); // int 13
    object.openDoor(4030239080, -793.9415, 324.5879, 217.1877, true); // int 13
    object.openDoor(1927676967, -793.9415, 324.5879, 217.1877, true); // int 13
    object.openDoor(3108570583, -793.9415, 324.5879, 217.1877, true); // int 13
    object.openDoor(1927676967, -793.9415, 324.5879, 217.1877, true); // int 13
    object.openDoor(330294775, -776.7023, 339.3779, 207.7347, true); // int 14

    //Close Doors
    object.openDoor(486670049, -107.5373, -9.018098, 70.67085, true);
    object.openDoor(3687927243, -1149.709, -1521.088, 10.78267, true);
    object.openDoor(443058963, 1972.51, 3813.948, 32.433, true);
    object.openDoor(1145337974, 1273.815, -1720.697, 54.92143, true);

    object.openDoor(961976194, 255.2283, 223.976, 102.3932, false);

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
};

object.openDoor = function (hash, x, y, z, isClose = false) {
    try {
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