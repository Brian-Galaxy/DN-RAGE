let user = require('../user');
let coffer = require('../coffer');

let dispatcher = require('./dispatcher');

let vehicles = require('../property/vehicles');

let methods = require('../modules/methods');

let ems = exports;

let currentIndex = 0;
let currentType = 0;

let rangeLoad = 400;

let emsList = {
    small: [
        {
            title: 'Упал вертолёт',
            desc: 'Срочно, всем сотрудникам EMS, упал вертолет. Координаты у вас в телефоне.',
            moneyToUser: 5000,
            moneyToFraction: 80000,
            pos: new mp.Vector3(-1176.001, -649.4301, 21.94),
            preLoadEffects: () => {

            },
            loadEffects: () => {

            },
            afterLoadEffects: () => {
                mp.players.forEachInRange(new mp.Vector3(-1176.001, -649.4301, 21.94), rangeLoad, p => {
                    user.addExplode(p, -1176.001, -649.4301, 21.94, 34, 30, true, false, 2);
                    user.addExplode(p, -1165.144, -650.7547, 22.0324, 7, 20, true, false, 2);
                    user.addExplode(p, -1180.585, -662.9555, 21.89427, 7, 20, true, false, 2);
                    user.addExplode(p, -1172.509, -655.5266, 22.03426, 7, 20, true, false, 2);
                    user.addExplode(p, -1178.439, -654.4095, 22.05594, 7, 20, true, false, 2);
                    user.addExplode(p, -1163.433, -639.3797, 21.88489, 7, 20, true, false, 2);
                    user.addExplode(p, -1187.77, -653.7637, 21.8, 7, 20, true, false, 2);
                });
            },
            items: [
                [-1903396261, new mp.Vector3(-1176.001, -649.4301, 21.94), new mp.Vector3(0, 0, -10.49961), 1],
                [-204842037, new mp.Vector3(-1191.659, -646.6021, 22.26), new mp.Vector3(-90, 140.9998, 0), 0],
                [674546851, new mp.Vector3(-1168.788, -642.3657, 22.3), new mp.Vector3(85.23646, -89.99992, -85.23643), 0],
                [277255495, new mp.Vector3(-1160.541, -651.6016, 22.05), new mp.Vector3(90, 61.99989, 0), 0],
                [1158698200, new mp.Vector3(-1165.434, -646.7204, 22.15), new mp.Vector3(0, 0, -28.99999), 0],
                [-60739707, new mp.Vector3(-1171.36, -657.34, 22.0198), new mp.Vector3(0, 0, 32), 0],
                [1382419899, new mp.Vector3(-1184.942, -652.383, 22.38), new mp.Vector3(0, -90, -125.9999), 0],
                [454560116, new mp.Vector3(-1171.131, -638.2643, 22.08205), new mp.Vector3(0, 0, -50.99998), 0],
                [211799305, new mp.Vector3(-1172.335, -639.2388, 22.27), new mp.Vector3(-90, 32, 0), 0],
                [986884462, new mp.Vector3(-1165.737, -652.876, 22.03051), new mp.Vector3(-1.621032, -44.05114, -14.07521), 0],
                [-171729071, new mp.Vector3(-1164.497, -638.5907, 21.89336), new mp.Vector3(0, 0, -19.00006), 0],
                [575699050, new mp.Vector3(-1177.192, -641.2123, 22.51), new mp.Vector3(3.201651E-07, 85.26431, -156.4654), 0],
                [1069797899, new mp.Vector3(-1180.585, -662.9555, 21.89427), new mp.Vector3(0, 0, -89.29964), 1],
                [1434516869, new mp.Vector3(-1165.144, -650.7547, 22.0324), new mp.Vector3(0, 0, -15.9998), 1],
                [-896997473, new mp.Vector3(-1178.439, -654.4095, 22.05594), new mp.Vector3(-0.3750217, -4.962665E-06, -127.4989), 1],
                [1898296526, new mp.Vector3(-1187.77, -653.7637, 21.8), new mp.Vector3(1.982317, 8.721725, -150.9427), 1],
                [1069797899, new mp.Vector3(-1172.509, -655.5266, 22.03426), new mp.Vector3(0, 0, 2.00046), 1],
                [-964966892, new mp.Vector3(-1169.943, -648.1124, 22.06966), new mp.Vector3(0, 0, -114.6376), 0],
                [-1208997704, new mp.Vector3(-1171.469, -652.2289, 22.1), new mp.Vector3(0, 0, -54.99997), 0],
                [-944554615, new mp.Vector3(-1178.427, -660.2012, 22.00342), new mp.Vector3(0, 0, -50.99998), 0],
                [-2007573392, new mp.Vector3(-1170.167, -656.5414, 22.02011), new mp.Vector3(0, 0, -6.999939), 0],
                [1167949327, new mp.Vector3(-1171.57, -646.5359, 22.09187), new mp.Vector3(0, 0, 44.99998), 0],
                [-1834013032, new mp.Vector3(-1169.105, -646.4316, 22.07924), new mp.Vector3(0, 0, -45.99998), 0],
                [-831245731, new mp.Vector3(-1191.844, -644.684, 22.27), new mp.Vector3(0, 0, 76.9999), 0],
                [64781110, new mp.Vector3(-1184.26, -654.5731, 22.03894), new mp.Vector3(0, 0, 49.99998), 0],
                [-1157863053, new mp.Vector3(-1169.559, -650.8678, 22.05003), new mp.Vector3(0, 0, -170.0003), 0],
                [211799305, new mp.Vector3(-1175.547, -643.5193, 22.28), new mp.Vector3(-90, 32, 0), 0],
                [211799305, new mp.Vector3(-1166.91, -655.3585, 22.06), new mp.Vector3(-90, -176.0002, 0), 0],
                [211799305, new mp.Vector3(-1183.972, -659.9609, 21.93), new mp.Vector3(-90, 106.9999, 0), 0],
                [-60739707, new mp.Vector3(-1172.208, -648.7537, 22.07593), new mp.Vector3(0, 0, -68.99973), 0],
                [-1208997704, new mp.Vector3(-1162.047, -644.6524, 21.97), new mp.Vector3(0, 0, -24.99994), 0],
                [-896997473, new mp.Vector3(-1163.433, -639.3797, 21.88489), new mp.Vector3(-0.3750219, -4.976006E-06, -160.4987), 1],
                [-204842037, new mp.Vector3(-1170.395, -633.086, 22.12), new mp.Vector3(-90, -163.1006, 0), 0],
                [1382419899, new mp.Vector3(-1171.548, -653.3088, 22.04377), new mp.Vector3(0, 0, -61.69992), 0],
                [-1157863053, new mp.Vector3(-1173.173, -643.0631, 22.13964), new mp.Vector3(0, 0, -100.0002), 0],
                [-1157863053, new mp.Vector3(-1176.528, -634.8152, 22.22204), new mp.Vector3(0, 0, 144.9998), 0],
                [-1157863053, new mp.Vector3(-1179.942, -638.3353, 22.25229), new mp.Vector3(0, 0, -123), 0],
                [-1157863053, new mp.Vector3(-1176.28, -661.7386, 22.01492), new mp.Vector3(0, 0, -32.9999), 0],
                [-1157863053, new mp.Vector3(-1190.951, -650.3972, 22.02991), new mp.Vector3(0, 0, -149.9997), 0],
                [-60739707, new mp.Vector3(-1186.52, -641.2885, 22.26988), new mp.Vector3(0, 0, -72.99996), 0],
                [-964966892, new mp.Vector3(-1174.421, -659.9473, 22.03488), new mp.Vector3(0, 0, 127.3625), 0],
                [-964966892, new mp.Vector3(-1176.504, -637.7213, 22.22719), new mp.Vector3(0, 0, 172.3625), 0],
                [-964966892, new mp.Vector3(-1184.138, -648.7305, 22.13943), new mp.Vector3(0, 0, -92.63741), 0],
                [-964966892, new mp.Vector3(-1182.788, -658.8441, 21.94712), new mp.Vector3(0, 0, 130.3626), 0],
                [64781110, new mp.Vector3(-1174.031, -661.709, 22.03222), new mp.Vector3(0, 0, 84.99993), 0],
                [64781110, new mp.Vector3(-1167.102, -644.8567, 22.07765), new mp.Vector3(0, 0, -1.000124), 0],
                [277255495, new mp.Vector3(-1179.272, -645.2685, 22.27), new mp.Vector3(90, 17.99989, 0), 0],
                [-1208997704, new mp.Vector3(-1176.098, -659.738, 22.08), new mp.Vector3(0, 0, -110.9998), 0],
                [-2007573392, new mp.Vector3(-1178.061, -663.6809, 21.96282), new mp.Vector3(0, 0, 114.9998), 0],
                [-2007573392, new mp.Vector3(-1185.062, -651.515, 22.10277), new mp.Vector3(0, 0, 179.9996), 0],
                [-2007573392, new mp.Vector3(-1181.101, -640.1874, 22.24008), new mp.Vector3(0, 0, 89.99946), 0],
                [-831245731, new mp.Vector3(-1162.045, -648.1243, 21.94), new mp.Vector3(0, 0, 131.9998), 0],
                [-831245731, new mp.Vector3(-1169.611, -644.2955, 22.10818), new mp.Vector3(0, 0, 68.99963), 0],
                [-1834013032, new mp.Vector3(-1174.297, -658.3759, 22.03999), new mp.Vector3(0, 0, -21.99997), 0],
                [-1834013032, new mp.Vector3(-1185.719, -657.9754, 21.8711), new mp.Vector3(0, 0, -109.9998), 0],
                [-1834013032, new mp.Vector3(-1182.325, -638.7817, 22.27113), new mp.Vector3(0, 0, 0.0002827644), 0],
                [674546851, new mp.Vector3(-1183.465, -643.4657, 22.38), new mp.Vector3(85.23757, -89.99982, -148.2362), 0],
                [-171729071, new mp.Vector3(-1179.804, -659.8254, 21.98612), new mp.Vector3(0, 0, 40.99967), 0],
                [-964966892, new mp.Vector3(-1187.127, -651.1334, 22.09482), new mp.Vector3(0, 0, -169.6375), 0],
                [-964966892, new mp.Vector3(-1188.088, -655.5235, 21.88992), new mp.Vector3(0, 0, 86.36206), 0],
                [-60739707, new mp.Vector3(-1189.531, -653.4284, 21.9341), new mp.Vector3(0, 0, -8.999907), 0],
                [-60739707, new mp.Vector3(-1163.78, -650.3329, 22.01964), new mp.Vector3(0, 0, 26.00009), 0],
                [211799305, new mp.Vector3(-1183.745, -640.4877, 22.36), new mp.Vector3(-90, -15.99998, 0), 0],
                [211799305, new mp.Vector3(-1186.375, -653.5737, 22.12), new mp.Vector3(-90, 33.00005, 0), 0],
                [-1208997704, new mp.Vector3(-1188.68, -650.3805, 22.15), new mp.Vector3(0, 0, 3.862381E-05), 0],
                [1158698200, new mp.Vector3(-1183.183, -655.8986, 22.14), new mp.Vector3(0, 0, 3.000018), 0],
                [-944554615, new mp.Vector3(-1169.587, -654.5314, 22.02952), new mp.Vector3(0, 0, 14.00003), 0],
                [-944554615, new mp.Vector3(-1161.239, -641.5299, 21.89598), new mp.Vector3(0, 0, -32.99997), 0],
                [-944554615, new mp.Vector3(-1165.526, -636.918, 21.84776), new mp.Vector3(0, 0, -32.99996), 0],
                [-944554615, new mp.Vector3(-1187.998, -644.6853, 22.22269), new mp.Vector3(0, 0, 32.00003), 0],
                [-944554615, new mp.Vector3(-1180.845, -654.3949, 22.05334), new mp.Vector3(0, 0, 32.00003), 0],
                [-2007573392, new mp.Vector3(-1181.695, -648.9402, 22.12804), new mp.Vector3(0, 0, 174.9993), 0],
                [-2007573392, new mp.Vector3(-1175.178, -661.4128, 22.02439), new mp.Vector3(0, 0, 110.9992), 0],
                [1434516869, new mp.Vector3(-1178.822, -639.9984, 22.22141), new mp.Vector3(0, 0, 109.9998), 1],
            ]
        }
    ]
};

ems.createSmallRandom = function () {

};

ems.createSmallByDay = function () {

};

ems.createSmall = function (id = 0) {
    try {
        currentIndex = id;
        emsList.small[id].items.forEach(item => {
            let obj = mp.objects.new(
                item[0],
                item[1],
                {
                    rotation: item[2],
                    alpha: 255,
                    dimension: 0
                });

            obj.setVariable('emsType', `${item[3]}|${item[0]}`);
        });
        emsList.small[id].afterLoadEffects();

        dispatcher.sendPos(emsList.small[id].title, emsList.small[id].desc, emsList.small[id].pos);
    }
    catch (e) {
        methods.debug(e);
    }
};

ems.removeObject = function (id) {
    try {
        mp.objects.at(id).destroy();

        let count = 0;
        mp.objects.forEach(obj => {
            if (obj.getVariable('emsType') !== undefined && obj.getVariable('emsType') !== null) {
                count++;
            }
        });
        if (count < 1) {
            coffer.addMoney(6, emsList.small[currentIndex].moneyToFraction);

            mp.players.forEach(p => {
                if (user.isEms(p)) {
                    user.addMoney(p, emsList.small[currentIndex].moneyToUser);
                    user.sendSmsBankOperation(p, `Зачисление премии ${methods.moneyFormat(emsList.small[currentIndex].moneyToUser)}`);
                }
            });
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

ems.attachObject = function (player, id) {
    try {
        let obj = mp.objects.at(id);
        let v = methods.getNearestVehicleWithCoords(player.position, 10);
        if (vehicles.exists(v)) {
            let vInfo = methods.getVehicleInfo(v.model);
            if (vInfo.display_name === 'Flatbed') {

                if (v.getVariable('emsTruck')) {
                    player.notify('~r~Транспорт уже загружен');
                    return;
                }

                v.addAttachment(`ems_${obj.getVariable('emsType').split('|')[1]}`, false);
                v.setVariable('emsTruck', obj.getVariable('emsType').split('|')[1]);
                player.notify('~g~Вы совершили погрузку на транспорт');

                ems.removeObject(id);
            }
            else {
                player.notify('~r~Транспорт должен быть именно Flatbed')
            }
        }
        else {
            player.notify('~r~Рядом с вами нет транспорта')
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

ems.vehicleUnload = function (player) {
    try {

        if (!user.isLogin(player))
            return;

        if (methods.distanceToPos(player.position, new mp.Vector3(2406.57275390625, 3106.375732421875, 47.19036102294922)) > 30) {
            player.notify('~g~Разгрузить можно только в специальном месте, маркер был поставлен в GPS');
            user.setWaypoint(player, 2406.57275390625, 3106.375732421875);
            return;
        }

        let v = player.vehicle;
        if (vehicles.exists(v)) {
            v.addAttachment(`ems_${v.getVariable('emsTruck')}`, true);
            v.setVariable('emsTruck', undefined);
            player.notify('~g~Вы разгрузили транспорт. Вам была выдана премия в $1000');
            user.addRep(player, 10);
            user.addMoney(player, 1000, 'Премия EMS');
        }
        else {
            player.notify('~r~Рядом с вами нет транспорта')
        }
    }
    catch (e) {
        methods.debug(e);
    }
};