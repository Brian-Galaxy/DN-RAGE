"use strict";

const crypto = require('crypto');

let Container = require('./data');
let mysql = require('./mysql');

let enums = require('../enums');
let user = require('../user');
let coffer = require('../coffer');

let vehicles = require('../property/vehicles');

let weather = require('../managers/weather');

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
    return {id: 0, hash: model, display_name: 'Unknown', class_name: 'Unknown', class_name_ru: 'Unknown', stock: 378000, stock_full: 205000, price: 50000, fuel_full: 75, fuel_min: 8, fuel_type: 0, type: 0};
};

methods.getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

methods.getRandomFloat = function () {
    return methods.getRandomInt(0, 10000) / 10000;
};

methods.getRandomBankCard = function (prefix = 0) {
    if (prefix == 0)
        prefix = methods.getRandomInt(1000, 9999);

    let num1 = methods.getRandomInt(1000, 9999);
    let num2 = methods.getRandomInt(1000, 9999);
    let num3 = methods.getRandomInt(1000, 9999);

    return methods.parseInt(`${prefix}${num1}${num2}${num3}`);
};

methods.getRandomPhone = function (prefix = 0) {
    if (prefix == 0)
        prefix = methods.getRandomInt(100, 999);
    let num = methods.getRandomInt(100000, 9999999);
    return methods.parseInt(`${prefix}${num}`);
};

methods.unixTimeStampToDateTime = function (timestamp) {
    let dateTime = new Date(timestamp * 1000);
    return `${methods.digitFormat(dateTime.getHours())}:${methods.digitFormat(dateTime.getMinutes())} ${methods.digitFormat(dateTime.getDate())}/${methods.digitFormat(dateTime.getMonth()+1)}/${dateTime.getFullYear()}`
};

methods.unixTimeStampToDateTimeShort = function (timestamp) {
    let dateTime = new Date(timestamp * 1000);
    return `${methods.digitFormat(dateTime.getHours())}:${methods.digitFormat(dateTime.getMinutes())} ${methods.digitFormat(dateTime.getDate())}/${methods.digitFormat(dateTime.getMonth()+1)}`
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

methods.bankFormat = function (currentMoney) {
    return currentMoney.toString().replace(/.+?(?=\D|$)/, function(f) {
        return f.replace(/(\d)(?=(?:\d\d\d\d)+$)/g, "$1 ");
    });
};

methods.phoneFormat = function (phoneNumber) {
    let phoneNumberString = methods.parseInt(phoneNumber);
    let cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        let intlCode = (match[1] ? '+1 ' : '');
        return [intlCode, '', match[2], ' ', match[3], '-', match[4]].join('');
    }
    return phoneNumberString;
};

methods.moneyFormat = function (currentMoney, maxCentValue = 5000) {
    currentMoney = methods.parseFloat(currentMoney);
    if (currentMoney < maxCentValue)
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(currentMoney.toFixed(2));
    return '$' + methods.numberFormat(currentMoney.toFixed(0));
};

methods.boolToInt = function (boolean) {
    return boolean ? 1 : 0;
};

methods.getTimeStamp = function () {
    return Date.now() / 1000 | 0;
};

methods.getTimeStampFull = function () {
    return Date.now();
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

methods.daysInMonth = function (month, year) {
    return new Date(year, month, 0).getDate();
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
    return str.toString().replace('\'', '');
};

methods.removeQuotes2 = function(text) {
    return text.toString().replace('"', '');
};

methods.escapeRegExp = function(str) {
    return str.toString().replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
};

methods.replaceAll = function(str, find, replace) {
    return str.toString().replace(new RegExp(methods.escapeRegExp(find), 'g'), replace);
};

methods.debug = function (message, ...args) {
    try {
        console.log(`[DEBUG-SERVER] [${methods.getTime()}]: ${message}`, args)
    } catch (e) {
        console.log(e)
    }
};

methods.error = function (message, ...args) {
    try {
        message = 'OMG! EXCEPTION: ' + message;
        methods.debug(message, args);
    } catch (e) {
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
    methods.debug(name, log);
    //TODO
};

methods.saveFractionLog = function (name, doName, text, fractionId) {
    doName = methods.removeQuotes(doName);
    text = methods.removeQuotes(text);
    name = methods.removeQuotes(name);
    mysql.executeQuery(`INSERT INTO log_fraction (name, text, text2, fraction_id, timestamp, rp_datetime) VALUES ('${name}', '${doName}', '${text}', '${fractionId}', '${methods.getTimeStamp()}', '${weather.getRpDateTime()}')`);
};

methods.saveFile = function (name, log) {
    fs.appendFile("" + name + ".log", `${log}\n`, function (err) {
        if(err) {
            methods.createFile(name);
            return methods.debug(err);
        }
    });
};

methods.createFile = function (filename) {
    fs.open(filename, 'r', function(err, fd) {
        if (err) {
            fs.writeFile(filename, '', function(err) {
                if(err)
                    methods.debug(err);
                else
                    methods.debug("The file was saved!");
            });
        } else {
            methods.debug("The file exists!");
        }
    });
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

methods.createStaticCheckpoint = function (x, y, z, message, scale = 1, dimension = -1, color = [33, 150, 243, 100], height = undefined) {

    if (height == undefined)
        height = scale / 2;

    let checkpointID = checkPointStaticList.length;
    checkPointStaticList.push({id: checkpointID, x: parseFloat(x), y: parseFloat(y), z: parseFloat(z), color: color, scale: scale, height: height});
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

methods.fixCheckpointList = function (player) {
    if(!mp.players.exists(player))
        return;
    player.call('client:fixCheckpointList');
};

methods.notifyWithPictureToAll = function(title, sender, message, notifPic, icon = 0, flashing = false, textColor = -1, bgColor = -1, flashColor = [77, 77, 77, 200]) {
    mp.players.call("BN_ShowWithPicture", [title, sender, message, notifPic, icon, flashing, textColor, bgColor, flashColor]);
};

methods.notifyWithPictureToFraction = function(title, sender, message, notifPic, fractionId = 0, icon = 0, flashing = false, textColor = -1, bgColor = -1, flashColor = [77, 77, 77, 200]) {
    mp.players.forEach(function (p) {
        if (user.isLogin(p) && user.get(p, 'fraction_id') == fractionId) {
            try {
                p.notifyWithPicture(title, sender, message, notifPic, icon, flashing, textColor, bgColor, flashColor);
            }
            catch (e) {

            }
        }
    });
};

methods.notifyWithPictureToFraction2 = function(title, sender, message, notifPic, fractionId = 0, icon = 0, flashing = false, textColor = -1, bgColor = -1, flashColor = [77, 77, 77, 200]) {
    mp.players.forEach(function (p) {
        if (user.isLogin(p) && user.get(p, 'fraction_id2') == fractionId) {
            try {
                p.notifyWithPicture(title, sender, message, notifPic, icon, flashing, textColor, bgColor, flashColor);
            }
            catch (e) {

            }
        }
    });
};

methods.notifyWithPictureToJob = function(title, sender, message, notifPic, job, icon = 0, flashing = false, textColor = -1, bgColor = -1, flashColor = [77, 77, 77, 200]) {
    mp.players.forEach(function (p) {
        if (user.isLogin(p) && user.get(p, 'job') == job) {
            try {
                p.notifyWithPicture(title, sender, message, notifPic, icon, flashing, textColor, bgColor, flashColor);
            }
            catch (e) {

            }
        }
    });
};

methods.notifyWithPictureToPlayer = function(p, title, sender, message, notifPic, icon = 0, flashing = false, textColor = -1, bgColor = -1, flashColor = [77, 77, 77, 200]) {
    if (mp.players.exists(p))
        p.notifyWithPicture(title, sender, message, notifPic, icon, flashing, textColor, bgColor, flashColor);
};

methods.notifyToFraction = function(message, fractionId = 0) {
    mp.players.forEach(function (p) {
        if (user.isLogin(p) && user.get(p, 'fraction_id') == fractionId)
            p.notify(message);
    });
};

methods.notifyToAll = function(message) {
    mp.players.forEach(function (p) {
        if (user.isLogin(p))
            p.notify(message);
    });
};

methods.isInPoint = function (p1, p2, p3, p4, p5) {
    return Math.min(p1.x, p2.x) < p5.x && Math.max(p3.x, p4.x) > p5.x && Math.min(p1.y, p4.y) < p5.y && Math.max(p2.y, p3.y) > p5.y;
};

methods.getFractionById = function (fractionId) {
    return enums.fractionListId[fractionId];
};


methods.getFractionCountRank = function (fractionId, rankType = 0) {
    return methods.getFractionById(fractionId).rankList[rankType].length;
};

methods.getFractionPayDay = function (fractionId, rank, rankType) {
    let frItem = methods.getFractionById(fractionId);
    let currentPayDay = frItem.departmentPayDay[rankType];
    let money = currentPayDay * (methods.getFractionCountRank(fractionId, rankType) - (rank - 1)) + coffer.getBenefit(coffer.getIdByFraction(fractionId));
    if (rank == 1 || rank == 2) {
        if (rankType == 0)
            money = money * 2;
        else
            money = money * 1.5;
    }
    return money;
};

methods.getNearestVehicleWithCoords = function(pos, r, dim = 0) {
    let nearest = undefined, dist;
    let min = r;
    methods.getListOfVehicleInRadius(pos, r).forEach(vehicle => {
        dist = methods.distanceToPos(pos, vehicle.position);
        if (dist < min) {
            if (dim != 0) {
                if (dim == vehicle.dimension) {
                    nearest = vehicle;
                    min = dist;
                }
            }
            else {
                nearest = vehicle;
                min = dist;
            }
        }
    });
    return nearest;
};

methods.getListOfVehicleInRadius = function(pos, r) {
    let returnVehicles = [];
    mp.vehicles.forEachInRange(pos, r,
        (vehicle) => {
            if (!vehicles.exists(vehicle))
                return;
            returnVehicles.push(vehicle);
        }
    );
    return returnVehicles;
};

methods.getListOfVehicleNumberInRadius = function(pos, r) {
    let returnVehicles = [];
    mp.vehicles.forEachInRange(pos, r,
        (vehicle) => {
            if (!vehicles.exists(vehicle))
                return;
            returnVehicles.push(vehicle.numberPlate);
        }
    );
    return returnVehicles;
};

methods.getNearestPlayerWithCoords = function(pos, r) {
    let nearest = undefined, dist;
    let min = r;
    methods.getListOfPlayerInRadius(pos, r).forEach(player => {
        if (!user.isLogin(player)) return;
        dist = methods.distanceToPos(pos, player.position);
        if (dist < min) {
            nearest = player;
            min = dist;
        }
    });
    return nearest;
};

methods.getNearestPlayerWithPlayer = function(pl, r) {
    let nearest = undefined, dist;
    let min = r;
    let pos = pl.position;
    methods.getListOfPlayerInRadius(pos, r).forEach(player => {
        if (!user.isLogin(player)) return;
        if (pl == player) return;
        if (pl.dimension != player.dimension) return;
        dist = methods.distanceToPos(pos, player.position);
        if (dist < min) {
            nearest = player;
            min = dist;
        }
    });
    return nearest;
};

methods.getListOfPlayerInRadius = function(pos, r) {
    let returnPlayers = [];
    mp.players.forEachInRange(pos, r,
        (player) => {
            if (!user.isLogin(player)) return;
            returnPlayers.push(player);
        }
    );
    return returnPlayers;
};

methods.loadAllBlips = function () {

    //methods.createBlip(new mp.Vector3(536.4715576171875, -3126.484375, 5.073556900024414), 598, 0, 0.8, 'United States Marine Corps');
    methods.createBlip(new mp.Vector3(450.0621337890625, -984.3471069335938, 43.69164276123047), 60, 0, 0.8, 'Police Department');
    methods.createBlip(new mp.Vector3(-448.6859, 6012.703, 30.71638), 60, 16, 0.8, 'Sheriff Department');
    methods.createBlip(new mp.Vector3(1853.22, 3686.6796875, 33.2670), 60, 16, 0.8, 'Sheriff Department');
    methods.createBlip(new mp.Vector3(-158.44952392578125, -605.221923828125, 48.23460388183594), 535, 67, 0.8, 'Arcadius - Бизнес Центр');
    methods.createBlip(new mp.Vector3(2484.16748046875, -384.5539245605469, 93.9015121459961), 498, 0, 0.8, 'Здание NOOSE');
    methods.createBlip(new mp.Vector3(1830.489, 2603.093, 45.8891), 238, 0, 0.8, 'Федеральная тюрьма');
    methods.createBlip(new mp.Vector3(-1379.659, -499.748, 33.15739), 419, 0, 0.8, 'Здание правительства');
    methods.createBlip(new mp.Vector3(311.9224853515625, -583.9681396484375, 44.299190521240234), 489, 59, 0.8, 'Здание больницы');
    methods.createBlip(new mp.Vector3(-253.9735565185547, 6320.83935546875, 37.61736297607422), 489, 59, 0.8, 'Здание больницы');

    methods.createBlip(new mp.Vector3(-759.5448608398438, -709.0863037109375, 29.0616512298584), 305, 60, 0.6, 'Церковь');

    methods.createBlip(new mp.Vector3(-1081.0628662109375, -251.57298278808594, 37.763275146484375), 744, 0, 0.8, 'Life Invader');
    //methods.createBlip(new mp.Vector3(210.0973, -1649.418, 29.8032), 436, 60, 0.8, 'Здание Fire Department');
    //methods.createBlip(new mp.Vector3(-1581.689, -557.913, 34.95288), 545, 0, 0.8, 'Здание автошколы');

    //methods.createBlip(new mp.Vector3(46.947, -1753.859, 46.508), 78, 68, 0.4, 'Торговый центр MegaMoll');

    //methods.createBlip(new mp.Vector3(-3544, 6135, 0), 68, 59, 0.8, 'Рыбалка запрещена');
    //methods.createBlip(new mp.Vector3(4989, 1712, 0), 68, 59, 0.8, 'Рыбалка запрещена');
    //methods.createBlip(new mp.Vector3(-1337.255, -1277.948, 3.872962), 362, 0, 0.8, 'Магазин масок');
};