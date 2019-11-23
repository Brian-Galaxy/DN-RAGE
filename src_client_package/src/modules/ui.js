"use strict";

import methods from "./methods";

let ui = {};
let uiBrowser = null;

ui.create = function() {
    uiBrowser = mp.browsers.new("package://cef/index.html");
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

// F2 - курсор
mp.keys.bind(0x71, true, () => {
    let state = !mp.gui.cursor.visible;
    mp.gui.cursor.show(state, state)
});

// F11 - для тестов
mp.keys.bind(0x7A, true, () => {
    ui.callCef('authMain','{"type": "show"}'); // Работает
});

export default ui;