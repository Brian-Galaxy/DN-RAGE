let methods = require('../modules/methods');
let business = require('../property/business');

let bar = exports;

bar.list = [[127.024,-1284.24,28.28062,49],[-560.0792,287.0196,81.17641,52],[-1394.226,-605.4658,29.31955,53],[988.5745,-96.85889,73.84525,72],[1986.267,3054.349,46.21521,73],[-441.0517883300781, 268.8336181640625, 82.01594543457031,80],[-1587.188,-3012.827,-77.00496,0],[-1578.218,-3014.328,-80.00593,122]];
bar.listFree = [[-2055.519,-1024.646,10.90755], [-1402.890869140625, 6748.33837890625, 10.907529830932617], [-2092.460693359375, -1015.4134521484375, 7.9804534912109375], [945.2969970703125, 17.03707504272461, 115.16423034667969], [-1437.54736328125, 6758.40478515625, 7.9730329513549805], [-1772.515, 448.7928, 126.4369], [-657.7393, 857.7365, 224.1475]];

bar.loadAll = function() {
    methods.debug('bar.loadAll');
    bar.list.forEach(function (item) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        switch (item[3]) {
            case 49:
                methods.createBlip(shopPos, 121, 0, 0.6);
                break;
            case 53:
                methods.createBlip(shopPos, 614, 0, 0.6, 'Клуб');
                break;
            case 80:
                methods.createBlip(shopPos, 102, 0, 0.6, 'Сomedy Сlub');
                break;
            case 122:
                methods.createBlip(new mp.Vector3(4.723007, 220.3487, 106.7251), 614, 0, 0.6, 'Клуб');
                break;
            default:
                if (item[3] != 0)
                    methods.createBlip(shopPos, 93, 0, 0.6);
                break;
        }
        methods.createStaticCheckpoint(shopPos.x, shopPos.y, shopPos.z, "Нажмите ~g~Е~s~ чтобы открыть меню бара");
    });
    bar.listFree.forEach(function (item) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        methods.createStaticCheckpoint(shopPos.x, shopPos.y, shopPos.z, "Нажмите ~g~Е~s~ чтобы открыть меню бара");
    });
};

bar.getInRadius = function(pos, radius = 2) {
    methods.debug('bar.getInRadius');
    let shopId = -1;
    bar.list.forEach(function (item, idx) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(pos, shopPos) < radius)
            shopId = methods.parseInt(item[3]);
    });
    bar.listFree.forEach(function (item, idx) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(pos, shopPos) < radius)
            shopId = 999;
    });
    return shopId;
};

bar.checkPosForOpenMenu = function(player) {
    methods.debug('bar.checkPosForOpenMenu');
    try {
        let playerPos = player.position;
        let shopId = bar.getInRadius(playerPos, 2);
        if (shopId == -1)
            return;
        if (shopId == 999) {
            player.call('client:menuList:showBarFreeMenu');
            return;
        }
        if (!business.isOpen(shopId)) {
            player.notify('~r~К сожалению бар сейчас не работает');
            return;
        }
        player.call('client:menuList:showBarMenu', [shopId, business.getPrice(shopId)]);
    }
    catch (e) {
        methods.debug(e);
    }
};

bar.findNearest = function(pos) {
    methods.debug('shop.findNearest');
    let prevPos = new mp.Vector3(9999, 9999, 9999);
    bar.list.forEach(function (item) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(shopPos, pos) < methods.distanceToPos(prevPos, pos))
            prevPos = shopPos;
    });
    return prevPos;
};