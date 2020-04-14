//let methods = require("./arp/modules/methods.js");
import methods from '../modules/methods';
import Container from "../modules/data";

import enums from "../enums";

let vehicles = {};

let offset = enums.offsets.vehicle;

vehicles.set = function(id, key, val) {
    Container.Data.SetLocally(offset + id, key, val);
};

vehicles.reset = function(id, key) {
    Container.Data.ResetLocally(offset + id, key);
};

vehicles.get = function(id, key) {
    if (vehicles.has(id, key))
        return Container.Data.GetLocally(offset + id, key);
    return undefined;
};

vehicles.has = function(id, key) {
    return Container.Data.HasLocally(offset + id, key);
};

vehicles.getData = async function(id) {
    return await Container.Data.GetAll(offset + methods.parseInt(id));
};


vehicles.setSync = function(id, key, val) {
    Container.Data.Set(offset + id, key, val);
};

vehicles.resetSync = function(id, key) {
    Container.Data.Reset(offset + id, key);
};

vehicles.getSync = async function(id, key) {
    if (vehicles.has(id, key))
        return await Container.Data.Get(offset + id, key);
    return undefined;
};

vehicles.hasSync = async function(id, key) {
    return await Container.Data.Has(offset + id, key);
};

vehicles.setLivery = function(idx) {
    if (mp.players.local.vehicle)
        mp.events.callRemote('server:vehicle:setLivery', idx);
};

vehicles.setExtraState = function(state) {
    if (mp.players.local.vehicle)
        mp.events.callRemote('s:vSync:setExtraState', mp.players.local.vehicle.remoteId, state);
};

vehicles.setInteriorLightState = function(state) {
    if (mp.players.local.vehicle)
        mp.events.callRemote('s:vSync:setInteriorLightState', mp.players.local.vehicle.remoteId, state);
};

vehicles.setTaxiLightState = function(state) {
    if (mp.players.local.vehicle)
        mp.events.callRemote('s:vSync:setTaxiLightState', mp.players.local.vehicle.remoteId, state);
};

vehicles.setAnchorState = function(state) {
    if (mp.players.local.vehicle)
        mp.events.callRemote('s:vSync:setAnchorState', mp.players.local.vehicle.remoteId, state);
};

vehicles.setFreezeState = function(state) {
    if (mp.players.local.vehicle)
        mp.events.callRemote('s:vSync:setFreezeState', mp.players.local.vehicle.remoteId, state);
};

vehicles.setCollisionState = function(state) {
    if (mp.players.local.vehicle)
        mp.events.callRemote('s:vSync:setCollisionState', mp.players.local.vehicle.remoteId, state);
};

vehicles.setSpotLightState = function(state) {
    if (mp.players.local.vehicle)
        mp.events.callRemote('s:vSync:setSpotLightState', mp.players.local.vehicle.remoteId, state);
};

vehicles.setIndicatorLeftState = function(state) {
    if (mp.players.local.vehicle)
        mp.events.callRemote('s:vSync:setIndicatorLeftState', mp.players.local.vehicle.remoteId, state);
};

vehicles.setIndicatorRightState = function(state) {
    if (mp.players.local.vehicle)
        mp.events.callRemote('s:vSync:setIndicatorRightState', mp.players.local.vehicle.remoteId, state);
};

vehicles.setTrunkState = function(state) {
    if (mp.players.local.vehicle)
        mp.events.callRemote('s:vSync:setTrunkState', mp.players.local.vehicle.remoteId, state);
};

vehicles.setHoodState = function(state) {
    if (mp.players.local.vehicle)
        mp.events.callRemote('s:vSync:setHoodState', mp.players.local.vehicle.remoteId, state);
};

vehicles.setTrunkStateById = function(id, state) {
    mp.events.callRemote('s:vSync:setTrunkState', id, state);
};

vehicles.setHoodStateById = function(id, state) {
    mp.events.callRemote('s:vSync:setHoodState', id, state);
};

vehicles.getFuel = (veh) => {
    if (!mp.vehicles.exists(veh))
        return 0;
    return veh.getVariable('fuel');
};

vehicles.addFuel = (veh, fuel = 1) => {
    if (!mp.vehicles.exists(veh))
        return;
    mp.events.callRemote('server:vehicles:addFuel', veh.remoteId, fuel);
};

vehicles.checkerControl = function() {
    try {
        let veh = mp.players.local.vehicle;
        if (veh) {
            let vInfo = methods.getVehicleInfo(veh.model);
            if (vInfo.class_name == "Helicopters" || vInfo.class_name == "Planes" || vInfo.class_name == "Boats" || vInfo.class_name == "Motorcycles" || vInfo.class_name == "Cycles") return false;
            return veh.getRotation(0).x > 90 || veh.getRotation(0).x < -90 || veh.getRotation(0).y > 90 || veh.getRotation(0).y < -90 || veh.isInAir();
        }
    }
    catch (e) {

    }
    return false;
};

vehicles.getFuelLabel = function(id) {
    switch (id) {
        case 1:
            return 'Бензин';
        case 2:
            return 'Дизель';
        case 3:
            return 'Электричество';
        case 4:
            return 'Авиатопливо';
    }
    return 'Нет топлива';
};

vehicles.getFuelPostfix = function(id) {
    switch (id) {
        case 1:
        case 2:
        case 4:
            return 'L';
        case 3:
            return '%';
    }
    return 'Нет топлива';
};

vehicles.getSpecialModName = function(id) {
    if (id >= 100)
        id = id - 100;
    switch (id) {
        case 0:
            return 'fDriveBiasFront';
        case 1:
            return 'fInitialDriveForce';
        case 2:
            return 'fDriveInertia';
        case 3:
            return 'fBrakeForce';
        case 4:
            return 'fBrakeBiasFront';
        case 5:
            return 'fHandBrakeForce';
        case 6:
            return 'fSteeringLock';
        case 7:
            return 'fTractionCurveMax';
        case 8:
            return 'fTractionCurveMin';
    }
};

vehicles.isVehicleSirenValid = function (model) {
    let vInfo = methods.getVehicleInfo(model);
    switch (vInfo.display_name) {
        case 'Police':
        case 'Police2':
        case 'Police3':
        case 'Police4':
        case 'PoliceT':
        case 'Policeb':
        case 'FBI':
        case 'FBI2':
        case 'Sheriff':
        case 'Sheriff2':
        case 'Riot':
        case 'Riot2':
        case 'Lguard':
        case 'Pranger':
        case 'Ambulance':
        case 'FireTruck':
        case 'PoliceOld1':
        case 'PoliceOld2':
        case 'Bcfdscout':
        case 'Lsfdscout':
        case 'Lsfdscout2':
        case 'Polscout':
        case 'Polscout2':
        case 'Sherscout':
        case 'Sherscout2':
        case 'Trucara':
        case 'Umkcara':
        case 'Polvacca':
        case 'Polbullet':
        case 'Polbullet2':
        case 'Hwaybullet':
        case 'Sherbullet':
        case 'Shergauntlet':
        case 'Intcept':
        case 'Intcept2':
        case 'Intcept3':
        case 'Intcept4':
            return true;
    }
    return false;
};

vehicles.getSirenSound = function (model, state) {
    let vInfo = methods.getVehicleInfo(model);
    switch (vInfo.display_name) {
        case 'Police':
        case 'FBI2':
        case 'Sheriff':
        case 'Sheriff2':
        case 'Pranger':
        case 'Bcfdscout':
        case 'Lsfdscout':
        case 'Lsfdscout2':
        case 'Polscout':
        case 'Polscout2':
        case 'Sherscout':
        case 'Sherscout2':
        case 'Trucara':
        case 'Umkcara':
        case 'Polvacca':
        case 'Polbullet':
        case 'Polbullet2':
        case 'Hwaybullet':
        case 'Sherbullet':
        case 'Shergauntlet':
        {
            if (state == 2)
                return 'RESIDENT_VEHICLES_SIREN_WAIL_03';
            if (state == 3)
                return 'RESIDENT_VEHICLES_SIREN_QUICK_03';
            if (state == 4)
                return 'VEHICLES_HORNS_POLICE_WARNING';
            break;
        }
        case 'Police2':
        case 'Police3':
        {
            if (state == 2)
                return 'VEHICLES_HORNS_SIREN_1';
            if (state == 3)
                return 'VEHICLES_HORNS_SIREN_2';
            if (state == 4)
                return 'VEHICLES_HORNS_POLICE_WARNING';
            break;
        }
        case 'FBI':
        case 'Police4':
        case 'Lguard':
        case 'PoliceT':
        {
            if (state == 2)
                return 'RESIDENT_VEHICLES_SIREN_WAIL_02';
            if (state == 3)
                return 'RESIDENT_VEHICLES_SIREN_QUICK_02';
            if (state == 4)
                return 'VEHICLES_HORNS_POLICE_WARNING';
            break;
        }
        case 'Policeb':
        case 'Riot':
        case 'Riot2':
        case 'Ambulance':
        case 'PoliceOld1':
        case 'PoliceOld2':
        {
            if (state == 2)
                return 'RESIDENT_VEHICLES_SIREN_WAIL_01';
            if (state == 3)
                return 'RESIDENT_VEHICLES_SIREN_QUICK_01';
            if (state == 4)
                return 'VEHICLES_HORNS_POLICE_WARNING';
            break;
        }
        case 'FireTruck': {
            if (state == 2)
                return 'RESIDENT_VEHICLES_SIREN_FIRETRUCK_QUICK_01';
            if (state == 3)
                return 'RESIDENT_VEHICLES_SIREN_FIRETRUCK_QUICK_01';
            if (state == 4)
                return 'VEHICLES_HORNS_FIRETRUCK_WARNING';
            break;
        }
    }
    if (state == 2)
        return 'VEHICLES_HORNS_SIREN_1';
    if (state == 3)
        return 'VEHICLES_HORNS_SIREN_2';
    if (state == 4)
        return 'VEHICLES_HORNS_POLICE_WARNING';
    return '';
};

vehicles.getWarningSound = function (model) {
    let vInfo = methods.getVehicleInfo(model);
    switch (vInfo.display_name) {
        case 'Police':
        case 'Police2':
        case 'Police3':
        case 'Police4':
        case 'PoliceT':
        case 'Policeb':
        case 'FBI':
        case 'FBI2':
        case 'Sheriff':
        case 'Sheriff2':
        case 'Riot':
        case 'Riot2':
        case 'Lguard':
        case 'Pranger':
        case 'Ambulance':
        case 'PoliceOld1':
        case 'PoliceOld2':
            return 'SIRENS_AIRHORN';
        case 'FireTruck':
            return 'VEHICLES_HORNS_FIRETRUCK_WARNING';
    }
    return 'SIRENS_AIRHORN';
};

vehicles.getSpeedBoost = (model) => {
    return methods.parseInt(methods.getVehicleInfo(model).sb);
};

vehicles.getSpeedMax = (model) => {
    let max = methods.getVehicleInfo(model).sm;
    if (max > 0)
        return max;
    return methods.parseInt(mp.game.vehicle.getVehicleModelMaxSpeed(model) * 3.6);
};

vehicles.setHandling = (vehicle) => {
    try {
        switch (vehicle.model) {
            case mp.game.joaat('bcfdscout'):
            case mp.game.joaat('lsfdscout'):
            case mp.game.joaat('lsfdscout2'):
            case mp.game.joaat('polscout'):
            case mp.game.joaat('polscout2'):
            case mp.game.joaat('sherscout'):
            case mp.game.joaat('sherscout2'):
                vehicle.setHandling('fSteeringLock', '0.7');
                vehicle.setHandling('fBrakeForce','1.8');
                vehicle.setHandling('fTractionCurveMax', '3.0');
                vehicle.setHandling('fTractionCurveMin', '2.7');
                break;
            case mp.game.joaat('intcept'):
            case mp.game.joaat('intcept1'):
            case mp.game.joaat('intcept2'):
            case mp.game.joaat('intcept3'):
                vehicle.setHandling('fBrakeForce','1.15');
                vehicle.setHandling('fTractionCurveMax', '3.0');
                vehicle.setHandling('fTractionCurveMin', '2.7');
                vehicle.setHandling('fDriveInertia', '1.0');
                break;
            case mp.game.joaat('scout'):
                vehicle.setHandling('fSteeringLock', '0.7');
                vehicle.setHandling('fBrakeForce','1.15');
                vehicle.setHandling('fTractionCurveMax', '2.7');
                vehicle.setHandling('fTractionCurveMin', '2.4');
                break;
            case mp.game.joaat('trucara'):
                vehicle.setHandling('fTractionCurveMax', '2.8');
                vehicle.setHandling('fTractionCurveMin', '2.5');
                vehicle.setHandling('fBrakeForce','1.3');
                break;
            case mp.game.joaat('umkcara'):
                vehicle.setHandling('fTractionCurveMax', '2.8');
                vehicle.setHandling('fTractionCurveMin', '2.5');
                vehicle.setHandling('fBrakeForce','1.3');
                vehicle.setHandling('fTractionCurveLateral','16.6');
                break;
            case mp.game.joaat('shergauntlet'):
            case mp.game.joaat('polvacca'):
            case mp.game.joaat('polbullet'):
            case mp.game.joaat('polbullet2'):
            case mp.game.joaat('sherbullet'):
            case mp.game.joaat('sherbullet2'):
                vehicle.setHandling('fBrakeForce','1.4');
                break;
        }
    }
    catch (e) {

    }
};

vehicles.spawnJobCar = (x, y, z, heading, name, job) => {
    mp.game.ui.notifications.show('~r~Подсказка!\n~g~Чтобы начать работу, нажмите ~s~M - Транспорт - Начать задание\n\nНажмите ~g~L~s~ чтобы открыть или закрыть ТС');
    mp.events.callRemote('server:vehicles:spawnJobCar', x, y, z, heading, name, job);
};

vehicles.spawnLamarCar = (x, y, z, heading, name) => {
    mp.game.ui.notifications.show('Нажмите ~g~L~s~ чтобы открыть или закрыть ТС');
    mp.events.callRemote('server:vehicles:spawnLamarCar', x, y, z, heading, name);
};

vehicles.destroy = () => {
    mp.events.callRemote('server:vehicles:destroy');
};

vehicles.findVehicleByNumber = (number) => {
    methods.debug('vehicles.findVehicleByNumber');
    let returnVehicle = null;
    try {
        mp.vehicles.forEach((vehicle) => {
            try {
                if (!vehicles.exists(vehicle))
                    return;
                if (vehicle.numberPlate.trim() == number.trim())
                    returnVehicle = vehicle;
            }
            catch (e) {
                methods.debug(e);
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
    return returnVehicle;
};

vehicles.engineVehicle = function() {
    if (mp.players.local.vehicle) {
        let vInfo = methods.getVehicleInfo(mp.players.local.vehicle.model);
        if (vInfo.class_name != 'Cycles')
            mp.events.callRemote('server:vehicle:engineStatus');
    }
};

export default vehicles;