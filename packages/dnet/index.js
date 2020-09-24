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
require('./managers/dispatcher');

require('./casino/wheel');

let mysql = require('./modules/mysql');
let methods = require('./modules/methods');
let vehicleInfo = require('./modules/vehicleInfo');
let ctos = require('./modules/ctos');

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
let yachts = require('./property/yachts');

let weather = require('./managers/weather');
let pickups = require('./managers/pickups');
let gangWar = require('./managers/gangWar');
let canabisWar = require('./managers/canabisWar');
let gangZone = require('./managers/gangZone');
let mafiaWar = require('./managers/mafiaWar');
let timer = require('./managers/timer');
let ems = require('./managers/ems');
let tax = require('./managers/tax');
let discord = require('./managers/discord');
let racer = require('./managers/racer');
let trucker = require('./managers/trucker');
let graffiti = require('./managers/graffiti');
let fishing = require('./managers/fishing');

let coffer = require('./coffer');
let inventory = require('./inventory');
let weapons = require('./weapons');

function init() {
    try {
        methods.debug('INIT GAMEMODE');

        mysql.executeQuery('UPDATE users SET is_online=\'0\', st_order_atm_d=\'0\', st_order_drug_d=\'0\', st_order_lamar_d=\'0\' WHERE 1');

        for (let i = 0; i < weapons.hashesMap.length; i++)
            weapons.hashesMap[i][1] *= 2;

        vehicleInfo.loadAll();
        ctos.loadAll();
        graffiti.loadAll();
        fishing.loadAll();

        houses.loadAll();
        yachts.loadAll();
        condos.loadAll();
        condos.loadBigAll();
        business.loadAll();
        stocks.loadAll();
        fraction.loadAll();
        gangWar.loadAll();
        canabisWar.loadAll();
        mafiaWar.loadAll();
        timer.loadAll();
        tax.loadAll();

        trucker.loadAll();

        weather.loadAll();
        racer.loadAll();
        gangZone.loadAll();

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

        pickups.createAll();

        coffer.load();

        methods.loadAllBlips();

        inventory.loadAll();

        vShop.loadAllShop();

        setInterval(methods.saveAllAnother, 15 * 1000 * 60);

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