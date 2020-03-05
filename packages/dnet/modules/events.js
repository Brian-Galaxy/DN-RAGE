"use strict";

let user = require('../user');
let enums = require('../enums');
let coffer = require('../coffer');
let inventory = require('../inventory');
let phone = require('../phone');
let weapons = require('../weapons');
let items = require('../items');
let admin = require('../admin');

let Container = require('./data');
let methods = require('./methods');
let mysql = require('./mysql');
let chat = require('./chat');

let houses = require('../property/houses');
let stocks = require('../property/stocks');
let condos = require('../property/condos');
let business = require('../property/business');
let vehicles = require('../property/vehicles');
let fraction = require('../property/fraction');

let cloth = require('../business/cloth');
let tattoo = require('../business/tattoo');
let lsc = require('../business/lsc');
let gun = require('../business/gun');
let vShop = require('../business/vShop');
let rent = require('../business/rent');
let bank = require('../business/bank');
let shop = require('../business/shop');
let fuel = require('../business/fuel');
let bar = require('../business/bar');
let barberShop = require('../business/barberShop');
let carWash = require('../business/carWash');

let pickups = require('../managers/pickups');
let dispatcher = require('../managers/dispatcher');
let weather = require('../managers/weather');
let gangWar = require('../managers/gangWar');
let ems = require('../managers/ems');
let tax = require('../managers/tax');
let discord = require('../managers/discord');

mp.events.__add__ = mp.events.add;

mp.events.add = (eventName, eventCallback) => {
    const proxy = new Proxy(eventCallback, {
        apply: (target, thisArg, argumentsList) => {
            const entity = argumentsList[0];
            const entityType = entity ? entity.type : null;
            const entityName = entityType !== null ? entityType === 'player' ? entity.socialClub : `${entity.type}(${entity.id})` : null;

            const callText = entityName !== null ? `${entityName} call event ${eventName}` : `Event ${eventName} called`;

            if (eventName != 'server:clientDebug')
                methods.debug(callText, argumentsList.slice(1));

            target.apply(thisArg, argumentsList);
            return;
        }
    });

    mp.events.__add__(eventName, proxy);
};

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


mp.events.add('modules:server:data:Set', (player, id, key, value, isInt) => {
    Container.Data.SetClient(id, key, value, isInt);
});

mp.events.add('modules:server:data:SetGroup', (player, data) => {
    Container.Data.SetGroupClient(data);
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
        console.log(`[DEBUG-CLIENT][${player.socialClub}]: ${message}`);
        //methods.saveFile('log', `[DEBUG-CLIENT][${player.socialClub}]: ${message}`);
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:user:respawn', (player, x, y, z) => {
    if (!user.isLogin(player))
        return;
    user.setHealth(player, 100);
    player.spawn(new mp.Vector3(x, y, z));
    user.stopAnimation(player);
});

mp.events.addRemoteCounted('server:user:createAccount', (player, login, password, email) => {
    try {
        user.createAccount(player, login, password, email);
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:user:createUser', (player, name, surname, age, promocode, referer, national) => {
    try {
        user.createUser(player, name, surname, age, promocode, referer, national);
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:user:loginAccount', (player, login, password) => {
    try {
        user.loginAccount(player, login, password);
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:user:loginUser', (player, login, spawnName) => {
    try {
        user.loginUser(player, login, spawnName);
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:user:setPlayerModel', (player, model) => {
    try {
        if (mp.players.exists(player))
            player.model = mp.joaat(model);
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:user:setHeal', (player, level) => {
    try {
        if (mp.players.exists(player))
            player.health = level;
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:user:setVirtualWorld', (player, vwId) => {
    try {
        if (mp.players.exists(player))
            player.dimension = vwId;
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:user:setVirtualWorldVeh', (player, vwId) => {
    try {
        if (mp.players.exists(player.vehicle))
            player.vehicle.dimension = vwId;
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:user:setAlpha', (player, alpha) => {
    try {
        player.alpha = alpha;
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:user:serVariable', (player, key, val) => {
    try {
        methods.debug('server:user:serVariable', key, val);
        if (mp.players.exists(player))
            player.setVariable(key, val);
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:user:generateCryptoCard', (player) => {
    try {
        user.set(player, 'crypto_card', methods.md5(`${methods.getTimeStamp()}${player.socialClub}`));
        user.save(player);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:user:setDecoration', (player, slot, type) => {
    user.setDecoration(player, slot, type);
});

mp.events.addRemoteCounted('server:user:clearDecorations', (player) => {
    user.clearDecorations(player);
});

mp.events.addRemoteCounted('server:user:updateCharacterCloth', (player) => {
    user.updateCharacterCloth(player);
});

mp.events.addRemoteCounted('server:user:updateCharacterFace', (player) => {
    user.updateCharacterFace(player);
});

mp.events.addRemoteCounted('server:user:setComponentVariation', (player, component, drawableId, textureId) => {
    user.setComponentVariation(player, component, drawableId, textureId);
});

mp.events.addRemoteCounted('server:user:setProp', (player, slot, type, color) => {
    user.setProp(player, slot, type, color);
});

mp.events.addRemoteCounted('server:user:clearAllProp', (player) => {
    user.clearAllProp(player);
});

mp.events.addRemoteCounted('server:user:kick', (player, reason) => {
    user.kick(player, reason);
});

mp.events.addRemoteCounted('server:user:kickAntiCheat', (player, reason) => {
    user.kickAntiCheat(player, reason);
});

mp.events.addRemoteCounted('server:user:banAntiCheat', (player, type, reason) => {
    admin.banByAnticheat(0, player.id, type, reason);
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
        player.call('client:enums:updateCloth1', [requestID, JSON.stringify(enums.tattooList), JSON.stringify(enums.printList), JSON.stringify(enums.fractionListId)]);
    } catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:playScenario', (player, name) => {
    if (!user.isLogin(player))
        return;
    //player.playScenario(name);
    user.playScenario(player, name);
});

mp.events.addRemoteCounted('server:playAnimation', (player, name1, name2, flag) => {
    if (!user.isLogin(player))
        return;
    user.playAnimation(player, name1, name2, flag);
    //mp.players.call('client:syncAnimation', [player.id, name1, name2, flag]);
});

mp.events.addRemoteCounted('server:setRagdoll', (player, timeout) => {
    if (!user.isLogin(player))
        return;
    user.setRagdoll(player, timeout);
});

mp.events.addRemoteCounted('server:stopAllAnimation', (player) => {
    try {
        user.stopAnimation(player);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:playAnimationWithUser', (player, userId, animId) => {
    if (!user.isLogin(player))
        return;
    user.playAnimationWithUser(player, mp.players.at(userId), animId);
});

mp.events.addRemoteCounted('playAnimationWithUserAsk', (player, userId, animId) => {
    if (!user.isLogin(player))
        return;
    let target = user.getPlayerById(userId);
    if (user.isLogin(target)) {
        if (methods.distanceToPos(target.position, player.position) < 3) {
            player.notify('~r~Вы слишком далеко');
            return;
        }
    }
    else
        player.notify('~r~Вы слишком далеко');
});

mp.events.addRemoteCounted('server:playAnimationByPlayerId', (player, playerId, name1, name2, flag) => {
    if (!user.isLogin(player))
        return;
    user.playAnimation(user.getPlayerById(playerId), name1, name2, flag);
    //mp.players.call('client:syncAnimation', [player.id, name1, name2, flag]);
});

mp.events.addRemoteCounted('server:discord:sendDiscordServerNews', (player, title, sender, message) => {
    if (user.get(player, 'fraction_id') === 1)
        discord.sendFractionList(title, sender, message, discord.socialClub + player.socialClub.toLowerCase(), discord.imgGov, discord.colorGov);
    if (user.get(player, 'fraction_id') === 2)
        discord.sendFractionList(title, sender, message, discord.socialClub + player.socialClub.toLowerCase(), discord.imgLspd, discord.colorLspd);
    if (user.get(player, 'fraction_id') === 3)
        discord.sendFractionList(title, sender, message, discord.socialClub + player.socialClub.toLowerCase(), discord.imgFib, discord.colorFib);
    if (user.get(player, 'fraction_id') === 4)
        discord.sendFractionList(title, sender, message, discord.socialClub + player.socialClub.toLowerCase(), discord.imgUsmc, discord.colorUsmc);
    if (user.get(player, 'fraction_id') === 5)
        discord.sendFractionList(title, sender, message, discord.socialClub + player.socialClub.toLowerCase(), discord.imgSheriff, discord.colorSheriff);
    if (user.get(player, 'fraction_id') === 6)
        discord.sendFractionList(title, sender, message, discord.socialClub + player.socialClub.toLowerCase(), discord.imgEms, discord.colorEms);
    if (user.get(player, 'fraction_id') === 7)
        discord.sendFractionList(title, sender, message, discord.socialClub + player.socialClub.toLowerCase(), discord.imgInvader, discord.colorInvader);
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

mp.events.addRemoteCounted('server:user:updateTattoo', (player) => {
    user.updateTattoo(player);
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

mp.events.addRemoteCounted('server:print:buy', (player, slot, type, price) => {
    if (!user.isLogin(player))
        return;
    cloth.buyPrint(player, slot, type, price);
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

mp.events.addRemoteCounted('server:user:buyLicense', (player, type, price, month) => {
    user.buyLicense(player, type, price, month);
});

mp.events.addRemoteCounted('server:user:sendSms', (player, sender, title, text, pic) => {
    if (!user.isLogin(player))
        return;
    user.sendSms(player, sender, title, text, pic);
});

mp.events.addRemoteCounted('server:user:addHistory', (player, type, reason) => {
    if (!user.isLogin(player))
        return;
    user.addHistory(player, type, reason);
});

mp.events.addRemoteCounted('server:bank:withdraw', (player, money, procent) => {
    if (!user.isLogin(player))
        return;
    bank.withdraw(player, money, procent);
});

mp.events.addRemoteCounted('server:bank:deposit', (player, money, procent) => {
    if (!user.isLogin(player))
        return;
    bank.deposit(player, money, procent);
});

mp.events.addRemoteCounted('server:bank:transferMoney', (player, bankNumber, money) => {
    if (!user.isLogin(player))
        return;
    bank.transferMoney(player, methods.parseInt(bankNumber), money);
});

mp.events.addRemoteCounted('server:bank:changePin', (player, pin) => {
    if (!user.isLogin(player))
        return;
    bank.changePin(player, pin);
});

mp.events.addRemoteCounted('server:bank:history', (player,) => {
    if (!user.isLogin(player))
        return;

    mysql.executeQuery(`SELECT * FROM log_bank_user WHERE card = ${methods.parseInt(user.get(player, 'bank_card'))} ORDER BY id DESC LIMIT 200`, function (err, rows, fields) {
        try {
            let list = [];
            rows.forEach(function(item) {

                let price = item['price'];
                if (item['price'] < 0)
                    price = '~r~' + methods.moneyFormat(item['price']);
                else if (item['price'] == 0)
                    price = '';
                else
                    price = '~g~' + methods.moneyFormat(item['price']);

                list.push({id: item['id'], text: item['text'], price: price, timestamp: item['timestamp'], rp_datetime: item['rp_datetime']});
            });
            player.call('client:showBankLogMenu', [JSON.stringify(list)]);
        }
        catch (e) {
            methods.debug(e);
        }
    });
});

mp.events.addRemoteCounted('server:bank:changeCardNumber', (player, bankNumber) => {
    if (!user.isLogin(player))
        return;
    //bank.changeCardNumber(player, bankNumber);
});

mp.events.addRemoteCounted('server:bank:closeCard', (player) => {
    if (!user.isLogin(player))
        return;
    bank.closeCard(player);
});

mp.events.addRemoteCounted('server:bank:openCard', (player, bankId, priceCard) => {
    if (!user.isLogin(player))
        return;
    bank.openCard(player, bankId, priceCard);
});

mp.events.addRemoteCounted('server:rent:buy', (player, hash, price, shopId) => {
    if (!user.isLogin(player))
        return;
    rent.buy(player, hash, price, shopId);
});

mp.events.addRemoteCounted('server:user:showPlayerHistory', (player,) => {
    if (!user.isLogin(player))
        return;

    mysql.executeQuery(`SELECT * FROM log_player WHERE user_id = ${user.getId(player)} ORDER BY id DESC LIMIT 200`, function (err, rows, fields) {
        try {
            let list = [];
            rows.forEach(function(item) {
                list.push({id: item['id'], text: item['do'], timestamp: item['timestamp'], rp_datetime: item['rp_datetime']});
            });
            player.call('client:showPlayerHistoryMenu', [JSON.stringify(list)]);
        }
        catch (e) {
            methods.debug(e);
        }
    });
});

mp.events.addRemoteCounted('server:user:save', (player) => {
    user.save(player);
});

mp.events.addRemoteCounted('server:gps:findFleeca', (player) => {
    if (!user.isLogin(player))
        return;
    let pos = bank.findNearestFleeca(player.position);
    user.setWaypoint(player, pos.x, pos.y);
});

mp.events.addRemoteCounted('server:gps:find247', (player) => {
    if (!user.isLogin(player))
        return;
    let pos = shop.findNearestById(player.position, 0);
    user.setWaypoint(player, pos.x, pos.y);
});

mp.events.addRemoteCounted('server:gps:findApt', (player) => {
    if (!user.isLogin(player))
        return;
    let pos = shop.findNearestById(player.position, 6);
    user.setWaypoint(player, pos.x, pos.y);
});

mp.events.addRemoteCounted('server:gps:findEl', (player) => {
    if (!user.isLogin(player))
        return;
    let pos = shop.findNearestById(player.position, 5);
    user.setWaypoint(player, pos.x, pos.y);
});

mp.events.addRemoteCounted('server:gps:findFuel', (player) => {
    if (!user.isLogin(player))
        return;
    let pos = fuel.findNearest(player.position);
    user.setWaypoint(player, pos.x, pos.y);
});

mp.events.addRemoteCounted('server:gps:findRent', (player) => {
    if (!user.isLogin(player))
        return;
    let pos = rent.findNearest(player.position);
    user.setWaypoint(player, pos.x, pos.y);
});

mp.events.addRemoteCounted('server:gps:findGunShop', (player) => {
    if (!user.isLogin(player))
        return;
    let pos = gun.findNearest(player.position);
    user.setWaypoint(player, pos.x, pos.y);
});

mp.events.addRemoteCounted('server:gps:findBar', (player) => {
    if (!user.isLogin(player))
        return;
    let pos = bar.findNearest(player.position);
    user.setWaypoint(player, pos.x, pos.y);
});

mp.events.addRemoteCounted('server:gps:findBarberShop', (player) => {
    if (!user.isLogin(player))
        return;
    let pos = barberShop.findNearest(player.position);
    user.setWaypoint(player, pos.x, pos.y);
});

mp.events.addRemoteCounted('server:gps:findTattooShop', (player) => {
    if (!user.isLogin(player))
        return;
    let pos = tattoo.findNearest(player.position);
    user.setWaypoint(player, pos.x, pos.y);
});

mp.events.addRemoteCounted('server:gps:findLsc', (player) => {
    if (!user.isLogin(player))
        return;
    let pos = lsc.findNearest(player.position);
    user.setWaypoint(player, pos.x, pos.y);
});

mp.events.addRemoteCounted('server:gps:findCarWash', (player) => {
    if (!user.isLogin(player))
        return;
    let pos = carWash.findNearest(player.position);
    user.setWaypoint(player, pos.x, pos.y);
});

mp.events.addRemoteCounted('server:user:showLic', (player, lic, playerId) => {
    if (!user.isLogin(player))
        return;

    let remotePlayer = mp.players.at(playerId);
    if (remotePlayer && user.isLogin(remotePlayer)) {
        try {
            if (user.isCuff(remotePlayer) || user.isTie(remotePlayer)) {
                player.notify('~r~Игрок в наручниках');
                return;
            }

            if (methods.distanceToPos(remotePlayer.position, player.position) > 4) {
                player.notify('~r~Вы слишком далеко');
                return;
            }

            if (remotePlayer.id != player.id) {
                user.playAnimation(remotePlayer, "mp_common","givetake2_a", 8);
                user.playAnimation(player, "mp_common","givetake1_a", 8);
                chat.sendMeCommand(remotePlayer, 'посмотрел документы');
                chat.sendMeCommand(player, 'показал документы');
            }
            else
                chat.sendMeCommand(player, 'посмотрел документы');

            let menuData = new Map();

            if (lic == 'card_id') {

                let dataSend = {
                    type: 'updateValues',
                    isShow: true,
                    info: {
                        firstname: user.getRpName(player).split(' ')[0],
                        lastname: user.getRpName(player).split(' ')[1],
                        sex: user.getSexName(player),
                        age: user.get(player, 'age'),
                        nation: user.get(player, 'national'),
                        regist: user.getRegStatusName(player),
                        idcard: user.getId(player).toString(),
                        img: 'https://a.rsg.sc//n/' + player.socialClub.toLowerCase(),
                    },
                };
                user.callCef(remotePlayer, 'cardid', JSON.stringify(dataSend));

                /*menuData.set('ID', (user.getId(remotePlayer) + 10000000).toString());
                menuData.set('Имя', user.getRpName(remotePlayer));
                menuData.set('Тип регистрации', user.getRegStatusName(remotePlayer));
                menuData.set('Дата рождения', user.get(remotePlayer, 'age'));
                menuData.set('Пол', user.getSexName(player));
                menuData.set('Национальность', user.get(remotePlayer, 'national'));

                user.showMenu(remotePlayer, 'Card ID', user.getRpName(player), menuData);*/
            }
            else if (lic == 'work_lic') {

                if (user.get(player, 'work_lic') != '') {

                    let dataSend = {
                        type: 'updateValues',
                        isShow: true,
                        info: {
                            firstname: user.getRpName(player).split(' ')[0],
                            lastname: user.getRpName(player).split(' ')[1],
                            sex: user.getSexName(player),
                            age: user.get(player, 'age'),
                            first_work: user.getFractionName(player),
                            second_work: user.getJobName(player),
                            lvl_work: user.get(player, 'work_lvl').toString(),
                            experience: user.get(player, 'work_exp').toString(),
                            data: user.get(player, 'work_date'),
                            idwork: user.get(player, 'work_lic'),
                            img: 'https://a.rsg.sc//n/' + player.socialClub.toLowerCase(),
                        },
                    };
                    user.callCef(remotePlayer, 'workid', JSON.stringify(dataSend));

                    /*menuData.set('ID', user.get(remotePlayer, 'work_lic'));
                    menuData.set('Владелец', user.getRpName(remotePlayer));
                    menuData.set('Дата получения', user.get(remotePlayer, 'work_date'));

                    if (user.get(remotePlayer, 'job') > 0 && user.get(remotePlayer, 'fraction_id') > 0) {
                        menuData.set('Основная работа', user.getFractionName(remotePlayer));
                        menuData.set('Вторая работа', user.getJobName(remotePlayer));
                    }
                    else if (user.get(remotePlayer, 'fraction_id') > 0)
                        menuData.set('Работа', user.getFractionName(remotePlayer));
                    else
                        menuData.set('Работа', user.getJobName(remotePlayer));

                    menuData.set('Уровень рабочего', user.get(remotePlayer, 'work_lvl'));
                    menuData.set('Опыт рабочего', user.get(remotePlayer, 'work_exp'));
                    user.showMenu(remotePlayer, 'Work ID', user.getRpName(player), menuData);*/
                }
                else {
                    player.notify('~r~У Вас отсутствует Work ID');
                    if (remotePlayer.id != player.id)
                        remotePlayer.notify('~r~У игрока отсуствует Work ID');
                }
            }
            else {
                let licName = '';
                let licPref = 'L';

                switch (lic) {
                    case 'a_lic':
                        licName = 'Категория А';
                        licPref = 'A';
                        break;
                    case 'b_lic':
                        licName = 'Категория B';
                        licPref = 'B';
                        break;
                    case 'c_lic':
                        licName = 'Категория C';
                        licPref = 'C';
                        break;
                    case 'air_lic':
                        licName = 'Воздушный транспорт';
                        licPref = 'P';
                        break;
                    case 'ship_lic':
                        licName = 'Водный транспорт';
                        licPref = 'S';
                        break;
                    case 'taxi_lic':
                        licName = 'Перевозка пассажиров';
                        licPref = 'T';
                        break;
                    case 'law_lic':
                        licName = 'Юриста';
                        licPref = 'L';
                        break;
                    case 'gun_lic':
                        licName = 'На оружие';
                        licPref = 'G';
                        break;
                    case 'biz_lic':
                        licName = 'На предпринимательство';
                        licPref = 'Z';
                        break;
                    case 'fish_lic':
                        licName = 'На рыбаловство';
                        licPref = 'F';
                        break;
                    case 'med_lic':
                        licName = 'Мед. страховка';
                        licPref = 'M';
                        break;
                }

                if (user.get(player, lic)) {

                    let dataSend = {
                        type: 'updateValues',
                        isShow: true,
                        info: {
                            name: user.getRpName(player),
                            sex: user.getSexName(player),
                            license: licName,
                            date_start: user.get(player, lic + '_create'),
                            date_stop: user.get(player, lic + '_end'),
                            prefix: licPref,
                            img: 'https://a.rsg.sc//n/' + player.socialClub.toLowerCase(),
                        },
                    };
                    user.callCef(remotePlayer, 'license', JSON.stringify(dataSend));
                }
                else {
                    player.notify('~r~У Вас отсутствует тип лицензии: ~s~' + licName);
                    if (remotePlayer.id != player.id)
                        remotePlayer.notify('~r~У игрока отсуствует тип лицензии: ~s~' + licName);
                }
            }
        }
        catch (e) {
            methods.error(e);
        }
    }
});

mp.events.addRemoteCounted('server:user:showLicGos', (player, playerId) => {
    if (!user.isLogin(player))
        return;

    let remotePlayer = mp.players.at(playerId);
    if (remotePlayer && user.isLogin(remotePlayer)) {
        try {
            if (methods.distanceToPos(remotePlayer.position, player.position) > 4) {
                player.notify('~r~Вы слишком далеко');
                return;
            }

            if (remotePlayer.id != player.id) {
                user.playAnimation(remotePlayer, "mp_common","givetake2_a", 8);
                user.playAnimation(player, "mp_common","givetake1_a", 8);
                chat.sendMeCommand(remotePlayer, 'посмотрел удостоверение');
                chat.sendMeCommand(player, 'показал удостоверение');
            }
            else
                chat.sendMeCommand(player, 'посмотрел удостоверение');

            let dataSend = {
                type: 'updateValues',
                isShow: true,
                typef: user.getFractionHash(player),
                info: {
                    name: user.getRpName(player),
                    sex: user.getSexName(player),
                    dep: user.getDepartmentName(player),
                    position: user.getRankName(player),
                    dob: user.get(player, 'age'),
                    id: user.getId(player),
                    img: 'https://a.rsg.sc//n/' + player.socialClub.toLowerCase(),
                },
            };
            user.callCef(remotePlayer, 'certificate', JSON.stringify(dataSend));

        }
        catch (e) {
            methods.error(e);
        }
    }
});

mp.events.addRemoteCounted('server:user:cuff', (player) => {
    if (!user.isLogin(player))
        return;
    user.cuff(player);
});

mp.events.addRemoteCounted('server:user:unCuff', (player) => {
    if (!user.isLogin(player))
        return;
    user.unCuff(player);
});

mp.events.addRemoteCounted('server:user:tie', (player) => {
    if (!user.isLogin(player))
        return;
    user.tie(player);
});

mp.events.addRemoteCounted('server:user:unTie', (player) => {
    if (!user.isLogin(player))
        return;
    user.unTie(player);
});

mp.events.addRemoteCounted("server:user:targetNotify", (player, nplayer, text) => {
    if (!user.isLogin(nplayer))
        return;
    try {
        nplayer.notify(text);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:user:cuffById', (player, targetId) => {
    if (!user.isLogin(player))
        return;

    let target = mp.players.at(targetId);

    if (mp.players.exists(target)) {
        if (methods.distanceToPos(target.position, player.position) > 3) {
            player.notify('~r~Вы слишком далеко');
            return;
        }

        //user.playAnimation(player, "mp_arresting", "a_uncuff", 8);
        user.cuff(target);
    }
    else
        player.notify('~r~Рядом с вами никого нет');
});

mp.events.addRemoteCounted('server:user:unCuffById', (player, targetId) => {
    if (!user.isLogin(player))
        return;

    let target = mp.players.at(targetId);

    if (mp.players.exists(target)) {
        if (methods.distanceToPos(target.position, player.position) > 3) {
            player.notify('~r~Вы слишком далеко');
            return;
        }
        //user.stopAnimation(target);
        user.playAnimation(player, "mp_arresting", "a_uncuff", 8);
        user.playAnimation(target, 'mp_arresting', 'b_uncuff', 8);

        if (user.isCuff(target))
            inventory.addItem(40, 1, inventory.types.Player, user.getId(player), 1, 0, "{}", 10);

        setTimeout(function () {
            user.unCuff(target);
        }, 3000);
    }
    else
        player.notify('~r~Рядом с вами никого нет');
});

mp.events.addRemoteCounted('server:user:tieById', (player, targetId) => {
    if (!user.isLogin(player))
        return;

    let target = mp.players.at(targetId);

    if (mp.players.exists(target)) {
        if (methods.distanceToPos(target.position, player.position) > 3) {
            player.notify('~r~Вы слишком далеко');
            return;
        }
        user.playAnimation(player, "mp_arresting", "a_uncuff", 8);
        user.tie(target);
    }
    else
        player.notify('~r~Рядом с вами никого нет');
});

mp.events.addRemoteCounted('server:user:unTieById', (player, targetId) => {
    if (!user.isLogin(player))
        return;

    let target = mp.players.at(targetId);
    if (mp.players.exists(target)) {
        if (methods.distanceToPos(target.position, player.position) > 3) {
            player.notify('~r~Вы слишком далеко');
            return;
        }
        user.stopAnimation(target);
        user.playAnimation(player, "mp_arresting", "a_uncuff", 8);

        if (user.isTie(target))
            inventory.addItem(0, 1, inventory.types.Player, user.getId(player), 1, 0, "{}", 10);

        user.unTie(target);
    }
    else
        player.notify('~r~Рядом с вами никого нет');
});

mp.events.addRemoteCounted('server:user:knockById', (player, targetId) => { //TODO
    if (!user.isLogin(player))
        return;

    if (user.has(player, 'isKnockoutTimeout'))
    {
        player.notify("~r~Таймаут 2 минуты на данное действие");
        return;
    }

    let target = mp.players.at(targetId);
    if (mp.players.exists(target)) {
        if (methods.distanceToPos(target.position, player.position) > 3) {
            player.notify('~r~Вы слишком далеко');
            return;
        }

        if (user.get(player, 'jail_time') > 0 || user.get(target, 'jail_time') > 0)
        {
            player.notify("~r~В тюрьме это действие не доступно");
            return;
        }
        if (user.get(player, 'med_time') > 0 || user.get(target, 'med_time') > 0)
        {
            player.notify("~r~В больнице это действие не доступно");
            return;
        }

        let random = methods.getRandomInt(0, user.get(player, 'stats_strength') - 100);
        //let random2 = methods.getRandomInt(0, user.get(target, 'stats_strength') - 200);

        user.set(player, 'isKnockoutTimeout', true);
        setTimeout(function () {
            try {
                if (!user.isLogin(player))
                    return;
                user.reset(player, 'isKnockoutTimeout');
            }
            catch (e) {
                methods.debug(e);
            }
        }, 120000);

        if (random < 2) {
            user.set(target, 'isKnockout', true);
            target.setVariable('isKnockout', true);
            user.playAnimation(target, "amb@world_human_bum_slumped@male@laying_on_right_side@base", "base", 9);
            chat.sendMeCommand(player, "замахнулся кулаком и ударил человека напротив и точным ударом в челюсть, вырубил");

            setTimeout(function () {
                try {
                    user.set(target, 'isKnockout', false);
                    target.setVariable('isKnockout', undefined);
                    user.stopAnimation(target)
                }
                catch (e) {
                    methods.debug(e);
                }
            }, 10000)
        }
        else {
            chat.sendMeCommand(player, "замахнулся кулаком и ударил человека напротив");
        }
    }
    else
        player.notify('~r~Рядом с вами никого нет');
});

mp.events.addRemoteCounted('server:user:getInvById', (player, targetId) => {
    if (!user.isLogin(player))
        return;
    let pl = mp.players.at(targetId);
    if (pl && mp.players.exists(pl)) {
        if (!user.isTie(pl) && !user.isCuff(pl)) {
            player.notify('~r~Игрок должен быть связан или в наручниках');
            return;
        }
        if (methods.distanceToPos(pl.position, player.position) > 3) {
            player.notify('~r~Вы слишком далеко');
            return;
        }
        inventory.getItemList(player, inventory.types.Player, user.getId(pl));
    }
    else
        player.notify('~r~Рядом с вами никого нет');
});

mp.events.addRemoteCounted('server:user:taskFollowById', (player, targetId) => {
    if (!user.isLogin(player))
        return;
    let nplayer = mp.players.at(targetId);
    if (!user.isLogin(nplayer))
        return;
    if (!user.isTie(nplayer) && !user.isCuff(nplayer)) {
        player.notify('~r~Игрок должен быть связан или в наручниках');
        return;
    }
    if (methods.distanceToPos(nplayer.position, player.position) > 3) {
        player.notify('~r~Вы слишком далеко');
        return;
    }
    nplayer.call("client:taskFollow", [player]);
});

mp.events.addRemoteCounted('server:user:inCarById', (player, targetId) => {
    if (!user.isLogin(player))
        return;
    try {
        let pl = mp.players.at(targetId);
        if (pl && mp.players.exists(pl)) {
            if (!user.isTie(pl) && !user.isCuff(pl)) {
                player.notify('~r~Игрок должен быть связан или в наручниках');
                return;
            }
            if (methods.distanceToPos(pl.position, player.position) > 3) {
                player.notify('~r~Вы слишком далеко');
                return;
            }
            let v = methods.getNearestVehicleWithCoords(player.position, 7);
            if (v && mp.vehicles.exists(v)) {
                pl.putIntoVehicle(v, 0);
                player.notify('~g~Вы затащили человека в транспорт');
                pl.notify('~r~Вас затащили в транспорт');
            } else {
                player.notify('~r~Рядом с вами нет транспорта');
            }

        }
        else
            player.notify('~r~Рядом с вами никого нет');
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:user:removeCarById', (player, targetId) => {
    if (!user.isLogin(player))
        return;
    try {
        let pl = mp.players.at(targetId);
        if (pl && mp.players.exists(pl)) {
            if (!user.isTie(pl) && !user.isCuff(pl)) {
                player.notify('~r~Игрок должен быть связан или в наручниках');
                return;
            }
            if (pl.vehicle && mp.vehicles.exists(pl.vehicle)) {
                pl.removeFromVehicle();
                player.notify('~g~Вы вытащили человека из транспорта');
                pl.notify('~r~Вас вытащили из транспорта');
            } else {
                player.notify('~r~Игрок не в транспорте');
            }
        }
        else
            player.notify('~r~Рядом с вами никого нет');
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:user:giveMoneyToPlayerId', (player, playerRemoteId, money) => {
    if (!user.isLogin(player))
        return;

    if (user.getCashMoney(player) < money) {
        player.notify("~r~У Вас нет столько денег");
        return;
    }

    let remotePlayer = mp.players.at(playerRemoteId);
    if (remotePlayer && user.isLogin(remotePlayer)) {

        if (methods.distanceToPos(remotePlayer.position, player.position) > 3) {
            player.notify('~r~Вы слишком далеко');
            return;
        }

        user.removeCashMoney(player, money);
        user.addCashMoney(remotePlayer, money);

        user.playAnimationWithUser(player, remotePlayer, 6);

        remotePlayer.notify('Вам передали ~g~' + methods.moneyFormat(money));
        player.notify('Вы передали ~g~' + methods.moneyFormat(money));

        methods.saveLog('log_give_money',
            ['type', 'user_from', 'user_to', 'sum'],
            ['CASH', `${user.getRpName(player)} (${user.getId(player)})`, `${user.getRpName(remotePlayer)} (${user.getId(remotePlayer)})`, methods.moneyFormat(money)],
        );
    }
});

mp.events.addRemoteCounted('server:user:askDatingToPlayerId', (player, playerRemoteId, name) => {
    if (!user.isLogin(player))
        return;

    let remotePlayer = mp.players.at(playerRemoteId);
    if (user.isLogin(remotePlayer)) {
        if (methods.distanceToPos(remotePlayer.position, player.position) > 3) {
            player.notify('~r~Вы слишком далеко');
            return;
        }
        remotePlayer.call('client:user:askDatingToPlayerId', [player.id, name]);
    }
});

mp.events.addRemoteCounted('server:user:askDatingToPlayerIdYes', (player, playerRemoteId, name, nameAnswer) => {
    if (!user.isLogin(player))
        return;
    let remotePlayer = mp.players.at(playerRemoteId);
    if (user.isLogin(remotePlayer)) {

        if (methods.distanceToPos(remotePlayer.position, player.position) > 3) {
            player.notify('~r~Вы слишком далеко');
            return;
        }

        mysql.executeQuery(`DELETE FROM user_dating WHERE user_id = '${user.getId(player)}' AND user_owner = '${user.getId(remotePlayer)}'`);
        mysql.executeQuery(`DELETE FROM user_dating WHERE user_id = '${user.getId(remotePlayer)}' AND user_owner = '${user.getId(player)}'`);

        setTimeout(function () {
            if (!user.isLogin(remotePlayer) || !user.isLogin(player))
                return;
            mysql.executeQuery(`INSERT INTO user_dating (user_owner, user_id, user_name) VALUES ('${user.getId(remotePlayer)}', '${user.getId(player)}', '${nameAnswer}')`);
            mysql.executeQuery(`INSERT INTO user_dating (user_owner, user_id, user_name) VALUES ('${user.getId(player)}', '${user.getId(remotePlayer)}', '${name}')`);
        }, 5000);

        user.setDating(player, user.getId(remotePlayer), name);
        user.setDating(remotePlayer, user.getId(player), nameAnswer);
    }
});

mp.events.addRemoteCounted('server:houses:teleport', (player, id) => {
    user.teleport(player, houses.get(id, 'x'), houses.get(id, 'y'), houses.get(id, 'z'), houses.get(id, 'rot'));
});

mp.events.addRemoteCounted('server:houses:insert', (player, interior, number, price, zone, street) => {
    houses.insert(player, number, street, zone, player.position.x, player.position.y, player.position.z, player.heading, interior, price);
});

mp.events.addRemoteCounted('server:houses:insert1', (player, id, int) => {
    if (player.vehicle)
        houses.insert1(player, id, int, player.vehicle.position.x, player.vehicle.position.y, player.vehicle.position.z, player.vehicle.heading);
    else
        houses.insert1(player, id, int, player.position.x, player.position.y, player.position.z, player.heading);
});

mp.events.addRemoteCounted('server:houses:insert2', (player, id, int) => {
    if (player.vehicle)
        houses.insert2(player, id, int, player.vehicle.position.x, player.vehicle.position.y, player.vehicle.position.z, player.vehicle.heading);
    else
        houses.insert2(player, id, int, player.position.x, player.position.y, player.position.z, player.heading);
});

mp.events.addRemoteCounted('server:houses:insert3', (player, id, int) => {
    if (player.vehicle)
        houses.insert3(player, id, int, player.vehicle.position.x, player.vehicle.position.y, player.vehicle.position.z, player.vehicle.heading);
    else
        houses.insert3(player, id, int, player.position.x, player.position.y, player.position.z, player.heading);
});

mp.events.addRemoteCounted('server:stocks:insert', (player, interior, number, price, zone, street) => {
    stocks.insert(player, number, street, zone, player.position.x, player.position.y, player.position.z, player.heading, interior, price);
});

mp.events.addRemoteCounted('server:stocks:insert2', (player, id) => {
    if (player.vehicle)
        stocks.insert2(player, id, player.vehicle.position.x, player.vehicle.position.y, player.vehicle.position.z, player.vehicle.heading);
    else
        stocks.insert2(player, id, player.position.x, player.position.y, player.position.z, player.heading);
});

mp.events.addRemoteCounted('server:condo:insert', (player, numberBig, number, price, interior, zone, street) => {
    condos.insert(player, number, numberBig, street, zone, player.position.x, player.position.y, player.position.z, player.heading, interior, price);
});

mp.events.addRemoteCounted('server:condo:insertBig', (player, number, zone, street) => {
    condos.insertBig(player, number, street, zone, player.position.x, player.position.y, player.position.z);
});

mp.events.addRemoteCounted('server:user:getPlayerPos', (player) => {
    console.log(`PlayerPos: ${player.position.x}, ${player.position.y}, ${player.position.z - 1}, ${player.heading}`);
    methods.saveFile('plPos', `[${player.position.x}, ${player.position.y}, ${player.position.z - 1}, ${player.heading}],`);
});

mp.events.addRemoteCounted('server:user:getPlayerPos2', (player, pos) => {
    console.log(`PlayerPos: ${player.position.x}, ${player.position.y}, ${player.position.z - 1}, ${player.heading}`);
    methods.saveFile('plPos', `${pos}, ${player.position.x}, ${player.position.y}, ${player.position.z - 1}, ${player.heading}`);
});

mp.events.addRemoteCounted('server:user:getVehPos', (player) => {
    if (player.vehicle)
        methods.saveFile('vehPos', `["${methods.getVehicleInfo(player.vehicle.model).display_name}", ${player.vehicle.position.x}, ${player.vehicle.position.y}, ${player.vehicle.position.z}, ${player.vehicle.heading}],`)
});

mp.events.addRemoteCounted('server:sendAsk', (player, message) => {
    if (!user.isLogin(player))
        return;
    if (message === undefined || message === 'undefined')
        return;
    player.outputChatBoxNew(`!{#FFC107}Вопрос ${user.getRpName(player)} (${player.id}):!{#FFFFFF} ${message}`);
    mp.players.forEach(function (p) {
        if (!user.isLogin(p))
            return;
        if (user.isHelper(p))
            p.outputChatBoxNew(`!{#FFC107}Вопрос от ${user.getRpName(player)} (${player.id}):!{#FFFFFF} ${message}`);
    });
});

mp.events.addRemoteCounted('server:sendReport', (player, message) => {
    if (!user.isLogin(player))
        return;

    if (message === undefined || message === 'undefined')
        return;

    player.outputChatBoxNew(`!{#f44336}Жалоба ${user.getRpName(player)} (${player.id}):!{#FFFFFF} ${message}`);
    mp.players.forEach(function (p) {
        if (!user.isLogin(p))
            return;
        if (user.isAdmin(p)) {
            /*if (user.getVipStatus(player) == 'YouTube')
                p.outputChatBoxNew(`!{#3F51B5}[MEDIA] Жалоба от ${user.getRpName(player)} (${player.id}):!{#FFFFFF} ${message}`);
            else*/
            p.outputChatBoxNew(`!{#f44336}Жалоба от ${user.getRpName(player)} (${player.id}):!{#FFFFFF} ${message}`);
        }
    });
});

mp.events.addRemoteCounted('server:sendAnswerAsk', (player, id, msg) => {
    if (!user.isLogin(player))
        return;
    if (msg === undefined || msg === 'undefined')
        return;
    mp.players.forEach(function (p) {
        if (!user.isLogin(p))
            return;
        if (user.isHelper(p))
            p.outputChatBoxNew(`!{#FFC107}Ответ от хелпера ${user.getRpName(player)} игроку ${id}:!{#FFFFFF} ${msg}`);
        if (p.id != id)
            return;
        p.outputChatBoxNew(`!{#FFC107}Ответ от хелпера ${user.getRpName(player)}:!{#FFFFFF} ${msg}`);
        //methods.saveLog('AnswerAsk', `${user.getRpName(player)} (${user.getId(player)}) to ${id}: ${msg}`);
        user.set(player, 'count_hask', user.get(player, 'count_hask') + 1);
    });
});

mp.events.addRemoteCounted('server:sendAnswerReport', (player, id, msg) => {
    if (!user.isLogin(player))
        return;
    if (msg === undefined || msg === 'undefined')
        return;
    mp.players.forEach(function (p) {
        if (!user.isLogin(p))
            return;
        if (user.isAdmin(p))
            p.outputChatBoxNew(`!{#f44336}Ответ от администратора ${user.getRpName(player)} игроку ${id}:!{#FFFFFF} ${msg}`);
        if (p.id != id)
            return;
        p.outputChatBoxNew(`!{#f44336}Ответ от администратора ${user.getRpName(player)}:!{#FFFFFF} ${msg}`);
        //methods.saveLog('AnswerReport', `${user.getRpName(player)} (${user.getId(player)}) to ${id}: ${msg}`);
        user.set(player, 'count_aask', user.get(player, 'count_aask') + 1);
    });
});

mp.events.addRemoteCounted('server:admin:spawnVeh', (player, vName) => {
    try {
        let v = vehicles.spawnCar(player.position, player.heading, vName);
        player.putIntoVehicle(v, -1);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:admin:giveLeader', (player, type, id, listIndex) => {
    admin.giveLeader(player, type, id, listIndex);
});

mp.events.addRemoteCounted('server:admin:blacklist', (player, type, id, reason) => {
    admin.blacklist(player, type, id, reason);
});

mp.events.addRemoteCounted('server:admin:kick', (player, type, id, reason) => {
    admin.kick(player, type, id, reason);
});

mp.events.addRemoteCounted('server:admin:unban', (player, type, id, reason) => {
    admin.unban(player, type, id, reason);
});

mp.events.addRemoteCounted('server:admin:ban', (player, type, id, idx, reason) => {
    admin.ban(player, type, id, idx, reason);
});

mp.events.addRemoteCounted('server:admin:jail', (player, type, id, idx, reason) => {
    admin.jail(player, type, id, idx, reason);
});

mp.events.addRemoteCounted('server:admin:setHpById', (player, type, id, num) => {
    admin.setHpById(player, type, id, num);
});

mp.events.addRemoteCounted('server:admin:setArmorById', (player, type, id, num) => {
    admin.setArmorById(player, type, id, num);
});

mp.events.addRemoteCounted('server:admin:setSkinById', (player, type, id, skin) => {
    admin.setSkinById(player, type, id, skin);
});

mp.events.addRemoteCounted('server:admin:resetSkinById', (player, type, id) => {
    admin.resetSkinById(player, type, id);
});

mp.events.addRemoteCounted('server:admin:changeDimension', (player, type, id, dim) => {
    admin.changeDimension(player, type, id, dim);
});

mp.events.addRemoteCounted('server:admin:tptoid', (player, type, id) => {
    admin.tpToUser(player, type, id);
});

mp.events.addRemoteCounted('server:admin:tptome', (player, type, id) => {
    admin.tpToAdmin(player, type, id);
});

mp.events.addRemoteCounted('server:admin:inviteMp', (player) => {
    admin.inviteMp(player);
});

mp.events.addRemoteCounted('server:ems:removeObject', (player, id) => {
    try {
        ems.removeObject(id);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:ems:attachObject', (player, id) => {
    try {
        ems.attachObject(player, id);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:ems:vehicleUnload', (player) => {
    try {
        ems.vehicleUnload(player);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:business:buy', (player, id) => {
    if (!user.isLogin(player))
        return;
    business.buy(player, id);
});

mp.events.addRemoteCounted('server:business:sell', (player) => {
    if (!user.isLogin(player))
        return;
    business.sell(player);
});

mp.events.addRemoteCounted('server:business:log', (player, id) => {
    if (!user.isLogin(player))
        return;
    mysql.executeQuery(`SELECT * FROM log_business WHERE business_id = ${methods.parseInt(id)} ORDER BY id DESC LIMIT 200`, function (err, rows, fields) {
        try {
            let list = [];
            rows.forEach(function(item) {

                let price = item['price'];
                if (item['price'] < 0)
                    price = '~r~' + methods.moneyFormat(item['price']);
                else
                    price = '~g~' + methods.moneyFormat(item['price']);

                list.push({id: item['id'], product: item['product'], price: price, timestamp: item['timestamp'], rp_datetime: item['rp_datetime']});
            });
            player.call('client:showBusinessLogMenu', [JSON.stringify(list)]);
        }
        catch (e) {
            methods.debug(e);
        }
    });
});

mp.events.addRemoteCounted('server:invader:sendNews', (player, title, text) => {
    if (!user.isLogin(player))
        return;

    title = methods.removeQuotes(title);
    text = methods.removeQuotes(text);
    let name = methods.removeQuotes(user.getRpName(player));

    let rpDateTime = weather.getRpDateTime();
    let timestamp = methods.getTimeStamp();

    mysql.executeQuery(`INSERT INTO rp_inv_news (title, name, text, timestamp, rp_datetime) VALUES ('${title}', '${name}', '${text}', '${timestamp}', '${rpDateTime}')`);

    discord.sendNews(title, text, name, player.socialClub);

    mp.players.forEach(p => {
        user.sendPhoneNotify(p, 'Life Invader', title, text, 'CHAR_LIFEINVADER');
    });
});

mp.events.addRemoteCounted('server:invader:delNews', (player, id) => {
    if (!user.isLogin(player))
        return;

    mysql.executeQuery(`DELETE FROM rp_inv_news WHERE id = ${methods.parseInt(id)}`);
    player.notify('~b~Вы удалили новость #' + id);
});

mp.events.addRemoteCounted('server:invader:getNewsList', (player) => {
    if (!user.isLogin(player))
        return;
    mysql.executeQuery(`SELECT * FROM rp_inv_news ORDER BY id DESC LIMIT 100`, function (err, rows, fields) {
        try {
            let list = [];
            rows.forEach(function(item) {
                list.push({id: item['id'], title: item['title'], name: item['name'], text: item['text']});
            });
            player.call('client:showInvaderNewsMenu', [JSON.stringify(list)]);
        }
        catch (e) {
            methods.debug(e);
        }
    });
});

mp.events.addRemoteCounted('server:invader:sendAd', (player, id, title, name, text, phone) => {
    if (!user.isLogin(player))
        return;

    title = methods.removeQuotes(title);
    text = methods.removeQuotes(text);
    name = methods.removeQuotes(name);
    phone = methods.phoneFormat(methods.removeQuotes(phone));
    let editor = methods.removeQuotes(user.getRpName(player));

    let rpDateTime = weather.getRpDateTime();
    let timestamp = methods.getTimeStamp();

    mysql.executeQuery(`DELETE FROM rp_inv_ad_temp WHERE id = ${methods.parseInt(id)}`);
    mysql.executeQuery(`INSERT INTO rp_inv_ad (title, name, text, phone, editor, timestamp, rp_datetime) VALUES ('${title}', '${name}', '${text}', '${phone}', '${editor}', '${timestamp}', '${rpDateTime}')`);

    user.addPayDayMoney(player, 100, 'Отредактировал объявление');

    discord.sendAd(title, name, text, phone, editor, player.socialClub);

    mp.players.forEach(p => {
        user.sendPhoneNotify(p, 'Life Invader', '~g~Реклама | ' + title, text, 'CHAR_LIFEINVADER');
    });
});

mp.events.addRemoteCounted('server:invader:delAd', (player, id) => {
    if (!user.isLogin(player))
        return;

    mysql.executeQuery(`DELETE FROM rp_inv_ad WHERE id = ${methods.parseInt(id)}`);
    player.notify('~b~Вы удалили объявление #' + id);
});

mp.events.addRemoteCounted('server:invader:getAdList', (player) => {
    if (!user.isLogin(player))
        return;
    mysql.executeQuery(`SELECT * FROM rp_inv_ad ORDER BY id DESC LIMIT 100`, function (err, rows, fields) {
        try {
            let list = [];
            rows.forEach(function(item) {
                list.push({id: item['id'], title: item['title'], name: item['name'], phone: item['phone'], editor: item['editor']});
            });
            player.call('client:showInvaderAdMenu', [JSON.stringify(list)]);
        }
        catch (e) {
            methods.debug(e);
        }
    });
});

mp.events.addRemoteCounted('server:invader:sendAdTemp', (player, text) => {
    if (!user.isLogin(player))
        return;

    if (user.getBankMoney(player) < 500) {
        user.sendSmsBankOperation(player, 'Не достаточно средств', 'Отказ операции');
        return;
    }

    text = methods.removeQuotes(text);
    let phone = methods.removeQuotes(user.get(player, 'phone'));
    let name = methods.removeQuotes(user.getRpName(player).split(' ')[0]);

    coffer.addMoney(8, 400);
    methods.saveFractionLog(
        'Система',
        `Рекламное объявление`,
        `Пополнение бюджета: ${methods.moneyFormat(400)}`,
        7
    );

    mysql.executeQuery(`INSERT INTO rp_inv_ad_temp (name, text, phone) VALUES ('${name}', '${text}', '${phone}')`);

    user.sendPhoneNotify(player, 'Life Invader', '~g~Реклама', 'Ваше объявление на рассмотрении', 'CHAR_LIFEINVADER');
});

mp.events.addRemoteCounted('server:invader:getAdTempList', (player) => {
    if (!user.isLogin(player))
        return;
    mysql.executeQuery(`SELECT * FROM rp_inv_ad_temp ORDER BY id DESC LIMIT 100`, function (err, rows, fields) {
        try {
            let list = [];
            rows.forEach(function(item) {

                list.push({id: item['id'], name: item['name'], phone: item['phone'], text: item['text']});
            });
            player.call('client:showInvaderAdTempMenu', [JSON.stringify(list)]);
        }
        catch (e) {
            methods.debug(e);
        }
    });
});

mp.events.addRemoteCounted('server:invader:deleteAdTemp', (player, id) => {
    if (!user.isLogin(player))
        return;

    user.addPayDayMoney(player, 100, 'Удалил объявление #' + id);
    mysql.executeQuery(`DELETE FROM rp_inv_ad_temp WHERE id = ${methods.parseInt(id)}`);
});

mp.events.addRemoteCounted('server:events:showTypeListMenu', (player, type) => {
    if (!user.isLogin(player))
        return;
    mysql.executeQuery(`SELECT name, user_name, id, sc_alpha, sc_color, sc_font, interior FROM business WHERE type = ${type}`, function (err, rows, fields) {
        try {
            let resultData1 = new Map();
            let resultData2 = new Map();
            let resultData3 = new Map();
            rows.forEach(function(item) {
                resultData1.set(methods.parseInt(item['id']), item['user_name']);
                resultData2.set(methods.parseInt(item['id']), item['name']);
                resultData3.set(methods.parseInt(item['id']), [item['interior'], item['sc_font'], item['sc_color'], item['sc_alpha']]);
            });
            player.call('client:showBusinessTypeListMenu', [Array.from(resultData1), Array.from(resultData2), Array.from(resultData3)]);
        }
        catch (e) {
            methods.debug(e);
        }
    });
});

mp.events.addRemoteCounted('server:coffer:addMoney', (player, id, money) => {
    coffer.addMoney(id, money);
});

mp.events.addRemoteCounted('server:coffer:removeMoney', (player, id, money) => {
    coffer.removeMoney(id, money);
});

mp.events.addRemoteCounted('server:coffer:setMoney', (player, id, money) => {
    coffer.setMoney(id, money);
});

mp.events.addRemoteCounted('server:business:addMoney', (player, id, money, itemName) => {
    business.addMoney(id, money, itemName);
});

mp.events.addRemoteCounted('server:business:removeMoney', (player, id, money, itemName) => {
    business.removeMoney(id, money, itemName);
});

mp.events.addRemoteCounted('server:business:setMoney', (player, id, money) => {
    business.setMoney(id, money);
});

mp.events.addRemoteCounted('server:business:addMoneyTax', (player, id, money) => {
    business.addMoneyTax(id, money);
});

mp.events.addRemoteCounted('server:business:removeMoneyTax', (player, id, money) => {
    business.removeMoneyTax(id, money);
});

mp.events.addRemoteCounted('server:business:setMoneyTax', (player, id, money) => {
    business.setMoneyTax(id, money);
});

mp.events.addRemoteCounted('server:fraction:addMoney', (player, id, money, itemName) => {
    fraction.addMoney(id, money, itemName);
});

mp.events.addRemoteCounted('server:fraction:removeMoney', (player, id, money, itemName) => {
    fraction.removeMoney(id, money, itemName);
});

mp.events.addRemoteCounted('server:fraction:setMoney', (player, id, money, itemName) => {
    fraction.setMoney(id, money, itemName);
});

mp.events.addRemoteCounted('server:user:addMoney', (player, money, text) => {
    user.addMoney(player, money, text);
});

mp.events.addRemoteCounted('server:user:removeMoney', (player, money, text) => {
    user.removeMoney(player, money, text);
});

mp.events.addRemoteCounted('server:user:setMoney', (player, money) => {
    user.setMoney(player, money);
});

mp.events.addRemoteCounted('server:user:addBankMoney', (player, money, text) => {
    user.addBankMoney(player, money, text);
});

mp.events.addRemoteCounted('server:user:removeBankMoney', (player, money, text) => {
    user.removeBankMoney(player, money, text);
});

mp.events.addRemoteCounted('server:user:setBankMoney', (player, money) => {
    user.setBankMoney(player, money);
});

mp.events.addRemoteCounted('server:user:addCashMoney', (player, money, text) => {
    user.addCashMoney(player, money, text);
});

mp.events.addRemoteCounted('server:user:removeCashMoney', (player, money, text) => {
    user.removeCashMoney(player, money, text);
});

mp.events.addRemoteCounted('server:user:setCashMoney', (player, money) => {
    user.setCashMoney(player, money);
});

mp.events.addRemoteCounted('server:user:addCryptoMoney', (player, money, text) => {
    user.addCryptoMoney(player, money, text);
});

mp.events.addRemoteCounted('server:user:removeCryptoMoney', (player, money, text) => {
    user.removeCryptoMoney(player, money, text);
});

mp.events.addRemoteCounted('server:user:setCryptoMoney', (player, money) => {
    user.setCryptoMoney(player, money);
});

mp.events.addRemoteCounted('server:user:addPayDayMoney', (player, money, text) => {
    user.addPayDayMoney(player, money, text);
});

mp.events.addRemoteCounted('server:user:removePayDayMoney', (player, money, text) => {
    user.removePayDayMoney(player, money, text);
});

mp.events.addRemoteCounted('server:user:setPayDayMoney', (player, money) => {
    user.setPayDayMoney(player, money);
});

mp.events.addRemoteCounted('server:user:addRep', (player, rep) => {
    user.addRep(player, rep);
});

mp.events.addRemoteCounted('server:user:removeRep', (player, rep) => {
    user.removeRep(player, rep);
});

mp.events.addRemoteCounted('server:user:setRep', (player, rep) => {
    user.setRep(player, rep);
});

mp.events.addRemoteCounted('server:user:addWorkExp', (player, rep) => {
    user.addWorkExp(player, rep);
});

mp.events.addRemoteCounted('server:user:removeWorkExp', (player, rep) => {
    user.removeWorkExp(player, rep);
});

mp.events.addRemoteCounted('server:user:setWorkExp', (player, rep) => {
    user.setWorkExp(player, rep);
});

mp.events.addRemoteCounted('server:business:save', (player, id) => {
    business.save(id);
});

mp.events.addRemoteCounted('server:changeWaypointPos', (player, x, y) => {
    if (!user.isLogin(player))
        return;
    if (!vehicles.exists(player.vehicle))
        return;

    player.vehicle.getOccupants().forEach((p) => {
        if (!user.isLogin(p))
            return;
        user.setWaypoint(p, x, y);
    });
});

mp.events.addRemoteCounted('server:uniform:gr6', (player) => {
    if (user.getSex(player) == 1) {
        user.setComponentVariation(player, 3, 14, 0);
        user.setComponentVariation(player, 4, 34, 0);
        user.setComponentVariation(player, 5, 0, 0);
        user.setComponentVariation(player, 6, 25, 0);
        user.setComponentVariation(player, 7, 0, 0);
        user.setComponentVariation(player, 8, 152, 0);
        user.setComponentVariation(player, 9, 6, 1);
        user.setComponentVariation(player, 10, 0, 0);
        user.setComponentVariation(player, 11, 85, 0);
    }
    else {
        user.setComponentVariation(player, 3, 11, 0);
        user.setComponentVariation(player, 4, 13, 0);
        user.setComponentVariation(player, 5, 0, 0);
        user.setComponentVariation(player, 6, 25, 0);
        user.setComponentVariation(player, 7, 0, 0);
        user.setComponentVariation(player, 8, 122, 0);
        user.setComponentVariation(player, 9, 7, 1);
        user.setComponentVariation(player, 10, 71, 0);
        user.setComponentVariation(player, 11, 318, 1);
    }
});

mp.events.addRemoteCounted('server:gr6:findPickup', (player, x, y, z) => {
    if (!user.isLogin(player))
        return;
    try {

        if (player.vehicle && player.seat == -1) {
            if (player.vehicle.getOccupants().length == 1) {
                player.notify('~b~Работать можно только с напарниками!');
            }
            else {
                let isStart = false;
                player.vehicle.getOccupants().forEach(function (p) {
                    try {
                        if (!user.isLogin(p))
                            return;
                        if (user.get(p, 'job') == 10) {
                            user.setWaypoint(p, x, y);
                            Container.Data.Set(player.vehicle.id, 'validWorker' + user.getId(p), true);
                            if (user.getRpName(p) == user.getRpName(player))
                                return;
                            p.notify('~b~Вы получили задание');
                            player.notify('~b~Напарник: ~s~' + user.getRpName(p));

                            if (isStart)
                                return;
                            p.call('client:createGr6Checkpoint', [x, y, z]);
                            isStart = true;
                        }
                    }
                    catch (e) {
                        methods.debug(e);
                    }
                })
            }
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:gr6:dropCar', (player, money, vId) => {
    if (!user.isLogin(player))
        return;
    mp.vehicles.forEach(function (v) {
        try {
            if (vehicles.exists(v) && v.id == vId) {
                v.getOccupants().forEach(function (p) {
                    try {
                        if (!user.isLogin(p) || user.get(p, 'job') != 10)
                            return;

                        if (Container.Data.Has(v.id, 'validWorker' + user.getId(p))) {
                            user.addWorkExp(p, 40);
                        }
                    }
                    catch (e) {
                        methods.debug(e);
                    }
                });
                v.setVariable('gr6Money', methods.parseFloat(v.getVariable('gr6Money') + money));
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });
});

mp.events.addRemoteCounted('server:gr6:unload', (player, vId) => {
    if (!user.isLogin(player))
        return;

    if (player.vehicle && player.seat == -1) {
        mp.vehicles.forEach(function (v) {
            try {
                if (vehicles.exists(v) && v.id == vId) {
                    let money = methods.parseFloat(v.getVariable('gr6Money') / 100);
                    let countOcc = v.getOccupants().length;

                    v.getOccupants().forEach(function (p) {
                        try {
                            if (!user.isLogin(p) || user.get(p, 'job') != 10)
                                return;

                            if (Container.Data.Has(v.id, 'validWorker' + user.getId(p))) {

                                let currentMoney = methods.parseFloat(money / countOcc);

                                user.addMoney(p, currentMoney, 'Зарплата инкассатора');
                                coffer.removeMoney(currentMoney + methods.parseFloat(currentMoney / 10));
                                p.notify('~g~Вы заработали: ~s~' + methods.moneyFormat(currentMoney));
                                Container.Data.Reset(v.id, 'validWorker' + user.getId(p));
                                user.giveJobSkill(p);

                                user.addRep(p, 50);
                                user.addWorkExp(p, 50);
                            }
                            else {
                                p.notify('~r~Вы не являетесь напарником ' + user.getRpName(player));
                                p.notify('~r~Зарплату вы не получили');
                            }
                        }
                        catch (e) {
                            methods.debug(e);
                        }
                    });
                    v.setVariable('gr6Money', 0);
                }
            }
            catch (e) {
                methods.debug(e);
            }
        });
    }
});

mp.events.addRemoteCounted('server:gr6:delete', (player) => {
    if (!user.isLogin(player))
        return;
    try {
        let veh = player.vehicle;
        if (veh && player.seat == -1) {
            if (veh.getVariable('owner_id') == user.getId(player)) {
                user.showLoadDisplay(player);
                setTimeout(function () {
                    vehicles.respawn(veh);
                    setTimeout(function () {
                        try {
                            if (user.isLogin(player)) {
                                user.hideLoadDisplay(player);
                                user.addMoney(player, 4500, 'Возврат ТС инкассатора');
                                player.notify('~b~Вы вернули транспорт в гараж');
                            }
                        }
                        catch (e) {
                            methods.debug(e);
                        }
                    }, 500);
                }, 700);
            }
            else {
                player.notify('~r~Не вы арендовали, не вам сдавать.');
            }
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:gr6:grab', (player) => {
    if (!user.isLogin(player))
        return;
    try {
        if (player.vehicle && player.seat == -1) {
            if (player.vehicle.getVariable('job') == 10) {
                user.showLoadDisplay(player);
                let money = methods.parseFloat(player.vehicle.getVariable('gr6Money') / 90);
                setTimeout(function () {
                    vehicles.respawn(player.vehicle);
                    setTimeout(function () {
                        user.hideLoadDisplay(player);
                        user.addCryptoMoney(player, money / 1000, 'Ограбление');
                        player.notify('~b~Вы ограбили транспорт на сумму: ~s~' + methods.cryptoFormat(money));
                    }, 500);
                }, 700);
            }
            else {
                player.notify('~r~Это не инкассаторская машина');
            }
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:vehicles:spawnJobCar', (player, x, y, z, heading, name, job) => {

    user.showLoadDisplay(player);
    setTimeout(function () {

        try {
            vehicles.spawnJobCar(veh => {
                if (!vehicles.exists(veh))
                    return;
                player.putIntoVehicle(veh, -1);
                vehicles.set(veh.getVariable('container'), 'owner_id', user.getId(player));
                veh.setVariable('owner_id', user.getId(player));
                veh.setVariable('job', job);
            }, new mp.Vector3(x, y, z), heading, name, job);
        }
        catch (e) {
            methods.debug(e);
        }

        setTimeout(function () {
            user.hideLoadDisplay(player);
        }, 500);

    }, 500);
});

mp.events.addRemoteCounted('server:vehicles:destroy', (player) => {

    user.showLoadDisplay(player);
    setTimeout(function () {

        vehicles.respawn(player.vehicle);

        setTimeout(function () {
            user.hideLoadDisplay(player);
        }, 500);

    }, 500);
});

mp.events.addRemoteCounted('server:vehicles:addNew', (player, model, count) => {
    if (user.isAdmin(player)) {
        vehicles.addNew(model, count);
        player.notify('~g~Транспорт на авторынок был добавлен. Кол-во: ~s~' + count)
    }
});

mp.events.addRemoteCounted('server:vehicles:addNewFraction', (player, model, count, fractionId) => {
    if (user.isAdmin(player)) {
        vehicles.addNewFraction(model, count, fractionId);
        player.notify('~g~Транспорт на авторынок был добавлен. Кол-во: ~s~' + count)
    }
});

mp.events.addRemoteCounted('server:dispatcher:sendPos', (player, title, desc, x, y, z, withCoord) => {
    dispatcher.sendPos(title, desc, new mp.Vector3(x, y, z), withCoord);
});

mp.events.addRemoteCounted('server:dispatcher:sendLocalPos', (player, title, desc, x, y, z, fractionId, withCoord) => {
    dispatcher.sendLocalPos(title, desc, new mp.Vector3(x, y, z), fractionId, withCoord);
});

mp.events.addRemoteCounted('server:phone:editContact', (player, json) => {
    if (!user.isLogin(player))
        return;

    try {
        let contact = JSON.parse(json);
        methods.debug(json);
        mysql.executeQuery(`UPDATE phone_contact SET name = '${methods.removeQuotes(methods.removeQuotes2(contact.name))}', numbers = '${JSON.stringify(contact.numbers)}' WHERE id = '${contact.id}'`);
        player.notify('~y~Контакнт отредактирован');
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:phone:favoriteContact', (player, json) => {
    if (!user.isLogin(player))
        return;

    try {
        let contact = JSON.parse(json);
        mysql.executeQuery(`UPDATE phone_contact SET is_fav = '${contact.isFavorite ? 0 : 1}' WHERE id = '${contact.id}'`);
        player.notify('~y~Контакнт добавлен в избранное');
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:phone:deleteContact', (player, json) => {
    if (!user.isLogin(player))
        return;

    try {
        let contact = JSON.parse(json);
        mysql.executeQuery(`DELETE FROM phone_contact WHERE id = '${contact.id}'`);
        player.notify('~y~Контакнт удалён');
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:phone:addContact', (player, json) => {
    if (!user.isLogin(player))
        return;

    try {
        let contact = JSON.parse(json);

        if (contact.name === '') {
            player.notify('~y~Поле "Имя" не заполнено');
            return;
        }

        mysql.executeQuery(`INSERT INTO phone_contact (phone, name, numbers) VALUES ('${user.get(player, 'phone')}', '${methods.removeQuotes(methods.removeQuotes2(contact.name))}', '${JSON.stringify(contact.numbers)}')`);
        player.notify('~g~Контакт был добавлен');
        setTimeout(function () {
            phone.updateContactList(player);
        }, 1000);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:phone:sendMessage', (player, phoneNumber, message) => {
    if (!user.isLogin(player))
        return;

    try {

        message = methods.removeQuotes(methods.removeQuotes2(message));

        let date = weather.getFullRpDate().replace('/', '.').replace('/', '.');

        mysql.executeQuery(`INSERT INTO phone_sms (number_from, number_to, text, date, time) VALUES ('${user.get(player, 'phone').toString()}', '${phoneNumber}', '${message}', '${date}', '${weather.getFullRpTime()}')`);

        mp.players.forEach(p => {
            if (user.isLogin(p) && user.get(p, 'phone_type') > 0 && user.get(p, 'phone') === methods.parseInt(phoneNumber)) {
                user.sendPhoneNotify(p, methods.phoneFormat(user.get(player, 'phone')), '~b~Новое сообщение', message);

                let msg = {
                    type: 'addMessengerMessage',
                    phone: phoneNumber.toString(),
                    text: message,
                    date: date,
                    time: weather.getFullRpTime() + ':00',
                };

                user.callCef(p, 'phone' + user.get(p, 'phone_type'), JSON.stringify(msg));
            }
        });

        /*mp.players.forEach(p => {
            if (user.isLogin(p) && user.get(player, 'phone').toString() === phoneNumber) {
                user.sendPhoneNotify(p, player, phoneNumber, message);
                //phone.selectChat(player, user.get(player, 'phone').toString(), chat);
            }
        });*/

    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:phone:updateContactList', (player) => {
    phone.updateContactList(player);
});

mp.events.addRemoteCounted('server:phone:updateDialogList', (player) => {
    phone.updateDialogList(player);
});

mp.events.addRemoteCounted('server:phone:selectChat', (player, phoneNumber, chat) => {
    phone.selectChat(player, phoneNumber, chat);
});

mp.events.addRemoteCounted('server:phone:deleteChat', (player, phoneNumber) => {
    phone.deleteChat(player, phoneNumber);
});

mp.events.addRemoteCounted('server:phone:fractionList', (player) => {
    if (!user.isLogin(player))
        return;
    phone.fractionList(player);
});

mp.events.addRemoteCounted('server:phone:fractionLog', (player) => {
    if (!user.isLogin(player))
        return;
    phone.fractionLog(player);
});

mp.events.addRemoteCounted('server:phone:fractionLog2', (player) => {
    if (!user.isLogin(player))
        return;
    phone.fractionLog2(player);
});

mp.events.addRemoteCounted('server:phone:showGangList', (player) => {
    if (!user.isLogin(player))
        return;
    phone.showGangList(player);
});

mp.events.addRemoteCounted('server:phone:attackStreet', (player, id) => {
    if (!user.isLogin(player))
        return;
    gangWar.startWar(player, id);
});

mp.events.addRemoteCounted('server:phone:fractionList2', (player) => {
    if (!user.isLogin(player))
        return;
    phone.fractionList2(player);
});

mp.events.addRemoteCounted('server:phone:fractionAll', (player) => {
    if (!user.isLogin(player))
        return;
    phone.fractionAll(player);
});

mp.events.addRemoteCounted('server:phone:fractionMoney', (player) => {
    if (!user.isLogin(player))
        return;
    phone.fractionMoney(player);
});

mp.events.addRemoteCounted('server:phone:fractionVehicles', (player) => {
    if (!user.isLogin(player))
        return;
    phone.fractionVehicles(player);
});

mp.events.addRemoteCounted('server:phone:fractionVehiclesBuyList', (player) => {
    if (!user.isLogin(player))
        return;
    phone.fractionVehiclesBuyList(player);
});

mp.events.addRemoteCounted('server:phone:userVehicleAppMenu', (player) => {
    if (!user.isLogin(player))
        return;
    phone.userVehicleAppMenu(player);
});

mp.events.addRemoteCounted('server:phone:userAdList', (player) => {
    if (!user.isLogin(player))
        return;
    phone.userAdList(player);
});

mp.events.addRemoteCounted('server:phone:userNewsList', (player) => {
    if (!user.isLogin(player))
        return;
    phone.userNewsList(player);
});

mp.events.addRemoteCounted('server:phone:bankHistory', (player) => {
    if (!user.isLogin(player))
        return;
    phone.bankHistory(player);
});

mp.events.addRemoteCounted('server:phone:userHistory', (player, id) => {
    if (!user.isLogin(player))
        return;
    phone.userHistory(player, id);
});

mp.events.addRemoteCounted('server:phone:changeBg', (player, id) => {
    if (!user.isLogin(player))
        return;
    phone.changeBg(player, id);
});

mp.events.addRemoteCounted('server:phone:createFraction', (player) => {
    if (!user.isLogin(player))
        return;
    phone.createFraction(player);
});

mp.events.addRemoteCounted('server:phone:buyFraction', (player, id) => {
    fraction.create(player, id);
});

mp.events.addRemoteCounted('server:phone:fractionVehicleBuyInfo', (player, id) => {
    if (!user.isLogin(player))
        return;
    phone.fractionVehicleBuyInfo(player, id);
});

mp.events.addRemoteCounted('server:phone:memberAction', (player, id) => {
    if (!user.isLogin(player))
        return;
    phone.memberAction(player, id);
});

mp.events.addRemoteCounted('server:phone:memberAction2', (player, id) => {
    if (!user.isLogin(player))
        return;
    phone.memberAction2(player, id);
});

mp.events.addRemoteCounted('server:phone:getUserInfo', (player, text) => {
    if (!user.isLogin(player))
        return;
    phone.getUserInfo(player, text);
});

mp.events.addRemoteCounted('server:phone:inviteFraction2', (player, id) => {
    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    let target = mp.players.at(id);
    if (user.isLogin(target)) {

        if (target.id == player.id) {
            player.notify('~r~Здравствуйте, я хотел вставить сюда шутку, но я ее не придумал, в общем, как ты собрался самого себя принять в организацию в которой ты уже состоишь?');
            return;
        }

        if (methods.distanceToPos(target.position, player.position) > 5) {
            player.notify('~r~Вы слишком далеко друг от друга');
            return;
        }

        if (user.get(target, 'fraction_id2') > 0) {
            player.notify('~r~Игрок уже состоит в организации');
            return;
        }

        let fractionId = user.get(player, 'fraction_id2');

        let rank = JSON.parse(fraction.getData(fractionId).get('rank_list')).length - 1;

        user.set(target, 'rank2', rank);
        user.set(target, 'rank_type2', 0);
        user.set(target, 'fraction_id2', fractionId);
        user.set(target, 'is_leader2', false);
        user.set(target, 'is_sub_leader2', false);

        target.notify('~g~Вас приняли в организацию');
        player.notify('~b~Вы приняли: ~s~' + user.getRpName(target));

        user.save(target);
    }
    else {
        player.notify('~r~Игрок не найден');
    }
});

mp.events.addRemoteCounted('server:phone:editFractionName', (player, text) => {
    if (!user.isLogin(player))
        return;
    fraction.editFractionName(player, text);
});

mp.events.addRemoteCounted('server:phone:editFractionLeader', (player, text) => {
    if (!user.isLogin(player))
        return;
    fraction.editFractionLeader(player, text);
});

mp.events.addRemoteCounted('server:phone:editFractionSubLeader', (player, text) => {
    if (!user.isLogin(player))
        return;
    fraction.editFractionSubLeader(player, text);
});

mp.events.addRemoteCounted('server:phone:createFractionDep', (player, text) => {
    if (!user.isLogin(player))
        return;
    fraction.createFractionDep(player, text);
});

mp.events.addRemoteCounted('server:phone:editFractionRank', (player, text, rankId, depId) => {
    if (!user.isLogin(player))
        return;
    fraction.editFractionRank(player, text, rankId, depId);
});

mp.events.addRemoteCounted('server:phone:editFractionDep', (player, text, depId) => {
    if (!user.isLogin(player))
        return;
    fraction.editFractionDep(player, text, depId);
});

mp.events.addRemoteCounted('server:phone:deleteFractionDep', (player) => {
    if (!user.isLogin(player))
        return;
    fraction.deleteFractionDep(player);
});

mp.events.addRemoteCounted('server:phone:addFractionRank', (player, text, depId) => {
    if (!user.isLogin(player))
        return;
    fraction.addFractionRank(player, text, depId);
});

mp.events.addRemoteCounted('server:phone:fractionVehicleAction', (player, id) => {
    if (!user.isLogin(player))
        return;
    phone.fractionVehicleAction(player, id);
});

mp.events.addRemoteCounted('server:phone:userRespawnById', (player, id, price) => {
    if (!user.isLogin(player))
        return;
    mp.vehicles.forEach(v => {
        if (v.getVariable('vid') == id) {
            if (v.getOccupants().length > 0) {
                player.notify('~r~Транспорт в угоне');
                return;
            }

            if (user.getBankMoney(player) < price) {
                player.notify(`~r~Необходимо иметь ${methods.moneyFormat(price)} на банковской карте для использования эвакуатора`);
                return;
            }

            user.removeBankMoney(player, price, 'Услуги эвакуатора');
            coffer.addMoney(1, price);

            vehicles.respawn(v);
            player.notify('~g~Ваш транспорт скоро будет на парковочном месте');
        }
    });
});

mp.events.addRemoteCounted('server:phone:userGetPosById', (player, id) => {
    if (!user.isLogin(player))
        return;
    mp.vehicles.forEach(v => {
        if (v.getVariable('vid') == id) {
            user.setWaypoint(player, v.position.x, v.position.y);
        }
    });
});

mp.events.addRemoteCounted('server:phone:userLockById', (player, id) => {
    if (!user.isLogin(player))
        return;
    mp.vehicles.forEach(v => {
        if (v.getVariable('vid') == id) {
            vehicles.lockStatus(player, v);
        }
    });
});

mp.events.addRemoteCounted('server:phone:userEngineById', (player, id) => {
    if (!user.isLogin(player))
        return;
    mp.vehicles.forEach(v => {
        if (v.getVariable('vid') == id) {
            vehicles.engineStatus(player, v);
        }
    });
});

mp.events.addRemoteCounted('server:phone:userNeonById', (player, id) => {
    if (!user.isLogin(player))
        return;
    mp.vehicles.forEach(v => {
        if (v.getVariable('vid') == id) {
            vehicles.neonStatus(player, v);
        }
    });
});

mp.events.addRemoteCounted('server:inventory:getItemList', (player, ownerType, ownerId) => {
    if (!user.isLogin(player))
        return;
    inventory.getItemList(player, ownerType, ownerId);
});

mp.events.addRemoteCounted('server:inventory:equip', (player, id, itemId, count, aparams) => {
    if (!user.isLogin(player))
        return;
    inventory.equip(player, id, itemId, count, aparams);
});

mp.events.addRemoteCounted('server:inventory:updateEquipStatus', (player, id, status) => {
    inventory.updateEquipStatus(id, status);
});

mp.events.addRemoteCounted('server:inventory:updateItemsEquipByItemId', (player, itemId, ownerId, ownerType, equip) => {
    inventory.updateItemsEquipByItemId(itemId, ownerId, ownerType, equip);
});

mp.events.addRemoteCounted('server:inventory:updateOwnerId', (player, id, ownerId, ownerType) => {
    inventory.updateOwnerId(id, ownerId, ownerType);
});

mp.events.addRemoteCounted('server:inventory:updateOwnerAll', (player, oldOwnerId, oldOwnerType, ownerId, ownerType) => {
    inventory.updateOwnerAll(oldOwnerId, oldOwnerType, ownerId, ownerType);
});

mp.events.addRemoteCounted('server:inventory:updateItemParams', (player, id, params) => {
    inventory.updateItemParams(id, params);
});

mp.events.addRemoteCounted('server:inventory:updateItemCount', (player, id, count) => {
    inventory.updateItemCount(id, count);
});

mp.events.addRemoteCounted('server:inventory:addItem', (player, itemId, count, ownerType, ownerId, countItems, isEquip, params, timeout) => {
    if (!user.isLogin(player))
        return;
    inventory.addItem(itemId, count, ownerType, ownerId, countItems, isEquip, params, timeout);
});

mp.events.addRemoteCounted('server:inventory:addItemSql', (player, itemId, count, ownerType, ownerId, countItems, isEquip, params, timeout) => {
    if (!user.isLogin(player))
        return;
    inventory.addItemSql(itemId, count, ownerType, ownerId, countItems, isEquip, params, timeout);
});

mp.events.addRemoteCounted('server:inventory:addPlayerWeaponItem', (player, itemId, count, ownerType, ownerId, countItems, isEquip, params, text, timeout) => {
    if (!user.isLogin(player))
        return;
    inventory.addPlayerWeaponItem(player, itemId, count, ownerType, ownerId, countItems, isEquip, params, text, timeout);
});

mp.events.addRemoteCounted('server:inventory:dropItem', (player, id, itemId, posX, posY, posZ, rotX, rotY, rotZ) => {
    inventory.dropItem(player, id, itemId, posX, posY, posZ, rotX, rotY, rotZ);
});

mp.events.addRemoteCounted('server:inventory:deleteDropItem', (player, id) => {
    inventory.deleteDropItem(id);
});

mp.events.addRemoteCounted('server:inventory:deleteItem', (player, id) => {
    inventory.deleteItem(id);
});

mp.events.addRemoteCounted('server:inventory:deleteItemsRange', (player, itemIdFrom, itemIdTo) => {
    inventory.deleteItemsRange(player, itemIdFrom, itemIdTo);
});

mp.events.addRemoteCounted('server:inventory:useItem', (player, id, itemId) => {
    inventory.useItem(player, id, itemId);
});

mp.events.addRemoteCounted('server:inventory:usePlayerItem', (player, id, itemId) => {
    inventory.usePlayerItem(player, id, itemId);
});

mp.events.addRemoteCounted("server:showVehMenu", (player) => {
    if (!user.isLogin(player))
        return;
    if (player.vehicle && player.seat == -1)
        player.call('client:menuList:showVehicleMenu', [Array.from(vehicles.getData(player.vehicle.getVariable('container')))]);
    else
        player.notify('~r~Вы должны находиться в транспорте');
});

mp.events.addRemoteCounted("server:vehicle:lockStatus", (player) => {
    if (!user.isLogin(player))
        return;

    try {
        if (player.vehicle && player.seat == -1) {
            vehicles.lockStatus(player, player.vehicle);
            return;
        }

        let vehicle = methods.getNearestVehicleWithCoords(player.position, 5);
        if (vehicles.exists(vehicle)) {

            if (vehicle.getVariable('useless'))
                return;

            if (user.isAdmin(player)) {
                vehicles.lockStatus(player, vehicle);
                return;
            }

            let data = vehicles.getData(vehicle.getVariable('container'));
            if (vehicle.getVariable('fraction_id')) {
                if (
                    vehicle.getVariable('fraction_id') == user.get(player, 'fraction_id') &&
                    vehicle.getVariable('rank_type') == user.get(player, 'rank_type') &&
                    vehicle.getVariable('rank') <= user.get(player, 'rank')
                )
                    vehicles.lockStatus(player, vehicle);
                else if (vehicle.getVariable('fraction_id') == user.get(player, 'fraction_id') && (user.isLeader(player) || user.isSubLeader(player)))
                    vehicles.lockStatus(player, vehicle);
                else
                    player.notify('~r~У Вас нет ключей от транспорта');
            }
            else if (data.has('owner_id')) {
                if (data.get('owner_id') == user.getId(player))
                    vehicles.lockStatus(player, vehicle);
                else
                    player.notify('~r~У Вас нет ключей от транспорта');
            }
            else if (data.has('rentOwner')) {
                if (data.get('rentOwner') == user.getId(player))
                    vehicles.lockStatus(player, vehicle);
                else
                    player.notify('~r~У Вас нет ключей от транспорта');
            }
            else if (data.has('user_id')) {
                if (data.get('user_id') == user.getId(player))
                    vehicles.lockStatus(player, vehicle);
                else
                    player.notify('~r~У Вас нет ключей от транспорта');
            }
            else
                vehicles.lockStatus(player, vehicle);
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted("onKeyPress:LAlt", (player) => {
    if (!user.isLogin(player))
        return;
    pickups.checkPressLAlt(player);
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
        if (methods.distanceToPos(player.position, val.g1.position) < 4 || methods.distanceToPos(player.position, val.g2.position) < 4 || methods.distanceToPos(player.position, val.g3.position) < 4) {
            let houseData = houses.getHouseData(key);
            if (houseData.get('user_id') != 0)
                player.call('client:showHouseOutVMenu', [Array.from(houseData)]);
        }
    });

    condos.getAll().forEach((val, key, object) => {
        if (methods.distanceToPos(player.position, val.position) < 1.5) {
            let houseData = condos.getHouseData(key);
            if (houseData.get('user_id') == 0)
                player.call('client:showCondoBuyMenu', [Array.from(houseData)]);
            else {
                player.call('client:showCondoOutMenu', [Array.from(houseData)]);
            }
        }
    });

    stocks.getAll().forEach((val, key, object) => {
        if (methods.distanceToPos(player.position, val.pos) < 1.5) {
            let houseData = stocks.getData(key);
            if (houseData.get('user_id') == 0)
                player.call('client:showStockBuyMenu', [Array.from(houseData)]);
            else
                player.call('client:showStockOutMenu', [Array.from(houseData)]);
        }
        if (methods.distanceToPos(player.position, val.vPos) < 4) {
            let houseData = stocks.getData(key);
            if (houseData.get('user_id') != 0)
                player.call('client:showStockOutVMenu', [Array.from(houseData)]);
        }
    });

    if (player.dimension >= enums.offsets.condo && player.dimension < enums.offsets.condoBig) {

        houses.interiorList.forEach(function(item) {
            let x = item[0];
            let y = item[1];
            let z = item[2];

            if (methods.distanceToPos(player.position, new mp.Vector3(x, y, z)) < 1.5) {
                let houseData = condos.getHouseData(player.dimension - enums.offsets.condo);
                player.call('client:showCondoInMenu', [Array.from(houseData)]);
            }
        });

        /*enums.kitchenIntData.forEach(function(item, i, arr) {
            let pos = new mp.Vector3(item[0], item[1], item[2]);
            if (methods.distanceToPos(player.position, pos) < 1.5) {
                player.call('client:showKitchenMenu');
            }
        });*/
    }
    else if (player.dimension >= enums.offsets.stock && player.dimension < enums.offsets.stock + 100000) {

        stocks.interiorList.forEach(function(item) {
            let x = item[0];
            let y = item[1];
            let z = item[2];

            if (methods.distanceToPos(player.position, new mp.Vector3(x, y, z)) < 1.5) {
                let houseData = stocks.getData(player.dimension - enums.offsets.stock);
                player.call('client:showStockInMenu', [Array.from(houseData)]);
            }

            x = item[4];
            y = item[5];
            z = item[6];

            if (methods.distanceToPos(player.position, new mp.Vector3(x, y, z)) < 4) {
                let houseData = stocks.getData(player.dimension - enums.offsets.stock);
                player.call('client:showStockInVMenu', [Array.from(houseData)]);
            }
        });
        stocks.pcList.forEach(function(item) {
            let x = item[0];
            let y = item[1];
            let z = item[2];

            if (methods.distanceToPos(player.position, new mp.Vector3(x, y, z)) < 1.5) {
                let houseData = stocks.getData(player.dimension - enums.offsets.stock);
                if (houseData.get('user_id') == user.getId(player))
                    player.call('client:showStockPanelMenu', [Array.from(houseData)]);
                else
                    player.notify('~r~Вы не владелец склада');
            }
        });
    }
    else if (player.dimension > 0) {

        houses.interiorList.forEach(function(item) {
            let x = item[0];
            let y = item[1];
            let z = item[2];

            if (methods.distanceToPos(player.position, new mp.Vector3(x, y, z)) < 1.5) {
                let houseData = houses.getHouseData(player.dimension);
                player.call('client:showHouseInMenu', [Array.from(houseData)]);
            }
        });

        houses.garageIntList.forEach(function(item) {
            let x = item[0];
            let y = item[1];
            let z = item[2];

            if (methods.distanceToPos(player.position, new mp.Vector3(x, y, z)) < 1.5) {
                let houseData = houses.getHouseData(player.dimension);
                player.call('client:showHouseInGMenu', [Array.from(houseData)]);
            }
        });

        houses.garageList.forEach(function(item) {
            let x = item[0];
            let y = item[1];
            let z = item[2];

            let x1 = item[4];
            let y1 = item[5];
            let z1 = item[6];

            if (methods.distanceToPos(player.position, new mp.Vector3(x, y, z)) < 4 || methods.distanceToPos(player.position, new mp.Vector3(x1, y1, z1)) < 4) {
                let houseData = houses.getHouseData(player.dimension);
                player.call('client:showHouseInVMenu', [Array.from(houseData)]);
            }
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

mp.events.addRemoteCounted('server:tax:payTax', (player, type, score, sum) => {
    tax.payTax(player, type, sum, score);
});

//Houses
mp.events.addRemoteCounted("server:houses:enter", (player, id) => {
    if (!user.isLogin(player))
        return;
    houses.enter(player, id);
});

mp.events.addRemoteCounted("server:houses:enterv", (player, id) => {
    if (!user.isLogin(player))
        return;
    houses.enterv(player, id);
});

mp.events.addRemoteCounted("server:houses:enterGarage", (player, id) => {
    if (!user.isLogin(player))
        return;
    houses.enterGarage(player, id);
});

mp.events.addRemoteCounted("server:houses:exitv", (player, id) => {
    if (!user.isLogin(player))
        return;
    houses.exitv(player, id);
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

//Stocks
mp.events.addRemoteCounted("server:stocks:enter", (player, id) => {
    if (!user.isLogin(player))
        return;
    stocks.enter(player, id);
});

mp.events.addRemoteCounted("server:stocks:enterv", (player, id) => {
    if (!user.isLogin(player))
        return;
    stocks.enterv(player, id);
});

mp.events.addRemoteCounted("server:stocks:buy", (player, id) => {
    if (!user.isLogin(player))
        return;
    stocks.buy(player, id);
});

mp.events.addRemoteCounted("server:stocks:updatePin", (player, id, pin) => {
    if (!user.isLogin(player))
        return;
    stocks.updatePin(id, pin);
});

mp.events.addRemoteCounted("server:stocks:updatePin1", (player, id, pin) => {
    if (!user.isLogin(player))
        return;
    stocks.updatePin1(id, pin);
});

mp.events.addRemoteCounted("server:stocks:updatePin2", (player, id, pin) => {
    if (!user.isLogin(player))
        return;
    stocks.updatePin2(id, pin);
});

mp.events.addRemoteCounted("server:stocks:updatePin3", (player, id, pin) => {
    if (!user.isLogin(player))
        return;
    stocks.updatePin3(id, pin);
});

mp.events.addRemoteCounted("server:stocks:upgradeAdd", (player, id, slot, box) => {
    if (!user.isLogin(player))
        return;
    stocks.upgradeAdd(player, id, slot, box);
});

//Condos
mp.events.addRemoteCounted("server:condos:enter", (player, id) => {
    if (!user.isLogin(player))
        return;
    condos.enter(player, id);
});

mp.events.addRemoteCounted("server:condos:buy", (player, id) => {
    if (!user.isLogin(player))
        return;
    condos.buy(player, id);
});

mp.events.addRemoteCounted("server:condos:updatePin", (player, id, pin) => {
    if (!user.isLogin(player))
        return;
    condos.updatePin(id, pin);
});

mp.events.addRemoteCounted("server:condos:lockStatus", (player, id, lockStatus) => {
    if (!user.isLogin(player))
        return;
    condos.lockStatus(id, lockStatus);
});

//Sell
mp.events.addRemoteCounted('server:houses:sell', (player) => {
    if (!user.isLogin(player))
        return;
    houses.sell(player);
});

mp.events.addRemoteCounted('server:condo:sell', (player) => {
    if (!user.isLogin(player))
        return;
    condos.sell(player);
});

mp.events.addRemoteCounted('server:stock:sell', (player) => {
    if (!user.isLogin(player))
        return;
    stocks.sell(player);
});

mp.events.addRemoteCounted('server:stock:sellAllByClass', (player, className, price) => {
    if (!user.isLogin(player))
        return;
    stocks.sellAllByClass(player, className, price);
});

mp.events.addRemoteCounted('server:stock:sellBySlot', (player, slot) => {
    if (!user.isLogin(player))
        return;
    stocks.sellBySlot(player, slot);
});

mp.events.addRemoteCounted('server:apartments:sell', (player) => {
    if (!user.isLogin(player))
        return;
    //apartments.sell(player); //TODO
});

mp.events.addRemoteCounted('server:yacht:sell', (player) => {
    if (!user.isLogin(player))
        return;
    //apartments.sell(player); //TODO
});

mp.events.addRemoteCounted('server:business:sell', (player) => {
    if (!user.isLogin(player))
        return;
    business.sell(player);
});

mp.events.addRemoteCounted('server:car1:sell', (player) => {
    if (!user.isLogin(player))
        return;
    vehicles.sell(player, 1);
});

mp.events.addRemoteCounted('server:car2:sell', (player) => {
    if (!user.isLogin(player))
        return;
    vehicles.sell(player, 2);
});

mp.events.addRemoteCounted('server:car3:sell', (player) => {
    if (!user.isLogin(player))
        return;
    vehicles.sell(player, 3);
});

mp.events.addRemoteCounted('server:car4:sell', (player) => {
    if (!user.isLogin(player))
        return;
    vehicles.sell(player, 4);
});

mp.events.addRemoteCounted('server:car5:sell', (player) => {
    if (!user.isLogin(player))
        return;
    vehicles.sell(player, 5);
});

mp.events.addRemoteCounted('server:car6:sell', (player) => {
    if (!user.isLogin(player))
        return;
    vehicles.sell(player, 6);
});

mp.events.addRemoteCounted('server:car7:sell', (player) => {
    if (!user.isLogin(player))
        return;
    vehicles.sell(player, 7);
});

mp.events.addRemoteCounted('server:car8:sell', (player) => {
    if (!user.isLogin(player))
        return;
    vehicles.sell(player, 8);
});

mp.events.addRemoteCounted('server:car9:sell', (player) => {
    if (!user.isLogin(player))
        return;
    vehicles.sell(player, 9);
});

mp.events.addRemoteCounted('server:car10:sell', (player) => {
    if (!user.isLogin(player))
        return;
    vehicles.sell(player, 10);
});

mp.events.addRemoteCounted('server:houses:sellToPlayer', (player, buyerId, sum) => {
    if (!user.isLogin(player))
        return;
    if (user.get(player, 'house_id') === 0) {
        player.notify('~r~У Вас нет дома');
        return;
    }

    let hInfo = houses.getHouseData(user.get(player, 'house_id'));
    if (hInfo.get('user_id') != user.get(player, 'id')) {
        player.notify('~r~Этот дом вам не пренадлежит');
        return;
    }

    let buyer = mp.players.at(buyerId);
    if (user.isLogin(buyer)) {

        if (methods.distanceToPos(buyer.position, player.position) > 2) {
            player.notify('~r~Вы слишком далеко');
            return;
        }

        if (user.get(buyer, 'house_id') > 0) {
            player.notify('~r~У игрока уже есть дом');
            buyer.notify('~r~У Вас уже есть дом');
            return;
        }

        let hInfo = houses.getHouseData(user.get(player, 'house_id'));
        buyer.call('client:houses:sellToPlayer', [user.get(player, 'house_id'), `${hInfo.get('address')} #${hInfo.get('number')}`, sum, player.id]);
        buyer.notify('~b~Вам предложили купить дом за ~s~' + methods.moneyFormat(sum));
        player.notify('~b~Вы предложили купить дом игроку');
    }
});

mp.events.addRemoteCounted('server:houses:sellToPlayer:accept', (player, houseId, sum, sellerId) => {
    if (!user.isLogin(player))
        return;
    if (user.get(player, 'house_id') > 0) {
        player.notify('~r~У Вас есть дом');
        return;
    }

    if (user.getCashMoney(player) < sum) {
        player.notify('~r~У Вас нет столько денег');
        return;
    }

    let seller = mp.players.at(sellerId);
    if (user.isLogin(seller)) {

        let hId = user.get(seller, 'house_id');
        if (hId === 0) {
            player.notify('~r~У игрока уже нет дома');
            seller.notify('~r~У Вас нет дома');
            return;
        }

        let hInfo = houses.getHouseData(hId);

        houses.updateOwnerInfo(hId, user.getId(player), user.getRpName(player));
        user.set(player, 'house_id', hId);
        user.set(seller, 'house_id', 0);

        user.addCashMoney(seller, sum);
        user.removeCashMoney(player, sum);

        seller.notify('~b~Вы продали дом за ~s~' + methods.moneyFormat(sum));
        player.notify('~b~Вы купили дом за ~s~' + methods.moneyFormat(sum));

        user.save(player);
        user.save(seller);

        user.addHistory(seller, 3, 'Продал дом ' + hInfo.get('address') + ' №' + hInfo.get('number') + '. Цена: ' + methods.moneyFormat(sum));
        user.addHistory(player, 3, 'Купил дом ' + hInfo.get('address') + ' №' + hInfo.get('number') + '. Цена: ' + methods.moneyFormat(sum));
    }
});

mp.events.addRemoteCounted('server:condo:sellToPlayer', (player, buyerId, sum) => {
    if (!user.isLogin(player))
        return;
    if (user.get(player, 'condo_id') === 0) {
        player.notify('~r~У Вас нет квартиры');
        return;
    }

    let buyer = mp.players.at(buyerId);
    if (user.isLogin(buyer)) {

        if (methods.distanceToPos(buyer.position, player.position) > 2) {
            player.notify('~r~Вы слишком далеко');
            return;
        }

        if (user.get(buyer, 'condo_id') > 0) {
            player.notify('~r~У игрока уже есть квартира');
            buyer.notify('~r~У Вас уже есть квартира');
            return;
        }

        let hInfo = condos.getHouseData(user.get(player, 'condo_id'));
        buyer.call('client:condo:sellToPlayer', [user.get(player, 'condo_id'), `${hInfo.get('address')} #${hInfo.get('number')}`, sum, player.id]);
        buyer.notify('~b~Вам предложили купить квартиру за ~s~' + methods.moneyFormat(sum));
        player.notify('~b~Вы предложили купить квартиру игроку');
    }
});

mp.events.addRemoteCounted('server:condo:sellToPlayer:accept', (player, houseId, sum, sellerId) => {
    if (!user.isLogin(player))
        return;
    if (user.get(player, 'condo_id') > 0) {
        player.notify('~r~У Вас есть квартира');
        return;
    }

    if (user.getCashMoney(player) < sum) {
        player.notify('~r~У Вас нет столько денег');
        return;
    }

    let seller = mp.players.at(sellerId);
    if (user.isLogin(seller)) {

        let hId = user.get(seller, 'condo_id');
        if (hId === 0) {
            player.notify('~r~У игрока уже нет квартиры');
            seller.notify('~r~У Вас нет квартиры');
            return;
        }

        let hInfo = condos.getHouseData(hId);

        condos.updateOwnerInfo(hId, user.getId(player), user.getRpName(player));
        user.set(player, 'condo_id', hId);
        user.set(seller, 'condo_id', 0);

        user.addCashMoney(seller, sum);
        user.removeCashMoney(player, sum);

        seller.notify('~b~Вы продали квартиру за ~s~' + methods.moneyFormat(sum));
        player.notify('~b~Вы купили квартиру за ~s~' + methods.moneyFormat(sum));

        user.save(player);
        user.save(seller);

        user.addHistory(seller, 3, 'Продал квартиру ' + hInfo.get('address') + ' №' + hInfo.get('number') + '. Цена: ' + methods.moneyFormat(sum));
        user.addHistory(player, 3, 'Купил квартиру ' + hInfo.get('address') + ' №' + hInfo.get('number') + '. Цена: ' + methods.moneyFormat(sum));
    }
});

mp.events.addRemoteCounted('server:business:sellToPlayer', (player, buyerId, sum) => {
    if (!user.isLogin(player))
        return;
    if (user.get(player, 'business_id') === 0) {
        player.notify('~r~У Вас нет бизнеса');
        return;
    }

    let buyer = mp.players.at(buyerId);
    if (user.isLogin(buyer)) {

        if (methods.distanceToPos(buyer.position, player.position) > 2) {
            player.notify('~r~Вы слишком далеко');
            return;
        }

        if (user.get(buyer, 'business_id') > 0) {
            player.notify('~r~У игрока уже есть бизнес');
            buyer.notify('~r~У Вас уже есть бизнес');
            return;
        }

        if (user.get(buyer, 'age') < 21) {
            player.notify('~r~Игроку должно быть 21 год');
            return false;
        }

        let hInfo = business.getData(user.get(player, 'business_id'));
        buyer.call('client:business:sellToPlayer', [user.get(player, 'business_id'), `${hInfo.get('name')}`, sum, player.id]);
        buyer.notify('~b~Вам предложили купить бизнес за ~s~' + methods.moneyFormat(sum));
        player.notify('~b~Вы предложили купить бизнес игроку');
    }
});

mp.events.addRemoteCounted('server:business:sellToPlayer:accept', (player, houseId, sum, sellerId) => {
    if (!user.isLogin(player))
        return;
    /*if (user.get(player, 'is_gos_blacklist')) { //TODO
        player.notify('~r~Вы состоите в чёрном списке');
        return;
    }*/

    if (user.get(player, 'business_id') > 0) {
        player.notify('~r~У Вас есть бизнес');
        return;
    }

    if (user.getCashMoney(player) < sum) {
        player.notify('~r~У Вас нет столько денег');
        return;
    }

    if (user.get(player, 'biz_lic') === false) {
        player.notify('~r~У Вас нет лицензии на предпринимательство');
        player.notify('~r~Купить её можно у сотрудников правительства');
        return false;
    }

    if (user.get(player, 'fraction_id') == 1) {
        player.notify('~r~Сотрудникам правительства запрещено покупать бизнес');
        return false;
    }

    let seller = mp.players.at(sellerId);
    if (user.isLogin(seller)) {

        let hId = user.get(seller, 'business_id');
        if (hId === 0) {
            player.notify('~r~У игрока уже нет бизнеса');
            seller.notify('~r~У Вас нет бизнеса');
            return;
        }

        let hInfo = business.getData(hId);

        business.updateOwnerInfo(hId, user.getId(player), user.getRpName(player));
        user.set(player, 'business_id', hId);
        user.set(seller, 'business_id', 0);

        user.addCashMoney(seller, sum);
        user.removeCashMoney(player, sum);

        seller.notify('~b~Вы продали бизнес за ~s~' + methods.moneyFormat(sum));
        player.notify('~b~Вы купили бизнес за ~s~' + methods.moneyFormat(sum));

        user.save(player);
        user.save(seller);

        user.addHistory(seller, 3, 'Продал бизнес ' + hInfo.get('name') + '. Цена: ' + methods.moneyFormat(sum));
        user.addHistory(player, 3, 'Купил бизнес ' + hInfo.get('name') + '. Цена: ' + methods.moneyFormat(sum));
    }
});

mp.events.addRemoteCounted('server:apartments:sellToPlayer', (player, buyerId, sum) => {
    /*if (!user.isLogin(player))
        return;
    if (user.get(player, 'apartment_id') === 0) {
        player.notify('~r~У Вас нет апартаментов');
        return;
    }

    let buyer = mp.players.at(buyerId);
    if (user.isLogin(buyer)) {

        if (methods.distanceToPos(buyer.position, player.position) > 2) {
            player.notify('~r~Вы слишком далеко');
            return;
        }

        if (user.get(buyer, 'apartment_id') > 0) {
            player.notify('~r~У игрока уже есть апартаменты');
            buyer.notify('~r~У Вас уже есть апартаменты');
            return;
        }

        buyer.call('client:apartments:sellToPlayer', [user.get(player, 'apartment_id'), `${hInfo.get('address')} #${hInfo.get('number')}`, sum, player.id]);
        buyer.notify('~b~Вам предложили купить апартаменты за ~s~' + methods.moneyFormat(sum));
        player.notify('~b~Вы предложили купить апартаменты игроку');
    }*/
});

mp.events.addRemoteCounted('server:apartments:sellToPlayer:accept', (player, houseId, sum, sellerId) => {
    /*if (!user.isLogin(player))
        return;
    if (user.get(player, 'apartment_id') > 0) {
        player.notify('~r~У Вас есть апартаменты');
        return;
    }

    if (user.getCashMoney(player) < sum) {
        player.notify('~r~У Вас нет столько денег');
        return;
    }

    let seller = mp.players.at(sellerId);
    if (user.isLogin(seller)) {

        let hId = user.get(seller, 'apartment_id');
        if (hId === 0) {
            player.notify('~r~У игрока уже нет апартаментов');
            seller.notify('~r~У Вас нет апартаментов');
            return;
        }

        apartments.updateOwnerInfo(hId, user.getId(player), user.getRpName(player));
        user.set(player, 'apartment_id', hId);
        user.set(seller, 'apartment_id', 0);

        user.addCashMoney(seller, sum);
        user.removeCashMoney(player, sum);

        seller.notify('~b~Вы продали апартаменты за ~s~' + methods.moneyFormat(sum));
        player.notify('~b~Вы купили апартаменты за ~s~' + methods.moneyFormat(sum));

        user.save(player);
        user.save(seller);

        user.addHistory(seller, 3, 'Продал апартаменты ' + hInfo.get('name') + '. Цена: ' + methods.moneyFormat(sum));
        user.addHistory(player, 3, 'Купил апартаменты ' + hInfo.get('name') + '. Цена: ' + methods.moneyFormat(sum));
    }*/
});

mp.events.addRemoteCounted('server:stock:sellToPlayer', (player, buyerId, sum) => {
    if (!user.isLogin(player))
        return;
    if (user.get(player, 'stock_id') === 0) {
        player.notify('~r~У Вас нет склада');
        return;
    }

    let buyer = mp.players.at(buyerId);
    if (user.isLogin(buyer)) {

        if (methods.distanceToPos(buyer.position, player.position) > 2) {
            player.notify('~r~Вы слишком далеко');
            return;
        }

        if (user.get(buyer, 'stock_id') > 0) {
            player.notify('~r~У игрока уже есть склад');
            buyer.notify('~r~У Вас уже есть склад');
            return;
        }

        let hInfo = stocks.getData(user.get(player, 'stock_id'));
        buyer.call('client:stock:sellToPlayer', [user.get(player, 'stock_id'), `${hInfo.get('address')} #${hInfo.get('number')}`, sum, player.id]);
        buyer.notify('~b~Вам предложили купить склад за ~s~' + methods.moneyFormat(sum));
        player.notify('~b~Вы предложили купить склад игроку');
    }
});

mp.events.addRemoteCounted('server:stock:sellToPlayer:accept', (player, houseId, sum, sellerId) => {
    if (!user.isLogin(player))
        return;
    if (user.get(player, 'stock_id') > 0) {
        player.notify('~r~У Вас есть склад');
        return;
    }

    if (user.getCashMoney(player) < sum) {
        player.notify('~r~У Вас нет столько денег');
        return;
    }

    let seller = mp.players.at(sellerId);
    if (user.isLogin(seller)) {

        let hId = user.get(seller, 'stock_id');
        if (hId === 0) {
            player.notify('~r~У игрока уже нет склада');
            seller.notify('~r~У Вас нет склада');
            return;
        }

        let hInfo = stocks.getData(hId);

        stocks.updateOwnerInfo(hId, user.getId(player), user.getRpName(player));
        user.set(player, 'stock_id', hId);
        user.set(seller, 'stock_id', 0);

        user.addCashMoney(seller, sum);
        user.removeCashMoney(player, sum);

        seller.notify('~b~Вы продали склад за ~s~' + methods.moneyFormat(sum));
        player.notify('~b~Вы купили склад за ~s~' + methods.moneyFormat(sum));

        user.save(player);
        user.save(seller);

        user.addHistory(seller, 3, 'Продал склад ' + hInfo.get('address') + ' №' + hInfo.get('number') + '. Цена: ' + methods.moneyFormat(sum));
        user.addHistory(player, 3, 'Купил склад ' + hInfo.get('address') + ' №' + hInfo.get('number') + '. Цена: ' + methods.moneyFormat(sum));
    }
});

mp.events.addRemoteCounted('server:car:sellToPlayer', (player, buyerId, sum, slot) => {
    if (!user.isLogin(player))
        return;

    if (user.get(player, 'car_id' + slot) == 0) {
        player.notify('~r~У Вас нет транспорта');
        return;
    }

    let buyer = mp.players.at(buyerId);
    if (user.isLogin(buyer)) {

        if (methods.distanceToPos(buyer.position, player.position) > 2) {
            player.notify('~r~Вы слишком далеко');
            return;
        }

        let isValid = false;
        if (user.get(buyer, 'car_id1') == 0)
            isValid = true;
        else if (user.get(buyer, 'car_id2') == 0) {
            if (user.get(buyer, 'house_id') > 0 || user.get(buyer, 'condo_id') > 0 || user.get(buyer, 'apartment_id') > 0 || user.get(buyer, 'yacht_id') > 0)
                isValid = true;
        }
        else if (user.get(buyer, 'car_id3') == 0) {
            if (user.get(buyer, 'house_id') > 0) {
                let hInfo = houses.getHouseData(user.get(buyer, 'house_id'));
                if (hInfo.get('price') > 1000000)
                    isValid = true;
            }
        }
        else if (user.get(buyer, 'car_id4') == 0) {
            if (user.get(buyer, 'house_id') > 0) {
                let hInfo = houses.getHouseData(user.get(buyer, 'house_id'));
                if (hInfo.get('price') > 2500000)
                    isValid = true;
            }
        }
        else if (user.get(buyer, 'car_id5') == 0) {
            if (user.get(buyer, 'house_id') > 0) {
                let hInfo = houses.getHouseData(user.get(buyer, 'house_id'));
                if (hInfo.get('price') > 5000000)
                    isValid = true;
            }
        }
        else if (user.get(buyer, 'car_id6') == 0) {
            if (user.get(buyer, 'house_id') > 0) {
                let hInfo = houses.getHouseData(user.get(buyer, 'house_id'));
                if (hInfo.get('price') > 7500000)
                    isValid = true;
            }
        }

        if (isValid) {
            let vInfo = vehicles.getData(user.get(player, 'car_id' + slot));
            buyer.call('client:car:sellToPlayer', [user.get(player, 'car_id' + slot), vInfo.get('name'), sum, player.id, slot]);
            buyer.notify('~b~Вам предложили купить ' + vInfo.get('name') + ' за ~s~' + methods.moneyFormat(sum));
            player.notify('~b~Вы предложили купить ' + vInfo.get('name') + ' игроку');
        }
        else {
            buyer.notify('~r~У Вас нет доступных свободных слотов');
            player.notify('~r~У игрока нет доступных слотов под ТС');
        }
    }
});

mp.events.addRemoteCounted('server:car:sellToPlayer:accept', (player, houseId, sum, sellerId, slot) => {
    if (!user.isLogin(player))
        return;

    let slotBuy = 0;

    if (user.get(player, 'car_id1') == 0)
        slotBuy = 1;
    else if (user.get(player, 'car_id2') == 0) {
        if (user.get(player, 'house_id') > 0 || user.get(player, 'condo_id') > 0 || user.get(player, 'apartment_id') > 0)
            slotBuy = 2;
    }
    else if (user.get(player, 'car_id3') == 0) {
        if (user.get(player, 'house_id') > 0) {
            let hInfo = houses.getHouseData(user.get(player, 'house_id'));
            if (hInfo.get('price') > 1000000)
                slotBuy = 3;
        }
    }
    else if (user.get(player, 'car_id4') == 0) {
        if (user.get(player, 'house_id') > 0) {
            let hInfo = houses.getHouseData(user.get(player, 'house_id'));
            if (hInfo.get('price') > 2500000)
                slotBuy = 4;
        }
    }
    else if (user.get(player, 'car_id5') == 0) {
        if (user.get(player, 'house_id') > 0) {
            let hInfo = houses.getHouseData(user.get(player, 'house_id'));
            if (hInfo.get('price') > 5000000)
                slotBuy = 5;
        }
    }
    else if (user.get(player, 'car_id6') == 0) {
        if (user.get(player, 'house_id') > 0) {
            let hInfo = houses.getHouseData(user.get(player, 'house_id'));
            if (hInfo.get('price') > 7500000)
                slotBuy = 6;
        }
    }

    if (slotBuy == 0) {
        player.notify('~r~У Вас нет доступных слотов');
        return;
    }

    if (user.getCashMoney(player) < sum) {
        player.notify('~r~У Вас нет столько денег');
        return;
    }

    let seller = mp.players.at(sellerId);
    if (user.isLogin(seller)) {

        let hId = user.get(seller, 'car_id' + slot);
        if (hId === 0) {
            player.notify('~r~У игрока уже нет транспорта');
            seller.notify('~r~У Вас нет транспорта');
            return;
        }

        let vInfo = vehicles.getData(hId);

        vehicles.updateOwnerInfo(hId, user.getId(player), user.getRpName(player));
        user.set(player, 'car_id' + slotBuy, hId);
        user.set(seller, 'car_id' + slot, 0);

        user.addCashMoney(seller, sum);
        user.removeCashMoney(player, sum);

        seller.notify('~b~Вы продали ТС за ~s~' + methods.moneyFormat(sum));
        player.notify('~b~Вы купили ТС за ~s~' + methods.moneyFormat(sum));

        user.save(player);
        user.save(seller);

        user.addHistory(seller, 3, 'Продал транспорт ' + vInfo.get('name') + ' | ' + vInfo.get('number') + '. Цена: ' + methods.moneyFormat(sum));
        user.addHistory(player, 3, 'Купил транспорт ' + vInfo.get('name') + ' | ' + vInfo.get('number') + '. Цена: ' + methods.moneyFormat(sum));
    }
});

mp.events.addRemoteCounted("server:vShop:buy", (player, name, color1, color2, shopId) => {
    if (!user.isLogin(player))
        return;
    vShop.buy(player, name, color1, color2, shopId);
});

mp.events.addRemoteCounted("server:vShop:rent", (player, name, color1, color2, shopId) => {
    if (!user.isLogin(player))
        return;
    vShop.rent(player, name, color1, color2, shopId);
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

mp.events.add("client:exitStaticCheckpoint", (player, checkpointId) => {
    if (!user.isLogin(player))
        return;
    if (Container.Data.Has(999999, 'resetTunning' + checkpointId)) {
        if (player.vehicle && player.vehicle.getVariable('user_id') > 0)
            vehicles.setTunning(player.vehicle);
    }
});

mp.events.addRemoteCounted('server:fixCheckpointList', (player) => {
    methods.updateCheckpointList(player);
    player.call('client:updateItemList', [JSON.stringify(weapons.hashesMap), JSON.stringify(weapons.components), JSON.stringify(items.itemList)]);
});

mp.events.addRemoteCounted('server:updateVehicleInfo', player => {
    user.updateVehicleInfo(player);
});

mp.events.add("server:pSync:fpUpdate", (player, camPitch, camHeading) => {
    try {
        mp.players.call(player.streamedPlayers, "client:pSync:fpUpdate", [player.id, camPitch, camHeading]);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:fraction:vehicleNewRank', (player, id, rank) => {

    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    rank = methods.parseInt(rank);

    mp.vehicles.forEach(veh => {
        if (veh.getVariable('veh_id') == id)
            veh.setVariable('rank', rank);
    });

    vehicles.fractionList.forEach((item, i) => {
        if (item.id == id)
            vehicles.fractionList[i].rank = rank;
    });

    mysql.executeQuery(`UPDATE cars_fraction SET rank = '${rank}' where id = '${id}'`);
    player.notify('~b~Вы изменили доступ к транспорту');
});

mp.events.addRemoteCounted('server:fraction:vehicleNewDep', (player, id, dep) => {

    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    dep = methods.parseInt(dep);
    let rank = enums.fractionListId[user.get(player, 'fraction_id')].rankList[dep].length - 1;

    mp.vehicles.forEach(veh => {
        if (veh.getVariable('veh_id') == id)
            veh.setVariable('rank_type', dep);
        veh.setVariable('rank', rank);
    });

    vehicles.fractionList.forEach((item, i) => {
        if (item.id == id) {
            vehicles.fractionList[i].rank_type = dep;
            vehicles.fractionList[i].rank = rank;
        }
    });

    mysql.executeQuery(`UPDATE cars_fraction SET rank = '${rank}', rank_type = '${dep}' where id = '${id}'`);
    player.notify('~b~Вы перевели транспорт в другой отдел');
});

mp.events.addRemoteCounted('server:fraction:vehicleBuy', (player, id, price) => {

    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    price = methods.parseInt(price);
    let fractionId = user.get(player, 'fraction_id');

    let cofferId = coffer.getIdByFraction(fractionId);
    if (coffer.getMoney(cofferId) < price) {
        player.notify('~r~В бюджете организации не достаточно средств');
        return;
    }

    mysql.executeQuery(`SELECT * FROM cars_fraction WHERE id = '${id}'`, function (err, rows, fields) {
        rows.forEach(function (item) {

            let v = {
                id: item['id'],
                x: item['x'], y: item['y'], z: item['z'], rot: item['rot'],
                name: item['name'], hash: item['hash'], price: item['price'],
                number: item['number'], is_default: item['is_default'],
                rank_type: item['rank_type'], rank: item['rank'], fraction_id: item['fraction_id']
            };
            vehicles.fractionList.push(v);

            methods.saveFractionLog(
                user.getRpName(player),
                `Купил транспорт ${item['name']}`,
                `Потрачено из бюджета: ${methods.moneyFormat(price)}`,
                fractionId
            );

            player.notify(`~b~Вы купили ${item['name']} для организации по цене ${methods.moneyFormat(item['price'])}`);
        });
    });

    coffer.removeMoney(cofferId, price);
    coffer.addMoney(1, price);

    coffer.saveAll();

    mysql.executeQuery(`UPDATE cars_fraction SET is_buy = '1' where id = '${id}'`);
});

mp.events.addRemoteCounted('server:fraction:vehicleSell', (player, id, price) => {

    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    price = methods.parseInt(price);
    let fractionId = user.get(player, 'fraction_id');

    let cofferId = coffer.getIdByFraction(fractionId);

    coffer.addMoney(cofferId, price);
    coffer.removeMoney(1, price);

    vehicles.fractionList.forEach((item, i) => {
        if (item.id == id) {
            vehicles.fractionList[i].fraction_id = 0;
        }
    });

    coffer.saveAll();

    mysql.executeQuery(`SELECT * FROM cars_fraction WHERE id = '${id}'`, function (err, rows, fields) {
        rows.forEach(function (item) {
            methods.saveFractionLog(
                user.getRpName(player),
                `Продал транспорт ${item['name']}`,
                `Получено в бюджет: ${methods.moneyFormat(price)}`,
                fractionId
            );
        });
    });

    mysql.executeQuery(`UPDATE cars_fraction SET is_buy = '0' where id = '${id}'`);
    player.notify(`~b~Вы продали транспорт организации по цене ${methods.moneyFormat(price)}`);
});

mp.events.addRemoteCounted('server:vehicle:spawnFractionCar', (player, id) => {
    if (!user.isLogin(player))
        return;
    vehicles.spawnFractionCar(id);
    player.notify('~b~Транспорт стоит на парковке, возьмите его');
});

mp.events.addRemoteCounted('server:user:uninvite', (player, id) => {

    if (!user.isLogin(player))
        return;

    if (!user.isLeader(player) && !user.isSubLeader(player)) {
        player.notify('~r~Вы не лидер чтобы уволнять или зам лидера');
        return;
    }

    id = methods.parseInt(id);
    let target = user.getPlayerById(id);
    if (user.isLogin(target)) {

        user.addHistory(target, 0, 'Был уволен из организации ' + methods.getFractionName(user.get(player, 'fraction_id')) + '. Уволил: ' + user.getRpName(player));

        user.set(target, 'rank', 0);
        user.set(target, 'rank_type', 0);
        user.set(target, 'fraction_id', 0);
        user.set(target, 'is_leader', false);
        user.set(target, 'is_sub_leader', false);

        target.notify('~r~Вас уволили из организации');
        player.notify('~b~Вы уволили сотрудника: ~s~' + user.getRpName(target));

        user.save(target);
    }
    else {
        mysql.executeQuery(`UPDATE users SET rank = '0', rank_type = '0', fraction_id = '0', is_sub_leader = '0' where id = '${id}' AND is_leader <> 1`);
        player.notify('~b~Вы уволили сотрудника');
        user.addHistoryById(id, 0, 'Был уволен из организации ' + methods.getFractionName(user.get(player, 'fraction_id')) + '. Уволил: ' + user.getRpName(player));
    }
});

mp.events.addRemoteCounted('server:user:uninvite2', (player, id) => {

    if (!user.isLogin(player))
        return;

    if (!user.isLeader2(player) && !user.isSubLeader2(player)) {
        player.notify('~r~Вы не лидер чтобы уволнять или зам лидера');
        return;
    }

    id = methods.parseInt(id);
    let target = user.getPlayerById(id);
    if (user.isLogin(target)) {

        user.set(target, 'rank2', 0);
        user.set(target, 'rank_type2', 0);
        user.set(target, 'fraction_id2', 0);
        user.set(target, 'is_leader2', false);
        user.set(target, 'is_sub_leader2', false);

        target.notify('~r~Вас уволили из организации');
        player.notify('~b~Вы уволили сотрудника: ~s~' + user.getRpName(target));

        user.save(target);
    }
    else {
        mysql.executeQuery(`UPDATE users SET rank2 = '0', rank_type2 = '0', fraction_id2 = '0', is_sub_leader2 = '0' where id = '${id}' AND is_leader2 <> 1`);
        player.notify('~b~Вы уволили сотрудника');
    }
});

mp.events.addRemoteCounted('server:user:invite', (player, id) => {

    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    let target = mp.players.at(id);
    if (user.isLogin(target)) {

        if (target.id == player.id) {
            player.notify('~r~Здравствуйте, я хотел вставить сюда шутку, но я ее не придумал, в общем, как ты собрался самого себя принять в организацию в которой ты уже состоишь?');
            return;
        }

        if (methods.distanceToPos(target.position, player.position) > 5) {
            player.notify('~r~Вы слишком далеко друг от друга');
            return;
        }

        if (user.get(target, 'fraction_id') > 0) {
            player.notify('~r~Игрок уже состоит в организации');
            return;
        }

        user.addHistory(target, 0, 'Был принят в организацию ' + user.getFractionName(player) + '. Принял: ' + user.getRpName(player));

        let rank = enums.fractionListId[user.get(player, 'fraction_id')].rankList[0].length - 1;

        user.set(target, 'rank', rank);
        user.set(target, 'rank_type', 0);
        user.set(target, 'fraction_id', user.get(player, 'fraction_id'));
        user.set(target, 'is_leader', false);
        user.set(target, 'is_sub_leader', false);
        user.set(target, 'job', 0);

        target.notify('~g~Вас приняли в организацию ' + user.getFractionName(player));
        player.notify('~b~Вы приняли сотрудника: ~s~' + user.getRpName(target));

        user.save(target);
    }
    else {
        player.notify('~r~Игрок не найден');
    }
});

mp.events.addRemoteCounted('server:user:askSellLic', (player, id, lic, price) => {

    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    price = methods.parseFloat(price);
    let target = mp.players.at(id);
    if (user.isLogin(target)) {

        if (methods.distanceToPos(target.position, player.position) > 5) {
            player.notify('~r~Вы слишком далеко друг от друга');
            return;
        }

        let licName = '';
        switch (lic) {
            case 'a_lic':
                licName = 'Лицензия категории А';
                break;
            case 'b_lic':
                licName = 'Лицензия категории B';
                break;
            case 'c_lic':
                licName = 'Лицензия категории C';
                break;
            case 'air_lic':
                licName = 'Лицензия на воздушный транспорт';
                break;
            case 'ship_lic':
                licName = 'Лицензия на водный транспорт';
                break;
            case 'taxi_lic':
                licName = 'Лицензия на перевозку пассажиров';
                break;
            case 'law_lic':
                licName = 'Лицензия юриста';
                break;
            case 'gun_lic':
                licName = 'Лицензия на оружие';
                break;
            case 'biz_lic':
                licName = 'Лицензия на предпринимательство';
                break;
            case 'fish_lic':
                licName = 'Разрешение на рыбаловство';
                break;
            case 'med_lic':
                licName = 'Мед. страховка';
                break;
        }

        target.call('client:menuList:showAskBuyLicMenu', [player.id, lic, licName, price])
    }
    else {
        player.notify('~r~Игрок не найден');
    }
});

mp.events.addRemoteCounted('server:user:buyLicensePlayer', (player, id, lic, price) => {

    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    price = methods.parseFloat(price);
    let target = mp.players.at(id);
    if (user.isLogin(target)) {

        if (methods.distanceToPos(target.position, player.position) > 5) {
            player.notify('~r~Вы слишком далеко друг от друга');
            return;
        }

        if (user.getMoney(player) < price) {
            player.notify('~r~У Вас не достаточно средств');
            return;
        }

        user.removeMoney(player, price, 'Покупка лицензии');
        user.addMoney(target, price * 0.2, 'Продажа лицензии лицензии');
        coffer.addMoney(coffer.getIdByFraction(user.get(target, 'fraction_id')), price * 0.8);

        methods.saveFractionLog(
            user.getRpName(target),
            `Выдал "${methods.getLicName(lic)}" гражданину ${user.getRpName(player)}`,
            `Пополнение бюджета: ${methods.moneyFormat(price * 0.8)}`,
            user.get(target, 'fraction_id')
        );

        user.giveLic(player, lic, 24, `Выдал: ${user.getRpName(target)}`);
        player.notify('~g~Поздравляем с покупкой ~s~' + methods.getLicName(lic));
        target.notify(`~g~Вы заработали ${methods.moneyFormat(price * 0.2)}\n~g~В бюджет организации поступило ${methods.moneyFormat(price * 0.8)}`);
    }
    else {
        player.notify('~r~Игрок не найден');
    }
});

mp.events.addRemoteCounted('server:user:giveMeWanted', (player, level, reason) => {
    if (!user.isLogin(player))
        return;
    user.giveWanted(player, level, reason);
});

mp.events.addRemoteCounted('server:user:giveWanted', (player, id, level, reason) => {
    if (!user.isLogin(player))
        return;
    try {
        let p = user.getPlayerById(id);
        if (user.isLogin(p)) {
            if (reason == 'clear') {

                methods.saveFractionLog(
                    user.getRpName(player),
                    `Очистил розыск гражданину ${user.getRpName(p)}`,
                    ``,
                    user.get(player, 'fraction_id')
                );

                player.notify('~g~Вы очистили розыск');
            }
            else {
                player.notify('~g~Вы выдали розыск');
            }

            methods.saveLog('log_give_wanted',
                ['user_from', 'user_to', 'lvl', 'reason'],
                [`${user.getRpName(player)} (${user.getId(player)})`, `${user.getRpName(p)} (${user.getId(p)})`, level, methods.removeQuotes(methods.removeQuotes2(reason))],
            );
            user.giveWanted(p, level, reason);
        }
        else
            player.notify('~r~Игрок не найден');
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:user:arrest', (player, id) => {
    if (!user.isLogin(player))
        return;
    try {
        let p = mp.players.at(id);
        if (user.isLogin(p)) {

            if (methods.distanceToPos(p.position, player.position) > 10) {
                player.notify('~r~Вы слишком далеко друг от друга');
                return;
            }

            if (!user.isLogin(p) || user.get(p, 'wanted_level') <= 0) {
                player.notify('~r~У игрока нет розыска');
                return;
            }
            coffer.addMoney(coffer.getIdByFraction(user.get(player, 'fraction_id'), 1500));
            user.addMoney(player, 1500, 'Премия');
            player.notify('~g~Вы произвели арест. Премия: ~s~$1,500');

            methods.saveFractionLog(
                user.getRpName(player),
                `Произвел арест ${user.getRpName(p)}`,
                `Пополнение бюджета: ${methods.moneyFormat(1500)}`,
                user.get(player, 'fraction_id')
            );

            user.arrest(p);
        }
        else
            player.notify('~r~Игрок не найден');
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:user:giveSubLeader', (player, id) => {

    if (!user.isLogin(player))
        return;

    if (!user.isLeader(player)) {
        player.notify('~r~Вы не лидер чтобы выдавать такие полномочия');
        return;
    }

    id = methods.parseInt(id);
    let target = user.getPlayerById(id);
    if (user.isLogin(target)) {

        user.addHistory(target, 0, 'Были выданы полномочия заместителя в организации ' + methods.getFractionName(user.get(player, 'fraction_id')) + '. Выдал: ' + user.getRpName(player));

        user.set(target, 'is_sub_leader', true);

        target.notify('~g~Вам выдали полномочия заместителя');
        player.notify('~b~Вы выдали полномочия заместителя: ~s~' + user.getRpName(target));

        user.save(target);
    }
    else {
        mysql.executeQuery(`UPDATE users SET is_sub_leader = '1' where id = '${id}' AND is_leader <> 1`);
        player.notify('~b~Вы выдали полномочия заместителя');
        user.addHistoryById(id, 0, 'Были выданы полномочия заместителя в организации ' + methods.getFractionName(user.get(player, 'fraction_id')) + '. Выдал: ' + user.getRpName(player));
    }
});

mp.events.addRemoteCounted('server:user:giveSubLeader2', (player, id) => {

    if (!user.isLogin(player))
        return;

    if (!user.isLeader2(player)) {
        player.notify('~r~Вы не лидер чтобы выдавать такие полномочия');
        return;
    }

    id = methods.parseInt(id);
    let target = user.getPlayerById(id);
    if (user.isLogin(target)) {

        user.set(target, 'is_sub_leader2', true);

        target.notify('~g~Вам выдали полномочия заместителя');
        player.notify('~b~Вы выдали полномочия заместителя: ~s~' + user.getRpName(target));

        user.save(target);
    }
    else {
        mysql.executeQuery(`UPDATE users SET is_sub_leader2 = '1' where id = '${id}' AND is_leader2 <> 1`);
        player.notify('~b~Вы выдали полномочия заместителя');
    }
});

mp.events.addRemoteCounted('server:user:giveLeader2', (player, id) => {

    if (!user.isLogin(player))
        return;

    if (!user.isLeader2(player)) {
        player.notify('~r~Вы не лидер чтобы выдавать такие полномочия');
        return;
    }

    id = methods.parseInt(id);
    let target = user.getPlayerById(id);
    if (user.isLogin(target)) {

        user.set(player, 'is_sub_leader2', true);
        user.set(target, 'is_sub_leader2', false);

        user.set(player, 'is_leader2', false);
        user.set(target, 'is_leader2', true);

        target.notify('~g~Вам выдали полномочия лидера');
        player.notify('~b~Вы выдали полномочия лидера: ~s~' + user.getRpName(target));

        user.save(target);
        user.save(player);
    }
    else {
        mysql.executeQuery(`UPDATE users SET is_sub_leader2 = '0', is_leader2 = '1' where id = '${id}' AND is_leader2 <> 1`);
        player.notify('~b~Вы выдали полномочия лидера');
        user.set(player, 'is_sub_leader2', true);
        user.set(player, 'is_leader2', false);
        user.save(player);
    }
});

mp.events.addRemoteCounted('server:user:takeSubLeader', (player, id) => {

    if (!user.isLogin(player))
        return;

    if (!user.isLeader(player)) {
        player.notify('~r~Вы не лидер чтобы выдавать такие полномочия');
        return;
    }

    id = methods.parseInt(id);
    let target = user.getPlayerById(id);

    let rank = enums.fractionListId[user.get(player, 'fraction_id')].rankList[0].length - 1;

    if (user.isLogin(target)) {

        user.addHistory(target, 0, 'Были изъяты полномочия заместителя в организации ' + methods.getFractionName(user.get(player, 'fraction_id')) + '. Выдал: ' + user.getRpName(player));

        user.set(target, 'rank', rank);
        user.set(target, 'rank_type', 0);
        user.set(target, 'is_sub_leader', false);

        target.notify('~r~У Вас изъяли полномочия заместителя');
        player.notify('~b~Вы изъяли полномочия заместителя: ~s~' + user.getRpName(target));

        user.save(target);
    }
    else {
        mysql.executeQuery(`UPDATE users SET is_sub_leader = '0', rank = '${rank}', rank_type = '0' where id = '${id}' AND is_leader <> 1`);
        player.notify('~b~Вы изъяли полномочия заместителя: ~s~' + id);
        user.addHistoryById(id, 0, 'Были изъяты полномочия заместителя в организации ' + methods.getFractionName(user.get(player, 'fraction_id')) + '. Выдал: ' + user.getRpName(player));
    }
});

mp.events.addRemoteCounted('server:user:takeSubLeader2', (player, id) => {

    if (!user.isLogin(player))
        return;

    if (!user.isLeader2(player)) {
        player.notify('~r~Вы не лидер чтобы выдавать такие полномочия');
        return;
    }

    id = methods.parseInt(id);
    let target = user.getPlayerById(id);

    let rank = JSON.parse(fraction.getData(user.get(player, 'fraction_id2')).get('rank_list')).length - 1;

    if (user.isLogin(target)) {

        user.set(target, 'rank2', rank);
        user.set(target, 'rank_type2', 0);
        user.set(target, 'is_sub_leader2', false);

        target.notify('~r~У Вас изъяли полномочия заместителя');
        player.notify('~b~Вы изъяли полномочия заместителя: ~s~' + user.getRpName(target));

        user.save(target);
    }
    else {
        mysql.executeQuery(`UPDATE users SET is_sub_leader2 = '0', rank2 = '${rank}', rank_type2 = '0' where id = '${id}' AND is_leader2 <> 1`);
        player.notify('~b~Вы изъяли полномочия заместителя: ~s~' + id);
    }
});

mp.events.addRemoteCounted('server:user:newRank', (player, id, rank) => {

    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    rank = methods.parseInt(rank);

    if (!user.isLeader(player) && !user.isSubLeader(player)) {
        if (user.get(player, 'rank') >= rank) {
            player.notify('~r~У Вас нет полномочий чтобы выдавать данную должность');
            return;
        }
    }

    let target = user.getPlayerById(id);
    if (user.isLogin(target)) {

        user.addHistory(target, 0, 'Была выдана новая должность ' + rankName + '. Выдал: ' + user.getRpName(player));

        user.set(target, 'rank', rank);

        target.notify('~g~Вам была выдана новая должность');
        player.notify('~b~Вы выдали новую должность: ~s~' + user.getRpName(target));

        user.save(target);
    }
    else {
        mysql.executeQuery(`UPDATE users SET rank = '${rank}' where id = '${id}' AND is_leader <> 1`);
        player.notify('~b~Вы выдали новую должность');
        user.addHistoryById(id, 0, 'Была выдана новая должность. Выдал: ' + user.getRpName(player));
    }
});


mp.events.addRemoteCounted('server:user:newRank2', (player, id, rank) => {

    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    rank = methods.parseInt(rank);

    if (!user.isLeader2(player) && !user.isSubLeader2(player)) {
        if (user.get(player, 'rank2') >= rank) {
            player.notify('~r~У Вас нет полномочий чтобы выдавать данную должность');
            return;
        }
    }

    let target = user.getPlayerById(id);
    if (user.isLogin(target)) {

        user.set(target, 'rank2', rank);

        target.notify('~g~Вам была выдана новая должность');
        player.notify('~b~Вы выдали новую должность: ~s~' + user.getRpName(target));

        user.save(target);
    }
    else {
        mysql.executeQuery(`UPDATE users SET rank2 = '${rank}' where id = '${id}' AND is_leader2 <> 1`);
        player.notify('~b~Вы выдали новую должность');
    }
});

mp.events.addRemoteCounted('server:user:newDep', (player, id, dep) => {

    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    dep = methods.parseInt(dep);

    let depName = methods.getDepartmentName(user.get(player, 'fraction_id'), dep);
    let rank = enums.fractionListId[user.get(player, 'fraction_id')].rankList[dep].length - 1;

    let target = user.getPlayerById(id);
    if (user.isLogin(target)) {

        user.addHistory(target, 0, 'Был переведен в отдел ' + depName + '. Выдал: ' + user.getRpName(player));

        user.set(target, 'rank', rank);
        user.set(target, 'rank_type', dep);

        target.notify('~g~Вас перевели в другой отдел~s~ ' + depName);
        player.notify('~b~Вы перевели в другой отдел: ~s~' + user.getRpName(target));

        user.save(target);
    }
    else {
        mysql.executeQuery(`UPDATE users SET rank = '${rank}', rank_type = '${dep}' where id = '${id}' AND is_leader <> 1`);
        player.notify('~b~Вы перевели в другой отдел');
        user.addHistoryById(id, 0, 'Был переведен в отдел ' + depName + '. Выдал: ' + user.getRpName(player));
    }
});

mp.events.addRemoteCounted('server:user:newDep2', (player, id, dep) => {

    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    dep = methods.parseInt(dep);

    let rank = JSON.parse(fraction.getData(user.get(player, 'fraction_id2')).get('rank_list')).length - 1;

    let target = user.getPlayerById(id);
    if (user.isLogin(target)) {

        user.set(target, 'rank2', rank);
        user.set(target, 'rank_type2', dep);

        target.notify('~g~Вас перевели в другой отдел');
        player.notify('~b~Вы перевели в другой отдел: ~s~' + user.getRpName(target));

        user.save(target);
    }
    else {
        mysql.executeQuery(`UPDATE users SET rank2 = '${rank}', rank_type2 = '${dep}' where id = '${id}' AND is_leader2 <> 1`);
        player.notify('~b~Вы перевели в другой отдел');
    }
});

mp.events.addRemoteCounted('server:user:fixNearestVehicle', (player) => {
    if (!user.isLogin(player))
        return;
    let veh = methods.getNearestVehicleWithCoords(player.position, 10.0);
    if (vehicles.exists(veh))
        veh.repair();
});

mp.events.addRemoteCounted('server:user:giveWeaponComponent', (player, weapon, component) => {
    if (!user.isLogin(player))
        return;
    user.giveWeaponComponent(player, methods.parseInt(weapon), methods.parseInt(component));
});

mp.events.addRemoteCounted('server:user:removeWeaponComponent', (player, weapon, component) => {
    if (!user.isLogin(player))
        return;
    user.removeWeaponComponent(player, methods.parseInt(weapon), methods.parseInt(component));
});

mp.events.addRemoteCounted('server:user:removeAllWeaponComponents', (player, weapon) => {
    if (!user.isLogin(player))
        return;
    user.removeAllWeaponComponents(player, methods.parseInt(weapon));
});

mp.events.addRemoteCounted('server:user:setWeaponTint', (player, weapon, tint) => {
    if (!user.isLogin(player))
        return;
    user.setWeaponTint(player, methods.parseInt(weapon), methods.parseInt(tint));
});

mp.events.addRemoteCounted('server:respawnNearstVehicle', (player) => {
    if (!user.isLogin(player))
        return;
    let vehicle = methods.getNearestVehicleWithCoords(player.position, 5);
    vehicles.respawn(vehicle);
});

mp.events.addRemoteCounted('server:respawnNearstVehicle2', (player) => {
    if (!user.isLogin(player))
        return;
    let vehicle = methods.getNearestVehicleWithCoords(player.position, 5);
    vehicles.respawn2(vehicle, player);
});

mp.events.addRemoteCounted('server:flipNearstVehicle', (player) => {
    if (!user.isLogin(player))
        return;
    let vehicle = methods.getNearestVehicleWithCoords(player.position, 5);
    if (vehicles.exists(vehicle))
        vehicle.rotation = new mp.Vector3(0, 0, vehicle.heading);
});

mp.events.addRemoteCounted('server:vehicle:engineStatus', (player) => {
    if (!user.isLogin(player))
        return;
    try {
        if (player.vehicle && player.seat == -1) {
            vehicles.engineStatus(player, player.vehicle);
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:vehicle:neonStatus', (player) => {
    if (!user.isLogin(player))
        return;
    try {
        if (player.vehicle && player.seat == -1) {
            vehicles.neonStatus(player, player.vehicle);
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:vehicle:setColor', (player, color1, color2) => {
    if (!user.isLogin(player))
        return;
    try {
        if (player.vehicle && player.seat == -1) {
            player.vehicle.setColor(color1, color2);
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:vehicle:setLivery', (player, liv) => {
    if (!user.isLogin(player))
        return;
    try {
        if (player.vehicle && player.seat == -1) {
            player.vehicle.livery = liv;
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:sellVeh', (player) => {
    if (!user.isLogin(player))
        return;
    let veh = player.vehicle;
    if (!vehicles.exists(veh))
        return;

    if (weather.getHour() < 22 && weather.getHour() > 4) {
        player.notify('~r~Доступно только с 22 до 4 утра игрового времени');
        return;
    }

    if (user.has(player, 'grabVeh')) {
        player.notify('~r~Вы не можете сейчас сбыть транспорт');
        return;
    }

    let price = methods.getVehicleInfo(veh.model).price * 0.01;
    if (price > 2000)
        price = 2000;
    let money = 200 + price;

    let containerId = veh.getVariable('container');
    if (containerId != undefined && veh.getVariable('user_id') > 0) {
        vehicles.set(containerId, 'is_cop_park', 1);
        vehicles.set(containerId, 'cop_park_name', 'В угоне');
        vehicles.save(containerId);
    }

    user.showLoadDisplay(player);

    user.addCryptoMoney(player, money / 1000);
    user.removeRep(player, 50);
    user.set(player, 'grabVeh', true);

    setTimeout(function () {
        if (!user.isLogin(player))
            return;
        user.hideLoadDisplay(player);
        player.notify('~g~Вы заработали: ~s~' + methods.numberFormat(money) + 'ec');
        if (!vehicles.exists(veh))
            return;
        vehicles.respawn(veh);
    }, 1000);
});

mp.events.addRemoteCounted('server:lsc:showTun', (player, modType, idx) => {
    if (!user.isLogin(player))
        return;
    lsc.showTun(player, modType, idx);
});

mp.events.addRemoteCounted('server:lsc:buyTun', (player, modType, idx, price, shopId, itemName) => {
    if (!user.isLogin(player))
        return;
    lsc.buyTun(player, modType, idx, price, shopId, itemName);
});

mp.events.addRemoteCounted('server:lsc:showColor1', (player, idx) => {
    if (!user.isLogin(player))
        return;
    lsc.showColor1(player, idx);
});

mp.events.addRemoteCounted('server:lsc:showColor2', (player, idx) => {
    if (!user.isLogin(player))
        return;
    lsc.showColor2(player, idx);
});

mp.events.addRemoteCounted('server:lsc:showColor3', (player, idx) => {
    if (!user.isLogin(player))
        return;
    lsc.showColor3(player, idx);
});

mp.events.addRemoteCounted('server:lsc:showColor4', (player, idx) => {
    if (!user.isLogin(player))
        return;
    lsc.showColor4(player, idx);
});

mp.events.addRemoteCounted('server:lsc:buyColor1', (player, idx, price, shopId, itemName) => {
    if (!user.isLogin(player))
        return;
    lsc.buyColor1(player, idx, methods.parseInt(price), shopId, itemName);
});

mp.events.addRemoteCounted('server:lsc:buyColor2', (player, idx, price, shopId, itemName) => {
    if (!user.isLogin(player))
        return;
    lsc.buyColor2(player, idx, methods.parseInt(price), shopId, itemName);
});

mp.events.addRemoteCounted('server:lsc:buyColor3', (player, idx, price, shopId, itemName) => {
    if (!user.isLogin(player))
        return;
    lsc.buyColor3(player, idx, methods.parseInt(price), shopId, itemName);
});

mp.events.addRemoteCounted('server:lsc:buyColor4', (player, idx, price, shopId, itemName) => {
    if (!user.isLogin(player))
        return;
    lsc.buyColor4(player, idx, methods.parseInt(price), shopId, itemName);
});

mp.events.addRemoteCounted('server:lsc:buyNumber', (player, shopId, newNumber) => {
    if (!user.isLogin(player))
        return;
    lsc.buyNumber(player, shopId, newNumber);
});

mp.events.addRemoteCounted('server:lsc:repair', (player, shopId, price) => {
    if (!user.isLogin(player))
        return;
    lsc.repair(player, price, shopId);
});

mp.events.addRemoteCounted('server:lsc:buyNeon', (player, shopId, price) => {
    if (!user.isLogin(player))
        return;
    lsc.buyNeon(player, price, shopId);
});

mp.events.addRemoteCounted('server:lsc:buySpecial', (player, shopId, price) => {
    if (!user.isLogin(player))
        return;
    lsc.buySpecial(player, price, shopId);
});

mp.events.addRemoteCounted('server:vehicle:occ', (player) => {
    if (!user.isLogin(player))
        return;
    try {
        if (player.vehicle && player.seat == -1) {

            player.vehicle.getOccupants().forEach(function (pl) {
                console.log(user.getRpName(pl));
            })
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:vehicle:park', (player) => {
    if (!user.isLogin(player))
        return;
    try {
        let veh = player.vehicle;
        if (veh) {
            let pos = veh.position;
            vehicles.park(veh.getVariable('container'), pos.x, pos.y, pos.z, veh.heading, veh.dimension);
            player.notify('~b~Вы припарковали свой транспорт');
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:vehicle:park2', (player) => {
    if (!user.isLogin(player))
        return;
    try {
        let veh = player.vehicle;
        if (veh) {
            vehicles.set(veh.getVariable('container'), 'is_cop_park', 0);
            vehicles.set(veh.getVariable('container'), 'cop_park_name', '');
            player.notify('~b~Вы оплатили штраф, теперь ваш транспорт будет спавнится на месте парковки');
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:vehicle:cargoUnload', (player, id) => {
    if (!user.isLogin(player))
        return;
    stocks.cargoUnload(player, id);
});

mp.events.addRemoteCounted('server:vehicle:ejectById', (player, id) => {
    if (!user.isLogin(player))
        return;
    player.vehicle.getOccupants().forEach(p => {
        if (user.isLogin(p) && p.id === id) {
            p.notify('~r~Вас выкинули из транспорта');
            p.removeFromVehicle();
        }
    })
});

mp.events.addRemoteCounted('server:vehicle:setNeonColor', (player, r, g, b) => {
    if (!user.isLogin(player))
        return;
    try {
        if (player.vehicle && player.seat == -1) {
            player.vehicle.setNeonColor(r, g, b);
            vehicles.set(player.vehicle.getVariable('container'), 'neon_r', r);
            vehicles.set(player.vehicle.getVariable('container'), 'neon_g', g);
            vehicles.set(player.vehicle.getVariable('container'), 'neon_b', b);
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:gun:buy', (player, itemId, price, count, superTint, tint, shopId) => {
    if (!user.isLogin(player))
        return;
    gun.buy(player, itemId, price, count, superTint, tint, shopId);
});

mp.events.addRemoteCounted('server:shop:buy', (player, itemId, price, shopId) => {
    if (!user.isLogin(player))
        return;
    shop.buy(player, itemId, price, shopId);
});

mp.events.addRemoteCounted('server:uniform:sapd', (player, idx) => {
    try {
        switch (idx)
        {
            case 0:

                user.reset(player, "hasMask");

                user.setComponentVariation(player, 1, 0, 0);
                user.setComponentVariation(player, 7, 0, 0);
                user.setComponentVariation(player, 9, 0, 0);
                user.setComponentVariation(player, 10, 0, 0);
                user.clearAllProp(player);

                user.updateCharacterCloth(player);
                user.updateCharacterFace(player);
                break;
            case 1:
                user.clearAllProp(player);

                if (user.getSex(player) == 1) {
                    user.setComponentVariation(player, 3, 0, 0);
                    user.setComponentVariation(player, 4, 37, 0);
                    user.setComponentVariation(player, 5, 0, 0);
                    user.setComponentVariation(player, 6, 29, 0);
                    user.setComponentVariation(player, 7, 0, 0);
                    user.setComponentVariation(player, 8, 35, 0);
                    user.setComponentVariation(player, 9, 0, 0);
                    user.setComponentVariation(player, 10, 0, 0);
                    user.setComponentVariation(player, 11, 86, 0);
                }
                else {
                    user.setComponentVariation(player, 0, 1, 0);
                    user.setComponentVariation(player, 1, 0, 0);
                    user.setComponentVariation(player, 3, 11, 0);
                    user.setComponentVariation(player, 4, 35, 0);
                    user.setComponentVariation(player, 5, 0, 0);
                    user.setComponentVariation(player, 6, 54, 0);
                    user.setComponentVariation(player, 7, 38, 0);
                    user.setComponentVariation(player, 8, 58, 0);
                    user.setComponentVariation(player, 9, 0, 0);
                    user.setComponentVariation(player, 10, 0, 0);
                    user.setComponentVariation(player, 11, 13, 3);
                }
                break;
            case 2:
                user.clearAllProp(player);

                if (user.getSex(player) == 1) {
                    user.setComponentVariation(player, 0, 1, 0);
                    user.setComponentVariation(player, 1, 0, 0);
                    user.setComponentVariation(player, 3, 14, 0);
                    user.setComponentVariation(player, 4, 34, 0);
                    user.setComponentVariation(player, 5, 0, 0);
                    user.setComponentVariation(player, 6, 52, 0);
                    user.setComponentVariation(player, 7, 0, 0);
                    user.setComponentVariation(player, 8, 35, 0);
                    user.setComponentVariation(player, 10, 0, 0);
                    user.setComponentVariation(player, 11, 48, 0);

                    if (user.get(player, 'rank') == 3)
                        user.setComponentVariation(player, 10, 7, 1);
                    else if (user.get(player, 'rank') == 4)
                        user.setComponentVariation(player, 10, 7, 2);
                    else if (user.get(player, 'rank') > 4)
                        user.setComponentVariation(player, 10, 7, 3);
                }
                else {
                    user.setComponentVariation(player, 0, 1, 0);
                    user.setComponentVariation(player, 1, 0, 0);
                    user.setComponentVariation(player, 3, 0, 0);
                    user.setComponentVariation(player, 4, 35, 0);
                    user.setComponentVariation(player, 5, 0, 0);
                    user.setComponentVariation(player, 6, 54, 0);
                    user.setComponentVariation(player, 7, 0, 0);
                    user.setComponentVariation(player, 8, 58, 0);
                    user.setComponentVariation(player, 10, 0, 0);
                    user.setComponentVariation(player, 11, 55, 0);

                    if (user.get(player, 'rank') == 3)
                        user.setComponentVariation(player, 10, 8, 1);
                    else if (user.get(player, 'rank') == 4)
                        user.setComponentVariation(player, 10, 8, 2);
                    else if (user.get(player, 'rank') > 4)
                        user.setComponentVariation(player, 10, 8, 3);
                }

                user.setComponentVariation(player, 9, 0, 0);
                break;
            case 3:

                user.reset(player, "hasMask");
                user.updateCharacterFace(player);

                user.setProp(player, 0, 19, 0);

                if (user.getSex(player) == 1) {
                    user.setComponentVariation(player, 0, 1, 0);
                    user.setComponentVariation(player, 1, 0, 0);
                    user.setComponentVariation(player, 3, 19, 0);
                    user.setComponentVariation(player, 4, 38, 2);
                    user.setComponentVariation(player, 5, 57, 9);
                    user.setComponentVariation(player, 6, 52, 0);
                    user.setComponentVariation(player, 7, 0, 0);
                    user.setComponentVariation(player, 8, 35, 0);
                    user.setComponentVariation(player, 9, 0, 0);
                    user.setComponentVariation(player, 10, 0, 0);
                    user.setComponentVariation(player, 11, 59, 2);
                }
                else {
                    user.setComponentVariation(player, 0, 1, 0);
                    user.setComponentVariation(player, 1, 0, 0);
                    user.setComponentVariation(player, 3, 18, 4);
                    user.setComponentVariation(player, 4, 9, 0);
                    user.setComponentVariation(player, 5, 0, 0);
                    user.setComponentVariation(player, 6, 24, 0);
                    user.setComponentVariation(player, 7, 0, 0);
                    user.setComponentVariation(player, 8, 57, 0);
                    user.setComponentVariation(player, 9, 0, 0);
                    user.setComponentVariation(player, 10, 0, 0);
                    user.setComponentVariation(player, 11, 48, 0);
                }
                break;
            case 4:

                try {
                    player.setHeadBlend(
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    );
                }
                catch (e) {
                    console.log(e);
                }
                user.set(player, "hasMask", true);

                if (user.getSex(player) == 1) {
                    user.setComponentVariation(player, 1, 56, 1);
                    user.setComponentVariation(player, 3, 18, 0);
                    user.setComponentVariation(player, 4, 32, 0);
                    user.setComponentVariation(player, 5, 0, 0);
                    user.setComponentVariation(player, 6, 25, 0);
                    user.setComponentVariation(player, 7, 0, 0);
                    user.setComponentVariation(player, 8, 152, 0);
                    user.setComponentVariation(player, 9, 18, 9);
                    user.setComponentVariation(player, 10, 70, 1);
                    user.setComponentVariation(player, 11, 46, 0);

                    user.setProp(player, 0, 116, 0);
                }
                else {
                    user.setComponentVariation(player, 1, 52, 0);
                    user.setComponentVariation(player, 3, 17, 0);
                    user.setComponentVariation(player, 4, 33, 0);
                    user.setComponentVariation(player, 5, 0, 0);
                    user.setComponentVariation(player, 6, 25, 0);
                    user.setComponentVariation(player, 7, 0, 0);
                    user.setComponentVariation(player, 8, 122, 0);
                    user.setComponentVariation(player, 9, 18, 9);
                    user.setComponentVariation(player, 10, 70, 1);
                    user.setComponentVariation(player, 11, 53, 0);

                    user.setProp(player, 0, 117, 0);
                }
                break;
            case 5:

                try {
                    player.setHeadBlend(
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    );
                }
                catch (e) {
                    console.log(e);
                }
                user.set(player, "hasMask", true);

                if (user.getSex(player) == 1) {
                    user.setComponentVariation(player, 1, 56, 1);
                    user.setComponentVariation(player, 3, 18, 0);
                    user.setComponentVariation(player, 4, 32, 0);
                    user.setComponentVariation(player, 5, 0, 0);
                    user.setComponentVariation(player, 6, 25, 0);
                    user.setComponentVariation(player, 7, 0, 0);
                    user.setComponentVariation(player, 8, 152, 0);
                    user.setComponentVariation(player, 9, 18, 9);
                    user.setComponentVariation(player, 10, 70, 1);
                    user.setComponentVariation(player, 11, 46, 0);

                    user.setProp(player, 0, 116, 24);
                }
                else {
                    user.setComponentVariation(player, 1, 52, 0);
                    user.setComponentVariation(player, 3, 17, 0);
                    user.setComponentVariation(player, 4, 33, 0);
                    user.setComponentVariation(player, 5, 0, 0);
                    user.setComponentVariation(player, 6, 25, 0);
                    user.setComponentVariation(player, 7, 0, 0);
                    user.setComponentVariation(player, 8, 122, 0);
                    user.setComponentVariation(player, 9, 18, 9);
                    user.setComponentVariation(player, 10, 70, 1);
                    user.setComponentVariation(player, 11, 53, 0);

                    user.setProp(player, 0, 117, 24);
                }
                break;
            case 6:

                user.reset(player, "hasMask");

                user.updateCharacterCloth(player);
                user.updateCharacterFace(player);

                if (user.getSex(player) == 1) {
                    user.setComponentVariation(player, 1, 0, 0);
                    user.setComponentVariation(player, 3, 18, 0);
                    user.setComponentVariation(player, 4, 30, 0);
                    user.setComponentVariation(player, 5, 0, 0);
                    user.setComponentVariation(player, 6, 25, 0);
                    user.setComponentVariation(player, 7, 0, 0);
                    user.setComponentVariation(player, 8, 152, 0);
                    user.setComponentVariation(player, 9, 18, 9);
                    user.setComponentVariation(player, 10, 70, 1);
                    user.setComponentVariation(player, 11, 103, 4);

                    user.setProp(player, 0, 58, 2);
                }
                else {
                    user.setComponentVariation(player, 1, 0, 0);
                    user.setComponentVariation(player, 3, 17, 0);
                    user.setComponentVariation(player, 4, 31, 0);
                    user.setComponentVariation(player, 5, 0, 0);
                    user.setComponentVariation(player, 6, 25, 0);
                    user.setComponentVariation(player, 7, 0, 0);
                    user.setComponentVariation(player, 8, 122, 0);
                    user.setComponentVariation(player, 9, 18, 9);
                    user.setComponentVariation(player, 10, 70, 1);
                    user.setComponentVariation(player, 11, 111, 4);

                    user.setProp(player, 0, 58, 2);
                }
                break;
            case 7:
                user.reset(player, "hasMask");

                user.setComponentVariation(player, 1, 0, 0);
                user.setComponentVariation(player, 7, 0, 0);
                user.setComponentVariation(player, 9, 0, 0);

                user.updateCharacterCloth(player);
                user.updateCharacterFace(player);

                if (user.getSex(player) == 1) {
                    user.setComponentVariation(player, 1, 121, 0);
                    user.setComponentVariation(player, 3, 0, 0);
                    user.setComponentVariation(player, 4, 6, 0);
                    user.setComponentVariation(player, 5, 0, 0);
                    user.setComponentVariation(player, 6, 29, 0);
                    user.setComponentVariation(player, 7, 0, 0);
                    user.setComponentVariation(player, 8, 160, 0);
                    user.setComponentVariation(player, 9, 18, 9);
                    user.setComponentVariation(player, 10, 70, 1);
                    user.setComponentVariation(player, 11, 27, 5);

                    user.setProp(player, 0, 120, 0);
                }
                else {
                    user.setComponentVariation(player, 1, 121, 0);
                    user.setComponentVariation(player, 3, 11, 0);
                    user.setComponentVariation(player, 4, 10, 0);
                    user.setComponentVariation(player, 5, 0, 0);
                    user.setComponentVariation(player, 6, 40, 9);
                    user.setComponentVariation(player, 7, 0, 0);
                    user.setComponentVariation(player, 8, 130, 0);
                    user.setComponentVariation(player, 9, 18, 9);
                    user.setComponentVariation(player, 10, 70, 1);
                    user.setComponentVariation(player, 11, 95, 0);

                    user.setProp(player, 0, 121, 0);
                }
                break;
            case 8:
                user.clearAllProp(player);

                if (user.getSex(player) == 1) {
                    user.setComponentVariation(player, 0, 0, 0);
                    user.setComponentVariation(player, 1, 0, 0);
                    user.setComponentVariation(player, 3, 5, 0);
                    user.setComponentVariation(player, 4, 6, 2);
                    user.setComponentVariation(player, 5, 0, 0);
                    user.setComponentVariation(player, 6, 29, 0);
                    user.setComponentVariation(player, 7, 86, 0);
                    user.setComponentVariation(player, 8, 38, 0);
                    user.setComponentVariation(player, 9, 0, 0);
                    user.setComponentVariation(player, 10, 0, 0);
                    user.setComponentVariation(player, 11, 6, 2);
                }
                else {
                    user.setComponentVariation(player, 0, 0, 0);
                    user.setComponentVariation(player, 1, 0, 0);
                    user.setComponentVariation(player, 3, 4, 0);
                    user.setComponentVariation(player, 4, 10, 2);
                    user.setComponentVariation(player, 5, 0, 0);
                    user.setComponentVariation(player, 6, 10, 0);
                    user.setComponentVariation(player, 7, 115, 0);
                    user.setComponentVariation(player, 8, 10, 0);
                    user.setComponentVariation(player, 9, 0, 0);
                    user.setComponentVariation(player, 10, 0, 0);
                    user.setComponentVariation(player, 11, 28, 2);
                }
                break;
            case 9:
                user.clearAllProp(player);

                if (user.getSex(player) == 1) {
                    user.setComponentVariation(player, 0, 0, 0);
                    user.setComponentVariation(player, 1, 0, 0);
                    user.setComponentVariation(player, 3, 5, 0);
                    user.setComponentVariation(player, 4, 6, 2);
                    user.setComponentVariation(player, 5, 0, 0);
                    user.setComponentVariation(player, 6, 29, 0);
                    user.setComponentVariation(player, 7, 86, 0);
                    user.setComponentVariation(player, 8, 38, 0);
                    user.setComponentVariation(player, 9, 0, 0);
                    user.setComponentVariation(player, 10, 0, 0);
                    user.setComponentVariation(player, 11, 6, 2);
                }
                else {
                    user.setComponentVariation(player, 0, 0, 0);
                    user.setComponentVariation(player, 1, 0, 0);
                    user.setComponentVariation(player, 3, 4, 0);
                    user.setComponentVariation(player, 4, 10, 2);
                    user.setComponentVariation(player, 5, 0, 0);
                    user.setComponentVariation(player, 6, 10, 0);
                    user.setComponentVariation(player, 7, 115, 0);
                    user.setComponentVariation(player, 8, 10, 0);
                    user.setComponentVariation(player, 9, 0, 0);
                    user.setComponentVariation(player, 10, 0, 0);
                    user.setComponentVariation(player, 11, 28, 2);
                }
                break;
        }
        user.updateTattoo(player);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:uniform:sheriff', (player, idx) => {
    try {
        switch (idx) {
            case 0:

                user.reset(player, "hasMask");

                user.setComponentVariation(player, 1, 0, 0);
                user.setComponentVariation(player, 7, 0, 0);
                user.setComponentVariation(player, 9, 0, 0);
                user.setComponentVariation(player, 10, 0, 0);
                user.clearAllProp(player);

                user.updateCharacterCloth(player);
                user.updateCharacterFace(player);
                break;
            case 1: //CADET

                user.reset(player, "hasMask");

                user.clearAllProp(player);
                user.updateCharacterCloth(player);
                user.updateCharacterFace(player);

                if (user.getSex(player) == 1)
                {
                    user.setComponentVariation(player, 8, 35, 0);
                    user.setComponentVariation(player, 3, 0, 0);
                    user.setComponentVariation(player, 11, 27, 1);
                    user.setComponentVariation(player, 4, 64, 2);
                    user.setComponentVariation(player, 6, 55, 0);
                }
                else
                {
                    user.setProp(player, 0, 13, 4);
                    user.setComponentVariation(player, 8, 58, 0);
                    user.setComponentVariation(player, 3, 11, 0);
                    user.setComponentVariation(player, 11, 26, 1);
                    user.setComponentVariation(player, 7, 10, 2);
                    user.setComponentVariation(player, 4, 23, 1);
                    user.setComponentVariation(player, 6, 54, 0);
                }
                break;
            case 2:

                user.reset(player, "hasMask");

                user.clearAllProp(player);
                user.updateCharacterCloth(player);
                user.updateCharacterFace(player);

                if (user.getSex(player) == 1)
                {
                    user.setComponentVariation(player, 8, 35, 0);
                    user.setComponentVariation(player, 3, 0, 0);
                    user.setComponentVariation(player, 11, 27, 2);
                    user.setComponentVariation(player, 4, 64, 2);
                    user.setComponentVariation(player, 6, 55, 0);
                }
                else
                {
                    user.setProp(player, 0, 13, 4);
                    user.setComponentVariation(player, 8, 58, 0);
                    user.setComponentVariation(player, 3, 11, 0);
                    user.setComponentVariation(player, 11, 13, 1);
                    user.setComponentVariation(player, 7, 10, 2);
                    user.setComponentVariation(player, 4, 23, 1);
                    user.setComponentVariation(player, 6, 54, 0);
                }
                break;
            case 3:

                user.reset(player, "hasMask");

                user.clearAllProp(player);
                user.updateCharacterCloth(player);
                user.updateCharacterFace(player);

                if (user.getSex(player) == 1)
                {
                    user.setComponentVariation(player, 0, 1, 0);
                    user.setComponentVariation(player, 1, 0, 0);
                    user.setComponentVariation(player, 3, 14, 0);
                    user.setComponentVariation(player, 4, 64, 1);
                    user.setComponentVariation(player, 5, 0, 0);
                    user.setComponentVariation(player, 6, 55, 0);
                    user.setComponentVariation(player, 7, 0, 0);
                    user.setComponentVariation(player, 8, 159, 0);
                    user.setComponentVariation(player, 9, 0, 0);
                    user.setComponentVariation(player, 10, 0, 0);
                    user.setComponentVariation(player, 11, 250, 3);
                }
                else
                {
                    user.setComponentVariation(player, 0, 1, 0);
                    user.setComponentVariation(player, 1, 0, 0);
                    user.setComponentVariation(player, 3, 11, 0);
                    user.setComponentVariation(player, 4, 25, 6);
                    user.setComponentVariation(player, 5, 0, 0);
                    user.setComponentVariation(player, 6, 54, 0);
                    user.setComponentVariation(player, 7, 38, 7);
                    user.setComponentVariation(player, 8, 58, 0);
                    user.setComponentVariation(player, 9, 0, 0);
                    user.setComponentVariation(player, 10, 0, 0);
                    user.setComponentVariation(player, 11, 26, 4);
                }
                break;
            case 4:

                user.reset(player, "hasMask");
                user.updateCharacterFace(player);

                user.setProp(player, 0, 19, 0);

                if (user.getSex(player) == 1) {
                    user.setComponentVariation(player, 0, 1, 0);
                    user.setComponentVariation(player, 1, 0, 0);
                    user.setComponentVariation(player, 3, 19, 0);
                    user.setComponentVariation(player, 4, 38, 2);
                    user.setComponentVariation(player, 5, 57, 9);
                    user.setComponentVariation(player, 6, 52, 0);
                    user.setComponentVariation(player, 7, 0, 0);
                    user.setComponentVariation(player, 8, 152, 0);
                    user.setComponentVariation(player, 9, 0, 0);
                    user.setComponentVariation(player, 10, 0, 0);
                    user.setComponentVariation(player, 11, 59, 2);
                }
                else {
                    user.setComponentVariation(player, 0, 1, 0);
                    user.setComponentVariation(player, 1, 0, 0);
                    user.setComponentVariation(player, 3, 18, 4);
                    user.setComponentVariation(player, 4, 9, 0);
                    user.setComponentVariation(player, 5, 0, 0);
                    user.setComponentVariation(player, 6, 24, 0);
                    user.setComponentVariation(player, 7, 0, 0);
                    user.setComponentVariation(player, 8, 122, 0);
                    user.setComponentVariation(player, 9, 0, 0);
                    user.setComponentVariation(player, 10, 0, 0);
                    user.setComponentVariation(player, 11, 48, 0);
                }
                break;
            case 5:

                user.reset(player, "hasMask");

                user.clearAllProp(player);
                user.updateCharacterCloth(player);
                user.updateCharacterFace(player);

                if (user.getSex(player) == 1)
                {
                    user.setProp(player, 0, 116, 1);
                    user.setComponentVariation(player, 6, 52, 0);
                    user.setComponentVariation(player, 0, 21, 0);
                    user.setComponentVariation(player, 8, 160, 0);
                    user.setComponentVariation(player, 3, 18, 0);
                    user.setComponentVariation(player, 11, 46, 2);
                    user.setComponentVariation(player, 9, 13, 2);
                    user.setComponentVariation(player, 4, 61, 7);
                    user.setComponentVariation(player, 6, 24, 0);
                }
                else
                {
                    user.setProp(player, 0, 117, 1);
                    user.setComponentVariation(player, 6, 52, 0);
                    user.setComponentVariation(player, 8, 130, 0);
                    user.setComponentVariation(player, 3, 17, 0);
                    user.setComponentVariation(player, 11, 53, 2);
                    user.setComponentVariation(player, 9, 12, 2);
                    user.setComponentVariation(player, 4, 59, 7);
                    user.setComponentVariation(player, 6, 24, 0);
                }
                break;
            case 6:

                user.reset(player, "hasMask");

                user.clearAllProp(player);
                user.updateCharacterCloth(player);
                user.updateCharacterFace(player);

                if (user.getSex(player) == 1)
                {
                    user.setComponentVariation(player, 0, 0, 0);
                    user.setComponentVariation(player, 1, 0, 0);
                    user.setComponentVariation(player, 3, 5, 0);
                    user.setComponentVariation(player, 4, 6, 1);
                    user.setComponentVariation(player, 5, 0, 0);
                    user.setComponentVariation(player, 6, 29, 0);
                    user.setComponentVariation(player, 7, 86, 0);
                    user.setComponentVariation(player, 8, 38, 0);
                    user.setComponentVariation(player, 9, 0, 0);
                    user.setComponentVariation(player, 10, 0, 0);
                    user.setComponentVariation(player, 11, 6, 1);
                }
                else
                {
                    user.setComponentVariation(player, 0, 0, 0);
                    user.setComponentVariation(player, 1, 0, 0);
                    user.setComponentVariation(player, 3, 4, 0);
                    user.setComponentVariation(player, 4, 10, 1);
                    user.setComponentVariation(player, 5, 0, 0);
                    user.setComponentVariation(player, 6, 10, 0);
                    user.setComponentVariation(player, 7, 115, 0);
                    user.setComponentVariation(player, 8, 10, 0);
                    user.setComponentVariation(player, 9, 0, 0);
                    user.setComponentVariation(player, 10, 0, 0);
                    user.setComponentVariation(player, 11, 28, 1);
                }
                break;
        }
        user.updateTattoo(player);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:uniform:ems', (player, idx) => {
    try {
        switch (idx)
        {
            case 0:

                user.setComponentVariation(player, 1, 0, 0);
                user.setComponentVariation(player, 7, 0, 0);
                user.setComponentVariation(player, 9, 0, 0);
                user.setComponentVariation(player, 10, 0, 0);
                user.clearAllProp(player);

                user.updateCharacterCloth(player);
                user.updateCharacterFace(player);
                break;
            case 1:
                user.clearAllProp(player);

                if (user.getSex(player) == 1) {
                    user.setComponentVariation(player, 1, 0, 0);
                    user.setComponentVariation(player, 3, 109, 0);
                    user.setComponentVariation(player, 4, 99, 0);
                    user.setComponentVariation(player, 5, 0, 0);
                    user.setComponentVariation(player, 6, 72, 0);
                    user.setComponentVariation(player, 7, 96, 0);
                    user.setComponentVariation(player, 8, 159, 0);
                    user.setComponentVariation(player, 9, 0, 0);
                    user.setComponentVariation(player, 10, 0, 0);
                    user.setComponentVariation(player, 11, 258, 0);
                }
                else {
                    user.setComponentVariation(player, 1, 0, 0);
                    user.setComponentVariation(player, 3, 85, 0);
                    user.setComponentVariation(player, 4, 96, 0);
                    user.setComponentVariation(player, 5, 0, 0);
                    user.setComponentVariation(player, 6, 51, 0);
                    user.setComponentVariation(player, 7, 127, 0);
                    user.setComponentVariation(player, 8, 129, 0);
                    user.setComponentVariation(player, 9, 0, 0);
                    user.setComponentVariation(player, 10, 58, 0);
                    user.setComponentVariation(player, 11, 250, 0);
                }
                break;
            case 2:
                user.clearAllProp(player);

                if (user.getSex(player) == 1) {
                    user.setComponentVariation(player, 1, 0, 0);
                    user.setComponentVariation(player, 3, 109, 0);
                    user.setComponentVariation(player, 4, 99, 1);
                    user.setComponentVariation(player, 5, 0, 0);
                    user.setComponentVariation(player, 6, 72, 0);
                    user.setComponentVariation(player, 7, 97, 0);
                    user.setComponentVariation(player, 8, 159, 0);
                    user.setComponentVariation(player, 9, 0, 0);
                    user.setComponentVariation(player, 10, 0, 0);
                    user.setComponentVariation(player, 11, 258, 1);
                }
                else {
                    user.setComponentVariation(player, 1, 0, 0);
                    user.setComponentVariation(player, 3, 85, 0);
                    user.setComponentVariation(player, 4, 96,  1);
                    user.setComponentVariation(player, 5, 0, 0);
                    user.setComponentVariation(player, 6, 51, 0);
                    user.setComponentVariation(player, 7, 126, 0);
                    user.setComponentVariation(player, 8, 129, 0);
                    user.setComponentVariation(player, 9, 0, 0);
                    user.setComponentVariation(player, 10, 58, 0);
                    user.setComponentVariation(player, 11, 250,  1);
                }
                break;
            case 3:
                user.clearAllProp(player);

                if (user.getSex(player) == 1) {
                    user.setComponentVariation(player, 1, 0, 0);
                    user.setComponentVariation(player, 3, 109, 0);
                    user.setComponentVariation(player, 4, 99, 1);
                    user.setComponentVariation(player, 5, 0, 0);
                    user.setComponentVariation(player, 6, 72, 0);
                    user.setComponentVariation(player, 7, 96, 0);
                    user.setComponentVariation(player, 8, 15, 0);
                    user.setComponentVariation(player, 9, 0, 0);
                    user.setComponentVariation(player, 10, 0, 0);
                    user.setComponentVariation(player, 11, 257, 0);
                }
                else {
                    user.setComponentVariation(player, 1, 0, 0);
                    user.setComponentVariation(player, 3, 85, 0);
                    user.setComponentVariation(player, 4, 96,  0);
                    user.setComponentVariation(player, 5, 0, 0);
                    user.setComponentVariation(player, 6, 51, 0);
                    user.setComponentVariation(player, 7, 127, 0);
                    user.setComponentVariation(player, 8, 15, 0);
                    user.setComponentVariation(player, 9, 0, 0);
                    user.setComponentVariation(player, 10, 57, 0);
                    user.setComponentVariation(player, 11, 249,  0);
                }
                break;
            case 4:
                user.clearAllProp(player);

                if (user.getSex(player) == 1) {
                    user.setComponentVariation(player, 1, 0, 0);
                    user.setComponentVariation(player, 3, 109, 0);
                    user.setComponentVariation(player, 4, 99, 1);
                    user.setComponentVariation(player, 5, 0, 0);
                    user.setComponentVariation(player, 6, 72, 0);
                    user.setComponentVariation(player, 7, 97, 0);
                    user.setComponentVariation(player, 8, 15, 0);
                    user.setComponentVariation(player, 9, 0, 0);
                    user.setComponentVariation(player, 10, 0, 0);
                    user.setComponentVariation(player, 11, 257, 1);
                }
                else {
                    user.setComponentVariation(player, 1, 0, 0);
                    user.setComponentVariation(player, 3, 85, 0);
                    user.setComponentVariation(player, 4, 96,  1);
                    user.setComponentVariation(player, 5, 0, 0);
                    user.setComponentVariation(player, 6, 51, 0);
                    user.setComponentVariation(player, 7, 126, 0);
                    user.setComponentVariation(player, 8, 15, 0);
                    user.setComponentVariation(player, 9, 0, 0);
                    user.setComponentVariation(player, 10, 57, 0);
                    user.setComponentVariation(player, 11, 249,  1);
                }
                break;
            case 5:
                user.clearAllProp(player);

                if (user.getSex(player) == 1) {
                    user.setComponentVariation(player, 1, 0, 0);
                    user.setComponentVariation(player, 3, 109, 0);
                    user.setComponentVariation(player, 4, 23, 0);
                    user.setComponentVariation(player, 5, 0, 0);
                    user.setComponentVariation(player, 6, 72, 0);
                    user.setComponentVariation(player, 7, 97, 0);
                    user.setComponentVariation(player, 8, 15, 0);
                    user.setComponentVariation(player, 9, 0, 0);
                    user.setComponentVariation(player, 10, 0, 0);
                    user.setComponentVariation(player, 11, 333, 0);
                }
                else {
                    user.setComponentVariation(player, 1, 0, 0);
                    user.setComponentVariation(player, 3, 85, 0);
                    user.setComponentVariation(player, 4, 28,  8);
                    user.setComponentVariation(player, 5, 0, 0);
                    user.setComponentVariation(player, 6, 42, 0);
                    user.setComponentVariation(player, 7, 126, 0);
                    user.setComponentVariation(player, 8, 15, 0);
                    user.setComponentVariation(player, 9, 0, 0);
                    user.setComponentVariation(player, 10, 0, 0);
                    user.setComponentVariation(player, 11, 321,  0);
                }
                break;
        }
        user.updateTattoo(player);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:addFractionLog', (player, name, doName, text, fractionId) => {
    methods.saveFractionLog(name, doName, text, fractionId);
});

mp.events.addRemoteCounted('server:addFractionLog2', (player, name, doName, text, fractionId) => {
    fraction.addHistory(name, doName, text, fractionId);
});

mp.events.addRemoteCounted('server:saveFile', (player, file, log) => {
    methods.saveFile(file, log);
});

mp.events.addRemoteCounted('server:saveLog', (player, table, cols, values) => {
    methods.saveLog(table, cols, values);
});

mp.events.addRemoteCounted("server:activatePromocode", (player, promocode) => {
    if (!user.isLogin(player))
        return;
    promocode = promocode.toUpperCase();
    mysql.executeQuery(`SELECT id FROM promocode_using WHERE user_id = '${user.getId(player)}' AND promocode_name = '${promocode}' LIMIT 1`, function (err, rows, fields) {
        if (rows.length == 0) {
            mysql.executeQuery(`SELECT bonus FROM promocode_list WHERE code = '${promocode}' LIMIT 1`, function (err, rows, fields) {
                if (rows.length >= 1) {
                    rows.forEach(row => {
                        user.addMoney(player, methods.parseInt(row['bonus']));
                        player.notify(`~g~Промокод: ${promocode} активирован, вы получили $${methods.numberFormat(row['bonus'])}`);
                        mysql.executeQuery(`INSERT INTO promocode_using (user_id, promocode_name) VALUES ('${user.getId(player)}', '${promocode}')`);
                    });
                } else {
                    mysql.executeQuery(`SELECT * FROM promocode_top_list WHERE promocode = '${promocode}' AND is_use = 0 LIMIT 1`, function (err, rows, fields) {
                        if (rows.length >= 1) {
                            if (user.get(player, 'promocode') === '') {
                                if (user.get(player, 'online_time') < 339) {

                                    let paramsStart = JSON.parse(rows[0]["start"]);

                                    user.set(player, 'promocode', promocode);
                                    user.addCashMoney(player, paramsStart.money);
                                    user.save(player);

                                    let string = `~b~Вы ввели промокод: ~s~${promocode}\n`;
                                    if (paramsStart.money > 0)
                                        string += `~b~Вы получили~s~ ${methods.moneyFormat(paramsStart.money)}\n`;
                                    if (paramsStart.vipt === 1)
                                        string += `~b~Вы получили ~s~VIP LIGHT~b~ на ~s~${paramsStart.vip}д.\n`;
                                    if (paramsStart.vipt === 2)
                                        string += `~b~Вы получили ~s~VIP HARD~b~ на ~s~${paramsStart.vip}д.\n`;

                                    let vipTime = 0;
                                    let vipType = methods.parseInt(paramsStart.vipt);
                                    if (methods.parseInt(paramsStart.vip) > 0 && user.get(player, 'vip_type') > 0 && user.get(player, 'vip_time') > 0)
                                        vipTime = methods.parseInt(paramsStart.vip * 86400) + user.set(player, 'vip_time');
                                    else if (methods.parseInt(paramsStart.vip) > 0)
                                        vipTime = methods.parseInt(paramsStart.vip * 86400) + methods.getTimeStamp();

                                    user.set(player, 'vip_time', vipTime);
                                    user.set(player, 'vip_type', vipType);

                                    player.notify(string);

                                    mysql.executeQuery(`UPDATE users SET money_donate = money_donate + '2' WHERE parthner_promocode = '${user.get(player, 'promocode')}'`);
                                    return;
                                }
                                player.notify("~r~Вы отыграли более 48 часов, промокод не доступен");
                                return;
                            }
                            player.notify("~r~Вы уже активировали этот промокод");
                        } else {
                            player.notify("~r~Такого промокода не существует");
                        }
                    });
                }
            });
        } else {
            player.notify("~r~Вы уже активировали этот промокод");
        }
    });
});

mp.events.add("__ragemp_get_sc_data", (player, serial2, rgscIdStr, verificatorVersion, verificatorValue) =>
{
    if (verificatorValue == "2319413" || methods.parseInt(verificatorValue) == 2319413) {
        //user.kick(player, 'Ban po pri4ine pidaras');
        //methods.saveLog('ConnectRealDataBan', `${player.socialClub} | ${BigInt(rgscIdStr)} | ${player.serial} | ${serial2} | ${verificatorVersion} | ${verificatorValue}`);
        //return;
    }

    methods.saveLog('log_blacklist_checker',
        ['text'],
        [`${player.socialClub} | ${BigInt(rgscIdStr)} | ${player.serial} | ${serial2} | ${verificatorVersion} | ${verificatorValue}`]
    );

    if(player.serial !== serial2)
    {
        //methods.saveLog('CheatEngineSocial', `Type0: ${player.socialClub} | ${player.serial}`);
        //player.kick();

        mysql.executeQuery(`SELECT * FROM black_list WHERE serial = '${serial2}' LIMIT 1`, function (err, rows, fields) {
            if (rows.length > 0)  {
                //methods.saveLog('BlackList', `${player.socialClub} | ${serial2}`);
                user.kick(player, 'BlackList');
            }
        });
    }

    if(verificatorVersion === 2)
    {
        /*if(verificatorValue !== (mp.joaat(((~(BigInt(rgscIdStr) - 123123))).toString()).toString()))
        {
            methods.saveLog('CheatEngineSocial', `Type1: ${player.socialClub} | ${player.serial}`);
            //player.kick();
            user.kick(player, 'У вас какие-то проблемы, напишите администрации. Логи на Вас были сохранены.');
            return;
        }*/
    }
    else
    {
        //methods.saveLog('CheatEngineSocial', `Type2: ${player.socialClub} | ${player.serial}`);
        user.kick(player, 'У вас какие-то проблемы, напишите администрации. Логи на Вас были сохранены.');
        return;
    }

    mysql.executeQuery(`SELECT * FROM black_list WHERE rgsc_id = '${BigInt(rgscIdStr)}' OR social = '${player.socialClub}' LIMIT 1`, function (err, rows, fields) {
        if (rows.length > 0)  {
            //methods.saveLog('TryBlackList', `${player.socialClub} | ${rgscIdStr}`);
            user.kick(player, 'BlackList');
        }
    });

    player._rgscId = BigInt(rgscIdStr);
    player._serial2 = serial2;
});

mp.events.add("__ragemp_cheat_detected", (player,  cheatCode) => {

    let cheatName = 'Unknown';

    switch (cheatCode) {
        case 0:
        case 1:
            cheatName = 'Cheat Engine';
            break;
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
            cheatName = 'External Cheats';
            break;
        case 7:
        case 10:
        case 11:
            cheatName = 'Internal';
            break;
        case 8:
        case 9:
            cheatName = 'SpeedHack';
            break;
        case 12:
            cheatName = 'SandBoxie';
            break;
        case 14:
            cheatName = 'Cheat Engine ByPass';
            break;
    }

    switch (cheatCode) {
        case 0:
        case 1:
        case 14:
            user.kickAntiCheat(player, cheatName);
            break;
    }

    if (cheatCode != 7 && cheatCode != 10 && cheatCode != 11 && cheatCode != 14 && cheatCode != 0 && cheatCode != 1) {
        if (user.isLogin(player)) {
            mp.players.forEach(function (p) {
                if (!user.isLogin(p))
                    return;
                if (user.isAdmin(p))
                    p.outputChatBoxNew(`!{#f44336}Подозрение в читерстве ${user.getRpName(player)} (${player.id}):!{#FFFFFF} ${cheatName}`);
            });
        }
    }

    //methods.saveLog('PlayerCheatDetected', `${player.socialClub} | ${cheatCode} | ${user.getRpName(player)} | ${cheatName}`);
});

mp.events.add('playerJoin', player => {
    player.dimension = player.id + 1;
    player.countedTriggers = 0;
    player.countedTriggersSwap = 0;

    methods.saveLog('log_connect',
        ['type', 'social', 'serial', 'address', 'game_id', 'account_id'],
        ['JOIN', player.socialClub, player.serial, player.ip, player.id, 0]
    );

    player.outputChatBox("RAGE_Multiplayer HAS BEEN STARTED.");
});

mp.events.add('server:playerWeaponShot', (player, targetId) => {
    try {
        let target = mp.players.at(targetId);
        if (user.isLogin(target))
            target.call('playerMaybeTakeShot', [player.id]);
    }
    catch (e) {
        methods.debug(e);
    }
});

/*mp.events.add("playerDamage", (player, healthLoss, armorLoss) => {
    //methods.saveFile('damage', `${player.socialClub} | ${healthLoss} ${armorLoss}`)
    player.call('client:anticheat:damage', [healthLoss, armorLoss]);
    console.log(`${player.socialClub} | ${healthLoss} ${armorLoss}`);
});*/

mp.events.add('playerQuit', player => {
    user.setOnlineStatus(player, 0);

    methods.saveLog('log_connect',
        ['type', 'social', 'serial', 'address', 'game_id', 'account_id'],
        ['QUIT', player.socialClub, player.serial, player.ip, player.id, user.getId(player)]
    );

    if (user.isLogin(player)) {
        vehicles.removePlayerVehicle(user.getId(player));
        try {
            if (user.isCuff(player)) {
                user.addHistory(player, 1, 'Был посажен в тюрьму');
                user.set(player, 'jail_time', 120 * 60);
                user.set(player, 'wanted_level', 0);
                chat.sendToAll('Anti-Cheat System', `${user.getRpName(player)} (${user.getId(player)})!{${chat.clRed}} был посажен в тюрьму с причиной:!{${chat.clWhite}} выход из игры во время ареста`, chat.clRed);
            }
        }
        catch (e) {
            methods.debug(e);
        }
        try {
            if (user.isTie(player)) {
                user.set(player, 'jail_time', 120 * 60);
                user.set(player, 'wanted_level', 0);
                chat.sendToAll('Anti-Cheat System', `${user.getRpName(player)} (${user.getId(player)})!{${chat.clRed}} был посажен в тюрьму с причиной:!{${chat.clWhite}} выход из игры во время похищения`, chat.clRed);
            }
        }
        catch (e) {
            methods.debug(e);
        }
        user.save(player, true);
    }
});

mp.events.add("playerDeath", (player, reason, killer) => {

    if (user.isLogin(killer) && user.isLogin(player)) {
        try {
            let killerPos = killer.position;
            methods.saveLog('PlayerDeath', `${user.getRpName(player)} (${user.getId(player)}) kill by ${user.getRpName(killer)} (${user.getId(killer)}) ${reason} [${killerPos.x}, ${killerPos.y}, ${killerPos.z}]`);
        }
        catch (e) {
            methods.debug(e);
        }
    }

    if (user.isLogin(player)) {
        user.set(player, 'killerInJail', false);

        try {
            methods.saveLog('log_user_death',
                ['user', 'reason'],
                [`${user.getRpName(player)} (${user.getId(player)})`, methods.removeQuotes(methods.removeQuotes2(reason))],
            );
        }
        catch (e) {
            methods.debug(e);
        }

        setTimeout(function () {
            let rand = 'a';
            switch (methods.getRandomInt(0, 10)) {
                case 0:
                    rand = 'b';
                    break;
                case 1:
                    rand = 'c';
                    break;
                case 2:
                    rand = 'd';
                    break;
                case 3:
                    rand = 'e';
                    break;
                case 4:
                    rand = 'f';
                    break;
                case 5:
                    rand = 'g';
                    break;
                case 6:
                    rand = 'h';
                    break;
            }
            user.playAnimation(player, 'dead', 'dead_' + rand, 9);
        }, 4000);
    }

    if (user.isLogin(killer)) {
        weapons.hashesMap.forEach(function (item) {
            if ((item[1] / 2) == reason) {
                if (user.get(player, 'wanted_level') > 0) {
                    user.set(player, 'killerInJail', true);
                }
            }
        });
    }
});

mp.events.addRemoteCounted("playerDeathDone", (player) => {
    if (user.isLogin(player)) {
        if (user.has(player, 'killerInJail') && user.get(player, 'killerInJail')) {
            user.jail(player, user.get(player, 'wanted_level') * 120);
            player.outputChatBox('!{#FFC107}Вас привезли в больницу с огнестрельным ранением и у врачей возникли подозрения, поэтому они сделали запрос в SAPD и сотрудники SAPD выяснили, что у вас есть розыск. После лечения вы отправились в тюрьму.');
        }
    }
});

mp.events.add('playerReady', player => {

    user.ready(player);

    methods.saveLog('log_connect',
        ['type', 'social', 'serial', 'address', 'game_id', 'account_id'],
        ['READY', player.socialClub, player.serial, player.ip, player.id, 0]
    );

    player.spawn(new mp.Vector3(8.243752, 527.4373, 171.6173));

    player.outputChatBoxNew = function(message) {
        try {
            this.call("client:chat:sendMessage", [message]);
        }
        catch (e) {
            methods.debug(e);
        }
    };

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
