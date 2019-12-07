"use strict";

const crypto = require('crypto');
let Container = require('./data');
let enums = require('../enums');
let user = require('../user');

let checkPointStaticList = [];

let methods = exports;

methods.sha256 = function (text) {
    return crypto.createHash('sha256').update(text).digest('hex');
};

methods.sleep = ms => new Promise(res => setTimeout(res, ms));

methods.checkTeleport = function(player, pos1, pos2) {
    try {
        let distanceCheck = 1.4;
        let playerPos = player.position;
        if (methods.distanceToPos(pos1, playerPos) < distanceCheck)
            user.teleport(player, pos2.x, pos2.y, pos2.z + 1);
        if (methods.distanceToPos(pos2, playerPos) < distanceCheck)
            user.teleport(player, pos1.x, pos1.y, pos1.z + 1);
    }
    catch (e) {
        methods.debug(e);
    }
};

methods.checkTeleportVeh = function(player, pos1, pos2) {
    try {
        let distanceCheck = 1.4;
        let playerPos = player.position;
        if (methods.distanceToPos(pos1, playerPos) < distanceCheck)
            user.teleportVeh(player, pos2.x, pos2.y, pos2.z);
        if (methods.distanceToPos(pos2, playerPos) < distanceCheck)
            user.teleportVeh(player, pos1.x, pos1.y, pos1.z);
    }
    catch (e) {
        methods.debug(e);
    }
};

methods.getVehicleInfo = function (model) {
    let vehInfo = enums.vehicleInfo;
    for (let item in vehInfo) {
        let vItem = vehInfo[item];
        if (vItem.hash == model || vItem.display_name == model || mp.joaat(vItem.display_name.toString().toLowerCase()) == model)
            return vItem;
    }
    return {id: 0, hash: model, display_name: 'Unknown', class_name: 'Unknown', stock: 378000, stock_full: 205000, fuel_full: 75, fuel_min: 8};
};

methods.getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

methods.getRandomFloat = function () {
    return methods.getRandomInt(0, 10000) / 10000;
};

methods.unixTimeStampToDateTime = function (timestamp) {
    let dateTime = new Date(timestamp * 1000);
    return `${methods.digitFormat(dateTime.getDate())}/${methods.digitFormat(dateTime.getMonth()+1)}/${dateTime.getFullYear()} ${methods.digitFormat(dateTime.getHours())}:${methods.digitFormat(dateTime.getMinutes())}`
};

methods.unixTimeStampToDateTimeShort = function (timestamp) {
    let dateTime = new Date(timestamp * 1000);
    return `${methods.digitFormat(dateTime.getDate())}/${methods.digitFormat(dateTime.getMonth()+1)} ${methods.digitFormat(dateTime.getHours())}:${methods.digitFormat(dateTime.getMinutes())}`
};

methods.unixTimeStampToDate = function (timestamp) {
    let dateTime = new Date(timestamp * 1000);
    return `${methods.digitFormat(dateTime.getDate())}/${methods.digitFormat(dateTime.getMonth()+1)}/${dateTime.getFullYear()}`
};

methods.digitFormat = function(number) {
    return ("0" + number).slice(-2);
};

methods.numberFormat = function (currentMoney) {
    return currentMoney.toString().replace(/.+?(?=\D|$)/, function(f) {
        return f.replace(/(\d)(?=(?:\d\d\d)+$)/g, "$1,");
    });
};

methods.moneyFormat = function (currentMoney) {
    currentMoney = methods.parseFloat(currentMoney);
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(currentMoney.toFixed(2));
};

methods.boolToInt = function (boolean) {
    return boolean ? 1 : 0;
};

methods.getTimeStamp = function () {
    return Date.now() / 1000 | 0;
};

methods.getTimeWithoutSec = function() {
    let dateTime = new Date();
    return `${methods.digitFormat(dateTime.getHours())}:${methods.digitFormat(dateTime.getMinutes())}`;
};

methods.getTime = function() {
    let dateTime = new Date();
    return `${methods.digitFormat(dateTime.getHours())}:${methods.digitFormat(dateTime.getMinutes())}:${methods.digitFormat(dateTime.getSeconds())}`;
};

methods.getDate = function() {
    let dateTime = new Date();
    return `${methods.digitFormat(dateTime.getDate())}/${methods.digitFormat(dateTime.getMonth() + 1)}/${methods.digitFormat(dateTime.getFullYear())}`;
};

methods.distanceToPos = function (v1, v2) {
    return Math.abs(Math.sqrt(Math.pow((v2.x - v1.x),2) +
        Math.pow((v2.y - v1.y),2)+
        Math.pow((v2.z - v1.z),2)));
};

methods.distanceToPos2D = function (v1, v2) {
    return Math.abs(Math.sqrt(Math.pow((v2.x - v1.x),2) +
        Math.pow((v2.y - v1.y),2)));
};

methods.removeQuotes = function (str) {
    //TODO RemoveSlash
    return str.replace('\'', '');
};

methods.escapeRegExp = function(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
};

methods.replaceAll = function(str, find, replace) {
    return str.replace(new RegExp(methods.escapeRegExp(find), 'g'), replace);
};

methods.debug = function (message, ...args) {
    try {
        console.log(`[DEBUG-SERVER] [${methods.getTime()}]: ${message}`, args)
    } catch (e) {
        console.log(e)
    }
};

methods.isValidJSON = function(value){
    try{
        JSON.parse(value);
        return true;
    }
    catch (error){
        methods.debug(`Invalid JSON string\n${error}`);
        return false;
    }
};

methods.parseInt = function (str) {
    return parseInt(str) || 0;
};

methods.parseFloat = function (str) {
    return parseFloat(str) || 0;
};

methods.saveLog = function (name, log) {
    //TODO
};

methods.createBlip = function (pos, sprite, color, scale, name, dimension) {
    if (scale == undefined)
        scale = 0.8;
    if (dimension == undefined)
        dimension = -1;
    if (name == undefined)
        return mp.blips.new(sprite, pos,
            {
                color: color,
                scale: scale,
                shortRange: true,
                dimension: dimension
            });
    return mp.blips.new(sprite, pos,
        {
            name: name,
            color: color,
            scale: scale,
            shortRange: true,
            dimension: dimension
        });
};

methods.createStaticCheckpointV = function (pos, message, scale, dimension, color, height) {
    return methods.createStaticCheckpoint(pos.x, pos.y, pos.z, message, scale, dimension, color, height);
};

methods.createStaticCheckpoint = function (x, y, z, message, scale, dimension, color, height) {

    if (scale == undefined)
        scale = 1;
    if (color == undefined)
        color = [33, 150, 243, 100];
    if (height == undefined)
        height = scale;

    if (dimension == undefined)
        dimension = -1;
    else
        dimension = methods.parseInt(dimension);

    let checkpointID = checkPointStaticList.length;
    checkPointStaticList.push({x: parseFloat(x), y: parseFloat(y), z: parseFloat(z), color: color, scale: scale, height: height});
    if (message != undefined)
        Container.Data.Set(999999, 'checkpointStaticLabel' + checkpointID, message);
    return checkpointID;
};

methods.getCheckPointStaticList = function () {
    return checkPointStaticList;
};

methods.updateCheckpointList = function (player) {
    if(!mp.players.exists(player))
        return;
    try {
        for (let i = 0; i < methods.parseInt(methods.getCheckPointStaticList().length / 500) + 1; i++)
            player.call('client:updateCheckpointList', [methods.getCheckPointStaticList().slice(i * 500, i * 500 + 499)]);
    }
    catch (e) {
        methods.debug(e);
    }
};