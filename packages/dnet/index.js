"use strict";

require('./modules/cli');
require('./modules/data');
require('./modules/events');
require('./modules/chat');

let mysql = require('./modules/mysql');
let houses = require('./property/houses');
let methods = require('./modules/methods');

function init() {
    try {
        methods.debug('INIT GAMEMODE');
        houses.loadAll();
    }
    catch (e) {
        methods.debug('ERROR INIT', e);
    }
}

init();