let methods = require('./methods');
let mysql = require('./mysql');
let enums = require('../enums');

let vehicleInfo = exports;

vehicleInfo.loadAll = function() {
    methods.debug('vehicleInfo.loadAll');
    mysql.executeQuery(`SELECT * FROM veh_info`, function (err, rows, fields) {
        rows.forEach(function (item) {
            enums.vehicleInfo.push(item);
        });
        methods.debug('Vehicle Info Loaded: ' + enums.vehicleInfo.length);
    });
};