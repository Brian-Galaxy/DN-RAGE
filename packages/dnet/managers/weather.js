let mysql = require('../modules/mysql');
let methods = require('../modules/methods');

let fraction = require('../property/fraction');

let user = require('../user');
let enums = require('../enums');

let gangWar = require('../managers/gangWar');
let mafiaWar = require('../managers/mafiaWar');
let racer = require('../managers/racer');

let ems = require('./ems');

let weather = exports;

let _year = 2012;
let _month = 1;
let _day = 1;
let _hour = 12;
let _minute = 0;
let _tempNew = 27;
let _weatherType = 0;
let _weather = "";

let _windSpeed = 0;
let _windDir = 0;

let isCreateEms = false;
let isCreateVeh = false;
let isSaveStats = false;

weather.loadAll = function() {
    methods.debug('weather.loadAll');
    mysql.executeQuery(`SELECT * FROM daynight WHERE id = 1`, function (err, rows, fields) {

        _year = rows[0]["year"];
        _month = rows[0]["month"];
        _day = rows[0]["day"];
        _hour = rows[0]["hour"];
        _minute = rows[0]["minute"];

        methods.debug('WEATHER', rows[0]);

        weather.load();
    });
};

weather.load = function() {
    methods.debug('weather.load');
    if (_month < 2 || _month > 11) //Зима
    {
        _tempNew = methods.getRandomInt(1, 4) * -1;
        _weatherType = 0;
    }
    else if (_month == 2) //Зима
    {
        _tempNew = methods.getRandomInt(0, 4) + 8;
        _weatherType = 0;
    }
    else if (_month >= 3 && _month <= 5) //Весна
    {
        _tempNew = methods.getRandomInt(0, 4) + 16;
        _weatherType = 1;
    }
    else if (_month >= 6 && _month <= 9) //Лето
    {
        _tempNew = methods.getRandomInt(0, 4) + 25;
        _weatherType = 2;
    }
    else //Осень
    {
        _tempNew = methods.getRandomInt(0, 4) + 16;
        _weatherType = 3;
    }

    _windSpeed = methods.getRandomInt(0, 4);

    weather.randomTimer();
    weather.weatherTimer();
    weather.timeSyncTimer();
    weather.saveTimer();
};

weather.saveTimer = function() {
    methods.debug('weather.saveTimer');
    mysql.executeQuery("UPDATE daynight SET  year = '" + _year + "', month = '" + _month + "', day = '" + _day + "', hour = '" + _hour + "', minute = '" + _minute + "' where id = '1'");
    setTimeout(weather.saveTimer, 5 * 60 * 1000);
};

weather.randomTimer = function() {
    methods.debug('weather.randomTimer');
    weather.nextRandomWeather();
    setTimeout(weather.randomTimer, 1000 * 60 * 10 + methods.getRandomInt(5, 35));
};

weather.weatherTimer = function() {
    methods.debug('weather.weatherTimer');
    switch (_weatherType)
    {
        case 0:
            if (_hour > 1 && _hour <= 6)
                _tempNew = _tempNew - (methods.getRandomFloat() + 2);
            else if (_hour > 6 && _hour <= 12)
                _tempNew = _tempNew + methods.getRandomFloat();
            else if (_hour > 12 && _hour <= 16)
                _tempNew = _tempNew + (methods.getRandomFloat() + 1);
            else if (_hour > 16 && _hour <= 20)
                _tempNew = _tempNew + methods.getRandomFloat();
            else if (_hour > 20 && _hour <= 23)
                _tempNew = _tempNew + methods.getRandomFloat();
            else
                _tempNew = _tempNew - methods.getRandomFloat() - 0.3;
            break;
        case 1:
        case 2:
        case 3:
            if (_hour > 1 && _hour <= 6)
                _tempNew = _tempNew - (methods.getRandomFloat() + 1.2);
            else if (_hour > 6 && _hour <= 12)
                _tempNew = _tempNew + methods.getRandomFloat();
            else if (_hour > 12 && _hour <= 16)
                _tempNew = _tempNew + (methods.getRandomFloat() + 1);
            else if (_hour > 16 && _hour <= 20)
                _tempNew = _tempNew + methods.getRandomFloat();
            else if (_hour > 20 && _hour <= 23)
                _tempNew = _tempNew + methods.getRandomFloat();
            else
                _tempNew = _tempNew - methods.getRandomFloat() - 0.1;
            break;
    }

    if (methods.getRandomInt(0, 2) == 0)
        _windDir - methods.getRandomFloat() - 1;
    else
        _windDir + methods.getRandomFloat() + 1;

    if (_windDir > 8)
        _windDir = 0;
    if (_windDir < 0)
        _windDir = 8;

    _windSpeed = methods.getRandomInt(0, 4);

    if (methods.getRandomInt(0, 70) == 0)
        _windSpeed = methods.getRandomInt(4, 8);
    if (methods.getRandomInt(0, 100) == 0)
        _windSpeed = methods.getRandomInt(8, 12);

    setTimeout(weather.weatherTimer, 30 * 60 * 1000);
};

weather.timeSyncTimer = function() {
    //methods.debug('weather.timeSyncTimer');

    try {
        _minute++;

        if (_minute === 30) {
            gangWar.timerMoney();
            mafiaWar.timerMoney();
        }

        if (_minute > 59)
        {
            _minute = 0;
            _hour++;

            mp.players.forEach(function (player) {
                user.payDay(player).then();
            });

            if (_hour > 23)
            {
                _hour = 0;
                _day++;

                if (_day > methods.daysInMonth(_year, _month))
                {
                    _day = 1;
                    _month++;

                    if (_month > 12)
                    {
                        _month = 1;
                        _year++;
                    }
                }
            }
        }

        if (_hour === 2 && _minute === 0)
            fraction.createCargoWar(5);
        if (_hour === 6 && _minute === 0)
            fraction.stopCargoWar();

        if (_hour === 9 && _minute === 0)
            racer.createRace();
        if (_hour === 10 && _minute === 0)
            racer.notifyRace();
        if (_hour === 10 && _minute === 30)
            racer.notifyRace();
        if (_hour === 11 && _minute === 0)
            racer.startRace();

        if (_hour === 19 && _minute === 0)
            racer.createRace();
        if (_hour === 20 && _minute === 0)
            racer.notifyRace();
        if (_hour === 20 && _minute === 30)
            racer.notifyRace();
        if (_hour === 21 && _minute === 0)
            racer.startRace();

        let dateTime = new Date();

        mp.players.forEach(function (p) {
            p.call("client:managers:weather:syncDateTime", [_minute, _hour, _day, _month, _year]);
            p.call("client:managers:weather:syncRealTime", [dateTime.getHours()]);
            p.call("client:managers:weather:syncWeatherTemp", [Math.round(_tempNew)]);
            p.call("client:managers:weather:syncWeatherWind", [_windSpeed, _windDir]);
            p.call("client:managers:weather:syncRealFullDateTime", [`${methods.digitFormat(dateTime.getDate())}/${methods.digitFormat(dateTime.getMonth()+1)} ${methods.digitFormat(dateTime.getHours())}:${methods.digitFormat(dateTime.getMinutes())}`]);
            p.call("client:managers:weather:syncRealTime", [`${methods.digitFormat(dateTime.getHours())}:${methods.digitFormat(dateTime.getMinutes())}`]);
            p.call("client:managers:weather:syncRealDate", [`${methods.digitFormat(dateTime.getDate())}/${methods.digitFormat(dateTime.getMonth()+1)}`]);
        });


        /*if (dateTime.getHours() == 18 && dateTime.getMinutes() == 1) { //TODO
            if (isVip < 1) {
                let playerRandomList = [];
                mp.players.forEach(p => {
                    if (user.isLogin(p) && user.getVipStatus(p) == "none")
                        playerRandomList.push(p);
                });

                try {
                    let randomPlayer = playerRandomList[methods.getRandomInt(0, playerRandomList.length - 1)];
                    methods.notifyToAll('~b~Результаты розыгрыша VIP LIGHT навсегда');
                    methods.notifyToAll('~b~Поздравляем! Победил: ~s~' + user.getRpName(randomPlayer));
                    user.set(randomPlayer, 'vip_status', 'Light');
                    user.set(randomPlayer, 'vip_time', 9999);
                    user.saveAccount(randomPlayer);
                    isVip++;
                }
                catch (e) {
                    methods.debug(e);
                }
            }
        }*/

        if (dateTime.getHours() === 18 && dateTime.getMinutes() === 1) {
            if (!isCreateEms) {
                isCreateEms = true;
                ems.createSmallRandom();
            }
        }
        if (dateTime.getHours() === 21 && dateTime.getMinutes() === 1) {
            if (!isCreateEms) {
                isCreateEms = true;
                ems.createSmallRandom();
            }
        }
        if (dateTime.getHours() === 19 && dateTime.getMinutes() === 1) {
            isCreateEms = false
        }

        if (dateTime.getHours() === 20 && dateTime.getMinutes() === 1) {
            if (!isCreateVeh) {
                isCreateVeh = true;
                try {
                    let player = methods.getRandomPlayer();
                    if (user.isLogin(player)) {
                        //user.giveVehicle(player, enums.vehWinList[methods.getRandomInt(0, enums.vehWinList.length)], 1, true);
                        user.giveVip(player, methods.getRandomInt(1, 8), 2, true);
                    }
                    player = methods.getRandomPlayer();
                    if (user.isLogin(player)) {
                        //user.giveVehicle(player, enums.vehWinList[methods.getRandomInt(0, enums.vehWinList.length)], 1, true);
                        user.giveRandomMask(player, 0, true);
                    }
                }
                catch (e) {

                }
            }
        }

        if (dateTime.getDate() % 3 === 0) {
            if (dateTime.getHours() === 20 && dateTime.getMinutes() === 0)
                mafiaWar.startWar(1);
            if (dateTime.getHours() === 20 && dateTime.getMinutes() === 1)
                mafiaWar.startWar(2);
            if (dateTime.getHours() === 20 && dateTime.getMinutes() === 2)
                mafiaWar.startWar(3);
        }

        if (dateTime.getDate() % 4 === 0) {
            if (dateTime.getHours() === 20 && dateTime.getMinutes() === 0)
                fraction.createCargoBigWar();
            if (dateTime.getHours() === 20 && dateTime.getMinutes() === 10)
                fraction.createCargoBigWar();
            if (dateTime.getHours() === 20 && dateTime.getMinutes() === 20)
                fraction.createCargoBigWar();
        }

        if (dateTime.getHours() === 19 && dateTime.getMinutes() === 0)
            fraction.createCargoArmyWar();
        if (dateTime.getHours() === 20 && dateTime.getMinutes() === 30)
            fraction.createCargoMafiaWar();
        if (dateTime.getHours() === 21 && dateTime.getMinutes() === 0)
            fraction.createCargoMafiaWar();

        if (dateTime.getHours() === 17 && dateTime.getMinutes() === 1 && gangWar.hasWar(0)) {
            let war = gangWar.getWar(0);
            gangWar.startWar(war.zoneId, war.attack, war.def, war.armor === 0, war.count);
        }
        if (dateTime.getHours() === 17 && dateTime.getMinutes() === 31 && gangWar.hasWar(1)) {
            let war = gangWar.getWar(1);
            gangWar.startWar(war.zoneId, war.attack, war.def, war.armor === 0, war.count);
        }
        if (dateTime.getHours() === 18 && dateTime.getMinutes() === 1 && gangWar.hasWar(2)) {
            let war = gangWar.getWar(2);
            gangWar.startWar(war.zoneId, war.attack, war.def, war.armor === 0, war.count);
        }
        if (dateTime.getHours() === 18 && dateTime.getMinutes() === 31 && gangWar.hasWar(3)) {
            let war = gangWar.getWar(3);
            gangWar.startWar(war.zoneId, war.attack, war.def, war.armor === 0, war.count);
        }
        if (dateTime.getHours() === 19 && dateTime.getMinutes() === 1 && gangWar.hasWar(4)) {
            let war = gangWar.getWar(4);
            gangWar.startWar(war.zoneId, war.attack, war.def, war.armor === 0, war.count);
        }
        if (dateTime.getHours() === 19 && dateTime.getMinutes() === 31 && gangWar.hasWar(5)) {
            let war = gangWar.getWar(5);
            gangWar.startWar(war.zoneId, war.attack, war.def, war.armor === 0, war.count);
        }
        if (dateTime.getHours() === 20 && dateTime.getMinutes() === 1 && gangWar.hasWar(6)) {
            let war = gangWar.getWar(6);
            gangWar.startWar(war.zoneId, war.attack, war.def, war.armor === 0, war.count);
        }
        if (dateTime.getHours() === 20 && dateTime.getMinutes() === 31 && gangWar.hasWar(7)) {
            let war = gangWar.getWar(7);
            gangWar.startWar(war.zoneId, war.attack, war.def, war.armor === 0, war.count);
        }
        if (dateTime.getHours() === 21 && dateTime.getMinutes() === 1 && gangWar.hasWar(8)) {
            let war = gangWar.getWar(8);
            gangWar.startWar(war.zoneId, war.attack, war.def, war.armor === 0, war.count);
        }
        if (dateTime.getHours() === 21 && dateTime.getMinutes() === 31 && gangWar.hasWar(9)) {
            let war = gangWar.getWar(9);
            gangWar.startWar(war.zoneId, war.attack, war.def, war.armor === 0, war.count);
        }
        if (dateTime.getHours() === 22 && dateTime.getMinutes() === 1 && gangWar.hasWar(10)) {
            let war = gangWar.getWar(10);
            gangWar.startWar(war.zoneId, war.attack, war.def, war.armor === 0, war.count);
        }
        if (dateTime.getHours() === 22 && dateTime.getMinutes() === 31 && gangWar.hasWar(11)) {
            let war = gangWar.getWar(11);
            gangWar.startWar(war.zoneId, war.attack, war.def, war.armor === 0, war.count);
        }
        if (dateTime.getHours() === 23 && dateTime.getMinutes() === 1 && gangWar.hasWar(12)) {
            let war = gangWar.getWar(12);
            gangWar.startWar(war.zoneId, war.attack, war.def, war.armor === 0, war.count);
        }
        if (dateTime.getHours() === 23 && dateTime.getMinutes() === 31 && gangWar.hasWar(13)) {
            let war = gangWar.getWar(13);
            gangWar.startWar(war.zoneId, war.attack, war.def, war.armor === 0, war.count);
        }

        if (dateTime.getHours() == 4 && dateTime.getMinutes() == 50) //TODO
            methods.notifyToAll('Рестарт сервера через 15 минут');
        if (dateTime.getHours() == 4 && dateTime.getMinutes() == 59)
            methods.notifyToAll('Рестарт сервера через 5 минут');
        if (dateTime.getHours() == 5 && dateTime.getMinutes() == 2)
            methods.saveAll();
        if (dateTime.getHours() == 5 && dateTime.getMinutes() == 3)
        {
            fraction.removeTaxAndSave();

            mp.players.forEach(function (p) {
                if (mp.players.exists(p)) {
                    user.set(p, 'online_wheel', 0);
                    user.kick(p, 'Рестарт');
                }
            });

            mysql.executeQuery('UPDATE users SET online_wheel=\'0\' WHERE 1');
            mysql.executeQuery('UPDATE users SET online_cont=\'0\' WHERE 1');
        }
    } catch (e) {
        methods.debug(e);
    }
    setTimeout(weather.timeSyncTimer, 8571);
};

weather.setWeather = function(weatherName) {
    methods.debug('weather.setWeather');

    methods.debug('CURRENT WEATHER: ' + weatherName);
    /*if (weatherName == "RAIN" || weatherName == "THUNDER" || weatherName == "CLEARING")
    {
        if (methods.getRandomInt(0, 3) == 0)
            weather.nextRandomWeather();
    }*/
    _weather = weatherName;
};

weather.getRpDateTime = function() {
    methods.debug('weather.getRpDateTime');
    return `${methods.digitFormat(_hour)}:${methods.digitFormat(_minute)}, ${methods.digitFormat(_day)}/${methods.digitFormat(_month)}/${_year}`;
};

weather.setPlayerCurrentWeather = function(player) {
    methods.debug('weather.setPlayerCurrentWeather');
    player.call("client:managers:weather:setCurrentWeather", [weather.getWeather()]);
};

weather.getWeather = function() {
    methods.debug('weather.getWeather');
    return _weather;
};

weather.getWeatherType = function() {
    methods.debug('weather.getWeatherType');
    return _weatherType;
};

weather.getHour = function() {
    methods.debug('weather.getHour');
    return _hour;
};

weather.getMin = function() {
    methods.debug('weather.getMin');
    return _minute;
};

weather.getDay = function() {
    methods.debug('weather.getDay');
    return _day;
};

weather.getMonth = function() {
    methods.debug('weather.getMonth');
    return _month;
};

weather.getYear = function() {
    methods.debug('weather.getYear');
    return _year - 2000;
};

weather.getFullYear = function() {
    methods.debug('weather.getFullYear');
    return _year;
};

weather.getFullRpDate = function() {
    return `${methods.digitFormat(_day)}/${methods.digitFormat(_month)}/${_year}`;
};

weather.getFullRpDateFormat = function(day, month, year) {
    return `${methods.digitFormat(day)}/${methods.digitFormat(month)}/${year}`;
};

weather.getFullRpTime = function() {
    return `${methods.digitFormat(_hour)}:${methods.digitFormat(_minute)}`;
};

weather.strDateToTime = function(date) {
    let dateArray = date.split('/');
    let day = methods.parseInt(dateArray[0]);
    let month = methods.parseInt(dateArray[1]);
    let year = methods.parseInt(dateArray[2]);
    return new Date(year, month, day, 0, 0, 0, 0).getTime();
};

weather.nextRandomWeather = function() {
    methods.debug('weather.nextRandomWeather');
    weather.nextRandomWeatherByType(weather.getWeatherType());
};

weather.getWeatherName = function(type) {
    switch (type) {
        case "EXTRASUNNY":
            return 'Безоблачно';
        case "CLEAR":
            return 'Низкая облачность';
        case "CLOUDS":
            return 'Облачно';
        case "SMOG":
            return 'Смог';
        case "FOGGY":
            return 'Туман';
        case "OVERCAST":
            return 'Пасмурно';
        case "RAIN":
            return 'Дождь';
        case "THUNDER":
            return 'Гроза';
        case "CLEARING":
            return 'Лёгкий дождь';
        case "XMAS":
            return 'Снег';
    }
    return 'Безоблачно';
};

weather.getWeatherDesc = function(type) {
    switch (type) {
        case "EXTRASUNNY":
        case "CLEAR":
            return '';
        case "CLOUDS":
            return '';
        case "SMOG":
            return 'На дорогах будет слегка понижена видимость, будьте осторожны';
        case "FOGGY":
            return 'Водителям рекомендуем включить фары и быть аккуратными на дорогах';
        case "OVERCAST":
            return '';
        case "RAIN":
            return '';
        case "THUNDER":
            return 'В океане прогнозируется шторм с сильным ветром';
        case "CLEARING":
            return 'Не забывайте зонтик ;)';
        case "XMAS":
            return '';
    }
    return '';
};

weather.getFullRpTime = function() {
    return `${methods.digitFormat(_hour)}:${methods.digitFormat(_minute)}`;
};

weather.nextRandomWeatherByType = function(weatherType) {
    methods.debug('weather.nextRandomWeatherByType');

    var weatherList = [
        "EXTRASUNNY",
        "CLEAR",
        "CLOUDS",
        "SMOG",
        "FOGGY",
        "OVERCAST",
        "RAIN",
        "THUNDER",
        "CLEARING",
        "XMAS"
    ];

    switch (weatherType)
    {
        case 0:

            weatherList = [
                "EXTRASUNNY",
                "CLOUDS",
                "CLOUDS",
                "SMOG",
                "SMOG",
                "FOGGY",
                "FOGGY",
                "OVERCAST",
                "OVERCAST"
            ];

            if (weatherType == 0)
                if (_tempNew < 1)
                    weatherList = ["XMAS"];

            break;
        case 1:
            weatherList = [
                "EXTRASUNNY",
                "EXTRASUNNY",
                "EXTRASUNNY",
                "EXTRASUNNY",
                "EXTRASUNNY",
                "EXTRASUNNY",
                "EXTRASUNNY",
                "EXTRASUNNY",
                "EXTRASUNNY",
                "EXTRASUNNY",
                "EXTRASUNNY",
                "CLEAR",
                "CLEAR",
                "CLEAR",
                "CLEAR",
                "CLEAR",
                "CLOUDS",
                "CLOUDS",
                "CLOUDS",
                "CLOUDS",
                "CLOUDS",
                "SMOG",
                "SMOG",
                "SMOG",
                "FOGGY",
                "FOGGY",
                "FOGGY",
                "OVERCAST",
                "OVERCAST",
                "OVERCAST",
                "CLEARING"
            ];
            break;
        case 3:
            weatherList = [
                "CLEAR",
                "CLEAR",
                "CLOUDS",
                "CLOUDS",
                "CLOUDS",
                "CLOUDS",
                "CLOUDS",
                "CLOUDS",
                "CLOUDS",
                "CLOUDS",
                "CLOUDS",
                "SMOG",
                "SMOG",
                "SMOG",
                "SMOG",
                "SMOG",
                "SMOG",
                "SMOG",
                "SMOG",
                "SMOG",
                "SMOG",
                "SMOG",
                "FOGGY",
                "FOGGY",
                "FOGGY",
                "FOGGY",
                "FOGGY",
                "FOGGY",
                "FOGGY",
                "FOGGY",
                "FOGGY",
                "FOGGY",
                "FOGGY",
                "FOGGY",
                "OVERCAST",
                "OVERCAST",
                "OVERCAST",
                "OVERCAST",
                "OVERCAST",
                "OVERCAST",
                "OVERCAST",
                "OVERCAST",
                "OVERCAST",
                "OVERCAST",
                "OVERCAST",
                "OVERCAST",
                "RAIN",
                "THUNDER",
                "CLEARING"
            ];
            break;
        case 2:
            weatherList = [
                "EXTRASUNNY",
                "EXTRASUNNY",
                "EXTRASUNNY",
                "EXTRASUNNY",
                "EXTRASUNNY",
                "EXTRASUNNY",
                "EXTRASUNNY",
                "EXTRASUNNY",
                "EXTRASUNNY",
                "EXTRASUNNY",
                "EXTRASUNNY",
                "CLEAR",
                "CLEAR",
                "CLEAR",
                "CLEAR",
                "CLEAR",
                "CLOUDS",
                "CLOUDS",
                "CLOUDS",
                "CLOUDS",
                "CLOUDS",
                "SMOG",
                "SMOG",
                "SMOG",
                "FOGGY",
                "FOGGY",
                "FOGGY",
                "OVERCAST",
                "OVERCAST",
                "OVERCAST",
                "CLEARING"
            ];
            break;
    }

    weather.setWeather(weatherList[methods.getRandomInt(0, weatherList.length)]);

    if (_hour > 4 && _hour < 7)
    {
        switch (weather.getWeather())
        {
            case "EXTRASUNNY":
            case "CLEAR":
            case "CLOUDS":
                weather.setWeather("FOGGY");
                break;
        }
    }

    if (_hour > 20)
    {
        switch (weather.getWeather())
        {
            case "EXTRASUNNY":
            case "CLEAR":
            case "CLOUDS":
                weather.setWeather("SMOG");
                break;
        }
    }

    if (weather.getWeather() == "RAIN")
        _windSpeed = methods.getRandomInt(1, 8);
    if (weather.getWeather() == "THUNDER")
        _windSpeed = methods.getRandomInt(9, 12);

    if (_tempNew < 5)
        _windSpeed = methods.getRandomInt(1, 12);

    methods.notifyWithPictureToAll(
        `Life Invader [${weather.getFullRpTime()}]`,
        "~y~Новости погоды",
        `Погода: ~y~${weather.getWeatherName(weather.getWeather())}~s~\nТемпература: ~y~${Math.round(_tempNew)}°C\n~s~Ветер: ~y~${methods.parseFloat(_windSpeed * 1.4).toFixed(1)}m/s\n~c~${weather.getWeatherDesc(weather.getWeather())}`,
        "CHAR_TANISHA",
        1
    );
    mp.players.call('client:managers:weather:nextWeather', [weather.getWeather(), methods.getRandomInt(150, 300)]);
};