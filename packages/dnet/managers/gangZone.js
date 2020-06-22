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
    'weapon_heavyshotgun',
    'weapon_combatmg',
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
    ],
    [
        [ 2427.152099609375, 3110.67041015625, 47.15301513671875, 98.4925308227539],
        [ 2426.835205078125, 3131.208251953125, 47.181983947753906, 167.1840362548828],
        [ 2414.480712890625, 3146.473876953125, 47.193199157714844, 94.44409942626953],
        [ 2389.2392578125, 3120.97802734375, 47.152000427246094, 214.26109313964844],
        [ 2379.38720703125, 3081.776611328125, 47.17055130004883, 132.4349365234375],
        [ 2360.689697265625, 3078.037109375, 47.16596603393555, 115.87916564941406],
        [ 2348.315185546875, 3071.120361328125, 47.15211486816406, 203.13723754882812],
        [ 2339.155517578125, 3054.8017578125, 47.1518096923828, 287.39569091796875],
        [ 2337.87744140625, 3038.01708984375, 47.15150451660156, 16.631017684936523],
        [ 2368.045654296875, 3040.664306640625, 47.152339935302734, 270.3035888671875],
        [ 2403.926513671875, 3048.585205078125, 47.15266036987305, 279.0903625488281],
        [ 2419.931396484375, 3054.9794921875, 48.41874313354492, 345.5262451171875],
        [ 2396.488525390625, 3086.73095703125, 47.15293502807617, 116.0244140625],
        [ 2386.903564453125, 3062.121337890625, 47.1516227722168, 183.01036071777344],
    ],
    [
        [-1867.7982177734375, 2935.292236328125, 42.760623931884766, 299.59368896484375],
        [-1848.3358154296875, 2931.048583984375, 43.76063537597656, 330.4020080566406],
        [-1833.2471923828125, 2910.1826171875, 40.34018325805664, 285.19757080078125],
        [-1768.744384765625, 3006.31787109375, 40.34025192260742, 129.33026123046875],
        [-1788.85595703125, 3017.084716796875, 42.76054763793945, 71.9189453125],
        [-1815.9085693359375, 3032.815185546875, 42.76054763793945, 163.80601501464844],
        [-1808.1124267578125, 3016.609619140625, 43.76042175292969, 271.65234375],
        [-1800.1607666015625, 2925.835693359375, 31.810264587402344, 51.596351623535156],
        [-1784.2816162109375, 2950.681884765625, 31.809524536132812, 40.25614547729492],
        [-1781.212646484375, 2996.63232421875, 31.809646606445312, 179.70106506347656],
        [-1828.174560546875, 3016.531005859375, 31.81029510498047, 144.1041259765625],
        [-1864.3516845703125, 2954.367919921875, 31.81027603149414, 247.0128173828125],
        [-1838.6990966796875, 2938.76416015625, 31.810272216796875, 277.123291015625],
        [-1874.414794921875, 2971.619873046875, 31.81027603149414, 251.29006958007812],
    ],
    [
        [-2200.66259765625, 246.93563842773438, 173.6067657470703, 138.58535766601562],
        [-2202.98486328125, 230.54360961914062, 173.6018829345703, 82.03397369384766],
        [-2207.83349609375, 199.5668487548828, 173.60191345214844, 17.519733428955078],
        [-2236.23876953125, 231.6376495361328, 173.53375244140625, 38.281375885009766],
        [-2258.958740234375, 239.20883178710938, 173.60687255859375, 17.525232315063477],
        [-2270.84228515625, 266.4810791015625, 173.601806640625, 12.163178443908691],
        [-2297.106201171875, 334.21087646484375, 173.6016082763672, 238.9437713623047],
        [-2263.933837890625, 346.8292541503906, 173.6019287109375, 214.7461700439453],
        [-2229.00146484375, 351.9124450683594, 173.60206604003906, 195.79522705078125],
        [-2242.729736328125, 318.8744201660156, 173.60206604003906, 177.1116180419922],
        [-2222.56005859375, 291.66668701171875, 173.60182189941406, 177.40040588378906],
    ],
    [
        [-1128.3641357421875, -2748.786376953125, 43.557464599609375, 248.06552124023438],
        [-1100.7904052734375, -2730.157958984375, 43.557491302490234, 290.30694580078125],
        [-1078.7828369140625, -2720.086181640625, 43.5574836730957, 178.321533203125],
        [-1061.61328125, -2739.970703125, 43.557464599609375, 205.40956115722656],
        [-1028.44775390625, -2761.187255859375, 43.55747604370117, 184.22572326660156],
        [-1010.2179565429688, -2796.039794921875, 43.5574836730957, 94.84364318847656],
        [-1028.1590576171875, -2826.321533203125, 43.55757141113281, 85.98986053466797],
        [-1055.134033203125, -2851.876953125, 43.557552337646484, 55.27445983886719],
        [-1068.279052734375, -2833.19482421875, 43.55755615234375, 37.686641693115234],
        [-1103.0186767578125, -2812.308349609375, 43.55760955810547, 354.0993347167969],
        [-1132.19189453125, -2782.06298828125, 43.55748748779297, 316.1202392578125],
        [-1087.6712646484375, -2775.76904296875, 43.55747604370117, 298.5979919433594],
    ],
    [
        [-1183.080078125, -518.0619506835938, 38.530517578125, 3.788926362991333],
        [-1197.9571533203125, -515.3665771484375, 34.580142974853516, 49.79607391357422],
        [-1207.74072265625, -494.80572509765625, 37.78578186035156, 250.08932495117188],
        [-1179.2230224609375, -483.6127624511719, 34.80171203613281, 212.15576171875],
        [-1150.5648193359375, -476.87158203125, 37.37609100341797, 107.83484649658203],
        [-1167.560791015625, -494.0474548339844, 49.733177185058594, 207.45945739746094],
        [-1166.0107421875, -516.1575317382812, 39.63069152832031, 135.95571899414062],
        [-1189.2283935546875, -519.6259765625, 46.42542266845703, 17.86288833618164],
        [-1184.6036376953125, -479.7363586425781, 52.022621154785156, 206.4199676513672],
        [-1200.1195068359375, -488.7393798828125, 52.24734115600586, 192.6725616455078],
        [-1160.3507080078125, -473.1235656738281, 52.15359878540039, 157.48533630371094],
        [-1154.160400390625, -486.4593505859375, 53.207218170166016, 87.89617919921875],
    ],
    [
        [-236.1495819091797, -88.95917510986328, 84.22467041015625, 193.39791870117188],
        [-249.7244415283203, -144.9268798828125, 84.22467041015625, 280.39801025390625],
        [-225.7279815673828, -160.3622283935547, 84.23470306396484, 325.3988952636719],
        [-218.18124389648438, -187.22137451171875, 84.31196594238281, 346.39996337890625],
        [-176.46287536621094, -200.62823486328125, 84.37132263183594, 331.4007873535156],
        [-142.4040069580078, -204.0917205810547, 84.35677337646484, 349.4013977050781],
        [-129.37962341308594, -184.7225799560547, 92.7024154663086, 22.401525497436523],
        [-116.80574035644531, -127.56855010986328, 92.7024154663086, 79.40145874023438],
        [-157.79519653320312, -114.50443267822266, 92.6948471069336, 178.40060424804688],
        [-167.21749877929688, -171.18040466308594, 92.70356750488281, 19.40055274963379],
        [-193.9613037109375, -159.36715698242188, 84.22467041015625, 64.42255401611328],
        [-165.3299560546875, -106.07649230957031, 84.22467041015625, 105.46825408935547],
    ],
    [
        [2151.4580078125, 2909.75439453125, -85.80006408691406, 310.2835693359375],
        [2134.69970703125, 2916.390625, -85.80004119873047, 260.48870849609375],
        [2142.3818359375, 2925.63525390625, -85.79637908935547, 273.1683044433594],
        [2146.9052734375, 2941.34521484375, -85.79998016357422, 267.79345703125],
        [2172.359375, 2938.486083984375, -85.80005645751953, 278.89404296875],
        [2195.0595703125, 2943.082275390625, -85.7999725341796, 277.81005859375],
        [2196.983642578125, 2933.487060546875, -85.80004119873047, 80.66862487792969],
        [2197.694091796875, 2925.496337890625, -85.800048828125, 4.4472126960754395],
        [2197.52099609375, 2916.903076171875, -85.800048828125, 161.6498565673828],
        [2198.124755859375, 2907.650146484375, -85.80004119873047, 112.48866271972656],
        [2194.433349609375, 2898.58544921875, -85.7989730834961, 78.70964813232422],
        [2168.42724609375, 2905.064697265625, -85.80005645751953, 19.530046463012695],
        [2177.927001953125, 2919.322021484375, -82.07524108886719, 149.55462646484375],
        [2167.381591796875, 2923.280029296875, -82.0753402709961, 294.5971984863281],
    ],
    [
        [2111.884033203125, 2937.088134765625, -66.50189971923828, 59.88697814941406],
        [2097.042236328125, 2935.988525390625, -66.50189971923828, 87.1816177368164],
        [2080.67724609375, 2949.4189453125, -66.50202178955078, 82.49281311035156],
        [2054.09423828125, 2958.503173828125, -66.50202178955078, 61.995567321777344],
        [2025.5438232421875, 2980.01220703125, -66.50202178955078, 162.99403381347656],
        [2031.4129638671875, 2971.25830078125, -62.901710510253906, 237.25039672851562],
        [2054.72021484375, 2956.9228515625, -62.90178680419922, 206.45489501953125],
        [2065.9482421875, 2940.027099609375, -66.50202941894531, 9.108366966247559]
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
    currentZone = methods.getRandomInt(0, zoneSpawnList.length);
    currentWeapon = weaponList[methods.getRandomInt(0, weaponList.length)];

    mp.players.forEach(p => {
        if (user.isLogin(p) && user.has(p, 'gangZoneKills')) {
            user.removeAllWeapons(p);
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
        user.unequipAllWeapons(player);

        player.dimension = 99999;
        player.setVariable('blockDeath', true);
        user.set(player, 'gangZoneKills', 0);
        user.set(player, 'gangZoneDeath', 0);

        player.outputChatBoxNew(`Кнопка !{2196F3}ESC!{FFFFFF} выйти из лобби`);

        setTimeout(function () {
            try {
                let spawnIdx = methods.getRandomInt(0, zoneSpawnList[currentZone].length);
                user.teleport(player, zoneSpawnList[currentZone][spawnIdx][0], zoneSpawnList[currentZone][spawnIdx][1], zoneSpawnList[currentZone][spawnIdx][2], zoneSpawnList[currentZone][spawnIdx][3]);
                user.giveWeapon(player, currentWeapon, 9999);
            }
            catch (e) {
                
            }
        }, 1000);
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

        user.removeAllWeapons(player);
        player.dimension = 0;
        player.setVariable('blockDeath', undefined);
        user.reset(player, 'gangZoneKills');
        user.reset(player, 'gangZoneDeath');

        user.teleport(player, -253.9224, -1993.057, 30.14611);
        user.setHealth(player, 100);
    }
};

mp.events.add("playerDeath", (player, reason, killer) => {

    if (user.isLogin(killer) && user.isLogin(player)) { //TODO Самоубийство пофиксить
        try {
            if (user.has(player, 'gangZoneKills') && user.has(killer, 'gangZoneKills')) {
                let kills = methods.parseInt(user.get(killer, 'gangZoneKills'));
                let killsPlayer = methods.parseInt(user.get(player, 'gangZoneKills'));
                let deaths = methods.parseInt(user.get(player, 'gangZoneDeath'));

                user.set(killer, 'gangZoneKills', ++kills);
                user.set(player, 'gangZoneDeath', ++deaths);

                if (killer.health > 99) {
                    user.setHealth(killer, 100);
                    user.setArmour(killer, 25);
                }
                else {
                    user.setHealth(killer, 100);
                }

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

                user.removeAllWeapons(player);

                setTimeout(function () {
                    try {
                        if (user.has(player, 'gangZoneKills')) {
                            user.setHealth(player, 100);
                            let spawnIdx = methods.getRandomInt(0, zoneSpawnList[currentZone].length);
                            player.spawn(new mp.Vector3(zoneSpawnList[currentZone][spawnIdx][0], zoneSpawnList[currentZone][spawnIdx][1], zoneSpawnList[currentZone][spawnIdx][2]), zoneSpawnList[currentZone][spawnIdx][3]);
                        }
                    }
                    catch (e) {
                        
                    }
                }, 3000);

                setTimeout(function () {
                    try {
                        if (user.has(player, 'gangZoneKills'))
                            user.giveWeapon(player, currentWeapon, 9999);
                    }
                    catch (e) {}
                }, 3250);

                mp.players.forEach(p => {
                    if (user.isLogin(p) && user.has(p, 'gangZoneKills')) {
                        if (p.id === killer.id || p.id === player.id)
                            p.outputChatBoxNew(`[${chat.getTime()}] !{${chat.clOrange}}${user.getRpName(killer)} (${killer.id} | ${kills} убийств) !{${chat.clWhite}}убил игрока !{${chat.clOrange}}${user.getRpName(player)} (${player.id} | ${killsPlayer} убийств)`);
                        else
                            p.outputChatBoxNew(`[${chat.getTime()}] !{${chat.clBlue}}${user.getRpName(killer)} (${killer.id} | ${kills} убийств) !{${chat.clWhite}}убил игрока !{${chat.clBlue}}${user.getRpName(player)} (${player.id} | ${killsPlayer} убийств)`);
                    }
                });
            }
        } catch (e) {
            methods.debug(e);
        }
    }
});