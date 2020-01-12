let methods = require('../modules/methods');

let business = require('../property/business');
let vehicles = require('../property/vehicles');

let user = require('../user');
let enums = require('../enums');

let vShop = exports;

vShop.list = [
    [22.08832, -1106.986, 29.79703, 71],
    [252.17,-50.08245,69.94106,72],
    [842.2239,-1033.294,28.19486,73],
    [-661.947,-935.6796,21.82924,74],
    [-1305.899,-394.5485,36.69577,75],
    [809.9118,-2157.209,28.61901,76],
    [2567.651,294.4759,107.7349,77],
    [-3171.98,1087.908,19.83874,78],
    [-1117.679,2698.744,17.55415,79],
    [1693.555,3759.9,33.70533,80],
    [-330.36,6083.885,30.45477,81]
];

vShop.loadAllShop = () => {
    enums.carShopList.forEach(item => {
        if (item.id == 0)
            return;

        let blip = methods.createBlip(new mp.Vector3(item.buyPos[0], item.buyPos[1], item.buyPos[2]), item.blipId, item.blipColor, 0.8, item.name);
        methods.createStaticCheckpoint(blip.position.x, blip.position.y, blip.position.z - 1, "Нажмите ~g~Е~s~ чтобы открыть меню");
    });
};

vShop.loadAllShopVehicles = () => {
    enums.carShopVehicleList.forEach(item => {
        vehicles.spawnCarCb(veh => {
            if (!vehicles.exists(veh))
                return;
            veh.locked = true;
            veh.engine = false;
            veh.setVariable('useless', true);
        }, new mp.Vector3(item[1], item[2], item[3]), item[4], item[0]);
        methods.createStaticCheckpoint(item[1], item[2], item[3], `~b~Название:~s~ ${item[0]}\n~b~Цена: ~g~${methods.moneyFormat(methods.getVehicleInfo(item[0]).price)}`, 5, -1, [0, 0, 0, 0]);
    });
};

vShop.getInRadius = function(pos, radius = 2) {
    methods.debug('gun.getInRadius');
    let shopId = -1;
    enums.carShopList.forEach(function (item, idx) {
        if (item.id == 0)
            return -1;
        let shopPos = new mp.Vector3(item.buyPos[0], item.buyPos[1], item.buyPos[2]);
        if (methods.distanceToPos(pos, shopPos) < radius)
            shopId = item.id;
    });
    return shopId;
};

vShop.checkPosForOpenMenu = function(player) {
    methods.debug('gun.checkPosForOpenMenu');
    try {
        let playerPos = player.position;
        let shopId = vShop.getInRadius(playerPos, 2);
        if (shopId == -1)
            return;
        player.call('client:menuList:showVehShopMenu', [shopId]);
    }
    catch (e) {
        methods.debug(e);
    }
};

vShop.findNearest = function(pos) {
    methods.debug('gun.findNearest');
    let prevPos = new mp.Vector3(9999, 9999, 9999);
    gun.list.forEach(function (item,) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(shopPos, pos) < methods.distanceToPos(prevPos, pos))
            prevPos = shopPos;
    });
    return prevPos;
};

vShop.buy = function(player, itemId, price, count, superTint, tint, shopId) {

};