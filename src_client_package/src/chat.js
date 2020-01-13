let chat = {};

chat.clRed = '#f44336';
chat.clBlue = '#03A9F4';
chat.clOrange = '#FFC107';
chat.clWhite = '#FFFFFF';
chat.clBlack = '#000000';

chat.sendBCommand = function(text) {
    mp.events.callRemote('server:chat:sendBCommand', text);
};

chat.sendTryCommand = function(text) {
    mp.events.callRemote('server:chat:sendTryCommand', text);
};

chat.sendDoCommand = function(text) {
    mp.events.callRemote('server:chat:sendDoCommand', text);
};

chat.sendMeCommand = function(text) {
    mp.events.callRemote('server:chat:sendMeCommand', text);
};

chat.sendDiceCommand = function() {
    mp.events.callRemote('server:chat:sendDiceCommand');
};

chat.send = function(text) {
    mp.events.callRemote('server:chat:send', text);
};

chat.sendLocal = function(text) {
    mp.gui.chat.push(`${text}`);
};

chat.sendToAll = function(sender, text, color = '2196F3') {
    mp.events.callRemote('server:chat:sendToAll', sender, text, color);
};

export default chat;