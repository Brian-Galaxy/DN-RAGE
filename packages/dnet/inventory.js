let Container = require('./modules/data');
let mysql = require('./modules/mysql');

let methods = require('./modules/methods');
let weather = require('./managers/weather');
//let dispatcher = require('./managers/dispatcher');
let chat = require('./modules/chat');

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

inventory.addItem = function(itemId, count, ownerType, ownerId, countItems, isEquip, params, timeout = 1) {
    if (items.isWeapon(itemId))
        inventory.addWeaponItem(itemId, count, ownerType, ownerId, countItems, isEquip, params, timeout);
    else if (items.isAmmo(itemId))
        inventory.addAmmoItem(itemId, count, ownerType, ownerId, countItems, isEquip, params, timeout);
    else
        inventory.addItemSql(itemId, count, ownerType, ownerId, countItems, isEquip, params, timeout);
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

inventory.useItem = function(player, id, itemId) {
    if (!user.isLogin(player))
        return;
    try {
        let user_id = user.getId(player);
        switch (itemId)
        {
            case 0:
            {
                var nplayer = methods.getNearestPlayerWithPlayer(player, 1.5);
                if (!user.isLogin(nplayer))
                {
                    player.notify("~r~Рядом с вами никого нет");
                    return;
                }

                if (nplayer.getVariable("isTie"))
                {
                    user.unTie(nplayer)
                    player.notify("~y~Вы развязали игрока");
                    chat.sendMeCommand(player, "развязал человека рядом");
                    inventory.addItem(itemId, 1, inventory.types.Player, user_id, 1, -1, -1, -1);
                }
                else
                {
                    if (!nplayer.getVariable("isKnockout"))
                    {
                        player.notify("~r~Игрок должен быть в нокауте");
                        return;
                    }

                    if (user.isCuff(nplayer) || user.isTie(nplayer)) {
                        player.notify("~r~Этот человек уже в связан/в наручниках");
                        return;
                    }
                    user.tie(nplayer);
                    player.notify("~y~Вы связали игрока");
                    chat.sendMeCommand(player, "связал человека рядом");
                    inventory.deleteItem(id);
                }
                break;
            }
            case 1:
            {
                var nplayer = methods.getNearestPlayerWithPlayer(player, 1.5);
                if (!user.isLogin(nplayer))
                {
                    player.notify("~r~Рядом с вами никого нет");
                    return;
                }
                if (nplayer.getVariable("isTieBandage"))
                {
                    user.unTieBandage(nplayer);
                    player.notify("~y~Вы сняли мешок с головы");
                    chat.sendMeCommand(player, "снял мешок с головы человеку рядом");
                    inventory.addItem(itemId, 1, inventory.types.Player, user_id, 1, -1, -1, -1);
                }
                else
                {
                    if (!nplayer.getVariable("isTie"))
                    {
                        player.notify("~r~Игрок должен быть связан");
                        return;
                    }

                    user.tieBandage(nplayer);
                    player.notify("~y~Вы надели мешок на голову");
                    chat.sendMeCommand(player, "надел мешок на голову человеку рядом");
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
                let pos1 = new mp.Vector3(592.0863037109375, -3280.79931640625, 5.069560527801514);

                if (methods.distanceToPos(player.position, pos1) < 2) {

                    if (mp.players.length < 200) {
                        player.notify("~r~Онлайн на сервере должен быть более 200 человек");
                        return;
                    }

                    let dateTime = new Date();
                    if (dateTime.getHours() < 17 || dateTime.getHours() > 19) {
                        player.notify('~r~Доступно только с 17 до 20 вечера ООС времени');
                        return;
                    }

                    if (dateTime.getDate() % 2) {
                        player.notify('~r~Доступно каждые 2 дня (ООС)');
                        player.notify('~r~А именно: 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30 число на календаре');
                        return;
                    }

                    if (user.has(player, 'isGrab')) {
                        player.notify('~r~Это действие сейчас не доступно');
                        return;
                    }

                    user.playAnimation(player, "mp_arresting", "a_uncuff", 8);
                    user.set(player, 'isGrab', true);

                    setTimeout(function () {
                        try {

                            user.reset(player, 'isGrab');
                            if (methods.getRandomInt(0, 10) < 3)
                            {
                                user.takeNewItem(player, 262, 1);
                                player.notify("~g~Вы открыли ящик, сломав отмычку");
                                inventory.deleteItem(id);
                            }
                            else
                            {
                                player.notify("~g~Вы сломали отмычку");
                                inventory.deleteItem(id);
                            }
                        }
                        catch (e) {
                            methods.debug(e);
                        }
                    }, 5000);

                    return;
                }

                let veh = methods.getNearestVehicleWithCoords(player.position, 10);
                if (!vehicles.exists(veh))
                {
                    player.notify("~r~Нужно быть рядом с машиной");
                    return;
                }

                let vehInfo = methods.getVehicleInfo(veh.model);
                if (vehInfo.fuel_min == 0)
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

                        if (!vehicles.exists(veh))
                        {
                            player.notify("~r~Не удалось взломать транспорт");
                            user.reset(player, 'usingLockpick');
                            return;
                        }

                        if (methods.getRandomInt(0, 5) == 1)
                        {
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

                /*Vehicle.VehicleInfoGlobalDataList.forEach(item => {
                    if (item.Number != Vehicle.GetVehicleNumber(v.Handle)) return;
                    Vehicle.VehicleInfoGlobalDataList[item.VehId].SOil = 0;
                    container.Data.Set(110000 + item.VehId, "SOil", 0);
                    //TriggerServerEvent("ARP:SaveVehicle", item.VehId);
                }); Система масла, не думаю что ее будут трогать */

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
                let veh = methods.getNearestVehicleWithCoords(player.position, 10)
                if (veh == null)
                {
                    player.notify("~r~Нужно быть рядом с машиной");
                    return;
                }

                if (veh.engineHealth < 750.0)
                {
                    player.notify("~r~Вы не можете сами починить авто, вызывайте механика");
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
            case 7:
            {
                player.notify(`~g~Ваш ID:~s~ ${user_id}`);
                if (user.get(player, "jail_time") > 0)
                    player.notify(`~g~Время в тюрьме:~s~ ${user.get(player, "jail_time")} сек.`);
                /*if (user.IsMuted())
                    player.notify(`~g~Время окончания мута:~s~ ${Main.UnixTimeStampToDateTime(user.Data.date_mute)}`); Заглушечка/Не думаю что нужно будет, оставим до лучших времен */
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
                let currentFuel = vehicles.getFuel(veh);

                if (vehInfo.fuel_full < currentFuel + 10)
                {
                    vehicles.setFuel(veh, vehInfo.fuel_full);
                    player.notify("~r~Полный бак");
                    return;
                }

                vehicles.setFuel(veh, currentFuel + 10);

                player.notify("~g~Вы заправили авто на 10л.");
                inventory.deleteItem(id);
                break;
            }
            case 63:
            {
                if (vehicles.exists(player.vehicle))
                {
                    player.notify("~r~Вы в автомобиле");
                    return;
                }

                /* var ped = Main.FindNearestPed();
                if (!user.IsAnimal(ped.Model.Hash))
                {
                    player.notify("~r~Это должно быть животное");
                    break;
                }
                if (ped.Handle == 0)
                {
                    player.notify("~r~Рядом с вами нет животного");
                    break;
                }
                if (ped.IsAlive)
                {
                    player.notify("~r~Животное должно быть мертвое");
                    break;
                }

                user.playScenario("CODE_HUMAN_MEDIC_TEND_TO_DEAD");
                mp.game.wait(10000);
                player.clearTasks();

                if (ped.Model.Hash == GetHashKey("a_c_boar"))
                {
                    chat.sendMeCommand(player, "разрезал животное");
                    inventory.takeNewItem(223).then();
                    ped.Delete();
                }
                else if (ped.Model.Hash == GetHashKey("a_c_chickenhawk"))
                {
                    chat.sendMeCommand(player, "разрезал птицу");
                    inventory.takeNewItem(224).then();
                    ped.Delete();
                }
                else if (ped.Model.Hash == GetHashKey("a_c_cow"))
                {
                    chat.sendMeCommand(player, "разрезал животное");
                    inventory.takeNewItem(225).then();
                    ped.Delete();
                }
                else if (ped.Model.Hash == GetHashKey("a_c_cormorant"))
                {
                    chat.sendMeCommand(player, "разрезал птицу");
                    inventory.takeNewItem(226).then();
                    ped.Delete();
                }
                else if (ped.Model.Hash == GetHashKey("a_c_deer"))
                {
                    chat.sendMeCommand(player, "разрезал животное");
                    inventory.takeNewItem(227).then();
                    ped.Delete();
                }
                else if (ped.Model.Hash == GetHashKey("a_c_hen"))
                {
                    chat.sendMeCommand(player, "разрезал птицу");
                    inventory.takeNewItem(228).then();
                    ped.Delete();
                }
                else if (ped.Model.Hash == GetHashKey("a_c_pig"))
                {
                    chat.sendMeCommand(player, "разрезал животное");
                    inventory.takeNewItem(229).then();
                    ped.Delete();
                }
                else if (ped.Model.Hash == GetHashKey("a_c_rabbit_01"))
                {
                    chat.sendMeCommand(player, "разрезал животное");
                    inventory.takeNewItem(230).then();
                    ped.Delete();
                }
                else if (ped.Model.Hash == GetHashKey("a_c_rat"))
                {
                    chat.sendMeCommand(player, "разрезал животное");
                    inventory.takeNewItem(231).then();
                    ped.Delete();
                }
                else
                {
                    player.notify("~r~Этот тип не подходит для еды");
                }
                Заглушечка, NPC еще не завезли :( */
                break;
            }
            case 232:
            case 234:
            case 236:
            case 238:
            {
                user.addEatLevel(player, 800);
                chat.sendMeCommand(player, "съедает мясо");
                inventory.deleteItem(id);
                user.playEatAnimation(player);
                break;
            }
            case 246:
            case 247:
            case 248:
            case 249:
            case 250:
            {
                user.addEatLevel(player, 850);
                chat.sendMeCommand(player, "съедает рыбу");
                inventory.deleteItem(id);
                user.playEatAnimation(player);
                break;
            }
            case 237:
            case 239:
            {
                user.addEatLevel(player, 500);
                chat.sendMeCommand(player, "съедает мясо");
                inventory.deleteItem(id);
                user.playEatAnimation(player);
                break;
            }
            case 240:
            {
                user.addEatLevel(player, 100);
                chat.sendMeCommand(player, "съедает мясо");
                inventory.deleteItem(id);
                user.playEatAnimation(player);
                break;
            }
            case 233:
            {
                user.addEatLevel(player, 1500);
                chat.sendMeCommand(player, "съедает мясо");
                inventory.deleteItem(id);
                user.playEatAnimation(player);
                break;
            }
            case 235:
            {
                user.addEatLevel(player, 1000);
                chat.sendMeCommand(player, "съедает мясо");
                inventory.deleteItem(id);
                user.playEatAnimation(player);
                break;
            }
            case 10:
            {
                user.addEatLevel(player, 40);
                chat.sendMeCommand(player, "съедает жвачку");
                inventory.deleteItem(id);
                user.playEatAnimation(player);
                break;
            }
            case 11:
            {
                user.removeWaterLevel(10);
                user.addEatLevel(player, 190);
                chat.sendMeCommand(player, "съедает батончик");
                inventory.deleteItem(id);
                user.playEatAnimation(player);
                break;
            }
            case 12:
            {
                user.removeWaterLevel(20);
                user.addEatLevel(player, 160);
                chat.sendMeCommand(player, "съедает чипсы");
                inventory.deleteItem(id);
                user.playEatAnimation(player);
                break;
            }
            case 13:
            {
                user.removeWaterLevel(5);
                user.addEatLevel(player, 320);
                chat.sendMeCommand(player, "съедает роллы");
                inventory.deleteItem(id);
                user.playEatAnimation(player);
                break;
            }
            case 14:
            {
                user.removeWaterLevel(7);
                user.addEatLevel(player, 380);
                chat.sendMeCommand(player, "съедает гамбургер");
                inventory.deleteItem(id);
                user.playEatAnimation(player);
                break;
            }
            case 15:
            {
                user.removeWaterLevel(5);
                user.addEatLevel(player, 420);
                chat.sendMeCommand(player, "съедает салат");
                inventory.deleteItem(id);
                user.playEatAnimation(player);
                break;
            }
            case 16:
            {
                user.removeWaterLevel(10);
                user.addEatLevel(player, 550);
                chat.sendMeCommand(player, "съедает пиццу");
                inventory.deleteItem(id);
                user.playEatAnimation(player);
                break;
            }
            case 17:
            {
                user.removeWaterLevel(8);
                user.addEatLevel(player, 780);
                chat.sendMeCommand(player, "съедает жаркое");
                inventory.deleteItem(id);
                user.playEatAnimation(player);
                break;
            }
            case 18:
            {
                user.removeWaterLevel(10);
                user.addEatLevel(player, 850);
                chat.sendMeCommand(player, "съедает кесадильи");
                inventory.deleteItem(id);
                user.playEatAnimation(player);
                break;
            }
            case 19:
            {
                user.removeWaterLevel(10);
                user.addEatLevel(player, 1100);
                chat.sendMeCommand(player, "съедает фрикасе");
                inventory.deleteItem(id);
                user.playEatAnimation(player);
                break;
            }
            case 20:
            {
                //user.AddHealthLevel(5); Заглушечка
                user.addWaterLevel(20);
                user.addEatLevel(player, 220);
                chat.sendMeCommand(player, "съедает фрукты");
                inventory.deleteItem(id);
                user.playEatAnimation(player);
                break;
            }
            case 32:
            {
                user.addWaterLevel(100);
                user.addEatLevel(player, 900);
                chat.sendMeCommand(player, "съедает сухпаёк");
                inventory.deleteItem(id);
                user.playEatAnimation(player);
                break;
            }
            case 21:
            {
                user.addWaterLevel(100);
                chat.sendMeCommand(player, "выпивает бутылку воды");
                inventory.deleteItem(id);
                user.playDrinkAnimation(player);
                break;
            }
            case 22:
            {
                /*if (user.GetTempLevel() < 35.9)
                    user.AddTempLevel(0.9);*/
                user.addWaterLevel(95);
                chat.sendMeCommand(player, "выпивает стакан кофе");
                inventory.deleteItem(id);
                user.playDrinkAnimation(player);
                break;
            }
            case 23:
            {
                /*if (user.GetTempLevel() < 35.9)
                    user.AddTempLevel(1.2);*/
                user.addWaterLevel(95);
                chat.sendMeCommand(player, "выпивает стакан чая");
                inventory.deleteItem(id);
                user.playDrinkAnimation(player);
                break;
            }
            case 24:
            {
                user.addWaterLevel(70);
                chat.sendMeCommand(player, "выпивает бутылку лимонада");
                inventory.deleteItem(id);
                user.playDrinkAnimation(player);
                break;
            }
            case 25:
            {
                user.addWaterLevel(55);
                chat.sendMeCommand(player, "выпивает банку кока-колы");
                inventory.deleteItem(id);
                user.playDrinkAnimation(player);
                break;
            }
            case 26:
            {
                user.addWaterLevel(110);
                chat.sendMeCommand(player, "выпивает банку энергетика");
                inventory.deleteItem(id);
                user.playDrinkAnimation(player);
                break;
            }
            case 31:
            {
                player.notify("~r~Больше не работает :c");
                break;
                var nplayer = methods.getNearestPlayerWithPlayer(player, 1.2);
                if (!user.isLogin(nplayer))
                {
                    player.notify("~r~Рядом с вами никого нет");
                    return;
                }
                user.useAdrenaline(nplayer);
                chat.sendMeCommand(player, "сделал инъекцию адреналина");
                inventory.deleteItem(id);
                break;
            }
            case 40:
            {
                var nplayer = methods.getNearestPlayerWithPlayer(player, 1.2);
                if (!user.isLogin(nplayer))
                {
                    player.notify("~r~Рядом с вами никого нет");
                    return;
                }
                if (user.isCuff(nplayer) || user.isTie(nplayer)) {
                    player.notify("~r~Этот человек уже в связан/в наручниках");
                    return;
                }
                if (nplayer.health == 0) {
                    player.notify("~r~Нельзя надевать наручники на человека в коме");
                    return;
                }
                methods.saveLog('PlayerCuff', `${user.get(nplayer, 'rp_name')} (${user.getId(nplayer)}) cuffed by ${user.get(player, 'rp_name')} (${user.getId(player)})`);
                chat.sendMeCommand(player, `надел наручники на человека рядом (${user.getId(nplayer)})`);
                user.playAnimation(player, "mp_arresting", "a_uncuff", 8);
                user.cuff(nplayer);
                inventory.deleteItem(id);
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
            case 263:
            {
                if (player.dimension > 0) {
                    player.notify('~r~Нельзя совершить ограбление');
                    return;
                }

                if (user.isGos(player)) {
                    player.notify('~r~Вы состоите в гос. организации');
                    return;
                }

                let grabId = bank.getGrabInRadius(player.position);

                if (grabId == -1) {
                    let veh = methods.getNearestVehicleWithCoords(player.position, 10);
                    if (!vehicles.exists(veh))
                    {
                        player.notify("~r~Нужно быть рядом с машиной");
                        return;
                    }

                    let vehInfo = methods.getVehicleInfo(veh.model);

                    if (vehInfo.class_name == "Emergency")
                    {
                        player.notify("~r~Вы не можете взломать это транспортное средство");
                        return;
                    }

                    if (!veh.locked)
                    {
                        player.notify("~r~Транспорт уже открыт");
                        return;
                    }

                    user.playAnimation(player, "mp_arresting", "a_uncuff", 8);

                    setTimeout(function () {
                        try {

                            if (!vehicles.exists(veh))
                            {
                                player.notify("~r~Не удалось взломать транспорт");
                                return;
                            }

                            if (methods.getRandomInt(0, 3) == 1)
                            {
                                veh.locked = false;
                                player.notify("~g~Вы открыли транспорт");
                            }
                            else
                            {
                                player.notify("~g~Вы сломали отмычку");
                                inventory.deleteItem(id);
                            }
                        }
                        catch (e) {
                            methods.debug(e);
                        }
                    }, 25000);
                    return;
                }

                if (grabId == 0 && !user.isMafia(player)) {
                    player.notify('~r~Вы должны состоять в мафии для того чтобы грабить этот банк');
                    return;
                }

                if (grabId == 0) {
                    let dateTime = new Date();
                    if (dateTime.getHours() < 19) {
                        player.notify('~r~Доступно только с 19 до 24 ночи ООС времени');
                        return;
                    }
                }

                if (grabId == 5) {
                    let dateTime = new Date();
                    if (dateTime.getHours() < 17 || dateTime.getHours() > 19) {
                        player.notify('~r~Доступно только с 17 до 20 вечера ООС времени');
                        return;
                    }

                    if (dateTime.getDate() % 2) {
                        player.notify('~r~Доступно каждые 2 дня (ООС)');
                        player.notify('~r~А именно: 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30 число на календаре');
                        return;
                    }
                }

                if (weather.getHour() < 22 && weather.getHour() > 4) {
                    player.notify("~r~Доступно только с 22 до 4 утра игрового времени");
                    return;
                }

                if (player.dimension != 0) {
                    player.notify("~r~Нельзя грабить в интерьере");
                    return;
                }

                if (user.has(player, 'isGrab')) {
                    player.notify('~r~Это действие сейчас не доступно');
                    return;
                }

                if (user.get(player, 'fractionType') != 4 && !user.isMafia(player)) {
                    player.notify('~r~Вы не состоите в ОПГ или Мафии');
                    return;
                }

                if (user.get(player, 'age') < 19) {
                    player.notify('~r~Разрешено грабить с 19 лет');
                    return;
                }

                if (mp.players.length < 100) {
                    player.notify("~r~Онлайн на сервере должен быть более 100 человек");
                    return;
                }

                let count = bank.grabPos[grabId][3];
                if (count == 0) {
                    player.notify('~r~Все ячейки пустые');
                    return;
                }

                user.set(player, 'isGrab', true);
                user.playAnimation(player, "mp_arresting", "a_uncuff", 8);
                user.disableAllControls(player, true);
                bank.grabPos[grabId][3] = count - 1;

                setTimeout(function () {
                    user.playAnimation(player, "anim@heists@money_grab@duffel", "loop", 9);
                }, 5000);

                setTimeout(function () {
                    if (!user.isLogin(player))
                        return;
                    player.call('client:grabBank:success', [grabId]);

                    user.disableAllControls(player, false);
                    player.notify(`~y~Осталось ячеек ~s~${count - 1}`);

                    if (grabId == 5)
                        user.giveWanted(player, 10, 'Ограбление хранилища USMC');
                    else
                        user.giveWanted(player, 10, 'Ограбление банка');

                    user.reset(player, 'isGrab');
                    user.stopAnimation(player);
                    if (methods.getRandomInt(0, 3) == 0) {
                        inventory.deleteItem(id);
                        player.notify('~r~Вы сломали отмычку');
                    }
                }, 10000);

                break;
            }
            case 262:
            {
                if (user.isGos(player)) {
                    player.notify('~r~Вы состоите в гос. организации');
                    return;
                }

                let grabId = bank.getBombInRadius(player.position);

                if (grabId == -1) {
                    player.notify('~r~Вы слишком далеко от двери');
                    return;
                }

                if (grabId == 0 && !user.isMafia(player)) {
                    player.notify('~r~Вы должны состоять в мафии для того чтобы грабить этот банк');
                    return;
                }

                if (grabId == 0) {
                    let dateTime = new Date();
                    if (dateTime.getHours() < 19) {
                        player.notify('~r~Доступно только с 19 до 24 ночи ООС времени');
                        return;
                    }
                }

                if (weather.getHour() < 23 && weather.getHour() > 4) {
                    player.notify("~r~Доступно только с 23 до 4 утра игрового времени");
                    return;
                }

                if (player.dimension != 0) {
                    player.notify("~r~Нельзя грабить в интерьере");
                    return;
                }

                if (mp.players.length < 100) {
                    player.notify("~r~Онлайн на сервере должен быть более 100 человек");
                    return;
                }

                let count = bank.grabPos[grabId][3];
                if (count == 0) {
                    player.notify('~r~Все ячейки в банке пустые');
                    return;
                }

                inventory.deleteItem(id);
                user.playAnimation(player, "mp_arresting", "a_uncuff", 8);

                setTimeout(function () {
                    player.notify("~y~Взрыв произойдет через ~s~10~y~ сек");

                    setTimeout(function () {
                        if (!user.isLogin(player))
                            return;
                        player.notify("~y~Взрыв произойдет через ~s~5~y~ сек");
                    }, 5000);

                    setTimeout(function () {
                        if (!user.isLogin(player))
                            return;
                        player.notify("~y~Взрыв произойдет через ~s~3~y~ сек");
                    }, 7000);

                    setTimeout(function () {
                        if (methods.getRandomInt(0, 3) == 0) {
                            dispatcher.sendPos("Код 0", "В банке сработала сигнализация", player.position);
                            methods.explodeObjectGlobal(bank.doorPos[grabId][1], bank.doorPos[grabId][2], bank.doorPos[grabId][3], bank.doorPos[grabId][0]);
                        }
                        else {
                            player.notify('~r~C4 была бракованной, взрыв не произошел');
                        }
                    }, 10000);
                }, 5000);

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
    UserStock : 11
};