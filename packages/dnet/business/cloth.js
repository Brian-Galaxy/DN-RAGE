let methods = require('../modules/methods');
let mysql = require('../modules/mysql');

let enums = require('../enums');
let user = require('../user');
let inventory = require('../inventory');

let business = require('../property/business');

let shopList = enums.shopList;

let cloth = exports;

cloth.maskShop = new mp.Vector3(-1337.255, -1277.948, 3.872962);
cloth.printShopPos = new mp.Vector3(-1234.7786865234375, -1477.7230224609375, 3.324739933013916);

cloth.loadAll = function(){
    methods.debug('barberShop.loadAll');

    methods.createBlip(cloth.printShopPos, 72, 0, 0.8, 'Vespucci Print Shop');
    methods.createStaticCheckpointV(cloth.printShopPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, [33, 150, 243, 100]);

    methods.createBlip(cloth.maskShop, 437, 0, 0.8, 'Vespucci Movie Masks');
    methods.createStaticCheckpoint(cloth.maskShop.x, cloth.maskShop.y, cloth.maskShop.z, "Нажмите ~g~E~s~ чтобы открыть меню магазина", 0.8, -1, [33, 150, 243, 100], 0.3);

    try {
        for (var i = 0; i < shopList.length; i++) {
            var pos = new mp.Vector3(shopList[i][3], shopList[i][4], shopList[i][5]);
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
                        methods.createBlip(pos, 617, 0, 0.8, 'Vangelico');
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

        if (methods.distanceToPos(cloth.printShopPos, playerPos) < 2) {
            player.call('client:menuList:showPrintShopMenu');
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

cloth.buyProp = function (player, price, body, clothId, color, itemName, shopId, isFree) {
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

    let params = `{"name": "${itemName}"}`;

    switch (body) {
        case 0:
            inventory.updateItemsEquipByItemId(269, inventory.types.Player, user.getId(player), 0);

            user.set(player, 'hat', clothId);
            user.set(player, 'hat_color', color);

            params = `{"name": "${itemName}", "hat": ${clothId}, "hat_color": ${color}}`;
            inventory.addItem(269, 1, inventory.types.Player, user.getId(player), 1, 1, params, 100);
            break;
        case 1:
            inventory.updateItemsEquipByItemId(270, inventory.types.Player, user.getId(player), 0);

            user.set(player, 'glasses', clothId);
            user.set(player, 'glasses_color', color);

            params = `{"name": "${itemName}", "glasses": ${clothId}, "glasses_color": ${color}}`;
            inventory.addItem(270, 1, inventory.types.Player, user.getId(player), 1, 1, params, 100);
            break;
        case 2:
            inventory.updateItemsEquipByItemId(271, inventory.types.Player, user.getId(player), 0);

            user.set(player, 'ear', clothId);
            user.set(player, 'ear_color', color);

            params = `{"name": "${itemName}", "ear": ${clothId}, "ear_color": ${color}}`;
            inventory.addItem(271, 1, inventory.types.Player, user.getId(player), 1, 1, params, 100);
            break;
        case 6:
            inventory.updateItemsEquipByItemId(272, inventory.types.Player, user.getId(player), 0);

            user.set(player, 'watch', clothId);
            user.set(player, 'watch_color', color);

            params = `{"name": "${itemName}", "watch": ${clothId}, "watch_color": ${color}}`;
            inventory.addItem(272, 1, inventory.types.Player, user.getId(player), 1, 1, params, 100);
            break;
        case 7:
            inventory.updateItemsEquipByItemId(273, inventory.types.Player, user.getId(player), 0);

            user.set(player, 'bracelet', clothId);
            user.set(player, 'bracelet_color', color);

            params = `{"name": "${itemName}", "bracelet": ${clothId}, "bracelet_color": ${color}}`;
            inventory.addItem(273, 1, inventory.types.Player, user.getId(player), 1, 1, params, 100);
            break;
    }

    if (!isFree) {
        user.removeCashMoney(player, price);
        business.addMoney(shopId, price, itemName);
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

cloth.buy = function (player, price, body, cloth, color, torso, torsoColor, parachute, parachuteColor, itemName = "Одежда", shopId = 0, isFree = false) {
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

    let params = `{"name": "${itemName}"}`;

    switch (body) {
        case 1:
            inventory.updateItemsEquipByItemId(274, inventory.types.Player, user.getId(player), 0);

            user.set(player, 'mask', cloth);
            user.set(player, 'mask_color', color);

            params = `{"name": "${itemName}", "mask": ${cloth}, "mask_color": ${color}}`;
            inventory.addItem(274, 1, inventory.types.Player, user.getId(player), 1, 1, params, 100);
            break;
        case 4:
            inventory.updateItemsEquipByItemId(266, inventory.types.Player, user.getId(player), 0);

            user.set(player, 'leg', cloth);
            user.set(player, 'leg_color', color);

            params = `{"name": "${itemName}", "leg": ${cloth}, "leg_color": ${color}}`;
            inventory.addItem(266, 1, inventory.types.Player, user.getId(player), 1, 1, params, 100);
            break;
        case 5:
            user.set(player, 'hand', cloth);
            user.set(player, 'hand_color', color);
            break;
        case 6:
            inventory.updateItemsEquipByItemId(267, inventory.types.Player, user.getId(player), 0);

            user.set(player, 'foot', cloth);
            user.set(player, 'foot_color', color);

            params = `{"name": "${itemName}", "foot": ${cloth}, "foot_color": ${color}}`;
            inventory.addItem(267, 1, inventory.types.Player, user.getId(player), 1, 1, params, 100);
            break;
        case 7:
            inventory.updateItemsEquipByItemId(268, inventory.types.Player, user.getId(player), 0);

            user.set(player, 'accessorie', cloth);
            user.set(player, 'accessorie_color', color);

            params = `{"name": "${itemName}", "accessorie": ${cloth}, "accessorie_color": ${color}}`;
            inventory.addItem(268, 1, inventory.types.Player, user.getId(player), 1, 1, params, 100);
            break;
        case 10:
            user.set(player, 'decal', cloth);
            user.set(player, 'decal_color', color);
            break;
        case 11:

            inventory.updateItemsEquipByItemId(265, inventory.types.Player, user.getId(player), 0);

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

            params = `{"name": "${itemName}", "body": ${cloth}, "body_color": ${color}, "torso": ${torso}, "torso_color": ${torsoColor}, "parachute": ${parachute}, "parachute_color": ${parachuteColor}, "sex": ${user.getSex(player)}, "tprint_c": "", "tprint_o": ""}`;
            inventory.addItem(265, 1, inventory.types.Player, user.getId(player), 1, 1, params, 100);
            break;
    }

    if (!isFree) {
        user.removeCashMoney(player, price);
        business.addMoney(shopId, price, itemName);
        player.notify("~g~Вы купили одежду, она находится в инвентаре");
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

cloth.buyMask = function (player, price, clothId, color, itemName, shopId) {
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
    inventory.updateItemsEquipByItemId(274, inventory.types.Player, user.getId(player), 0);

    user.set(player, 'mask', clothId);
    user.set(player, 'mask_color', color);

    let params = `{"name": "${itemName}", "mask": ${clothId}, "mask_color": ${color}}`;
    inventory.addItem(274, 1, inventory.types.Player, user.getId(player), 1, 1, params, 100);

    user.updateCharacterCloth(player);
    user.setComponentVariation(player, 1, clothId, color);

    if (shopId == 0)
        return;
    user.removeCashMoney(player, price);
    business.addMoney(shopId, price, itemName);
    player.notify("~g~Вы купили маску");
    user.save(player);
};



cloth.buyPrint = function(player, collection, overlay, price) {
    if (!user.isLogin(player))
        return;

    if (user.getMoney(player) < price) {
        player.notify('~r~У вас недостаточно средств');
        return;
    }

    if (price < 1)
        return;

    if (user.get(player, 'tprint_c').toString().trim() != '') {
        player.notify("~r~На данном предмете одежды уже есть принт");
        user.updateTattoo(player);
        return;
    }

    user.set(player, "tprint_c", collection);
    user.set(player, "tprint_o", overlay);

    user.removeMoney(player, price);
    business.addMoney(166, price, 'Покупка принта'); //TODO BUSINESS
    player.notify('~g~Вы купили принт');
    user.updateTattoo(player);

    mysql.executeQuery(`SELECT * FROM items WHERE owner_id = '${user.getId(player)}' AND owner_type = '1' AND item_id = '265' AND is_equip = '1' ORDER BY id DESC`, function (err, rows, fields) {
        rows.forEach(row => {
            try {
                let params = JSON.parse(row['params']);
                params.tprint_c = collection;
                params.tprint_o = overlay;
                inventory.updateItemParams(row['id'], JSON.stringify(params));
            }
            catch (e) {
                methods.debug(e);
            }
        });
    });
};