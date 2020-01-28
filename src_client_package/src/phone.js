import methods from './modules/methods';
import ui from "./modules/ui";

import enums from './enums';
import user from './user';

import weather from "./manager/weather";
import dispatcher from "./manager/dispatcher";

let phone = {};

let hidden = true;

phone.show = function() {

    let pType = phone.getType();
    if (user.isCuff() || user.isTie()) {
        mp.game.ui.notifications.show("~r~Вы связаны или в наручниках");
        return;
    }
    if (pType == 0) {
        mp.game.ui.notifications.show("~r~У Вас нет телефона");
        return;
    }

    //mp.gui.chat.activate(false);
    try {

        user.openPhone(pType);

        mp.gui.cursor.show(false, true);
        mp.game.ui.notifications.show("~b~Скрыть телефон на ~s~O~");
        ui.DisableMouseControl = true;
        hidden = false;

        ui.callCef('phone', '{"type": "show"}');
    }
    catch (e) {
        methods.debug(e);
    }
};

phone.showOrHide = function() {

    if (user.isCuff() || user.isTie()) {
        mp.game.ui.notifications.show("~r~Вы связаны или в наручниках");
        return;
    }
    if (phone.getType() == 0) {
        mp.game.ui.notifications.show("~r~У Вас нет телефона");
        return;
    }

    ui.callCef('phone', '{"type": "showOrHide"}');
};

phone.hide = function() {
    //mp.gui.chat.activate(true);
    try {
        user.hidePhone();
        mp.gui.cursor.show(false, false);
        ui.DisableMouseControl = false;
        hidden = true;
        ui.callCef('phone', '{"type": "hide"}');
    }
    catch (e) {
        methods.debug(e);
    }
};

phone.getType = function() {
    return user.getCache('phone_type')
};

phone.timer = function() {
    let pType = phone.getType();
    if (!hidden && pType == 0) {
        phone.hide();
        return;
    }
    else if ( pType == 0) {
        return;
    }

    let data = {
        type: "updateTopBar",
        bar: {
            time: weather.getFullRpTime(),
            battery: 11,
            network: 5,
            temperature: weather.getWeatherTempFormat(),
            date: weather.getCurrentDayName()

        }
    };

    ui.callCef('phone' + pType, JSON.stringify(data));
};

phone.isHide = function() {
    return hidden;
};

phone.apps = function(action) {
    methods.debug(action);
    switch (action) {
        case 'app':
            phone.showAppList();
            break;
        case 'gps':
            phone.showAppGps();
            break;
        default:
            phone.showLoad();
            break;
    }
};

phone.showAppList = function() {
    let menu = {
        UUID: 'apps',
        title: 'Установленные приложения',
        items: [
            {
                title: 'Аккаунт',
                umenu: [
                    {
                        title: user.getCache('name'),
                        text: `${user.getCache('social')}#${user.getCache('id')}`,
                        type: 0,
                        value: 'https://a.rsg.sc//n/' + user.getCache('social').toString().toLowerCase(),
                        params: { name: "null" }
                    }
                ],
            },
            {
                title: 'Приложения',
                umenu: [
                    {
                        title: "UVehicle",
                        text: "Управление вашим транспортом",
                        img: 'car',
                        type: 1,
                        clickable: true,
                        params: { name: "car" }
                    },
                    {
                        title: "Life Invader",
                        text: "Доступная и качественная реклама",
                        img: 'invader',
                        type: 1,
                        clickable: true,
                        params: { name: "invader" }
                    },
                ],
            },
        ],
    };

    if (user.getCache('fraction_id') > 0) {
        let item = {
            title: user.getFractionNameL(),
            text: `Официальное приложение организации ${user.getFractionName()}`,
            img: 'community',
            clickable: true,
            type: 1,
            params: { name: "fraction" }
        };
        menu.items[1].umenu.push(item);
    }
    if (user.getCache('bank_card') > 0) {

        let prefix = user.getBankCardPrefix();

        switch (prefix) {
            case 6000:
            {
                let item = {
                    title: 'Maze Bank',
                    text: `Приложение вашего банка`,
                    img: 'maze',
                    clickable: true,
                    type: 1,
                    params: { name: "bank" }
                };
                menu.items[1].umenu.push(item);
                break;
            }
            case 7000:
            {
                let item = {
                    title: 'Fleeca Bank',
                    text: `Приложение вашего банка`,
                    img: 'fleeca',
                    clickable: true,
                    type: 1,
                    params: { name: "bank" }
                };
                menu.items[1].umenu.push(item);
                break;
            }
            case 8000:
            {
                let item = {
                    title: 'Pacific Standard Bank',
                    text: `Приложение вашего банка`,
                    img: 'pacific',
                    clickable: true,
                    type: 1,
                    params: { name: "bank" }
                };
                menu.items[1].umenu.push(item);
                break;
            }
            case 9000:
            {
                let item = {
                    title: 'Blaine County Savings Bank',
                    text: `Приложение вашего банка`,
                    img: 'blaine',
                    clickable: true,
                    type: 1,
                    params: { name: "bank" }
                };
                menu.items[1].umenu.push(item);
                break;
            }
        }
    }

    phone.showMenu(menu);
};

phone.showAppFraction = function() {

    let menu = {
        UUID: 'fraction',
        title: user.getFractionNameL(),
        items: [
            {
                title: 'Основной раздел',
                umenu: [
                    {
                        title: "Список членов организации",
                        type: 1,
                        clickable: true,
                        params: { name: "list" }
                    },
                    {
                        title: "Список всех отделов и должностей",
                        type: 1,
                        clickable: true,
                        params: { name: "hierarchy" }
                    },
                ],
            },
            {
                title: 'Раздел для лидера',
                umenu: [
                    {
                        title: "Автопарк",
                        type: 1,
                        clickable: true,
                        params: { name: "list" }
                    },
                    {
                        title: "Бюджет",
                        type: 1,
                        clickable: true,
                        params: { name: "list" }
                    },
                    {
                        title: "Лог организации",
                        type: 1,
                        clickable: true,
                        params: { name: "list" }
                    },
                    {
                        title: "Написать новость",
                        type: 1,
                        clickable: true,
                        params: { name: "list" }
                    },
                ],
            },
            {
                title: 'Служебный раздел',
                umenu: [
                    {
                        title: "Диспетчерская",
                        type: 1,
                        clickable: true,
                        params: { name: "dispatcherList" }
                    },
                    {
                        title: "Локальные коды",
                        type: 1,
                        clickable: true,
                        params: { name: "dispatcherLoc" }
                    },
                    {
                        title: "Коды департамента",
                        type: 1,
                        clickable: true,
                        params: { name: "dispatcherDep" }
                    },
                    {
                        title: "Выдать розыск",
                        type: 1,
                        clickable: true,
                        params: { name: "list" }
                    },
                    {
                        title: "Эвакуировать ближайший транспорт",
                        type: 1,
                        clickable: true,
                        params: { name: "destroyVehicle" }
                    },
                    {
                        title: "Написать членам организации",
                        type: 1,
                        clickable: true,
                        params: { name: "list" }
                    },
                ],
            },
        ],
    };

    phone.showMenu(menu);
};

phone.showAppGps = function() {

    let menu = {
        UUID: 'gps',
        title: 'GPS',
        items: [
            {
                title: 'Основной раздел',
                umenu: [
                    {
                        title: "Здание правительства",
                        text: "Получение регистрации, трудоустройство, лицензий и прочее",
                        type: 1,
                        clickable: true,
                        params: {x: -1379, y: -499}
                    },
                    {
                        title: "Частный банк Maze Bank",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: {x: -75, y: -826}
                    },
                    {
                        title: "Частный банк Pacific Standard",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: {x: -235, y: -216}
                    },
                    {
                        title: "Найти ближайший Flecca банк",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: {event: 'server:gps:findFleeca'}
                    },
                    {
                        title: "Частный банк Blaine County",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: {x: -111, y: 6467}
                    },
                    {
                        title: "Бизнес центр Arcadius",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: {x: -139, y: -631}
                    },
                    {
                        title: "Полицейский участок",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: {x: 437, y: -982}
                    },
                    {
                        title: "Шериф департамент Палето-Бей",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: {x: -448, y: 6012}
                    },
                    {
                        title: "Шериф департамент Сенди-Шорс",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: {x: 1853, y: 3686}
                    },
                    {
                        title: "Больница Лос-Сантоса",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: {x: 341, y: -1397}
                    },
                    {
                        title: "Больница Палето-Бей",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: {x: 341, y: -1397}
                    },
                    {
                        title: "Федеральная тюрьма",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: {x: 1830, y: 2603}
                    },
                    {
                        title: "Life Invader",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: {x: -1041, y: -241}
                    },
                ],
            },
            {
                title: 'Магазины и прочее',
                umenu: [
                    {
                        title: "Найти ближайшую аптеку",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { event: 'server:gps:findApt' }
                    },
                    {
                        title: "Найти ближайший магазин электронной техники",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { event: 'server:gps:findEl' }
                    },
                    {
                        title: "Найти ближайший магазин 24/7",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { event: 'server:gps:find247' }
                    },
                    {
                        title: "Найти ближайший магазин алкогольный магазин",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { event: 'server:gps:findAlc' }
                    },
                    {
                        title: "Найти ближайшую заправку",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { event: 'server:gps:findFuel' }
                    },
                    {
                        title: "Найти ближайший пункт аренды",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { event: 'server:gps:findRent' }
                    },
                    {
                        title: "Найти ближайший бар/клуб",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { event: 'server:gps:findBar' }
                    },
                    {
                        title: "Найти ближайший магазин оружия",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { event: 'server:gps:findGunShop' }
                    },
                    {
                        title: "Найти ближайший тату салон",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { event: 'server:gps:findTattooShop' }
                    },
                    {
                        title: "Найти ближайший барбершоп",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { event: 'server:gps:findBarberShop' }
                    },
                    {
                        title: "Найти ближайшую автомастерскую",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { event: 'server:gps:findLsc' }
                    },
                    {
                        title: "Найти ближайшую автомойку",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { event: 'server:gps:findCarWash' }
                    },
                    {
                        title: "Магазин масок",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -1337, y: -1277 }
                    },
                    {
                        title: "Магазин принтов",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -1234, y: -1477 }
                    },
                ],
            },
            {
                title: 'Интересные места',
                umenu: [
                    {
                        title: "Международный аэропорт",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -1037, y: -2737 }
                    },
                    {
                        title: "Аэропорт Сэнди-Шорс",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 1722, y: 3255 }
                    },
                    {
                        title: "Аэропорт Грейпсид",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 2138, y: 4812 }
                    },
                    {
                        title: "Спортзал",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -1204, y: -1564 }
                    },
                    {
                        title: "Площадь Лос-Сантоса",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 161, y: -993 }
                    },
                    {
                        title: "Торговый центр Mega Moll",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 46, y: -1753 }
                    },
                    {
                        title: "Стриптиз Клуб",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 105, y: -1291 }
                    },
                    {
                        title: "Бар Tequila",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -562, y: 286 }
                    },
                    {
                        title: "Бар Yellow Jack",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 1986, y: 3054 }
                    },
                    {
                        title: "Байкерский Клуб",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 988, y: -96 }
                    },
                    {
                        title: "Comedy Club",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -450, y: 280 }
                    },
                    {
                        title: "Пляж",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -1581, y: -1162 }
                    },
                    {
                        title: "Надпись VineWood",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 716, y: 1203 }
                    },
                    {
                        title: "Сцена-1",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 226, y: 1173 }
                    },
                    {
                        title: "Сцена-2",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 689, y: 602 }
                    },
                    {
                        title: "Библиотека Рокфорд-Хиллз",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -615, y: -146 }
                    },
                    {
                        title: "Гольф-клуб",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -1375, y: 55 }
                    },
                    {
                        title: "Музей Пасифик-Блаффс",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -2291, y: 367 }
                    },
                    {
                        title: "Университет Сан-Андреас",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -1636, y: 180 }
                    },
                    {
                        title: "Миррор-Парк",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 1080, y: -693 }
                    },
                    {
                        title: "Парк Маленький Сеул",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -880, y: -809 }
                    },
                    {
                        title: "Коттеджный парк",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -940, y: 303 }
                    },
                    {
                        title: "Казино Лос-Сантос",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 928, y: 44 }
                    },
                    {
                        title: "Ипподром",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 1138, y: 106 }
                    },
                    {
                        title: "Weazel News",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -598, y: -929 }
                    },
                    {
                        title: "Обсерватория Галилео",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -429, y: 1109 }
                    },
                    {
                        title: "Восточный Театр",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 301, y: 203 }
                    },
                    {
                        title: "Десять центов Театр",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 393, y: -711 }
                    },
                    {
                        title: "Вальдез Театр",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -721, y: -684 }
                    },
                    {
                        title: "Richards  Majestic",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -1052, y: -478 }
                    },
                    {
                        title: "Здание суда",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 322, y: -1625 }
                    },
                    {
                        title: "City Hall Alta",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 236, y: -409 }
                    },
                    {
                        title: "City Hall Del Perro",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -1285, y: -567 }
                    },
                    {
                        title: "City Hall Rockford-Hills",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -545, y: -203 }
                    },
                    {
                        title: "Виноградник",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -1887, y: 2051 }
                    },
                    {
                        title: "Церковь Рокфорд-Хиллз",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -766, y: -23 }
                    },
                    {
                        title: "Церковь Маленький Сиул",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -759, y: -709 }
                    },
                    {
                        title: "Церковь Южный Лос-Сантос",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 20, y: -1505 }
                    },
                    {
                        title: "Церковь Сэнди-Шорс",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -324, y: 2817 }
                    },
                    {
                        title: "Церковь Дель-Перро",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -1681, y: -290 }
                    },
                    {
                        title: "Церковь Палето-Бэй",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -329, y: 6150 }
                    },
                    {
                        title: "Rebel Radio",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 732, y: 2523 }
                    },
                    {
                        title: "Озеро Аламо-Си",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 1578, y: 3835 }
                    },
                    {
                        title: "Заповедник Сэнди-Шорс",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -1638, y: 4725 }
                    },
                    {
                        title: "Пирс Дель-Перро",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -1604, y: -1048 }
                    },
                    {
                        title: "Пирс Веспуччи",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -3265, y: 947 }
                    },
                    {
                        title: "Пирс Палето-Бэй",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -213, y: 6572 }
                    },
                    {
                        title: "Гора Чиллиад",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 501, y: 5603 }
                    },
                    {
                        title: "Гора Гордо",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 2877, y: 5910 }
                    },
                    {
                        title: "Maze Bank Arena",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -254, y: -2026 }
                    },
                    {
                        title: "Карьер",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 2906, y: 2803 }
                    },
                    {
                        title: "Электростанция",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 2661, y: 1641 }
                    },
                    {
                        title: "Дамба",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 1662, y: -13 }
                    },
                    {
                        title: "Швейная фабрика",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 718, y: -975 }
                    },
                    {
                        title: "Скотобойня",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 961, y: -2185 }
                    },
                    {
                        title: "Лесопилка Палето-Бэй",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -565, y: 5325 }
                    },
                    {
                        title: "Литейный завод",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 1083, y: -1974 }
                    },
                    {
                        title: "Завод по переработке отходов",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -609, y: -1609 }
                    },
                    {
                        title: "Цементный завод",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 266, y: 2849 }
                    },
                    {
                        title: "Центр переработки металлолома",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 2340, y: 3136 }
                    },
                ],
            }
        ],
    };

    phone.showMenu(menu);
};

phone.showAppFractionHierarchy = function() {

    let fractionItem = enums.fractionListId[user.getCache('fraction_id')];
    let menu = {
        UUID: 'fraction_hierarchy',
        title: `Иерархия - ${user.getFractionName()}`,
        items: [
            {
                title: 'Руководство',
                umenu: [
                    {
                        title: fractionItem.leaderName,
                        type: 1,
                        params: { name: "none" }
                    },
                    {
                        title: fractionItem.subLeaderName,
                        type: 1,
                        params: { name: "none" }
                    },
                ],
            }
        ]
    };

    fractionItem.departmentList.forEach((item, i) => {
        let menuItem = {
            title: item,
            umenu: [],
        };

        fractionItem.rankList[i].forEach((rank, ri) => {
            let desc = '';
            if (ri == 0)
                desc = 'Глава отдела';
            else if(ri == 1)
                desc = 'Зам. главы отдела';
            menuItem.umenu.push(
                {
                    title: rank,
                    text: desc,
                    type: 1,
                    params: { name: "none" }
                },
            );
        });

        menu.items.push(menuItem);
    });

    phone.showMenu(menu);
};

phone.showAppFractionDispatcherList = function() {

    try {
        let menu = {
            UUID: 'fraction',
            title: `Диспетчерская`,
            items: []
        };

        let menuItem = {
            title: 'Список вызовов',
            umenu: [],
        };

        dispatcher.getItemList().forEach((item, i) => {
            if (i > 50)
                return;
            try {
                let itemSmall = phone.getMenuItem(
                    `${i}. ${item.title} [${item.time}]`,
                    `Район: ${item.street1}`,
                    { name: "dispatcherAccept", title: item.title, desc: item.desc, street1: item.street1, withCoord: item.withCoord, posX: item.x, posY: item.y },
                    1,
                    '',
                    true,
                );
                menuItem.umenu.push(itemSmall);
            }
            catch (e) {
                methods.debug(e);
            }
        });

        menu.items.push(menuItem);
        phone.showMenu(menu);
    }
    catch (e) {
        methods.debug(e);
    }
};

phone.showAppFractionDispatcherLoc = function() {

    let menu = {
        UUID: 'fraction',
        title: `Диспетчерская`,
        items: []
    };

    let menuItem = {
        title: 'Локальные коды',
        umenu: [],
    };

    let item = phone.getMenuItem(
        'Код 0',
        'Необходима немедленная поддержка',
        { name: "codeLoc", code: 0, codeDesc: `${user.getCache('name')} - запрашивает поддержку` },
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    item = phone.getMenuItem(
        'Код 1',
        'Офицер в бедственном положении',
        { name: "codeLoc", code: 1, codeDesc: `${user.getCache('name')} - в бедственном положении` },
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    item = phone.getMenuItem(
        'Код 2',
        'Приоритетный вызов (Без сирен / Со стобоскопами)',
        { name: "codeLoc", code: 2, codeDesc: `${user.getCache('name')} - запрашивает поддержку` },
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    item = phone.getMenuItem(
        'Код 3',
        'Срочный вызов (Сирены, Стробоскопы)',
        { name: "codeLoc", code: 3, codeDesc: `${user.getCache('name')} - запрашивает поддержку` },
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    item = phone.getMenuItem(
        'Код 4',
        'Помощь не требуется. Все спокойно.',
        { name: "codeLoc", code: 4, codeDesc: `${user.getCache('name')} - все спокойно` },
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    item = phone.getMenuItem(
        'Код 6',
        'Задерживаюсь на месте',
        { name: "codeLoc", code: 6, codeDesc: `${user.getCache('name')} - задерживается на месте` },
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    item = phone.getMenuItem(
        'Код 7',
        'Перерыв на обед',
        { name: "codeLoc", code: 7, codeDesc: `${user.getCache('name')} - вышел на обед` },
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    menu.items.push(menuItem);
    phone.showMenu(menu);
};

phone.showAppFractionDispatcherDep = function() {

    let menu = {
        UUID: 'fraction',
        title: `Диспетчерская`,
        items: []
    };

    let menuItem = {
        title: 'Коды департамента',
        umenu: [],
    };

    let item = phone.getMenuItem(
        'Код 0',
        'Необходима немедленная поддержка',
        { name: "codeDep", code: 0, codeDesc: `${user.getCache('name')} - запрашивает поддержку` },
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    item = phone.getMenuItem(
        'Код 1',
        'Офицер в бедственном положении',
        { name: "codeDep", code: 1, codeDesc: `${user.getCache('name')} - в бедственном положении` },
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    item = phone.getMenuItem(
        'Код 2',
        'Приоритетный вызов (Без сирен / Со стобоскопами)',
        { name: "codeDep", code: 2, codeDesc: `${user.getCache('name')} - запрашивает поддержку` },
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    item = phone.getMenuItem(
        'Код 3',
        'Срочный вызов (Сирены, Стробоскопы)',
        { name: "codeDep", code: 3, codeDesc: `${user.getCache('name')} - запрашивает поддержку` },
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    item = phone.getMenuItem(
        'Код 4',
        'Помощь не требуется. Все спокойно.',
        { name: "codeDep", code: 4, codeDesc: `${user.getCache('name')} - все спокойно` },
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    item = phone.getMenuItem(
        'Код 6',
        'Задерживаюсь на месте',
        { name: "codeDep", code: 6, codeDesc: `${user.getCache('name')} - задерживается на месте` },
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    item = phone.getMenuItem(
        'Код 7',
        'Перерыв на обед',
        { name: "codeDep", code: 7, codeDesc: `${user.getCache('name')} - вышел на обед` },
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    menu.items.push(menuItem);
    phone.showMenu(menu);
};

phone.showLoad = function() {
    let menu = {
        UUID: 'load',
        title: 'Идёт загрузка',
        items: [
            {
                title: '',
                umenu: [
                    {
                        title: "Ваше приложение загружается...",
                        type: 1,
                        params: { name: "loading" }
                    }
                ],
            },
        ],
    };

    phone.showMenu(menu);
};

phone.showMenu = function(menu) {
    let data = {
        type: 'updateMenu',
        menu: menu
    };

    methods.debug('showMenu', menu);

    ui.callCef('phone' + phone.getType(), JSON.stringify(data));
};

phone.getMenuItem = function(title, text, params = { name: "null" }, type = 1, img = undefined, clickable = false, value = undefined, background = undefined) {
    return {
        title: title,
        text: text,
        type: type,
        img: img,
        background: background,
        clickable: clickable,
        value: value,
        params: params
    };
};

phone.getMenuItemTitle = function(title, text, params = { name: "null" }, img = undefined, clickable = false, background = undefined) {
    return {
        title: title,
        text: text,
        type: 0,
        img: img,
        background: background,
        clickable: clickable,
        params: params
    };
};

phone.getMenuItemButton = function(title, text, params = { name: "null" }, img = undefined, clickable = false, background = undefined) {
    return {
        title: title,
        text: text,
        type: 1,
        img: img,
        background: background,
        clickable: clickable,
        params: params
    };
};

phone.getMenuItemCheckbox = function(title, text, checked = false, params = { name: "null" }, img = undefined, clickable = false, background = undefined) {
    return {
        title: title,
        text: text,
        type: 2,
        img: img,
        value: checked,
        background: background,
        clickable: clickable,
        params: params
    };
};

phone.getMenuItemUser = function(title, text, isOnline = false, params = { name: "null" }, img = undefined, clickable = false, background = undefined) {
    return {
        title: title,
        text: text,
        type: 4,
        img: img,
        online: isOnline,
        background: background,
        clickable: clickable,
        params: params
    };
};

phone.getMenuItemRadio = function(title, text, selectTitle, selectItems, params = { name: "null" }, img = undefined, clickable = false, background = undefined) {
    return {
        title: title,
        text: text,
        type: 5,
        img: img,
        background: background,
        clickable: clickable,
        scrollbarTitle: selectTitle,
        scrollbar: selectItems,
        params: params
    };
};

phone.getMenuItemImg = function(height = 150, params = { name: "null" }, img = undefined, clickable = false, background = undefined) {
    return {
        type: 6,
        img: img,
        background: background,
        clickable: clickable,
        height: height,
        params: params
    };
};

phone.getMenuItemModal = function(title, text, modalTitle, modalText, modalYes = 'Применить', modalNo = 'Отмена', params = { name: "null" }, img = undefined, clickable = false, background = undefined) {
    return {
        title: title,
        text: text,
        type: 7,
        modalTitle: modalTitle,
        modalText: modalText,
        modalButton: [modalNo, modalYes],
        img: img,
        background: background,
        clickable: clickable,
        params: params
    };
};

phone.getMenuMainItem = function(title, items) {
    return {
        title: title,
        umenu: items,
    };
};

phone.callBack = function(action, menu, id, ...args) {
    methods.debug(action, menu, id, ...args);
    if (action == 'button')
        phone.callBackButton(menu, id, ...args);
    else if (action == 'radio')
        phone.callBackRadio(menu, id, ...args);
    else if (action == 'modal')
        phone.callBackModal(menu);
    else
        phone.callBackCheckbox(menu, id, ...args);
};

phone.callBackRadio = function(checked, id, ...args) {
    methods.debug(checked, id, ...args);

    try {
        let params = JSON.parse(args[0]);
        if (params.name == 'memberNewRank') {
            mp.events.callRemote('server:user:newRank', params.memberId, params.rankId);
            phone.showAppFraction();
        }
        if (params.name == 'memberNewDep') {
            mp.events.callRemote('server:user:newDep', params.memberId, params.depId);
            phone.showAppFraction();
        }
    }
    catch(e) {
        methods.debug(e);
    }
};

phone.callBackModal = function(paramsJson) {
    try {
        let params = JSON.parse(paramsJson);
        if (params.name == 'memberUninvite') {
            mp.events.callRemote('server:user:uninvite', params.memberId);
            phone.showAppFraction();
        }
        if (params.name == 'memberGiveSubLeader') {
            mp.events.callRemote('server:user:giveSubLeader', params.memberId);
            phone.showAppFraction();
        }
        if (params.name == 'memberTakeSubLeader') {
            mp.events.callRemote('server:user:takeSubLeader', params.memberId);
            phone.showAppFraction();
        }
    }
    catch(e) {
        methods.debug(e);
    }
};

phone.callBackButton = function(menu, id, ...args) {
    try {
        let params = JSON.parse(args[0]);
        if (menu == 'fraction') {
            if (params.name == 'hierarchy')
                phone.showAppFractionHierarchy();
            else if (params.name == 'list') {
                mp.events.callRemote('server:phone:fractionList', user.getCache('fraction_id'));
                phone.showLoad();
            }
            else if (params.name == 'destroyVehicle') {
                mp.events.callRemote('server:respawnNearstVehicle');
            }
            else if (params.name == 'dispatcherList') {
                phone.showAppFractionDispatcherList();
            }
            else if (params.name == 'dispatcherAccept') {
                dispatcher.sendNotificationFraction(
                    "10-4 - 911",
                    `${user.getRankName()} ${user.getCache('name')} принял вызов \"${params.title}\"`,
                    `~y~Детали: ~s~${params.desc}`, `~y~Район: ~s~${params.street1}`,
                    user.getCache('fraction_id')
                );
                if (params.posX)
                    user.setWaypoint(params.posX, params.posY);
            }
            else if (params.name == 'dispatcherLoc') {
                phone.showAppFractionDispatcherLoc();
            }
            else if (params.name == 'dispatcherDep') {
                phone.showAppFractionDispatcherDep();
            }
            else if (params.name == 'memberAction') {
                mp.events.callRemote('server:phone:memberAction', params.memberId);
                phone.showLoad();
            }
            else if (params.name == 'codeLoc') {
                dispatcher.sendLocal(`Код ${params.code}`, params.codeDesc);
            }
            else if (params.name == 'codeDep') {
                dispatcher.send(`Код ${params.code}`, params.codeDesc);
            }
        }
        if (menu == 'apps') {
            if (params.name == 'fraction')
                phone.showAppFraction();
        }
        if (menu == 'gps') {
            if (params.x)
                user.setWaypoint(params.x, params.y);
            if (params.event)
                mp.events.callRemote(params.event);
        }
    }
    catch (e) {
        methods.debug(e)
    }
};

phone.callBackCheckbox = function(menu, id, ...args) {
    try {
        let checked = args[0];
        let params = JSON.parse(args[1]);
    }
    catch (e) {
        methods.debug(e);
    }
};

phone.types = {
    title: 0,
    default: 1,
    checkbox: 2,
};

export default phone;