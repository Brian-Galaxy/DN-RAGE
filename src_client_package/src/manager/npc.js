import methods from '../modules/methods';
import timer from '../manager/timer';

import checkpoint from "./checkpoint";
import quest from "./quest";

import user from "../user";

let npc = {};

let _npcList = [];
let _loadDist = 100;

npc.loadAll = function() {

    try {
        let npcList = Object.entries(quest.getQuestAll());
        if (npcList.length > 0) {
            for (const [key, item] of npcList) {
                npc.create(mp.game.joaat(item.skin), item.pos, item.skinRot, false, item.anim);
            }
        }
    }
    catch (e) {
        methods.debug('npc.loadAll', e);
    }
    checkpoint.addMarker(-1288.153, -561.6686, 33.21216, 2, 0.5, 0.5);

    /*//Quest BotSpawn Role0
    npc.create(mp.game.joaat("s_m_y_dockwork_01"), new mp.Vector3(-415.9264831542969, -2645.4287109375, 6.000219345092773), 316.27508544921875, false, "WORLD_HUMAN_CLIPBOARD");
    //Quest BotSpawn All
    npc.create(mp.game.joaat("a_f_y_business_02"), new mp.Vector3(-1380.45458984375, -527.6905517578125, 30.6591854095459), 277.5157775878906, false, "WORLD_HUMAN_CLIPBOARD");
//Quest Gang
    npc.create(mp.game.joaat("ig_lamardavis"), new mp.Vector3(-218.75608825683594, -1368.4576416015625, 31.25823402404785), 43.398406982421875, false, "WORLD_HUMAN_SMOKING");

*/
    // Respawn Vagos
    npc.create(mp.game.joaat("ig_ortega"), new mp.Vector3(483.9583, -1875.324, 26.16094), -67.42773, false, "WORLD_HUMAN_GUARD_STAND");
    npc.create(mp.game.joaat("g_f_y_vagos_01"), new mp.Vector3(478.4626, -1897.894, 25.57264), -119.9996, false, "WORLD_HUMAN_PROSTITUTE_HIGH_CLASS");
    npc.create(mp.game.joaat("a_f_y_eastsa_03"), new mp.Vector3(478.9356, -1898.891, 25.5328), -19.00031, false, "WORLD_HUMAN_DRUG_DEALER");
    npc.create(mp.game.joaat("g_m_y_mexgoon_01"), new mp.Vector3(460.676, -1880.949, 26.84649), -18.99998, false, "WORLD_HUMAN_SMOKING");

// Respawn Bloods
    npc.create(mp.game.joaat("ig_claypain"), new mp.Vector3(465.1042, -1671.076, 29.29151), 55.99957, false, "WORLD_HUMAN_SMOKING");
    npc.create(mp.game.joaat("a_f_y_soucent_01"), new mp.Vector3(453.4677, -1685.941, 29.28194), 142.0002, false, "WORLD_HUMAN_TOURIST_MOBILE");
    npc.create(mp.game.joaat("a_m_y_soucent_03"), new mp.Vector3(452.6291, -1686.808, 29.28194), -72.99976, false, "WORLD_HUMAN_DRINKING");
    npc.create(mp.game.joaat("a_m_m_afriamer_01"), new mp.Vector3(474.12, -1683.562, 29.29144), 174.0001, false, "WORLD_HUMAN_GUARD_STAND");

// Respawn Families
    npc.create(mp.game.joaat("famca_01"), new mp.Vector3(-12.11057, -1827.143, 25.47756), 151.9985, false, "WORLD_HUMAN_GUARD_STAND");
    npc.create(mp.game.joaat("g_m_y_famdnf_01"), new mp.Vector3(2.439152, -1822.602, 25.35294), -177.999, false, "WORLD_HUMAN_TOURIST_MOBILE");
    npc.create(mp.game.joaat("g_f_y_families_01"), new mp.Vector3(1.891586, -1823.411, 25.35294), -74.99979, false, "CODE_HUMAN_CROSS_ROAD_WAIT");
    npc.create(mp.game.joaat("g_m_y_famfor_01"), new mp.Vector3(7.32425, -1814.006, 25.35294), -49.99983, false, "WORLD_HUMAN_SMOKING");

    // Respawn Ballas
    npc.create(mp.game.joaat("g_m_y_ballaorig_01"), new mp.Vector3(-187.5397, -1699.698, 32.98515), -52.08002, false, "WORLD_HUMAN_SMOKING");
    npc.create(mp.game.joaat("g_f_y_ballas_01"), new mp.Vector3(-206.9577, -1730.258, 32.66415), -119.9989, false, "WORLD_HUMAN_PROSTITUTE_HIGH_CLASS");
    npc.create(mp.game.joaat("g_m_y_ballaeast_01"), new mp.Vector3(-206.268, -1731.074, 32.66415), 15.00124, false, "WORLD_HUMAN_DRINKING");
    npc.create(mp.game.joaat("g_m_y_ballasout_01"), new mp.Vector3(-210.8185, -1728.631, 32.66721), 143.9996, false, "WORLD_HUMAN_GUARD_STAND");

// Respawn Marabunta
    npc.create(mp.game.joaat("g_m_y_salvagoon_03"), new mp.Vector3(1333.642, -1643.404, 52.15042), -30.99972, false, "WORLD_HUMAN_GUARD_STAND");
    npc.create(mp.game.joaat("g_m_y_salvagoon_02"), new mp.Vector3(1325.727, -1639.303, 52.15056), -84.99963, false, "WORLD_HUMAN_TOURIST_MOBILE");
    npc.create(mp.game.joaat("g_m_y_salvaboss_01"), new mp.Vector3(1326.823, -1638.513, 52.15056), 126.9999, false, "WORLD_HUMAN_DRUG_DEALER");
    npc.create(mp.game.joaat("g_m_y_salvagoon_01"), new mp.Vector3(1321.559, -1663.887, 51.23642), 133.9994, false, "WORLD_HUMAN_SMOKING");

    // Секретарша в City Hall
    npc.create(mp.game.joaat("a_f_y_business_01"), new mp.Vector3(-1291.811, -572.3674, 30.57272), -40.99984, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Охранник слева в City Hall
    npc.create(mp.game.joaat("s_m_m_highsec_01"), new mp.Vector3(-1285.467, -573.2753, 30.57479), 48.9999, false, "WORLD_HUMAN_GUARD_STAND");
// Охранник справа в City Hall
    npc.create(mp.game.joaat("s_m_m_highsec_02"), new mp.Vector3(-1291.8, -565.9213, 30.57479), -132.9988, false, "WORLD_HUMAN_GUARD_STAND");

    //Сдача железа
    npc.create(mp.game.joaat("s_m_y_dockwork_01"), new mp.Vector3(1074.1737060546875, -2009.465576171875, 32.08498764038086), 53.97209548950195, false, "WORLD_HUMAN_CLIPBOARD");
    //Сдача одежды
    npc.create(mp.game.joaat("u_m_m_doa_01"), new mp.Vector3(706.1729125976562, -966.6583251953125, 30.412853240966797), 298.7783508300781, false, "WORLD_HUMAN_CLIPBOARD");
    //Мейз Банк Арена
    npc.create(mp.game.joaat("csb_bryony"), new mp.Vector3(-251.922, -2001.531, 30.14596), 178.7984, false, "CODE_HUMAN_MEDIC_TIME_OF_DEATH");
//Автобазар
    npc.create(mp.game.joaat("u_m_y_ushi"), new mp.Vector3(-1654.792236328125, -948.4613037109375, 7.716407775878906), 323.9862365722656, false, "WORLD_HUMAN_CLIPBOARD");
// 24/7 - Гора Чиллиад - Шоссе Сенора
    npc.create(mp.game.joaat("s_f_y_sweatshop_01"), new mp.Vector3(1728.476, 6416.668, 35.03724), -109.9557, false, "WORLD_HUMAN_STAND_IMPATIENT");
// LTD Gasoline - Грейпсид - Грейпсид-Пейн-стрит
    npc.create(mp.game.joaat("mp_m_shopkeep_01"), new mp.Vector3(1698.477, 4922.482, 42.06366), -32.02934, false, "WORLD_HUMAN_STAND_IMPATIENT");
// 24/7 - Сэнди Шорс - Нинланд-авеню
    npc.create(mp.game.joaat("s_f_y_sweatshop_01"), new mp.Vector3(1959.179, 3741.332, 32.34376), -51.81022, false, "WORLD_HUMAN_STAND_IMPATIENT");
// 24/7 - Хармони - Шоссе 68
    npc.create(mp.game.joaat("mp_m_shopkeep_01"), new mp.Vector3(549.306, 2669.898, 42.15651), 102.036, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Rob's Liquor - Пустыня Гранд-Сенора - Шоссе 68
    npc.create(mp.game.joaat("s_f_y_sweatshop_01"), new mp.Vector3(1165.198, 2710.855, 38.15769), -169.9903, false, "WORLD_HUMAN_STAND_IMPATIENT");
// 24/7 - Пустыня Гранд-Сенора - Шоссе Сенора
    npc.create(mp.game.joaat("mp_m_shopkeep_01"), new mp.Vector3(2676.561, 3280.001, 55.24115), -20.5138, false, "WORLD_HUMAN_STAND_IMPATIENT");
// 24/7 - Чумаш - Барбарено-роуд
    npc.create(mp.game.joaat("s_f_y_sweatshop_01"), new mp.Vector3(-3243.886, 999.9983, 12.83071), -0.1504957, false, "WORLD_HUMAN_STAND_IMPATIENT");
// 24/7 - Каньон Бэнхэм - Инесено-роуд
    npc.create(mp.game.joaat("mp_m_shopkeep_01"), new mp.Vector3(-3040.344, 584.0048, 7.908932), 25.86866, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Rob's Liquor - Каньон Бэнхэм - Шоссе Грейт-Оушн
    npc.create(mp.game.joaat("s_f_y_sweatshop_01"), new mp.Vector3(-2966.275, 391.6495, 15.04331), 90.95544, false, "WORLD_HUMAN_STAND_IMPATIENT");
// LTD Gasoline - Ричман-Глен - Бэнхэм-Кэньон-драйв
    npc.create(mp.game.joaat("mp_m_shopkeep_01"), new mp.Vector3(-1820.364, 794.7905, 138.0867), 136.5701, false, "WORLD_HUMAN_STAND_IMPATIENT");
// 24/7 - Центр Вайнвуда - Клинтон-авеню
    npc.create(mp.game.joaat("s_f_y_sweatshop_01"), new mp.Vector3(372.8323, 327.9543, 103.5664), -93.31544, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Rob's Liquor - Морнингвуд - Просперити-стрит
    npc.create(mp.game.joaat("mp_m_shopkeep_01"), new mp.Vector3(-1486.615, -377.3467, 40.16341), 135.9596, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Rob's Liquor - Каналы Веспуччи - Сан-Андреас-авеню
    npc.create(mp.game.joaat("s_f_y_sweatshop_01"), new mp.Vector3(-1221.311, -907.9825, 12.32635), 44.03139, false, "WORLD_HUMAN_STAND_IMPATIENT");
// LTD Gasoline - Маленький Сеул - Паломино-авеню
    npc.create(mp.game.joaat("mp_m_shopkeep_01"), new mp.Vector3(-706.0112, -912.8375, 19.2156), 93.35769, false, "WORLD_HUMAN_STAND_IMPATIENT");
// LTD Gasoline - Миррор-Парк - Вест-Миррор-драйв
    npc.create(mp.game.joaat("s_f_y_sweatshop_01"), new mp.Vector3(1164.863, -322.054, 69.2051), 109.3829, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Rob's Liquor - Мурьета-Хайтс - Бульвар Эль-Ранчо
    npc.create(mp.game.joaat("mp_m_shopkeep_01"), new mp.Vector3(1134.109, -983.1777, 46.41582), -74.49993, false, "WORLD_HUMAN_STAND_IMPATIENT");
// 24/7 - Строберри - Бульвар Инносенс
    npc.create(mp.game.joaat("s_f_y_sweatshop_01"), new mp.Vector3(24.17295, -1345.768, 29.49703), -79.8604, false, "WORLD_HUMAN_STAND_IMPATIENT");//
// LTD Gasoline - Дэвис - Дэвис-авеню
    npc.create(mp.game.joaat("mp_m_shopkeep_01"), new mp.Vector3(-46.25561, -1757.611, 29.42101), 55.09486, false, "WORLD_HUMAN_STAND_IMPATIENT");
// 24/7 - Татавиамские горы - Шоссе Паломино
    npc.create(mp.game.joaat("s_f_y_sweatshop_01"), new mp.Vector3(2555.677, 380.6046, 108.623), 1.572431, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Digital Den - Маленький Сеул - Паломино-авеню
    npc.create(mp.game.joaat("g_m_y_korean_01"), new mp.Vector3(-656.9416, -858.7859, 24.49001), 2.746706, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Digital Den - Миррор-Парк - Бульвар Миррор-Парк
    npc.create(mp.game.joaat("a_m_y_hipster_01"), new mp.Vector3(1132.687, -474.5676, 66.7187), 345.9362, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Family Pharmacy - Мишн-Роу - Фантастик-плейс
    npc.create(mp.game.joaat("a_f_m_business_02"), new mp.Vector3(317.9639, -1078.319, 29.47855), 359.3141, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Dollars Pills - Альта - Альта-стрит
    npc.create(mp.game.joaat("a_f_y_business_04"), new mp.Vector3(92.31831, -231.1054, 54.66363), 327.2379, false, "WORLD_HUMAN_STAND_IMPATIENT");
// D.P. Pharmacy - Текстайл-Сити - Строберри-авеню
    npc.create(mp.game.joaat("a_f_y_business_03"), new mp.Vector3(299.7478, -733.0994, 29.3525), 255.0316, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Больница - Аптека - Палето-Бей - Бульвар Палето
    npc.create(mp.game.joaat("a_f_y_business_02"), new mp.Vector3(-253.79364013671875, 6336.76953125, 32.426055908203125), 215.51046752929688, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Рыболовный магазин
    npc.create(mp.game.joaat("s_m_m_ammucountry"), new mp.Vector3(-1598.123046875, 5200.99609375, 4.3873372077941895), 68.22468566894531, false, "WORLD_HUMAN_GUARD_STAND");
// Магазин охоты
    npc.create(mp.game.joaat("s_m_m_ammucountry"), new mp.Vector3(-674.044677734375, 5837.830078125, 17.34016227722168), 118.35307312011719, false, "WORLD_HUMAN_GUARD_STAND");
// Ammu-Nation - Татавиамские горы - Шоссе Паломино
    npc.create(mp.game.joaat("s_m_m_ammucountry"), new mp.Vector3(2567.45, 292.3297, 108.7349), 0.9863386, false, "WORLD_HUMAN_GUARD_STAND");
// Ammu-Nation - Чумаш - Барбарено-роуд
    npc.create(mp.game.joaat("s_m_m_ammucountry"), new mp.Vector3(-3173.501, 1088.957, 20.83874), -106.5671, false, "WORLD_HUMAN_GUARD_STAND");
// Ammu-Nation - Река Занкудо - Шоссе 68
    npc.create(mp.game.joaat("s_m_m_ammucountry"), new mp.Vector3(-1118.609, 2700.271, 18.55414), -135.1759, false, "WORLD_HUMAN_GUARD_STAND");
// Ammu-Nation - Сэнди-Шорс - Бульвар Алгонквин
    npc.create(mp.game.joaat("s_m_m_ammucountry"), new mp.Vector3(1692.413, 3761.51, 34.70534), -126.9435, false, "WORLD_HUMAN_GUARD_STAND");
// Ammu-Nation - Палето-Бэй - Шоссе Грейт-Оушн
    npc.create(mp.game.joaat("s_m_m_ammucountry"), new mp.Vector3(-331.3555, 6085.712, 31.45477), -133.1493, false, "WORLD_HUMAN_GUARD_STAND");
// Ammu-Nation - Пиллбокс-Хилл - Элгин-Авеню
    npc.create(mp.game.joaat("s_m_m_ammucountry"), new mp.Vector3(23.1827, -1105.512, 29.79702), 158.1179, false, "WORLD_HUMAN_GUARD_STAND");
// Ammu-Nation - Хавик - Спэниш-авеню
    npc.create(mp.game.joaat("s_m_m_ammucountry"), new mp.Vector3(253.8001, -51.07007, 69.9411), 71.83827, false, "WORLD_HUMAN_GUARD_STAND");
// Ammu-Nation - Ла-Меса - Шоссе Олимпик
    npc.create(mp.game.joaat("s_m_m_ammucountry"), new mp.Vector3(841.848, -1035.449, 28.19485), -1.228782, false, "WORLD_HUMAN_GUARD_STAND");
// Ammu-Nation - Маленький Сеул - Паломино-авеню
    npc.create(mp.game.joaat("s_m_m_ammucountry"), new mp.Vector3(-661.7558, -933.2841, 21.82923), -178.1721, false, "WORLD_HUMAN_GUARD_STAND");
// Ammu-Nation - Морнингвуд - Бульвар Морнингвуд
    npc.create(mp.game.joaat("s_m_m_ammucountry"), new mp.Vector3(-1303.956, -395.2117, 36.69579), 75.62228, false, "WORLD_HUMAN_GUARD_STAND");
// Ammu-Nation - Сайпрес-Флэтс - Попьюлар-стрит
    npc.create(mp.game.joaat("s_m_m_ammucountry"), new mp.Vector3(809.6276, -2159.31, 29.61901), -2.014809, false, "WORLD_HUMAN_GUARD_STAND");
// Blazing Tattoo - Центр Вайнвуда - Бульвар Ванйвуд
    npc.create(mp.game.joaat("u_m_y_tattoo_01"), new mp.Vector3(319.8327, 181.0894, 103.5865), -106.512, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Alamo Tattoo Studio - Сэнди-Шорс - Занкудо-авеню
    npc.create(mp.game.joaat("u_m_y_tattoo_01"), new mp.Vector3(1862.807, 3748.279, 33.03187), 40.61253, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Paleto Tattoo - Палето-Бэй - Дулуоз-авеню
    npc.create(mp.game.joaat("u_m_y_tattoo_01"), new mp.Vector3(-292.3047, 6199.946, 31.48711), -117.6071, false, "WORLD_HUMAN_STAND_IMPATIENT");
// The Pit - Каналы Веспуччи - Агуха-стрит
    npc.create(mp.game.joaat("u_m_y_tattoo_01"), new mp.Vector3(-1151.971, -1423.695, 4.954463), 136.3183, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Los Santos Tattoos - Эль-Бурро-Хайтс - Бульвар Инносенс
    npc.create(mp.game.joaat("u_m_y_tattoo_01"), new mp.Vector3(1324.483, -1650.021, 52.27503), 144.9793, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Ink Inc - Чумаш - Барбарено-роуд
    npc.create(mp.game.joaat("u_m_y_tattoo_01"), new mp.Vector3(-3170.404, 1072.786, 20.82917), -6.981083, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Herr Kutz Barber - Дэвис - Карсон-авеню
    npc.create(mp.game.joaat("s_f_m_fembarber"), new mp.Vector3(134.8694, -1708.296, 29.29161), 151.6018, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Herr Kutz Barber - Миррор-Парк - Бульвар Миррор-Парк
    npc.create(mp.game.joaat("s_f_m_fembarber"), new mp.Vector3(1211.27, -471.0499, 66.20805), 82.84951, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Herr Kutz Barber - Палето-Бэй - Дулуоз-авеню
    npc.create(mp.game.joaat("s_f_m_fembarber"), new mp.Vector3(-278.3121, 6230.216, 31.69552), 60.1603, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Beach Combover Barber - Веспуччи - Магеллан-авеню
    npc.create(mp.game.joaat("s_f_m_fembarber"), new mp.Vector3(-1284.274, -1115.853, 6.99013), 99.18153, false, "WORLD_HUMAN_STAND_IMPATIENT");
// O'Sheas Barbers Shop - Сэнди-Шорс - Альгамбра-драйв
    npc.create(mp.game.joaat("s_f_m_fembarber"), new mp.Vector3(1931.232, 3728.298, 32.84444), -144.9153, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Hair on Hawick - Хавик - Хавик-авеню
    npc.create(mp.game.joaat("s_f_m_fembarber"), new mp.Vector3(-31.19347, -151.4883, 57.07652), -7.542643, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Bob Mulet - Рокфорд-Хиллз - Мэд-Уэйн-Тандер-драйв
    npc.create(mp.game.joaat("s_f_m_fembarber"), new mp.Vector3(-822.4669, -183.7317, 37.56892), -139.7869, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Binco - Каналы Веспуччи - Паломино-авеню
    npc.create(mp.game.joaat("a_f_y_hipster_02"), new mp.Vector3(-823.3749, -1072.378, 11.32811), -108.4307, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Binco - Текстайл-Сити - Синнерс-пэссейдж
    npc.create(mp.game.joaat("a_m_y_hipster_02"), new mp.Vector3(427.0797, -806.0226, 29.49113), 130.6033, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Discount Store - Палето-Бэй - Бульвар Палето
    npc.create(mp.game.joaat("a_f_y_hipster_02"), new mp.Vector3(6.133633, 6511.472, 31.87784), 82.75452, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Discount Store - Грейпсид - Грейпсид-Мэйн-стрит
    npc.create(mp.game.joaat("a_m_y_hipster_02"), new mp.Vector3(1695.472, 4823.236, 42.0631), 125.9657, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Discount Store - Пустыня Гранд-Сенора - Шоссе 68
    npc.create(mp.game.joaat("a_f_y_hipster_02"), new mp.Vector3(1196.317, 2711.907, 38.22262), -145.9363, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Discount Store - Река Занкудо - Шоссе 68
    npc.create(mp.game.joaat("a_m_y_hipster_02"), new mp.Vector3(-1102.664, 2711.66, 19.10786), -103.8504, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Discount Store - Строберри - Бульвар Инносентс
    npc.create(mp.game.joaat("a_f_y_hipster_02"), new mp.Vector3(73.73582, -1392.895, 29.37614), -68.70364, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Sub Urban - Хармони - Шоссе 68
    npc.create(mp.game.joaat("s_f_y_shop_mid"), new mp.Vector3(612.8171, 2761.852, 42.08812), -63.55088, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Sub Urban - Дель-Перро - Норт-Рокфорд-драйв
    npc.create(mp.game.joaat("a_m_y_hipster_01"), new mp.Vector3(-1194.562, -767.3227, 17.31602), -120.527, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Sub Urban - Чумаш - Шоссе Грейт-Оушн
    npc.create(mp.game.joaat("s_f_y_shop_mid"), new mp.Vector3(-3168.905, 1043.997, 20.86322), 80.39653, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Sub Urban - Альта - Хавик-авеню
    npc.create(mp.game.joaat("a_m_y_hipster_01"), new mp.Vector3(127.306, -223.5369, 54.55785), 101.7699, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Ponsonbys - Бертон - Бульвар Лас-Лагунас
    npc.create(mp.game.joaat("a_f_y_business_01"), new mp.Vector3(-164.6587, -302.2024, 39.7333), -90.87177, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Ponsonbys - Рокфорд-Хиллз - Портола-драйв
    npc.create(mp.game.joaat("a_m_y_business_01"), new mp.Vector3(-708.5155, -152.5676, 37.41148), 133.2013, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Ponsonbys - Морнингвуд - Кугар-авеню
    npc.create(mp.game.joaat("a_f_y_business_01"), new mp.Vector3(-1449.5, -238.6422, 49.81335), 60.38498, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Vangelico - Рокфорд-Хиллз - Рокфорд-драйв
    npc.create(mp.game.joaat("u_f_y_jewelass_01"), new mp.Vector3(-623.1789, -229.2665, 38.05703), 48.75668, false, "WORLD_HUMAN_STAND_IMPATIENT");
    npc.create(mp.game.joaat("ig_jewelass"), new mp.Vector3(-620.9707, -232.295, 38.05703), -134.2347, false, "WORLD_HUMAN_STAND_IMPATIENT");
    npc.create(mp.game.joaat("u_m_m_jewelsec_01"), new mp.Vector3(-628.8972, -238.8752, 38.05712), -49.34913, false, "WORLD_HUMAN_GUARD_STAND");
// Vespucci Movie Masks - Веспуччи-бич - Витус-стрит
    npc.create(mp.game.joaat("s_m_y_shop_mask"), new mp.Vector3(-1334.673, -1276.343, 4.963552), 142.5475, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Beekers Garage - Палето-Бэй - Бульвар Палето
    npc.create(mp.game.joaat("s_m_m_autoshop_02"), new mp.Vector3(106.3625, 6628.315, 31.78724), -108.3491, false, "WORLD_HUMAN_CLIPBOARD");
// Los Santos Customs Senora - Пустыня-Гранд-Сенора - Шоссе 68
    npc.create(mp.game.joaat("s_m_m_autoshop_01"), new mp.Vector3(1178.711, 2639.02, 37.7538), 64.71403, false, "WORLD_HUMAN_CLIPBOARD");
// Los Santos Customs Burton - Бертон - Карсер-вэй
    npc.create(mp.game.joaat("s_m_m_autoshop_02"), new mp.Vector3(-345.0504, -129.6553, 39.00965), -149.6841, false, "WORLD_HUMAN_CLIPBOARD");
// Los Santos Customs La Mesa - Ла-Меса - Шоссе-Олимпик
    npc.create(mp.game.joaat("s_m_m_autoshop_01"), new mp.Vector3(737.2117, -1083.939, 22.16883), 97.4564, false, "WORLD_HUMAN_CLIPBOARD");
// Hayes Autos - Строберри - Литл-Бигхорн-авеню
    npc.create(mp.game.joaat("s_m_m_autoshop_02"), new mp.Vector3(471.7564, -1310.021, 29.22494), -128.6412, false, "WORLD_HUMAN_CLIPBOARD");
// Bennys Original Motor Works - Строберри - Альта-стрит
    npc.create(mp.game.joaat("ig_benny"), new mp.Vector3(-216.5449, -1320.012, 30.89039), -97.54453, false, "WORLD_HUMAN_CLIPBOARD");
// Los Santos Customs LSIA - Международный аэропорт Лос-Сантос - Гринвич-Парквэй
    npc.create(mp.game.joaat("s_m_m_autoshop_01"), new mp.Vector3(-1145.874, -2003.389, 13.18026), 94.71597, false, "WORLD_HUMAN_CLIPBOARD");
// Bike rent - Елизиан Айланд - Нью-Эмпайр-вэй
    npc.create(mp.game.joaat("a_f_y_skater_01"), new mp.Vector3(-394.2759, -2670.96, 6.000217), 79.09959, false, "WORLD_HUMAN_SMOKING");
// Bike rent - Строберри - Элгин-авеню
    npc.create(mp.game.joaat("a_m_m_skater_01"), new mp.Vector3(102.7933, -1388.645, 29.29153), -7.799984, false, "WORLD_HUMAN_SMOKING");
// Bike rent - Центр Вайнвуда - Бульвар Ванйвуд
    npc.create(mp.game.joaat("a_m_y_skater_01"), new mp.Vector3(180.926, 180.4024, 105.5414), -14.19996, false, "WORLD_HUMAN_CLIPBOARD");
// Bike rent - Дель-Перро - Магеллан-авеню
    npc.create(mp.game.joaat("a_m_y_skater_01"), new mp.Vector3(-1262.949, -607.0857, 27.16493), -126.8111, false, "WORLD_HUMAN_AA_COFFEE");
// Bike rent - Чумаш - Барбарено-роуд
    npc.create(mp.game.joaat("a_m_m_skater_01"), new mp.Vector3(-3155.155, 1099.27, 20.85335), -101.9993, false, "CODE_HUMAN_MEDIC_TIME_OF_DEATH");
// Bike rent - Палето-Бэй - Бульвар Палето
    npc.create(mp.game.joaat("a_m_y_skater_01"), new mp.Vector3(-232.3245, 6320.706, 31.48291), -128.9995, false, "WORLD_HUMAN_CLIPBOARD");
// Bike rent - Грейпсид - Грейпсид-Мэйн-стрит
    npc.create(mp.game.joaat("a_f_y_skater_01"), new mp.Vector3(1679.077, 4861.357, 42.06063), 117.3989, false, "CODE_HUMAN_MEDIC_TIME_OF_DEATH");
// Bike rent - Сэнди-Шорс - Альгамбра-драйв
    npc.create(mp.game.joaat("a_m_m_skater_01"), new mp.Vector3(1806.736, 3676.029, 34.27676), -39.58422, false, "WORLD_HUMAN_SMOKING");
// Bike rent - Болингброк - Шоссе 68
    npc.create(mp.game.joaat("a_m_y_skater_01"), new mp.Vector3(1852.597, 2594.885, 45.67204), -80.29984, false, "WORLD_HUMAN_AA_COFFEE");
// Bike rent - Текстайл-Сити - Элгин-авеню
    npc.create(mp.game.joaat("a_f_y_skater_01"), new mp.Vector3(297.7727, -607.1932, 43.37174), 88.88361, false, "CODE_HUMAN_MEDIC_TIME_OF_DEATH");
// Bike rent - Миррор-Парк - Никола-авеню
    npc.create(mp.game.joaat("a_m_m_skater_01"), new mp.Vector3(1153.488, -454.4688, 66.98437), 170.2867, false, "WORLD_HUMAN_AA_COFFEE");
// Bike rent - Пиллбокс-Хилл - Бульвар Веспуччи
    npc.create(mp.game.joaat("a_m_y_skater_01"), new mp.Vector3(-71.90009, -636.4031, 36.26555), 75.59978, false, "WORLD_HUMAN_AA_COFFEE");
// Bike rent - Маленький Сеул - Декер-стрит
    npc.create(mp.game.joaat("a_f_y_skater_01"), new mp.Vector3(-673.8143, -854.3931, 24.16787), 15.29996, false, "WORLD_HUMAN_AA_COFFEE");
// Bike rent - Рокфорд-Хиллз - Южный бульвар Дель-Перро
    npc.create(mp.game.joaat("a_m_m_skater_01"), new mp.Vector3(-734.7107, -229.2012, 37.25011), -146.5325, false, "CODE_HUMAN_MEDIC_TIME_OF_DEATH");
// Bike rent - Ла-Пуэрта - Гома-стрит
    npc.create(mp.game.joaat("a_m_y_skater_01"), new mp.Vector3(-1086.856, -1345.369, 5.071685), -145.5996, false, "WORLD_HUMAN_SMOKING");
// Bike rent - Хармони - Сенора-роуд
    npc.create(mp.game.joaat("a_f_y_skater_01"), new mp.Vector3(609.6804, 2745.572, 41.98055), -155.9992, false, "WORLD_HUMAN_SMOKING");
// Bike rent - Мишн-Роу - Алти-стрит
    npc.create(mp.game.joaat("a_f_y_skater_01"), new mp.Vector3(388.1663, -981.5941, 29.42357), -75.40633, false, "CODE_HUMAN_MEDIC_TIME_OF_DEATH");
// Boat rent - Ла-Пуэрта - Шэнк-стрит
    //npc.create(mp.game.joaat("a_m_y_runner_01"), new mp.Vector3(-790.4313, -1453.044, 1.596039), -38.84312, false, "WORLD_HUMAN_AA_COFFEE ");
// Boat rent - Бухта Палето - Шоссе Грейт-Оушн
    //npc.create(mp.game.joaat("a_f_y_runner_01"), new mp.Vector3(-1603.928, 5251.08, 3.974748), 108.5822, false, "WORLD_HUMAN_SMOKING");
// Boat rent - Сан-Шаньский горный хребет - Кэтфиш-Вью
    //npc.create(mp.game.joaat("a_m_y_runner_01"), new mp.Vector3(3867.177, 4463.583, 2.727666), 73.1316, false, "WORLD_HUMAN_CLIPBOARD");
// Bike Rent - Calafia Bridge
    npc.create(mp.game.joaat("a_f_y_hippie_01"), new mp.Vector3(-206.4295, 4227.988, 44.86481), -168.9843, false, "WORLD_HUMAN_SMOKING");
// Bike Rent - East Elysian Islands
    npc.create(mp.game.joaat("mp_m_exarmy_01"), new mp.Vector3(644.5712, -3009.586, 6.22769), -2.310211, false, "WORLD_HUMAN_SMOKING");
// Bike Rent - El Burro Heists
    npc.create(mp.game.joaat("g_m_y_mexgoon_02"), new mp.Vector3(1136.107, -1484.797, 34.84342), -65.9995, false, "WORLD_HUMAN_AA_COFFEE ");
// Bike Rent - Great Chaparral
    npc.create(mp.game.joaat("a_m_m_farmer_01"), new mp.Vector3(-1088.656, 2716.905, 19.07619), -131.9994, false, "CODE_HUMAN_MEDIC_TIME_OF_DEATH");
// Bike Rent - Maze Bank Arena
    npc.create(mp.game.joaat("a_m_y_eastsa_02"), new mp.Vector3(-248.7172, -2057.083, 27.75543), -56.26459, false, "WORLD_HUMAN_AA_COFFEE");
// Bike Rent - Mount Chiliad
    npc.create(mp.game.joaat("a_m_y_dhill_01"), new mp.Vector3(462.4398, 5581.525, 781.1671), 6.832367, false, "WORLD_HUMAN_CLIPBOARD");
// Bike Rent - Mount Gordo
    npc.create(mp.game.joaat("u_m_y_hippie_01"), new mp.Vector3(1579.635, 6456.885, 25.31715), 72.05165, false, "WORLD_HUMAN_SMOKING");
// Bike Rent - North Chumash
    npc.create(mp.game.joaat("a_m_m_salton_04"), new mp.Vector3(-2508.011, 3622.828, 13.60635), -136.1273, false, "WORLD_HUMAN_CLIPBOARD");
// Bike Rent - Paleto Forest
    npc.create(mp.game.joaat("a_m_y_skater_02"), new mp.Vector3(-777.0889, 5593.67, 33.63668), -115.9992, false, "WORLD_HUMAN_AA_COFFEE");
// Bike Rent - Rancho
    npc.create(mp.game.joaat("g_f_importexport_01"), new mp.Vector3(186.2505, -2028.593, 18.27061), 163.7489, false, "CODE_HUMAN_MEDIC_TIME_OF_DEATH");
// Bike Rent - Tataviam Mountains
    npc.create(mp.game.joaat("a_m_y_vinewood_03"), new mp.Vector3(2560.841, 393.5162, 108.6209), -72.99976, false, "WORLD_HUMAN_CLIPBOARD");
// Bike Rent - Vinewood Racetrack
    npc.create(mp.game.joaat("a_f_y_skater_01"), new mp.Vector3(964.2814, 122.494, 80.99068), -20.63669, false, "CODE_HUMAN_MEDIC_TIME_OF_DEATH");
// Fleeca - Морнингвуд
    npc.create(mp.game.joaat("a_m_y_busicas_01"), new mp.Vector3(-1211.917, -332.0083, 37.78095), 32.20013, false, "WORLD_HUMAN_STAND_IMPATIENT");
    npc.create(mp.game.joaat("a_f_y_business_01"), new mp.Vector3(-1213.227, -332.6803, 37.7809), 29.04985, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Fleeca - Чумаш
    npc.create(mp.game.joaat("a_m_m_business_01"), new mp.Vector3(-2960.983, 482.9597, 15.69701), 87.49982, false, "WORLD_HUMAN_STAND_IMPATIENT");
    npc.create(mp.game.joaat("a_m_y_business_01"), new mp.Vector3(-2961.076, 481.3979, 15.69694), 94.43291, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Fleeca - Бертон
    npc.create(mp.game.joaat("a_f_m_business_02"), new mp.Vector3(-352.7554, -50.81618, 49.03643), -11.61766, false, "WORLD_HUMAN_STAND_IMPATIENT");
    npc.create(mp.game.joaat("a_f_y_business_02"), new mp.Vector3(-351.3324, -51.37263, 49.0365), 0.9843516, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Fleeca - Хевик
    npc.create(mp.game.joaat("a_m_y_business_02"), new mp.Vector3(313.8501, -280.4764, 54.16471), -13.8998, false, "WORLD_HUMAN_STAND_IMPATIENT");
    npc.create(mp.game.joaat("a_f_y_business_03"), new mp.Vector3(312.3756, -279.9246, 54.16464), -15.29996, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Fleeca - Пиллбокс-Хилл
    npc.create(mp.game.joaat("a_m_y_business_03"), new mp.Vector3(149.4378, -1042.182, 29.368), -16.53926, false, "WORLD_HUMAN_STAND_IMPATIENT");
    npc.create(mp.game.joaat("a_f_y_business_04"), new mp.Vector3(148.0451, -1041.64, 29.36793), -10.84452, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Fleeca - Гранд-Сенора
    npc.create(mp.game.joaat("a_m_y_busicas_01"), new mp.Vector3(1174.833, 2708.267, 38.08796), -176.1989, false, "WORLD_HUMAN_STAND_IMPATIENT");
    npc.create(mp.game.joaat("a_m_m_business_01"), new mp.Vector3(1176.375, 2708.216, 38.08791), -174.8994, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Blaine Bank - Палето-Бэй
    npc.create(mp.game.joaat("a_f_y_business_01"), new mp.Vector3(-112.1626, 6471.107, 31.62671), 143.5989, false, "WORLD_HUMAN_STAND_IMPATIENT");
    npc.create(mp.game.joaat("a_m_y_business_01"), new mp.Vector3(-111.1555, 6470.048, 31.62671), 134.9988, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Pacific Standart - Центральный Вайнвуда
    npc.create(mp.game.joaat("a_f_m_business_02"), new mp.Vector3(241.9019, 226.8564, 106.2871), 172.1895, false, "WORLD_HUMAN_STAND_IMPATIENT");
    npc.create(mp.game.joaat("a_m_y_business_02"), new mp.Vector3(243.6673, 226.2376, 106.2876), 170.999, false, "WORLD_HUMAN_STAND_IMPATIENT");
    npc.create(mp.game.joaat("a_f_y_business_02"), new mp.Vector3(247.008, 225.0361, 106.2875), 175.9993, false, "WORLD_HUMAN_STAND_IMPATIENT");
    npc.create(mp.game.joaat("a_f_y_business_03"), new mp.Vector3(248.8495, 224.2853, 106.2871), 173.9992, false, "WORLD_HUMAN_STAND_IMPATIENT");
    npc.create(mp.game.joaat("a_f_y_business_04"), new mp.Vector3(252.2165, 223.1031, 106.2868), 169.3982, false, "WORLD_HUMAN_STAND_IMPATIENT");
    npc.create(mp.game.joaat("a_f_y_business_01"), new mp.Vector3(254.011, 222.395, 106.2868), 172.9996, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Maze Bank
    npc.create(mp.game.joaat("a_f_y_business_04"), new mp.Vector3(-72.27431, -814.5317, 243.3859), 162.9991, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Работодатель на Садовнике
    npc.create(mp.game.joaat("s_m_m_gardener_01"), new mp.Vector3(-1585.051, -234.8312, 54.33006), 43.62775, false, "WORLD_HUMAN_CLIPBOARD");
// Работодатель на Разнорабочем
    npc.create(mp.game.joaat("s_m_y_construct_02"), new mp.Vector3(-1159.267, -739.1121, 19.88993), -171.2985, false, "WORLD_HUMAN_CLIPBOARD");
// Работодатель на Фотографе LifeInvader
    npc.create(mp.game.joaat("a_m_m_prolhost_01"), new mp.Vector3(-1075.676, -246.3934, 37.76327), 147.1302, false, "WORLD_HUMAN_CLIPBOARD");
// Работодатель на Почте GoPostal
    npc.create(mp.game.joaat("s_m_m_janitor"), new mp.Vector3(136.4377, 92.83617, 83.5126), 40.21272, false, "WORLD_HUMAN_CLIPBOARD");
// Работодатель на Автобусной станции
    npc.create(mp.game.joaat("ig_jimmyboston"), new mp.Vector3(454.2171, -596.1467, 28.53182), -36.12801, false, "WORLD_HUMAN_CLIPBOARD");
// Работодатель на Инкассаторе
    npc.create(mp.game.joaat("ig_casey"), new mp.Vector3(3.112391, -660.4219, 33.4508), -49.89936, false, "WORLD_HUMAN_CLIPBOARD");
// Полицейский на выдаче оружия Mission-Row
    npc.create(mp.game.joaat("s_m_y_cop_01"), new mp.Vector3(454.2837829589844, -980.0394287109375, 30.689321517944336), 89.98814392089844, false, "WORLD_HUMAN_CLIPBOARD");
// Шериф на выдаче оружия Sandy Shores
    npc.create(mp.game.joaat("s_m_y_sheriff_01"), new mp.Vector3(1844.3907470703125, 3692.18701171875, 34.26704788208008), 284.88543701171875, false, "WORLD_HUMAN_CLIPBOARD");
// Шериф на выдаче оружия Paleto Bay
    npc.create(mp.game.joaat("csb_cop"), new mp.Vector3(-436.1072998046875, 5999.68603515625, 31.716081619262695), 33.66008377075195, false, "WORLD_HUMAN_CLIPBOARD");
//Церковь
    npc.create(mp.game.joaat("ig_priest"), new mp.Vector3(-787.1298828125, -708.8898315429688, 30.32028579711914), 265.47149658203125, false, "WORLD_HUMAN_GUARD_STAND");


// House 532
    npc.create(mp.game.joaat("s_m_m_highsec_01"), new mp.Vector3(-632.0056, 398.0607, 101.2304), 16.52335, false, "WORLD_HUMAN_GUARD_STAND");
    npc.create(mp.game.joaat("s_m_m_highsec_02"), new mp.Vector3(-624.1522, 398.4064, 101.2321), 10.33697, false, "WORLD_HUMAN_GUARD_STAND");

    timer.createInterval('npc.timer', npc.timer, 5000);
    timer.createInterval('npc.timer500', npc.timer500, 500);
};

npc.timer = function() {
    //return;
    let playerPos = mp.players.local.position;

    _npcList.forEach(async function(item) {

        let dist = methods.distanceToPos(playerPos, item.pos);

        if (dist < _loadDist && !item.isCreate) {

            try {
                if (mp.game.streaming.hasModelLoaded(item.model)) {
                    item.ped = mp.peds.new(item.model, item.pos, item.heading);
                    item.handle = item.ped.handle;
                    if (item.scenario != "")
                        mp.game.invoke(methods.TASK_START_SCENARIO_IN_PLACE, item.handle, item.scenario, 0, true);

                    if (item.animation1 != "") {
                        mp.game.streaming.requestAnimDict(item.animation1);
                        setTimeout(function () {
                            if (mp.game.streaming.hasAnimDictLoaded(item.animation1))
                                mp.game.invoke(methods.TASK_PLAY_ANIM, item.handle, item.animation1, item.animation2, 9, -8, -1, item.flag, 0, false, false, false);
                        }, 5000);
                    }

                    item.isCreate = true;
                }
                else if(item.didRequest !== true) {
                    item.didRequest = true;
                    mp.game.streaming.requestModel(item.model);
                }
            }
            catch (e) {
                methods.debug('CreatePed', e);
            }
        }
        else if (dist > _loadDist + 50 && item.isCreate) {
            try {
                methods.debug('DELETE', item);
                try {
                    if (mp.peds.exists(item.ped))
                        item.ped.destroy();
                    item.ped = null;
                    item.handle = 0;
                    item.isCreate = false;
                }
                catch (e) {
                    methods.debug(e);
                }

                try {
                    if(item.didRequest === true) {
                        item.didRequest = false;
                        mp.game.streaming.setModelAsNoLongerNeeded(item.model);
                    }
                }
                catch (e) {
                    methods.debug(e);
                }
            }
            catch (e) {
                methods.debug('DeletePed', e);
            }
        }
    });
};

npc.timer500 = function() {

    try {
        let playerPos = mp.players.local.position;

        _npcList.forEach(async function(item) {

            try {
                let dist = methods.distanceToPos(playerPos, item.pos);

                if (dist <= item.speechRadius && item.isCreate && !item.isSpeech) {
                    if (item.speech1 != "")
                        mp.game.audio.playAmbientSpeechWithVoice(item.handle, item.speech1, '', 'SPEECH_PARAMS_FORCE_SHOUTED', false);
                    //mp.game.invoke(methods.PLAY_AMBIENT_SPEECH1, item.handle, item.speech1, 'SPEECH_PARAMS_FORCE');
                    item.isSpeech = true;
                }
                else if (dist > item.speechRadius && item.isCreate && item.isSpeech) {
                    if (item.speech2 != "")
                        mp.game.audio.playAmbientSpeechWithVoice(item.handle, item.speech2, '', 'SPEECH_PARAMS_FORCE_SHOUTED', false);
                    //mp.game.invoke(methods.PLAY_AMBIENT_SPEECH1, item.handle, item.speech2, 'SPEECH_PARAMS_FORCE');
                    item.isSpeech = false;
                }
            }
            catch (e) {
                methods.debug(e);
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

npc.create = function(model, pos, heading, empty = false, scenario = "", animation1 = "", animation2 = "", flag = 9, speechRadius = 5, speech1 = 'GENERIC_HI', speech2 = 'GENERIC_BYE') {

    if (typeof model == "string")
        model = mp.game.joaat(model);

    _npcList.push({model: model, pos: pos, heading: heading, ped: null, scenario: scenario, animation1: animation1, animation2: animation2, flag: flag, speechRadius: speechRadius, speech1: speech1, speech2: speech2, isSpeech: false, isCreate: false, handle: 0});
};

npc.createPedLocally = function(model, pos, heading) {
    try {
        if (mp.game.streaming.isModelValid(model)) {
            mp.game.streaming.requestModel(model);
            if (mp.game.streaming.hasModelLoaded(model))
                return mp.game.ped.createPed(26, model, pos.x, pos.y, pos.z, heading, false, false);
        }
    }
    catch (e) {
        methods.debug(e);
    }
    return 0;
};

export default npc;