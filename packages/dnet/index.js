"use strict";

require('./modules/cli');
require('./modules/data');
require('./modules/events');
require('./modules/chat');
require('./voice/voice');

let mysql = require('./modules/mysql');
let methods = require('./modules/methods');
let vehicleInfo = require('./modules/vehicleInfo');

let cloth = require('./business/cloth');
let tattoo = require('./business/tattoo');

let houses = require('./property/houses');
let condos = require('./property/condos');
let business = require('./property/business');
let vehicles = require('./property/vehicles');

let weather = require('./managers/weather');

let coffer = require('./coffer');

function init() {
    try {
        methods.debug('INIT GAMEMODE');

        houses.loadAll();
        condos.loadAll();
        condos.loadBigAll();
        business.loadAll();
        vehicles.loadAllShop();
        vehicles.loadAllShopVehicles();

        weather.loadAll();

        cloth.loadAll();
        tattoo.loadAll();

        coffer.load();

        methods.loadAllBlips();
        vehicleInfo.loadAll();
    }
    catch (e) {
        methods.debug('ERROR INIT', e);
    }
}

init();