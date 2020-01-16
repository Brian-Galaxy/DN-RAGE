"use strict";

import methods from "./methods";
import user from "../user";
import voice from "../voice";

import weather from "../manager/weather";
import vehicles from "../property/vehicles";

let ui = {};
let uiBrowser = null;

let _zone = 'Подключение к сети GPS';
let _street = '...';

ui.ColorTransparent = [0,0,0,0];
ui.ColorRed = [244,67,54,255];
ui.ColorRed900 = [183,28,28,255];
ui.ColorWhite = [255,255,255,255];
ui.ColorBlue = [33,150,243,255];
ui.ColorGreen = [76,175,80,255];
ui.ColorAmber = [255,193,7];
ui.ColorDeepOrange = [255,87,34,255];

ui.MarkerRed = [244, 67, 54, 100];
ui.MarkerGreen = [139, 195, 74, 100];
ui.MarkerBlue = [33, 150, 243, 100];
ui.MarkerOrange = [255, 152, 0, 100];
ui.MarkerYellow = [255, 235, 59, 100];
ui.MarkerBlue100 = [187, 222, 251, 100];
ui.MarkerWhite = [255, 255, 255, 100];

ui.DisableMouseControl = false;

let showRadar = true;
let showHud = true;
let showMenu = false;

ui.create = function() {
    uiBrowser = mp.browsers.new("package://cef/index.html");
    //ui.callCef('authMain','{"type": "show"}');
};

ui.notify = function(text) {
    ui.callCef('notify','{"text": "' + text + '"}');
};

ui.hideHud = function() {
    mp.game.ui.displayRadar(false);
    if (uiBrowser) {
        try {
            //TODO
            ui.callCef('hud','{"type": "hide"}');
        }
        catch (e) {
            methods.debug(e);
        }
    }
};

ui.showHud = function() {
    mp.game.ui.displayRadar(true);
    return //TODO ВАЖНО
    if (uiBrowser) {
        try {
            //TODO
            ui.callCef('hud','{"type": "show"}');
        }
        catch (e) {
            methods.debug(e);
        }
    }
};

ui.updateValues = function() {
    return; //TODO ВАЖНО
    if (uiBrowser && user.isLogin()) {
        try {
            let data = {
                type: 'updateValues',
                isShow: user.getCache("is_clock"),
                temp: weather.getWeatherTemp(),
                date: weather.getFullRpDate(),
                time: weather.getFullRpTime(),
            };
            ui.callCef('hudw', JSON.stringify(data));

            data = {
                type: 'updateValues',
                isShow: user.getCache("is_clock"),
                district: ui.getCurrentZone(),
                street: ui.getCurrentStreet(),
            };
            ui.callCef('hudg', JSON.stringify(data));

            data = {
                type: 'updateValues',
                microphone : voice.isEnabledMicrophone(),
                drink: 100,
                eat: 100,
                wallet: methods.moneyFormat(user.getCashMoney(), 999999999999),
                card: user.getCache('bank_card') > 0 ? methods.moneyFormat(user.getBankMoney(), 9999999999999) : 'Нет карты',
            };
            ui.callCef('hudp', JSON.stringify(data));

            data = {
                type: 'updateValues',
                date: weather.getRealDate(),
                time: weather.getRealTime(),
                online: mp.players.length,
                max_player: "1000",
                id: mp.players.local.remoteId,
            };
            ui.callCef('hudl', JSON.stringify(data));
        }
        catch (e) {
            methods.debug(e);
        }
    }
};

ui.updateVehValues = function() {
    return; //TODO ВАЖНО
    if (uiBrowser && user.isLogin()) {
        try {

            let fuelLevel = 0;
            let fuelPostfix = '';
            let fuelMax = 0;
            let isShowSpeed = false;
            let isShowLight = false;
            let isShowEngine = false;
            let isShowLock = false;

            let veh = mp.players.local.vehicle;

            if (veh && mp.vehicles.exists(veh)) {
                isShowSpeed = true;
                isShowLight = veh.getLightsState(true,true).lightsOn || veh.getLightsState(true,true).highbeamsOn;
                isShowEngine = veh.getIsEngineRunning();
                isShowLock = veh.getDoorLockStatus() !== 1;
                let vInfo = methods.getVehicleInfo(veh.model);
                if (vInfo.fuel_type > 0) {
                    fuelLevel = methods.parseInt(veh.getVariable('fuel'));
                    fuelPostfix = vehicles.getFuelPostfix(vInfo.fuel_type);
                    fuelMax = vInfo.fuel_full;
                }
            }

            let vSpeed = methods.getCurrentSpeed();

            let data = {
                type: 'updateValues',
                isShow: isShowSpeed,
                light: isShowLight,
                door: isShowLock,
                engine: isShowEngine,
                fuel: fuelLevel,
                fuelType: fuelPostfix,
                max_fuel: fuelMax,
                speed: vSpeed,
            };
            ui.callCef('hudc', JSON.stringify(data));
        }
        catch (e) {
            methods.debug(e);
        }
    }
};

ui.updateZoneAndStreet = function() {
    try {
        const local = mp.players.local;
        let getStreet = mp.game.pathfind.getStreetNameAtCoord(local.position.x, local.position.y, local.position.z, 0, 0);
        _street = mp.game.ui.getStreetNameFromHashKey(getStreet.streetName); // Return string, if exist
        _zone = mp.game.ui.getLabelText(mp.game.zone.getNameOfZone(local.position.x, local.position.y, local.position.z));
    }
    catch (e) {
        methods.debug(e);
    }
};

ui.updateDirectionText = function() {
    try {
        let dgr = mp.players.local.getRotation(0).z + 180;
        if (dgr >= 22.5 && dgr < 67.5)
            return "SE";
        if (dgr >= 67.5 && dgr < 112.5)
            return "E";
        if (dgr >= 112.5 && dgr < 157.5)
            return "NE";
        if (dgr >= 157.5 && dgr < 202.5)
            return "N";
        if (dgr >= 202.53 && dgr < 247.5)
            return "NW";
        if (dgr >= 247.5 && dgr < 292.5)
            return "W";
        if (dgr >= 292.5 && dgr < 337.5)
            return "SW";
    }
    catch (e) {
        methods.debug(e);
    }
    return "S";
};

ui.getCurrentZone = function() {
    return _zone;
};

ui.getCurrentStreet = function() {
    return _street;
};

ui.drawText = function(caption, xPos, yPos, scale, r, g, b, a, font, justify, shadow, outline) {

    if (!mp.game.ui.isHudComponentActive(0))
        return false;

    try {
        mp.game.ui.setTextFont(font);
        mp.game.ui.setTextScale(1, scale);
        mp.game.ui.setTextColour(r, g, b, a);

        if (shadow)
            mp.game.invoke('0x1CA3E9EAC9D93E5E');
        if (outline)
            mp.game.invoke('0x2513DFB0FB8400FE');

        switch (justify)
        {
            case 1:
                mp.game.ui.setTextCentre(true);
                break;
            case 2:
                mp.game.ui.setTextRightJustify(true);
                mp.game.ui.setTextWrap(0, xPos);
                break;
        }

        mp.game.ui.setTextEntry('STRING');
        mp.game.ui.addTextComponentSubstringPlayerName(caption);
        mp.game.ui.drawText(xPos, yPos);
    }
    catch (e) {
        
    }
};

ui.drawRect = function(xPos, yPos, wSize, hSize, r, g, b, a) {
    if (!mp.game.ui.isHudComponentActive(0))
        return false;
    try {
        let x = xPos + wSize * 0.5;
        let y = yPos + hSize * 0.5;
        mp.game.invoke('0x3A618A217E5154F0', x, y, wSize, hSize, r, g, b, a);
    }
    catch (e) {
        
    }
};

ui.drawText3D = function(caption, x, y, z) {
    if (!mp.game.ui.isHudComponentActive(0))
        return false;
    try {
        mp.game.graphics.setDrawOrigin(x, y, z + 0.5, 0);
        mp.game.ui.setTextFont(0);
        mp.game.ui.setTextScale(0.3, 0.3);
        mp.game.ui.setTextColour(255, 255, 255, 255);
        mp.game.ui.setTextProportional(true);
        mp.game.ui.setTextDropshadow(0, 0, 0, 0, 255);
        mp.game.ui.setTextEdge(2, 0, 0, 0, 150);
        mp.game.invoke('0x2513DFB0FB8400FE');
        mp.game.ui.setTextEntry('STRING');
        mp.game.ui.setTextCentre(true);
        mp.game.ui.addTextComponentSubstringPlayerName(caption);
        mp.game.ui.drawText(0, 0);
        mp.game.invoke('0xFF0B610F6BE0D7AF');
    }
    catch (e) {

    }
};

ui.drawText3DRage = function(caption, x, y, z) {
    if (!mp.game.ui.isHudComponentActive(0))
        return false;
    mp.game.graphics.drawText(caption, [x, y, z + 0.5], { font: 0, color: [255, 255, 255, 255], scale: [0.3, 0.3], outline: true, centre: true });
};

// Передача на cef с сервера
mp.events.add('client:ui:callCef', (event, value) => {
    ui.callCef(event, value);
});

// Эвенты на cef только через эту функцию
ui.callCef = function(event, value) {
    //methods.debug(event, value);
    try {
        if(uiBrowser && methods.isValidJSON(value))
            uiBrowser.execute(`trigger('${event}', '${value}')`);
    }
    catch (e) {
        methods.debug(e);
    }
};

export default ui;