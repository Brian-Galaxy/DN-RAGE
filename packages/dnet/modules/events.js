"use strict";

let user = require('../user');
let enums = require('../enums');
let Container = require('./data');

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

mp.events.addRemoteCounted('server:enums:getCloth', (player, requestID) => {
    try {
        player.call('client:enums:updateCloth', [requestID, JSON.stringify(enums.hairOverlays)]);
    } catch (e) {
        methods.debug(e);
    }
});

mp.events.add('server:user:save', (player) => {
    user.save(player);
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
