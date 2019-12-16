"use strict";

let user = require('../user');
let enums = require('../enums');
let Container = require('./data');
let methods = require('./methods');
let houses = require('../property/houses');
let cloth = require('../business/cloth');
let tattoo = require('../business/tattoo');
let pickups = require('../managers/pickups');

mp.events.addRemoteCounted = (eventName, handler) =>
{
    mp.events.add(eventName, function()
    {
        let plr = arguments[0];

        if(++plr.countedTriggers > 80)
        {
            let dateNow = Date.now();

            if((dateNow - plr.countedTriggersSwap) < 500)
            {
                //methods.saveLog('BugWithFlood', `${plr.socialClub} | ${user.getRpName(plr)} | ${eventName}`);
                //plr.ban();
                //user.kick(plr, 'Подозрение в не хороших вещах');
                //user.kickAntiCheat(plr, 'Buguse');
                return;
            }
            else
            {
                plr.countedTriggers = 0;
                plr.countedTriggersSwap = dateNow;
            }
        }
        else if(plr.countedTriggers > 20)
        {
            let dateNow = Date.now();

            if((dateNow - plr.countedTriggersSwap) < 1000)
            {
                //methods.saveLog('BugWithFloodSlow', `${plr.socialClub} | ${user.getRpName(plr)} | ${eventName}`);
                return;
            }
            else
            {
                plr.countedTriggers = 0;
                plr.countedTriggersSwap = dateNow;
            }
        }

        handler.apply(null, arguments);
    });
};


mp.events.add('modules:server:data:Set', (player, id, key, value) => {
    Container.Data.SetClient(id, key, value);
});

mp.events.addRemoteCounted('modules:server:data:Reset', (player, id, key) => {
    Container.Data.Reset(id, key);
});

mp.events.addRemoteCounted('modules:server:data:ResetAll', (player, id) => {
    Container.Data.ResetAll(id);
});

mp.events.addRemoteCounted('modules:server:data:Get', (player, promiseId, id, key) => {
    try {
        Container.Data.GetClient(player, promiseId, id, key);
    }
    catch (e) {
        methods.debug('modules:server:data:Get');
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('modules:server:data:GetAll', (player, promiseId, id) => {
    try {
        Container.Data.GetAllClient(player, promiseId, id);
    }
    catch (e) {
        methods.debug('modules:server:data:GetAll');
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('modules:server:data:Has', (player, promiseId, id, key) => {
    try {
        Container.Data.HasClient(player, promiseId, id, key);
    }
    catch (e) {
        methods.debug('modules:server:data:Has');
        methods.debug(e);
    }
});


mp.events.add('server:clientDebug', (player, message) => {
    try {
        console.log(`[DEBUG-CLIENT][${player.socialClub}]: ${message}`)
    } catch (e) {
        console.log(e);
    }
});

mp.events.add('server:user:createAccount', (player, login, password, email) => {
    try {
        user.createAccount(player, login, password, email);
    } catch (e) {
        console.log(e);
    }
});

mp.events.add('server:user:createUser', (player, name, surname, age, national) => {
    try {
        user.createUser(player, name, surname, age, national);
    } catch (e) {
        console.log(e);
    }
});

mp.events.add('server:user:loginAccount', (player, login, password) => {
    try {
        user.loginAccount(player, login, password);
    } catch (e) {
        console.log(e);
    }
});

mp.events.add('server:user:loginUser', (player, login, spawnName) => {
    try {
        user.loginUser(player, login, spawnName);
    } catch (e) {
        console.log(e);
    }
});

mp.events.add('server:user:setPlayerModel', (player, model) => {
    try {
        if (mp.players.exists(player))
            player.model = mp.joaat(model);
    } catch (e) {
        console.log(e);
    }
});

mp.events.add('server:user:setVirtualWorld', (player, vwId) => {
    try {
        if (mp.players.exists(player))
            player.dimension = vwId;
    } catch (e) {
        console.log(e);
    }
});

mp.events.add('server:user:serVariable', (player, key, val) => {
    try {
        if (mp.players.exists(player))
            player.setVariable(key, val);
    } catch (e) {
        console.log(e);
    }
});

mp.events.add('server:user:setDecoration', (player, slot, type) => {
    user.setDecoration(player, slot, type);
});

mp.events.add('server:user:clearDecorations', (player) => {
    user.clearDecorations(player);
});

mp.events.add('server:user:updateCharacterCloth', (player) => {
    user.updateCharacterCloth(player);
});

mp.events.add('server:user:updateCharacterFace', (player) => {
    user.updateCharacterFace(player);
});

mp.events.add('server:user:setComponentVariation', (player, component, drawableId, textureId) => {
    user.setComponentVariation(player, component, drawableId, textureId);
});

mp.events.add('server:user:setProp', (player, slot, type, color) => {
    user.setProp(player, slot, type, color);
});

mp.events.add('server:user:clearAllProp', (player) => {
    user.clearAllProp(player);
});

mp.events.addRemoteCounted('server:enums:getCloth', (player, requestID) => {
    try {
        player.call('client:enums:updateCloth', [requestID, JSON.stringify(enums.hairOverlays), JSON.stringify(enums.clothM), JSON.stringify(enums.clothF), JSON.stringify(enums.propM), JSON.stringify(enums.propF)]);
    } catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:enums:getCloth1', (player, requestID) => {
    try {
        player.call('client:enums:updateCloth1', [requestID, JSON.stringify(enums.tattooList), JSON.stringify(enums.printList)]);
    } catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:players:notifyWithPictureToAll', (player, title, sender, message, notifPic, icon, flashing, textColor, bgColor, flashColor) => {
    methods.notifyWithPictureToAll(title, sender, message, notifPic, icon, flashing, textColor, bgColor, flashColor);
});

mp.events.addRemoteCounted('server:players:notifyWithPictureToFraction', (player, title, sender, message, notifPic, fractionId, icon, flashing, textColor, bgColor, flashColor) => {
    methods.notifyWithPictureToFraction(title, sender, message, notifPic, fractionId, icon, flashing, textColor, bgColor, flashColor);
});

mp.events.addRemoteCounted('server:players:notifyWithPictureToFraction2', (player, title, sender, message, notifPic, fractionId, icon, flashing, textColor, bgColor, flashColor) => {
    methods.notifyWithPictureToFraction2(title, sender, message, notifPic, fractionId, icon, flashing, textColor, bgColor, flashColor);
});

mp.events.addRemoteCounted('server:players:notifyToFraction', (player, message, fractionId) => {
    methods.notifyToFraction(message, fractionId);
});

mp.events.addRemoteCounted('server:players:notifyToAll', (player, message) => {
    methods.notifyToAll(message);
});

mp.events.addRemoteCounted('server:user:setComponentVariation', (player, component, drawableId, textureId) => {
    user.setComponentVariation(player, component, drawableId, textureId);
});

mp.events.addRemoteCounted('server:business:cloth:change', (player, body, clothId, color, torso, torsoColor, parachute, parachuteColor) => {
    if (!user.isLogin(player))
        return;
    cloth.change(player, body, clothId, color, torso, torsoColor, parachute, parachuteColor);
});

mp.events.addRemoteCounted('server:business:cloth:buy', (player, price, body, clothId, color, torso, torsoColor, parachute, parachuteColor, itemName, shopId, isFree) => {
    if (!user.isLogin(player))
        return;
    cloth.buy(player, price, body, clothId, color, torso, torsoColor, parachute, parachuteColor, itemName, shopId, isFree);
});

mp.events.addRemoteCounted('server:business:cloth:changeMask', (player, clothId, color) => {
    if (!user.isLogin(player))
        return;
    cloth.changeMask(player, clothId, color);
});

mp.events.addRemoteCounted('server:business:cloth:buyMask', (player, price, clothId, color, itemName, shopId) => {
    if (!user.isLogin(player))
        return;
    cloth.buyMask(player, price, clothId, color, itemName, shopId);
});

mp.events.addRemoteCounted('server:business:cloth:changeProp', (player, body, clothId, color) => {
    if (!user.isLogin(player))
        return;
    cloth.changeProp(player, body, clothId, color);
});

mp.events.addRemoteCounted('server:business:cloth:buyProp', (player, price, body, clothId, color, itemName, shopId, isFree) => {
    if (!user.isLogin(player))
        return;
    cloth.buyProp(player, price, body, clothId, color, itemName, shopId, isFree);
});

mp.events.addRemoteCounted('server:tattoo:buy', (player, slot, type, zone, price, itemName, shopId) => {
    if (!user.isLogin(player))
        return;
    tattoo.buy(player, slot, type, zone, price, itemName, shopId);
});

mp.events.addRemoteCounted('server:tattoo:destroy', (player, slot, type, zone, price, itemName, shopId) => {
    if (!user.isLogin(player))
        return;
    tattoo.destroy(player, slot, type, zone, price, itemName, shopId);
});

mp.events.add('server:user:save', (player) => {
    user.save(player);
});

mp.events.add('server:houses:insert', (player, interior, number, price, zone, street) => {
    houses.insert(player, number, street, zone, player.position.x, player.position.y, player.position.z, player.heading, interior, price);
});

mp.events.add('server:user:getPlayerPos', (player) => {
    console.log(`PlayerPos: ${player.position.x}, ${player.position.y}, ${player.position.z}, ${player.heading}`)
});

mp.events.addRemoteCounted("onKeyPress:E", (player) => {

    if (!user.isLogin(player))
        return;

    pickups.checkPressE(player);

    houses.getAllHouses().forEach((val, key, object) => {
        if (methods.distanceToPos(player.position, val.position) < 1.5) {
            let houseData = houses.getHouseData(key);
            if (houseData.get('user_id') == 0)
                player.call('client:showHouseBuyMenu', [Array.from(houseData)]);
            else {
                player.call('client:showHouseOutMenu', [Array.from(houseData)]);
            }
        }
    });

    if (player.dimension > 0) {

        houses.interiorList.forEach(function(item) {
            let x = item[0];
            let y = item[1];
            let z = item[2];

            if (methods.distanceToPos(player.position, new mp.Vector3(x, y, z)) < 1.5) {
                let houseData = houses.getHouseData(player.dimension);
                player.call('client:showHouseInMenu', [Array.from(houseData)]);
            }

            methods.createStaticCheckpoint(x, y, z, "Нажмите ~g~Е~s~ чтобы открыть меню");
        });

        /*let houseData = houses.getHouseData(player.dimension);
        if (methods.distanceToPos(player.position, new mp.Vector3(houseData.get('int_x'), houseData.get('int_y'), houseData.get('int_z'))) < 1.5)
            player.call('client:showHouseInMenu', [Array.from(houseData)]);*/
        // Kitchen
        /*enums.kitchenIntData.forEach(function(item, i, arr) {
            let pos = new mp.Vector3(item[0], item[1], item[2]);
            if (methods.distanceToPos(player.position, pos) < 1.5) {
                player.call('client:showKitchenMenu');
            }
        });*/
    }
});

//Houses
mp.events.addRemoteCounted("server:houses:enter", (player, id) => {
    if (!user.isLogin(player))
        return;
    houses.enter(player, id);
});

mp.events.addRemoteCounted("server:houses:buy", (player, id) => {
    if (!user.isLogin(player))
        return;
    houses.buy(player, id);
});

mp.events.addRemoteCounted("server:houses:updatePin", (player, id, pin) => {
    if (!user.isLogin(player))
        return;
    houses.updatePin(id, pin);
});


mp.events.addRemoteCounted("server:houses:lockStatus", (player, id, lockStatus) => {
    if (!user.isLogin(player))
        return;
    houses.lockStatus(id, lockStatus);
});


mp.events.addRemoteCounted("playerEnterCheckpoint", (player, checkpoint) => {
    if (!user.isLogin(player))
        return;
    if (Container.Data.Has(999999, 'checkpointLabel' + checkpoint.id))
        player.notify(Container.Data.Get(999999, 'checkpointLabel' + checkpoint.id).toString());
});

mp.events.add("client:enterStaticCheckpoint", (player, checkpointId) => {
    if (!user.isLogin(player))
        return;
    if (Container.Data.Has(999999, 'checkpointStaticLabel' + checkpointId))
        player.notify(Container.Data.Get(999999, 'checkpointStaticLabel' + checkpointId).toString());
});

mp.events.addRemoteCounted('server:fixCheckpointList', (player) => {
    methods.updateCheckpointList(player);
});

mp.events.add('playerJoin', player => {
    player.dimension = player.id + 1;
    player.countedTriggers = 0;
    player.countedTriggersSwap = 0;
    //player.outputChatBox("RAGE_Multiplayer HAS BEEN STARTED.");
});

mp.events.add('playerReady', player => {
    player.spawn(new mp.Vector3(8.243752, 527.4373, 171.6173));

    player.notify = function(message, flashing = false, textColor = -1, bgColor = -1, flashColor = [77, 77, 77, 200]) {
        try {
            this.call("BN_Show", [message, flashing, textColor, bgColor, flashColor]);
        }
        catch (e) {
            methods.debug(e);
        }
    };

    player.notifyWithPicture = function(title, sender, message, notifPic, icon = 0, flashing = false, textColor = -1, bgColor = -1, flashColor = [77, 77, 77, 200]) {
        try {
            this.call("BN_ShowWithPicture", [title, sender, message, notifPic, icon, flashing, textColor, bgColor, flashColor]);
        }
        catch (e) {
            methods.debug(e);
        }
    };

    player.dimension = player.id + 1;
    try {
        Container.Data.ResetAll(player.id);
    }
    catch (e) {
        methods.debug(e);
    }
});

process.on('exit', (code) => {
    methods.debug(code);
});

/*process.on('SIGINT', shutdownProcess);  // Runs when you Ctrl + C in console
process.on('SIGHUP', shutdownProcess);  // Runs when you press the 'Close' button on your server.exe window
//process.on('SIGKILL', shutdownProcess);
function shutdownProcess(){
    process.exit(0);
}*/

process
    .on('unhandledRejection', (reason, p) => {
        console.error(reason, 'Unhandled Rejection at Promise', p);
    })
    .on('uncaughtException', err => {
        console.error(err, 'Uncaught Exception thrown');
    });
