import methods from "./modules/methods";

let enums = {};

enums.clothM = [];
enums.propM = [];
enums.clothF = [];
enums.propF = [];
enums.shopList = [];
enums.overlays = [];
enums.tprint = [];
enums.tattooList = [];
enums.vehicleInfo = [];

enums.get = function(_enum){
    switch (_enum) {
        case 'clothM': return enums.clothM;
        case 'propM': return enums.propM;
        case 'clothF': return enums.clothF;
        case 'propF': return enums.propF;
        case 'shopList': return enums.shopList;
        case 'vehicleInfo': return enums.vehicleInfo;
        case 'overlays': return enums.overlays;
        case 'printList': return enums.tprint;
        case 'tattooList': return enums.tattooList;
        case 'fractionList': return enums.fractionListId;
        default: return undefined;
    }
};

let currentRequestID = 0;
let pendingRequests = {};

// должно быть тут, иначе никак
mp.events.add('client:enums:updateCloth', (requestID, overlays, clothM, clothF, propM, propF) => {
    try {
        if (pendingRequests[requestID]) {
            pendingRequests[requestID]([overlays, clothM, clothF, propM, propF]);
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
});

// должно быть тут, иначе никак
mp.events.add('client:enums:updateCloth1', (requestID, tattooList, printList, fractionList) => {
    try {
        if (pendingRequests[requestID]) {
            pendingRequests[requestID]([tattooList, printList, fractionList]);
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
});

let updateCloth = function() {
    return new Promise((resolve) => {
        pendingRequests[currentRequestID] = resolve;
        mp.events.callRemote('server:enums:getCloth', currentRequestID);
        currentRequestID++;
    });
};

let updateTattoo = function() {
    return new Promise((resolve) => {
        pendingRequests[currentRequestID] = resolve;
        mp.events.callRemote('server:enums:getCloth1', currentRequestID);
        currentRequestID++;
    });
};

enums.resetVehicleInfo = function() {
    enums.vehicleInfo = [];
};

enums.updateVehicleInfo = function(idx, data) {
    if (idx == 0)
        enums.vehicleInfo = [];
    enums.vehicleInfo = enums.vehicleInfo.concat(data);
};

enums.fontList = ["Roboto", "Arial", "Century Gothic", "HACKED", "Choujikuu"];

enums.offsets = { //TODO
    house: 100000,
    condo: 200000,
    condoBig: 290000,
    apartment: 300000,
    vehicle: 400000,
    yacht: 500000,
    business: 600000,
    stock: 700000,
    fraction: 800000,
};

enums.dispatchItemList = [];

enums.networkList = [
    [-338.7884, -579.6178, 48.09489],
    [-293.0222, -632.1178, 47.43132],
    [-269.2281, -962.775, 143.5142],
    [98.88757, -870.8663, 136.9165],
    [580.1769, 89.59447, 117.3308],
    [423.6479, 15.56825, 151.9242],
    [424.9219, 18.586, 151.931],
    [551.9955, -28.19887, 93.86244],
    [305.863, -284.8494, 68.29829],
    [299.488, -313.9493, 68.29829],
    [1240.899, -1090.095, 44.35722],
    [-418.4464, -2804.495, 14.80695],
    [802.3354, -2996.213, 27.36875],
    [548.3521, -2219.756, 67.94666],
    [-701.2187, 58.91474, 68.68575],
    [-696.7746, 208.6952, 139.7731],
    [-769.8155, 255.006, 134.7385],
    [-1918.884, -3028.625, 22.61429],
    [-1039.817, -2385.444, 27.40255],
    [-1590.373, -3212.547, 28.6604],
    [-1311.997, -2624.589, 36.11582],
    [-991.5846, -2774.019, 48.31227],
    [-556.7017, -119.8519, 50.98835],
    [-619.0831, -106.5815, 51.01202],
    [-1152.408, -443.9738, 42.89137],
    [-1156.081, -498.8079, 49.32043],
    [-1290.007, -445.2428, 106.4711],
    [-770.0829, -786.3356, 83.82861],
    [-824.3132, -719.1805, 120.2517],
    [-598.8342, -917.809, 35.84408],
    [-678.5171, -717.0078, 54.09795],
    [-669.458, -804.2544, 31.8844],
    [-1463.988, -526.1229, 83.58365],
    [-1525.904, -596.7999, 66.52119],
    [-1375.134, -465.2585, 83.51427],
    [-1711.984, 478.334, 127.1892],
    [202.6934, 1204, 230.2588],
    [217.0646, 1140.443, 230.2588],
    [668.7827, 590.3213, 136.9934],
    [722.2471, 562.2682, 134.2943],
    [838.1705, 510.1091, 138.6649],
    [773.1747, 575.3554, 138.4155],
    [735.4507, 231.9995, 145.1368],
    [450.932, 5566.451, 795.442],
    [-449.0599, 6019.923, 35.56564],
    [-142.5559, 6286.784, 39.26382],
    [-368.0471, 6105.006, 38.42902],
    [2796.773, 5992.872, 354.989],
    [3460.883, 3653.532, 51.16711],
    [3614.592, 3636.562, 51.16711],
    [-2180.794, 3252.703, 54.3309],
    [-2124.381, 3219.853, 54.3309],
    [-2050.939, 3178.414, 54.3309],
    [1858.295, 3694.042, 37.91168],
    [1695.486, 3614.863, 37.79684],
    [1692.829, 2532.073, 60.33785],
    [1692.829, 2647.942, 60.33785],
    [1824.353, 2574.386, 60.56225],
    [1407.908, 2117.489, 104.1011],
    [-214.6158, -744.6461, 219.4428],
    [-166.7245, -590.6718, 199.0783],
    [124.2959, -654.8749, 261.8616],
    [149.2771, -769.0092, 261.8616],
    [253.297, -3145.925, 39.40688],
    [207.652, -3145.925, 39.41451],
    [207.652, -3307.397, 39.51926],
    [247.3365, -3307.397, 39.52404],
    [484.2856, -2178.582, 40.25116],
    [-150.321, -150.2459, 96.1528],
    [-202.9684, -327.1913, 65.04893],
    [-1913.77, -3031.85, 22.58777],
    [-1042.578, -2390.227, 27.40255],
    [-1583.461, -3216.81, 28.63388],
    [-1308.23, -2626.368, 36.0893],
    [-984.6726, -2778.282, 48.28575],
    [-1167.27, -575.0267, 40.19548],
    [-928.5076, -383.1334, 135.2698],
    [-902.8115, -443.0529, 170.8185],
    [-2311.601, 335.4441, 187.6049],
    [-2214.416, 342.206, 198.1012],
    [-2234.355, 187.0235, 193.6015],
    [2792.246, 5996.045, 355.1923],
    [3459.178, 3659.834, 51.19159],
    [3615.938, 3642.95, 51.19159]
];

enums.spawnByRole = [
    [-415.363037109375, -2630.680419921875, 8.761142730712891, 224.08807373046875],
    [-1370.454833984375, -526.2842407226562, 29.326345443725586, 116.12171936035156],
    //[-1042.025, -2744.718, 20.3594, 327.3454], //AERO
    [2046.785, 3566.849, 39.19671, 243.1456],
];

enums.spawnSellCar = [
    [144.61607360839844, -2230.792724609375, 5.033327102661133],
    [144.61607360839844, -2230.792724609375, 5.033327102661133],
    [144.61607360839844, -2230.792724609375, 5.033327102661133],
    [144.61607360839844, -2230.792724609375, 5.033327102661133],
    [144.61607360839844, -2230.792724609375, 5.033327102661133],
    [144.61607360839844, -2230.792724609375, 5.033327102661133],
    [144.61607360839844, -2230.792724609375, 5.033327102661133],
    [144.61607360839844, -2230.792724609375, 5.033327102661133],
    [144.61607360839844, -2230.792724609375, 5.033327102661133],
    [144.61607360839844, -2230.792724609375, 5.033327102661133],
    [144.61607360839844, -2230.792724609375, 5.033327102661133],
];

enums.screenEffectList = [
    'BeastIntroScene','BeastLaunch','BeastTransition','BikerFilter','BikerFilterOut','BikerFormation','BikerFormationOut','CamPushInFranklin','CamPushInMichael','CamPushInNeutral','CamPushInTrevor','ChopVision','CrossLine','CrossLineOut','DeadlineNeon','DeathFailFranklinIn','DeathFailMichaelIn','DeathFailMPDark','DeathFailMPIn','DeathFailNeutralIn','DeathFailOut','DeathFailTrevorIn','DefaultFlash','DMT_flight','DMT_flight_intro','Dont_tazeme_bro','DrugsDrivingIn','DrugsDrivingOut','DrugsMichaelAliensFight','DrugsMichaelAliensFightIn','DrugsMichaelAliensFightOut','DrugsTrevorClownsFight','DrugsTrevorClownsFightIn','DrugsTrevorClownsFightOut','ExplosionJosh3','FocusIn','FocusOut','HeistCelebEnd','HeistCelebPass','HeistCelebPassBW','HeistCelebToast','HeistLocate','HeistTripSkipFade','InchOrange','InchOrangeOut','InchPickup','InchPickupOut','InchPurple','InchPurpleOut','LostTimeDay','LostTimeNight','MenuMGHeistIn','MenuMGHeistIntro','MenuMGHeistOut','MenuMGHeistTint','MenuMGIn','MenuMGSelectionIn','MenuMGSelectionTint','MenuMGTournamentIn','MenuMGTournamentTint','MinigameEndFranklin','MinigameEndMichael','MinigameEndNeutral','MinigameEndTrevor','MinigameTransitionIn','MinigameTransitionOut','MP_Bull_tost','MP_Bull_tost_Out','MP_Celeb_Lose','MP_Celeb_Lose_Out','MP_Celeb_Preload','MP_Celeb_Preload_Fade','MP_Celeb_Win','MP_Celeb_Win_Out','MP_corona_switch','MP_intro_logo','MP_job_load','MP_Killstreak','MP_Killstreak_Out','MP_Loser_Streak_Out','MP_OrbitalCannon','MP_Powerplay','MP_Powerplay_Out','MP_race_crash','MP_SmugglerCheckpoint','MP_TransformRaceFlash','MP_WarpCheckpoint','PauseMenuOut','pennedIn','PennedInOut','PeyoteEndIn','PeyoteEndOut','PeyoteIn','PeyoteOut','PPFilter','PPFilterOut','PPGreen','PPGreenOut','PPOrange','PPOrangeOut','PPPink','PPPinkOut','PPPurple','PPPurpleOut','RaceTurbo','Rampage','RampageOut','SniperOverlay','SuccessFranklin','SuccessMichael','SuccessNeutral','SuccessTrevor','switch_cam_1','switch_cam_2','SwitchHUDFranklinIn','SwitchHUDFranklinOut','SwitchHUDIn','SwitchHUDMichaelIn','SwitchHUDMichaelOut','SwitchHUDOut','SwitchHUDTrevorIn','SwitchHUDTrevorOut','SwitchOpenFranklin','SwitchOpenFranklinIn','SwitchOpenFranklinOut','SwitchOpenMichaelIn','SwitchOpenMichaelMid','SwitchOpenMichaelOut','SwitchOpenNeutralFIB5','SwitchOpenNeutralOutHeist','SwitchOpenTrevorIn','SwitchOpenTrevorOut','SwitchSceneFranklin','SwitchSceneMichael','SwitchSceneNeutral','SwitchSceneTrevor','SwitchShortFranklinIn','SwitchShortFranklinMid','SwitchShortMichaelIn','SwitchShortMichaelMid','SwitchShortNeutralIn','SwitchShortNeutralMid','SwitchShortTrevorIn','SwitchShortTrevorMid','TinyRacerGreen','TinyRacerGreenOut','TinyRacerIntroCam','TinyRacerPink','TinyRacerPinkOut','WeaponUpgrade'
];

enums.fractionArsenalItems = [
    [], //0
    [40, 79], //1 GOV
    [], //2 SAPD
    [], //3 FIB
    [], //4 USMC
    [], //5 SHERIFF
    [], //6 EMS
    [], //7 NEWS
];

enums.gunShopItems = [
    54, 63, 64, 65, 69, 77, 80, 71, 87, 90, 91, 94, 99, 103, 104,
    280, 281, 282, 283, 284, 285, 286, 287,
];

enums.shopItems = [
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 241, 242,
    26, 4, 6, 253
];

enums.shopAlcItems = [
    11, 241, 242, 26, 243, 244, 245, 246, 247, 248, 249, 250
];

enums.shopElItems = [
    29, 59
];

enums.shopMedItems = [
    215, 221, 242
];

enums.shopFishItems = [
    0, /*1, 251, */253, 59, 241, 242, 11, 13, 26
];

enums.shopHuntItems = [
    0, /*1, */59, 63, 241, 242, 11, 13, 26, 4, 5, 6
];

enums.zoneGreenList = [
    // Здание правительства
    [new mp.Vector3(-1387.833, -586.5934, 29.21491), new mp.Vector3(-1457.157, -484.1866, 33.62592), new mp.Vector3(-1375.892, -426.3407, 35.40124), new mp.Vector3(-1301.453, -526.4561, 32.04372)],
// LSPD Mission Row
    [new mp.Vector3(506.717, -942.7224, 25.82825), new mp.Vector3(387.7115, -941.4905, 28.42496), new mp.Vector3(386.1652, -1033.62, 28.25324), new mp.Vector3(506.4058, -1024.583, 26.98783)],
// EMS Pillbox Hill
    [new mp.Vector3(352.326, -639.8761, 28.08734), new mp.Vector3(417.6253, -538.994, 27.68131), new mp.Vector3(251.1795, -555.0599, 42.15175), new mp.Vector3(231.9872, -600.7415, 41.41925)],
// Порт (Спавн с ролью иммигрант)
    [new mp.Vector3(-404.5479, -2683.884, 5.000217), new mp.Vector3(-377.1501, -2655.839, 5.000296), new mp.Vector3(-418.8766, -2612.982, 9.829632), new mp.Vector3(-447.2021, -2640.904, 7.761137)],
// Arcadius
    [new mp.Vector3(-196.0657, -644.1731, 31.066), new mp.Vector3(-120.8817, -672.189, 34.0876), new mp.Vector3(-88.33177, -578.3957, 35.35304), new mp.Vector3(-163.7393, -556.3748, 31.59664)],
// BCSD Paleto Bay
    [new mp.Vector3(-410.9683, 6002.903, 30.61874), new mp.Vector3(-444.7232, 6069.432, 30.34651), new mp.Vector3(-461.2996, 5951.067, 32.28299), new mp.Vector3(-512.1812, 6001.435, 32.8746)],
// Работа Садовника
    [new mp.Vector3(-1571.803, -257.0372, 47.33221), new mp.Vector3(-1560.058, -236.9716, 48.48336), new mp.Vector3(-1584.584, -221.8857, 53.54621), new mp.Vector3(-1598.521, -251.6665, 52.63494)],
// Работа Разнорабочего
    [new mp.Vector3(-1133.334, -781.1204, 16.52531), new mp.Vector3(-1108.982, -759.9604, 18.28799), new mp.Vector3(-1144.999, -718.6195, 20.15531), new mp.Vector3(-1167.832, -737.6433, 18.91395)],
// Здание LifeInvader
    [new mp.Vector3(-1002.437, -226.0831, 36.73341), new mp.Vector3(-1040.046, -209.875, 36.67278), new mp.Vector3(-1144.589, -266.6368, 36.81673), new mp.Vector3(-1115.328, -283.9192, 36.80877)],
// Здание GoPostal (Вайнвуд)
    [new mp.Vector3(50.87667, 113.4812, 77.82799), new mp.Vector3(59.56239, 132.435, 79.53921), new mp.Vector3(148.6105, 91.33247, 85.0307), new mp.Vector3(146.2028, 78.32605, 81.49789)],
// Автобусная станция (Текстайл-Сити)
    [new mp.Vector3(467.1642, -664.6202, 26.12754), new mp.Vector3(483.9933, -557.0571, 27.49981), new mp.Vector3(447.8136, -550.2209, 27.46078), new mp.Vector3(371.5351, -664.3466, 28.29856)],
// Здание Union Depository (Работа инкассатора)
    [new mp.Vector3(32.74713, -665.5975, 30.76728), new mp.Vector3(-68.06461, -629.1736, 35.26543), new mp.Vector3(-88.16122, -683.8469, 34.20391), new mp.Vector3(15.12879, -719.7209, 30.94946)],
// Premium Delux Motorsport (Автосалон среднего класса)
    [new mp.Vector3(-71.35185, -1122.371, 24.79609), new mp.Vector3(-57.32495, -1081.403, 25.88482), new mp.Vector3(-18.87212, -1094.573, 25.67206), new mp.Vector3(-28.85773, -1120.59, 25.64333)],
// Luxury Autos (Премианльный автосалон)
    [new mp.Vector3(-790.465, -258.0201, 36.07467), new mp.Vector3(-756.9535, -243.8946, 36.11623), new mp.Vector3(-792.3676, -184.192, 36.28367), new mp.Vector3(-823.358, -201.1273, 36.35587)],
// Sanders Motorcycles (Мотосалон)
    [new mp.Vector3(311.381, -1143.98, 28.41365), new mp.Vector3(310.5697, -1168.276, 28.2919), new mp.Vector3(237.1186, -1167.898, 28.30816), new mp.Vector3(230.7025, -1142.948, 28.28091)],
// VANs Autos (Автосалон грузовых авто)
    [new mp.Vector3(1027.288, -2373.666, 29.52958), new mp.Vector3(992.8026, -2370.598, 29.54955), new mp.Vector3(1001.336, -2278.167, 29.72932), new mp.Vector3(1035.654, -2280.839, 29.49135)],
// Albany Autos (Автосалон дешёвых авто)
    [new mp.Vector3(-70.0181, -1682.63, 28.14952), new mp.Vector3(-27.94766, -1633.028, 28.28867), new mp.Vector3(6.581477, -1680.426, 28.1539), new mp.Vector3(-48.83691, -1703.254, 28.12404)],
// Sandy Rust Cars (Автосалон ржавыхь авто)
    [new mp.Vector3(1616.584, 3760.319, 33.73037), new mp.Vector3(1599.5, 3782.713, 33.7427), new mp.Vector3(1668.826, 3838.526, 33.88387), new mp.Vector3(1690.591, 3816.208, 33.96543)],
];

enums.zoneYellowList = [
    "ALTA",
    "BEACH",
    "BRADT",
    "BURTON",
    "CHIL",
    "CHU",
    "CMSW",
    "CYPRE",
    "DELBE",
    "DELPE",
    "DELSOL",
    "LOSPUER",
    "DOWNT",
    "DTVINE",
    "EAST_V",
    "ELYSIAN",
    "GRAPES",
    "HARMO",
    "HAWICK",
    "KOREAT",
    "LEGSQU",
    "LMESA",
    "MIRR",
    "MORN",
    "MURRI",
    "MOVIE",
    "NCHU",
    "PALETO",
    "PALMPOW",
    "PBLUFF",
    "PBOX",
    "RICHM",
    "ROCKF",
    "SANDY",
    "SKID",
    "TERMINA",
    "TEXTI",
    "VCANA",
    "VESP",
    "VINE",
    "WVINE",
];

enums.garageNames = [
    'Очень маленький',
    'Очень маленький',
    'Маленький',
    'Средний',
    'Средний',
    'Большой',
    'Маленький',
    'Многоуровневый',
    'Многоуровневый',
];

enums.lscClassPrice = [
    ['Commercials', 1.2],
    ['Compacts', 1],
    ['Coupes', 1.5],
    ['Industrial', 1.6],
    ['Motorcycles', 1.2],
    ['Muscle', 5],
    ['Off-Road', 1.5],
    ['Sedans', 2],
    ['Sports', 5],
    ['Sports Classics', 8],
    ['Super', 10],
    ['SUVs', 3],
    ['Utility', 1],
    ['Vans', 2],
];

enums.lscNames = [
    ['Спойлер', 750],
    ['Передний бампер', 1000],
    ['Задний бампер', 1000],
    ['Боковые юбки', 925],
    ['Выхлопная труба', 810],
    ['Внутренняя рама', 600],
    ['Решетка радиатора', 450],
    ['Капот', 1100],
    ['Крылья', 650],
    ['Крылья-2', 650],
    ['Крыша', 1000],
    ['Двигатель', 750],
    ['Тормозная система', 1000],
    ['Трансмиссия', 1500],
    ['Гудок', 59000],
    ['Высота подвески', 1600],
    ['Броня', 0],
    ['17', 0],
    ['Турбо', 12500],
    ['19', 0],
    ['20', 0],
    ['21', 0],
    ['Ксенон', 750],
    ['Колёса', 2000],
    ['Заднее колесо', 1250],
    ['Номерной знак', 500],
    ['Решетка радиатора', 350],
    ['Лобовое стекло', 2500],
    ['Украшения', 1000],
    ['Интерьер салона', 1000],
    ['Циферблат', 350],
    ['Обшивка', 500],
    ['Сиденья', 650],
    ['Руль', 500],
    ['Рычаг переключателя', 250],
    ['Бляшки', 350],
    ['Акустика', 1500],
    ['37', 0],
    ['Гидравлика', 10000],
    ['Блок двигателя', 1350],
    ['Воздушный фильтр', 550],
    ['41', 0],
    ['Крышка', 0],
    ['Замки на капот', 1100],
    ['Крыша', 750],
    ['45', 0],
    ['Дефлектор', 1000],
    ['47', 0],
    ['Винилл', 7500],
    ['49', 0],
    ['50', 0],
    ['51', 0],
    ['52', 0],
    ['53', 0],
    ['Высота подвески', 0],
    ['55', 0],
    ['56', 0],
    ['57', 0],
    ['58', 0],
    ['59', 0],
    ['60', 0],
    ['61', 0],
    ['Колёса', 0],
    ['63', 0],
    ['64', 0],
    ['65', 0],
    ['66', 0],
    ['67', 0],
    ['68', 0],
    ['Тонировка', 2500],
    ['70', 0],
    ['71', 0],
    ['72', 0],
    ['73', 0],
    ['Цвет приборной панели', 1000],
    ['Цвет отделки', 2500],
    ['Специальная окраска', 5000],
    ['Колёса', 0],
    ['Колёса', 1000],
    ['Крутящий момент', 5000],
];

enums.lscSNames = [
    ['Привод', 1000],
    ['Ускорение', 100000],
    ['Мощность Двигателя', 150000],
    ['Сила торможения', 50],
    ['Распределение силы торм.', 50],
    ['Ручной тормоз', 50],
    ['Угол поворота колёс', 200],
    ['Сцепление колес на повороте', 50],
    ['Пробуксовка колес', 50],
];

enums.lscColors = [
    'Черный',
    'Графитно-черный',
    'Черная сталь',
    'Темно-серебряный',
    'Серебряный',
    'Серебряный с голубым оттенком',
    'Серая сталь',
    'Темно-серебряный',
    'Каменно-серябряный',
    'Темно-серебряный',
    'Темно-серый',
    'Антрацитово‐серый',
    'Матовый черный',
    'Матовый Серый',
    'Матовый светло-серый',
    'Глянцево-черный',
    'Глянцево-черный',
    'Глянцевый темно-серебряный',
    'Глянцево-серебряный',
    'Глянцевый темно-серебряный',
    'Глянцевый темно-голубой',
    'Светлый матово-черный',
    'Матово-графитовый',
    'Матовый серебряно-серый',
    'Матовой серебряный',
    'Матовый серебряно-голубой',
    'Матовый темно-голубой',
    'Красный',
    'Насыщенный красный',
    'Насыщенный красный',
    'Красный',
    'Темно-красный',
    'Кровавый',
    'Глянцевый темно-красный',
    'Бардовый',
    'Малиново-красный',
    'Оранжевый',
    'Бледно-оранжевый',
    'Оранжево-желтый',
    'Красный',
    'Матовый темно-красный',
    'Светло-оранжевый',
    'Желтый',
    'Насыщенный красный',
    'Ярко-бардовый',
    'Бисмарк-фуриозо',
    'Красно-медный',
    'Оранжево-медный',
    'Матовый темно-алый',
    'Темно-зеленый',
    'Темно-зеленый',
    'Виридиан',
    'Тёмно-оливковый',
    'вердепомовый',
    'Нефритовый',
    'Кислотный',
    'Темно-зеленый',
    'Зеленый',
    'Матовый темно-зеленый',
    'Матовый оливковый',
    'Мха',
    'Темный сине-зеленый',
    'Сапфировый',
    'Лазурно-синий',
    'Синий',
    'Васильковый',
    'Серо-синий',
    'Белый',
    'Бледно-бирюзовый',
    'Бирюзовый',
    'Насыщенный небесно-голубой',
    'Аспидно-синий',
    'Темный аспидно-синий',
    'Голубой',
    'Небесно-голубой',
    'Кобальтовый',
    'Темный индиго',
    'Голубой ультрамарин',
    'Светло-голубой',
    'Темно-голубой',
    'Голубой',
    'Королевский синий',
    'Матовый сапфировый',
    'Матовый синий',
    'Матовый голубовато-стальной',
    'Матовый небесно-голубой',
    'Матовый небесно-голубой',
    'Матовый светлый небесно-голубой',
    'Золотистый',
    'Желтый',
    'Светло-древесный',
    'Светло-желтый',
    'Желто-зеленый',
    'Темно-бежевый',
    'Сепия',
    'Камелопардовый',
    'Бистр',
    'Коричневый',
    'Темная охра',
    'Землистый',
    'Серо-коричневый',
    'Красно-коричневый',
    'Светлый хаки',
    'Красно-коричневый',
    'Пряный',
    'Бежевый',
    'Кремовый',
    'Светло-кремовый',
    'Темно-коричневый',
    'Серо-коричневый',
    'Темно-кремовый',
    'Кремово-белый',
    'Белый',
    'Кремово-бежевый',
    'Матовый камелопардовый',
    'Матовый бистр',
    'Матовый Серо-коричневый',
    'Матовый темно-серый',
    'Матовый тускло-серый',
    'Матовый серебристый',
    'серебристый металлик',
    'Матовый Белый',
    'Матовый Кремово-белый',
    'Матовый золотистый',
    'Матовый светло-оранжевый',
    'Салатовый',
    'Матовый желтый',
    'Светло-бирюзовый',
    'Матовый оливково-зеленый',
    'Матовый темно-кремовый',
    'Матовый темно-желтый',
    'Матовый светло-белый',
    'Матовый ярко-белый',
    'Матовый оливковый',
    'Белый',
    'насыщенный розовый',
    'Светло-розовый',
    'Розовый',
    'Темно-желтый',
    'Зелено-желтый',
    'Морская волна',
    'Темно-синий',
    'Темно-баклажановый',
    'Баклажановый',
    'Серо-кремовый',
    'Насыщенный фиолетовый',
    'Темно-синий',
    'Черный',
    'Матовый насыщенно-фиолетовый',
    'Матовый черный',
    'Ярко-красный',
    'Матовый темно-зеленый',
    'Матовый светло-оливковый',
    'Матовый светло-шоколадный',
    'Матовый кремовый',
    'Матовый темно-оливковый',
    'Серебристый',
    'Светлый небесно-голубой',
    'Цвет #1',
    'Цвет #2',
    'Цвет #3',
    'Цвет #4',
    'Цвет #5',
    'Цвет #6',
    'Цвет #7',
    'Цвет #8',
    'Цвет #9',
    'Цвет #10',
];

enums.lscColorsEn = [
    'Metallic Black',
    'Metallic Graphite Black',
    'Metallic Black Steal',
    'Metallic Dark Silver',
    'Metallic Silver',
    'Metallic Blue Silver',
    'Metallic Steel Gray',
    'Metallic Shadow Silver',
    'Metallic Stone Silver',
    'Metallic Midnight Silver',
    'Metallic Gun Metal',
    'Metallic Anthracite Grey',
    'Matte Black',
    'Matte Gray',
    'Matte Light Grey',
    'Util Black',
    'Util Black Poly',
    'Util Dark silver',
    'Util Silver',
    'Util Gun Metal',
    'Util Shadow Silver',
    'Worn Black',
    'Worn Graphite',
    'Worn Silver Grey',
    'Worn Silver',
    'Worn Blue Silver',
    'Worn Shadow Silver',
    'Metallic Red',
    'Metallic Torino Red',
    'Metallic Formula Red',
    'Metallic Blaze Red',
    'Metallic Graceful Red',
    'Metallic Garnet Red',
    'Metallic Desert Red',
    'Metallic Cabernet Red',
    'Metallic Candy Red',
    'Metallic Sunrise Orange',
    'Metallic Classic Gold',
    'Metallic Orange',
    'Matte Red',
    'Matte Dark Red',
    'Matte Orange',
    'Matte Yellow',
    'Util Red',
    'Util Bright Red',
    'Util Garnet Red',
    'Worn Red',
    'Worn Golden Red',
    'Worn Dark Red',
    'Metallic Dark Green',
    'Metallic Racing Green',
    'Metallic Sea Green',
    'Metallic Olive Green',
    'Metallic Green',
    'Metallic Gasoline Blue Green',
    'Matte Lime Green',
    'Util Dark Green',
    'Util Green',
    'Worn Dark Green',
    'Worn Green',
    'Worn Sea Wash',
    'Metallic Midnight Blue',
    'Metallic Dark Blue',
    'Metallic Saxony Blue',
    'Metallic Blue',
    'Metallic Mariner Blue',
    'Metallic Harbor Blue',
    'Metallic Diamond Blue',
    'Metallic Surf Blue',
    'Metallic Nautical Blue',
    'Metallic Bright Blue',
    'Metallic Purple Blue',
    'Metallic Spinnaker Blue',
    'Metallic Ultra Blue',
    'Metallic Bright Blue',
    'Util Dark Blue',
    'Util Midnight Blue',
    'Util Blue',
    'Util Sea Foam Blue',
    'Util Lightning blue',
    'Util Maui Blue Poly',
    'Util Bright Blue',
    'Matte Dark Blue',
    'Matte Blue',
    'Matte Midnight Blue',
    'Worn Dark blue',
    'Worn Blue',
    'Worn Light blue',
    'Metallic Taxi Yellow',
    'Metallic Race Yellow',
    'Metallic Bronze',
    'Metallic Yellow Bird',
    'Metallic Lime',
    'Metallic Champagne',
    'Metallic Pueblo Beige',
    'Metallic Dark Ivory',
    'Metallic Choco Brown',
    'Metallic Golden Brown',
    'Metallic Light Brown',
    'Metallic Straw Beige',
    'Metallic Moss Brown',
    'Metallic Biston Brown',
    'Metallic Beechwood',
    'Metallic Dark Beechwood',
    'Metallic Choco Orange',
    'Metallic Beach Sand',
    'Metallic Sun Bleeched Sand',
    'Metallic Cream',
    'Util Brown',
    'Util Medium Brown',
    'Util Light Brown',
    'Metallic White',
    'Metallic Frost White',
    'Worn Honey Beige',
    'Worn Brown',
    'Worn Dark Brown',
    'Worn straw beige',
    'Brushed Steel',
    'Brushed Black steel',
    'Brushed Aluminium',
    'Chrome',
    'Worn Off White',
    'Util Off White',
    'Worn Orange',
    'Worn Light Orange',
    'Metallic Securicor Green',
    'Worn Taxi Yellow',
    'Police Car Blue',
    'Matte Green',
    'Matte Brown',
    'Worn Orange',
    'Matte White',
    'Worn White',
    'Worn Olive Army Green',
    'Pure White',
    'Hot Pink',
    'Salmon pink',
    'Metallic Vermillion Pink',
    'Orange',
    'Green',
    'Blue',
    'Mettalic Black Blue',
    'Metallic Black Purple',
    'Metallic Black Red',
    'Hunter',
    'Metallic Purple',
    'Metaillic V Dark Blue',
    'Modshop Black',
    'Matte Purple',
    'Matte Dark Purple',
    'Metallic Lava Red',
    'Matte Forest Green',
    'Matte Olive Drab',
    'Matte Desert Brown',
    'Matte Desert Tan',
    'Matte Foilage Green',
    'Grey',
    'Epsilon Blue',
    'Pure Gold',
    'Brushed Gold',
    'Gold',
];

enums.customIpl = [];

enums.fractionListId = [];

enums.animActions = [
    ["Поднять руки", "random@mugging3", "handsup_standing_base", 49],
    ["Поднять руки стоя на коленях", "random@arrests", "kneeling_arrest_idle", 9],
    ["Передать что-то по рации", "random@arrests", "generic_radio_chatter", 49],
    ["Сесть 1","amb@prop_human_seat_chair@male@generic@base", "base",9],
    ["Сесть 2","amb@prop_human_seat_chair@male@elbows_on_knees@base", "base",9],
    ["Сесть 3","amb@prop_human_seat_chair@male@left_elbow_on_knee@base", "base",9],
    ["Сесть 4","amb@prop_human_seat_chair@male@right_foot_out@base", "base",9],
    ["Свистнуть", "taxi_hail", "fp_hail_taxi", 8],
    ["Выполнить воиское приветствие", "anim@mp_player_intincarsalutestd@ds@", "idle_a", 8],
    ["Показать пальцем", "gestures@m@standing@casual", "gesture_point", 8],
    ["Согласиться-1", "gestures@m@standing@casual", "gesture_i_will", 8],
    ["Согласиться-2", "gestures@m@standing@fat", "gesture_bye_soft", 8],
    ["Отказать-1", "gestures@m@standing@casual", "gesture_nod_no_hard", 8],
    ["Отказать-2", "gestures@m@standing@casual", "gesture_no_way", 8],
    ["Отказать-3", "amb@code_human_in_car_mp_actions@nod@bodhi@ds@base", "nod_no_fp", 8],
    ["Пожать плечами", "gestures@m@standing@casual", "gesture_what_soft", 8],
    ["Положить что-то в рот", "mp_player_int_uppersmoke", "mp_player_int_smoke_enter", 8],
    ["Закинуться", "move_m@drunk@transitions", "slightly_to_idle", 8],
    ["Постучать", "amb@code_human_in_car_mp_actions@dance@bodhi@ps@base", "idle_a_fp", 8],
    ["Ударить по лежащему", "anim@heists@ornate_bank@hostages@hit", "player_melee_long_pistol_a", 8],
    ["Пнуть ногой", "anim@mp_freemode_return@f@fail", "fail_a", 8],
    ["Махать руками", "random@car_thief@victimpoints_ig_3", "arms_waving", 8],
    ["Отмахнуться-1", "taxi_hail", "forget_it", 8],
    ["Отмахнуться-2", "anim@mp_freemode_return@f@idle", "idle_b", 8],
    ["Подобрать с земли", "random@mugging4", "pickup_low", 8],
    ["Осмотреть землю", "amb@code_human_police_investigate@idle_b", "idle_f", 8],
    ["Ковырять в земле", "amb@world_human_bum_wash@male@high@idle_a", "idle_a", 8],
    ["Схватиться за живот", "rcmpaparazzo1", "idle", 8],
    ["Почесать задницу", "anim@heists@team_respawn@respawn_02", "heist_spawn_02_ped_d", 8],
    ["Помолиться", "pro_mcs_7_concat-0", "cs_priest_dual-0", 8],
    ["Поклониться-1", "anim@mp_player_intcelebrationpaired@f_f_sarcastic", "sarcastic_right", 8],
    ["Поклониться-2", "anim@mp_player_intcelebrationpaired@m_m_sarcastic", "sarcastic_left", 8],
    ["Отжаться", "amb@world_human_push_ups@male@base", "base", 8],
    ["Качать пресс", "amb@world_human_sit_ups@male@base", "base", 8],
    ["Отдышаться", "timetable@reunited@ig_2", "jimmy_base", 8],
    ["Потерять сознание", "missfam5_blackout", "pass_out", 8],
    ["Умыться", "missfam2_washing_face", "michael_washing_face", 8],
    ["Потереть шею", "amb@world_human_cop_idles@female@idle_a", "idle_c", 8],
    ["Потереть ладони", "amb@world_human_cop_idles@female@idle_b", "idle_d", 8],
    ["Потереть руки", "move_action@p_m_one@unarmed@idle@variations", "idle_a", 8],
    ["Показать два пальца", "amb@code_human_in_car_mp_actions@v_sign@bodhi@rps@base", "idle_a", 8],
    ["Смотреть по сторонам", "amb@world_human_guard_patrol@male@idle_a", "idle_b", 8],
    ["Осмотреть", "amb@medic@standing@kneel@enter", "enter", 8],
    ["Высматривать", "missmic4premiere", "crowd_c_idle_01", 8],
    ["Тссс", "anim@mp_player_intcelebrationfemale@shush", "shush", 8],
    ["Ковырять в носу", "anim@mp_player_intcelebrationfemale@nose_pick", "nose_pick", 8],
    ["Подумать", "amb@code_human_police_investigate@idle_a", "idle_a", 8],
    ["Собирать в руках", "amb@prop_human_movie_studio_light@idle_a", "idle_a", 8],
    ["Греться у костра", "amb@world_human_stand_fire@male@base", "base", 9],
    ["Принимать душ", "mp_safehouseshower@male@", "male_shower_idle_d", 8],
    ["Секс (Мужчина)", "rcmpaparazzo_2", "shag_action_a", 8],
    ["Секс (Женщина)", "rcmpaparazzo_2", "shag_action_poppy", 8]
];
enums.animPose = [
    ["Руки вверх", "anim@move_hostages@male", "male_idle", 9],
    ["Руки за голову", "anim@heists@ornate_bank@hostages@cashier_b@", "flinch_loop_underfire", 8],
    ["Руки за спину", "anim@miss@low@fin@vagos@", "idle_ped06", 8],
    ["Просить пощады", "amb@code_human_cower@male@react_cowering", "base_front", 9],
    ["Присесть-1", "anim@miss@low@fin@lamar@", "idle", 9],
    ["Присесть-2", "amb@medic@standing@tendtodead@enter", "enter", 8],
    ["Присесть-3", "amb@medic@standing@kneel@base", "base", 9],
    ["Лечь на бок", "amb@world_human_bum_slumped@male@laying_on_right_side@base", "base", 9],
    ["Лечь на живот", "amb@world_human_sunbathe@male@front@base", "base", 9],
    ["Лечь на спину", "missfbi1", "cpr_pumpchest_idle", 9],
    ["Распальцовка-1", "missmic4premiere", "wave_b", 8],
    ["Распальцовка-2", "amb@code_human_in_car_mp_actions@v_sign@std@rds@base", "enter", 8],
    ["Пальцы вверх", "anim@mp_player_intcelebrationfemale@thumbs_up", "thumbs_up", 8],
    ["Палец вверх", "anim@mp_player_intincarthumbs_upbodhi@ds@", "enter_fp", 8],
    ["Скрестить руки-1", "rcmme_amanda1", "stand_loop_cop", 9],
    ["Скрестить руки-2", "amb@world_human_cop_idles@female@idle_b", "idle_e", 8],
    ["Руки в боки", "amb@code_human_police_investigate@base", "base", 9],
    ["Поза охранника", "missfbi4mcs_2", "loop_sec_b", 9],
    ["Бег на месте разводя руки", "amb@world_human_jog_standing@female@idle_a", "idle_a", 8],
    ["Бег на месте", "amb@world_human_jog_standing@male@base", "base", 8],
    ["Размяться-1", "amb@world_human_muscle_flex@arms_at_side@idle_a", "idle_a", 8],
    ["Размяться-2", "timetable@tracy@ig_5@idle_b", "idle_d", 8],
    ["Показать бицепс-1", "amb@world_human_muscle_flex@arms_at_side@idle_a", "idle_c", 8],
    ["Показать бицепс-2", "amb@world_human_muscle_flex@arms_in_front@base", "base", 8],
    ["Расставить руки в стороны", "missfam5_yoga", "c1_pose", 8],
    ["Расставить руки и ноги в стороны", "missfam5_yoga", "a2_pose", 8],
    ["Медитировать-1", "missfam5_yoga", "f_yogapose_a", 8],
    ["Медитировать-2", "missfam5_yoga", "c8_pose", 8],
    ["Медитировать-3", "missfam5_yoga", "b4_fail_to_start", 8],
    ["Медитировать-4", "missfam5_yoga", "start_to_c1", 8],
    ["Медитировать-5", "missfam5_yoga", "start_to_a1", 8],
    ["Медитировать-6", "missfam5_yoga", "a2_to_a3", 8],
    ["Медитировать-7", "missfam5_yoga", "a3_fail_to_start", 8]
];
enums.animPositive = [
    ["Радоваться-1", "missmic_4premiere", "movie_prem_01_f_a", 8],
    ["Радоваться-2", "mini@dartsoutro", "darts_outro_03_guy2", 8],
    ["Радоваться-3", "mini@dartsoutro", "darts_outro_01_guy1", 8],
    ["Радоваться-4", "anim@mp_player_intcelebrationfemale@freakout", "freakout", 8],
    ["Хлопать в ладоши-1", "missmic_4premiere", "movie_prem_02_f_a", 8],
    ["Хлопать в ладоши-2", "amb@world_human_cheering@female_d", "base", 8],
    ["Хлопать в ладоши-3", "amb@world_human_cheering@male_a", "base", 8],
    ["Хлопать в ладоши-4", "amb@world_human_cheering@male_e", "base", 8],
    ["Хлопать в ладоши-5", "anim@mp_player_intcelebrationfemale@slow_clap", "slow_clap", 8],
    ["Поддержать-1", "amb@world_human_cheering@female_a", "base", 8],
    ["Поддержать-2", "amb@world_human_cheering@female_c", "base", 8],
    ["Поддержать-3", "amb@world_human_cheering@male_b", "base", 8],
    ["Поцеловать-1", "anim@mp_player_intcelebrationfemale@blow_kiss", "blow_kiss", 8],
    ["Поцеловать-2", "anim@mp_player_intcelebrationfemale@chin_brush", "chin_brush", 8],
    ["Поцеловать-3", "anim@mp_player_intcelebrationfemale@finger_kiss", "finger_kiss", 8],
    ["Успокоить", "amb@code_human_police_crowd_control@idle_a", "idle_c", 8],
    ["Уважение", "anim@mp_player_intcelebrationfemale@bro_love", "bro_love", 8]
];
enums.animNegative = [
    ["Размять кулаки-1", "anim@mp_player_intcelebrationfemale@knuckle_crunch", "knuckle_crunch", 8],
    ["Размять кулаки-2", "anim@mp_player_intincarknuckle_crunchbodhi@ps@", "idle_a_fp", 8],
    ["Разочароваться", "mini@dartsoutro", "darts_outro_03_guy1", 8],
    ["Виноват", "anim@mp_parachute_outro@female@lose", "lose_loop", 8],
    ["Дурак", "anim@mp_player_intcelebrationfemale@you_loco", "you_loco", 8],
    ["Facepalm", "anim@mp_player_intcelebrationfemale@face_palm", "face_palm", 8],
    ["Расстрелять", "amb@world_human_superhero@male@space_pistol@idle_a", "idle_b", 8],
    ["С ружьем", "anim@deathmatch_intros@2hcombat_mgmale", "intro_male_mg_c", 8],
    ["С битой", "anim@deathmatch_intros@melee@2h", "intro_male_melee_2h_b_gclub", 8],
    ["Встать в стойку-1", "anim@deathmatch_intros@unarmed", "intro_male_unarmed_c", 8],
    ["Встать в стойку-2", "anim@deathmatch_intros@unarmed", "intro_male_unarmed_a", 8],
    ["Встать в стойку-3", "anim@deathmatch_intros@unarmed", "intro_male_unarmed_b", 8],
    ["Встать в стойку-4", "anim@deathmatch_intros@unarmed", "intro_male_unarmed_d", 8]
];
enums.animDance = [
    ["DJ", "anim@mp_player_intcelebrationfemale@dj", "dj", 8],
    ["Танец-1", "misschinese2_crystalmazemcs1_ig", "dance_loop_tao", 9],
    ["Танец-2", "mini@strip_club@lap_dance_2g@ld_2g_p2", "ld_2g_p2_s1", 9],
    ["Танец-3", "mini@strip_club@lap_dance_2g@ld_2g_p3", "ld_2g_p3_s2", 9],
    ["Танец-4", "amb@world_human_partying@female@partying_beer@idle_a", "idle_b", 9],
    ["Танец-5", "amb@world_human_prostitute@cokehead@idle_a", "idle_a", 9],
    ["Танец-6", "amb@world_human_prostitute@cokehead@idle_a", "idle_c", 9],
    ["Танец-7", "amb@world_human_jog_standing@female@base", "base", 9],
    ["Танец-8", "timetable@tracy@ig_8@idle_a", "idle_a", 8],
    ["Танец-9", "timetable@tracy@ig_5@idle_a", "idle_a", 9],
    ["Танец-10", "timetable@tracy@ig_5@idle_a", "idle_b", 9],
    ["Танец-11", "timetable@tracy@ig_5@idle_a", "idle_c", 9],
    ["Танец-12", "oddjobs@assassinate@multi@yachttarget@lapdance", "yacht_ld_f", 8],
    ["Танец-13", "mp_safehouse", "lap_dance_girl", 8],
    ["Пританцовывать", "misscarsteal4@toilet", "desperate_toilet_idle_a", 9],
    ["Доп. Танец 1", "anim@amb@nightclub@dancers@club_ambientpeds@med-hi_intensity", "mi-hi_amb_club_10_v1_male^6", 9],
    ["Доп. Танец 2", "amb@code_human_in_car_mp_actions@dance@bodhi@ds@base", "idle_a_fp", 9],
    ["Доп. Танец 3", "amb@code_human_in_car_mp_actions@dance@bodhi@rds@base", "idle_b", 9],
    ["Доп. Танец 4", "amb@code_human_in_car_mp_actions@dance@std@ds@base", "idle_a", 9],
    ["Доп. Танец 5", "anim@amb@nightclub@dancers@crowddance_facedj@hi_intensity", "hi_dance_facedj_09_v2_male^6", 9],
    ["Доп. Танец 6", "anim@amb@nightclub@dancers@crowddance_facedj@low_intesnsity", "li_dance_facedj_09_v1_male^6", 9],
    ["Доп. Танец 7", "anim@amb@nightclub@dancers@crowddance_facedj_transitions@from_hi_intensity", "trans_dance_facedj_hi_to_li_09_v1_male^6", 9],
    ["Доп. Танец 8", "anim@amb@nightclub@dancers@crowddance_facedj_transitions@from_low_intensity", "trans_dance_facedj_li_to_hi_07_v1_male^6", 9],
    ["Доп. Танец 9", "anim@amb@nightclub@dancers@crowddance_groups@hi_intensity", "hi_dance_crowd_13_v2_male^6", 9],
    ["Доп. Танец 10", "anim@amb@nightclub@dancers@crowddance_groups_transitions@from_hi_intensity", "trans_dance_crowd_hi_to_li__07_v1_male^6", 9],
    ["Доп. Танец 11", "anim@amb@nightclub@dancers@crowddance_single_props@hi_intensity", "hi_dance_prop_13_v1_male^6", 9],
    ["Доп. Танец 12", "anim@amb@nightclub@dancers@crowddance_single_props_transitions@from_med_intensity", "trans_crowd_prop_mi_to_li_11_v1_male^6", 9],
    ["Доп. Танец 13", "anim@amb@nightclub@mini@dance@dance_solo@male@var_a@", "med_center_up", 9],
    ["Доп. Танец 14", "anim@amb@nightclub@mini@dance@dance_solo@male@var_a@", "med_right_up", 9],
    ["Доп. Танец 15", "anim@amb@nightclub@dancers@crowddance_groups@low_intensity", "li_dance_crowd_17_v1_male^6", 9],
    ["Доп. Танец 16", "anim@amb@nightclub@dancers@crowddance_facedj_transitions@from_med_intensity", "trans_dance_facedj_mi_to_li_09_v1_male^6", 9],
    ["Доп. Танец 17", "timetable@tracy@ig_5@idle_b", "idle_e", 9],
    ["Доп. Танец 18", "mini@strip_club@idles@dj@idle_04", "idle_04", 9],
    ["Доп. Танец 19", "special_ped@mountain_dancer@monologue_1@monologue_1a", "mtn_dnc_if_you_want_to_get_to_heaven", 9],
    ["Доп. Танец 20", "special_ped@mountain_dancer@monologue_4@monologue_4a", "mnt_dnc_verse", 9],
    ["Доп. Танец 21", "special_ped@mountain_dancer@monologue_3@monologue_3a", "mnt_dnc_buttwag", 9],
    ["Доп. Танец 22", "anim@amb@nightclub@dancers@black_madonna_entourage@", "hi_dance_facedj_09_v2_male^5", 9],
    ["Доп. Танец 23", "anim@amb@nightclub@dancers@crowddance_single_props@", "hi_dance_prop_09_v1_male^6", 9],
    ["Доп. Танец 24", "anim@amb@nightclub@dancers@dixon_entourage@", "mi_dance_facedj_15_v1_male^4", 9],
    ["Доп. Танец 25", "anim@amb@nightclub@dancers@podium_dancers@", "hi_dance_facedj_17_v2_male^5", 9],
    ["Доп. Танец 26", "anim@amb@nightclub@dancers@tale_of_us_entourage@", "mi_dance_prop_13_v2_male^4", 9],
    ["Доп. Танец 27", "misschinese2_crystalmazemcs1_cs", "dance_loop_tao", 9],
    ["Доп. Танец 28", "misschinese2_crystalmazemcs1_ig", "dance_loop_tao", 9],
    ["Доп. Танец 29", "anim@mp_player_intcelebrationfemale@uncle_disco", "uncle_disco", 9],
    ["Доп. Танец 30", "anim@mp_player_intcelebrationfemale@raise_the_roof", "raise_the_roof", 9],
    ["Доп. Танец 31", "anim@mp_player_intcelebrationmale@cats_cradle", "cats_cradle", 9],
    ["Доп. Танец 32", "anim@mp_player_intupperbanging_tunes", "idle_a", 9],
    ["Доп. Танец 33", "anim@amb@nightclub@mini@dance@dance_solo@female@var_a@", "high_center", 9],
    ["Доп. Танец 34", "anim@amb@nightclub@mini@dance@dance_solo@female@var_b@", "high_center", 9],
    ["Доп. Танец 35", "anim@amb@nightclub@mini@dance@dance_solo@male@var_b@", "high_center", 9],
    ["Доп. Танец 36", "anim@amb@nightclub@dancers@crowddance_facedj_transitions@", "trans_dance_facedj_hi_to_mi_11_v1_female^6", 9],
    ["Доп. Танец 37", "anim@amb@nightclub@dancers@crowddance_facedj_transitions@from_hi_intensity", "trans_dance_facedj_hi_to_li_07_v1_female^6", 9],
    ["Доп. Танец 38", "anim@amb@nightclub@dancers@crowddance_facedj@", "hi_dance_facedj_09_v1_female^6", 9],
    ["Доп. Танец 39", "anim@amb@nightclub@dancers@crowddance_groups@hi_intensity", "hi_dance_crowd_09_v1_female^6", 9],
    ["Доп. Танец 40", "anim@amb@nightclub@lazlow@hi_podium@", "danceidle_hi_06_base_laz", 9],
    ["Доп. Танец 41", "special_ped@zombie@monologue_4@monologue_4l", "iamtheundead_11", 9]
];
enums.animRemain = [
    ["Секс-1", "anim@mp_player_intcelebrationfemale@air_shagging", "air_shagging", 8],
    ["Секс-2", "anim@mp_player_intcelebrationfemale@dock", "dock", 8],
    ["Курица", "anim@mp_player_intcelebrationfemale@chicken_taunt", "chicken_taunt", 8],
    ["Дразнить-1", "anim@mp_player_intcelebrationfemale@jazz_hands", "jazz_hands", 8],
    ["Дразнить-2", "anim@mp_player_intcelebrationfemale@thumb_on_ears", "thumb_on_ears", 8],
    ["Дразнить-3", "anim@mp_player_intcelebrationmale@thumb_on_ears", "thumb_on_ears", 8],
    ["Фотограф", "anim@mp_player_intcelebrationfemale@photography", "photography", 8],
    ["Рок", "amb@code_human_in_car_mp_actions@rock@bodhi@rps@base", "idle_a", 8],
    ["Гитарист", "anim@mp_player_intcelebrationfemale@air_guitar", "air_guitar", 8],
    ["Труп", "anim@melee@machete@streamed_core@", "victim_front_takedown", 8],
    ["Ломка", "creatures@rottweiler@melee@", "victim_takedown_from_front", 8],
    ["Пробежка на месте", "amb@world_human_jog_standing@male@base", "base", 8],
    ["Качаться", "anim@mp_player_intcelebrationmale@peace", "peace", 9]
];

/*enums.scenarios = [
    ["Сесть", "PROP_HUMAN_SEAT_BENCH"],
    ["Записать в блокнот", "CODE_HUMAN_MEDIC_TIME_OF_DEATH"],
    ["Регулировщик (Полиция)", "CODE_HUMAN_POLICE_CROWD_CONTROL"],
    ["Осмотреть землю (Полиция)", "CODE_HUMAN_POLICE_INVESTIGATE"],
    ["Фоткать на фотоаппарат", "WORLD_HUMAN_PAPARAZZI"],
    ["Осмотреть труп", "CODE_HUMAN_MEDIC_TEND_TO_DEAD"],
    ["Кофе в руках", "WORLD_HUMAN_AA_COFFEE"],
    ["Курить сигарету", "WORLD_HUMAN_AA_SMOKE"],
    ["Курить траву", "WORLD_HUMAN_DRUG_DEALER"],
    ["Смотреть в бинокль", "WORLD_HUMAN_BINOCULARS"],
    ["Стоять с табличкой", "WORLD_HUMAN_BUM_FREEWAY"],
    ["Спать", "WORLD_HUMAN_BUM_SLUMPED"],
    ["Мыть руки в озере", "WORLD_HUMAN_BUM_WASH"],
    ["Регулировщик", "WORLD_HUMAN_CAR_PARK_ATTENDANT"],
    ["Хлопать", "WORLD_HUMAN_CHEERING"],
    ["Читать документ", "WORLD_HUMAN_CLIPBOARD"],
    ["Руки на поясе", "WORLD_HUMAN_COP_IDLES"],
    ["Пить пиво", "WORLD_HUMAN_DRINKING"],
    ["Сфоткать на телефон", "WORLD_HUMAN_MOBILE_FILM_SHOCKING"],
    ["Садовник - Убирать листья", "WORLD_HUMAN_GARDENER_LEAF_BLOWER"],
    ["Садовник - Сажать", "WORLD_HUMAN_GARDENER_PLANT"],
    ["Высматривать", "WORLD_HUMAN_GUARD_PATROL"],
    ["Охрана", "WORLD_HUMAN_GUARD_STAND"],
    ["Смотреть", "WORLD_HUMAN_HANG_OUT_STREET"],
    ["Позировать", "WORLD_HUMAN_HUMAN_STATUE"],
    ["Со шваброй", "WORLD_HUMAN_JANITOR"],
    ["Бежать на месте", "WORLD_HUMAN_JOG_STANDING"],
    ["Облокотиться на стену", "WORLD_HUMAN_LEANING"],
    ["Мыть", "WORLD_HUMAN_MAID_CLEAN"],
    ["Качок", "WORLD_HUMAN_MUSCLE_FLEX"],
    ["Играть на инструменте", "WORLD_HUMAN_MUSICIAN"],
    ["Фоткать на фотоаппарат", "WORLD_HUMAN_PAPARAZZI"],
    ["Пить пиво", "WORLD_HUMAN_PARTYING"],
    ["Сесть (Полулёжа)", "WORLD_HUMAN_PICNIC"],
    ["Проститутка - Курить", "WORLD_HUMAN_PROSTITUTE_HIGH_CLASS"],
    ["Проститутка", "WORLD_HUMAN_PROSTITUTE_LOW_CLASS"],
    ["Отжиматься", "WORLD_HUMAN_PUSH_UPS"],
    ["Искать с фонариком", "WORLD_HUMAN_SECURITY_SHINE_TORCH"],
    ["Делать пресс", "WORLD_HUMAN_SIT_UPS"],
    ["Курить 1", "WORLD_HUMAN_SMOKING"],
    ["Курить 2", "WORLD_HUMAN_SMOKING_POT"],
    ["Греться у костра", "WORLD_HUMAN_STAND_FIRE"],
    ["Стоять покачиваясь 1", "WORLD_HUMAN_STAND_IMPATIENT"],
    ["Стоять покачиваясь 2", "WORLD_HUMAN_STAND_IMPATIENT_UPRIGHT"],
    ["Лазить в телефоне 1", "WORLD_HUMAN_STAND_MOBILE"],
    ["Лазить в телефоне 2", "WORLD_HUMAN_STAND_MOBILE_UPRIGHT"],
    ["Танцевать", "WORLD_HUMAN_STRIP_WATCH_STAND"],
    ["Сесть полулёжа", "WORLD_HUMAN_STUPOR"],
    ["Лечь на живот", "WORLD_HUMAN_SUNBATHE"],
    ["Лечь на спину", "WORLD_HUMAN_SUNBATHE_BACK"],
    ["Теннис", "WORLD_HUMAN_TENNIS_PLAYER"],
    ["Смотреть карту", "WORLD_HUMAN_TOURIST_MAP"],
    ["Смотреть в телефон", "WORLD_HUMAN_TOURIST_MOBILE"],
    ["Смотреть", "WORLD_HUMAN_WINDOW_SHOP_BROWSE"],
    ["Йога", "WORLD_HUMAN_YOGA"],
    ["Готовить на гриле", "PROP_HUMAN_BBQ"],
    ["Что-то искать в ящике", "PROP_HUMAN_BUM_BIN"],
    ["Оплатить за парковку", "PROP_HUMAN_PARKING_METER"],
    ["Смотреть по сторонам", "CODE_HUMAN_CROSS_ROAD_WAIT"],
    ["Высматривать", "CODE_HUMAN_MEDIC_KNEEL"]
];*/

enums.getVehicleImg = (name) => {
    return 'https://dednet.ru/client/images/cars/' + name + '_1.jpg';
};

enums.loadCloth = function () {
    updateCloth().then( (returnCloth) => {
        try {
            enums.overlays = returnCloth[0];
            enums.clothM = returnCloth[1];
            enums.clothF = returnCloth[2];
            enums.propM = returnCloth[3];
            enums.propF = returnCloth[4];
        } catch (e) {
            console.log(e);
            throw e;
        }
    });

    updateTattoo().then( (returnCloth) => {
        try {
            enums.tattooList = returnCloth[0];
            enums.tprint = returnCloth[1];
            enums.fractionListId = JSON.parse(returnCloth[2]);
        } catch (e) {
            console.log(e);
            throw e;
        }
    });
};

export default enums;