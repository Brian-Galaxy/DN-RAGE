"use strict";

let ui = {};
let uiBrowser = null;

ui.create = function() {
    uiBrowser = mp.browsers.new("package://cef/index.html");
};

// Handle event from server and send data to react app
mp.events.add('onMessageFromServer', (value) => {
    uiBrowser.execute(`trigger('onMessageFromClient', '${value}')`)
});

// Handle event from react app
mp.events.add('showUrl', (url) => {
    mp.gui.chat.push(url)
});

mp.events.add('chatMsg', (msg) => {
    mp.gui.chat.push(msg)
});

// F12 - trigger cursor
mp.keys.bind(0x7B, true, () => {
    let state = !mp.gui.cursor.visible;
    mp.gui.cursor.show(state, state)
});

mp.keys.bind(0x7A, true, () => {
    uiBrowser.execute(`trigger('onMessageFromClient', {type: 'show'})`);
    mp.gui.chat.push('F11!');
});

export default ui;