"use strict";

mp.events.add('server:clientDebug', (player, message) => {
    try {
        console.log(`[DEBUG-CLIENT][${player.name}]: ${message}`)
    } catch (e) {
        console.log(e);
    }
});
