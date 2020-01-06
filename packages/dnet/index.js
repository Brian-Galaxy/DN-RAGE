"use strict";

require('./modules/cli');
require('./modules/data');
require('./modules/events');
require('./modules/chat');
require('./voice/voice');
require('./managers/vSync');

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
let pickups = require('./managers/pickups');

let coffer = require('./coffer');
let inventory = require('./inventory');

function init() {
    try {
        methods.debug('INIT GAMEMODE');
        vehicleInfo.loadAll();

        houses.loadAll();
        condos.loadAll();
        condos.loadBigAll();
        business.loadAll();

        weather.loadAll();

        cloth.loadAll();
        tattoo.loadAll();

        pickups.createPickups();

        coffer.load();

        methods.loadAllBlips();

        inventory.loadAll();

        setTimeout(function () {
            vehicles.loadAllShop();
            vehicles.loadAllShopVehicles();
            vehicles.loadAllTimers();
            vehicles.loadAllFractionVehicles();
        }, 10000);
    }
    catch (e) {
        methods.debug('ERROR INIT', e);
    }
}

init();