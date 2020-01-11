"use strict";

require('./modules/cli');
require('./modules/data');
require('./modules/events');
require('./modules/chat');
require('./voice/voice');
require('./managers/vSync');
require('./managers/wpSync');

let mysql = require('./modules/mysql');
let methods = require('./modules/methods');
let vehicleInfo = require('./modules/vehicleInfo');

let cloth = require('./business/cloth');
let tattoo = require('./business/tattoo');
let lsc = require('./business/lsc');
let gun = require('./business/gun');
let vShop = require('./business/vShop');

let houses = require('./property/houses');
let condos = require('./property/condos');
let business = require('./property/business');
let vehicles = require('./property/vehicles');

let weather = require('./managers/weather');
let pickups = require('./managers/pickups');

let coffer = require('./coffer');
let inventory = require('./inventory');
let weapons = require('./weapons');

function init() {
    try {
        methods.debug('INIT GAMEMODE');

        for (let i = 0; i < weapons.hashesMap.length; i++)
            weapons.hashesMap[i][1] *= 2;

        vehicleInfo.loadAll();

        houses.loadAll();
        condos.loadAll();
        condos.loadBigAll();
        business.loadAll();

        weather.loadAll();

        cloth.loadAll();
        tattoo.loadAll();
        lsc.loadAll();
        gun.loadAll();

        pickups.createPickups();

        coffer.load();

        methods.loadAllBlips();

        inventory.loadAll();

        vShop.loadAllShop();

        setTimeout(function () {
            vShop.loadAllShopVehicles();
            vehicles.loadAllTimers();
            vehicles.loadAllFractionVehicles();
        }, 10000);
    }
    catch (e) {
        methods.debug('ERROR INIT', e);
    }
}

init();