import methods from './modules/methods';
import ui from "./modules/ui";

import enums from './enums';
import user from './user';
import coffer from './coffer';

import weather from "./manager/weather";
import dispatcher from "./manager/dispatcher";
import bind from "./manager/bind";

import fraction from "./property/fraction";

let phone = {};

let hidden = true;
phone.network = 0;

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
        mp.game.ui.notifications.show(`~b~Скрыть телефон на ~s~${bind.getKeyName(user.getCache('s_bind_phone'))}`);
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

phone.isHide = function() {
    return hidden;
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

    if (phone.network == 0) {
        let data = {
            type: "updateTopBar",
            bar: {
                time: weather.getFullRpTime(),
                battery: 11,
                network: phone.network,
                temperature: '',
                date: 'Поиск сети...'

            }
        };
        ui.callCef('phone' + pType, JSON.stringify(data));
    }
    else {
        let data = {
            type: "updateTopBar",
            bar: {
                time: weather.getFullRpTime(),
                battery: 11,
                network: phone.network,
                temperature: weather.getWeatherTempFormat(),
                date: weather.getCurrentDayName()

            }
        };
        ui.callCef('phone' + pType, JSON.stringify(data));
    }
};

phone.apps = function(action) {
    methods.debug(action);

    if (phone.network == 0) {
        phone.showNoNetwork();
        return;
    }

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
                    },
                    {
                        title: 'Личная история',
                        type: 1,
                        params: { name: 'myHistory' },
                        clickable: true
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
    if (user.getCache('fraction_id2') > 0) {
        let item = {
            title: 'Меню вашей организации',
            text: ``,
            img: 'community',
            clickable: true,
            type: 1,
            params: { name: "fraction2" }
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
            case 8000:
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

    let item = {
        title: 'E-Corp',
        text: `Ваш надежный кошелёк`,
        img: 'community',
        clickable: true,
        type: 1,
        params: { name: "ecorp" }
    };
    menu.items[1].umenu.push(item);

    phone.showMenu(menu);
};

phone.showAppBank= function() {

    let bankName = '';
    let bankColor = '#000';

    let cardPrefix = user.getBankCardPrefix();

    switch (cardPrefix) {
        case 6000:
            bankName = 'Maze Bank';
            bankColor = '#f44336';
            break;
        case 7000:
            bankName = 'Pacific Bank';
            bankColor = '#000';
            break;
        case 8000:
            bankName = 'Fleeca Bank';
            bankColor = '#4CAF50';
            break;
        case 9000:
            bankName = 'Blaine Bank';
            bankColor = '#2196F3';
            break;
    }

    let menu = {
        UUID: 'bank',
        title: bankName,
        items: [
            {
                title: '',
                umenu: [
                    {
                        title: bankName,
                        text: methods.bankFormat(user.getCache('bank_card')),
                        name: user.getCache('bank_owner'),
                        color: bankColor,
                        type: 9,
                        clickable: false,
                        params: { name: "null" }
                    },
                    {
                        title: "Состояние счёта",
                        text: methods.moneyFormat(user.getBankMoney(), 999999999),
                        type: 1,
                        clickable: false,
                        params: {name: "none"}
                    },
                    {
                        title: "Зарплатный счёт",
                        text: methods.moneyFormat(user.getPayDayMoney(), 999999999),
                        type: 1,
                        clickable: false,
                        params: {name: "none" }
                    },
                    {
                        title: "Обналичить зарплату",
                        modalTitle: 'Введите сумму',
                        modalButton: ['Отмена', 'Обналичить'],
                        type: 8,
                        clickable: true,
                        params: {name: "getPayDay"}
                    },
                    /*{
                        title: "Оплата налогов",
                        type: 1,
                        clickable: true,
                        params: {name: "tax"}
                    },
                    {
                        title: "Перевод средств",
                        type: 1,
                        clickable: true,
                        params: {name: "trans"}
                    },*/
                    {
                        title: "История транзакций",
                        type: 1,
                        clickable: true,
                        params: {name: "history"}
                    },
                ],
            },
        ],
    };

    phone.showMenu(menu);
};


phone.showAppEcorp= function() {
    let menu = {
        UUID: 'ecorp',
        title: 'ECorp',
        items: [
            {
                title: '',
                umenu: [
                    {
                        title: user.getCache('name'),
                        text: `${methods.numberFormat(user.getCryptoMoney())}₠`,
                        type: 0,
                        value: 'https://a.rsg.sc//n/' + user.getCache('social').toString().toLowerCase(),
                        params: { name: "null" }
                    },
                    {
                        title: "Ваш кошелёк",
                        text: user.getCache('crypto_card'),
                        modalTitle: 'Выделить: CTRL+A',
                        modalValue: user.getCache('crypto_card'),
                        modalButton: ['', 'Закрыть'],
                        type: 8,
                        clickable: true,
                        params: {name: "null"}
                    },
                ],
            },
        ],
    };

    if (user.getCache('bank_card') > 0) {
        let item ={
                title: "Обменять $ на ₠",
                text: 'Курс: $1,000 = 1₠',
                modalTitle: 'Сколько ₠ вы хотите купить',
                modalButton: ['Закрыть', 'Перевести'],
                type: 8,
                clickable: true,
                params: {name: "moneyToCrypto"}
        };
        menu.items[0].umenu.push(item);

        item ={
                title: "Обменять ₠ на $",
                text: 'Курс: 1₠ = $1,000',
                modalTitle: 'Сколько ₠ вы хотите обменять',
                modalButton: ['Закрыть', 'Перевести'],
                type: 8,
                clickable: true,
                params: {name: "cryptoToMoney"}
        };
        menu.items[0].umenu.push(item);
    }

    if (user.getCache('fraction_id2') > 0) {
        let item ={
                title: "Перевести E-Coin",
                text: 'Перевод E-Coin на счет вашей организации',
                modalTitle: 'Сколько ₠ вы хотите перевести',
                modalButton: ['Закрыть', 'Перевести'],
                type: 8,
                clickable: true,
                params: {name: "cryptoToFraction"}
        };
        menu.items[0].umenu.push(item);
    }

    if (user.getCache('rep') < 400) {
        let item = {
            title: 'Получить задание на угон',
            text: ``,
            img: '',
            clickable: true,
            type: 1,
            params: { name: "ecorp" }
        };
        menu.items[0].umenu.push(item);

        if (user.getCache('rep') < 300) {
            let item = {
                title: 'Список организаций',
                text: ``,
                img: '',
                clickable: true,
                type: 1,
                params: { name: "fractionList" }
            };
            menu.items[0].umenu.push(item);
        }
    }
    if (user.getCache('rep') < 100 && user.getCache('fraction_id2') == 0) {
        let item = {
            title: 'Создать свою организацию',
            text: ``,
            img: '',
            clickable: true,
            type: 1,
            params: { name: "createFraction" }
        };
        menu.items[0].umenu.push(item);
    }

    phone.showMenu(menu);
};

phone.showAppInvader= function() {

    let menu = {
        UUID: 'invader',
        title: 'Life Invader',
        items: [
            {
                title: 'Основной раздел',
                umenu: [
                    {
                        title: user.getCache('name'),
                        text: `${user.getCache('social')}#${user.getCache('id')}`,
                        type: 0,
                        value: 'https://a.rsg.sc//n/' + user.getCache('social').toString().toLowerCase(),
                        params: { name: "null" }
                    },
                    {
                        title: "Новости",
                        type: 1,
                        clickable: true,
                        params: {name: "newsList"}
                    },
                    {
                        title: "Подача объявления",
                        text: `Стоимость $500`,
                        modalTitle: 'Введите текст',
                        modalButton: ['Отмена', 'Отправить'],
                        type: 8,
                        clickable: true,
                        params: {name: "sendAd"}
                    },
                    {
                        title: "Список объявлений",
                        type: 1,
                        clickable: true,
                        params: {name: "adList"}
                    },
                ],
            },
        ],
    };

    phone.showMenu(menu);
};

phone.showAppFraction2 = function() {

    let menu = {
        UUID: 'fraction2',
        title: 'Ваша организация',
        items: [
            {
                title: 'Основной раздел',
                umenu: [
                    {
                        title: "Список членов организации",
                        type: 1,
                        clickable: true,
                        params: {name: "list"}
                    },
                    {
                        title: "Иерархия",
                        type: 1,
                        clickable: true,
                        params: {name: "hierarchy"}
                    },
                ],
            },
        ],
    };

    let titleMenu = {
        title: 'Борьба за груз',
        umenu: [
            {
                title: "Учавствовать в операции",
                text: "Груз будет отмечен на карте",
                type: 1,
                clickable: true,
                params: { name: "goCargo" }
            },
        ],
    };
    menu.items.push(titleMenu);


    if (user.isLeader2() || user.isSubLeader2()) {
        let titleMenu = {
            title: 'Раздел для руководства',
            umenu: [
                {
                    title: "Лог организации",
                    type: 1,
                    clickable: true,
                    params: { name: "log" }
                },
                {
                    title: "Принять в организацию",
                    modalTitle: 'Введите ID',
                    modalButton: ['Отмена', 'Принять'],
                    type: 8,
                    clickable: true,
                    params: { name: "inviteFraction2" }
                },
            ],
        };
        menu.items.push(titleMenu);
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
        ],
    };

    if (user.isGos()) {
        let titleMenu = {
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
                    title: "Написать членам организации",
                    modalTitle: 'Введите текст',
                    modalButton: ['Отмена', 'Отправить'],
                    type: 8,
                    clickable: true,
                    params: { name: "sendFractionMessage" }
                },
            ],
        };

        if (user.isSapd() || user.isSheriff() || user.isFib()) {
            titleMenu.umenu.push(
                {
                    title: "Выдать розыск",
                    modalTitle: 'Card ID, Кол-во, Причина',
                    modalButton: ['Отмена', 'Выдать'],
                    type: 8,
                    clickable: true,
                    params: { name: "giveWanted" }
                },
                {
                    title: "Эвакуировать ближайший транспорт",
                    type: 1,
                    clickable: true,
                    params: { name: "destroyVehicle" }
                }
            );

            if (!(user.getCache('rank') >= 2 && user.getCache('rank_type') == 0))
                titleMenu.umenu.push(
                    {
                        title: "Информация о человеке",
                        modalTitle: 'Card ID или Имя Фамилия',
                        modalButton: ['Отмена', 'Поиск'],
                        type: 8,
                        clickable: true,
                        params: { name: "getUserInfo" }
                    }
                );
        }
        if (user.isEms()) {
            titleMenu.umenu.push(
                {
                    title: "Эвакуировать ближайший транспорт",
                    type: 1,
                    clickable: true,
                    params: { name: "destroyVehicle" }
                }
            );
        }
        menu.items.push(titleMenu);
    }

    if (user.isLeader() || user.isSubLeader() || user.isDepLeader()) {
        let titleMenu = {
            title: 'Раздел для руководства',
            umenu: [
                {
                    title: "Лог организации",
                    type: 1,
                    clickable: true,
                    params: { name: "log" }
                },
                {
                    title: "Написать новость",
                    modalTitle: 'Введите текст',
                    modalButton: ['Отмена', 'Отправить'],
                    type: 8,
                    clickable: true,
                    params: { name: "sendFractionNews" }
                },
                {
                    title: "Управление автопарком",
                    type: 1,
                    clickable: true,
                    params: { name: "vehicles" }
                },
            ],
        };

        if (user.isLeader()) {
            titleMenu.umenu.push(
                {
                    title: "Управление бюджетом",
                    type: 1,
                    clickable: true,
                    params: { name: "money" }
                }
            );
        }
        menu.items.push(titleMenu);
    }

    phone.showMenu(menu);
};

phone.showAppVehicle = function() {

    let menu = {
        UUID: 'vehicle',
        title: 'Ваши автомобили',
        items: [],
    };

    for (let i = 1; i <= 10; i++) {
        if (user.getCache('car_id' + i) > 0) {
            let subItems = [];

            let item = phone.getMenuItemButton(
                'Вызвать эвакуатор',
                'Стоимость: $500',
                { name: "respawn", slot: i },
                '',
                true,
            );
            subItems.push(item);

            item = phone.getMenuItemButton(
                'Узнать местоположение',
                '',
                { name: "getPos", slot: i },
                '',
                true,
            );
            subItems.push(item);

            item = phone.getMenuItemButton(
                'Открыть / Закрыть двери',
                'Удаленное управление транспортом',
                { name: "lock", slot: i },
                '',
                true,
            );
            subItems.push(item);

            item = phone.getMenuItemButton(
                'Запустить / Заглушить двигатель',
                'Удаленное управление транспортом',
                { name: "engine", slot: i },
                '',
                true,
            );
            subItems.push(item);

            menu.items.push(phone.getMenuMainItem('Слот #' + i, subItems));
        }
    }

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

phone.showAppFractionHierarchy2 = async function() {

    let fractionItem = await fraction.getData(user.getCache('fraction_id2'));
    let fractionItemRanks = JSON.parse(fractionItem.get('rank_list'));
    let fractionItemDep = JSON.parse(fractionItem.get('rank_type_list'));

    if (user.isLeader2()) {
        try {
            let menu = {
                UUID: 'fraction_hierarchy2',
                title: `Иерархия - ${fractionItem.get('name')}`,
                items: [
                    {
                        title: 'Основной раздел',
                        umenu: [
                            {
                                title: fractionItem.get('name'),
                                modalTitle: 'Введите название организации',
                                modalValue: fractionItem.get('name'),
                                modalButton: ['Отмена', 'Переименовать'],
                                type: 8,
                                params: { name: "editFractionName" },
                                clickable: true,
                            },
                            {
                                title: 'Создать новый раздел',
                                modalTitle: 'Введите название раздела',
                                modalButton: ['Отмена', 'Создать'],
                                type: 8,
                                params: { name: "createFractionDep" },
                                clickable: true,
                            },
                        ],
                    },
                    {
                        title: 'Руководство',
                        umenu: [
                            {
                                title: fractionItem.get('rank_leader'),
                                modalTitle: 'Введите название ранга',
                                modalValue: fractionItem.get('rank_leader'),
                                modalButton: ['Отмена', 'Редактировать'],
                                type: 8,
                                params: { name: "editFractionLeader" },
                                clickable: true,
                            },
                            {
                                title: fractionItem.get('rank_sub_leader'),
                                modalTitle: 'Введите название ранга',
                                modalValue: fractionItem.get('rank_sub_leader'),
                                modalButton: ['Отмена', 'Редактировать'],
                                type: 8,
                                params: { name: "editFractionSubLeader" },
                                clickable: true,
                            },
                        ],
                    }
                ]
            };

            fractionItemDep.forEach((item, i) => {
                let menuItem = {
                    title: item,
                    umenu: [],
                };

                fractionItemRanks[i].forEach((rank, ri) => {
                    let desc = '';
                    if (ri == 0)
                        desc = 'Глава';
                    else if(ri == 1)
                        desc = 'Зам. главы';
                    menuItem.umenu.push(
                        {
                            title: rank,
                            text: desc,
                            modalTitle: 'Введите название ранга',
                            modalValue: rank,
                            modalButton: ['Отмена', 'Редактировать'],
                            type: 8,
                            params: { name: "editFractionRank", rankId: ri, depId: i },
                            clickable: true,
                        },
                    );
                });

                if (i > 0) {
                    menuItem.umenu.push(
                        {
                            title: 'Добавить должность',
                            text: '',
                            modalTitle: 'Введите название ранга',
                            modalButton: ['Отмена', 'Добавить'],
                            type: 8,
                            params: { name: "addFractionRank", depId: i },
                            clickable: true,
                        },
                    );
                    menuItem.umenu.push(
                        {
                            title: 'Редактировать название раздела',
                            text: '',
                            modalTitle: 'Введите название раздела',
                            modalValue: item,
                            modalButton: ['Отмена', 'Добавить'],
                            type: 8,
                            params: { name: "editFractionDep", depId: i },
                            clickable: true,
                        },
                    );

                    if (i == (fractionItemDep.length - 1)) {
                        menuItem.umenu.push(
                            {
                                title: 'Удалить раздел',
                                text: '',
                                modalTitle: 'Вы точно хотите удалить?',
                                modalButton: ['Отмена', 'Удалить'],
                                type: 7,
                                params: { name: "deleteFractionDep" },
                                clickable: true,
                            },
                        );
                    }
                }

                menu.items.push(menuItem);
            });

            phone.showMenu(menu);
        }
        catch (e) {
            methods.debug(e);
        }
    }
    else {

        let menu = {
            UUID: 'fraction_hierarchy2',
            title: `Иерархия - ${fractionItem.get('name')}`,
            items: [
                {
                    title: 'Руководство',
                    umenu: [
                        {
                            title: fractionItem.get('rank_leader'),
                            type: 1,
                            params: { name: "none" }
                        },
                        {
                            title: fractionItem.get('rank_sub_leader'),
                            type: 1,
                            params: { name: "none" }
                        },
                    ],
                }
            ]
        };

        fractionItemDep.forEach((item, i) => {
            let menuItem = {
                title: item,
                umenu: [],
            };

            fractionItemRanks[i].forEach((rank, ri) => {
                let desc = '';
                if (ri == 0)
                    desc = 'Глава';
                else if(ri == 1)
                    desc = 'Зам. главы';
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
    }
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

phone.showNoNetwork = function() {
    let menu = {
        UUID: 'error',
        title: 'Ошибка',
        items: [
            {
                title: 'Нет сети...',
                umenu: [
                    {
                        title: "Приложение не работает без подключения к сети",
                        type: 1,
                        params: { name: "error" }
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
        value: img,
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
        value: img,
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

phone.getMenuItemModalInput = function(title, text, modalTitle, modalValue = '', modalYes = 'Применить', modalNo = 'Отмена', params = { name: "null" }, img = undefined, clickable = false, background = undefined) {
    return {
        title: title,
        text: text,
        type: 8,
        modalTitle: modalTitle,
        modalValue: modalValue,
        modalButton: [modalNo, modalYes],
        img: img,
        background: background,
        clickable: clickable,
        params: params
    };
};

phone.getMenuItemTable = function(title, columns, data, readonly = true, params = { name: "null" }, clickable = false, background = undefined) {
    return {
        type: 10,
        title: title,
        columns: columns,
        data: data,
        readonly: readonly,
        params: params,
        background: background,
        clickable: clickable,
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

    if (phone.network == 0) {
        phone.showNoNetwork();
        return;
    }

    if (action == 'button')
        phone.callBackButton(menu, id, ...args);
    else if (action == 'radio')
        phone.callBackRadio(menu, id, ...args);
    else if (action == 'modal')
        phone.callBackModal(menu);
    else if (action == 'inputmodal')
        phone.callBackModalInput(menu, id);
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
        if (params.name == 'memberNewRank2') {
            mp.events.callRemote('server:user:newRank2', params.memberId, params.rankId);
            phone.showAppFraction2();
        }
        if (params.name == 'memberNewDep2') {
            mp.events.callRemote('server:user:newDep2', params.memberId, params.depId);
            phone.showAppFraction2();
        }
        if (params.name == 'vehicleNewRank') {
            mp.events.callRemote('server:fraction:vehicleNewRank', params.memberId, params.rankId);
            phone.showAppFraction();
        }
        if (params.name == 'vehicleNewDep') {
            mp.events.callRemote('server:fraction:vehicleNewDep', params.memberId, params.depId);
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
        if (params.name == 'memberUninvite2') {
            mp.events.callRemote('server:user:uninvite2', params.memberId);
            phone.showAppFraction2();
        }
        if (params.name == 'memberGiveSubLeader2') {
            mp.events.callRemote('server:user:giveSubLeader2', params.memberId);
            phone.showAppFraction2();
        }
        if (params.name == 'memberTakeSubLeader2') {
            mp.events.callRemote('server:user:takeSubLeader2', params.memberId);
            phone.showAppFraction2();
        }
        if (params.name == 'fractionVehicleBuy') {
            mp.events.callRemote('server:fraction:vehicleBuy', params.vehId, params.price);
            phone.showAppFraction();
        }
        if (params.name == 'fractionVehicleSell') {
            mp.events.callRemote('server:fraction:vehicleSell', params.vehId, params.price);
            phone.showAppFraction();
        }
        if (params.name == 'deleteFractionDep') {
            mp.events.callRemote('server:phone:deleteFractionDep');
            setTimeout(phone.showAppFractionHierarchy2, 300);
        }
    }
    catch(e) {
        methods.debug(e);
    }
};

phone.callBackModalInput = function(paramsJson, text) {
    try {
        methods.debug(text);
        let params = JSON.parse(paramsJson);
        if (params.name == 'giveWanted') {
            let args = text.split(',');
            let id = methods.parseInt(args[0]);
            let count = methods.parseInt(args[1]);
            let reason = methods.removeQuotes(args[2]);
            mp.events.callRemote('server:user:giveWanted', methods.parseInt(id), count, reason);
        }
        if (params.name == 'getUserInfo') {
            mp.events.callRemote('server:phone:getUserInfo', text);
        }
        if (params.name == 'inviteFraction2') {
            mp.events.callRemote('server:phone:inviteFraction2', methods.parseInt(text));
        }
        if (params.name == 'editFractionName') {
            mp.events.callRemote('server:phone:editFractionName', text);
            setTimeout(phone.showAppFractionHierarchy2, 300);
        }
        if (params.name == 'createFractionDep') {
            mp.events.callRemote('server:phone:createFractionDep', text);
            setTimeout(phone.showAppFractionHierarchy2, 300);
        }
        if (params.name == 'editFractionLeader') {
            mp.events.callRemote('server:phone:editFractionLeader', text);
            setTimeout(phone.showAppFractionHierarchy2, 300);
        }
        if (params.name == 'editFractionSubLeader') {
            mp.events.callRemote('server:phone:editFractionSubLeader', text);
            setTimeout(phone.showAppFractionHierarchy2, 300);
        }
        if (params.name == 'editFractionRank') {
            mp.events.callRemote('server:phone:editFractionRank', text, params.rankId, params.depId);
            setTimeout(phone.showAppFractionHierarchy2, 300);
        }
        if (params.name == 'editFractionDep') {
            mp.events.callRemote('server:phone:editFractionDep', text, params.depId);
            setTimeout(phone.showAppFractionHierarchy2, 300);
        }
        if (params.name == 'addFractionRank') {
            mp.events.callRemote('server:phone:addFractionRank', text, params.depId);
            setTimeout(phone.showAppFractionHierarchy2, 300);
        }
        if (params.name == 'fractionBenefit') {
            let price = methods.parseFloat(text);

            if (price < 0) {
                mp.game.ui.notifications.show(`~r~Значение не может быть меньше нуля`);
                return;
            }
            if (price > 1000) {
                mp.game.ui.notifications.show(`~r~Значение не может быть больше 1000`);
                return;
            }

            coffer.setBenefit(coffer.getIdByFraction(user.getCache('fraction_id')), text);
            mp.game.ui.notifications.show(`~g~Вы установили новое значение прибавки к зарплате`);

            mp.events.callRemote('server:phone:fractionMoney');
            phone.showLoad();
        }
        if (params.name == 'sendAd') {
            mp.events.callRemote('server:invader:sendAdTemp', text);
        }
        if (params.name == 'getPayDay') {
            let sum = methods.parseInt(text);
            if (sum < 0) {
                user.sendSmsBankOperation('Ошибка транзакции', 'Зарплата');
                return;
            }
            if (sum > user.getPayDayMoney()) {
                user.sendSmsBankOperation('У Вас недостаточно средств', 'Зарплата');
                return;
            }
            user.removePayDayMoney(sum);
            user.addBankMoney(sum);
            user.sendSmsBankOperation(`Вы перевели ~g~${methods.moneyFormat(sum)}~s~ на ваш банковский счёт`, 'Зарплата');

            setTimeout(phone.showAppBank, 500);
        }
        if (params.name == 'moneyToCrypto') {
            let sum = methods.parseInt(text) * 1000;
            if (sum < 0) {
                user.sendSmsBankOperation('Ошибка транзакции', 'Ошибка');
                return;
            }
            if (sum > user.getBankMoney()) {
                user.sendSmsBankOperation('У Вас недостаточно средств', 'Ошибка');
                return;
            }
            user.removeBankMoney(sum, 'Обмен E-Coin');
            user.addCryptoMoney(sum / 1000, 'Обмен E-Coin');
            user.sendSmsBankOperation(`Транзакция успешно прошла.\nСписано ~g~${methods.moneyFormat(sum)}`, 'E-Coin');

            setTimeout(phone.showAppEcorp, 200);
        }
        if (params.name == 'cryptoToMoney') {
            let sum = methods.parseInt(text);
            if (sum < 0) {
                user.sendSmsBankOperation('Ошибка транзакции', 'Ошибка');
                return;
            }
            if (sum > user.getCryptoMoney()) {
                user.sendSmsBankOperation('У Вас недостаточно средств', 'Ошибка');
                return;
            }
            user.removeCryptoMoney(sum, 'Обмен E-Coin');
            user.addBankMoney(sum * 1000, 'Обмен E-Coin');
            user.sendSmsBankOperation(`Транзакция успешно прошла\\nПолучено ~g~${methods.moneyFormat(sum * 1000)}`, 'E-Coin');

            setTimeout(phone.showAppEcorp, 200);
        }
        if (params.name == 'cryptoToFraction') {
            let sum = methods.parseInt(text);
            if (sum < 0) {
                user.sendSmsBankOperation('Ошибка транзакции', 'Ошибка');
                return;
            }
            if (sum > user.getCryptoMoney()) {
                user.sendSmsBankOperation('У Вас недостаточно средств', 'Ошибка');
                return;
            }
            user.removeCryptoMoney(sum, 'Обмен E-Coin');
            fraction.addMoney(user.getCache('fraction_id2'), sum, 'Обмен E-Coin');

            setTimeout(phone.showAppEcorp, 200);
        }
        if (params.name == 'sendFractionMessage') {
            let title = user.getCache('name');
            switch (user.getCache('fraction_id')) {
                case 1:
                    methods.notifyWithPictureToFraction(title, `Правительство`, text, 'CHAR_FLOYD', user.getCache('fraction_id'));
                    break;
                case 2:
                    methods.notifyWithPictureToFraction(title, `SAPD`, text, 'WEB_LOSSANTOSPOLICEDEPT', user.getCache('fraction_id'));
                    break;
                case 3:
                    methods.notifyWithPictureToFraction(title, `FIB`, text, 'CHAR_DR_FRIEDLANDER', user.getCache('fraction_id'));
                    break;
                case 4:
                    methods.notifyWithPictureToFraction(title, `USMC`, text, 'DIA_ARMY', user.getCache('fraction_id'));
                    break;
                case 5:
                    methods.notifyWithPictureToFraction(title, `SHERIFF`, text, 'DIA_POLICE', user.getCache('fraction_id'));
                    break;
                case 6:
                    methods.notifyWithPictureToFraction(title, `EMS`, text, 'CHAR_CRIS', user.getCache('fraction_id'));
                    break;
                case 7:
                    methods.notifyWithPictureToFraction(title, `Life Invader`, text, 'CHAR_LIFEINVADER', user.getCache('fraction_id'));
                    break;
                default:
                    methods.notifyWithPictureToFraction(title, `Организация`, text, 'CHAR_DEFAULT', user.getCache('fraction_id'));
                    break;
            }
        }
        if (params.name == 'sendFractionNews') {
            let title = user.getCache('name');
            switch (user.getCache('fraction_id')) {
                case 1:
                    methods.notifyWithPictureToAll(title, 'Новости правительства', text, 'CHAR_FLOYD');
                    break;
                case 2:
                    methods.notifyWithPictureToAll(title, 'Новости SAPD', text, 'WEB_LOSSANTOSPOLICEDEPT');
                    break;
                case 3:
                    methods.notifyWithPictureToAll(title, 'Новости FIB', text, 'CHAR_DR_FRIEDLANDER');
                    break;
                case 4:
                    methods.notifyWithPictureToAll(title, 'Новости USMC', text, 'DIA_ARMY');
                    break;
                case 5:
                    methods.notifyWithPictureToAll(title, 'Новости SHERIFF', text, 'DIA_POLICE');
                    break;
                case 6:
                    methods.notifyWithPictureToAll(title, 'Новости EMS', text, 'CHAR_CRIS');
                    break;
                case 7:
                    methods.notifyWithPictureToAll(title, 'Новости Life Invader', text, 'CHAR_LIFEINVADER');
                    break;
            }
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
                mp.events.callRemote('server:phone:fractionList');
                phone.showLoad();
            }
            else if (params.name == 'log') {
                mp.events.callRemote('server:phone:fractionLog');
                phone.showLoad();
            }
            else if (params.name == 'money') {
                mp.events.callRemote('server:phone:fractionMoney');
                phone.showLoad();
            }
            else if (params.name == 'vehicles') {
                mp.events.callRemote('server:phone:fractionVehicles');
                phone.showLoad();
            }
            else if (params.name == 'fractionVehicleBuyInfo') {
                mp.events.callRemote('server:phone:fractionVehicleBuyInfo', params.id);
                phone.showLoad();
            }
            else if (params.name == 'vehicleBuyList') {
                mp.events.callRemote('server:phone:fractionVehiclesBuyList');
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
            else if (params.name == 'fractionVehicleAction') {
                mp.events.callRemote('server:phone:fractionVehicleAction', params.vehId);
                phone.showLoad();
            }
            else if (params.name == 'codeLoc') {
                dispatcher.sendLocal(`Код ${params.code}`, params.codeDesc);
            }
            else if (params.name == 'codeDep') {
                dispatcher.send(`Код ${params.code}`, params.codeDesc);
            }
        }
        if (menu == 'uvehicle') {
            if (params.name == 'respawn')
                mp.events.callRemote('server:phone:userRespawnById', params.id);
            if (params.name == 'getPos')
                mp.events.callRemote('server:phone:userGetPosById', params.id);
            if (params.name == 'lock')
                mp.events.callRemote('server:phone:userLockById', params.id);
            if (params.name == 'engine')
                mp.events.callRemote('server:phone:userEngineById', params.id);
            if (params.name == 'neon')
                mp.events.callRemote('server:phone:userNeonById', params.id);
        }
        if (menu == 'apps') {
            if (params.name == 'fraction')
                phone.showAppFraction();
            if (params.name == 'fraction2')
                phone.showAppFraction2();
            if (params.name == 'bank')
                phone.showAppBank();
            if (params.name == 'ecorp')
                phone.showAppEcorp();
            if (params.name == 'invader')
                phone.showAppInvader();
            if (params.name == 'car') {
                mp.events.callRemote('server:phone:userVehicleAppMenu');
                phone.showLoad();
            }
            if (params.name == 'myHistory') {
                mp.events.callRemote('server:phone:userHistory', user.getCache('id'));
                phone.showLoad();
            }
        }
        if (menu == 'gps') {
            if (params.x)
                user.setWaypoint(params.x, params.y);
            if (params.event)
                mp.events.callRemote(params.event);
        }
        if (menu == 'invader') {
            if (params.name == 'adList') {
                mp.events.callRemote('server:phone:userAdList');
                phone.showLoad();
            }
            if (params.name == 'newsList') {
                mp.events.callRemote('server:phone:userNewsList');
                phone.showLoad();
            }
        }
        if (menu == 'bank') {
            if (params.name == 'history') {
                mp.events.callRemote('server:phone:bankHistory');
                phone.showLoad();
            }
        }
        if (menu == 'userInfo') {
            if (params.name == 'history') {
                mp.events.callRemote('server:phone:userHistory', params.id);
                phone.showLoad();
            }
        }
        if (menu == 'ecorp') {
            if (params.name == 'createFraction') {
                mp.events.callRemote('server:phone:createFraction');
                phone.showLoad();
            }
            if (params.name == 'fractionList') {
                mp.events.callRemote('server:phone:fractionAll');
                phone.showLoad();
            }
            if (params.name == 'buyFraction') {
                mp.events.callRemote('server:phone:buyFraction', params.id);
                phone.showAppList();
            }
        }
        if (menu == 'fraction2') {
            if (params.name == 'hierarchy')
                phone.showAppFractionHierarchy2();
            else if (params.name == 'list') {
                mp.events.callRemote('server:phone:fractionList2');
                phone.showLoad();
            }
            else if (params.name == 'log') {
                mp.events.callRemote('server:phone:fractionLog2');
                phone.showLoad();
            }
            else if (params.name == 'memberAction') {
                mp.events.callRemote('server:phone:memberAction2', params.memberId);
                phone.showLoad();
            }
            else if (params.name == 'goCargo') {
                user.set('isCargo', true);
                mp.game.ui.notifications.show(`~g~Ожидайте начало операции, в случае перезахода, необходимо нажать еще раз`);
            }
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

let notifyList = [];

phone.sendNotify = function(sender, title, message, pic = 'CHAR_BLANK_ENTRY') {
    if (phone.getType() > 0)
        notifyList.push({ title: title, sender: sender, message: message, pic: pic });
};

phone.findNearestNetwork = function(pos) {
    let prevPos = new mp.Vector3(9999, 9999, 9999);
    enums.networkList.forEach(function (item) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(shopPos, pos) < methods.distanceToPos(prevPos, pos))
            prevPos = shopPos;
    });
    return prevPos;
};

phone.findNetworkTimer = function() {
    try {
        if (!methods.isBlackout() && phone.getType() > 0)
        {
            let plPos = mp.players.local.position;
            let pos = phone.findNearestNetwork(plPos);
            let distance = methods.distanceToPos(pos, plPos);

            if (plPos.z < 270 && plPos.z > 0)
            {
                if (distance <= 1000)
                    phone.network = 5;
                else if (distance > 1000 && distance < 1500)
                {
                    let distanceNetwork = (500 - (distance - 1000)) / 5.0;
                    if (distanceNetwork > 90)
                        phone.network = 5;
                    else if (distanceNetwork > 70)
                        phone.network = 4;
                    else if (distanceNetwork > 50)
                        phone.network = 3;
                    else if (distanceNetwork > 30)
                        phone.network = 2;
                    else if (distanceNetwork > 10)
                        phone.network = 1;
                    else
                        phone.network = 0;
                }
                else
                    phone.network = 0;
            }
            else if (plPos.z < 450 && plPos.z >= 270)
            {
                let distanceNetwork = (180 - (plPos.z - 270)) / 1.8;
                if (distanceNetwork > 90)
                    phone.network = 5;
                else if (distanceNetwork > 70)
                    phone.network = 4;
                else if (distanceNetwork > 50)
                    phone.network = 3;
                else if (distanceNetwork > 30)
                    phone.network = 2;
                else if (distanceNetwork > 10)
                    phone.network = 1;
                else
                    phone.network = 0;
            }
            else
                phone.network = 0;
        }
        else
            phone.network = 0;

        if (phone.network > 0 && phone.getType() > 0) {
            notifyList.forEach(item => {
                mp.game.ui.notifications.showWithPicture(item.sender, item.title, item.message, item.pic, 1);
            });
            notifyList = [];
        }
    }
    catch (e) {
        methods.debug('NETWORK', e);
    }

    setTimeout(phone.findNetworkTimer, 1000);
};

export default phone;