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

methods.digitFormat = function(number) {
    return ("0" + number).slice(-2);
};

methods.numberFormat = function (currentMoney) {
    return currentMoney.toString().replace(/.+?(?=\D|$)/, function(f) {
        return f.replace(/(\d)(?=(?:\d\d\d)+$)/g, "$1,");
    });
};

methods.getTimeStamp = function () {
    return Date.now() / 1000 | 0;
};

methods.debug = function (message) {
    try {
        console.log(`[DEBUG-SERVER]: ${message}`)
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