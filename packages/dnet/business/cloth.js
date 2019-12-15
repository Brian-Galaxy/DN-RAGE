let enums = require('../enums');
let methods = require('../modules/methods');
let user = require('../user');
//let business = require('../business');
let shopList = enums.shopList;

let cloth = exports;

cloth.maskShop = new mp.Vector3(-1337.255, -1277.948, 3.872962);

cloth.loadAll = function(){
    methods.debug('barberShop.loadAll');

    methods.createBlip(cloth.maskShop, 437, 0, 0.8, 'Магазин масок');
    methods.createStaticCheckpoint(cloth.maskShop.x, cloth.maskShop.y, cloth.maskShop.z, "Нажмите ~g~E~s~ чтобы открыть меню магазина", 0.8, -1, [33, 150, 243, 100], 0.3);

    try {
        for (var i = 0; i < shopList.length; i++) {
            var pos = new mp.Vector3(shopList[i][3], shopList[i][4], shopList[i][5]);
            var shopId = shopList[i][1];
            var shopType = shopList[i][0];
            var type = shopList[i][2];

            if (type == 0) {
                switch (shopType) {
                    case 0:
                        methods.createBlip(pos, 73, 68, 0.8, 'Discount Store');
                        break;
                    case 1:
                        methods.createBlip(pos, 73, 0, 0.8, 'Suburban');
                        break;
                    case 2:
                        methods.createBlip(pos, 73, 21, 0.8, 'Ponsonbys');
                        break;
                    case 3:
                        methods.createBlip(pos, 73, 73, 0.8, 'AmmoNation');
                        break;
                    case 4:
                        methods.createBlip(pos, 617, 0, 0.8, 'Ювелирный магазин');
                        break;
                    case 5:
                        methods.createBlip(pos, 73, 81, 0.8, 'Binco');
                        break;
                }
            }

            methods.createStaticCheckpoint(pos.x, pos.y, pos.z, "Нажмите ~g~E~s~ чтобы открыть меню магазина", 0.8, -1, [33, 150, 243, 100], 0.3);
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
};

cloth.checkPosForOpenMenu = function (player) {
    methods.debug('barberShop.checkPosForOpenMenu');
    try {
        let playerPos = player.position;

        if (methods.distanceToPos(cloth.maskShop, playerPos) < 2) {
            player.call('client:menuList:showShopMaskMenu', [74]);
            return;
        }

        for (let i = 0; i < shopList.length; i++){
            if(methods.distanceToPos(playerPos, new mp.Vector3(shopList[i][3], shopList[i][4], shopList[i][5])) < 2.0){
                player.call('client:menuList:showShopClothMenu', [shopList[i][1], shopList[i][0], shopList[i][2]]);
                return;
            }
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

cloth.changeProp = function (player, body, clothId, color) {
    methods.debug('barberShop.changeProp');
    try {
        user.setProp(player, body, clothId, color);
    }
    catch (e) {
        methods.debug(e);
    }
};

cloth.buyProp = function (player, price, body, clothId, color, shopId, isFree) {
    methods.debug('barberShop.buyProp');

    if (price < 1)
        return;

    if (!user.isLogin(player))
        return;

    if (user.getCashMoney(player) < price && !isFree) {
        player.notify('~r~У Вас недостаточно денег');
        user.updateCharacterCloth(player);
        return;
    }

    switch (body) {
        case 0:
            user.set(player, 'hat', clothId);
            user.set(player, 'hat_color', color);
            break;
        case 1:
            user.set(player, 'glasses', clothId);
            user.set(player, 'glasses_color', color);
            break;
        case 2:
            user.set(player, 'ear', clothId);
            user.set(player, 'ear_color', color);
            break;
        case 6:
            user.set(player, 'watch', clothId);
            user.set(player, 'watch_color', color);
            break;
        case 7:
            user.set(player, 'bracelet', clothId);
            user.set(player, 'bracelet_color', color);
            break;
    }

    if (!isFree) {
        user.removeCashMoney(player, price);
        //business.addMoney(shopId, price);
        player.notify("~g~Вы купили аксессуар");
    }

    user.updateCharacterCloth(player);
    user.setProp(player, body, clothId, color);
    user.save(player);
};

cloth.change = function (player, body, cloth, color, torso, torsoColor, parachute, parachuteColor) {
    methods.debug('barberShop.change');
    if (body == 11)
    {
        if (torso == -1) torso = 0;
        if (torsoColor == -1) torsoColor = 0;
        if (parachuteColor == -1) parachuteColor = 240;
        if (parachuteColor != 240) parachuteColor++;

        user.setComponentVariation(player, 3, torso, torsoColor);
        user.setComponentVariation(player, 8, parachute, parachuteColor);
    }
    user.setComponentVariation(player, body, cloth, color);
};

cloth.buy = function (player, price, body, cloth, color, torso, torsoColor, parachute, parachuteColor, shopId = 0, isFree = false) {
    methods.debug('barberShop.buy');
    if (!user.isLogin(player))
        return;
    if (user.getCashMoney(player) < price && !isFree) {
        player.notify('~r~У Вас недостаточно денег');
        user.updateCharacterCloth(player);
        return;
    }

    if (price < 1)
        return;

    switch (body) {
        case 1:
            user.set(player, 'mask', cloth);
            user.set(player, 'mask_color', color);
            break;
        case 4:
            user.set(player, 'leg', cloth);
            user.set(player, 'leg_color', color);
            break;
        case 5:
            user.set(player, 'hand', cloth);
            user.set(player, 'hand_color', color);
            break;
        case 6:
            user.set(player, 'foot', cloth);
            user.set(player, 'foot_color', color);
            break;
        case 7:
            user.set(player, 'accessorie', cloth);
            user.set(player, 'accessorie_color', color);
            break;
        case 10:
            user.set(player, 'decal', cloth);
            user.set(player, 'decal_color', color);
            break;
        case 11:

            if (torso == -1) torso = 0;
            if (torsoColor == -1) torsoColor = 0;
            if (parachuteColor == -1) parachuteColor = 240;
            if (parachuteColor != 240) parachuteColor++;

            user.set(player, 'body', cloth);
            user.set(player, 'body_color', color);

            user.set(player, 'torso', torso);
            user.set(player, 'torso_color', torsoColor);
            user.setComponentVariation(player, 3, torso, torsoColor);

            user.set(player, 'parachute', parachute);
            user.set(player, 'parachute_color', parachuteColor);

            user.set(player, 'tprint_c', '');
            user.set(player, 'tprint_o', '');
            user.setComponentVariation(player, 8, parachute, parachuteColor);
            break;
    }

    if (!isFree) {
        user.removeCashMoney(player, price);
        //business.addMoney(shopId, price);
        player.notify("~g~Вы купили одежду");
    }

    user.updateCharacterCloth(player);
    user.setComponentVariation(player, body, cloth, color);
    user.save(player);
};

cloth.changeMask = function (player, clothId, color) {
    methods.debug('barberShop.buy');
    if (!user.isLogin(player))
        return;
    user.setComponentVariation(player, 1, clothId, color);
};

cloth.buyMask = function (player, price, clothId, color, shopId) {
    methods.debug('barberShop.buy');
    if (!user.isLogin(player))
        return;

    if (price > 10) {
        if (user.getCashMoney(player) < price) {
            player.notify('~r~У Вас недостаточно денег');
            user.updateCharacterCloth(player);
            return;
        }
    }

    if (price < 1)
        return;

    user.set(player, 'mask', clothId);
    user.set(player, 'mask_color', color);

    user.updateCharacterCloth(player);
    user.setComponentVariation(player, 1, clothId, color);

    if (shopId == 0)
        return;
    user.removeCashMoney(player, price);
    //business.addMoney(shopId, price);
    player.notify("~g~Вы купили маску");
    user.save(player);
};
