let Container = require('./modules/data');
let mysql = require('./modules/mysql');
let methods = require('./modules/methods');
let chat = require('./modules/chat');

let weather = require('./managers/weather');
let vSync = require('./managers/vSync');
//let dispatcher = require('./managers/dispatcher');

let user = require('./user');
let enums = require('./enums');
let items = require('./items');
let weapons = require('./weapons');

let vehicles = require('./property/vehicles');

//let bank = require('./business/bank');
let inventory = exports;
let props = new Map();

inventory.loadAll = function() {

    mysql.executeQuery("DELETE FROM items WHERE owner_type = 0");
    mysql.executeQuery("DELETE FROM items WHERE owner_type = 9 AND owner_id = 2 AND timestamp_update < '" + (methods.getTimeStamp() - (60 * 60 * 24 * 7)) + "'");

    /*mysql.executeQuery(`SELECT * FROM items WHERE owner_type = 0 ORDER BY id DESC`, function (err, rows, fields) {
        rows.forEach(row => {

            let obj = mp.objects.new(items.getItemHashById(row['item_id']), new mp.Vector3(row['pos_x'], row['pos_y'], row['pos_z']),
            {
                rotation: new mp.Vector3(row['rot_x'], row['rot_x'], row['rot_x']),
                alpha: 255,
                dimension: 0
            });

            obj.setVariable('isDrop', row['id']);
            obj.setVariable('itemId', row['item_id']);
            props.set(row['id'].toString(), obj);
        });
    });*/
};

inventory.deleteWorldItems = function() {
    mysql.executeQuery("SELECT * FROM items WHERE owner_type = 0 AND timestamp_update < '" + (methods.getTimeStamp() - (60 * 60)) + "'", function (err, rows, fields) {
        rows.forEach(row => {
            inventory.deleteDropItem(row['id']);
        });
        mysql.executeQuery("DELETE FROM items WHERE owner_type = 0 AND timestamp_update < '" + (methods.getTimeStamp() - (60 * 60)) + "'");
    });
};

inventory.getItemList = function(player, ownerType, ownerId) {

    ownerId = methods.parseInt(ownerId);

    if (!user.isLogin(player))
        return;
    try {

        let data = [];
        //let data2 = new Map();

        let sql = `SELECT * FROM items WHERE owner_id = '${ownerId}' AND owner_type = '${ownerType}' ORDER BY item_id DESC`;
        if (ownerId == 0 && ownerType == 0)
            sql = `SELECT * FROM items WHERE DISTANCE(POINT(pos_x, pos_y), POINT(${player.position.x}, ${player.position.y})) < 2 AND owner_type = 0 ORDER BY item_id DESC`;

        mysql.executeQuery(sql, function (err, rows, fields) {
            rows.forEach(row => {

                let label = "";

                if (row['prefix'] > 0 && row['number'] > 0 && row['key_id'] <= 0) {
                    label = row['prefix'] + "-" + row['number'];
                } else if (row['key_id'] > 0) {

                    if (row['item_id'] >= 265 && row['item_id'] <= 268) {

                        if (row['prefix'] == 1)
                            label = enums.clothF[row['key_id']][9];
                        else
                            label = enums.clothM[row['key_id']][9];
                    }
                    else if (row['item_id'] >= 269 && row['item_id'] <= 273) {
                        if (row['prefix'] == 1)
                            label = enums.propF[row['key_id']][5];
                        else
                            label = enums.propM[row['key_id']][5];
                    }
                    else {
                        label = "#" + row['key_id'];
                    }
                }

                data.push({id: row['id'], label: label, item_id: row['item_id'], count: row['count'], is_equip: row['is_equip'], params: row['params']});
            });

            //id, itemId, ownerType, ownerId, countItems, prefix, number, keyId
            player.call('client:showToPlayerItemListMenu', [data, ownerType, ownerId.toString()]);
        });
    } catch(e) {
        methods.debug(e);
    }
};

inventory.updateEquipStatus = function(id, status) {
    try {
        let newStatus = 0;
        if (status == true)
            newStatus = 1;
        mysql.executeQuery(`UPDATE items SET is_equip = '${newStatus}'  WHERE id = '${methods.parseInt(id)}'`);
    }
    catch (e) {
        methods.debug('inventory.updateEquipStatus', e);
    }
};

inventory.updateItemsEquipByItemId = function(itemId, ownerId, ownerType, equip) {
    try {
        mysql.executeQuery(`UPDATE items SET is_equip = '${equip}' where item_id = '${itemId}' AND owner_type = '${ownerType}' AND owner_id = '${ownerId}'`);
    } catch(e) {
        methods.debug(e);
    }
};

inventory.updateOwnerId = function(id, ownerId, ownerType) {
    try {
        mysql.executeQuery(`UPDATE items SET owner_type = '${ownerType}', owner_id = '${methods.parseInt(ownerId)}' where id = '${id}'`);
    } catch(e) {
        methods.debug(e);
    }
};

inventory.updateItemParams = function(id, params) {
    try {
        mysql.executeQuery(`UPDATE items SET params = '${params}' where id = '${methods.parseInt(id)}'`);
    } catch(e) {
        methods.debug(e);
    }
};

inventory.updateItemCount = function(id, count) {
    try {
        mysql.executeQuery(`UPDATE items SET count = '${count}', timestamp_update = '${methods.getTimeStamp()}' where id = '${id}'`);
    } catch(e) {
        methods.debug(e);
    }
};

inventory.updateAmount = function(player, ownerId, ownerType) { // Фикс хуйни, котороая просто поломала все, заметочка никогда не писать код когда ты очень сильно хочешь спать.

    if (!user.isLogin(player))
        return;
    ownerId = methods.parseInt(ownerId);
    let data = new Map();
    //console.log(ownerId, ownerType, "update <");
    mysql.executeQuery(`SELECT * FROM items WHERE owner_id = '${ownerId}' AND owner_type = '${ownerType}' ORDER BY id DESC`, function (err, rows, fields) {
        rows.forEach(row => {
            data.set(row['id'].toString(), row["item_id"]);
            //console.log(row['id'].toString(), row["item_id"], "< rows");
        });
        //console.log(data, ownerId, ownerType, "< data");
        try {
            player.call('client:sendToPlayerItemListUpdateAmountMenu', [Array.from(data), ownerType, ownerId]);
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

inventory.dropItem = function(player, id, itemId, posX, posY, posZ, rotX, rotY, rotZ) {
    if (!user.isLogin(player))
        return;
    try {

        if (vehicles.exists(player.vehicle)) {
            player.notify('~r~Вы находитесь в транспорте');
            return;
        }
        if (player.isJumping) {
            player.notify('~r~Вы не должны прыгать');
            return;
        }

        let heading = player.heading;
        let rot = new mp.Vector3(0, 0, heading);

        switch (itemId) {
            case 1:
            case 2:
            case 8:
            case 50:
            case 154:
            case 156:
            case 158:
            case 159:
            case 160:
            case 171:
            case 172:
            case 173:
            case 176:
            case 177:
            case 178:
            case 251:
                rot = new mp.Vector3(-90, 0, heading);
                break;
        }

        if(itemId >= 27 && itemId <= 30)
            rot = new mp.Vector3(-90, 0, heading);
        if(itemId >= 54 && itemId <= 126)
            rot = new mp.Vector3(-90, 0, heading);

        let obj = mp.objects.new(
            items.getItemHashById(itemId),
            new mp.Vector3(posX + (methods.getRandomInt(-100, 100) / 300), posY + (methods.getRandomInt(-100, 100) / 400), posZ-0.98),
            {
                rotation: rot,
                alpha: 255,
                dimension: 0
            });

        obj.setVariable('isDrop', id);
        obj.setVariable('itemId', itemId);

        posX = obj.position.x;
        posY = obj.position.y;
        posZ = obj.position.z;

        rotX = rot.x;
        rotY = rot.y;
        rotZ = rot.z;

        props.set(id.toString(), obj);
        mysql.executeQuery(`UPDATE items SET item_id = ${itemId}, owner_type = 0, owner_id = 0, pos_x = ${posX}, pos_y = ${posY}, pos_z = ${posZ}, rot_x = ${rotX}, rot_y = ${rotY}, rot_z = ${rotZ}, timestamp_update = ${methods.getTimeStamp()} where id = ${id}`);

    } catch(e) {
        methods.debug(e);
    }
};

inventory.deleteDropItem = function(id) {
    try {
        let entity = props.get(id.toString());
        if (mp.objects.exists(entity))
            entity.destroy();
    } catch(e) {
        methods.debug(e);
    }
};

inventory.deleteItem = function(id) {
    try {
        mysql.executeQuery(`DELETE FROM items WHERE id = ${id}`);
        inventory.deleteDropItem(id);
    } catch(e) {
        methods.debug(e);
    }
};

inventory.deleteItemsRange = function(player, itemIdFrom, itemIdTo) {
    try {
        if (!user.isLogin(player))
            return;
        mysql.executeQuery(`DELETE FROM items WHERE item_id >= ${itemIdFrom} AND item_id <= ${itemIdTo} AND owner_id = ${user.getId(player)} AND owner_type = 1`);
    } catch(e) {
        methods.debug(e);
    }
};

inventory.addItem = function(itemId, count, ownerType, ownerId, countItems, isEquip, params, timeout = 1) {
    if (items.isWeapon(itemId))
        inventory.addWeaponItem(itemId, count, ownerType, ownerId, countItems, isEquip, params, timeout);
    else if (items.isAmmo(itemId))
        inventory.addAmmoItem(itemId, count, ownerType, ownerId, countItems, isEquip, params, timeout);
    else
        inventory.addItemSql(itemId, count, ownerType, ownerId, countItems, isEquip, params, timeout);
};

inventory.addPlayerWeaponItem = function(player, itemId, count, ownerType, ownerId, countItems, isEquip, params, text = 'Выдано оружие', timeout = 1) {
    let serial = weapons.getWeaponSerial(itemId);
    let paramsObject = JSON.parse(params);
    paramsObject.serial = serial;
    if (items.isAmmo(itemId))
        inventory.addAmmoItem(itemId, count, ownerType, ownerId, countItems, isEquip, JSON.stringify(paramsObject), timeout);
    else
        inventory.addItemSql(itemId, count, ownerType, ownerId, countItems, isEquip, JSON.stringify(paramsObject), timeout);
    user.addHistory(player, 5, `${text} ${items.getItemNameById(itemId)} (${serial})`);
};

inventory.addWeaponItem = function(itemId, count, ownerType, ownerId, countItems, isEquip, params, timeout = 1) {
    let serial = weapons.getWeaponSerial(itemId);
    let paramsObject = JSON.parse(params);
    paramsObject.serial = serial;
    inventory.addItemSql(itemId, count, ownerType, ownerId, countItems, isEquip, JSON.stringify(paramsObject), timeout);
};

inventory.addAmmoItem = function(itemId, count, ownerType, ownerId, countItems, isEquip, params, timeout = 1) {
    inventory.addItemSql(itemId, count, ownerType, ownerId, items.getAmmoCount(itemId), isEquip, params, timeout);
};

inventory.addItemSql = function(itemId, count, ownerType, ownerId, countItems, isEquip, params, timeout = 1) {

    setTimeout(function () {
        try {
            for (let i = 0; i < count; i++) {
                mysql.executeQuery(`INSERT INTO items (item_id, owner_type, owner_id, count, is_equip, params, timestamp_update) VALUES ('${itemId}', '${ownerType}', '${ownerId}', '${countItems}', '${isEquip}', '${params}', '${methods.getTimeStamp()}')`);
            }
        } catch(e) {
            methods.debug(e);
        }
    }, timeout);
};

inventory.getInvAmount = function(player, id, type) {
    try {
        if (!user.isLogin(player))
            return;
        if (Container.Data.Has(id, "invAmount:" + type))
            return Container.Data.Get(id, "invAmount:" + type);
        inventory.updateAmount(player, id, type);
        return Container.Data.Get(id, "invAmount:" + type);
    } catch(e) {
        methods.debug(e);
    }
};

inventory.usePlayerItem = function(player, id, itemId) {
    if (!user.isLogin(player))
        return;

    switch (itemId) {
        case 277: {
            let target = methods.getNearestPlayerWithPlayer(player, 1.5);
            if (!user.isLogin(target)) {
                player.notify("~r~Рядом с вами никого нет");
                return;
            }

            if (!user.isEms(player)) {
                player.notify("~y~У Вас нет навыка для использования этой приблуды");
                return;
            }

            player.notify("~y~Вы связали игрока");
            chat.sendMeCommand(player, "использовал дефибриллятор");
            user.useAdrenaline(target);
            break;
        }
        default:
        {
            let target = methods.getNearestPlayerWithPlayer(player, 1.5);
            if (!user.isLogin(target)) {
                player.notify("~r~Рядом с вами никого нет");
                return;
            }
            inventory.useItem(target, id, itemId);
        }
    }
};

inventory.useItem = function(player, id, itemId) {
    if (!user.isLogin(player))
        return;
    try {
        let user_id = user.getId(player);
        switch (itemId)
        {
            case 0:
            {
                let target = methods.getNearestPlayerWithPlayer(player, 1.5);
                if (!user.isLogin(target))
                {
                    player.notify("~r~Рядом с вами никого нет");
                    return;
                }

                if (user.isTie(target))
                {
                    //user.stopAnimation(target);
                    user.playAnimation(player, "mp_arresting", "a_uncuff", 8);
                    user.unTie(target);
                    chat.sendMeCommand(player, "снял стяжки с человека напротив");
                }
                else
                {
                    if (user.get(target, 'isKnockout'))
                    {
                        player.notify("~r~Игрок должен быть в нокауте");
                        return;
                    }

                    if (user.isCuff(target) || user.isTie(target)) {
                        player.notify("~r~Этот человек уже в связан/в наручниках");
                        return;
                    }
                    user.tie(target);
                    player.notify("~y~Вы связали игрока");
                    chat.sendMeCommand(player, "связал человека рядом");
                    inventory.deleteItem(id);
                }
                break;
            }
            case 253:
            {
                chat.sendDiceCommand(player);
                break;
            }
            case 251:
            {
                player.call('client:startFishing');
                break;
            }
            case 2:
            {
                if (user.has(player, 'useHeal')) {
                    player.notify('~r~Нельзя так часто употреблять наркотики');
                    return;
                }
                chat.sendMeCommand(player, "употребил кокаин");
                player.health = 100;
                inventory.deleteItem(id);

                user.addDrugLevel(player, 1, 200);
                user.playDrugAnimation(player);

                user.set(player, 'useHeal', true);
                setTimeout(function () {
                    if (user.isLogin(player))
                        user.reset(player, 'useHeal');
                }, 10000);
                break;
            }
            case 158:
            {
                if (user.has(player, 'useHeal')) {
                    player.notify('~r~Нельзя так часто употреблять наркотики');
                    return;
                }
                chat.sendMeCommand(player, "употребил амфетамин");
                player.health = 100;
                inventory.deleteItem(id);

                user.addDrugLevel(player, 0, 200);
                user.playDrugAnimation(player);

                user.set(player, 'useHeal', true);
                setTimeout(function () {
                    if (user.isLogin(player))
                        user.reset(player, 'useHeal');
                }, 10000);
                break;
            }
            case 159:
            {
                if (user.has(player, 'useHeal')) {
                    player.notify('~r~Нельзя так часто употреблять наркотики');
                    return;
                }
                chat.sendMeCommand(player, "употребил DMT");
                player.health = 100;
                inventory.deleteItem(id);

                user.addDrugLevel(player, 2, 200);
                user.playDrugAnimation(player);

                user.set(player, 'useHeal', true);
                setTimeout(function () {
                    if (user.isLogin(player))
                        user.reset(player, 'useHeal');
                }, 10000);
                break;
            }
            case 160:
            {
                if (user.has(player, 'useHeal')) {
                    player.notify('~r~Нельзя так часто употреблять наркотики');
                    return;
                }
                chat.sendMeCommand(player, "употребил мефедрон");
                player.health = 100;
                inventory.deleteItem(id);

                user.addDrugLevel(player, 5, 200);
                user.playDrugAnimation(player);

                user.set(player, 'useHeal', true);
                setTimeout(function () {
                    if (user.isLogin(player))
                        user.reset(player, 'useHeal');
                }, 10000);
                break;
            }
            case 161:
            {
                if (user.has(player, 'useHeal')) {
                    player.notify('~r~Нельзя так часто употреблять наркотики');
                    return;
                }
                chat.sendMeCommand(player, "употребил кетамин");
                player.health = 100;
                inventory.deleteItem(id);

                user.addDrugLevel(player, 3, 200);
                user.playDrugAnimation(player);

                user.set(player, 'useHeal', true);
                setTimeout(function () {
                    if (user.isLogin(player))
                        user.reset(player, 'useHeal');
                }, 10000);
                break;
            }
            case 162:
            {
                if (user.has(player, 'useHeal')) {
                    player.notify('~r~Нельзя так часто употреблять наркотики');
                    return;
                }
                chat.sendMeCommand(player, "употребил LSD");
                player.health = 100;
                inventory.deleteItem(id);

                user.addDrugLevel(player, 4, 200);
                user.playDrugAnimation(player);

                user.set(player, 'useHeal', true);
                setTimeout(function () {
                    if (user.isLogin(player))
                        user.reset(player, 'useHeal');
                }, 10000);
                break;
            }
            case 3:
            {
                if (user.has(player, 'useHeal')) {
                    player.notify('~r~Нельзя так часто употреблять аптечки');
                    return;
                }
                chat.sendMeCommand(player, "употребил марихуану");
                if (player.health <= 90)
                    player.health = player.health + 10;
                else
                    player.health = 100;
                inventory.deleteItem(id);

                user.set(player, 'useHeal', true);
                setTimeout(function () {
                    if (user.isLogin(player))
                        user.reset(player, 'useHeal');
                }, 5000);
                break;
            }
            case 4:
            {
                let veh = methods.getNearestVehicleWithCoords(player.position, 10);
                if (!vehicles.exists(veh))
                {
                    player.notify("~r~Нужно быть рядом с машиной");
                    return;
                }

                let vehInfo = methods.getVehicleInfo(veh.model);
                if (vehInfo.fuel_type == 3)
                {
                    player.notify("~r~Электрокары можно взломать только с Kali Linux");
                    return;
                }

                if (vehInfo.class_name == "Super")
                {
                    player.notify("~r~Спорткары можно взломать только с Kali Linux");
                    return;
                }

                if (vehInfo.class_name == "Helicopters" || vehInfo.class_name == "Planes" || vehInfo.class_name == "Emergency")
                {
                    player.notify("~r~Вы не можете взломать это транспортное средство");
                    return;
                }

                if (!veh.locked)
                {
                    player.notify("~r~Транспорт уже открыт");
                    return;
                }
                if(user.has(player, 'usingLockpick')) {
                    player.notify("~r~Вы уже используете отмычку");
                    return;
                }
                user.playAnimation(player, "mp_arresting", "a_uncuff", 8);
                user.set(player, 'usingLockpick', true);

                setTimeout(function () {
                    try {

                        if (!user.isLogin(player))
                            return;

                        user.removeRep(player, 1);

                        if (!vehicles.exists(veh))
                        {
                            player.notify("~r~Не удалось взломать транспорт");
                            user.reset(player, 'usingLockpick');
                            return;
                        }

                        if (methods.getRandomInt(0, 5) == 1)
                        {
                            user.removeRep(player, 5);
                            veh.locked = false;
                            player.notify("~g~Вы открыли транспорт");
                        }
                        else
                        {
                            player.notify("~g~Вы сломали отмычку");
                            inventory.deleteItem(id);
                        }
                        user.reset(player, 'usingLockpick');
                    }
                    catch (e) {
                        methods.debug(e);
                    }
                }, 25000);
                break;
            }
            case 5:
            {
                if (vehicles.exists(player.vehicle))
                {
                    player.notify("~r~Вы должны находиться около открытого капота");
                    return;
                }
                let veh = methods.getNearestVehicleWithCoords(player.position, 10);
                if (veh == null)
                {
                    player.notify("~r~Нужно быть рядом с машиной");
                    return;
                }

                player.notify("~g~Вы залили масло в транспорт");
                inventory.deleteItem(id);
                break;
            }
            case 6:
            {
                if (vehicles.exists(player.vehicle))
                {
                    player.notify("~r~Вы должны находиться около открытого капота");
                    return;
                }
                let veh = methods.getNearestVehicleWithCoords(player.position, 10);
                if (veh == null)
                {
                    player.notify("~r~Нужно быть рядом с машиной");
                    return;
                }

                let vehInfo = methods.getVehicleInfo(veh.model);
                if (vehInfo.class_name == "Helicopters" || vehInfo.class_name == "Planes" || vehInfo.class_name == "Boats" || vehInfo.class_name == "Cycles")
                {
                    player.notify("~r~Вы не можете ремонтировать это транспортное средство");
                    return;
                }

                if (!vSync.getHoodState(veh) && vehInfo.class_name != "Motorcycles")
                {
                    player.notify("~r~Необходимо открыть капот");
                    return;
                }
                if (veh.engineHealth >= 999)
                {
                    player.notify("~r~Автомобиль не поврежден");
                    return;
                }

                veh.engineHealth = 1000.0;

                player.notify("~g~Вы успешно починили авто");
                inventory.deleteItem(id);
                break;
            }
            case 8:
            {
                if (vehicles.exists(player.vehicle))
                {
                    player.notify("~r~Вы должны находиться около транспорта");
                    return;
                }
                let veh = methods.getNearestVehicleWithCoords(player.position, 10);
                if (!vehicles.exists(veh))
                {
                    player.notify("~r~Нужно быть рядом с машиной");
                    return;
                }

                let vehInfo = methods.getVehicleInfo(veh.model);
                if (vehInfo.fuel_type != 4)
                {
                    player.notify("~r~Данный вид топлива не подходит под этот транспорт");
                    return;
                }

                let currentFuel = vehicles.getFuel(veh);

                if (vehInfo.fuel_full < currentFuel + 10)
                {
                    player.notify("~r~В транспорте полный бак");
                    return;
                }

                vehicles.setFuel(veh, currentFuel + 10);

                player.notify("~g~Вы заправили транспорт на 10л.");
                inventory.deleteItem(id);
                break;
            }
            case 9:
            {
                if (vehicles.exists(player.vehicle))
                {
                    player.notify("~r~Вы должны находиться около транспорта");
                    return;
                }
                let veh = methods.getNearestVehicleWithCoords(player.position, 10);
                if (!vehicles.exists(veh))
                {
                    player.notify("~r~Нужно быть рядом с машиной");
                    return;
                }

                let vehInfo = methods.getVehicleInfo(veh.model);
                if (vehInfo.fuel_type != 1)
                {
                    player.notify("~r~Данный вид топлива не подходит под этот транспорт");
                    return;
                }


                let currentFuel = vehicles.getFuel(veh);

                if (vehInfo.fuel_full < currentFuel + 10)
                {
                    player.notify("~r~В транспорте полный бак");
                    return;
                }

                vehicles.setFuel(veh, currentFuel + 10);

                player.notify("~g~Вы заправили транспорт на 10л.");
                inventory.deleteItem(id);
                break;
            }
            case 10:
            {
                if (vehicles.exists(player.vehicle))
                {
                    player.notify("~r~Вы должны находиться около транспорта");
                    return;
                }
                let veh = methods.getNearestVehicleWithCoords(player.position, 10);
                if (!vehicles.exists(veh))
                {
                    player.notify("~r~Нужно быть рядом с машиной");
                    return;
                }

                let vehInfo = methods.getVehicleInfo(veh.model);
                if (vehInfo.fuel_type != 1)
                {
                    player.notify("~r~Данный вид топлива не подходит под этот транспорт");
                    return;
                }

                let currentFuel = vehicles.getFuel(veh);

                if (vehInfo.fuel_full < currentFuel + 10)
                {
                    player.notify("~r~В транспорте полный бак");
                    return;
                }

                vehicles.setFuel(veh, currentFuel + 10);
                player.notify("~g~Вы заправили транспорт на 10л.");
                inventory.deleteItem(id);
                break;
            }
            case 232:
            case 233:
            case 234:
            case 235:
            case 236:
            case 237:
            case 238:
            case 239:
            case 240:
            {
                user.addEatLevel(player, 800);
                chat.sendMeCommand(player, "съедает рыбу");
                inventory.deleteItem(id);
                user.playEatAnimation(player);
                break;
            }
            case 11:
            {
                user.removeWaterLevel(player, 400);
                user.addEatLevel(player, 500);
                chat.sendMeCommand(player, "съедает " + items.getItemNameById(itemId));
                inventory.deleteItem(id);
                user.playEatAnimation(player);
                break;
            }
            case 12:
            {
                user.addWaterLevel(player, 300);
                user.addEatLevel(player, 400);
                chat.sendMeCommand(player, "съедает " + items.getItemNameById(itemId));
                inventory.deleteItem(id);
                user.playEatAnimation(player);
                break;
            }
            case 13:
            {
                user.removeWaterLevel(player, 200);
                user.addEatLevel(player, 300);
                chat.sendMeCommand(player, "съедает " + items.getItemNameById(itemId));
                inventory.deleteItem(id);
                user.playEatAnimation(player);
                break;
            }
            case 14:
            {
                user.removeWaterLevel(player, 50);
                user.addEatLevel(player, 100);
                chat.sendMeCommand(player, "съедает " + items.getItemNameById(itemId));
                inventory.deleteItem(id);
                user.playEatAnimation(player);
                break;
            }
            case 15:
            case 16:
            {
                user.addWaterLevel(player, 150);
                user.addEatLevel(player, 400);
                chat.sendMeCommand(player, "съедает " + items.getItemNameById(itemId));
                inventory.deleteItem(id);
                user.playEatAnimation(player);
                break;
            }
            case 17:
            {
                user.removeWaterLevel(player, 100);
                user.addEatLevel(player, 250);
                chat.sendMeCommand(player, "съедает " + items.getItemNameById(itemId));
                inventory.deleteItem(id);
                user.playEatAnimation(player);
                break;
            }
            case 18:
            {
                user.removeWaterLevel(player, 100);
                user.addEatLevel(player, 200);
                chat.sendMeCommand(player, "съедает " + items.getItemNameById(itemId));
                inventory.deleteItem(id);
                user.playEatAnimation(player);
                break;
            }
            case 19:
            {
                user.addWaterLevel(player, 150);
                user.addEatLevel(player, 300);
                chat.sendMeCommand(player, "съедает " + items.getItemNameById(itemId));
                inventory.deleteItem(id);
                user.playEatAnimation(player);
                break;
            }
            case 20:
            {
                user.removeWaterLevel(player, 250);
                user.addEatLevel(player, 500);
                chat.sendMeCommand(player, "съедает " + items.getItemNameById(itemId));
                inventory.deleteItem(id);
                user.playEatAnimation(player);
                break;
            }
            case 21:
            {
                user.removeWaterLevel(player, 50);
                user.addEatLevel(player, 150);
                chat.sendMeCommand(player, "съедает " + items.getItemNameById(itemId));
                inventory.deleteItem(id);
                user.playEatAnimation(player);
                break;
            }
            case 22:
            {
                user.addWaterLevel(player, 50);
                user.addEatLevel(player, 250);
                chat.sendMeCommand(player, "съедает " + items.getItemNameById(itemId));
                inventory.deleteItem(id);
                user.playEatAnimation(player);
                break;
            }
            case 23:
            {
                user.addWaterLevel(player, 50);
                user.addEatLevel(player, 200);
                chat.sendMeCommand(player, "съедает " + items.getItemNameById(itemId));
                inventory.deleteItem(id);
                user.playEatAnimation(player);
                break;
            }
            case 24:
            {
                user.addWaterLevel(player, 100);
                user.addEatLevel(player, 250);
                chat.sendMeCommand(player, "съедает " + items.getItemNameById(itemId));
                inventory.deleteItem(id);
                user.playEatAnimation(player);
                break;
            }
            case 25:
            {
                user.addWaterLevel(player, 50);
                user.addEatLevel(player, 300);
                chat.sendMeCommand(player, "съедает " + items.getItemNameById(itemId));
                inventory.deleteItem(id);
                user.playEatAnimation(player);
                break;
            }
            case 241:
            {
                user.addEatLevel(player, 50);
                user.addWaterLevel(player, 300);
                chat.sendMeCommand(player, "выпивает " + items.getItemNameById(itemId));
                inventory.deleteItem(id);
                user.playDrinkAnimation(player);
                break;
            }
            case 242:
            {
                user.addWaterLevel(player, 500);
                chat.sendMeCommand(player, "выпивает " + items.getItemNameById(itemId));
                inventory.deleteItem(id);
                user.playDrinkAnimation(player);
                break;
            }
            case 243:
            case 244:
            case 245:
            case 246:
            case 247:
            case 248:
            case 249:
            case 250:
            {
                user.addWaterLevel(player, 50);
                chat.sendMeCommand(player, "выпивает " + items.getItemNameById(itemId));
                inventory.deleteItem(id);
                user.playDrinkAnimation(player);
                user.addDrugLevel(player, 99, 200);
                break;
            }
            case 32:
            {
                user.addWaterLevel(player, 600);
                user.addEatLevel(player, 600);
                chat.sendMeCommand(player, "съедает сухпаёк");
                inventory.deleteItem(id);
                user.playEatAnimation(player);
                break;
            }
            case 26:
            {
                user.removeWaterLevel(player, 50);
                chat.sendMeCommand(player, "выкуривает сигарету");
                inventory.deleteItem(id);
                break;
            }
            case 40:
            {
                let target = methods.getNearestPlayerWithPlayer(player, 1.2);
                if (!user.isLogin(target))
                {
                    player.notify("~r~Рядом с вами никого нет");
                    return;
                }
                if (user.isCuff(target) || user.isTie(target)) {
                    player.notify("~r~Этот человек уже в связан/в наручниках");
                    return;
                }
                if (target.health == 0) {
                    player.notify("~r~Нельзя надевать наручники на человека в коме");
                    return;
                }

                user.headingToTarget(player, target.id);

                methods.saveLog('PlayerCuff', `${user.getRpName(target)} (${user.getId(target)}) cuffed by ${user.getRpName(player)} (${user.getId(player)})`);

                setTimeout(function () {
                    try {
                        //chat.sendMeCommand(player, `надел наручники на человека рядом (${user.getId(target)})`);
                        //user.playAnimation(player, "mp_arresting", "a_uncuff", 8);

                        target.heading = player.heading;

                        user.playAnimation(target, 'mp_arrest_paired', 'crook_p2_back_right', 8);
                        user.playAnimation(target, 'mp_arrest_paired', 'cop_p2_back_right', 8);

                        setTimeout(function () {
                            try {
                                user.cuff(target);
                                inventory.deleteItem(id);
                            }
                            catch (e) {
                                methods.debug(e);
                            }
                        }, 3760);
                    }
                    catch (e) {
                        methods.debug(e);
                    }
                }, 2100);
                break;
            }
            case 215:
            {
                if (user.has(player, 'useHeal')) {
                    player.notify('~r~Нельзя так часто употреблять аптечки');
                    return;
                }
                chat.sendMeCommand(player, "использовал аптечку");
                if (player.health >= 60)
                    player.health = 100;
                else
                    player.health = player.health + 40;
                inventory.deleteItem(id);
                user.playDrugAnimation(player);
                user.set(player, 'useHeal', true);
                setTimeout(function () {
                    if (user.isLogin(player))
                        user.reset(player, 'useHeal');
                }, 10000);
                break;
            }
            case 278:
            {
                if (user.has(player, 'useHeal')) {
                    player.notify('~r~Нельзя так часто употреблять аптечки');
                    return;
                }
                chat.sendMeCommand(player, "использовал аптечку");
                player.health = 100;
                inventory.deleteItem(id);
                user.playDrugAnimation(player);
                user.set(player, 'useHeal', true);
                setTimeout(function () {
                    if (user.isLogin(player))
                        user.reset(player, 'useHeal');
                }, 10000);
                break;
            }
            case 221:
            {
                if (user.has(player, 'useHeal1')) {
                    player.notify('~r~Нельзя так часто употреблять таблетки');
                    return;
                }

                chat.sendMeCommand(player, "употребил таблетку");

                user.setDrugLevel(player, 0, 0);
                user.setDrugLevel(player, 1, 0);
                user.setDrugLevel(player, 2, 0);
                user.setDrugLevel(player, 3, 0);
                user.setDrugLevel(player, 4, 0);
                user.setDrugLevel(player, 5, 0);
                user.setDrugLevel(player, 99, 0);

                user.stopAllScreenEffects(player);
                user.playDrugAnimation(player);

                inventory.deleteItem(id);

                user.set(player, 'useHeal1', true);
                setTimeout(function () {
                    if (user.isLogin(player))
                        user.reset(player, 'useHeal1');
                }, 60000);
                break;
            }
        }
    } catch(e) {
        methods.debug(e);
    }
};

inventory.types = {
    World : 0,
    Player : 1,
    VehicleOwner : 2,
    VehicleServer : 3,
    BagSmall : 4,
    House : 5,
    Apartment : 6,
    Bag : 7,
    Vehicle : 8,
    StockGang : 9,
    Fridge : 10,
    UserStockDef : 75,
    UserStock : 100,
    UserStockEnd : 200,
};