import Container from './modules/data';
import UIMenu from './modules/menu';
import methods from './modules/methods';
import ui from './modules/ui';
import cefMenu from './modules/cefMenu';

import weather from './manager/weather';
import bind from './manager/bind';
import heliCam from './manager/heliCam';
import edu from './manager/edu';
import quest from "./manager/quest";
import jobPoint from "./manager/jobPoint";
import vSync from "./manager/vSync";
import dispatcher from "./manager/dispatcher";
import drone from "./manager/drone";
import timer from "./manager/timer";

import user from './user';
import admin from './admin';
import enums from './enums';
import coffer from './coffer';
import items from './items';
import inventory from './inventory';
import weapons from './weapons';
import chat from './chat';
//import voice from './voice';

import houses from './property/houses';
import condos from './property/condos';
import stocks from './property/stocks';
import business from './property/business';
import vehicles from "./property/vehicles";
import yachts from "./property/yachts";
import fraction from "./property/fraction";

import cloth from './business/cloth';
import vShop from "./business/vShop";
import fuel from "./business/fuel";

import bus from "./jobs/bus";
import gr6 from "./jobs/gr6";
import mail from "./jobs/mail";
import photo from "./jobs/photo";
import tree from "./jobs/tree";
import builder from "./jobs/builder";
import loader from "./jobs/loader";
import lamar from "./jobs/lamar";
import trucker from "./jobs/trucker";
import taxi from "./jobs/taxi";

let menuList = {};

menuList.showHouseBuyMenu = async function(h) {

    UIMenu.Menu.Create(` `, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`, 'hm', false, false, 'h1');

    UIMenu.Menu.AddMenuItem(`Купить дом за ~g~${methods.moneyFormat(h.get('price'))}`, "", {doName: 'buyHouse'});

    let garage = 0;
    if (h.get('ginterior1') >= 0)
        garage++;
    if (h.get('ginterior2') >= 0)
        garage++;
    if (h.get('ginterior3') >= 0)
        garage++;

    UIMenu.Menu.AddMenuItem("~b~Кол-во жилых мест: ~s~" + h.get('max_roommate'));

    if (garage > 0)
        UIMenu.Menu.AddMenuItem("~b~Кол-во гаражей: ~s~" + garage);

    if (h.get('ginterior1') >= 0)
        UIMenu.Menu.AddMenuItem("~b~Гараж: ~s~" + enums.garageNames[h.get('ginterior1')]);
    if (h.get('ginterior2') >= 0)
        UIMenu.Menu.AddMenuItem("~b~Гараж: ~s~" + enums.garageNames[h.get('ginterior2')]);
    if (h.get('ginterior3') >= 0)
        UIMenu.Menu.AddMenuItem("~b~Гараж: ~s~" + enums.garageNames[h.get('ginterior3')]);

    UIMenu.Menu.AddMenuItem(`~g~Осмотреть дом`, "", {doName: 'enterHouse'});

    if (user.getCache('job') == 4) {
        if (!await user.hasById('isMail' + h.get('id')))
            UIMenu.Menu.AddMenuItem(`~g~Положить почту`, "", {doName: 'sendMail'});
        else
            UIMenu.Menu.AddMenuItem("~o~Дом уже обслуживался");
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'enterHouse') {
            houses.enter(h.get('id'));
        }
        else if (item.doName === 'buyHouse') {
            houses.buy(h.get('id'));
        }
        else if (item.doName === 'sendMail') {
            mail.sendMail(h.get('id'))
        }
    });
};

menuList.showHouseInMenu = function(h) {

    UIMenu.Menu.Create(` `, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`, 'hm', false, false, 'h1');

    if (h.get('user_id') == user.getCache('id')) {
        if (h.get('pin') > 0)
            UIMenu.Menu.AddMenuItem("~y~Сменить пинкод", "", {doName: 'setPin'});
        else {
            UIMenu.Menu.AddMenuItemList("Дверь", ['~g~Открыто', '~r~Закрыто'], "", {doName: 'setLock'}, h.get('is_lock') ? 1 : 0);
        }
        if (h.get('is_safe') > 0)
            UIMenu.Menu.AddMenuItem("~y~Сменить пинкод от сейфа", "", {doName: 'setSafe'});
    }

    if (h.get('ginterior1') >= 0)
        UIMenu.Menu.AddMenuItem(`~g~Войти в ${enums.garageNames[h.get('ginterior1')].toLowerCase()} гараж`, "", {doName: 'enterGarage1'});
    if (h.get('ginterior2') >= 0)
        UIMenu.Menu.AddMenuItem(`~g~Войти в ${enums.garageNames[h.get('ginterior2')].toLowerCase()} гараж`, "", {doName: 'enterGarage2'});
    if (h.get('ginterior3') >= 0)
        UIMenu.Menu.AddMenuItem(`~g~Войти в ${enums.garageNames[h.get('ginterior3')].toLowerCase()} гараж`, "", {doName: 'enterGarage3'});

    UIMenu.Menu.AddMenuItem("~g~Выйти из дома", "", {doName: 'exitHouse'});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnList.Add((item, index) => {
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

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName == 'exitHouse') {
            houses.exit(h.get('x'), h.get('y'), h.get('z'), h.get('rot'));
        }
        if (item.doName == 'enterGarage1') {
            houses.enterGarage(h.get('ginterior1'));
        }
        if (item.doName == 'enterGarage2') {
            houses.enterGarage(h.get('ginterior2'));
        }
        if (item.doName == 'enterGarage3') {
            houses.enterGarage(h.get('ginterior3'));
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
        if (item.doName == 'setSafe') {
            let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 8));
            if (pass < 1) {
                mp.game.ui.notifications.show('~r~Пароль должен быть больше нуля');
                return false;
            }
            mp.game.ui.notifications.show('~g~Ваш новый пароль: ~s~' + pass);
            houses.updateSafe(h.get('id'), pass);
        }
    });
};

menuList.showHouseInGMenu = function(h) {

    UIMenu.Menu.Create(` `, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`, 'hm', false, false, 'h1');

    UIMenu.Menu.AddMenuItem("~g~Войти в дом", "", {doName: 'enterHouse'});
    UIMenu.Menu.AddMenuItem("~g~Выйти из гаража", "", {doName: 'exitGarage'});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'enterHouse') {
            houses.enter(h.get('id'));
        }
        if (item.doName === 'exitGarage') {
            houses.exit(h.get('x'), h.get('y'), h.get('z'), h.get('rot'));
        }
    });
};

menuList.showHouseInVMenu = function(h) {

    UIMenu.Menu.Create(` `, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`, 'hm', false, false, 'h1');

    UIMenu.Menu.AddMenuItem("~g~Выйти из гаража", "", {doName: 'exitGarage'});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'exitGarage') {
            houses.exitv(h.get('id'));
        }
    });
};

menuList.showHouseOutMenu = async function(h) {

    UIMenu.Menu.Create(` `, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`, 'hm', false, false, 'h1');
    UIMenu.Menu.AddMenuItem(`~b~Владелец:~s~ ${h.get('user_name')}`);

    UIMenu.Menu.AddMenuItem("~b~Кол-во жилых мест: ~s~" + h.get('max_roommate'));

    let garage = 0;
    if (h.get('ginterior1') >= 0)
        garage++;
    if (h.get('ginterior2') >= 0)
        garage++;
    if (h.get('ginterior3') >= 0)
        garage++;
    if (garage > 0)
        UIMenu.Menu.AddMenuItem("~b~Кол-во гаражей: ~s~" + garage);

    UIMenu.Menu.AddMenuItem("~g~Войти", "", {doName: 'enterHouse'});

    if (user.getCache('job') == 4) {
        if (!await user.hasById('isMail' + h.get('id')))
            UIMenu.Menu.AddMenuItem("~g~Положить почту", "", {doName: 'sendMail'});
        else
            UIMenu.Menu.AddMenuItem("~o~Дом уже обслуживался");
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'enterHouse') {
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
        else if (item.doName === 'sendMail') {
            mail.sendMail(h.get('id'))
        }
    });
};

menuList.showHouseOutVMenu = async function(h) {

    UIMenu.Menu.Create(` `, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`, 'hm', false, false, 'h1');
    UIMenu.Menu.AddMenuItem(`~b~Владелец:~s~ ${h.get('user_name')}`);
    UIMenu.Menu.AddMenuItem("~g~Войти в гараж", "", {doName: 'enterGarage'});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'enterGarage') {
            try {
                if (h.get('pin') > 0 && user.getCache('id') != h.get('user_id')) {
                    mp.game.ui.notifications.show('~r~Введите пинкод');
                    let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 5));
                    if (pass == h.get('pin'))
                        houses.enterv(h.get('id'));
                    else
                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');
                }
                else if (h.get('is_lock') && h.get('user_id') != user.getCache('id'))
                    mp.game.ui.notifications.show('~r~Дверь закрыта, ее можно взломать отмычкой');
                else
                    houses.enterv(h.get('id'));
            }
            catch (e) {
                methods.debug(e);
            }
        }
    });
};

menuList.showCondoBuyMenu = async function(h) {

    UIMenu.Menu.Create(` `, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`, 'hm', false, false, 'h1');

    UIMenu.Menu.AddMenuItem(`Купить квартиру за ~g~${methods.moneyFormat(h.get('price'))}`, "", {doName: 'buyHouse'});
    UIMenu.Menu.AddMenuItem("~g~Осмотреть квартиру", "", {doName: 'enterHouse'});

    if (user.getCache('job') == 4) {
        if (!await user.hasById('isMail2' + h.get('id')))
            UIMenu.Menu.AddMenuItem("~g~Положить почту", "", {doName: 'sendMail'});
        else
            UIMenu.Menu.AddMenuItem("~o~Дом уже обслуживался");
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'enterHouse') {
            condos.enter(h.get('id'));
        }
        else if (item.doName === 'buyHouse') {
            condos.buy(h.get('id'));
        }
        else if (item.doName === 'sendMail') {
            mail.sendMail2(h.get('id'))
        }
    });
};

menuList.showCondoInMenu = function(h) {

    UIMenu.Menu.Create(` `, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`, 'hm', false, false, 'h1');

    if (h.get('user_id') == user.getCache('id')) {
        if (h.get('pin') > 0)
            UIMenu.Menu.AddMenuItem("~y~Сменить пинкод", "", {doName: 'setPin'});
        else {
            UIMenu.Menu.AddMenuItemList("Дверь", ['~g~Открыто', '~r~Закрыто'], "", {doName: 'setLock'}, h.get('is_lock') ? 1 : 0);
        }
        if (h.get('is_safe') > 0)
            UIMenu.Menu.AddMenuItem("~y~Сменить пинкод от сейфа", "", {doName: 'setSafe'});
        //if (h.get('is_sec'))
        //    UIMenu.Menu.AddMenuItem("~y~Подключиться к камере").doName = 'sec';
    }

    UIMenu.Menu.AddMenuItem("~g~Выйти из квартиры", "", {doName: 'exitHouse'});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnList.Add((item, index) => {
        if (item.doName === 'setLock') {
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

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'exitHouse') {
            condos.exit(h.get('x'), h.get('y'), h.get('z'), h.get('rot'));
        }
        if (item.doName == 'setSafe') {
            let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 8));
            if (pass < 1) {
                mp.game.ui.notifications.show('~r~Пароль должен быть больше нуля');
                return false;
            }
            mp.game.ui.notifications.show('~g~Ваш новый пароль: ~s~' + pass);
            condos.updateSafe(h.get('id'), pass);
        }
        if (item.doName === 'setPin') {
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

    UIMenu.Menu.Create(` `, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`, 'hm', false, false, 'h1');
    UIMenu.Menu.AddMenuItem(`~b~Владелец:~s~ ${h.get('user_name')}`);

    UIMenu.Menu.AddMenuItem("~g~Войти", "", {doName: 'enterHouse'});

    if (user.getCache('job') === 4) {
        if (!await user.hasById('isMail2' + h.get('id')))
            UIMenu.Menu.AddMenuItem("~g~Положить почту", "", {doName: 'sendMail'});
        else
            UIMenu.Menu.AddMenuItem("~o~Дом уже обслуживался");
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'enterHouse') {
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
        else if (item.doName === 'sendMail') {
            mail.sendMail2(h.get('id'))
        }
    });
};

menuList.showYachtBuyMenu = async function(h) {

    UIMenu.Menu.Create(` `, `~b~Яхта: ~s~${h.get('name')}`, 'hm', false, false, 'h1');

    UIMenu.Menu.AddMenuItem(`Купить яхту за ~g~${methods.moneyFormat(h.get('price'))}`, "", {doName: 'buyHouse'});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'buyHouse') {
            yachts.buy(h.get('id'));
        }
    });
};

menuList.showYachtOutMenu = async function(h) {

    UIMenu.Menu.Create(` `, `~b~Яхта: ~s~${h.get('name')}`, 'hm', false, false, 'h1');
    UIMenu.Menu.AddMenuItem(`~b~Владелец:~s~ ${h.get('user_name')}`);

    if (h.get('user_id') === user.getCache('id'))
        UIMenu.Menu.AddMenuItem("~y~Сменить имя яхты", "", {doName: 'setName'});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'setName') {
            let pass = methods.removeQuotesAll(await UIMenu.Menu.GetUserInput("Имя", "", 30));
            if (pass === '')
                return false;
            yachts.updateName(h.get('id'), pass);
        }
    });
};

menuList.showStockBuyMenu = async function(h) {

    UIMenu.Menu.Create(` `, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`, 'hm', false, false, 'h1');

    if (h.get('interior') == 0)
        UIMenu.Menu.AddMenuItem(`~b~Тип склада:~s~ Маленький`);
    if (h.get('interior') == 1)
        UIMenu.Menu.AddMenuItem(`~b~Тип склада:~s~ Средний`);
    if (h.get('interior') == 2)
        UIMenu.Menu.AddMenuItem(`~b~Тип склада:~s~ Большой`);

    UIMenu.Menu.AddMenuItem(`Купить склад за ~g~${methods.moneyFormat(h.get('price'))}`, "", {doName: 'buyStock'});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'buyStock') {
            stocks.buy(h.get('id'));
        }
    });
};

menuList.showStockInMenu = function(h) {

    UIMenu.Menu.Create(` `, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`, 'hm', false, false, 'h1');
    UIMenu.Menu.AddMenuItem("~g~Выйти", "", {doName: 'exitStock'});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'exitStock') {
            stocks.exit(h.get('x'), h.get('y'), h.get('z'), h.get('rot'));
        }
    });
};

menuList.showStockPanelMenu = function(h) {

    UIMenu.Menu.Create(` `, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`, 'hm', false, false, 'h1');

    UIMenu.Menu.AddMenuItem("Модернизировать", "", {doName: 'showStockPanelUpgradeMenu'});
    UIMenu.Menu.AddMenuItem("Список ваших ящиков", "", {doName: 'showStockPanelBoxListMenu'});

    UIMenu.Menu.AddMenuItem("Сменить пинкод", "", {doName: 'setPin'});
    if (h.get('interior') == 0) {
        UIMenu.Menu.AddMenuItem("Сменить пинкод от сейфа", "", {doName: 'setPin1'});
    }
    if (h.get('interior') == 1) {
        UIMenu.Menu.AddMenuItem("Сменить пинкод от сейфа #1", "", {doName: 'setPin1'});
        UIMenu.Menu.AddMenuItem("Сменить пинкод от сейфа #2", "", {doName: 'setPin2'});
    }
    if (h.get('interior') == 2) {
        UIMenu.Menu.AddMenuItem("Сменить пинкод от сейфа #1", "", {doName: 'setPin1'});
        UIMenu.Menu.AddMenuItem("Сменить пинкод от сейфа #2", "", {doName: 'setPin2'});
        UIMenu.Menu.AddMenuItem("Сменить пинкод от сейфа #3", "", {doName: 'setPin3'});
    }
    if (h.get('upgrade_g')) {
        UIMenu.Menu.AddMenuItem("Сменить пинкод от офиса", "", {doName: 'setPinO'});
    }

    //UIMenu.Menu.AddMenuItem("~y~Лог"); //TODO
    UIMenu.Menu.AddMenuItem("Руководство", "", {doName: 'about'});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();

        if (item.doName == 'setPin') {
            let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 10));
            if (pass < 1) {
                mp.game.ui.notifications.show('~r~Пароль должен быть больше нуля');
                return false;
            }
            mp.game.ui.notifications.show('~g~Ваш новый пароль: ~s~' + pass);
            stocks.updatePin(h.get('id'), pass);
        }
        if (item.doName == 'setPin1') {
            let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 5));
            if (pass < 1) {
                mp.game.ui.notifications.show('~r~Пароль должен быть больше нуля');
                return false;
            }
            mp.game.ui.notifications.show('~g~Ваш новый пароль: ~s~' + pass);
            stocks.updatePin1(h.get('id'), pass);
        }
        if (item.doName == 'setPin2') {
            let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 5));
            if (pass < 1) {
                mp.game.ui.notifications.show('~r~Пароль должен быть больше нуля');
                return false;
            }
            mp.game.ui.notifications.show('~g~Ваш новый пароль: ~s~' + pass);
            stocks.updatePin2(h.get('id'), pass);
        }
        if (item.doName == 'setPin3') {
            let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 5));
            if (pass < 1) {
                mp.game.ui.notifications.show('~r~Пароль должен быть больше нуля');
                return false;
            }
            mp.game.ui.notifications.show('~g~Ваш новый пароль: ~s~' + pass);
            stocks.updatePin3(h.get('id'), pass);
        }
        if (item.doName == 'setPinO') {
            let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 5));
            if (pass < 1) {
                mp.game.ui.notifications.show('~r~Пароль должен быть больше нуля');
                return false;
            }
            mp.game.ui.notifications.show('~g~Ваш новый пароль: ~s~' + pass);
            stocks.updatePinO(h.get('id'), pass);
        }
        if (item.doName == 'showStockPanelUpgradeMenu') {
            menuList.showStockPanelUpgradeMenu(h);
        }
        if (item.doName == 'about') {
            chat.sendLocal(`!{${chat.clBlue}}Справка`);
            chat.sendLocal(`Вы можете модернизировать склад.`);
            chat.sendLocal(`Если продавать груз коллекциями, то множитель будет увеличиваться, например вы собрали 3 груза одинаково класса, то вы получите множитель x1.1, и так не больше x2.`);
        }
        if (item.doName == 'showStockPanelBoxListMenu') {
            menuList.showStockPanelBoxListMenu(h);
        }
    });
};

menuList.showStockPanelUpgradeMenu = function(h) {

    UIMenu.Menu.Create(` `, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`, 'hm', false, false, 'h1');

    if (h.get('interior') > 1 && !h.get('upgrade_g'))
        UIMenu.Menu.AddMenuItem(`~y~Расширенный гараж и жилой офис`, "Стоимость: ~g~$2.500.000~s~~br~Благодаря этому лучшению, вы можете сделать ваш склад спавном для вашей организации~br~Бонусом выступает, что в гараже можно хранить грузовики и больой транспорт", {buyGarage: true});

    h.get('upgrade').split('_').forEach((uItem, idx) => {
        uItem = methods.parseInt(uItem);
        if (uItem === -1) {
            UIMenu.Menu.AddMenuItem(`${(idx + 1)}. ~g~Слот свободен`, "", {buySlot: idx});
        }
        else {
            let rare = 'Стандарт';
            if (stocks.boxList[uItem][7] === 1)
                rare = '~b~Редкий';
            if (stocks.boxList[uItem][7] === 2)
                rare = '~p~Очень редкий';

            UIMenu.Menu.AddMenuItem(`${(idx + 1)}. ${stocks.boxList[uItem][0]}`, `Редкость: ${rare}~br~~s~Класс: ~b~${stocks.boxList[uItem][6]}`, {sellSlot: idx});
        }
    });

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.buySlot >= 0)
            menuList.showStockPanelUpgradeBuySlotMenu(h, item.buySlot);
        if (item.buyGarage >= 0)
            menuList.showStockPanelUpgradeBuyGarageMenu(h);
    });
};

menuList.showStockPanelUpgradeBuySlotMenu = function(h, slot) {

    try {
        UIMenu.Menu.Create(` `, `~b~Выберите ящик для покупки`, 'hm', false, false, 'h1');

        stocks.boxList.forEach((item, idx) => {
            if (!item[4])
                return;
            UIMenu.Menu.AddMenuItem(`${item[0]}`, `Цена: ~g~${methods.moneyFormat(item[5])}~br~~s~Объем: ~g~${methods.numberFormat(item[2])}см³`, {buyBox: idx});
        });

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async item => {
            UIMenu.Menu.HideMenu();
            if (item.buyBox >= 0)
                stocks.upgradeAdd(h.get('id'), slot, item.buyBox);
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showStockPanelUpgradeBuyGarageMenu = function(h) {

    try {
        UIMenu.Menu.Create(` `, `~b~Выберите ящик для покупки`, 'hm', false, false, 'h1');

        UIMenu.Menu.AddMenuItem("Купить за ~g~$2.500.000", "", {doName: 'yes'});

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async item => {
            UIMenu.Menu.HideMenu();
            if (item.doName === 'yes') {
                if (user.getBankMoney() < 2500000) {
                    mp.game.ui.notifications.show('~r~На вашем банковском счету не хватает средств');
                    return;
                }
                user.removeBankMoney(2500000, 'Улучшение для склада #' + h.get('id'));
                stocks.upgradeGarage(h.get('id'));
                mp.game.ui.notifications.show('~g~Поздравляем с покупкой улучшения, теперь при входе на склад, вам будет предложение войти во второе помещение');
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showStockPanelBoxListMenu = function(h) {

    UIMenu.Menu.Create(` `, `~b~Категории ящиков`, 'hm', false, false, 'h1');

    let incList = [];

    stocks.boxList.forEach((item, idx) => {
        if (incList.includes(item[6]))
            return;
        incList.push(item[6]);
        UIMenu.Menu.AddMenuItem(`${item[6]}`, "", {className: item[6]});
    });

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.className)
            menuList.showStockPanelBoxInfoMenu(h, item.className);
    });
};

menuList.showStockPanelBoxInfoMenu = function(h, className) {

    UIMenu.Menu.Create(` `, `~b~${className}`, 'hm', false, false, 'h1');

    let price = 0;
    let classIdx = 0;

    h.get('upgrade').split('_').forEach((uItem, idx) => {

        uItem = methods.parseInt(uItem);
        if (uItem == -1)
            return;

        let item = stocks.boxList[uItem];

        if (item[6] != className)
            return;

        if (className == 'Стандарт') {
            let priceBox = item[5] / 4;
            UIMenu.Menu.AddMenuItem(`${item[0]}`, 'Нажмите ~g~Enter~s~ чтобы посмотреть', {slot: idx, price: priceBox, item: item, boxId: uItem}, `~g~${methods.moneyFormat(priceBox)}`);

            classIdx++;
            price += priceBox;
        }
        else {
            let priceBox = item[5] / 1000;
            UIMenu.Menu.AddMenuItem(`${item[0]}`, 'Нажмите ~g~Enter~s~ чтобы посмотреть', {slot: idx, price: priceBox, item: item, boxId: uItem}, `~g~${methods.numberFormat(priceBox)}ec`);
            classIdx++;

            if (classIdx >= 9)
                price += priceBox * 2;
            else if (classIdx >= 6)
                price += priceBox * 1.5;
            else if (classIdx >= 3)
                price += priceBox * 1.1;
            else
                price += priceBox;
        }
    });

    if (price > 0) {
        if (className != 'Стандарт')
            UIMenu.Menu.AddMenuItem(`~y~Продать всё за ~s~${methods.numberFormat(price)}ec`, "", {sellAll: price + 0.00001});
    }
    else {
        UIMenu.Menu.AddMenuItem("Список пуст");
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.sellAll)
            mp.events.callRemote('server:stock:sellAllByClass', className, item.sellAll);
        if (item.price)
            menuList.showStockPanelBoxInfoMoreMenu(h, item.item, item.slot, item.price, item.boxId);
    });
};

menuList.showStockPanelBoxInfoMoreMenu = function(h, item, slot, price, boxId) {

    UIMenu.Menu.Create(` `, `~b~${item[0]}`, 'hm', false, false, 'h1');

    if (boxId === 3 || boxId === 4 || boxId === 38 || boxId === 39 || boxId === 50 || boxId === 51 || boxId === 52)
        UIMenu.Menu.AddMenuItem(`~g~Открыть ящик`, "", {isOpen: true});

    if (item[7] < 0)
        UIMenu.Menu.AddMenuItem(`~y~Продать за ~s~${methods.moneyFormat(price)}`, "", {isSell: true});
    else
        UIMenu.Menu.AddMenuItem(`~y~Продать за ~s~${methods.numberFormat(price)}ec`, "", {isSell: true});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.isSell)
            mp.events.callRemote('server:stock:sellBySlot', slot);
        if (item.isOpen)
            mp.events.callRemote('server:stock:openBySlot', slot, boxId);
    });
};

menuList.showStockOutMenu = async function(h) {

    UIMenu.Menu.Create(` `, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`, 'hm', false, false, 'h1');
    UIMenu.Menu.AddMenuItem(`~b~Владелец:~s~ ${h.get('user_name')}`);
    UIMenu.Menu.AddMenuItem("~g~Войти на склад", "", {doName: 'enterStock'});
    if (h.get('upgrade_g'))
        UIMenu.Menu.AddMenuItem("~g~Войти в офис", "", {doName: 'enterStock1'});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'enterStock') {
            try {
                if (user.getCache('id') != h.get('user_id')) {

                    if (Container.Data.HasLocally(mp.players.local.remoteId, "isPassTimeout"))
                    {
                        mp.game.ui.notifications.show("~r~Таймаут 10 сек");
                        return;
                    }

                    let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 10));

                    if (pass === 0) {
                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');
                        return;
                    }

                    Container.Data.SetLocally(mp.players.local.remoteId, "isPassTimeout", true);

                    if (pass === h.get('pin')) {
                        stocks.enter(h.get('id'));
                        Container.Data.ResetLocally(mp.players.local.remoteId, "isPassTimeout");
                    }
                    else {

                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');
                        setTimeout(function () {
                            Container.Data.ResetLocally(mp.players.local.remoteId, "isPassTimeout");
                        }, 10000);
                    }

                    /*mp.game.ui.notifications.show('~r~Введите пинкод');
                    let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите пинкод", "", 5));
                    if (pass == h.get('pin'))
                        stocks.enter(h.get('id'));
                    else
                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');*/
                }
                else
                    stocks.enter(h.get('id'));
            }
            catch (e) {
                methods.debug(e);
            }
        }
        if (item.doName === 'enterStock1') {
            try {
                if (user.getCache('id') != h.get('user_id')) {

                    if (Container.Data.HasLocally(mp.players.local.remoteId, "isPassTimeout"))
                    {
                        mp.game.ui.notifications.show("~r~Таймаут 10 сек");
                        return;
                    }

                    let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 10));

                    if (pass === 0) {
                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');
                        return;
                    }

                    Container.Data.SetLocally(mp.players.local.remoteId, "isPassTimeout", true);

                    if (pass === h.get('pin_o')) {
                        stocks.enter1(h.get('id'));
                        Container.Data.ResetLocally(mp.players.local.remoteId, "isPassTimeout");
                    }
                    else {

                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');
                        setTimeout(function () {
                            Container.Data.ResetLocally(mp.players.local.remoteId, "isPassTimeout");
                        }, 10000);
                    }

                    /*mp.game.ui.notifications.show('~r~Введите пинкод');
                    let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите пинкод", "", 5));
                    if (pass == h.get('pin'))
                        stocks.enter(h.get('id'));
                    else
                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');*/
                }
                else
                    stocks.enter1(h.get('id'));
            }
            catch (e) {
                methods.debug(e);
            }
        }
    });
};

menuList.showStockInVMenu = function(h) {

    UIMenu.Menu.Create(` `, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`, 'hm', false, false, 'h1');
    UIMenu.Menu.AddMenuItem("~g~Выйти", "", {doName: 'exit'});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'exit') {
            stocks.exitv(h.get('vx'), h.get('vy'), h.get('vz'), h.get('vrot'));
        }
    });
};

menuList.showStockOutVMenu = async function(h) {

    UIMenu.Menu.Create(` `, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`, 'hm', false, false, 'h1');
    UIMenu.Menu.AddMenuItem(`~b~Владелец:~s~ ${h.get('user_name')}`);
    UIMenu.Menu.AddMenuItem("~g~Войти на склад", "", {doName: 'enter'});
    if (h.get('upgrade_g'))
        UIMenu.Menu.AddMenuItem("~g~Войти в офис", "", {doName: 'enter1'});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'enter') {
            try {
                if (user.getCache('id') != h.get('user_id')) {

                    if (Container.Data.HasLocally(mp.players.local.remoteId, "isPassTimeout"))
                    {
                        mp.game.ui.notifications.show("~r~Таймаут 10 сек");
                        return;
                    }

                    let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 10));
                    if (pass === 0) {
                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');
                        return;
                    }

                    Container.Data.SetLocally(mp.players.local.remoteId, "isPassTimeout", true);

                    if (pass === h.get('pin')) {
                        stocks.enterv(h.get('id'));
                        Container.Data.ResetLocally(mp.players.local.remoteId, "isPassTimeout");
                    }
                    else {

                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');
                        setTimeout(function () {
                            Container.Data.ResetLocally(mp.players.local.remoteId, "isPassTimeout");
                        }, 10000);
                    }
                }
                else
                    stocks.enterv(h.get('id'));
            }
            catch (e) {
                methods.debug(e);
            }
        }
        if (item.doName === 'enter1') {
            try {
                if (user.getCache('id') != h.get('user_id')) {

                    if (Container.Data.HasLocally(mp.players.local.remoteId, "isPassTimeout"))
                    {
                        mp.game.ui.notifications.show("~r~Таймаут 10 сек");
                        return;
                    }

                    let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 10));
                    if (pass === 0) {
                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');
                        return;
                    }

                    Container.Data.SetLocally(mp.players.local.remoteId, "isPassTimeout", true);

                    if (pass === h.get('pin_o')) {
                        stocks.enterv1(h.get('id'));
                        Container.Data.ResetLocally(mp.players.local.remoteId, "isPassTimeout");
                    }
                    else {

                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');
                        setTimeout(function () {
                            Container.Data.ResetLocally(mp.players.local.remoteId, "isPassTimeout");
                        }, 10000);
                    }
                }
                else
                    stocks.enterv1(h.get('id'));
            }
            catch (e) {
                methods.debug(e);
            }
        }
    });
};

menuList.showBusinessTeleportMenu = function() {

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create(` `, `~b~Бизнес центр`, 'showBusinessTeleportMenu', false, false, 'arcadius');

    business.typeList.forEach(function (item, i, arr) {
        UIMenu.Menu.AddMenuItem(`${item}`, "", {typeId: i});
    });

    UIMenu.Menu.AddMenuItem("~g~Улица", "", {teleportPos: business.BusinessStreetPos});
    UIMenu.Menu.AddMenuItem("~g~Крыша", "", {teleportPos: business.BusinessRoofPos});
    UIMenu.Menu.AddMenuItem("~g~Гараж", "", {teleportPos: business.BusinessGaragePos});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();

        if (item.typeId >= 0) {
            mp.events.callRemote('server:events:showTypeListMenu', methods.parseInt(item.typeId));
        }
        else if (item.teleportPos) {
            user.setVirtualWorld(0);
            user.teleportv(item.teleportPos);
        }
    });
};

menuList.showMazeOfficeTeleportMenu = function() {

    /*if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }*/

    UIMenu.Menu.Create(`Maze`, `~b~Maze Bank Лифт`);

    UIMenu.Menu.AddMenuItem("Гараж", "", {teleportPos: new mp.Vector3(-84.9765, -818.7122, 35.02804)});
    UIMenu.Menu.AddMenuItem("Офис", "", {teleportPos: new mp.Vector3(-77.77799, -829.6542, 242.3859)});
    UIMenu.Menu.AddMenuItem("Улица", "", {teleportPos: new mp.Vector3(-66.66476, -802.0474, 43.22729)});
    UIMenu.Menu.AddMenuItem("Крыша", "", {teleportPos: new mp.Vector3(-67.13605, -821.9, 320.2874)});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.teleportPos)
            user.teleportv(item.teleportPos);
    });
};

menuList.showBuilder3TeleportMenu = function() {

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create(`Лифт`, `~b~Лифт`);

    UIMenu.Menu.AddMenuItem("1 уровень", "", {teleportPos: new mp.Vector3(-158.3161, -940.3564, 29.07765)});
    UIMenu.Menu.AddMenuItem("2 уровень", "", {teleportPos: new mp.Vector3(-154.6761, -941.7026, 113.1366)});
    UIMenu.Menu.AddMenuItem("3 уровень", "", {teleportPos: new mp.Vector3(-154.7566, -941.5623, 268.1352)});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.teleportPos)
            user.teleportv(item.teleportPos);
    });
};

menuList.showBuilder4TeleportMenu = function() {

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create(`Лифт`, `~b~Лифт`);

    UIMenu.Menu.AddMenuItem("1 уровень", "", {doName: new mp.Vector3(-159.6244, -944.085, 29.07765)});
    UIMenu.Menu.AddMenuItem("2 уровень", "", {doName: new mp.Vector3(-155.9965, -945.4241, 113.1366)});
    UIMenu.Menu.AddMenuItem("3 уровень", "", {doName: new mp.Vector3(-156.1506, -945.3331, 268.1352)});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.teleportPos)
            user.teleportv(item.teleportPos);
    });
};

menuList.showCasinoLiftTeleportMenu = function() {

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create(`Casino`, `~b~Лифт`);

    UIMenu.Menu.AddMenuItem("Улица", "", {teleportPos: new mp.Vector3(935.5374755859375, 46.44008255004883, 80.09577178955078)});
    UIMenu.Menu.AddMenuItem("Казино", "", {teleportPos: new mp.Vector3(1089.85009765625, 206.42514038085938, -49.99974822998047)});
    UIMenu.Menu.AddMenuItem("Квартиры", "", {teleportPos: new mp.Vector3(2518.663330078125, -259.46478271484375, -40.122894287109375)});
    UIMenu.Menu.AddMenuItem("Балкон", "", {teleportPos: new mp.Vector3(964.3539428710938, 58.81953048706055, 111.5530014038086)});
    UIMenu.Menu.AddMenuItem("Крыша", "", {teleportPos: new mp.Vector3(972.0299072265625, 52.14411163330078, 119.24087524414062)});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.teleportPos)
            user.teleportv(item.teleportPos);
    });
};

menuList.showFibOfficeTeleportMenu = function() {

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create(`Fib`, `~b~Лифт`);

    UIMenu.Menu.AddMenuItem("Гараж", "", {teleportPos: new mp.Vector3(122.9873, -741.1865, 32.13323)});
    UIMenu.Menu.AddMenuItem("1 этаж", "", {teleportPos: new mp.Vector3(136.2213, -761.6816, 44.75201)});
    UIMenu.Menu.AddMenuItem("49 этаж", "", {teleportPos: new mp.Vector3(136.2213, -761.6816, 241.152)});
    UIMenu.Menu.AddMenuItem("52 этаж", "", {teleportPos: new mp.Vector3(114.9807, -741.8279, 257.1521)});
    UIMenu.Menu.AddMenuItem("Крыша", "", {teleportPos: new mp.Vector3(141.4099, -735.3376, 261.8516)});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.teleportPos)
            user.teleportv(item.teleportPos);
    });
};

menuList.showGarage1TeleportMenu = function() {

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create(`Гараж`, `~b~Лифт`);

    UIMenu.Menu.AddMenuItem("Уровень A", "", {teleportPos: new mp.Vector3(-852.534912109375, 284.400146484375, 32.934879302978516)});
    UIMenu.Menu.AddMenuItem("Уровень B", "", {teleportPos: new mp.Vector3(-852.5341186523438, 284.3998718261719, 27.59111976623535)});
    UIMenu.Menu.AddMenuItem("Уровень C", "", {teleportPos: new mp.Vector3(-852.533935546875, 284.3995056152344, 22.23737335205078)});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.teleportPos)
            user.teleportVehV(item.teleportPos);
    });
};

menuList.showGarage2TeleportMenu = function() {

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create(`Гараж`, `~b~Лифт`);

    UIMenu.Menu.AddMenuItem("Уровень A", "", {teleportPos: new mp.Vector3(-812.2706909179688, 313.9342346191406, 32.92332458496094)});
    UIMenu.Menu.AddMenuItem("Уровень B", "", {teleportPos: new mp.Vector3(-812.27001953125, 313.9339294433594, 27.591726303100586)});
    UIMenu.Menu.AddMenuItem("Уровень C", "", {teleportPos: new mp.Vector3(-812.2694091796875, 313.9336242675781, 22.237457275390625)});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.teleportPos)
            user.teleportVehV(item.teleportPos);
    });
};

menuList.showGovOfficeTeleportMenu = function() {

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create(` `, `~b~Лифт`, 'gov', false, false, 'gov');

    UIMenu.Menu.AddMenuItem("Гараж", "", {teleportPos: new mp.Vector3(-1360.679, -471.8841, 30.59572)});
    UIMenu.Menu.AddMenuItem("Офис", "", {teleportPos: new mp.Vector3(-1395.997, -479.8439, 72.04215)});
    UIMenu.Menu.AddMenuItem("Улица", "", {teleportPos: new mp.Vector3(-1379.659, -499.748, 32.15739)});
    UIMenu.Menu.AddMenuItem("Крыша", "", {teleportPos: new mp.Vector3(-1369, -471.5994, 83.44699)});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.teleportPos)
            user.teleportv(item.teleportPos);
    });
};

menuList.showBusinessTypeListMenu = function(data1, data2, data3) {
    UIMenu.Menu.Create(` `, `~b~Бизнес центр`, '', false, false, 'arcadius');

    data1.forEach(function (item, i, arr) {
        let ownerName = item[1] == '' ? 'Государство' : item[1];

        let menuItem = {};
        menuItem.bId = item[0];
        menuItem.interiorId = data3[i][1][0];
        menuItem.scFont = data3[i][1][1];
        menuItem.scColor = data3[i][1][2];
        menuItem.scAlpha = data3[i][1][3];
        menuItem.bName = data2[i][1];

        UIMenu.Menu.AddMenuItem(`${data2[i][1]}`, `~b~Владелец: ~s~${ownerName}`, menuItem);
    });

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.bName)
        {
            business.setScaleformName(item.bName);
            business.setScaleformParams(item.scFont, item.scColor, item.scAlpha);
            business.loadInterior(item.interiorId, 500);
            user.setVirtualWorld(methods.parseInt(item.bId));
            user.teleport(business.BusinessOfficePos.x, business.BusinessOfficePos.y, business.BusinessOfficePos.z + 1);
        }
    });
};

menuList.showBusinessLogMenu = function(data) {
    try {

        UIMenu.Menu.Create(` `, `~b~Нажмите ~s~Enter~b~ чтобы прочитать`, '', false, false, 'arcadius');

        JSON.parse(data).forEach(function (item) {

            let dateTime = methods.unixTimeStampToDateTimeShort(item.timestamp);
            let mItem = {};

            mItem.desc = methods.replaceQuotes(item.product);
            mItem.id = item.id;
            mItem.datetime = dateTime;
            mItem.rp_datetime = item.rp_datetime;

            UIMenu.Menu.AddMenuItem(`~b~#${item.id}. ~s~${item.product.substring(0, 30)}...`, `~b~Дата:~s~ ${item.rp_datetime} / ~b~OOC: ~s~${dateTime}`, mItem, `${item.price}`);
        });

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add((item, index) => {
            if (item.desc)
                mp.game.ui.notifications.show(`~b~#${item.id}\n~c~ООС: ${item.datetime}\n~c~IC: ${item.rp_datetime}\n~s~${item.desc}`);
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showInvaderNewsMenu = function(data) {
    UIMenu.Menu.Create(`Invader`, `~b~Нажмите ~s~Enter~b~ чтобы выбрать`);

    JSON.parse(data).forEach(function (item) {

        let mItem = {};
        mItem.id = item.id;
        mItem.title = item.title;
        mItem.name = item.name;

        UIMenu.Menu.AddMenuItem(`~b~#${item.id}. ~s~${item.title}`, `~b~Автор:~s~ ${item.name}`, mItem);
    });

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.id && (user.isLeader() || user.isSubLeader() || user.isDepLeader()))
            menuList.showInvaderNewsDelMenu(item.id, item.title, item.name)
    });
};

menuList.showInvaderNewsDelMenu = function(id, title, name) {
    UIMenu.Menu.Create(`Invader`, `~b~Номер новости: ${id}`);

    UIMenu.Menu.AddMenuItem(`${title}`);
    UIMenu.Menu.AddMenuItem(`${name}`);
    UIMenu.Menu.AddMenuItem(`~r~Удалить новость`, "", {delete: true});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.delete)
            mp.events.callRemote('server:invader:delNews', id);
    });
};

menuList.showInvaderAdMenu = function(data) {
    UIMenu.Menu.Create(`Invader`, `~b~Нажмите ~s~Enter~b~ чтобы выбрать`);

    JSON.parse(data).forEach(function (item) {

        let mItem = {};
        mItem.id = item.id;
        mItem.title = item.title;
        mItem.name = item.name;
        mItem.phone = item.phone;

        UIMenu.Menu.AddMenuItem(`~b~#${item.id}. ~s~${item.title} [${item.phone}]`, `~b~Автор:~s~ ${item.name}`, mItem);
    });

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        if (item.id)
            menuList.showInvaderAdDelMenu(item.id, item.title, item.name, item.phone)
    });
};

menuList.showInvaderAdDelMenu = function(id, title, name, phone) {
    UIMenu.Menu.Create(`Invader`, `~b~Номер новости: ${id}`);

    UIMenu.Menu.AddMenuItem(`${title}`);
    UIMenu.Menu.AddMenuItem(`${name}`);
    UIMenu.Menu.AddMenuItem(`${phone}`);
    if (user.isLeader() || user.isSubLeader())
        UIMenu.Menu.AddMenuItem(`~r~Удалить объявление`, "", {delete: true});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.delete)
            mp.events.callRemote('server:invader:delAd', id);
    });
};

menuList.showInvaderAdTempMenu = function(data) {
    UIMenu.Menu.Create(`Invader`, `~b~Нажмите ~s~Enter~b~ чтобы выбрать`);

    JSON.parse(data).forEach(function (item) {

        let mItem = {};
        mItem.id = item.id;
        mItem.text = item.text;
        mItem.name = item.name;
        mItem.phone = item.phone;

        UIMenu.Menu.AddMenuItem(`~b~#${item.id}. ~s~${item.text.substring(0, 25)}`, `~b~Автор:~s~ ${item.name}`, mItem);
    });

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        if (item.id)
            menuList.showInvaderAdTempEditMenu(item.id, item.text, item.name, item.phone)
    });
};

menuList.showInvaderAdTempEditMenu = function(id, text, name, phone) {
    UIMenu.Menu.Create(`Invader`, `~b~Номер новости: ${id}`);

    let titleList = ['Разное', 'Покупка', 'Продажа', 'Услуга'];
    UIMenu.Menu.AddMenuItemList("Заголовок", titleList, "", {doName: 'title'});

    let title = 'Разное';

    let textTemp = text;

    UIMenu.Menu.AddMenuItem(`Редактировать текст`, "", {textEdit: true});
    UIMenu.Menu.AddMenuItem(`${name}`);
    UIMenu.Menu.AddMenuItem(`${phone}`);
    UIMenu.Menu.AddMenuItem(`~g~Опубликовать`, "", {save: true});
    if (user.isLeader() || user.isSubLeader())
        UIMenu.Menu.AddMenuItem(`~r~Удалить объявление`, "", {delete: true});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnList.Add((item, index) => {
        if (item.doName == 'title') {
            title = titleList[index];
        }
    });

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        if (item.textEdit)
        {
            textTemp = await UIMenu.Menu.GetUserInput("Введите текст", methods.replaceAll(methods.replaceAll(textTemp, '\'', '`'), '"', '`'), 200);
            mp.game.ui.notifications.show("~b~Вы отредактировали текст\n~s~" + textTemp);
        }
        if (item.save) {
            UIMenu.Menu.HideMenu();
            mp.events.callRemote('server:invader:sendAd', id, title, name, textTemp, phone);
        }
        if (item.delete) {
            UIMenu.Menu.HideMenu();
            mp.events.callRemote('server:invader:delAdT', id);
        }
    });
};

menuList.showBusinessMenu = async function(data) {

    let bankTarif = 0;
    if (data.get('bank_id') > 0)
        bankTarif = await business.getPrice(data.get('bank_id'));

    let nalog = await coffer.getTaxBusiness();

    UIMenu.Menu.Create(` `, `~b~Владелец: ~s~${(data.get('user_id') < 1 ? "Государство" : data.get('user_name'))}`, '', false, false, 'arcadius');

    let nalogOffset = bankTarif;
    /*if (data.get('type') === 1) //TODO
        nalogOffset += 25;*/

    nalog = nalog + nalogOffset;

    UIMenu.Menu.AddMenuItem("~b~Название: ~s~", "", {}, `${data.get('name')}`);
    UIMenu.Menu.AddMenuItem("~b~Налог на прибыль: ~s~", 'Гос. налог + налог банка', {}, `${nalog}%`);

    if (user.getCache('id') == data.get('user_id')) {

        UIMenu.Menu.AddMenuItem("~b~Банк: ", "", {}, `~g~${methods.moneyFormat(data.get('bank'))}`);
        if (data.get('bank_tax') > 0)
            UIMenu.Menu.AddMenuItem("~b~Продукты: ", "", {}, `~g~${methods.moneyFormat(data.get('bank_tax'))}`);
        else
            UIMenu.Menu.AddMenuItem("~b~Продукты: ", "", {}, `~r~${methods.moneyFormat(data.get('bank_tax'))}`);
        UIMenu.Menu.AddMenuItem("Настройка бизнеса", "", {doName: 'settings'});
        UIMenu.Menu.AddMenuItem("Список транзакций", "", {doName: 'log'});
        UIMenu.Menu.AddMenuItem("Положить средства", "", {doName: 'addMoney'});
        UIMenu.Menu.AddMenuItem("Снять средства", "", {doName: 'removeMoney'});
        UIMenu.Menu.AddMenuItem("Пополнить бюджет продуктов", 'Бюджет для продуктов бизнеса', {doName: 'addMoneyTax'});
        UIMenu.Menu.AddMenuItem("~y~Что такое продукты?", "", {doName: 'ask'});
    }
    else if (data.get('user_id') == 0) {
        if (data.get('price') < 1)
            UIMenu.Menu.AddMenuItem("~y~На реконструкции, скоро будет доступен");
        else
            UIMenu.Menu.AddMenuItem("~g~Купить", `Цена: ~g~${methods.moneyFormat(data.get('price'))}`, {doName: 'buy'});
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();

        if (item.doName == 'buy') {
            setTimeout(quest.business, 10000);
            mp.events.callRemote('server:business:buy', data.get('id'));
        }
        if (item.doName == 'ask') {
            ui.showDialog('У продуктов есть свой отдельный счет, если он равен меньше 1$, то бизнес перестает функционировать и нести прибыль. Достаточно пополнять счет продуктов, чтобы бизнес функционировал. Цена каждого продукта уникальна, она равна минимальной стоимости наценки на товар. Поэтому если вы ставите цену на товар в 100%, то ваш бизнес будет работать в ноль. Если у бизнеса нет возможности ставить наценку, то текущая цена на продукт делённая на два.')
        }
        if (item.doName == 'settings') {
            menuList.showBusinessSettingsMenu(data);
        }
        if (item.doName == 'log') {
            mp.events.callRemote('server:business:log', data.get('id'));
        }
        if (item.doName == 'addMoneyTax') {
            try {
                if (data.get('bank_id') == 0) {
                    mp.game.ui.notifications.show(`~r~Ваш бизнес не привязан ни к какому банку`);
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

                if (money >= 10000)
                    quest.business(false, -1, 2);

                business.removeMoney(data.get('id'), money, 'Внутренний перевод на счёт продуктов');
                setTimeout(function () {
                    business.addMoneyTax(data.get('id'), money);
                    business.save(data.get('id'));
                    mp.game.ui.notifications.show(`~b~Вы положили деньги на счет продуктов`);
                }, 500);
            }
            catch (e) {
                methods.debug(e);
            }
        }
        if (item.doName == 'addMoney') {
            try {

                if (user.getCache('bank_card') < 1) {
                    mp.game.ui.notifications.show(`~r~У Вас нет банковской карты`);
                    return;
                }
                let money = await UIMenu.Menu.GetUserInput("Сумма", "", 8);
                money = methods.parseFloat(money);
                if (money > user.getBankMoney()) {
                    mp.game.ui.notifications.show(`~r~У Вас нет столько денег на вашей карте`);
                    return;
                }
                if (money < 1) {
                    mp.game.ui.notifications.show(`~r~Нельзя положить меньше 1$`);
                    return;
                }
                business.addMoney(data.get('id'), money, 'Зачиление со счета ' + methods.bankFormat(user.getCache('bank_card')));
                user.removeBankMoney(money, 'Зачиление на счет бизнеса ' + data.get('name'));
                business.save(data.get('id'));
                mp.game.ui.notifications.show(`~b~Вы положили деньги на счет бизнеса`);
            }
            catch (e) {
                methods.debug(e);
            }
        }
        if (item.doName == 'removeMoney') {

            if (user.getCache('bank_card') < 1) {
                mp.game.ui.notifications.show(`~r~У Вас нет банковской карты`);
                return;
            }
            if (data.get('bank_id') == 0) {
                mp.game.ui.notifications.show(`~r~Ваш бизнес не привязан ни к какому банку`);
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

            business.removeMoney(data.get('id'), money, 'Вывод средств на карту ' + methods.bankFormat(user.getCache('bank_card')));
            business.save(data.get('id'));
            user.addBankMoney(money * (100 - nalog) / 100, 'Вывод со счета бизнеса ' + data.get('name'));
            coffer.addMoney(1, money * nalog / 100);
            mp.game.ui.notifications.show(`~b~Вы сняли ~s~${methods.moneyFormat(money * (100 - nalog) / 100)} ~b~со счёта с учётом налога`);
            mp.game.ui.notifications.show(`~b~${bankTarif}% от суммы отправлен банку который вас обслуживает`);
        }
    });
};

menuList.showBusinessSettingsMenu = async function(data) {

    let tarif1 = await business.getPrice(1);
    let tarif2 = await business.getPrice(2);
    let tarif3 = await business.getPrice(3);
    let tarif4 = await business.getPrice(4);

    let priceBankList = ["1%", "2%", "3%", "4%", "5%"];

    let bankList = ["~r~Нет банка", `Maze Bank (${tarif1}%)`, `Pacific Bank (${tarif2}%)`, `Fleeca Bank (${tarif3}%)`, `Blaine Bank (${tarif4}%)`];

    if (data.get('bank_score') > 0)
        bankList = [`Maze Bank (${tarif1}%)`, `Pacific Bank (${tarif2}%)`, `Fleeca Bank (${tarif3}%)`, `Blaine Bank (${tarif4}%)`];

    let fontList = ["ChaletLondon", "HouseScript", "Monospace", "CharletComprime", "Pricedown"];
    let colorList = ["Black", "Red", "Pink", "Purple", "Deep Purple", "Indigo", "Blue", "Light Blue", "Cyan", "Teal", "Green", "Light Green", "Amber", "Orange", "Deep Orange", "Brown", "Blue Grey", "Grey"];
    let interiorList = ["Executive Rich", "Executive Cool", "Executive Contrast", "Old Spice Classical", "Old Spice Vintage", "Old Spice Warms", "Power Broker Conservative", "Power Broker Polished", "Power Broker Ice"];

    let nalog = await coffer.getTaxBusiness();

    UIMenu.Menu.Create(` `, `~b~Панель вашего бизнеса`, '', false, false, 'arcadius');

    let nalogOffset = 0;
    /*if (data.get('type') === 1) //TODO
        nalogOffset += 25;*/
    /*if (data.get('type') == 11)
        nalogOffset += 20;*/

    nalog = nalog + nalogOffset;

    let bankNumberStr = (data.get('bank_score') == 0 ? '~r~Отсуствует' : methods.bankFormat(data.get('bank_score')));

    UIMenu.Menu.AddMenuItem("~b~Название ~s~", "", {}, data.get('name'));
    UIMenu.Menu.AddMenuItem("~b~Налог на прибыль ~s~", 'Гос. налог + банк', {}, `${nalog}%`);
    UIMenu.Menu.AddMenuItem("~b~Ваш счёт ~s~", "", {}, `${bankNumberStr}`);

    let idxBank = data.get('bank_id');
    if (data.get('bank_id') > 0)
        idxBank = data.get('bank_id') - 1;
    UIMenu.Menu.AddMenuItemList("~b~Ваш банк", bankList, 'Стоимость перехода: ~g~$4,990', {doName: 'setBank'}, idxBank);

    UIMenu.Menu.AddMenuItemList("~b~Шрифт на табличке", fontList, 'Стоимость: ~g~$9,990~br~~s~Нажмите ~g~Enter~s~ чтобы купить', {doName: 'setFont'}, data.get('sc_font'));
    UIMenu.Menu.AddMenuItemList("~b~Цвет на табличке", colorList, 'Стоимость: ~g~$1,990~br~~s~Нажмите ~g~Enter~s~ чтобы купить', {doName: 'setColor'}, data.get('sc_color'));
    UIMenu.Menu.AddMenuItemList("~b~Прозрачность", ['Нет', 'Да'], 'Стоимость: ~g~$990~br~~s~Нажмите ~g~Enter~s~ чтобы купить', {doName: 'setAlpha'}, data.get('sc_alpha'));
    UIMenu.Menu.AddMenuItemList("~b~Интерьер", interiorList, 'Стоимость: ~g~$100,000~br~~s~Нажмите ~g~Enter~s~ чтобы купить', {doName: 'setInterior'}, data.get('interior'));

    try {
        if (data.get('type') === 0) { //TODO
            UIMenu.Menu.AddMenuItemList("~b~Процент обслуживания", priceBankList, "", {doName: 'setPriceBank'}, data.get('price_product') - 1);
        }
        else {
            if (data.get('id') !== 70) {
                UIMenu.Menu.AddMenuItem("~b~Цена на весь товар","", {doName: 'setPrice'}, `${data.get('price_product') * 100}%`);
            }
        }
    }
    catch (e) {
        methods.debug(e);
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    let bankIndex = data.get('bank_id');
    if (data.get('bank_id') > 0)
        bankIndex--;
    let colorIndex = data.get('sc_color');
    let fontIndex = data.get('sc_font');
    let alphaIndex = data.get('sc_alpha');
    let intIndex = data.get('interior');

    UIMenu.Menu.OnList.Add((item, index) => {
        if (item.doName == 'setPriceBank') {
            let price = index + 1;
            business.setPrice(data.get('id'), price);
            mp.game.ui.notifications.show(`~b~Процент обслуживания равен: ~s~${priceBankList[index]}`);
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

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();

        if (item.doName == 'setPrice') {
            let price = methods.parseInt(await UIMenu.Menu.GetUserInput("Цена на весь товар", "", 3));

            if (price < 100) {
                mp.game.ui.notifications.show(`~b~Процент не может быть меньше 100`);
                return;
            }
            if (price > 300) {
                mp.game.ui.notifications.show(`~b~Процент не может быть больше 300`);
                return;
            }

            business.setPrice(data.get('id'), price / 100);
            mp.game.ui.notifications.show(`~b~Наценка на весь товар: ~s~${price}%`);
            return;
        }
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

            business.set(data.get('id'), 'interior', intIndex);
            coffer.addMoney(1, price);
            business.removeMoney(data.get('id'), price, 'Обновление интерьера');
            business.save(data.get('id'));

            business.loadInterior(intIndex);
            mp.game.ui.notifications.show(`~b~Ваш новый интерьер: ~s~${interiorList[intIndex]}`);
        }
    });
};

menuList.showMeriaMainMenu = function() {

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create(` `, `~b~Секретарь правительства`, 'gov', false, false, 'gov');

    if (user.getCache('work_lic') == '')
        UIMenu.Menu.AddMenuItem("Оформить WorkID", "", {doName: 'getWorkId'});

    if (user.getCache('reg_status') === 0) {
        if (user.getCache('online_time') < 169)
            UIMenu.Menu.AddMenuItem("Оформить регистрацию", 'Стоимость: ~g~Бесплатно', {doName: 'getRegisterFree'});
        else
            UIMenu.Menu.AddMenuItem("Оформить регистрацию", 'Стоимость: ~g~$1,000', {doName: 'getRegister'});
    }

    if (user.getCache('reg_status') === 1)
        UIMenu.Menu.AddMenuItem("Оформить гражданство", 'Стоимость: ~g~$10,000', {doName: 'getFullRegister'});

    UIMenu.Menu.AddMenuItem("Работа", "", {doName: 'showMeriaJobListMenu'});
    UIMenu.Menu.AddMenuItem("Лицензионный центр", "", {doName: 'showLicBuyMenu'});

    UIMenu.Menu.AddMenuItem("Имущество", "Операции с вашим имуществом", {doName: 'showMeriaSellHvbMenu'});
    UIMenu.Menu.AddMenuItem("Налоговый кабинет", "", {doName: 'showMeriaTaxMenu'});

    if (user.getCache('house_id') > 0)
        UIMenu.Menu.AddMenuItem("Подселение", "", {doName: 'showMeriaHousePeopleMenu'});

    UIMenu.Menu.AddMenuItem("Экономика штата", "", {doName: 'showMeriaInfoMenu'});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();

        if (item.doName == 'showMeriaSellHvbMenu')
            menuList.showMeriaSellHvbMenu(await coffer.getAllData());
        if (item.doName == 'showMeriaTaxMenu')
            menuList.showMeriaTaxMenu();
        if (item.doName == 'showMeriaInfoMenu')
            menuList.showMeriaInfoMenu(await coffer.getAllData());
        if (item.doName == 'showMeriaJobListMenu')
            menuList.showMeriaJobListMenu();
        if (item.doName == 'showMeriaHousePeopleMenu')
            menuList.showMazeBankHousePeopleMenu();
        if (item.doName == 'showLicBuyMenu')
            menuList.showLicBuyMenu();
        if (item.doName == 'getRegister') {
            if (user.getBankMoney() < 1000) {
                mp.game.ui.notifications.show("~r~У Вас недостаточно средств на банковском счету");
                return;
            }
            if (user.getCache('reg_status') > 0) {
                mp.game.ui.notifications.show("~r~Вам не нужна регистрация");
                return;
            }
            user.removeCashMoney(1000, 'Получение регистрации');
            user.set('reg_status', 1);
            mp.game.ui.notifications.show("~g~Поздравялем, вы получили регистрацию!");
            user.addHistory(0, 'Получил регистрацию');
            user.save();
        }
        if (item.doName == 'getRegisterFree') {
            if (user.getCache('reg_status') > 0) {
                mp.game.ui.notifications.show("~r~Вам не нужна регистрация");
                return;
            }
            user.set('reg_status', 1);
            mp.game.ui.notifications.show("~g~Поздравялем, вы получили регистрацию!");
            user.addHistory(0, 'Получил регистрацию');
            user.save();
        }
        if (item.doName == 'getFullRegister') {
            if (user.getCache('reg_status') > 1) {
                mp.game.ui.notifications.show("~r~У Вас уже есть гражданство");
                return;
            }
            if (user.getBankMoney() < 10000) {
                mp.game.ui.notifications.show("~r~У Вас недостаточно средств на банковском счету");
                return;
            }
            if (user.getCache('work_lvl') < 4) {
                mp.game.ui.notifications.show("~r~Рабочий стаж должен быть 4 уровня");
                return;
            }
            if (user.getCache('reg_status') < 1) {
                mp.game.ui.notifications.show("~r~Вам необходима регистрация");
                return;
            }
            user.removeCashMoney(10000, 'Получение гражданства');
            user.set('reg_status', 2);
            mp.game.ui.notifications.show("~g~Поздравялем, вы получили регистрацию!");
            user.addHistory(0, 'Получил гражданство');
            user.save();
        }
        if (item.doName == 'getWorkId') {

            if (user.getCache('work_lic') != '') {
                mp.game.ui.notifications.show("~r~У Вас уже есть WorkID");
                return;
            }
            if (user.getCache('reg_status') == 0) {
                mp.game.ui.notifications.show("~r~У Вас нет регистрации или гражданства");
                return;
            }
            try {
                user.set('work_lic', methods.getRandomWorkID());
                user.set('work_date', weather.getFullRpDate());
                mp.game.ui.notifications.show("~g~Поздравялем, вы получили WorkID!");
                user.addHistory(0, 'Получил WorkID');
                user.save();

                quest.role0();
                quest.standart();
            }
            catch (e) {
                methods.error(e);
            }
        }
    });
};

menuList.showMeriaTaxMenu = function() {

    user.updateCache().then(function () {
        UIMenu.Menu.Create(` `, `~b~Налоговый кабинет`, 'gov', false, false, 'gov');

        UIMenu.Menu.AddMenuItem("Оплатить налог по номеру счёта", "", {eventName: 'server:tax:payTax'});

        if (user.getCache('house_id') > 0) {
            UIMenu.Menu.AddMenuItem("Налог за дом", "", {itemId: user.getCache('house_id'), type: 0});
        }
        if (user.getCache('condo_id') > 0) {
            UIMenu.Menu.AddMenuItem("Налог за квартиру", "", {itemId: user.getCache('condo_id'), type: 5});
        }
        if (user.getCache('apartment_id') > 0) {
            UIMenu.Menu.AddMenuItem("Налог за апартаменты", "", {itemId: user.getCache('apartment_id'), type: 3});
        }
        if (user.getCache('business_id') > 0) {
            UIMenu.Menu.AddMenuItem("Налог за бизнес", "", {itemId: user.getCache('business_id'), type: 2});
        }
        if (user.getCache('stock_id') > 0) {
            UIMenu.Menu.AddMenuItem("Налог за склад", "", {itemId: user.getCache('stock_id'), type: 4});
        }
        if (user.getCache('yacht_id') > 0) {
            UIMenu.Menu.AddMenuItem("Налог за склад", "", {itemId: user.getCache('yacht_id'), type: 6});
        }

        for (let i = 1; i < 11; i++) {
            if (user.getCache('car_id' + i) > 0) {
                UIMenu.Menu.AddMenuItem("Налог за ТС #" + i, "", {itemId: user.getCache('car_id' + i), type: 1});
            }
        }

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            UIMenu.Menu.HideMenu();

            if (item.eventName) {
                let number = methods.parseInt(await UIMenu.Menu.GetUserInput("Счёт", "", 10));
                if (number == 0)
                    return;
                let sum = methods.parseInt(await UIMenu.Menu.GetUserInput("Сумма", "", 9));
                if (sum == 0)
                    return;
                mp.events.callRemote(item.eventName, 1, number, sum);
            }
            if (item.itemId) {
                menuList.showMeriaTaxInfoMenu(item.type, item.itemId);
            }
        });
    });
};

menuList.showMeriaTaxInfoMenu = async function(type, id) {

    let tax = 0;
    let taxLimit = 0;
    let taxDay = 0;
    let score = 0;
    let name = "";

    let taxPrice = 0.0007;

    if (type == 0)
    {
        let item = await houses.getData(id);
        taxDay = methods.parseInt((item.get('price') * taxPrice + 10)/*/ 7*/);
        tax = item.get("tax_money");
        taxLimit = methods.parseInt(item.get('price') * taxPrice + 10) * 21;
        score = item.get("tax_score");

        name = item.get("address") + " №" + item.get("number");
    }
    else if (type == 1)
    {
        let item = await vehicles.getData(id);
        taxDay = methods.parseInt((item.get('price') * taxPrice + 10)/*/ 7*/);
        tax = item.get("tax_money");
        taxLimit = methods.parseInt(item.get('price') * taxPrice + 10) * 21;
        score = item.get("tax_score");

        name = methods.getVehicleInfo(item.get('name')).display_name + " (" + item.get("number") + ")";
    }
    else if (type == 2)
    {
        let item = await business.getData(id);
        taxDay = methods.parseInt((item.get('price') * taxPrice + 10)/*/ 7*/);
        tax = item.get("tax_money");
        taxLimit = methods.parseInt(item.get('price') * taxPrice + 10) * 7;
        score = item.get("tax_score");

        name = item.get('name');
    }
    /*else if (type == 3)
    {
        let item = await Container.Data.GetAll(-100000 + methods.parseInt(id));
        taxDay = methods.parseInt((item.get('price') * taxPrice + 10)/ 7);
        tax = item.get("tax_money");
        taxLimit = methods.parseInt(item.get('price') * taxPrice + 10) * 21;
        score = item.get("tax_score");

        name = "Апартаменты №" + item.get('number');
    }
    else */if (type == 4)
    {
        let item = await stocks.getData(id);
        taxDay = methods.parseInt((item.get('price') * taxPrice + 10)/*/ 7*/);
        tax = item.get("tax_money");
        taxLimit = methods.parseInt(item.get('price') * taxPrice + 10) * 21;
        score = item.get("tax_score");

        name = "Склад №" + item.get('number');
    }
    else if (type == 5)
    {
        let item = await condos.getData(id);
        taxDay = methods.parseInt((item.get('price') * taxPrice + 10)/*/ 7*/);
        tax = item.get("tax_money");
        taxLimit = methods.parseInt(item.get('price') * taxPrice + 10) * 21;
        score = item.get("tax_score");

        name = item.get("address") + " №" + item.get("number");
    }
    else if (type == 6)
    {
        let item = await yachts.getData(id);
        taxDay = methods.parseInt((item.get('price') * taxPrice + 10)/*/ 7*/);
        tax = item.get("tax_money");
        taxLimit = methods.parseInt(item.get('price') * taxPrice + 10) * 21;
        score = item.get("tax_score");

        name = item.get("name") + " №" + item.get("id");
    }

    UIMenu.Menu.Create(` `, `~b~` + name, 'gov', false, false, 'gov');

    UIMenu.Menu.AddMenuItem(`~b~Счёт:~s~ ${score}`, "Уникальный счёт вашего имущества");
    UIMenu.Menu.AddMenuItem(`~b~Ваша задолженность:~s~ ~r~${(tax == 0 ? "~g~Отсутствует" : `${methods.moneyFormat(tax)}`)}`, `Ваш текущий долг, при достижении ~r~$${taxLimit}~s~ ваше имущество будет изъято`);
    //UIMenu.Menu.AddMenuItem(`~b~Ваша задолженность:~s~ ~r~${(tax == 0 ? "~g~Отсутствует" : `${methods.moneyFormat(tax)}`)}`);
    UIMenu.Menu.AddMenuItem(`~b~Налог в день (( ООС )):~s~ $${taxDay}`, "Индивидуальная налоговая ставка");
    UIMenu.Menu.AddMenuItem(`~b~Допустимый лимит:~s~ $${taxLimit}`, "Допустимый лимит до обнуления имущества");

    UIMenu.Menu.AddMenuItem("Оплатить наличкой", "", {payTaxType: 0});
    UIMenu.Menu.AddMenuItem("Оплатить картой", "", {payTaxType: 1});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();

        if (item.payTaxType >= 0) {
            let sum = methods.parseInt(await UIMenu.Menu.GetUserInput("Сумма", "", 9));
            if (sum == 0)
                return;

            if (item.payTaxType === 0 && user.getCashMoney() < sum) {
                mp.game.ui.notifications.show("~r~У Вас нет такой суммы на руках");
                return;
            }
            if (item.payTaxType === 1 && user.getBankMoney() < sum) {
                mp.game.ui.notifications.show("~r~У Вас нет такой суммы в банке");
                return;
            }

            mp.events.callRemote('server:tax:payTax', item.payTaxType , score, sum);
        }
    });
};

menuList.showLawyerOffersMenu = function(price, id, rpName) {

    UIMenu.Menu.Create('Юрист', `~b~${rpName}`);

    UIMenu.Menu.AddMenuItem("~g~Согласиться", `Цена: ~g~${methods.moneyFormat(price)}`, {eventName: 'server:user:lawyer:accept'});
    UIMenu.Menu.AddMenuItem("~r~Отказаться");

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.eventName)
            mp.events.callRemote(item.eventName, id);
    });
};

menuList.showLawyerHouseOffersMenu = function(buyerId, id) {

    UIMenu.Menu.Create('Юрист', `~b~Подселение`);

    UIMenu.Menu.AddMenuItem("~g~Согласиться", `Цена: ~g~$10,000`, {eventName: 'server:houses:lawyer:addUser'});
    UIMenu.Menu.AddMenuItem("~r~Отказаться");

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.eventName)
            mp.events.callRemote(item.eventName, id, buyerId);
    });
};

menuList.showAcceptClearWantedMenu = function(id, price) {

    UIMenu.Menu.Create('Мафия', `~b~Снять розыск`);

    UIMenu.Menu.AddMenuItem("~g~Согласиться", `Цена: ~g~${methods.moneyFormat(price)}`, {eventName: 'server:user:clearByMafia'});
    UIMenu.Menu.AddMenuItem("~r~Отказаться");

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.eventName)
            mp.events.callRemote(item.eventName, id, price);
    });
};

menuList.showMechanicAcceptFuelMenu = function(id, count, price) {

    UIMenu.Menu.Create('Механик', `~b~Заправка транспорта`);

    UIMenu.Menu.AddMenuItem("~g~Согласиться", `Количество:~g~${count}ед.~br~Цена: ~g~${methods.moneyFormat(price)}`, {eventName: 'server:mechanic:fuel:accept'});
    UIMenu.Menu.AddMenuItem("~r~Отказаться");

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.eventName)
            mp.events.callRemote(item.eventName, id, count, price);
    });
};

menuList.showMechanicAcceptFixMenu = function(id, price) {

    UIMenu.Menu.Create('Механик', `~b~Починка транспорта`);

    UIMenu.Menu.AddMenuItem("~g~Согласиться", `Цена: ~g~${methods.moneyFormat(price)}`, {eventName: 'server:mechanic:fix:accept'});
    UIMenu.Menu.AddMenuItem("~r~Отказаться");

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.eventName)
            mp.events.callRemote(item.eventName, id, price);
    });
};

menuList.showMechanicAcceptFlipMenu = function(id, price) {

    UIMenu.Menu.Create('Механик', `~b~Перевернуть транспорт`);

    UIMenu.Menu.AddMenuItem("~g~Согласиться", `Цена: ~g~${methods.moneyFormat(price)}~br~~s~Учтите, что надо находится рядом с транспортом или в нем`, {eventName: 'server:mechanic:flip:accept'});
    UIMenu.Menu.AddMenuItem("~r~Отказаться");

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.eventName)
            mp.events.callRemote(item.eventName, id, price);
    });
};

menuList.showMazeBankHousePeopleMenu = function() {
    //TODO BLACKOUT

    user.updateCache().then(function () {
        UIMenu.Menu.Create(` `, `~b~Жилищный вопрос`, 'gov', false, false, 'gov');

        if (user.getCache('house_id') > 0) {
            UIMenu.Menu.AddMenuItem("Подселить игрока в дом", 'Стоимость ~g~$10.000~s~~br~Необходимо ввести CARD ID игрока (Тот который в документах)', {eventName: 'server:houses:addUser'});
            UIMenu.Menu.AddMenuItem("Список жильцов", "", {eventName: 'server:houses:userList'});
            UIMenu.Menu.AddMenuItem("~y~Выселиться", "Стоимость ~g~$1.000", {eventName: 'server:houses:removeMe'});
        }

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            UIMenu.Menu.HideMenu();

            if (item.eventName == 'server:houses:addUser') {
                let playerId = methods.parseInt(await UIMenu.Menu.GetUserInput("ID Игрока", "", 9));
                if (playerId < 0) {
                    mp.game.ui.notifications.show("~r~ID Игркоа не может быть меньше нуля");
                    return;
                }
                mp.events.callRemote(item.eventName, playerId);
            }
            else if (item.eventName) {
                mp.events.callRemote(item.eventName);
            }
        });
    });
};

menuList.showMazeBankHousePeopleListMenu = function(data) {
    //TODO BLACKOUT
    UIMenu.Menu.Create(` `, `~b~Список жильцов`, 'gov', false, false, 'gov');

    data.forEach(function (item) {
        let userId = methods.parseInt(item[0]);
        if (userId === user.getCache('id'))
            UIMenu.Menu.AddMenuItem(`${item[1]}`);
        else
            UIMenu.Menu.AddMenuItem(`${item[1]}`, "", {eventParam: userId});
    });

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(item => {
        UIMenu.Menu.HideMenu();
        if (item.eventParam)
            menuList.showMazeBankHousePeopleListDoMenu(item.eventParam);
    });

};

menuList.showMazeBankHousePeopleListDoMenu = function(id) {

    UIMenu.Menu.Create(` `, `~b~` + id, 'gov', false, false, 'gov');

    UIMenu.Menu.AddMenuItem(`~r~Выселить по цене $1.000`, "", {eventName: 'server:house:removeId'});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(item => {
        UIMenu.Menu.HideMenu();
        if (item.eventName == 'server:house:removeId') {
            mp.events.callRemote(item.eventName, id);
        }
    });
};

menuList.showLicBuyMenu = function()
{
    UIMenu.Menu.Create(" ", "~b~Покупка лицензий", 'gov', false, false, 'gov');

    if (user.getCache('online_time') < 169) {

        UIMenu.Menu.AddMenuItem("Категория A", "Цена: ~g~$0.10", {doName: 'a_lic'});
        UIMenu.Menu.AddMenuItem("Категория B", "Цена: ~g~$0.10", {doName: 'b_lic'});
    }
    else {
        UIMenu.Menu.AddMenuItem("Категория A", "Цена: ~g~$99.90", {doName: 'a_lic'});
        UIMenu.Menu.AddMenuItem("Категория B", "Цена: ~g~$300", {doName: 'b_lic'});
    }
    UIMenu.Menu.AddMenuItem("Категория C", "Цена: ~g~$500", {doName: 'c_lic'});
    UIMenu.Menu.AddMenuItem("Водный транспорт", "Цена: ~g~$990", {doName: 'ship_lic'});
    UIMenu.Menu.AddMenuItem("Авиатранспорт", "Цена: ~g~$5000", {doName: 'air_lic'});
    UIMenu.Menu.AddMenuItem("Перевозка пассажиров", "Цена: ~g~$10,000", {doName: 'taxi_lic'});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (user.getCache('online_time') < 169) {
            if (item.doName == "a_lic")
                user.buyLicense('a_lic', 0.10);
            else if (item.doName == "b_lic")
                user.buyLicense('b_lic', 0.10);
        }
        else {
            if (item.doName == "a_lic")
                user.buyLicense('a_lic', 99.90);
            else if (item.doName == "b_lic")
                user.buyLicense('b_lic', 300);
        }
        if (item.doName == "c_lic")
            user.buyLicense('c_lic', 500);
        else if (item.doName == "air_lic")
            user.buyLicense('air_lic', 5000);
        else if (item.doName == "ship_lic")
            user.buyLicense('ship_lic', 990);
        else if (item.doName == "taxi_lic") {
            if (user.getCache('work_lvl') < 2) {
                mp.game.ui.notifications.show("~r~Вам необходим 2 уровень рабочего стажа");
                return;
            }
            user.buyLicense('taxi_lic', 10000);
        }
    });
};

menuList.showMeriaJobListMenu = function() {

    UIMenu.Menu.Create(` `, `~b~Трудовая биржа`, 'gov', false, false, 'gov');

    UIMenu.Menu.AddMenuItem("Садовник", "", {jobName: 1});
    UIMenu.Menu.AddMenuItem("Разнорабочий", "", {jobName: 2});

    UIMenu.Menu.AddMenuItem("Водитель автобуса-1", "Городской автобус", {jobName: 6});
    UIMenu.Menu.AddMenuItem("Водитель автобуса-2", "Трансферный автобус", {jobName: 7});
    UIMenu.Menu.AddMenuItem("Водитель автобуса-3", "Рейсовый автобус", {jobName: 8});
    
    UIMenu.Menu.AddMenuItem("Механик", "", {jobName: 5});
    //UIMenu.Menu.AddMenuItem("Священник", "", {jobName: 12});

    UIMenu.Menu.AddMenuItem("Фотограф", "", {jobName: 3});
    UIMenu.Menu.AddMenuItem("Почтальон", "", {jobName: 4});

    UIMenu.Menu.AddMenuItem("Инкассатор", "", {jobName: 10});

    /*UIMenu.Menu.AddMenuItem("Таксист", "Компания: ~y~DownTown Cab Co.").jobName = 9;

    UIMenu.Menu.AddMenuItem("Инкассатор", "Компания: ~y~Gruppe6").jobName = 10;
    UIMenu.Menu.AddMenuItem("Грузоперевозки").jobName = 11;*/

    UIMenu.Menu.AddMenuItem("~y~Уволиться с работы", "", {doName: 'uninvite'});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();

        if (item.doName == 'uninvite') {
            jobPoint.delete();
            builder.stop();
            tree.stop();
            bus.stop(false);
            photo.stop();
            gr6.stop();
            user.set('job', 0);
            mp.game.ui.notifications.show("~y~Вы уволились с работы");
        }
        if (item.jobName) {

            if (user.getCache('fraction_id') > 0) {
                mp.game.ui.notifications.show("~r~Вы состоите в гос фракции.");
                return;
            }

            if (user.getCache('work_lic').trim() === '') {
                mp.game.ui.notifications.show("~r~Для начала оформите Work ID");
                return;
            }

            if ((item.jobName === 6 || item.jobName === 7 || item.jobName === 8 || item.jobName === 12) && user.getCache('work_lvl') < 2) {
                mp.game.ui.notifications.show("~r~Вам необходим 2 уровень рабочего стажа");
                return;
            }

            if ((item.jobName === 6 || item.jobName === 7 || item.jobName === 8) && !user.getCache('taxi_lic')) {
                mp.game.ui.notifications.show("~r~Вам необходима лицензия на перевозку пассажиров");
                return;
            }

            if ((item.jobName === 3 || item.jobName === 4 || item.jobName === 5) && user.getCache('work_lvl') < 3) {
                mp.game.ui.notifications.show("~r~Вам необходим 3 уровень рабочего стажа");
                return;
            }

            if (item.jobName === 10 && (user.getCache('work_lvl') < 4 || !user.getCache('gun_lic'))) {
                mp.game.ui.notifications.show("~r~Вам необходим 4 уровень рабочего стажа и лицензия на ношение оружия");
                return;
            }

            if (item.jobName === 1) {
                chat.sendLocal(`!{${chat.clBlue}}Справка по работе Садовник`);
                chat.sendLocal(`Для начала Вам необходимо арендовать транспорт. Затем откройте меню транспорта и нажмите Получить задание, а далее думаю и так понятно.`);
                chat.sendLocal(`Чтобы найти работу садовника, откройте телефон (По стандарту кнопка O, далее откройте GPS и найдите там работу садовника).`);
            }
            if (item.jobName === 2) {
                chat.sendLocal(`!{${chat.clBlue}}Справка по работе Разнорабочий`);
                chat.sendLocal(`Для начала Вам необходимо арендовать транспорт. Затем откройте меню транспорта и нажмите Получить задание, а далее думаю и так понятно.`);
                chat.sendLocal(`Чтобы найти работу разнорабочего, откройте телефон (По стандарту кнопка O, далее откройте GPS и найдите там работу разнорабочего).`);
            }
            if (item.jobName === 3) {
                chat.sendLocal(`!{${chat.clBlue}}Справка по работе Фотограф`);
                chat.sendLocal(`Для начала Вам необходимо арендовать транспорт. Затем откройте меню транспорта и нажмите Получить задание, а далее думаю и так понятно.`);
                chat.sendLocal(`Чтобы найти работу фотографа, откройте телефон (По стандарту кнопка O, далее откройте GPS и найдите там работу фотографа).`);
            }
            if (item.jobName === 4) {
                chat.sendLocal(`!{${chat.clBlue}}Справка по работе Почтальон`);
                chat.sendLocal(`Для начала Вам необходимо арендовать транспорт. Затем откройте меню транспорта и нажмите Взять почту, а далее езжайте к !{${chat.clBlue}}любому !{${chat.clWhite}} дому или квартире и просто раскладывайте почту в тех местах, где нравится вам.`);
                chat.sendLocal(`Чтобы найти работу почтальона, откройте телефон (По стандарту кнопка O, далее откройте GPS и найдите там работу почтальона).`);
            }
            if (item.jobName === 6 || item.jobName === 7 || item.jobName === 8) {
                chat.sendLocal(`!{${chat.clBlue}}Справка по работе Водитель автобуса`);
                chat.sendLocal(`Для начала Вам необходимо арендовать транспорт. Затем откройте меню транспорта и нажмите Начать рейс.`);
            }
            if (item.jobName === 10) {
                chat.sendLocal(`!{${chat.clBlue}}Справка по работе Инкассатор`);
                chat.sendLocal(`Для начала Вам необходимо арендовать транспорт, далее найти напарника и работать, всё работает через меню транспорта.`);
            }
            if (item.jobName === 5) {
                chat.sendLocal(`!{${chat.clBlue}}Справка по работе Механик`);
                chat.sendLocal(`Для начала Вам необходимо арендовать транспорт, арендуйте транспорт и через М -> Транспорт и выполняйте заказы.`);
            }
            if (item.jobName === 12) {
                chat.sendLocal(`!{${chat.clBlue}}Справка по работе Священика`);
                chat.sendLocal(`Ваша возможности практически безграничны, а на некоторых можно и заработать. Например у вас в церкве доступно функционально женить и разводить людей. А еще вы можете делать РП смерть.`);
            }

            user.set('job', item.jobName);
            mp.game.ui.notifications.show("~g~Вы устроились на новую работу");
            quest.standart();
        }
    });
};

menuList.showMeriaInfoMenu = function(cofferData) {
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    try {
        UIMenu.Menu.Create(` `, `~b~Экономика штата`, 'gov', false, false, 'gov');

        UIMenu.Menu.AddMenuItem(`~b~Бюджет`, "", {}, `~g~${methods.moneyFormat(cofferData.get('cofferMoney'))}`);
        UIMenu.Menu.AddMenuItem(`~b~Пособие`, "", {}, `~g~${methods.moneyFormat(cofferData.get('cofferBenefit'))}`);
        UIMenu.Menu.AddMenuItem(`~b~Налог на зарплату`, "", {}, `${cofferData.get('cofferTaxPayDay')}%`);
        UIMenu.Menu.AddMenuItem(`~b~Налог на бизнес`, "", {}, `${cofferData.get('cofferTaxBusiness')}%`);
        UIMenu.Menu.AddMenuItem(`~b~Налог на имущество`, "", {}, `${cofferData.get('cofferTaxProperty')}%`);
        UIMenu.Menu.AddMenuItem(`~b~Промежуточный налог`, "", {}, `${cofferData.get('cofferTaxIntermediate')}%`);

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
        UIMenu.Menu.Draw();
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showMeriaSellHvbMenu = function(cofferData) {
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    user.updateCache().then(function () {
        UIMenu.Menu.Create(` `, `~b~Текущая налоговая ставка: ~s~${cofferData.get('cofferTaxIntermediate')}%`, 'gov', false, false, 'gov');

        if (user.getCache('house_id') > 0) {
            UIMenu.Menu.AddMenuItem("Продать дом", "Продать дом государству.~br~С учетом налога", {eventName: 'server:houses:sell'});
            UIMenu.Menu.AddMenuItem("~y~Продать дом игроку", "", {eventNameSell: 'server:houses:sellToPlayer'});
        }
        if (user.getCache('condo_id') > 0) {
            UIMenu.Menu.AddMenuItem("Продать квартиру", "Продать квартиру государству.~br~С учетом налога", {eventName: 'server:condo:sell'});
            UIMenu.Menu.AddMenuItem("~y~Продать квартиру игроку", "", {eventNameSell: 'server:condo:sellToPlayer'});
        }
        if (user.getCache('apartment_id') > 0) {
            UIMenu.Menu.AddMenuItem("Продать апартаменты", "Продать апартаменты государству.~br~С учетом налога", {eventName: 'server:apartments:sell'});
            UIMenu.Menu.AddMenuItem("~y~Продать апартаменты игроку", "", {eventNameSell: 'server:apartments:sellToPlayer'});
        }
        if (user.getCache('business_id') > 0) {
            UIMenu.Menu.AddMenuItem("Продать бизнес", "Продать бизнес государству.~br~С учетом налога", {eventName: 'server:business:sell'});
            UIMenu.Menu.AddMenuItem("~y~Продать бизнес игроку", "", {eventNameSell: 'server:business:sellToPlayer'});
        }
        if (user.getCache('stock_id') > 0) {
            UIMenu.Menu.AddMenuItem("Продать склад", "Продать склад государству.~br~С учетом налога", {eventName: 'server:stock:sell'});
            UIMenu.Menu.AddMenuItem("~y~Продать склад игроку", "", {eventNameSell: 'server:stock:sellToPlayer'});
        }
        if (user.getCache('yacht_id') > 0) {
            UIMenu.Menu.AddMenuItem("Продать яхту", "Продать яхту государству.~br~С учетом налога", {eventName: 'server:yachts:sell'});
            UIMenu.Menu.AddMenuItem("~y~Продать яхту игроку", "", {eventNameSell: 'server:yacht:sellToPlayer'});
        }

        UIMenu.Menu.AddMenuItem(`~b~Продать транспорт`, 'Открыть список ТС', {doName: 'veh'});

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            UIMenu.Menu.HideMenu();

            if (item.doName == 'veh') {
                menuList.showMeriaSellVehHvbMenu(cofferData);
            }
            if (item.eventName) {
                menuList.showMeriaAcceptSellMenu(item.eventName);
            }
            if (item.eventNameSellV) {
                if (Container.Data.HasLocally(mp.players.local.remoteId, "isSellTimeout"))
                {
                    mp.game.ui.notifications.show("~r~Таймаут 1 минута");
                    return;
                }

                let playerId = methods.parseInt(await UIMenu.Menu.GetUserInput("ID Игрока", "", 5));
                if (playerId < 0) {
                    mp.game.ui.notifications.show("~r~ID Игркоа не может быть меньше нуля");
                    return;
                }
                let sum = methods.parseFloat(await UIMenu.Menu.GetUserInput("Сумма", "", 12));
                if (sum < 0) {
                    mp.game.ui.notifications.show("~r~Сумма не может быть меньше нуля");
                    return;
                }

                mp.events.callRemote('server:car:sellToPlayer', playerId, sum, item.eventNameSellV);

                Container.Data.SetLocally(mp.players.local.remoteId, "isSellTimeout", true);

                setTimeout(function () {
                    Container.Data.ResetLocally(mp.players.local.remoteId, "isSellTimeout");
                }, 1000 * 60);
            }
            if (item.eventNameSell) {

                if (Container.Data.HasLocally(mp.players.local.remoteId, "isSellTimeout"))
                {
                    mp.game.ui.notifications.show("~r~Таймаут 1 минута");
                    return;
                }

                let playerId = methods.parseInt(await UIMenu.Menu.GetUserInput("ID Игрока", "", 5));
                if (playerId < 0) {
                    mp.game.ui.notifications.show("~r~ID Игркоа не может быть меньше нуля");
                    return;
                }
                let sum = methods.parseFloat(await UIMenu.Menu.GetUserInput("Сумма", "", 12));
                if (sum < 0) {
                    mp.game.ui.notifications.show("~r~Сумма не может быть меньше нуля");
                    return;
                }

                mp.events.callRemote(item.eventNameSell, playerId, sum);

                Container.Data.SetLocally(mp.players.local.remoteId, "isSellTimeout", true);

                setTimeout(function () {
                    Container.Data.ResetLocally(mp.players.local.remoteId, "isSellTimeout");
                }, 1000 * 60);
            }
        });
    });
};

menuList.showMeriaSellVehHvbMenu = async function(cofferData) {
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    let vehList = [];

    for (let i = 1; i < 11; i++) {
        try {
            if (user.getCache(`car_id${i}`) > 0) {
                let vehData = await vehicles.getData(user.getCache(`car_id${i}`));
                vehList.push(vehData);
            }
            else {
                vehList.push(null);
            }
        }
        catch (e) {

        }
    }

    let taxOffset = 0;

    user.updateCache().then(async function () {
        UIMenu.Menu.Create(` `, `~b~Текущая налоговая ставка: ~s~${cofferData.get('cofferTaxIntermediate')}%`, 'gov', false, false, 'gov');

        for (let i = 1; i < 11; i++) {
            try {
                if (user.getCache(`car_id${i}`) > 0) {
                    let vehData = vehList[i - 1];
                    UIMenu.Menu.AddMenuItem(`Продать ТС ${vehData.get('name')} (${vehData.get('number')})`, "Продать транспорт государству.~br~Налог: ~g~" + (cofferData.get('cofferTaxIntermediate') + taxOffset) + "%", {eventName: `server:car${i}:sell`});
                    UIMenu.Menu.AddMenuItem(`~y~Продать ТС ${vehData.get('name')} (${vehData.get('number')}) игроку`, "", {eventNameSellV: i});
                }
            }
            catch (e) {

            }
        }

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            UIMenu.Menu.HideMenu();
            if (item.eventName) {
                menuList.showMeriaAcceptSellMenu(item.eventName);
            }

            if (item.eventNameSellV) {
                if (Container.Data.HasLocally(mp.players.local.remoteId, "isSellTimeout"))
                {
                    mp.game.ui.notifications.show("~r~Таймаут 1 минута");
                    return;
                }

                let playerId = methods.parseInt(await UIMenu.Menu.GetUserInput("ID Игрока", "", 5));
                if (playerId < 0) {
                    mp.game.ui.notifications.show("~r~ID Игркоа не может быть меньше нуля");
                    return;
                }
                let sum = methods.parseFloat(await UIMenu.Menu.GetUserInput("Сумма", "", 12));
                if (sum < 0) {
                    mp.game.ui.notifications.show("~r~Сумма не может быть меньше нуля");
                    return;
                }

                mp.events.callRemote('server:car:sellToPlayer', playerId, sum, item.eventNameSellV);

                Container.Data.SetLocally(mp.players.local.remoteId, "isSellTimeout", true);

                setTimeout(function () {
                    Container.Data.ResetLocally(mp.players.local.remoteId, "isSellTimeout");
                }, 1000 * 60);
            }
            if (item.eventNameSell) {

                if (Container.Data.HasLocally(mp.players.local.remoteId, "isSellTimeout"))
                {
                    mp.game.ui.notifications.show("~r~Таймаут 1 минута");
                    return;
                }

                let playerId = methods.parseInt(await UIMenu.Menu.GetUserInput("ID Игрока", "", 5));
                if (playerId < 0) {
                    mp.game.ui.notifications.show("~r~ID Игркоа не может быть меньше нуля");
                    return;
                }
                let sum = methods.parseFloat(await UIMenu.Menu.GetUserInput("Сумма", "", 12));
                if (sum < 0) {
                    mp.game.ui.notifications.show("~r~Сумма не может быть меньше нуля");
                    return;
                }

                mp.events.callRemote(item.eventNameSell, playerId, sum);

                Container.Data.SetLocally(mp.players.local.remoteId, "isSellTimeout", true);

                setTimeout(function () {
                    Container.Data.ResetLocally(mp.players.local.remoteId, "isSellTimeout");
                }, 1000 * 60);
            }
        });
    });
};

menuList.showMeriaAcceptSellMenu = function(eventName) {
    UIMenu.Menu.Create(` `, `~b~Вы точно хотите продать?`, 'gov', false, false, 'gov');

    UIMenu.Menu.AddMenuItem("~y~Продать", "", {eventName: eventName});
    UIMenu.Menu.AddMenuItem("~r~Отменить", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.eventName)
            mp.events.callRemote(item.eventName);
    });
};

menuList.showHouseSellToPlayerMenu = function(houseId, name, sum, userId) {

    UIMenu.Menu.Create("Дом", "~b~" + name);

    UIMenu.Menu.AddMenuItem("Купить за ~g~" + methods.moneyFormat(sum), "", {doName: 'accept'});
    UIMenu.Menu.AddMenuItem("~r~Отменить", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName == "accept")
            mp.events.callRemote('server:houses:sellToPlayer:accept', houseId, sum, userId);
    });
};

menuList.showCarSellToPlayerMenu = function(houseId, name, sum, userId, slot) {
    UIMenu.Menu.Create("Транспорт", "~b~Купить " + name);

    UIMenu.Menu.AddMenuItem("Транспорт за ~g~" + methods.moneyFormat(sum), "", {doName: 'accept'});
    UIMenu.Menu.AddMenuItem("~r~Отменить", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName == "accept")
            mp.events.callRemote('server:car:sellToPlayer:accept', houseId, sum, userId, slot);
    });
};

menuList.showCondoSellToPlayerMenu = function(houseId, name, sum, userId) {
    UIMenu.Menu.Create("Квартира", "~b~" + name);

    UIMenu.Menu.AddMenuItem("Купить за ~g~" + methods.moneyFormat(sum), "", {doName: 'accept'});
    UIMenu.Menu.AddMenuItem("~r~Отменить", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName == "accept")
            mp.events.callRemote('server:condo:sellToPlayer:accept', houseId, sum, userId);
    });
};


menuList.showYachtSellToPlayerMenu = function(houseId, name, sum, userId) {
    UIMenu.Menu.Create("Яхта", "~b~" + name);

    UIMenu.Menu.AddMenuItem("Купить за ~g~" + methods.moneyFormat(sum), "", {doName: 'accept'});
    UIMenu.Menu.AddMenuItem("~r~Отменить", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName == "accept")
            mp.events.callRemote('server:yacht:sellToPlayer:accept', houseId, sum, userId);
    });
};

menuList.showApartSellToPlayerMenu = function(houseId, name, sum, userId) {

    UIMenu.Menu.Create("Апартаменты", "~b~" + name);

    UIMenu.Menu.AddMenuItem("Купить за ~g~" + methods.moneyFormat(sum), "", {doName: 'accept'});
    UIMenu.Menu.AddMenuItem("~r~Отменить", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName == "accept")
            mp.events.callRemote('server:apartments:sellToPlayer:accept', houseId, sum, userId);
    });
};

menuList.showYachtSellToPlayerMenu = function(houseId, name, sum, userId) {
    UIMenu.Menu.Create("Яхта", "~b~" + name);

    UIMenu.Menu.AddMenuItem("Купить за ~g~" + methods.moneyFormat(sum), "", {doName: 'accept'});
    UIMenu.Menu.AddMenuItem("~r~Отменить", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName == "accept")
            mp.events.callRemote('server:yacht:sellToPlayer:accept', houseId, sum, userId);
    });
};

menuList.showStockSellToPlayerMenu = function(houseId, name, sum, userId) {
    UIMenu.Menu.Create("Склад", "~b~" + name);

    UIMenu.Menu.AddMenuItem("Купить за ~g~" + methods.moneyFormat(sum), "", {doName: 'accept'});
    UIMenu.Menu.AddMenuItem("~r~Отменить", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName == "accept")
            mp.events.callRemote('server:stock:sellToPlayer:accept', houseId, sum, userId);
    });
};

menuList.showBusinessSellToPlayerMenu = function(houseId, name, sum, userId) {
    UIMenu.Menu.Create("Бизнес", "~b~" + name);

    UIMenu.Menu.AddMenuItem("Купить за ~g~" + methods.moneyFormat(sum), "", {doName: 'accept'});
    UIMenu.Menu.AddMenuItem("~r~Отменить", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName == "accept")
            mp.events.callRemote('server:business:sellToPlayer:accept', houseId, sum, userId);
    });
};

menuList.showMainMenu = function() {

    UIMenu.Menu.Create('Меню', 'Главное меню', 'showMainMenu');
    if (methods.isBlockKeys()) {
        UIMenu.Menu.AddMenuItem("~y~Задать вопрос", "", {doName: "sendAsk"});
        UIMenu.Menu.AddMenuItem("~r~Жалоба", "", {doName: "sendReport"});
    }
    else {
        UIMenu.Menu.AddMenuItem("Персонаж", "", {doName: "showPlayerMenu"});
        UIMenu.Menu.AddMenuItem("Транспорт", "", {eventName: "server:showVehMenu"});
        UIMenu.Menu.AddMenuItem("Помощь", "", {doName: "showHelpMenu"});
        UIMenu.Menu.AddMenuItem("Настройки", "", {doName: "showSettingsMenu"});
        UIMenu.Menu.AddMenuItem("Список квестов", "", {doName: "showQuestMenu"});
        UIMenu.Menu.AddMenuItem("~b~Чит-код", "", {doName: "enterPromocode"});
        UIMenu.Menu.AddMenuItem("~y~Задать вопрос", "", {doName: "sendAsk"});
        UIMenu.Menu.AddMenuItem("~r~Жалоба", "", {doName: "sendReport"});
    }
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item) => {
        UIMenu.Menu.HideMenu();

        if (item.doName == 'enterPromocode') {
            let promocode = await UIMenu.Menu.GetUserInput("Введите промокод", "", 128);
            if (promocode == '') return;
            mp.events.callRemote("server:activatePromocode", promocode);
        }
        if (item.doName == 'sendReport') {
            let text = await UIMenu.Menu.GetUserInput("Опишите жалобу", "", 300);
            if (text !== '' && text !== undefined)
                mp.events.callRemote('server:sendReport', text);
        }
        if (item.doName == 'sendAsk') {
            let text = await UIMenu.Menu.GetUserInput("Задайте вопрос", "", 300);
            if (text !== '' && text !== undefined)
                mp.events.callRemote('server:sendAsk', text);
        }
        if (item.doName == 'showPlayerMenu')
            menuList.showPlayerMenu();
        if (item.doName == 'showSettingsMenu')
            menuList.showSettingsMenu();
        if (item.doName == 'showQuestMenu')
            menuList.showQuestMenu();
        if (item.doName == 'showHelpMenu')
            menuList.showHelpMenu();
        if (item.eventName)
            mp.events.callRemote(item.eventName);
    });
};

menuList.showPlayerMenu = function() {
    try {
        UIMenu.Menu.Create(`Персонаж`, `~b~Меню вашего персонажа`);

        UIMenu.Menu.AddMenuItem("Статистика", "", {doName: 'showPlayerStatsMenu'});

        let list = [];
        if (user.getSex() === 1) {
            enums.clopsetFemale.forEach(item => {
                list.push(item[0]);
            })
        }
        else {
            enums.clopsetMale.forEach(item => {
                list.push(item[0]);
            })
        }

        let clipsetIdx = 0;
        if (user.getCache('clipset') !== '')
            clipsetIdx = list.indexOf(user.getCache('clipset'));
        if (clipsetIdx <= 0)
            clipsetIdx = 0;

        UIMenu.Menu.AddMenuItemList("Походка", list, "", {doName: 'clipset'}, clipsetIdx);

        UIMenu.Menu.AddMenuItem("Посмотреть документы", "", {doName: 'showPlayerDoсMenu'});
        UIMenu.Menu.AddMenuItem("Анимации", "", {doName: 'showAnimationTypeListMenu'});
        //UIMenu.Menu.AddMenuItem("~b~История персонажа").doName = 'showPlayerHistoryMenu';

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnList.Add((item, index) => {
            if (item.doName === 'clipset') {

                if (user.getSex() === 1) {
                    user.set('clipset', enums.clopsetFemale[index][1]);
                    user.setClipset(enums.clopsetFemale[index][1]);
                }
                else {
                    user.set('clipset', enums.clopsetMale[index][1]);
                    user.setClipset(enums.clopsetMale[index][1]);
                }
                mp.game.ui.notifications.show('~b~Настройки были сохранены');
            }
        });

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            if (item.doName == 'showPlayerStatsMenu')
                menuList.showPlayerStatsMenu();
            else if (item.doName == 'showAnimationTypeListMenu')
                menuList.showAnimationTypeListMenu();
            else if (item.doName == 'showPlayerHistoryMenu')
                mp.events.callRemote('server:user:showPlayerHistory');
            else if (item.doName == 'showPlayerDoсMenu')
                menuList.showPlayerDocMenu(mp.players.local.remoteId);
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showHelpMenu = function() {

    UIMenu.Menu.Create(`Справка`, `~b~Ответы на ваши вопросы`);

    let mItem = {};
    mItem.textTitle = 'С чего начать?';
    mItem.text = 'Рекомендуем выполнить вам начальный квест, который можно взять у npc на спавне, в нем вы получите минимальные знания и ресурсы.';

    UIMenu.Menu.AddMenuItem("С чего начать?", "", mItem);

    mItem = {};
    mItem.textTitle = 'Лицензии';
    mItem.text = 'Лицензии на вождение какого либо транспорта получаются в здании правительства. Лицензии на рыболовство/бизнес получаются исключительно у сотрудников правительства. Лицензию на оружие вы можете приобрести у сотрудников полицейского и шериф департамента.';
    UIMenu.Menu.AddMenuItem("Где получить все лицензии?", "", mItem);

    mItem = {};
    mItem.textTitle = 'Зарплатный счет';
    mItem.text = 'Зарплата приходит на ваш зарплатный счет, для этого необходимо открыть приложение вашего банка на телефоне и перевести нужную сумму денег на вашу карту.';
    UIMenu.Menu.AddMenuItem("Где моя зарплата?", "", mItem);

    mItem = {};
    mItem.textTitle = 'Система рабочего стажа.';
    mItem.text = 'Данная система предназначена для того, чтобы вы могли устраиваться в перспективе на работу получше. Она растет, если вы работаете.';
    UIMenu.Menu.AddMenuItem("Система рабочего стажа.", "", mItem);

    mItem = {};
    mItem.textTitle = 'Система репутации.';
    mItem.text = 'Не нарушайте закон, работайте на обычных работах и ваша репутация будет повышаться. Если будете нарушать закон, то соответственно понижаться. Благодаря репутации у вас есть выбор, идти в гос. организации или криминал.';
    UIMenu.Menu.AddMenuItem("Система репутации.", "", mItem);

    mItem = {};
    mItem.textTitle = 'Организация';
    mItem.text = 'Для вступления в организацию следите за новостями, лидеры и их замы частенько объявляют наборы с соответствующими критериями.';
    UIMenu.Menu.AddMenuItem("Как вступить в организацию?", "", mItem);

    mItem = {};
    mItem.textTitle = 'Криминальный путь';
    mItem.text = 'Для начала вам необходимо пройти квествовую линию у Ламара. Он стоит в гетто и отмечен на миникарте';
    UIMenu.Menu.AddMenuItem("С чего начать криминальный путь?", "", mItem);

    mItem = {};
    mItem.textTitle = 'Криминал';
    mItem.text = 'Весь криминал игроки создают сами, мы создали интересный конструктор, с минимальными ограничениями. И добавив к этому еще различные роды деятельности, от каптов до ограблений';
    UIMenu.Menu.AddMenuItem("Как работает криминал?", "", mItem);

    mItem = {};
    mItem.textTitle = 'Своя организация';
    mItem.text = 'Для начала вам необходимо иметь низкую репутацию, далее необходимо иметь достаточную сумму в e-coins вы сможете создать свою организацию в консоли телефона через команду ecorp. Учтите, что слоты фракций на сервере ограничены';
    UIMenu.Menu.AddMenuItem("Как создать свою организацию?", "", mItem);
    
    /*mItem = UIMenu.Menu.AddMenuItem("Где мой прицел?");
    mItem.textTitle = 'Навык оружия';
    mItem.text = 'Для того, чтобы появился прицел, необходимо владеть 100% навыком оружия';*/

    mItem = {};
    mItem.textTitle = 'Навык оружия';
    mItem.text = 'Чтобы стрелять из транспорта, необходимо прокачать навык владения оружием на 100% или работать в полиции';
    UIMenu.Menu.AddMenuItem("Как стрелять из машины?", "", mItem);

    mItem = {};
    mItem.textTitle = 'Штрафстоянка';
    mItem.text = 'Ваш транспорт может попасть на штрафстоянку, поэтому паркуйтесь по правилам дорожного кодекса';
    UIMenu.Menu.AddMenuItem("Штрафстоянка", "", mItem);

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        if (item.textTitle) {
            UIMenu.Menu.HideMenu();
            ui.showDialog(item.text, item.textTitle);
        }
    });
};

menuList.showQuestMenu = function() {

    UIMenu.Menu.Create(`Задания`, `~b~Ваши квестовые линии`);

    quest.getQuestAllNames().forEach(item => {
        if (!quest.getQuestCanSee(item))
            return;
        UIMenu.Menu.AddMenuItem(quest.getQuestName(item), "", {qName: item}, '', '', user.getQuestCount(item) === quest.getQuestLineMax(item) ? 'star' : '');
    });

    UIMenu.Menu.AddMenuItem(`~b~Справка`, "", {ask: true});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.qName)
            menuList.showQuestListMenu(item.qName);
        if (item.ask)
            ui.showDialog('В случае, если квест не выполнился автоматически, приезжайте к боту, который выдает вам этот квест и завершите его там через кнопку получить задание');
    });
};

menuList.showQuestListMenu = function(name) {

    UIMenu.Menu.Create(`Задания`, `~b~${quest.getQuestName(name)}`);

    /*let mItem = UIMenu.Menu.AddMenuItem(`~g~Получить местоположение бота`);
    mItem.posX = quest.getQuestPos(name).x;
    mItem.posY = quest.getQuestPos(name).y;*/

    for (let i = 0; i < quest.getQuestLineMax(name); i++) {

        let idx = -1;
        if(user.getQuestCount(name) >= i)
            idx = i;
        UIMenu.Menu.AddMenuItem(`${user.getQuestCount(name) >= i ? '' : '~c~'}${quest.getQuestLineName(name, i)}`, '', {idx: idx}, '', '', user.getQuestCount(name) > i ? 'star' : '');
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {

        if (item.idx >= 0) {
            mp.game.ui.notifications.show(`~b~${quest.getQuestLineName(name, item.idx)}\n~s~${quest.getQuestLineInfo(name, item.idx)}\n~b~Награда: ~s~${quest.getQuestLinePrize(name, item.idx)}`);
        }
        if (item.posX) {
            user.setWaypoint(item.posX, item.posY);
        }
    });
};

menuList.showSettingsMenu = function() {

    UIMenu.Menu.Create(`Настройки`, `~b~Персональные настройки`);

    UIMenu.Menu.AddMenuItem("~y~Пофиксить кастомизацию", "", {doName: "fixCustom"});
    UIMenu.Menu.AddMenuItem("~y~Вкл. / Выкл. доп. прогрузку моделей", "~r~Возможно слегка повлияет на FPS", {doName: "loadAllModels"});

    UIMenu.Menu.AddMenuItem("Интерфейс", "", {doName: "showSettingsHudMenu"});
    UIMenu.Menu.AddMenuItem("Текстовый чат", "Настройка дизайна текстового чата", {doName: "showSettingsTextMenu"});
    UIMenu.Menu.AddMenuItem("Голосовой чат", "", {doName: "showSettingsVoiceMenu"});
    UIMenu.Menu.AddMenuItem("Дизайн меню", "Настройка дизайна меню", {doName: "showSettingsMenuMenu"});
    UIMenu.Menu.AddMenuItem("Назначение клавиш", "", {doName: "showSettingsKeyMenu"});

    //UIMenu.Menu.AddMenuItem("~r~Выйти с сервера", "Нажмите ~g~Enter~s~ чтобы применить").doName = 'exit';

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {

        if (item.doName == 'loadAllModels') {
            timer.allModelLoader();
        }
        if (item.doName == 'exit') {
            user.kick('Выход с сервера');
        }
        if (item.doName == 'fixCustom') {
            UIMenu.Menu.HideMenu();
            user.reset('hasMask');
            user.updateCharacterFace();
            if (user.getCache('jail_time')  < 1)
                user.updateCharacterCloth();
        }
        if (item.eventName) {
            UIMenu.Menu.HideMenu();
            mp.events.callRemote(item.eventName);
        }
        if (item.doName == 'showSettingsKeyMenu') {
            menuList.showSettingsKeyMenu();
        }
        if (item.doName == 'showSettingsVoiceMenu') {
            menuList.showSettingsVoiceMenu();
        }
        if (item.doName == 'showSettingsTextMenu') {
            menuList.showSettingsTextMenu();
        }
        if (item.doName == 'showSettingsMenuMenu') {
            menuList.showSettingsMenuMenu();
        }
        if (item.doName == 'showSettingsHudMenu') {
            menuList.showSettingsHudMenu();
        }
    });
};

menuList.showSettingsKeyMenu = function() {

    UIMenu.Menu.Create(`Настройки`, `~b~Настройки управления`);

    let menuItem = {doName: "s_bind_veh_menu"};
    UIMenu.Menu.AddMenuItem("Меню транспорта", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_player_menu"};
    UIMenu.Menu.AddMenuItem("Меню персонажа", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_inv"};
    UIMenu.Menu.AddMenuItem("Инвентарь", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_inv_world"};
    UIMenu.Menu.AddMenuItem("Предметы рядом", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_do"};
    UIMenu.Menu.AddMenuItem("Взаимодействие", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_phone"};
    UIMenu.Menu.AddMenuItem("Телефон", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_seat"};
    UIMenu.Menu.AddMenuItem("Сидеть", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_voice"};
    UIMenu.Menu.AddMenuItem("Голосовой чат", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_voice_reload"};
    UIMenu.Menu.AddMenuItem("Перезагрузить голосовой чат", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_voice_walkie"};
    UIMenu.Menu.AddMenuItem("Рация", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_voice_radio"};
    UIMenu.Menu.AddMenuItem("Говорить в рацию", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_stopanim"};
    UIMenu.Menu.AddMenuItem("Остановить анимацию", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_engine"};
    UIMenu.Menu.AddMenuItem("Запуск двигателя", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_lock"};
    UIMenu.Menu.AddMenuItem("Закрыть/открыть ТС", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_belt"};
    UIMenu.Menu.AddMenuItem("Пристегнуть ремень", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_firemod"};
    UIMenu.Menu.AddMenuItem("Режим стрельбы", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_fingerpoint"};
    UIMenu.Menu.AddMenuItem("Показывать пальцем", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_pnv"};
    UIMenu.Menu.AddMenuItem("Прибор ночного видения", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_cloth"};
    UIMenu.Menu.AddMenuItem("Надесть/Снять капюшон", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_cloth2"};
    UIMenu.Menu.AddMenuItem("Застегнуть/Расстегнуть куртку", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_megaphone"};
    UIMenu.Menu.AddMenuItem("Полицейский мегафон", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_helicam"};
    UIMenu.Menu.AddMenuItem("Режим камеры на вертолете", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_helicam_vision"};
    UIMenu.Menu.AddMenuItem("Эффект камеры на вертолете", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_helicam_lock"};
    UIMenu.Menu.AddMenuItem("Преследование ТС на вертолете", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_helilight"};
    UIMenu.Menu.AddMenuItem("Фонарь на вертолете", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_weapon_slot0"};
    UIMenu.Menu.AddMenuItem("Убрать оружие", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_weapon_slot1"};
    UIMenu.Menu.AddMenuItem("Взять основное оружие", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_weapon_slot2"};
    UIMenu.Menu.AddMenuItem("Взять дробовик", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_weapon_slot3"};
    UIMenu.Menu.AddMenuItem("Взять метательное оружие", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_weapon_slot4"};
    UIMenu.Menu.AddMenuItem("Взять пистолет", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_weapon_slot5"};
    UIMenu.Menu.AddMenuItem("Взять ручное оружие", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_animations_all"};
    UIMenu.Menu.AddMenuItem("Список всех анимаций", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_animations_0"};
    UIMenu.Menu.AddMenuItem("Анимации действий", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_animations_1"};
    UIMenu.Menu.AddMenuItem("Позирующие анимации", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_animations_2"};
    UIMenu.Menu.AddMenuItem("Анимации положительных эмоций", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_animations_3"};
    UIMenu.Menu.AddMenuItem("Анимации негативных эмоций", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_animations_4"};
    UIMenu.Menu.AddMenuItem("Анимации танцев", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_animations_5"};
    UIMenu.Menu.AddMenuItem("Анимации взаимодействия", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_animations_6"};
    UIMenu.Menu.AddMenuItem("Остальные анимации", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnClose.Add((sender) =>
    {
        if (bind.isChange)
            bind.bindNewKey(0);
    });

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        if (item.doName === 'closeMenu') {
            if (bind.isChange)
                bind.bindNewKey(0);
        }
        else {
            mp.game.ui.notifications.show("~g~Нажмите на клавишу, которую хотите назначить");
            let keyCode = await bind.getChangeKey(item.doName);
            let keyLabel = bind.getKeyName(keyCode);
            //item.SetRightLabel(`~m~[${keyLabel}]`);
            mp.game.ui.notifications.show(`~g~Вы назначили клавишу ~s~${keyLabel}`);
            menuList.showSettingsKeyMenu();
        }
    });
};

menuList.showSettingsHudMenu = function() {

    UIMenu.Menu.Create(`Настройки`, `~b~Настройки интерфейса`);

    UIMenu.Menu.AddMenuItem("Позиция элементов интерфейса", "Нажмите ~g~ПКМ~s~ чтобы вернуть в исходное положение", {doName: "canEdit"});

    UIMenu.Menu.AddMenuItem("Показывать HUD (~g~Вкл~s~/~r~Выкл~s~)", "Чтобы включить худ, нажмите F2", {doName: "showRadar"});
    UIMenu.Menu.AddMenuItem("Показывать ID игроков (~g~Вкл~s~/~r~Выкл~s~)", "Нажмите ~g~Enter~s~ чтобы применить", {doName: "showId"});

    if (user.isAdmin())
        UIMenu.Menu.AddMenuItem("Показывать ID транспорта (~g~Вкл~s~/~r~Выкл~s~)", "Нажмите ~g~Enter~s~ чтобы применить", {doName: "showvId"});

    UIMenu.Menu.AddMenuItemList("Спидометр", ['Стандартный', 'Цифровой'], "", {doName: "speed"}, user.getCache('s_hud_speed') ? 1 : 0);

    UIMenu.Menu.AddMenuItemList("Скорость", ['MP/H', 'KM/H'], "", {doName: "speed_type"}, user.getCache('s_hud_speed_type') ? 1 : 0);

    UIMenu.Menu.AddMenuItemList("Температура", ['°C', '°F'], "", {doName: "temp"}, user.getCache('s_hud_temp') ? 1 : 0);

    UIMenu.Menu.AddMenuItemList("Взаимодействие", ['Стандартное', 'Над объектом'], "", {doName: "raycast"}, user.getCache('s_hud_raycast') ? 1 : 0);

    UIMenu.Menu.AddMenuItemList("Курсор в меню", ['Выкл', 'Вкл'], "", {doName: "crus"}, user.getCache('s_hud_cursor') ? 1 : 0);
    UIMenu.Menu.AddMenuItemList("Уведомления над картой", ['Выкл', 'Вкл'], "", {doName: "notify"}, user.getCache('s_hud_notify') ? 1 : 0);

    UIMenu.Menu.AddMenuItemList("Авто. перезагрузка интерфейса", ['Выкл', 'Вкл'], "В случае если у вас он завис~br~или не работает", {doName: "restart"}, user.getCache('s_hud_restart') ? 1 : 0);

    let listVoiceVol = ["0%", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"];
    UIMenu.Menu.AddMenuItemList("Прозрачность интерфейса", listVoiceVol, "", {doName: "bg"}, methods.parseInt(user.getCache('s_hud_bg') * 10));

    UIMenu.Menu.AddMenuItem("~y~Перезапустить интерфейс", 'В случае если у вас он завис~br~или не работает', {doName: "fixInterface"});
    UIMenu.Menu.AddMenuItem("~y~Установить настройки по умолчанию", "", {doName: "resetEdit"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnList.Add((item, index) => {
        if (item.doName === 'speed') {
            user.set('s_hud_speed', index === 1);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName === 'speed_type') {
            user.set('s_hud_speed_type', index === 1);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName === 'temp') {
            user.set('s_hud_temp', index === 1);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName === 'raycast') {
            user.set('s_hud_raycast', index === 1);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName === 'restart') {
            user.set('s_hud_restart', index === 1);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName === 'crus') {
            user.set('s_hud_cursor', index === 1);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');

            if (user.getCache('s_hud_cursor')) {
                mp.gui.cursor.show(false, true);
                ui.DisableMouseControl = true;
            }
            else {
                mp.gui.cursor.show(false, false);
                ui.DisableMouseControl = false;
            }
        }
        if (item.doName === 'notify') {
            user.set('s_hud_notify', index === 1);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName == 'bg') {
            let voiceVol = index / 10;
            user.set('s_hud_bg', voiceVol);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
    });
    UIMenu.Menu.OnSelect.Add((item, index) => {
        if (item.doName == 'showId') {
            mp.events.call('client:showId');
        }
        if (item.doName == 'showvId') {
            mp.events.call('client:showvId');
        }
        if (item.doName == 'showRadar') {
            ui.showOrHideRadar();
        }
        if (item.doName == 'canEdit') {
            ui.showOrHideEdit();
        }
        if (item.doName == 'resetEdit') {
            user.set('s_pos', '[]');
            ui.hideHud();
            setTimeout(function () {
                ui.showHud();
            }, 100);
        }
        if (item.doName == 'fixInterface') {
            ui.fixInterface();
        }
    });
};

menuList.showSettingsTextMenu = function() {

    UIMenu.Menu.Create(`Настройки`, `~b~Настройки чата`);

    let fontSizeList = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];
    let lineSizeList = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'];
    let bgStateList = ['Выкл', 'Вкл', 'Всегда вкл'];
    let bgOpacity = ["0%", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"];
    let timeoutList = ['1s', '3s', '5s', '10s', '15s', '20s', '30s', 'Никогда'];

    UIMenu.Menu.AddMenuItem("~y~Очистить чат", "", {doName: "clearChat"});

    UIMenu.Menu.AddMenuItemList("Шрифт", enums.fontList, "", {doName: "font"}, enums.fontList.indexOf(user.getCache('s_chat_font')));

    UIMenu.Menu.AddMenuItemList("Размер шрифта", fontSizeList, "", {doName: "fontSize"},fontSizeList.indexOf(user.getCache('s_chat_font_s').toString()));

    UIMenu.Menu.AddMenuItemList("Отступ текста", lineSizeList, "", {doName: "lineSize"}, lineSizeList.indexOf(user.getCache('s_chat_font_l').toString()));

    UIMenu.Menu.AddMenuItemList("Тип фона", bgStateList, "", {doName: "bgStyle"}, user.getCache('s_chat_bg_s'));

    UIMenu.Menu.AddMenuItemList("Прозрачность фона", bgOpacity, "", {doName: "bgOpacity"}, methods.parseInt(user.getCache('s_chat_bg_o') * 10));

    UIMenu.Menu.AddMenuItemList("Прозрачность чата", bgOpacity, "", {doName: "chatOpacity"}, methods.parseInt(user.getCache('s_chat_opacity') * 10));

    UIMenu.Menu.AddMenuItemList("Ширина", bgOpacity, "", {doName: "width"}, methods.parseInt(user.getCache('s_chat_width') / 10));

    UIMenu.Menu.AddMenuItemList("Высота", bgOpacity, "", {doName: "height"}, methods.parseInt(user.getCache('s_chat_height') / 10));

    UIMenu.Menu.AddMenuItemList("Закрыть по таймауту", timeoutList, "", {doName: "timeout"}, user.getCache('s_chat_timeout'));

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnList.Add(async (item, index) => {
        if (item.doName == 'font') {
            user.set('s_chat_font', enums.fontList[index]);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName == 'fontSize') {
            user.set('s_chat_font_s', fontSizeList[index]);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName == 'lineSize') {
            user.set('s_chat_font_l', lineSizeList[index]);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName == 'bgStyle') {
            user.set('s_chat_bg_s', index);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName == 'timeout') {
            user.set('s_chat_timeout', index);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName == 'width') {
            let num = index * 10;
            user.set('s_chat_width', num);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName == 'height') {
            let num = index * 10;
            user.set('s_chat_height', num);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName == 'bgOpacity') {
            let num = index / 10;
            user.set('s_chat_bg_o', num);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName == 'chatOpacity') {
            let num = index / 10;
            user.set('s_chat_opacity', num);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        chat.show(false);
        chat.updateSettings();
        setTimeout(function () {
            chat.show(true);
        }, 200);
    });

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        if (item.doName == 'clearChat')
            user.clearChat();
    });
};

menuList.showSettingsMenuMenu = function() {

    UIMenu.Menu.Create(`Настройки`, `~b~Настройки меню`);

    let bgOpacity = ["0%", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"];
    let width = [];
    let border = [];
    for (let i = 0; i <= 30; i++)
        border.push(`${i}px`);
    for (let i = 0; i <= 20; i++)
        width.push(`${350 + (i * 10)}px`);

    UIMenu.Menu.AddMenuItemList("Шрифт", enums.fontList, "", {doName: "font"}, enums.fontList.indexOf(user.getCache('s_menu_font')));
    UIMenu.Menu.AddMenuItemList("Прозрачность фона", bgOpacity, "", {doName: "bgOpacity"}, methods.parseInt(user.getCache('s_menu_opacity') * 10));
    UIMenu.Menu.AddMenuItemList("Цвет фона", enums.rgbNamesB, "", {doName: "bgColor"}, methods.parseInt(user.getCache('s_menu_color')));
    UIMenu.Menu.AddMenuItemList("Ширина", width, "", {doName: "width"}, methods.parseInt((user.getCache('s_menu_width') - 350) / 10));
    //UIMenu.Menu.AddMenuItemList("Максимальная высота", bgOpacity, "", {doName: "height"}, methods.parseInt(user.getCache('s_chat_height') / 10));
    UIMenu.Menu.AddMenuItemList("Закругление краёв", border, "", {doName: "border"}, methods.parseInt(user.getCache('s_menu_border')));
    UIMenu.Menu.AddMenuItemList("Звук", ['Выкл', 'Вкл'], "", {doName: "sound"}, user.getCache('s_menu_sound'));

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnList.Add(async (item, index) => {
        if (item.doName == 'sound') {
            user.set('s_menu_sound', index);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName == 'font') {
            user.set('s_menu_font', enums.fontList[index]);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName == 'bgOpacity') {
            let num = index / 10;
            user.set('s_menu_opacity', num);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName == 'bgColor') {
            user.set('s_menu_color', index);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName == 'width') {
            user.set('s_menu_width', 350 + index * 10);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName == 'border') {
            user.set('s_menu_border', index);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        ui.updateMenuSettings();

        if (item.doName == 'font')
            menuList.showSettingsMenuMenu();
    });
};

menuList.showSettingsVoiceMenu = function() {

    UIMenu.Menu.Create(`Настройки`, `~b~Настройки голосового чата`);

    //let listVoiceType = ["Шепот", "Нормально", "Крик"];
    //let listVoice3d = ["Вкл", "Выкл"];
    let listVoiceVol = ["0%", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"];

    //UIMenu.Menu.AddMenuItemList("Тип голосового чата", listVoiceType, "Нажмите ~g~Enter~s~ чтобы применить").doName = '';
    //UIMenu.Menu.AddMenuItemList("Объем голосового чата", listVoice3d, "Нажмите ~g~Enter~s~ чтобы применить").doName = '';

    UIMenu.Menu.AddMenuItemList("Громкость голосового чата", listVoiceVol, "", {doName: "vol"}, methods.parseInt(user.getCache('s_voice_vol') * 10));
    
    UIMenu.Menu.AddMenuItem("~y~Перезагрузить голосовой чат (#1)", "Нажмите ~g~Enter~s~ чтобы применить", {doName: "restartVoice1"});
    UIMenu.Menu.AddMenuItem("~y~Перезагрузить голосовой чат (#2)", "Нажмите ~g~Enter~s~ чтобы применить", {doName: "restartVoice2"});
    UIMenu.Menu.AddMenuItem("~y~Перезагрузить голосовой чат (#3)", "Нажмите ~g~Enter~s~ чтобы применить", {doName: "restartVoice3"});
    UIMenu.Menu.AddMenuItem("~y~Перезагрузить голосовой чат (Полная)", "Нажмите ~g~Enter~s~ чтобы применить", {doName: "restartVoice4"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    let voiceVol = 1;
    UIMenu.Menu.OnList.Add(async (item, index) => {
        if (item.doName == 'vol') {
            voiceVol = index / 10;

            user.set('s_voice_vol', voiceVol);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
    });

    UIMenu.Menu.OnSelect.Add(async (item, index) => {

        if (item.doName == 'restartVoice1') {
            mp.voiceChat.cleanupAndReload(true, false, false);
            mp.game.ui.notifications.show('~b~Голосовой чат был перезагружен');
        }
        if (item.doName == 'restartVoice2') {
            mp.voiceChat.cleanupAndReload(false, true, false);
            mp.game.ui.notifications.show('~b~Голосовой чат был перезагружен');
        }
        if (item.doName == 'restartVoice3') {
            mp.voiceChat.cleanupAndReload(false, false, true);
            mp.game.ui.notifications.show('~b~Голосовой чат был перезагружен');
        }
        if (item.doName == 'restartVoice4') {
            mp.voiceChat.cleanupAndReload(true, true, true);
            mp.game.ui.notifications.show('~b~Голосовой чат был перезагружен');
        }
        if (item.eventName) {
            UIMenu.Menu.HideMenu();
            mp.events.callRemote(item.eventName);
        }
    });
};

menuList.showPlayerDoMenu = function(playerId) {

    let target = mp.players.atRemoteId(playerId);

    if (!mp.players.exists(target)) {
        mp.game.ui.notifications.show("~g~Ошибка взаимодействия с игроком");
        return;
    }

    UIMenu.Menu.Create(`ID: ${playerId}`, `~b~Взаимодействие с ID: ${playerId}`);

    UIMenu.Menu.AddMenuItem("Передать деньги", "", {doName: "giveMoney"});
    UIMenu.Menu.AddMenuItem("Познакомиться", "", {doName: "dating"});
    if (user.isPolice() || user.isGov()) {
        UIMenu.Menu.AddMenuItem("Надеть наручники", "", {eventName: "server:user:cuffItemById"});
        UIMenu.Menu.AddMenuItem("Снять наручники", "", {eventName: "server:user:unCuffById"});
    }
    UIMenu.Menu.AddMenuItem("Снять стяжки", "", {eventName: "server:user:unTieById"});

    UIMenu.Menu.AddMenuItem("Вырубить", "Чем больше у Вас сила, тем больше шанс", {eventName: "server:user:knockById"});

    UIMenu.Menu.AddMenuItem("Затащить в ближайшее авто", "", {eventName: "server:user:inCarById"});
    //UIMenu.Menu.AddMenuItem("Вытащить из тс").eventName = 'server:user:removeCarById';
    UIMenu.Menu.AddMenuItem("Вести за собой", "", {eventName: "server:user:taskFollowById"});
    UIMenu.Menu.AddMenuItem("Снять маску с игрока", '', {eventName: 'server:user:taskRemoveMaskById'});

    UIMenu.Menu.AddMenuItem("Обыск игрока", "", {eventName: "server:user:getInvById"});
    if (user.isPolice()) {
        UIMenu.Menu.AddMenuItem("Установить личность", "", {eventName: "server:user:getPassById"});
    }

    UIMenu.Menu.AddMenuItem("~b~Документы", "", {doName: "showPlayerDoсMenu"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();

        if (ui.isGreenZone()) {
            if (item.eventName === 'server:user:knockById') {
                mp.game.ui.notifications.show("~r~В Зелёной зоне данное действие запрещено");
                return;
            }
        }
        if (ui.isYellowZone()) {
            if (item.eventName === 'server:user:knockById') {
                mp.game.ui.notifications.show("~r~В Желтой зоне данное действие запрещено");
                return;
            }
        }

        if (item.doName == 'giveMoney') {
            let money = methods.parseFloat(await UIMenu.Menu.GetUserInput("Сумма", "", 9));
            if (money <= 0) {
                mp.game.ui.notifications.show("~r~Нельзя передавать меньше 0$");
                return;
            }
            mp.events.callRemote('server:user:giveMoneyToPlayerId', playerId, money);
        }
        else if (item.doName == 'dating') {
            let rpName = user.getCache('name').split(' ');
            let name = await UIMenu.Menu.GetUserInput("Как вы себя представите?", rpName[0], 30);
            if (name == '') return;
            name = name.replace(/[^a-zA-Z\s]/ig, '');
            if (name.trim() == '') {
                mp.game.ui.notifications.show("~r~Доступны только английские буквы");
                return;
            }
            mp.events.callRemote('server:user:askDatingToPlayerId', playerId, name);
        }
        else if (item.doName == 'showPlayerDoсMenu')
            menuList.showPlayerDocMenu(playerId);
        else if (item.eventName)
            mp.events.callRemote(item.eventName, playerId);
    });
};

menuList.showVehicleDoInvMenu = function(vehId) {

    let vehicle = mp.vehicles.atRemoteId(vehId);

    if (!mp.vehicles.exists(vehicle)) {
        mp.game.ui.notifications.show("~g~Ошибка взаимодействия с транспортом");
        return;
    }
    
    let vInfo = methods.getVehicleInfo(vehicle.model);

    UIMenu.Menu.Create(`Транспорт`, `~b~Взаимодействие с транспортом`);

    UIMenu.Menu.AddMenuItem("Открыть багажник", "", {doName: "openInv"});
    UIMenu.Menu.AddMenuItem("Выкинуть человека", "", {doName: "eject"});

    if (vehicle.getVariable('fraction_id') === 7 && user.isNews()) {
        UIMenu.Menu.AddMenuItem("~g~Взять камеру", "", {doName: "takeCam"});
        UIMenu.Menu.AddMenuItem("~y~Положить камеру", "", {doName: "putCam"});

        UIMenu.Menu.AddMenuItem("~g~Взять микрофон", "", {doName: "takeMic"});
        UIMenu.Menu.AddMenuItem("~y~Положить микрофон", "", {doName: "putMic"});
    }
    if (vehicle.getVariable('fraction_id') === 2 && user.isSapd() && vInfo.display_name === 'Riot') {
        UIMenu.Menu.AddMenuItem("~g~Войти в режим дрона", "", {doName: "drone"});
    }

    if (user.getCache('job') == vehicle.getVariable('jobId')) {
        switch (vehicle.getVariable('jobId')) {
            case 1:
                UIMenu.Menu.AddMenuItem("~b~Инструменты (Красный маркер)", "", {doName: "tree:take0"});
                UIMenu.Menu.AddMenuItem("~b~Инструменты (Зеленый маркер)", "", {doName: "tree:take1"});
                UIMenu.Menu.AddMenuItem("~b~Инструменты (Синий маркер)", "", {doName: "tree:take2"});
                break;
            case 2:
                UIMenu.Menu.AddMenuItem("~b~Инструменты (Красный маркер)", "", {doName: "builder:take0"});
                UIMenu.Menu.AddMenuItem("~b~Инструменты (Зеленый маркер)", "", {doName: "builder:take1"});
                UIMenu.Menu.AddMenuItem("~b~Инструменты (Синий маркер)", "", {doName: "builder:take2"});
                break;
            case 3:
                UIMenu.Menu.AddMenuItem("~g~Напомнить задание", "", {doName: "photo:ask"});
                break;
            case 4:
                UIMenu.Menu.AddMenuItem("~g~Взять почту из транспорта", "", {doName: "mail:take"});
                break;
        }
    }

    UIMenu.Menu.AddMenuItem("Закрыть багажник", "", {doName: "close"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName == 'takeCam') {
            mp.attachmentMngr.addLocal('cam');
            user.playAnimation('missfinale_c2mcs_1', 'fin_c2_mcs_1_camman', 49);
        }
        if (item.doName == 'putCam') {
            mp.attachmentMngr.removeLocal('cam');
            user.stopAllAnimation();
        }
        if (item.doName == 'takeMic') {
            mp.attachmentMngr.addLocal('mic');
        }
        if (item.doName == 'putMic') {
            mp.attachmentMngr.removeLocal('mic');
            user.stopAllAnimation();
        }
        if (item.doName == 'drone') {
            drone.enterLspd(vehicle.remoteId);
        }
        if (item.doName == 'photo:ask')
            photo.ask();
        else if (item.doName == 'mail:take')
            mail.takeMail();
        else if (item.doName == 'tree:take0')
            tree.take(0);
        else if (item.doName == 'tree:take1')
            tree.take(1);
        else if (item.doName == 'tree:take2')
            tree.take(2);
        else if (item.doName == 'builder:take0')
            builder.take(0);
        else if (item.doName == 'builder:take1')
            builder.take(1);
        else if (item.doName == 'builder:take2')
            builder.take(2);
        if (item.doName == 'openInv') {

            if (ui.isGreenZone() && !user.isPolice()) {
                mp.game.ui.notifications.show("~r~В зелёной зоне это действие запрещено");
                return;
            }

            if (mp.players.local.vehicle) {
                mp.game.ui.notifications.show("~r~Это действие не доступно");
                return;
            }

            if (methods.distanceToPos(vehicle.position, mp.players.local.position) > 5) {
                mp.game.ui.notifications.show("~r~Вы слишком далеко");
                return;
            }

            inventory.getItemList(inventory.types.Vehicle, mp.game.joaat(vehicle.getNumberPlateText().trim()));
            vehicles.setTrunkStateById(vehicle.remoteId, true);
        }
        if (item.doName == 'eject') {

            if (methods.distanceToPos(vehicle.position, mp.players.local.position) > 5) {
                mp.game.ui.notifications.show("~r~Вы слишком далеко");
                return;
            }

            let id = methods.parseInt(await UIMenu.Menu.GetUserInput("ID Игрока", "", 3));
            if (id < 0) {
                mp.game.ui.notifications.show('~r~ID не может быть меньше 0');
                return;
            }
            if (methods.parseInt(id) === mp.players.local.remoteId) {
                mp.game.ui.notifications.show('~r~Дядь, себя нельзя никак выкинуть из ТС');
                return;
            }
            mp.events.callRemote('server:vehicle:ejectByIdOut', methods.parseInt(vehicle.remoteId), methods.parseInt(id));
        }
        else if (item.doName == 'close') {
            vehicles.setTrunkStateById(vehicle.remoteId, false);
        }
    });
};

menuList.showPlayerDocMenu = function(playerId) {

    let target = mp.players.atRemoteId(playerId);

    if (!mp.players.exists(target)) {
        mp.game.ui.notifications.show("~g~Ошибка взаимодействия с игроком");
        return;
    }

    UIMenu.Menu.Create(`Персонаж`, `~b~Документы`);

    UIMenu.Menu.AddMenuItem("Card ID", "~c~Это что-то типо паспорта~br~только в Америке", {doName: "card_id"});

    UIMenu.Menu.AddMenuItem("Work ID", "~c~Это ваше разрешение на работу", {doName: "work_lic"});

    if (user.isGov() || user.isSheriff() || user.isEms() || user.isSapd() || user.isFib() || user.isUsmc() || user.isNews())
        UIMenu.Menu.AddMenuItem("Удостоверение", "", {doName: "gos_lic"});

    UIMenu.Menu.AddMenuItem("Мед. страховка", "~c~Эта штука нужна для того~br~чтобы лечение было дешевле", {doName: "med_lic"});

    UIMenu.Menu.AddMenuItem("Лицензия категории `А`", "~c~Лицензия на мотоциклы", {doName: "a_lic"});

    UIMenu.Menu.AddMenuItem("Лицензия категории `B`", "~c~Лицензия на обычный ТС", {doName: "b_lic"});

    UIMenu.Menu.AddMenuItem("Лицензия категории `C`", "~c~Лицензия на большие машинки", {doName: "c_lic"});

    UIMenu.Menu.AddMenuItem("Лицензия на авиатранспорт", "", {doName: "air_lic"});

    UIMenu.Menu.AddMenuItem("Лицензия на водный транспорт", "", {doName: "ship_lic"});

    UIMenu.Menu.AddMenuItem("Лицензия на оружие", "", {doName: "gun_lic"});

    UIMenu.Menu.AddMenuItem("Лицензия на перевозку пассажиров", "~c~Нужно для таксистов и~br~водителей автобуса", {doName: "taxi_lic"});

    UIMenu.Menu.AddMenuItem("Лицензия юриста", "", {doName: "law_lic"});

    UIMenu.Menu.AddMenuItem("Лицензия на предпринимательство", "~c~Чтобы можно было иметь бизнес", {doName: "biz_lic"});

    UIMenu.Menu.AddMenuItem("Разрешение на рыболовство", "~c~Можно рыбачить, как-бы", {doName: "fish_lic"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName == "gos_lic")
            mp.events.callRemote('server:user:showLicGos', playerId);
        else if (item.doName)
            mp.events.callRemote('server:user:showLic', item.doName, playerId);
    });
};

menuList.showPlayerStatsMenu = function() {

    UIMenu.Menu.Create(`Персонаж`, `~b~${user.getCache('name')}`);

    UIMenu.Menu.AddMenuItem("~b~Имя:", "", {}, `${user.getCache('name')}`);
    UIMenu.Menu.AddMenuItem("~b~Дата рождения:", "", {}, `${user.getCache('age')}`);
    //UIMenu.Menu.AddMenuItem("~b~Работа:", "", {}, `${user.get('fraction_id') > 0 ? methods.getFractionName(user.get('fraction_id')) : methods.getJobName(user.get('job'))}`);
    UIMenu.Menu.AddMenuItem("~b~Вид на жительство:", "", {}, `${user.getRegStatusName()}`);
    UIMenu.Menu.AddMenuItem("~b~Репутация:", "", {}, `${user.getRepColorName()}`);
    if (user.getCache('bank_card') > 0)
        UIMenu.Menu.AddMenuItem("~b~Банковская карта:", "", {}, `${methods.bankFormat(user.getCache('bank_card'))}`);
    if (user.getCache('phone') > 0)
        UIMenu.Menu.AddMenuItem("~b~Мобильный телефон:", "", {}, `${methods.phoneFormat(user.getCache('phone'))}`);

    UIMenu.Menu.AddMenuItem("~b~Вы играли:~r~", "", {}, `${methods.parseFloat(user.getCache('online_time') * 8.5 / 60).toFixed(1)}ч.`);
    UIMenu.Menu.AddMenuItem("~b~Вы играли сегодня:~r~", "", {}, `${methods.parseFloat(user.getCache('online_cont') * 8.5 / 60).toFixed(1)}ч.`);
    UIMenu.Menu.AddMenuItem("~b~Вы играли (Конкурс):~r~", "", {}, `${methods.parseFloat(user.getCache('online_contall') * 8.5 / 60).toFixed(1)}ч.`);

    if (user.getCache('vip_type') === 1)
        UIMenu.Menu.AddMenuItem("~b~VIP:", "", {}, `LIGHT`);
    else if (user.getCache('vip_type') === 2)
        UIMenu.Menu.AddMenuItem("~b~VIP:", "", {}, `HARD`);
    else
        UIMenu.Menu.AddMenuItem("~b~VIP:~r~", "", {}, `Отсутствует`);

    UIMenu.Menu.AddMenuItem("~b~Розыск:", "", {}, `${user.getCache('wanted_level') > 0 ? '~r~В розыске' : '~g~Нет'}`);
    UIMenu.Menu.AddMenuItem("~b~Предупреждений:", "", {}, `${user.getCache('warns')}`);
    //UIMenu.Menu.AddMenuItem("~b~Рецепт марихуаны:", "", {}, `${user.get('allow_marg') ? 'Есть' : '~r~Нет'}`);

    let label = '';
    if (user.getCache('a_lic'))
        label = `Действует с ~b~${user.getCache('a_lic_create')}~s~ по ~b~${user.getCache('a_lic_end')}`;
    UIMenu.Menu.AddMenuItem("~b~Лицензия категории `А`:", label, {}, `${user.getCache('a_lic') ? 'Есть' : '~r~Нет'}`);

    label = '';
    if (user.getCache('b_lic'))
        label = `Действует с ~b~${user.getCache('b_lic_create')}~s~ по ~b~${user.getCache('b_lic_end')}`;
    UIMenu.Menu.AddMenuItem("~b~Лицензия категории `B`:", label, {}, `${user.getCache('b_lic') ? 'Есть' : '~r~Нет'}`);

    label = '';
    if (user.getCache('c_lic'))
        label = `Действует с ~b~${user.getCache('c_lic_create')}~s~ по ~b~${user.getCache('c_lic_end')}`;
    UIMenu.Menu.AddMenuItem("~b~Лицензия категории `C`:", label, {}, `${user.getCache('c_lic') ? 'Есть' : '~r~Нет'}`);

    label = '';
    if (user.getCache('air_lic'))
        label = `Действует с ~b~${user.getCache('air_lic_create')}~s~ по ~b~${user.getCache('air_lic_end')}`;
    UIMenu.Menu.AddMenuItem("~b~Лицензия на авиатранспорт:", label, {}, `${user.getCache('air_lic') ? 'Есть' : '~r~Нет'}`);

    label = '';
    if (user.getCache('ship_lic'))
        label = `Действует с ~b~${user.getCache('ship_lic_create')}~s~ по ~b~${user.getCache('ship_lic_end')}`;
    UIMenu.Menu.AddMenuItem("~b~Лицензия на водный транспорт:", label, {}, `${user.getCache('ship_lic') ? 'Есть' : '~r~Нет'}`);

    label = '';
    if (user.getCache('gun_lic'))
        label = `Действует с ~b~${user.getCache('gun_lic_create')}~s~ по ~b~${user.getCache('gun_lic_end')}`;
    UIMenu.Menu.AddMenuItem("~b~Лицензия на оружие:", label, {}, `${user.getCache('gun_lic') ? 'Есть' : '~r~Нет'}`);

    label = '';
    if (user.getCache('taxi_lic'))
        label = `Действует с ~b~${user.getCache('taxi_lic_create')}~s~ по ~b~${user.getCache('taxi_lic_end')}`;
    UIMenu.Menu.AddMenuItem("~b~Лицензия на перевозку пассажиров:", label, {}, `${user.getCache('taxi_lic') ? 'Есть' : '~r~Нет'}`);

    label = '';
    if (user.getCache('law_lic'))
        label = `Действует с ~b~${user.getCache('law_lic_create')}~s~ по ~b~${user.getCache('law_lic_end')}`;
    UIMenu.Menu.AddMenuItem("~b~Лицензия юриста:", label, {}, `${user.getCache('law_lic') ? 'Есть' : '~r~Нет'}`);

    label = '';
    if (user.getCache('biz_lic'))
        label = `Действует с ~b~${user.getCache('biz_lic_create')}~s~ по ~b~${user.getCache('biz_lic_end')}`;
    UIMenu.Menu.AddMenuItem("~b~Лицензия на предпринимательство:", label, {}, `${user.getCache('biz_lic') ? 'Есть' : '~r~Нет'}`);

    label = '';
    if (user.getCache('fish_lic'))
        label = `Действует с ~b~${user.getCache('fish_lic_create')}~s~ по ~b~${user.getCache('fish_lic_end')}`;
    UIMenu.Menu.AddMenuItem("~b~Разрешение на рыболовство:", label, {}, `${user.getCache('fish_lic') ? 'Есть' : '~r~Нет'}`);

    label = '';
    if (user.getCache('med_lic'))
        label = `Действует с ~b~${user.getCache('med_lic_create')}~s~ по ~b~${user.getCache('med_lic_end')}`;
    UIMenu.Menu.AddMenuItem("~b~Мед. страховка:", label, {}, `${user.getCache('med_lic') ? 'Есть' : '~r~Нет'}`);

    UIMenu.Menu.AddMenuItem("~b~Выносливость:", "", {}, `${user.getCache('stats_endurance') + 1}%`);
    UIMenu.Menu.AddMenuItem("~b~Сила:", "", {}, `${user.getCache('stats_strength') + 1}%`);
    UIMenu.Menu.AddMenuItem("~b~Объем легких:", "", {}, `${user.getCache('stats_lung_capacity') + 1}%`);
    UIMenu.Menu.AddMenuItem("~b~Навык водителя:", "", {}, `${user.getCache('stats_driving') + 1}%`);
    UIMenu.Menu.AddMenuItem("~b~Навык пилота:", "", {}, `${user.getCache('stats_flying') + 1}%`);
    UIMenu.Menu.AddMenuItem("~b~Навык стрельбы:", "", {}, `${user.getCache('stats_shooting') + 1}%`);
    UIMenu.Menu.AddMenuItem("~b~Удача:", "", {}, `${user.getCache('stats_lucky') + 1}%`);
    //UIMenu.Menu.AddMenuItem("~b~Психика:", "", {}, `${user.getCache('stats_psychics') + 1}%`);

    UIMenu.Menu.AddMenuItem("~b~Work ID:", "", {}, `${user.getCache('work_lic') != '' ? user.getCache('work_lic') : '~r~Нет'}`);
    UIMenu.Menu.AddMenuItem("~b~Уровень рабочего:", "", {}, `${user.getCache('work_lvl')}`);
    UIMenu.Menu.AddMenuItem("~b~Опыт рабочего:", "", {}, `${user.getCache('work_exp')}/${user.getCache('work_lvl') * 500}`);


    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();
};

menuList.showPlayerDatingAskMenu = function(playerId, name) {

    let player = mp.players.atRemoteId(playerId);

    if (mp.players.exists(player)) {
        UIMenu.Menu.Create(`Знакомства`, `~b~${player.remoteId} хочет познакомиться`);

        UIMenu.Menu.AddMenuItem('~g~Принять знакомство', "", {doName: "yes"});
        UIMenu.Menu.AddMenuItem("~r~Отказать", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            UIMenu.Menu.HideMenu();
            if (item.doName === 'yes') {
                let rpName = user.getCache('name').split(' ');
                let nameAnswer = await UIMenu.Menu.GetUserInput("Как вы себя представите?", rpName[0], 30);
                if (nameAnswer == '') return;
                nameAnswer = nameAnswer.replace(/[^a-zA-Z\s]/ig, '');
                if (nameAnswer == '' || nameAnswer == ' ') {
                    mp.game.ui.notifications.show("~r~Доступны только английские буквы");
                    return;
                }
                mp.events.callRemote('server:user:askDatingToPlayerIdYes', playerId, name, nameAnswer);
                user.playAnimationWithUser(player.remoteId, 0);
            }
        });
    }
};

menuList.showPlayerDiceAskMenu = function(playerId, sum) {

    let player = mp.players.atRemoteId(playerId);

    if (mp.players.exists(player)) {
        UIMenu.Menu.Create(`Кости`, `~b~${player.remoteId} хочет поиграть в кости`);

        UIMenu.Menu.AddMenuItem('Ставка: ~g~' + methods.moneyFormat(sum));
        UIMenu.Menu.AddMenuItem('~g~Принять ставку ', "", {doName: "yes"});
        UIMenu.Menu.AddMenuItem("~r~Отказать", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            UIMenu.Menu.HideMenu();
            if (item.doName === 'yes') {
                if (user.getCashMoney() < sum) {
                    return;
                }
                mp.game.ui.notifications.show('~b~У вас нет такой суммы на руках');
                mp.events.callRemote('server:user:askDiceToPlayerIdYes', playerId, sum);
            }
        });
    }
};

menuList.showInviteMpMenu = function(x, y, z) {

    UIMenu.Menu.Create(`Мероприятие`, `~b~Приглашение от админстратора`);

    UIMenu.Menu.AddMenuItem('Приглашение на мероприятие');
    UIMenu.Menu.AddMenuItem('~g~Принять приглашение', "", {doName: "yes"});
    UIMenu.Menu.AddMenuItem("~r~Отказать", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'yes') {
            user.setVirtualWorld(0);
            user.teleport(x, y, z);
        }
    });
};

menuList.showMenu = function(title, desc, menuData) {

    UIMenu.Menu.Create(title.toString(), `~b~${desc}`);

    menuData.forEach(function (val, key, map) {
        try {
            UIMenu.Menu.AddMenuItem(`~b~${key} ~s~`, "", {}, val.toString());
        }
        catch (e) {
            methods.error(e);
        }
    });

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();
};

let lastOffers = null;

menuList.showTruckerOffersMenu = function(menuData) {

    try {
        UIMenu.Menu.Create('Грузоперевозки', `~b~Список заказов`);

        lastOffers = menuData;

        let playerPos = mp.players.local.position;

        menuData.forEach((item, idx) => {
            try {
                let x = 0;
                let y = 0;
                let z = 0;
                let tx = 0;
                let ty = 0;
                let tz = 0;
                if (item.length == 10) {
                    x = item[3];
                    y = item[4];
                    z = item[5];
                    tx = item[6];
                    ty = item[7];
                    tz = item[8];
                }
                else {
                    x = item[7];
                    y = item[8];
                    z = item[9];
                    tx = item[11];
                    ty = item[12];
                    tz = item[13];
                }
                let dist = mp.game.pathfind.calculateTravelDistanceBetweenPoints(x, y, z, tx, ty, tz);
                let dist2 = mp.game.pathfind.calculateTravelDistanceBetweenPoints(playerPos.x, playerPos.y, playerPos.z, x, y, z);

                if (dist > 10000)
                    dist = methods.parseInt(methods.distanceToPos(new mp.Vector3(x, y, z), new mp.Vector3(tx, ty, tz)));
                if (dist2 > 10000)
                    dist2 = methods.parseInt(methods.distanceToPos(new mp.Vector3(x, y, z), playerPos));

                UIMenu.Menu.AddMenuItem(`~b~#${item[0]}.~s~ ${item[1]}`, `~y~До загрузки: ~s~${dist2}m~br~~y~Расстояние маршрута: ~s~${dist}m~br~~y~Место загрузки: ~s~${mp.game.ui.getLabelText(mp.game.zone.getNameOfZone(x, y, z))}`, {offerId: idx}, `~g~${methods.moneyFormat(item[item.length - 1])}`);
            }
            catch (e) {
                methods.debug(e);
            }
        });

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            UIMenu.Menu.HideMenu();
            if (item.offerId >= 0)
                menuList.showTruckerOfferInfoMenu(item.offerId);
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showDispatcherTaxiMenu = function(menuData) {

    try {
        UIMenu.Menu.Create('Такси', `~b~Список заказов`);

        let playerPos = mp.players.local.position;
        JSON.parse(menuData).forEach((item, idx) => {
            try {
                let dist = mp.game.pathfind.calculateTravelDistanceBetweenPoints(item.pos.x, item.pos.y, item.pos.z, playerPos.x, playerPos.y, playerPos.z);
                if (dist > 10000)
                    dist = methods.parseInt(methods.distanceToPos(item.pos, playerPos));
                let dist2 = mp.game.pathfind.calculateTravelDistanceBetweenPoints(item.pos.x, item.pos.y, item.pos.z, item.wpos.x, item.wpos.y, item.wpos.z);
                if (dist2 > 10000)
                    dist2 = methods.parseInt(methods.distanceToPos(item.pos, item.wpos));
                UIMenu.Menu.AddMenuItem(`Заказ ~y~#${item.id}`, `~y~До клиента: ~s~${dist}m~br~~y~Расстояние маршрута: ~s~${dist2}m~br~~y~Цена: ~g~${methods.moneyFormat(item.price)}`, {id: item.id});
            }
            catch (e) {
                methods.debug(e);
            }
        });

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            UIMenu.Menu.HideMenu();
            if (item.id > 0) {
                mp.events.callRemote('server:taxi:accept', item.id);
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showDispatcherMechMenu = function(menuData) {

    try {
        UIMenu.Menu.Create('Механик', `~b~Список заказов`);

        let playerPos = mp.players.local.position;
        JSON.parse(menuData).forEach((item, idx) => {
            try {
                let dist = mp.game.pathfind.calculateTravelDistanceBetweenPoints(item.pos.x, item.pos.y, item.pos.z, playerPos.x, playerPos.y, playerPos.z);
                if (dist > 10000)
                    dist = methods.parseInt(methods.distanceToPos(item.pos, playerPos));
                UIMenu.Menu.AddMenuItem(`Заказ ~y~#${item.id}`, `~y~До клиента: ~s~${dist}m`, {id: item.id});
            }
            catch (e) {
                methods.debug(e);
            }
        });

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            UIMenu.Menu.HideMenu();
            if (item.id > 0) {
                mp.events.callRemote('server:mech:accept', item.id);
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showTruckerOfferInfoMenu = function(idx) {

    //id, name, company, x, y, z, px, py, pz, price
    //id, name, company, trName, cl1, cl2, liv, x, y, z, rot, px, py, pz, price

    let item = lastOffers[idx];

    let x = 0;
    let y = 0;
    let z = 0;
    let tx = 0;
    let ty = 0;
    let tz = 0;
    if (item.length == 10) {
        x = item[3];
        y = item[4];
        z = item[5];
        tx = item[6];
        ty = item[7];
        tz = item[8];
    }
    else {
        x = item[7];
        y = item[8];
        z = item[9];
        tx = item[11];
        ty = item[12];
        tz = item[13];
    }

    UIMenu.Menu.Create(`Грузоперевозки`, `~b~Информация о заказе`);

    let dist = mp.game.pathfind.calculateTravelDistanceBetweenPoints(x, y, z, tx, ty, tz);

    if (dist > 10000)
        dist = methods.parseInt(methods.distanceToPos(new mp.Vector3(x, y, z), new mp.Vector3(tx, ty, tz)));

    UIMenu.Menu.AddMenuItem("~y~Номер заказа:~s~", '', {}, `${item[0]}`);
    UIMenu.Menu.AddMenuItem("~y~Груз:~s~", '', {}, `${item[1]}`);
    UIMenu.Menu.AddMenuItem("~y~Компания:~s~", '', {}, `${item[2]}`);
    UIMenu.Menu.AddMenuItem("~y~Стоимость:~s~", '', {}, `${methods.moneyFormat(item[item.length - 1])}`);
    UIMenu.Menu.AddMenuItem("~y~Место загрузки:~s~", '', {}, `${mp.game.ui.getLabelText(mp.game.zone.getNameOfZone(x, y, z))}`);
    UIMenu.Menu.AddMenuItem("~y~Место разгрузки:~s~", '', {}, `${mp.game.ui.getLabelText(mp.game.zone.getNameOfZone(tx, ty, tz))}`);
    UIMenu.Menu.AddMenuItem("~y~Расстояние:~s~", '', {}, `${dist}m`);
    UIMenu.Menu.AddMenuItem("~g~Принять заказ", '', {accept: item[0]});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.accept) {
            if (await user.get('uniform')) {
                mp.game.ui.notifications.show('~r~Прежде чем принимать заказы, надо снять форму');
                return;
            }
            mp.events.callRemote('server:tucker:acceptOffer', item.accept);
        }
    });
};

menuList.showVehicleMenu = async function(data) {

    let vInfo = methods.getVehicleInfo(mp.players.local.vehicle.model);
    let veh = mp.players.local.vehicle;

    let ownerName = veh.getNumberPlateText();

    UIMenu.Menu.Create(`Транспорт`, `~b~Номер ТС: ~s~${ownerName}`);

    if (vInfo.class_name != 'Cycles') {
        UIMenu.Menu.AddMenuItem("~g~Вкл~s~ / ~r~выкл~s~ двигатель", "", {eventName: "server:vehicle:engineStatus"});
    }
    if (vInfo.class_name == 'Boats' || vInfo.display_name == 'Dodo' || vInfo.display_name == 'Seasparrow' || vInfo.display_name == 'Seabreeze')
        UIMenu.Menu.AddMenuItem("~g~Вкл~s~ / ~r~выкл~s~ якорь", "", {eventName: "server:vehicleFreeze"});

    if (vInfo.class_name != 'Cycles' || vInfo.class_name != 'Planes' || vInfo.class_name != 'Helicopters' || vInfo.class_name != 'Boats')
        UIMenu.Menu.AddMenuItem("Управление транспортом", "", {doName: "showVehicleDoMenu"});

    if (data.get('user_id') > 0 && user.getCache('id') == data.get('user_id')) {
        if (data.get('cop_park_name') !== '') {

            let price = methods.getVehicleInfo(mp.players.local.vehicle.model).price * 0.01 + 100;
            if (price > 500)
                price = 500;

            UIMenu.Menu.AddMenuItem("~y~Оплатить штраф", "Штраф: ~r~" + methods.moneyFormat(price) + "~br~~s~Припарковал: ~r~" + data.get('cop_park_name'), {eventName: "server:vehicle:park2"});
        }
        else {
            UIMenu.Menu.AddMenuItem("Припарковать", "Транспорт будет спавниться на этом месте, если вы ее припаркуете", {eventName: "server:vehicle:park"});
        }
    }

    if (user.getCache('fraction_id2') > 0) {
        if (veh.getVariable('cargoId') !== null && veh.getVariable('cargoId') !== undefined) {
            if (veh.getVariable('isMafia')) {
                if (user.isMafia()) {
                    let boxes = JSON.parse(veh.getVariable('box'));
                    boxes.forEach((item, i) => {
                        if (item >= 0)
                            UIMenu.Menu.AddMenuItem(`~y~${stocks.boxList[item][0]}`, 'Нажмите ~g~Enter~s~ чтобы разгрузить', {cargoUnloadId: i, cargoId: item});
                    });
                }
            }
            else {
                let boxes = JSON.parse(veh.getVariable('box'));
                boxes.forEach((item, i) => {
                    if (item >= 0)
                        UIMenu.Menu.AddMenuItem(`~y~${stocks.boxList[item][0]}`, 'Нажмите ~g~Enter~s~ чтобы разгрузить', {cargoUnloadId: i, cargoId: item});
                });
            }
            //UIMenu.Menu.AddMenuItem(`~y~Разгрузить весь груз`, 'Доступно только внутри склада').cargoUnloadAll = true;
        }
    }

    if (user.isUsmc() && (veh.getVariable('cargoId') === 99999 || veh.getVariable('cargoId') === 99998)) {
        try {
            let boxes = JSON.parse(veh.getVariable('box'));
            if (boxes[0] === 52)
                UIMenu.Menu.AddMenuItem(`~y~Разгрузить транспорт`, "", {usmcUnloadAll: true});
        }
        catch (e) {}
    }

    if (veh.getVariable('lamar')) {
        UIMenu.Menu.AddMenuItem(`~y~Контрабанда`, 'Этот фургон везёт контрабанду');
    }

    if (veh.getVariable('emsTruck') !== null && veh.getVariable('emsTruck') !== undefined) {
        UIMenu.Menu.AddMenuItem(`~y~Разгрузить транспорт`, "", {emsUnloadAll: true});
    }

    if (veh.getVariable('fraction_id') === 2 || veh.getVariable('fraction_id') === 3 || veh.getVariable('fraction_id') === 4 || veh.getVariable('fraction_id') === 5 || veh.getVariable('fraction_id') === 6) {
        UIMenu.Menu.AddMenuItemList(`Маркировка`, enums.dispatchMarkedList, '~y~Номер необходимо указать тот,~br~который на крыше LSPD/BCSD', {dispatchMark: true});
        if (veh.getVariable('dispatchMarked'))
            UIMenu.Menu.AddMenuItem(`Маркировка: ~b~`, '', {}, `${veh.getVariable('dispatchMarked')}`);
        else
            UIMenu.Menu.AddMenuItem(`Маркировка отсуствует`);

        UIMenu.Menu.AddMenuItem(`Локальные коды`, '', {localCode: true});
        UIMenu.Menu.AddMenuItem(`Локальные департамента`, '', {depCode: true});
    }

    /*if (veh.getVariable('fraction_id') === user.getCache('fraction_id') && user.isLeader()) {
        UIMenu.Menu.AddMenuItem("Припарковать", "Транспорт будет спавниться на этом месте, если вы ее припаркуете", {eventName: "server:vehicle:parkFraction"});
    }*/

    UIMenu.Menu.AddMenuItem("~y~Выкинуть из транспорта", "", {doName: "eject"});
    UIMenu.Menu.AddMenuItem("Характеристики", "", {doName: "showVehicleStatsMenu"});
    //UIMenu.Menu.AddMenuItem("Управление транспортом").eventName = 'server:vehicle:engineStatus';

    if (vInfo.class_name === 'Vans') {
        if (user.getCache('work_lvl') >= 4) {
            UIMenu.Menu.AddMenuItem("~g~Список заказов", "", {doName: "trucker:getList0"});
            UIMenu.Menu.AddMenuItem("~b~Частота рации:~s~ ", '', {}, '300.001');
            if (trucker.isProcess())
                UIMenu.Menu.AddMenuItem("~r~Завершить досрочно рейс", 'Штраф ~r~$500', {doName: "trucker:stop"});
        }
        else {
            UIMenu.Menu.AddMenuItem("~r~Чтобы работать на этом автомобиле дальнобойщиком, необходимо иметь навык рабочего от 4 уровня");
        }
    }
    if (vInfo.display_name === 'Benson' || vInfo.display_name === 'Mule' || vInfo.display_name === 'Mule2' || vInfo.display_name === 'Mule3' || vInfo.display_name === 'Pounder') {
        if (user.getCache('work_lvl') >= 8) {
            UIMenu.Menu.AddMenuItem("~g~Список заказов", "", {doName: "trucker:getList1"});
            UIMenu.Menu.AddMenuItem("~b~Частота рации:~s~ ", '', {}, '300.002');
            if (trucker.isProcess())
                UIMenu.Menu.AddMenuItem("~r~Завершить досрочно рейс", 'Штраф ~r~$500', {doName: "trucker:stop"});
        }
        else {
            UIMenu.Menu.AddMenuItem("~r~Чтобы работать на этом автомобиле дальнобойщиком, необходимо иметь навык рабочего от 8 уровня");
        }
    }
    if (vInfo.display_name === 'Hauler' || vInfo.display_name === 'Packer' || vInfo.display_name === 'Phantom') {
        if (user.getCache('work_lvl') >= 12) {
            UIMenu.Menu.AddMenuItem("~g~Список заказов", "", {doName: "trucker:getList2"});
            UIMenu.Menu.AddMenuItem("~b~Частота рации:~s~ ", '', {}, '300.003');
            if (trucker.isProcess())
                UIMenu.Menu.AddMenuItem("~r~Завершить досрочно рейс", 'Штраф ~r~$500', {doName: "trucker:stop"});
        }
        else {
            UIMenu.Menu.AddMenuItem("~r~Чтобы работать на этом автомобиле дальнобойщиком, необходимо иметь навык рабочего от 12 уровня");
        }
    }

    if (user.getCache('job') == veh.getVariable('jobId')) {
        switch (veh.getVariable('jobId')) {
            case 1:
                UIMenu.Menu.AddMenuItem("~g~Получить задание", "", {doName: "tree:find"});
                UIMenu.Menu.AddMenuItem("~b~Инструменты (Красный маркер)", "", {doName: "tree:take0"});
                UIMenu.Menu.AddMenuItem("~b~Инструменты (Зеленый маркер)", "", {doName: "tree:take1"});
                UIMenu.Menu.AddMenuItem("~b~Инструменты (Синий маркер)", "", {doName: "tree:take2"});
                UIMenu.Menu.AddMenuItem("~y~Завершить досрочно", "~r~Штраф $100 в случае если~br~вы не взяли хотя-бы 1 маркер", {doName: "tree:stop"});
                UIMenu.Menu.AddMenuItem("~y~Завершить аренду", "", {doName: "stopRent"});
                break;
            case 2:
                UIMenu.Menu.AddMenuItem("~g~Получить задание", "", {doName: "builder:find"});
                UIMenu.Menu.AddMenuItem("~b~Инструменты (Красный маркер)", "", {doName: "builder:take0"});
                UIMenu.Menu.AddMenuItem("~b~Инструменты (Зеленый маркер)", "", {doName: "builder:take1"});
                UIMenu.Menu.AddMenuItem("~b~Инструменты (Синий маркер)", "", {doName: "builder:take2"});
                UIMenu.Menu.AddMenuItem("~y~Завершить досрочно", "~r~Штраф $100 в случае если~br~вы не взяли хотя-бы 1 маркер", {doName: "builder:stop"});
                UIMenu.Menu.AddMenuItem("~y~Завершить аренду", "", {doName: "stopRent"});
                break;
            case 3:
                UIMenu.Menu.AddMenuItem("~g~Получить задание", "", {doName: "photo:find"});
                UIMenu.Menu.AddMenuItem("~g~Напомнить задание", "", {doName: "photo:ask"});
                UIMenu.Menu.AddMenuItem("~b~Справка", 'Внимательно смотрите на задание вашего начальника и выставите позицию персонажа так, чтобы он смотрел в ту точку, которую необходимо сфотографировать, тогда вы получите премию');
                UIMenu.Menu.AddMenuItem("~y~Завершить аренду", "", {doName: "stopRent"});
                break;
            case 5:
                let currentFuel = methods.parseInt(await vehicles.get(veh.getVariable('container'), 'mechFuel'));
                UIMenu.Menu.AddMenuItem("~g~Заправить транспорт", "Игрок, которому вы предлагаете, должен сидеть в ТС", {doName: "mech:fuel"});
                UIMenu.Menu.AddMenuItem("~g~Починить транспорт", "Игрок, которому вы предлагаете, должен сидеть в ТС", {doName: "mech:fix"});
                UIMenu.Menu.AddMenuItem("~g~Перевернуть транспорт", "Игрок, которому вы предлагаете, должен сидеть в ТС или находится рядом с ним", {doName: "mech:flip"});
                UIMenu.Menu.AddMenuItem("~g~Диспетчерская", "", {doName: "mech:dispatch"});
                UIMenu.Menu.AddMenuItem(`~b~Топливо: ~s~${methods.parseInt(currentFuel)}/500ед.`, "Нажмите Enter чтобы заправить топиво~br~~c~Доступно только на заправке", {doName: "mech:fuel:1"});
                break;
            case 6:
                UIMenu.Menu.AddMenuItem("~g~Начать рейс", "", {doName: "bus:start1"});
                UIMenu.Menu.AddMenuItem("~y~Завершить рейс", "Завершение рейса досрочно", {doName: "bus:stop"});
                UIMenu.Menu.AddMenuItem("~y~Завершить аренду", "", {doName: "stopRent"});
                break;
            case 7:
                UIMenu.Menu.AddMenuItem("~g~Начать рейс", "", {doName: "bus:start2"});
                UIMenu.Menu.AddMenuItem("~y~Завершить рейс", "Завершение рейса досрочно", {doName: "bus:stop"});
                UIMenu.Menu.AddMenuItem("~y~Завершить аренду", "", {doName: "stopRent"});
                break;
            case 8:
                UIMenu.Menu.AddMenuItem("~g~Начать рейс", "", {doName: "bus:start3"});
                UIMenu.Menu.AddMenuItem("~y~Завершить рейс", "Завершение рейса досрочно", {doName: "bus:stop"});
                UIMenu.Menu.AddMenuItem("~y~Завершить аренду", "", {doName: "stopRent"});
                break;
            case 10:
                UIMenu.Menu.AddMenuItem("~g~Получить задание", "", {doName: "gr6:start"});
                UIMenu.Menu.AddMenuItem("Разгрузить транспорт", "", {doName: "gr6:unload"});
                UIMenu.Menu.AddMenuItem("Вернуть транспорт в гараж", 'Залог в $4500 вернется вам на руки', {doName: "gr6:delete"});
                UIMenu.Menu.AddMenuItem("~y~Вызвать подмогу", 'Вызывает сотрудников LSPD и BCSD', {doName: "gr6:getHelp"});
                UIMenu.Menu.AddMenuItem("~b~Справка", 'Катайтесь по заданиям, собирайте деньги с магазинов и везите их в хранилище. Есть возможность работать с напарником, до 4 человек.');
                break;
            case 4:
                UIMenu.Menu.AddMenuItem("~g~Взять почту из транспорта", "", {doName: "mail:take"});
                UIMenu.Menu.AddMenuItem("~b~Справка", 'Возьмите почту из транспорта, далее езжай к любым жилым домам, подходи к дому нажимай E и кладите туда почту.');
                UIMenu.Menu.AddMenuItem("~y~Завершить аренду", "", {doName: "stopRent"});
                break;
        }
    }

    if (veh.getVariable('jobId') == 10) {
        UIMenu.Menu.AddMenuItem("Денег в транспорте: ~g~" + methods.moneyFormat(mp.players.local.vehicle.getVariable('gr6Money')), "", {doName: "close"});
        UIMenu.Menu.AddMenuItem("~y~Ограбить транспорт", "", {doName: "gr6:grab"});
    }

    if (veh.getVariable('taxi')) {
        UIMenu.Menu.AddMenuItem("~g~Получить заказ", "На перевозку NPC", {doName: "taxi:take"});
        UIMenu.Menu.AddMenuItem("~g~Диспетчерская", "", {doName: "taxi:dispatch"});
        UIMenu.Menu.AddMenuItem("~b~Справка", 'Вы можете перевозить NPC или игроков.');
    }
    else if (user.getCache('taxi_lic') && !veh.getVariable('jobId') && !veh.getVariable('fraction_id')) {
        if (user.getCache('isTaxi')) {
            UIMenu.Menu.AddMenuItem("~g~Диспетчерская", "", {doName: "taxi:dispatch"});
            UIMenu.Menu.AddMenuItem("~y~Закончить принимать заказы", "", {doName: "taxi:stop"});
        }
        else {
            UIMenu.Menu.AddMenuItem("~g~Начать принимать заказы", "", {doName: "taxi:start"});
        }
    }

    if (veh.getVariable('rentOwner') == user.getCache('id')) {
        UIMenu.Menu.AddMenuItem("~y~Завершить аренду", "", {doName: "stopRent"});
    }

    if (data.get('is_neon')) {
        UIMenu.Menu.AddMenuItem("~g~Вкл~s~ / ~r~выкл~s~ неон", "", {eventName: "server:vehicle:neonStatus"});
        UIMenu.Menu.AddMenuItemList("~b~Цвет неона", enums.rgbNames, "", {eventName: "server:vehicle:setNeonColor"});
        UIMenu.Menu.AddMenuItem("~b~Цвет неона RGB", "", {eventName: "server:vehicle:setNeonColor"});
    }

    if (data.get('colorl') >= 0) {
        let colorList = [
            'White',
            'Blue',
            'Light Blue',
            'Green',
            'Light Green',
            'Light Yellow',
            'Yellow',
            'Orange',
            'Red',
            'Light Pink',
            'Pink',
            'Purple',
            'Light Purple',
        ];
        UIMenu.Menu.AddMenuItemList("Сменить цвет фар", colorList, "", {doName: "setLight"}, data.get('colorl'));
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    let listIndex = 0;
    UIMenu.Menu.OnList.Add(async (item, index) => {
        listIndex = index;
        if (item.doName == 'setLight') {
            mp.events.callRemote('server:vehicle:setLight', index);
        }
        else if (item.eventName == 'server:vehicle:setNeonColor') {
            let rgb = enums.rgbColors[index];
            mp.events.callRemote(item.eventName, methods.parseInt(rgb[0]), methods.parseInt(rgb[1]), methods.parseInt(rgb[2]));
        }
    });

    UIMenu.Menu.OnSelect.Add(async (item, index) => {

        UIMenu.Menu.HideMenu();

        if (item.dispatchMark)
        {
            try {
                let id = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите номер", "", 5));
                if (id < 0) {
                    mp.game.ui.notifications.show('~r~ID не может быть меньше 0');
                    return;
                }
                dispatcher.sendLocal('Выдача маркировки', `~y~${user.getCache('name')}~s~ вышел в патруль с маркировкой ~y~${enums.dispatchMarkedList[listIndex]}-${id}`);
                mp.events.callRemote('server:vehicle:setDispatchMarked', methods.parseInt(id), enums.dispatchMarkedList[listIndex]);
            }
            catch (e) {
                methods.debug(e);
            }
        }
        else if (item.localCode)
        {
            menuList.showLocalCodeMenu();
        }
        else if (item.depCode)
        {
            menuList.showDepCodeMenu();
        }
        else if (item.sendChatMessage)
            chat.push(`${item.sendChatMessage}`);
        else if (item.doName == 'mail:take')
            mail.takeMail();
        else if (item.doName == 'taxi:take')
            taxi.take();
        else if (item.doName == 'taxi:dispatch')
            dispatcher.getTaxiMenu();
        else if (item.doName == 'taxi:start')
            user.set('isTaxi', true);
        else if (item.doName == 'taxi:stop')
            user.reset('isTaxi');
        else if (item.doName == 'bus:start1')
            bus.start(1);
        else if (item.doName == 'bus:start2')
            bus.start(2);
        else if (item.doName == 'bus:start3')
            bus.start(3);
        else if (item.doName == 'bus:stop')
            bus.stop();
        else if (item.doName == 'gr6:start')
            gr6.start();
        else if (item.doName == 'gr6:unload') {
            UIMenu.Menu.HideMenu();
            gr6.unload();
        }
        else if (item.doName == 'mech:dispatch')
            dispatcher.getMechMenu();
        else if (item.doName == 'mech:fuel') {
            UIMenu.Menu.HideMenu();
            let currentFuel = methods.parseInt(await vehicles.get(veh.getVariable('container'), 'mechFuel'));
            let id = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите ID", "", 3));
            if (id < 0) {
                mp.game.ui.notifications.show('~r~Значение не может быть меньше 0');
                return;
            }
            let count = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите количество", "", 3));
            if (count < 0) {
                mp.game.ui.notifications.show('~r~Значение не может быть меньше 0');
                return;
            }
            if (currentFuel === 0) {
                mp.game.ui.notifications.show(`~r~В транспорте нет топлива`);
                return;
            }
            if (count > currentFuel) {
                mp.game.ui.notifications.show(`~r~Значение не может быть больше ${currentFuel}`);
                return;
            }

            let price = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите цену", "", 3));
            if (price < 1) {
                mp.game.ui.notifications.show('~r~Значение не может быть меньше 1');
                return;
            }
            if (price > 5000) {
                mp.game.ui.notifications.show('~r~Значение не может быть больше 5000');
                return;
            }
            mp.events.callRemote('server:mechanic:fuel', id, count, price);
        }
        else if (item.doName == 'mech:fix') {
            UIMenu.Menu.HideMenu();
            let id = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите ID", "", 3));
            if (id < 0) {
                mp.game.ui.notifications.show('~r~Значение не может быть меньше 0');
                return;
            }
            let price = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите цену", "", 3));
            if (price < 1) {
                mp.game.ui.notifications.show('~r~Значение не может быть меньше 1');
                return;
            }
            if (price > 2000) {
                mp.game.ui.notifications.show('~r~Значение не может быть больше 2000');
                return;
            }
            mp.events.callRemote('server:mechanic:fix', id, price);
        }
        else if (item.doName == 'mech:flip') {
            UIMenu.Menu.HideMenu();
            let id = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите ID", "", 3));
            if (id < 0) {
                mp.game.ui.notifications.show('~r~Значение не может быть меньше 0');
                return;
            }
            let price = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите цену", "", 3));
            if (price < 1) {
                mp.game.ui.notifications.show('~r~Значение не может быть меньше 1');
                return;
            }
            if (price > 2000) {
                mp.game.ui.notifications.show('~r~Значение не может быть больше 2000');
                return;
            }
            mp.events.callRemote('server:mechanic:flip', id, price);
        }
        else if (item.doName == 'mech:fuel:1') {
            UIMenu.Menu.HideMenu();
            if (!timer.isFuel()) {
                mp.game.ui.notifications.show('~b~Вы должны находится на заправке');
                return;
            }
            let count = methods.parseInt(await UIMenu.Menu.GetUserInput("Количество", "", 3));
            if (count < 0) {
                mp.game.ui.notifications.show('~r~Значение не может быть меньше 0');
                return;
            }
            if (count > 500) {
                mp.game.ui.notifications.show('~r~Значение не может быть больше 500');
                return;
            }
            let shopId = fuel.findNearestId(mp.players.local.position);
            let price = await business.getPrice(shopId);
            fuel.fillMech(price, shopId, count);
        }
        else if (item.doName == 'gr6:delete') {
            UIMenu.Menu.HideMenu();
            gr6.deleteVeh();
        }
        else if (item.doName == 'gr6:grab')
            gr6.grab();
        else if (item.doName == 'gr6:getHelp') {
            dispatcher.sendLocalPos('Код 0', `${user.getCache('name')} - инкассация требует поддержки`, mp.players.local.position, 2);
            dispatcher.sendLocalPos('Код 0', `${user.getCache('name')} - инкассация требует поддержки`, mp.players.local.position, 5);
            mp.game.ui.notifications.show('~b~Вызов был отправлен');
        }
        else if (item.doName == 'trucker:getList0')
            mp.events.callRemote('server:trucker:showMenu', 0);
        else if (item.doName == 'trucker:getList1')
            mp.events.callRemote('server:trucker:showMenu', 1);
        else if (item.doName == 'trucker:getList2')
            mp.events.callRemote('server:trucker:showMenu', 2);
        else if (item.doName == 'trucker:stop')
            trucker.stop();
        else if (item.doName == 'stopRent') {
            vehicles.destroy();
        }
        else if (item.doName == 'tree:find')
            tree.start();
        else if (item.doName == 'tree:take0')
            tree.take(0);
        else if (item.doName == 'tree:take1')
            tree.take(1);
        else if (item.doName == 'tree:take2')
            tree.take(2);
        else if (item.doName == 'tree:stop')
            tree.stop();
        else if (item.doName == 'builder:find')
            builder.start();
        else if (item.doName == 'builder:take0')
            builder.take(0);
        else if (item.doName == 'builder:take1')
            builder.take(1);
        else if (item.doName == 'builder:take2')
            builder.take(2);
        else if (item.doName == 'builder:stop')
            builder.stop();
        else if (item.doName == 'photo:find')
            photo.start();
        else if (item.doName == 'photo:ask')
            photo.ask();
        /*else if (item.doName == 'showVehicleAutopilotMenu')
            menuList.showVehicleAutopilotMenu();*/
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

            try {
                if (data.get('user_id') > 0 && user.getCache('id') == data.get('user_id')) {
                    if (data.get('cop_park_name') !== '') {
                        mp.game.ui.notifications.show('~r~Для начала необходимо оплатить штраф');
                        return;
                    }
                }
            }
            catch (e) {
                methods.debug(e);
            }

            vehicles.engineVehicle();
        }
        else if (item.doName == 'showVehicleDoMenu') {
            menuList.showVehicleDoMenu();
        }
        else if (item.doName == 'eject') {
            let id = methods.parseInt(await UIMenu.Menu.GetUserInput("ID Игрока", "", 3));
            if (id < 0) {
                mp.game.ui.notifications.show('~r~ID не может быть меньше 0');
                return;
            }
            if (methods.parseInt(id) === mp.players.local.remoteId) {
                mp.game.ui.notifications.show('~r~Дядь, себя нельзя никак выкинуть из ТС');
                return;
            }
            mp.events.callRemote('server:vehicle:ejectById', methods.parseInt(id));
        }
        else if (item.eventName == 'server:vehicleFreeze') {
            if (methods.getCurrentSpeed() > 10) {
                mp.game.ui.notifications.show('~r~Скорость должна быть меньше 10 ед. в час');
                return;
            }

            let actualData = mp.players.local.vehicle.getVariable('vehicleSyncData');
            let isFreeze = !actualData.Anchor;
            vehicles.setAnchorState(isFreeze);

            if (isFreeze === true)
                mp.game.ui.notifications.show('~g~Вы поставили якорь');
            else
                mp.game.ui.notifications.show('~y~Вы сняли якорь');
        }
        else if (item.eventName == 'server:vehicle:park2') {

            UIMenu.Menu.HideMenu();

            let price = methods.getVehicleInfo(mp.players.local.vehicle.model).price * 0.01 + 100;
            if (price > 500)
                price = 500;

            if (user.getMoney() < price) {
                mp.game.ui.notifications.show('~y~У Вас недостаточно средств');
                return;
            }

            user.removeMoney(price, 'Оплата штрафа');
            mp.events.callRemote(item.eventName);
        }
        else if (item.eventName == 'server:vehicle:park') {
            UIMenu.Menu.HideMenu();
            if (ui.isGreenZone()) {
                mp.game.ui.notifications.show("~r~В Зелёной зоне парковка транспорта запрещена");
                return;
            }

            if (vehicles.checkerControl()) {
                mp.game.ui.notifications.show('~y~В таком положении транспорт не паркуется');
                return;
            }

            if (methods.getCurrentSpeed() > 10) {
                mp.game.ui.notifications.show('~y~Нельзя это делать на скорости');
                return;
            }
            let vInfo = methods.getVehicleInfo(mp.players.local.vehicle.model);
            if (mp.players.local.vehicle.isInWater() && vInfo.class_name !== 'Boats') {
                mp.game.ui.notifications.show('~y~Ты точно понимаешь адекватность этого поступка?');
                return;
            }

            mp.events.callRemote(item.eventName);
        }
        else if (item.eventName == 'server:vehicle:parkFraction') {
            UIMenu.Menu.HideMenu();

            if (vehicles.checkerControl()) {
                mp.game.ui.notifications.show('~y~В таком положении транспорт не паркуется');
                return;
            }

            if (methods.getCurrentSpeed() > 10) {
                mp.game.ui.notifications.show('~y~Нельзя это делать на скорости');
                return;
            }
            let vInfo = methods.getVehicleInfo(mp.players.local.vehicle.model);
            if (mp.players.local.vehicle.isInWater() && vInfo.class_name !== 'Boats') {
                mp.game.ui.notifications.show('~y~Ты точно понимаешь адекватность этого поступка?');
                return;
            }

            mp.events.callRemote(item.eventName);
        }
        else if (item.cargoUnloadId >= 0) {
            UIMenu.Menu.HideMenu();
            fraction.unloadCargoVehTimer(item.cargoUnloadId, item.cargoId);
        }
        /*else if (item.cargoUnloadAll) {
            UIMenu.Menu.HideMenu();
            try {
                if (user.getCache('fraction_id2') > 0) {
                    if (veh.getVariable('cargoId') !== null && veh.getVariable('cargoId') !== undefined) {
                        let boxes = JSON.parse(veh.getVariable('box'));
                        boxes.forEach((item, i) => {
                            if (item >= 0)
                            {
                                setTimeout(function () {
                                    mp.events.callRemote('server:vehicle:cargoUnload', i);
                                }, methods.getRandomInt(0, 2000));
                            }
                        });
                    }
                }
            }
            catch (e) {
                
            }
        }*/
        else if (item.emsUnloadAll) {
            UIMenu.Menu.HideMenu();
            mp.events.callRemote('server:ems:vehicleUnload');
        }
        else if (item.usmcUnloadAll) {
            UIMenu.Menu.HideMenu();
            mp.events.callRemote('server:usmc:vehicleUnload');
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

            if (r < 0 || g < 0 || b < 0) {
                mp.game.ui.notifications.show('~r~Цвет не должен быть меньше 0');
                return;
            }
            mp.events.callRemote(item.eventName, methods.parseInt(r), methods.parseInt(g), methods.parseInt(b));
        }
    });
};


menuList.showLocalCodeMenu = function() {

    UIMenu.Menu.Create("Коды", "~b~Локальные коды");

    UIMenu.Menu.AddMenuItem("Код 0", "Необходима немедленная поддержка", {code: 0});
    UIMenu.Menu.AddMenuItem("Код 1", "Информация подтверждена", {code: 1});
    UIMenu.Menu.AddMenuItem("Код 2", "Приоритетный вызов~br~(без сирен/со стобоскопами)", {code: 2});
    UIMenu.Menu.AddMenuItem("Код 3", "Срочный вызов~br~(сирены, стробоскопы)", {code: 3});
    UIMenu.Menu.AddMenuItem("Код 4", "Помощь не требуется.~br~Все спокойно", {code: 4});
    UIMenu.Menu.AddMenuItem("Код 5", "Держаться подальше", {code: 5});
    UIMenu.Menu.AddMenuItem("Код 6", "Задерживаюсь на месте", {code: 6});
    UIMenu.Menu.AddMenuItem("Код 7", "Перерыв на обед", {code: 7});
    //UIMenu.Menu.AddMenuItem("Код 8", "Необходим сотрудник пожарного департамента", {code: 87});
    //UIMenu.Menu.AddMenuItem("Код 9", "Необходим сотрудник EMS", {code: 9});
    UIMenu.Menu.AddMenuItem("Код 77", "Осторожно, возможна засада", {code: 77});
    UIMenu.Menu.AddMenuItem("Код 99", "Черезвычайная ситуация", {code: 99});
    UIMenu.Menu.AddMenuItem("Код 100", "В состоянии перехвата", {code: 100});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();
    
    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        dispatcher.codeLocal(item.code, user.getCache('name'));
    });
};

menuList.showDepCodeMenu = function() {

    UIMenu.Menu.Create("Коды", "~b~Коды департамента");

    UIMenu.Menu.AddMenuItem("Код 0", "Необходима немедленная поддержка", {code: 0});
    UIMenu.Menu.AddMenuItem("Код 1", "Информация подтверждена", {code: 1});
    UIMenu.Menu.AddMenuItem("Код 2", "Приоритетный вызов~br~(без сирен/со стобоскопами)", {code: 2});
    UIMenu.Menu.AddMenuItem("Код 3", "Срочный вызов~br~(сирены, стробоскопы)", {code: 3});
    UIMenu.Menu.AddMenuItem("Код 4", "Помощь не требуется.~br~Все спокойно", {code: 4});
    UIMenu.Menu.AddMenuItem("Код 5", "Держаться подальше", {code: 5});
    UIMenu.Menu.AddMenuItem("Код 6", "Задерживаюсь на месте", {code: 6});
    UIMenu.Menu.AddMenuItem("Код 7", "Перерыв на обед", {code: 7});
    UIMenu.Menu.AddMenuItem("Код 8", "Необходим сотрудник пожарного департамента", {code: 87});
    UIMenu.Menu.AddMenuItem("Код 9", "Необходим сотрудник EMS", {code: 9});
    UIMenu.Menu.AddMenuItem("Код 77", "Осторожно, возможна засада", {code: 77});
    UIMenu.Menu.AddMenuItem("Код 99", "Черезвычайная ситуация", {code: 99});
    UIMenu.Menu.AddMenuItem("Код 100", "В состоянии перехвата", {code: 100});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        dispatcher.codeDep(item.code, user.getCache('name'));
    });
};

/*menuList.showVehicleAutopilotMenu = function() {

    UIMenu.Menu.Create(`Транспорт`, `~b~Меню автопилота`);

    UIMenu.Menu.AddMenuItem("~g~Включить", "", {doName: "enable"});
    UIMenu.Menu.AddMenuItem("~y~Выключить", "", {doName: "disable"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {

        if (item.doName == 'enable') {
            vehicles.enableAutopilot();
        }
        else if (item.doName == 'disable') {
            vehicles.disableAutopilot();
        }
    });
};*/

menuList.showVehicleDoMenu = function() {

    try {
        UIMenu.Menu.Create(`Транспорт`, `~b~Нажмите Enter чтобы применить`);

        let listEn = ["~r~Выкл", "~g~Вкл"];
        let listOp = ["~r~Закрыт", "~g~Открыт"];

        let actualData = mp.players.local.vehicle.getVariable('vehicleSyncData');

        UIMenu.Menu.AddMenuItemList("Аварийка", listEn, "Поворотники включаются на ~b~[~s~ и ~b~]", {doName: "twoIndicator"}, actualData.IndicatorRightToggle === true && actualData.IndicatorLeftToggle === true ? 1 : 0);
        UIMenu.Menu.AddMenuItemList("Свет в салоне", listEn, "Днём очень плохо видно", {doName: "light"}, actualData.InteriorLight === true ? 1 : 0);
        UIMenu.Menu.AddMenuItemList("Капот", listOp, "", {doName: "hood"}, actualData.Hood === true ? 1 : 0);
        UIMenu.Menu.AddMenuItemList("Багажник", listOp, "", {doName: "trunk"}, actualData.Trunk === true ? 1 : 0);

        let vInfo = methods.getVehicleInfo(mp.players.local.vehicle.model);

        if (
            vInfo.class_name == 'Helicopters' ||
            vInfo.class_name == 'Planes' ||
            vInfo.class_name == 'Cycles' ||
            vInfo.class_name == 'Motorcycles' ||
            vInfo.class_name == 'Boats'
        ) {
        }
        else {
            UIMenu.Menu.AddMenuItem("Круиз контроль", "Введите значение", {doName: "cruise"});
        }

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        let listIndex = 0;
        UIMenu.Menu.OnList.Add((item, index) => {
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
            if (item.doName == 'twoIndicator') {
                vehicles.setIndicatorLeftState(listIndex == 1);
                vehicles.setIndicatorRightState(listIndex == 1);
            }
        });

        UIMenu.Menu.OnSelect.Add(async (item, index) => {

            if (item.doName == 'cruise') {
                UIMenu.Menu.HideMenu();
                let speed = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите скорость", "", 4));
                if (user.getCache('s_hud_speed_type')) {
                    let vSpeed = methods.parseInt(vehicles.getSpeedMax(mp.players.local.vehicle.model));
                    if (speed > vSpeed || speed < 0)
                        speed = 0;
                }
                else
                {
                    let vSpeed = methods.parseInt(vehicles.getSpeedMax(mp.players.local.vehicle.model) / 1.609);
                    if (speed > vSpeed || speed < 0)
                        speed = 0;
                }
                mp.events.call('client:setNewMaxSpeed', speed);
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showVehicleStatsMenu = function() {

    let vInfo = methods.getVehicleInfo(mp.players.local.vehicle.model);
    UIMenu.Menu.Create(`Транспорт`, `~b~Характеристики транспорта`);

    UIMenu.Menu.AddMenuItem("~b~Номер: ", "", {}, `${mp.players.local.vehicle.getNumberPlateText()}`);
    UIMenu.Menu.AddMenuItem("~b~Класс: ", "", {}, `${vInfo.class_name_ru}`);
    UIMenu.Menu.AddMenuItem("~b~Модель: ", "", {}, `${vInfo.display_name}`);
    if (vInfo.price > 0)
        UIMenu.Menu.AddMenuItem("~b~Гос. стоимость: ", "", {}, `~g~${methods.moneyFormat(vInfo.price)}`);
    if (vInfo.fuel_type > 0) {
        UIMenu.Menu.AddMenuItem("~b~Тип топлива: ", "", {}, `${vehicles.getFuelLabel(vInfo.fuel_type)}`);
        UIMenu.Menu.AddMenuItem("~b~Вместимость бака: ", "", {}, `${vInfo.fuel_full}${vehicles.getFuelPostfix(vInfo.fuel_type)}`);
        UIMenu.Menu.AddMenuItem("~b~Расход топлива: ", "", {}, `${vInfo.fuel_min}${vehicles.getFuelPostfix(vInfo.fuel_type)}`);
    }
    else
        UIMenu.Menu.AddMenuItem("~b~Расход топлива: ", "", {}, `~r~Отсутствует`);

    if (vInfo.stock > 0) {
        UIMenu.Menu.AddMenuItem("~b~Объем багажника: ", "", {}, `${vInfo.stock}см³`);
        let stockFull = vInfo.stock_full;
        if (vInfo.stock_full > 0)
            stockFull = stockFull / 1000;
        UIMenu.Menu.AddMenuItem("~b~Допустимый вес: ", "", {}, `${stockFull}кг.`);
    }
    else {
        UIMenu.Menu.AddMenuItem("~b~Багажник: ", "", {}, `~r~Отсутствует`);
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();
};

menuList.showSpawnJobCarMenu = function(price, x, y, z, heading, name, job) {

    UIMenu.Menu.Create(`Работа`, `~b~Меню рабочего ТС`);

    UIMenu.Menu.AddMenuItem("Арендовать рабочий транспорт", "Стоимость: ~g~" + methods.moneyFormat(price), {doName: "spawnCar"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName == 'spawnCar') {

            if (user.getMoney() < price) {
                mp.game.ui.notifications.show(`~r~У Вас недостаточно средств`);
                return;
            }

            user.removeMoney(methods.parseFloat(price), 'Аренда рабочего ТС');
            vehicles.spawnJobCar(x, y, z, heading, name, job);
        }
    });
};

menuList.showAveMenu = function() {

    UIMenu.Menu.Create(`Работа`, `~b~Меню священника`);

    UIMenu.Menu.AddMenuItem("Заключить брак", "Стоимость: ~g~10,000", {doName: "aveBrak"});
    UIMenu.Menu.AddMenuItem("Разорвать брак", "Стоимость: ~g~1,000", {doName: "noAveBrak"});
    UIMenu.Menu.AddMenuItem("РП смерть", "Стоимость: ~g~$500", {doName: "rpDeath"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
    });
};

menuList.showSpawnJobGr6Menu = function() {

    UIMenu.Menu.Create(`Gruppe6`, `~b~Меню Gruppe6`);

    UIMenu.Menu.AddMenuItem("~g~Начать рабочий день", "", {doName: "startDuty"});
    UIMenu.Menu.AddMenuItem("Арендовать транспорт", 'Цена за аренду: ~g~$500~s~~br~Залог: ~g~$4,500', {doName: "spawnCar"});
    UIMenu.Menu.AddMenuItem("~b~Стандартное вооружение (Taurus PT92)", 'Цена: ~g~$3,000', {doName: "getMore0"});
    //UIMenu.Menu.AddMenuItem("~b~Доп. вооружение (MP5A3 + Бронежилет)", 'Цена: ~g~$10,000').doName = 'getMore1';
    UIMenu.Menu.AddMenuItem("~r~Закончить рабочий день", "", {doName: "stopDuty"});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName == 'startDuty') {
            if (!user.getCache('gun_lic')) {
                mp.game.ui.notifications.show("~r~У Вас нет лицензии на оружие");
                return;
            }

            mp.events.callRemote('server:uniform:gr6');
            Container.Data.SetLocally(0, 'is6Duty', true);

            user.setArmour(20);

            mp.game.ui.notifications.show("~g~Вы вышли на дежурство");
        }
        if (item.doName == 'getMore0') {

            if (!user.getCache('gun_lic')) {
                mp.game.ui.notifications.show("~r~У Вас нет лицензии на оружие");
                return;
            }

            if (user.getCashMoney() < 3000) {
                mp.game.ui.notifications.show("~r~У Вас нет на руках $3000");
                return;
            }

            mp.events.callRemote('server:gun:buy', 77, 2250, 1, 0, 5, 0);
            mp.events.callRemote('server:gun:buy', 280, 850, 1, 0, 5, 0);
            user.setArmour(40);

            mp.game.ui.notifications.show("~g~Вы взяли стандартное вооружение");
        }
        /*if (item.doName == 'getMore1') {
            if (!Container.Data.HasLocally(0, 'is6Duty')) {
                mp.game.ui.notifications.show("~r~Вы не вышли на дежурство");
                return;
            }
            if (user.getCashMoney() < 10000) {
                mp.game.ui.notifications.show("~r~У Вас нет на руках $10,000");
                return;
            }

            mp.events.callRemote('server:gun:buy', 103, 9250, 1, 0, 5, 0);
            mp.events.callRemote('server:gun:buy', 280, 850, 1, 0, 5, 0);

            user.setArmour(100);
            mp.game.ui.notifications.show("~g~Вы купили MP5 и взяли в аренду бронежилет.");
        }*/
        if (item.doName == 'stopDuty') {
            user.updateCharacterCloth();
            user.setArmour(0);
            mp.game.ui.notifications.show("~y~Вы закончили дежурство и сдали бронежилет.");
            Container.Data.ResetLocally(0, 'is6Duty');
        }
        if (item.doName == 'spawnCar') {

            if (!Container.Data.HasLocally(0, 'is6Duty')) {
                mp.game.ui.notifications.show(`~r~Для начала необходимо выйти на дежурство`);
                return;
            }

            if (user.getMoney() < 5000) {
                mp.game.ui.notifications.show(`~r~У Вас недостаточно средств`);
                return;
            }

            user.removeMoney(5000.0001, 'Аренда рабочего ТС: Stockade');
            vehicles.spawnJobCar(-19.704904556274414, -671.88427734375, 31.945446014404297, 186.04244995117188, 'Stockade', 10);
        }
    });
};

menuList.showSpawnJobCarMailMenu = function() {

    UIMenu.Menu.Create(`Работа`, `~b~Меню рабочего ТС`);

    UIMenu.Menu.AddMenuItem("Boxville", "Стоимость: ~g~" + methods.moneyFormat(100), {doName: "spawnCar1"});
    UIMenu.Menu.AddMenuItem("Pony", "Стоимость: ~g~" + methods.moneyFormat(500), {doName: "spawnCar2"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName == 'spawnCar1') {

            if (user.getMoney() < 100) {
                mp.game.ui.notifications.show(`~r~У Вас недостаточно средств`);
                return;
            }
            user.removeMoney(100, 'Аренда рабочего ТС');
            vehicles.spawnJobCar(70.36360168457031, 121.7760009765625, 79.07405090332031, 159.3450927734375, "Boxville2", 4);
        }
        if (item.doName == 'spawnCar2') {

            if (user.getMoney() < 500) {
                mp.game.ui.notifications.show(`~r~У Вас недостаточно средств`);
                return;
            }
            user.removeMoney(500, 'Аренда рабочего ТС');
            vehicles.spawnJobCar(61.768699645996094, 125.43084716796875, 78.99858856201172, 158.8726806640625, "Pony", 4);
        }
    });
};

menuList.showSpawnJobCarTaxiMenu = function() {

    UIMenu.Menu.Create(`Работа`, `~b~Меню рабочего ТС`);

    UIMenu.Menu.AddMenuItem("Dynasty", "Стоимость: ~g~" + methods.moneyFormat(100), {doName: "spawnCar1"});
    UIMenu.Menu.AddMenuItem("Issi", "Стоимость: ~g~" + methods.moneyFormat(200), {doName: "spawnCar2"});
    UIMenu.Menu.AddMenuItem("Stanier", "Стоимость: ~g~" + methods.moneyFormat(500), {doName: "spawnCar3"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName == 'spawnCar1') {
            if (!user.getCache('taxi_lic')) {
                mp.game.ui.notifications.show(`~r~У Вас нет лицензии на перевозку пассажиров`);
                return;
            }
            if (user.getMoney() < 100) {
                mp.game.ui.notifications.show(`~r~У Вас недостаточно средств`);
                return;
            }
            user.removeMoney(100, 'Аренда рабочего ТС');
            vehicles.spawnJobCar(897.9505615234375, -183.98391723632812, 73.38378143310547, 241.78759765625, "Dynasty", 99);
        }
        if (item.doName == 'spawnCar2') {
            if (!user.getCache('taxi_lic')) {
                mp.game.ui.notifications.show(`~r~У Вас нет лицензии на перевозку пассажиров`);
                return;
            }
            if (user.getMoney() < 200) {
                mp.game.ui.notifications.show(`~r~У Вас недостаточно средств`);
                return;
            }
            user.removeMoney(200, 'Аренда рабочего ТС');
            vehicles.spawnJobCar(897.9505615234375, -183.98391723632812, 73.38378143310547, 241.78759765625, "Issi3", 99);
        }
        if (item.doName == 'spawnCar3') {
            if (!user.getCache('taxi_lic')) {
                mp.game.ui.notifications.show(`~r~У Вас нет лицензии на перевозку пассажиров`);
                return;
            }
            if (user.getMoney() < 500) {
                mp.game.ui.notifications.show(`~r~У Вас недостаточно средств`);
                return;
            }
            user.removeMoney(500, 'Аренда рабочего ТС');
            vehicles.spawnJobCar(897.9505615234375, -183.98391723632812, 73.38378143310547, 241.78759765625, "Taxi", 99);
        }
    });
};

menuList.showSellItemsMenu = function(data) {

    try {
        UIMenu.Menu.Create('Конфискат', `~b~Сдача конфиската`);

        data.forEach((item, idx) => {
            let formatItem = items.getItemFormat(item);
            let desc = formatItem.desc;
            let itemName = formatItem.name;
            let price = items.getItemPrice(item.item_id);
            if (price === 111111)
                price = 100;
            UIMenu.Menu.AddMenuItem(`${itemName}`, `${desc}~br~Цена: ~g~${methods.moneyFormat(price)}`, {itemId: item.item_id, id: item.id, desc: desc, price: price});
        });

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            UIMenu.Menu.HideMenu();
            if (item.itemId >= 0) {
                try {
                    coffer.addMoney(coffer.getIdByFraction(user.getCache('fraction_id')), item.price);
                    inventory.deleteItem(item.id);

                    methods.saveFractionLog(
                        user.getCache('name'),
                        `Сдал ${items.getItemNameById(item.itemId)}`,
                        `Пополнено: ${methods.moneyFormat(item.price)}`,
                        user.getCache('fraction_id')
                    );

                    user.addHistory(5, `Сдал ${items.getItemNameById(item.itemId)} ${item.desc}`);

                    mp.game.ui.notifications.show("~b~Вы сдали конфискат, бюджет организации был пополнен");
                }
                catch (e) {
                    methods.debug(e);
                }
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showSellGunMenu = function(data) {

    try {
        UIMenu.Menu.Create('Переплав', `~b~Обмен оружия на стальные пластины`);

        data.forEach((item, idx) => {
            let formatItem = items.getItemFormat(item);
            let desc = formatItem.desc;
            let itemName = formatItem.name;
            let count = 1;
            if (item.item_id >= 85 && item.item_id <= 126)
                count = 2;
            UIMenu.Menu.AddMenuItem(`${itemName}`, `${desc}~br~Взнос: ~g~$100~s~~br~Кол-во: ~g~${count}шт.`, {count: count, id: item.id});
        });

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            UIMenu.Menu.HideMenu();
            if (item.id >= 0) {
                try {
                    if (user.getMoney() < 100) {
                        mp.game.ui.notifications.show("~r~У вас нет $100 на руках");
                        return;
                    }
                    user.removeMoney(100, 'Обмен стали');
                    inventory.deleteItem(item.id);
                    inventory.addItem(476, item.count, 1, user.getCache('id'), 1);
                    mp.game.ui.notifications.show("~b~Вы обменяли оружие на стальную пластину");
                }
                catch (e) {
                    methods.debug(e);
                }
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showFixGunMenu = function(data) {

    try {
        UIMenu.Menu.Create('Починка', `~b~Починка оружия и бронежилетов`);

        data.forEach((item, idx) => {
            let formatItem = items.getItemFormat(item);
            let desc = formatItem.desc;
            let itemName = formatItem.name;
            UIMenu.Menu.AddMenuItem(`${itemName}`, `${desc}~br~~c~Необходима 1 стальная пластина.`, {id: item.id});
        });

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            UIMenu.Menu.HideMenu();
            if (item.id >= 0) {
                try {
                    mp.events.callRemote('server:inventory:fixItem', item.id)
                }
                catch (e) {
                    methods.debug(e);
                }
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showSellClothMenu = function(data) {

    try {
        UIMenu.Menu.Create('Фабрика', `~b~Обмен одежды на ткань`);

        data.forEach((item, idx) => {
            let formatItem = items.getItemFormat(item);
            let desc = formatItem.desc;
            let itemName = formatItem.name;
            let count = 1;
            if (item.item_id === 265 || item.item_id === 266 || item.item_id === 274)
                count = 2;
            UIMenu.Menu.AddMenuItem(`${itemName}`, `${desc}~br~Взнос: ~g~$50~s~~br~Кол-во: ~g~${count}шт.`, {count: count, id: item.id});
        });

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            UIMenu.Menu.HideMenu();
            if (item.id >= 0) {
                try {
                    if (user.getMoney() < 50) {
                        mp.game.ui.notifications.show("~r~У вас нет $50 на руках");
                        return;
                    }
                    user.removeMoney(50, 'Обмен ткани');
                    inventory.deleteItem(item.id);
                    inventory.addItem(475, item.count, 1, user.getCache('id'), 1);
                    mp.game.ui.notifications.show("~b~Вы обменяли одежду на ткань");
                }
                catch (e) {
                    methods.debug(e);
                }
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showSellFishMenu = async function(data, shopId) {

    try {
        let tradeList = JSON.parse(await Container.Data.Get(-99, 'fishTrade'));

        let procent = methods.parseInt(await business.getPrice(shopId) * 10);
        UIMenu.Menu.Create('Скупка', `~b~Доля владельца: ${procent}%`);

        let priceAll = 0;

        data.forEach((item, idx) => {

            let price = items.getItemPrice(item.item_id);
            tradeList.forEach(fishItem => {
                if (fishItem[0] === item.item_id)
                    price = fishItem[4];
            });

            priceAll = priceAll + price;

            let formatItem = items.getItemFormat(item);
            let desc = formatItem.desc;
            let itemName = formatItem.name;
            UIMenu.Menu.AddMenuItem(`${itemName}`, `${desc}~br~Цена: ~g~${methods.moneyFormat(price)}~br~~c~Без учёта процента`, {price: price, id: item.id});
        });

        UIMenu.Menu.AddMenuItem(`~y~Продать всю рыбу`, `Цена: ~g~${methods.moneyFormat(priceAll)}~br~~c~Без учёта процента`, {price: priceAll, sellAll: true});

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            UIMenu.Menu.HideMenu();
            if (item.id >= 0) {

                if (!user.getCache('fish_lic')) {
                    mp.game.ui.notifications.show(`~r~У вас нет лицензии рыболова`);
                    return;
                }

                try {
                    quest.fish(false, -1, 3);
                    business.addMoney(shopId, item.price / procent, 'Доля с продажи рыбы');
                    user.addMoney(item.price - (item.price / procent), 'Продажа рыбы');
                    inventory.deleteItem(item.id);
                    mp.game.ui.notifications.show(`~b~Вы продали рыбу по цене: ~s~${methods.moneyFormat(item.price - (item.price / procent))}`);
                }
                catch (e) {
                    methods.debug(e);
                }
            }
            if (item.sellAll) {
                if (!user.getCache('fish_lic')) {
                    mp.game.ui.notifications.show(`~r~У вас нет лицензии рыболова`);
                    return;
                }
                try {
                    quest.fish(false, -1, 3);
                    business.addMoney(shopId, item.price / 10, 'Доля с продажи рыбы');
                    user.addMoney(item.price, 'Продажа всей рыбы');
                    inventory.deleteItemsRange(487, 536);
                    mp.game.ui.notifications.show(`~b~Вы продали рыбу по цене: ~s~${methods.moneyFormat(item.price)}`);
                }
                catch (e) {
                    methods.debug(e);
                }
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
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

                let formatItem = items.getItemFormat(item);
                let desc = formatItem.desc;
                let itemName = formatItem.name;

                if (item.is_equip == 1 && ownerType == 1 && ownerId == user.getCache('id')) {

                    let success = true;

                    if (item.item_id == 50) {
                        if (params.number != user.getCache('bank_card')) {
                            inventory.updateEquipStatus(item.id, false);
                            success = false;
                        }
                    }
                    if (item.item_id <= 30 && item.item_id >= 27) {
                        if (params.number != user.getCache('phone')) {
                            inventory.updateEquipStatus(item.id, false);
                            success = false;
                        }
                    }

                    if (items.isWeapon(item.item_id)) {

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
                            counti: item.count < 0 ? 100 : item.count,
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

        let recepts = [];
        let userRecepts = JSON.parse(user.getCache('recepts'));
        items.recipes.forEach(item => {
            if (userRecepts.includes(item.id) || item.id === 2) {
                recepts.push(item);
            }
            else if (user.getCache('fraction_id2') > 0 && item.id >= 5 && item.id <= 17)
                recepts.push(item);
        });
        let dataSend4 = {
            type: 'updateCraft',
            recipes: recepts,
        };
        ui.callCef('inventory', JSON.stringify(dataSend4));

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
            let bankEquip = false;
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

            user.setInvEquipWeapon(equipWeapons);

            equipItems.forEach(item => {
                if (methods.parseInt(item.item_id) == 50) {
                    if (methods.parseInt(item.params.number) == methods.parseInt(user.getCache('bank_card'))) {
                        bankEquip = true;
                    }
                }
            });
            if (bankEquip === false) {
                inventory.updateItemsEquipByItemId(50, user.getCache('id'), inventory.types.Player, 0);
                user.set('bank_card', 0);
                user.set('bank_owner', '');
                user.set('bank_pin', 0);
                user.setBankMoney(0);
                user.save();
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

    UIMenu.Menu.Create(`LifeInvader`, `~b~Меню LifeInvader`);

    let price = 200;
    UIMenu.Menu.AddMenuItem("Арендовать рабочий транспорт", "Стоимость: ~g~" + methods.moneyFormat(price), {doName: "spawnCar"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
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

            user.removeMoney(price, 'Аренда рабочего ТС');
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

    let title = '';
    if (bankId === 1)
        title = 'b_mb';
    if (bankId === 2)
        title = 'b_pacific';
    if (bankId === 3)
        title = 'b_fleeca';
    if (bankId === 4)
        title = 'b_blaine';

    if (
        bankId == 1 && getBankPrefix == 6000 ||
        bankId == 2 && getBankPrefix == 7000 ||
        bankId == 3 && getBankPrefix == 8000 ||
        bankId == 4 && getBankPrefix == 9000
    ) {

        let pin = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите пинкод", "", 4));

        if (pin == user.getCache('bank_pin')) {
            UIMenu.Menu.Create(` `, `~b~Нажмите ~g~Enter~b~, чтобы выбрать пункт`, 'bank', false, false, title);
            UIMenu.Menu.AddMenuItem("~b~Баланс", "", {}, '~g~' + methods.moneyFormat(user.getBankMoney(), 99999999999));
            UIMenu.Menu.AddMenuItem("~b~Номер карты", "", {}, methods.bankFormat(user.getCache('bank_card')));
            UIMenu.Menu.AddMenuItem("~b~Владелец карты", "", {}, methods.bankFormat(user.getCache('bank_owner')));

            UIMenu.Menu.AddMenuItem("Снять средства", "", {eventName: "server:bank:withdraw"});
            UIMenu.Menu.AddMenuItem("Положить средства", "", {eventName: "server:bank:deposit"});
            UIMenu.Menu.AddMenuItem("Перевести на другой счет", '1% от суммы, при переводе', {eventName: "server:bank:transferMoney"});

            //UIMenu.Menu.AddMenuItem("~b~История по счёту").eventName = 'server:bank:history';

            UIMenu.Menu.AddMenuItem("~y~Сменить пинкод", "", {eventName: "server:bank:changePin"});
            UIMenu.Menu.AddMenuItem("~r~Закрыть счёт", "", {eventName: "server:bank:closeCard"});
            UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
            UIMenu.Menu.Draw();

            UIMenu.Menu.OnSelect.Add(async (item, index) => {
                UIMenu.Menu.HideMenu();
                if (item.eventName == 'server:bank:withdraw') {
                    let mStr = await UIMenu.Menu.GetUserInput("Сумма снятия", "", 9);
                    if (mStr == '')
                        return;
                    let money = methods.parseFloat(mStr);
                    if (user.getBankMoney() > money)
                        user.setCache('money_bank', user.getBankMoney() - methods.parseFloat(money));
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
                    if (bankNumber < 9999)
                        return;
                    let money = methods.parseFloat(await UIMenu.Menu.GetUserInput("Сумма перевода", "", 9));
                    if (money < 0)
                        return;
                    mp.events.callRemote(item.eventName, bankNumber.toString(), money);
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
        UIMenu.Menu.Create(` `, `~b~Нажмите ~g~Enter~b~, чтобы выбрать пункт`, 'bank', false, false, title);
        UIMenu.Menu.AddMenuItem("Оформить карту банка", "Цена: ~g~$" + (price * 100), {eventName: "server:bank:openCard"});
        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
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

    if (user.getCache('bank_card') < 1) {
        mp.game.ui.notifications.show("~r~У Вас нет банковской карты");
        return;
    }

    let pin = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите пинкод", "", 4));
    if (pin != user.getCache('bank_pin')) {
        mp.game.ui.notifications.show(`~r~Вы ввели не верный пинкод`);
        return;
    }
    let getBankPrefix = user.getBankCardPrefix();
    let title = '';
    if (getBankPrefix === 6000)
        title = 'b_mb';
    if (getBankPrefix === 7000)
        title = 'b_pacific';
    if (getBankPrefix === 8000)
        title = 'b_fleeca';
    if (getBankPrefix === 9000)
        title = 'b_blaine';

    UIMenu.Menu.Create(` `, `~b~Нажмите ~g~Enter~b~, чтобы выбрать пункт`, 'bank', false, false, title);

    UIMenu.Menu.AddMenuItem("~b~Баланс", "", {}, '~g~' + methods.moneyFormat(user.getBankMoney(), 99999999999));
    UIMenu.Menu.AddMenuItem("~b~Номер карты", "", {}, methods.bankFormat(user.getCache('bank_card')));
    UIMenu.Menu.AddMenuItem("~b~Владелец карты", "", {}, methods.bankFormat(user.getCache('bank_owner')));

    UIMenu.Menu.AddMenuItem("Снять средства", '~r~Комиссия~s~ 1%', {eventName: "server:bank:withdraw"});
    UIMenu.Menu.AddMenuItem("Положить средства", '~r~Комиссия~s~ 1%', {eventName: "server:bank:deposit"});
    UIMenu.Menu.AddMenuItem("Перевести на другой счет", '1% от суммы, при переводе', {eventName: "server:bank:transferMoney"});

    //UIMenu.Menu.AddMenuItem("~b~История по счёту").eventName = 'server:bank:history';

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.eventName == 'server:bank:withdraw') {
            let money = methods.parseFloat(await UIMenu.Menu.GetUserInput("Сумма снятия", "", 11));
            if (user.getBankMoney() > money)
                user.setCache('money_bank', user.getBankMoney() - methods.parseFloat(money));
            mp.events.callRemote(item.eventName, money, 1);
        }
        else if (item.eventName == 'server:bank:deposit') {
            let money = methods.parseFloat(await UIMenu.Menu.GetUserInput("Сумма внесения", "", 11));
            mp.events.callRemote(item.eventName, money, 1);
        }
        else if (item.eventName == 'server:bank:transferMoney') {
            let bankNumber = methods.parseInt(await UIMenu.Menu.GetUserInput("Номер карты", "", 16));
            if (bankNumber < 9999)
                return;
            let money = methods.parseFloat(await UIMenu.Menu.GetUserInput("Сумма перевода", "", 9));
            if (money < 0)
                return;
            mp.events.callRemote(item.eventName, bankNumber.toString(), money);
        }
        else if (item.eventName == 'server:bank:history') {
            mp.events.callRemote(item.eventName);
        }
    });
};

menuList.showFuelMenu = async function() {
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    let shopId = fuel.findNearestId(mp.players.local.position);
    let price = await business.getPrice(shopId);

    UIMenu.Menu.Create(`Заправка`, `~b~Нажмите ~g~Enter~b~, чтобы заправить`);

    let saleLabel = '';
    let sale = business.getSale(price);
    if (sale > 0)
        saleLabel = `~br~~s~Скидка: ~r~${sale}%`;

    let list = ["1L", "5L", "10L", "FULL"];
    let list2 = ["1%", "5%", "10%", "FULL"];

    let itemPrice = 1.5 * price;
    let listItem = {};

    if (mp.players.local.isInAnyVehicle(true)) {
        listItem.type = 1;
        listItem.price = itemPrice;
        UIMenu.Menu.AddMenuItemList("Бензин", list, `Цена: ~g~${methods.moneyFormat(itemPrice)}~s~ за 1л.${saleLabel}`, listItem, 0, '', (sale > 0) ? 'sale' : '');

        itemPrice = 1.1 * price;
        listItem = {};
        listItem.type = 2;
        listItem.price = itemPrice;
        UIMenu.Menu.AddMenuItemList("Дизель", list, `Цена: ~g~${methods.moneyFormat(itemPrice)}~s~ за 1л.${saleLabel}`, listItem, 0, '', (sale > 0) ? 'sale' : '');

        itemPrice = 0.5 * price;
        listItem = {};
        listItem.type = 3;
        listItem.price = itemPrice;
        UIMenu.Menu.AddMenuItemList("Электричество", list2, `Цена: ~g~${methods.moneyFormat(itemPrice)}~s~ за 1%${saleLabel}`, listItem, 0, '', (sale > 0) ? 'sale' : '');

        itemPrice = 3 * price;
        listItem = {};
        listItem.type = 4;
        listItem.price = itemPrice;
        UIMenu.Menu.AddMenuItemList("Авиатопливо", list, `Цена: ~g~${methods.moneyFormat(itemPrice)}~s~ за 1л.${saleLabel}`, listItem, 0, '', (sale > 0) ? 'sale' : '');
    }

    itemPrice = items.getItemPrice(8) * price;
    let menuItem = {};
    menuItem.price = itemPrice;
    menuItem.itemId = 8;
    UIMenu.Menu.AddMenuItem("Канистра (Авиатопливо)", `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '');

    itemPrice = items.getItemPrice(9) * price;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.itemId = 9;
    UIMenu.Menu.AddMenuItem("Канистра (Бензин)", `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '');

    itemPrice = items.getItemPrice(10) * price;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.itemId = 10;
    UIMenu.Menu.AddMenuItem("Канистра (Дизель)", `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '');

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    let listIndex = 0;
    UIMenu.Menu.OnList.Add((item, index) => {
        listIndex = index;
    });
    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.type)
        {
            if (mp.players.local.vehicle.getPedInSeat(-1) === mp.players.local.handle) {
                fuel.fillVeh(item.price, shopId, item.type, listIndex);
            }
            else {
                mp.game.ui.notifications.show(`~r~Вы не можете совершать покупку на пассажирском сиденье`);
            }
        }
        if (item.itemId) {
            mp.events.callRemote('server:shop:buy', item.itemId, item.price, shopId);
        }
    });
};

menuList.showBarberShopMenu = function (shopId, price) {

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    let title1 = "";
    switch (shopId) {
        case 30:
        case 31:
        case 32:
            title1 = "bs_herr";
            break;
        case 33:
            title1 = "bs_beach";
            break;
        case 34:
            title1 = "bs_sheas";
            break;
        case 36:
            title1 = "bs_hair";
            break;
        case 35:
            title1 = "bs_bob";
            break;
    }


    let skin = {};

    skin.SKIN_HAIR = methods.parseInt(user.getCache('SKIN_HAIR'));
    skin.SKIN_HAIR_2 = methods.parseInt(user.getCache('SKIN_HAIR_2'));
    skin.SKIN_HAIR_3 = methods.parseInt(user.getCache('SKIN_HAIR_3'));
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

    UIMenu.Menu.Create(" ", "~b~Влево/вправо менять внешность", 'showBarberShopMenu', false, false, title1);

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

    let saleLabel = '';
    let sale = business.getSale(price);
    if (sale > 0)
        saleLabel = `~br~~s~Скидка: ~r~${sale}%`;

    let itemPrice = 400 * price;
    let menuListItem = {};
    menuListItem.doName = 'SKIN_HAIR';
    menuListItem.price = itemPrice + 0.01;
    menuListItem.label = "Причёска";
    UIMenu.Menu.AddMenuItemList('Причёска', list, `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuListItem, skin.SKIN_HAIR, '', (sale > 0) ? 'sale' : '');

    itemPrice = 100 * price;
    menuListItem = {};
    menuListItem.doName = 'SKIN_HAIR_3';
    menuListItem.price = itemPrice + 0.01;
    menuListItem.label = "Стиль причёски";
    UIMenu.Menu.AddMenuItemList('Стиль причёски', list, `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuListItem, skin.SKIN_HAIR_3, '', (sale > 0) ? 'sale' : '');

    itemPrice = 10 * price;
    menuListItem = {};
    menuListItem.doName = 'SKIN_HAIR_2';
    menuListItem.price = itemPrice + 0.01;
    menuListItem.label = "Тип причёски";
    UIMenu.Menu.AddMenuItemList('Тип причёски', ['Выкл', 'Вкл'], `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuListItem, skin.SKIN_HAIR_2, '', (sale > 0) ? 'sale' : '');

    list = [];
    for (let j = 0; j < 64; j++) {
        list.push(j + '');
    }

    itemPrice = 200 * price;
    menuListItem = {};
    menuListItem.doName = 'SKIN_HAIR_COLOR';
    menuListItem.price = itemPrice + 0.01;
    menuListItem.label = "Цвет волос";
    UIMenu.Menu.AddMenuItemList('Цвет волос', list, `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuListItem, skin.SKIN_HAIR_COLOR, '', (sale > 0) ? 'sale' : '');

    list = [];
    for (let j = 0; j < 64; j++) {
        list.push(j + '');
    }

    itemPrice = 200 * price;
    menuListItem = {};
    menuListItem.doName = 'SKIN_HAIR_COLOR_2';
    menuListItem.price = itemPrice + 0.01;
    menuListItem.label = "Мелирование волос";
    UIMenu.Menu.AddMenuItemList('Мелирование волос', list, `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuListItem, skin.SKIN_HAIR_COLOR_2, '', (sale > 0) ? 'sale' : '');

    list = [];
    for (let j = 0; j < 32; j++) {
        list.push(j + '');
    }

    itemPrice = 120 * price;
    menuListItem = {};
    menuListItem.doName = 'SKIN_EYE_COLOR';
    menuListItem.price = itemPrice + 0.01;
    menuListItem.label = "Цвет глаз";
    UIMenu.Menu.AddMenuItemList('Цвет глаз', list, `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuListItem, skin.SKIN_EYE_COLOR, '', (sale > 0) ? 'sale' : '');

    list = [];
    for (let j = 0; j < 30; j++) {
        list.push(j + '');
    }

    itemPrice = 70 * price;
    menuListItem = {};
    menuListItem.doName = 'SKIN_EYEBROWS';
    menuListItem.price = itemPrice + 0.01;
    menuListItem.label = "Брови";
    UIMenu.Menu.AddMenuItemList('Брови', list, `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuListItem, skin.SKIN_EYEBROWS, '', (sale > 0) ? 'sale' : '');

    list = [];
    for (let j = 0; j < 64; j++) {
        list.push(j + '');
    }

    itemPrice = 60 * price;
    menuListItem = {};
    menuListItem.doName = 'SKIN_EYEBROWS_COLOR';
    menuListItem.price = itemPrice + 0.01;
    UIMenu.Menu.AddMenuItemList('Цвет бровей', list, `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuListItem, skin.SKIN_EYEBROWS_COLOR, '', (sale > 0) ? 'sale' : '');

    list = ['~r~Нет'];
    for (let j = 0; j < 10; j++) {
        list.push(j + '');
    }

    itemPrice = 250 * price;
    menuListItem = {};
    menuListItem.doName = 'SKIN_OVERLAY_9';
    menuListItem.price = itemPrice + 0.01;
    menuListItem.label = "Веснушки";
    UIMenu.Menu.AddMenuItemList('Веснушки', list, `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuListItem, skin.SKIN_OVERLAY_9 + 1, '', (sale > 0) ? 'sale' : '');

    if (user.getSex() == 0) {
        list = ['~r~Нет'];
        for (let j = 0; j < 30; j++) {
            list.push(j + '');
        }

        itemPrice = 250 * price;
        menuListItem = {};
        menuListItem.doName = 'SKIN_OVERLAY_1';
        menuListItem.price = itemPrice + 0.01;
        menuListItem.label = "Борода";
        UIMenu.Menu.AddMenuItemList('Борода', list, `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuListItem, skin.SKIN_OVERLAY_1 + 1, '', (sale > 0) ? 'sale' : '');

        list = [];
        for (let j = 0; j < 64; j++) {
            list.push(j + '');
        }

        itemPrice = 120 * price;
        menuListItem = {};
        menuListItem.doName = 'SKIN_OVERLAY_COLOR_1';
        menuListItem.price = itemPrice + 0.01;
        menuListItem.label = "Цвет бороды";
        UIMenu.Menu.AddMenuItemList('Цвет бороды', list, `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuListItem, skin.SKIN_OVERLAY_COLOR_1, '', (sale > 0) ? 'sale' : '');

        list = ['~r~Нет'];
        for (let j = 0; j < mp.game.ped.getNumHeadOverlayValues(10) + 1; j++) {
            list.push(j + '');
        }

        itemPrice = 600 * price;
        menuListItem = {};
        menuListItem.doName = 'SKIN_OVERLAY_10';
        menuListItem.price = itemPrice + 0.01;
        menuListItem.label = "Волосы на груди";
        UIMenu.Menu.AddMenuItemList('Волосы на груди', list, `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuListItem, skin.SKIN_OVERLAY_10 + 1, '', (sale > 0) ? 'sale' : '');
    }

    list = ['~r~Нет'];
    for (let j = 0; j < mp.game.ped.getNumHeadOverlayValues(8) + 1; j++) {
        list.push(j + '');
    }

    itemPrice = 250 * price;
    menuListItem = {};
    menuListItem.doName = 'SKIN_OVERLAY_8';
    menuListItem.price = itemPrice + 0.01;
    menuListItem.label = "Помада";
    UIMenu.Menu.AddMenuItemList('Помада', list, `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuListItem, skin.SKIN_OVERLAY_8 + 1, '', (sale > 0) ? 'sale' : '');

    list = [];
    for (let j = 0; j < 60; j++) {
        list.push(j + '');
    }

    itemPrice = 110 * price;
    menuListItem = {};
    menuListItem.doName = 'SKIN_OVERLAY_COLOR_8';
    menuListItem.price = itemPrice + 0.01;
    menuListItem.label = "Цвет помады";
    UIMenu.Menu.AddMenuItemList('Цвет помады', list, `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuListItem, skin.SKIN_OVERLAY_COLOR_8, '', (sale > 0) ? 'sale' : '')

    list = ['~r~Нет'];
    for (let j = 0; j < 7; j++) {
        list.push(j + '');
    }

    itemPrice = 250 * price;
    menuListItem = {};
    menuListItem.doName = 'SKIN_OVERLAY_5';
    menuListItem.price = itemPrice + 0.01;
    menuListItem.label = "Румянец";
    UIMenu.Menu.AddMenuItemList('Румянец', list, `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuListItem, skin.SKIN_OVERLAY_5 + 1, '', (sale > 0) ? 'sale' : '')

    list = [];
    for (let j = 0; j < 60; j++) {
        list.push(j + '');
    }

    itemPrice = 110 * price;
    menuListItem = {};
    menuListItem.doName = 'SKIN_OVERLAY_COLOR_5';
    menuListItem.price = itemPrice + 0.01;
    menuListItem.label = "Цвет румянца";
    UIMenu.Menu.AddMenuItemList('Цвет румянца', list, `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuListItem, skin.SKIN_OVERLAY_COLOR_5, '', (sale > 0) ? 'sale' : '')

    list = ['~r~Нет'];
    for (let j = 0; j < mp.game.ped.getNumHeadOverlayValues(4) + 1; j++) {
        list.push(j + '');
    }

    itemPrice = 1000 * price;
    menuListItem = {};
    menuListItem.doName = 'SKIN_OVERLAY_4';
    menuListItem.price = itemPrice + 0.01;
    menuListItem.label = "Макияж";
    UIMenu.Menu.AddMenuItemList('Макияж', list, `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuListItem, skin.SKIN_OVERLAY_4 + 1, '', (sale > 0) ? 'sale' : '');

    list = [];
    for (let j = 0; j < 10; j++) {
        list.push(j + '');
    }

    itemPrice = 150 * price;
    menuListItem = {};
    menuListItem.doName = 'SKIN_OVERLAY_COLOR_4';
    menuListItem.price = itemPrice + 0.01;
    menuListItem.label = "Цвет макияжа";
    UIMenu.Menu.AddMenuItemList('Цвет макияжа', list, `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuListItem, skin.SKIN_OVERLAY_COLOR_4, '', (sale > 0) ? 'sale' : '');

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnClose.Add((sender) =>
    {
        user.updateCharacterFace();
    });

    let currentListChangeItem = '';
    let currentListChangeItemIndex = 0;

    UIMenu.Menu.OnList.Add((item, index) => {
        try {
            currentListChangeItem = item.doName;
            currentListChangeItemIndex = index;

            methods.debug(item.doName, index);

            switch (item.doName) {
                case 'SKIN_HAIR':

                    if (index == 23 || index == 24)
                        skin.SKIN_HAIR = 1;
                    else
                        skin.SKIN_HAIR = index;
                    mp.players.local.setComponentVariation(2, skin.SKIN_HAIR, 0, 2);
                    mp.players.local.setHairColor(skin.SKIN_HAIR_COLOR, skin.SKIN_HAIR_COLOR_2);

                    user.updateTattoo(true, true, true, false);

                    if (skin.SKIN_HAIR_2) {
                        let data = JSON.parse(enums.overlays)[user.getSex()][skin.SKIN_HAIR];
                        user.setDecoration(data[0], data[1], true);
                    }

                    let data2 = JSON.parse(enums.overlays)[user.getSex()][skin.SKIN_HAIR_3];
                    user.setDecoration(data[0], data[1], true);
                    break;
                case 'SKIN_HAIR_2':
                    user.removeMoney(methods.parseInt(item.price), 'Услуги барбершопа ' + item.label);
                    business.addMoney(shopId, methods.parseInt(item.price), item.label);
                    user.set(item.doName, index);
                    mp.game.ui.notifications.show("~g~Вы изменили внешность по цене: ~s~$" + methods.parseInt(item.price));
                    user.updateCharacterFace();
                    break;
                case 'SKIN_HAIR_3':

                    skin.SKIN_HAIR_3 = index;
                    user.updateTattoo(true, true, true, false);

                    if (skin.SKIN_HAIR_2) {
                        let data = JSON.parse(enums.overlays)[user.getSex()][skin.SKIN_HAIR];
                        user.setDecoration(data[0], data[1], true);
                    }

                    let data = JSON.parse(enums.overlays)[user.getSex()][skin.SKIN_HAIR_3];
                    user.setDecoration(data[0], data[1], true);
                    break;
                case 'SKIN_HAIR_COLOR':
                    skin.SKIN_HAIR_COLOR = index;
                    mp.players.local.setHairColor(skin.SKIN_HAIR_COLOR, skin.SKIN_HAIR_COLOR_2);
                    user.updateTattoo(true, true, true, false);

                    if (skin.SKIN_HAIR_2) {
                        let data1 = JSON.parse(enums.overlays)[user.getSex()][skin.SKIN_HAIR];
                        user.setDecoration(data1[0], data1[1], true);
                    }

                    let data1 = JSON.parse(enums.overlays)[user.getSex()][skin.SKIN_HAIR_3];
                    user.setDecoration(data1[0], data1[1], true);
                    break;
                case 'SKIN_HAIR_COLOR_2':
                    skin.SKIN_HAIR_COLOR_2 = index;
                    mp.players.local.setHairColor(skin.SKIN_HAIR_COLOR, skin.SKIN_HAIR_COLOR_2);
                    user.updateTattoo(true, true, true, false);

                    if (skin.SKIN_HAIR_2) {
                        let data2 = JSON.parse(enums.overlays)[user.getSex()][skin.SKIN_HAIR];
                        user.setDecoration(data2[0], data2[1], true);
                    }

                    let data3 = JSON.parse(enums.overlays)[user.getSex()][skin.SKIN_HAIR_3];
                    user.setDecoration(data1[0], data1[1], true);
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
        }
        catch (e) {
            methods.debug(e);
        }
    });

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        try {

            if (item.doName === currentListChangeItem) {

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

                if (item.price < 0)
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

menuList.showShopMenu = function(shopId, price = 2, type = 0)
{
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    let title = "s_247";
    if (type == 4)
        title = "s_ltd";

    UIMenu.Menu.Create(" ", "~b~Магазин", 'showShopMenu', false, false, title);

    let saleLabel = '';
    let sale = business.getSale(price);
    if (sale > 0)
        saleLabel = `~br~~s~Скидка: ~r~${sale}%`;

    let currentIndex = 0;
    let list = [];
    for (let i = 1; i < 11; i++)
        list.push(i + 'шт.');
    enums.shopItems.forEach(itemId => {
        let itemPrice = items.getItemPrice(itemId) * price;
        let menuItem = {};
        menuItem.price = itemPrice;
        menuItem.itemId = itemId;
        UIMenu.Menu.AddMenuItemList(items.getItemNameById(itemId), list, `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '')
    });

    UIMenu.Menu.AddMenuItem("~b~Продажа рыбы", `Владелец магазина получает ${methods.parseInt(price * 10)}% с продаж`, {doName: "sellFish"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnList.Add((item, index) => {
        currentIndex = index;
    });

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        try {
            if (item.price > 0) {
                quest.standart(false, -1, 4);
                for (let i = 0; i < currentIndex + 1; i++)
                    mp.events.callRemote('server:shop:buy', item.itemId, item.price, shopId);
                if (currentIndex > 0) {
                    mp.game.ui.notifications.show(`~g~Стоимость всего товара: ~s~${methods.moneyFormat(item.price * (currentIndex + 1))}`);
                }
            }
            if (item.doName === 'sellFish') {
                inventory.getItemListSellFish(shopId);
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

menuList.showShopAlcMenu = function(shopId, price = 2, type = 0)
{
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    let title = "al_liqace";
    if (type == 2)
        title = "a_robs";
    if (type == 3)
        title = "a_scoops";

    UIMenu.Menu.Create(" ", "~b~Магазин", 'showShopAlcMenu', false, false, title);

    let saleLabel = '';
    let sale = business.getSale(price);
    if (sale > 0)
        saleLabel = `~br~~s~Скидка: ~r~${sale}%`;

    let currentIndex = 0;
    let list = [];
    for (let i = 1; i < 11; i++)
        list.push(i + 'шт.');
    enums.shopAlcItems.forEach(itemId => {
        let itemPrice = items.getItemPrice(itemId) * price;
        let menuItem = {};
        menuItem.price = itemPrice;
        menuItem.itemId = itemId;
        UIMenu.Menu.AddMenuItemList(items.getItemNameById(itemId), list, `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '')
    });

    //UIMenu.Menu.AddMenuItem("~y~Ограбить").doName = 'grab';

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnList.Add((item, index) => {
        currentIndex = index;
    });

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        try {
            if (item.price > 0) {
                for (let i = 0; i < currentIndex + 1; i++)
                    mp.events.callRemote('server:shop:buy', item.itemId, item.price, shopId);
                quest.standart(false, -1, 4);
                if (currentIndex > 0) {
                    mp.game.ui.notifications.show(`~g~Стоимость всего товара: ~s~${methods.moneyFormat(item.price * (currentIndex + 1))}`);
                }
            }
            if (item.doName == 'grab') {
                user.grab(shopId);
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

menuList.showShopElMenu = function(shopId, price = 2)
{
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create(" ", "~b~Магазин", 'showShopElMenu', false, false, 'digital');

    let saleLabel = '';
    let sale = business.getSale(price);
    if (sale > 0)
        saleLabel = `~br~~s~Скидка: ~r~${sale}%`;
    enums.shopElItems.forEach(itemId => {
        let itemPrice = items.getItemPrice(itemId) * price;
        let menuItem = {};
        menuItem.price = itemPrice;
        menuItem.itemId = itemId;
        UIMenu.Menu.AddMenuItem(items.getItemNameById(itemId), `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '')
    });

    let itemPrice = 3000 * price;
    let menuItem = {};
    menuItem.price = itemPrice;
    menuItem.radio = true;
    UIMenu.Menu.AddMenuItem('Рация', `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '');

    let hDesc = '';
    let cDesc = '';
    if (user.getCache('house_id') === 0)
        hDesc = '~br~~r~У вас нет дома';
    if (user.getCache('condo_id') === 0)
        cDesc = '~br~~r~У вас нет квартиры';

    itemPrice = 7500 * price;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.pinHouse = user.getCache('house_id') > 0;
    UIMenu.Menu.AddMenuItem('Дверь с пинкодом (Дом)', `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}${hDesc}`, menuItem, '', (sale > 0) ? 'sale' : '');

    itemPrice = 25000 * price;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.safeHouse = user.getCache('house_id') > 0;
    UIMenu.Menu.AddMenuItem('Сейф (Дом)', `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}${hDesc}`, menuItem, '', (sale > 0) ? 'sale' : '');

    itemPrice = 3250 * price;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.pinCondo = user.getCache('condo_id') > 0;
    UIMenu.Menu.AddMenuItem('Дверь с пинкодом (Квартира)', `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}${cDesc}`, menuItem, '', (sale > 0) ? 'sale' : '');

    itemPrice = 25000 * price;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.safeCondo = user.getCache('condo_id') > 0;
    UIMenu.Menu.AddMenuItem('Сейф (Квартира)', `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}${cDesc}`, menuItem, '', (sale > 0) ? 'sale' : '');

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        try {
            if (item.pinHouse)
            {
                if (user.getCashMoney() < item.price) {
                    mp.game.ui.notifications.show(`~g~У вас недостаточно средств`);
                    return;
                }
                try {
                    user.removeCashMoney(item.price, 'Покупка двери с пинкодом');
                    business.addMoney(shopId, item.price, 'Покупка двери с пинкодом');
                    business.removeMoneyTax(shopId, item.price / 2);
                    mp.game.ui.notifications.show(`~g~Поздравляем с покупкой`);
                    houses.updatePin(user.getCache('house_id'), 1234);
                }
                catch (e) {
                    
                }
            }
            else if (item.safeHouse)
            {
                if (user.getCashMoney() < item.price) {
                    mp.game.ui.notifications.show(`~g~У вас недостаточно средств`);
                    return;
                }
                try {
                    user.removeCashMoney(item.price, 'Покупка сейфа с пинкодом');
                    business.addMoney(shopId, item.price, 'Покупка сейфа с пинкодом');
                    business.removeMoneyTax(shopId, item.price / 2);
                    mp.game.ui.notifications.show(`~g~Поздравляем с покупкой`);
                    houses.updateSafe(user.getCache('house_id'), 1234);
                }
                catch (e) {

                }
            }
            else if (item.safeCondo)
            {
                if (user.getCashMoney() < item.price) {
                    mp.game.ui.notifications.show(`~g~У вас недостаточно средств`);
                    return;
                }
                try {
                    user.removeCashMoney(item.price, 'Покупка сейфа с пинкодом');
                    business.addMoney(shopId, item.price, 'Покупка сейфа с пинкодом');
                    business.removeMoneyTax(shopId, item.price / 2);
                    mp.game.ui.notifications.show(`~g~Поздравляем с покупкой`);
                    condos.updateSafe(user.getCache('condo_id'), 1234);
                }
                catch (e) {

                }
            }
            else if (item.pinCondo)
            {
                if (user.getCashMoney() < item.price) {
                    mp.game.ui.notifications.show(`~g~У вас недостаточно средств`);
                    return;
                }
                try {
                    user.removeCashMoney(item.price, 'Покупка двери с пинкодом');
                    business.addMoney(shopId, item.price, 'Покупка двери с пинкодом');
                    business.removeMoneyTax(shopId, item.price / 2);
                    mp.game.ui.notifications.show(`~g~Поздравляем с покупкой`);
                    condos.updatePin(user.getCache('condo_id'), 1234);
                }
                catch (e) {

                }
            }
            else if (item.radio)
            {
                if (user.getCashMoney() < item.price) {
                    mp.game.ui.notifications.show(`~g~У вас недостаточно средств`);
                    return;
                }
                try {
                    user.setVariable('walkieBuy', true);
                    user.set('walkie_buy', true);
                    setTimeout(function () {
                        user.removeCashMoney(item.price, 'Покупка Рации');
                        business.addMoney(shopId, item.price, 'Покупка рации');
                        business.removeMoneyTax(shopId, item.price / 2);
                        mp.game.ui.notifications.show(`~g~Поздравляем с покупкой рации`);
                    }, 300);
                }
                catch (e) {

                }
            }
            else if (item.price > 0 && item.itemId > 0)
                mp.events.callRemote('server:shop:buy', item.itemId, item.price, shopId);
            if (item.doName == 'grab') {
                user.grab(shopId);
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

menuList.showShopMedMenu = function(shopId, price = 2)
{
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create(" ", "~b~Аптека", 'showShopMedMenu', false, false, 'ph2');

    let saleLabel = '';
    let sale = business.getSale(price);
    if (sale > 0)
        saleLabel = `~br~~s~Скидка: ~r~${sale}%`;

    let itemPrice = 5000 * price;
    let menuItem = {};
    menuItem.price = itemPrice;
    menuItem.doName = "med_lic";
    UIMenu.Menu.AddMenuItem("Мед. страховка на 6 мес.", `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '');

    let currentIndex = 0;
    let list = [];
    for (let i = 1; i < 11; i++)
        list.push(i + 'шт.');
    enums.shopMedItems.forEach(itemId => {
        let itemPrice = items.getItemPrice(itemId) * price;
        let menuItem = {};
        menuItem.price = itemPrice;
        menuItem.itemId = itemId;
        UIMenu.Menu.AddMenuItemList(items.getItemNameById(itemId), list, `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '')
    });

    //UIMenu.Menu.AddMenuItem("~y~Ограбить").doName = 'grab';

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnList.Add((item, index) => {
        currentIndex = index;
    });

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        try {
            if (item.doName == "med_lic")
            {
                if (!user.getCache('med_lic'))
                    business.addMoney(shopId, item.price / 5, 'Мед. страховка (20% от стоимости)');
                user.buyLicense(item.doName, item.price, 6);
            }
            else if (item.price > 0) {
                for (let i = 0; i < currentIndex + 1; i++)
                    mp.events.callRemote('server:shop:buy', item.itemId, item.price, shopId);
                if (currentIndex > 0) {
                    mp.game.ui.notifications.show(`~g~Стоимость всего товара: ~s~${methods.moneyFormat(item.price * (currentIndex + 1))}`);
                }
            }
            else if (item.doName == 'grab') {
                user.grab(shopId);
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

menuList.showShopFishMenu = function(shopId, price = 2)
{
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create("Магазин", "~b~Рыболовный магазин");

    let saleLabel = '';
    let sale = business.getSale(price);
    if (sale > 0)
        saleLabel = `~br~~s~Скидка: ~r~${sale}%`;

    let currentIndex = 0;
    let list = [];
    for (let i = 1; i < 11; i++)
        list.push(i + 'шт.');
    enums.shopFishItems.forEach(itemId => {
        let itemPrice = items.getItemPrice(itemId) * price;
        let menuItem = {};
        menuItem.price = itemPrice;
        menuItem.itemId = itemId;
        UIMenu.Menu.AddMenuItemList(items.getItemNameById(itemId), list, `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '')
    });

    //UIMenu.Menu.AddMenuItem("~y~Ограбить").doName = 'grab';

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnList.Add((item, index) => {
        currentIndex = index;
    });

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        try {
            if (item.price > 0) {
                if (item.itemId === 251) {
                    quest.fish(false, -1, 1);
                }
                for (let i = 0; i < currentIndex + 1; i++)
                    mp.events.callRemote('server:shop:buy', item.itemId, item.price, shopId);
                if (currentIndex > 0) {
                    mp.game.ui.notifications.show(`~g~Стоимость всего товара: ~s~${methods.moneyFormat(item.price * (currentIndex + 1))}`);
                }
            }
            if (item.doName == 'grab') {
                user.grab(shopId);
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

menuList.showShopHuntMenu = function(shopId, price = 2)
{
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create("Магазин", "~b~Охотничий магазин");

    let saleLabel = '';
    let sale = business.getSale(price);
    if (sale > 0)
        saleLabel = `~br~~s~Скидка: ~r~${sale}%`;

    let currentIndex = 0;
    let list = [];
    for (let i = 1; i < 11; i++)
        list.push(i + 'шт.');
    enums.shopHuntItems.forEach(itemId => {
        let itemPrice = items.getItemPrice(itemId) * price;
        let menuItem = {};
        menuItem.price = itemPrice;
        menuItem.itemId = itemId;
        UIMenu.Menu.AddMenuItemList(items.getItemNameById(itemId), list, `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '')
    });

    //UIMenu.Menu.AddMenuItem("~y~Ограбить").doName = 'grab';

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnList.Add((item, index) => {
        currentIndex = index;
    });

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        try {
            if (item.price > 0) {
                for (let i = 0; i < currentIndex + 1; i++)
                    mp.events.callRemote('server:shop:buy', item.itemId, item.price, shopId);
                if (currentIndex > 0) {
                    mp.game.ui.notifications.show(`~g~Стоимость всего товара: ~s~${methods.moneyFormat(item.price * (currentIndex + 1))}`);
                }
            }
            if (item.doName == 'grab') {
                user.grab(shopId);
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

menuList.showBarMenu = function(shopId, price = 2)
{
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create("Бар", "~b~Меню бара");

    let saleLabel = '';
    let sale = business.getSale(price);
    if (sale > 0)
        saleLabel = `~br~~s~Скидка: ~r~${sale}%`;

    let itemPrice = 0.50 * price;
    let menuItem = {};
    menuItem.price = itemPrice;
    menuItem.label = "воду";
    menuItem.label2 = "Вода Rainé";
    UIMenu.Menu.AddMenuItem("Вода Rainé", `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '');

    itemPrice = 0.90 * price;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.label = "E-Cola";
    menuItem.label2 = "Баночка E-Cola";
    UIMenu.Menu.AddMenuItem("Баночка E-Cola", `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '');

    itemPrice = 0.99 * price;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.label = "E-Cola";
    menuItem.label2 = "Бутылка E-Cola";
    UIMenu.Menu.AddMenuItem("Бутылка E-Cola", `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '');

    itemPrice = 6.70 * price;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.label = "пиво";
    menuItem.label2 = "Пиво Pißwasser";
    menuItem.drunkLevel = 100;
    UIMenu.Menu.AddMenuItem("Пиво Pißwasser", `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '');

    itemPrice = 9.99 * price;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.label = "водку";
    menuItem.label2 = "Водка Nogo";
    menuItem.drunkLevel = 200;
    UIMenu.Menu.AddMenuItem("Водка Nogo", `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '');

    itemPrice = 12 * price;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.label = "рома";
    menuItem.label2 = "Ром Ragga";
    menuItem.drunkLevel = 200;
    UIMenu.Menu.AddMenuItem("Ром Ragga", `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '');

    itemPrice = 14 * price;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.label = "коньяк";
    menuItem.label2 = "Коньяк Bourgeoix";
    menuItem.drunkLevel = 200;
    UIMenu.Menu.AddMenuItem("Коньяк Bourgeoix", `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '');

    itemPrice = 25 * price;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.label = "вина";
    menuItem.label2 = "Вино Rockford Hill Reserve";
    menuItem.drunkLevel = 200;
    UIMenu.Menu.AddMenuItem("Вино Rockford Hill Reserve", `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '');

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        try {
            if (item.price > 0) {
                if (user.getMoney() < item.price) {
                    mp.game.ui.notifications.show("~r~У Вас недостаточно средств");
                    return;
                }

                business.addMoney(shopId, item.price, item.label2);
                user.removeMoney(item.price, 'Выпил ' + item.label + ' в баре');

                if (mp.players.local.getHealth() < 90)
                    user.setHealth(mp.players.local.getHealth() + 2);

                if (item.drunkLevel)
                    user.addDrugLevel(99, item.drunkLevel);

                user.addWaterLevel(200);
                chat.sendMeCommand(`выпил ${item.label}`);
                user.playAnimation("mp_player_intdrink", "loop_bottle", 48);
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

menuList.showBarFreeMenu = function()
{
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create("Бар", "~b~Меню бара");

    let menuItem = {};
    menuItem.label = "воду";
    UIMenu.Menu.AddMenuItem("Вода Rainé", "", menuItem);

    menuItem = {};
    menuItem.label = "E-Cola";
    UIMenu.Menu.AddMenuItem("Баночка E-Cola", "", menuItem);

    menuItem = {};
    menuItem.label = "E-Cola";
    UIMenu.Menu.AddMenuItem("Бутылка E-Cola", "", menuItem);

    menuItem = {};
    menuItem.label = "пиво";
    menuItem.drunkLevel = 100;
    UIMenu.Menu.AddMenuItem("Пиво Pißwasser", "", menuItem);

    menuItem = {};
    menuItem.label = "водку";
    menuItem.drunkLevel = 200;
    UIMenu.Menu.AddMenuItem("Водка Nogo", "", menuItem);

    menuItem = {};
    menuItem.label = "рома";
    menuItem.drunkLevel = 200;
    UIMenu.Menu.AddMenuItem("Ром Ragga", "", menuItem);

    menuItem = {};
    menuItem.label = "коньяк";
    menuItem.drunkLevel = 200;
    UIMenu.Menu.AddMenuItem("Коньяк Bourgeoix", "", menuItem);

    menuItem = {};
    menuItem.label = "вина";
    menuItem.drunkLevel = 200;
    UIMenu.Menu.AddMenuItem("Вино Rockford Hill Reserve", "", menuItem);

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        try {
            if (item.label) {

                if (mp.players.local.getHealth() < 90)
                    user.setHealth(mp.players.local.getHealth() + 2);

                if (item.drunkLevel)
                    user.addDrugLevel(99, item.drunkLevel);

                user.addWaterLevel(200);
                chat.sendMeCommand(`выпил ${item.label}`);
                user.playAnimation("mp_player_intdrink", "loop_bottle", 48);
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

menuList.showRentBikeMenu = function(shopId, price = 2)
{
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create("Аренда", "~b~Аренда");

    if (user.getCache('online_time') <= 169)
        price = 2;

    let saleLabel = '';
    let sale = business.getSale(price);
    if (sale > 0)
        saleLabel = `~br~~s~Скидка: ~r~${sale}%`;

    let itemPrice = 3 * price;
    let menuItem = {};
    menuItem.price = itemPrice;
    menuItem.hash = 448402357;
    UIMenu.Menu.AddMenuItem("Cruiser", `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '');

    itemPrice = 5 * price;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.hash = 1131912276;
    UIMenu.Menu.AddMenuItem("Bmx", `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '');

    itemPrice = 10 * price;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.hash = -836512833;
    UIMenu.Menu.AddMenuItem("Fixter", `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '');

    itemPrice = 10 * price;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.hash = -186537451;
    UIMenu.Menu.AddMenuItem("Scorcher", `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '');

    itemPrice = 30 * price;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.hash = 1127861609;
    UIMenu.Menu.AddMenuItem("TriBike", `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '');

    itemPrice = 30 * price;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.hash = -1233807380;
    UIMenu.Menu.AddMenuItem("TriBike2", `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '');

    itemPrice = 30 * price;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.hash = -400295096;
    UIMenu.Menu.AddMenuItem("TriBike3", `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '');

    itemPrice = 60 * price;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.hash = -1842748181;
    UIMenu.Menu.AddMenuItem("Faggio", `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '');

    itemPrice = 55 * price;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.hash = 55628203;
    UIMenu.Menu.AddMenuItem("Faggio2", `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '');

    itemPrice = 50 * price;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.hash = -1289178744;
    UIMenu.Menu.AddMenuItem("Faggio3", `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '');

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
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

menuList.showShopClothMenu = function (shopId, type, menuType, price = 1) {
    try {
        methods.debug('Execute: menuList.showShopClothMenu');

        //if (menuType == 11)
        //    inventory.unEquipItem(265, 0, 1, 0, false);

        if (methods.isBlackout()) {
            mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
            return;
        }

        let subTitle = "Vangelico";
        if (shopId == 129)
            subTitle = "HuntingStore";

        let title1 = "";

        switch (type) {
            case 0:
                title1 = "c_disc";
                break;
            case 1:
                title1 = "c_sub";
                break;
            case 2:
                title1 = "c_pons";
                break;
            case 3:
                title1 = "ammu";
                break;
            case 5:
                title1 = "c_binco";
                break;
        }

        let sale = business.getSale(price);
        let saleLabel = '';
        if (sale > 0)
            saleLabel = `. Скидка: ~r~${sale}%`;

        UIMenu.Menu.Create(title1 !== "" ? " " : subTitle, "~b~Магазин" + saleLabel, 'showShopClothMenu', false, false, title1);

        let cList = [];

        if (menuType == 0) {
            UIMenu.Menu.AddMenuItem("Головные уборы", "", {doName: "head"});
            UIMenu.Menu.AddMenuItem("Очки", "", {doName: "glasses"});
            UIMenu.Menu.AddMenuItem("Серьги", "", {doName: "earring"});
            UIMenu.Menu.AddMenuItem("Левая рука", "", {doName: "leftHand"});
            UIMenu.Menu.AddMenuItem("Правая рука", "", {doName: "rightHand"});
            //UIMenu.Menu.AddMenuItem("~y~Ограбить").doName = 'grab';

            if (type == 5) {
                let menuItem = {};
                menuItem.price = 349.99;
                menuItem.itemId = 55;
                menuItem.itemName = "Бита";
                UIMenu.Menu.AddMenuItem("Бита", `Цена: ~g~$349.99`, menuItem);
            }

            UIMenu.Menu.AddMenuItem('~b~Сумки и рюкзаки', "", {doName: "openBag"});

        } else if (menuType == 1) {
            UIMenu.Menu.AddMenuItem("Головные уборы", "", {doName: "head"});
            UIMenu.Menu.AddMenuItem("Очки", "", {doName: "glasses"});
            UIMenu.Menu.AddMenuItem("Торс", "", {doName: "body"});
            UIMenu.Menu.AddMenuItem("Ноги", "", {doName: "legs"});
            UIMenu.Menu.AddMenuItem("Обувь", "", {doName: "shoes"});

            if (type == 5) {
                let menuItem = {};
                menuItem.price = 349.99;
                menuItem.itemId = 55;
                menuItem.itemName = "Бита";
                UIMenu.Menu.AddMenuItem("Бита", `Цена: ~g~$349.99`, menuItem);
            }

            UIMenu.Menu.AddMenuItem('~b~Сумки и рюкзаки', "", {doName: "openBag"});
        } else {

            if (type == 11)
                user.updateTattoo(true, true, false, true);

            let skin = JSON.parse(user.getCache('skin'));
            let cloth = skin.SKIN_SEX == 1 ? JSON.parse(enums.clothF) : JSON.parse(enums.clothM);
            for (let i = 0; i < cloth.length; i++) {
                let id = i;

                if (cloth[id][1] != menuType) continue;
                if (cloth[id][0] != type) continue;

                let pr = cloth[i][8] * price;
                let menuListItem = {};

                menuListItem.id1 = cloth[id][1];
                menuListItem.id2 = cloth[id][2];
                menuListItem.id3 = cloth[id][3];
                menuListItem.id4 = cloth[id][4];
                menuListItem.id5 = cloth[id][5];
                menuListItem.id6 = cloth[id][6];
                menuListItem.id7 = cloth[id][7];
                menuListItem.id8 = pr;
                menuListItem.itemName = cloth[id][9].toString();
                UIMenu.Menu.AddMenuItem(cloth[i][9].toString(), `Цена: ~g~${(methods.moneyFormat(pr))} ${(cloth[i][10] > -99 ? `~br~~s~Термостойкость до ~g~${cloth[i][10]}°` : "")}~br~~c~Нажмите Enter чтобы выбрать цвет`, menuListItem, '', (sale > 0) ? 'sale' : '');

                cList.push(menuListItem);
            }
        }

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnClose.Add(() => {
            try {
                if (type == 11)
                    user.updateTattoo();
                user.updateCharacterCloth();
            } catch (e) {
                methods.debug('Exception: menuList.showShopClothMenu menu.MenuClose');
                methods.debug(e);
            }
        });

        UIMenu.Menu.OnIndexSelect.Add((index) => {
            if (index >= cList.length)
                return;

            let item = cList[index];
            cloth.change(item.id1, item.id2, 0, item.id4, item.id5, item.id6, item.id7);
            if (item.id1 == 11)
                user.updateTattoo(true, true, false, true);
        });

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            try {
                if (item.itemName) {
                    menuList.showShopClothMoreMenu(shopId, type, menuType, price, item.id1, item.id2, item.id3, item.id4, item.id5, item.id6, item.id7, item.id8, item.itemName);
                }
                if (item.doName == "closeButton") {
                    UIMenu.Menu.HideMenu();
                    user.updateCharacterCloth();
                }
                if (item.doName == "openBag") {
                    menuList.showShopClothBagMenu(shopId, type, menuType, price);
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
                    menuList.showShopPropMenu(shopId, type, 0, price);
                }
                if (item.doName == "glasses") {
                    menuList.showShopPropMenu(shopId, type, 1, price);
                }
                if (item.doName == "earring") {
                    menuList.showShopPropMenu(shopId, type, 2, price);
                }
                if (item.doName == "leftHand") {
                    menuList.showShopPropMenu(shopId, type, 6, price);
                }
                if (item.doName == "rightHand") {
                    menuList.showShopPropMenu(shopId, type, 7, price);
                }
                if (item.doName == "head") {
                    menuList.showShopPropMenu(shopId, type, 0, price);
                }
                if (item.doName == "glasses") {
                    menuList.showShopPropMenu(shopId, type, 1, price);
                }
                if (item.doName == "body") {
                    menuList.showShopClothMenu(shopId, 3, 11, price);
                }
                if (item.doName == "legs") {
                    menuList.showShopClothMenu(shopId, 3, 4, price);
                }
                if (item.doName == "shoes") {
                    menuList.showShopClothMenu(shopId, 3, 6, price);
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

menuList.showShopClothMoreMenu = function (shopId, type, menuType, price, id1, id2, id3, id4, id5, id6, id7, id8, itemName) {
    try {
        methods.debug('Execute: menuList.showShopClothMenu');

        if (methods.isBlackout()) {
            mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
            return;
        }

        let subTitle = "Vangelico";
        if (shopId == 129)
            subTitle = "HuntingStore";

        let title1 = "";

        switch (type) {
            case 0:
                title1 = "c_disc";
                break;
            case 1:
                title1 = "c_sub";
                break;
            case 2:
                title1 = "c_pons";
                break;
            case 3:
                title1 = "ammu";
                break;
            case 5:
                title1 = "c_binco";
                break;
        }

        let sale = business.getSale(price);
        let saleLabel = '';
        if (sale > 0)
            saleLabel = `. Скидка: ~r~${sale}%`;

        UIMenu.Menu.Create(title1 !== "" ? " " : subTitle, "~b~Магазин" + saleLabel, 'true', false, false, title1);

        let cList = [];

        for (let i = 0; i <= id3 + 1; i++) {
            let menuItem = {};
            menuItem.idx = i;
            UIMenu.Menu.AddMenuItem(`${itemName} #${(i + 1)}`, `Нажмите ~g~Enter~s~ чтобы купить`, menuItem);
            cList.push(menuItem);
        }

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnClose.Add(() => {
            try {
                if (type == 11)
                    user.updateTattoo();
                user.updateCharacterCloth();
            } catch (e) {
                methods.debug('Exception: menuList.showShopClothMenu menu.MenuClose');
                methods.debug(e);
            }
        });

        UIMenu.Menu.OnIndexSelect.Add((index) => {
            if (index >= cList.length)
                return;

            let item = cList[index];
            cloth.change(id1, id2, item.idx, id4, id5, id6, id7);
            if (id1 == 11)
                user.updateTattoo(true, true, false, true);
        });

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            try {
                if (item.doName == "closeButton") {
                    UIMenu.Menu.HideMenu();
                    user.updateCharacterCloth();
                }
                if (item.idx >= 0) {
                    quest.standart(false, -1, 5);
                    cloth.buy(id8, id1, id2, item.idx, id4, id5, id6, id7, itemName + ' #' + (item.idx + 1), shopId);
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

menuList.showShopClothBagMenu = function (shopId, type, menuType) {
    try {
        methods.debug('Execute: menuList.showShopClothBagMenu');

        if (methods.isBlackout()) {
            mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
            return;
        }

        let title1 = "";

        switch (type) {
            case 0:
                title1 = "c_disc";
                break;
            case 1:
                title1 = "c_sub";
                break;
            case 2:
                title1 = "c_pons";
                break;
            case 3:
                title1 = "ammu";
                break;
            case 5:
                title1 = "c_binco";
                break;
        }

        let subTitle = "Vangelico";
        if (shopId == 129)
            subTitle = "HuntingStore";

        UIMenu.Menu.Create(title1 !== "" ? " " : subTitle, "~b~Магазин", 'true', false, false, title1);

        let list = [];
        let menuListItem = null;

        if (shopId == 129) {
            list = ['Черная', 'Синяя', 'Желтая', 'Розовая', 'Зелёная', 'Оранжевая', 'Фиолетовая', 'Светло-розовая', 'Красно-синяя', 'Голубая', 'Цифра', 'Флора', 'Синяя флора', 'Узор', 'Пустынная', 'Камо', 'Белая'];
            menuListItem = {};
            menuListItem.id1 = 5;
            menuListItem.id2 = 82;
            menuListItem.id4 = 0;
            menuListItem.id5 = 0;
            menuListItem.id6 = 0;
            menuListItem.id7 = 0;
            menuListItem.id8 = 2000;
            menuListItem.itemName = 'Спортивная сумка';
            UIMenu.Menu.AddMenuItemList('Спортивная сумка', list, `Цена: ~g~${(methods.moneyFormat(2000))}`, menuListItem);

            list = ['Обычная'];
            menuListItem = {};
            menuListItem.id1 = 5;
            menuListItem.id2 = 41;
            menuListItem.id4 = 0;
            menuListItem.id5 = 0;
            menuListItem.id6 = 0;
            menuListItem.id7 = 0;
            menuListItem.id8 = 1500;
            menuListItem.itemName = 'Спортивная сумка';
            UIMenu.Menu.AddMenuItemList('Спортивная сумка', list, `Цена: ~g~${(methods.moneyFormat(1500))}`, menuListItem);

            list = ['Обычная чёрная'];
            menuListItem = {};
            menuListItem.id1 = 5;
            menuListItem.id2 = 45;
            menuListItem.id4 = 0;
            menuListItem.id5 = 0;
            menuListItem.id6 = 0;
            menuListItem.id7 = 0;
            menuListItem.id8 = 1500;
            menuListItem.itemName = 'Спортивная сумка';
            UIMenu.Menu.AddMenuItemList('Спортивная сумка', list, `Цена: ~g~${(methods.moneyFormat(1500))}`, menuListItem);

            list = [];
            for (let j = 0; j <= 25; j++) {
                list.push(j + '');
            }
            menuListItem = {};
            menuListItem.id1 = 5;
            menuListItem.id2 = 22;
            menuListItem.id4 = 0;
            menuListItem.id5 = 0;
            menuListItem.id6 = 0;
            menuListItem.id7 = 0;
            menuListItem.id8 = 2500;
            menuListItem.itemName = 'Спортивная сумка';
            UIMenu.Menu.AddMenuItemList('Спортивная сумка', list, `Цена: ~g~${(methods.moneyFormat(2500))}`, menuListItem);
        }

        list = [];
        for (let j = 0; j <= 0; j++) {
            list.push(j + '');
        }
        menuListItem = {};
        menuListItem.id1 = 5;
        menuListItem.id2 = 2;
        menuListItem.id4 = 0;
        menuListItem.id5 = 0;
        menuListItem.id6 = 0;
        menuListItem.id7 = 0;
        menuListItem.id8 = 500;
        menuListItem.itemName = 'Рюкзак c узором';
        UIMenu.Menu.AddMenuItemList('Рюкзак c узором', list, `Цена: ~g~${(methods.moneyFormat(500))}`, menuListItem);

        list = [];
        for (let j = 0; j <= 25; j++) {
            list.push(j + '');
        }
        menuListItem = {};
        menuListItem.id1 = 5;
        menuListItem.id2 = 11;
        menuListItem.id4 = 0;
        menuListItem.id5 = 0;
        menuListItem.id6 = 0;
        menuListItem.id7 = 0;
        menuListItem.id8 = 500;
        menuListItem.itemName = 'Рюкзак с флагом';
        UIMenu.Menu.AddMenuItemList('Рюкзак с флагом', list, `Цена: ~g~${(methods.moneyFormat(500))}`, menuListItem);

        list = [];
        for (let j = 0; j <= 4; j++) {
            list.push(j + '');
        }
        menuListItem = {};
        menuListItem.id1 = 5;
        menuListItem.id2 = 32;
        menuListItem.id4 = 0;
        menuListItem.id5 = 0;
        menuListItem.id6 = 0;
        menuListItem.id7 = 0;
        menuListItem.id8 = 500;
        menuListItem.itemName = 'Рюкзак тактический';
        UIMenu.Menu.AddMenuItemList('Рюкзак тактический', list, `Цена: ~g~${(methods.moneyFormat(500))}`, menuListItem);

        list = [];
        for (let j = 0; j <= 9; j++) {
            list.push(j + '');
        }
        menuListItem = {};
        menuListItem.id1 = 5;
        menuListItem.id2 = 53;
        menuListItem.id4 = 0;
        menuListItem.id5 = 0;
        menuListItem.id6 = 0;
        menuListItem.id7 = 0;
        menuListItem.id8 = 500;
        menuListItem.itemName = 'Рюкзак';
        UIMenu.Menu.AddMenuItemList('Рюкзак', list, `Цена: ~g~${(methods.moneyFormat(500))}`, menuListItem);

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnClose.Add(() => {
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

        UIMenu.Menu.OnList.Add((item, index) => {
            currentListChangeItem = item.id2;
            currentListChangeItemIndex = index;
            cloth.change(item.id1, item.id2, index, item.id4, item.id5, item.id6, item.id7);
        });

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            try {
                if (item.id2 === currentListChangeItem) {
                    cloth.buy(item.id8, item.id1, item.id2, currentListChangeItemIndex, item.id4, item.id5, item.id6, item.id7, item.itemName, shopId);
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
        methods.debug('Exception: menuList.showShopClothMenu');
        methods.debug(e);
    }
};

menuList.showShopPropMenu = function (shopId, type, menuType, price) {
    let title1 = "";

    switch (type) {
        case 0:
            title1 = "c_disc";
            break;
        case 1:
            title1 = "c_sub";
            break;
        case 2:
            title1 = "c_pons";
            break;
        case 3:
            title1 = "ammu";
            break;
        case 5:
            title1 = "c_binco";
            break;
    }

    let sale = business.getSale(price);
    let saleLabel = '';
    if (sale > 0)
        saleLabel = `. Скидка: ~r~${sale}%`;

    UIMenu.Menu.Create(title1 != "" ? " " : "Vangelico", "~b~Магазин" + saleLabel, 'true', false, false, title1);

    let skin = JSON.parse(user.getCache('skin'));
    let clothList = skin.SKIN_SEX == 1 ? JSON.parse(enums.propF) : JSON.parse(enums.propM);

    let cList = [];

    for (let i = 0; i < clothList.length; i++)
    {
        let id = i;

        if (clothList[id][1] != menuType) continue;
        if (clothList[id][0] != type) continue;

        let pr = clothList[i][4] * price;
        let menuListItem = {};

        menuListItem.id1 = clothList[id][1];
        menuListItem.id2 = clothList[id][2];
        menuListItem.id3 = clothList[id][3];
        menuListItem.id4 = pr;
        menuListItem.itemName = clothList[id][5].toString();
        UIMenu.Menu.AddMenuItem(clothList[i][5].toString(), `Цена: ~g~${methods.moneyFormat(pr)}`, menuListItem, '', (sale > 0) ? 'sale' : '');
        cList.push(menuListItem);
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnClose.Add((sender) =>
    {
        user.updateCharacterCloth();
    });

    UIMenu.Menu.OnIndexSelect.Add((index) => {
        if (index >= cList.length)
            return;
        let item = cList[index];
        cloth.changeProp(item.id1, item.id2, 0);
    });

    UIMenu.Menu.OnSelect.Add((item, index) => {
        try {
            if (item.itemName) {
                menuList.showShopPropMoreMenu(shopId, type, menuType, price, item.id1, item.id2, item.id3, item.id4, item.itemName)
            }
        }
        catch (e) {

            methods.debug('Exception: menuList.showShopPropMenu menu.ItemSelect');
            methods.debug(e);
        }
    });
};

menuList.showShopPropMoreMenu = function (shopId, type, menuType, price, id1, id2, id3, id4, itemName) {
    let title1 = "";

    switch (type) {
        case 0:
            title1 = "c_disc";
            break;
        case 1:
            title1 = "c_sub";
            break;
        case 2:
            title1 = "c_pons";
            break;
        case 3:
            title1 = "ammu";
            break;
        case 5:
            title1 = "c_binco";
            break;
    }

    let sale = business.getSale(price);
    let saleLabel = '';
    if (sale > 0)
        saleLabel = `. Скидка: ~r~${sale}%`;

    UIMenu.Menu.Create(title1 !== "" ? " " : "Vangelico", "~b~Магазин" + saleLabel, 'true', false, false, title1);

    let skin = JSON.parse(user.getCache('skin'));
    let clothList = skin.SKIN_SEX == 1 ? JSON.parse(enums.propF) : JSON.parse(enums.propM);

    let cList = [];

    for (let i = 0; i <= id3 + 1; i++) {
        let menuItem = {};
        menuItem.idx = i;
        UIMenu.Menu.AddMenuItem(`${itemName} #${(i + 1)}`, `Нажмите ~g~Enter~s~ чтобы купить`, menuItem);
        cList.push(menuItem);
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnClose.Add((sender) =>
    {
        user.updateCharacterCloth();
    });

    UIMenu.Menu.OnIndexSelect.Add((index) => {
        if (index >= cList.length)
            return;
        let item = cList[index];
        cloth.changeProp(id1, id2, item.idx);
    });

    UIMenu.Menu.OnSelect.Add((item, index) => {
        try {
            if (item.idx >= 0) {
                cloth.buyProp(id4, id1, id2, item.idx, itemName + ' #' + item.idx, shopId);
            }
        }
        catch (e) {

            methods.debug('Exception: menuList.showShopPropMenu menu.ItemSelect');
            methods.debug(e);
        }
    });
};

menuList.showShopMaskMenu = function (shopId) {
    UIMenu.Menu.Create(` `, `~b~Магазин масок`, 'mask', false, false, 's_mask');

    for (let i = 0; i < enums.maskClasses.length; i++) {
        if (methods.getCountMask(i, shopId) > 0) {
            if (i === 4) {
                if (weather.getMonth() === 2)
                    UIMenu.Menu.AddMenuItem(`${enums.maskClasses[i]}`, '', {slotId: i});
                else
                    UIMenu.Menu.AddMenuItem(`~c~${enums.maskClasses[i]}`, 'Доступно для покупки, только в Феврале', {});
            }
            else if (i === 19) {
                if (weather.getMonth() === 12)
                    UIMenu.Menu.AddMenuItem(`${enums.maskClasses[i]}`, '', {slotId: i});
                else
                    UIMenu.Menu.AddMenuItem(`~c~${enums.maskClasses[i]}`, 'Доступно для покупки, только в Декабре', {});
            }
            else if (i === 20) {
                if (weather.getMonth() === 10)
                    UIMenu.Menu.AddMenuItem(`${enums.maskClasses[i]}`, '', {slotId: i});
                else
                    UIMenu.Menu.AddMenuItem(`~c~${enums.maskClasses[i]}`, 'Доступно для покупки, только в Октябре', {});
            }
            else
                UIMenu.Menu.AddMenuItem(`${enums.maskClasses[i]}`, '', {slotId: i});
        }
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(item => {
        UIMenu.Menu.HideMenu();
        if (item.slotId >= 0) {
            menuList.showMaskListMenu(item.slotId, shopId);
        }
    });
};

menuList.showMaskListMenu = function (slot, shopId) {
    try {

        let maskPrev = user.getCache('mask');

        if (maskPrev > 0) {
            mp.game.ui.notifications.show("~r~Для начала снимите старую маску");
            return;
        }

        if (enums.maskList.length < 1)
            return;

        UIMenu.Menu.Create(` `, `~b~Магазин масок`, 'mask', false, false, 's_mask');

        let list = [];
        for (let i = 0; i < enums.maskList.length; i++) {
            let maskItem = enums.maskList[i];
            if (maskItem[0] !== slot)
                continue;
            if (maskItem[13] !== shopId)
                continue;

            //[ClassID, "Name", MaskID, MaxColor, Price, NetCoin, УбратьПричёску, УбратьОчки, УбратьШляпу, УбратьСерьги, СтандартноеЛицо, УбратьСкулы, Скрытность, МагазинID, ШансВыпасть],

            let mItem = {};
            mItem.maskId = maskItem[2];
            mItem.maskColor = maskItem[3];
            mItem.maskHair = maskItem[6];
            mItem.maskGlass = maskItem[7];
            mItem.maskHat = maskItem[8];
            mItem.maskAcc = maskItem[9];
            mItem.maskFaceDef = maskItem[10];
            mItem.maskFace = maskItem[11];
            mItem.maskPrice = maskItem[4] + 0.01;
            mItem.idxFull = i;
            list.push(mItem);
            UIMenu.Menu.AddMenuItem(`${maskItem[1]}`, `Цена: ~g~${methods.moneyFormat(maskItem[4])}~br~~s~Цена: ~y~${methods.numberFormat(maskItem[5])}nc`, mItem)
        }

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnIndexSelect.Add((index) => {
            if (index >= list.length)
                return;
            //user.setComponentVariation(1, list[index].maskId, list[index].maskColor);
            user.set('mask', list[index].idxFull);
            user.set('mask_color', 1);
            //user.updateCharacterFace();
            user.updateCharacterCloth();
        });

        UIMenu.Menu.OnSelect.Add((item) => {
            if (item.idxFull >= 0) {
                setTimeout(function () {
                    cloth.buyMask(item.maskPrice, item.idxFull, shopId);
                    maskPrev = item.idxFull;
                }, 200);
            }
            if (item.doName === 'closeMenu') {
                user.set('mask', -1);
                user.set('mask_color', 0);
                user.updateCharacterFace();
                user.updateCharacterCloth();
            }
        });

        UIMenu.Menu.OnClose.Add((index) => {
            user.set('mask', -1);
            user.set('mask_color', 0);
            user.updateCharacterFace();
            user.updateCharacterCloth();
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showPrintShopMenu = function()
{
    if (user.getCache('torso') == 15)
    {
        mp.game.ui.notifications.show("~r~Вам необходимо купить вверхнюю одежду в магазине одежды, прежде чем пользоваться услугой наклейки принта");
        return;
    }

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }
    UIMenu.Menu.Create(" ", "~b~Магазин принтов", 'print', false, false, 's_print'); //TODO BANNER

    let list = [];

    let printList = JSON.parse(enums.tprint);

    for (let i = 0; i < printList.length; i++) {

        let price = 1999.90;
        if (user.getSex() == 1 && printList[i][2] != "") {
            let menuListItem = {};
            menuListItem.doName = 'show';
            menuListItem.price = price;
            menuListItem.tatto1 = printList[i][0];
            menuListItem.tatto2 = printList[i][2];
            UIMenu.Menu.AddMenuItem('Принт #' + i, `Цена: ~g~${methods.moneyFormat(price)}`, menuListItem);

            list.push(menuListItem);
        }
        else if (user.getSex() == 0 && printList[i][1] != "") {
            let menuListItem = {};
            menuListItem.doName = 'show';
            menuListItem.price = price;
            menuListItem.tatto1 = printList[i][0];
            menuListItem.tatto2 = printList[i][1];
            UIMenu.Menu.AddMenuItem('Принт #' + i, `Цена: ~g~${methods.moneyFormat(price)}`, menuListItem);

            list.push(menuListItem);
        }
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnIndexSelect.Add((index) => {
        if (index >= list.length)
            return;
        user.setCache('tprint_c', ' ');
        user.updateTattoo(true, true, false, true);
        user.setDecoration(list[index].tatto1, list[index].tatto2, true);
    });

    UIMenu.Menu.OnClose.Add(() => {
        user.updateTattoo();
        user.updateCache();
    });

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if(item.doName == 'show')
            mp.events.callRemote('server:print:buy', item.tatto1, item.tatto2, item.price);
    });
};

menuList.showMazeBankLobbyMenu = function(inGame, weapon, raceCount, raceName, raceVeh)
{
    weapon = items.getWeaponNameByName(weapon);

    UIMenu.Menu.Create(" ", "~b~MazeBank Arena", 'arena', false, false, 'mba');

    UIMenu.Menu.AddMenuItem('~g~Принять участие в гонке', `Взнос: ~g~$1,000~s~~br~Игроков в лобби: ~g~${raceCount}~s~~br~Транспорт: ~g~${raceVeh}~s~~br~Название: ~g~${raceName}`, {doName: "start"});
    UIMenu.Menu.AddMenuItem('~g~Пригласить на дуэль', 'Взнос: ~g~$250', {doName: "duel"});
    UIMenu.Menu.AddMenuItem('~g~Принять участие в GunZone', `Игроков в лобби: ~g~${inGame}~s~~br~Оружие: ~g~${weapon}`, {doName: "startGangZone"});
    UIMenu.Menu.AddMenuItem('Таблица рейтинга гонок', "", {doName: "rating"});
    UIMenu.Menu.AddMenuItem('Таблица рейтинга дуэлей', "", {doName: "drating"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if(item.doName == 'start') {
            mp.events.callRemote('server:race:toLobby');
            quest.standart(false, -1, 7);
        }
        if(item.doName == 'startGangZone')
            mp.events.callRemote('server:gangZone:toLobby');
        if(item.doName == 'rating')
            mp.events.callRemote('server:race:rating');
        if(item.doName == 'drating')
            mp.events.callRemote('server:duel:rating');
        if(item.doName == 'duel')
            menuList.showMazeBankLobbyCreateDuoMenu();
    });
};

menuList.showMazeBankLobbyCreateDuoMenu = function(bet = 0, death = 3)
{
    UIMenu.Menu.Create(" ", "~b~MazeBank Arena", 'arena', false, false, 'mba');

    UIMenu.Menu.AddMenuItem(`Ставка ~g~${methods.moneyFormat(bet)}`, 'Нажмите ~g~Enter~s~ чтобы изменить', {doName: "setBet"});
    UIMenu.Menu.AddMenuItem(`До ~b~${death}~s~ смертей`, 'Нажмите ~g~Enter~s~ чтобы изменить', {doName: "setDeath"});
    UIMenu.Menu.AddMenuItem('~g~Пригласить', 'Взнос: ~g~$250', {doName: "duel"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        if(item.doName == 'setBet')
        {
            let name = methods.parseInt(await UIMenu.Menu.GetUserInput("Сумма ставки", "", 9));
            if (name > 25000) {
                mp.game.ui.notifications.show(`~r~Значение не должно быть больше 25000`);
                menuList.showMazeBankLobbyCreateDuoMenu(name, death);
                return;
            }
            if (name < 0) {
                mp.game.ui.notifications.show(`~r~Значение не должно быть меньше 0`);
                menuList.showMazeBankLobbyCreateDuoMenu(name, death);
                return;
            }
            menuList.showMazeBankLobbyCreateDuoMenu(name, death)
        }
        if(item.doName == 'setDeath')
        {
            let name = methods.parseInt(await UIMenu.Menu.GetUserInput("Кол-во смертей", "", 9));
            if (name > 5) {
                mp.game.ui.notifications.show(`~r~Значение не должно быть больше 5`);
                menuList.showMazeBankLobbyCreateDuoMenu(name, death);
                return;
            }
            if (name < 2) {
                mp.game.ui.notifications.show(`~r~Значение не должно быть меньше 2`);
                menuList.showMazeBankLobbyCreateDuoMenu(name, death);
                return;
            }
            menuList.showMazeBankLobbyCreateDuoMenu(bet, name)
        }
        if(item.doName == 'duel') {
            UIMenu.Menu.HideMenu();
            let name = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите ID игрока", "", 9));
            if (name === mp.players.local.remoteId) {
                mp.game.ui.notifications.show(`~r~Нельзя самого себя позвать на дуэль`);
                return;
            }
            mp.events.callRemote('server:duel:toLobby', name, bet, death);
        }
    });
};

menuList.showMazeBankLobbyAskDuoMenu = function(playerId, bet, death, name, mmr, count, win)
{
    UIMenu.Menu.Create(" ", "~b~MazeBank Arena", 'arena', false, false, 'mba');

    UIMenu.Menu.AddMenuItem(`${name} (${playerId}): ~g~${mmr}~s~ | ~q~${count}~s~ | ~y~${win}`);
    UIMenu.Menu.AddMenuItem(`Ставка ~g~${methods.moneyFormat(bet)}`);
    UIMenu.Menu.AddMenuItem(`До ~b~${death}~s~ смертей`);
    UIMenu.Menu.AddMenuItem('~g~Принять', 'Взнос: ~g~$250', {doName: "duel"});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {

        if(item.doName == 'duel') {
            UIMenu.Menu.HideMenu();
            mp.events.callRemote('server:duel:accept', playerId, bet, death);
        }
    });
};

menuList.showTattooShopMenu = function(title1, title2, shopId, price)
{
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create(" ", "~b~Тату салон", 'false', false, false, title1);

    UIMenu.Menu.AddMenuItem("Голова", "", {zone: "ZONE_HEAD"});
    UIMenu.Menu.AddMenuItem("Торс", "", {zone: "ZONE_TORSO"});
    UIMenu.Menu.AddMenuItem("Левая рука", "", {zone: "ZONE_LEFT_ARM"});
    UIMenu.Menu.AddMenuItem("Правая рука", "", {zone: "ZONE_RIGHT_ARM"});
    UIMenu.Menu.AddMenuItem("Левая нога", "", {zone: "ZONE_LEFT_LEG"});
    UIMenu.Menu.AddMenuItem("Правая нога", "", {zone: "ZONE_RIGHT_LEG"});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.zone)
            menuList.showTattooShopShortMenu(title1, title2, item.zone, shopId, price);
    });
};

menuList.showTattooShopShortMenu = function(title1, title2, zone, shopId, price)
{
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create(" ", "~b~Тату салон", 'false', false, false, title1);

    let list = [];

    let tattooList = JSON.parse(enums.tattooList);

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
        ) && title1 == "shopui_title_tattoos3")
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
        ) && title1 == "shopui_title_tattoos")
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
        ) && title1 == "shopui_title_tattoos2")
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
        ) && title1 == "shopui_title_tattoos5")
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
        ) && title1 == "shopui_title_tattoos4")
            continue;

        let price = methods.parseFloat(methods.parseFloat(tattooList[i][5]) / 5);

        let saleLabel = '';
        let sale = business.getSale(price);
        if (sale > 0)
            saleLabel = `~br~~s~Скидка: ~r~${sale}%`;

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
                let menuListItem = {};
                menuListItem.doName = 'destroy';
                menuListItem.price = price / 2;
                menuListItem.tatto0 = methods.replaceQuotes(tattooList[i][0]);
                menuListItem.tatto1 = tattooList[i][1];
                menuListItem.tatto2 = tattooList[i][3];
                menuListItem.tatto3 = tattooList[i][4];
                UIMenu.Menu.AddMenuItem(tattooList[i][0], `Свести тату~br~Цена: ~g~${methods.moneyFormat(price / 2)}`, menuListItem, '~g~Куплено', (sale > 0) ? 'sale' : '');
                list.push(menuListItem);
            }
            else {
                let menuListItem = {};
                menuListItem.doName = 'show';
                menuListItem.price = price;
                menuListItem.tatto0 = methods.replaceQuotes(tattooList[i][0]);
                menuListItem.tatto1 = tattooList[i][1];
                menuListItem.tatto2 = tattooList[i][3];
                menuListItem.tatto3 = tattooList[i][4];
                UIMenu.Menu.AddMenuItem(tattooList[i][0], `Цена: ~g~${methods.moneyFormat(price)}${saleLabel}`, menuListItem, '', (sale > 0) ? 'sale' : '');
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
                let menuListItem = {};
                menuListItem.doName = 'destroy';
                menuListItem.price = price / 2;
                menuListItem.tatto0 = methods.replaceQuotes(tattooList[i][0]);
                menuListItem.tatto1 = tattooList[i][1];
                menuListItem.tatto2 = tattooList[i][2];
                menuListItem.tatto3 = tattooList[i][4];
                UIMenu.Menu.AddMenuItem(tattooList[i][0], `Свести тату~br~Цена: ~g~${methods.moneyFormat(price / 2)}`, menuListItem, '~g~Куплено', (sale > 0) ? 'sale' : '');
                list.push(menuListItem);
            }
            else {
                let menuListItem = {};
                menuListItem.doName = 'show';
                menuListItem.price = price;
                menuListItem.tatto0 = methods.replaceQuotes(tattooList[i][0]);
                menuListItem.tatto1 = tattooList[i][1];
                menuListItem.tatto2 = tattooList[i][2];
                menuListItem.tatto3 = tattooList[i][4];
                UIMenu.Menu.AddMenuItem(tattooList[i][0], `Цена: ~g~${methods.moneyFormat(price)}${saleLabel}`, menuListItem, '', (sale > 0) ? 'sale' : '');
                list.push(menuListItem);
            }
        }
    }

    //UIMenu.Menu.AddMenuItem("~y~Свести всё тату", "Цена: ~g~$1999.99").doName = "clearTattoo";
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnIndexSelect.Add((index) => {
        if (index >= list.length)
            return;
        user.clearDecorations();
        user.setDecoration(list[index].tatto1, list[index].tatto2);
    });

    UIMenu.Menu.OnClose.Add(() => {
        user.updateTattoo();
    });

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if(item.doName == 'show')
            mp.events.callRemote('server:tattoo:buy', item.tatto1, item.tatto2, zone, item.price, item.tatto0, shopId);
        if(item.doName == 'destroy')
            mp.events.callRemote('server:tattoo:destroy', item.tatto1, item.tatto2, zone, item.price, 'Лазерная коррекция', shopId);
    });
};

menuList.showVehShopMenu = function(shopId, carPos, buyPos, carList)
{
    methods.getVehicleInfo(shopId);

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create("Салон", "~b~Посмотреть список транспорта");
    UIMenu.Menu.AddMenuItem("~g~Войти в салон", "", {enter: true});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
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

    let list = [];

    let vehicleInfo = enums.vehicleInfo;

    vehicleInfo.forEach(item => {
        if (shopId != item.type)
            return;

        /*let label = `~c~${item.display_name} (0 шт.)`;
        let subLabel = `\n~r~Доступно только для аренды`;

        if (carList.has(item.display_name)) {
            label = `${item.display_name} (${carList.get(item.display_name)} шт.)`;
            subLabel = ``;
        }*/

        try {
            let label = methods.removeQuotes(methods.removeQuotes2(mp.game.ui.getLabelText(item.display_name)));
            label = methods.removeQuotes(methods.removeQuotes2(label));
            if (label === 'NULL')
                label = item.display_name;

            let count = 0;
            if (carList.has(item.display_name))
                count = methods.parseInt(carList.get(item.display_name));

            let carInfo = [];

            carInfo.push({title: 'Класс', info: item.class_name});
            if (user.getCache('s_hud_speed_type'))
                carInfo.push({title: 'Макс. скорость', info: `~${vehicles.getSpeedMax(mp.game.joaat(item.display_name))} KM/H`});
            else
                carInfo.push({title: 'Макс. скорость', info: `~${methods.parseInt(vehicles.getSpeedMax(mp.game.joaat(item.display_name)) / 1.609)} MP/H`});

            if (item.fuel_type > 0) {
                carInfo.push({title: 'Тип топлива', info: `${vehicles.getFuelLabel(item.fuel_type)}`});
                carInfo.push({title: 'Вместимость бака', info: `${item.fuel_full}${vehicles.getFuelPostfix(item.fuel_type)}`});
                carInfo.push({title: 'Расход топлива', info: `${item.fuel_min}${vehicles.getFuelPostfix(item.fuel_type)}`});
            }
            else
                carInfo.push({title: 'Расход топлива', info: `Отсутствует`});

            if (item.stock > 0) {

                let stockFull = item.stock_full;
                if (item.stock_full > 0)
                    stockFull = stockFull / 1000;

                carInfo.push({title: 'Объем багажника', info: `${item.stock}см³`});
                carInfo.push({title: 'Допустимый вес', info: `${stockFull}кг.`});
            }
            else
                carInfo.push({title: 'Багажник', info: `Отсутствует`});

            list.push(
                {
                    make: label,
                    model: item.class_name,
                    name: item.display_name,
                    count: count,
                    price: methods.moneyFormat(item.price, 1),
                    rent: methods.moneyFormat(item.price / 100 + 100.01, 999),
                    img: enums.getVehicleImg(item.display_name),
                    character_car: carInfo,
                    color_car_main: ['111', '0', '4', '28', '38', '42', '70', '81', '135', '107'],
                    color_car_secondary: ['111', '0', '4', '28', '38', '42', '70', '81', '135', '107'],
                    current_main_color: '111',
                    current_secondary_color: '111',
                }
            );
        }
        catch (e) {
            methods.debug(e);
        }
    });

    let listNew = methods.sortBy(list, 'make');

    vShop.createVehicle(listNew[0].name);

    ui.callCef('carShop', JSON.stringify({ type: 'updateValues', list: listNew, isShow: true }));
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

    let lscBanner1 = 'lsc'; //DEFAULT

    switch (shopId) {
        case 5:
        case 6:
        case 7:
        case 8:
            lscBanner1 = 'lsc';
            break;
        case 10:
            lscBanner1 = 'lsc_beekers';
            break;
        case 9:
            lscBanner1 = 'lsc_bennys';
            break;
    }

    UIMenu.Menu.Create(" ", "~b~Автомастерская", 'false', false, false, lscBanner1);

    let itemPrice = 500 * price;
    let menuItem = {};
    menuItem.price = itemPrice;
    menuItem.doName = 'repair';
    UIMenu.Menu.AddMenuItem("Ремонт", `Цена: ~g~${methods.moneyFormat(itemPrice)}`, menuItem);

    menuItem = {};
    menuItem.doName = 'setTunning';
    UIMenu.Menu.AddMenuItem("Тюнинг", "", menuItem);

    menuItem = {};
    menuItem.doName = 'setSTunning';
    UIMenu.Menu.AddMenuItem("Установка модулей", "", menuItem);

    itemPrice = 40000;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.doName = 'setNumber';
    UIMenu.Menu.AddMenuItem("Сменить номер", `Цена: ~g~${methods.moneyFormat(itemPrice)}~br~~s~4 символа ~g~$100.000~br~~s~3 символа ~g~$250.000~br~~s~2 символа ~g~$500.000~br~~s~1 символ ~g~$1.000.000`, menuItem);

    menuItem = {};
    menuItem.doName = 'setColor';
    UIMenu.Menu.AddMenuItem("Покраска транспорта", "", menuItem);

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        try {
            if (item.doName == 'closeButton')
                return;

            if (item.doName == 'repair')
                mp.events.callRemote('server:lsc:repair', shopId, item.price);

            if (veh.getVariable('user_id') > 0 || user.isAdmin()) {
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

    UIMenu.Menu.Create(` `, `~b~Выбор цвета`, 'false', false, false, lscBanner1);

    let saleLabel = '';
    let sale = business.getSale(price);
    if (sale > 0)
        saleLabel = `~br~~s~Скидка: ~r~${sale}%`;

    UIMenu.Menu.AddMenuItem("Основной цвет", 'Цена: ~g~' + methods.moneyFormat((3000 * price) + saleLabel), {doName: "color1Item"}, '', (sale > 0) ? 'sale' : '');
    UIMenu.Menu.AddMenuItem("Дополнительный цвет", 'Цена: ~g~' + methods.moneyFormat((1000 * price) + saleLabel), {doName: "color2Item"}, '', (sale > 0) ? 'sale' : '');
    UIMenu.Menu.AddMenuItem("Перламутровый цвет", 'Цена: ~g~' + methods.moneyFormat((5000 * price) + saleLabel), {doName: "color3Item"}, '', (sale > 0) ? 'sale' : '');
    UIMenu.Menu.AddMenuItem("Цвет колёс", 'Цена: ~g~' + methods.moneyFormat((1500 * price) + saleLabel), {doName: "color4Item"}, '', (sale > 0) ? 'sale' : '');

    UIMenu.Menu.AddMenuItem("Цвет приборной панели", 'Цена: ~g~' + methods.moneyFormat((800 * price) + saleLabel) + '~br~~r~Учтите, не на всех транспортных средствах доступна смена цвета приборной панели', {doName: "color5Item"}, '', (sale > 0) ? 'sale' : '');
    UIMenu.Menu.AddMenuItem("Цвет салона", 'Цена: ~g~' + methods.moneyFormat((5000 * price) + saleLabel) + '~br~~r~Учтите, не на всех транспортных средствах доступна смена цвета салона', {doName: "color6Item"}, '', (sale > 0) ? 'sale' : '');

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(item => {
        UIMenu.Menu.HideMenu();
        if (item.doName == 'color1Item')
            menuList.showLscColorChoiseMenu(shopId, price, lscBanner1, 'Выбор основного цвета', '1', 3000, 'color1');
        else if (item.doName == 'color2Item')
            menuList.showLscColorChoiseMenu(shopId, price, lscBanner1, 'Выбор дополнительного цвета', '2', 1000, 'color2');
        else if (item.doName == 'color3Item')
            menuList.showLscColorChoiseMenu(shopId, price, lscBanner1, 'Выбор перламутрового цвета', '3', 5000, 'color3');
        else if (item.doName == 'color4Item')
            menuList.showLscColorChoiseMenu(shopId, price, lscBanner1, 'Выбор цвета колес', '4', 1500, 'colorwheel');
        else if (item.doName == 'color5Item')
            menuList.showLscColorChoiseMenu(shopId, price, lscBanner1, 'Выбор цвета приборной панели', '5', 800, 'colord');
        else if (item.doName == 'color6Item')
            menuList.showLscColorChoiseMenu(shopId, price, lscBanner1, 'Выбор цвета салона', '6', 5000, 'colori');
    });
};

menuList.showLscColorChoiseMenu = async function(shopId, price, lscBanner1, labelDesc = '', eventId = '', price2 = 500, carData = 'color1') {

    let veh = mp.players.local.vehicle;

    if (!veh) {
        mp.game.ui.notifications.show(`~r~Необходимо находиться в личном транспорте`);
        return;
    }

    let car = await vehicles.getData(veh.getVariable('container'));
    let list = [];

    UIMenu.Menu.Create(` `, `~b~${labelDesc}`, 'false', false, false, lscBanner1);

    for (let i = 0; i < 161; i++) {
        try {
            let label = enums.lscColorsEn[i];
            if (i === 0)
                label = "По умолчанию";
            let listItem = {};
            listItem.modType = i;
            listItem.price = price2 * price;
            listItem.itemName = label;
            UIMenu.Menu.AddMenuItem(`${label}`,`Цена: ~g~${methods.moneyFormat(price2 * price)}`, listItem, '', '', (car.get(carData) === i) ? 'done' : '');
            list.push(listItem);
        }
        catch (e) {
            methods.debug(e);
        }
    }

    UIMenu.Menu.AddMenuItem("~g~Назад", "", {doName: "backMenu"});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnIndexSelect.Add((index) => {
        if (index >= list.length)
            return;
        mp.events.callRemote('server:lsc:showColor' + eventId, index);
    });

    UIMenu.Menu.OnSelect.Add(item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'backMenu') {
            menuList.showLscColorMenu(shopId, price, lscBanner1);
            return;
        }
        if (item.doName === 'closeMenu') {
            return;
        }
        mp.events.callRemote('server:lsc:buyColor' + eventId, item.modType, price2 * price + 0.001, shopId, `Цвет: ${item.itemName}`);
        menuList.showLscMenu(shopId, price);
    });
};

menuList.showLscSTunningMenu = async function(shopId, price, lscBanner1) {

    let veh = mp.players.local.vehicle;

    if (!veh) {
        mp.game.ui.notifications.show(`~r~Необходимо находиться в личном транспорте`);
        return;
    }

    let vehInfo = methods.getVehicleInfo(veh.model);

    let car = await vehicles.getData(veh.getVariable('container'));
    let upgrade = null;
    if (car.has('upgrade'))
        upgrade = JSON.parse(car.get('upgrade'));

    UIMenu.Menu.Create(` `, `~b~Установка модулей`, 'false', false, false, lscBanner1);

    let itemPrice = 100000 + 0.001;
    let menuItem = {};
    menuItem.price = itemPrice;
    menuItem.doName = 'setNeon';
    UIMenu.Menu.AddMenuItem("Неоновая подсветка", `Цена: ~g~${methods.moneyFormat(methods.parseInt(itemPrice))}`, menuItem);

    itemPrice = 750000 + 0.001;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.doName = 'setLight';
    UIMenu.Menu.AddMenuItem("Цветные фары", `Цена: ~g~${methods.moneyFormat(methods.parseInt(itemPrice))}`, menuItem);

    itemPrice = 500000 + 0.001;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.doName = 'setSmoke';
    UIMenu.Menu.AddMenuItem("Специальные покрышки с напылением", `Цена: ~g~${methods.moneyFormat(methods.parseInt(itemPrice))}~br~~s~Если вы уже купили покрышки, то стоимость смены цвета стоит ~g~$1.000`, menuItem);

    itemPrice = 10000 + 0.001;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.doName = 'setSpecial';
    UIMenu.Menu.AddMenuItem("Дистанционное управление", `Цена: ~g~${methods.moneyFormat(methods.parseInt(itemPrice))}`, menuItem);

    let list = ['Стандартый', 'Чёрный', 'Синий', 'Белый'];
    itemPrice = 5000 + 0.001;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.numberPlate = true;
    UIMenu.Menu.AddMenuItemList("Тип номера", list, `Цена: ~g~${methods.moneyFormat(methods.parseInt(itemPrice))}`, menuItem, car.get('number_type'));

    let modId = 0;
    let idx = 0;
    list = ['Стандарт', 'Задний', 'З.75% / П.25%', 'Полный', 'З.25% / П.75%', 'Передний'];
    if (upgrade != null && upgrade[modId + 100]) {
        switch (upgrade[modId + 100].toString()) {
            case '0':
                idx = 1;
                break;
            case '0.25':
                idx = 2;
                break;
            case '0.5':
                idx = 3;
                break;
            case '0.75':
                idx = 4;
                break;
            case '1':
                idx = 5;
                break;
        }
    }
    itemPrice = enums.lscSNames[modId][1] + 0.001;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.modSpecId = modId;
    UIMenu.Menu.AddMenuItemList("Привод", list, `Цена: ~g~${methods.moneyFormat(methods.parseInt(itemPrice))}`, menuItem, idx);

    let listGlobal = [[]];
    for (let i = 1; i < enums.lscSNames.length; i++) {
        modId = i;
        idx = 0;
        list = ['Стандарт'];
        for (let i = 1; i <= enums.lscSNames[modId][2]; i++)
            list.push((i / 10).toString());
        listGlobal.push(list);
        try {
            if (upgrade != null && upgrade[modId + 100]) {
                for (let i = 0; i < list.length; i++) {
                    if (upgrade[modId + 100].toString() === list[i].toString())
                        idx = i;
                }
            }
        }
        catch (e) {
            methods.debug(e);
        }
        itemPrice = enums.lscSNames[modId][1] + 0.001;
        menuItem = {};
        menuItem.price = itemPrice;
        menuItem.modSpecId = modId;
        UIMenu.Menu.AddMenuItemList(enums.lscSNames[modId][0], list, `Цена: ~g~${methods.moneyFormat(methods.parseInt(itemPrice))}~br~~c~${enums.lscSNames[modId][3]}`, menuItem, idx);
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    let listIndex = 0;
    UIMenu.Menu.OnList.Add((item, index) => {
        listIndex = index;
        if (item.numberPlate) {
            mp.events.callRemote('server:lsc:showNumberType', index);
        }
    });

    UIMenu.Menu.OnSelect.Add(item => {
        UIMenu.Menu.HideMenu();
        if (item.modSpecId >= 0) {
            if (
                vehInfo.class_name == 'Helicopters' ||
                vehInfo.class_name == 'Planes' ||
                vehInfo.class_name == 'Cycles' ||
                vehInfo.class_name == 'Commercials' ||
                vehInfo.class_name == 'Motorcycles' ||
                vehInfo.class_name == 'Utility' ||
                vehInfo.class_name == 'Boats'
            ) {
                mp.game.ui.notifications.show(`~r~Данный класс транспорта нельзя ставить улучшение`);
                return;
            }
            if (listIndex === 0)
            {
                mp.game.ui.notifications.show("~y~Для того чтобы всё работало корректно, необходимо перереспавнить трансопрт");
                mp.events.callRemote('server:lsc:resetSTun', item.modSpecId);
            }
            else {
                if (item.modSpecId === 0)
                    mp.events.callRemote('server:lsc:buySTun', item.modSpecId, listIndex, item.price, shopId, enums.lscSNames[item.modSpecId][0]);
                else
                    mp.events.callRemote('server:lsc:buySTun', item.modSpecId, listGlobal[item.modSpecId][listIndex], item.price, shopId, enums.lscSNames[item.modSpecId][0]);
            }
        }
        if (item.numberPlate) {
            mp.events.callRemote('server:lsc:buyNumberType', listIndex, item.price, shopId);
        }
        if (item.doName == 'setNeon') {
            if (
                vehInfo.class_name == 'Helicopters' ||
                vehInfo.class_name == 'Planes' ||
                vehInfo.class_name == 'Cycles' ||
                //vehInfo.class_name == 'Vans' ||
                vehInfo.class_name == 'Commercials' ||
                vehInfo.class_name == 'Motorcycles' ||
                vehInfo.class_name == 'Utility' ||
                vehInfo.class_name == 'Boats'
            ) {
                mp.game.ui.notifications.show(`~r~Данный класс транспорта нельзя ставить неон`);
                return;
            }

            mp.events.callRemote('server:lsc:buyNeon', shopId, methods.parseInt(item.price));
        }
        if (item.doName == 'setLight') {
            if (
                vehInfo.class_name == 'Helicopters' ||
                vehInfo.class_name == 'Planes' ||
                vehInfo.class_name == 'Cycles' ||
                vehInfo.class_name == 'Utility' ||
                vehInfo.class_name == 'Boats'
            ) {
                mp.game.ui.notifications.show(`~r~Данный класс транспорта нельзя ставить цвет фар`);
                return;
            }

            mp.events.callRemote('server:lsc:buyLight', shopId, methods.parseInt(item.price));
        }
        if (item.doName == 'setSmoke') {
            if (
                vehInfo.class_name == 'Helicopters' ||
                vehInfo.class_name == 'Planes' ||
                vehInfo.class_name == 'Cycles' ||
                vehInfo.class_name == 'Utility' ||
                vehInfo.class_name == 'Boats'
            ) {
                mp.game.ui.notifications.show(`~r~Данный класс транспорта нельзя ставить модификацию`);
                return;
            }
            menuList.showLscTyreColorChoiseMenu(shopId, price, lscBanner1);
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

menuList.showLscTyreColorChoiseMenu = async function(shopId, price, lscBanner1, price2 = 500000.01) {

    let veh = mp.players.local.vehicle;

    if (!veh) {
        mp.game.ui.notifications.show(`~r~Необходимо находиться в личном транспорте`);
        return;
    }

    let car = await vehicles.getData(veh.getVariable('container'));

    UIMenu.Menu.Create(` `, `~b~Установка специального напыления`, 'false', false, false, lscBanner1);

    for (let i = 0; i < enums.rgbNames.length; i++) {
        try {
            let label = enums.rgbNames[i];
            let listItem = {};
            listItem.modType = i;
            if (car.get('is_tyre'))
                UIMenu.Menu.AddMenuItem(`${label}`,`Смена цвета. Цена: ~g~$1.000`, listItem);
            else
                UIMenu.Menu.AddMenuItem(`${label}`,`Цена: ~g~${methods.moneyFormat(price2)}`, listItem);
        }
        catch (e) {
            methods.debug(e);
        }
    }

    //UIMenu.Menu.AddMenuItem("~g~Назад", "", {doName: "backMenu"});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'closeMenu') {
            return;
        }
        mp.events.callRemote('server:lsc:buyTyreColor', item.modType, car.get('is_tyre') ? 1000 : price2, shopId);
        menuList.showLscMenu(shopId, price);
    });
};

menuList.showLscTunningMenu = function(shopId, price, lscBanner1) {

    let veh = mp.players.local.vehicle;

    if (!veh) {
        mp.game.ui.notifications.show(`~r~Необходимо находиться в личном транспорте`);
        return;
    }

    let vehInfo = methods.getVehicleInfo(veh.model);

    UIMenu.Menu.Create(` `, `~b~${vehInfo.display_name}`, 'false', false, false, lscBanner1);

    for (let i = 0; i < 100; i++) {
        if (i == 69 || i == 76 || i == 78)
            continue;
        try {
            if (veh.getNumMods(i) == 0) continue;
            if (i == 23) continue;

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
            if (i == 9 || i == 10) {
                if (vehInfo.display_name == 'JB7002')
                    continue;
            }
            if (i == 40) {
                if (vehInfo.display_name == 'Nexus')
                    continue;
            }

            if (veh.getNumMods(i) > 0 && enums.lscNames[i][1] > 0) {
                let label = mp.game.ui.getLabelText(veh.getModSlotName(i));
                if (label == "NULL" || label == "")
                    label = `${enums.lscNames[i][0]}`;
                UIMenu.Menu.AddMenuItem(`${label}`,`Нажмите ~g~Enter~s~, чтобы посмотреть`, {modType: i});
            }
        }
        catch (e) {
            methods.debug(e);
        }
    }

    UIMenu.Menu.AddMenuItem(`Тонировка`,`Нажмите ~g~Enter~s~, чтобы посмотреть`, {modType: 69});
    UIMenu.Menu.AddMenuItem(`Турбо`,`Нажмите ~g~Enter~s~, чтобы посмотреть`, {modType: 18});
    if (veh.getLiveryCount() > 1)
        UIMenu.Menu.AddMenuItem(`Специальная окраска`,`Нажмите ~g~Enter~s~, чтобы посмотреть`, {modType: 76});

    let isExtra = false;
    for (let i = 0; i < 10; i++) {
        if (veh.doesExtraExist(i))
            isExtra = true;
    }

    if (isExtra)
        UIMenu.Menu.AddMenuItem(`Экстра тюнинг`,`Нажмите ~g~Enter~s~, чтобы посмотреть`, {modType: 80});

    if (vehInfo.class_name !== 'Motorcycles')
        UIMenu.Menu.AddMenuItem(`Колёса`,`Нажмите ~g~Enter~s~, чтобы посмотреть`, {modType: 78});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'closeMenu')
            return;
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
        let upgradeList = {};
        try {
            upgradeList = JSON.parse(car.get('upgrade'))
        }
        catch (e) {
        }

        let list = [];
        let vehInfo = methods.getVehicleInfo(veh.model);

        if (!user.isAdmin()) {
            if (
                vehInfo.class_name == 'Helicopters' ||
                vehInfo.class_name == 'Planes' ||
                vehInfo.class_name == 'Cycles' ||
                //vehInfo.class_name == 'Vans' ||
                vehInfo.class_name == 'Commercials' ||
                vehInfo.class_name == 'Utility' ||
                vehInfo.class_name == 'Boats'
            ) {
                mp.game.ui.notifications.show(`~r~Данный класс транспорта нельзя тюнинговать`);
                return;
            }
        }

        let defaultPrice = price;
        price = price - 1;

        if (vehInfo.price >= 8000 && vehInfo.price < 15000)
            price += 1.2;
        else if (vehInfo.price >= 15000 && vehInfo.price < 30000)
            price += 1.4;
        else if (vehInfo.price >= 30000 && vehInfo.price < 45000)
            price += 1.6;
        else if (vehInfo.price >= 45000 && vehInfo.price < 60000)
            price += 1.8;
        else if (vehInfo.price >= 60000 && vehInfo.price < 75000)
            price += 2;
        else if (vehInfo.price >= 90000 && vehInfo.price < 105000)
            price += 2.2;
        else if (vehInfo.price >= 105000 && vehInfo.price < 120000)
            price += 2.4;
        else if (vehInfo.price >= 120000 && vehInfo.price < 135000)
            price += 2.6;
        else if (vehInfo.price >= 135000 && vehInfo.price < 150000)
            price += 2.8;
        else if (vehInfo.price >= 150000 && vehInfo.price < 200000)
            price += 3;
        else if (vehInfo.price >= 200000 && vehInfo.price < 240000)
            price += 3.3;
        else if (vehInfo.price >= 240000 && vehInfo.price < 280000)
            price += 3.6;
        else if (vehInfo.price >= 280000 && vehInfo.price < 320000)
            price += 4;
        else if (vehInfo.price >= 320000 && vehInfo.price < 380000)
            price += 4.4;
        else if (vehInfo.price >= 380000 && vehInfo.price < 500000)
            price += 5;
        else if (vehInfo.price >= 500000 && vehInfo.price < 600000)
            price += 5.5;
        else if (vehInfo.price >= 600000 && vehInfo.price < 700000)
            price += 6;
        else if (vehInfo.price >= 700000 && vehInfo.price < 800000)
            price += 6.5;
        else if (vehInfo.price >= 800000)
            price += 7;
        else
            price += 1;

        let saleLabel = '';
        let sale = business.getSale(defaultPrice);
        if (sale > 0)
            saleLabel = `~br~~s~Скидка: ~r~${sale}%`;

        UIMenu.Menu.Create(` `, `~b~${enums.lscNames[modType][0]}`, 'false', false, false, lscBanner1);

        let removePrice = (enums.lscNames[modType][1] * price) / 2;
        let removeItem = {};
        removeItem.doName = 'removeItem';
        UIMenu.Menu.AddMenuItem("Стандартная деталь", `Цена: ~g~${methods.moneyFormat(removePrice)}${saleLabel}`, removeItem, '', (sale > 0) ? 'sale' : '')
        list.push(removeItem);

        if (modType == 69) {
            for (let i = 0; i < 7; i++) {
                try {
                    let itemPrice = enums.lscNames[modType][1] * (i / 20 + price);
                    let label = `${enums.lscNames[modType][0]} #${(i + 1)}`;
                    label = methods.replaceQuotes(label);
                    let listItem = {};
                    let isBuy = '';

                    try {
                        if (upgradeList[modType.toString()] == i)
                            isBuy = 'done';
                    }
                    catch (e) {

                    }

                    listItem.modType = i;
                    listItem.price = itemPrice + 0.001;
                    listItem.itemName = label;
                    UIMenu.Menu.AddMenuItem(`${label}`,`Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, listItem, '', (sale > 0) ? 'sale' : '', isBuy);
                    list.push(listItem);
                }
                catch (e) {
                    methods.debug(e);
                }
            }
        }
        else if (modType == 18) {
            try {
                let itemPrice = enums.lscNames[modType][1] * (1 / 20 + price);
                let label = `${enums.lscNames[modType][0]} SpeedBoost`;
                label = methods.replaceQuotes(label);
                let listItem = {};
                let isBuy = '';

                try {
                    if (upgradeList[modType.toString()] == 0)
                        isBuy = 'done';
                }
                catch (e) {

                }
                listItem.modType = 0;
                listItem.price = itemPrice + 0.001;
                listItem.itemName = label;
                UIMenu.Menu.AddMenuItem(`${label}`,`Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, listItem, '', (sale > 0) ? 'sale' : '', isBuy);
                list.push(listItem);
            }
            catch (e) {
                methods.debug(e);
            }
        }
        else if (modType == 76) {
            for (let i = 0; i < veh.getLiveryCount(); i++) {
                try {
                    let itemPrice = enums.lscNames[modType][1] * (i / 20 + price);
                    let label = `${enums.lscNames[modType][0]} #${(i + 1)}`;
                    label = methods.replaceQuotes(label);
                    let listItem = {};
                    let isBuy = '';

                    try {
                        if (car.get('livery') == i)
                            isBuy = 'done';
                    }
                    catch (e) {

                    }
                    listItem.modType = i;
                    listItem.price = itemPrice + 0.001;
                    listItem.itemName = label;
                    UIMenu.Menu.AddMenuItem(`${label}`,`Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, listItem, '', (sale > 0) ? 'sale' : '', isBuy);
                    list.push(listItem);
                }
                catch (e) {
                    methods.debug(e);
                }
            }
        }
        else if (modType == 80) {

            let isExtra = false;

            for (let i = 0; i < 10; i++) {
                if (veh.doesExtraExist(i))
                    isExtra = true;
            }

            for (let i = 0; i < 10; i++) {
                try {
                    if (veh.doesExtraExist(i)) {
                        let itemPrice = enums.lscNames[modType][1] * (i / 20 + price);
                        let label = `${enums.lscNames[modType][0]}`;
                        label = methods.replaceQuotes(label);
                        let listItem = {};
                        let isBuy = '';

                        try {
                            if (car.get('extra') == i)
                                isBuy = 'done';
                        }
                        catch (e) {

                        }
                        listItem.modType = i;
                        listItem.price = itemPrice + 0.001;
                        listItem.itemName = label;
                        UIMenu.Menu.AddMenuItem(`${label}`,`Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, listItem, '', (sale > 0) ? 'sale' : '', isBuy);
                        list.push(listItem);
                    }
                }
                catch (e) {
                    methods.debug(e);
                }
            }
        }
        else if (modType == 78) {
            let wheelList = ['Спорт', 'Массл', 'Лоурайдер', 'Кроссовер', 'Внедорожник', 'Специальные', 'Мото', 'Уникальные', 'Benny\'s Original', 'Benny\'s Bespoke', 'Open Wheel'];
            for (let i = 0; i < wheelList.length; i++) {
                try {
                    let label = `${wheelList[i]}`;
                    label = methods.replaceQuotes(label);
                    let listItem = {};
                    let isBuy = '';

                    try {
                        if ((upgradeList[modType.toString()]) === i)
                            isBuy = 'done';
                    }
                    catch (e) {

                    }
                    listItem.modType = i;
                    listItem.price = 1;
                    listItem.itemName = label;
                    listItem.showWheel = true;
                    UIMenu.Menu.AddMenuItem(`${label}`, '', listItem, '', (sale > 0) ? 'sale' : '', isBuy);
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
                    if (modType === 14)
                        itemPrice = enums.lscNames[modType][1];
                    let label = mp.game.ui.getLabelText(veh.getModTextLabel(modType, i));
                    if (label == "NULL" || label == "")
                        label = `${enums.lscNames[modType][0]} #${(i + 1)}`;
                    label = methods.replaceQuotes(label);
                    let listItem = {};
                    let isBuy = '';

                    try {
                        if (upgradeList[modType.toString()] == i)
                            isBuy = 'done';
                    }
                    catch (e) {

                    }
                    listItem.modType = i;
                    listItem.price = itemPrice + 0.001;
                    listItem.itemName = label;
                    UIMenu.Menu.AddMenuItem(`${label}`,`Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, listItem, '', (sale > 0) ? 'sale' : '', isBuy);
                    list.push(listItem);
                }
                catch (e) {
                    methods.debug(e);
                }
            }
        }

        UIMenu.Menu.AddMenuItem("~g~Назад", "", {doName: "backMenu"});
        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnIndexSelect.Add((index) => {
            if (index === 0) {
                if (modType === 78) {
                    mp.game.ui.notifications.show(`~r~Для этого типа тюнинга не доступно`);
                    return;
                }
                else {
                    mp.events.callRemote('server:lsc:showTun', modType, -1);
                }
                return;
            }
            if (index >= list.length)
                return;
            if (modType === 80) {
                try {
                    mp.events.callRemote('server:lsc:showTun', modType, list[index].modType);
                }
                catch (e) {
                    mp.events.callRemote('server:lsc:showTun', modType, list[index].modType);
                }
            }
            else
                mp.events.callRemote('server:lsc:showTun', modType, list[index].modType);
        });

        UIMenu.Menu.OnSelect.Add(item => {
            UIMenu.Menu.HideMenu();
            if (item.doName === "backMenu")
                menuList.showLscTunningMenu(shopId, defaultPrice, lscBanner1);

            if (item.doName ===  'removeItem') {
                if (modType === 78) {
                    mp.game.ui.notifications.show(`~r~Для этого типа тюнинга не доступно`);
                    return;
                }
                mp.events.callRemote('server:lsc:buyTun', modType, -1, removePrice, shopId, 'Стандартная деталь');
                menuList.showLscTunningMenu(shopId, defaultPrice, lscBanner1);
            }

            if (item.price) {
                if (item.showWheel)
                {
                    setTimeout(function () {
                        if (item.modType === 10)
                            menuList.showLscTunningListMenu(23, shopId, defaultPrice * 3, lscBanner1);
                        else if (item.modType === 9 || item.modType === 8)
                            menuList.showLscTunningListMenu(23, shopId, defaultPrice * 2, lscBanner1);
                        else
                            menuList.showLscTunningListMenu(23, shopId, defaultPrice * 2, lscBanner1);
                    }, 300);
                }
                else {
                    menuList.showLscTunningMenu(shopId, defaultPrice, lscBanner1);
                    mp.events.callRemote('server:lsc:buyTun', modType, item.modType, methods.parseInt(item.price), shopId, item.itemName);
                }
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

    UIMenu.Menu.Create(" ", "~b~Магазин оружия", 'Ammo', false, false, 'ammu');

    enums.gunShopItems.forEach(itemId => {
        if (items.isWeapon(itemId)) {
            let itemPrice = items.getItemPrice(itemId) * price;
            let menuItem = {};
            menuItem.isWeapon = true;
            menuItem.itemId = itemId;
            UIMenu.Menu.AddMenuItem(items.getItemNameById(itemId), `Цена: ~g~${methods.moneyFormat(itemPrice)}`, menuItem, '>');
        }
        else if(items.isAmmo(itemId)) {
            let itemPrice = items.getItemPrice(itemId) * price;
            let menuItem = {};
            menuItem.price = itemPrice;
            menuItem.itemId = itemId;
            UIMenu.Menu.AddMenuItem(items.getItemNameById(itemId), `Цена: ~g~${methods.moneyFormat(itemPrice)}`, menuItem);
        }
        else {
            let itemPrice = items.getItemPrice(itemId) * price;
            let menuItem = {};
            menuItem.price = itemPrice;
            menuItem.itemId = itemId;
            UIMenu.Menu.AddMenuItem(items.getItemNameById(itemId), `Цена: ~g~${methods.moneyFormat(itemPrice)}`, menuItem);
        }
    });

    let itemPrice = 200 * price;
    let menuItem = {};
    menuItem.price = itemPrice;
    menuItem.armor = 25;
    UIMenu.Menu.AddMenuItem("Лёгкий бронежилет", `Цена: ~g~${methods.moneyFormat(itemPrice)}`, menuItem);

    itemPrice = 500 * price;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.armor = 65;
    UIMenu.Menu.AddMenuItem("Средний бронежилет", `Цена: ~g~${methods.moneyFormat(itemPrice)}`, menuItem);

    /*itemPrice = 320 * price;
    menuItem = UIMenu.Menu.AddMenuItem("Тяжелый бронежилет", `Цена: ~g~${methods.moneyFormat(itemPrice)}`);
    menuItem.price = itemPrice;
    menuItem.armor = 100;*/

    //UIMenu.Menu.AddMenuItem("~y~Ограбить").doName = "grab";

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        try {

            if (item.armor) {
                let amount = await inventory.getInvAmount(user.getCache('id'), 1);
                if (amount + items.getItemAmountById(252) > await inventory.getInvAmountMax(user.getCache('id'), 1)) {
                    mp.game.ui.notifications.show('~r~В инвентаре нет места');
                    return;
                }
                if (item.price > user.getCashMoney()) {
                    mp.game.ui.notifications.show("~r~У вас недостаточно средств");
                    return;
                }
                inventory.addItem(252, 1, inventory.types.Player, user.getCache('id'), item.armor);
                mp.game.ui.notifications.show("~b~Вы купили бронежилет");
                user.removeCashMoney(item.price, 'Покупка бронежилета');
                business.addMoney(shopId, item.price, 'Бронежилет');
                inventory.updateAmount(user.getCache('id'), 1);
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

    UIMenu.Menu.Create(" ", "~b~Магазин оружия", 'false', false, false, 'ammu');

    let isLic = weapons.getGunSlotIdByItem(itemId) != 5;

    if (isLic && !user.getCache('gun_lic'))
        UIMenu.Menu.AddMenuItem('~r~Требуется лицензия на оружие');

    let itemPrice = items.getItemPrice(itemId) * price;
    let menuItem = {};
    menuItem.price = itemPrice;
    menuItem.itemId = itemId;
    menuItem.superTint = 0;
    UIMenu.Menu.AddMenuItemList(items.getItemNameById(itemId), tintList, `Цена: ~g~${methods.moneyFormat(itemPrice)}`, menuItem);

    componentList.forEach(item => {
        if (item[3] == 0) {
            let itemPrice = items.getItemPrice(itemId) * price * 2;
            let menuItem = {};
            menuItem.price = itemPrice;
            menuItem.itemId = itemId;
            menuItem.superTint = item[2].toString();
            UIMenu.Menu.AddMenuItemList(`${items.getItemNameById(itemId)} ${item[1]}`, tintList, `Цена: ~g~${methods.moneyFormat(itemPrice)}`, menuItem);
        }
    });

    let ammoId = weapons.getGunAmmoNameByItemId(itemId);
    if (ammoId > 0) {
        let itemPrice = items.getItemPrice(ammoId) * price;
        let menuItem = {};
        menuItem.price = itemPrice;
        menuItem.itemId = ammoId;
        UIMenu.Menu.AddMenuItem(items.getItemNameById(ammoId), `Цена: ~g~${methods.moneyFormat(itemPrice)}`, menuItem);

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
                menuItem = {};
                menuItem.price = itemPrice;
                menuItem.itemId = wpcId;
                UIMenu.Menu.AddMenuItem(items.getItemNameById(wpcId), `Цена: ~g~${methods.moneyFormat(itemPrice)}`, menuItem);
            }
        });
    }

    UIMenu.Menu.AddMenuItem("~g~Назад", "", {doName: "backButton"});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    let listIndex = 0;
    UIMenu.Menu.OnList.Add((item, index) => {
        listIndex = index;
    });

    UIMenu.Menu.OnSelect.Add((item, index) => {
        try {

            if (item.armor) {
                if (item.price > user.getCashMoney()) {
                    mp.game.ui.notifications.show("~r~У вас недостаточно средств");
                    return;
                }
                user.setArmour(item.armor);
                mp.game.ui.notifications.show("~b~Вы купили бронежилет");
                user.removeCashMoney(item.price, 'Покупка бронежилета');
                business.addMoney(shopId, item.price, 'Бронежилет');
            }
            else if (item.price > 0) {
                if (isLic && !user.getCache('gun_lic')) {
                    mp.game.ui.notifications.show("~r~У Вас нет лицензии на оружие");
                    return;
                }
                if (item.superTint)
                    mp.events.callRemote('server:gun:buy', item.itemId, item.price, 1, item.superTint, tintListId[listIndex], shopId);
                else
                    mp.events.callRemote('server:gun:buy', item.itemId, item.price, 1, 0, 0, shopId);
            }
            else if (item.doName == 'backButton') {
                menuList.showGunShopMenu(shopId, price);
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

menuList.showAnimationTypeListMenu = function() {

    UIMenu.Menu.Create(`Анимации`, `~b~Меню анимаций`);

    UIMenu.Menu.AddMenuItem("Анимации действий", "", {doName: "animActionItem"});
    UIMenu.Menu.AddMenuItem("Позирующие анимации", "", {doName: "animPoseItem"});
    UIMenu.Menu.AddMenuItem("Положительные эмоции", "", {doName: "animPositiveItem"});
    UIMenu.Menu.AddMenuItem("Негативные эмоции", "", {doName: "animNegativeItem"});
    UIMenu.Menu.AddMenuItem("Танцы", "", {doName: "animDanceItem"});
    UIMenu.Menu.AddMenuItem("Остальные анимации", "", {doName: "animOtherItem"});
    UIMenu.Menu.AddMenuItem("Взаимодействие", "", {doName: "animSyncItem"});
    UIMenu.Menu.AddMenuItem("~y~Остановить анимацию", "", {doName: "animStopItem"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'animStopItem')
            user.stopAllAnimation();
        else if (item.doName === 'animOtherItem')
            menuList.showAnimationOtherListMenu();
        else if (item.doName === 'animSyncItem')
            menuList.showAnimationSyncListMenu();
        else if (item.doName === 'animActionItem')
            menuList.showAnimationListMenu('Анимации действий', enums.animActions);
        else if (item.doName === 'animDanceItem')
            menuList.showAnimationListMenu('Танцы', enums.animDance);
        else if (item.doName === 'animNegativeItem')
            menuList.showAnimationListMenu('Негативные эмоции', enums.animNegative);
        else if (item.doName === 'animPositiveItem')
            menuList.showAnimationListMenu('Положительные эмоции', enums.animPositive);
        else if (item.doName === 'animPoseItem')
            menuList.showAnimationListMenu('Позирующие анимации', enums.animPose);

    });
};

menuList.showAnimationListMenu = function(subtitle, array) {

    UIMenu.Menu.Create(`Анимации`, `~b~${subtitle}`);

    array.forEach(function (item, i, arr) {
        let menuItem = {};
        menuItem.anim1 = item[1];
        menuItem.anim2 = item[2];
        menuItem.animFlag = item[3];
        UIMenu.Menu.AddMenuItem(`${item[0]}`, '', menuItem);
    });

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        if (item.doName === 'closeMenu') {
            UIMenu.Menu.HideMenu();
            return;
        }

        if (mp.players.local.isInAir() ||
            mp.players.local.isReloading() ||
            mp.players.local.isRagdoll() ||
            mp.players.local.isFalling() ||
            mp.players.local.isShooting() ||
            //remotePlayer.isSprinting() ||
            mp.players.local.isGettingUp() ||
            mp.players.local.vehicle ||
            mp.players.local.getHealth() <= 0
        ) {
            mp.game.ui.notifications.show(`~b~Данное действие сейчас не доступно`);
            return;
        }

        mp.game.ui.notifications.show(`~b~Нажмите ~s~${bind.getKeyName(user.getCache('s_bind_stopanim'))}~b~ чтобы отменить анимацию`);
        user.playAnimation(item.anim1, item.anim2, item.animFlag);
    });
};

menuList.showAnimationOtherListMenu = function() {

    UIMenu.Menu.Create(`Анимации`, `~b~Остальные анимации`);

    enums.scenarios.forEach(function (item, i, arr) {
        UIMenu.Menu.AddMenuItem(`${item[0]}`, '', {scenario: item[1]});
    });

    enums.animRemain.forEach(function (item, i, arr) {
        let menuItem = {};
        menuItem.anim1 = item[1];
        menuItem.anim2 = item[2];
        menuItem.animFlag = item[3];
        UIMenu.Menu.AddMenuItem(`${item[0]}`, '', menuItem);
    });

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        if (item.doName === 'closeMenu') {
            UIMenu.Menu.HideMenu();
            return;
        }
        mp.game.ui.notifications.show(`~b~Нажмите ~s~${bind.getKeyName(user.getCache('s_bind_stopanim'))}~b~ чтобы отменить анимацию`);
        if (item.scenario)
            user.playScenario(item.scenario);
        else
            user.playAnimation(item.anim1, item.anim2, item.animFlag);
    });
};

menuList.showAnimationSyncListMenu = function() {

    UIMenu.Menu.Create(`Анимации`, `~b~Взаимодействие`);

    UIMenu.Menu.AddMenuItem(`Поздороваться 1`, "", {animId: 0});
    UIMenu.Menu.AddMenuItem(`Поздороваться 2`, "", {animId: 2});
    UIMenu.Menu.AddMenuItem(`Дать пять`, "", {animId: 1});
    UIMenu.Menu.AddMenuItem(`Поцелуй`, "", {animId: 3});
    //UIMenu.Menu.AddMenuItem(`Минет`).animId = 4;
    //UIMenu.Menu.AddMenuItem(`Секс`).animId = 5;

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        if (item.doName === 'closeMenu') {
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

menuList.showFractionKeyMenu = function(data) {

    UIMenu.Menu.Create(`Транспорт`, `~b~Транспорт организации`);

    data.forEach(function (item) {

        if (item.rank < 0) {
            UIMenu.Menu.AddMenuItem(`~c~${item.name}: ~s~`, `Транспорт не доступен`, {}, `${item.number + item.id}`);
            return;
        }

        if (item.rank >= user.getCache('rank') || user.isLeader() || user.isSubLeader()) {
            let menuItem = {};
            menuItem.vehicleId = item.id;
            menuItem.vName = item.name;
            UIMenu.Menu.AddMenuItem(`~b~${item.name}: ~s~`, "Нажмите \"~g~Enter~s~\" чтобы взять транспорт", menuItem, `${item.number}`);
        }
        else {
            UIMenu.Menu.AddMenuItem(`~c~${item.name}: ~s~`, `Транспорт не доступен`, {}, `${item.number + item.id}`);
        }
    });

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();

        if (item.vehicleId != undefined) {
            mp.events.callRemote('server:vehicle:spawnFractionCar', item.vehicleId);
        }
    });
};

menuList.showFractionInfoMenu = function() {

    UIMenu.Menu.Create(`Организация`, `~b~Ваша органзация`);

    if (user.isLeader() || user.isSubLeader() || ((user.isDepLeader() || user.isDepSubLeader()) && user.getCache('rank_type') === 0))
        UIMenu.Menu.AddMenuItem(`Принять в организацию`, '', {invite: true});

    if (user.isSapd() || user.isSheriff() || user.isFib()) {
        UIMenu.Menu.AddMenuItem(`Выдать лицензию на оружие`, "Стоимость: ~g~$30,000", {licName: "gun_lic"});

        UIMenu.Menu.AddMenuItem(`Забрать лицензию категории А`, "", {licRName: "a_lic"});
        UIMenu.Menu.AddMenuItem(`Забрать лицензию категории B`, "", {licRName: "b_lic"});
        UIMenu.Menu.AddMenuItem(`Забрать лицензию категории C`, "", {licRName: "c_lic"});
        UIMenu.Menu.AddMenuItem(`Забрать лицензию пилота`, "", {licRName: "air_lic"});
        UIMenu.Menu.AddMenuItem(`Забрать лицензию на водный ТС`, "", {licRName: "ship_lic"});
        UIMenu.Menu.AddMenuItem(`Забрать лицензию на перевозку пассажиров`, "Купив эту лицензию, у вас появляется возможность работать в такси (Достаточно иметь транспорт)", {licRName: "taxi_lic"});
        UIMenu.Menu.AddMenuItem(`Забрать лицензию на оружие`, "", {licRName: "gun_lic"});
    }
    if (user.isGov()) {

        if (user.isLeader())
            UIMenu.Menu.AddMenuItem(`Кабинет штата`, '', {coffer: true});

        UIMenu.Menu.AddMenuItem(`Выдать лицензию юриста`, "Стоимость: ~g~$20,000", {licName: "law_lic"});
        UIMenu.Menu.AddMenuItem(`Выдать лицензию на предпринимательство`, "Стоимость: ~g~$20,000", {licName: "biz_lic"});
        UIMenu.Menu.AddMenuItem(`Выдать разрешение на рыбаловство`, "Стоимость: ~g~$10,000", {licName: "fish_lic"});

        UIMenu.Menu.AddMenuItem(`Забрать лицензию юриста`, "", {licRName: "law_lic"});
        UIMenu.Menu.AddMenuItem(`Забрать лицензию на предпринимательство`, "", {licRName: "biz_lic"});
        UIMenu.Menu.AddMenuItem(`Забрать лицензию на рыбаловство`, "", {licRName: "fish_lic"});
    }
    if (user.isEms()) {
        UIMenu.Menu.AddMenuItem(`Выдать мед. страховку`, "Стоимость: ~g~$20,000", {licName: "med_lic"});
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();

        if (item.licName) {

            let id = methods.parseInt(await UIMenu.Menu.GetUserInput("ID Игрока", "", 9));
            if (id < 0) {
                mp.game.ui.notifications.show("~r~ID Игркоа не может быть меньше нуля");
                return;
            }

            if (item.licName == 'gun_lic')
                mp.events.callRemote('server:user:askSellLic', id, item.licName, 30000);
            if (item.licName == 'law_lic')
                mp.events.callRemote('server:user:askSellLic', id, item.licName, 20000);
            if (item.licName == 'biz_lic')
                mp.events.callRemote('server:user:askSellLic', id, item.licName, 20000);
            if (item.licName == 'med_lic')
                mp.events.callRemote('server:user:askSellLic', id, item.licName, 20000);
            if (item.licName == 'fish_lic')
                mp.events.callRemote('server:user:askSellLic', id, item.licName, 10000);
        }
        if (item.licRName) {

            let id = methods.parseInt(await UIMenu.Menu.GetUserInput("Card ID Игрока", "", 9));
            if (id < 0) {
                mp.game.ui.notifications.show("~r~ID Игркоа не может быть меньше нуля");
                return;
            }
            mp.events.callRemote('server:user:askSellRLic', id, item.licRName);
        }

        if (item.invite) {

            let id = methods.parseInt(await UIMenu.Menu.GetUserInput("ID Игрока", "", 9));
            if (id < 0) {
                mp.game.ui.notifications.show("~r~ID Игркоа не может быть меньше нуля");
                return;
            }
            mp.events.callRemote('server:user:invite', id);
        }

        if (item.coffer) {
            menuList.showCofferInfoMenu(await coffer.getAllData());
        }
    });
};

menuList.showFractionInvaderMenu = function() {

    UIMenu.Menu.Create(`Организация`, `~b~Ваша органзация`);

    if (!user.isLeader() && !user.isSubLeader() && !user.isDepLeader() && !user.isDepSubLeader() && user.getCache('rank_type') === 0) {
        UIMenu.Menu.AddMenuItem(`~y~Не доступно для стажеров`);
    }
    if (user.isLeader() || user.isSubLeader() || user.getCache('rank_type') > 0) {
        UIMenu.Menu.AddMenuItem(`Список объявлений`, "", {adList: true});
        UIMenu.Menu.AddMenuItem(`Список всех объявлений`, "", {adListAll: true});
    }
    if (user.isLeader() || user.isSubLeader() || user.getCache('rank_type') === 2) {
        UIMenu.Menu.AddMenuItem(`Написать новость`, "", {writeNews: true});
        UIMenu.Menu.AddMenuItem(`Список новостей`, "", {newsList: true});
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();

        if (item.writeNews) {
            menuList.showFractionInvaderNewsWriteMenu();
        }
        if (item.newsList) {
            mp.events.callRemote('server:invader:getNewsList');
        }
        if (item.adList) {
            mp.events.callRemote('server:invader:getAdTempList');
        }
        if (item.adListAll) {
            mp.events.callRemote('server:invader:getAdList');
        }
    });
};


menuList.showFractionInvaderNewsWriteMenu = function() {

    let title = '';
    let text = '';

    UIMenu.Menu.Create(`Организация`, `~b~Написать новость`);

    UIMenu.Menu.AddMenuItem(`~b~Заголовок~s~`, "", {title: true});
    UIMenu.Menu.AddMenuItem(`~b~Введите текст`, "", {text: true});
    UIMenu.Menu.AddMenuItem(`Прочитать текст`, "", {textRead: true});

    UIMenu.Menu.AddMenuItem(`~g~Отправить`, "", {save: true}).save = true;

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {

        if (item.title) {
            title = await UIMenu.Menu.GetUserInput("Введите заголовок", methods.replaceAll(methods.replaceAll(title, '\'', '`'), '"', '`'), 20);
            item.SetRightLabel(title);
            mp.game.ui.notifications.show("~b~Вы написали заголовок\n" + title);
        }
        if (item.text) {
            text = await UIMenu.Menu.GetUserInput("Введите текст", methods.replaceAll(methods.replaceAll(text, '\'', '`'), '"', '`'), 200);
            mp.game.ui.notifications.show("~b~Вы написали текст\n~s~" + text);
        }
        if (item.textRead) {
            chat.sendLocal(text);
        }
        if (item.save) {
            UIMenu.Menu.HideMenu();
            mp.events.callRemote('server:invader:sendNews', title, text);
        }
    });
};

menuList.showCofferInfoMenu = function(data) {

    UIMenu.Menu.Create(` `, `~b~Кабинет штата`, 'gov', false, false, 'gov');

    UIMenu.Menu.AddMenuItem("В казне средств: ", "", {}, '~g~' + methods.moneyFormat(data.get('cofferMoney')));

    UIMenu.Menu.AddMenuItem("Пособие", `Текущая ставка: ~g~${methods.moneyFormat(data.get('cofferBenefit'))}`, {doName: "cofferBenefit"});
    UIMenu.Menu.AddMenuItem("Налог на имущество", `Текущая ставка: ~g~${data.get('cofferTaxProperty')}%`, {doName: "cofferTaxProperty"});
    UIMenu.Menu.AddMenuItem("Налог на зарплату", `Текущая ставка: ~g~${data.get('cofferTaxPayDay')}%`, {doName: "cofferTaxPayDay"});
    UIMenu.Menu.AddMenuItem("Налог на бизнес", `Текущая ставка: ~g~${data.get('cofferTaxBusiness')}%`, {doName: "cofferTaxBusiness"});
    UIMenu.Menu.AddMenuItem("Промежуточный налог", `Текущая ставка: ~g~${data.get('cofferTaxIntermediate')}%`, {doName: "cofferTaxIntermediate"});

    UIMenu.Menu.AddMenuItem("Финансировать бюджет правительства", "", {doName: "cofferGiveGov"});
    UIMenu.Menu.AddMenuItem("Финансировать бюджет LSPD", "", {doName: "cofferGiveLspd"});
    UIMenu.Menu.AddMenuItem("Финансировать бюджет BCSD", "", {doName: "cofferGiveSheriff"});
    UIMenu.Menu.AddMenuItem("Финансировать бюджет USMC", "", {doName: "cofferGiveUsmc"});
    UIMenu.Menu.AddMenuItem("Финансировать бюджет FIB", "", {doName: "cofferGiveFib"});
    UIMenu.Menu.AddMenuItem("Финансировать бюджет EMS", "", {doName: "cofferGiveEms"});
    UIMenu.Menu.AddMenuItem("Финансировать бюджет Invader News", "", {doName: "cofferGiveInvader"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {

        if (item.doName == 'cofferGiveGov') {
            let price = methods.parseFloat(await UIMenu.Menu.GetUserInput("Введите сумму", '', 10));

            if (price < 0) {
                mp.game.ui.notifications.show(`~r~Значение не может быть меньше нуля`);
                return;
            }
            if (price > await coffer.getMoney()) {
                mp.game.ui.notifications.show(`~r~В Бюджете недостаточно средств`);
                return;
            }
            if (price > 1000000) {
                mp.game.ui.notifications.show(`~r~Значение не может быть больше 1,000,000`);
                return;
            }
            coffer.removeMoney(1, price);
            coffer.addMoney(2, price);

            methods.saveLog('log_coffer',
                ['name', 'text'],
                [user.getCache('name'), `Перевёл ${methods.moneyFormat(price)} из казны на счёт Правительства.`],
            );
            mp.game.ui.notifications.show(`~g~Вы перевели денежные средства`);
        }
        if (item.doName == 'cofferGiveLspd') {
            let price = methods.parseFloat(await UIMenu.Menu.GetUserInput("Введите сумму", '', 10));

            if (price < 0) {
                mp.game.ui.notifications.show(`~r~Значение не может быть меньше нуля`);
                return;
            }
            if (price > await coffer.getMoney()) {
                mp.game.ui.notifications.show(`~r~В Бюджете недостаточно средств`);
                return;
            }
            if (price > 1000000) {
                mp.game.ui.notifications.show(`~r~Значение не может быть больше 1,000,000`);
                return;
            }
            coffer.removeMoney(1, price);
            coffer.addMoney(3, price);

            methods.saveLog('log_coffer',
                ['name', 'text'],
                [user.getCache('name'), `Перевёл ${methods.moneyFormat(price)} из казны на счёт LSPD.`],
            );
            mp.game.ui.notifications.show(`~g~Вы перевели денежные средства`);
        }
        if (item.doName == 'cofferGiveSheriff') {
            let price = methods.parseFloat(await UIMenu.Menu.GetUserInput("Введите сумму", '', 10));

            if (price < 0) {
                mp.game.ui.notifications.show(`~r~Значение не может быть меньше нуля`);
                return;
            }
            if (price > await coffer.getMoney()) {
                mp.game.ui.notifications.show(`~r~В Бюджете недостаточно средств`);
                return;
            }
            if (price > 1000000) {
                mp.game.ui.notifications.show(`~r~Значение не может быть больше 1,000,000`);
                return;
            }
            coffer.removeMoney(1, price);
            coffer.addMoney(4, price);

            methods.saveLog('log_coffer',
                ['name', 'text'],
                [user.getCache('name'), `Перевёл ${methods.moneyFormat(price)} из казны на счёт BCSD.`],
            );
            mp.game.ui.notifications.show(`~g~Вы перевели денежные средства`);
        }
        if (item.doName == 'cofferGiveFib') {
            let price = methods.parseFloat(await UIMenu.Menu.GetUserInput("Введите сумму", '', 10));

            if (price < 0) {
                mp.game.ui.notifications.show(`~r~Значение не может быть меньше нуля`);
                return;
            }
            if (price > await coffer.getMoney()) {
                mp.game.ui.notifications.show(`~r~В Бюджете недостаточно средств`);
                return;
            }
            if (price > 1000000) {
                mp.game.ui.notifications.show(`~r~Значение не может быть больше 1,000,000`);
                return;
            }
            coffer.removeMoney(1, price);
            coffer.addMoney(5, price);

            methods.saveLog('log_coffer',
                ['name', 'text'],
                [user.getCache('name'), `Перевёл ${methods.moneyFormat(price)} из казны на счёт FIB.`],
            );
            mp.game.ui.notifications.show(`~g~Вы перевели денежные средства`);
        }
        if (item.doName == 'cofferGiveUsmc') {
            let price = methods.parseFloat(await UIMenu.Menu.GetUserInput("Введите сумму", '', 10));

            if (price < 0) {
                mp.game.ui.notifications.show(`~r~Значение не может быть меньше нуля`);
                return;
            }
            if (price > await coffer.getMoney()) {
                mp.game.ui.notifications.show(`~r~В Бюджете недостаточно средств`);
                return;
            }
            if (price > 1000000) {
                mp.game.ui.notifications.show(`~r~Значение не может быть больше 1,000,000`);
                return;
            }
            coffer.removeMoney(1, price);
            coffer.addMoney(7, price);

            methods.saveLog('log_coffer',
                ['name', 'text'],
                [user.getCache('name'), `Перевёл ${methods.moneyFormat(price)} из казны на счёт USMC.`],
            );
            mp.game.ui.notifications.show(`~g~Вы перевели денежные средства`);
        }
        if (item.doName == 'cofferGiveEms') {
            let price = methods.parseFloat(await UIMenu.Menu.GetUserInput("Введите сумму", '', 10));

            if (price < 0) {
                mp.game.ui.notifications.show(`~r~Значение не может быть меньше нуля`);
                return;
            }
            if (price > await coffer.getMoney()) {
                mp.game.ui.notifications.show(`~r~В Бюджете недостаточно средств`);
                return;
            }
            if (price > 1000000) {
                mp.game.ui.notifications.show(`~r~Значение не может быть больше 1,000,000`);
                return;
            }
            coffer.removeMoney(1, price);
            coffer.addMoney(6, price);

            methods.saveLog('log_coffer',
                ['name', 'text'],
                [user.getCache('name'), `Перевёл ${methods.moneyFormat(price)} из казны на счёт EMS.`],
            );
            mp.game.ui.notifications.show(`~g~Вы перевели денежные средства`);
        }
        if (item.doName == 'cofferGiveInvader') {
            let price = methods.parseFloat(await UIMenu.Menu.GetUserInput("Введите сумму", '', 10));

            if (price < 0) {
                mp.game.ui.notifications.show(`~r~Значение не может быть меньше нуля`);
                return;
            }
            if (price > await coffer.getMoney()) {
                mp.game.ui.notifications.show(`~r~В Бюджете недостаточно средств`);
                return;
            }
            if (price > 1000000) {
                mp.game.ui.notifications.show(`~r~Значение не может быть больше 1,000,000`);
                return;
            }
            coffer.removeMoney(1, price);
            coffer.addMoney(8, price);

            methods.saveLog('log_coffer',
                ['name', 'text'],
                [user.getCache('name'), `Перевёл ${methods.moneyFormat(price)} из казны на счёт Life Invader.`],
            );
            mp.game.ui.notifications.show(`~g~Вы перевели денежные средства`);
        }
        if (item.doName == 'cofferTaxIntermediate') {
            let price = methods.parseFloat(await UIMenu.Menu.GetUserInput("Введите число", '', 10));

            if (price < 0) {
                mp.game.ui.notifications.show(`~r~Значение не может быть меньше нуля`);
                return;
            }
            if (price > 10) {
                mp.game.ui.notifications.show(`~r~Значение не может быть больше 10`);
                return;
            }

            coffer.setTaxIntermediate(1, price);
            methods.notifyWithPictureToAll(
                `Губернатор`,
                'Новости правительства',
                `Изменён промежуточный налог.\nСтарое значение: ~g~${data.get('cofferTaxIntermediate')}%~s~\nНовое значение: ~g~${price}%`,
                'CHAR_FLOYD'
            );
        }
        if (item.doName == 'cofferTaxBusiness') {
            let price = methods.parseFloat(await UIMenu.Menu.GetUserInput("Введите число", '', 10));

            if (price < 0) {
                mp.game.ui.notifications.show(`~r~Значение не может быть меньше нуля`);
                return;
            }
            if (price > 10) {
                mp.game.ui.notifications.show(`~r~Значение не может быть больше 10`);
                return;
            }

            coffer.setTaxBusiness(1, price);
            methods.notifyWithPictureToAll(
                `Губернатор`,
                'Новости правительства',
                `Изменён налог на бизнес.\nСтарое значение: ~g~${data.get('cofferTaxBusiness')}%~s~\nНовое значение: ~g~${price}%`,
                'CHAR_FLOYD'
            );
        }
        if (item.doName == 'cofferTaxPayDay') {
            let price = methods.parseFloat(await UIMenu.Menu.GetUserInput("Введите число", '', 10));

            if (price < 0) {
                mp.game.ui.notifications.show(`~r~Значение не может быть меньше нуля`);
                return;
            }
            if (price > 10) {
                mp.game.ui.notifications.show(`~r~Значение не может быть больше 10`);
                return;
            }

            coffer.setTaxPayDay(1, price);
            methods.notifyWithPictureToAll(
                `Губернатор`,
                'Новости правительства',
                `Изменён налог на зарплату.\nСтарое значение: ~g~${data.get('cofferTaxPayDay')}%~s~\nНовое значение: ~g~${price}%`,
                'CHAR_FLOYD'
            );
        }
        if (item.doName == 'cofferTaxProperty') {
            let price = methods.parseFloat(await UIMenu.Menu.GetUserInput("Введите число", '', 10));

            if (price < 0) {
                mp.game.ui.notifications.show(`~r~Значение не может быть меньше нуля`);
                return;
            }
            if (price > 2) {
                mp.game.ui.notifications.show(`~r~Значение не может быть больше 2`);
                return;
            }

            coffer.setTaxIntermediate(1, price);
            methods.notifyWithPictureToAll(
                `Губернатор`,
                'Новости правительства',
                `Изменён налог на имущество.\nСтарое значение: ~g~${data.get('cofferTaxProperty')}%~s~\nНовое значение: ~g~${price}%`,
                'CHAR_FLOYD'
            );
        }
        if (item.doName == 'cofferBenefit') {
            let price = methods.parseFloat(await UIMenu.Menu.GetUserInput("Введите число", '', 10));

            if (price < 0) {
                mp.game.ui.notifications.show(`~r~Значение не может быть меньше нуля`);
                return;
            }
            if (price > 100) {
                mp.game.ui.notifications.show(`~r~Значение не может быть больше 100`);
                return;
            }

            coffer.setBenefit(1, price);
            methods.notifyWithPictureToAll(
                `Губернатор`,
                'Новости правительства',
                `Изменена ставка на пособие.\nСтарое значение: ~g~${methods.moneyFormat(data.get('cofferBenefit'))}~s~\nНовое значение: ~g~${methods.moneyFormat(price)}`,
                'CHAR_FLOYD'
            );
        }
    });
};

menuList.showAskBuyLicMenu = function(playerId, lic, licName, price) {

    UIMenu.Menu.Create(`Лицензия`, `~b~${licName}`);
    UIMenu.Menu.AddMenuItem(`~g~Купить лицензию за ${methods.moneyFormat(price)}`, "", {isAccept: true});
    UIMenu.Menu.AddMenuItem("~r~Отказаться", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.isAccept) {
            setTimeout(quest.fish, 5000);
            setTimeout(quest.business, 5000);
            mp.events.callRemote('server:user:buyLicensePlayer', playerId, lic, price);
        }
    });
};

menuList.showGovGarderobMenu = function() {
    UIMenu.Menu.Create(`Гардероб`, `~b~Гардероб`);

    UIMenu.Menu.AddMenuItem("Сухпаёк", "", {itemId: 32});

    if (user.getCache('rank_type') === 5) {
        UIMenu.Menu.AddMenuItem("Наручники", "", {itemId: 40});
        UIMenu.Menu.AddMenuItem("Фонарик", "", {itemId: 59});
        UIMenu.Menu.AddMenuItem("Полицейская дубинка", "", {itemId: 66});
        UIMenu.Menu.AddMenuItem("Электрошокер", "", {itemId: 82});
        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Beretta 90Two", "", {itemId: 78});
        UIMenu.Menu.AddMenuItem("Фонарик Beretta 90Two", "", {itemId: 311});
        UIMenu.Menu.AddMenuItem("Оптический прицел Beretta 90Two", "", {itemId: 312});
        UIMenu.Menu.AddMenuItem("Глушитель Beretta 90Two", "", {itemId: 313});
        UIMenu.Menu.AddMenuItem("Компенсатор Beretta 90Two", "", {itemId: 314});
        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("SIG MPX-SD", "", {itemId: 97});
        UIMenu.Menu.AddMenuItem("Фонарик SIG MPX-SD", "", {itemId: 338});
        UIMenu.Menu.AddMenuItem("Рукоятка SIG MPX-SD", "", {itemId: 339});
        UIMenu.Menu.AddMenuItem("Прицел SIG MPX-SD", "", {itemId: 340});
        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm", "", {itemId: 280});
    }

    UIMenu.Menu.AddMenuItem("Бронежилет", "", {armor: 100});

    let list = ["Default", "Type #1", "Type #2"];
    UIMenu.Menu.AddMenuItemList("Галстук", list);

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnList.Add((item, index) => {
        if (index == 0) {
            user.giveUniform(0);
        }
        else if (index == 1) {
            user.giveUniform(36);
        }
        else if (index == 2) {
            user.giveUniform(37);
        }
    });

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.armor) {
            user.setArmour(100);
            mp.game.ui.notifications.show("~b~Вы взяли броню");
        }
        if (item.itemId) {
            let moneyFraction = await coffer.getMoney(coffer.getIdByFraction(user.getCache('fraction_id')));
            let itemPrice = items.getItemPrice(item.itemId);

            if (moneyFraction < itemPrice) {
                mp.game.ui.notifications.show(`~r~В бюджете организации не достаточно средств`);
                return;
            }
            if (items.isWeapon(item.itemId))
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "Правительство", "userName": "${user.getCache('name')}"}`, 'Выдано оружие').then();
            else
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "Правительство", "userName": "${user.getCache('name')}"}`, 'Выдан предмет').then();
        }
    });
};

menuList.showEmsGarderobMenu = function() {

    UIMenu.Menu.Create(`Гардероб`, `~b~Гардероб EMS`);

    let listGarderob = [
        "Повседневная одежда",
        "Форма парамедика #1",
        "Форма парамедика #2",
        "Зимняя форма парамедика #1",
        "Зимняя форма парамедика #2",
        "Форма спасателя #1",
        "Форма спасателя #2",
        "Форма врача #1",
        "Форма врача #2",
        "Форма врача #3",
        "Форма врача #4",
        "Форма врача #5",
        "Форма врача #6"
    ];

    for (let i = 0; i < listGarderob.length; i++) {
        try {
            UIMenu.Menu.AddMenuItem(`${listGarderob[i]}`);
        }
        catch (e) {
            methods.debug(e);
        }
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnIndexSelect.Add((index) => {
        if (index >= listGarderob.length)
            return;
        if (index === 0)
            user.giveUniform(index);
        else
            user.giveUniform(index + 23);
    });
};

menuList.showEmsArsenalMenu = function() {
    UIMenu.Menu.Create(`Арсенал`, `~b~Арсенал`);

    UIMenu.Menu.AddMenuItem("Сухпаёк", "", {itemId: 32});
    UIMenu.Menu.AddMenuItem("Антипохмелин", "", {itemId: 221});

    if (user.isLeader() || user.isSubLeader()) {
        UIMenu.Menu.AddMenuItem("Рецепт на большую аптечку", "Рецепт для крафта", {recHealB: true});
        UIMenu.Menu.AddMenuItem("Рецепт на малую аптечку", "Рецепт для крафта", {recHeal: true});
    }
    
    if (user.getCache('rank_type') !== 0 || user.isLeader() || user.isSubLeader() || user.isDepLeader() || user.isDepSubLeader()) {
        UIMenu.Menu.AddMenuItem("Большая Аптечка", "", {itemId: 278});
        UIMenu.Menu.AddMenuItem("Дефибриллятор", "", {itemId: 277});
        UIMenu.Menu.AddMenuItem("Полицейское огорождение", "", {itemId: 199});
        UIMenu.Menu.AddMenuItem("Полосатый конус", "", {itemId: 201});
        UIMenu.Menu.AddMenuItem("Красный конус", "", {itemId: 202});
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.itemId) {
            let moneyFraction = await coffer.getMoney(coffer.getIdByFraction(user.getCache('fraction_id')));
            let itemPrice = items.getItemPrice(item.itemId);

            if (moneyFraction < itemPrice) {
                mp.game.ui.notifications.show(`~r~В бюджете организации не достаточно средств`);
                return;
            }

            if (items.isWeapon(item.itemId))
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "EMS", "userName": "${user.getCache('name')}"}`, 'Выдано оружие').then();
            else
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "EMS", "userName": "${user.getCache('name')}"}`, 'Выдан предмет').then();
        }
        if (item.recHealB) {
            inventory.takeNewWeaponItem(474, `{"owner": "EMS", "userName": "${user.getCache('name')}", "id":0}`, 'Выдан рецепт').then();
        }
        if (item.recHeal) {
            inventory.takeNewWeaponItem(474, `{"owner": "EMS", "userName": "${user.getCache('name')}", "id":1}`, 'Выдан рецепт').then();
        }
    });
};

menuList.showEmsFreeMenu = function() {
    UIMenu.Menu.Create(`EMS`, `~b~Мед. панель`);
    UIMenu.Menu.AddMenuItem("Выписать человека", "", {doName: 'free'});
    UIMenu.Menu.AddMenuItem("Вылечить человека", "", {doName: 'heal'});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'free') {
            let id = await UIMenu.Menu.GetUserInput("ID Игрока", "", 10);
            mp.events.callRemote('server:med:free', methods.parseInt(id));
        }
        if (item.doName === 'heal') {
            let id = await UIMenu.Menu.GetUserInput("ID Игрока", "", 10);
            mp.events.callRemote('server:med:heal', methods.parseInt(id));
        }
    });
};

menuList.showSheriffGarderobMenu = function() {

    UIMenu.Menu.Create(`Гардероб`, `~b~Гардероб SHERIFF`);

    let listGarderob = ["Повседневная одежда", "Кадетская форма", "Офицерская форма #1", "Офицерская форма #2", "Офицерская форма #3", "Офицерская форма #4", "Офицерская форма #5", "Офицерская форма #6", "Укрепленная форма", "Air Support Division", "Tactical Division", "Представительская форма"];

    for (let i = 0; i < listGarderob.length; i++) {
        try {
            UIMenu.Menu.AddMenuItem(`${listGarderob[i]}`);
        }
        catch (e) {
            methods.debug(e);
        }
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnIndexSelect.Add((index) => {
        if (index >= listGarderob.length)
            return;
        if (index === 0)
            user.giveUniform(index);
        else
            user.giveUniform(index + 12);
    });
};

menuList.showSheriffArsenalMenu = function() {
    UIMenu.Menu.Create(`Арсенал`, `~b~Арсенал`);

    UIMenu.Menu.AddMenuItem("Сухпаёк", "", {itemId: 32});

    if (user.getCache('rank_type') !== 0 || user.isLeader() || user.isSubLeader() || user.isDepLeader() || user.isSubLeader()) {
        UIMenu.Menu.AddMenuItem("Большая Аптечка", "", {itemId: 278});
        UIMenu.Menu.AddMenuItem("Полицейское огорождение", "", {itemId: 199});
        UIMenu.Menu.AddMenuItem("Полосатый конус", "", {itemId: 201});
        UIMenu.Menu.AddMenuItem("Красный конус", "", {itemId: 202});
    }

    UIMenu.Menu.AddMenuItem("~b~Сдача конфиската", "", {sellItems: true});
    UIMenu.Menu.AddMenuItem("~b~Сдать грязные деньги", "", {getMoneyPolice: true});
    UIMenu.Menu.AddMenuItem("~b~Оружие", "", {showGun: true});
    UIMenu.Menu.AddMenuItem("~b~Модули на оружие", "", {showGunMod: true});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();

        if (item.showGun) {
            menuList.showSheriffArsenalGunMenu();
        }
        if (item.showGunMod) {
            menuList.showSheriffArsenalGunModMenu();
        }
        if (item.sellItems) {
            inventory.getItemListSell();
        }
        if (item.getMoneyPolice) {
            mp.events.callRemote('server:sellMoneyPolice');
        }
        if (item.itemId) {
            let moneyFraction = await coffer.getMoney(coffer.getIdByFraction(user.getCache('fraction_id')));
            let itemPrice = items.getItemPrice(item.itemId);

            if (moneyFraction < itemPrice) {
                mp.game.ui.notifications.show(`~r~В бюджете организации не достаточно средств`);
                return;
            }

            if (items.isWeapon(item.itemId))
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "BCSD", "userName": "${user.getCache('name')}", "tint": 4}`, 'Выдано оружие').then();
            else
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "BCSD", "userName": "${user.getCache('name')}"}`, 'Выдан предмет').then();
        }
    });
};

menuList.showSheriffArsenalGunMenu = function() {
    UIMenu.Menu.Create(`Арсенал`, `~b~Оружие`);

    UIMenu.Menu.AddMenuItem("Наручники", "", {itemId: 40});
    UIMenu.Menu.AddMenuItem("Фонарик", "", {itemId: 59});
    UIMenu.Menu.AddMenuItem("Полицейская дубинка", "", {itemId: 66});
    UIMenu.Menu.AddMenuItem("Электрошокер", "", {itemId: 82});

    if (user.getCache('rank_type') === 0) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two", "", {itemId: 78});
        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm", "", {itemId: 280});
    }
    if (user.getCache('rank_type') === 1 || user.getCache('rank_type') === 2 || user.getCache('rank_type') === 3 || user.getCache('rank_type') === 4) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two", "", {itemId: 78});
        UIMenu.Menu.AddMenuItem("Glock 17", "", {itemId: 146});
        UIMenu.Menu.AddMenuItem("Benelli M3", "", {itemId: 90});
        UIMenu.Menu.AddMenuItem("Benelli M4", "", {itemId: 91});
        UIMenu.Menu.AddMenuItem("HK-416", "", {itemId: 110});

        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm", "", {itemId: 280});
        UIMenu.Menu.AddMenuItem("Коробка патронов 12 калибра", "", {itemId: 281});
        UIMenu.Menu.AddMenuItem("Коробка патронов 5.56mm", "", {itemId: 284});
    }
    if (user.getCache('rank_type') === 5) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two", "", {itemId: 78});
        UIMenu.Menu.AddMenuItem("Glock 17", "", {itemId: 146});
        UIMenu.Menu.AddMenuItem("MP5A3", "", {itemId: 103});

        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm", "", {itemId: 280});
    }
    if (user.getCache('rank_type') === 6 || user.isLeader() || user.isSubLeader() || user.isDepLeader() || user.isDepSubLeader()) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two", "", {itemId: 78});
        UIMenu.Menu.AddMenuItem("Glock 17", "", {itemId: 146});
        UIMenu.Menu.AddMenuItem("Benelli M3", "", {itemId: 90});
        UIMenu.Menu.AddMenuItem("Benelli M4", "", {itemId: 91});
        UIMenu.Menu.AddMenuItem("HK-416", "", {itemId: 110});
        UIMenu.Menu.AddMenuItem("HK-416A5", "", {itemId: 111});

        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm", "", {itemId: 280});
        UIMenu.Menu.AddMenuItem("Коробка патронов 12 калибра", "", {itemId: 281});
        UIMenu.Menu.AddMenuItem("Коробка патронов 5.56mm", "", {itemId: 284});
    }

    UIMenu.Menu.AddMenuItem("Бронежилет", "", {armor: 100});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.armor) {
            user.setArmour(100);
            mp.game.ui.notifications.show("~b~Вы взяли броню");
        }
        if (item.itemId) {
            let moneyFraction = await coffer.getMoney(coffer.getIdByFraction(user.getCache('fraction_id')));
            let itemPrice = items.getItemPrice(item.itemId);

            if (moneyFraction < itemPrice) {
                mp.game.ui.notifications.show(`~r~В бюджете организации не достаточно средств`);
                return;
            }

            if (items.isWeapon(item.itemId))
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "BCSD", "userName": "${user.getCache('name')}", "tint": 4}`, 'Выдано оружие').then();
            else
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "BCSD", "userName": "${user.getCache('name')}"}`, 'Выдан предмет').then();
        }
    });
};

menuList.showSheriffArsenalGunModMenu = function() {
    UIMenu.Menu.Create(`Арсенал`, `~b~Модули на оружие`);

    if (user.getCache('rank_type') === 1 || user.getCache('rank_type') === 2 || user.getCache('rank_type') === 3 || user.getCache('rank_type') === 4) {
        UIMenu.Menu.AddMenuItem("Фонарик Beretta 90Two", "", {itemId: 311});
        UIMenu.Menu.AddMenuItem("Оптический прицел Beretta 90Two", "", {itemId: 312});
        UIMenu.Menu.AddMenuItem("Глушитель Beretta 90Two", "", {itemId: 313});
        UIMenu.Menu.AddMenuItem("Компенсатор Beretta 90Two", "", {itemId: 314});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Глушитель Glock 17", "", {itemId: 316});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M3", "", {itemId: 341});
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M3", "", {itemId: 342});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Голографический прицел Benelli M4", "", {itemId: 349});
        UIMenu.Menu.AddMenuItem("Прицел малой кратности Benelli M4", "", {itemId: 350});
        UIMenu.Menu.AddMenuItem("Прицел средней кратности Benelli M4", "", {itemId: 351});
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M4", "", {itemId: 352});
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M4", "", {itemId: 353});
        UIMenu.Menu.AddMenuItem("Дульный тормоз Benelli M4", "", {itemId: 354});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик HK-416", "", {itemId: 362});
        UIMenu.Menu.AddMenuItem("Рукоятка HK-416", "", {itemId: 363});
        UIMenu.Menu.AddMenuItem("Глушитель HK-416", "", {itemId: 364});
        UIMenu.Menu.AddMenuItem("Прицел HK-416", "", {itemId: 365});
    }
    else if (user.getCache('rank_type') === 5) {
        UIMenu.Menu.AddMenuItem("Фонарик Beretta 90Two", "", {itemId: 311});
        UIMenu.Menu.AddMenuItem("Оптический прицел Beretta 90Two", "", {itemId: 312});
        UIMenu.Menu.AddMenuItem("Глушитель Beretta 90Two", "", {itemId: 313});
        UIMenu.Menu.AddMenuItem("Компенсатор Beretta 90Two", "", {itemId: 314});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Глушитель Glock 17", "", {itemId: 316});
    }
    else if (user.getCache('rank_type') === 6 || user.isLeader() || user.isSubLeader() || user.isDepLeader() || user.isDepSubLeader()) {
        UIMenu.Menu.AddMenuItem("Фонарик Beretta 90Two", "", {itemId: 311});
        UIMenu.Menu.AddMenuItem("Оптический прицел Beretta 90Two", "", {itemId: 312});
        UIMenu.Menu.AddMenuItem("Глушитель Beretta 90Two", "", {itemId: 313});
        UIMenu.Menu.AddMenuItem("Компенсатор Beretta 90Two", "", {itemId: 314});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Глушитель Glock 17", "", {itemId: 316});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M3", "", {itemId: 341});
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M3", "", {itemId: 342});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Голографический прицел Benelli M4", "", {itemId: 349});
        UIMenu.Menu.AddMenuItem("Прицел малой кратности Benelli M4", "", {itemId: 350});
        UIMenu.Menu.AddMenuItem("Прицел средней кратности Benelli M4", "", {itemId: 351});
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M4", "", {itemId: 352});
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M4", "", {itemId: 353});
        UIMenu.Menu.AddMenuItem("Дульный тормоз Benelli M4", "", {itemId: 354});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик HK-416", "", {itemId: 362});
        UIMenu.Menu.AddMenuItem("Рукоятка HK-416", "", {itemId: 363});
        UIMenu.Menu.AddMenuItem("Глушитель HK-416", "", {itemId: 364});
        UIMenu.Menu.AddMenuItem("Прицел HK-416", "", {itemId: 365});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик HK-416A5", "", {itemId: 416});
        UIMenu.Menu.AddMenuItem("Голографический прицел HK-416A5", "", {itemId: 417});
        UIMenu.Menu.AddMenuItem("Прицел малой кратности HK-416A5", "", {itemId: 418});
        UIMenu.Menu.AddMenuItem("Прицел большой кратности HK-416A5", "", {itemId: 419});
        UIMenu.Menu.AddMenuItem("Глушитель HK-416A5", "", {itemId: 420});
        UIMenu.Menu.AddMenuItem("Тактический дульный тормоз HK-416A5", "", {itemId: 422});
        UIMenu.Menu.AddMenuItem("Рукоятка HK-416A5", "", {itemId: 428});
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.itemId) {
            let moneyFraction = await coffer.getMoney(coffer.getIdByFraction(user.getCache('fraction_id')));
            let itemPrice = items.getItemPrice(item.itemId);

            if (moneyFraction < itemPrice) {
                mp.game.ui.notifications.show(`~r~В бюджете организации не достаточно средств`);
                return;
            }

            if (items.isWeapon(item.itemId))
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "BCSD", "userName": "${user.getCache('name')}", "tint": 4}`, 'Выдано оружие').then();
            else
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "BCSD", "userName": "${user.getCache('name')}"}`, 'Выдан предмет').then();
        }
    });
};

menuList.showSapdGarderobMenu = function() {

    UIMenu.Menu.Create(`Гардероб`, `~b~Гардероб LSPD`);

    let listGarderob = [
        "Повседневная одежда",
        "Кадетская форма",
        "Офицерская форма",
        "Офицерская укрепленная форма",
        "Tactical Division Black",
        "Tactical Division Red",
        "Tactical Division Classic",
        "Tactical Division Classic Night",
        "Tactical Division Standard",
        "Альтернативная форма",
        "Детективная форма",
        "Air Support Division",
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

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnIndexSelect.Add((index) => {
        if (index >= listGarderob.length)
            return;
        user.giveUniform(index);
    });
};

menuList.showUsmcGarderobMenu = function() {

    UIMenu.Menu.Create(`Гардероб`, `~b~Гардероб USMC`);

    let listGarderob = [
        "Повседневная одежда",
        "Регулярная форма #1",
        "Регулярная форма #2",
        "Регулярная форма #3",
        "Special Forces #1",
        "Special Forces #2",
        "Air Support Division #1",
        "Air Support Division #2",
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

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnIndexSelect.Add((index) => {
        if (index >= listGarderob.length)
            return;
        if (index === 0)
            user.giveUniform(index);
        else
            user.giveUniform(index + 37);
    });
};

menuList.showSapdArrestMenu = function() {

    UIMenu.Menu.Create(`PC`, `~b~Арест`);
    UIMenu.Menu.AddMenuItem("Арест", "", {eventName: "server:user:arrest"});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.eventName) {
            let id = await UIMenu.Menu.GetUserInput("ID Игрока", "", 10);
            mp.events.callRemote(item.eventName, methods.parseInt(id));
        }
    });
};

menuList.showSapdClearMenu = function() {
    if (!user.isLeader() && !user.isSubLeader()) {
        if (user.getCache('rank') > 1 && user.getCache('rank_type') === 0) {
            mp.game.ui.notifications.show("~r~Не доступно для кадетов");
            return;
        }
    }

    UIMenu.Menu.Create(`PC`, `~b~Меню`);
    UIMenu.Menu.AddMenuItem("Выдать розыск", "", {eventName: "server:user:giveWanted"});
    UIMenu.Menu.AddMenuItem("Очистить розыск", "", {eventName: "server:user:giveWantedClear"});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.eventName == 'server:user:giveWantedClear') {
            let id = await UIMenu.Menu.GetUserInput("Card ID", "", 10);
            mp.events.callRemote('server:user:giveWanted', methods.parseInt(id), 0, 'clear');
        }
        if (item.eventName == 'server:user:giveWanted') {
            let id = await UIMenu.Menu.GetUserInput("Card ID", "", 10);
            let count = await UIMenu.Menu.GetUserInput("Уровень", "", 10);
            let reason = await UIMenu.Menu.GetUserInput("Причина", "", 10);
            mp.events.callRemote('server:user:giveWanted', methods.parseInt(id), count, reason);
        }
    });
};

menuList.showSapdArsenalMenu = function() {
    UIMenu.Menu.Create(`Арсенал`, `~b~Арсенал`);

    UIMenu.Menu.AddMenuItem("Сухпаёк", "", {itemId: 32});
    if (user.getCache('rank_type') !== 0 || user.isLeader() || user.isSubLeader() || user.isDepLeader() || user.isSubLeader()) {
        UIMenu.Menu.AddMenuItem("Большая Аптечка", "", {itemId: 278});
        UIMenu.Menu.AddMenuItem("Полицейское огорождение", "", {itemId: 199});
        UIMenu.Menu.AddMenuItem("Полосатый конус", "", {itemId: 201});
        UIMenu.Menu.AddMenuItem("Красный конус", "", {itemId: 202});
    }

    UIMenu.Menu.AddMenuItem("~b~Сдача конфиската", "", {sellItems: true});
    UIMenu.Menu.AddMenuItem("~b~Сдать грязные деньги", "", {getMoneyPolice: true});
    UIMenu.Menu.AddMenuItem("~b~Оружие", "", {showGun: true});
    UIMenu.Menu.AddMenuItem("~b~Модули на оружие", "", {showGunMod: true});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.armor) {
            user.setArmour(100);
            mp.game.ui.notifications.show("~b~Вы взяли броню");
        }
        if (item.showGun) {
            menuList.showSapdArsenalGunMenu();
        }
        if (item.showGunMod) {
            menuList.showSapdArsenalGunModMenu();
        }
        if (item.sellItems) {
            inventory.getItemListSell();
        }
        if (item.getMoneyPolice) {
            mp.events.callRemote('server:sellMoneyPolice');
        }
        if (item.itemId) {
            let moneyFraction = await coffer.getMoney(coffer.getIdByFraction(user.getCache('fraction_id')));
            let itemPrice = items.getItemPrice(item.itemId);

            if (moneyFraction < itemPrice) {
                mp.game.ui.notifications.show(`~r~В бюджете организации не достаточно средств`);
                return;
            }

            if (items.isWeapon(item.itemId))
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "LSPD", "userName": "${user.getCache('name')}", "tint": 5}`, 'Выдано оружие').then();
            else
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "LSPD", "userName": "${user.getCache('name')}"}`, 'Выдан предмет').then();
        }
    });
};

menuList.showSapdArsenalGunMenu = function() {
    UIMenu.Menu.Create(`Арсенал`, `~b~Оружие`);

    UIMenu.Menu.AddMenuItem("Наручники", "", {itemId: 40});
    UIMenu.Menu.AddMenuItem("Фонарик", "", {itemId: 59});
    UIMenu.Menu.AddMenuItem("Полицейская дубинка", "", {itemId: 66});
    UIMenu.Menu.AddMenuItem("Электрошокер", "", {itemId: 82});

    if (user.getCache('rank_type') === 0) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two", "", {itemId: 78});
        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm", "", {itemId: 280});
    }

    if (user.getCache('rank_type') === 1 || user.getCache('rank_type') === 6 || user.getCache('rank_type') === 10 || user.getCache('rank_type') === 7 || user.getCache('rank_type') === 2) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two", "", {itemId: 78});
        UIMenu.Menu.AddMenuItem("Glock 17", "", {itemId: 146});
        UIMenu.Menu.AddMenuItem("Benelli M3", "", {itemId: 90});
        UIMenu.Menu.AddMenuItem("Benelli M4", "", {itemId: 91});
        UIMenu.Menu.AddMenuItem("HK-416", "", {itemId: 110});

        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm", "", {itemId: 280});
        UIMenu.Menu.AddMenuItem("Коробка патронов 12 калибра", "", {itemId: 281});
        UIMenu.Menu.AddMenuItem("Коробка патронов 5.56mm", "", {itemId: 284});
    }
    if (user.getCache('rank_type') === 3 || user.getCache('rank_type') === 5 || user.getCache('rank_type') === 8) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two", "", {itemId: 78});
        UIMenu.Menu.AddMenuItem("Glock 17", "", {itemId: 146});
        UIMenu.Menu.AddMenuItem("MP5A3", "", {itemId: 103});

        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm", "", {itemId: 280});
    }
    if (user.getCache('rank_type') === 4 || user.getCache('rank_type') === 9 || user.isLeader() || user.isSubLeader() || user.isDepLeader() || user.isDepSubLeader()) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two", "", {itemId: 78});
        UIMenu.Menu.AddMenuItem("Glock 17", "", {itemId: 146});
        UIMenu.Menu.AddMenuItem("Benelli M3", "", {itemId: 90});
        UIMenu.Menu.AddMenuItem("Benelli M4", "", {itemId: 91});
        UIMenu.Menu.AddMenuItem("HK-416", "", {itemId: 110});
        UIMenu.Menu.AddMenuItem("HK-416A5", "", {itemId: 111});

        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm", "", {itemId: 280});
        UIMenu.Menu.AddMenuItem("Коробка патронов 12 калибра", "", {itemId: 281});
        UIMenu.Menu.AddMenuItem("Коробка патронов 5.56mm", "", {itemId: 284});
    }

    UIMenu.Menu.AddMenuItem("Бронежилет", "", {armor: 100});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.armor) {
            user.setArmour(100);
            mp.game.ui.notifications.show("~b~Вы взяли броню");
        }
        if (item.itemId) {
            let moneyFraction = await coffer.getMoney(coffer.getIdByFraction(user.getCache('fraction_id')));
            let itemPrice = items.getItemPrice(item.itemId);

            if (moneyFraction < itemPrice) {
                mp.game.ui.notifications.show(`~r~В бюджете организации не достаточно средств`);
                return;
            }

            if (items.isWeapon(item.itemId))
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "LSPD", "userName": "${user.getCache('name')}", "tint": 5}`, 'Выдано оружие').then();
            else
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "LSPD", "userName": "${user.getCache('name')}"}`, 'Выдан предмет').then();
        }
    });
};

menuList.showSapdArsenalGunModMenu = function() {
    UIMenu.Menu.Create(`Арсенал`, `~b~Модули на оружие`);

    if (user.getCache('rank_type') === 1 || user.getCache('rank_type') === 6 || user.getCache('rank_type') === 10 || user.getCache('rank_type') === 7 || user.getCache('rank_type') === 2) {
        UIMenu.Menu.AddMenuItem("Фонарик Beretta 90Two", "", {itemId: 311});
        UIMenu.Menu.AddMenuItem("Оптический прицел Beretta 90Two", "", {itemId: 312});
        UIMenu.Menu.AddMenuItem("Глушитель Beretta 90Two", "", {itemId: 313});
        UIMenu.Menu.AddMenuItem("Компенсатор Beretta 90Two", "", {itemId: 314});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Глушитель Glock 17", "", {itemId: 316});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M3", "", {itemId: 341});
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M3", "", {itemId: 342});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Голографический прицел Benelli M4", "", {itemId: 349});
        UIMenu.Menu.AddMenuItem("Прицел малой кратности Benelli M4", "", {itemId: 350});
        UIMenu.Menu.AddMenuItem("Прицел средней кратности Benelli M4", "", {itemId: 351});
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M4", "", {itemId: 352});
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M4", "", {itemId: 353});
        UIMenu.Menu.AddMenuItem("Дульный тормоз Benelli M4", "", {itemId: 354});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик HK-416", "", {itemId: 362});
        UIMenu.Menu.AddMenuItem("Рукоятка HK-416", "", {itemId: 363});
        UIMenu.Menu.AddMenuItem("Глушитель HK-416", "", {itemId: 364});
        UIMenu.Menu.AddMenuItem("Прицел HK-416", "", {itemId: 365});
    }
    else if (user.getCache('rank_type') === 3 || user.getCache('rank_type') === 5 || user.getCache('rank_type') === 8) {
        UIMenu.Menu.AddMenuItem("Фонарик Beretta 90Two", "", {itemId: 311});
        UIMenu.Menu.AddMenuItem("Оптический прицел Beretta 90Two", "", {itemId: 312});
        UIMenu.Menu.AddMenuItem("Глушитель Beretta 90Two", "", {itemId: 313});
        UIMenu.Menu.AddMenuItem("Компенсатор Beretta 90Two", "", {itemId: 314});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Глушитель Glock 17", "", {itemId: 316});
    }
    else if (user.getCache('rank_type') === 4 || user.getCache('rank_type') === 9 || user.isLeader() || user.isSubLeader() || user.isDepLeader() || user.isDepSubLeader()) {
        UIMenu.Menu.AddMenuItem("Фонарик Beretta 90Two", "", {itemId: 311});
        UIMenu.Menu.AddMenuItem("Оптический прицел Beretta 90Two", "", {itemId: 312});
        UIMenu.Menu.AddMenuItem("Глушитель Beretta 90Two", "", {itemId: 313});
        UIMenu.Menu.AddMenuItem("Компенсатор Beretta 90Two", "", {itemId: 314});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Глушитель Glock 17", "", {itemId: 316});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M3", "", {itemId: 341});
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M3", "", {itemId: 342});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Голографический прицел Benelli M4", "", {itemId: 349});
        UIMenu.Menu.AddMenuItem("Прицел малой кратности Benelli M4", "", {itemId: 350});
        UIMenu.Menu.AddMenuItem("Прицел средней кратности Benelli M4", "", {itemId: 351});
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M4", "", {itemId: 352});
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M4", "", {itemId: 353});
        UIMenu.Menu.AddMenuItem("Дульный тормоз Benelli M4", "", {itemId: 354});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик HK-416", "", {itemId: 362});
        UIMenu.Menu.AddMenuItem("Рукоятка HK-416", "", {itemId: 363});
        UIMenu.Menu.AddMenuItem("Глушитель HK-416", "", {itemId: 364});
        UIMenu.Menu.AddMenuItem("Прицел HK-416", "", {itemId: 365});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик HK-416A5", "", {itemId: 416});
        UIMenu.Menu.AddMenuItem("Голографический прицел HK-416A5", "", {itemId: 417});
        UIMenu.Menu.AddMenuItem("Прицел малой кратности HK-416A5", "", {itemId: 418});
        UIMenu.Menu.AddMenuItem("Прицел большой кратности HK-416A5", "", {itemId: 419});
        UIMenu.Menu.AddMenuItem("Глушитель HK-416A5", "", {itemId: 420});
        UIMenu.Menu.AddMenuItem("Тактический дульный тормоз HK-416A5", "", {itemId: 422});
        UIMenu.Menu.AddMenuItem("Рукоятка HK-416A5", "", {itemId: 428});
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.itemId) {
            let moneyFraction = await coffer.getMoney(coffer.getIdByFraction(user.getCache('fraction_id')));
            let itemPrice = items.getItemPrice(item.itemId);

            if (moneyFraction < itemPrice) {
                mp.game.ui.notifications.show(`~r~В бюджете организации не достаточно средств`);
                return;
            }

            if (items.isWeapon(item.itemId))
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "LSPD", "userName": "${user.getCache('name')}", "tint": 5}`, 'Выдано оружие').then();
            else
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "LSPD", "userName": "${user.getCache('name')}"}`, 'Выдан предмет').then();
        }
    });
};

menuList.showUsmcArsenalMenu = function() {
    UIMenu.Menu.Create(`Арсенал`, `~b~Арсенал`);

    UIMenu.Menu.AddMenuItem("Сухпаёк", "", {itemId: 32});
    if (user.getCache('rank_type') !== 0 || user.isLeader() || user.isSubLeader() || user.isDepLeader() || user.isSubLeader()) {
        UIMenu.Menu.AddMenuItem("Большая Аптечка", "", {itemId: 278});
        UIMenu.Menu.AddMenuItem("Полицейское огорождение", "", {itemId: 199});
        UIMenu.Menu.AddMenuItem("Полосатый конус", "", {itemId: 201});
        UIMenu.Menu.AddMenuItem("Красный конус", "", {itemId: 202});
    }

    UIMenu.Menu.AddMenuItem("~b~Сдача конфиската", "", {sellItems: true});
    UIMenu.Menu.AddMenuItem("~b~Оружие", "", {showGun: true});
    UIMenu.Menu.AddMenuItem("~b~Модули на оружие", "", {showGunMod: true});
    UIMenu.Menu.AddMenuItem("~b~Гардероб", "", {showGarderob: true});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.armor) {
            user.setArmour(100);
            mp.game.ui.notifications.show("~b~Вы взяли броню");
        }
        if (item.showGarderob) {
            menuList.showUsmcGarderobMenu();
        }
        if (item.showGun) {
            menuList.showUsmcArsenalGunMenu();
        }
        if (item.sellItems) {
            inventory.getItemListSell();
        }
        if (item.showGunMod) {
            menuList.showUsmcArsenalGunModMenu();
        }
        if (item.itemId) {
            let moneyFraction = await coffer.getMoney(coffer.getIdByFraction(user.getCache('fraction_id')));
            let itemPrice = items.getItemPrice(item.itemId);

            if (moneyFraction < itemPrice) {
                mp.game.ui.notifications.show(`~r~В бюджете организации не достаточно средств`);
                return;
            }

            if (items.isWeapon(item.itemId))
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "USMC", "userName": "${user.getCache('name')}", "tint": 4}`, 'Выдано оружие').then();
            else
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "USMC", "userName": "${user.getCache('name')}"}`, 'Выдан предмет').then();
        }
    });
};

menuList.showUsmcArsenalGunMenu = function() {
    UIMenu.Menu.Create(`Арсенал`, `~b~Оружие`);

    UIMenu.Menu.AddMenuItem("Наручники", "", {itemId: 40});
    UIMenu.Menu.AddMenuItem("Фонарик", "", {itemId: 59});
    UIMenu.Menu.AddMenuItem("Полицейская дубинка", "", {itemId: 66});
    UIMenu.Menu.AddMenuItem("Электрошокер", "", {itemId: 82});

    if (user.getCache('rank_type') === 0) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two", "", {itemId: 78});
        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm", "", {itemId: 280});
    }

    if (user.getCache('rank_type') === 1 || user.getCache('rank_type') === 2) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two", "", {itemId: 78});
        UIMenu.Menu.AddMenuItem("Glock 17", "", {itemId: 146});
        UIMenu.Menu.AddMenuItem("Benelli M3", "", {itemId: 90});
        UIMenu.Menu.AddMenuItem("Benelli M4", "", {itemId: 91});
        UIMenu.Menu.AddMenuItem("HK-416", "", {itemId: 110});

        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm", "", {itemId: 280});
        UIMenu.Menu.AddMenuItem("Коробка патронов 12 калибра", "", {itemId: 281});
        UIMenu.Menu.AddMenuItem("Коробка патронов 5.56mm", "", {itemId: 284});
    }
    if (user.getCache('rank_type') === 3) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two", "", {itemId: 78});
        UIMenu.Menu.AddMenuItem("Glock 17", "", {itemId: 146});
        UIMenu.Menu.AddMenuItem("MP5A3", "", {itemId: 103});

        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm", "", {itemId: 280});
    }
    if (user.getCache('rank_type') === 4 || user.isLeader() || user.isSubLeader() || user.isDepLeader() || user.isDepSubLeader()) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two", "", {itemId: 78});
        UIMenu.Menu.AddMenuItem("Glock 17", "", {itemId: 146});
        UIMenu.Menu.AddMenuItem("Benelli M3", "", {itemId: 90});
        UIMenu.Menu.AddMenuItem("Benelli M4", "", {itemId: 91});
        UIMenu.Menu.AddMenuItem("HK-416", "", {itemId: 110});
        UIMenu.Menu.AddMenuItem("HK-416A5", "", {itemId: 111});

        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm", "", {itemId: 280});
        UIMenu.Menu.AddMenuItem("Коробка патронов 12 калибра", "", {itemId: 281});
        UIMenu.Menu.AddMenuItem("Коробка патронов 5.56mm", "", {itemId: 284});
    }

    UIMenu.Menu.AddMenuItem("Бронежилет", "", {armor: 100});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.armor) {
            user.setArmour(100);
            mp.game.ui.notifications.show("~b~Вы взяли броню");
        }
        if (item.itemId) {
            let moneyFraction = await coffer.getMoney(coffer.getIdByFraction(user.getCache('fraction_id')));
            let itemPrice = items.getItemPrice(item.itemId);

            if (moneyFraction < itemPrice) {
                mp.game.ui.notifications.show(`~r~В бюджете организации не достаточно средств`);
                return;
            }

            if (items.isWeapon(item.itemId))
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "USMC", "userName": "${user.getCache('name')}", "tint": 4}`, 'Выдано оружие').then();
            else
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "USMC", "userName": "${user.getCache('name')}"}`, 'Выдан предмет').then();
        }
    });
};

menuList.showUsmcArsenalGunModMenu = function() {
    UIMenu.Menu.Create(`Арсенал`, `~b~Модули на оружие`);

    if (user.getCache('rank_type') === 1 || user.getCache('rank_type') === 2) {
        UIMenu.Menu.AddMenuItem("Фонарик Beretta 90Two", "", {itemId: 311});
        UIMenu.Menu.AddMenuItem("Оптический прицел Beretta 90Two", "", {itemId: 312});
        UIMenu.Menu.AddMenuItem("Глушитель Beretta 90Two", "", {itemId: 313});
        UIMenu.Menu.AddMenuItem("Компенсатор Beretta 90Two", "", {itemId: 314});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Глушитель Glock 17", "", {itemId: 316});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M3", "", {itemId: 341});
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M3", "", {itemId: 342});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Голографический прицел Benelli M4", "", {itemId: 349});
        UIMenu.Menu.AddMenuItem("Прицел малой кратности Benelli M4", "", {itemId: 350});
        UIMenu.Menu.AddMenuItem("Прицел средней кратности Benelli M4", "", {itemId: 351});
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M4", "", {itemId: 352});
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M4", "", {itemId: 353});
        UIMenu.Menu.AddMenuItem("Дульный тормоз Benelli M4", "", {itemId: 354});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик HK-416", "", {itemId: 362});
        UIMenu.Menu.AddMenuItem("Рукоятка HK-416", "", {itemId: 363});
        UIMenu.Menu.AddMenuItem("Глушитель HK-416", "", {itemId: 364});
        UIMenu.Menu.AddMenuItem("Прицел HK-416", "", {itemId: 365});
    }
    else if (user.getCache('rank_type') === 3) {
        UIMenu.Menu.AddMenuItem("Фонарик Beretta 90Two", "", {itemId: 311});
        UIMenu.Menu.AddMenuItem("Оптический прицел Beretta 90Two", "", {itemId: 312});
        UIMenu.Menu.AddMenuItem("Глушитель Beretta 90Two", "", {itemId: 313});
        UIMenu.Menu.AddMenuItem("Компенсатор Beretta 90Two", "", {itemId: 314});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Глушитель Glock 17", "", {itemId: 316});
    }
    else if (user.getCache('rank_type') === 4 || user.isLeader() || user.isSubLeader() || user.isDepLeader() || user.isDepSubLeader()) {
        UIMenu.Menu.AddMenuItem("Фонарик Beretta 90Two", "", {itemId: 311});
        UIMenu.Menu.AddMenuItem("Оптический прицел Beretta 90Two", "", {itemId: 312});
        UIMenu.Menu.AddMenuItem("Глушитель Beretta 90Two", "", {itemId: 313});
        UIMenu.Menu.AddMenuItem("Компенсатор Beretta 90Two", "", {itemId: 314});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Глушитель Glock 17", "", {itemId: 316});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M3", "", {itemId: 341});
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M3", "", {itemId: 342});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Голографический прицел Benelli M4", "", {itemId: 349});
        UIMenu.Menu.AddMenuItem("Прицел малой кратности Benelli M4", "", {itemId: 350});
        UIMenu.Menu.AddMenuItem("Прицел средней кратности Benelli M4", "", {itemId: 351});
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M4", "", {itemId: 352});
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M4", "", {itemId: 353});
        UIMenu.Menu.AddMenuItem("Дульный тормоз Benelli M4", "", {itemId: 354});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик HK-416", "", {itemId: 362});
        UIMenu.Menu.AddMenuItem("Рукоятка HK-416", "", {itemId: 363});
        UIMenu.Menu.AddMenuItem("Глушитель HK-416", "", {itemId: 364});
        UIMenu.Menu.AddMenuItem("Прицел HK-416", "", {itemId: 365});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик HK-416A5", "", {itemId: 416});
        UIMenu.Menu.AddMenuItem("Голографический прицел HK-416A5", "", {itemId: 417});
        UIMenu.Menu.AddMenuItem("Прицел малой кратности HK-416A5", "", {itemId: 418});
        UIMenu.Menu.AddMenuItem("Прицел большой кратности HK-416A5", "", {itemId: 419});
        UIMenu.Menu.AddMenuItem("Глушитель HK-416A5", "", {itemId: 420});
        UIMenu.Menu.AddMenuItem("Тактический дульный тормоз HK-416A5", "", {itemId: 422});
        UIMenu.Menu.AddMenuItem("Рукоятка HK-416A5", "", {itemId: 428});
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.itemId) {
            let moneyFraction = await coffer.getMoney(coffer.getIdByFraction(user.getCache('fraction_id')));
            let itemPrice = items.getItemPrice(item.itemId);

            if (moneyFraction < itemPrice) {
                mp.game.ui.notifications.show(`~r~В бюджете организации не достаточно средств`);
                return;
            }

            if (items.isWeapon(item.itemId))
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "USMC", "userName": "${user.getCache('name')}", "tint": 4}`, 'Выдано оружие').then();
            else
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "USMC", "userName": "${user.getCache('name')}"}`, 'Выдан предмет').then();
        }
    });
};

menuList.showFibArsenalMenu = function() {
    UIMenu.Menu.Create(`Арсенал`, `~b~Арсенал`);

    UIMenu.Menu.AddMenuItem("Сухпаёк", "", {itemId: 32});
    if (user.getCache('rank_type') !== 0 || user.isLeader() || user.isSubLeader() || user.isDepLeader() || user.isSubLeader()) {
        UIMenu.Menu.AddMenuItem("Большая Аптечка", "", {itemId: 278});
        UIMenu.Menu.AddMenuItem("Полицейское огорождение", "", {itemId: 199});
        UIMenu.Menu.AddMenuItem("Полосатый конус", "", {itemId: 201});
        UIMenu.Menu.AddMenuItem("Красный конус", "", {itemId: 202});
    }

    UIMenu.Menu.AddMenuItem("~b~Сдача конфиската", "", {sellItems: true});
    UIMenu.Menu.AddMenuItem("~b~Оружие", "", {showGun: true});
    UIMenu.Menu.AddMenuItem("~b~Модули на оружие", "", {showGunMod: true});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.armor) {
            user.setArmour(100);
            mp.game.ui.notifications.show("~b~Вы взяли броню");
        }
        if (item.showGun) {
            menuList.showFibArsenalGunMenu();
        }
        if (item.sellItems) {
            inventory.getItemListSell();
        }
        if (item.showGunMod) {
            menuList.showFibArsenalGunModMenu();
        }
        if (item.itemId) {
            let moneyFraction = await coffer.getMoney(coffer.getIdByFraction(user.getCache('fraction_id')));
            let itemPrice = items.getItemPrice(item.itemId);

            if (moneyFraction < itemPrice) {
                mp.game.ui.notifications.show(`~r~В бюджете организации не достаточно средств`);
                return;
            }

            if (items.isWeapon(item.itemId))
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "FIB", "userName": "${user.getCache('name')}"}`, 'Выдано оружие').then();
            else
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "FIB", "userName": "${user.getCache('name')}"}`, 'Выдан предмет').then();
        }
    });
};

menuList.showFibArsenalGunMenu = function() {
    UIMenu.Menu.Create(`Арсенал`, `~b~Оружие`);

    UIMenu.Menu.AddMenuItem("Наручники", "", {itemId: 40});
    UIMenu.Menu.AddMenuItem("Фонарик", "", {itemId: 59});
    UIMenu.Menu.AddMenuItem("Полицейская дубинка", "", {itemId: 66});
    UIMenu.Menu.AddMenuItem("Электрошокер", "", {itemId: 82});

    if (user.getCache('rank_type') === 0) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two", "", {itemId: 78});
        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm", "", {itemId: 280});
    }
    if (user.getCache('rank_type') === 2 || user.getCache('rank_type') === 1 || user.isLeader() || user.isSubLeader() || user.isDepLeader() || user.isDepSubLeader()) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two", "", {itemId: 78});
        UIMenu.Menu.AddMenuItem("Glock 17", "", {itemId: 146});
        UIMenu.Menu.AddMenuItem("Benelli M3", "", {itemId: 90});
        UIMenu.Menu.AddMenuItem("Benelli M4", "", {itemId: 91});
        UIMenu.Menu.AddMenuItem("HK-416", "", {itemId: 110});
        UIMenu.Menu.AddMenuItem("HK-416A5", "", {itemId: 111});

        UIMenu.Menu.AddMenuItem("SIG MPX-SD", "", {itemId: 97});

        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm", "", {itemId: 280});
        UIMenu.Menu.AddMenuItem("Коробка патронов 12 калибра", "", {itemId: 281});
        UIMenu.Menu.AddMenuItem("Коробка патронов 5.56mm", "", {itemId: 284});
    }

    UIMenu.Menu.AddMenuItem("Бронежилет", "", {armor: 100});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.armor) {
            user.setArmour(100);
            mp.game.ui.notifications.show("~b~Вы взяли броню");
        }
        if (item.itemId) {
            let moneyFraction = await coffer.getMoney(coffer.getIdByFraction(user.getCache('fraction_id')));
            let itemPrice = items.getItemPrice(item.itemId);

            if (moneyFraction < itemPrice) {
                mp.game.ui.notifications.show(`~r~В бюджете организации не достаточно средств`);
                return;
            }

            if (items.isWeapon(item.itemId))
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "FIB", "userName": "${user.getCache('name')}"}`, 'Выдано оружие').then();
            else
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "FIB", "userName": "${user.getCache('name')}"}`, 'Выдан предмет').then();
        }
    });
};

menuList.showFibArsenalGunModMenu = function() {
    UIMenu.Menu.Create(`Арсенал`, `~b~Модули на оружие`);
    if (user.getCache('rank_type') === 1 || user.getCache('rank_type') === 2 || user.isLeader() || user.isSubLeader() || user.isDepLeader() || user.isDepSubLeader()) {
        UIMenu.Menu.AddMenuItem("Фонарик Beretta 90Two", "", {itemId: 311});
        UIMenu.Menu.AddMenuItem("Оптический прицел Beretta 90Two", "", {itemId: 312});
        UIMenu.Menu.AddMenuItem("Глушитель Beretta 90Two", "", {itemId: 313});
        UIMenu.Menu.AddMenuItem("Компенсатор Beretta 90Two", "", {itemId: 314});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Глушитель Glock 17", "", {itemId: 316});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M3", "", {itemId: 341});
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M3", "", {itemId: 342});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Голографический прицел Benelli M4", "", {itemId: 349});
        UIMenu.Menu.AddMenuItem("Прицел малой кратности Benelli M4", "", {itemId: 350});
        UIMenu.Menu.AddMenuItem("Прицел средней кратности Benelli M4", "", {itemId: 351});
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M4", "", {itemId: 352});
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M4", "", {itemId: 353});
        UIMenu.Menu.AddMenuItem("Дульный тормоз Benelli M4", "", {itemId: 354});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик HK-416", "", {itemId: 362});
        UIMenu.Menu.AddMenuItem("Рукоятка HK-416", "", {itemId: 363});
        UIMenu.Menu.AddMenuItem("Глушитель HK-416", "", {itemId: 364});
        UIMenu.Menu.AddMenuItem("Прицел HK-416", "", {itemId: 365});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик HK-416A5", "", {itemId: 416});
        UIMenu.Menu.AddMenuItem("Голографический прицел HK-416A5", "", {itemId: 417});
        UIMenu.Menu.AddMenuItem("Прицел малой кратности HK-416A5", "", {itemId: 418});
        UIMenu.Menu.AddMenuItem("Прицел большой кратности HK-416A5", "", {itemId: 419});
        UIMenu.Menu.AddMenuItem("Глушитель HK-416A5", "", {itemId: 420});
        UIMenu.Menu.AddMenuItem("Тактический дульный тормоз HK-416A5", "", {itemId: 422});
        UIMenu.Menu.AddMenuItem("Рукоятка HK-416A5", "", {itemId: 428});
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.itemId) {
            let moneyFraction = await coffer.getMoney(coffer.getIdByFraction(user.getCache('fraction_id')));
            let itemPrice = items.getItemPrice(item.itemId);

            if (moneyFraction < itemPrice) {
                mp.game.ui.notifications.show(`~r~В бюджете организации не достаточно средств`);
                return;
            }

            if (items.isWeapon(item.itemId))
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "FIB", "userName": "${user.getCache('name')}"}`, 'Выдано оружие').then();
            else
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "FIB", "userName": "${user.getCache('name')}"}`, 'Выдан предмет').then();
        }
    });
};

menuList.showEduAskMenu = function() {

    UIMenu.Menu.Create("Обучение", "~b~Вы хотите посмотреть обучение?");

    UIMenu.Menu.AddMenuItem("Посмотреть обучение", "Займёт ~g~5~s~ минут твоего времени", {full: true});
    UIMenu.Menu.AddMenuItem("Посмотреть все фишки проекта", "Займёт ~g~2~s~ минуты твоего времени", {short: true});

    UIMenu.Menu.AddMenuItem("~b~Вы всегда можете задать вопрос через М - Задать вопрос");

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.full)
            edu.startLong();
        if (item.short)
            edu.startShort();
    });
};

menuList.showBotQuestRole0Menu = function()
{
    if (user.getCache('role') !== 0) {
        mp.game.ui.notifications.show('~r~Доступно только для иммигрантов');
        return;
    }

    UIMenu.Menu.Create("Каспер", "~b~Взаимодействие с Каспером");

    UIMenu.Menu.AddMenuItem("~g~Начать/~r~Закончить~s~ рабочий день", '', {start: true});
    if (user.getQuestCount('role_0') < quest.getQuestLineMax('role_0')) {
        UIMenu.Menu.AddMenuItem("~g~Получить задание", '', {take: true});
    }

    UIMenu.Menu.AddMenuItem("Посмотреть обучение", "Займёт ~g~5~s~ минут твоего времени", {full: true});
    UIMenu.Menu.AddMenuItem("Посмотреть все фишки проекта", "Займёт ~g~2~s~ минуты твоего времени", {short: true});

    UIMenu.Menu.AddMenuItem("~b~Вы всегда можете задать вопрос через М - Задать вопрос", "", {});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.take)
            quest.role0(true);
        if (item.full)
            edu.startLong();
        if (item.short)
            edu.startShort();
        if (item.start)
            loader.startOrEnd();
    });
};

menuList.showBotQuestRoleAllMenu = function()
{
    UIMenu.Menu.Create("Сюзанна", "~b~Взаимодействие с Сюзанной");

    if (user.getQuestCount('standart') < quest.getQuestLineMax('standart'))
    {
        UIMenu.Menu.AddMenuItem("~g~Квестовое задание", `${quest.getQuestLineName('standart', user.getQuestCount('standart'))}`, {take: true});
    }
    UIMenu.Menu.AddMenuItem("Посмотреть обучение", "Займёт ~g~5~s~ минут твоего времени", {full: true});
    UIMenu.Menu.AddMenuItem("Посмотреть все фишки проекта", "Займёт ~g~2~s~ минуты твоего времени", {short: true});
    UIMenu.Menu.AddMenuItem("~b~Вы всегда можете задать вопрос через М - Задать вопрос", "", {});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.take)
            quest.standart(true);
        if (item.full)
            edu.startLong();
        if (item.short)
            edu.startShort();
    });
};

menuList.showBotQuestGangMenu = function()
{
    UIMenu.Menu.Create("Ламар", "~b~Взаимодействие с Ламаром");

    if (user.getQuestCount('gang') < quest.getQuestLineMax('gang'))
    {
        UIMenu.Menu.AddMenuItem("~g~Квестовое задание", `${quest.getQuestLineName('gang', user.getQuestCount('gang'))}`, {take: true});
    }
    else {
        UIMenu.Menu.AddMenuItem("~y~Задание на перевозку", "", {isCargo: true});
        UIMenu.Menu.AddMenuItem("Купить спец. отмычку", 'Цена: ~g~0.2ec', {takeSpec: true});
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.take)
            quest.gang(true);
        if (item.isCargo)
            lamar.start();
        if (item.takeSpec) {
            if (user.getCryptoMoney() < 0.2) {
                mp.game.ui.notifications.show(`~r~На счету ECOIN нет столько денег`);
                return;
            }

            user.removeCryptoMoney(0.2, 'Покупка спец. отмычек');
            inventory.takeNewItemJust(5);
            mp.game.ui.notifications.show(`~g~Вы купили отмычку`);
        }
    });
};

menuList.showGangZoneAttackMenu = function(zone, count = 5) {
    UIMenu.Menu.Create(`Захват`, `~b~ID: ${zone.get('gangWarid')}`);

    UIMenu.Menu.AddMenuItem(`~b~${zone.get('gangWarzone').toString()}`);
    UIMenu.Menu.AddMenuItem(`~b~${zone.get('gangWarstreet').toString()}`);
    UIMenu.Menu.AddMenuItem(`~b~${zone.get('gangWarfraction_name').toString()}`);

    UIMenu.Menu.AddMenuItem(`~b~Кол-во:~s~ ${count}vs${count}`, "", {doName: "count"});
    UIMenu.Menu.AddMenuItemList("~b~Броня~s~", ['~g~Да', '~r~Нет'], "", {doName: "armor"});
    UIMenu.Menu.AddMenuItemList("~b~Оружие~s~", ['Любое', 'Пистолеты', 'Дробовики', 'SMG', 'Автоматы'], "", {doName: "gun"});
    UIMenu.Menu.AddMenuItemList("~b~Время~s~", ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'], "", {doName: "time"});
    UIMenu.Menu.AddMenuItem(`~g~Объявить захват`, "", {doName: "start"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    let armorIndex = 0;
    let gunIndex = 0;
    let timeIndex = 0;

    UIMenu.Menu.OnList.Add((item, index) => {
        if (item.doName === 'armor')
            armorIndex = index;
        if (item.doName === 'gun')
            gunIndex = index;
        if (item.doName === 'time')
            timeIndex = index;
    });

    UIMenu.Menu.OnSelect.Add(async item => {
        try {
            if (item.doName === 'count') {
                let name = methods.parseInt(await UIMenu.Menu.GetUserInput("Число", "", 9));
                if (name > 10) {
                    mp.game.ui.notifications.show(`~r~Значение не должно быть больше 10`);
                    return;
                }
                if (name < 1) {
                    mp.game.ui.notifications.show(`~r~Значение не должно быть меньше 1`);
                    return;
                }
                menuList.showGangZoneAttackMenu(zone, name);
            }
            if (item.doName == 'start')
                mp.events.callRemote('server:gangWar:addWar', zone.get('gangWarid'), count, armorIndex, gunIndex, timeIndex);
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

menuList.showAdminMenu = function() {
    UIMenu.Menu.Create(`ADMIN`, `~b~Админ меню`);

    if (user.isAdmin()) {

        if (mp.players.local.getVariable('enableAdmin') === true) {
            UIMenu.Menu.AddMenuItem("Действие над игроком", "", {doName: "playerMenu"});
            UIMenu.Menu.AddMenuItem("Транспорт", "", {doName: "vehicleMenu"});
            UIMenu.Menu.AddMenuItem("Телепорт", "", {doName: "teleportMenu"});
            if (user.isAdmin(2)) {
                UIMenu.Menu.AddMenuItem("Режим No Clip", "", {doName: "noClip"});
                UIMenu.Menu.AddMenuItem("Режим Free Cam", "", {doName: "freeCam"});
                UIMenu.Menu.AddMenuItem("Режим Drone", "", {doName: "drone"});
            }
            //if (user.isAdmin(2))

            UIMenu.Menu.AddMenuItem("Режим GodMode", "", {doName: "godMode"});

            if (!user.isAdminRp())
                UIMenu.Menu.AddMenuItem("Лидер крайма", "Значение 0 убирает оргу", {doName: "giveLeader"});

            UIMenu.Menu.AddMenuItem("Режим невидимки", "", {doName: "invise"});
            UIMenu.Menu.AddMenuItem("Прогрузка ID", "", {doName: "idDist"});

            if (user.isAdmin(3))
                UIMenu.Menu.AddMenuItem("Выбор одежды", "", {doName: "clothMenu"});
            if (user.isAdmin(5))
                UIMenu.Menu.AddMenuItem("Выбор масок", "", {doName: "maskMenu"});
            if (user.isAdmin(2) && !user.isAdminRp())
                UIMenu.Menu.AddMenuItem("Уведомление", "", {doName: "notify"});
            if (user.isAdmin(2) && !user.isAdminRp())
                UIMenu.Menu.AddMenuItem("Уведомление для крайма", "", {doName: "notifyCrime"});
            if (user.isAdmin(2) && !user.isAdminRp())
                UIMenu.Menu.AddMenuItem("Меропритие", "", {doName: "eventMenu"});

            if (user.isAdmin(3) && !user.isAdminRp())
                UIMenu.Menu.AddMenuItem("Управление ганг. зонами", "", {doName: "gangZone"});

            UIMenu.Menu.AddMenuItem("~y~Выключить админку", "", {doName: "disableAdmin"});
            UIMenu.Menu.AddMenuItem("~y~Ответить на жалобу", "", {doName: "askReport"});

            if (user.isAdmin(5)) {
                UIMenu.Menu.AddMenuItem("Для разработчика", "", {doName: "developerMenu"});
            }
        }
        else {
            UIMenu.Menu.AddMenuItem("~y~Включить админку", "", {doName: "enableAdmin"});
            UIMenu.Menu.AddMenuItem("~y~Ответить на жалобу", "", {doName: "askReport"});
        }
    }
    if (user.isHelper()) {
        UIMenu.Menu.AddMenuItem("~y~Ответить на вопрос", "", {doName: "askHelp"});
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName == 'enableAdmin') {
            user.setVariable('enableAdmin', true);
            if (user.isAdminRp())
                user.setVariable('adminRole', 'RP Maker');
            else if (user.getCache('admin_level') < 4)
                user.setVariable('adminRole', 'Game Admin');
            else if (user.getCache('admin_level') === 4)
                user.setVariable('adminRole', 'Admin');
            else if (user.getCache('admin_level') === 5)
                user.setVariable('adminRole', 'Main Admin');
            else if (user.getCache('admin_level') === 6)
                user.setVariable('adminRole', 'Developer');
        }
        if (item.doName == 'disableAdmin') {
            user.setAlpha(255);
            admin.godmode(false);
            mp.events.call('client:idDist', 15);
            user.setVariable('enableAdmin', false);
        }
        if (item.doName == 'askReport') {
            let id = await UIMenu.Menu.GetUserInput("ID", "", 5);
            let text = await UIMenu.Menu.GetUserInput("Ответ", "", 300);
            if (text != '')
                mp.events.callRemote('server:sendAnswerReport', methods.parseInt(id), text);
        }
        if (item.doName == 'askHelp') {
            let id = await UIMenu.Menu.GetUserInput("ID", "", 5);
            let text = await UIMenu.Menu.GetUserInput("Ответ", "", 300);
            if (text != '')
                mp.events.callRemote('server:sendAnswerAsk', methods.parseInt(id), text);
        }
        if (item.doName == 'gangZone') {
            let id = await UIMenu.Menu.GetUserInput("Введите ID территори", "", 5);
            menuList.showAdminGangZoneMenu(await Container.Data.GetAll(600000 + methods.parseInt(id)));
        }
        if (item.doName == 'noClip')
            admin.noClip(true);
        if (item.doName == 'freeCam')
        {
            if (!admin.isFreeCam())
                admin.startFreeCam();
            else
                admin.stopFreeCam();
        }
        if (item.doName == 'drone')
        {
            drone.startOrEnd();
        }
        if (item.doName == 'invise') {
            let val = methods.parseInt(await UIMenu.Menu.GetUserInput("От 0 до 255", "", 3));
            user.setAlpha(val);
        }
        if (item.doName == 'giveLeader') {
            let val = methods.parseInt(await UIMenu.Menu.GetUserInput("От 0 до 15", "", 3));
            user.set('fraction_id2', val);
            user.set('is_leader2', val > 0);
            user.set('is_sub_leader2', false);
            user.set('rank2', 0);
            user.set('rank_type2', 0);
        }
        if (item.doName == 'idDist') {
            let val = methods.parseInt(await UIMenu.Menu.GetUserInput("От 10 до 200", "", 3));
            mp.events.call('client:idDist', val);
        }
        if (item.doName == 'godMode')
            admin.godmode(!admin.isGodModeEnable());
        if (item.doName == 'clothMenu')
            menuList.showAdminClothMenu();
        if (item.doName == 'maskMenu')
            menuList.showAdminMaskMenu();
        if (item.doName == 'playerMenu')
        {
            try {
                menuList.showAdminPlayerMenu(mp.players.local.remoteId);
            }
            catch (e) {
                methods.debug(e);
            }
        }
        if (item.doName == 'eventMenu')
            menuList.showAdminEventMenu();
        if (item.doName == 'developerMenu')
            menuList.showAdminDevMenu();
        if (item.doName == 'vehicleMenu')
            menuList.showAdminVehicleMenu();
        if (item.doName == 'teleportMenu')
            menuList.showAdminTeleportMenu();
        if (item.doName == 'notify') {
            let title = await UIMenu.Menu.GetUserInput("Заголовок", "", 20);
            if (title == '')
                return;
            let text = await UIMenu.Menu.GetUserInput("Текст новости", "", 150);
            if (text == '')
                return;
            methods.notifyWithPictureToAll(title, 'Администрация', text, 'CHAR_ACTING_UP');
        }
        if (item.doName == 'notifyCrime') {
            let text = await UIMenu.Menu.GetUserInput("Текст новости", "", 150);
            if (text == '')
                return;
            for (let i = 1; i <= 20; i++) {
                methods.notifyWithPictureToFraction2('E CORP', 'Администрация', text, 'CHAR_ACTING_UP', i);
            }
        }
    });
};

menuList.showAdminPlayerMenu = function(id) {
    UIMenu.Menu.Create(`ADMIN`, `~b~Админ меню`);

    UIMenu.Menu.AddMenuItem("~b~Введите ID", "", {doName: 'changeId'}, id.toString());
    UIMenu.Menu.AddMenuItemList("Тип ID", ['Dynamic', 'Static'], "", {doName: "type"});

    UIMenu.Menu.AddMenuItem("Изменить виртуальный мир", "", {doName: "changeDimension"});
    UIMenu.Menu.AddMenuItem("Телепортироваться к игроку", "", {doName: "tptoid"});
    UIMenu.Menu.AddMenuItem("Телепортировать игрока к себе", "", {doName: "tptome"});

    if (user.isAdmin(2)) {
        UIMenu.Menu.AddMenuItem("Выдать HP", "", {doName: "setHpById"});
        UIMenu.Menu.AddMenuItem("Выдать Armor", "", {doName: "setArmorById"});
        UIMenu.Menu.AddMenuItem("Выдать скин", "", {doName: "setSkinById"});
    }
    UIMenu.Menu.AddMenuItem("Восстановить скин", "", {doName: "resetSkinById"});
    UIMenu.Menu.AddMenuItem("Воскресить", "", {doName: "adrenalineById"});
    UIMenu.Menu.AddMenuItem("Выписать из больницы", "", {doName: "freeHospById"});

    if (user.isAdmin(4) && !user.isAdminRp())
        UIMenu.Menu.AddMenuItemList("Лидер организации", ["None", "Gov", "LSPD", "FIB", "USMC", "BCSD", "EMS", "News"], "", {doName: "giveLeader"});

    if (!user.isAdminRp()) {
        UIMenu.Menu.AddMenuItem("Посадить в тюрьму", "", {doName: "jail"});

        if (user.isAdmin(2))
        {
            UIMenu.Menu.AddMenuItem("Кикнуть", "", {doName: "kick"});
            UIMenu.Menu.AddMenuItemList("~y~Забанить", ['1h', '6h', '12h', '1d', '3d', '7d', '14d', '30d', '60d', '90d', 'Permanent'], "", {doName: "ban"});
            UIMenu.Menu.AddMenuItem("~y~Разбанить", "", {doName: "unban"});
            UIMenu.Menu.AddMenuItem("~y~Выдать предуп.", "", {doName: "warn"});
            UIMenu.Menu.AddMenuItem("~y~Снять предуп.", "", {doName: "unwarn"});
        }

        if (user.isAdmin(5))
            UIMenu.Menu.AddMenuItem("~r~Занести в черный список", "", {doName: "blacklist"});
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    let listIndex = 0;
    let typeIndex = 0;
    UIMenu.Menu.OnList.Add((item, index) => {
        listIndex = index;
        if (item.doName === 'type')
            typeIndex = index;
    });

    UIMenu.Menu.OnSelect.Add(async item => {

        try {
            if (item.doName === 'giveLeader') {
                mp.events.callRemote('server:admin:giveLeader', typeIndex, id, listIndex);
            }
            if (item.doName == 'changeDimension') {
                let num = methods.parseInt(await UIMenu.Menu.GetUserInput("ID", "", 32));
                mp.events.callRemote('server:admin:changeDimension', typeIndex, methods.parseInt(id), num);
            }
            if (item.doName == 'tptoid') {
                mp.events.callRemote('server:admin:tptoid', typeIndex, methods.parseInt(id));
            }
            if (item.doName == 'tptome') {
                mp.events.callRemote('server:admin:tptome', typeIndex, methods.parseInt(id));
            }
            if (item.doName == 'blacklist') {
                let reason = await UIMenu.Menu.GetUserInput("Причина", "", 64);
                mp.events.callRemote('server:admin:blacklist', typeIndex, id, methods.removeQuotes(reason));
            }
            if (item.doName == 'unban') {
                let reason = await UIMenu.Menu.GetUserInput("Причина", "", 64);
                mp.events.callRemote('server:admin:unban', typeIndex, id, methods.removeQuotes(reason))
            }
            if (item.doName == 'warn') {
                let reason = await UIMenu.Menu.GetUserInput("Причина", "", 64);
                mp.events.callRemote('server:admin:warn', typeIndex, id, methods.removeQuotes(reason))
            }
            if (item.doName == 'unwarn') {
                let reason = await UIMenu.Menu.GetUserInput("Причина", "", 64);
                mp.events.callRemote('server:admin:unwarn', typeIndex, id, methods.removeQuotes(reason))
            }
            if (item.doName == 'ban') {
                let reason = await UIMenu.Menu.GetUserInput("Причина", "", 64);
                mp.events.callRemote('server:admin:ban', typeIndex, id, listIndex, methods.removeQuotes(reason));
            }
            if (item.doName == 'kick') {
                let reason = await UIMenu.Menu.GetUserInput("Причина", "", 64);
                mp.events.callRemote('server:admin:kick', typeIndex, id, methods.removeQuotes(reason));
            }
            if (item.doName == 'jail') {
                let num = methods.parseInt(await UIMenu.Menu.GetUserInput("Время в минутах", "", 5));
                let reason = await UIMenu.Menu.GetUserInput("Причина", "", 64);
                if (reason === '')
                    return;
                mp.events.callRemote('server:admin:jail', typeIndex, id, num, methods.removeQuotes(reason));
            }
            if (item.doName == 'resetSkinById') {
                mp.events.callRemote('server:admin:resetSkinById', typeIndex, id)
            }
            if (item.doName == 'adrenalineById') {
                mp.events.callRemote('server:admin:adrenalineById', typeIndex, id)
            }
            if (item.doName == 'freeHospById') {
                mp.events.callRemote('server:admin:freeHospById', typeIndex, id)
            }
            if (item.doName == 'setSkinById') {
                let num = await UIMenu.Menu.GetUserInput("Имя скина", "", 32);
                mp.events.callRemote('server:admin:setSkinById', typeIndex, id, num)
            }
            if (item.doName == 'setArmorById') {
                let num = methods.parseInt(await UIMenu.Menu.GetUserInput("Значение брони", "", 3));
                mp.events.callRemote('server:admin:setArmorById', typeIndex, id, num)
            }
            if (item.doName == 'setHpById') {
                let num = methods.parseInt(await UIMenu.Menu.GetUserInput("Значение HP", "", 3));
                mp.events.callRemote('server:admin:setHpById', typeIndex, id, num)
            }
            if (item.doName == 'changeId') {
                id = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите ID", "", 9));
                if (id < 0)
                    id = mp.players.local.remoteId;
                menuList.showAdminPlayerMenu(id);
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

menuList.showAdminGangZoneMenu = function(zone) {
    UIMenu.Menu.Create(`ADMIN`, `~b~ID: ${zone.get('gangWarid')}`);

    UIMenu.Menu.AddMenuItem("Zone", zone.get('gangWarzone').toString(), {doName: "zone"});
    UIMenu.Menu.AddMenuItem("Street", zone.get('gangWarstreet').toString(), {doName: "street"});
    UIMenu.Menu.AddMenuItem("FractionId", zone.get('gangWarfraction_id').toString(), {doName: "fraction_id"});
    UIMenu.Menu.AddMenuItem("FractionName", zone.get('gangWarfraction_name').toString(), {doName: "fraction_name"});
    UIMenu.Menu.AddMenuItem("Timestamp", zone.get('gangWartimestamp').toString(), {doName: "timestamp"});
    UIMenu.Menu.AddMenuItem("CantWar", zone.get('gangWarcant_war').toString(), {doName: "cant_war"});
    UIMenu.Menu.AddMenuItem("Координаты", "", {doName: "pos"});
    UIMenu.Menu.AddMenuItem("Телепорт на центр", "", {doName: "tppos"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {

        try {
            if (item.doName === 'tppos') {
                user.teleport(zone.get('gangWarx'), zone.get('gangWary'), zone.get('gangWarz'))
            }
            if (item.doName === 'pos') {
                mp.events.callRemote('server:admin:gangZone:editPos', zone.get('gangWarid'));
            }
            if (item.doName === 'timestamp' || item.doName === 'fraction_id' || item.doName === 'cant_war') {
                let name = await UIMenu.Menu.GetUserInput("Число", "", 9);
                mp.events.callRemote('server:admin:gangZone:edit', zone.get('gangWarid'), item.doName, methods.parseInt(name));
            }
            if (item.doName == 'zone' || item.doName == 'street' || item.doName == 'fraction_name') {
                let name = await UIMenu.Menu.GetUserInput("Название", "", 120);
                mp.events.callRemote('server:admin:gangZone:edit', zone.get('gangWarid'), item.doName, name);
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

menuList.showAdminVehicleMenu = function() {
    UIMenu.Menu.Create(`ADMIN`, `~b~Админ меню`);

    UIMenu.Menu.AddMenuItem("Заспавнить транспорт", "", {doName: "spawn"});
    UIMenu.Menu.AddMenuItem("Цвет транспорта", "", {doName: "colorVeh"});
    UIMenu.Menu.AddMenuItem("Тюнинг", "", {doName: "tunning"});
    UIMenu.Menu.AddMenuItem("Ремонт транспорта", "", {doName: "fixvehicle"});
    UIMenu.Menu.AddMenuItem("Зареспавнить ближайший транспорт", "", {doName: "respvehicle"});
    UIMenu.Menu.AddMenuItem("Перевернуть ближайший транспорт", "", {doName: "flipVehicle"});

    if (user.isAdmin(5)) {
        if (mp.players.local.vehicle) {
            let vInfo = methods.getVehicleInfo(mp.players.local.vehicle.model);
            UIMenu.Menu.AddMenuItem(`Макс. скорость ~g~${vehicles.getSpeedMax(mp.players.local.vehicle.model)}km/h`, "", {doName: "vehicleSpeedMax"});
            UIMenu.Menu.AddMenuItem(`Состояние буста ~g~${vInfo.sb}ед.`, "", {doName: "vehicleSpeedBoost"});
            UIMenu.Menu.AddMenuItem(`Стоимость ~g~${methods.moneyFormat(vInfo.price)}`);
            UIMenu.Menu.AddMenuItem(`~b~Добавить на авторынок`, "", {doName: "vehicleAdd"});
            UIMenu.Menu.AddMenuItem(`~b~Добавить на авторынок орг.`, "", {doName: "vehicleAddFraction"});
        }
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        if (item.doName == 'colorVeh') {
            menuList.showAdminColorVehMenu();
        }
        if (item.doName == 'tunning') {
            menuList.showAdminTunningMenu();
        }
        if (item.doName === 'spawn') {
            let vName = await UIMenu.Menu.GetUserInput("Название ТС", "", 20);
            if (vName == '')
                return;
            //methods.saveLog('AdminSpawnVehicle', `${user.getCache('rp_name')} - ${vName}`);
            mp.events.callRemote('server:admin:spawnVeh', vName);
        }
        if (item.doName == 'vehicleAdd') {
            let vInfo = methods.getVehicleInfo(mp.players.local.vehicle.model);
            let count = methods.parseInt(await UIMenu.Menu.GetUserInput("Кол-во", "", 8));
            mp.events.callRemote('server:vehicles:addNew', vInfo.display_name, count);
        }
        if (item.doName == 'vehicleAddFraction') {
            let vInfo = methods.getVehicleInfo(mp.players.local.vehicle.model);
            let count = methods.parseInt(await UIMenu.Menu.GetUserInput("Кол-во", "", 8));
            let fractionId = methods.parseInt(await UIMenu.Menu.GetUserInput("Fraction ID", "", 8));
            mp.events.callRemote('server:vehicles:addNewFraction', vInfo.display_name, count, fractionId);
        }
        if (item.doName === 'vehicleSpeedMax') {
            let vInfo = methods.getVehicleInfo(mp.players.local.vehicle.model);

            let num = methods.parseInt(await UIMenu.Menu.GetUserInput("Значение", "", 5));
            mp.events.callRemote('server:admin:vehicleSpeedMax', vInfo.display_name, num);

            vInfo.sm = num;
            methods.setVehicleInfo(mp.players.local.vehicle.model, vInfo);

            menuList.showAdminVehicleMenu();
        }
        if (item.doName === 'vehicleSpeedBoost') {
            let vInfo = methods.getVehicleInfo(mp.players.local.vehicle.model);

            let num = methods.parseInt(await UIMenu.Menu.GetUserInput("Значение", "", 5));
            mp.events.callRemote('server:admin:vehicleSpeedBoost', vInfo.display_name, num);

            vInfo.sb = num;
            methods.setVehicleInfo(mp.players.local.vehicle.model, vInfo);

            menuList.showAdminVehicleMenu();
        }
        if (item.doName == 'fixvehicle') {
            mp.events.callRemote('server:user:fixNearestVehicle');
        }
        if (item.doName == 'respvehicle') {
            mp.events.callRemote('server:respawnNearstVehicle');
        }
        if (item.doName == 'flipVehicle') {
            mp.events.callRemote('server:flipNearstVehicle');
        }
    });
};

menuList.showAdminTeleportMenu = function() {
    UIMenu.Menu.Create(`ADMIN`, `~b~Админ меню`);

    UIMenu.Menu.AddMenuItem("Телепорт на метку", "", {doName: "teleportToWaypoint"});
    UIMenu.Menu.AddMenuItem("Телепортироваться к игроку", "", {doName: "tptoid"});
    UIMenu.Menu.AddMenuItem("Телепортировать игрока к себе", "", {doName: "tptome"});
    UIMenu.Menu.AddMenuItem("Телепорт по ID дома", "", {doName: "tptoh"});

    UIMenu.Menu.AddMenuItem("Телепортировать транспорт к себе", "", {doName: "tptov"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        if (item.doName == 'teleportToWaypoint')
            user.tpToWaypoint();
        if (item.doName == 'tptoid') {
            let id = await UIMenu.Menu.GetUserInput("ID Игрока", "", 10);
            mp.events.callRemote('server:admin:tptoid', 0, methods.parseInt(id));
        }
        if (item.doName == 'tptome') {
            let id = await UIMenu.Menu.GetUserInput("ID Игрока", "", 10);
            mp.events.callRemote('server:admin:tptome', 0, methods.parseInt(id));
        }
        if (item.doName == 'tptov') {
            let id = await UIMenu.Menu.GetUserInput("ID Транспорта", "", 10);
            mp.events.callRemote('server:admin:tptov', methods.parseInt(id));
        }
        if (item.doName == 'tptoh') {
            let id = await UIMenu.Menu.GetUserInput("ID Дома", "", 10);
            mp.events.callRemote('server:houses:teleport', methods.parseInt(id));
        }
    });
};

menuList.showAdminEventMenu = function() {
    UIMenu.Menu.Create(`ADMIN`, `~b~Админ меню`);

    /*UIMenu.Menu.AddMenuItem("Выдать HP в радиусе").doName = 'tptoid';
    UIMenu.Menu.AddMenuItem("Выдать Armor в радиусе").doName = 'tptoid';
    UIMenu.Menu.AddMenuItem("Выдать оружие в радиусе").doName = 'tptoid';*/
    UIMenu.Menu.AddMenuItem("~y~Пригласить на мероприятие", "", {doName: "inviteMp"});
    //UIMenu.Menu.AddMenuItem("~y~Активировать событие").doName = 'eventActivateMenu';

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        if (item.doName == 'eventActivateMenu')
            menuList.showAdminEventActivateMenu();
        if (item.doName == 'inviteMp')
            mp.events.callRemote('server:admin:inviteMp');
    });
};

menuList.showAdminEventActivateMenu = function() {
    UIMenu.Menu.Create(`ADMIN`, `~b~Админ меню`);

    UIMenu.Menu.AddMenuItem("Крушение вертолёта", "", {eventSmall: 0});
    UIMenu.Menu.AddMenuItem("~y~Деактивировать событие", "", {doName: "deleteEvent"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();
};

menuList.showAdminDevMenu = function() {
    UIMenu.Menu.Create(`ADMIN`, `~b~Админ меню`);

    UIMenu.Menu.AddMenuItem("Сохранить все аккаунты", "", {doName: "saveAllAcc"});
    UIMenu.Menu.AddMenuItem("Сохранить всё", "", {doName: "saveAll"});

    UIMenu.Menu.AddMenuItem("Interior Manager", "", {doName: "interior"});

    UIMenu.Menu.AddMenuItem("Debug", "", {doName: "debug"});
    UIMenu.Menu.AddMenuItem("Debug2", "", {doName: "debug2"});
    UIMenu.Menu.AddMenuItem("КоордыVeh", "", {doName: "server:user:getVehPos"});
    UIMenu.Menu.AddMenuItem("Коорды", "", {doName: "server:user:getPlayerPos"});
    UIMenu.Menu.AddMenuItem("Коорды2", "", {doName: "server:user:getPlayerPos2"});

    UIMenu.Menu.AddMenuItem("Добавить на счета орг.", "", {doName: "addFraction2"});
    UIMenu.Menu.AddMenuItem("Списать со счета орг.", "", {doName: "removeFraction2"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        if (item.doName == 'addFraction2') {
            let fr = methods.parseInt(await UIMenu.Menu.GetUserInput("ID Фракции", "", 15));
            let sum = methods.parseFloat(await UIMenu.Menu.GetUserInput("Сумма", "", 15));
            fraction.addMoney(fr, sum, 'Администратор ' + user.getCache('name'));
        }
        if (item.doName == 'removeFraction2') {
            let fr = methods.parseInt(await UIMenu.Menu.GetUserInput("ID Фракции", "", 15));
            let sum = methods.parseFloat(await UIMenu.Menu.GetUserInput("Сумма", "", 15));
            fraction.removeMoney(fr, sum, 'Администратор ' + user.getCache('name'));
        }
        if (item.doName == 'interior') {
            menuList.showAdminInteriorMenu();
        }
        if (item.doName == 'debug') {
            menuList.showAdminDebugMenu();
        }
        if (item.doName == 'server:user:getPlayerPos') {
            mp.events.callRemote('server:user:getPlayerPos');
        }
        if (item.doName == 'saveAllAcc') {
            mp.events.callRemote('server:saveAllAcc');
        }
        if (item.doName == 'saveAll') {
            mp.events.callRemote('server:saveAll');
        }
        if (item.doName == 'server:user:getPlayerPos2') {
            let str = await UIMenu.Menu.GetUserInput("Коорды", "", 200);
            mp.events.callRemote('server:user:getPlayerPos2', str);
        }
        if (item.doName == 'server:user:getVehPos') {
            mp.events.callRemote('server:user:getVehPos');
        }
    });
};

menuList.showAdminColorVehMenu = function() {
    UIMenu.Menu.Create(`Admin`, `~b~Цвет ТС`);

    let color1 = 0;
    let color2 = 0;

    let list = [];
    for (let j = 0; j <= 160; j++)
        list.push(j + '');

    UIMenu.Menu.AddMenuItemList("Цвет 1", list, "", {doName: "list1Item"});
    UIMenu.Menu.AddMenuItemList("Цвет 2", list, "", {doName: "list2Item"});
    UIMenu.Menu.AddMenuItemList("Цвет перламутра", list, "", {doName: "list5Item"});
    UIMenu.Menu.AddMenuItemList("Цвет колес", list, "", {doName: "list6Item"});
    UIMenu.Menu.AddMenuItemList("Цвет салона", list, "", {doName: "list7Item"});
    UIMenu.Menu.AddMenuItemList("Цвет приб. панели", list, "", {doName: "list8Item"});

    try {
        if (mp.players.local.vehicle.getLiveryCount() > 1) {
            let list2 = [];
            for (let j = 0; j < mp.players.local.vehicle.getLiveryCount(); j++)
                list2.push(j + '');
            UIMenu.Menu.AddMenuItemList("Livery", list2, "", {doName: "list3Item"});
        }

        let isExtra = false;
        let list3 = [];

        for (let i = 0; i < 10; i++) {
            if (mp.players.local.vehicle.doesExtraExist(i))
                isExtra = true;
        }
        for (let j = 0; j < 10; j++) {
            list3.push(j + '');
        }

        if (isExtra)
            UIMenu.Menu.AddMenuItemList("Extra", list3, "", {doName: "list4Item"});
    }
    catch (e) {

    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnList.Add((item, index) => {
        if ('list3Item' == item.doName) {
            mp.events.callRemote('server:vehicle:setLivery', index);
            return;
        }
        if ('list4Item' == item.doName) {
            vehicles.setExtraState(index);
            return;
        }
        if ('list5Item' == item.doName) {
            mp.events.callRemote('server:vehicle:setColorP', index);
            return;
        }
        if ('list6Item' == item.doName) {
            mp.events.callRemote('server:vehicle:setColorW', index);
            return;
        }
        if ('list7Item' == item.doName) {
            mp.events.callRemote('server:vehicle:setColorI', index);
            return;
        }
        if ('list8Item' == item.doName) {
            mp.events.callRemote('server:vehicle:setColorD', index);
            return;
        }
        if ('list1Item' == item.doName)
            color1 = index;
        if ('list2Item' == item.doName)
            color2 = index;
        mp.events.callRemote('server:vehicle:setColor', color1, color2);
    });
};

menuList.showAdminDebugMenu = function() {
    UIMenu.Menu.Create(`Admin`, `~b~Debug`);

    UIMenu.Menu.AddMenuItemList("Effect", enums.screenEffectList);
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnList.Add((item, index) => {
        user.stopAllScreenEffect();
        mp.game.graphics.startScreenEffect(enums.screenEffectList[index], 0, false);
    });
};

menuList.showAdminTunningMenu = function() {
    UIMenu.Menu.Create(`Admin`, `~b~Tunning`);

    let veh = mp.players.local.vehicle;

    for (let i = 0; i < 100; i++) {
        try {
            if (veh.getNumMods(i) === 0) continue;

            if (veh.getNumMods(i) > 0 && enums.lscNames[i][1] > 0) {
                let label = mp.game.ui.getLabelText(veh.getModSlotName(i));
                if (label == "NULL" || label == "")
                    label = `${enums.lscNames[i][0]}`;

                let list = ['Стандарт'];
                for (let j = 0; j < veh.getNumMods(i); j++)
                    list.push(j + '');

                UIMenu.Menu.AddMenuItemList(`${i}. ${label}`, list,``, {modType: i});
            }
        }
        catch (e) {
            methods.debug(e);
        }
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnList.Add((item, idx) => {
        if (item.modType >= 0)
            mp.events.callRemote('server:lsc:showTun', item.modType, idx - 1);
    });
    UIMenu.Menu.OnSelect.Add(item => {
        UIMenu.Menu.HideMenu();
    });
};

menuList.showAdminInteriorMenu = function() {
    UIMenu.Menu.Create(`Admin`, `~b~Interior`);

    enums.interiorProps.forEach(item => {
        UIMenu.Menu.AddMenuItem(item.name, item.ipl, {name: item.name});
    });

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(item => {
        UIMenu.Menu.HideMenu();
        if (item.name)
            menuList.showAdminInteriorInfoMenu(item.name);
    });
};

menuList.showAdminInteriorInfoMenu = function(ipl) {
    UIMenu.Menu.Create(`Admin`, `~b~Interior`);

    enums.interiorProps.forEach(item => {

        if (item.name === ipl) {
            let intId = mp.game.interior.getInteriorAtCoords(item.pos.x, item.pos.y, item.pos.z); //269313
            UIMenu.Menu.AddMenuItem('Телепорт во внутрь', item.ipl, {pos: item.pos});

            if (item.ipl) {
                UIMenu.Menu.AddMenuItemList('Подгрузить IPL', ['Выкл', 'Вкл'], "", {ipl: item.ipl}, mp.game.streaming.isIplActive(item.ipl) ? 1 : 0);
            }

            item.props.forEach(prop => {
                let pItem = {};
                pItem.propName = prop;
                pItem.int = intId;
                UIMenu.Menu.AddMenuItemList(prop, ['Выкл', 'Вкл'], "", pItem, mp.game.interior.isInteriorPropEnabled(intId, prop) ? 1 : 0)

                /*pItem = UIMenu.Menu.AddMenuItemList('Цвет', [0,1,2,3,4,5,6,7,8,9,10], "");
                pItem.propName = prop;
                pItem.int = intId;*/
            });
        }
    });

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnList.Add((item, idx) => {
        if (item.ipl)
        {
            if (idx === 1)
                mp.game.streaming.requestIpl(item.ipl);
            else
                mp.game.streaming.removeIpl(item.ipl);
        }
        else {
            methods.setIplPropState(item.int, item.propName, idx === 1); //269313
            mp.game.invoke(methods.SET_INTERIOR_PROP_COLOR, item.int, item.propName, 1);
            mp.game.invoke('0xC1F1920BAF281317', 269313, 'set_int_02_shell', 1); mp.game.interior.refreshInterior(269313);
            mp.game.interior.refreshInterior(item.int);
        }
    });

    UIMenu.Menu.OnSelect.Add(item => {
        if (item.pos)
            user.teleportv(item.pos);
        else
            UIMenu.Menu.HideMenu();
    });
};

menuList.showAdminClothMenu = function() {
    UIMenu.Menu.Create(`Admin`, `~b~Одежда`);

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
        let list1Item = {};
        list1Item.slotId = i;
        list1Item.type = 0;
        UIMenu.Menu.AddMenuItemList("Слот " + i, list, "", list1Item);

        let list2Item = {};
        list2Item.slotId = i;
        list2Item.type = 1;
        UIMenu.Menu.AddMenuItemList("Цвет " + i, list, "", list2Item);

        UIMenu.Menu.AddMenuItem(" ");
    }

    for (let i = 0; i < 8; i++) {
        let list1Item = {};
        list1Item.slotId = i;
        list1Item.type = 2;
        UIMenu.Menu.AddMenuItemList("ПСлот " + i, list, "", list1Item);

        let list2Item = {};
        list2Item.slotId = i;
        list2Item.type = 3;
        UIMenu.Menu.AddMenuItemList("ПЦвет " + i, list, "", list2Item);

        UIMenu.Menu.AddMenuItem(" ");
    }
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnList.Add((item, index) => {

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
};

menuList.showAdminMaskMenu = function() {
    UIMenu.Menu.Create(`Admin`, `~b~Маски`);

    UIMenu.Menu.AddMenuItem("~b~Все категории", "", {doName: "all"});
    for (let i = 0; i < enums.maskClasses.length; i++) {
        UIMenu.Menu.AddMenuItem(`${enums.maskClasses[i]}`, '', {slotId: i});
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(item => {
        UIMenu.Menu.HideMenu();
        if (item.slotId >= 0) {
            menuList.showAdminMaskListMenu(item.slotId);
        }
        if (item.doName === 'all') {
            menuList.showAdminMaskListMenu(-1);
        }
    });
};

menuList.showAdminMaskListMenu = function(slot) {
    try {

        if (enums.maskList.length < 1)
            return;

        UIMenu.Menu.Create(`Admin`, `~b~Маски`);

        let list = [];
        for (let i = 0; i < enums.maskList.length; i++) {
            let maskItem = enums.maskList[i];

            if (slot >= 0) {
                if (maskItem[0] !== slot)
                    continue;
            }

            //[ClassID, "Name", MaskID, MaxColor, Price, NetCoin, УбратьПричёску, УбратьОчки, УбратьШляпу, УбратьСерьги, СтандартноеЛицо, УбратьСкулы, Скрытность, МагазинID, ШансВыпасть],

            let mItem = {};
            mItem.maskn = methods.removeQuotesAll(maskItem[1]);
            mItem.maskId = maskItem[2];
            mItem.maskColor = maskItem[3];
            mItem.maskHair = maskItem[6];
            mItem.maskGlass = maskItem[7];
            mItem.maskHat = maskItem[8];
            mItem.maskAcc = maskItem[9];
            mItem.maskFaceDef = maskItem[10];
            mItem.maskFace = maskItem[11];
            mItem.maskr = maskItem[14];
            mItem.idxFull = i;
            list.push(mItem);
            UIMenu.Menu.AddMenuItem(`${maskItem[1]}`, `Цена: ~g~${methods.moneyFormat(maskItem[4])}~br~~s~Цена: ~y~${methods.numberFormat(maskItem[5])}nc~br~~s~ID: ${i}`, mItem)
        }

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnIndexSelect.Add((index) => {
            if (index >= list.length)
                return;
            //user.setComponentVariation(1, list[index].maskId, list[index].maskColor);
            user.set('mask', list[index].idxFull);
            user.set('mask_color', 1);
            user.updateCharacterFace();
            user.updateCharacterCloth();
        });

        UIMenu.Menu.OnSelect.Add(async item => {
            UIMenu.Menu.HideMenu();
            if (item.idxFull >= 0) {
                let str = await UIMenu.Menu.GetUserInput("Имя", "", 200);
                let name = item.maskn;
                if (str !== '')
                    name = str;
                let params = `{"name": "${methods.removeQuotes(methods.removeQuotes2(name))}", "mask": ${item.idxFull}, "desc": "${methods.getRareName(item.maskr)}"}`;
                inventory.addItem(274, 1, inventory.types.Player, user.getCache('id'), 1, 0, params, 100);
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.hide = function() {
    UIMenu.Menu.HideMenu();
};

menuList.getUserInput = async function(title, value = "", count = 20) {
    return await UIMenu.Menu.GetUserInput(title, value, count);
};

mp.events.add("vSync:playerExitVehicle", (vehId) => {
    UIMenu.Menu.HideMenu();
});

export default menuList;