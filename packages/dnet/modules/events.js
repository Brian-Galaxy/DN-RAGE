"use strict";

let user = require('../user');
let enums = require('../enums');
let coffer = require('../coffer');
let inventory = require('../inventory');
let weapons = require('../weapons');
let items = require('../items');

let Container = require('./data');
let methods = require('./methods');
let mysql = require('./mysql');
let chat = require('./chat');

let houses = require('../property/houses');
let stocks = require('../property/stocks');
let condos = require('../property/condos');
let business = require('../property/business');
let vehicles = require('../property/vehicles');

let cloth = require('../business/cloth');
let tattoo = require('../business/tattoo');
let lsc = require('../business/lsc');
let gun = require('../business/gun');
let vShop = require('../business/vShop');
let rent = require('../business/rent');
let bank = require('../business/bank');
let shop = require('../business/shop');

let pickups = require('../managers/pickups');

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
        console.log(`[DEBUG-CLIENT][${player.socialClub}]: ${message}`)
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:user:respawn', (player, x, y, z) => {
    if (!user.isLogin(player))
        return;
    player.spawn(new mp.Vector3(x, y, z));
});

mp.events.addRemoteCounted('server:user:createAccount', (player, login, password, email) => {
    try {
        user.createAccount(player, login, password, email);
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:user:createUser', (player, name, surname, age, national) => {
    try {
        user.createUser(player, name, surname, age, national);
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

mp.events.addRemoteCounted('server:user:serVariable', (player, key, val) => {
    try {
        methods.debug('server:user:serVariable', key, val);
        if (mp.players.exists(player))
            player.setVariable(key, val);
    } catch (e) {
        console.log(e);
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
    if (!user.isLogin(player))
        return;
    methods.debug('licenseCenter.buy');
    if (!user.isLogin(player))
        return;

    if (price < 1)
        return;

    try {
        if (user.get(player, 'reg_status') == 0)
        {
            player.notify('~r~У Вас нет регистрации');
            return;
        }

        if (!user.get(player, type))
        {
            if (user.getMoney(player) < price)
            {
                player.notify("~r~У Вас недостаточно средств");
                return;
            }
            user.removeMoney(player, price, 'Покупка лицензии');
            coffer.addMoney(price);

            user.giveLic(player, type, month);
            return;
        }
        player.notify("~r~У вас уже есть данная лицензия");
    }
    catch (e) {
        methods.debug('Exception: licenseCenter.buy');
        methods.debug(e);
    }
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
    bank.transferMoney(player, bankNumber, money);
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

            if (remotePlayer.remoteId != player.remoteId) {
                user.playAnimation(remotePlayer, "mp_common","givetake2_a", 8);
                user.playAnimation(player, "mp_common","givetake1_a", 8);
                chat.sendMeCommand(remotePlayer, 'посмотрел документы');
                chat.sendMeCommand(player, 'показал документы');
            }
            else
                chat.sendMeCommand(player, 'посмотрел документы');

            let menuData = new Map();

            if (lic == 'card_id') {
                menuData.set('ID', (user.getId(remotePlayer) + 10000000).toString());
                menuData.set('Имя', user.getRpName(remotePlayer));
                menuData.set('Тип регистрации', user.getRegStatusName(remotePlayer));
                menuData.set('Дата рождения', user.get(remotePlayer, 'age'));
                menuData.set('Пол', user.getSexName(player));
                menuData.set('Национальность', user.get(remotePlayer, 'national'));

                user.showMenu(remotePlayer, 'Card ID', user.getRpName(player), menuData);
            }
            else if (lic == 'work_lic') {

                if (user.get(remotePlayer, 'work_lic') != '') {
                    menuData.set('ID', user.get(remotePlayer, 'work_lic'));
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
                    user.showMenu(remotePlayer, 'Work ID', user.getRpName(player), menuData);
                }
                else {
                    player.notify('~r~У Вас отсутствует Work ID');
                    if (remotePlayer.remoteId != player.remoteId)
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
                        licName = 'Авиа транспорт';
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
                        licName = 'Адвоката';
                        licPref = 'L';
                        break;
                    case 'gun_lic':
                        licName = 'На оружие';
                        licPref = 'G';
                        break;
                    case 'biz_lic':
                        licName = 'На бизнес';
                        licPref = 'Z';
                        break;
                    case 'fish_lic':
                        licName = 'На рыбалку';
                        licPref = 'F';
                        break;
                    case 'med_lic':
                        licName = 'Мед. страховка';
                        licPref = 'M';
                        break;
                }

                if (user.get(remotePlayer, lic)) {

                    let dataSend = {
                        type: 'updateValues',
                        isShow: true,
                        info: {
                            name: user.getRpName(remotePlayer),
                            sex: user.getSexName(remotePlayer),
                            license: licName,
                            date_start: user.get(remotePlayer, lic + '_create'),
                            date_stop: user.get(remotePlayer, lic + '_end'),
                            prefix: licPref,
                            img: 'https://a.rsg.sc//n/' + remotePlayer.socialClub.toLowerCase(),
                        },
                    };
                    user.callCef(remotePlayer, 'license', JSON.stringify(dataSend));
                }
                else {
                    player.notify('~r~У Вас отсутствует тип лицензии: ~s~' + licName);
                    if (remotePlayer.remoteId != player.remoteId)
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

            if (remotePlayer.remoteId != player.remoteId) {
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
                typef: user.getFractionHash(remotePlayer),
                info: {
                    name: user.getRpName(remotePlayer),
                    sex: user.getSexName(remotePlayer),
                    dep: user.getDepartmentName(remotePlayer),
                    position: user.getRankName(remotePlayer),
                    dob: user.get(remotePlayer, 'age'),
                    id: user.getId(remotePlayer),
                    img: 'https://a.rsg.sc//n/' + remotePlayer.socialClub.toLowerCase(),
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
        user.playAnimation(player, "mp_arresting", "a_uncuff", 8);
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
        user.stopAnimation(target);
        user.playAnimation(player, "mp_arresting", "a_uncuff", 8);
        user.unCuff(target);
    }
    else
        player.notify('~r~Рядом с вами никого нет');
});

mp.events.addRemoteCounted('server:user:tieById', (player, targetId) => {
    if (!user.isLogin(player))
        return;

    let target = mp.players.at(targetId);

    if (mp.players.exists(target)) {
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
        user.stopAnimation(target);
        user.playAnimation(player, "mp_arresting", "a_uncuff", 8);
        user.unTie(target);
    }
    else
        player.notify('~r~Рядом с вами никого нет');
});

mp.events.addRemoteCounted('server:user:knockById', (player, targetId) => { //TODO
    if (!user.isLogin(player))
        return;

    let target = mp.players.at(targetId);
    if (mp.players.exists(target)) {
        user.set(target, 'isKnockout', true);
        user.playAnimation(target, "amb@world_human_bum_slumped@male@laying_on_right_side@base", "base", 9);
        chat.sendMeCommand(player, "замахнулся кулаком и ударил человека напротив");
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
        user.removeCashMoney(player, money);
        user.addCashMoney(remotePlayer, money);

        user.playAnimationWithUser(player, remotePlayer, 6);

        remotePlayer.notify('Вам передали ~g~$' + methods.numberFormat(money));
        player.notify('Вы передали ~g~$' + methods.numberFormat(money));

        methods.saveLog('GiveCash', `${user.getRpName(player)} (${user.getId(player)}) to ${user.getRpName(remotePlayer)} (${user.getId(remotePlayer)}) count $${money}`);
    }
});

mp.events.addRemoteCounted('server:user:askDatingToPlayerId', (player, playerRemoteId, name) => {
    if (!user.isLogin(player))
        return;

    let remotePlayer = mp.players.at(playerRemoteId);
    if (user.isLogin(remotePlayer)) {
        remotePlayer.call('client:user:askDatingToPlayerId', [player.id, name]);
    }
});

mp.events.addRemoteCounted('server:user:askDatingToPlayerIdYes', (player, playerRemoteId, name, nameAnswer) => {
    if (!user.isLogin(player))
        return;
    let remotePlayer = mp.players.at(playerRemoteId);
    if (user.isLogin(remotePlayer)) {

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

mp.events.addRemoteCounted('server:admin:spawnVeh', (player, vName) => {
    try {
        let v = vehicles.spawnCar(player.position, player.heading, vName);
        player.putIntoVehicle(v, -1);
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

mp.events.addRemoteCounted('server:business:setMoney', (player, id, money) => {
    business.setMoney(id, money);
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
        user.setComponentVariation(player, 9, 4, 1);
        user.setComponentVariation(player, 10, 0, 0);
        user.setComponentVariation(player, 11, 26, 1);
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
                    if (!user.isLogin(p))
                        return;
                    if (user.get(p, 'job') == 8) {
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
        if (vehicles.exists(v) && v.id == vId)
            v.setVariable('gr6Money', methods.parseFloat(v.getVariable('gr6Money') + money));
    });
});

mp.events.addRemoteCounted('server:gr6:unload', (player, vId) => {
    if (!user.isLogin(player))
        return;

    if (player.vehicle && player.seat == -1) {
        mp.vehicles.forEach(function (v) {
            if (vehicles.exists(v) && v.id == vId) {
                let money = methods.parseFloat(v.getVariable('gr6Money') / 100);

                let countOcc = v.getOccupants().length;

                v.getOccupants().forEach(function (p) {
                    if (!user.isLogin(p) || user.get(p, 'job') != 8)
                        return;

                    if (Container.Data.Has(v.id, 'validWorker' + user.getId(p))) {

                        let currentMoney = methods.parseFloat(money / countOcc);
                        if (user.get(p, 'skill_gr6') >= 500)
                            currentMoney = methods.parseFloat(money * 1.5);

                        user.addCashMoney(p, currentMoney, 'Зарплата инкассатора');
                        business.addMoney(162, methods.parseFloat(currentMoney / 10));
                        coffer.removeMoney(currentMoney + methods.parseFloat(currentMoney / 10));
                        p.notify('~g~Вы заработали: ~s~' + methods.moneyFormat(currentMoney));
                        Container.Data.Reset(v.id, 'validWorker' + user.getId(p));
                        user.giveJobSkill(p);
                    }
                    else {
                        p.notify('~r~Вы не являетесь напарником ' + user.getRpName(player));
                        p.notify('~r~Зарплату вы не получили');
                    }
                });
                v.setVariable('gr6Money', 0);
            }
        });
    }
});

mp.events.addRemoteCounted('server:gr6:delete', (player) => {
    if (!user.isLogin(player))
        return;
    let veh = player.vehicle;
    if (veh && player.seat == -1) {
        if (veh.getVariable('owner_id') == user.getId(player)) {
            user.showLoadDisplay(player);
            setTimeout(function () {
                vehicles.respawn(veh);
                setTimeout(function () {
                    if (user.isLogin(player)) {
                        user.hideLoadDisplay(player);
                        user.addCashMoney(player, 4500, 'Возврат ТС инкассатора');
                        player.notify('~b~Вы вернули транспорт в гараж');
                    }
                }, 500);
            }, 700);
        }
        else {
            player.notify('~r~Не вы арендовали, не вам сдавать.');
        }
    }
});

mp.events.addRemoteCounted('server:gr6:grab', (player) => {
    if (!user.isLogin(player))
        return;
    if (player.vehicle && player.seat == -1) {
        if (player.vehicle.getVariable('job') == 8) {
            user.showLoadDisplay(player);
            let money = methods.parseFloat(player.vehicle.getVariable('gr6Money') / 90);
            setTimeout(function () {
                vehicles.respawn(player.vehicle);
                setTimeout(function () {
                    user.hideLoadDisplay(player);
                    user.addCashMoney(player, money, 'Ограбление');
                    player.notify('~b~Вы ограбили транспорт на сумму: ~s~' + methods.moneyFormat(money));
                }, 500);
            }, 700);
        }
        else {
            player.notify('~r~Это не инкассаторская машина');
        }
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

mp.events.addRemoteCounted('server:vehicles:addNew', (player, model, count) => {
    if (user.isAdmin(player)) {
        vehicles.addNew(model, count);
        player.notify('~g~Транспорт на авторынок был добавлен. Кол-во: ~s~' + count)
    }
});

mp.events.addRemoteCounted('server:inventory:getItemList', (player, ownerType, ownerId) => {
    if (!user.isLogin(player))
        return;
    inventory.getItemList(player, ownerType, ownerId);
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

mp.events.addRemoteCounted("onKeyPress:2", (player) => {
    if (!user.isLogin(player))
        return;
    if (player.vehicle && player.seat == -1)
        player.call('client:menuList:showVehicleMenu', [Array.from(vehicles.getData(player.vehicle.getVariable('container')))]);
    else
        player.notify('~r~Вы должны находиться в транспорте');
});

mp.events.addRemoteCounted("onKeyPress:L", (player) => {
    if (!user.isLogin(player))
        return;

    let vehicle = methods.getNearestVehicleWithCoords(player.position, 5);
    if (vehicles.exists(vehicle)) {
        let data = vehicles.getData(vehicle.getVariable('container'));
        if (data.has('fraction_id')) {
            if (data.get('fraction_id') == user.get(player, 'fraction_id'))
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
        player.notify('~r~У Вас нет лицензии на бизнес');
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

mp.events.addRemoteCounted('server:deleteNearstVehicle', (player) => {
    if (!user.isLogin(player))
        return;
    let vehicle = methods.getNearestVehicleWithCoords(player.position, 5);
    if (vehicles.exists(vehicle))
        vehicle.destroy();
});

mp.events.addRemoteCounted('server:respawnNearstVehicle', (player) => {
    if (!user.isLogin(player))
        return;
    let vehicle = methods.getNearestVehicleWithCoords(player.position, 5);
    if (vehicles.exists(vehicle))
        vehicles.respawn(vehicle);
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

mp.events.addRemoteCounted('server:vehicle:lockStatus', (player) => {
    if (!user.isLogin(player))
        return;
    try {


        if (player.vehicle && player.seat == -1) {
            vehicles.lockStatus(player, player.vehicle);
            return;
        }

        let vehicle = methods.getNearestVehicleWithCoords(player.position, 5);
        if (vehicles.exists(vehicle)) {
            let data = vehicles.getData(vehicle.getVariable('container'));

            if (vehicle.getVariable('useless') === true) {
                player.notify('~r~Простите, транспорт закрыт');
                return;
            }

            if (data.has('fraction_id')) {
                if (data.get('fraction_id') == user.get(player, 'fraction_id'))
                    vehicles.lockStatus(player, vehicle);
                else
                    player.notify('~r~У Вас нет ключей от транспорта');
            } else if (data.has('owner_id')) {
                if (data.get('owner_id') == user.getId(player))
                    vehicles.lockStatus(player, vehicle);
                else
                    player.notify('~r~У Вас нет ключей от транспорта');
            } else if (data.has('rentOwner')) {
                if (data.get('rentOwner') == user.getId(player))
                    vehicles.lockStatus(player, vehicle);
                else
                    player.notify('~r~У Вас нет ключей от транспорта');
            } else if (data.has('id_user')) {
                if (data.get('id_user') == user.getId(player))
                    vehicles.lockStatus(player, vehicle);
                else
                    player.notify('~r~У Вас нет ключей от транспорта');
            } else
                vehicles.lockStatus(player, vehicle);
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

mp.events.addRemoteCounted('server:lsc:sellCar', (player) => {
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

    let money = 100;

    let vInfo = methods.getVehicleInfo(veh.model);

    switch (vInfo.class_name) {
        case "Emergency":
        case "Boats":
        case "Helicopters":
        case "Planes":
            player.notify("~r~Мы такое не принимаем");
            return;
        case "Sports Classics":
            money += 350;
            break;
        case "Sports":
        case "Super":
            money += 220;
            break;
        case "SUVs":
        case "Muscle":
        case "Off-Road":
            money += 90;
            break;
    }
    user.showLoadDisplay(player);

    user.addCashMoney(player, money, 'Угон');
    user.set(player, 'grabVeh', true);

    setTimeout(function () {
        if (!user.isLogin(player))
            return;
        user.hideLoadDisplay(player);
        player.notify('~g~Вы заработали: ~s~$' + money);
        if (!vehicles.exists(veh))
            return;
        vehicles.respawn(veh);
    }, 1000);
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

mp.events.add('playerJoin', player => {
    player.dimension = player.id + 1;
    player.countedTriggers = 0;
    player.countedTriggersSwap = 0;
    //player.outputChatBox("RAGE_Multiplayer HAS BEEN STARTED.");
});

mp.events.add('playerQuit', player => {
    user.save(player, true);
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
            methods.saveLog('PlayerDeath', `${user.getRpName(player)} (${user.getId(player)}) ${reason}`);
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
            //user.jail(player, user.get(player, 'wanted_level') * 600); //TODO JAIL
            player.outputChatBox('!{#FFC107}Вас привезли в больницу с огнестрельным ранением и у врачей возникли подозрения, поэтому они сделали запрос в SAPD и сотрудники SAPD выяснили, что у вас есть розыск. После лечения вы отправились в тюрьму.');
        }
    }
});

mp.events.add('playerReady', player => {

    user.ready(player);

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
