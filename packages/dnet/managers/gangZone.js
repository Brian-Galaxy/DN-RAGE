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
    gangZone.generateLobby();
};


gangZone.currentWeapon = function() {
    return currentWeapon;
};

gangZone.currentLobby = function() {
    let count = 0;
    mp.players.forEach(p => {
        if (user.isLogin(p) && user.has(p, 'gangZoneKills')) {
            count++;
        }
    });
    return count;
};

gangZone.generateLobby = function() {
    methods.debug('gangZone.generateLobby');
    currentZone = 0;
    currentWeapon = weaponList[methods.getRandomInt(0, weaponList.length)];

    mp.players.forEach(p => {
        if (user.isLogin(p) && user.has(p, 'gangZoneKills')) {
            p.removeAllWeapons();
            user.giveWeapon(p, currentWeapon, 9999);

            user.set(p, 'gangZoneKills', 0);
            user.set(p, 'gangZoneDeath', 0);

            user.setHealth(p, 100);

            let spawnIdx = methods.getRandomInt(0, zoneSpawnList[currentZone].length);
            user.teleport(p, zoneSpawnList[currentZone][spawnIdx][0], zoneSpawnList[currentZone][spawnIdx][1], zoneSpawnList[currentZone][spawnIdx][2], zoneSpawnList[currentZone][spawnIdx][3]);

            p.outputChatBoxNew(`[${chat.getTime()}] Запуск нового раунда.`);
        }
    });
};

gangZone.playerToLobby = function(player) {
    methods.debug('gangZone.playerToLobby');
    if (user.isLogin(player)) {
        if (user.has(player, 'uniform')) {
            player.notify('~r~В форме запрещено учавствовать в GangZone');
            return;
        }

        user.blockKeys(player, true);
        player.removeAllWeapons();

        player.dimension = 9999;
        player.setVariable('blockDeath', true);
        user.set(player, 'gangZoneKills', 0);
        user.set(player, 'gangZoneDeath', 0);

        let spawnIdx = methods.getRandomInt(0, zoneSpawnList[currentZone].length);
        user.teleport(player, zoneSpawnList[currentZone][spawnIdx][0], zoneSpawnList[currentZone][spawnIdx][1], zoneSpawnList[currentZone][spawnIdx][2], zoneSpawnList[currentZone][spawnIdx][3]);
        user.giveWeapon(player, currentWeapon, 9999);

        player.outputChatBoxNew(`Кнопка !{2196F3}ESC!{FFFFFF} выйти из лобби`);
    }
};

gangZone.playerExitLobby = function(player) {
    methods.debug('gangZone.playerToLobby');
    if (user.isLogin(player)) {
        if (user.has(player, 'uniform')) {
            player.notify('~r~В форме запрещено учавствовать в GangZone');
            return;
        }

        user.blockKeys(player, false);

        player.removeAllWeapons();
        player.dimension = 0;
        player.setVariable('blockDeath', undefined);
        user.reset(player, 'gangZoneKills');
        user.reset(player, 'gangZoneDeath');

        user.teleport(player, -253.9224, -1993.057, 30.14611);
        user.setHealth(player, 100);
    }
};

mp.events.add("playerDeath", (player, reason, killer) => {

    if (user.isLogin(killer) && user.isLogin(player)) {
        try {
            if (user.has(player, 'gangZoneKills') && user.has(killer, 'gangZoneKills')) {
                let kills = methods.parseInt(user.get(killer, 'gangZoneKills'));
                let killsPlayer = methods.parseInt(user.get(player, 'gangZoneKills'));
                let deaths = methods.parseInt(user.get(player, 'gangZoneDeath'));

                user.set(killer, 'gangZoneKills', ++kills);
                user.set(player, 'gangZoneDeath', ++deaths);

                if (kills >= 25) {
                    gangZone.generateLobby();
                    user.addMoney(killer, 2000, 'Награда за 1 место GangZone');
                    mp.players.forEach(p => {
                        if (user.isLogin(p) && user.has(p, 'gangZoneKills')) {
                            p.outputChatBoxNew(`[${chat.getTime()}] Игрок !{${chat.clBlue}}${user.getRpName(killer)} (${killer.id})!{${chat.clWhite}} сделал 25 убийств, получил приз в $2000.`);
                        }
                    });
                    return;
                }

                player.removeAllWeapons();

                user.setHealth(player, 100);
                let spawnIdx = methods.getRandomInt(0, zoneSpawnList[currentZone].length);
                player.spawn(new mp.Vector3(zoneSpawnList[currentZone][spawnIdx][0], zoneSpawnList[currentZone][spawnIdx][1], zoneSpawnList[currentZone][spawnIdx][2]), zoneSpawnList[currentZone][spawnIdx][3]);

                setTimeout(function () {
                    try {
                        user.giveWeapon(player, currentWeapon, 9999);
                    }
                    catch (e) {}
                }, 250);

                mp.players.forEach(p => {
                    if (user.isLogin(p) && user.has(p, 'gangZoneKills')) {
                        p.outputChatBoxNew(`[${chat.getTime()}] !{${chat.clBlue}}${user.getRpName(killer)} (${killer.id} | ${kills} убийств) !{${chat.clWhite}}убил игрока !{${chat.clBlue}}${user.getRpName(player)} (${player.id} | ${killsPlayer} убийств)`);
                    }
                });
            }
        } catch (e) {
            methods.debug(e);
        }
    }
});