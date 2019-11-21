"use strict";

let events = {};

mp.events.add('clientDebug', (player, message) => {
    console.log(`[DEBUG-CLIENT][${player.name}]: ${message}`)
});

export default events;