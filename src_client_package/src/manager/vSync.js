import methods from "../modules/methods";
import user from "../user";
import vehicles from "../property/vehicles";
import Container from "../modules/data";
let vSync = {};
//mp.game.vehicle.defaultEngineBehaviour = false;

let trailerHeal = 1000;
let radioInterval = null;
let currentSound;

vSync.radio = function(entity) {
    if (entity && mp.vehicles.exists(entity)) {
        try {
            let localPlayer = mp.players.local;
            if (localPlayer.vehicle == entity) {
                let typeor = typeof entity.getVariable('vehicleSyncData');
                let vehSyncData = entity.getVariable('vehicleSyncData');

                if (typeor !== 'undefined') {
                    currentSound = mp.game.invoke(methods.GET_PLAYER_RADIO_STATION_INDEX);
                    if (entity.getPedInSeat(-1) == localPlayer.handle) {
                        if (vehSyncData.RadioState != currentSound) mp.events.callRemote('s:vSync:radioChange', entity, currentSound);
                    } else {
                        if (vehSyncData.RadioState == 255)
                            mp.game.audio.setRadioToStationName("OFF");
                        else {
                            if (vehSyncData.RadioState != currentSound) {
                                mp.game.invoke(methods.SET_FRONTEND_RADIO_ACTIVE, true);
                                mp.game.invoke(methods.SET_RADIO_TO_STATION_INDEX, vehSyncData.RadioState);
                            }
                        }
                    }
                }
            }
        }
        catch (e) {
            methods.debug(e);
        }
    } else {
        if (radioInterval != null) {
            clearInterval(radioInterval);
            radioInterval = null;
        }
    }
};

vSync.updateValues = function(entity) {
    if (entity && mp.vehicles.exists(entity)) {
        let typeor = typeof entity.getVariable('vehicleSyncData');
        let actualData = entity.getVariable('vehicleSyncData');
        if (typeor !== 'undefined') {

            try {
                if (vehicles.isVehicleSirenValid(entity.model)) {
                    entity.setSirenSound(true);
                    entity.setSiren(false);

                    let vehId = entity.remoteId;

                    if (actualData.SirenState == 0) {
                        entity.setSiren(false);
                        vSync.stopSound(vehId, 'srn');
                    }
                    else if (actualData.SirenState == 1) {
                        entity.setSiren(true);
                        vSync.stopSound(vehId, 'srn');
                    }
                    else if (actualData.SirenState > 1 && actualData.SirenState < 5) {
                        entity.setSiren(true);
                        vSync.playSound(vehId, 'srn', vehicles.getSirenSound(entity.model, actualData.SirenState));
                    }
                }

                //ntity.setEngineOn(actualData.Engine, true, false);
                mp.game.invoke(methods.SET_VEHICLE_UNDRIVEABLE, entity.handle, true);

                entity.setDirtLevel(actualData.Dirt);
                entity.setIndicatorLights(1, actualData.IndicatorLeftToggle);
                entity.setIndicatorLights(0, actualData.IndicatorRightToggle);

                entity.setInteriorlight(actualData.InteriorLight);
                entity.setTaxiLights(actualData.TaxiLight);

                mp.game.invoke(methods.SET_BOAT_FROZEN_WHEN_ANCHORED, entity.handle, true);
                entity.setBoatAnchor(actualData.Anchor);

                entity.setSearchlight(actualData.SpotLight, false);

                if (actualData.Trunk)
                    entity.setDoorOpen(5, false, false);
                else
                    entity.setDoorShut(5, false);

                if (actualData.Hood)
                    entity.setDoorOpen(4, false, false);
                else
                    entity.setDoorShut(4, false);
            }
            catch (e) {
                methods.debug(e);
            }
        }
        else {

            setTimeout(function () {
                //mp.events.callRemote("s:vSync:setEngineStatus", entity, false); //TODO
                //vSync.updateValues(entity);
            }, 2000);
        }
    }
};

vSync.playSound = function(vehId, prefix, name) {

    try {
        let veh = mp.vehicles.atRemoteId(vehId);
        if (veh !== undefined && mp.vehicles.exists(veh)) {
            if (vehicles.has(veh.remoteId, prefix + 'currentSound')) {
                let sId = vehicles.get(veh.remoteId, prefix + 'currentSound');
                mp.game.audio.stopSound(sId);
                mp.game.audio.releaseSoundId(sId);
                vehicles.reset(veh.remoteId, prefix + 'currentSound');
            }

            let sId = mp.game.invoke(methods.GET_SOUND_ID);
            mp.game.invoke(methods.PLAY_SOUND_FROM_ENTITY, sId, name, veh.handle, 0, 0, 0);
            vehicles.set(veh.remoteId, prefix + 'currentSound', sId);
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

vSync.stopSound = function(vehId, prefix) {
    try {
        let veh = mp.vehicles.atRemoteId(vehId);
        if (veh !== undefined && mp.vehicles.exists(veh)) {
            if (vehicles.has(veh.remoteId, prefix + 'currentSound')) {
                let sId = vehicles.get(veh.remoteId, prefix + 'currentSound');
                mp.game.audio.stopSound(sId);
                mp.game.audio.releaseSoundId(sId);
                vehicles.reset(veh.remoteId, prefix + 'currentSound');
            }
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

vSync.syncToServer = function(entity) {

    try {
        if (entity === undefined) {
            if (!mp.players.local.vehicle)
                return;

            entity = mp.players.local.vehicle;
            if (entity.getPedInSeat(-1) != mp.players.local.handle)
                return;
        }

        let typeor = typeof entity.getVariable('vehicleSyncData');
        let actualData = entity.getVariable('vehicleSyncData');
        let trailerId = entity.getVariable('trailer');

        if (trailerId) {
            let trailer = mp.vehicles.atRemoteId(trailerId);
            if (mp.vehicles.exists(trailer)) {
                if (methods.parseInt(trailerHeal) != methods.parseInt(trailer.getBodyHealth())) {
                    trailerHeal = methods.parseInt(trailer.getBodyHealth());
                    mp.events.callRemote("s:vSync:setBodyHealth", trailer, trailerHeal);
                }
            }
        }

        if (typeor !== 'undefined') {
            let dirtLevel = entity.getDirtLevel();
            if (methods.parseInt(actualData.Dirt) != methods.parseInt(dirtLevel))
                mp.events.callRemote("s:vSync:setDirtLevel", entity, dirtLevel);
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

mp.events.add("vSync:playerExitVehicle", (vehId) => {
    try {
        let veh = mp.vehicles.atRemoteId(vehId);
        if (veh !== undefined && mp.vehicles.exists(veh)) {
            vSync.syncToServer(veh);
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add("vSync:playSound", (vehId, prefix, name) => {
    vSync.playSound(vehId, prefix, name);
});

mp.events.add("vSync:stopSound", (vehId, prefix) => {
    vSync.stopSound(vehId, prefix);
});

mp.events.add("vSync:setVehicleWindowStatus", (vehId, windw, state) => {
    try {
        let veh = mp.vehicles.atRemoteId(vehId);
        if (veh !== undefined && mp.vehicles.exists(veh)) {
            if (state === 1) {
                veh.rollDownWindow(windw);
            }
            else if (state === 0) {
                veh.fixWindow(windw);
                veh.rollUpWindow(windw);
            }
            else {
                veh.smashWindow(windw);
            }
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

/*mp.events.add("vSync:radioChange", (vehId, state) => {
    try {
        let veh = mp.vehicles.atRemoteId(vehId);
        if (veh !== undefined && mp.vehicles.exists(veh)) {
            if (state == 255) mp.game.audio.setRadioToStationName("OFF");
            else {
                mp.game.invoke(methods.SET_FRONTEND_RADIO_ACTIVE, true);
                mp.game.invoke(methods.SET_RADIO_TO_STATION_INDEX, state);
            }
        }
    }
    catch (e) {
        methods.debug(e);
    }
});*/

/*mp.events.add("vSync:setVehicleWheelMod", (vehId, state, isShowLabel) => {
    try {
        let veh = mp.vehicles.atRemoteId(vehId);
        if (veh !== undefined && mp.vehicles.exists(veh)) {
            if (state > 0)
                mp.game.invoke(methods.SET_VEHICLE_MOD, veh.handle, 23, state, isShowLabel);
        }
    }
    catch (e) {
        methods.debug(e);
    }
});*/

mp.events.add("vSync:setVehicleWheelStatus", (vehId, wheel, state) => {
    try {
        let veh = mp.vehicles.atRemoteId(vehId);
        if (veh !== undefined && mp.vehicles.exists(veh)) {
            if (wheel === 9) {
                if (state === 1) {
                    veh.setTyreBurst(45, false, 1000);
                }
                else if (state === 0) {
                    veh.setTyreFixed(45);
                }
                else {
                    veh.setTyreBurst(45, true, 1000);
                }
            }
            else if (wheel === 10) {
                if (state === 1) {
                    veh.setTyreBurst(47, false, 1000);
                }
                else if (state === 0) {
                    veh.setTyreFixed(47);
                }
                else {
                    veh.setTyreBurst(47, true, 1000);
                }
            }
            else {
                if (state === 1) {
                    veh.setTyreBurst(wheel, false, 1000);
                }
                else if (state === 0) {
                    veh.setTyreFixed(wheel);
                }
                else {
                    veh.setTyreBurst(wheel, true, 1000);
                }
            }
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add("vSync:setVehicleDirt", (vehId, dirt) => {
    try {
        let veh = mp.vehicles.atRemoteId(vehId);
        if (veh !== undefined && mp.vehicles.exists(veh)) {
            veh.setDirtLevel(dirt);
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add("vSync:setVehicleDoorState", (vehId, door, state) => {
    try {
        let veh = mp.vehicles.atRemoteId(vehId);
        if (veh !== undefined && mp.vehicles.exists(veh)) {
            if (state === 0)
                veh.setDoorShut(door, false);
            else if (state === 1)
                veh.setDoorOpen(door, false, false);
            else
                veh.setDoorBroken(door, true);
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add("vSync:setEngineState", (vehId, status) => {
    try {
        let veh = mp.vehicles.atRemoteId(vehId);
        if (veh !== undefined && mp.vehicles.exists(veh)) {
            /*console.log(vehId, status);
            console.log(mp.players.local.vehicle && mp.players.local.vehicle.remoteId == vehId);
            if ((mp.players.local.vehicle && mp.players.local.vehicle.remoteId == vehId) === true)
                veh.setEngineOn(status, false, false);
            else*/
            //veh.setEngineOn(status, true, false);
        }
    } catch (e) {
        methods.debug(e);
    }
});

mp.events.add("vSync:setInteriorLightState", (vehId, status) => {
    try {
        let veh = mp.vehicles.atRemoteId(vehId);
        if (veh !== undefined && mp.vehicles.exists(veh)) {
            veh.setInteriorlight(status);
        }
    } catch (e) {
        methods.debug(e);
    }
});

mp.events.add("vSync:setTaxiLightState", (vehId, status) => {
    try {
        let veh = mp.vehicles.atRemoteId(vehId);
        if (veh !== undefined && mp.vehicles.exists(veh)) {
            veh.setTaxiLights(status);
        }
    } catch (e) {
        methods.debug(e);
    }
});

mp.events.add("vSync:setAnchorState", (vehId, status) => {
    try {
        let veh = mp.vehicles.atRemoteId(vehId);
        if (veh !== undefined && mp.vehicles.exists(veh)) {
            mp.game.invoke(methods.SET_BOAT_FROZEN_WHEN_ANCHORED, veh.handle, true);
            veh.setBoatAnchor(status);
        }
    } catch (e) {
        methods.debug(e);
    }
});

mp.events.add("vSync:setSpotLightState", (vehId, status) => {
    try {
        let veh = mp.vehicles.atRemoteId(vehId);
        if (veh !== undefined && mp.vehicles.exists(veh)) {
            veh.setSearchlight(status, false);
        }
    } catch (e) {
        methods.debug(e);
    }
});

mp.events.add("vSync:setIndicatorRightToggle", (vehId, status) => {
    try {
        let veh = mp.vehicles.atRemoteId(vehId);
        if (veh !== undefined && mp.vehicles.exists(veh)) {
            veh.setIndicatorLights(0, status);
        }
    } catch (e) {
        methods.debug(e);
    }
});

mp.events.add("vSync:setTrunkState", (vehId, status) => {
    try {
        let veh = mp.vehicles.atRemoteId(vehId);
        if (veh !== undefined && mp.vehicles.exists(veh)) {
            if (status)
                veh.setDoorOpen(5, false, false);
            else
                veh.setDoorShut(5, false);
        }
    } catch (e) {
        methods.debug(e);
    }
});

mp.events.add("vSync:setHoodState", (vehId, status) => {
    try {
        let veh = mp.vehicles.atRemoteId(vehId);
        if (veh !== undefined && mp.vehicles.exists(veh)) {
            if (status)
                veh.setDoorOpen(4, false, false);
            else
                veh.setDoorShut(4, false);
        }
    } catch (e) {
        methods.debug(e);
    }
});

mp.events.add("vSync:setIndicatorLeftToggle", (vehId, status) => {
    try {
        let veh = mp.vehicles.atRemoteId(vehId);
        if (veh !== undefined && mp.vehicles.exists(veh)) {
            veh.setIndicatorLights(1, status);
        }
    } catch (e) {
        methods.debug(e);
    }
});

mp.events.add("vSync:setLockStatus", (vehId, status) => {
    try {
        let veh = mp.vehicles.atRemoteId(vehId);
        if (veh !== undefined && mp.vehicles.exists(veh)) {
            if (status) {
                mp.game.audio.playSoundFromEntity(1, "Remote_Control_Close", veh.handle, "PI_Menu_Sounds", true, 0);
            } else {
                mp.game.audio.playSoundFromEntity(1, "Remote_Control_Open", veh.handle, "PI_Menu_Sounds", true, 0);
            }
        }
    } catch (e) {
        methods.debug(e);
    }
});

mp.events.add("vSync:setSirenState", (vehId, state) => {
    try {
        let veh = mp.vehicles.atRemoteId(vehId);
        if (veh !== undefined && mp.vehicles.exists(veh)) {
            if (vehicles.isVehicleSirenValid(veh.model)) {
                //veh.setSiren(false);
                veh.setSirenSound(true);

                if (state == 0) {
                    veh.setSiren(false);
                    vSync.stopSound(vehId, 'srn');
                }
                else if (state == 1) {
                    veh.setSiren(true);
                    vSync.stopSound(vehId, 'srn');
                }
                else if (state > 1 && state < 5) {
                    //veh.setSiren(true);
                    vSync.playSound(vehId, 'srn', vehicles.getSirenSound(veh.model, state));
                }
            }
        }
    } catch (e) {
        methods.debug(e);
    }
});

mp.events.add("playerEnterVehicle", (entity, seat) => {
    if (entity) {
        if (radioInterval != null)
            clearInterval(radioInterval);
        radioInterval = setInterval(() => { vSync.radio(entity); }, 1000);
    }

    if (entity !== undefined && mp.vehicles.exists(entity)) {
        vSync.updateValues(entity);
    }
});

mp.events.add("playerLeaveVehicle", (entity) => {
    if (radioInterval != null) {
        clearInterval(radioInterval);
        radioInterval = null;
    }
    mp.events.callRemote("s:vSync:stopSound", entity, 'wrng');
});

mp.keys.bind(0x45, true, function() {
    if (!user.isLogin())
        return;
    let veh = mp.players.local.vehicle;
    if (!methods.isBlockKeys() && veh && vehicles.isVehicleSirenValid(veh.model)) {
        //mp.game.invoke(methods.PLAY_SOUND_FROM_ENTITY, 9999, vehicles.getWarningSound(mp.players.local.vehicle.model), mp.players.local.vehicle.handle, 0, 0, 0);
        mp.events.callRemote("s:vSync:playSound", veh, 'wrng', vehicles.getWarningSound(mp.players.local.vehicle.model));
    }
});

mp.keys.bind(0x45, false, function() {
    if (!user.isLogin())
        return;
    let veh = mp.players.local.vehicle;
    if (!methods.isBlockKeys() && veh && vehicles.isVehicleSirenValid(veh.model)) {
        mp.events.callRemote("s:vSync:stopSound", veh, 'wrng');
    }
});

mp.keys.bind(0x51, true, function() {
    if (!user.isLogin())
        return;
    let veh = mp.players.local.vehicle;
    if (!methods.isBlockKeys() && veh && vehicles.isVehicleSirenValid(veh.model)) {

        let typeor = typeof veh.getVariable('vehicleSyncData');
        let actualData = veh.getVariable('vehicleSyncData');

        if (typeor !== 'undefined') {
            if (actualData.SirenState == 0) {
                mp.game.audio.playSound(-1, "NAV_LEFT_RIGHT", "HUD_FRONTEND_DEFAULT_SOUNDSET", false, 0, true);
                mp.events.callRemote("s:vSync:setSirenState", veh, 1);
            }
            else {
                mp.game.audio.playSound(-1, "NAV_UP_DOWN", "HUD_FRONTEND_DEFAULT_SOUNDSET", false, 0, true);
                mp.events.callRemote("s:vSync:setSirenState", veh, 0);
            }
        }
    }
});

mp.keys.bind(0xBC, true, function() {
    if (!user.isLogin())
        return;
    let veh = mp.players.local.vehicle;
    if (!methods.isBlockKeys() && veh && vehicles.isVehicleSirenValid(veh.model)) {

        let typeor = typeof veh.getVariable('vehicleSyncData');
        let actualData = veh.getVariable('vehicleSyncData');

        if (typeor !== 'undefined') {
            if (actualData.SirenState > 0) {
                let currentState = actualData.SirenState;
                currentState--;
                if (currentState < 1)
                    currentState = 4;

                mp.game.audio.playSound(-1, "NAV_UP_DOWN", "HUD_FRONTEND_DEFAULT_SOUNDSET", false, 0, true);
                mp.events.callRemote("s:vSync:setSirenState", veh, currentState);
            }
        }
    }
});

mp.keys.bind(0xBE, true, function() {
    if (!user.isLogin())
        return;
    let veh = mp.players.local.vehicle;
    if (!methods.isBlockKeys() && veh && vehicles.isVehicleSirenValid(veh.model)) {

        let typeor = typeof veh.getVariable('vehicleSyncData');
        let actualData = veh.getVariable('vehicleSyncData');

        if (typeor !== 'undefined') {
            if (actualData.SirenState > 0) {
                let currentState = actualData.SirenState;
                currentState++;
                if (currentState > 4)
                    currentState = 1;

                mp.game.audio.playSound(-1, "NAV_UP_DOWN", "HUD_FRONTEND_DEFAULT_SOUNDSET", false, 0, true);
                mp.events.callRemote("s:vSync:setSirenState", veh, currentState);
            }
            else {
                mp.events.callRemote("s:vSync:playSound", veh, 'srn', vehicles.getSirenSound(mp.players.local.vehicle.model, 2));
            }
        }
    }
});

mp.keys.bind(0xBE, false, function() {
    if (!user.isLogin())
        return;
    let veh = mp.players.local.vehicle;
    if (!methods.isBlockKeys() && veh && vehicles.isVehicleSirenValid(veh.model)) {

        let typeor = typeof veh.getVariable('vehicleSyncData');
        let actualData = veh.getVariable('vehicleSyncData');

        if (typeor !== 'undefined') {
            if (actualData.SirenState == 0) {
                mp.events.callRemote("s:vSync:stopSound", veh, 'srn');
            }
        }
    }
});

mp.events.add('render', () => {
    try {
        let veh = mp.players.local.vehicle;
        if (veh && veh.getClass() == 18) {
            mp.game.controls.disableControlAction(0,86,true);
            mp.game.controls.disableControlAction(0,81,true);
            mp.game.controls.disableControlAction(0,82,true);
            mp.game.controls.disableControlAction(0,85,true);
            mp.game.controls.disableControlAction(0,80,true);
            mp.game.controls.disableControlAction(0,19,true);

        }
    }
    catch (e) {

    }
});

//Sync data on stream in
mp.events.add("entityStreamIn", (entity) => {
    try {
        if (entity.type === "vehicle") {

            if (!mp.vehicles.exists(entity))
                return;

            try {
                entity.trackVisibility();
                entity.setTyresCanBurst(true);

                mp.game.invoke(methods.SET_VEHICLE_UNDRIVEABLE, entity.handle, true);
                vSync.updateValues(entity);

                if (entity.getVariable('useless') === true) {
                    entity.setCanBeDamaged(false);
                    entity.setInvincible(true);
                    setTimeout(function () {
                        try {
                            if (!mp.vehicles.exists(entity))
                                return;
                            entity.freezePosition(true);
                        }
                        catch (e) {
                            methods.debug(e);
                        }
                    }, 5000);
                }
            }
            catch (e) {
                methods.debug(e);
            }

            //Set doors unbreakable for a moment
            /*let x = 0;
            for (x = 0; x < 8; x++) {
                entity.setDoorBreakable(x, false);
            }*/
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

export default vSync;