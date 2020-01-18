import UIMenu from './modules/menu';
import methods from './modules/methods';
import container from './modules/data';
import chat from './chat';
import items from './items';
import user from './user';
import weapons from './weapons';
import enums from './enums';
import ui from "./modules/ui";
import cloth from "./business/cloth";
import menuList from "./menuList";
import vehicles from "./property/vehicles";

let inventory = {};

inventory.browser = {};

inventory.currentItem = -1;
inventory.hidden = true;

let hidden = true;

inventory.show = function() {
    //mp.gui.chat.activate(false);
    try {
        mp.gui.cursor.show(false, true);
        mp.game.ui.notifications.show("~b~Скрыть ивентарь на ~s~I~");
        ui.DisableMouseControl = true;
        hidden = false;
        ui.hideHud();

        let data = {type: "updateLabel", uid: `${mp.players.local.remoteId} (${user.getCache('id')})`, uname: user.getCache('name')};
        ui.callCef('inventory', JSON.stringify(data));
        ui.callCef('inventory', JSON.stringify({type: "updateMaxW", val: inventory.calculatePlayerInvAmountMax()}));
        ui.callCef('inventory', '{"type": "show"}');

        mp.game.graphics.transitionToBlurred(100);

        inventory.getItemList(inventory.types.Player, user.getCache('id'));
    }
    catch (e) {
        methods.debug(e);
    }
};

inventory.hide = function() {
    //mp.gui.chat.activate(true);
    try {
        mp.gui.cursor.show(false, false);
        ui.DisableMouseControl = false;
        hidden = true;
        ui.showHud();
        mp.game.graphics.transitionFromBlurred(100);
    }
    catch (e) {
        methods.debug(e);
    }
};

inventory.isHide = function() {
    return hidden;
};

inventory.updateEquipStatus = function(id, status) { //TODO, подумать как можно рессетнуть значения, чтобы не дюпали и не пропадли деньги
    mp.events.callRemote('server:inventory:updateEquipStatus', id, status);
};

inventory.updateItemCount = function(id, count) { //TODO, подумать как можно рессетнуть значения, чтобы не дюпали и не пропадли деньги
    mp.events.callRemote('server:inventory:updateItemCount', id, count);
};

inventory.updateItemsEquipByItemId = function(itemId, ownerId, ownerType, equip) {
    mp.events.callRemote('server:inventory:updateItemsEquipByItemId', itemId, ownerId, ownerType, equip);
};

inventory.updateOwnerId = function(id, ownerId, ownerType) {
    ownerId = ownerId.toString();
    mp.events.callRemote('server:inventory:updateOwnerId', id, ownerId, ownerType);
};

inventory.updateItemParams = function(id, params) {
    try {
        if (typeof params != "string")
            params = JSON.stringify(params);
        mp.events.callRemote('server:inventory:updateItemParams', id, params);
    }
    catch (e) {
        methods.debug(e);
    }
};

inventory.openInventoryByEntity = function(entity) {

    if (entity.getType() == 2) {

        try {

            if (entity.isDead()) {
                mp.game.ui.notifications.show("~r~Транспорт уничтожен");
            } else if (entity.getDoorLockStatus() !== 1) {
                if (entity.getNumberPlateText() == "CAR SHOP")
                    menuList.showVehShopModelInfoMenu(entity.model);
                else
                    mp.game.ui.notifications.show("~r~Транспорт закрыт");

            } else if (mp.players.local.isInAnyVehicle(false)) {
                mp.game.ui.notifications.show("~g~Вы должны находиться около багажника");
            } else if (methods.getVehicleInfo(entity.model).stock == 0) {
                mp.game.ui.notifications.show("~r~Багажник отсутсвует у этого ТС");
            } else if (entity.getVariable('useless') === true) {
                mp.game.ui.notifications.show("~r~Данный транспорт не доступен");
            }
            else {
                inventory.getItemList(inventory.types.Vehicle, mp.game.joaat(entity.getNumberPlateText().trim()));
                vehicles.setTrunkStateById(entity.remoteId, true);
            }
        }
        catch (e) {
            methods.debug(e);
            mp.game.ui.notifications.show("~r~Произошла неизвестная ошибка #9998");
        }
    }
    else if (entity.getType() == 3) {
        try {
            inventory.takeItem(entity.getVariable('isDrop'), entity.getVariable('itemId'));
        }
        catch (e) {
            methods.debug(e);
        }
    }
    else if (entity.getType() == 4) {
        try {
            menuList.showPlayerDoMenu(entity.remoteId);
        }
        catch (e) {
            methods.debug(e);
        }
    }
};

inventory.useItem = function(id, itemId)    {
    mp.events.callRemote('server:inventory:useItem', id, itemId);
};

inventory.dropItem = function(id, itemId, pos, rot) {
    mp.events.callRemote('server:inventory:dropItem', id, itemId, pos.x, pos.y, pos.z, rot.x, rot.y, rot.z);
};

inventory.deleteItemProp = function(id) {
    mp.events.callRemote('server:inventory:deleteDropItem', id);
};

inventory.deleteItem = function(id) {
    mp.events.callRemote('server:inventory:deleteItem', id);
};

inventory.takeNewItem = async function(itemId, params, count = 1) { //TODO
    try {
        let user_id = user.getCache('id');
        let amount = await inventory.getInvAmount(user_id, inventory.types.Player);
        let amountMax = await inventory.getInvAmountMax(user_id, inventory.types.Player);
        if (items.getItemAmountById(itemId) + amount > amountMax) {
            mp.game.ui.notifications.show("~r~Инвентарь заполнен");
            return;
        }
        inventory.addItem(itemId, 1, inventory.types.Player, user_id, count, 0, params, 1);
        inventory.updateAmount(user_id, inventory.types.Player);
        mp.game.ui.notifications.show(`~b~Вы взяли \"${items.getItemNameById(itemId)}\"`);
        chat.sendMeCommand(`взял \"${items.getItemNameById(itemId)}\"`);
    }
    catch (e) {
        methods.debug(e);
    }
};

inventory.takeItem = async function(id, itemId, notify = true) {
    try {
        let user_id = user.getCache('id');
        let amount = await inventory.getInvAmount(user_id, inventory.types.Player);
        let amountMax = await inventory.getInvAmountMax(user_id, inventory.types.Player);
        //console.log(amount, amountMax, "amounts");
        if (items.getItemAmountById(itemId) + amount > amountMax) {
            mp.game.ui.notifications.show("~r~Инвентарь заполнен");
            return;
        }

        inventory.updateOwnerId(id, user.getCache('id'), inventory.types.Player)
        user.playAnimation("pickup_object","pickup_low", 8);
        inventory.deleteItemProp(id);
        if (!notify) return;
        mp.game.ui.notifications.show(`~g~Вы взяли \"${items.getItemNameById(itemId)}\"`);
        chat.sendMeCommand(`взял \"${items.getItemNameById(itemId)}\"`);
    }
    catch (e) {
        methods.debug(e);
    }
};

inventory.giveItem = async function(id, itemId, playerId, notify = true) {
    try {
        let user_id = user.getCache('id');
        let amount = await inventory.getInvAmount(playerId, inventory.types.Player);
        let amountMax = await inventory.getInvAmountMax(playerId, inventory.types.Player);
        if (items.getItemAmountById(itemId) + amount > amountMax) {
            mp.game.ui.notifications.show("~r~Инвентарь заполнен");
            return;
        }
        //Shared.TriggerEventToAllPlayers("ARP:UserPlayAnimationToAll", playerId, "mp_common","givetake2_a", 8);
        //mp.events.callRemote("server:playAnimationByPlayerId", playerId, "mp_common", "givetake2_a", 8);
        user.playAnimation("mp_common","givetake1_a", 8);

        inventory.updateItemOwnerServer(id, inventory.types.Player, playerId);
        inventory.updateAmount(playerId, inventory.types.Player);
        inventory.updateAmount(user_id, inventory.types.Player);

        if (!notify) return;
        mp.game.ui.notifications.show(`~g~Вы передали \"${items.getItemNameById(itemId)}\" игроку`);
        chat.sendMeCommand(`передал \"${items.getItemNameById(itemId)}\" человеку рядом`);
    }
    catch (e) {
        methods.debug(e);
    }
};

inventory.takeDrugItem = async function(id, itemId, countItems, notify = true, takeCount = 1) {
    countItems = countItems - takeCount;

    let user_id = user.getCache('id');
    let amount = await inventory.getInvAmount(user_id, inventory.types.Player);
    let amountMax = await inventory.getInvAmountMax(user_id, inventory.types.Player);

    let newItemId = 2;

    switch (itemId)
    {
        case 142:
        case 144:
        case 154:
        case 156:
            if (takeCount == 1)
                newItemId = 2;
            if (takeCount == 10)
                newItemId = 154;
            if (takeCount == 50)
                newItemId = 156;
            break;
        case 143:
        case 145:
        case 155:
        case 157:
            if (takeCount == 1)
                newItemId = 3;
            if (takeCount == 10)
                newItemId = 155;
            if (takeCount == 50)
                newItemId = 157;
            break;
        case 163:
        case 164:
        case 171:
        case 176:
            if (takeCount == 1)
                newItemId = 158;
            if (takeCount == 10)
                newItemId = 171;
            if (takeCount == 50)
                newItemId = 176;
            break;
        case 165:
        case 166:
        case 172:
        case 177:
            if (takeCount == 1)
                newItemId = 159;
            if (takeCount == 10)
                newItemId = 172;
            if (takeCount == 50)
                newItemId = 177;
            break;
        case 167:
        case 168:
        case 173:
        case 178:
            if (takeCount == 1)
                newItemId = 160;
            if (takeCount == 10)
                newItemId = 173;
            if (takeCount == 50)
                newItemId = 178;
            break;
        case 169:
        case 174:
        case 179:
            if (takeCount == 1)
                newItemId = 161;
            if (takeCount == 10)
                newItemId = 174;
            if (takeCount == 50)
                newItemId = 179;
            break;
        case 170:
        case 175:
        case 180:
            if (takeCount == 1)
                newItemId = 162;
            if (takeCount == 10)
                newItemId = 175;
            if (takeCount == 50)
                newItemId = 180;
            break;
    }

    if (items.getItemAmountById(itemId) + amount > amountMax) {
        mp.game.ui.notifications.show("~r~Инвентарь заполнен");
        return;
    }

    UIMenu.Menu.HideMenu();

    inventory.addItemServer(newItemId, 1, inventory.types.Player, user_id, takeCount, -1, -1, -1);
    inventory.updateAmount(user_id, inventory.types.Player);

    if (countItems <= 0)
        inventory.deleteItemServer(id);
    else
    {
        inventory.updateItemCountServer(id, countItems);
        inventory.getInfoItem(id);
    }

    if (!notify) return;
    mp.game.ui.notifications.show(`~g~Вы взяли \"${items.getItemNameById(newItemId)}\"`);
    chat.sendMeCommand(`взял ${takeCount}гр наркотиков`);
};

inventory.takeCountItem = async function(id, itemId, countItems, notify = true, takeCount = 1) {
    countItems = countItems - takeCount;

    let user_id = user.getCache('id');
    let amount = await inventory.getInvAmount(user_id, inventory.types.Player);
    let amountMax = await inventory.getInvAmountMax(user_id, inventory.types.Player);

    let newItemId = 2;

    switch (itemId)
    {
        case 275:
            if (takeCount == 1)
                newItemId = 4;
            break;
        case 276:
            if (takeCount == 1)
                newItemId = 263;
            break;
    }

    if (items.getItemAmountById(itemId) + amount > amountMax) {
        mp.game.ui.notifications.show("~r~Инвентарь заполнен");
        return;
    }

    inventory.addItemServer(newItemId, 1, inventory.types.Player, user_id, takeCount, -1, -1, -1);
    inventory.updateAmount(user_id, inventory.types.Player);

    if (countItems <= 0)
        inventory.deleteItemServer(id);
    else
    {
        inventory.updateItemCountServer(id, countItems);
        inventory.getInfoItem(id);
    }

    if (!notify) return;
    mp.game.ui.notifications.show(`~g~Вы взяли \"${items.getItemNameById(newItemId)}\"`);
    chat.sendMeCommand(`взял ${takeCount}шт предмета`);
};

inventory.getInvAmount = async function(id, type) {
    //return await container.Data.Get(id, "invAmount:" + type);
    if (container.Data.HasLocally(id, "invAmount:" + type))
        return container.Data.GetLocally(id, "invAmount:" + type);

    if (await container.Data.Has(id, "invAmount:" + type))
        return await container.Data.Get(id, "invAmount:" + type);

    inventory.updateAmount(id, type);
    await methods.sleep(1000);
    return container.Data.GetLocally(id, "invAmount:" + type);
};

inventory.setInvAmount = function(id, type, data) {
    container.Data.Set(id, "invAmount:" + type, data);
    container.Data.SetLocally(id, "invAmount:" + type, data);
};

inventory.getInvAmountMax = async function(id, type) {
    if (container.Data.HasLocally(id, "invAmountMax:" + type)) {
        return container.Data.GetLocally(id, "invAmountMax:" + type);
    }
    if (await container.Data.Has(id, "invAmountMax:" + type)) {
        return await container.Data.Get(id, "invAmountMax:" + type);
    }
    inventory.updateAmountMax(id, type);
    await methods.sleep(1000);
    return container.Data.GetLocally(id, "invAmountMax:" + type);
};

inventory.setInvAmountMax = function(id, type, data) {
    container.Data.Set(id, "invAmountMax:" + type, data);
    container.Data.SetLocally(id, "invAmountMax:" + type, data);
};

inventory.calculatePlayerInvAmountMax = function() {
    return 30001;
};

inventory.updateAmountMax = function(id, type) {
    if (type == inventory.types.Vehicle)
    {
        let veh = methods.getNearestVehicleWithCoords(mp.players.local.position, 5.0);
        if (veh) {
            inventory.setInvAmountMax(id, type, methods.getVehicleInfo(veh.model).stock);
        } else {
            return;
        }
    }
    else
    {
        let invAmountMax = inventory.calculatePlayerInvAmountMax();
        if (type == inventory.types.World)
            invAmountMax = 999999999;
        else if (type == inventory.types.Apartment)
            invAmountMax = 200000;
        else if (type == inventory.types.House)
            invAmountMax = 200000;
        else if (type == inventory.types.Player)
            invAmountMax = inventory.calculatePlayerInvAmountMax();
        else if (type == inventory.types.Bag)
            invAmountMax = 50000;
        else if (type == inventory.types.BagSmall)
            invAmountMax = 20000;
        else if (type == inventory.types.StockGang)
            invAmountMax = 21000000;
        else if (type == inventory.types.Fridge)
            invAmountMax = 100000;
        //Main.GetKitchenAmount();
        else if (type == 12 || type == 13)
            invAmountMax = 750000;
        else if (type >= 14 && type <= 17)
            invAmountMax = 1100000;
        else if (type >= 18 && type <= 22 || type == 11)
            invAmountMax = 950000;
        inventory.setInvAmountMax(id, type, invAmountMax);
    }
};

inventory.sendToPlayerItemListUpdateAmountMenu = function(data, ownerType, ownerId) {
    try {
        let sum = 0;
        data.forEach(property => {
            sum = sum + items.getItemAmountById(property[1]);
        });
        inventory.setInvAmount(ownerId, ownerType, sum);
    }
    catch (e) {
        methods.debug(e);
    }
};

inventory.updateAmount = function(id, type) {
    mp.events.callRemote('server:inventory:updateAmount', id, type);
};

inventory.addItem = function(itemId, count, ownerType, ownerId, countItems, isEquip = 0, params = "{}", timeout = 10) {
    mp.events.callRemote('server:inventory:addItem', itemId, count, ownerType, ownerId, countItems, isEquip, params, timeout);
};

inventory.updateItemServer = function(itemId, count, ownerType, ownerId, countItems, prefix, number, keyId) {
    //TriggerServerEvent("ARP:Inventory:UpdateItem", id, itemId, ownerType, ownerId, countItems, prefix, number, keyId);
};

inventory.updateItemOwnerServer = function(id, ownerType, ownerId) {
    mp.events.callRemote('server:inventory:updateItemOwner', id, ownerType, ownerId);
};

inventory.updateItemCountServer = function(id, count) {
    mp.events.callRemote('server:inventory:updateItemCount', id, count);
};

inventory.addItemPosServer = function(itemId, pos, rot, count, ownerType, ownerId) {
    //TriggerServerEvent("ARP:Inventory:AddItemPos", itemId, pos.X, pos.Y, pos.Z, rot.X, rot.Y, rot.Z, count, ownerType, ownerId);
};

inventory.updateItemPosServer = function(id, itemId, pos, rot, ownerType, ownerId) {
    //TriggerServerEvent("ARP:Inventory:UpdateItemPos", id, itemId, pos.X, pos.Y, pos.Z, rot.X, rot.Y, rot.Z, ownerType, ownerId);
};

inventory.getItemList = function(ownerType, ownerId) {
    mp.events.callRemote('server:inventory:getItemList', ownerType, ownerId.toString());
};

inventory.data = function(id, itemId, prop, model, pos, rot, ownerType, ownerId, count, isCreate, isDelete) {
    this.id = id;
    this.itemId = itemId;
    this.prop = prop;
    this.model = model;
    this.pos = pos;
    this.rot = rot;
    this.ownerType = ownerType;
    this.ownerId = ownerId;
    this.count = count;
    this.isCreate = isCreate;
    this.isDelete = isDelete;
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

export default inventory;