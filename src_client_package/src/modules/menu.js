"use strict";

import methods from './methods';
import user from '../user';
import chat from '../chat';
import ui from './ui';

let NativeUI = eval('require(\'nativeui\')');
const NMenu = NativeUI.Menu;
const MenuItem = NativeUI.UIMenuItem;
const MenuCheckboxItem = NativeUI.UIMenuCheckboxItem;
const MenuListItem = NativeUI.UIMenuListItem;
const MenuSliderItem = NativeUI.UIMenuSliderItem;
const Point = NativeUI.Point;
const Size = NativeUI.Size;
const ItemsCollection = NativeUI.ItemsCollection;

let _isShowInput;
let menuItem = null;


let promise = {};

mp.events.add('client:modalinput:callBack', (data) => {
    _isShowInput = false;
    chat.activate(true);
    methods.blockKeys(false);
    mp.gui.cursor.show(false, false);
    user.setVariable('isTyping', false);
    promise.resolve(data);
});

class Menu {
    static Create(title, subtitle, isResetBackKey, isDisableAllControls, DisableAllControlsOnClose, spriteLib = 'commonmenu', spriteName = 'interaction_bgd') {
        try {
            this.HideMenu();

            //if (user.isCuff() || user.isTie() || user.isDead()) TODO
            //    return;

            if (isDisableAllControls) {
                mp.players.local.freezePosition(true);
                methods.disableAllControls(true);
            }

            menuItem = new NMenu(title.toUpperCase(), subtitle, new Point(this.GetScreenResolutionMantainRatio().Width - 450, 180), spriteLib, spriteName);

            if (isDisableAllControls && !DisableAllControlsOnClose) {
                menuItem.MenuClose.on( () => {
                    mp.players.local.freezePosition(false);
                    methods.disableAllControls(false);
                    chat.activate(true);
                });
            }

            menuItem.MouseControlsEnabled = false;
            menuItem.MouseEdgeEnabled = false;
            menuItem.Visible = true;
            menuItem.RefreshIndex();
        } catch (e) {
            console.log(e);
        }
        /*
                if (isResetBackKey === true)
                    menu.Reset(Menu.Controls.BACK);
        */
        return menuItem;
    }

    static GetScreenResolutionMantainRatio() {
        const gameScreen = mp.game.graphics.getScreenActiveResolution(0, 0);
        const screenw = gameScreen.x;
        const screenh = gameScreen.y;
        const height = 1080.0;
        const ratio = screenw / screenh;
        var width = height * ratio;

        return new Size(width, height);
    }

    static ItemsCollection(items) {
        return new ItemsCollection(items);
    }

    static AddMenuItem(title, subtitle) {
        let item = new MenuItem(title, subtitle);
        menuItem.AddItem(item);
        return item;
    }

    static AddMenuItemList(title, list, subtitle) {
        let item = new MenuListItem(title, subtitle, new ItemsCollection(list));
        menuItem.AddItem(item);
        return item;
    }

    static AddMenuItemCheckbox(title, subtitle, isChecked) {
        if (isChecked === undefined || isChecked == null)
            isChecked = false;

        let item = new MenuCheckboxItem(title, isChecked, subtitle);
        menuItem.AddItem(item);
        return item;
    }

    static AddMenuItemSlider(title, items, subtitle, startIndex, divider) {
        if (divider === undefined || divider == null)
            divider = false;

        let item = new MenuSliderItem(title, items, startIndex, subtitle, divider);
        menuItem.AddItem(item);
        return item;
    }

    static GetCurrentMenu() {
        return menuItem;
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

    /*static async GetUserInput(title, defaultText, maxInputLength = 20) {
        user.setVariable('isTyping', true);
        try {
            mp.game.ui.notifications.show("~b~Введите: ~s~" + title);
            _isShowInput = true;
            chat.activate(false);
            mp.game.gameplay.displayOnscreenKeyboard(1, 'FMMC_KEY_TIP8', "", defaultText, "", "", "", maxInputLength);
            while (mp.game.gameplay.updateOnscreenKeyboard() != 1 && mp.game.gameplay.updateOnscreenKeyboard() != 2 && mp.game.gameplay.updateOnscreenKeyboard() != 3)
                await methods.sleep(1);
            if (mp.game.gameplay.updateOnscreenKeyboard() == 1) {
                _isShowInput = false;
                chat.activate(true);
                user.setVariable('isTyping', false);
                return mp.game.gameplay.getOnscreenKeyboardResult();
            }
            _isShowInput = false;
            chat.activate(true);
        }
        catch (e) {
            methods.debug(e);
        }
        user.setVariable('isTyping', false);
        return '';
    }*/

    static HideMenu() {
        if (menuItem != null) {

            mp.players.local.freezePosition(false);
            methods.disableAllControls(false);
            chat.activate(true);

            /*MenuItem.ItemSelect.clear();
            menuItem.IndexChange.clear();
            menuItem.ListChange.clear();
            menuItem.SliderChange.clear();
            menuItem.SliderSelect.clear();
            menuItem.CheckboxChange.clear();
            //menuItem.MenuOpen.clear();
            menuItem.MenuClose.clear();
            menuItem.MenuChange.clear();*/
            menuItem.Close();
            menuItem = null;
        }
    }
}

export default {Menu: Menu};
