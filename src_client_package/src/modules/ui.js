"use strict";

import methods from "./methods";

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
    if (uiBrowser) {
        try {
            //TODO
        }
        catch (e) {
            methods.debug(e);
        }
    }
};

ui.showHud = function() {
    if (uiBrowser) {
        try {
            //TODO
        }
        catch (e) {
            methods.debug(e);
        }
    }
};

ui.updateZoneAndStreet = function() {
    const local = mp.players.local;
    let getStreet = mp.game.pathfind.getStreetNameAtCoord(local.position.x, local.position.y, local.position.z, 0, 0);
    _street = mp.game.ui.getStreetNameFromHashKey(getStreet.streetName); // Return string, if exist
    _zone = mp.game.ui.getLabelText(mp.game.zone.getNameOfZone(local.position.x, local.position.y, local.position.z));
};

ui.updateDirectionText = function() {
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
};

ui.drawRect = function(xPos, yPos, wSize, hSize, r, g, b, a) {
    if (!mp.game.ui.isHudComponentActive(0))
        return false;
    let x = xPos + wSize * 0.5;
    let y = yPos + hSize * 0.5;
    mp.game.invoke('0x3A618A217E5154F0', x, y, wSize, hSize, r, g, b, a);
};

ui.drawText3D = function(caption, x, y, z) {

    if (!mp.game.ui.isHudComponentActive(0))
        return false;

    z = z + 0.5;
    mp.game.graphics.setDrawOrigin(x, y, z, 0);
    //let camPos = mp.game.invoke('0x14D6F5678D8F1B37');
    /*let camPos = mp.players.local.position;
    let dist = methods.distanceToPos(camPos, new mp.Vector3(x, y, z));
    let scale = 1 / dist * 2;
    let fov = 1 / mp.game.invoke('0x65019750A0324133') * 100;
    scale = fov * scale;
    if (scale < 0.5)
        scale = 0.5;
    if (scale > 0.8)
        scale = 0.8;*/
    //scale = 1 - scale;
    let scale = 0.5;

    mp.game.ui.setTextFont(0);
    mp.game.ui.setTextScale(0.1 * scale, 0.55 * scale);
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
};



// Передача на cef с сервера
mp.events.add('client:ui:callCef', (event, value) => {
    ui.callCef(event, value);
});

// Эвенты на cef только через эту функцию
ui.callCef = function(event, value) {
    if(methods.isValidJSON(value))
        uiBrowser.execute(`trigger('${event}', '${value}')`);
};

// F11 - курсор
/*mp.keys.bind(0x7A, true, () => {
    let state = !mp.gui.cursor.visible;
    mp.gui.cursor.show(state, state)
});*/
/*
// F11 - для тестов
mp.keys.bind(0x7A, true, () => {
    ui.callCef('authMain','{"type": "show"}');
});*/

// F11 - для тестов
mp.keys.bind(0x7A, true, () => {
    ui.callCef('authMain','{"type": "redirectToPlayer"}');
});

export default ui;