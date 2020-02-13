let methods = require('../modules/methods');

let vSync = require('../managers/vSync');

let user = require('../user');
let enums = require('../enums');

let vehicles = require('../property/vehicles');
let business = require('../property/business');

let rent = exports;

rent.listBike = [
    [-1012.002, -2682.319, 12.98185, 15],
    [56.84695, -1332.3, 28.31281, 16],
    [318.2011, 133.5345, 102.5149, 17],
    [-1440.246, -615.3691, 29.8274, 18],
    [-3239.305, 978.7662, 11.71953, 19],
    [-264.9207, 6285.907, 30.47458, 20],
    [1681.711, 4849.298, 41.10908, 21],
    [1868.006, 3684.482, 32.73838, 22],
    [1932.747, 2624.953, 45.1698, 23],
    [297.4761, -602.786, 42.30347, 24],
    [1128.115, -504.1843, 63.19245, 148],
    [-53.82885, -914.3015, 28.43705, 149],
    [-873.4641, -811.7601, 18.29254, 150],
    [-824.2698, -116.8545, 36.58223, 151],
    [-1205.656, -1553.266, 3.373455, 152],
    [287.8639, 2594.688, 43.43363, 153],
    [387.4266, -948.5322, 28.42553, 157]
];

rent.loadAll = function() {
    methods.debug('rent.loadAll');
    rent.listBike.forEach(function (item) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        methods.createBlip(shopPos, 226, 0, 0.6, 'Bike Rent');
        methods.createStaticCheckpoint(shopPos.x, shopPos.y, shopPos.z, "Нажмите ~g~Е~s~ чтобы открыть меню", 0.8, -1, [33, 150, 243, 100], 0.3);
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

    if (price < 1)
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