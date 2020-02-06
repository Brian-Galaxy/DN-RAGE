"use strict";

require('./modules/cli');
require('./modules/data');
require('./modules/events');
require('./modules/chat');
require('./voice/voice');
require('./managers/vSync');
require('./managers/wpSync');
require('./managers/attach');
require('./managers/attachWeapons');

let mysql = require('./modules/mysql');
let methods = require('./modules/methods');
let vehicleInfo = require('./modules/vehicleInfo');

let cloth = require('./business/cloth');
let tattoo = require('./business/tattoo');
let lsc = require('./business/lsc');
let gun = require('./business/gun');
let vShop = require('./business/vShop');
let carWash = require('./business/carWash');
let rent = require('./business/rent');
let bar = require('./business/bar');
let barberShop = require('./business/barberShop');
let bank = require('./business/bank');
let fuel = require('./business/fuel');
let shop = require('./business/shop');

let houses = require('./property/houses');
let condos = require('./property/condos');
let business = require('./property/business');
let vehicles = require('./property/vehicles');
let stocks = require('./property/stocks');
let fraction = require('./property/fraction');

let weather = require('./managers/weather');
let pickups = require('./managers/pickups');
let gangWar = require('./managers/gangWar');

let coffer = require('./coffer');
let inventory = require('./inventory');
let weapons = require('./weapons');

function init() {
    try {
        methods.debug('INIT GAMEMODE');

        mysql.executeQuery('UPDATE users SET is_online=\'0\'');

        for (let i = 0; i < weapons.hashesMap.length; i++)
            weapons.hashesMap[i][1] *= 2;

        vehicleInfo.loadAll();

        houses.loadAll();
        condos.loadAll();
        condos.loadBigAll();
        business.loadAll();
        stocks.loadAll();
        fraction.loadAll();
        gangWar.loadAll();

        weather.loadAll();

        carWash.loadAll();
        rent.loadAll();
        lsc.loadAll();
        bar.loadAll();
        barberShop.loadAll();
        cloth.loadAll();
        tattoo.loadAll();
        gun.loadAll();
        bank.loadAll();
        fuel.loadAll();
        shop.loadAll();

        pickups.createPickups();

        coffer.load();

        methods.loadAllBlips();

        inventory.loadAll();

        vShop.loadAllShop();

        setTimeout(function () {
            vShop.loadAllShopVehicles();
            vehicles.loadAllTimers();
            vehicles.loadAllFractionVehicles();
            vehicles.checkVehiclesFuel();
        }, 10000);
    }
    catch (e) {
        methods.debug('ERROR INIT', e);
    }
}

init();