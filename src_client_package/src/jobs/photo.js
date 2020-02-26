import methods from '../modules/methods';

import user from '../user';

import jobPoint from '../manager/jobPoint';

let photo = {};

let isProcess = false;
let isCheckpoint = false;
let _checkpointId = -1;
let price = 0;
let pickupId = 0;

photo.markers = [
    ['Спортплощадка', -1221.798, -1574.911, 4.118646, -76.1995],
    ['Надпись у здания LomBank', -1593.202, -614.1374, 31.24575, -9.300064],
    ['Съёмочная площадка', -1172.335, -510.3992, 35.56616, 52.9998],
    ['Полицейский Департамент', 392.2912, -948.7543, 29.39218, -125.9988],
    ['Медицинский центр на Pillbox Hill', 240.8259, -575.9076, 43.87289, -96.99943],
    ['Отделение Fleeca', 337.4033, -245.1497, 53.92711, 144.9982],
    ['Здание GoPostal', 44.74106, 86.68441, 77.68797, -34.59986],
    ['Augury Insurance', -310.3968, -374.2671, 30.03691, -164.2986],
    ['Магазин Clappers', 344.2603, 125.3217, 102.9739, -53.19974],
    ['Ресторан Last trian in Los Santos', -350.1212, 256.476, 85.10788, 67.19883],
    ['Особняк Epsilon', -674.2983, -32.09262, 38.50791, 12.30031],
    ['Металлическая скульптура', -1337.201, -1447.277, 4.313771, 145.4988],
    ['Магазин Suburban', 136.7624, -185.1287, 54.76174, 71.02419],
    ['Магазин LesBianco', -157.1795, -81.6405, 54.45595, -175.0476],
    ['Биллборд радиостанции SPACE', 380.77, 285.3769, 103.0945, 92.99959],
    ['Закусочная Up-n-Atom', 86.11817, 223.274, 108.3961, 7.000285],
    ['Прилавок Chihuhua Hotdogs', -1840.764, -1227.689, 13.01727, -137.197],
    ['Кинотеатр Tivoli', -1424.864, -158.7523, 47.9576, 177.9995],
    ['Флаг с именем Jessie Zhuang', 158.8128, -914.1066, 30.16211, -129.198],
    ['Магазин clicklovers', 246.1319, -1523.514, 29.14333, 74.70005],
    ['Магазин WIGS', 202.1749, -1325.376, 29.49501, 20.09957],
    ['Складское помещение 01', 490.4248, -1405.913, 29.31194, 42.59967],
    ['Граффити белой обводкой SA на восточной стороне', 597.2064, -1287.291, 9.212505, 69.9994],
    ['Биллборд с японским брендом водки', -646.0374, 268.8306, 81.41492, -156.5818],
    ['Вход в здание корпорации BETTA', -1237.563, -313.0685, 37.61991, -167.2987],
    ['Биллборд магазина украшений', -516.7966, -94.14859, 39.36575, -64.99948],
    ['Корейский барбершоп', -779.639, -569.0464, 30.12626, 136.7986],
    ['Палатка с эскизами татуировок', -1620.589, -1065.938, 13.05319, -124.2969],
    ['Магазин одежды с синей вывеской', -1336.347, -389.9257, 36.67995, -68.89892],
    ['Корейское интернет кафе', -711.8495, -869.5892, 23.37456, -173.5992],
    ['Вывеска здания FIB', 194.4498, -804.8818, 31.11214, 58.99979],
    ['Магазин 24/7', 221.5976, -39.80218, 69.5509, 74.49936],
    ['Вход в здание в Mors Mutual Insurance', -863.5101, -286.0032, 40.48231, -63.99981],
    ['Аренда велосипедов', -1108.972, -1680.51, 4.271053, 167.299],
    ['Видеосалон', -1148.714, -1617.759, 4.349223, -8.899557],
    ['Вывеска Rocford Hills', -823.2073, -102.7584, 37.63277, 30.29978],
    ['Билборд с рекламой пива', -140.0402, -1752.769, 30.40462, 90.2337],
    ['Огромная топливная цестерна фирмы Globe Oil', -40.4362, -2188.574, 7.811674, -79.39789],
    ['Билборд бритаского мультфильма про роботов', -786.6906, -2367.904, 14.57072, -134.3992],
    ['Cкульптура с автомобилем Issi', -954.6119, -2498.469, 14.27217, 95.89777],
    ['Синий плакат телепередачи Fame or Shame', -374.1018, -2029.52, 27.75573, -71.59921],
    ['Красный плакат телепередачи Fame or Shame', -374.9624, -2028.856, 27.75573, -4.899973],
    ['Контейнер компании GoPostal', -685.9784, -1722.333, 25.15021, -59.99951],
    ['Граффити S+S', -608.7999, -1182.023, 16.03182, 53.79954],
    ['Магазин 24/7', -567.4042, -1032.76, 22.17812, 22.99973],
    ['Вывеска компании eCola', -567.4482, -1032.077, 22.17812, 79.69893],
    ['Корейский цветочный магазин', -651.4968, -906.8931, 24.3494, 58.9994],
    ['Вход в Elkirdge Hotel', 239.2481, -948.7487, 29.30613, -79.99971],
    ['Вывеска Maze Bank of Los Santos', -20.02624, -965.3723, 29.28956, 29.99997],
    ['Детская площадка', 866.4493, -265.3909, 66.45057, -143.4487],
    ['Скейт площадка', 866.0291, -264.93, 66.46705, 63.0001],
    ['Западные футболные ворота', 784.4216, -195.3358, 73.46849, 118.1988],
    ['Восточные футболные ворота', 788.1462, -197.1823, 73.41233, -165.2997],
    ['Пристань на водохранилище', -234.5238, 753.4641, 199.0206, -53.99977],
    ['Главный вход в обсерваторию', -421.543, 1138.128, 325.8547, 166.8989],
    ['Ипподром', 1214.937, 416.978, 95.7067, 168.8994],
    ['Надпись ADULT XXX', 220.3576, 343.627, 105.5749, 106.6953],
    ['Главный вход в сауну', 121.7432, 344.5684, 112.2136, 170.001],
    ['Многоквартирный дом 2142', -59.78023, -31.14126, 66.21918, -75.99966],
    ['Многоквартирный дом 922', -60.00247, -31.96008, 66.03768, 121.0146],
    ['Магазин USHERO BROS.', -728.2969, -178.2559, 37.3747, -69.29958],
    ['Магазин CaCa', -627.1672, -255.7389, 38.62875, 94.99973],
    ['Кофейня Bean Machine', -587.5977, -1125.941, 22.17824, 33.59976],
    ['Магазин электроники Digital Den', -587.5969, -1126.472, 22.17824, 136.9992],
    ['Биллборд Burger Shot', -82.47101, -1358.529, 29.59524, -68.99972],
    ['Биллборд пивной компании', -83.59389, -1359.229, 29.61616, 74.99966],
    ['Здание RimmPaint', -89.07777, -1299.019, 29.30163, 59.2992],
    ['Здание газетного издателя Los Santos Meteor', -89.21008, -1299.629, 29.30204, 106.9994],
    ['Мусорные контейнеры', -13.91777, -1083.384, 26.67617, -85.19928],
    ['Коробки компании kakagawa', 719.2155, -1387.976, 26.36104, -90.59922],
    ['Вывеска института Wenger', -326.699, -317.4771, 30.83626, -27.20113],
    ['Магазин одежды Enema', -646.3799, -133.3257, 37.83576, 142.9988],
    ['Магазин косметики Facepalm', -646.5792, -132.695, 37.83498, 65.99976],
    ['Здание курьерской компании PostOp', -209.5029, -900.1819, 29.21383, 119.9998],
    ['Гаражные двери дома 2856', -613.3248, 681.6121, 149.4243, 163.9993],
    ['Дерево Сакура у обочины', -1426.709, 520.0207, 117.3583, 164.9997],
    ['Разукрашенная лодка на песке', -1404.679, -1390.783, 3.647676, 83.29954],
    ['Магазин масок Vespucci Movie Masks', -1344.851, -1273.604, 4.897687, -111.6989],
    ['Восточное баскетбольное поле', -921.3976, -695.1371, 22.36955, -159.3993],
    ['Западное баскетбольное поле', -922.0096, -695.1716, 22.28402, 161.999],
    ['Ангар компании Big Goods', 765.1608, -919.2067, 25.37712, -58.99975],
    ['Контейнер компании Bilgeco', 667.8206, -1101.831, 23.64248, 57.99965],
    ['Контейнер компании Jetsam', 667.7769, -1102.526, 23.6664, 117.9991],
    ['Театр Becon', 458.5044, -1434.629, 29.49693, -171.9986],
    ['Магазин одежды Checkout', 98.00925, -1401.399, 29.21664, 105.399],
    ['Вывеска у входа в автомойку', -23.38131, -1369.436, 29.5251, -140.9982],
    ['Строительный кран', -502.16, -955.9195, 23.85658, -116.9996],
    ['Многоквартирный дом 1053', -236.0931, 37.28616, 59.09993, -157.5989],
    ['Многоквартирный дом 2151', 105.5586, -60.51761, 66.80065, -89.79893],
    ['Многоквартирный дом 2152', 104.6458, -63.73256, 66.30494, -121.9992],
    ['Офис дантиста', 90.65649, -206.1493, 54.49123, -121.2984],
    ['Магазин с красной вывеской', -56.40736, -222.1097, 45.44493, -65.49969],
    ['Итальянская пиццерия', -1527.979, -922.8756, 10.12194, -7.999858],
    ['Вывеска магазина Fruit of the Vine', -1282.491, -1155.11, 5.742152, -107.5996],
    ['Театр Dionysia', -1292.714, -692.3011, 25.02315, -78.49966],
    ['Вход в кинотеатр Astro', -1293.5, -692.8668, 25.02978, 121.0001],
    ['Вывеска мотеля Perrera Beach', -1515.271, -718.7306, 27.35866, -16.09987],
    ['Магазин органической еды The Grain of Truth', -1443.962, -317.7246, 44.57766, -95.79964],
    ['Забегаловка Chihuhua Hotdogs', -1524.349, -437.3499, 35.44706, 35.59983],
    ['Бургерная Wigwam', -1531.652, -436.3013, 35.44709, 169.9995],
    ['Кофейня Bean Machine', -1527.259, -437.5265, 35.44707, 83],
    ['Дом розового цвета', -1924.389, -591.9382, 11.62293, -71.49965],
    ['Дом белого цвета', -1956.405, -565.3925, 11.56669, -4.80003],
    ['Забегаловка Lagoons', -1712.479, -1080.885, 13.06876, -93.29906],
    ['Надпись на ангаре Los Santos Marine', -367.417, -2765.118, 6.000306, -12.89992],
    ['Вывеска у дороги Jetsam Terminal', 752.1077, -2975.589, 6.21217, 156.4],
    ['Ангар компании Alpha Mail', 1190.921, -3206.711, 6.028042, -138.2982],
    ['Граффити RIP BENNY', 1045.424, -2633.934, 7.706017, -34.99947],
    ['Топливная цестерна с выцветшей надписью Globe Oil', 1383.295, -2061.202, 51.99854, -150.9994],
    ['Вывеска сигаретной компании RedWood', 1329.815, -1632.389, 52.11873, -154.9994],
    ['Самый красивый дом в Миррор-Парке', 934.284, -598.4936, 57.45319, 133.9983],
    ['Винтажный магазин Mini Retro', 1190.63, -465.6613, 66.48862, -155.2976],
    ['Забегаловка Bite!', 1156.7, -473.5087, 66.46877, 58.49972],
    ['Биллборд фильма Zoo Sequel II', -1259.991, -447.1987, 33.57994, 176.6024],
    ['Эмблему марки автомобилей Pegassi', -1132.997, -1985.067, 13.16607, 14.312],
    ['Биллборд телешоу Dude Eat Dog', -744.6431, -2170.073, 14.46458, -15.99999],
    ['Огромный плакат на здание фильма Space Monkey 3D', -578.06, 246.9286, 82.78386, 39.99963],
    ['Магазин одежды Binco', -493.883, 266.9829, 83.25262, -41.29976],
    ['Биллборд телешоу Rehab Island', -1356.889, -395.4039, 36.60926, 22.50018],
    ['Вывеска на здание компании Tinkle', -94.11451, -722.3895, 44.32792, -16.49997],
    ['Въезд в подземную сеть тунелей', 1045.421, -293.7626, 49.88241, 20.9999],
    ['Огромная надпись на холмах Vinewood', 92.50325, 806.321, 211.1259, -58.19978],
    ['Салон аркадных автоматов Arcade', -119.2861, -1720.143, 30.10711, -179.7997],
    ['Торговый центр Mega Mall', 7.348856, -1677.904, 29.30546, -144.2994],
    ['Граффити Thief', 915.6605, -2451.029, 28.54524, 154.6999],
    ['Металлические трубы', 1679.624, -61.91736, 173.7748, -168.2005],
    ['Кабинка у пропустного пункта N.O.O.S.E.', 2598.136, -318.1286, 92.89099, 37.49839],
    ['Аппарат с газировкой Sprunk', 2571.826, 381.115, 108.4579, 96.39957],
    ['Биллборд радиостанции Los Santos Rock Radio', 2633.654, 579.824, 95.19106, -1.800208],
    ['Вывеска департамента городского департамента Green Power', 2534.314, 1631.929, 29.40426, -96.69846],
    ['Розового динозавра забегаловки Rexs Diner', 2586.74, 2610.191, 35.93538, 152.1994],
    ['Главный вход в забегаловку Rexs Diner', 2586.407, 2610.663, 35.98343, 127.9992],
    ['Вывеска коропорации Dsavis Quartz', 2535.174, 2707.386, 42.56573, -38.79957],
    ['Изрисованный биллборд топливной компании RON', 2082.792, 3037.752, 45.67089, -29.29991],
    ['Вход в бар Jellow Jack', 2003.623, 3066.39, 47.04969, 134.9989],
    ['Главный вход в тюрьму Bolingbroke', 1866.504, 2578.788, 45.67204, 73.09932],
    ['Радиовышка в аэропорту Sandy Shores', 1720.629, 3260.252, 41.14528, 29.99988],
    ['Магазин одежды Discount Store', 1184.025, 2690.263, 37.76842, -45.29993],
    ['Девятая комната в мотеле', 1123.093, 2656.364, 37.99691, 145.5984],
    ['Четвёртая комната в мотеле', 1123.487, 2656.388, 37.99691, -129.3995],
    ['Зоомагазин Animal Ark', 587.101, 2725.087, 42.06021, 55.09946],
    ['Синий контейнер компании ThriftEx', 192.4852, 2752.589, 43.42635, -110.9985],
    ['Вывеска цементного завода', 253.2264, 2837.436, 43.48744, -12.29996],
    ['Черная могила на кладбище', -290.3619, 2844.046, 54.72644, -0.09992266],
    ['Главный вход в здание радиостации Rebel', 750.6776, 2523.443, 73.12492, 95.79945],
    ['Военный мемориал памяти 74 года', -1284.955, 2519.917, 20.03432, 114.6992],
    ['Военный мемориал памяти 98 года', -1284.764, 2520.232, 20.00024, -10.19983],
    ['Вывеску виноградников Marlowe', -1861.707, 2017.196, 138.7023, 48.99993],
    ['Гидроскутер', -1491.91, 1508.71, 115.4187, 28.39926],
    ['Отделение Blane Country Savings Bank', -3138.602, 1104.393, 20.6873, 7.499934],
    ['Мусорный контейнер возле магазина', -3236.418, 985.8615, 12.61698, 38.79974],
    ['Подвешанная лодка', -3410.254, 981.5355, 8.351688, 68.09993],
    ['Ворота особняка', -2539.12, 1900.811, 168.4299, 59.79983],
    ['Биллборд пивной компании', 895.455, 3528.413, 33.95568, 61.09954],
    ['Радиовышка', 1044.78, 3598.731, 33.41666, 111.1994],
    ['Вход в алкогольный магазин Liquor Ace', 1411.453, 3581.215, 35.0114, 41.59986],
    ['Вывеска заброшенного мотеля', 1466.473, 3581.201, 35.73079, -98.19981],
    ['Вход в магазина запчастей Otto', 1936.854, 3701.705, 32.3495, 17.79997],
    ['Вход в департамент шерифа', 1856.81, 3656.661, 34.00325, 2.69992],
    ['Граффити Beam Me Up', 2460.34, 3798.987, 40.05151, -82.09903],
    ['Заброшенный и разресованный грузовик', 2469.236, 3760.581, 41.75901, 79.09998],
    ['Автомобил Regina с инопланетным кораблём', 2469.593, 3760.442, 41.75899, -91.99957],
    ['Ларёк свеживыжатых напитков', 2751.456, 4388.556, 48.92519, 19.09994],
    ['Синий флаг магазина You Tool', 2766.823, 3464.644, 55.63288, 11.29953],
    ['Пропускной пункт Humane Labs', 3359.606, 3697.851, 38.2488, -46.19963],
    ['Деревья Сакуры', 2464.137, 4540.065, 35.11476, -4.299988],
    ['Неоновая ракета на здание аркадных автоматов', 1668.932, 4782.51, 41.86345, -119.9998],
    ['Водонопорная башня городского департамента Water and Power', 1640.338, 4801.245, 44.76721, -70.69968],
    ['Зерновые башни Union Grain Supply Inc.', 2033.123, 5069.085, 41.29605, 135.7988],
    ['Радиовышка', 2093.031, 4807.501, 41.36137, -168.1993],
    ['Вход в лодочный магазин', 1329.196, 4351.915, 42.96048, 60.69926],
    ['Водонапорная башня Fort Zancudo', -1672.686, 3075.358, 31.61432, 24.39994],
    ['Вывеска рыбного магазина Hokies', -2241.283, 4311.154, 47.96995, -106.499],
    ['Указательный биллборд на лесопилку', -848.7232, 5460.068, 34.10034, -178.9992],
    ['Здание аренды велосипедов', -782.9459, 5557.75, 33.59847, -10.09998],
    ['Вход в здание департамента шерифа', -410.5127, 6049.121, 31.60069, 142.0994],
    ['Вывеска на здание PostOp', -415.584, 6106.368, 31.402, 13.89989],
    ['Вход в церковь', -364.0811, 6156.75, 31.42673, -98.19917],
    ['Реконструируемый дом', -384.2845, 6303.641, 29.51764, -89.5998],
    ['Вход в ветеренарную клинику', -250.6753, 6270.597, 31.43986, 58.49962],
    ['Вывеска грузовой компании Jetsam', -250.3495, 6191.633, 31.49613, -179.2001],
    ['Вход в бар The Hen House', -290.1166, 6231.074, 31.43347, 23.5999],
    ['Аптека Pops Pills', 142.1253, 6616.236, 32.08411, -14.69997],
    ['Ржавый синий ангар Bell Farms', 66.41333, 6391.958, 31.23723, -115.7995],
    ['Вход в отделение Blaine Country Savings Bank', -132.3812, 6429.918, 31.39865, -31.99997],
    ['Разрушенный дом у пристани', -209.836, 6559.147, 10.95743, -115.2993],
    ['Пристань', 3803.419, 4460.738, 4.667891, -85.69939],
    ['Ржавый автомобиль на берегу озера', 1957.908, 3973.024, 31.87669, 98.60009],
    ['Рекламная наклейка супермаркета 24/7 на окне', -2547.658, 2326.199, 33.05989, -125.0004],
    ['Парусную лодку', 578.9974, 3015.542, 41.29731, 24.99996],
    ['Водопад', -698.4995, 4429.134, 16.08828, -95.00032],
    ['Лесопильня', -691.7258, 5354.653, 66.15254, -99.79893],
    ['Общественный туалет', -2208.241, 4258.702, 46.4929, -106.3987],
    ['Статуя дровосека', -702.823, 5843.404, 15.89661, -136.8978],
    ['Биллборд Cluckin Bell', -2.536771, 6397.686, 30.30623, -77.89713],
    ['Офис Park Rangers', -1515.241, 4971.25, 61.46518, -72.7961],
    ['Пешеходный мост', -3050.293, 280.3873, 19.08517, -23.79603],
    ['Вход в забегаловку Mojito Inn', -127.2242, 6414.499, 30.41055, -169.9952],
    ['Вывеска Paleto Bay', -387.4014, 5969.415, 30.67694, 18.6046],
    ['Доска для серфинга с надписью Surfing Lessons', -2974.398, 429.1021, 14.1878, -109.6953],
];

photo.start = function() {
    if (isProcess) {
        mp.game.ui.notifications.show('~r~Вы уже получили задание');
        return;
    }
    photo.findRandomPickup();
};

photo.stop = function() {
    isProcess = false;
    isCheckpoint = false;
    _checkpointId = -1;
    price = 0;
    pickupId = 0;
    jobPoint.delete();
};

photo.ask = function() {
    mp.game.ui.notifications.showWithPicture('Life Invader', "Начальник", `Необходимо сфотографировать ~y~${photo.markers[pickupId][0]}`, "CHAR_LIFEINVADER", 1);
};

photo.findRandomPickup = function() {
    try {
        isProcess = true;
        pickupId = methods.getRandomInt(0, photo.markers.length - 1);
        let pos = new mp.Vector3(photo.markers[pickupId][1], photo.markers[pickupId][2], photo.markers[pickupId][3] - 1);
        price = methods.parseFloat(methods.distanceToPos(pos, mp.players.local.position) / 50);
        if (price > 100)
            price = 100;
        _checkpointId = jobPoint.create(pos, true, 3);
        mp.game.ui.notifications.showWithPicture('Life Invader', "Начальник", `Необходимо сфотографировать ~y~${photo.markers[pickupId][0]}`, "CHAR_LIFEINVADER", 1);
    }
    catch (e) {
        methods.debug(e);
    }
};

photo.getDirectionPosition = function(rot) {
    let dgr = rot + 180;
    if (dgr >= 22.5 && dgr < 67.5)
        return "SE";
    if (dgr >= 67.5 && dgr < 112.5)
        return "E";
    if (dgr >= 112.5 && dgr < 157.5)
        return "NE";
    if (dgr >= 157.5 && dgr < 202.5)
        return "N";
    if (dgr >= 202.53 && dgr < 247.5)
        return "NW";
    if (dgr >= 247.5 && dgr < 292.5)
        return "W";
    if (dgr >= 292.5 && dgr < 337.5)
        return "SW";
    return "S";
};

photo.workProcess = function() { //TODO

    methods.debug('photo.work')

    isCheckpoint = false;
    let pos = mp.players.local.position;
    photo.markers.forEach(function (item, i) {
        let pPos = new mp.Vector3(item[1], item[2], item[3]);
        if (methods.distanceToPos(pPos, pos) < 2) {

            let playerPos = photo.getDirectionPosition(mp.players.local.getRotation(0).z);
            let pointPos = photo.getDirectionPosition(item[4]);

            isProcess = true;
            mp.players.local.freezePosition(true);
            methods.blockKeys(true);
            try {
                jobPoint.delete();
            }
            catch (e) {
                methods.debug(e);
            }
            _checkpointId = -1;
            pickupId = 0;

            user.playScenario("WORLD_HUMAN_PAPARAZZI");

            setTimeout(function () {
                isProcess = false;
                methods.blockKeys(false);
                mp.players.local.freezePosition(false);
                user.stopScenario();

                methods.debug(pointPos);
                methods.debug(playerPos);

                if (pointPos === playerPos) {
                    mp.game.ui.notifications.showWithPicture('Life Invader', "Начальник", `Отличный кадр, за него ты получишь премию!`, "CHAR_LIFEINVADER", 1);
                    user.giveJobMoney(methods.getRandomInt(150, 200) + price);
                    user.addWorkExp(10);
                }
                else if (playerPos.indexOf(pointPos) >= 0 || pointPos.indexOf(playerPos) >= 0) {
                    mp.game.ui.notifications.showWithPicture('Life Invader', "Начальник", `Не плохой кадр, но можно и лучше`, "CHAR_LIFEINVADER", 1);
                    user.giveJobMoney(methods.getRandomInt(100, 150) + price);
                    user.addWorkExp(5);
                }
                else {
                    mp.game.ui.notifications.showWithPicture('Life Invader', "Начальник", `Я промолчу... Вот твои деньги`, "CHAR_LIFEINVADER", 1);
                    user.giveJobMoney(price);
                    user.addWorkExp(1);
                }

                user.addRep(5);
                user.giveJobSkill();
                price = 0;
            }, 30000);
        }
    });
};

mp.events.add("playerEnterCheckpoint", (checkpoint) => {
    if (mp.players.local.vehicle)
        return;
    if (!isProcess) return;
    if (_checkpointId == -1 || _checkpointId == undefined)
        return;
    if (checkpoint.id == _checkpointId) {
        isCheckpoint = true;
        mp.game.ui.notifications.show('~b~Когда выставите позицию, нажмите ~s~E');
    }
});

//E
mp.keys.bind(0x45, true, function() {
    try {
        if (!user.isLogin())
            return;
        if (isCheckpoint) {
            photo.workProcess();
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

export default photo;