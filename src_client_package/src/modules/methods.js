"use strict";

let methods = {};

import Menu from "./menu";
import enums from "../enums";

//mp.game.invoke('0xBF0FD6E56C964FCB', mp.players.local.handle, mp.game.joaat('weapon_pistol'), 100, true, false);

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
methods.SET_INTERIOR_PROP_COLOR = '0xC1F1920BAF281317';
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

methods.sleep = function(ms) {
    return new Promise(res => setTimeout(res, ms));
};

methods.debug = function (message, ...args) {
    try {
        mp.events.callRemote('server:clientDebug', `${message} | ${JSON.stringify(args)} | ${args.length}`)
    } catch (e) {
    }
};

methods.getVehicleInfo = function (model) {
    let vehInfo = enums.get('vehicleInfo');
    for (let item in vehInfo) {
        let vItem = vehInfo[item];
        if (vItem.hash == model || vItem.display_name == model || mp.game.joaat(vItem.display_name.toString().toLowerCase()) == model)
            return vItem;
    }

    if (vehInfo.length < 500) {
        enums.resetVehicleInfo();
        mp.events.callRemote('server:updateVehicleInfo');
    }
    return {id: 0, hash: model, display_name: 'Unknown', class_name: 'Unknown', stock: 378000, stock_full: 205000, fuel_full: 75, fuel_min: 8};
};

methods.parseInt = function (str) {
    return parseInt(str) || 0;
};

methods.parseFloat = function (str) {
    return parseFloat(str) || 0;
};

methods.getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

methods.getRandomFloat = function () {
    return methods.getRandomInt(0, 10000) / 10000;
};

methods.getRandomBankCard = function (prefix = 0) {
    if (prefix == 0)
        prefix = methods.getRandomInt(1000, 9999);

    let num1 = methods.getRandomInt(1000, 9999);
    let num2 = methods.getRandomInt(1000, 9999);
    let num3 = methods.getRandomInt(1000, 9999);

    return methods.parseInt(`${prefix}${num1}${num2}${num3}`);
};

methods.unixTimeStampToDateTime = function (timestamp) {
    let dateTime = new Date(timestamp * 1000);
    return `${methods.digitFormat(dateTime.getDate())}/${methods.digitFormat(dateTime.getMonth()+1)}/${dateTime.getFullYear()} ${methods.digitFormat(dateTime.getHours())}:${methods.digitFormat(dateTime.getMinutes())}`
};

methods.unixTimeStampToDateTimeShort = function (timestamp) {
    let dateTime = new Date(timestamp * 1000);
    return `${methods.digitFormat(dateTime.getDate())}/${methods.digitFormat(dateTime.getMonth()+1)} ${methods.digitFormat(dateTime.getHours())}:${methods.digitFormat(dateTime.getMinutes())}`
};

methods.unixTimeStampToDate = function (timestamp) {
    let dateTime = new Date(timestamp * 1000);
    return `${methods.digitFormat(dateTime.getDate())}/${methods.digitFormat(dateTime.getMonth()+1)}/${dateTime.getFullYear()}`
};

methods.disableAllControls = function(disable) {
    mp.events.call('modules:client:player:DisableAllControls', disable); //TODO
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

methods.isBlockKeys = function() {
    return Menu.Menu.IsShowInput() /*|| user.isCuff() || user.isTie() || user.isDead()*/;
};

methods.distanceToPos = function (v1, v2) {
    return Math.abs(Math.sqrt(Math.pow((v2.x - v1.x),2) +
        Math.pow((v2.y - v1.y),2)+
        Math.pow((v2.z - v1.z),2)));
};

methods.distanceToPos2D = function (v1, v2) {
    return Math.abs(Math.sqrt(Math.pow((v2.x - v1.x),2) +
        Math.pow((v2.y - v1.y),2)));
};

methods.saveLog = function(file, log){

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

methods.digitFormat = function(number) {
    return ("0" + number).slice(-2);
};

methods.numberFormat = function (currentMoney) {
    return currentMoney.toString().replace(/.+?(?=\D|$)/, function(f) {
        return f.replace(/(\d)(?=(?:\d\d\d)+$)/g, "$1,");
    });
};

methods.moneyFormat = function (currentMoney) {
    currentMoney = methods.parseFloat(currentMoney);
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(currentMoney.toFixed(2));
};

methods.bankFormat = function (currentMoney) {
    return currentMoney.toString().replace(/.+?(?=\D|$)/, function(f) {
        return f.replace(/(\d)(?=(?:\d\d\d\d)+$)/g, "$1 ");
    });
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

methods.setIplPropState = function (interiorId, prop, state = true) {
    if (state)
        mp.game.interior.enableInteriorProp(interiorId, prop);
    else
        mp.game.interior.disableInteriorProp(interiorId, prop);
};

methods.iplMichaelDefault = function () {
    let interiorId = 166657;
    let garageId = 166401;

    methods.setIplPropState(interiorId, "V_Michael_bed_tidy");
    methods.setIplPropState(interiorId, "V_Michael_bed_Messy");
    methods.setIplPropState(interiorId, "Michael_premier", false);
    methods.setIplPropState(interiorId, "V_Michael_FameShame", false);
    methods.setIplPropState(interiorId, "V_Michael_plane_ticket", false);
    methods.setIplPropState(interiorId, "V_Michael_JewelHeist", false);
    methods.setIplPropState(interiorId, "burgershot_yoga", false);
    mp.game.interior.refreshInterior(interiorId);

    methods.setIplPropState(garageId, "V_Michael_Scuba", false);
    mp.game.interior.refreshInterior(garageId);
};

methods.iplSimonDefault = function () {
    let interiorId = 7170;
    mp.game.streaming.requestIpl("shr_int");
    methods.setIplPropState(interiorId, "csr_beforeMission");
    methods.setIplPropState(interiorId, "shutter_open");
    mp.game.interior.refreshInterior(interiorId);
};

methods.iplFranklinAuntDefault = function () {
    let interiorId = 197889;
    methods.setIplPropState(interiorId, "");
    methods.setIplPropState(interiorId, "V_57_GangBandana", false);
    methods.setIplPropState(interiorId, "V_57_Safari", false);
    mp.game.interior.refreshInterior(interiorId);
};

methods.iplFranklinDefault = function () {
    let interiorId = 206849;
    methods.setIplPropState(interiorId, "");
    methods.setIplPropState(interiorId, "unlocked");
    methods.setIplPropState(interiorId, "progress_flyer", false);
    methods.setIplPropState(interiorId, "progress_tux", false);
    methods.setIplPropState(interiorId, "progress_tshirt", false);
    methods.setIplPropState(interiorId, "bong_and_wine", true);
    mp.game.interior.refreshInterior(interiorId);
};

methods.iplFloydDefault = function () {
    let interiorId = 171777;
    methods.setIplPropState(interiorId, "swap_clean_apt");
    methods.setIplPropState(interiorId, "swap_mrJam_A");
    mp.game.interior.refreshInterior(interiorId);
};

methods.iplTrevorDefault = function () {
    let interiorId = 2562;
    mp.game.streaming.requestIpl("trevorstrailertidy");
    methods.setIplPropState(interiorId, "V_26_Trevor_Helmet3", false);
    methods.setIplPropState(interiorId, "V_24_Trevor_Briefcase3", false);
    methods.setIplPropState(interiorId, "V_26_Michael_Stay3", false);
    mp.game.interior.refreshInterior(interiorId);
};

methods.iplAmmoDefault = function () {

    let ammunationsId = [
        140289,			//249.8, -47.1, 70.0
        153857,			//844.0, -1031.5, 28.2
        168193, 		//-664.0, -939.2, 21.8
        164609,			//-1308.7, -391.5, 36.7
        176385,			//-3170.0, 1085.0, 20.8
        175617,			//-1116.0, 2694.1, 18.6
        200961,			//1695.2, 3756.0, 34.7
        180481,			//-328.7, 6079.0, 31.5
        178689			//2569.8, 297.8, 108.7
    ];
    let gunclubsId = [
        137729,			//19.1, -1110.0, 29.8
        248065			//811.0, -2152.0, 29.6
    ];

    ammunationsId.forEach( interiorId => {
        methods.setIplPropState(interiorId, "GunStoreHooks");
        methods.setIplPropState(interiorId, "GunClubWallHooks");
        mp.game.interior.refreshInterior(interiorId);
    });

    gunclubsId.forEach( interiorId => {
        methods.setIplPropState(interiorId, "GunStoreHooks");
        methods.setIplPropState(interiorId, "GunClubWallHooks");
        mp.game.interior.refreshInterior(interiorId);
    });
};

methods.iplLesterFactoryDefault = function () {
    let interiorId = 92674;
    methods.setIplPropState(interiorId, "V_53_Agency_Blueprint", false);
    methods.setIplPropState(interiorId, "V_35_KitBag", false);
    methods.setIplPropState(interiorId, "V_35_Fireman", false);
    methods.setIplPropState(interiorId, "V_35_Body_Armour", false);
    methods.setIplPropState(interiorId, "Jewel_Gasmasks", false);
    methods.setIplPropState(interiorId, "v_53_agency_overalls", false);
    mp.game.interior.refreshInterior(interiorId);
};

methods.iplStripClubDefault = function () {
    let interiorId = 197121;
    methods.setIplPropState(interiorId, "V_19_Trevor_Mess", false);
    mp.game.interior.refreshInterior(interiorId);
};

methods.requestIpls = function () {
    //mp.game.streaming.requestIpl("RC12B_HospitalInterior");

    //Michael: -802.311, 175.056, 72.8446
    methods.iplMichaelDefault();
    //Simeon: -47.16170 -1115.3327 26.5
    methods.iplSimonDefault();
    //Franklin's aunt: -9.96562, -1438.54, 31.1015
    methods.iplFranklinAuntDefault();
    //Franklin
    methods.iplFranklinDefault();
    //Floyd: -1150.703, -1520.713, 10.633
    methods.iplFloydDefault();
    //Trevor: 1985.48132, 3828.76757, 32.5
    methods.iplTrevorDefault();
    methods.iplAmmoDefault();
    methods.iplLesterFactoryDefault();
    methods.iplStripClubDefault();

    //CASINO
    mp.game.streaming.requestIpl("vw_casino_main");

    let cIntID = mp.game.interior.getInteriorAtCoords(1100.000, 220.000, -50.0);
    mp.game.interior.enableInteriorProp(cIntID, 'casino_manager_﻿default﻿﻿﻿');
    mp.game.invoke(methods.SET_INTERIOR_PROP_COLOR, cIntID, 'casino_manager_﻿default﻿﻿﻿', 1);
    mp.game.interior.refreshInterior(cIntID);

    mp.game.streaming.requestIpl("hei_dlc_windows_casino");
    mp.game.streaming.requestIpl("hei_dlc_casino_aircon");
    mp.game.streaming.requestIpl("vw_dlc_casino_door");
    mp.game.streaming.requestIpl("hei_dlc_casino_door");
    mp.game.streaming.requestIpl("hei_dlc_windows_casino﻿");
    mp.game.streaming.requestIpl("vw_casino_penthouse");
    mp.game.streaming.requestIpl("vw_casino_garage");

    let phIntID = mp.game.interior.getInteriorAtCoords(976.636, 70.295, 115.164);
    let phPropList = [
        "Set_Pent_Tint_Shell",
        "Set_Pent_Pattern_01",
        "Set_Pent_Spa_Bar_Open",
        "Set_Pent_Media_Bar_Open",
        "Set_Pent_Dealer",
        "Set_Pent_Arcade_Retro",
        "Set_Pent_Bar_Clutter",
        "Set_Pent_Clutter_01",
        "set_pent_bar_light_01",
        "set_pent_bar_party_0"
    ];

    for (const propName of phPropList) {
        mp.game.interior.enableInteriorProp(phIntID, propName);
        mp.game.invoke(methods.SET_INTERIOR_PROP_COLOR, phIntID, propName, 1);
    }

    mp.game.interior.refreshInterior(phIntID);

    //---

    mp.game.streaming.requestIpl("imp_dt1_02_modgarage");

    //Heist Jewel: -637.20159 -239.16250 38.1
    mp.game.streaming.requestIpl("post_hiest_unload");

    //Max Renda: -585.8247, -282.72, 35.45475  Работу можно намутить
    mp.game.streaming.requestIpl("refit_unload");

    //Heist Union Depository: 2.69689322, -667.0166, 16.1306286
    mp.game.streaming.requestIpl("FINBANK");

    //Morgue: 239.75195, -1360.64965, 39.53437
    mp.game.streaming.requestIpl("Coroner_Int_on");

    //1861.28, 2402.11, 58.53
    mp.game.streaming.requestIpl("ch3_rd2_bishopschickengraffiti");
    //2697.32, 3162.18, 58.1
    mp.game.streaming.requestIpl("cs5_04_mazebillboardgraffiti");
    //2119.12, 3058.21, 53.25
    mp.game.streaming.requestIpl("cs5_roads_ronoilgraffiti");

    //Cluckin Bell: -146.3837, 6161.5, 30.2062
    mp.game.streaming.requestIpl("CS1_02_cf_onmission1");
    mp.game.streaming.requestIpl("CS1_02_cf_onmission2");
    mp.game.streaming.requestIpl("CS1_02_cf_onmission3");
    mp.game.streaming.requestIpl("CS1_02_cf_onmission4");

    //Grapeseed's farm: 2447.9, 4973.4, 47.7
    mp.game.streaming.requestIpl("farm");
    mp.game.streaming.requestIpl("farmint");
    mp.game.streaming.requestIpl("farm_lod");
    mp.game.streaming.requestIpl("farm_props");
    mp.game.streaming.requestIpl("des_farmhouse");

    //FIB lobby: 105.4557, -745.4835, 44.7548
    mp.game.streaming.requestIpl("FIBlobby");
    mp.game.streaming.requestIpl("dt1_05_fib2_normal");

    mp.game.streaming.removeIpl("hei_bi_hw1_13_door");
    mp.game.streaming.requestIpl("hei_hw1_blimp_interior_v_comedy_milo_");
    mp.game.streaming.requestIpl("apa_ss1_11_interior_v_rockclub_milo_");
    mp.game.streaming.requestIpl("ferris_finale_Anim");
    mp.game.streaming.requestIpl("gr_case6_bunkerclosed");

    //Billboard: iFruit
    mp.game.streaming.requestIpl("FruitBB");
    mp.game.streaming.requestIpl("sc1_01_newbill");
    mp.game.streaming.requestIpl("hw1_02_newbill");
    mp.game.streaming.requestIpl("hw1_emissive_newbill");
    mp.game.streaming.requestIpl("sc1_14_newbill");
    mp.game.streaming.requestIpl("dt1_17_newbill");

    //Lester's factory: 716.84, -962.05, 31.59
    mp.game.streaming.requestIpl("id2_14_during_door");
    mp.game.streaming.requestIpl("id2_14_during1");

    //Life Invader lobby: -1047.9, -233.0, 39.0
    mp.game.streaming.requestIpl("facelobby");

    //Авианосец
    mp.game.streaming.requestIpl("hei_carrier");
    mp.game.streaming.requestIpl("hei_carrier_distantlights");
    mp.game.streaming.requestIpl("hei_carrier_int1");
    mp.game.streaming.requestIpl("hei_carrier_int1_lod");
    mp.game.streaming.requestIpl("hei_carrier_int2");
    mp.game.streaming.requestIpl("hei_carrier_int2_lod");
    mp.game.streaming.requestIpl("hei_carrier_int3");
    mp.game.streaming.requestIpl("hei_carrier_int3_lod");
    mp.game.streaming.requestIpl("hei_carrier_int4");
    mp.game.streaming.requestIpl("hei_carrier_int4_lod");
    mp.game.streaming.requestIpl("hei_carrier_int5");
    mp.game.streaming.requestIpl("hei_carrier_int5_lod");
    mp.game.streaming.requestIpl("hei_carrier_int6");
    mp.game.streaming.requestIpl("hei_carrier_lod");
    mp.game.streaming.requestIpl("hei_carrier_lodlights");
    mp.game.streaming.requestIpl("hei_carrier_slod");

    //Яхта
    mp.game.streaming.requestIpl("hei_yacht_heist");
    mp.game.streaming.requestIpl("hei_yacht_heist_enginrm");
    mp.game.streaming.requestIpl("hei_yacht_heist_Lounge");
    mp.game.streaming.requestIpl("hei_yacht_heist_Bridge");
    mp.game.streaming.requestIpl("hei_yacht_heist_Bar");
    mp.game.streaming.requestIpl("hei_yacht_heist_Bedrm");
    mp.game.streaming.requestIpl("hei_yacht_heist_DistantLights");
    mp.game.streaming.requestIpl("hei_yacht_heist_LODLights");

    //Яхта2
    mp.game.streaming.requestIpl("gr_heist_yacht2");
    mp.game.streaming.requestIpl("gr_heist_yacht2_bar");
    mp.game.streaming.requestIpl("gr_heist_yacht2_bedrm");
    mp.game.streaming.requestIpl("gr_heist_yacht2_bridge");
    mp.game.streaming.requestIpl("gr_heist_yacht2_enginrm");
    mp.game.streaming.requestIpl("gr_heist_yacht2_lounge");
    mp.game.streaming.requestIpl("gr_grdlc_interior_placement_interior_0_grdlc_int_01_milo_");

    //Tunnels
    mp.game.streaming.requestIpl("v_tunnel_hole");

    //Carwash: 55.7, -1391.3, 30.5
    mp.game.streaming.requestIpl("Carwash_with_spinners");

    //Stadium "Fame or Shame": -248.49159240722656, -2010.509033203125, 34.57429885864258
    mp.game.streaming.requestIpl("sp1_10_real_interior");
    mp.game.streaming.requestIpl("sp1_10_real_interior_lod");

    //House in Banham Canyon: -3086.428, 339.2523, 6.3717
    mp.game.streaming.requestIpl("ch1_02_open");

    //Garage in La Mesa (autoshop): 970.27453, -1826.56982, 31.11477
    mp.game.streaming.requestIpl("bkr_bi_id1_23_door");

    //Hill Valley church - Grave: -282.46380000, 2835.84500000, 55.91446000
    mp.game.streaming.requestIpl("lr_cs6_08_grave_closed");

    //Lost's trailer park: 49.49379000, 3744.47200000, 46.38629000
    mp.game.streaming.requestIpl("methtrailer_grp1");

    //Lost safehouse: 984.1552, -95.3662, 74.50
    mp.game.streaming.requestIpl("bkr_bi_hw1_13_int");

    //Raton Canyon river: -1652.83, 4445.28, 2.52
    mp.game.streaming.requestIpl("CanyonRvrShallow");

    //Zancudo Gates (GTAO like): -1600.30100000, 2806.73100000, 18.79683000
    mp.game.streaming.requestIpl("CS3_07_MPGates");

    //Pillbox hospital:
    mp.game.streaming.removeIpl("rc12b_default");

    mp.game.streaming.requestIpl("gabz_pillbox_milo_");
    let hospIntId = mp.game.interior.getInteriorAtCoords(311.2546, -592.4204, 42.32737);
    let hospPropList = [
        "rc12b_fixed",
        "rc12b_destroyed",
        "rc12b_default",
        "rc12b_hospitalinterior_lod",
        "rc12b_hospitalinterior"
    ];

    for (const propName of hospPropList) {
        mp.game.interior.enableInteriorProp(hospIntId, propName);
        mp.game.invoke(methods.SET_INTERIOR_PROP_COLOR, hospIntId, propName, 1);
    }

    mp.game.interior.refreshInterior(hospIntId);

    //mp.game.streaming.removeIpl("rc12b_default");
    //mp.game.streaming.requestIpl("rc12b_hospitalinterior");


    //Josh's house: -1117.1632080078, 303.090698, 66.52217
    mp.game.streaming.requestIpl("bh1_47_joshhse_unburnt");
    mp.game.streaming.requestIpl("bh1_47_joshhse_unburnt_lod");

    mp.game.streaming.removeIpl("sunkcargoship");
    mp.game.streaming.requestIpl("cargoship");

    mp.game.streaming.requestIpl("ex_sm_13_office_02b"); //АШ

    //mp.game.streaming.requestIpl("ex_dt1_02_office_02a"); // Бизнес Центр - old ex_dt1_02_office_03a

    mp.game.streaming.requestIpl("ex_dt1_02_office_02b");

    mp.game.streaming.requestIpl("ex_sm_15_office_01a"); // Meria - old ex_dt1_02_office_03a

    mp.game.streaming.requestIpl("ex_dt1_11_office_01b"); //Maze Bank Office

    //Bahama Mamas: -1388.0013, -618.41967, 30.819599
    mp.game.streaming.requestIpl("hei_sm_16_interior_v_bahama_milo_");

    mp.game.streaming.requestIpl("apa_v_mp_h_01_a");
    mp.game.streaming.requestIpl("apa_v_mp_h_02_b");
    mp.game.streaming.requestIpl("apa_v_mp_h_08_c");

    mp.game.streaming.requestIpl("hei_hw1_blimp_interior_v_studio_lo_milo_");
    mp.game.streaming.requestIpl("hei_hw1_blimp_interior_v_apart_midspaz_milo_");
    mp.game.streaming.requestIpl("hei_hw1_blimp_interior_32_dlc_apart_high2_new_milo_");
    mp.game.streaming.requestIpl("hei_hw1_blimp_interior_10_dlc_apart_high_new_milo_");
    mp.game.streaming.requestIpl("hei_hw1_blimp_interior_28_dlc_apart_high2_new_milo_");
    mp.game.streaming.requestIpl("hei_hw1_blimp_interior_27_dlc_apart_high_new_milo_");
    mp.game.streaming.requestIpl("hei_hw1_blimp_interior_29_dlc_apart_high2_new_milo_");
    mp.game.streaming.requestIpl("hei_hw1_blimp_interior_30_dlc_apart_high2_new_milo_");
    mp.game.streaming.requestIpl("hei_hw1_blimp_interior_31_dlc_apart_high2_new_milo_");
    mp.game.streaming.requestIpl("apa_ch2_05e_interior_0_v_mp_stilts_b_milo_");
    mp.game.streaming.requestIpl("apa_ch2_04_interior_0_v_mp_stilts_b_milo_");
    mp.game.streaming.requestIpl("apa_ch2_04_interior_1_v_mp_stilts_a_milo_");
    mp.game.streaming.requestIpl("apa_ch2_09c_interior_2_v_mp_stilts_b_milo_");
    mp.game.streaming.requestIpl("apa_ch2_09b_interior_1_v_mp_stilts_b_milo_");
    mp.game.streaming.requestIpl("apa_ch2_09b_interior_0_v_mp_stilts_a_milo_");
    mp.game.streaming.requestIpl("apa_ch2_05c_interior_1_v_mp_stilts_a_milo_");
    mp.game.streaming.requestIpl("apa_ch2_12b_interior_0_v_mp_stilts_a_milo_");

    //Galaxy
    mp.game.interior.enableInteriorProp(271617, "Int01_ba_clubname_01");
    mp.game.interior.enableInteriorProp(271617, "Int01_ba_Style02");
    mp.game.interior.enableInteriorProp(271617, "Int01_ba_style02_podium");
    mp.game.interior.enableInteriorProp(271617, "Int01_ba_equipment_setup");
    mp.game.interior.enableInteriorProp(271617, "Int01_ba_equipment_upgrade");
    mp.game.interior.enableInteriorProp(271617, "Int01_ba_security_upgrade");
    mp.game.interior.enableInteriorProp(271617, "Int01_ba_dj01");
    mp.game.interior.enableInteriorProp(271617, "DJ_03_Lights_02");
    mp.game.interior.enableInteriorProp(271617, "DJ_04_Lights_01");
    mp.game.interior.enableInteriorProp(271617, "DJ_03_Lights_03");
    mp.game.interior.enableInteriorProp(271617, "DJ_04_Lights_04");
    mp.game.interior.enableInteriorProp(271617, "Int01_ba_bar_content");
    mp.game.interior.enableInteriorProp(271617, "Int01_ba_booze_01");
    mp.game.interior.enableInteriorProp(271617, "Int01_ba_dry_ice");
    mp.game.interior.refreshInterior(271617);
};

methods.isPlayerInOcean = function() {
    let pos = mp.players.local.position;
    return (mp.game.zone.getNameOfZone(pos.x, pos.y, pos.z) === "OCEANA");
};

methods.notifyWithPictureToAll = function (title, sender, message, notifPic, icon = 0, flashing = false, textColor = -1, bgColor = -1, flashColor = [77, 77, 77, 200]) {
    mp.events.callRemote('server:players:notifyWithPictureToAll', title, sender, message, notifPic, icon, flashing, textColor, bgColor, flashColor);
};

methods.notifyWithPictureToFraction = function (title, sender, message, notifPic, fractionId = 0, icon = 0, flashing = false, textColor = -1, bgColor = -1, flashColor = [77, 77, 77, 200]) {
    mp.events.callRemote('server:players:notifyWithPictureToFraction', title, sender, message, notifPic, fractionId, icon, flashing, textColor, bgColor, flashColor);
};

methods.notifyWithPictureToFraction2 = function (title, sender, message, notifPic, fractionId = 0, icon = 0, flashing = false, textColor = -1, bgColor = -1, flashColor = [77, 77, 77, 200]) {
    mp.events.callRemote('server:players:notifyWithPictureToFraction2', title, sender, message, notifPic, fractionId, icon, flashing, textColor, bgColor, flashColor);
};

methods.notifyToFraction = function (message, fractionId = 0) {
    mp.events.callRemote('server:players:notifyToFraction', message, fractionId);
};

methods.notifyToAll = function (message) {
    mp.events.callRemote('server:players:notifyToAll', message);
};

methods.isInPoint = function (p1, p2, p3, p4, p5) {
    return Math.min(p1.x, p2.x) < p5.x && Math.max(p3.x, p4.x) > p5.x && Math.min(p1.y, p4.y) < p5.y && Math.max(p2.y, p3.y) > p5.y;
};

export default methods;