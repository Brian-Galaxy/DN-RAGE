let vehicles = require('../vehicles');
let Container = require('../modules/data');
let methods = require('../modules/methods');

let vSync = exports;

vSync.WindowID =
    {
        WindowFrontRight: 0,
        WindowFrontLeft: 1,
        WindowRearRight: 2,
        WindowRearLeft: 3
    };

vSync.SirenState =
    {
        Disable: 0,
        EnableWithoutSound: 1,
        EnableWithSoundSlow: 2,
        EnableWithSoundNormal: 3,
        EnableWithSoundFast: 4
    };

vSync.WindowState =
    {
        WindowFixed: 0,
        WindowDown: 1,
        WindowBroken: 2
    };

vSync.DoorID =
    {
        DoorFrontLeft: 0,
        DoorFrontRight: 1,
        DoorRearLeft: 2,
        DoorRearRight: 3,
        DoorHood: 4,
        DoorTrunk: 5
    };

vSync.DoorState =
    {
        DoorClosed: 0,
        DoorOpen: 1,
        DoorBroken: 2,
    };

vSync.WheelID =
    {
        Wheel0: 0,
        Wheel1: 1,
        Wheel2: 2,
        Wheel3: 3,
        Wheel4: 4,
        Wheel5: 5,
        Wheel6: 6,
        Wheel7: 7,
        Wheel8: 8,
        Wheel9: 9
    };

vSync.WheelState =
    {
        WheelFixed: 0,
        WheelBurst: 1,
        WheelOnRim: 2,
    };

vSync.VehicleSyncData = {
    //Basics
    Dirt: 0,
    Siren: 0,
    RadioState: 0,
    Engine: false,

    //(Not synced)
    IndicatorLeftToggle: false,
    IndicatorRightToggle: false,
    InteriorLight: false,
    TaxiLight: false,
    ModWheelSpecial: false,
    ModWheel: 0,

    //Doors 0-7 (0 = closed, 1 = open, 2 = broken) (This uses enums so don't worry about it)
    Door: [0, 0, 0, 0, 0, 0, 0, 0],

    //Windows (0 = up, 1 = down, 2 = smashed) (This uses enums so don't worry about it)
    Window: [0, 0, 0, 0],

    //Wheels 0-7, 45/47 (0 = fixed, 1 = flat, 2 = missing) (This uses enums so don't worry about it)
    Wheel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};

let streamDist = 250;
let offsetId = -999000;
let prefix = 'vSync';

vSync.set = function(vehicle, key, value) {
    if (vehicles.exists(vehicle)) {
        vehicle.setVariable(key, value);
        Container.Data.Set(vehicle.id + offsetId, prefix + key, true);
    }
};

vSync.get = function(vehicle, key) {
    if (vehicles.exists(vehicle))
        return vehicle.getVariable(key);
    return null;
};

vSync.has = function(vehicle, key) {
    if (vehicles.exists(vehicle))
        return vehicle.getVariable(key) == true;
    //return Container.Data.Has(vehicle.id + offsetId, prefix + key);
    return false;
};

vSync.getVehicleSyncData = function(vehicle) {
    if (vehicles.exists(vehicle) && vSync.has(vehicle, 'vehicleSyncData')) {
        return vSync.get(vehicle, 'vehicleSyncData');
    }
    return vSync.VehicleSyncData;
};

vSync.updateVehicleSyncData = function(veh, data) {
    if (vehicles.exists(veh) && data)
        vSync.set(veh, 'vehicleSyncData', data);
};

vSync.setVehicleWindowState = function(v, window, state) {
    if (!vehicles.exists(v))
        return;
    let data = vSync.getVehicleSyncData(v);
    data.Window[window] = state;
    vSync.updateVehicleSyncData(v, data);
    mp.players.callInRange(v.position, streamDist, "vSync:setVehicleWindowStatus", [v.id, window, state]);
};

vSync.getVehicleWindowState = function(v, window) {
    return methods.parseInt(vSync.getVehicleSyncData(v).Window[window]);
};

vSync.setVehicleWheelMod = function(v, state, isShowLabel) {
    if (!vehicles.exists(v))
        return;
    state = methods.parseInt(state);
    let data = vSync.getVehicleSyncData(v);
    data.ModWheel = state;
    data.ModWheelSpecial = isShowLabel;
    vSync.updateVehicleSyncData(v, data);
    mp.players.callInRange(v.position, streamDist, "vSync:setVehicleWheelMod", [v.id, state, isShowLabel]);
};

vSync.setVehicleWheelState = function(v, wheel, state) {
    if (!vehicles.exists(v))
        return;
    let data = vSync.getVehicleSyncData(v);
    data.Wheel[wheel] = state;
    vSync.updateVehicleSyncData(v, data);
    mp.players.callInRange(v.position, streamDist, "vSync:setVehicleWheelStatus", [v.id, wheel, state]);
};

vSync.getVehicleWheelState = function(v, wheel) {
    return methods.parseInt(vSync.getVehicleSyncData(v).Wheel[wheel]);
};

vSync.setSirenState = function(v, state) {
    if (!vehicles.exists(v))
        return;
    let data = vSync.getVehicleSyncData(v);
    data.SirenState = state;
    vSync.updateVehicleSyncData(v, data);
    mp.players.callInRange(v.position, streamDist, "vSync:setSirenState", [v.id, state]);
};

vSync.playSound = function(v, pref, val) {
    if (!vehicles.exists(v))
        return;
    mp.players.callInRange(v.position, streamDist, "vSync:playSound", [v.id, pref, val]);
};

vSync.stopSound = function(v, pref) {
    if (!vehicles.exists(v))
        return;
    mp.players.callInRange(v.position, streamDist, "vSync:stopSound", [v.id, pref]);
};

vSync.setVehicleDirt = function(v, dirt) {
    if (!vehicles.exists(v))
        return;
    let data = vSync.getVehicleSyncData(v);
    data.Dirt = dirt;
    vSync.updateVehicleSyncData(v, data);
    mp.players.callInRange(v.position, streamDist, "vSync:setVehicleDirt", [v.id, dirt]);
};

vSync.getVehicleDirt = function(v) {
    return vSync.getVehicleSyncData(v).Dirt;
};

vSync.setVehicleDoorState = function(v, door, state) {
    if (!vehicles.exists(v))
        return;
    let data = vSync.getVehicleSyncData(v);
    data.Door[door] = state;
    vSync.updateVehicleSyncData(v, data);
    mp.players.callInRange(v.position, streamDist, "vSync:setVehicleDoorState", [v.id, door, state]);
};

vSync.getVehicleDoorState = function(v, door) {
    return methods.parseInt(vSync.getVehicleSyncData(v).Door[door]);
};

vSync.setIndicatorLeftToggle = function(v, status) {
    if (!vehicles.exists(v))
        return;
    let data = vSync.getVehicleSyncData(v);
    data.IndicatorLeftToggle = status;
    vSync.updateVehicleSyncData(v, data);
    mp.players.callInRange(v.position, streamDist, "vSync:setIndicatorLeftToggle", [v.id, status]);
};

vSync.getIndicatorLeftToggle = function(v) {
    return vSync.getVehicleSyncData(v).IndicatorLeftToggle;
};

vSync.setIndicatorRightToggle = function(v, status) {
    if (!vehicles.exists(v))
        return;
    let data = vSync.getVehicleSyncData(v);
    data.IndicatorRightToggle = status;
    vSync.updateVehicleSyncData(v, data);
    mp.players.callInRange(v.position, streamDist, "vSync:setIndicatorRightToggle", [v.id, status]);
};

vSync.getIndicatorRightToggle = function(v) {
    return vSync.getVehicleSyncData(v).IndicatorRightToggle;
};

vSync.setEngineState = function(v, status) {
    if (!vehicles.exists(v))
        return;
    let data = vSync.getVehicleSyncData(v);
    data.Engine = status;
    vSync.updateVehicleSyncData(v, data);
    v.engine = status;
    //mp.players.callInRange(v.position, streamDist, "vSync:setEngineState", [v.id, status]);
};

vSync.getEngineState = function(v) {
    if (!vehicles.exists(v))
        return false;
    return v.engine;
};

vSync.setInteriorLightState = function(v, status) {
    if (!vehicles.exists(v))
        return;
    let data = vSync.getVehicleSyncData(v);
    data.InteriorLight = status;
    vSync.updateVehicleSyncData(v, data);
    mp.players.callInRange(v.position, streamDist, "vSync:setInteriorLightState", [v.id, status]);
};

vSync.getInteriorLightState = function(v) {
    return vSync.getVehicleSyncData(v).InteriorLight;
};

vSync.setTaxiLightState = function(v, status) {
    if (!vehicles.exists(v))
        return;
    let data = vSync.getVehicleSyncData(v);
    data.TaxiLight = status;
    vSync.updateVehicleSyncData(v, data);
    mp.players.callInRange(v.position, streamDist, "vSync:setTaxiLightState", [v.id, status]);
};

vSync.getTaxiLightState = function(v) {
    return vSync.getVehicleSyncData(v).TaxiLight;
};

vSync.setLockStatus = function(v, status) {
    if (!vehicles.exists(v))
        return;
    mp.players.callInRange(v.position, streamDist, "vSync:setLockStatus", [v.id, status]);
};

vSync.setBodyHealth = function(v, health) {
    if (!vehicles.exists(v))
        return;
    let data = vSync.getVehicleSyncData(v);
    data.BodyHealth = health;
    v.bodyHealth = health;
    vSync.updateVehicleSyncData(v, data);
};

mp.events.add("playerEnterVehicle", function (player, vehicle) {
    if (vehicles.exists(vehicle) && !vSync.has(vehicle))
        vSync.updateVehicleSyncData(vehicle, vSync.VehicleSyncData);
});


mp.events.add("playerExitVehicle", function (player, vehicle) {
    //setTimeout(function () {
    if (vehicles.exists(vehicle))
        vSync.setEngineState(vehicle, vSync.getEngineState(vehicle));
    //}, 1000);
});

mp.events.add('s:vSync:setDirtLevel', (player, vId, level) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh))
        vSync.setVehicleDirt(player.vehicle, level);
});

mp.events.add('s:vSync:setEngineStatus', (player, vId, status) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh))
        vSync.setEngineState(player.vehicle, status);
});

mp.events.add('s:vSync:updateValues', (player, vId, status) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh))
        vSync.setEngineState(player.vehicle, status);
});

mp.events.add('s:vSync:setInteriorLightState', (player, vId, status) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh))
        vSync.setInteriorLightState(player.vehicle, status);
});

mp.events.add('s:vSync:setTaxiLightState', (player, vId, status) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh))
        vSync.setTaxiLightState(player.vehicle, status);
});

mp.events.add('s:vSync:setIndicatorLeftState', (player, vId, status) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh))
        vSync.setIndicatorLeftToggle(player.vehicle, status);
});

mp.events.add('s:vSync:setIndicatorRightState', (player, vId, status) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh))
        vSync.setIndicatorRightToggle(player.vehicle, status);
});

mp.events.add('s:vSync:setDoorData', (player, vId, doorState1, doorState2, doorState3, doorState4, doorState5, doorState6, doorState7, doorState8) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh)) {
        vSync.setVehicleDoorState(player.vehicle, 0, doorState1);
        vSync.setVehicleDoorState(player.vehicle, 1, doorState2);
        vSync.setVehicleDoorState(player.vehicle, 2, doorState3);
        vSync.setVehicleDoorState(player.vehicle, 3, doorState4);
        vSync.setVehicleDoorState(player.vehicle, 4, doorState5);
        vSync.setVehicleDoorState(player.vehicle, 5, doorState6);
        vSync.setVehicleDoorState(player.vehicle, 6, doorState7);
        vSync.setVehicleDoorState(player.vehicle, 7, doorState8);
    }
});

mp.events.add('s:vSync:setWindowData', (player, vId, w1, w2, w3, w4) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh)) {
        vSync.setVehicleWindowState(player.vehicle, 0, w1);
        vSync.setVehicleWindowState(player.vehicle, 1, w2);
        vSync.setVehicleWindowState(player.vehicle, 2, w3);
        vSync.setVehicleWindowState(player.vehicle, 3, w4);
    }
});

mp.events.add('s:vSync:setWheelData', (player, vId, w1, w2, w3, w4, w5, w6, w7, w8, w9, w10) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh)){
        vSync.setVehicleWheelState(player.vehicle, 0, w1);
        vSync.setVehicleWheelState(player.vehicle, 1, w2);
        vSync.setVehicleWheelState(player.vehicle, 2, w3);
        vSync.setVehicleWheelState(player.vehicle, 3, w4);
        vSync.setVehicleWheelState(player.vehicle, 5, w5);
        vSync.setVehicleWheelState(player.vehicle, 6, w6);
        vSync.setVehicleWheelState(player.vehicle, 7, w7);
        vSync.setVehicleWheelState(player.vehicle, 8, w8);
        vSync.setVehicleWheelState(player.vehicle, 9, w9);
        vSync.setVehicleWheelState(player.vehicle, 10, w10);
    }
});

mp.events.add('s:vSync:setBodyHealth', (player, vId, health) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh)) {
        veh.bodyHealth = health;
    }
});

mp.events.add('s:vSync:setEngineHealth', (player, vId, health) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh)) {
        veh.engineHealth = health;
    }
});

mp.events.add('s:vSync:playSound', (player, vId, pref, value) => {
    if (mp.players.exists(player)) {
        vSync.playSound(vId, pref, value);
    }
});

mp.events.add('s:vSync:stopSound', (player, vId, pref) => {
    if (mp.players.exists(player)) {
        vSync.stopSound(vId, pref);
    }
});

mp.events.add('s:vSync:setSirenState', (player, vId, state) => {
    if (mp.players.exists(player)) {
        vSync.setSirenState(vId, state);
    }
});

mp.events.add('s:vSync:radioChange', (player, vId, state) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh)) {
        let data = vSync.getVehicleSyncData(veh);
        data.RadioState = state;
        vSync.updateVehicleSyncData(veh, data);
        //mp.players.callInRange(veh.position, streamDist, "vSync:radioChange", [veh.id, state]);
    }
});