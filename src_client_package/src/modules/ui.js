"use strict";

import methods from "./methods";

let ui = {};
let uiBrowser = null;

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