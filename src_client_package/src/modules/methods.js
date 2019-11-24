"use strict";

let methods = {};

methods.GIVE_WEAPON_TO_PED = '0xBF0FD6E56C964FCB';
methods.REMOVE_WEAPON_FROM_PED = '0x4899CB088EDF59B8';
methods.HAS_PED_GOT_WEAPON = '0x8DECB02F88F428BC';
methods.GET_AMMO_IN_PED_WEAPON = '0x015A522136D7F951';
methods.GET_PED_AMMO_TYPE_FROM_WEAPON = '0x7FEAD38B326B9F74';
methods.ADD_AMMO_TO_PED = '0x78F0424C34306220';
methods.SET_PED_AMMO = '0x14E56BC5B5DB6A19';
methods.IS_WAYPOINT_ACTIVE = '0x1DD1F58F493F1DA5';
methods.SET_ENABLE_HANDCUFFS = '0xDF1AF8B5D56542FA';
methods.TASK_GO_TO_ENTITY = '0x6A071245EB0D1882';
methods.SET_PED_KEEP_TASK = '0x971D38760FBC02EF';
methods.TASK_ENTER_VEHICLE = '0xC20E50AA46D09CA8';
methods.FREEZE_ENTITY_POSITION = '0x428CA6DBD1094446';
methods.SET_INTERIOR_PROP_COLOR = '0x8D8338B92AD18ED6';
methods.DISABLE_VEHICLE_IMPACT_EXPLOSION_ACTIVATION = '0xD8050E0EB60CF274';
methods.SET_RADIO_TO_STATION_INDEX = '0xA619B168B8A8570F';
methods.SET_FRONTEND_RADIO_ACTIVE = '0xF7F26C6E9CC9EBB8';
methods.GET_PLAYER_RADIO_STATION_INDEX = '0xE8AF77C4C06ADC93';
methods.PLAY_SOUND_FROM_ENTITY = '0xE65F427EB70AB1ED';
methods.GET_SOUND_ID = '0x430386FE9BF80B45';
methods.STOP_ALL_SCREEN_EFFECTS = '0xB4EDDC19532BFB85';
methods.SET_ENTITY_COORDS_NO_OFFSET = '0x239A3351AC1DA385';
methods.SET_PED_CAN_BE_TARGETTED = '0x63F58F7C80513AAD';
methods.SET_PED_CAN_BE_TARGETTED_BY_PLAYER = '0x66B57B72E0836A76';
methods.SET_BLOCKING_OF_NON_TEMPORARY_EVENTS = '0x9F8AA94D6D97DBF4';
methods.TASK_SET_BLOCKING_OF_NON_TEMPORARY_EVENTS = '0x90D2156198831D69';
methods.SET_ENTITY_INVINCIBLE = '0x3882114BDE571AD4';
methods.SET_PED_CAN_RAGDOLL = '0xB128377056A54E2A';
methods.SET_PED_CAN_EVASIVE_DIVE = '0x6B7A646C242A7059';
methods.SET_PED_GET_OUT_UPSIDE_DOWN_VEHICLE = '0xBC0ED94165A48BC2';
methods.SET_PED_AS_ENEMY = '0x02A0C9720B854BFA';
methods.SET_CAN_ATTACK_FRIENDLY = '0xB3B1CB349FF9C75D';
methods.SET_PED_DEFAULT_COMPONENT_VARIATION = '0x45EEE61580806D63';
methods.TASK_START_SCENARIO_IN_PLACE = '0x142A02425FF02BD9';
methods.TASK_PLAY_ANIM = '0xEA47FE3719165B94';
methods.DELETE_ENTITY = '0xAE3CBE5BF394C9C9';
methods.DELETE_PED = '0x9614299DCB53E54B';
methods.PLAY_AMBIENT_SPEECH1 = '0x8E04FEDD28D42462';
methods.SET_ENTITY_AS_NO_LONGER_NEEDED = '0xB736A491E64A32CF';
methods.SET_PED_AS_NO_LONGER_NEEDED = '0xB736A491E64A32CF';
methods.SET_MODEL_AS_NO_LONGER_NEEDED = '0xE532F5D78798DAAB';
methods.SET_ENTITY_AS_MISSION_ENTITY = '0xAD738C3085FE7E11';
methods.SET_VEHICLE_MOD = '0x6AF0636DDEDCB6DD';
methods.SET_VEHICLE_UNDRIVEABLE = '0x8ABA6AF54B942B95';

const streamedPlayers = new Set();

mp.events.add({
    'entityStreamIn': (entity) => {
        if (entity.type === 'player') {
            streamedPlayers.add(entity);
        }
    },
    'entityStreamOut': (entity) => {
        if (entity.type === 'player') {
            streamedPlayers.delete(entity);
        }
    }
});

methods.debug = function (message) {
    try {
        mp.events.callRemote('server:clientDebug', `${message}`)
    } catch (e) {
    }
};

methods.parseInt = function (str) {
    return parseInt(str) || 0;
};

methods.isValidJSON = function(value){
    try{
        JSON.parse(value);
        return true;
    }
    catch (error){
        methods.debug(`Invalid JSON string\n${error}`);
        return false;
    }
};

methods.getWaypointPosition = function () {
    let pos = new mp.Vector3(0, 0, 0);
    if (mp.game.invoke('0x1DD1F58F493F1DA5')) {
        let blipInfoIdIterator = mp.game.invoke('0x186E5D252FA50E7D');
        for (let index = mp.game.invoke('0x1BEDE233E6CD2A1F', blipInfoIdIterator); mp.game.invoke('0xA6DB27D19ECBB7DA', index); index = mp.game.invoke('0x14F96AA50D6FBEA7', blipInfoIdIterator))
            if (mp.game.invoke('0xBE9B0959FFD0779B', index) == 4)
                pos = mp.game.ui.getBlipInfoIdCoord(index);
    }
    return pos;
};

methods.numerToK = function (num) {
    return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
};

methods.getCurrentSpeed = function () {
    const player = mp.players.local;
    let speed = 0;
    if (player.isSittingInAnyVehicle()) {
        let velocity = player.vehicle.getVelocity();
        speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y + velocity.z * velocity.z);
        //speed = Math.round(speed * 2.23693629);
        speed = Math.round(speed * 3.6);
    }
    return speed;
};

export default methods;