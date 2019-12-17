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
let condos = require('./property/condos');
let business = require('./property/business');

let weather = require('./managers/weather');

let coffer = require('./coffer');

function init() {
    try {
        methods.debug('INIT GAMEMODE');

        houses.loadAll();
        condos.loadAll();
        condos.loadBigAll();
        business.loadAll();

        weather.loadAll();

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