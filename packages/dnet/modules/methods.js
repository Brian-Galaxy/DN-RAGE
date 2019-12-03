"use strict";

const crypto = require('crypto');

let methods = exports;

methods.sha256 = function (text) {
    return crypto.createHash('sha256').update(text).digest('hex');
};

methods.sleep = ms => new Promise(res => setTimeout(res, ms));

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
    return new Intl.NumberFormat('de-DE').format(currentMoney.toFixed(2));
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