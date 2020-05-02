"use strict";

import methods from './methods';
import user from '../user';
import chat from '../chat';
import ui from './ui';
import cefMenu from "./cefMenu";
import houses from "../property/houses";

let _isShowInput;
let menuItem = null;
let menuName = '';

let _title = '';
let _subtitle = '';
let _banner = '';
let _menuName = '';

let promise = {};

mp.events.add('client:modalinput:callBack', (data) => {
    _isShowInput = false;
    chat.activate(true);
    methods.blockKeys(false);
    mp.gui.cursor.show(false, false);
    user.setVariable('isTyping', false);
    promise.resolve(data);
});

class EventManager {

    handlers = {};
    eventName = '';

    constructor(menuName) {
        this.eventName = menuName;
    }

    Add(handler) {
        try {
            if (this.eventName in this.handlers) {
                this.handlers[this.eventName] = null;
                delete this.handlers[this.eventName];
            }

            this.handlers[this.eventName] = handler;
        }
        catch (e) {
            methods.debug(e, this.eventName);
        }
    }

    Remove() {
        if (this.eventName in this.handlers) {
            this.handlers[this.eventName] = null;
            delete this.handlers[this.eventName];
        }
    }

    Emit(...args) {
        methods.debug(this.eventName, this.handlers.length);
        if (this.eventName in this.handlers)
            this.handlers[this.eventName](...args);
    }
}

mp.events.add("client:menuList:callBack:btn", async (menuName, id, jparams) => {
    try {
        methods.debug('OnSelect', menuName, id, jparams);
        if (methods.isValidJSON(jparams))
            Menu.OnSelect.Emit(JSON.parse(jparams), id, menuName);
        else
            Menu.OnSelect.Emit({}, id, menuName);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add("client:menuList:onClose", async () => {
    try {
        Menu.OnClose.Emit();

        Menu.OnClose.Remove();
        Menu.OnList.Remove();
        Menu.OnCheckbox.Remove();
        Menu.OnSelect.Remove();
        Menu.OnIndexSelect.Remove();
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add("client:menuList:callBack:check", async (menuName, id, jparams, checked) => {
    try {
        methods.debug('OnCheckbox', menuName, id, jparams, checked);
        if (methods.isValidJSON(jparams))
            Menu.OnCheckbox.Emit(JSON.parse(jparams), checked, id, menuName);
        else
            Menu.OnCheckbox.Emit({}, checked, id, menuName);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add("client:menuList:callBack:list", async (menuName, id, jparams, index) => {
    try {
        methods.debug('OnList', menuName, id, jparams, index, methods.isValidJSON(jparams));
        if (methods.isValidJSON(jparams))
            Menu.OnList.Emit(JSON.parse(jparams), index, id, menuName);
        else
            Menu.OnList.Emit({}, index, id, menuName);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add("client:menuList:callBack:select", async (menuName, idx) => {
    try {
        methods.debug('OnIndexSelect', menuName, idx);
        Menu.OnIndexSelect.Emit(idx, menuName);
    }
    catch (e) {
        methods.debug(e);
    }
});

class Menu {
    static OnClose = new EventManager('OnClose');
    static OnList = new EventManager('OnList');
    static OnCheckbox = new EventManager('OnCheckbox');
    static OnSelect = new EventManager('OnSelect');
    static OnIndexSelect = new EventManager('OnIndexSelect');

    static Create(title, subtitle, menuName = 'Unknown', isDisableAllControls = false, DisableAllControlsOnClose = false, banner = '') {
        try {
            this.HideMenu();

            if (isDisableAllControls) {
                mp.players.local.freezePosition(true);
                methods.disableAllControls(true);
            }

            _title = title;
            _subtitle = subtitle;
            _banner = banner;
            _menuName = menuName;

            menuItem = [];

            if (isDisableAllControls && !DisableAllControlsOnClose) {
                new EventManager('OnCloseSpec').Add( () => {
                    mp.players.local.freezePosition(false);
                    methods.disableAllControls(false);
                    chat.activate(true);
                });
            }

        } catch (e) {
            console.log(e);
        }
    }

    static AddMenuItem(title, subtitle, params, rightLabel = '', icon = '', iconRight = '', divider = false) {
        title = methods.replaceQuotes(title);
        subtitle = methods.replaceQuotes(subtitle);
        menuItem.push(cefMenu.getMenuItem(title, subtitle, params, rightLabel, icon, iconRight, divider));
    }

    static AddMenuItemList(title, list, subtitle, params, index = 0, rightLabel = '', icon = '', iconRight = '', divider = false) {
        if (index < 0)
            index = 0;
        title = methods.replaceQuotes(title);
        subtitle = methods.replaceQuotes(subtitle);
        menuItem.push(cefMenu.getMenuItemList(title, subtitle, params, list, index, rightLabel, icon, iconRight, divider));
    }

    static AddMenuItemCheckbox(title, subtitle, params, isChecked = false, rightLabel = '', icon = '', iconRight = '', divider = false) {
        title = methods.replaceQuotes(title);
        subtitle = methods.replaceQuotes(subtitle);
        menuItem.push(cefMenu.getMenuItemCheckbox(title, subtitle, params, isChecked, rightLabel, icon, iconRight, divider));
    }

    static Draw() {
        cefMenu.showFull(_title, _subtitle, menuItem, _menuName, _banner);
        ui.updatePositionSettings();
    }

    static IsShowInput() {
        return _isShowInput || mp.gui.chat.enabled;
    }

    static async GetUserInput(title, defaultText = '', maxInputLength = 20) {
        return new Promise((resolve, reject) => {
            _isShowInput = true;
            methods.blockKeys(true);
            chat.activate(false);
            mp.gui.cursor.show(true, true);
            user.setVariable('isTyping', true);

            promise = {resolve, reject};

            let data = {
                type: 'updateValues',
                isShow: true,
                title: `${title}`,
                text: defaultText,
                maxLength: maxInputLength,
            };

            ui.callCef('modalinput', JSON.stringify(data));
        });
    }

    static HideMenu() {
        if (menuItem != null) {

            /*try {
                delete this.OnClose;
                delete this.OnList;
                delete this.OnCheckbox;
                delete this.OnSelect;
                delete this.OnIndexSelect;
            }
            catch (e) {
                
            }*/

            mp.players.local.freezePosition(false);
            methods.disableAllControls(false);
            chat.activate(true);

            cefMenu.hide();
            menuItem = null;
            menuName = '';
        }
    }
}

export default {Menu: Menu};
