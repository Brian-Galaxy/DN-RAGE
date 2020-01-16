import methods from "../modules/methods";

let pSync = exports;

mp.events.add('entityStreamIn', (entity) => {
    if (entity.type === 'player') {
        let remotePlayer = entity;
        if (mp.players.exists(remotePlayer)) {
            for(let i = 0; i < 8; i++) {
                try {
                    let propType = remotePlayer.getVariable('propType' + i);
                    let propColor = remotePlayer.getVariable('propColor' + i);

                    if (propType >= 0)
                        remotePlayer.setPropIndex(i, propType, propColor, true);
                    else
                        remotePlayer.clearProp(i);
                }
                catch (e) {
                    methods.debug(e);
                }
            }

            try {
                let topsDraw = remotePlayer.getVariable('topsDraw');
                let topsColor = remotePlayer.getVariable('topsColor');
                remotePlayer.setComponentVariation(11, topsDraw, topsColor, 2);
            }
            catch (e) {
                methods.debug(e);
            }
        }
    }
});

mp.events.add('client:syncComponentVariation', (playerId, component, drawableId, textureId) => {
    try {
        let remotePlayer = mp.players.atRemoteId(playerId);
        if (remotePlayer && mp.players.exists(remotePlayer)) {
            remotePlayer.setComponentVariation(component, drawableId, textureId, 2);
        }
    }
    catch (e) {
        methods.debug('Exception: events:client:syncComponentVariation');
        methods.debug(e);
    }
});

mp.events.add('client:syncAnimation', async (playerId, dict, anim, flag) => {
    //if (mp.players.local.remoteId == playerId || mp.players.local.id == playerId)
    try {
        let remotePlayer = mp.players.atRemoteId(playerId);
        if (remotePlayer && mp.players.exists(remotePlayer)) {

            if (remotePlayer.vehicle && dict != 'cellphone@female')
                return;

            if (remotePlayer === mp.players.local)
                remotePlayer = mp.players.local;
            else {
                remotePlayer.setAsMission(false, true);
                /*if (flag == 8 || flag == 9)
                    flag = 32;*/
                if (flag == 8)
                    flag = 0;
                if (flag == 9)
                    flag = 1;
            }

            methods.debug('Execute: events:client:syncAnimation:' + flag);

            remotePlayer.clearTasks();
            //remotePlayer.clearTasksImmediately();
            //remotePlayer.clearSecondaryTask();
            mp.game.streaming.requestAnimDict(dict);

            if (!mp.game.streaming.hasAnimDictLoaded(dict)) {
                mp.game.streaming.requestAnimDict(dict);
                while (!mp.game.streaming.hasAnimDictLoaded(dict))
                    await methods.sleep(10);
            }

            remotePlayer.taskPlayAnim(dict, anim, 8, 0, -1, flag, 0.0, false, false, false);

            if (flag != 1 && flag != 9 && flag != 49) {
                methods.debug('Execute: events:client:syncAnimation2:' + flag);
                setTimeout(async function () {
                    try {
                        methods.debug('Execute: events:client:syncAnimation3:' + flag);
                        while (mp.players.exists(remotePlayer) && remotePlayer.isPlayingAnim(dict, anim, 3) !== 0)
                            await methods.sleep(10);
                        if (remotePlayer.getHealth() > 0)
                            remotePlayer.clearTasksImmediately();
                        methods.debug('Execute: events:client:syncAnimation4:' + flag);
                    }
                    catch (e) {
                        methods.debug(e);
                    }
                }, 1000);
            }
        }
    }
    catch (e) {
        methods.debug('Exception: events:client:syncAnimation');
        methods.debug(e);
    }
});

mp.events.add('client:syncStopAnimation', (playerId) => {
    //if (mp.players.local.remoteId == playerId || mp.players.local.id == playerId)
    try {
        methods.debug('client:syncStopAnimation', playerId);
        let remotePlayer = mp.players.atRemoteId(playerId);
        if (remotePlayer && mp.players.exists(remotePlayer)) {
            remotePlayer.clearTasks();
            if (!remotePlayer.isInAir() && !remotePlayer.vehicle)
                remotePlayer.clearTasksImmediately();
        }
    }
    catch (e) {
        methods.debug('Exception: events:client:syncAnimation');
        methods.debug(e);
    }
});

mp.events.add('client:syncScenario', (playerId, name) => {
    //if (mp.players.local.remoteId == playerId || mp.players.local.id == playerId)
    try {
        methods.debug('Execute: events:client:syncScenario');
        let remotePlayer = mp.players.atRemoteId(playerId);
        if (remotePlayer && mp.players.exists(remotePlayer)) {

            if (remotePlayer === mp.players.local)
                remotePlayer = mp.players.local;
            else
                remotePlayer.setAsMission(false, true);

            remotePlayer.clearTasks();
            if (name == 'PROP_HUMAN_SEAT_BENCH') {
                let pos = remotePlayer.getOffsetFromInWorldCoords(0, -0.5, -0.5);
                let heading = remotePlayer.getRotation(0).z;
                remotePlayer.taskStartScenarioAtPosition(name, pos.x, pos.y, pos.z, heading, -1, true, false);
            }
            else {
                remotePlayer.taskStartScenarioInPlace(name, 0, true);
            }
        }
    }
    catch (e) {
        methods.debug('Exception: events:client:syncScenario');
        methods.debug(e);
    }
});

mp.events.add('client:syncHeadingToCoord', (playerId, x, y, z) => {
    //if (mp.players.local.remoteId == playerId || mp.players.local.id == playerId)
    try {
        let remotePlayer = mp.players.atRemoteId(playerId);
        if (remotePlayer && mp.players.exists(remotePlayer)) {

            if (remotePlayer.vehicle)
                return;

            if (remotePlayer === mp.players.local)
                remotePlayer = mp.players.local;

            methods.debug('Execute: events:client:syncHeadingToCoord');

            remotePlayer.clearTasks();
            remotePlayer.taskTurnToFaceCoord(x, y, z, -1);

            setTimeout(function () {
                remotePlayer.clearTasks();
            }, 2000);
        }
    }
    catch (e) {
        methods.debug('Exception: events:client:syncHeadingToCoord');
        methods.debug(e);
    }
});

mp.events.add('client:syncHeadingToTarget', (playerId, targetId) => {
    //if (mp.players.local.remoteId == playerId || mp.players.local.id == playerId)
    try {
        let remotePlayer = mp.players.atRemoteId(playerId);
        let targetPlayer = mp.players.atRemoteId(targetId);
        if (remotePlayer && mp.players.exists(remotePlayer) && targetPlayer && mp.players.exists(targetPlayer)) {

            if (remotePlayer.vehicle)
                return;

            if (remotePlayer === mp.players.local)
                remotePlayer = mp.players.local;

            methods.debug('Execute: events:client:syncHeadingToTarget');

            remotePlayer.clearTasks();
            remotePlayer.taskTurnToFace(targetPlayer.handle, -1);

            setTimeout(function () {
                remotePlayer.clearTasks();
            }, 2000);
        }
    }
    catch (e) {
        methods.debug('Exception: events:client:syncHeadingToTarget');
        methods.debug(e);
    }
});

/*

cellphone@	f_cellphone_text_in
cellphone@female	cellphone_call_to_text
cellphone@first_person	cellphone_text_read_base
cellphone@first_person@parachute	cellphone_text_in
cellphone@first_person	cellphone_call_listen_base
cellphone@in_car@ds	cellphone_text_read_base
cellphone@in_car@ds@first_person	cellphone_horizontal_base
cellphone@in_car@ds@first_person	cellphone_swipe_screen
cellphone@in_car@low@ds	cellphone_text_out
cellphone@in_car@ps	cellphone_horizontal_intro
cellphone@self	selfie
cellphone@self	selfie_in
cellphone@self@franklin@	chest_bump
cellphone@self@franklin@	peace
cellphone@self@michael@	finger_point
cellphone@self@trevor@	aggressive_finger
cellphone@stealth	cellphone_text_read_base
cellphone@str_female	cellphone_call_listen_yes_b
cellphone@str	f_cellphone_call_listen_maybe_a


cellphone@female cellphone_call_listen_base

local inAnim = "cellphone_text_in"
local outAnim = "cellphone_text_out"
local callAnim = "cellphone_call_listen_base"
local textAnim = "cellphone_text_read_base"
local toTextAnim = "cellphone_call_to_text"
local horizontalAnim = "cellphone_horizontal_base"

mp.events.callRemote('server:playAnimation', "cellphone@female", "cellphone_call_listen_base", 49);

* */

let attachedObjects = {};

mp.events.add('client:attachToPlayer', (playerId, model, bone, x, y, z, rX, rY, rZ) => {
    //if (mp.players.local.remoteId == playerId || mp.players.local.id == playerId)
    try {
        let remotePlayer = mp.players.atRemoteId(playerId);
        if (remotePlayer && mp.players.exists(remotePlayer)) {

            //[bone, x, y, z, rX, rY, rZ] = [bone, x, y, z, rX, rY, rZ].map(a => methods.parseFloat(a));

            if (attachedObjects[playerId])
                attachedObjects[playerId].destroy();

            model = methods.parseInt(model);

            attachedObjects[playerId] = mp.objects.new(model, remotePlayer.position, {rotation: new mp.Vector3(0, 0, 30), dimension: -1, });
            attachedObjects[playerId].attachTo(remotePlayer.handle, remotePlayer.getBoneIndex(bone), x, y, z, rX, rY, rZ,
                false, false, false, false, 2, true);
        }
    }
    catch (e) {
        methods.debug('Exception: events:client:syncOpenPhone');
        methods.debug(e);
    }
});

mp.events.add('client:syncOpenPhone', (playerId, type) => {
    //if (mp.players.local.remoteId == playerId || mp.players.local.id == playerId)
    try {
        let remotePlayer = mp.players.atRemoteId(playerId);
        if (remotePlayer && mp.players.exists(remotePlayer)) {

            if (remotePlayer === mp.players.local)
                remotePlayer = mp.players.local;

            methods.debug('Execute: events:client:syncOpenPhone');


        }
    }
    catch (e) {
        methods.debug('Exception: events:client:syncOpenPhone');
        methods.debug(e);
    }
});