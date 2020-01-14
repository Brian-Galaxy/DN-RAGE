let methods = require('../modules/methods');
let business = require('../property/business');
let user = require('../user');

let tattoo = exports;

tattoo.list = [[324.2816, 180.2105, 102.5865,94],[1864.066,3746.909,32.03188,95],[-294.0927,6200.76,30.48712,95],[-1155.336,-1427.223,3.954459,96],[1321.756,-1653.431,51.27526,97],[-3169.667,1077.457,19.82918,98]];

tattoo.loadAll = function() {
    methods.debug('tattoo.loadAll');
    tattoo.list.forEach(function (item) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        methods.createBlip(shopPos, 75, 0, 0.8);
        methods.createStaticCheckpoint(shopPos.x, shopPos.y, shopPos.z, "Нажмите ~g~Е~s~ чтобы открыть меню");
    });
};

tattoo.getInRadius = function(pos, radius = 2) {
    methods.debug('tattoo.getInRadius');
    let shopId = -1;
    tattoo.list.forEach(function (item, idx) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(pos, shopPos) < radius)
            shopId = methods.parseInt(item[3]);
    });
    return shopId;
};

tattoo.checkPosForOpenMenu = function(player) {
    methods.debug('tattoo.checkPosForOpenMenu');
    try {
        let playerPos = player.position;
        let shopId = tattoo.getInRadius(playerPos, 2);
        if (shopId == -1)
            return;

        switch (shopId)
        {
            case 94:
                player.call('client:menuList:showTattooShopMenu', ["shopui_title_tattoos", "shopui_title_tattoos", shopId]);
                break;
            case 95:
                player.call('client:menuList:showTattooShopMenu', ["shopui_title_tattoos2", "shopui_title_tattoos2", shopId]);
                break;
            case 96:
                player.call('client:menuList:showTattooShopMenu', ["shopui_title_tattoos3", "shopui_title_tattoos3", shopId]);
                break;
            case 97:
                player.call('client:menuList:showTattooShopMenu', ["shopui_title_tattoos4", "shopui_title_tattoos4", shopId]);
                break;
            case 98:
                player.call('client:menuList:showTattooShopMenu', ["shopui_title_tattoos5", "shopui_title_tattoos5", shopId]);
                break;
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

tattoo.findNearest = function(pos) {
    methods.debug('tattoo.findNearest');
    let prevPos = new mp.Vector3(9999, 9999, 9999);
    tattoo.list.forEach(function (item) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(shopPos, pos) < methods.distanceToPos(prevPos, pos))
            prevPos = shopPos;
    });
    return prevPos;
};

tattoo.buy = function(player, collection, overlay, zone, price, itemName, shopId) {
    if (!user.isLogin(player))
        return;

    if (user.getMoney(player) < price) {
        player.notify('~r~У вас недостаточно средств');
        return;
    }

    if (price < 1)
        return;

    let tattooList = JSON.parse(user.get(player, 'tattoo'));

    if (tattooList == null)
        tattooList = [];

    if (tattooList.length > 20) {
        player.notify('~r~У Вас на теле слишком много тату, для начала надо свести старые');
        user.updateTattoo(player);
        return;
    }

    tattooList.push([collection, overlay, zone]);

    user.set(player, 'tattoo', JSON.stringify(tattooList));

    user.removeMoney(player, price);
    business.addMoney(shopId, price, itemName);
    player.notify('~g~Вы набили татуировку');
    user.updateTattoo(player);
    user.save(player);
};

tattoo.destroy = function(player, collection, overlay, zone, price, itemName, shopId) {
    if (!user.isLogin(player))
        return;

    if (user.getMoney(player) < price) {
        player.notify('~r~У вас недостаточно средств');
        return;
    }

    if (price < 1)
        return;

    let tattooList = JSON.parse(user.get(player, 'tattoo'));
    let newArray = [];

    tattooList.forEach(item => {
        if (collection == item[0] && overlay == item[1])
            return;
        newArray.push(item);
    });

    user.set(player, 'tattoo', JSON.stringify(newArray));

    user.removeMoney(player, price);
    business.addMoney(shopId, price, itemName);
    player.notify('~g~Вы сделали лазерную коррецию');
    user.updateTattoo(player);
    user.save(player);
};