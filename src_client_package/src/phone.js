import UIMenu from './modules/menu';
import methods from './modules/methods';
import container from './modules/data';
import chat from './chat';
import items from './items';
import user from './user';
import ui from "./modules/ui";
import menuList from "./menuList";
import weather from "./manager/weather";

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
            battery: 0,
            wifi: 0,
            network: 0,
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
    }
};

phone.showAppList = function() {
    let menu = {
        UUID: 'apps',
        title: 'Установленные приложения',
        items: []
    };

    let item = {
        title: "Life Invader",
        text: "Приложение для подачи объявлений",
        clickable: true,
        type: 1,
        params: { name: "invader" }
    };
    menu.items.push(item);

    if (user.getCache('bank_card') > 0) {
        let item = {
            title: "Ваш банк",
            text: "Приложение вашего банка",
            clickable: true,
            type: 1,
            params: { name: "bank" }
        };
        menu.items.push(item);
    }

    if (user.getCache('fraction_id') > 0) {
        let item = {
            title: user.getFractionNameL(),
            text: `Официальное приложение организации ${user.getFractionName()}`,
            clickable: true,
            type: 1,
            params: { name: "fraction" }
        };
        menu.items.push(item);
    }

    let data = {
        type: 'updateMenu',
        menu: menu
    };
    ui.callCef('phone' + phone.getType(), JSON.stringify(data));
};

phone.callBack = function(action, menu, id, ...args) {
    methods.debug(action, menu, id, ...args);
    if (action == 'button')
        phone.callBackButton(menu, id, ...args);
    else
        phone.callBackCheckbox(menu, id, ...args);

};

phone.callBackButton = function(menu, id, ...args) {
    try {
        let params = JSON.stringify(args[0]);
    }
    catch (e) {
        methods.debug(e)
    }
};

phone.callBackCheckbox = function(menu, id, ...args) {
    try {
        let checked = args[0];
        let params = JSON.stringify(args[1]);
    }
    catch (e) {
        methods.debug(e);
    }
};

export default phone;