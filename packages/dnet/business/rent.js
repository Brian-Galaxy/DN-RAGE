let methods = require('../modules/methods');

let vSync = require('../managers/vSync');

let user = require('../user');
let enums = require('../enums');

let vehicles = require('../property/vehicles');
let business = require('../property/business');

let rent = exports;

rent.listBike = [
    [-395.6397, -2670.683, 5.000217, 13],
    [103.2589, -1386.775, 28.29154, 14],
    [181.4407, 182.3093, 104.5404, 15],
    [-1406.061, -558.9191, 29.24111, 16],
    [-3153.494, 1098.751, 19.85638, 17],
    [-230.6698, 6319.512, 30.47869, 18],
    [1677.378, 4860.828, 41.05925, 19],
    [1808.164, 3677.082, 33.27679, 20],
    [1854.38, 2595.227, 44.67204, 21],
    [296.0972, -606.8004, 42.32798, 22],
    [1152.985, -456.2723, 65.98437, 23],
    [-73.50899, -635.6747, 35.26548, 24],
    [-674.0029, -852.5342, 23.1682, 25],
    [-733.7565, -230.8252, 36.2501, 26],
    [-1086.097, -1347.1, 4.053262, 27],
    [610.0134, 2743.78, 40.97966, 28],
    [390.0185, -981.3521, 28.42373, 29]
];

rent.loadAll = function() {
    methods.debug('rent.loadAll');
    rent.listBike.forEach(function (item) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        methods.createBlip(shopPos, 226, 0, 0.6, 'Bike Rent');
        methods.createCp(shopPos.x, shopPos.y, shopPos.z, "Нажмите ~g~Е~s~ чтобы открыть меню", 0.8, -1, [33, 150, 243, 100], 0.3);
    });
};

rent.getBikeInRadius = function(pos, radius = 2) {
    methods.debug('rent.getBikeInRadius');
    let shopId = -1;
    rent.listBike.forEach(function (item, idx) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(pos, shopPos) < radius)
            shopId = methods.parseInt(item[3]);
    });
    return shopId;
};

rent.checkPosForOpenMenu = function(player) {
    methods.debug('rent.checkPosForOpenMenu');
    try {
        let playerPos = player.position;
        let shopId = rent.getBikeInRadius(playerPos, 2);
        if (shopId == -1)
            return;
        if (!business.isOpen(shopId)) {
            player.notify('~r~К сожалению аренда сейчас не работает');
            return;
        }
        player.call('client:menuList:showRentBikeMenu', [shopId, business.getPrice(shopId)]);
    }
    catch (e) {
        methods.debug(e);
    }
};

rent.findNearest = function(pos) {
    methods.debug('rent.findNearest');
    let prevPos = new mp.Vector3(9999, 9999, 9999);
    enums.carShopList.forEach(function (item,) {
        let shopPos = new mp.Vector3(item.buyPos[0], item.buyPos[1], item.buyPos[2]);
        if (methods.distanceToPos(shopPos, pos) < methods.distanceToPos(prevPos, pos))
            prevPos = shopPos;
    });
    rent.listBike.forEach(function (item,) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(shopPos, pos) < methods.distanceToPos(prevPos, pos))
            prevPos = shopPos;
    });
    return prevPos;
};

rent.buy = function(player, hash, price, shopId) {
    methods.debug('rent.buy');
    if (!user.isLogin(player))
        return;
    if (user.getMoney(player) < price)
    {
        player.notify('~r~У вас недостаточно средств');
        return;
    }

    if (price < 0)
        return;

    let vInfo = methods.getVehicleInfo(hash);
    let className =  vInfo.class_name;

    switch (className) {
        case 'Planes':
        case 'Helicopters':
            if (!user.get(player, 'air_lic')) {
                player.notify('~r~У Вас нет лицензии на воздушный транспорт');
                return;
            }
            break;
        case 'Boats':
            if (!user.get(player, 'ship_lic')) {
                player.notify('~r~У Вас нет лицензии на водный транспорт');
                return;
            }
            break;
        case 'Commercials':
        case 'Industrial':
            if (!user.get(player, 'c_lic')) {
                player.notify('~r~У Вас нет лицензии категории C');
                return;
            }
            break;
        case 'Compacts':
        case 'Coupes':
        case 'Muscle':
        case 'Off-Road':
        case 'Sedans':
        case 'Sports':
        case 'Sports Classics':
        case 'Super':
        case 'SUVs':
        case 'Utility':
        case 'Vans':
            if (!user.get(player, 'b_lic')) {
                player.notify('~r~У Вас нет лицензии категории B');
                return;
            }
            break;
        case 'Motorcycles':
            if (hash != -1842748181 && !user.get(player, 'a_lic')) {
                player.notify('~r~У Вас нет лицензии категории А');
                return;
            }
            break;
    }

    let countOwnerCars = 0;

    mp.vehicles.forEach(function (v) {
        if (!vehicles.exists(v))
            return;
        if (v.getVariable('rentOwner') == user.getId(player))
            countOwnerCars++;
    });

    if (countOwnerCars > 10) {
        player.notify('~r~Нельзя арендовывать более 10 ТС');
        return;
    }

    user.removeMoney(player, price, 'Аренда ТС ' + vInfo.display_name);
    business.addMoney(shopId, price, 'Аренда ' + vInfo.display_name);
    business.removeMoneyTax(shopId, price / business.getPrice(shopId));

    player.notify('~g~Вы арендовали транспорт');
    player.notify('~g~Для того чтобы его закрыть, нажмите ~s~L');

    vehicles.spawnCarCb(veh => {

        if (!vehicles.exists(veh))
            return;

        veh.numberPlate = ('RENT' + veh.getVariable('vid')).toString().trim();
        veh.setColor(methods.getRandomInt(0, 150), methods.getRandomInt(0, 150));
        vSync.setEngineState(veh, false);
        veh.locked = true;
        veh.setVariable('owner_id', user.getId(player));
        veh.setVariable('rentOwner', user.getId(player));

        if (!user.isLogin(player))
            return;
        player.putIntoVehicle(veh, -1);

    }, player.position, player.heading, hash);
};