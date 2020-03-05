let Container = require('../modules/data');
let mysql = require('../modules/mysql');
let methods = require('../modules/methods');
let chat = require('../modules/chat');

let user = require('../user');
let coffer = require('../coffer');
let enums = require('../enums');
let inventory = require('../inventory');

let vehicles = require('./vehicles');
let fraction = require('./fraction');

let stocks = exports;

let stockList = new Map();
let count = 0;

stocks.interiorList = [
    [1104.6878662109375, -3099.449462890625, -39.999916076660156, 88.8323745727539, 1101.0675048828125, -3099.64697265625, -39.34011459350586, 91.2125244140625], //0
    [1072.5458984375, -3102.49755859375, -39.99995422363281, 93.9716567993164, 1071.10302734375, -3103.2294921875, -39.2861328125, 359.570556640625], //1
    [1027.242431640625, -3101.391357421875, -39.999900817871094, 89.16166687011719, 1023.4574584960938, -3101.502685546875, -39.34016418457031, 89.84857177734375], //2
];

stocks.pcList = [
    [1088.6097412109375, -3101.404541015625, -39.999942779541016], //0
    [1049.1907958984375, -3100.739013671875, -39.99993133544922], //1
    [994.3892822265625, -3099.96142578125, -39.995849609375], //2
];

//Имя, Model, Объем, OffsetZ, Можно ли юзать, Цена
stocks.boxList = [
    ['Малая коробка', 1165008631, 400000, -0.12, true, 10000, 'Стандарт', -1],
    ['Средняя коробка', 1875981008, 600000, -0.12, true, 20000, 'Стандарт', -1],
    ['Большая коробка', -1322183878, 800000, -0.12, true, 30000, 'Стандарт', -1],

    ['Большой ящик с оружием', 1790162299, 3, 0, false, 15000, 'Оружие и патроны', 1],
    ['Малый ящик с оружием', 2055492359, 4, 0, false, 5000, 'Оружие и патроны', 0],
    ['Большой ящик антиквариата', 1815664890, 5, 0, false, 15000, 'Антиквариат', 1],
    ['Малый ящик антиквариата', 1397410834, 5, 0, false, 5000, 'Антиквариат', 0],
    ['Большой ящик антиквариата', 1057918179, 6, 0, false, 15000, 'Антиквариат', 1],
    ['Малый ящик антиквариата', -1655753417, 7, 0, false, 5000, 'Антиквариат', 0],
    ['Большой ящик химикатов', 21331302, 8, 0, false, 15000, 'Химикаты', 1],
    ['Малый ящик химикатов', 1075102988, 9, 0, false, 5000, 'Химикаты', 0],
    ['Большой ящик серебра', 2014503631, 10, 0, false, 15000, 'Контрафактные товары', 1],
    ['Малый ящик серебра', -333302011, 11, 0, false, 5000, 'Контрафактные товары', 0],
    ['Малый ящик медикоментов', 2092857693, 12, 0, false, 5000, 'Медикаменты', 0],
    ['Оружейный ящик Merryweather', -994309865, 13, 0, false, 10000, 'Оружие и патроны', 0],
    ['Ящик сигарет Redwood', -1958, 14, 0, false, 5000, 'Алкоголь и табак', 0],
    ['Большой ящик кожаных сумок', 12824223, 15, 0, false, 15000, 'Трофеи браконьеров', 1],
    ['Малый ящик кожаных сумок', -270239139, 16, 0, false, 5000, 'Трофеи браконьеров', 0],
    ['Большой ящик техники', 60045683, 17, 0, false, 15000, 'Контрафактные товары', 1],
    ['Малый ящик техники', -731494164, 18, 0, false, 5000, 'Контрафактные товары', 0],
    ['Большой ящик взрывчатки', -1853019218, 19, 0, false, 15000, 'Оружие и патроны', 1],
    ['Малый ящик взрывчатки', -305076648, 20, 0, false, 5000, 'Оружие и патроны', 0],
    ['Редкая киноплёнка', 725420132, 21, 0, false, 30000, 'Уникальный груз', 2],
    ['Большой ящик меховых шуб', -1227143673, 22, -0.12, false, 15000, 'Трофеи браконьеров', 1],
    ['Малый ящик меховых шуб', 1915002422, 23, -0.12, false, 5000, 'Трофеи браконьеров', 0],
    ['Большой ящик драгоценных камней', 654562429, 24, 0, false, 15000, 'Ювилирные украшения', 1],
    ['Малый ящик драгоценных камней', 304821544, 25, 0, false, 5000, 'Ювилирные украшения', 0],
    ['Большой ящик лекарств', -1129076059, 26, 0, false, 15000, 'Медикаменты', 1],
    ['Малый ящик лекарств', 1524744766, 27, 0, false, 5000, 'Медикаменты', 0],
    ['Большой ящик украшений', -76137332, 28, 0, false, 15000, 'Ювилирные украшения', 1],
    ['Малый ящик украшений', -290560280, 29, 0, false, 5000, 'Ювилирные украшения', 0],
    ['Большой ящик с часами', -1817226762, 30, 0, false, 15000, 'Ювилирные украшения', 1],
    ['Малый ящик с часами', -2104190829, 31, 0, false, 5000, 'Ювилирные украшения', 0],
    ['Большой ящик лекарств', 797797701, 32, 0, false, 15000, 'Медикаменты', 1],
    ['Малый ящик лекарств', 1054352436, 33, 0, false, 5000, 'Медикаменты', 0],
    ['Золотой Minigun', 1557324266, 34, 0, false, 40000, 'Уникальный груз', 2],
    ['Большой ящик фальшивых купюр', -80652213, 35, 0, false, 15000, 'Контрафактные товары', 1],
    ['Малый ящик фальшивых купюр', -1155316904, 36, 0, false, 5000, 'Контрафактные товары', 0],
    ['Большой ящик наркотиков', 1016837103, 37, 0, false, 15000, 'Наркотики', 1],
    ['Малый ящик наркотиков', 1863514296, 38, 0, false, 5000, 'Наркотики', 0],
    ['Яйцо фабирже', 562429577, 39, 0, false, 35000, 'Уникальный груз', 2],
    ['Большой ящик лекарств', 1914690987, 40, -0.12, false, 15000, 'Медикаменты', 1],
    ['Малый ящик лекарств', -824154829, 41, 0, false, 5000, 'Медикаменты', 0],
    ['Костюм Етти', -495810123, 42, 0, false, 25000, 'Уникальный груз', 2],
    ['Большой ящик алкоголя и табака', -19283505, 43, -0.12, false, 15000, 'Алкоголь и табак', 1],
    ['Малый ящик алкоголя и табака', -2073232532, 44, -0.12, false, 5000, 'Алкоголь и табак', 0],
    ['Золотой компас', 577983279, 45, 0, false, 35000, 'Уникальный груз', 2],
    ['Большой ящик слоновых бивней', -2033482115, 46, -0.12, false, 15000, 'Трофеи браконьеров', 1],
    ['Малый ящик слоновых бивней', 588496643, 47, -0.12, false, 5000, 'Трофеи браконьеров', 0],
    ['Бриллиант 64 карата', 926762619, 48, 0, false, 50000, 'Уникальный груз', 2],
];

stocks.boxPosList = [
    [
        [1088.75, -3096.7, -39.88, 0, 0, 0],
        [1088.757, -3096.428, -37.66, 0, 0, 0],
        [1091.3, -3096.7, -39.88, 0, 0, 0],
        [1091.3, -3096.7, -37.66, 0, 0, 0],
        [1095.05, -3096.7, -39.88, 0, 0, 0],
        [1095.05, -3096.7, -37.66, 0, 0, 0],
        [1097.6, -3096.7, -39.88, 0, 0, 0],
        [1097.6, -3096.7, -37.66, 0, 0, 0],
        [1101.3, -3096.7, -39.88, 0, 0, 0],
        [1101.3, -3096.7, -37.66, 0, 0, 0],
        [1103.8, -3096.7, -39.88, 0, 0, 0],
        [1103.8, -3096.7, -37.66, 0, 0, 0],
    ],
    [
        [1053.1, -3095.6, -39.88, 0, 0, 0],
        [1053.1, -3095.6, -37.66, 0, 0, 0],
        [1055.5, -3095.6, -39.88, 0, 0, 0],
        [1055.5, -3095.6, -37.66, 0, 0, 0],
        [1057.9, -3095.6, -39.88, 0, 0, 0],
        [1057.9, -3095.6, -37.66, 0, 0, 0],
        [1060.3, -3095.6, -39.88, 0, 0, 0],
        [1060.3, -3095.6, -37.66, 0, 0, 0],
        [1062.7, -3095.6, -39.88, 0, 0, 0],
        [1062.7, -3095.6, -37.66, 0, 0, 0],
        [1065.1, -3095.6, -39.88, 0, 0, 0],
        [1065.1, -3095.6, -37.66, 0, 0, 0],
        [1067.6, -3095.6, -39.88, 0, 0, 0],
        [1067.6, -3095.6, -37.66, 0, 0, 0],
        [1053.1, -3102.9, -39.88, 0, 0, 0],
        [1053.1, -3102.9, -37.66, 0, 0, 0],
        [1055.5, -3102.9, -39.88, 0, 0, 0],
        [1055.5, -3102.9, -37.66, 0, 0, 0],
        [1057.9, -3102.9, -39.88, 0, 0, 0],
        [1057.9, -3102.9, -37.66, 0, 0, 0],
        [1060.3, -3102.9, -39.88, 0, 0, 0],
        [1060.3, -3102.9, -37.66, 0, 0, 0],
        [1062.7, -3102.9, -39.88, 0, 0, 0],
        [1062.7, -3102.9, -37.66, 0, 0, 0],
        [1065.1, -3102.9, -39.88, 0, 0, 0],
        [1065.1, -3102.9, -37.66, 0, 0, 0],
        [1067.6, -3102.9, -39.88, 0, 0, 0],
        [1067.6, -3102.9, -37.66, 0, 0, 0],
        [1053.1, -3109.7, -39.88, 1.001779E-05, -5.008956E-06, -179.9985],
        [1053.1, -3109.7, -37.66, 1.001779E-05, -5.008955E-06, -179.9985],
        [1055.5, -3109.7, -39.88, 1.001779E-05, -5.008955E-06, -179.9985],
        [1055.5, -3109.7, -37.66, 1.001779E-05, -5.008955E-06, -179.9985],
        [1057.9, -3109.7, -39.88, 1.001779E-05, -5.008955E-06, -179.9985],
        [1057.9, -3109.7, -37.66, 1.001779E-05, -5.008955E-06, -179.9985],
        [1060.3, -3109.7, -39.88, 1.001779E-05, -5.008955E-06, -179.9985],
        [1060.3, -3109.7, -37.66, 1.001779E-05, -5.008955E-06, -179.9985],
        [1062.7, -3109.7, -39.88, 1.001779E-05, -5.008955E-06, -179.9985],
        [1062.7, -3109.7, -37.66, 1.001779E-05, -5.008955E-06, -179.9985],
        [1065.1, -3109.7, -39.88, 1.001779E-05, -5.008955E-06, -179.9985],
        [1065.1, -3109.7, -37.66, 1.001779E-05, -5.008955E-06, -179.9985],
        [1067.6, -3109.7, -39.88, 1.001779E-05, -5.008955E-06, -179.9985],
        [1067.6, -3109.7, -37.66, 1.001779E-05, -5.008955E-06, -179.9985],
    ],
    [
        [993.4, -3111.302, -39.88, -4.46236E-05, 2.231179E-05, 89.99999],
        [993.4, -3111.302, -37.66, -4.462359E-05, 2.231178E-05, 89.99998],
        [993.4, -3108.9, -39.88, -4.462359E-05, 2.231178E-05, 89.99998],
        [993.4, -3108.9, -37.66, -4.462359E-05, 2.231176E-05, 89.99995],
        [993.4, -3106.5, -39.88, -4.462359E-05, 2.231176E-05, 89.99995],
        [993.4, -3106.5, -37.66, -4.462358E-05, 2.231174E-05, 89.99993],
        [1003.65, -3091.8, -39.88, 0, 0, 0],
        [1003.65, -3091.8, -37.66, 0, 0, 0],
        [1006.05, -3091.8, -39.88, 0, 0, 0],
        [1006.05, -3091.8, -37.66, 0, 0, 0],
        [1008.45, -3091.8, -39.88, 0, 0, 0],
        [1008.45, -3091.8, -37.66, 0, 0, 0],
        [1010.85, -3091.8, -39.88, 0, 0, 0],
        [1010.85, -3091.8, -37.66, 0, 0, 0],
        [1013.25, -3091.8, -39.88, 0, 0, 0],
        [1013.25, -3091.8, -37.66, 0, 0, 0],
        [1015.7, -3091.8, -39.88, 0, 0, 0],
        [1015.7, -3091.8, -37.66, 0, 0, 0],
        [1018.15, -3091.8, -39.88, 0, 0, 0],
        [1018.15, -3091.8, -37.66, 0, 0, 0],
        [1003.65, -3096.7, -39.88, 5.008956E-06, -5.008956E-06, -180],
        [1003.65, -3096.7, -37.66, 5.008956E-06, -5.008956E-06, -180],
        [1006.05, -3096.7, -39.88, 5.008956E-06, -5.008956E-06, -180],
        [1006.05, -3096.7, -37.66, 5.008956E-06, -5.008956E-06, -180],
        [1008.45, -3096.7, -39.88, 5.008956E-06, -5.008956E-06, -180],
        [1008.45, -3096.7, -37.66, 5.008956E-06, -5.008956E-06, -180],
        [1010.85, -3096.7, -39.88, 5.008956E-06, -5.008956E-06, -180],
        [1010.85, -3096.7, -37.66, 5.008956E-06, -5.008956E-06, -180],
        [1013.25, -3096.7, -39.88, 5.008956E-06, -5.008956E-06, -180],
        [1013.25, -3096.7, -37.66, 5.008956E-06, -5.008956E-06, -180],
        [1015.7, -3096.7, -39.88, 5.008956E-06, -5.008956E-06, -180],
        [1015.7, -3096.7, -37.66, 5.008956E-06, -5.008956E-06, -180],
        [1018.15, -3096.7, -39.88, 5.008956E-06, -5.008956E-06, -180],
        [1018.15, -3096.7, -37.66, 5.008956E-06, -5.008956E-06, -180],
        [1003.65, -3103, -39.88, 0, 0, 0],
        [1003.65, -3103, -37.66, 0, 0, 0],
        [1006.05, -3103, -39.88, 0, 0, 0],
        [1006.05, -3103, -37.66, 0, 0, 0],
        [1008.45, -3103, -39.88, 0, 0, 0],
        [1008.45, -3103, -37.66, 0, 0, 0],
        [1010.85, -3103, -39.88, 0, 0, 0],
        [1010.85, -3103, -37.66, 0, 0, 0],
        [1013.25, -3103, -39.88, 0, 0, 0],
        [1013.25, -3103, -37.66, 0, 0, 0],
        [1015.7, -3103, -39.88, 0, 0, 0],
        [1015.7, -3103, -37.66, 0, 0, 0],
        [1018.15, -3103, -39.88, 0, 0, 0],
        [1018.15, -3103, -37.66, 0, 0, 0],
        [1003.65, -3108.3, -39.88, 5.008956E-06, -5.008956E-06, -180],
        [1003.65, -3108.3, -37.66, 5.008956E-06, -5.008956E-06, -180],
        [1006.05, -3108.3, -39.88, 5.008956E-06, -5.008956E-06, -180],
        [1006.05, -3108.3, -37.66, 5.008956E-06, -5.008956E-06, -180],
        [1008.45, -3108.3, -39.88, 5.008956E-06, -5.008956E-06, -180],
        [1008.45, -3108.3, -37.66, 5.008956E-06, -5.008956E-06, -180],
        [1010.85, -3108.3, -39.88, 5.008956E-06, -5.008956E-06, -180],
        [1010.85, -3108.3, -37.66, 5.008956E-06, -5.008956E-06, -180],
        [1013.25, -3108.3, -39.88, 5.008956E-06, -5.008956E-06, -180],
        [1013.25, -3108.3, -37.66, 5.008956E-06, -5.008956E-06, -180],
        [1015.7, -3108.3, -39.88, 5.008956E-06, -5.008956E-06, -180],
        [1015.7, -3108.3, -37.66, 5.008956E-06, -5.008956E-06, -180],
        [1018.15, -3108.3, -39.88, 5.008956E-06, -5.008956E-06, -180],
        [1018.15, -3108.3, -37.66, 5.008956E-06, -5.008956E-06, -180],
        [1026.7, -3106.5, -39.88, -4.46236E-05, -6.329292E-05, -89.99999],
        [1026.65, -3106.5, -37.66, -4.46236E-05, -6.329291E-05, -89.99998],
        [1026.7, -3108.9, -39.88, -4.46236E-05, -6.329291E-05, -89.99998],
        [1026.7, -3108.9, -37.66, -4.462361E-05, -6.329288E-05, -89.99995],
        [1026.7, -3111.3, -39.88, -4.462361E-05, -6.329288E-05, -89.99995],
        [1026.7, -3111.3, -37.66, -4.462361E-05, -6.329285E-05, -89.99993],
        [1026.7, -3096.4, -39.88, -4.46236E-05, -6.329291E-05, -89.99998],
        [1026.7, -3096.4, -37.65501, -4.462361E-05, -6.329288E-05, -89.99995],
        [1026.7, -3094, -39.88, -4.462361E-05, -6.329288E-05, -89.99995],
        [1026.7, -3094, -37.66, -4.462361E-05, -6.329285E-05, -89.99993],
        [1026.7, -3091.6, -39.88, -4.462361E-05, -6.329285E-05, -89.99993],
        [1026.7, -3091.6, -37.66, -4.462362E-05, -6.329282E-05, -89.99989],
    ]
];

stocks.loadAll = function() {
    methods.debug('stocks.loadAll');

    mysql.executeQuery(`SELECT * FROM stocks`, function (err, rows, fields) {
        rows.forEach(function(item) {

            stocks.set(item['id'], 'id', item['id']);
            stocks.set(item['id'], 'number', item['number']);
            stocks.set(item['id'], 'address', item['address']);
            stocks.set(item['id'], 'street', item['street']);
            stocks.set(item['id'], 'price', item['price']);
            stocks.set(item['id'], 'user_id', item['user_id']);
            stocks.set(item['id'], 'user_name', item['user_name']);
            stocks.set(item['id'], 'pin', item['pin']);
            stocks.set(item['id'], 'pin1', item['pin1']);
            stocks.set(item['id'], 'pin2', item['pin2']);
            stocks.set(item['id'], 'pin3', item['pin3']);
            stocks.set(item['id'], 'interior', item['interior']);
            stocks.set(item['id'], 'x', item['x']);
            stocks.set(item['id'], 'y', item['y']);
            stocks.set(item['id'], 'z', item['z']);
            stocks.set(item['id'], 'rot', item['rot']);
            stocks.set(item['id'], 'vx', item['vx']);
            stocks.set(item['id'], 'vy', item['vy']);
            stocks.set(item['id'], 'vz', item['vz']);
            stocks.set(item['id'], 'vrot', item['vrot']);
            stocks.set(item['id'], 'upgrade', item['upgrade']);
            stocks.set(item['id'], 'tax_money', item['tax_money']);
            stocks.set(item['id'], 'tax_score', item['tax_score']);

            let hBlip = {
                pos: new mp.Vector3(parseFloat(item['x']), parseFloat(item['y']), parseFloat(item['z'])),
                vPos: new mp.Vector3(parseFloat(item['vx']), parseFloat(item['vy']), parseFloat(item['vz']))
            };
            methods.createCp(hBlip.pos.x, hBlip.pos.y, hBlip.pos.z, "Нажмите ~g~Е~s~ чтобы открыть меню");

            stocks.loadUpgrades(item['upgrade'], item['id'], item['interior']);

            stockList.set(item['id'], hBlip);
        });
        count = rows.length;
        methods.debug('All stocks Loaded: ' + count);
    });

    stocks.interiorList.forEach(function(item) {
        let x = item[0];
        let y = item[1];
        let z = item[2];
        methods.createCp(x, y, z, "Нажмите ~g~Е~s~ чтобы открыть меню");
    });

    stocks.pcList.forEach(function(item) {
        let x = item[0];
        let y = item[1];
        let z = item[2];
        methods.createCp(x, y, z, "Нажмите ~g~Е~s~ чтобы открыть меню");
    });
};


stocks.loadLast = function() {
    methods.debug('stocks.loadLast');

    mysql.executeQuery(`SELECT * FROM stocks ORDER BY id DESC LIMIT 1`, function (err, rows, fields) {

        rows.forEach(function(item) {

            stocks.set(item['id'], 'id', item['id']);
            stocks.set(item['id'], 'number', item['number']);
            stocks.set(item['id'], 'address', item['address']);
            stocks.set(item['id'], 'street', item['street']);
            stocks.set(item['id'], 'price', item['price']);
            stocks.set(item['id'], 'user_id', item['user_id']);
            stocks.set(item['id'], 'user_name', item['user_name']);
            stocks.set(item['id'], 'pin', item['user_name']);
            stocks.set(item['id'], 'pin1', item['pin1']);
            stocks.set(item['id'], 'pin2', item['pin2']);
            stocks.set(item['id'], 'pin3', item['pin3']);
            stocks.set(item['id'], 'interior', item['interior']);
            stocks.set(item['id'], 'x', item['x']);
            stocks.set(item['id'], 'y', item['y']);
            stocks.set(item['id'], 'z', item['z']);
            stocks.set(item['id'], 'rot', item['rot']);
            stocks.set(item['id'], 'vx', item['vx']);
            stocks.set(item['id'], 'vy', item['vy']);
            stocks.set(item['id'], 'vz', item['vz']);
            stocks.set(item['id'], 'vrot', item['vrot']);
            stocks.set(item['id'], 'upgrade', item['upgrade']);
            stocks.set(item['id'], 'tax_money', item['tax_money']);
            stocks.set(item['id'], 'tax_score', item['tax_score']);

            let hBlip = {
                pos: new mp.Vector3(parseFloat(item['x']), parseFloat(item['y']), parseFloat(item['z'])),
                vPos: new mp.Vector3(parseFloat(item['vx']), parseFloat(item['vy']), parseFloat(item['vz']))
            };

            methods.createCp(hBlip.pos.x, hBlip.pos.y, hBlip.pos.z, "Нажмите ~g~Е~s~ чтобы открыть меню");
            chat.sendToAll(`Склад добавлен. ID: ${item['id']}. Name: ${item['number']}. Int: ${item['interior']}. Price: ${methods.moneyFormat(item['price'])}`);

            mp.players.forEach(p => {
                methods.updateCheckpointList(p);
            });

            stockList.set(item['id'], hBlip);
        });
        count = rows.length;
        methods.debug(`Last House Loaded`);
    });
};

stocks.insert = function(player, number, street, zone, x, y, z, rot, interior, price) {
    methods.debug('stocks.insert');

    mysql.executeQuery(`INSERT INTO stocks (number, street, address, rot, x, y, z, interior, price) VALUES ('${number}', '${street}', '${zone}', '${rot}', '${x}', '${y}', '${z - 1}', '${interior}', '${price}')`);
    setTimeout(stocks.loadLast, 1000);
};

stocks.insert2 = function(player, id, vx, vy, vz, vrot) {
    methods.debug('stocks.insert2');

    stocks.set(id, 'vx', vx);
    stocks.set(id, 'vy', vy);
    stocks.set(id, 'vz', vz);
    stocks.set(id, 'vrot', vrot);

    mysql.executeQuery(`UPDATE stocks SET vrot = '${vrot}', vx = '${vx}', vy = '${vy}', vz = '${vz}' where id = '${id}'`);

    player.notify('~g~Склад успешно обновлен')
};

stocks.getData = function(id) {
    return Container.Data.GetAll(enums.offsets.stock + methods.parseInt(id));
};

stocks.get = function(id, key) {
    return Container.Data.Get(enums.offsets.stock + methods.parseInt(id), key);
};

stocks.set = function(id, key, val) {
    Container.Data.Set(enums.offsets.stock + methods.parseInt(id), key, val);
};

stocks.cargoUnload = function(player, bid = 1) {
    if (!user.isLogin(player))
        return;
    let veh = player.vehicle;
    if (!vehicles.exists(player.vehicle))
        return;

    bid = methods.parseInt(bid);

    if (veh.getVariable('box' + bid) === undefined || veh.getVariable('box' + bid) === null) {
        player.notify('~r~Транспорт пуст');
        return;
    }

    if (player.dimension >= enums.offsets.stock && player.dimension < enums.offsets.stock + 100000) {
        let id = player.dimension - enums.offsets.stock;
        let upgradeStr = stocks.get(id, 'upgrade');
        let upgrade = upgradeStr.split('_');

        let countLoad = 0;

        upgrade.forEach((item, i) => {
            if (item == -1 && countLoad == 0) {
                upgrade[i] = veh.getVariable('box' + bid);
                veh.setVariable('box' + bid, undefined);
                countLoad++;
            }
        });

        let upgradeNew = '';
        upgrade.forEach(item => {
            upgradeNew += item + '_';
        });
        upgradeNew = upgradeNew.substring(0, upgradeNew.length - 1);

        if (
            (veh.getVariable('box1') === undefined || veh.getVariable('box1') === null) &&
            (veh.getVariable('box2') === undefined || veh.getVariable('box2') === null) &&
            (veh.getVariable('box3') === undefined || veh.getVariable('box3') === null)
        ) {
            veh.setVariable('cargoId', undefined);
        }

        stocks.set(id, 'upgrade', upgradeNew);
        mysql.executeQuery(`UPDATE stocks SET upgrade = '${upgradeNew}' where id = '${id}'`);
        stocks.loadUpgrades(upgradeNew, id, stocks.get(id, 'interior'));

        if (countLoad > 0)
            player.notify(`~g~Вы разгрузили ящик`);
        else
            player.notify(`~r~На складе нет места`);
    }
    else {
        player.notify('~r~Необходимо находиться на складе');
    }
};

stocks.sellBySlot = function (player, slot) {
    methods.debug('stocks.sell');
    if (!user.isLogin(player))
        return;

    if (user.get(player, 'stock_id') == 0) {
        player.notify('~r~У Вас нет склада');
        return;
    }

    let hInfo = stocks.getData(user.get(player, 'stock_id'));

    if (hInfo.get('user_id') != user.get(player, 'id')) {
        player.notify('~r~Этот склад вам не пренадлежит');
        return;
    }

    let id = hInfo.get('id');

    let upgradeStr = stocks.get(id, 'upgrade');
    let upgrade = upgradeStr.split('_');
    let box = methods.parseInt(upgrade[slot]);
    let boxPrice = stocks.boxList[box][5] / 1000;

    if (stocks.boxList[box][7] < 0)
        boxPrice = stocks.boxList[box][5] / 4;

    upgrade[slot] = -1;

    let upgradeNew = '';
    upgrade.forEach(item => {
        upgradeNew += item + '_';
    });
    upgradeNew = upgradeNew.substring(0, upgradeNew.length - 1);

    stocks.set(id, 'upgrade', upgradeNew);
    mysql.executeQuery(`UPDATE stocks SET upgrade = '${upgradeNew}' where id = '${id}'`);
    mysql.executeQuery(`DELETE FROM items WHERE owner_id = ${id + enums.offsets.stock} AND owner_type = ${slot + inventory.types.UserStock}`);

    stocks.loadUpgrades(upgradeNew, id, stocks.get(id, 'interior'));

    if (stocks.boxList[box][7] < 0) {
        user.addMoney(player, boxPrice, 'Продажа ' + stocks.boxList[box][0]);
        player.notify(`~g~Вы продали ${stocks.boxList[box][0]}. Деньги были зачислены на ваш кошелёк`);
    }
    else {
        if (user.get(player, 'fraction_id2') > 0) {
            user.addCryptoMoney(player, boxPrice / 2, 'Продажа ' + stocks.boxList[box][0]);
            fraction.addMoney(user.get(player, 'fraction_id2'), boxPrice / 2, 'Продажа груза от ' + user.getRpName(player));
            player.notify(`~g~Вы продали ${stocks.boxList[box][0]}. Деньги были зачислены на ваш E-Coin кошелёк. 50% зачислено в общак организации`);
        }
        else {
            user.addCryptoMoney(player, boxPrice, 'Продажа ' + stocks.boxList[box][0]);
            player.notify(`~g~Вы продали ${stocks.boxList[box][0]}. Деньги были зачислены на ваш E-Coin кошелёк`);
        }
    }
};

stocks.sellAllByClass = function (player, className, price) {
    methods.debug('stocks.sell');
    if (!user.isLogin(player))
        return;

    if (user.get(player, 'stock_id') == 0) {
        player.notify('~r~У Вас нет склада');
        return;
    }

    let hInfo = stocks.getData(user.get(player, 'stock_id'));

    if (hInfo.get('user_id') != user.get(player, 'id')) {
        player.notify('~r~Этот склад вам не пренадлежит');
        return;
    }

    let id = hInfo.get('id');
    let upgradeStr = stocks.get(id, 'upgrade');
    let upgrade = upgradeStr.split('_');
    let upgradeNew = '';

    upgrade.forEach(item => {
        if (methods.parseInt(item) >= 0 && stocks.boxList[methods.parseInt(item)][6] == className)
            upgradeNew += '-1_';
        else
            upgradeNew += item + '_';
    });
    upgradeNew = upgradeNew.substring(0, upgradeNew.length - 1);

    stocks.set(id, 'upgrade', upgradeNew);
    mysql.executeQuery(`UPDATE stocks SET upgrade = '${upgradeNew}' where id = '${id}'`);

    stocks.loadUpgrades(upgradeNew, id, stocks.get(id, 'interior'));

    if (user.get(player, 'fraction_id2') > 0) {
        user.addCryptoMoney(player, price / 2, 'Продажа ' + className);
        fraction.addMoney(user.get(player, 'fraction_id2'), price / 2, 'Продажа груза от ' + user.getRpName(player));
        player.notify(`~g~Вы продали ${className}. Деньги были зачислены на ваш E-Coin кошелёк. 50% зачислено в общак организации`);
    }
    else {
        user.addCryptoMoney(player, price, 'Продажа ' + className);
        player.notify(`~g~Вы продали ${className}. Деньги были зачислены на ваш E-Coin кошелёк`);
    }
};

stocks.upgradeAdd = function(player, id, slot, boxId) {
    if (!user.isLogin(player))
        return;
    let boxPrice = stocks.boxList[boxId][5];

    if (boxPrice > user.getBankMoney(player)) {
        player.notify('~r~На вашем счету не достаточно средств');
        return;
    }

    let upgradeStr = stocks.get(id, 'upgrade');
    let upgrade = upgradeStr.split('_');
    upgrade[slot] = boxId;

    let upgradeNew = '';

    upgrade.forEach(item => {
        upgradeNew += item + '_';
    });

    upgradeNew = upgradeNew.substring(0, upgradeNew.length - 1);

    stocks.set(id, 'upgrade', upgradeNew);
    mysql.executeQuery(`UPDATE stocks SET upgrade = '${upgradeNew}' where id = '${id}'`);

    coffer.addMoney(1, boxPrice);
    user.removeBankMoney(player, boxPrice, 'Покупка ящика на склад');

    stocks.addObject(boxId, slot, id, stocks.get(id, 'interior'));

    player.notify('~g~Поздравляем с покупкой');
};

stocks.upgradeResetAll = function(id) {

    let upgradeStr = stocks.get(id, 'upgrade');
    let upgrade = upgradeStr.split('_');
    let upgradeNew = '';
    upgrade.forEach(item => {
        upgradeNew += '-1_';
    });
    upgradeNew = upgradeNew.substring(0, upgradeNew.length - 1);

    stocks.set(id, 'upgrade', upgradeNew);

    mysql.executeQuery(`UPDATE stocks SET upgrade = '${upgradeNew}' where id = '${id}'`);
    mysql.executeQuery(`DELETE FROM items WHERE owner_id = ${id + enums.offsets.stock}`);

    stocks.loadUpgrades(upgradeNew, id, stocks.get(id, 'interior'));
};

stocks.loadUpgrades = function(upgradeString, id, interior) {

    mp.objects.forEachInDimension(id + enums.offsets.stock, o => {
        try {
            o.destroy();
        }
        catch (e) {
            methods.debug(e);
        }
    });

    upgradeString.split('_').forEach((boxId, slot) => {

        boxId = methods.parseInt(boxId);

        if (boxId == -1)
            return;

        stocks.addObject(boxId, slot, id, interior);
    });
};

stocks.addObject = function(boxId, slot, id, interior) {
    let int = interior;
    let box = stocks.boxList[boxId];
    let boxPos = new mp.Vector3(stocks.boxPosList[int][slot][0], stocks.boxPosList[int][slot][1], stocks.boxPosList[int][slot][2] + box[3]);
    let boxRot = new mp.Vector3(stocks.boxPosList[int][slot][3], stocks.boxPosList[int][slot][4], stocks.boxPosList[int][slot][5]);

    let obj = mp.objects.new(box[1], boxPos,
        {
            rotation: boxRot,
            alpha: 255,
            dimension: id + enums.offsets.stock
        });

    if (box[4] === true) {
        obj.setVariable('stockId', slot + inventory.types.UserStock);
        Container.Data.Set(id + enums.offsets.stock, "invAmountMax:" + (slot + inventory.types.UserStock), box[2]);
    }
};

stocks.getAll = function() {
    methods.debug('stocks.getAll');
    return stockList;
};

stocks.updateOwnerInfo = function (id, userId, userName) {
    methods.debug('stocks.updateOwnerInfo');
    id = methods.parseInt(id);
    userId = methods.parseInt(userId);

    stocks.set(id, "user_name", userName);
    stocks.set(id, "user_id", userId);

    if (userId == 0) {
        stocks.updatePin(id, 1);
        stocks.updatePin1(id, 1);
        stocks.updatePin2(id, 1);
        stocks.updatePin3(id, 1);
    }

    mysql.executeQuery("UPDATE stocks SET user_name = '" + userName + "', user_id = '" + userId + "', tax_money = '0' where id = '" + id + "'");
};

stocks.updatePin = function (id, pin) {
    methods.debug('stocks.updatePin');
    id = methods.parseInt(id);
    pin = methods.parseInt(pin);
    stocks.set(id, 'pin', pin);
    mysql.executeQuery("UPDATE stocks SET pin = '" + pin + "' where id = '" + id + "'");
};

stocks.updatePin1 = function (id, pin) {
    methods.debug('stocks.updatePin');
    id = methods.parseInt(id);
    pin = methods.parseInt(pin);
    stocks.set(id, 'pin1', pin);
    mysql.executeQuery("UPDATE stocks SET pin1 = '" + pin + "' where id = '" + id + "'");
};

stocks.updatePin2 = function (id, pin) {
    methods.debug('stocks.updatePin');
    id = methods.parseInt(id);
    pin = methods.parseInt(pin);
    stocks.set(id, 'pin2', pin);
    mysql.executeQuery("UPDATE stocks SET pin2 = '" + pin + "' where id = '" + id + "'");
};

stocks.updatePin3 = function (id, pin) {
    methods.debug('stocks.updatePin');
    id = methods.parseInt(id);
    pin = methods.parseInt(pin);
    stocks.set(id, 'pin3', pin);
    mysql.executeQuery("UPDATE stocks SET pin3 = '" + pin + "' where id = '" + id + "'");
};

stocks.sell = function (player) {
    methods.debug('stocks.sell');
    if (!user.isLogin(player))
        return;

    if (user.get(player, 'stock_id') == 0) {
        player.notify('~r~У Вас нет склада');
        return;
    }

    let hInfo = stocks.getData(user.get(player, 'stock_id'));

    if (hInfo.get('user_id') != user.get(player, 'id')) {
        player.notify('~r~Этот склад вам не пренадлежит');
        return;
    }

    let nalog = methods.parseInt(hInfo.get('price') * (100 - coffer.getTaxIntermediate()) / 100);

    user.set(player, 'stock_id', 0);

    stocks.updateOwnerInfo(hInfo.get('id'), 0, '');
    stocks.upgradeResetAll(hInfo.get('id'));

    coffer.removeMoney(1, nalog);
    user.addMoney(player, nalog, 'Продажа склада ' + hInfo.get('address') + ' №' + hInfo.get('number'));

    setTimeout(function () {
        if (!user.isLogin(player))
            return;
        user.addHistory(player, 3, 'Продал склад ' + hInfo.get('address') + ' №' + hInfo.get('number') + '. Цена: ' + methods.moneyFormat(nalog));
        player.notify(`~g~Вы продали недвижимость\nНалог:~s~ ${coffer.getTaxIntermediate()}%\n~g~Получено:~s~ ${methods.moneyFormat(nalog)}`);
        user.save(player);
    }, 1000);
};

stocks.buy = function (player, id) {
    methods.debug('stocks.buy');

    if (!user.isLogin(player))
        return;

    let hInfo = stocks.getData(id);
    if (user.get(player, 'stock_id') > 0) {
        player.notify('~r~У Вас есть недвижимость');
        return false;
    }
    if (hInfo.get('price') > user.getMoney(player)) {
        player.notify('~r~У Вас не хватает средств');
        return false;
    }
    if (hInfo.get('user_id') > 0) {
        player.notify('~r~Недвижимость уже куплена');
        return false;
    }

    user.set(player, 'stock_id', id);

    stocks.updateOwnerInfo(id, user.get(player, 'id'), user.get(player, 'name'));

    coffer.addMoney(1, hInfo.get('price'));
    user.removeMoney(player, hInfo.get('price'), 'Покупка склада ' + hInfo.get('address') + ' №' + hInfo.get('number'));
    setTimeout(function () {
        if (!user.isLogin(player))
            return;
        user.addHistory(player, 3, 'Купил склад ' + hInfo.get('address') + ' №' + hInfo.get('number') + '. Цена: ' + methods.moneyFormat(hInfo.get('price')));
        user.save(player);
        player.notify('~g~Поздравляем с покупкой недвижимости!');
    }, 500);
    return true;
};

stocks.enter = function (player, id) {
    methods.debug('stocks.enter', id);

    if (!user.isLogin(player))
        return;
    id = methods.parseInt(id);

    let hInfo = stocks.getData(id);
    player.dimension = id + enums.offsets.stock;
    let intId = hInfo.get('interior');
    user.teleport(player, stocks.interiorList[intId][0], stocks.interiorList[intId][1], stocks.interiorList[intId][2] + 1, stocks.interiorList[intId][3]);
};

stocks.enterv = function (player, id) {
    methods.debug('stocks.enter', id);

    if (!user.isLogin(player))
        return;

    if (vehicles.exists(player.vehicle)) {
        let vInfo = methods.getVehicleInfo(player.vehicle.model);
        if (vInfo.class_name == 'Planes' ||
            vInfo.class_name == 'Boats' ||
            vInfo.class_name == 'Helicopters' ||
            vInfo.class_name == 'Emergency' ||
            vInfo.class_name == 'Commercials' ||
            vInfo.class_name == 'Service' ||
            vInfo.class_name == 'Industrial' ||
            vInfo.class_name == 'Military')
        {
            player.notify('~r~Данному классу авто запрещено заезжать в гараж');
            return;
        }
    }

    let hInfo = stocks.getData(id);
    let intId = hInfo.get('interior');
    id = methods.parseInt(id);

    let pos = new mp.Vector3(stocks.interiorList[intId][4], stocks.interiorList[intId][5], stocks.interiorList[intId][6]);
    let v = methods.getNearestVehicleWithCoords(pos, 4, id + enums.offsets.stock);

    if (vehicles.exists(v) && player.vehicle) {
        player.notify('~r~К сожалению, сейчас у ворот уже стоит транспорт, необходимо чтобы он отъехал');
        return;
    }

    player.dimension = id + enums.offsets.stock;
    if (vehicles.exists(player.vehicle))
        player.vehicle.dimension = id + enums.offsets.stock;
    user.teleportVeh(player, stocks.interiorList[intId][4], stocks.interiorList[intId][5], stocks.interiorList[intId][6], stocks.interiorList[intId][7]);
};