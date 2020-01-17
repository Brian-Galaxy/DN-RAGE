import methods from '../modules/methods';
import user from '../user';

let weather = {};

let Day = 1;
let Month = 1;
let Year = 2010;
let Hour = 0;
let Min = 0;
let Sec = 0;
let Temp = 27;
let TempServer = 27;
let DayName = "Понедельник";
let RealHour = 0;
let RealTime = "00:00";
let RealDate = "01/01/1990";
let Players = 0;
let FullRealDateTime = "";
let CurrentWeather = "CLEAR";
let DayNames = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

let WindSpeed = 0;
let WindDir = 0;

weather.nextWeather = function(weatherName, delay) {
    //mp.game.gameplay.setWeatherTypeTransition(CurrentWeather, weatherName, delay);
    CurrentWeather = weatherName;
    mp.game.gameplay.setWeatherTypeOverTime(weatherName, delay);

    console.log('CURRENT WEATHER: ' + weatherName + ':' + delay);

    setTimeout(function () {

        /* TODO чтобы снег лежал, ес че
        SetWeatherTypePersist(weatherList[idx].ToString());
        SetWeatherTypeNowPersist(weatherList[idx].ToString());
        SetWeatherTypeNow(weatherList[idx].ToString());
        SetOverrideWeather(weatherList[idx].ToString());
        */

        if (
            weatherName == "XMAS" ||
            weatherName == "SNOWLIGHT" ||
            weatherName == "BLIZZARD" ||
            weatherName == "SNOW"
        )
        {
            mp.game.graphics.setForceVehicleTrails(true);
            mp.game.graphics.setForcePedFootstepsTracks(true);
            //SetOverrideWeather("XMAS");

            //RequestScriptAudioBank("ICE_FOOTSTEPS", false);
            //RequestScriptAudioBank("SNOW_FOOTSTEPS", false);

            //N_0xc54a08c85ae4d410(3.0f);

            /*RequestNamedPtfxAsset("core_snow");
            while (!HasNamedPtfxAssetLoaded("core_snow"))
                await Delay(10);
            UseParticleFxAssetNextCall("core_snow");*/
        }
        else
        {
            //ReleaseNamedScriptAudioBank("ICE_FOOTSTEPS");
            //ReleaseNamedScriptAudioBank("SNOW_FOOTSTEPS");
            mp.game.graphics.setForceVehicleTrails(false);
            mp.game.graphics.setForcePedFootstepsTracks(false);
            //RemoveNamedPtfxAsset("core_snow");
            //N_0xc54a08c85ae4d410(0.0f);
        }
    }, delay);
};
weather.getWeatherId = function(weatherName) {
    let weatherId = 0;
    switch (weatherName)
    {
        case "CLEAR":
            weatherId = 1;
            break;
        case "CLOUDS":
            weatherId = 2;
            break;
        case "SMOG":
            weatherId = 3;
            break;
        case "FOGGY":
            weatherId = 4;
            break;
        case "OVERCAST":
            weatherId = 5;
            break;
        case "RAIN":
            weatherId = 6;
            break;
        case "THUNDER":
            weatherId = 7;
            break;
        case "CLEARING":
            weatherId = 8;
            break;
        case "XMAS":
            weatherId = 13;
            break;
    }
    return methods.parseInt(weatherId);
};

weather.syncDateTime = function(min, hour, day, month, year) {

    try {
        mp.discord.update('DEDNET | HASKELL', 'dednet.ru');

        DayName = DayNames[new Date(year, month, day).getDay()];

        Day = day;
        Month = month;
        Year = year;
        Hour = hour;
        Min = min;
        Sec = 0;

        Players = mp.players.length;

        mp.game.time.setClockDate(day, month, year);
        mp.game.time.setClockTime(hour, min, Sec);
    }
    catch (e) {
        methods.debug(e);
    }
};

weather.getCurrentDayName = function() {
    return DayName;
};

weather.getMonth = function() {
    return Month;
};

weather.getHour = function() {
    return Hour;
};

weather.getMin = function() {
    return Min;
};

weather.getYear = function() {
    methods.debug('weather.getYear');
    return Year - 2000;
};

weather.getTime = function() {
    return `${methods.digitFormat(Hour)}:${methods.digitFormat(Min)}`;
};

weather.getFullRpDateTime = function() {
    return `${methods.digitFormat(Hour)}:${methods.digitFormat(Min)} | ${methods.digitFormat(Day)}/${methods.digitFormat(Month)}/${Year}`;
};

weather.getFullRpDate = function() {
    return `${methods.digitFormat(Day)}/${methods.digitFormat(Month)}/${Year}`;
};

weather.getFullRpTime = function() {
    return `${methods.digitFormat(Hour)}:${methods.digitFormat(Min)}`;
};

weather.syncRealHour = function(hour) {
    RealHour = hour;
};

weather.syncRealTime = function(time) {
    RealTime = time;
};

weather.syncRealDate = function(date) {
    RealDate = date;
};

weather.getRealDate = function() {
    return RealDate;
};

weather.getRealTime = function() {
    return RealTime;
};

weather.getRealTime = function() {
    return RealHour;
};

weather.syncRealFullDateTime = function(dateTime) {
    FullRealDateTime = dateTime;
};

weather.getRealFullDateTime = function() {
    return FullRealDateTime;
};

weather.syncWeatherTemp = function(temp) {
    Temp = temp;
    TempServer = temp;
};

weather.syncWeatherWind = function(windSpeed, windDir) {
    WindSpeed = windSpeed;
    WindDir = windDir;
};

weather.getWeatherTemp = function() {
    return Temp;
};

weather.getWeatherTempServer = function() {
    return TempServer;
};

weather.secSyncTimer = function() {
    try {
        Sec++;
        if (Sec >= 59)
            Sec = 59;
        mp.game.time.setClockTime(Hour, Min, Sec);
        mp.game.water.setWavesIntensity(WindSpeed);
        mp.game.gameplay.setWindSpeed(WindSpeed + 1);
        mp.game.gameplay.setWindDirection(WindDir);
    }
    catch (e) {

    }
    setTimeout(weather.secSyncTimer, 141);
};

weather.getCurrentWeather = function() {
    return CurrentWeather;
};

weather.strDateToTime = function(date) {
    let dateArray = date.split('/');
    let day = methods.parseInt(dateArray[0]);
    let month = methods.parseInt(dateArray[1]);
    let year = methods.parseInt(dateArray[2]);
    return new Date(year, month, day, 0, 0, 0, 0).getTime();
};


export default weather;