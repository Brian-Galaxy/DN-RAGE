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

import houses from './property/houses';
import condos from './property/condos';
import business from './property/business';

import cloth from './business/cloth';
import vehicles from "./property/vehicles";

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
    });
};

menuList.showShopClothMenu = function (shopId, type, menuType) {
    try {
        methods.debug('Execute: menuList.showShopClothMenu');

        //if (menuType == 11)
        //    inventory.unEquipItem(265, 0, 1, 0, false);

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
            /*if (menuType == 7) {
                UIMenu.Menu.AddMenuItem("~y~Снять").doName = "takeOff";
            }*/
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

menuList.showTattooShopMenu = function(title1, title2, shopId)
{
    UIMenu.Menu.HideMenu();
    let menu = UIMenu.Menu.Create(" ", "~b~Тату салон", false, false, false, title1, title2);
    //TODO BLACKOUT

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
    let menu = UIMenu.Menu.Create(" ", "~b~Тату салон", false, false, false, title1, title2);
    //TODO BLACKOUT

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

menuList.showBusinessTeleportMenu = function() {
    //TODO BLACKOUT
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
            UIMenu.Menu.AddMenuItem("~g~Купить", `Цена: ~g~$${methods.numberFormat(data.get('price'))}`).doName = 'buy';
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
                let money = await UIMenu.Menu.GetUserInput("Сумма", "", 8);
                money = methods.parseFloat(money);
                if (money > user.getCashMoney()) {
                    mp.game.ui.notifications.show(`~r~У Вас нет столько денег на руках`);
                    return;
                }
                if (money < 1) {
                    mp.game.ui.notifications.show(`~r~Нельзя положить меньше 1$`);
                    return;
                }
                business.addMoney(data.get('id'), money, 'Операция со счётом');
                user.removeCashMoney(money);
                business.save(data.get('id'));
                mp.game.ui.notifications.show(`~b~Вы положили деньги на счет бизнеса`);
            }
            catch (e) {
                methods.debug(e);
            }
        }
        if (item.doName == 'removeMoney') {

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

            business.removeMoney(data.get('id'), money, 'Операция со счётом');
            business.save(data.get('id'));
            user.addCashMoney(money * (100 - nalog - bankTarif) / 100);
            coffer.addMoney(1, money * nalog / 100);
            mp.game.ui.notifications.show(`~b~Вы сняли ~s~$${methods.numberFormat(money * (100 - nalog + bankTarif) / 100)} ~b~со счёта с учётом налога`);
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

    if (user.get('fraction_id') > 0)
        UIMenu.Menu.AddMenuItem("Организация").doName = 'showFractionMenu';
    if (user.get('fraction_id2') > 0)
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

    //{ id: 28, item_id: 101, name: "Кепка", volume: 15, desc: "", params: "{}" },

    //if (user.isDead()) //TODO
    //    return;

    try {
        //let invAmountMax = await inventory.getInvAmountMax(ownerId, ownerType);
        let sum = 0;

        //inventory.clearItems();
        //inventory.updateEquipWeapon();
        //inventory.updateEquip();

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
                else if (item.item_id <= 274 && item.item_id >= 264) {
                    itemName = params.name;
                }
                else if (item.item_id == 50) {
                    itemName = items.getItemNameById(item.item_id);
                    desc = methods.bankFormat(params.number);
                }

                if (item.is_equip == 1) {

                    if (item.item_id == 50) {
                        if (params.number != user.getCache('bank_card')) {
                            inventory.updateEquipStatus(item.id, false);
                            return;
                        }
                    }

                    equipItems.push({ id: item.id, item_id: item.item_id, name: itemName, counti: item.count, volume: items.getItemAmountById(item.item_id), desc: desc, params: params }); //TODO
                }
                else
                    currentItems.push({ id: item.id, item_id: item.item_id, name: itemName, counti: item.count, volume: items.getItemAmountById(item.item_id), desc: desc, params: params }); //TODO
            } catch (e) {
                methods.debug(e);
            }
        });

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

        ui.callCef('inventory', JSON.stringify(dataSend));
        ui.callCef('inventory', JSON.stringify(dataSend2));
        inventory.setInvAmount(ownerId, ownerType, sum);
    }
    catch (e) {
       methods.debug(e);
    }
    //let name = "Предметы";
    //inventory.updateLabel(invAmountMax != -1 ? `${methods.numerToK(sum)}/${methods.numerToK(invAmountMax)}см³ (${data.length}шт.)` : "Инвентарь");
    //inventory.show();
};

menuList.showToPlayerWorldListMenu = function(data) {

    if (user.get('jail_time') > 0) {
        mp.game.ui.notifications.show("~r~В тюрьме нельзя этим пользоваться");
        return;
    }
    if (user.isDead()) {
        mp.game.ui.notifications.show("~r~Нельзя использовать инвентарь будучи мёртвым");
        return;
    }

    inventory.clearItems();
    inventory.updateEquipWeapon();
    inventory.updateEquip();

    data.forEach((item, idx) => {
        try {
            //menuType, id, itemId, count, key, prefix, number, kg, wg

            let itemName = items.getItemNameById(item.item_id);
            if (item.item_id >= 265 && item.item_id <= 273 && item.label.toString() != "")
                itemName = item.label;
            else if (item.label.toString() != "")
                itemName += " " + item.label;

            let itemId = item.item_id;
            let countItems = item.count;
            let menuType = "";

            if (!user.isGos() && (itemId > 203 || itemId < 194))
                menuType += " takeItemButton";
            else if (user.isGos())
                menuType += " takeItemButton";

            if (itemId == 142 || itemId == 143 || itemId == 144 || itemId == 145 ||
                itemId == 163 || itemId == 164 || itemId == 165 || itemId == 166 ||
                itemId == 167 || itemId == 168 || itemId == 169 || itemId == 170 ||
                itemId == 171 || itemId == 172 || itemId == 173 || itemId == 174 ||
                itemId == 175 || itemId == 176 || itemId == 177 || itemId == 178 ||
                itemId == 154 || itemId == 155 || itemId == 156 || itemId == 157 ||
                itemId == 179 || itemId == 180) {
                menuType += " takeOneGrammItemButton";
                if (itemId == 142 || itemId == 143 || itemId == 144 || itemId == 145 ||
                    itemId == 163 || itemId == 164 || itemId == 165 || itemId == 166 ||
                    itemId == 167 || itemId == 168 || itemId == 169 || itemId == 170) {
                    if (countItems >= 10) {
                        menuType += "takeTenGrammItemButton";
                    }
                    if (countItems >= 50) {
                        menuType += "takeFiftyGrammItemButton";
                    }
                }
                menuType += " takeItemButton";
            }
            if (0 !== inventory.types.Fridge && 0 !== inventory.types.Vehicle)
                menuType += " transferToVehiclePlayerItemButton";

            //kitchenId = mp.players.local.dimension; // Main.GetKitchenId();
            if (mp.players.local.dimension !== 0 && 0 !== inventory.types.Fridge) {
                // Kitchen
                enums.kitchenIntData.forEach(function(item, i, arr) {
                    let pos = new mp.Vector3(item[0], item[1], item[2]);
                    if (methods.distanceToPos(mp.players.local.position, pos) < 2) {
                        menuType += " transferToFridgePlayerItemButton";
                    }
                });
            }
            if (mp.players.local.dimension >= 5100000 && methods.distanceToPos(mp.players.local.position, stock.stockPos) < 2) {
                menuType += " transferToStockPlayerItemButton";
            }
            if (itemId == 140 || itemId == 141) {
                menuType += " countMoneyPlayerItemButton";
            }
            if ((itemId >= 146 && itemId <= 153) || (itemId >= 27 && itemId <= 30)) {
                menuType += " countBulletsPlayerItemButton";
            }

            inventory.addInvItem(menuType, 0, 0, item.id, itemName, item.item_id, item.count, item.key_id, item.prefix, item.number, items.getItemWeightById(item.item_id), items.getItemAmountById(item.item_id));
        } catch (e) {
            methods.debug(e);
        }
    });

    inventory.updateLabel("Список предметов");
    inventory.show();
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
            UIMenu.Menu.AddMenuItem("Коорды").doName = 'server:user:getPlayerPos';
            UIMenu.Menu.AddMenuItem("КоордыVeh").doName = 'server:user:getVehPos';
            UIMenu.Menu.AddMenuItem("Debug").doName = 'debug';
            UIMenu.Menu.AddMenuItem("Debug2").doName = 'debug2';
        }
        UIMenu.Menu.AddMenuItem("~y~Выключить админку").doName = 'disableAdmin';
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
            methods.debug(methods.isInPoint(new mp.Vector3(127.1338, -990.3669, 28.27379), new mp.Vector3(187.1756, -841.2456, 29.98764), new mp.Vector3(264.9635, -870.636, 28.17656), new mp.Vector3(209.8404, -1024.132, 28.40043), mp.players.local.position))
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