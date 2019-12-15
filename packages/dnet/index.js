"use strict";

require('./modules/cli');
require('./modules/data');
require('./modules/events');
require('./modules/chat');

let mysql = require('./modules/mysql');
let methods = require('./modules/methods');

let cloth = require('./business/cloth');
let tattoo = require('./business/tattoo');

let houses = require('./property/houses');
let business = require('./property/business');

let coffer = require('./coffer');

function init() {
    try {
        methods.debug('INIT GAMEMODE');

        houses.loadAll();
        business.loadAll();

        cloth.loadAll();
        tattoo.loadAll();

        coffer.load();

        methods.loadAllBlips();
    }
    catch (e) {
        methods.debug('ERROR INIT', e);
    }
}

init();