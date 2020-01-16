import Container from './modules/data';
import UIMenu from './modules/menu';
import methods from './modules/methods';
import ui from './modules/ui';

import user from './user';
import admin from './admin';
import enums from './enums';
import coffer from './coffer';
import items from './items';
import inventory from './inventory';
import weapons from './weapons';

import houses from './property/houses';
import condos from './property/condos';
import business from './property/business';
import vehicles from "./property/vehicles";

import cloth from './business/cloth';
import vShop from "./business/vShop";

import bus from "./jobs/bus";
import gr6 from "./jobs/gr6";
import mail from "./jobs/mail";
import photo from "./jobs/photo";

let menuList = {};

menuList.showHouseBuyMenu = async function(h) {

    let menu = UIMenu.Menu.Create(`№${h.get('id')}`, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`);

    let buyHouseItem = UIMenu.Menu.AddMenuItem(`Купить дом за ~g~${methods.moneyFormat(h.get('price'))}`);
    let enterHouseItem = null;

    enterHouseItem = UIMenu.Menu.AddMenuItem("~g~Осмотреть дом");

    if (user.getCache('job') == 4) {
        if (!await Container.Data.Has(h.get('id'), 'isMail'))
            UIMenu.Menu.AddMenuItem("~g~Положить почту").doName = h.get('id');
        else
            UIMenu.Menu.AddMenuItem("~o~Дом уже обслуживался");
    }

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");

    menu.ItemSelect.on(async item => {
        UIMenu.Menu.HideMenu();
        if (item == enterHouseItem) {
            houses.enter(h.get('id'));
        }
        else if (item == buyHouseItem) {
            houses.buy(h.get('id'));
        }
        else if (item.doName) {
            mail.sendMail(item.doName)
        }
    });
};

menuList.showHouseInMenu = function(h) {

    let menu = UIMenu.Menu.Create(`№${h.get('id')}`, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`);

    if (h.get('user_id') == user.getCache('id')) {
        if (h.get('pin') > 0)
            UIMenu.Menu.AddMenuItem("~y~Сменить пинкод").doName = 'setPin';
        else {
            let lockItem = UIMenu.Menu.AddMenuItemList("Дверь", ['~g~Открыто', '~r~Закрыто']);
            lockItem.doName = 'setLock';
            lockItem.Index = h.get('is_lock') ? 1 : 0;
        }
        //if (h.get('is_sec'))
        //    UIMenu.Menu.AddMenuItem("~y~Подключиться к камере").doName = 'sec';

    }

    let exitHouseItem = UIMenu.Menu.AddMenuItem("~g~Выйти из дома");
    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");

    menu.ListChange.on((item, index) => {
        if (item.doName == 'setLock') {
            if (index == 1) {
                mp.game.ui.notifications.show('Дверь ~r~закрыта');
                houses.lockStatus(h.get('id'), true);
            }
            else {
                mp.game.ui.notifications.show('Дверь ~g~открыта');
                houses.lockStatus(h.get('id'), false);
            }
        }
    });

    menu.ItemSelect.on(async item => {
        UIMenu.Menu.HideMenu();
        if (item == exitHouseItem) {
            houses.exit(h.get('x'), h.get('y'), h.get('z'));
        }
        if (item.doName == 'setPin') {
            let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 5));
            if (pass < 1) {
                mp.game.ui.notifications.show('~r~Пароль должен быть больше нуля');
                return false;
            }
            mp.game.ui.notifications.show('~g~Ваш новый пароль: ~s~' + pass);
            houses.updatePin(h.get('id'), pass);
        }
    });
};

menuList.showHouseOutMenu = async function(h) {

    let menu = UIMenu.Menu.Create(`№${h.get('id')}`, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`);
    let infoItem = UIMenu.Menu.AddMenuItem(`~b~Владелец:~s~ ${h.get('user_name')}`);

    let enterHouseItem = UIMenu.Menu.AddMenuItem("~g~Войти");

    if (user.getCache('job') == 4) {
        if (!await Container.Data.Has(h.get('id'), 'isMail'))
            UIMenu.Menu.AddMenuItem("~g~Положить почту").doName = h.get('id');
        else
            UIMenu.Menu.AddMenuItem("~o~Дом уже обслуживался");
    }

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");

    menu.ItemSelect.on(async item => {
        UIMenu.Menu.HideMenu();
        if (item == enterHouseItem) {
            try {
                if (h.get('pin') > 0 && user.getCache('id') != h.get('user_id')) {
                    mp.game.ui.notifications.show('~r~Введите пинкод');
                    let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 5));
                    if (pass == h.get('pin'))
                        houses.enter(h.get('id'));
                    else
                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');
                }
                else if (h.get('is_lock') && h.get('user_id') != user.getCache('id'))
                    mp.game.ui.notifications.show('~r~Дверь закрыта, ее можно взломать отмычкой');
                else
                    houses.enter(h.get('id'));
            }
            catch (e) {
                methods.debug(e);
            }
        }
        else if (item.doName) {
            mail.sendMail(item.doName)
        }
    });
};

menuList.showCondoBuyMenu = async function(h) {

    let menu = UIMenu.Menu.Create(`№${h.get('id')}`, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`);

    let buyHouseItem = UIMenu.Menu.AddMenuItem(`Купить квартиру за ~g~${methods.moneyFormat(h.get('price'))}`);
    let enterHouseItem = null;

    enterHouseItem = UIMenu.Menu.AddMenuItem("~g~Осмотреть квартиру");

    if (user.getCache('job') == 4) {
        if (!await Container.Data.Has(h.get('id'), 'isMail'))
            UIMenu.Menu.AddMenuItem("~g~Положить почту").doName = h.get('id');
        else
            UIMenu.Menu.AddMenuItem("~o~Дом уже обслуживался");
    }

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");

    menu.ItemSelect.on(async item => {
        UIMenu.Menu.HideMenu();
        if (item == enterHouseItem) {
            condos.enter(h.get('id'));
        }
        else if (item == buyHouseItem) {
            condos.buy(h.get('id'));
        }
        else if (item.doName) {
            mail.sendMail2(item.doName)
        }
    });
};

menuList.showCondoInMenu = function(h) {

    let menu = UIMenu.Menu.Create(`№${h.get('id')}`, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`);

    if (h.get('user_id') == user.getCache('id')) {
        if (h.get('pin') > 0)
            UIMenu.Menu.AddMenuItem("~y~Сменить пинкод").doName = 'setPin';
        else {
            let lockItem = UIMenu.Menu.AddMenuItemList("Дверь", ['~g~Открыто', '~r~Закрыто']);
            lockItem.doName = 'setLock';
            lockItem.Index = h.get('is_lock') ? 1 : 0;
        }
        //if (h.get('is_sec'))
        //    UIMenu.Menu.AddMenuItem("~y~Подключиться к камере").doName = 'sec';

    }

    let exitHouseItem = UIMenu.Menu.AddMenuItem("~g~Выйти из квартиры");
    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");

    menu.ListChange.on((item, index) => {
        if (item.doName == 'setLock') {
            if (index == 1) {
                mp.game.ui.notifications.show('Дверь ~r~закрыта');
                condos.lockStatus(h.get('id'), true);
            }
            else {
                mp.game.ui.notifications.show('Дверь ~g~открыта');
                condos.lockStatus(h.get('id'), false);
            }
        }
    });

    menu.ItemSelect.on(async item => {
        UIMenu.Menu.HideMenu();
        if (item == exitHouseItem) {
            condos.exit(h.get('x'), h.get('y'), h.get('z'));
        }
        if (item.doName == 'setPin') {
            let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 5));
            if (pass < 1) {
                mp.game.ui.notifications.show('~r~Пароль должен быть больше нуля');
                return false;
            }
            mp.game.ui.notifications.show('~g~Ваш новый пароль: ~s~' + pass);
            condos.updatePin(h.get('id'), pass);
        }
    });
};

menuList.showCondoOutMenu = async function(h) {

    let menu = UIMenu.Menu.Create(`№${h.get('id')}`, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`);
    let infoItem = UIMenu.Menu.AddMenuItem(`~b~Владелец:~s~ ${h.get('user_name')}`);

    let enterHouseItem = UIMenu.Menu.AddMenuItem("~g~Войти");

    if (user.getCache('job') == 4) {
        if (!await Container.Data.Has(h.get('id'), 'isMail'))
            UIMenu.Menu.AddMenuItem("~g~Положить почту").doName = h.get('id');
        else
            UIMenu.Menu.AddMenuItem("~o~Дом уже обслуживался");
    }

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");

    menu.ItemSelect.on(async item => {
        UIMenu.Menu.HideMenu();
        if (item == enterHouseItem) {
            try {
                if (h.get('pin') > 0 && user.getCache('id') != h.get('user_id')) {
                    mp.game.ui.notifications.show('~r~Введите пинкод');
                    let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 5));
                    if (pass == h.get('pin'))
                        condos.enter(h.get('id'));
                    else
                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');
                }
                else if (h.get('is_lock') && h.get('user_id') != user.getCache('id'))
                    mp.game.ui.notifications.show('~r~Дверь закрыта, ее можно взломать отмычкой');
                else
                    condos.enter(h.get('id'));
            }
            catch (e) {
                methods.debug(e);
            }
        }
        else if (item.doName) {
            mail.sendMail2(item.doName)
        }
    });
};

menuList.showBusinessTeleportMenu = function() {

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    let menu = UIMenu.Menu.Create(`Arcadius`, `~b~Бизнес центр`);

    business.typeList.forEach(function (item, i, arr) {
        UIMenu.Menu.AddMenuItem(`${item}`).typeId = i;
    });

    UIMenu.Menu.AddMenuItem("~b~Arcadius Motors").teleportPos = business.BusinessMotorPos;
    UIMenu.Menu.AddMenuItem("~g~Улица").teleportPos = business.BusinessStreetPos;
    UIMenu.Menu.AddMenuItem("~g~Крыша").teleportPos = business.BusinessRoofPos;
    UIMenu.Menu.AddMenuItem("~g~Гараж").teleportPos = business.BusinessGaragePos;

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");
    menu.ItemSelect.on((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item == closeItem)
            return;
        if (item.typeId != undefined) {
            mp.events.callRemote('server:events:showTypeListMenu', methods.parseInt(item.typeId));
        }
        else {
            user.setVirtualWorld(0);
            user.teleportv(item.teleportPos);
        }
    });
};

menuList.showBusinessTypeListMenu = function(data1, data2, data3) {
    let menu = UIMenu.Menu.Create(`Arcadius`, `~b~Бизнес центр`);

    data1.forEach(function (item, i, arr) {
        let ownerName = item[1] == '' ? 'Государство' : item[1];
        let menuItem = UIMenu.Menu.AddMenuItem(`${data2[i][1]}`, `~b~Владелец: ~s~${ownerName}`);
        menuItem.bId = item[0];
        menuItem.interiorId = data3[i][1][0];
        menuItem.scFont = data3[i][1][1];
        menuItem.scColor = data3[i][1][2];
        menuItem.scAlpha = data3[i][1][3];
        menuItem.bName = data2[i][1];
    });

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");
    menu.ItemSelect.on((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item == closeItem)
            return;
        business.setScaleformName(item.bName);
        business.setScaleformParams(item.scFont, item.scColor, item.scAlpha);
        business.loadInterior(item.interiorId, 500);
        user.setVirtualWorld(methods.parseInt(item.bId));
        user.teleport(business.BusinessOfficePos.x, business.BusinessOfficePos.y, business.BusinessOfficePos.z + 1);
    });
};

menuList.showBusinessLogMenu = function(data) {
    let menu = UIMenu.Menu.Create(`Arcadius`, `~b~Список транзакций`);

    JSON.parse(data).forEach(function (item, i, arr) {
        UIMenu.Menu.AddMenuItem(`~b~#${item.id}. ~s~${item.product}`, `~b~Дата:~s~ ${item.rp_datetime}\n~b~OOC: ~s~${methods.unixTimeStampToDateTimeShort(item.timestamp)}`).SetRightLabel(`${item.price}`);
    });

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");
    menu.ItemSelect.on((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item == closeItem)
            return;
    });
};

menuList.showBankLogMenu = function(data) {
    let menu = UIMenu.Menu.Create(`Bank`, `~b~Список транзакций`);

    JSON.parse(data).forEach(function (item, i, arr) {

        if (item.price == '') {
            UIMenu.Menu.AddMenuItem(`~b~#${item.id}. ~s~${item.text}`, `~b~Дата:~s~ ${item.rp_datetime}\n~b~OOC: ~s~${methods.unixTimeStampToDateTimeShort(item.timestamp)}`);
        }
        else {
            UIMenu.Menu.AddMenuItem(`~b~#${item.id}. ~s~${item.text}`, `~b~Дата:~s~ ${item.rp_datetime}\n~b~OOC: ~s~${methods.unixTimeStampToDateTimeShort(item.timestamp)}`).SetRightLabel(`${item.price}`);
        }
    });

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");
    menu.ItemSelect.on((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item == closeItem)
            return;
    });
};

menuList.showBusinessMenu = async function(data) {

    let bankTarif = 0;
    if (data.get('bank_id') > 0)
        bankTarif = await business.getPrice(data.get('bank_id'));

    let nalog = await coffer.getTaxBusiness();

    let menu = UIMenu.Menu.Create(`Arcadius`, `~b~Владелец: ~s~${(data.get('user_id') == 0 ? "Государство" : data.get('user_name'))}`);

    let nalogOffset = bankTarif;
    if (data.get('type') == 1 || data.get('type') == 11) //TODO
        nalogOffset += 30;

    nalog = nalog + nalogOffset;

    UIMenu.Menu.AddMenuItem("~b~Название: ~s~").SetRightLabel(data.get('name'));
    UIMenu.Menu.AddMenuItem("~b~Налог на прибыль: ~s~").SetRightLabel(`${nalog}%`);

    if (user.getCache('id') == data.get('user_id')) {

        UIMenu.Menu.AddMenuItem("~b~Банк: ~s~").SetRightLabel(`~g~${methods.moneyFormat(data.get('bank'))}`);
        UIMenu.Menu.AddMenuItem("Настройка бизнеса").doName = 'settings';
        UIMenu.Menu.AddMenuItem("Список транзакций").doName = 'log';
        UIMenu.Menu.AddMenuItem("Положить средства").doName = 'addMoney';
        UIMenu.Menu.AddMenuItem("Снять средства").doName = 'removeMoney';
    }
    else if (data.get('user_id') == 0) {
        if (data.get('price') == 0)
            UIMenu.Menu.AddMenuItem("~y~На реконструкции, скоро будет доступен");
        else
            UIMenu.Menu.AddMenuItem("~g~Купить", `Цена: ~g~${methods.moneyFormat(data.get('price'))}`).doName = 'buy';
    }

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");

    menu.ItemSelect.on(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item == closeItem)
            return;
        if (item.doName == 'buy') {
            mp.events.callRemote('server:business:buy', data.get('id'));
        }
        if (item.doName == 'settings') {
            menuList.showBusinessSettingsMenu(data);
        }
        if (item.doName == 'buy') {
            mp.events.callRemote('server:business:buy', data.get('id'));
        }
        if (item.doName == 'log') {
            mp.events.callRemote('server:business:log', data.get('id'));
        }
        if (item.doName == 'addMoney') {
            try {

                if (user.get('bank_card') < 1) {
                    mp.game.ui.notifications.show(`~r~У Вас нет банковской карты`);
                    return;
                }
                let money = await UIMenu.Menu.GetUserInput("Сумма", "", 8);
                money = methods.parseFloat(money);
                if (money > user.getBankMoney()) {
                    mp.game.ui.notifications.show(`~r~У Вас нет столько денег на руках`);
                    return;
                }
                if (money < 1) {
                    mp.game.ui.notifications.show(`~r~Нельзя положить меньше 1$`);
                    return;
                }
                business.addMoney(data.get('id'), money, 'Зачиление со счета ' + methods.bankFormat(user.get('bank_card')));
                user.removeBankMoney(money, 'Зачиление на счет бизнеса ' + data.get('name'));
                business.save(data.get('id'));
                mp.game.ui.notifications.show(`~b~Вы положили деньги на счет бизнеса`);
            }
            catch (e) {
                methods.debug(e);
            }
        }
        if (item.doName == 'removeMoney') {

            if (user.get('bank_card') < 1) {
                mp.game.ui.notifications.show(`~r~У Вас нет банковской карты`);
                return;
            }
            if (data.get('bank_id') == 0) {
                mp.game.ui.notifications.show(`~r~Вы не привязаны ни к какому банку`);
                return;
            }

            let money = await UIMenu.Menu.GetUserInput("Сумма", "", 8);
            money = methods.parseFloat(money);
            if (money > data.get('bank')) {
                mp.game.ui.notifications.show(`~r~На счету бизнеса нет столько денег`);
                return;
            }
            if (money < 1) {
                mp.game.ui.notifications.show(`~r~Нельзя взять меньше 1$`);
                return;
            }

            business.addMoney(data.get('bank_id'), money * (bankTarif / 100));

            business.removeMoney(data.get('id'), money, 'Вывод средств на карту ' + methods.bankFormat(user.get('bank_card')));
            business.save(data.get('id'));
            user.addBankMoney(money * (100 - nalog - bankTarif) / 100, 'Вывод со счета бизнеса ' + data.get('name'));
            coffer.addMoney(1, money * nalog / 100);
            mp.game.ui.notifications.show(`~b~Вы сняли ~s~${methods.moneyFormat(money * (100 - nalog + bankTarif) / 100)} ~b~со счёта с учётом налога`);
            mp.game.ui.notifications.show(`~b~${bankTarif}% от суммы отправлен банку который вас обслуживает`);
        }
    });
};

menuList.showBusinessSettingsMenu = async function(data) {

    let tarif1 = await business.getPrice(1);
    let tarif2 = await business.getPrice(2);
    let tarif3 = await business.getPrice(3);
    let tarif4 = await business.getPrice(4);

    let priceList = ["Очень низкая", "Низкая", "Нормальная", "Высокая", "Очень высокая"];
    let bankList = ["~r~Нет банка", `Maze Bank (${tarif1}%)`, `Pacific Bank (${tarif2}%)`, `Fleeca Bank (${tarif3}%)`, `Blaine Bank (${tarif4}%)`];

    if (data.get('bank_score') > 0)
        bankList = [`Maze Bank (${tarif1}%)`, `Pacific Bank (${tarif2}%)`, `Fleeca Bank (${tarif3}%)`, `Blaine Bank (${tarif4}%)`];

    let fontList = ["ChaletLondon", "HouseScript", "Monospace", "CharletComprime", "Pricedown"];
    let colorList = ["Black", "Red", "Pink", "Purple", "Deep Purple", "Indigo", "Blue", "Light Blue", "Cyan", "Teal", "Green", "Light Green", "Amber", "Orange", "Deep Orange", "Brown", "Blue Grey", "Grey"];
    let interiorList = ["Executive Rich", "Executive Cool", "Executive Contrast", "Old Spice Classical", "Old Spice Vintage", "Old Spice Warms", "Power Broker Conservative", "Power Broker Polished", "Power Broker Ice"];

    let nalog = await coffer.getTaxBusiness();

    let menu = UIMenu.Menu.Create(`Arcadius`, `~b~Панель вашего бизнеса`);

    let nalogOffset = 0;
    if (data.get('type') == 3) //TODO
        nalogOffset += 35;
    if (data.get('type') == 11)
        nalogOffset += 20;

    nalog = nalog + nalogOffset;

    let bankNumberStr = (data.get('bank_score') == 0 ? '~r~Отсуствует' : methods.bankFormat(data.get('bank_score')));

    UIMenu.Menu.AddMenuItem("~b~Название ~s~").SetRightLabel(data.get('name'));
    UIMenu.Menu.AddMenuItem("~b~Налог на прибыль ~s~").SetRightLabel(`${nalog}%`);
    UIMenu.Menu.AddMenuItem("~b~Ваш счёт ~s~").SetRightLabel(`${bankNumberStr}`);

    let bankItem = UIMenu.Menu.AddMenuItemList("~b~Ваш банк~s~", bankList, 'Стоимость перехода: ~g~$4,990');
    bankItem.doName = 'setBank';
    if (data.get('bank_id') > 0)
        bankItem.Index = data.get('bank_id') - 1;
    else
        bankItem.Index = data.get('bank_id');

    let fontItem = UIMenu.Menu.AddMenuItemList("~b~Шрифт на табличке~s~", fontList, 'Стоимость: ~g~$9,990\n~s~Нажмите ~g~Enter~s~ чтобы купить');
    fontItem.doName = 'setFont';
    fontItem.Index = data.get('sc_font');

    let colorItem = UIMenu.Menu.AddMenuItemList("~b~Цвет на табличке~s~", colorList, 'Стоимость: ~g~$1,990\n~s~Нажмите ~g~Enter~s~ чтобы купить');
    colorItem.doName = 'setColor';
    colorItem.Index = data.get('sc_color');

    let alphaItem = UIMenu.Menu.AddMenuItemList("~b~Прозрачность~s~", ['Нет', 'Да'], 'Стоимость: ~g~$990\n~s~Нажмите ~g~Enter~s~ чтобы купить');
    alphaItem.doName = 'setAlpha';
    alphaItem.Index = data.get('sc_alpha');

    let interiorItem = UIMenu.Menu.AddMenuItemList("~b~Интерьер~s~", interiorList, 'Стоимость: ~g~$100,000\n~s~Нажмите ~g~Enter~s~ чтобы купить');
    interiorItem.doName = 'setInterior';
    interiorItem.Index = data.get('interior');

    let priceItem = UIMenu.Menu.AddMenuItemList("~b~Цены на весь товар~s~", priceList);
    priceItem.doName = 'setPrice';
    priceItem.Index = data.get('price_product') - 1;

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");

    let bankIndex = data.get('bank_id');
    if (data.get('bank_id') > 0)
        bankIndex--;
    let colorIndex = data.get('sc_color');
    let fontIndex = data.get('sc_font');
    let alphaIndex = data.get('sc_alpha');
    let intIndex = data.get('interior');

    menu.ListChange.on((item, index) => {
        if (item.doName == 'setPrice') {
            let price = index + 1;
            business.setPrice(data.get('id'), price);
            mp.game.ui.notifications.show(`~b~Цена на все товары равна: ~s~${priceList[index]}`);
            return;
        }
        else if (item.doName == 'setBank') {
            bankIndex = index;
        }
        else if (item.doName == 'setFont') {
            fontIndex = index;
            business.setScaleformParams(index, colorIndex, alphaIndex);
        }
        else if (item.doName == 'setColor') {
            colorIndex = index;
            business.setScaleformParams(fontIndex, index, alphaIndex);
        }
        else if (item.doName == 'setAlpha') {
            alphaIndex = index;
            business.setScaleformParams(fontIndex, colorIndex, index);
        }
        else if (item.doName == 'setInterior') {
            intIndex = index;
            business.loadInterior(index);
        }
    });

    menu.ItemSelect.on(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item == closeItem)
            return;

        if (item.doName == 'setBank') {

            let price = 4990;
            if (price > data.get('bank')) {
                mp.game.ui.notifications.show(`~r~На счету бизнеса нет столько денег`);
                return;
            }

            mp.game.ui.notifications.show(`~b~Ваш новый банк: ~s~${bankList[bankIndex]}`);

            business.set(data.get('id'), 'bank_score', methods.getRandomBankCard(2222));
            if (data.get('bank_id') == 0) {
                business.addMoney(bankIndex, price, 'Новый клиент: ' + data.get('name'));
                business.set(data.get('id'), 'bank_id', bankIndex);
            }
            else {
                business.addMoney(bankIndex, price, 'Новый клиент: ' + data.get('name'));
                business.set(data.get('id'), 'bank_id', ++bankIndex);
            }
            business.removeMoney(data.get('id'), price, 'Открытие счёта');
            business.save(data.get('id'));
        }
        else if (item.doName == 'setFont') {

            let price = 9990;
            if (price > data.get('bank')) {
                business.setScaleformParams(data.get('sc_font'), data.get('sc_color'), data.get('sc_alpha'));
                mp.game.ui.notifications.show(`~r~На счету бизнеса нет столько денег`);
                return;
            }

            business.set(data.get('id'), 'sc_font', fontIndex);
            coffer.addMoney(1, price);
            business.removeMoney(data.get('id'), price, 'Установка таблички');
            business.save(data.get('id'));

            business.setScaleformParams(fontIndex, colorIndex, alphaIndex);
            mp.game.ui.notifications.show(`~b~Ваш новый шрифт: ~s~${fontList[fontIndex]}`);
        }
        else if (item.doName == 'setColor') {

            let price = 1990;
            if (price > data.get('bank')) {
                business.setScaleformParams(data.get('sc_font'), data.get('sc_color'), data.get('sc_alpha'));
                mp.game.ui.notifications.show(`~r~На счету бизнеса нет столько денег`);
                return;
            }

            business.set(data.get('id'), 'sc_color', colorIndex);
            coffer.addMoney(1, price);
            business.removeMoney(data.get('id'), price, 'Установка цвета таблички');
            business.save(data.get('id'));

            business.setScaleformParams(fontIndex, colorIndex, alphaIndex);
            mp.game.ui.notifications.show(`~b~Ваш новый цвет: ~s~${colorList[colorIndex]}`);
        }
        else if (item.doName == 'setAlpha') {

            let price = 990;
            if (price > data.get('bank')) {
                business.setScaleformParams(data.get('sc_font'), data.get('sc_color'), data.get('sc_alpha'));
                mp.game.ui.notifications.show(`~r~На счету бизнеса нет столько денег`);
                return;
            }

            business.set(data.get('id'), 'sc_alpha', alphaIndex);
            coffer.addMoney(1, price);
            business.removeMoney(data.get('id'), price, 'Прозрачность таблички');
            business.save(data.get('id'));

            business.setScaleformParams(fontIndex, colorIndex, alphaIndex);
            mp.game.ui.notifications.show(`~b~Шрифт обновлён`);
        }
        else if (item.doName == 'setInterior') {

            let price = 100000;
            if (price > data.get('bank')) {
                business.loadInterior(data.get('interior'));
                mp.game.ui.notifications.show(`~r~На счету бизнеса нет столько денег`);
                return;
            }

            business.set(data.get('id'), 'interior', alphaIndex);
            coffer.addMoney(1, price);
            business.removeMoney(data.get('id'), price, 'Обновление интерьера');
            business.save(data.get('id'));

            business.loadInterior(intIndex);
            mp.game.ui.notifications.show(`~b~Ваш новый интерьер: ~s~${interiorList[intIndex]}`);
        }
    });
};

menuList.showMainMenu = function() {

    let menu = UIMenu.Menu.Create(`Меню`, `~b~Главное меню`);

    UIMenu.Menu.AddMenuItem("Персонаж").doName = 'showPlayerMenu';
    UIMenu.Menu.AddMenuItem("Транспорт").eventName = 'onKeyPress:2';

    if (user.getCache('fraction_id') > 0)
        UIMenu.Menu.AddMenuItem("Организация").doName = 'showFractionMenu';
    if (user.getCache('fraction_id2') > 0)
        UIMenu.Menu.AddMenuItem("Неоф. Организация").doName = 'showFraction2Menu';

    UIMenu.Menu.AddMenuItem("Помощь").doName = 'showHelpMenu';
    UIMenu.Menu.AddMenuItem("Настройки").doName = 'showSettingsMenu';

    UIMenu.Menu.AddMenuItem("~y~Задать вопрос").eventName = 'server:sendAsk';
    UIMenu.Menu.AddMenuItem("~r~Жалоба").eventName = 'server:sendReport';

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");
    menu.ItemSelect.on(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName == 'showFractionMenu')
            menuList.showFractionMenu();
        if (item.eventName)
            mp.events.callRemote(item.eventName);
    });
};

menuList.showVehicleMenu = function(data) {

    let vInfo = methods.getVehicleInfo(mp.players.local.vehicle.model);
    let veh = mp.players.local.vehicle;

    let ownerName = veh.getNumberPlateText();

    let menu = UIMenu.Menu.Create(`Транспорт`, `~b~Номер ТС: ~s~${ownerName}`);

    if (vInfo.class_name != 'Cycles')
        UIMenu.Menu.AddMenuItem("~g~Вкл~s~ / ~r~выкл~s~ двигатель").eventName = 'server:vehicle:engineStatus';
    if (vInfo.class_name == 'Boats')
        UIMenu.Menu.AddMenuItem("~g~Вкл~s~ / ~r~выкл~s~ якорь").eventName = 'server:vehicleFreeze';
    if (vInfo.fuel_min > 0) //TODO
        UIMenu.Menu.AddMenuItem("Топливо", `Топливо: ~g~${Math.round(data.get('fuel'))}~s~л.`);

    if (vInfo.class_name != 'Cycles' || vInfo.class_name != 'Planes' || vInfo.class_name != 'Helicopters' || vInfo.class_name != 'Boats')
        UIMenu.Menu.AddMenuItem("Управление транспортом").doName = 'showVehicleDoMenu';

    if (data.get('user_id') > 0 && user.getCache('id') == data.get('user_id'))
        UIMenu.Menu.AddMenuItem("Припарковать", "ТС будет спавниться на месте парковки").eventName = 'server:vehicle:park';

    //UIMenu.Menu.AddMenuItem("~y~Выкинуть из транспорта").eventName = 'server:vehicle:engineStatus';
    UIMenu.Menu.AddMenuItem("Характеристики").doName = 'showVehicleStatsMenu';
    //UIMenu.Menu.AddMenuItem("Управление транспортом").eventName = 'server:vehicle:engineStatus';

    if (!veh.getVariable('jobId')) {
        switch (user.getCache('job')) {
            case 'trucker1':
                if (vInfo.class_name == 'Vans') {
                    UIMenu.Menu.AddMenuItem("~g~Список заказов").doName = 'trucker:getList';
                    UIMenu.Menu.AddMenuItem("~b~Частота рации:~s~ ").SetRightLabel('444.001');
                    if (trucker.isProcess())
                        UIMenu.Menu.AddMenuItem("~r~Завершить досрочно рейс", 'Штраф ~r~$500').doName = 'trucker:stop';
                }
                break;
            case 'trucker2':
                if (vInfo.display_name == 'Benson' || vInfo.display_name == 'Mule' || vInfo.display_name == 'Mule2' || vInfo.display_name == 'Mule3' || vInfo.display_name == 'Pounder') {
                    UIMenu.Menu.AddMenuItem("~g~Список заказов").doName = 'trucker:getList';
                    UIMenu.Menu.AddMenuItem("~b~Частота рации:~s~ ").SetRightLabel('444.002');
                    if (trucker.isProcess())
                        UIMenu.Menu.AddMenuItem("~r~Завершить досрочно рейс", 'Штраф ~r~$500').doName = 'trucker:stop';
                }
                break;
            case 'trucker3':
                if (vInfo.display_name == 'Hauler' || vInfo.display_name == 'Packer' || vInfo.display_name == 'Phantom') {
                    UIMenu.Menu.AddMenuItem("~g~Список заказов").doName = 'trucker:getList';
                    UIMenu.Menu.AddMenuItem("~b~Частота рации:~s~ ").SetRightLabel('444.003');
                    if (trucker.isProcess())
                        UIMenu.Menu.AddMenuItem("~r~Завершить досрочно рейс", 'Штраф ~r~$500').doName = 'trucker:stop';
                }
                break;
        }
    }

    if (user.getCache('job') == veh.getVariable('jobId')) {
        switch (veh.getVariable('jobId')) {
            case 1:
                UIMenu.Menu.AddMenuItem("~g~Получить задание").doName = 'three:find';
                UIMenu.Menu.AddMenuItem("~b~Справка").sendChatMessage = 'Получайте и выполняйте задания от начальника';
                break;
            case 3:
                UIMenu.Menu.AddMenuItem("~g~Получить задание").doName = 'photo:find';
                UIMenu.Menu.AddMenuItem("~g~Напомнить задание").doName = 'photo:ask';
                UIMenu.Menu.AddMenuItem("~b~Справка").sendChatMessage = 'Внимательно смотрите на задание вашего начальника и выставите позицию персонажа так, чтобы он смотрел в ту точку, которую необходимо сфотографировать, тогда вы получите премию';
                break;
            case 6:
                UIMenu.Menu.AddMenuItem("~g~Начать рейс").doName = 'bus:start1';
                UIMenu.Menu.AddMenuItem("~y~Завершить рейс", "Завершение рейса досрочно").doName = 'bus:stop';
                break;
            case 7:
                UIMenu.Menu.AddMenuItem("~g~Начать рейс").doName = 'bus:start2';
                UIMenu.Menu.AddMenuItem("~y~Завершить рейс", "Завершение рейса досрочно").doName = 'bus:stop';
                break;
            case 8:
                UIMenu.Menu.AddMenuItem("~g~Начать рейс").doName = 'bus:start3';
                UIMenu.Menu.AddMenuItem("~y~Завершить рейс", "Завершение рейса досрочно").doName = 'bus:stop';
                break;
            case 10:
                UIMenu.Menu.AddMenuItem("~g~Получить задание").doName = 'gr6:start';
                UIMenu.Menu.AddMenuItem("Разгрузить транспорт").doName = 'gr6:unload';
                UIMenu.Menu.AddMenuItem("Вернуть транспорт в гараж", 'Залог в $4500 вернется вам на руки').doName = 'gr6:delete';
                UIMenu.Menu.AddMenuItem("~y~Вызвать подмогу", 'Вызывает сотрудников LSPD и BCSD').doName = 'gr6:getHelp';
                UIMenu.Menu.AddMenuItem("~b~Справка").sendChatMessage = 'Катайтесь по заданиям, собирайте деньги с магазинов и везите их в хранилище. Есть возможность работать с напарником, до 4 человек.';
                break;
            case 4:
                UIMenu.Menu.AddMenuItem("~g~Взять почту из транспорта").doName = 'mail:take';
                UIMenu.Menu.AddMenuItem("~b~Справка").sendChatMessage = 'Возьмите почту из транспорта, далее езжай к любым жилым домам, подходи к дому нажимай E и кладите туда почту.';
                break;
            case 9:
                UIMenu.Menu.AddMenuItem("~g~Диспетчерская таксопарка").doName = 'taxi:dispatch';
                UIMenu.Menu.AddMenuItem("~g~Получить задание").doName = 'taxi:start';
                break;
        }
    }

    if (data.get('job') == 'gr6') {
        UIMenu.Menu.AddMenuItem("Денег в транспорте: ~g~" + methods.moneyFormat(mp.players.local.vehicle.getVariable('gr6Money'))).doName = 'close';
        UIMenu.Menu.AddMenuItem("~y~Ограбить транспорт").doName = 'gr6:grab';
    }

    if (data.get('neon_r') > 0) {
        UIMenu.Menu.AddMenuItem("~g~Вкл~s~ / ~r~выкл~s~ неон").eventName = 'server:vehicle:neonStatus';
        UIMenu.Menu.AddMenuItem("~b~Цвет неона").eventName = 'server:vehicle:setNeonColor';
    }

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");
    menu.ItemSelect.on(async (item, index) => {

        if (item == closeItem) {
            UIMenu.Menu.HideMenu();
            return;
        }
        else if (item.sendChatMessage)
            mp.gui.chat.push(`${item.sendChatMessage}`);
        else if (item.doName == 'taxi:dispatch')
            menuList.showDispatchTaxiMenu();
        else if (item.doName == 'mail:take')
            mail.takeMail();
        else if (item.doName == 'taxi:start')
            taxi.start();
        else if (item.doName == 'bus:start1')
            bus.start(1);
        else if (item.doName == 'bus:start2')
            bus.start(2);
        else if (item.doName == 'bus:start3')
            bus.start(3);
        else if (item.doName == 'bus:stop')
            bus.stop();
        else if (item.doName == 'three:find')
            gardener.start();
        else if (item.doName == 'gr6:start')
            gr6.start();
        else if (item.doName == 'gr6:unload') {
            UIMenu.Menu.HideMenu();
            gr6.unload();
        }
        else if (item.doName == 'gr6:delete') {
            UIMenu.Menu.HideMenu();
            gr6.deleteVeh();
        }
        else if (item.doName == 'gr6:grab')
            gr6.grab();
        else if (item.doName == 'gr6:getHelp') {
            dispatcher.send(`Код 0`, `${user.getCache('rp_name')} - инкассация требует поддержки`);
            mp.game.ui.notifications.show('~b~Вызов был отправлен');
        }
        else if (item.doName == 'photo:find')
            photo.start();
        else if (item.doName == 'photo:ask')
            photo.ask();
        else if (item.doName == 'bshot:find')
            burgershot.findHouse();
        else if (item.doName == 'bugstar:find')
            bugstars.findHouse();
        else if (item.doName == 'sunb:find')
            sunBleach.findHouse();
        else if (item.doName == 'water:find')
            waterPower.findHouse();
        else if (item.doName == 'trucker:getList')
            mp.events.callRemote('server:trucker:showMenu');
        else if (item.doName == 'trucker:stop')
            trucker.stop();
        else if (item.doName == 'takeTool')
            user.takeTool();
        else if (item.doName == 'showVehicleAutopilotMenu')
            menuList.showVehicleAutopilotMenu();
        else if (item.doName == 'showVehicleStatsMenu')
            menuList.showVehicleStatsMenu();
        else if (item.eventName == 'server:vehicle:neonStatus')
            mp.events.callRemote(item.eventName);
        else if (item.eventName == 'server:vehicle:lockStatus') {
            if (data.get('fraction_id') > 0) {
                if (data.get('fraction_id') == user.getCache('fraction_id'))
                    mp.events.callRemote(item.eventName);
                else
                    mp.game.ui.notifications.show('~r~У Вас нет ключей от транспорта');
            }
            else
                mp.events.callRemote(item.eventName);
        }
        else if (item.eventName == 'server:vehicle:engineStatus') {
            user.engineVehicle();
        }
        else if (item.doName == 'showVehicleDoMenu') {
            menuList.showVehicleDoMenu();
        }
        else if (item.eventName == 'server:vehicleFreeze') {
            if (methods.getCurrentSpeed() > 4) {
                mp.game.ui.notifications.show('~r~Скорость должна быть меньше 5 км в час');
                return;
            }

            let isFreeze = !(Container.Data.GetLocally(0, 'boatFreeze') == true);
            Container.Data.SetLocally(0, 'boatFreeze', isFreeze);
            mp.players.local.vehicle.freezePosition(isFreeze);

            if (isFreeze === true)
                mp.game.ui.notifications.show('~g~Вы поставили якорь');
            else
                mp.game.ui.notifications.show('~y~Вы сняли якорь');
        }
        else if (item.eventName == 'server:vehicle:park') {
            UIMenu.Menu.HideMenu();
            mp.events.callRemote(item.eventName);
        }
        else if (item.eventName == 'server:vehicle:setNeonColor') {
            UIMenu.Menu.HideMenu();
            mp.game.ui.notifications.show('Введите цвет ~r~R~g~G~b~B');
            let r = await UIMenu.Menu.GetUserInput("R", "", 3);
            let g = await UIMenu.Menu.GetUserInput("G", "", 3);
            let b = await UIMenu.Menu.GetUserInput("B", "", 3);
            if (r > 255)
                r = 255;
            if (g > 255)
                g = 255;
            if (b > 255)
                b = 255;

            if (r < 1 || g < 1 || b < 1) {
                mp.game.ui.notifications.show('~r~Цвет не должен быть меньше 1');
                return;
            }
            mp.events.callRemote(item.eventName, methods.parseInt(r), methods.parseInt(g), methods.parseInt(b));
        }
    });
};

menuList.showVehicleAutopilotMenu = function() {

    let menu = UIMenu.Menu.Create(`Транспорт`, `~b~Меню автопилота`);

    UIMenu.Menu.AddMenuItem("~g~Включить").doName = 'enable';
    UIMenu.Menu.AddMenuItem("~y~Выключить").doName = 'disable';

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");
    menu.ItemSelect.on((item, index) => {
        if (item == closeItem)
            UIMenu.Menu.HideMenu();
        if (item.doName == 'enable') {
            vehicles.enableAutopilot();
        }
        else if (item.doName == 'disable') {
            vehicles.disableAutopilot();
        }
    });
};

menuList.showVehicleDoMenu = function() {

    try {
        let menu = UIMenu.Menu.Create(`Транспорт`, `~b~Нажмите Enter чтобы применить`);

        let listEn = ["~r~Выкл", "~g~Вкл"];
        let listOp = ["~r~Закрыт~r~", "~g~Открыт~g~"];

        let actualData = mp.players.local.vehicle.getVariable('vehicleSyncData');

        let listItem = UIMenu.Menu.AddMenuItemList("Аварийка", listEn, "Поворотники включаются на ~b~[~s~ и ~b~]");
        listItem.doName = 'twoIndicator';
        listItem.Index = actualData.IndicatorRightToggle === true && actualData.IndicatorLeftToggle === true ? 1 : 0;

        listItem = UIMenu.Menu.AddMenuItemList("Свет в салоне", listEn, "Днём очень плохо видно");
        listItem.doName = 'light';
        listItem.Index = actualData.InteriorLight === true ? 1 : 0;

        listItem = UIMenu.Menu.AddMenuItemList("Капот", listOp);
        listItem.doName = 'hood';
        listItem.Index = actualData.Hood === true ? 1 : 0;

        listItem = UIMenu.Menu.AddMenuItemList("Багажник", listOp);
        listItem.doName = 'trunk';
        listItem.Index = actualData.Trunk === true ? 1 : 0;

        /*if (methods.getVehicleInfo(mp.players.local.vehicle.model).display_name == 'Taxi') {
            listItem = UIMenu.Menu.AddMenuItemList("Свет на шашке", listEn);
            listItem.doName = 'lightTaxi';
            listItem.Index = actualData.TaxiLight === true ? 1 : 0;
        }*/

        let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");

        let listIndex = 0;
        menu.ListChange.on((item, index) => {
            listIndex = index;

            if (item.doName == 'light') {
                vehicles.setInteriorLightState(listIndex == 1);
            }
            if (item.doName == 'hood') {
                vehicles.setHoodState(listIndex == 1);
            }
            if (item.doName == 'trunk') {
                vehicles.setTrunkState(listIndex == 1);
            }
            if (item.doName == 'lightTaxi') {
                vehicles.setTaxiLightState(listIndex == 1);
            }
            if (item.doName == 'twoIndicator') {
                vehicles.setIndicatorLeftState(listIndex == 1);
                vehicles.setIndicatorRightState(listIndex == 1);
            }
        });

        menu.ItemSelect.on((item, index) => {
            if (item == closeItem)
                UIMenu.Menu.HideMenu();
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showVehicleStatsMenu = function() {

    let vInfo = methods.getVehicleInfo(mp.players.local.vehicle.model);
    let menu = UIMenu.Menu.Create(`Транспорт`, `~b~Характеристики транспорта`);

    UIMenu.Menu.AddMenuItem("~b~Номер: ~s~").SetRightLabel(`${mp.players.local.vehicle.getNumberPlateText()}`);
    UIMenu.Menu.AddMenuItem("~b~Класс: ~s~").SetRightLabel(`${vInfo.class_name}`);
    UIMenu.Menu.AddMenuItem("~b~Модель: ~s~").SetRightLabel(`${vInfo.display_name}`);
    if (vInfo.price > 0)
        UIMenu.Menu.AddMenuItem("~b~Гос. стоимость: ~s~").SetRightLabel(`~g~${methods.moneyFormat(vInfo.price)}`);
    if (vInfo.fuel_type > 0) {
        UIMenu.Menu.AddMenuItem("~b~Тип топлива: ~s~").SetRightLabel(`${vehicles.getFuelLabel(vInfo.fuel_type)}`);
        UIMenu.Menu.AddMenuItem("~b~Вместимость бака: ~s~").SetRightLabel(`${vInfo.fuel_full}${vehicles.getFuelPostfix(vInfo.fuel_type)}`);
        UIMenu.Menu.AddMenuItem("~b~Расход топлива: ~s~").SetRightLabel(`${vInfo.fuel_min}${vehicles.getFuelPostfix(vInfo.fuel_type)}`);
    }
    else
        UIMenu.Menu.AddMenuItem("~b~Расход топлива: ~s~").SetRightLabel(`Электрокар`);

    if (vInfo.stock > 0) {
        UIMenu.Menu.AddMenuItem("~b~Объем багажника: ~s~").SetRightLabel(`${vInfo.stock}см³`);
        let stockFull = vInfo.stock_full;
        if (vInfo.stock_full > 0)
            stockFull = stockFull / 1000;
        UIMenu.Menu.AddMenuItem("~b~Допустимый вес: ~s~").SetRightLabel(`${stockFull}кг.`);
    }
    else {
        UIMenu.Menu.AddMenuItem("~b~Багажник: ~s~").SetRightLabel(`~r~Отсутствует`);
    }

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");
    menu.ItemSelect.on((item, index) => {
        if (item == closeItem)
            UIMenu.Menu.HideMenu();
    });
};


menuList.showFractionMenu = function() {

    let menu = UIMenu.Menu.Create(`Организация`, `~b~Меню вашей организации`);

    UIMenu.Menu.AddMenuItem("Диспетчерская").eventName = '';
    UIMenu.Menu.AddMenuItem("Список членов организации").eventName = '';

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");
    menu.ItemSelect.on(async (item, index) => {
        UIMenu.Menu.HideMenu();

    });
};

menuList.showSpawnJobCarMenu = function(price, x, y, z, heading, name, job) {

    let menu = UIMenu.Menu.Create(`Работа`, `~b~Меню рабочего ТС`);

    UIMenu.Menu.AddMenuItem("Арендовать рабочий транспорт", "Стоимость: ~g~" + methods.moneyFormat(price)).doName = 'spawnCar';

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");
    menu.ItemSelect.on(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName == 'spawnCar') {

            if (user.getMoney() < price) {
                mp.game.ui.notifications.show(`~r~У Вас недостаточно средств`);
                return;
            }

            vehicles.spawnJobCar(x, y, z, heading, name, job);
        }
    });
};

menuList.showSpawnJobCarMailMenu = function() {

    let menu = UIMenu.Menu.Create(`Работа`, `~b~Меню рабочего ТС`);

    UIMenu.Menu.AddMenuItem("Boxville", "Стоимость: ~g~" + methods.moneyFormat(100)).doName = 'spawnCar1';
    UIMenu.Menu.AddMenuItem("Pony", "Стоимость: ~g~" + methods.moneyFormat(500)).doName = 'spawnCar2';

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");
    menu.ItemSelect.on(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName == 'spawnCar1') {

            if (user.getMoney() < 100) {
                mp.game.ui.notifications.show(`~r~У Вас недостаточно средств`);
                return;
            }
            vehicles.spawnJobCar(70.36360168457031, 121.7760009765625, 79.07405090332031, 159.3450927734375, "Boxville2", 4);
        }
        if (item.doName == 'spawnCar2') {

            if (user.getMoney() < 500) {
                mp.game.ui.notifications.show(`~r~У Вас недостаточно средств`);
                return;
            }
            vehicles.spawnJobCar(61.768699645996094, 125.43084716796875, 78.99858856201172, 158.8726806640625, "Pony", 4);
        }
    });
};

menuList.showToPlayerItemListMenu = async function(data, ownerType, ownerId) {

    if (user.isDead()) {
        mp.game.ui.notifications.show("~r~Нельзя использовать инвентарь будучи мёртвым");
        return;
    }

    /*if (user.getCache('jail_time') > 0) { //TODO
        mp.game.ui.notifications.show("~r~В тюрьме нельзя этим пользоваться");
        return;
    }
   */

    ownerId = methods.parseInt(ownerId);

    try {
        //let invAmountMax = await inventory.getInvAmountMax(ownerId, ownerType);
        let sum = 0;
        let currentItems = [];
        let equipItems = [];
        let equipWeapons = [];

        data.forEach((item, idx) => {
            try {
                let params = {};

                try {
                    params = JSON.parse(item.params);
                }
                catch (e) {
                    methods.debug(e);
                }

                if (item.is_equip == 0)
                    sum = sum + items.getItemAmountById(item.item_id);

                let itemName = items.getItemNameById(item.item_id);
                let desc = "";

                if (item.item_id >= 265 && item.item_id <= 273 && item.label.toString() != "")
                    itemName = item.label;
                else if (item.label.toString() != "")
                    desc += item.label;

                if (item.item_id == 277) {
                    itemName = items.getItemNameById(item.item_id);
                    if(params.state == -1)
                        desc = "Статус: Использован";
                    else if(params.state == 0)
                        desc = "Статус: Ожидает розыгрыша";
                    else if(params.state == 1)
                        desc = "Статус: Заберите выигрыш";
                }
                else if (item.item_id <= 137 && item.item_id >= 54) {
                    itemName = items.getItemNameById(item.item_id);
                    desc = params.serial;
                }
                else if (item.item_id <= 292 && item.item_id >= 279) {
                    if (methods.parseInt(item.count) == 0)
                        desc = "Пустая";
                }
                else if (item.item_id <= 274 && item.item_id >= 264) {
                    itemName = params.name;
                }
                else if (item.item_id <= 473 && item.item_id >= 293) {
                    desc = 'Используется для: ' + items.getWeaponNameByName(items.getItemNameHashById(item.item_id));
                }
                else if (item.item_id == 50) {
                    itemName = items.getItemNameById(item.item_id);
                    desc = methods.bankFormat(params.number);
                }

                if (item.is_equip == 1) {

                    let success = true;

                    if (item.item_id == 50) {
                        if (params.number != user.getCache('bank_card')) {
                            inventory.updateEquipStatus(item.id, false);
                            success = false;
                        }
                    }

                    if (item.item_id <= 137 && item.item_id >= 54) {

                        let slot = weapons.getGunSlotIdByItem(item.item_id);

                        if (params.serial != user.getCache('weapon_' + slot)) {
                            inventory.updateEquipStatus(item.id, false);

                            currentItems.push({
                                id: item.id,
                                item_id: item.item_id,
                                name: itemName,
                                counti: item.count,
                                volume: items.getItemAmountById(item.item_id),
                                desc: desc,
                                params: params
                            });
                            return;
                        }

                        let wpName = items.getItemNameHashById(item.item_id);
                        let wpHash = weapons.getHashByName(wpName);
                        if (!mp.game.invoke(methods.HAS_PED_GOT_WEAPON, mp.players.local.handle, wpHash, false)) {
                            user.giveWeapon(wpName, user.getCache('weapon_' + slot + '_ammo'));

                            user.removeAllWeaponComponentsByHash(wpHash);
                            user.setWeaponTintByHash(wpHash, 0);

                            if (params.slot1)
                                user.giveWeaponComponentByHash(wpHash, params.slot1hash);
                            if (params.slot2)
                                user.giveWeaponComponentByHash(wpHash, params.slot2hash);
                            if (params.slot3)
                                user.giveWeaponComponentByHash(wpHash, params.slot3hash);
                            if (params.slot4)
                                user.giveWeaponComponentByHash(wpHash, params.slot4hash);
                            if (params.superTint)
                                user.giveWeaponComponentByHash(wpHash, params.superTint);
                            if (params.tint)
                                user.setWeaponTintByHash(wpHash, params.tint);

                            ui.callCef('inventory', JSON.stringify({type: "updateSelectWeapon", selectId: item.id}));

                            mp.attachmentMngr.addLocal('WDSP_' + wpName.toUpperCase());
                        }

                        equipWeapons.push({
                            id: item.id,
                            item_id: item.item_id,
                            name: itemName,
                            counti: 0,
                            volume: items.getItemAmountById(item.item_id),
                            desc: desc,
                            params: params
                        });
                        return;
                    }

                    if (success) {
                        equipItems.push({
                            id: item.id,
                            item_id: item.item_id,
                            name: itemName,
                            counti: item.count,
                            volume: items.getItemAmountById(item.item_id),
                            desc: desc,
                            params: params
                        });
                    }
                    else {
                        currentItems.push({
                            id: item.id,
                            item_id: item.item_id,
                            name: itemName,
                            counti: item.count,
                            volume: items.getItemAmountById(item.item_id),
                            desc: desc,
                            params: params
                        });
                    }
                }
                else {
                    currentItems.push({
                        id: item.id,
                        item_id: item.item_id,
                        name: itemName,
                        counti: item.count,
                        volume: items.getItemAmountById(item.item_id),
                        desc: desc,
                        params: params
                    });
                }
            } catch (e) {
                methods.debug('menuList.showToPlayerItemListMenu2', e);
            }
        });

        if (ownerType == inventory.types.Player && user.getCache('id') == ownerId) {
            let dataSend = {
                type: 'updateItems',
                items: currentItems,
                ownerId: ownerId,
                ownerType: ownerType,
                sum: sum,
            };

            let dataSend2 = {
                type: 'updateEquipItems',
                items: equipItems
            };

            let dataSend3 = {
                type: 'updateWeaponItems',
                items: equipWeapons
            };

            let slotUse = [];
            equipWeapons.forEach(item => {
                let slot = weapons.getGunSlotIdByItem(item.item_id);
                if (item.params.serial == user.getCache('weapon_' + slot))
                    slotUse.push(slot);
            });


            for (let i = 1; i < 6; i++) {
                if (!slotUse.includes(i)) {
                    user.set('weapon_' + i, '');
                    user.set('weapon_' + i + '_ammo', -1);
                }
            }

            ui.callCef('inventory', JSON.stringify(dataSend));
            ui.callCef('inventory', JSON.stringify(dataSend2));
            ui.callCef('inventory', JSON.stringify(dataSend3));
        }
        else {
            let dataSend = {
                type: 'updateSubItems',
                items: currentItems,
                ownerId: ownerId,
                ownerType: ownerType,
                sum: sum,
            };
            ui.callCef('inventory', JSON.stringify(dataSend));
            inventory.show();
            mp.gui.cursor.show(true, true);

            ui.callCef('inventory', JSON.stringify({type: "updateSubMax", maxSum: await inventory.getInvAmountMax(ownerId, ownerType)}));
        }

        inventory.setInvAmount(ownerId, ownerType, sum);
    }
    catch (e) {
       methods.debug('menuList.showToPlayerItemListMenu', e);
    }
};

menuList.showInvaderShopMenu = function() {

    let menu = UIMenu.Menu.Create(`LifeInvader`, `~b~Меню LifeInvader`);

    let price = 200;
    UIMenu.Menu.AddMenuItem("Арендовать рабочий транспорт", "Стоимость: ~g~" + methods.moneyFormat(price)).doName = 'spawnCar';

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");
    menu.ItemSelect.on(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName == 'spawnCar') {

            if (user.getCache('job') != 3) {
                mp.game.ui.notifications.show(`~r~Необходимо работать фотографом`);
                return;
            }

            if (user.getMoney() < price) {
                mp.game.ui.notifications.show(`~r~У Вас недостаточно средств`);
                return;
            }

            vehicles.spawnJobCar(-1051.93359375, -249.95065307617188, 37.56923294067383, 203.91482543945312, 'Rebel2', 3);
        }
    });
};

menuList.showBankMenu = async function(bankId, price) {

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }


    let getBankPrefix = user.getBankCardPrefix();

    if (
        bankId == 1 && getBankPrefix == 6000 ||
        bankId == 2 && getBankPrefix == 7000 ||
        bankId == 3 && getBankPrefix == 8000 ||
        bankId == 4 && getBankPrefix == 9000
    ) {

        let pin = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите пинкод", "", 4));

        if (pin == user.getCache('bank_pin')) {
            let menu = UIMenu.Menu.Create(`Банк`, `~b~Нажмите "~g~Enter~b~", чтобы выбрать пункт`);
            UIMenu.Menu.AddMenuItem("~b~Баланс~s~").SetRightLabel('~g~' + methods.moneyFormat(user.getBankMoney(), 99999999999));
            UIMenu.Menu.AddMenuItem("~b~Номер карты~s~").SetRightLabel(methods.bankFormat(user.getCache('bank_card')));
            UIMenu.Menu.AddMenuItem("~b~Владелец карты~s~").SetRightLabel(methods.bankFormat(user.getCache('bank_owner')));

            UIMenu.Menu.AddMenuItem("Снять средства").eventName = 'server:bank:withdraw';
            UIMenu.Menu.AddMenuItem("Положить средства").eventName = 'server:bank:deposit';
            UIMenu.Menu.AddMenuItem("Перевести на другой счет", '1% от суммы, при переводе').eventName = 'server:bank:transferMoney';

            UIMenu.Menu.AddMenuItem("~b~История по счёту").eventName = 'server:bank:history';

            UIMenu.Menu.AddMenuItem("~y~Сменить пинкод").eventName = 'server:bank:changePin';
            UIMenu.Menu.AddMenuItem("~r~Закрыть счёт").eventName = 'server:bank:closeCard';
            UIMenu.Menu.AddMenuItem("~r~Закрыть меню");

            menu.ItemSelect.on(async (item, index) => {
                UIMenu.Menu.HideMenu();
                if (item.eventName == 'server:bank:withdraw') {
                    let mStr = await UIMenu.Menu.GetUserInput("Сумма снятия", "", 9);
                    if (mStr == '')
                        return;
                    let money = methods.parseFloat(mStr);
                    mp.events.callRemote(item.eventName, money, 0);
                }
                else if (item.eventName == 'server:bank:deposit') {
                    let mStr = await UIMenu.Menu.GetUserInput("Сумма внесения", "", 9);
                    if (mStr == '')
                        return;
                    let money = methods.parseFloat(mStr);
                    mp.events.callRemote(item.eventName, money, 0);
                }
                else if (item.eventName == 'server:bank:transferMoney') {
                    let bankNumber = methods.parseInt(await UIMenu.Menu.GetUserInput("Номер карты", "", 16));
                    let money = methods.parseFloat(await UIMenu.Menu.GetUserInput("Сумма перевода", "", 9));
                    mp.events.callRemote(item.eventName, bankNumber, money);
                }
                else if (item.eventName == 'server:bank:changePin') {
                    let pin1 = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите пинкод", "", 4));
                    let pin2 = methods.parseInt(await UIMenu.Menu.GetUserInput("Повторите пинкод", "", 4));
                    if (pin1 == pin2)
                        mp.events.callRemote(item.eventName, pin1);
                    else
                        mp.game.ui.notifications.show(`~r~Пинкоды не совпадают`);
                }
                else if (item.eventName == 'server:bank:history') {
                    mp.events.callRemote(item.eventName);
                }
                else if (item.eventName == 'server:bank:changeCardNumber') {
                    let bankNumber = methods.parseInt(await UIMenu.Menu.GetUserInput("Желаемый номер карты", "", 9));
                    mp.events.callRemote(item.eventName, bankNumber);
                }
                else if (item.eventName == 'server:bank:closeCard') {
                    mp.events.callRemote(item.eventName);
                }
            });
        }
        else {
            mp.game.ui.notifications.show(`~r~Вы ввели не верный пинкод`);
        }
    }
    else {
        let menu = UIMenu.Menu.Create(`Банк`, `~b~Нажмите "~g~Enter~b~", чтобы выбрать пункт`);
        UIMenu.Menu.AddMenuItem("Оформить карту банка", "Цена: ~g~$" + (price * 100)).eventName = 'server:bank:openCard';
        UIMenu.Menu.AddMenuItem("~r~Закрыть");

        menu.ItemSelect.on(async (item, index) => {
            UIMenu.Menu.HideMenu();
            if (item.eventName == 'server:bank:openCard') {
                mp.events.callRemote(item.eventName, bankId, price * 100);
            }
        });
    }
};

menuList.showAtmMenu = async function() {
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    if (user.get('bank_card') < 1) {
        mp.game.ui.notifications.show("~r~У Вас нет банковской карты");
        return;
    }

    let pin = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите пинкод", "", 4));
    if (pin != user.getCache('bank_pin')) {
        mp.game.ui.notifications.show(`~r~Вы ввели не верный пинкод`);
        return;
    }

    let menu = UIMenu.Menu.Create(`Банкомат`, `~b~Нажмите "~g~Enter~b~", чтобы выбрать пункт`);

    UIMenu.Menu.AddMenuItem("~b~Баланс~s~").SetRightLabel('~g~' + methods.moneyFormat(user.getBankMoney(), 99999999999));
    UIMenu.Menu.AddMenuItem("~b~Номер карты~s~").SetRightLabel(methods.bankFormat(user.getCache('bank_card')));
    UIMenu.Menu.AddMenuItem("~b~Владелец карты~s~").SetRightLabel(methods.bankFormat(user.getCache('bank_owner')));

    UIMenu.Menu.AddMenuItem("Снять средства", '~r~Комиссия~s~ 1%').eventName = 'server:bank:withdraw';
    UIMenu.Menu.AddMenuItem("Положить средства", '~r~Комиссия~s~ 1%').eventName = 'server:bank:deposit';
    UIMenu.Menu.AddMenuItem("Перевести на другой счет", '1% от суммы, при переводе').eventName = 'server:bank:transferMoney';

    UIMenu.Menu.AddMenuItem("~b~История по счёту").eventName = 'server:bank:history';

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");
    menu.ItemSelect.on(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.eventName == 'server:bank:withdraw') {
            let money = methods.parseFloat(await UIMenu.Menu.GetUserInput("Сумма снятия", "", 11));
            mp.events.callRemote(item.eventName, money, 1);
        }
        else if (item.eventName == 'server:bank:deposit') {
            let money = methods.parseFloat(await UIMenu.Menu.GetUserInput("Сумма внесения", "", 11));
            mp.events.callRemote(item.eventName, money, 1);
        }
        else if (item.eventName == 'server:bank:transferMoney') {
            let bankNumber = methods.parseInt(await UIMenu.Menu.GetUserInput("Номер карты", "", 16));
            let money = methods.parseFloat(await UIMenu.Menu.GetUserInput("Сумма перевода", "", 9));
            mp.events.callRemote(item.eventName, bankNumber, money);
        }
        else if (item.eventName == 'server:bank:history') {
            mp.events.callRemote(item.eventName);
        }
    });
};

menuList.showBarberShopMenu = function (shopId) {

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    let title1 = "commonmenu";
    let title2 = "interaction_bgd";

    switch (shopId) {
        case 109:
            title1 = "shopui_title_barber";
            title2 = "shopui_title_barber";
            break;
        case 110:
            title1 = "shopui_title_barber2";
            title2 = "shopui_title_barber2";
            break;
        case 111:
            title1 = "shopui_title_barber3";
            title2 = "shopui_title_barber3";
            break;
        case 48:
            title1 = "shopui_title_barber4";
            title2 = "shopui_title_barber4";
            break;
        case 112:
            title1 = "shopui_title_highendsalon";
            title2 = "shopui_title_highendsalon";
            break;
    }


    let skin = {};

    skin.SKIN_HAIR = methods.parseInt(user.getCache('SKIN_HAIR'));
    skin.SKIN_HAIR_COLOR = methods.parseInt(user.getCache('SKIN_HAIR_COLOR'));
    skin.SKIN_HAIR_COLOR_2 = methods.parseInt(user.getCache('SKIN_HAIR_COLOR_2'));
    skin.SKIN_EYE_COLOR = methods.parseInt(user.getCache('SKIN_EYE_COLOR'));
    skin.SKIN_EYEBROWS = methods.parseInt(user.getCache('SKIN_EYEBROWS'));
    skin.SKIN_EYEBROWS_COLOR = methods.parseInt(user.getCache('SKIN_EYEBROWS_COLOR'));
    skin.SKIN_OVERLAY_9 = methods.parseInt(user.getCache('SKIN_OVERLAY_9'));
    skin.SKIN_OVERLAY_COLOR_9 = methods.parseInt(user.getCache('SKIN_OVERLAY_COLOR_9'));
    skin.SKIN_OVERLAY_1 = methods.parseInt(user.getCache('SKIN_OVERLAY_1'));
    skin.SKIN_OVERLAY_COLOR_1 = methods.parseInt(user.getCache('SKIN_OVERLAY_COLOR_1'));
    skin.SKIN_OVERLAY_4 = methods.parseInt(user.getCache('SKIN_OVERLAY_4'));
    skin.SKIN_OVERLAY_COLOR_4 = methods.parseInt(user.getCache('SKIN_OVERLAY_COLOR_4'));
    skin.SKIN_OVERLAY_5 = methods.parseInt(user.getCache('SKIN_OVERLAY_5'));
    skin.SKIN_OVERLAY_COLOR_5 = methods.parseInt(user.getCache('SKIN_OVERLAY_COLOR_5'));
    skin.SKIN_OVERLAY_8 = methods.parseInt(user.getCache('SKIN_OVERLAY_8'));
    skin.SKIN_OVERLAY_COLOR_8 = methods.parseInt(user.getCache('SKIN_OVERLAY_COLOR_8'));
    skin.SKIN_OVERLAY_10 = methods.parseInt(user.getCache('SKIN_OVERLAY_10'));
    skin.SKIN_OVERLAY_COLOR_10 = methods.parseInt(user.getCache('SKIN_OVERLAY_COLOR_10'));

    let menu = UIMenu.Menu.Create(" ", "~b~Влево/вправо менять внешность", false, false, false, title1, title2);

    let list = [];

    if (user.getSex() == 1) {
        for (let j = 0; j < 77; j++) {
            list.push(j + '');
        }
    }
    else {
        for (let j = 0; j < 72; j++) {
            list.push(j + '');
        }
    }

    let menuListItem = UIMenu.Menu.AddMenuItemList('Причёска', list, `Цена: ~g~$400`);
    menuListItem.doName = 'SKIN_HAIR';
    menuListItem.price = 400.01;
    menuListItem.label = "Причёска";
    menuListItem.Index = skin.SKIN_HAIR;

    list = [];
    for (let j = 0; j < 64; j++) {
        list.push(j + '');
    }
    menuListItem = UIMenu.Menu.AddMenuItemList('Цвет волос', list, `Цена: ~g~$160`);
    menuListItem.doName = 'SKIN_HAIR_COLOR';
    menuListItem.price = 160.01;
    menuListItem.label = "Цвет волос";
    menuListItem.Index = skin.SKIN_HAIR_COLOR;

    list = [];
    for (let j = 0; j < 64; j++) {
        list.push(j + '');
    }
    menuListItem = UIMenu.Menu.AddMenuItemList('Мелирование волос', list, `Цена: ~g~$160`);
    menuListItem.doName = 'SKIN_HAIR_COLOR_2';
    menuListItem.price = 160.01;
    menuListItem.label = "Мелирование волос";
    menuListItem.Index = skin.SKIN_HAIR_COLOR_2;

    list = [];
    for (let j = 0; j < 32; j++) {
        list.push(j + '');
    }
    menuListItem = UIMenu.Menu.AddMenuItemList('Цвет глаз', list, `Цена: ~g~$120`);
    menuListItem.doName = 'SKIN_EYE_COLOR';
    menuListItem.price = 120.01;
    menuListItem.label = "Цвет глаз";
    menuListItem.Index = skin.SKIN_EYE_COLOR;

    list = [];
    for (let j = 0; j < 30; j++) {
        list.push(j + '');
    }
    menuListItem = UIMenu.Menu.AddMenuItemList('Брови', list, `Цена: ~g~$70`);
    menuListItem.doName = 'SKIN_EYEBROWS';
    menuListItem.price = 70.01;
    menuListItem.label = "Брови";
    menuListItem.Index = skin.SKIN_EYEBROWS;

    list = [];
    for (let j = 0; j < 64; j++) {
        list.push(j + '');
    }
    menuListItem = UIMenu.Menu.AddMenuItemList('Цвет бровей', list, `Цена: ~g~$60`);
    menuListItem.doName = 'SKIN_EYEBROWS_COLOR';
    menuListItem.price = 60.01;
    menuListItem.Index = skin.SKIN_EYEBROWS_COLOR;

    list = ['~r~Нет'];
    for (let j = 0; j < 10; j++) {
        list.push(j + '');
    }
    menuListItem = UIMenu.Menu.AddMenuItemList('Веснушки', list, `Цена: ~g~$250`);
    menuListItem.doName = 'SKIN_OVERLAY_9';
    menuListItem.price = 250.01;
    menuListItem.label = "Веснушки";
    menuListItem.Index = skin.SKIN_OVERLAY_9 + 1;

    list = [];
    for (let j = 0; j < 5; j++) {
        list.push(j + '');
    }
    menuListItem = UIMenu.Menu.AddMenuItemList('Цвет веснушек', list, `Цена: ~g~$50`);
    menuListItem.doName = 'SKIN_OVERLAY_COLOR_9';
    menuListItem.price = 50.01;
    menuListItem.label = "Цвет веснушек";
    menuListItem.Index = skin.SKIN_OVERLAY_COLOR_9;

    if (user.getSex() == 0) {
        list = ['~r~Нет'];
        for (let j = 0; j < 30; j++) {
            list.push(j + '');
        }
        menuListItem = UIMenu.Menu.AddMenuItemList('Борода', list, `Цена: ~g~$250`);
        menuListItem.doName = 'SKIN_OVERLAY_1';
        menuListItem.price = 250.01;
        menuListItem.label = "Борода";
        menuListItem.Index = skin.SKIN_OVERLAY_1 + 1;

        list = [];
        for (let j = 0; j < 64; j++) {
            list.push(j + '');
        }
        menuListItem = UIMenu.Menu.AddMenuItemList('Цвет бороды', list, `Цена: ~g~$120`);
        menuListItem.doName = 'SKIN_OVERLAY_COLOR_1';
        menuListItem.price = 120.01;
        menuListItem.label = "Цвет бороды";
        menuListItem.Index = skin.SKIN_OVERLAY_COLOR_1;

        list = ['~r~Нет'];
        for (let j = 0; j < mp.game.ped.getNumHeadOverlayValues(10) + 1; j++) {
            list.push(j + '');
        }
        menuListItem = UIMenu.Menu.AddMenuItemList('Волосы на груди', list, `Цена: ~g~$250`);
        menuListItem.doName = 'SKIN_OVERLAY_10';
        menuListItem.price = 250.01;
        menuListItem.label = "Волосы на груди";
        menuListItem.Index = skin.SKIN_OVERLAY_10 + 1;

        list = [];
        for (let j = 0; j < 64; j++) {
            list.push(j + '');
        }
        menuListItem = UIMenu.Menu.AddMenuItemList('Волосы на груди', list, `Цена: ~g~$600`);
        menuListItem.doName = 'SKIN_OVERLAY_COLOR_10';
        menuListItem.price = 600.01;
        menuListItem.label = "Волосы на груди";
        menuListItem.Index = skin.SKIN_OVERLAY_COLOR_10;
    }
    else {
        list = ['~r~Нет'];
        for (let j = 0; j < mp.game.ped.getNumHeadOverlayValues(8) + 1; j++) {
            list.push(j + '');
        }
        menuListItem = UIMenu.Menu.AddMenuItemList('Помада', list, `Цена: ~g~$250`);
        menuListItem.doName = 'SKIN_OVERLAY_8';
        menuListItem.price = 250.01;
        menuListItem.label = "Помада";
        menuListItem.Index = skin.SKIN_OVERLAY_8 + 1;

        list = [];
        for (let j = 0; j < 60; j++) {
            list.push(j + '');
        }
        menuListItem = UIMenu.Menu.AddMenuItemList('Цвет помады', list, `Цена: ~g~$110`);
        menuListItem.doName = 'SKIN_OVERLAY_COLOR_8';
        menuListItem.price = 110.01;
        menuListItem.label = "Цвет помады";
        menuListItem.Index = skin.SKIN_OVERLAY_COLOR_8;

        list = ['~r~Нет'];
        for (let j = 0; j < 7; j++) {
            list.push(j + '');
        }
        menuListItem = UIMenu.Menu.AddMenuItemList('Румянец', list, `Цена: ~g~$250`);
        menuListItem.doName = 'SKIN_OVERLAY_5';
        menuListItem.price = 250.01;
        menuListItem.label = "Румянец";
        menuListItem.Index = skin.SKIN_OVERLAY_5 + 1;

        list = [];
        for (let j = 0; j < 60; j++) {
            list.push(j + '');
        }
        menuListItem = UIMenu.Menu.AddMenuItemList('Цвет румянца', list, `Цена: ~g~$110`);
        menuListItem.doName = 'SKIN_OVERLAY_COLOR_5';
        menuListItem.price = 110.01;
        menuListItem.label = "Цвет румянца";
        menuListItem.Index = skin.SKIN_OVERLAY_COLOR_5;

        list = ['~r~Нет'];
        for (let j = 0; j < mp.game.ped.getNumHeadOverlayValues(8) + 1; j++) {
            list.push(j + '');
        }
        menuListItem = UIMenu.Menu.AddMenuItemList('Макияж', list, `Цена: ~g~$300`);
        menuListItem.doName = 'SKIN_OVERLAY_4';
        menuListItem.price = 300.01;
        menuListItem.label = "Макияж";
        menuListItem.Index = skin.SKIN_OVERLAY_4 + 1;

        list = [];
        for (let j = 0; j < 10; j++) {
            list.push(j + '');
        }
        menuListItem = UIMenu.Menu.AddMenuItemList('Цвет макияжа', list, `Цена: ~g~$150`);
        menuListItem.doName = 'SKIN_OVERLAY_COLOR_4';
        menuListItem.price = 150.01;
        menuListItem.label = "Цвет макияжа";
        menuListItem.Index = skin.SKIN_OVERLAY_COLOR_4;
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть").doName = "closeButton";

    menu.MenuClose.on((sender) =>
    {
        user.updateCharacterFace();
    });

    let currentListChangeItem = null;
    let currentListChangeItemIndex = 0;

    menu.ListChange.on((item, index) => {
        currentListChangeItem = item;
        currentListChangeItemIndex = index;

        switch (item.doName) {
            case 'SKIN_HAIR':

                if (index == 23 || index == 24)
                    skin.SKIN_HAIR = 1;
                else
                    skin.SKIN_HAIR = index;
                mp.players.local.setComponentVariation(2, skin.SKIN_HAIR, 0, 2);
                mp.players.local.setHairColor(skin.SKIN_HAIR_COLOR, skin.SKIN_HAIR_COLOR_2);

                user.updateTattoo(true, true, true, false);

                let data = JSON.parse(enums.get('overlays'))[user.getSex()][skin.SKIN_HAIR];
                user.setDecoration(data[0], data[1], true);
                break;
            case 'SKIN_HAIR_COLOR':
                skin.SKIN_HAIR_COLOR = index;
                mp.players.local.setHairColor(skin.SKIN_HAIR_COLOR, skin.SKIN_HAIR_COLOR_2);
                break;
            case 'SKIN_HAIR_COLOR_2':
                skin.SKIN_HAIR_COLOR_2 = index;
                mp.players.local.setHairColor(skin.SKIN_HAIR_COLOR, skin.SKIN_HAIR_COLOR_2);
                break;
            case 'SKIN_EYE_COLOR':
                skin.SKIN_EYE_COLOR = index;
                mp.players.local.setEyeColor(skin.SKIN_EYE_COLOR);
                break;
            case 'SKIN_EYEBROWS':
                skin.SKIN_EYEBROWS = index;
                mp.players.local.setHeadOverlay(2, skin.SKIN_EYEBROWS, 1.0, skin.SKIN_EYEBROWS_COLOR, 0);
                break;
            case 'SKIN_EYEBROWS_COLOR':
                skin.SKIN_EYEBROWS_COLOR = index;
                mp.players.local.setHeadOverlay(2, skin.SKIN_EYEBROWS, 1.0, skin.SKIN_EYEBROWS_COLOR, 0);
                break;
            case 'SKIN_OVERLAY_9':
                skin.SKIN_OVERLAY_9 = index - 1;
                mp.players.local.setHeadOverlay(9, skin.SKIN_OVERLAY_9, 1.0, skin.SKIN_OVERLAY_COLOR_9, 0);
                break;
            case 'SKIN_OVERLAY_COLOR_9':
                skin.SKIN_OVERLAY_COLOR_9 = index;
                mp.players.local.setHeadOverlay(9, skin.SKIN_OVERLAY_9, 1.0, skin.SKIN_OVERLAY_COLOR_9, 0);
                break;
            case 'SKIN_OVERLAY_1':
                skin.SKIN_OVERLAY_1 = index - 1;
                mp.players.local.setHeadOverlay(1, skin.SKIN_OVERLAY_1, 1.0, skin.SKIN_OVERLAY_COLOR_1, 0);
                break;
            case 'SKIN_OVERLAY_COLOR_1':
                skin.SKIN_OVERLAY_COLOR_1 = index;
                mp.players.local.setHeadOverlay(1, skin.SKIN_OVERLAY_1, 1.0, skin.SKIN_OVERLAY_COLOR_1, 0);
                break;
            case 'SKIN_OVERLAY_4':
                skin.SKIN_OVERLAY_4 = index - 1;
                mp.players.local.setHeadOverlay(4, skin.SKIN_OVERLAY_4, 1.0, skin.SKIN_OVERLAY_COLOR_4, 0);
                break;
            case 'SKIN_OVERLAY_COLOR_4':
                skin.SKIN_OVERLAY_COLOR_4 = index;
                mp.players.local.setHeadOverlay(4, skin.SKIN_OVERLAY_4, 1.0, skin.SKIN_OVERLAY_COLOR_4, 0);
                break;
            case 'SKIN_OVERLAY_5':
                skin.SKIN_OVERLAY_5 = index - 1;
                mp.players.local.setHeadOverlay(5, skin.SKIN_OVERLAY_5, 1.0, skin.SKIN_OVERLAY_COLOR_5, 0);
                break;
            case 'SKIN_OVERLAY_COLOR_5':
                skin.SKIN_OVERLAY_COLOR_5 = index;
                mp.players.local.setHeadOverlay(5, skin.SKIN_OVERLAY_5, 1.0, skin.SKIN_OVERLAY_COLOR_5, 0);
                break;
            case 'SKIN_OVERLAY_8':
                skin.SKIN_OVERLAY_8 = index - 1;
                mp.players.local.setHeadOverlay(8, skin.SKIN_OVERLAY_8, 1.0, skin.SKIN_OVERLAY_COLOR_8, 0);
                break;
            case 'SKIN_OVERLAY_COLOR_8':
                skin.SKIN_OVERLAY_COLOR_8 = index;
                mp.players.local.setHeadOverlay(8, skin.SKIN_OVERLAY_8, 1.0, skin.SKIN_OVERLAY_COLOR_8, 0);
                break;
            case 'SKIN_OVERLAY_10':
                skin.SKIN_OVERLAY_10 = index - 1;
                mp.players.local.setHeadOverlay(10, skin.SKIN_OVERLAY_10, 1.0, skin.SKIN_OVERLAY_COLOR_10, 0);
                break;
            case 'SKIN_OVERLAY_COLOR_10':
                skin.SKIN_OVERLAY_COLOR_10 = index;
                mp.players.local.setHeadOverlay(10, skin.SKIN_OVERLAY_10, 1.0, skin.SKIN_OVERLAY_COLOR_10, 0);
                break;
        }
    });

    menu.ItemSelect.on(async (item, index) => {
        try {
            UIMenu.Menu.HideMenu();
            if (item == currentListChangeItem) {

                switch (item.doName) {
                    case 'SKIN_OVERLAY_1':
                    case 'SKIN_OVERLAY_4':
                    case 'SKIN_OVERLAY_5':
                    case 'SKIN_OVERLAY_8':
                    case 'SKIN_OVERLAY_9':
                    case 'SKIN_OVERLAY_10':
                        currentListChangeItemIndex = currentListChangeItemIndex - 1;
                        break;
                }

                if (user.getMoney() < item.price) {
                    mp.game.ui.notifications.show("~r~У Вас недостаточно денег");
                    return;
                }

                if (item.price < 1)
                    return;

                user.removeMoney(methods.parseInt(item.price), 'Услуги барбершопа ' + item.label);
                business.addMoney(shopId, methods.parseInt(item.price), item.label);
                user.set(item.doName, currentListChangeItemIndex);
                mp.game.ui.notifications.show("~g~Вы изменили внешность по цене: ~s~$" + methods.parseInt(item.price));
                user.updateCharacterFace();
                user.save();
            }
            if (item.doName == 'grab') {
                user.grab(shopId);
            }
            if (item.doName == "closeButton") {
                user.updateCharacterFace();
            }
        }
        catch (e) {

            methods.debug('Exception: menuList.showBarberShopMenu menu.ItemSelect');
            methods.debug(e);
        }
    });
};

menuList.showBarMenu = function(shopId, price = 1)
{
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    let menu = UIMenu.Menu.Create("Бар", "~b~Меню бара");

    let itemPrice = 0.50 * price;
    let menuItem = UIMenu.Menu.AddMenuItem("Вода", `Цена: ~g~${methods.moneyFormat(itemPrice)}`);
    menuItem.price = itemPrice;
    menuItem.label = "воду";
    menuItem.label2 = "Вода";

    itemPrice = 0.90 * price;
    menuItem = UIMenu.Menu.AddMenuItem("Лимонад", `Цена: ~g~${methods.moneyFormat(itemPrice)}`);
    menuItem.price = itemPrice;
    menuItem.label = "лимонад";
    menuItem.label2 = "Лимонад";

    itemPrice = 0.99 * price;
    menuItem = UIMenu.Menu.AddMenuItem("Кола", `Цена: ~g~${methods.moneyFormat(itemPrice)}`);
    menuItem.price = itemPrice;
    menuItem.label = "колу";
    menuItem.label2 = "Кола";

    itemPrice = 6.70 * price;
    menuItem = UIMenu.Menu.AddMenuItem("Пиво", `Цена: ~g~${methods.moneyFormat(itemPrice)}`);
    menuItem.price = itemPrice;
    menuItem.label = "пиво";
    menuItem.label2 = "Пиво";
    menuItem.drunkLevel = 100;

    itemPrice = 9.99 * price;
    menuItem = UIMenu.Menu.AddMenuItem("Водка", `Цена: ~g~${methods.moneyFormat(itemPrice)}`);
    menuItem.price = itemPrice;
    menuItem.label = "водку";
    menuItem.label2 = "Водка";
    menuItem.drunkLevel = 200;

    itemPrice = 12 * price;
    menuItem = UIMenu.Menu.AddMenuItem("Текила", `Цена: ~g~${methods.moneyFormat(itemPrice)}`);
    menuItem.price = itemPrice;
    menuItem.label = "текилу";
    menuItem.label2 = "Текила";
    menuItem.drunkLevel = 200;

    itemPrice = 14 * price;
    menuItem = UIMenu.Menu.AddMenuItem("Бурбон", `Цена: ~g~${methods.moneyFormat(itemPrice)}`);
    menuItem.price = itemPrice;
    menuItem.label = "бурбон";
    menuItem.label2 = "Бурбон";
    menuItem.drunkLevel = 200;

    itemPrice = 25 * price;
    menuItem = UIMenu.Menu.AddMenuItem("Виски", `Цена: ~g~${methods.moneyFormat(itemPrice)}`);
    menuItem.price = itemPrice;
    menuItem.label = "виски";
    menuItem.label2 = "Виски";
    menuItem.drunkLevel = 200;

    UIMenu.Menu.AddMenuItem("~r~Закрыть").doName = "closeButton";
    menu.ItemSelect.on(async (item, index) => {
        UIMenu.Menu.HideMenu();
        try {
            if (item.price > 0) {
                if (user.getMoney() < item.price) {
                    mp.game.ui.notifications.show("~r~У Вас недостаточно средств");
                    return;
                }

                business.addMoney(shopId, item.price, item.label2);
                user.removeMoney(item.price, 'Выпил ' + item.label + ' в баре');

                if (mp.players.local.health < 90)
                    mp.players.local.health += 5;

                if (item.drunkLevel)
                    user.addDrugLevel(99, item.drunkLevel);

                chat.sendMeCommand(`выпил ${item.label}`);
                user.playAnimation("mp_player_intdrink", "loop_bottle", 48);
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

menuList.showBarFreeMenu = function(price = 1)
{
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    let menu = UIMenu.Menu.Create("Бар", "~b~Меню бара");

    let menuItem = UIMenu.Menu.AddMenuItem("Вода");
    menuItem.label = "воду";

    menuItem = UIMenu.Menu.AddMenuItem("Лимонад");
    menuItem.label = "лимонад";

    menuItem = UIMenu.Menu.AddMenuItem("Кола");
    menuItem.label = "колу";

    menuItem = UIMenu.Menu.AddMenuItem("Пиво");
    menuItem.label = "пиво";
    menuItem.drunkLevel = 100;

    menuItem = UIMenu.Menu.AddMenuItem("Водка");
    menuItem.label = "водку";
    menuItem.drunkLevel = 200;

    menuItem = UIMenu.Menu.AddMenuItem("Текила");
    menuItem.price = itemPrice;
    menuItem.label = "текилу";
    menuItem.drunkLevel = 200;

    menuItem = UIMenu.Menu.AddMenuItem("Бурбон");
    menuItem.label = "бурбон";
    menuItem.drunkLevel = 200;

    menuItem = UIMenu.Menu.AddMenuItem("Виски");
    menuItem.label = "виски";
    menuItem.drunkLevel = 200;

    UIMenu.Menu.AddMenuItem("~r~Закрыть").doName = "closeButton";
    menu.ItemSelect.on(async (item, index) => {
        UIMenu.Menu.HideMenu();
        try {
            if (item.price > 0) {

                if (mp.players.local.health < 90)
                    mp.players.local.health += 5;

                if (item.drunkLevel)
                    user.addDrugLevel(99, item.drunkLevel);

                chat.sendMeCommand(`выпил ${item.label}`);
                user.playAnimation("mp_player_intdrink", "loop_bottle", 48);
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

menuList.showRentBikeMenu = function(shopId, price = 1)
{
    UIMenu.Menu.HideMenu();

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    let menu = UIMenu.Menu.Create("Аренда", "~b~Аренда");

    if (user.getCache('online_time') <= 370)
        price = 1;

    let itemPrice = 3 * price;
    let menuItem = UIMenu.Menu.AddMenuItem("Cruiser", `Цена: ~g~${methods.moneyFormat(itemPrice)}`);
    menuItem.price = itemPrice;
    menuItem.hash = 448402357;

    itemPrice = 5 * price;
    menuItem = UIMenu.Menu.AddMenuItem("Bmx", `Цена: ~g~${methods.moneyFormat(itemPrice)}`);
    menuItem.price = itemPrice;
    menuItem.hash = 1131912276;

    itemPrice = 10 * price;
    menuItem = UIMenu.Menu.AddMenuItem("Fixter", `Цена: ~g~${methods.moneyFormat(itemPrice)}`);
    menuItem.price = itemPrice;
    menuItem.hash = -836512833;

    itemPrice = 10 * price;
    menuItem = UIMenu.Menu.AddMenuItem("Scorcher", `Цена: ~g~${methods.moneyFormat(itemPrice)}`);
    menuItem.price = itemPrice;
    menuItem.hash = -186537451;

    itemPrice = 30 * price;
    menuItem = UIMenu.Menu.AddMenuItem("TriBike", `Цена: ~g~${methods.moneyFormat(itemPrice)}`);
    menuItem.price = itemPrice;
    menuItem.hash = 1127861609;

    itemPrice = 30 * price;
    menuItem = UIMenu.Menu.AddMenuItem("TriBike2", `Цена: ~g~${methods.moneyFormat(itemPrice)}`);
    menuItem.price = itemPrice;
    menuItem.hash = -1233807380;

    itemPrice = 30 * price;
    menuItem = UIMenu.Menu.AddMenuItem("TriBike3", `Цена: ~g~${methods.moneyFormat(itemPrice)}`);
    menuItem.price = itemPrice;
    menuItem.hash = -400295096;

    itemPrice = 60 * price;
    menuItem = UIMenu.Menu.AddMenuItem("Faggio", `Цена: ~g~${methods.moneyFormat(itemPrice)}`);
    menuItem.price = itemPrice;
    menuItem.hash = -1842748181;

    itemPrice = 55 * price;
    menuItem = UIMenu.Menu.AddMenuItem("Faggio2", `Цена: ~g~${methods.moneyFormat(itemPrice)}`);
    menuItem.price = itemPrice;
    menuItem.hash = 55628203;

    itemPrice = 50 * price;
    menuItem = UIMenu.Menu.AddMenuItem("Faggio3", `Цена: ~g~${methods.moneyFormat(itemPrice)}`);
    menuItem.price = itemPrice;
    menuItem.hash = -1289178744;

    UIMenu.Menu.AddMenuItem("~r~Закрыть").doName = "closeButton";
    menu.ItemSelect.on((item, index) => {
        UIMenu.Menu.HideMenu();
        try {
            if (item.price > 0)
                mp.events.callRemote('server:rent:buy', item.hash, item.price, shopId);
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

menuList.showShopClothMenu = function (shopId, type, menuType) {
    try {
        methods.debug('Execute: menuList.showShopClothMenu');

        //if (menuType == 11)
        //    inventory.unEquipItem(265, 0, 1, 0, false);

        if (methods.isBlackout()) {
            mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
            return;
        }

        let title1 = "commonmenu";
        let title2 = "interaction_bgd";

        switch (type) {
            case 0:
                title1 = "shopui_title_lowendfashion";
                title2 = "shopui_title_lowendfashion";
                break;
            case 1:
                title1 = "shopui_title_midfashion";
                title2 = "shopui_title_midfashion";
                break;
            case 2:
                title1 = "shopui_title_highendfashion";
                title2 = "shopui_title_highendfashion";
                break;
            case 3:
                title1 = "shopui_title_gunclub";
                title2 = "shopui_title_gunclub";
                break;
            case 5:
                title1 = "shopui_title_lowendfashion2";
                title2 = "shopui_title_lowendfashion2";
                break;
        }

        let menu = UIMenu.Menu.Create(title1 != "commonmenu" ? " " : "Vangelico", "~b~Магазин", true, false, false, title1, title2);

        /*if (menuType == 5) {
            UIMenu.Menu.AddMenuItem("Бейсбольная бита", "Цена: ~g~$100").doName = "baseballBat";
            UIMenu.Menu.AddMenuItem("Бейсбольный мяч", "Цена: ~g~$10").doName = "baseballBall";
        }*/

        if (menuType == 0) {
            UIMenu.Menu.AddMenuItem("Головные уборы").doName = "head";
            UIMenu.Menu.AddMenuItem("Очки").doName = "glasses";
            UIMenu.Menu.AddMenuItem("Серьги").doName = "earring";
            UIMenu.Menu.AddMenuItem("Левая рука").doName = "leftHand";
            UIMenu.Menu.AddMenuItem("Правая рука").doName = "rightHand";
            UIMenu.Menu.AddMenuItem("~y~Ограбить").doName = 'grab';
        } else if (menuType == 1) {
            UIMenu.Menu.AddMenuItem("Головные уборы").doName = "head";
            UIMenu.Menu.AddMenuItem("Очки").doName = "glasses";
            UIMenu.Menu.AddMenuItem("Торс").doName = "body";
            UIMenu.Menu.AddMenuItem("Ноги").doName = "legs";
            UIMenu.Menu.AddMenuItem("Обувь").doName = "shoes";
        } else {

            if (type == 11)
                user.updateTattoo(true, true, false, true);

            let skin = JSON.parse(user.getCache('skin'));
            let cloth = skin.SKIN_SEX == 1 ? JSON.parse(enums.get('clothF')) : JSON.parse(enums.get('clothM'));
            for (let i = 0; i < cloth.length; i++) {
                let id = i;

                if (cloth[id][1] != menuType) continue;
                if (cloth[id][0] != type) continue;

                let list = [];
                for (let j = 0; j <= cloth[i][3] + 1; j++) {
                    list.push(j + '');
                }

                let menuListItem = UIMenu.Menu.AddMenuItemList(cloth[i][9].toString(), list, `Цена: ~g~${(methods.moneyFormat(cloth[i][8]))} ${(cloth[i][10] > -99 ? `\n~s~Термостойкость до ~g~${cloth[i][10]}°` : "")}`);

                menuListItem.id1 = cloth[id][1];
                menuListItem.id2 = cloth[id][2];
                menuListItem.id4 = cloth[id][4];
                menuListItem.id5 = cloth[id][5];
                menuListItem.id6 = cloth[id][6];
                menuListItem.id7 = cloth[id][7];
                menuListItem.id8 = cloth[id][8];
                menuListItem.itemName = cloth[id][9].toString();
            }
        }

        if (type == 5) {
            let menuItem = UIMenu.Menu.AddMenuItem("Бита", `Цена: ~g~$349.99`);
            menuItem.price = 349.99;
            menuItem.itemId = 55;
            menuItem.itemName = "Бита";
        }

        UIMenu.Menu.AddMenuItem("~r~Закрыть").doName = "closeButton";

        menu.MenuClose.on(() => {
            try {
                if (type == 11)
                    user.updateTattoo();
                user.updateCharacterCloth();
            } catch (e) {
                methods.debug('Exception: menuList.showShopClothMenu menu.MenuClose');
                methods.debug(e);
            }
        });

        let currentListChangeItem = null;
        let currentListChangeItemIndex = 0;

        menu.ListChange.on((item, index) => {
            currentListChangeItem = item;
            currentListChangeItemIndex = index;
            cloth.change(item.id1, item.id2, index, item.id4, item.id5, item.id6, item.id7);
        });

        menu.ItemSelect.on(async (item, index) => {
            try {
                if (item == currentListChangeItem) {
                    cloth.buy(item.id8, item.id1, item.id2, currentListChangeItemIndex, item.id4, item.id5, item.id6, item.id7, item.itemName, shopId);
                }
                if (item.doName == "grab") {
                    UIMenu.Menu.HideMenu();
                    //user.grab(shopId);
                }
                if (item.doName == "takeOff") {
                    UIMenu.Menu.HideMenu();
                    cloth.buy(10, menuType, 0, 0, -1, -1, -1, -1, "Операция", shopId, true);
                }
                if (item.doName == "closeButton") {
                    UIMenu.Menu.HideMenu();
                    user.updateCharacterCloth();
                }
                if (item.price > 0)
                    mp.events.callRemote('server:shop:buy', item.itemId, item.price, shopId);
                if (item.doName == "head") {
                    UIMenu.Menu.HideMenu();
                    menuList.showShopPropMenu(shopId, type, 0);
                }
                if (item.doName == "glasses") {
                    UIMenu.Menu.HideMenu();
                    menuList.showShopPropMenu(shopId, type, 1);
                }
                if (item.doName == "earring") {
                    UIMenu.Menu.HideMenu();
                    menuList.showShopPropMenu(shopId, type, 2);
                }
                if (item.doName == "leftHand") {
                    UIMenu.Menu.HideMenu();
                    menuList.showShopPropMenu(shopId, type, 6);
                }
                if (item.doName == "rightHand") {
                    UIMenu.Menu.HideMenu();
                    menuList.showShopPropMenu(shopId, type, 7);
                }
                if (item.doName == "head") {
                    UIMenu.Menu.HideMenu();
                    menuList.showShopPropMenu(shopId, type, 0);
                }
                if (item.doName == "glasses") {
                    UIMenu.Menu.HideMenu();
                    menuList.showShopPropMenu(shopId, type, 1);
                }
                if (item.doName == "body") {
                    UIMenu.Menu.HideMenu();
                    menuList.showShopClothMenu(shopId, 3, 11);
                }
                if (item.doName == "legs") {
                    UIMenu.Menu.HideMenu();
                    menuList.showShopClothMenu(shopId, 3, 4);
                }
                if (item.doName == "shoes") {
                    UIMenu.Menu.HideMenu();
                    menuList.showShopClothMenu(shopId, 3, 6);
                }
            } catch (e) {
                methods.debug('Exception: menuList.showShopClothMenu menu.ItemSelect');
                methods.debug(e);
            }
        });
    } catch (e) {
        methods.debug('Exception: menuList.showShopClothMenu');
        methods.debug(e);
    }
};

menuList.showShopPropMenu = function (shopId, type, menuType) {
    let title1 = "commonmenu";
    let title2 = "interaction_bgd";

    switch (type) {
        case 0:
            title1 = "shopui_title_lowendfashion";
            title2 = "shopui_title_lowendfashion";
            break;
        case 1:
            title1 = "shopui_title_midfashion";
            title2 = "shopui_title_midfashion";
            break;
        case 2:
            title1 = "shopui_title_highendfashion";
            title2 = "shopui_title_highendfashion";
            break;
        case 3:
            title1 = "shopui_title_gunclub";
            title2 = "shopui_title_gunclub";
            break;
        case 5:
            title1 = "shopui_title_lowendfashion2";
            title2 = "shopui_title_lowendfashion2";
            break;
    }

    let menu = UIMenu.Menu.Create(title1 != "commonmenu" ? " " : "Vangelico", "~b~Магазин", true, false, false, title1, title2);

    //UIMenu.Menu.AddMenuItem( "~y~Снять").doName = "takeOff";

    let skin = JSON.parse(user.getCache('skin'));
    let clothList = skin.SKIN_SEX == 1 ? JSON.parse(enums.get('propF')) : JSON.parse(enums.get('propM'));

    for (let i = 0; i < clothList.length; i++)
    {
        let id = i;

        if (clothList[id][1] != menuType) continue;
        if (clothList[id][0] != type) continue;

        let list = [];
        for (let j = 0; j <= clothList[i][3] + 1; j++) {
            list.push(j + '');
        }

        let menuListItem = UIMenu.Menu.AddMenuItemList(clothList[i][5].toString(), list, `Цена: ~g~${methods.moneyFormat(clothList[i][4])}`);

        menuListItem.id1 = clothList[id][1];
        menuListItem.id2 = clothList[id][2];
        menuListItem.id4 = clothList[id][4];
        menuListItem.itemName = clothList[id][5].toString();
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть").doName = "closeButton";

    menu.MenuClose.on((sender) =>
    {
        user.updateCharacterCloth();
    });

    let currentListChangeItem = null;
    let currentListChangeItemIndex = 0;

    menu.ListChange.on((item, index) => {
        currentListChangeItem = item;
        currentListChangeItemIndex = index;
        cloth.changeProp(item.id1, item.id2, index);
    });

    menu.ItemSelect.on((item, index) => {
        try {
            if (item == currentListChangeItem) {
                cloth.buyProp(item.id4, item.id1, item.id2, currentListChangeItemIndex, item.itemName, shopId);
            }
            if (item.doName == "closeButton") {
                UIMenu.Menu.HideMenu();
                user.updateCharacterCloth();
            }
            if (item.doName == "takeOff")
            {
                UIMenu.Menu.HideMenu();
                cloth.buyProp(0, menuType, -1, -1, "", shopId, true);
            }
        }
        catch (e) {

            methods.debug('Exception: menuList.showShopPropMenu menu.ItemSelect');
            methods.debug(e);
        }
    });
};

menuList.showShopMaskMenu = function (shopId) {
    try {
        methods.debug('Execute: menuList.showShopMaskMenu');

        let menu = UIMenu.Menu.Create("Маски", "~b~Магазин масок");

        let maskIdx = 1;
        for (let i = 1; i < 180; i++) {
            let id = i;

            let list = [];
            for (let j = 0; j <= 30; j++) {
                if (mp.players.local.isComponentVariationValid(1, id, j))
                    list.push(j + '');
            }

            UIMenu.Menu.AddMenuItemList("Маска #" + maskIdx, list, `Цена: ~g~$900`).maskId = id;
            maskIdx++;
        }

        UIMenu.Menu.AddMenuItem("~r~Закрыть").doName = "closeButton";

        menu.MenuClose.on(() => {
            try {
                user.updateCharacterCloth();
            } catch (e) {
                methods.debug('Exception: menuList.showShopClothMenu menu.MenuClose');
                methods.debug(e);
            }
        });

        let currentListChangeItem = null;
        let currentListChangeItemIndex = 0;

        menu.ListChange.on((item, index) => {
            currentListChangeItem = item;
            currentListChangeItemIndex = index;
            cloth.changeMask(item.maskId, index);
        });

        menu.ItemSelect.on(async (item, index) => {
            try {
                if (item == currentListChangeItem) {
                    cloth.buyMask(900, item.maskId, currentListChangeItemIndex, shopId);
                }
                if (item.doName == "closeButton") {
                    UIMenu.Menu.HideMenu();
                    user.updateCharacterCloth();
                }
            } catch (e) {
                methods.debug('Exception: menuList.showShopClothMenu menu.ItemSelect');
                methods.debug(e);
            }
        });
    } catch (e) {
        methods.debug('Exception: menuList.showShopMaskMenu');
        methods.debug(e);
    }
};

menuList.showPrintShopMenu = function()
{
    UIMenu.Menu.HideMenu();

    if (user.get('torso') == 15)
    {
        mp.game.ui.notifications.show("~r~Вам необходимо купить вверхнюю одежду в магазине одежды, прежде чем пользоваться услугой наклейки принта");
        return;
    }

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }
    let menu = UIMenu.Menu.Create("Магазин", "~b~Магазин принтов");

    let list = [];

    let printList = JSON.parse(enums.get('printList'));

    for (let i = 0; i < printList.length; i++) {

        let price = 1999.90;
        if (user.getSex() == 1 && printList[i][2] != "") {
            let menuListItem = UIMenu.Menu.AddMenuItem('Принт #' + i, `Цена: ~g~${methods.moneyFormat(price)}`);
            menuListItem.doName = 'show';
            menuListItem.price = price;
            menuListItem.tatto1 = printList[i][0];
            menuListItem.tatto2 = printList[i][2];

            list.push(menuListItem);
        }
        else if (user.getSex() == 0 && printList[i][1] != "") {
            let menuListItem = UIMenu.Menu.AddMenuItem('Принт #' + i, `Цена: ~g~${methods.moneyFormat(price)}`);
            menuListItem.doName = 'show';
            menuListItem.price = price;
            menuListItem.tatto1 = printList[i][0];
            menuListItem.tatto2 = printList[i][1];

            list.push(menuListItem);
        }
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть").doName = "closeButton";

    menu.IndexChange.on((index) => {
        if (index >= list.length)
            return;
        user.updateTattoo(true, true, false, true);
        user.setDecoration(list[index].tatto1, list[index].tatto2, true);
    });

    menu.MenuClose.on(() => {
        user.updateTattoo();
    });

    menu.ItemSelect.on((item, index) => {
        UIMenu.Menu.HideMenu();
        if(item.doName == 'show')
            mp.events.callRemote('server:print:buy', item.tatto1, item.tatto2, item.price);
    });
};

menuList.showTattooShopMenu = function(title1, title2, shopId)
{
    UIMenu.Menu.HideMenu();

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    let menu = UIMenu.Menu.Create(" ", "~b~Тату салон", false, false, false, title1, title2);

    UIMenu.Menu.AddMenuItem("Голова").zone = "ZONE_HEAD";
    UIMenu.Menu.AddMenuItem("Торс").zone = "ZONE_TORSO";
    UIMenu.Menu.AddMenuItem("Левая рука").zone = "ZONE_LEFT_ARM";
    UIMenu.Menu.AddMenuItem("Правая рука").zone = "ZONE_RIGHT_ARM";
    UIMenu.Menu.AddMenuItem("Левая нога").zone = "ZONE_LEFT_LEG";
    UIMenu.Menu.AddMenuItem("Правая нога").zone = "ZONE_RIGHT_LEG";

    UIMenu.Menu.AddMenuItem("~r~Закрыть").doName = "closeButton";
    menu.ItemSelect.on((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.zone)
            menuList.showTattooShopShortMenu(title1, title2, item.zone, shopId);
    });
};

menuList.showTattooShopShortMenu = function(title1, title2, zone, shopId)
{
    UIMenu.Menu.HideMenu();

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    let menu = UIMenu.Menu.Create(" ", "~b~Тату салон", false, false, false, title1, title2);

    let list = [];

    let tattooList = JSON.parse(enums.get('tattooList'));

    for (let i = 0; i < tattooList.length; i++) {

        if (tattooList[i][4] != zone)
            continue;

        if ((
            tattooList[i][1] == "mpbeach_overlays" ||
            tattooList[i][1] == "mpbiker_overlays" ||
            tattooList[i][1] == "mpchristmas2_overlays" ||
            tattooList[i][1] == "mpgunrunning_overlays" ||
            tattooList[i][1] == "mphipster_overlays" ||
            tattooList[i][1] == "mplowrider_overlays" ||
            tattooList[i][1] == "mplowrider2_overlays" ||
            tattooList[i][1] == "mpluxe_overlays" ||
            tattooList[i][1] == "mpluxe2_overlays" ||
            tattooList[i][1] == "mpsmuggler_overlays" ||
            tattooList[i][1] == "mpchristmas2017_overlays" ||
            tattooList[i][1] == "mpstunt_overlays"
        ) && title1 == "shopui_title_tattoos")
            continue;

        if ((
            tattooList[i][1] == "mpairraces_overlays" ||
            tattooList[i][1] == "mpbeach_overlays" ||
            tattooList[i][1] == "mpbusiness_overlays" ||
            tattooList[i][1] == "mpchristmas2_overlays" ||
            tattooList[i][1] == "mpgunrunning_overlays" ||
            tattooList[i][1] == "mphipster_overlays" ||
            tattooList[i][1] == "mpimportexport_overlays" ||
            tattooList[i][1] == "mpluxe_overlays" ||
            tattooList[i][1] == "mpluxe2_overlays" ||
            tattooList[i][1] == "mpsmuggler_overlays" ||
            tattooList[i][1] == "mpchristmas2017_overlays" ||
            tattooList[i][1] == "mpstunt_overlays" ||
            tattooList[i][1] == "multiplayer_overlays"
        ) && title1 == "shopui_title_tattoos2")
            continue;

        if ((
            tattooList[i][1] == "mpairraces_overlays" ||
            tattooList[i][1] == "mpbeach_overlays" ||
            tattooList[i][1] == "mpbiker_overlays" ||
            tattooList[i][1] == "mpbusiness_overlays" ||
            tattooList[i][1] == "mpchristmas2_overlays" ||
            tattooList[i][1] == "mpgunrunning_overlays" ||
            tattooList[i][1] == "mpimportexport_overlays" ||
            tattooList[i][1] == "mplowrider_overlays" ||
            tattooList[i][1] == "mplowrider2_overlays" ||
            tattooList[i][1] == "mpsmuggler_overlays" ||
            tattooList[i][1] == "mpchristmas2017_overlays" ||
            tattooList[i][1] == "mpstunt_overlays" ||
            tattooList[i][1] == "multiplayer_overlays"
        ) && title1 == "shopui_title_tattoos3")
            continue;

        if ((
            tattooList[i][1] == "mpairraces_overlays" ||
            tattooList[i][1] == "mpbeach_overlays" ||
            tattooList[i][1] == "mpbiker_overlays" ||
            tattooList[i][1] == "mpbusiness_overlays" ||
            tattooList[i][1] == "mpchristmas2_overlays" ||
            tattooList[i][1] == "mpgunrunning_overlays" ||
            tattooList[i][1] == "mphipster_overlays" ||
            tattooList[i][1] == "mpimportexport_overlays" ||
            tattooList[i][1] == "mplowrider_overlays" ||
            tattooList[i][1] == "mplowrider2_overlays" ||
            tattooList[i][1] == "mpluxe_overlays" ||
            tattooList[i][1] == "mpluxe2_overlays" ||
            tattooList[i][1] == "multiplayer_overlays"
        ) && title1 == "shopui_title_tattoos4")
            continue;

        if ((
            tattooList[i][1] == "mpairraces_overlays" ||
            tattooList[i][1] == "mpbiker_overlays" ||
            tattooList[i][1] == "mpbusiness_overlays" ||
            tattooList[i][1] == "mphipster_overlays" ||
            tattooList[i][1] == "mpimportexport_overlays" ||
            tattooList[i][1] == "mplowrider_overlays" ||
            tattooList[i][1] == "mplowrider2_overlays" ||
            tattooList[i][1] == "mpluxe_overlays" ||
            tattooList[i][1] == "mpluxe2_overlays" ||
            tattooList[i][1] == "mpsmuggler_overlays" ||
            tattooList[i][1] == "mpchristmas2017_overlays" ||
            tattooList[i][1] == "mpstunt_overlays" ||
            tattooList[i][1] == "multiplayer_overlays"
        ) && title1 == "shopui_title_tattoos5")
            continue;

        let price = methods.parseFloat(methods.parseFloat(tattooList[i][5]) / 8);
        if (user.getSex() == 1 && tattooList[i][3] != "") {

            let array = [tattooList[i][1], tattooList[i][3]];
            let prizes = [];

            try {
                prizes = JSON.parse(user.getCache('tattoo'))
            }
            catch (e) {
                methods.debug(e);
            }

            if (prizes.some(a => array.every((v, i) => v === a[i]))) {

                let menuListItem = UIMenu.Menu.AddMenuItem(tattooList[i][0], `Свести тату\nЦена: ~g~$${methods.moneyFormat(price / 2)}`);
                menuListItem.doName = 'destroy';
                menuListItem.price = price / 2;
                menuListItem.tatto0 = tattooList[i][0];
                menuListItem.tatto1 = tattooList[i][1];
                menuListItem.tatto2 = tattooList[i][3];
                menuListItem.tatto3 = tattooList[i][4];
                menuListItem.SetRightLabel('~g~Куплено');
                list.push(menuListItem);
            }
            else {
                let menuListItem = UIMenu.Menu.AddMenuItem(tattooList[i][0], `Цена: ~g~$${methods.moneyFormat(price)}`);
                menuListItem.doName = 'show';
                menuListItem.price = price;
                menuListItem.tatto0 = tattooList[i][0];
                menuListItem.tatto1 = tattooList[i][1];
                menuListItem.tatto2 = tattooList[i][3];
                menuListItem.tatto3 = tattooList[i][4];

                list.push(menuListItem);
            }
        }
        else if (user.getSex() == 0 && tattooList[i][2] != "") {

            let array = [tattooList[i][1], tattooList[i][2]];
            let prizes = [];

            try {
                prizes = JSON.parse(user.getCache('tattoo'))
            }
            catch (e) {
                methods.debug(e);
            }

            if (prizes.some(a => array.every((v, i) => v === a[i]))) {
                let menuListItem = UIMenu.Menu.AddMenuItem(tattooList[i][0], `Свести тату\nЦена: ~g~${methods.moneyFormat(price / 2)}`);
                menuListItem.doName = 'destroy';
                menuListItem.price = price / 2;
                menuListItem.tatto0 = tattooList[i][0];
                menuListItem.tatto1 = tattooList[i][1];
                menuListItem.tatto2 = tattooList[i][2];
                menuListItem.tatto3 = tattooList[i][4];
                menuListItem.SetRightLabel('~g~Куплено');
                list.push(menuListItem);
            }
            else {
                let menuListItem = UIMenu.Menu.AddMenuItem(tattooList[i][0], `Цена: ~g~${methods.moneyFormat(price)}`);
                menuListItem.doName = 'show';
                menuListItem.price = price;
                menuListItem.tatto0 = tattooList[i][0];
                menuListItem.tatto1 = tattooList[i][1];
                menuListItem.tatto2 = tattooList[i][2];
                menuListItem.tatto3 = tattooList[i][4];

                list.push(menuListItem);
            }
        }
    }

    //UIMenu.Menu.AddMenuItem("~y~Свести всё тату", "Цена: ~g~$1999.99").doName = "clearTattoo";
    UIMenu.Menu.AddMenuItem("~r~Закрыть").doName = "closeButton";

    menu.IndexChange.on((index) => {
        if (index >= list.length)
            return;
        user.clearDecorations();
        user.setDecoration(list[index].tatto1, list[index].tatto2);
    });

    menu.MenuClose.on(() => {
        user.updateTattoo();
    });

    menu.ItemSelect.on((item, index) => {
        UIMenu.Menu.HideMenu();
        if(item.doName == 'show')
            mp.events.callRemote('server:tattoo:buy', item.tatto1, item.tatto2, zone, item.price, item.tatto0, shopId);
        if(item.doName == 'destroy')
            mp.events.callRemote('server:tattoo:destroy', item.tatto1, item.tatto2, zone, item.price, 'Лазерная коррекция', shopId);
    });
};

menuList.showVehShopMenu = function(shopId, carPos, buyPos, carList)
{
    UIMenu.Menu.HideMenu();

    methods.getVehicleInfo(shopId);

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    let menu = UIMenu.Menu.Create("Автосалон", "~b~Посмотреть список транспорта");

    UIMenu.Menu.AddMenuItem("~g~Войти в автосалон").enter = true;
    UIMenu.Menu.AddMenuItem("~r~Закрыть").doName = "closeButton";

    menu.ItemSelect.on((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.enter)
        {
            vShop.goToInside(shopId, carPos[0], carPos[1], carPos[2], carPos[3], buyPos[0], buyPos[1], buyPos[2], carList);
            setTimeout(function () {
                menuList.showVehShopListMenu(shopId, carList);
            }, 2000);
        }
    });
};

menuList.showVehShopListMenu = function(shopId, carList)
{
    UIMenu.Menu.HideMenu();

    methods.getVehicleInfo(shopId);
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    let menu = UIMenu.Menu.Create("Автосалон", "~b~Список транспорта");

    let list = [];

    let vehicleInfo = enums.get('vehicleInfo');

    vehicleInfo.forEach(item => {
        if (shopId != item.type)
            return;

        let label = `~c~${item.display_name} (0 шт.)`;
        let subLabel = `\n~r~Доступно только для аренды`;

        if (carList.has(item.display_name)) {
            label = `${item.display_name} (${carList.get(item.display_name)} шт.)`;
            subLabel = ``;
        }

        let menuItem = UIMenu.Menu.AddMenuItem(label, `~b~Тип топлива: ~s~${vehicles.getFuelLabel(item.fuel_type)}${subLabel}`);
        menuItem.model = item.display_name;
        menuItem.SetRightLabel(`~g~${methods.moneyFormat(item.price, 1)} ~s~ >`);
        list.push(menuItem);
    });

    UIMenu.Menu.AddMenuItem("~y~Выйти из просмотра").exits = true;
    UIMenu.Menu.AddMenuItem("~r~Закрыть").doName = "closeButton";

    vShop.createVehicle(list[0].model);

    menu.IndexChange.on((index) => {
        if (index >= list.length)
            return;

        vShop.createVehicle(list[index].model);
        //menu.GoUp();
    });

    menu.ItemSelect.on((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.model)
            menuList.showVehShopModelInfoMenu(item.model);
        if (item.exits)
            vShop.exit();
    });
};

menuList.showVehShopModelInfoMenu = function(model)
{
    UIMenu.Menu.HideMenu();

    let vInfo = methods.getVehicleInfo(model);

    let menu = UIMenu.Menu.Create(`${vInfo.display_name}`, "~b~Информация о ТС");

    UIMenu.Menu.AddMenuItem("~b~Класс: ~s~").SetRightLabel(`${vInfo.class_name}`);
    UIMenu.Menu.AddMenuItem("~b~Модель: ~s~").SetRightLabel(`${vInfo.display_name}`);
    UIMenu.Menu.AddMenuItem("~b~Гос. стоимость: ~s~").SetRightLabel(`~g~${methods.moneyFormat(vInfo.price)}`);
    if (vInfo.fuel_type > 0) {
        UIMenu.Menu.AddMenuItem("~b~Тип топлива: ~s~").SetRightLabel(`${vehicles.getFuelLabel(vInfo.fuel_type)}`);
        UIMenu.Menu.AddMenuItem("~b~Вместимость бака: ~s~").SetRightLabel(`${vInfo.fuel_full}${vehicles.getFuelPostfix(vInfo.fuel_type)}`);
        UIMenu.Menu.AddMenuItem("~b~Расход топлива: ~s~").SetRightLabel(`${vInfo.fuel_min}${vehicles.getFuelPostfix(vInfo.fuel_type)}`);
    }
    else
        UIMenu.Menu.AddMenuItem("~b~Расход топлива: ~s~").SetRightLabel(`Электрокар`);

    if (vInfo.stock > 0) {
        UIMenu.Menu.AddMenuItem("~b~Объем багажника: ~s~").SetRightLabel(`${vInfo.stock}см³`);
        let stockFull = vInfo.stock_full;
        if (vInfo.stock_full > 0)
            stockFull = stockFull / 1000;
        UIMenu.Menu.AddMenuItem("~b~Допустимый вес: ~s~").SetRightLabel(`${stockFull}кг.`);
    }
    else {
        UIMenu.Menu.AddMenuItem("~b~Багажник: ~s~").SetRightLabel(`~r~Отсутствует`);
    }

    let listItem = UIMenu.Menu.AddMenuItemList(`~b~Цвет 1:`, enums.lscColors);
    listItem.color1 = true;
    listItem.Index = vShop.getColor1();

    listItem = UIMenu.Menu.AddMenuItemList(`~b~Цвет 2:`, enums.lscColors);
    listItem.color2 = true;
    listItem.Index = vShop.getColor2();

    if (vInfo.class_name != 'Cycles' && vInfo.class_name != 'Motocycles' && vInfo.class_name != 'Boats')
    {
        listItem = UIMenu.Menu.AddMenuItemList(`~b~Двери:`, ['~r~Закрыто', '~g~Открыто']);
        listItem.doorOpen = true;
        listItem.Index = vShop.isOpenAllDoor() ? 1 : 0;
    }

    let rentPrice = vInfo.price / 100 + 100.01;
    UIMenu.Menu.AddMenuItem(`~g~Купить за ${methods.moneyFormat(vInfo.price, 1)}`).isBuy = true;
    UIMenu.Menu.AddMenuItem(`~g~Аренда за ${methods.moneyFormat(rentPrice, 1)}`).isRent = true;

    if (user.isAdmin(5))
        UIMenu.Menu.AddMenuItem(`~b~Добавить на авторынок`).addAdmin = true;

    UIMenu.Menu.AddMenuItem("~y~Выйти из просмотра").exits = true;
    UIMenu.Menu.AddMenuItem("~y~Вернуться списку транспорта").toList = true;
    UIMenu.Menu.AddMenuItem("~r~Закрыть").doName = "closeButton";

    menu.ListChange.on((item, index) => {
        if (item.color1)
            vShop.setColor1(index);
        if (item.color2)
            vShop.setColor2(index);
        if (item.doorOpen) {
            if (vShop.isOpenAllDoor())
                vShop.closeAllDoor();
            else
                vShop.openAllDoor();
        }
    });

    menu.ItemSelect.on(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.toList)
            menuList.showVehShopListMenu(vShop.getShopId(), vShop.getCarList());
        if (item.addAdmin) {
            let count = methods.parseInt(await UIMenu.Menu.GetUserInput("Кол-во", "", 8));
            mp.events.callRemote('server:vehicles:addNew', vInfo.display_name, count);
        }
        if (item.isBuy) {

            let cl1 = vShop.getColor1();
            let cl2 = vShop.getColor2();
            let shopId = vShop.getShopId();

            vShop.exit();
            setTimeout(function () {
                mp.events.callRemote('server:vShop:buy', vInfo.display_name, cl1 , cl2, shopId);
            }, 1000);
        }
        if (item.isRent) {

            let cl1 = vShop.getColor1();
            let cl2 = vShop.getColor2();
            let shopId = vShop.getShopId();

            vShop.exit();
            setTimeout(function () {
                mp.events.callRemote('server:vShop:rent', vInfo.display_name, cl1 , cl2, shopId);
            }, 1000);
        }
        if (item.exits)
            vShop.exit();
    });
};

menuList.showLscMenu = function(shopId, price = 1)
{
    let veh = mp.players.local.vehicle;
    if (!veh) {
        mp.game.ui.notifications.show(`~r~Необходимо находиться в транспорте`);
        return;
    }

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    let lscBanner1 = 'shopui_title_ie_modgarage';
    let lscBanner2 = 'shopui_title_ie_modgarage';

    switch (shopId) {
        case 14:
        case 54:
        case 55:
        case 57:
            lscBanner1 = 'shopui_title_carmod';
            lscBanner2 = 'shopui_title_carmod';
            break;
        case 71:
            lscBanner1 = 'shopui_title_carmod2';
            lscBanner2 = 'shopui_title_carmod2';
            break;
        case 56:
            lscBanner1 = 'shopui_title_supermod';
            lscBanner2 = 'shopui_title_supermod';
            break;
    }

    let menu = UIMenu.Menu.Create(" ", "~b~Автомастерская", false, false, false, lscBanner1, lscBanner2);

    let itemPrice = 500 * price;
    let menuItem = UIMenu.Menu.AddMenuItem("Ремонт", `Цена: ~g~${methods.moneyFormat(itemPrice)}`);
    menuItem.price = itemPrice;
    menuItem.doName = 'repair';

    menuItem = UIMenu.Menu.AddMenuItem("Тюнинг");
    menuItem.doName = 'setTunning';

    menuItem = UIMenu.Menu.AddMenuItem("Установка модулей");
    menuItem.doName = 'setSTunning';

    itemPrice = 40000;
    menuItem = UIMenu.Menu.AddMenuItem("Сменить номер", `Цена: ~g~${methods.moneyFormat(itemPrice)}\n~s~Менее 4 символов от ~g~$100.000`);
    menuItem.price = itemPrice;
    menuItem.doName = 'setNumber';

    menuItem = UIMenu.Menu.AddMenuItem("Цвет");
    menuItem.doName = 'setColor';

    menuItem = UIMenu.Menu.AddMenuItem("~y~Сбыт угнанного ТС");
    menuItem.doName = 'sellCar';

    UIMenu.Menu.AddMenuItem("~r~Закрыть").doName = "closeButton";
    menu.ItemSelect.on(async (item, index) => {
        UIMenu.Menu.HideMenu();
        try {
            if (item.doName == 'closeButton')
                return;

            if (item.doName == 'repair')
                mp.events.callRemote('server:lsc:repair', shopId, item.price);
            if (item.doName == 'sellCar')
                mp.events.callRemote('server:lsc:sellCar');

            if (veh.getVariable('user_id') > 0) {
                if (item.doName == 'setTunning')
                    menuList.showLscTunningMenu(shopId, price, lscBanner1);
                if (item.doName == 'setSTunning')
                    menuList.showLscSTunningMenu(shopId, price, lscBanner1);
                if (item.doName == 'setColor')
                    menuList.showLscColorMenu(shopId, price, lscBanner1);
                if (item.doName == 'setNumber')
                {
                    let number = await UIMenu.Menu.GetUserInput("Номер", "", 8);
                    mp.events.callRemote('server:lsc:buyNumber', shopId, number.toUpperCase());
                }
            }
            else {
                mp.game.ui.notifications.show(`~r~Необходимо находиться в личном транспорте`);
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

menuList.showLscColorMenu = function(shopId, price, lscBanner1) {

    let veh = mp.players.local.vehicle;

    if (!veh) {
        mp.game.ui.notifications.show(`~r~Необходимо находиться в личном транспорте`);
        return;
    }

    let menu = UIMenu.Menu.Create(` `, `~b~Выбор цвета`, false, false, false, lscBanner1, lscBanner1);


    let color1Item = UIMenu.Menu.AddMenuItem("Основной цвет", 'Цена: ~g~$' + (5000));
    let color2Item = UIMenu.Menu.AddMenuItem("Дополнительный цвет", 'Цена: ~g~$' + (3000));
    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");

    menu.ItemSelect.on(item => {
        UIMenu.Menu.HideMenu();
        if (item == color1Item)
            menuList.showLscColor1Menu(shopId, price, lscBanner1);
        else if (item == color2Item)
            menuList.showLscColor2Menu(shopId, price, lscBanner1);
    });
};

menuList.showLscColor1Menu = async function(shopId, price, lscBanner1) {
    try {
        let veh = mp.players.local.vehicle;

        if (!veh) {
            mp.game.ui.notifications.show(`~r~Необходимо находиться в личном транспорте`);
            return;
        }

        let car = await vehicles.getData(veh.getVariable('container'));
        let list = [];

        let menu = UIMenu.Menu.Create(` `, `~b~Выбор основного цвета`, false, false, false, lscBanner1, lscBanner1);

        for (let i = 0; i < 156; i++) {
            try {
                let label = enums.lscColors[i];
                let listItem = UIMenu.Menu.AddMenuItem(`${label}`,`Цена: ~g~${methods.moneyFormat(5000)}`);

                try {
                    if (car.get('color1') == i)
                        listItem.SetRightBadge(12);
                }
                catch (e) {

                }

                listItem.modType = i;
                listItem.price = 5000.001;
                listItem.itemName = label;
                list.push(listItem);
            }
            catch (e) {
                methods.debug(e);
            }
        }

        let backItem = UIMenu.Menu.AddMenuItem("~g~Назад");
        let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");

        menu.IndexChange.on((index) => {
            if (index >= list.length)
                return;
            mp.events.callRemote('server:lsc:showColor1', index);
        });

        menu.ItemSelect.on(item => {
            UIMenu.Menu.HideMenu();
            if (backItem == item) {
                menuList.showLscColorMenu(shopId, price, lscBanner1);
                return;
            }
            if (closeItem == item) {
                return;
            }
            menuList.showLscMenu(shopId, price);
            mp.events.callRemote('server:lsc:buyColor1', item.modType, 5000.001, shopId, `Цвет: ${item.itemName}`);
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showLscColor2Menu = async function(shopId, price, lscBanner1) {

    let veh = mp.players.local.vehicle;

    if (!veh) {
        mp.game.ui.notifications.show(`~r~Необходимо находиться в личном транспорте`);
        return;
    }

    let car = await vehicles.getData(veh.getVariable('container'));
    let list = [];

    let menu = UIMenu.Menu.Create(` `, `~b~Выбор доп. цвета`, false, false, false, lscBanner1, lscBanner1);

    for (let i = 0; i < 156; i++) {
        try {
            let label = enums.lscColors[i];
            let listItem = UIMenu.Menu.AddMenuItem(`${label}`,`Цена: ~g~${methods.moneyFormat(3000)}`);

            try {
                if (car.get('color2') == i)
                    listItem.SetRightBadge(12);
            }
            catch (e) {

            }

            listItem.modType = i;
            listItem.price = 3000.001;
            listItem.itemName = label;
            list.push(listItem);
        }
        catch (e) {
            methods.debug(e);
        }
    }

    let backItem = UIMenu.Menu.AddMenuItem("~g~Назад");
    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");

    menu.IndexChange.on((index) => {
        if (index >= list.length)
            return;
        mp.events.callRemote('server:lsc:showColor2', index);
    });

    menu.ItemSelect.on(item => {
        UIMenu.Menu.HideMenu();
        if (backItem == item) {
            menuList.showLscColorMenu(shopId, price, lscBanner1);
            return;
        }
        if (closeItem == item) {
            return;
        }
        menuList.showLscMenu(shopId, price);
        mp.events.callRemote('server:lsc:buyColor2', item.modType, 3000.001, shopId, `Цвет: ${item.itemName}`);
    });
};

menuList.showLscSTunningMenu = function(shopId, price, lscBanner1) {

    let veh = mp.players.local.vehicle;

    if (!veh) {
        mp.game.ui.notifications.show(`~r~Необходимо находиться в личном транспорте`);
        return;
    }

    let vehInfo = methods.getVehicleInfo(veh.model);

    let menu = UIMenu.Menu.Create(` `, `~b~Установка модулей`, false, false, false, lscBanner1, lscBanner1);

    let itemPrice = 150000.01;
    let menuItem = UIMenu.Menu.AddMenuItem("Неоновая подсветка", `Цена: ~g~${methods.moneyFormat(methods.parseInt(itemPrice))}`);
    menuItem.price = itemPrice;
    menuItem.doName = 'setNeon';

    itemPrice = 10000.01;
    menuItem = UIMenu.Menu.AddMenuItem("Дистанционное управление", `Цена: ~g~${methods.moneyFormat(methods.parseInt(itemPrice))}`);
    menuItem.price = itemPrice;
    menuItem.doName = 'setSpecial';

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");
    menu.ItemSelect.on(item => {
        UIMenu.Menu.HideMenu();
        if (closeItem == item)
            return;
        if (item.doName == 'setNeon') {
            if (
                vehInfo.class_name == 'Helicopters' ||
                vehInfo.class_name == 'Planes' ||
                vehInfo.class_name == 'Cycles' ||
                vehInfo.class_name == 'Vans' ||
                vehInfo.class_name == 'Commercials' ||
                vehInfo.class_name == 'Industrial' ||
                vehInfo.class_name == 'Motorcycles' ||
                vehInfo.class_name == 'Utility' ||
                vehInfo.class_name == 'Boats'
            ) {
                mp.game.ui.notifications.show(`~r~Данный класс транспорта нельзя ставить неон`);
                return;
            }

            mp.events.callRemote('server:lsc:buyNeon', shopId, methods.parseInt(item.price));
        }
        if (item.doName == 'setSpecial') {
            if (vehInfo.class_name == 'Cycles') {
                mp.game.ui.notifications.show(`~r~Данный класс транспорта нельзя ставить модификацию`);
                return;
            }
            mp.events.callRemote('server:lsc:buySpecial', shopId, methods.parseInt(item.price));
        }
    });
};

menuList.showLscTunningMenu = function(shopId, price, lscBanner1) {

    let veh = mp.players.local.vehicle;

    if (!veh) {
        mp.game.ui.notifications.show(`~r~Необходимо находиться в личном транспорте`);
        return;
    }

    let vehInfo = methods.getVehicleInfo(veh.model);

    let menu = UIMenu.Menu.Create(` `, `~b~${vehInfo.display_name}`, false, false, false, lscBanner1, lscBanner1);

    for (let i = 0; i < 100; i++) {
        if (i == 69 || i == 76 || i == 78)
            continue;
        try {
            if (veh.getNumMods(i) == 0) continue;
            if (veh.getNumMods(i) > 0 && enums.lscNames[i][1] > 0) {
                let label = mp.game.ui.getLabelText(veh.getModSlotName(i));
                if (label == "NULL" || label == "")
                    label = `${enums.lscNames[i][0]}`;
                UIMenu.Menu.AddMenuItem(`${label}`,`Нажмите ~g~Enter~s~, чтобы посмотреть`).modType = i;
            }
        }
        catch (e) {
            methods.debug(e);
        }
    }


    UIMenu.Menu.AddMenuItem(`Тонировка`,`Нажмите ~g~Enter~s~, чтобы посмотреть`).modType = 69;
    if (veh.getLiveryCount() > 1)
        UIMenu.Menu.AddMenuItem(`Специальная окраска`,`Нажмите ~g~Enter~s~, чтобы посмотреть`).modType = 76;
    UIMenu.Menu.AddMenuItem(`Тип колёс`,`Нажмите ~g~Enter~s~, чтобы посмотреть`).modType = 78;

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");
    menu.ItemSelect.on(item => {
        UIMenu.Menu.HideMenu();
        if (closeItem == item)
            return
        menuList.showLscTunningListMenu(methods.parseInt(item.modType), shopId, price, lscBanner1);
    });
};

menuList.showLscTunningListMenu = async function(modType, shopId, price, lscBanner1) {

    modType = methods.parseInt(modType);

    try {

        let veh = mp.players.local.vehicle;

        if (!veh) {
            mp.game.ui.notifications.show(`~r~Необходимо находиться в личном транспорте`);
            return;
        }

        let car = await vehicles.getData(veh.getVariable('container'));
        let upgradeList = JSON.parse(car.get('upgrade'));

        price = 1.1;
        let list = [];
        let vehInfo = methods.getVehicleInfo(veh.model);

        if (
            vehInfo.class_name == 'Helicopters' ||
            vehInfo.class_name == 'Planes' ||
            vehInfo.class_name == 'Cycles' ||
            vehInfo.class_name == 'Vans' ||
            vehInfo.class_name == 'Commercials' ||
            vehInfo.class_name == 'Industrial' ||
            vehInfo.class_name == 'Utility' ||
            vehInfo.class_name == 'Boats'
        ) {
            mp.game.ui.notifications.show(`~r~Данный класс транспорта нельзя тюнинговать`);
            return;
        }

        if (veh.getVariable('price') >= 8000 && veh.getVariable('price') < 15000)
            price = 1.2;
        else if (veh.getVariable('price') >= 15000 && veh.getVariable('price') < 30000)
            price = 1.4;
        else if (veh.getVariable('price') >= 30000 && veh.getVariable('price') < 45000)
            price = 1.6;
        else if (veh.getVariable('price') >= 45000 && veh.getVariable('price') < 60000)
            price = 1.8;
        else if (veh.getVariable('price') >= 60000 && veh.getVariable('price') < 75000)
            price = 2;
        else if (veh.getVariable('price') >= 90000 && veh.getVariable('price') < 105000)
            price = 2.2;
        else if (veh.getVariable('price') >= 105000 && veh.getVariable('price') < 120000)
            price = 2.4;
        else if (veh.getVariable('price') >= 120000 && veh.getVariable('price') < 135000)
            price = 2.6;
        else if (veh.getVariable('price') >= 135000 && veh.getVariable('price') < 150000)
            price = 2.8;
        else if (veh.getVariable('price') >= 150000 && veh.getVariable('price') < 200000)
            price = 3;
        else if (veh.getVariable('price') >= 200000 && veh.getVariable('price') < 240000)
            price = 3.3;
        else if (veh.getVariable('price') >= 240000 && veh.getVariable('price') < 280000)
            price = 3.6;
        else if (veh.getVariable('price') >= 280000 && veh.getVariable('price') < 320000)
            price = 4;
        else if (veh.getVariable('price') >= 320000 && veh.getVariable('price') < 380000)
            price = 4.4;
        else if (veh.getVariable('price') >= 380000 && veh.getVariable('price') < 500000)
            price = 5;
        else if (veh.getVariable('price') >= 500000 && veh.getVariable('price') < 600000)
            price = 5.5;
        else if (veh.getVariable('price') >= 600000 && veh.getVariable('price') < 700000)
            price = 6;
        else if (veh.getVariable('price') >= 700000 && veh.getVariable('price') < 800000)
            price = 6.5;
        else if (veh.getVariable('price') >= 800000)
            price = 7;

        let menu = UIMenu.Menu.Create(` `, `~b~${enums.lscNames[modType][0]}`, false, false, false, lscBanner1, lscBanner1);

        let removePrice = (enums.lscNames[modType][1] * price) / 2;
        let removeItem = UIMenu.Menu.AddMenuItem("Стандартная деталь", `Цена: ~g~${methods.moneyFormat(removePrice)}`);
        list.push(removeItem);

        if (modType == 69) {
            for (let i = 0; i < 7; i++) {
                try {
                    let itemPrice = enums.lscNames[modType][1] * (i / 20 + price);
                    let label = `${enums.lscNames[modType][0]} #${(i + 1)}`;
                    let listItem = UIMenu.Menu.AddMenuItem(`${label}`,`Цена: ~g~${methods.moneyFormat(itemPrice)}`);

                    try {
                        if (upgradeList[modType.toString()] == i)
                            listItem.SetRightBadge(12);
                    }
                    catch (e) {

                    }

                    listItem.modType = i;
                    listItem.price = itemPrice + 0.001;
                    listItem.itemName = label;
                    list.push(listItem);
                }
                catch (e) {
                    methods.debug(e);
                }
            }
        }
        else if (modType == 76) {
            for (let i = 0; i < veh.getLiveryCount(); i++) {
                try {
                    let itemPrice = enums.lscNames[modType][1] * (i / 20 + price);
                    let label = `${enums.lscNames[modType][0]} #${(i + 1)}`;
                    let listItem = UIMenu.Menu.AddMenuItem(`${label}`,`Цена: ~g~${methods.moneyFormat(itemPrice)}`);

                    try {
                        if (car.get('livery') == i)
                            listItem.SetRightBadge(12);
                    }
                    catch (e) {

                    }

                    listItem.modType = i;
                    listItem.price = itemPrice + 0.001;
                    listItem.itemName = label;
                    list.push(listItem);
                }
                catch (e) {
                    methods.debug(e);
                }
            }
        }
        else if (modType == 78) {
            let wheelList = ['Спорт', 'Массл', 'Лоурайдер', 'Кроссовер', 'Внедорожник', 'Специальные', 'Мото', 'Уникальные', 'Benny\'s Original', 'Benny\'s Bespoke'];
            for (let i = 0; i < wheelList.length; i++) {
                try {
                    let itemPrice = enums.lscNames[modType][1] * (i / 20 + price);
                    let label = `${wheelList[i]}`;
                    let listItem = UIMenu.Menu.AddMenuItem(`${label}`,`Цена: ~g~${methods.moneyFormat(itemPrice)}`);

                    try {
                        if (upgradeList[modType.toString()] == i)
                            listItem.SetRightBadge(12);
                    }
                    catch (e) {

                    }

                    listItem.modType = i;
                    listItem.price = itemPrice + 0.001;
                    listItem.itemName = label;
                    list.push(listItem);
                }
                catch (e) {
                    methods.debug(e);
                }
            }
        }
        else {
            for (let i = 0; i < veh.getNumMods(modType); i++) {
                try {

                    if (i == 1 || i == 10) {
                        if (vehInfo.display_name == 'Havok' ||
                            vehInfo.display_name == 'Microlight' ||
                            vehInfo.display_name == 'Seasparrow' ||
                            vehInfo.display_name == 'Revolter' ||
                            vehInfo.display_name == 'Viseris' ||
                            vehInfo.display_name == 'Savestra' ||
                            vehInfo.display_name == 'Deluxo' ||
                            vehInfo.display_name == 'Comet4')
                            continue;
                    }

                    let itemPrice = enums.lscNames[modType][1] * (i / 20 + price);
                    let label = mp.game.ui.getLabelText(veh.getModTextLabel(modType, i));
                    if (label == "NULL")
                        label = `${enums.lscNames[modType][0]} #${(i + 1)}`;
                    let listItem = UIMenu.Menu.AddMenuItem(`${label}`,`Цена: ~g~${methods.moneyFormat(itemPrice)}`);

                    try {
                        if (upgradeList[modType.toString()] == i)
                            listItem.SetRightBadge(12);
                    }
                    catch (e) {

                    }

                    listItem.modType = i;
                    listItem.price = itemPrice + 0.001;
                    listItem.itemName = label;
                    list.push(listItem);
                }
                catch (e) {
                    methods.debug(e);
                }
            }
        }

        let backItem = UIMenu.Menu.AddMenuItem("~g~Назад");
        let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");

        let modIndex = -1;
        menu.IndexChange.on((index) => {
            if (index == 0) {
                mp.events.callRemote('server:lsc:showTun', modType, -1);
                modIndex = -1;
                return;
            }
            if (index >= list.length)
                return;
            mp.events.callRemote('server:lsc:showTun', modType, list[index].modType);
        });

        menu.ItemSelect.on(item => {
            UIMenu.Menu.HideMenu();
            if (item == backItem)
                menuList.showLscTunningMenu(shopId, price, lscBanner1);

            if (item == removeItem) {
                mp.events.callRemote('server:lsc:buyTun', modType, -1, removePrice, shopId, 'Стандартная деталь');
                menuList.showLscTunningMenu(shopId, price, lscBanner1);
            }

            if (item.modType) {
                mp.events.callRemote('server:lsc:buyTun', modType, item.modType, methods.parseInt(item.price), shopId, item.itemName);
                if (modType == 78)
                    mp.events.callRemote('server:lsc:buyTun', 23, -1, 1, shopId, item.itemName);
                menuList.showLscTunningMenu(shopId, price, lscBanner1);
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
};


menuList.showGunShopMenu = function(shopId, price = 1)
{
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    let menu = UIMenu.Menu.Create(" ", "~b~Магазин оружия", false, false, false, "shopui_title_gunclub", "shopui_title_gunclub");

    enums.gunShopItems.forEach(itemId => {
        if (items.isWeapon(itemId)) {
            let itemPrice = items.getItemPrice(itemId) * price;
            let menuItem = UIMenu.Menu.AddMenuItem(items.getItemNameById(itemId), `Цена: ~g~${methods.moneyFormat(itemPrice)}`);
            menuItem.SetRightLabel('>');
            menuItem.SetLeftBadge(13);
            menuItem.isWeapon = true;
            menuItem.itemId = itemId;
        }
        else if(items.isAmmo(itemId)) {
            let itemPrice = items.getItemPrice(itemId) * price;
            let menuItem = UIMenu.Menu.AddMenuItem(items.getItemNameById(itemId), `Цена: ~g~${methods.moneyFormat(itemPrice)}`);
            menuItem.SetLeftBadge(6);
            menuItem.price = itemPrice;
            menuItem.itemId = itemId;
        }
        else {
            let itemPrice = items.getItemPrice(itemId) * price;
            let menuItem = UIMenu.Menu.AddMenuItem(items.getItemNameById(itemId), `Цена: ~g~${methods.moneyFormat(itemPrice)}`);
            menuItem.price = itemPrice;
            menuItem.itemId = itemId;
        }
    });

    let itemPrice = 200 * price;
    let menuItem = UIMenu.Menu.AddMenuItem("Лёгкий бронежилет", `Цена: ~g~${methods.moneyFormat(itemPrice)}`);
    menuItem.SetLeftBadge(7);
    menuItem.price = itemPrice;
    menuItem.armor = 25;

    itemPrice = 500 * price;
    menuItem = UIMenu.Menu.AddMenuItem("Средний бронежилет", `Цена: ~g~${methods.moneyFormat(itemPrice)}`);
    menuItem.SetLeftBadge(7);
    menuItem.price = itemPrice;
    menuItem.armor = 65;

    /*itemPrice = 320 * price;
    menuItem = UIMenu.Menu.AddMenuItem("Тяжелый бронежилет", `Цена: ~g~${methods.moneyFormat(itemPrice)}`);
    menuItem.price = itemPrice;
    menuItem.armor = 100;*/

    UIMenu.Menu.AddMenuItem("~y~Ограбить").doName = "grab";

    UIMenu.Menu.AddMenuItem("~r~Закрыть").doName = "closeButton";
    menu.ItemSelect.on((item, index) => {
        UIMenu.Menu.HideMenu();
        try {

            if (item.armor) {
                if (item.price > user.getCashMoney()) {
                    mp.game.ui.notifications.show("~r~У вас недостаточно средств");
                    return;
                }
                mp.players.local.setArmour(item.armor);
                mp.game.ui.notifications.show("~b~Вы купили бронежилет");
                user.removeCashMoney(item.price, 'Покупка бронежилета');
                business.addMoney(shopId, item.price, 'Бронежилет');
            }
            else if (item.price > 0) {
                if (!user.getCache('gun_lic')) {
                    mp.game.ui.notifications.show("~r~У Вас нет лицензии на оружие");
                    return;
                }
                mp.events.callRemote('server:gun:buy', item.itemId, item.price, 1, 0, 0, shopId);
            }
            else if (item.isWeapon) {
                menuList.showGunShopWeaponMenu(shopId, item.itemId, price);
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

menuList.showGunShopWeaponMenu = function(shopId, itemId, price = 1)
{
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }
    let wpName = items.getItemNameHashById(itemId);

    let componentList = weapons.getWeaponComponentList(wpName);
    let countColorsComponent = 0;

    componentList.forEach(item => {
        if (item[3] == 0)
            countColorsComponent++;
    });

    let tintList = ['Black', 'Green', 'Orange'];
    let tintListId = [0, 1, 6];
    if (wpName.indexOf('_mk2') >= 0) {
        tintList = ['Black', 'Gray', 'Two-Tone', 'White', 'Earth', 'Brown & Black', 'Red', 'Blue', 'Orange'];
        tintListId = [0, 1, 2, 3, 7, 8, 9, 10, 12];
    }

    let menu = UIMenu.Menu.Create(" ", "~b~Магазин оружия", false, false, false, "shopui_title_gunclub", "shopui_title_gunclub");

    let isLic = weapons.getGunSlotIdByItem(itemId) != 5;

    if (isLic)
        UIMenu.Menu.AddMenuItem('~r~Требуется лицензия на оружие');

    let itemPrice = items.getItemPrice(itemId) * price;
    let menuItem = UIMenu.Menu.AddMenuItemList(items.getItemNameById(itemId), tintList, `Цена: ~g~${methods.moneyFormat(itemPrice)}`);
    menuItem.price = itemPrice;
    menuItem.itemId = itemId;
    menuItem.superTint = 0;

    componentList.forEach(item => {
        if (item[3] == 0) {
            let itemPrice = items.getItemPrice(itemId) * price;
            let menuItem = UIMenu.Menu.AddMenuItemList(`${items.getItemNameById(itemId)} ${item[1]}`, tintList, `Цена: ~g~${methods.moneyFormat(itemPrice)}`);
            menuItem.price = itemPrice;
            menuItem.itemId = itemId;
            menuItem.superTint = item[2].toString();
        }
    });

    let ammoId = weapons.getGunAmmoNameByItemId(itemId);
    if (ammoId > 0) {
        let itemPrice = items.getItemPrice(ammoId) * price;
        let menuItem = UIMenu.Menu.AddMenuItem(items.getItemNameById(ammoId), `Цена: ~g~${methods.moneyFormat(itemPrice)}`);
        menuItem.price = itemPrice;
        menuItem.itemId = ammoId;

        let isFind = false;
        componentList.forEach(item => {
            if (item[3] == 0) return;
            if (item[3] == 4) return;
            if (item[0] == wpName) {

                if (!isFind)
                    UIMenu.Menu.AddMenuItem('~b~Модификации к оружию:');

                isFind = true;

                let wpcId = items.getWeaponComponentIdByHash(item[2], wpName);
                itemPrice = items.getItemPrice(wpcId) * price;
                let itemName = items.getItemNameById(wpcId);
                if (itemName == 'UNKNOWN') return;
                menuItem = UIMenu.Menu.AddMenuItem(items.getItemNameById(wpcId), `Цена: ~g~${methods.moneyFormat(itemPrice)}`);
                menuItem.price = itemPrice;
                menuItem.itemId = wpcId;
            }
        });
    }

    UIMenu.Menu.AddMenuItem("~g~Назад").doName = "backButton";
    UIMenu.Menu.AddMenuItem("~r~Закрыть").doName = "closeButton";

    let listIndex = 0;
    menu.ListChange.on((item, index) => {
        listIndex = index;
    });

    menu.ItemSelect.on((item, index) => {
        try {

            if (item.armor) {
                if (item.price > user.getCashMoney()) {
                    mp.game.ui.notifications.show("~r~У вас недостаточно средств");
                    return;
                }
                mp.players.local.setArmour(item.armor);
                mp.game.ui.notifications.show("~b~Вы купили бронежилет");
                user.removeCashMoney(item.price, 'Покупка бронежилета');
                business.addMoney(shopId, item.price, 'Бронежилет');
            }
            else if (item.price > 0) {
                if (isLic && !user.getCache('gun_lic')) {
                    mp.game.ui.notifications.show("~r~У Вас нет лицензии на оружие");
                    return;
                }
                mp.events.callRemote('server:gun:buy', item.itemId, item.price, 1, item.superTint, tintListId[listIndex], shopId);
            }
            else if (item.doName == 'backButton') {
                UIMenu.Menu.HideMenu();
                menuList.showGunShopMenu(shopId, price);
            }
            else if (item.doName == 'closeButton') {
                UIMenu.Menu.HideMenu();
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

menuList.showAnimationTypeListMenu = function() {

    let menu = UIMenu.Menu.Create(`Анимации`, `~b~Меню анимаций`);

    let animActionItem = UIMenu.Menu.AddMenuItem("Анимации действий");
    let animPoseItem = UIMenu.Menu.AddMenuItem("Позирующие анимации");
    let animPositiveItem = UIMenu.Menu.AddMenuItem("Положительные эмоции");
    let animNegativeItem = UIMenu.Menu.AddMenuItem("Негативные эмоции");
    let animDanceItem = UIMenu.Menu.AddMenuItem("Танцы");
    let animOtherItem = UIMenu.Menu.AddMenuItem("Остальные анимации");
    let animSyncItem = UIMenu.Menu.AddMenuItem("Взаимодействие");
    let animStopItem = UIMenu.Menu.AddMenuItem("~y~Остановить анимацию");

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");
    menu.ItemSelect.on((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item == closeItem)
            return;
        else if (item == animStopItem)
            user.stopAllAnimation();
        else if (item == animOtherItem)
            menuList.showAnimationOtherListMenu();
        else if (item == animSyncItem)
            menuList.showAnimationSyncListMenu();
        else if (item == animActionItem)
            menuList.showAnimationListMenu('Анимации действий', enums.animActions);
        else if (item == animDanceItem)
            menuList.showAnimationListMenu('Танцы', enums.animDance);
        else if (item == animNegativeItem)
            menuList.showAnimationListMenu('Негативные эмоции', enums.animNegative);
        else if (item == animPositiveItem)
            menuList.showAnimationListMenu('Положительные эмоции', enums.animPositive);
        else if (item == animPoseItem)
            menuList.showAnimationListMenu('Позирующие анимации', enums.animPose);

    });
};

menuList.showAnimationListMenu = function(subtitle, array) {

    let menu = UIMenu.Menu.Create(`Анимации`, `~b~${subtitle}`);

    array.forEach(function (item, i, arr) {
        let menuItem = UIMenu.Menu.AddMenuItem(`${item[0]}`);
        menuItem.anim1 = item[1];
        menuItem.anim2 = item[2];
        menuItem.animFlag = item[3];
    });

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");
    menu.ItemSelect.on((item, index) => {
        if (item == closeItem) {
            UIMenu.Menu.HideMenu();
            return;
        }

        /*
        .addMenuItem("Сидеть-1", "", false, true, "callServerTrigger", "anim_user", "amb@prop_human_seat_chair@male@generic@base", "base", true)
        .addMenuItem("Сидеть-2", "", false, true, "callServerTrigger", "anim_user", "amb@prop_human_seat_chair@male@elbows_on_knees@base", "base", true)
        .addMenuItem("Сидеть-3", "", false, true, "callServerTrigger", "anim_user", "amb@prop_human_seat_chair@male@left_elbow_on_knee@base", "base", true)
        .addMenuItem("Сидеть-4", "", false, true, "callServerTrigger", "anim_user", "amb@prop_human_seat_chair@male@right_foot_out@base", "base", true)
        * */

        let plPos = mp.players.local.position;

        if (item.anim1 == 'amb@prop_human_seat_chair@male@generic@base' || item.anim1 == 'amb@prop_human_seat_chair@male@right_foot_out@base' || item.anim1 == 'amb@prop_human_seat_chair@male@left_elbow_on_knee@base' || item.anim1 == 'amb@prop_human_seat_chair@male@elbows_on_knees@base') {
            mp.players.local.freezePosition(true);
            mp.players.local.setCollision(false, false);
            if (!Container.Data.HasLocally(0, 'hasSeat'))
                mp.players.local.position = new mp.Vector3(plPos.x, plPos.y, plPos.z - 0.95);
            Container.Data.SetLocally(0, 'hasSeat', true);
        }
        else if (Container.Data.HasLocally(0, 'hasSeat')) {
            mp.players.local.freezePosition(false);
            mp.players.local.setCollision(true, true);
            mp.players.local.position = new mp.Vector3(plPos.x, plPos.y, plPos.z + 0.95);
            Container.Data.ResetLocally(0, 'hasSeat');
        }

        mp.game.ui.notifications.show("~b~Нажмите ~s~F10~b~ чтобы отменить анимацию");
        user.playAnimation(item.anim1, item.anim2, item.animFlag);
    });
};

menuList.showAnimationOtherListMenu = function() {

    let menu = UIMenu.Menu.Create(`Анимации`, `~b~Остальные анимации`);

    /*enums.scenarios.forEach(function (item, i, arr) {
        let menuItem = UIMenu.Menu.AddMenuItem(`${item[0]}`);
        menuItem.scenario = item[1];
    });*/

    enums.animRemain.forEach(function (item, i, arr) {
        let menuItem = UIMenu.Menu.AddMenuItem(`${item[0]}`);
        menuItem.anim1 = item[1];
        menuItem.anim2 = item[2];
        menuItem.animFlag = item[3];
    });

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");
    menu.ItemSelect.on((item, index) => {
        if (item == closeItem) {
            UIMenu.Menu.HideMenu();
            return;
        }
        mp.game.ui.notifications.show("~b~Нажмите ~s~F10~b~ чтобы отменить анимацию");
        if (item.scenario != undefined)
            user.playScenario(item.scenario);
        else
            user.playAnimation(item.anim1, item.anim2, item.animFlag);
    });
};

menuList.showAnimationSyncListMenu = function() {

    let menu = UIMenu.Menu.Create(`Анимации`, `~b~Взаимодействие`);

    UIMenu.Menu.AddMenuItem(`Подзороваться 1`).animId = 0;
    UIMenu.Menu.AddMenuItem(`Поздороваться 2`).animId = 2;
    UIMenu.Menu.AddMenuItem(`Дать пять`).animId = 1;
    UIMenu.Menu.AddMenuItem(`Поцелуй`).animId = 3;
    //UIMenu.Menu.AddMenuItem(`Минет`).animId = 4;
    //UIMenu.Menu.AddMenuItem(`Секс`).animId = 5;

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");
    menu.ItemSelect.on(async (item, index) => {
        if (item == closeItem) {
            UIMenu.Menu.HideMenu();
            return;
        }

        let playerId = methods.parseInt(await UIMenu.Menu.GetUserInput("ID Игрока", "", 9));
        if (playerId < 0) {
            mp.game.ui.notifications.show("~r~ID Игркоа не может быть меньше нуля");
            return;
        }
        user.playAnimationWithUser(playerId, item.animId);
    });
};

menuList.showGovGarderobMenu = function() {
    let menu = UIMenu.Menu.Create(`Гардероб`, `~b~Гардероб`);

    UIMenu.Menu.AddMenuItem("Сухпаёк").itemId = 32;

    if (user.getCache('rank_type') == 5) {
        UIMenu.Menu.AddMenuItem("Наручники").itemId = 40;
        UIMenu.Menu.AddMenuItem("Фонарик").itemId = 59;
        UIMenu.Menu.AddMenuItem("Полицейская дубинка").itemId = 66;
        UIMenu.Menu.AddMenuItem("Электрошокер").itemId = 82;
        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Beretta 90Two").itemId = 78;
        UIMenu.Menu.AddMenuItem("Фонарик Beretta 90Two").itemId = 311;
        UIMenu.Menu.AddMenuItem("Оптический прицел Beretta 90Two").itemId = 312;
        UIMenu.Menu.AddMenuItem("Глушитель Beretta 90Two").itemId = 313;
        UIMenu.Menu.AddMenuItem("Компенсатор Beretta 90Two").itemId = 314;
        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("SIG MPX-SD").itemId = 97;
        UIMenu.Menu.AddMenuItem("Фонарик SIG MPX-SD").itemId = 338;
        UIMenu.Menu.AddMenuItem("Рукоятка SIG MPX-SD").itemId = 339;
        UIMenu.Menu.AddMenuItem("Прицел SIG MPX-SD").itemId = 340;
        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm").itemId = 280;
    }

    UIMenu.Menu.AddMenuItem("Бронежилет").armor = 100;

    let list = ["Default", "Type #1", "Type #2"];
    let listItem = UIMenu.Menu.AddMenuItemList("Галстук", list);

    menu.ListChange.on((item, index) => {
        if (index == 0) {
            user.updateCharacterCloth();
        }
        else if (index == 1) {
            if (user.getSex() == 1)
                user.setComponentVariation(7, 86, 1);
            else
                user.setComponentVariation(7, 115, 1);
        }
        else if (index == 2) {
            if (user.getSex() == 1)
                user.setComponentVariation(7, 86, 0);
            else
                user.setComponentVariation(7, 115, 0);
        }
    });

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");

    menu.ItemSelect.on(async item => {
        UIMenu.Menu.HideMenu();
        if (item.armor) {
            mp.players.local.setArmour(100);
            mp.game.ui.notifications.show("~b~Вы взяли броню");
        }
        if (item.itemId) {
            let moneyFraction = await coffer.getMoney(coffer.getIdByFraction(user.getCache('fraction_id')));
            let itemPrice = items.getItemPrice(item.itemId);

            if (moneyFraction < itemPrice) {
                mp.game.ui.notifications.show(`~r~В бюджете организации не достаточно средств`);
                return;
            }

            inventory.takeNewItem(item.itemId, `{"owner": "Правительство", "userName": "${user.getCache('name')}"}`).then();
            methods.saveFractionLog(
                user.getCache('name'),
                `Взял ${items.getItemNameById(item.itemId)}`,
                `Потрачено из бюджета: ${methods.moneyFormat(itemPrice)}`,
                user.getCache('fraction_id')
            );
        }
    });
};

menuList.showEmsGarderobMenu = function() {

    let menu = UIMenu.Menu.Create(`Гардероб`, `~b~Гардероб EMS`);

    let listGarderob = ["Повседневная одежда", "Форма парамедика #1", "Форма парамедика #2", "Зимняя форма парамедика #1", "Зимняя форма парамедика #2", "Форма врача"];

    for (let i = 0; i < listGarderob.length; i++) {
        try {
            UIMenu.Menu.AddMenuItem(`${listGarderob[i]}`);
        }
        catch (e) {
            methods.debug(e);
        }
    }

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");

    menu.IndexChange.on((index) => {
        if (index >= listGarderob.length)
            return;
        mp.events.callRemote('server:uniform:ems', index);
    });
    menu.ItemSelect.on(item => {
        UIMenu.Menu.HideMenu();
    });
};

menuList.showSheriffGarderobMenu = function() {

    let menu = UIMenu.Menu.Create(`Гардероб`, `~b~Гардероб SHERIFF`);

    let listGarderob = ["Повседневная одежда", "Кадетская форма", "Офицерская форма", "Форма HighWay патрулей", "Air Support Division", "Tactical Division", "Представительская форма"];

    for (let i = 0; i < listGarderob.length; i++) {
        try {
            UIMenu.Menu.AddMenuItem(`${listGarderob[i]}`);
        }
        catch (e) {
            methods.debug(e);
        }
    }

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");

    menu.IndexChange.on((index) => {
        if (index >= listGarderob.length)
            return;
        mp.events.callRemote('server:uniform:sheriff', index);
    });
    menu.ItemSelect.on(item => {
        UIMenu.Menu.HideMenu();
    });
};

menuList.showSheriffArsenalMenu = function() {
    let menu = UIMenu.Menu.Create(`Арсенал`, `~b~Арсенал`);

    UIMenu.Menu.AddMenuItem("Сухпаёк").itemId = 32;
    UIMenu.Menu.AddMenuItem("Спец. Аптечка").itemId = 278;
    UIMenu.Menu.AddMenuItem("Полицейское огорождение").itemId = 199;
    UIMenu.Menu.AddMenuItem("Полосатый конус").itemId = 201;
    UIMenu.Menu.AddMenuItem("Красный конус").itemId = 202;

    UIMenu.Menu.AddMenuItem("~b~Оружие").showGun = true;
    UIMenu.Menu.AddMenuItem("~b~Модули на оружие").showGunMod = true;

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");

    menu.ItemSelect.on(async item => {
        UIMenu.Menu.HideMenu();

        if (item.showGun) {
            menuList.showSheriffArsenalGunMenu();
        }
        if (item.showGunMod) {
            menuList.showSheriffArsenalGunModMenu();
        }
        if (item.itemId) {
            let moneyFraction = await coffer.getMoney(coffer.getIdByFraction(user.getCache('fraction_id')));
            let itemPrice = items.getItemPrice(item.itemId);

            if (moneyFraction < itemPrice) {
                mp.game.ui.notifications.show(`~r~В бюджете организации не достаточно средств`);
                return;
            }

            inventory.takeNewItem(item.itemId, `{"owner": "BCSD", "userName": "${user.getCache('name')}", "tint": 4}`).then();
            methods.saveFractionLog(
                user.getCache('name'),
                `Взял ${items.getItemNameById(item.itemId)}`,
                `Потрачено из бюджета: ${methods.moneyFormat(itemPrice)}`,
                user.getCache('fraction_id')
            );
        }
    });
};

menuList.showSheriffArsenalGunMenu = function() {
    let menu = UIMenu.Menu.Create(`Арсенал`, `~b~Оружие`);

    UIMenu.Menu.AddMenuItem("Наручники").itemId = 40;
    UIMenu.Menu.AddMenuItem("Фонарик").itemId = 59;
    UIMenu.Menu.AddMenuItem("Полицейская дубинка").itemId = 66;
    UIMenu.Menu.AddMenuItem("Электрошокер").itemId = 82;

    if (user.getCache('rank_type') == 1 || user.getCache('rank_type') == 2 || user.getCache('rank_type') == 3) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two").itemId = 78;
        UIMenu.Menu.AddMenuItem("Benelli M3").itemId = 90;
        UIMenu.Menu.AddMenuItem("Benelli M4").itemId = 91;
        UIMenu.Menu.AddMenuItem("HK-416").itemId = 110;

        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm").itemId = 280;
        UIMenu.Menu.AddMenuItem("Коробка патронов 12 калибра").itemId = 281;
        UIMenu.Menu.AddMenuItem("Коробка патронов 5.56mm").itemId = 284;
    }
    if (user.getCache('rank_type') == 4) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two").itemId = 78;
        UIMenu.Menu.AddMenuItem("MP5A3").itemId = 103;

        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm").itemId = 280;
    }
    if (user.getCache('rank_type') == 5) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two").itemId = 78;
        UIMenu.Menu.AddMenuItem("Benelli M3").itemId = 90;
        UIMenu.Menu.AddMenuItem("Benelli M4").itemId = 91;
        UIMenu.Menu.AddMenuItem("HK-416").itemId = 110;
        UIMenu.Menu.AddMenuItem("HK-416A5").itemId = 111;

        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm").itemId = 280;
        UIMenu.Menu.AddMenuItem("Коробка патронов 12 калибра").itemId = 281;
        UIMenu.Menu.AddMenuItem("Коробка патронов 5.56mm").itemId = 284;
    }

    UIMenu.Menu.AddMenuItem("Бронежилет").armor = 100;

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");

    menu.ItemSelect.on(async item => {
        UIMenu.Menu.HideMenu();
        if (item.armor) {
            mp.players.local.setArmour(100);
            mp.game.ui.notifications.show("~b~Вы взяли броню");
        }
        if (item.itemId) {
            let moneyFraction = await coffer.getMoney(coffer.getIdByFraction(user.getCache('fraction_id')));
            let itemPrice = items.getItemPrice(item.itemId);

            if (moneyFraction < itemPrice) {
                mp.game.ui.notifications.show(`~r~В бюджете организации не достаточно средств`);
                return;
            }

            inventory.takeNewItem(item.itemId, `{"owner": "BCSD", "userName": "${user.getCache('name')}, "tint": 4"}`).then();
            methods.saveFractionLog(
                user.getCache('name'),
                `Взял ${items.getItemNameById(item.itemId)}`,
                `Потрачено из бюджета: ${methods.moneyFormat(itemPrice)}`,
                user.getCache('fraction_id')
            );
        }
    });
};

menuList.showSheriffArsenalGunModMenu = function() {
    let menu = UIMenu.Menu.Create(`Арсенал`, `~b~Модули на оружие`);

    if (user.getCache('rank_type') == 1 || user.getCache('rank_type') == 2 || user.getCache('rank_type') == 3) {
        UIMenu.Menu.AddMenuItem("Фонарик Beretta 90Two").itemId = 311;
        UIMenu.Menu.AddMenuItem("Оптический прицел Beretta 90Two").itemId = 312;
        UIMenu.Menu.AddMenuItem("Глушитель Beretta 90Two").itemId = 313;
        UIMenu.Menu.AddMenuItem("Компенсатор Beretta 90Two").itemId = 314;

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M3").itemId = 341;
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M3").itemId = 342;

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Голографический прицел Benelli M4").itemId = 349;
        UIMenu.Menu.AddMenuItem("Прицел малой кратности Benelli M4").itemId = 350;
        UIMenu.Menu.AddMenuItem("Прицел средней кратности Benelli M4").itemId = 351;
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M4").itemId = 352;
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M4").itemId = 353;
        UIMenu.Menu.AddMenuItem("Дульный тормоз Benelli M4").itemId = 354;

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик HK-416").itemId = 362;
        UIMenu.Menu.AddMenuItem("Рукоятка HK-416").itemId = 363;
        UIMenu.Menu.AddMenuItem("Глушитель HK-416").itemId = 364;
        UIMenu.Menu.AddMenuItem("Прицел HK-416").itemId = 365;
    }
    else if (user.getCache('rank_type') == 4) {
        UIMenu.Menu.AddMenuItem("Фонарик Beretta 90Two").itemId = 311;
        UIMenu.Menu.AddMenuItem("Оптический прицел Beretta 90Two").itemId = 312;
        UIMenu.Menu.AddMenuItem("Глушитель Beretta 90Two").itemId = 313;
        UIMenu.Menu.AddMenuItem("Компенсатор Beretta 90Two").itemId = 314;

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("MP5A3").itemId = 103;
    }
    else if (user.getCache('rank_type') == 5) {
        UIMenu.Menu.AddMenuItem("Фонарик Beretta 90Two").itemId = 311;
        UIMenu.Menu.AddMenuItem("Оптический прицел Beretta 90Two").itemId = 312;
        UIMenu.Menu.AddMenuItem("Глушитель Beretta 90Two").itemId = 313;
        UIMenu.Menu.AddMenuItem("Компенсатор Beretta 90Two").itemId = 314;

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M3").itemId = 341;
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M3").itemId = 342;

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Голографический прицел Benelli M4").itemId = 349;
        UIMenu.Menu.AddMenuItem("Прицел малой кратности Benelli M4").itemId = 350;
        UIMenu.Menu.AddMenuItem("Прицел средней кратности Benelli M4").itemId = 351;
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M4").itemId = 352;
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M4").itemId = 353;
        UIMenu.Menu.AddMenuItem("Дульный тормоз Benelli M4").itemId = 354;

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик HK-416").itemId = 362;
        UIMenu.Menu.AddMenuItem("Рукоятка HK-416").itemId = 363;
        UIMenu.Menu.AddMenuItem("Глушитель HK-416").itemId = 364;
        UIMenu.Menu.AddMenuItem("Прицел HK-416").itemId = 365;

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик HK-416A5").itemId = 416;
        UIMenu.Menu.AddMenuItem("Голографический прицел HK-416A5").itemId = 417;
        UIMenu.Menu.AddMenuItem("Прицел малой кратности HK-416A5").itemId = 418;
        UIMenu.Menu.AddMenuItem("Прицел большой кратности HK-416A5").itemId = 419;
        UIMenu.Menu.AddMenuItem("Глушитель HK-416A5").itemId = 420;
        UIMenu.Menu.AddMenuItem("Тактический дульный тормоз HK-416A5").itemId = 422;
        UIMenu.Menu.AddMenuItem("Рукоятка HK-416A5").itemId = 428;
    }

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");

    menu.ItemSelect.on(async item => {
        UIMenu.Menu.HideMenu();
        if (item.itemId) {
            let moneyFraction = await coffer.getMoney(coffer.getIdByFraction(user.getCache('fraction_id')));
            let itemPrice = items.getItemPrice(item.itemId);

            if (moneyFraction < itemPrice) {
                mp.game.ui.notifications.show(`~r~В бюджете организации не достаточно средств`);
                return;
            }

            inventory.takeNewItem(item.itemId, `{"owner": "BCSD", "userName": "${user.getCache('name')}, "tint": 4"}`).then();
            methods.saveFractionLog(
                user.getCache('name'),
                `Взял ${items.getItemNameById(item.itemId)}`,
                `Потрачено из бюджета: ${methods.moneyFormat(itemPrice)}`,
                user.getCache('fraction_id')
            );
        }
    });
};

menuList.showSapdGarderobMenu = function() {

    let menu = UIMenu.Menu.Create(`Гардероб`, `~b~Гардероб LSPD`);

    let listGarderob = [
        "Повседневная одежда",
        "Кадетская форма",
        "Офицерская форма",
        "Air Support Division",
        "Tactical Division Black",
        "Tactical Division Red",
        "Tactical Division Standard",
        "Детективная форма",
        "Представительская форма"
    ];

    for (let i = 0; i < listGarderob.length; i++) {
        try {
            UIMenu.Menu.AddMenuItem(`${listGarderob[i]}`);
        }
        catch (e) {
            methods.debug(e);
        }
    }

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");

    menu.IndexChange.on((index) => {
        if (index >= listGarderob.length)
            return;
        mp.events.callRemote('server:uniform:sapd', index);
    });
    menu.ItemSelect.on(item => {
        UIMenu.Menu.HideMenu();
    });
};

menuList.showSapdArsenalMenu = function() {
    let menu = UIMenu.Menu.Create(`Арсенал`, `~b~Арсенал`);

    UIMenu.Menu.AddMenuItem("Сухпаёк").itemId = 32;
    UIMenu.Menu.AddMenuItem("Спец. Аптечка").itemId = 278;
    UIMenu.Menu.AddMenuItem("Полицейское огорождение").itemId = 199;
    UIMenu.Menu.AddMenuItem("Полосатый конус").itemId = 201;
    UIMenu.Menu.AddMenuItem("Красный конус").itemId = 202;

    UIMenu.Menu.AddMenuItem("~b~Оружие").showGun = true;
    UIMenu.Menu.AddMenuItem("~b~Модули на оружие").showGunMod = true;

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");

    menu.ItemSelect.on(async item => {
        UIMenu.Menu.HideMenu();
        if (item.armor) {
            mp.players.local.setArmour(100);
            mp.game.ui.notifications.show("~b~Вы взяли броню");
        }
        if (item.showGun) {
            menuList.showSapdArsenalGunMenu();
        }
        if (item.showGunMod) {
            menuList.showSapdArsenalGunModMenu();
        }
        if (item.itemId) {
            let moneyFraction = await coffer.getMoney(coffer.getIdByFraction(user.getCache('fraction_id')));
            let itemPrice = items.getItemPrice(item.itemId);

            if (moneyFraction < itemPrice) {
                mp.game.ui.notifications.show(`~r~В бюджете организации не достаточно средств`);
                return;
            }

            inventory.takeNewItem(item.itemId, `{"owner": "LSPD", "userName": "${user.getCache('name')}, "tint": 5"}`).then();
            methods.saveFractionLog(
                user.getCache('name'),
                `Взял ${items.getItemNameById(item.itemId)}`,
                `Потрачено из бюджета: ${methods.moneyFormat(itemPrice)}`,
                user.getCache('fraction_id')
            );
        }
    });
};

menuList.showSapdArsenalGunMenu = function() {
    let menu = UIMenu.Menu.Create(`Арсенал`, `~b~Оружие`);

    UIMenu.Menu.AddMenuItem("Наручники").itemId = 40;
    UIMenu.Menu.AddMenuItem("Фонарик").itemId = 59;
    UIMenu.Menu.AddMenuItem("Полицейская дубинка").itemId = 66;
    UIMenu.Menu.AddMenuItem("Электрошокер").itemId = 82;

    if (user.getCache('rank_type') == 1 || user.getCache('rank_type') == 2) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two").itemId = 78;
        UIMenu.Menu.AddMenuItem("Benelli M3").itemId = 90;
        UIMenu.Menu.AddMenuItem("Benelli M4").itemId = 91;
        UIMenu.Menu.AddMenuItem("HK-416").itemId = 110;

        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm").itemId = 280;
        UIMenu.Menu.AddMenuItem("Коробка патронов 12 калибра").itemId = 281;
        UIMenu.Menu.AddMenuItem("Коробка патронов 5.56mm").itemId = 284;
    }
    if (user.getCache('rank_type') == 3 || user.getCache('rank_type') == 5) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two").itemId = 78;
        UIMenu.Menu.AddMenuItem("MP5A3").itemId = 103;

        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm").itemId = 280;
    }
    if (user.getCache('rank_type') == 4) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two").itemId = 78;
        UIMenu.Menu.AddMenuItem("Benelli M3").itemId = 90;
        UIMenu.Menu.AddMenuItem("Benelli M4").itemId = 91;
        UIMenu.Menu.AddMenuItem("HK-416").itemId = 110;
        UIMenu.Menu.AddMenuItem("HK-416A5").itemId = 111;

        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm").itemId = 280;
        UIMenu.Menu.AddMenuItem("Коробка патронов 12 калибра").itemId = 281;
        UIMenu.Menu.AddMenuItem("Коробка патронов 5.56mm").itemId = 284;
    }

    UIMenu.Menu.AddMenuItem("Бронежилет").armor = 100;

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");

    menu.ItemSelect.on(async item => {
        UIMenu.Menu.HideMenu();
        if (item.armor) {
            mp.players.local.setArmour(100);
            mp.game.ui.notifications.show("~b~Вы взяли броню");
        }
        if (item.itemId) {
            let moneyFraction = await coffer.getMoney(coffer.getIdByFraction(user.getCache('fraction_id')));
            let itemPrice = items.getItemPrice(item.itemId);

            if (moneyFraction < itemPrice) {
                mp.game.ui.notifications.show(`~r~В бюджете организации не достаточно средств`);
                return;
            }

            inventory.takeNewItem(item.itemId, `{"owner": "LSPD", "userName": "${user.getCache('name')}", "tint": 5}`).then();
            methods.saveFractionLog(
                user.getCache('name'),
                `Взял ${items.getItemNameById(item.itemId)}`,
                `Потрачено из бюджета: ${methods.moneyFormat(itemPrice)}`,
                user.getCache('fraction_id')
            );
        }
    });
};

menuList.showSapdArsenalGunModMenu = function() {
    let menu = UIMenu.Menu.Create(`Арсенал`, `~b~Модули на оружие`);

    if (user.getCache('rank_type') == 1 || user.getCache('rank_type') == 2) {
        UIMenu.Menu.AddMenuItem("Фонарик Beretta 90Two").itemId = 311;
        UIMenu.Menu.AddMenuItem("Оптический прицел Beretta 90Two").itemId = 312;
        UIMenu.Menu.AddMenuItem("Глушитель Beretta 90Two").itemId = 313;
        UIMenu.Menu.AddMenuItem("Компенсатор Beretta 90Two").itemId = 314;

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M3").itemId = 341;
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M3").itemId = 342;

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Голографический прицел Benelli M4").itemId = 349;
        UIMenu.Menu.AddMenuItem("Прицел малой кратности Benelli M4").itemId = 350;
        UIMenu.Menu.AddMenuItem("Прицел средней кратности Benelli M4").itemId = 351;
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M4").itemId = 352;
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M4").itemId = 353;
        UIMenu.Menu.AddMenuItem("Дульный тормоз Benelli M4").itemId = 354;

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик HK-416").itemId = 362;
        UIMenu.Menu.AddMenuItem("Рукоятка HK-416").itemId = 363;
        UIMenu.Menu.AddMenuItem("Глушитель HK-416").itemId = 364;
        UIMenu.Menu.AddMenuItem("Прицел HK-416").itemId = 365;
    }
    else if (user.getCache('rank_type') == 3 || user.getCache('rank_type') == 5) {
        UIMenu.Menu.AddMenuItem("Фонарик Beretta 90Two").itemId = 311;
        UIMenu.Menu.AddMenuItem("Оптический прицел Beretta 90Two").itemId = 312;
        UIMenu.Menu.AddMenuItem("Глушитель Beretta 90Two").itemId = 313;
        UIMenu.Menu.AddMenuItem("Компенсатор Beretta 90Two").itemId = 314;

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("MP5A3").itemId = 103;
    }
    else if (user.getCache('rank_type') == 4) {
        UIMenu.Menu.AddMenuItem("Фонарик Beretta 90Two").itemId = 311;
        UIMenu.Menu.AddMenuItem("Оптический прицел Beretta 90Two").itemId = 312;
        UIMenu.Menu.AddMenuItem("Глушитель Beretta 90Two").itemId = 313;
        UIMenu.Menu.AddMenuItem("Компенсатор Beretta 90Two").itemId = 314;

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M3").itemId = 341;
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M3").itemId = 342;

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Голографический прицел Benelli M4").itemId = 349;
        UIMenu.Menu.AddMenuItem("Прицел малой кратности Benelli M4").itemId = 350;
        UIMenu.Menu.AddMenuItem("Прицел средней кратности Benelli M4").itemId = 351;
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M4").itemId = 352;
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M4").itemId = 353;
        UIMenu.Menu.AddMenuItem("Дульный тормоз Benelli M4").itemId = 354;

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик HK-416").itemId = 362;
        UIMenu.Menu.AddMenuItem("Рукоятка HK-416").itemId = 363;
        UIMenu.Menu.AddMenuItem("Глушитель HK-416").itemId = 364;
        UIMenu.Menu.AddMenuItem("Прицел HK-416").itemId = 365;

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик HK-416A5").itemId = 416;
        UIMenu.Menu.AddMenuItem("Голографический прицел HK-416A5").itemId = 417;
        UIMenu.Menu.AddMenuItem("Прицел малой кратности HK-416A5").itemId = 418;
        UIMenu.Menu.AddMenuItem("Прицел большой кратности HK-416A5").itemId = 419;
        UIMenu.Menu.AddMenuItem("Глушитель HK-416A5").itemId = 420;
        UIMenu.Menu.AddMenuItem("Тактический дульный тормоз HK-416A5").itemId = 422;
        UIMenu.Menu.AddMenuItem("Рукоятка HK-416A5").itemId = 428;
    }

    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");

    menu.ItemSelect.on(async item => {
        UIMenu.Menu.HideMenu();
        if (item.itemId) {
            let moneyFraction = await coffer.getMoney(coffer.getIdByFraction(user.getCache('fraction_id')));
            let itemPrice = items.getItemPrice(item.itemId);

            if (moneyFraction < itemPrice) {
                mp.game.ui.notifications.show(`~r~В бюджете организации не достаточно средств`);
                return;
            }

            inventory.takeNewItem(item.itemId, `{"owner": "LSPD", "userName": "${user.getCache('name')}", "tint": 5}`).then();
            methods.saveFractionLog(
                user.getCache('name'),
                `Взял ${items.getItemNameById(item.itemId)}`,
                `Потрачено из бюджета: ${methods.moneyFormat(itemPrice)}`,
                user.getCache('fraction_id')
            );
        }
    });
};

menuList.showAdminMenu = function() {
    let menu = UIMenu.Menu.Create(`ADMIN`, `~b~Админ меню`);

    if (user.isAdmin() && mp.players.local.getVariable('enableAdmin') === true) {
        UIMenu.Menu.AddMenuItem("Спавн ТС").doName = 'spawnVeh';
        UIMenu.Menu.AddMenuItem("Цвет ТС").doName = 'colorVeh';
        UIMenu.Menu.AddMenuItem("Одежда").doName = 'cloth';
        //UIMenu.Menu.AddMenuItem("Припарковать ТС").doName = 'server:vehicle:park';
        UIMenu.Menu.AddMenuItem("Уведомление").doName = 'notify';
        UIMenu.Menu.AddMenuItem("No Clip").doName = 'noClip';
        /*UIMenu.Menu.AddMenuItem("Посадить в тюрьму").doName = 'jail';
        UIMenu.Menu.AddMenuItem("Кикнуть игрока").doName = 'kick';
        UIMenu.Menu.AddMenuItem("Телепортироваться к игроку").doName = 'tptoid';
        UIMenu.Menu.AddMenuItem("Телепортировать игрока к себе").doName = 'tptome';
        UIMenu.Menu.AddMenuItem("Инвиз ON").doName = 'invisibleON';
        UIMenu.Menu.AddMenuItem("Инвиз OFF").doName = 'invisibleOFF';
        UIMenu.Menu.AddMenuItem("Godmode ON/OFF").doName = 'godmode';*/
        UIMenu.Menu.AddMenuItem("Телепорт на метку").doName = 'teleportToWaypoint';
        UIMenu.Menu.AddMenuItem("Пофиксить тачку").doName = 'fixvehicle';
        //UIMenu.Menu.AddMenuItem("Зареспавнить ближайший ТС").doName = 'respvehicle';
        UIMenu.Menu.AddMenuItem("Удалить ближайший ТС").doName = 'deletevehicle';
        UIMenu.Menu.AddMenuItem("Перевернуть ближайший ТС").doName = 'flipVehicle';

        if (user.isAdmin(5)) {
            UIMenu.Menu.AddMenuItem("Debug").doName = 'debug';
            UIMenu.Menu.AddMenuItem("Debug2").doName = 'debug2';
            UIMenu.Menu.AddMenuItem("КоордыVeh").doName = 'server:user:getVehPos';
            UIMenu.Menu.AddMenuItem("Коорды").doName = 'server:user:getPlayerPos';
            UIMenu.Menu.AddMenuItem("Коорды2").doName = 'server:user:getPlayerPos2';
        }
        UIMenu.Menu.AddMenuItem("~y~Выключить админку").doName = 'disableAdmin';
        UIMenu.Menu.AddMenuItem("Debug2").doName = 'debug2';
    }
    else {
        UIMenu.Menu.AddMenuItem("~y~Включить админку").doName = 'enableAdmin';
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть");

    menu.ItemSelect.on(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName == 'enableAdmin')
            user.setVariable('enableAdmin', true);
        if (item.doName == 'disableAdmin')
            user.setVariable('enableAdmin', false);
        if (item.doName == 'noClip')
            admin.noClip(true);
        if (item.eventName == 'server:vehicle:park') {
            UIMenu.Menu.HideMenu();
            mp.events.callRemote(item.eventName);
        }
        else if (item.eventName == 'server:user:changeId') {
            UIMenu.Menu.HideMenu();
            let id = await UIMenu.Menu.GetUserInput("Новый ID", "", 10);
            mp.events.callRemote(item.eventName, methods.parseInt(id));
        }
        else if (item.eventName == 'client:distId') {
            UIMenu.Menu.HideMenu();
            let id = await UIMenu.Menu.GetUserInput("Расстояние", "", 10);
            mp.events.call(item.eventName, methods.parseInt(id));
        }
        if (item.doName == 'newVehicle') {
            let vPrice = await UIMenu.Menu.GetUserInput("Цена", "", 10);
            let vCount = await UIMenu.Menu.GetUserInput("Кол-во", "", 4);
            if (vPrice == '')
                return;
            if (vCount == '')
                return;
            mp.events.callRemote('server:admin:newVehicle', vPrice, vCount);
        }
        if (item.doName == 'spawnVeh') {
            let vName = await UIMenu.Menu.GetUserInput("Название ТС", "", 16);
            if (vName == '')
                return;
            methods.saveLog('AdminSpawnVehicle', `${user.getCache('rp_name')} - ${vName}`);
            mp.events.callRemote('server:admin:spawnVeh', vName);
        }
        if (item.doName == 'colorVeh') {
            menuList.showAdminColorVehMenu();
        }
        if (item.doName == 'dropTimer') {
            mp.events.callRemote('server:gangWar:dropTimer');
        }
        if (item.doName == 'cloth') {
            menuList.showAdminClothMenu();
        }
        if (item.doName == 'godmode') {
            user.godmode = !user.godmode;
        }
        if (item.doName == 'debug') {
            menuList.showAdminDebugMenu();
        }
        if (item.doName == 'debug2') {
            menuList.showAdminDebug2Menu();
        }
        if (item.doName == 'teleportToWaypoint')
            user.tpToWaypoint();
        if (item.doName == 'notify') {
            let title = await UIMenu.Menu.GetUserInput("Заголовок", "", 20);
            if (title == '')
                return;
            let text = await UIMenu.Menu.GetUserInput("Текст новости", "", 55);
            if (text == '')
                return;
            methods.saveLog('AdminNotify', `${user.getCache('rp_name')} - ${title} | ${text}`);
            methods.notifyWithPictureToAll(title, 'Администрация', text, 'CHAR_ACTING_UP');
        }
        if (item.doName == 'kick') {
            let id = await UIMenu.Menu.GetUserInput("ID Игрока", "", 10);
            let reason = await UIMenu.Menu.GetUserInput("Причина", "", 100);
            methods.saveLog('AdminKick', `${user.getCache('rp_name')} - ${id} | ${reason}`);
            mp.events.callRemote('server:user:kickByAdmin', methods.parseInt(id), reason);
        }
        if (item.doName == 'kickAll') {
            let reason = await UIMenu.Menu.GetUserInput("Причина", "", 100);
            if (reason == '')
                return;
            methods.saveLog('AdminKickAll', `${user.getCache('rp_name')} - ${reason}`);
            mp.events.callRemote('server:user:kickAllByAdmin', reason);
        }
        if (item.doName == 'jail') {
            let id = await UIMenu.Menu.GetUserInput("ID Игрока", "", 10);
            let min = await UIMenu.Menu.GetUserInput("Кол-во минут", "", 10);
            let reason = await UIMenu.Menu.GetUserInput("Причина", "", 100);
            methods.saveLog('AdminJail', `${user.getCache('rp_name')} - ${id} | ${min}m | ${reason}`);
            mp.events.callRemote('server:user:jailByAdmin', methods.parseInt(id), reason, methods.parseInt(min));
        }
        if (item.doName == 'tptoid') {
            let id = await UIMenu.Menu.GetUserInput("ID Игрока", "", 10);
            mp.events.callRemote('server:user:tpTo', methods.parseInt(id));
        }
        if (item.doName == 'tptome') {
            let id = await UIMenu.Menu.GetUserInput("ID Игрока", "", 10);
            mp.events.callRemote('server:user:tpToMe', methods.parseInt(id));
        }
        if (item.doName == 'invisibleON') {
            user.setVariable('hiddenId', true);
            mp.events.callRemote("server:user:setAlpha", 0);
            /*let visibleState = mp.players.local.isVisible();
            mp.players.local.setVisible(!visibleState, !visibleState);*/
            mp.game.ui.notifications.show(`~q~Инвиз: ON`);
        }
        if (item.doName == 'invisibleOFF') {
            user.setVariable('hiddenId', false);
            mp.events.callRemote("server:user:setAlpha", 255);
            mp.game.ui.notifications.show(`~q~Инвиз: OFF`);
        }
        if (item.doName == 'fixvehicle') {
            mp.events.callRemote('server:user:fixNearestVehicle');
        }
        if (item.doName == 'respvehicle') {
            mp.events.callRemote('server:respawnNearstVehicle');
        }
        if (item.doName == 'deletevehicle') {
            mp.events.callRemote('server:deleteNearstVehicle');
        }
        if (item.doName == 'flipVehicle') {
            mp.events.callRemote('server:flipNearstVehicle');
        }
        if (item.doName == 'server:user:getPlayerPos') {
            mp.events.callRemote('server:user:getPlayerPos');
        }
        if (item.doName == 'server:user:getPlayerPos2') {
            let str = await UIMenu.Menu.GetUserInput("Коорды", "", 200);
            mp.events.callRemote('server:user:getPlayerPos2', str);
        }
        if (item.doName == 'server:user:getVehPos') {
            mp.events.callRemote('server:user:getVehPos');
        }
        if (item.eventName == 'server:user:adrenaline') {
            let id = await UIMenu.Menu.GetUserInput("ID Игрока", "", 10);
            methods.saveLog('AdminHealPlayer', `${user.getCache('rp_name')} | Adrenaline to id: ${id}`);
            mp.events.callRemote('server:user:adrenaline', methods.parseInt(id));
        }
        if (item.eventName == 'server:user:healFirst') {
            let id = await UIMenu.Menu.GetUserInput("ID Игрока", "", 10);
            methods.saveLog('AdminHealPlayer', `${user.getCache('rp_name')} | Heal to id: ${id}`);
            mp.events.callRemote('server:user:healFirst', methods.parseInt(id));
        }
    });
};

menuList.showAdminColorVehMenu = function() {
    let menu = UIMenu.Menu.Create(`Admin`, `~b~Цвет ТС`);

    let color1 = 0;
    let color2 = 0;

    let list = [];
    for (let j = 0; j < 156; j++)
        list.push(j + '');

    let list1Item = UIMenu.Menu.AddMenuItemList("Цвет 1", list);
    let list2Item = UIMenu.Menu.AddMenuItemList("Цвет 2", list);
    let list3Item;
    if (mp.players.local.vehicle.getLiveryCount() > 1) {
        let list2 = [];
        for (let j = 0; j < mp.players.local.vehicle.getLiveryCount(); j++)
            list2.push(j + '');
        list3Item = UIMenu.Menu.AddMenuItemList("Livery", list2);
    }
    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");

    menu.ListChange.on((item, index) => {
        if (list3Item == item) {
            mp.events.callRemote('server:vehicle:setLivery', index);
            return;
        }
        if (list1Item == item)
            color1 = index;
        if (list2Item == item)
            color2 = index;
        mp.events.callRemote('server:vehicle:setColor', color1, color2);
    });

    menu.ItemSelect.on(item => {
        UIMenu.Menu.HideMenu();
    });
};

menuList.showAdminDebugMenu = function() {
    let menu = UIMenu.Menu.Create(`Admin`, `~b~Debug`);

    let list1Item = UIMenu.Menu.AddMenuItemList("Effect", enums.screenEffectList);
    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");

    menu.ListChange.on((item, index) => {
        user.stopAllScreenEffect();
        mp.game.graphics.startScreenEffect(enums.screenEffectList[index], 0, false);
    });

    menu.ItemSelect.on(item => {
        UIMenu.Menu.HideMenu();
    });
};

menuList.showAdminDebug2Menu = function() {
    let menu = UIMenu.Menu.Create(`Admin`, `~b~Debug`);

    UIMenu.Menu.AddMenuItem("openPhone").create = true;
    UIMenu.Menu.AddMenuItem("rotatePhoneV").rotatePhoneV = true;
    UIMenu.Menu.AddMenuItem("rotatePhoneH").rotatePhoneH = true;
    UIMenu.Menu.AddMenuItem("callPhone").callPhone = true;
    UIMenu.Menu.AddMenuItem("hidePhone").destroy = true;

    UIMenu.Menu.AddMenuItem("~r~Закрыть");
    menu.ItemSelect.on(async item => {
        if (item.create)
            user.openPhone(1);
        if (item.rotatePhoneV)
            user.rotatePhoneV();
        if (item.rotatePhoneH)
            user.rotatePhoneH();
        if (item.callPhone)
            user.callPhone();
        if (item.destroy)
            user.hidePhone();
    });
};

/*let objAttach = null;
let bone = 28422; //Hand
let x = 0;
let y = 0;
let z = 0;
let rx = 0;
let ry = 0;
let rz = 0;

menuList.showAdminDebug2Menu = function() {
    let menu = UIMenu.Menu.Create(`Admin`, `~b~Debug`);

    UIMenu.Menu.AddMenuItem("Create Attach").create = true;

    UIMenu.Menu.AddMenuItem("bone " + bone).bone = true;

    UIMenu.Menu.AddMenuItem("x" + x).px = true;
    UIMenu.Menu.AddMenuItem("y" + y).py = true;
    UIMenu.Menu.AddMenuItem("z" + z).pz = true;
    UIMenu.Menu.AddMenuItem("rx" + rx).rpx = true;
    UIMenu.Menu.AddMenuItem("ry" + ry).rpy = true;
    UIMenu.Menu.AddMenuItem("rz" + rz).rpz = true;

    UIMenu.Menu.AddMenuItem("Destroy").destroy = true;

    UIMenu.Menu.AddMenuItem("~r~Закрыть");
    menu.ItemSelect.on(async item => {

        if (item.create) {
            if (objAttach) {
                objAttach.destroy();
                objAttach = null;
            }

            objAttach = mp.objects.new(-1038739674, mp.players.local.position,
                {rotation: new mp.Vector3(0, 0, 30), dimension: -1, }
            );

            objAttach.attachTo(mp.players.local.handle, mp.players.local.getBoneIndex(bone), x, y, z, rx, ry, rz,
                false, false, false, false, 2, true);
        }
        if (item.bone) {
            bone = methods.parseInt(await UIMenu.Menu.GetUserInput("Bone", "", 10));
            objAttach.attachTo(mp.players.local.handle, mp.players.local.getBoneIndex(bone), x, y, z, rx, ry, rz,
                false, false, false, false, 2, true);
        }
        if (item.px) {
            x = methods.parseFloat(await UIMenu.Menu.GetUserInput("x", "", 10));
            objAttach.attachTo(mp.players.local.handle, mp.players.local.getBoneIndex(bone), x, y, z, rx, ry, rz,
                false, false, false, false, 2, true);
        }
        if (item.py) {
            y = methods.parseFloat(await UIMenu.Menu.GetUserInput("y", "", 10));
            objAttach.attachTo(mp.players.local.handle, mp.players.local.getBoneIndex(bone), x, y, z, rx, ry, rz,
                false, false, false, false, 2, true);
        }
        if (item.pz) {
            z = methods.parseFloat(await UIMenu.Menu.GetUserInput("z", "", 10));
            objAttach.attachTo(mp.players.local.handle, mp.players.local.getBoneIndex(bone), x, y, z, rx, ry, rz,
                false, false, false, false, 2, true);
        }
        if (item.rpx) {
            rx = methods.parseFloat(await UIMenu.Menu.GetUserInput("rx", "", 10));
            objAttach.attachTo(mp.players.local.handle, mp.players.local.getBoneIndex(bone), x, y, z, rx, ry, rz,
                false, false, false, false, 2, true);
        }
        if (item.rpy) {
            ry = methods.parseFloat(await UIMenu.Menu.GetUserInput("ry", "", 10));
            objAttach.attachTo(mp.players.local.handle, mp.players.local.getBoneIndex(bone), x, y, z, rx, ry, rz,
                false, false, false, false, 2, true);
        }
        if (item.rpz) {
            rz = methods.parseFloat(await UIMenu.Menu.GetUserInput("rz", "", 10));
            objAttach.attachTo(mp.players.local.handle, mp.players.local.getBoneIndex(bone), x, y, z, rx, ry, rz,
                false, false, false, false, 2, true);
        }
        if (item.destroy) {
            if (objAttach) {
                objAttach.destroy();
                objAttach = null;
            }
        }
    });
};*/

menuList.showAdminClothMenu = function() {
    let menu = UIMenu.Menu.Create(`Admin`, `~b~Одежда`);

    let list = [];
    for (let j = 0; j < 500; j++)
        list.push(j + '');

    let listColor = [];
    for (let j = 0; j < 100; j++)
        listColor.push(j + '');

    let id = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
    let idColor = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];

    let id1 = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
    let idColor1 = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];

    for (let i = 0; i < 12; i++) {
        let list1Item = UIMenu.Menu.AddMenuItemList("Слот " + i, list);
        list1Item.slotId = i;
        list1Item.type = 0;

        let list2Item = UIMenu.Menu.AddMenuItemList("Цвет " + i, list);
        list2Item.slotId = i;
        list2Item.type = 1;

        UIMenu.Menu.AddMenuItem(" ");
    }

    for (let i = 0; i < 8; i++) {
        let list1Item = UIMenu.Menu.AddMenuItemList("ПСлот " + i, list);
        list1Item.slotId = i;
        list1Item.type = 2;

        let list2Item = UIMenu.Menu.AddMenuItemList("ПЦвет " + i, list);
        list2Item.slotId = i;
        list2Item.type = 3;

        UIMenu.Menu.AddMenuItem(" ");
    }
    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть");

    menu.ListChange.on((item, index) => {

        switch (item.type) {
            case 0:
                id[item.slotId] = index;
                user.setComponentVariation(item.slotId, id[item.slotId], idColor[item.slotId]);
                break;
            case 1:
                idColor[item.slotId] = index;
                user.setComponentVariation(item.slotId, id[item.slotId], idColor[item.slotId]);
                break;
            case 2:
                id1[item.slotId] = index;
                user.setProp(item.slotId, id1[item.slotId], idColor1[item.slotId]);
                break;
            case 3:
                idColor1[item.slotId] = index;
                user.setProp(item.slotId, id1[item.slotId], idColor1[item.slotId]);
                break;
        }
    });

    menu.ItemSelect.on(item => {
        UIMenu.Menu.HideMenu();
    });
};


export default menuList;