let mysql = require('../modules/mysql');
let methods = require('../modules/methods');
let Container = require('../modules/data');
let chat = require('../modules/chat');

let dispatcher = require('./dispatcher');

let user = require('../user');
let weather = require('./weather');

let fraction = require('../property/fraction');

let gangZone = exports;

let offset = 600000;
let keyPrefix = 'gangWar';

let currentZone = 0;
let currentWeapon = 'weapon_smg';

let weaponList = [
    'weapon_revolver',
    'weapon_revolver_mk2',
    'weapon_smg',
    'weapon_assaultsmg',
    'weapon_pumpshotgun',
    'weapon_assaultrifle',
    'weapon_carbinerifle',
    'weapon_specialcarbine',
    'weapon_bullpuprifle_mk2',
    'weapon_microsmg',
    'weapon_pistol50',
];

let zoneSpawnList = [
    [//0 Остров
        [3632.6337890625, 5012.740234375, 11.423095703125, 223.9619903564453],
        [3635.44677734375, 5014.57373046875, 10.984603881835938, 171.61383056640625],
        [3625.8310546875, 5042.09033203125, 8.594870567321777, 123.89356231689453],
        [3599.772705078125, 5027.4423828125, 7.880293846130371, 191.41265869140625],
        [3629.72119140625, 4951.205078125, 9.459826469421387, 241.476318359375],
        [3654.0654296875, 4917.53955078125, 10.907352447509766, 296.37762451171875],
        [3703.24951171875, 4897.888671875, 14.463912010192871, 14.08867359161377],
        [3721.384033203125, 4909.1455078125, 17.3637752532959, 62.49275588989258],
        [3716.9716796875, 4944.0029296875, 20.982662200927734, 68.47073364257812],
        [3685.0849609375, 4982.10986328125, 15.399456024169922, 76.74676513671875],
    ]
];

gangZone.loadAll = function() {
    methods.debug('gangZone.loadAll');

    setTimeout(function () {
        gangZone.timer();
    }, 10000);
};

gangZone.generateLobby = function() {
    methods.debug('gangZone.generateLobby');
    currentZone = 0;
    currentWeapon = weaponList[methods.getRandomInt(0, weaponList.length)];
};