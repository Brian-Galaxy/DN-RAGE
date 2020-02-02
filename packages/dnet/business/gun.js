let methods = require('../modules/methods');

let business = require('../property/business');

let user = require('../user');
let items = require('../items');
let inventory = require('../inventory');
let weapons = require('../weapons');

let gun = exports;

gun.list = [
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
    [-330.36,6083.885,30.45477,81],
];

gun.loadAll = function() {
    methods.debug('gun.loadAll');
    gun.list.forEach(function (item) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2] - 1);
        methods.createBlip(shopPos, 110, 0, 0.8);
        methods.createStaticCheckpoint(shopPos.x, shopPos.y, shopPos.z, "Нажмите ~g~Е~s~ чтобы открыть меню магазина");
    });
};

gun.getInRadius = function(pos, radius = 2) {
    methods.debug('gun.getInRadius');
    let shopId = -1;
    gun.list.forEach(function (item, idx) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(pos, shopPos) < radius)
            shopId = methods.parseInt(item[3]);
    });
    return shopId;
};

gun.checkPosForOpenMenu = function(player) {
    methods.debug('gun.checkPosForOpenMenu');
    try {
        let playerPos = player.position;
        let shopId = gun.getInRadius(playerPos, 2);
        if (shopId == -1)
            return;
        player.call('client:menuList:showGunShopMenu', [shopId, business.getPrice(shopId)]);
    }
    catch (e) {
        methods.debug(e);
    }
};

gun.findNearest = function(pos) {
    methods.debug('gun.findNearest');
    let prevPos = new mp.Vector3(9999, 9999, 9999);
    gun.list.forEach(function (item,) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(shopPos, pos) < methods.distanceToPos(prevPos, pos))
            prevPos = shopPos;
    });
    return prevPos;
};

gun.buy = function(player, itemId, price, count, superTint, tint, shopId) {
    methods.debug('gun.buy');

    if (!user.isLogin(player))
        return;

    if (user.getBankMoney(player) < price) {
        player.notify('~r~У вас недостаточно средств на банковском счету');
        return;
    }

    if (price < 1)
        return;

    let amount = inventory.getInvAmount(player, user.getId(player), 1);
    if (amount + items.getItemAmountById(itemId) > 30000) {
        player.notify('~r~В инвентаре нет места');
        return;
    }

    let serial = weapons.getWeaponSerial(itemId);
    let paramsObject = {
        userName: user.getRpName(player),
        serial: serial,
        superTint: superTint,
        tint: tint,
    };

    if (items.isWeapon(itemId))
        inventory.addItemSql(itemId, 1, 1, user.getId(player), 1, 0, JSON.stringify(paramsObject), 1);
    else
        inventory.addItem(itemId, 1, 1, user.getId(player), -1, 0, `{"userName": "${user.getRpName(player)}"}`, 1);
    player.notify('~g~Вы купили ' + items.getItemNameById(itemId) +  ' по цене: ~s~' + methods.moneyFormat(price));
    user.addHistory(player, 5, `Покупка оружия ${items.getItemNameById(itemId)} (${serial})`);
    user.removeBankMoney(player, price, `Покупка оружия ${items.getItemNameById(itemId)} (${serial})`);
    business.addMoney(shopId, price, items.getItemNameById(itemId));
    inventory.updateAmount(player, user.getId(player), 1);
};