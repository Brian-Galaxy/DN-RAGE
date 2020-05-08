import Container from '../modules/data';
import methods from '../modules/methods';
import ui from "../modules/ui";

import vehicles from "../property/vehicles";

import phone from "../phone";
//import voice from "../voice";
import voiceRage from "../voiceRage";
import user from '../user';
import inventory from "../inventory";
import chat from "../chat";
import weapons from "../weapons";
import menuList from "../menuList";
import enums from "../enums";
import walkie from "../walkie";

import pSync from "./pSync";
import heliCam from "./heliCam";


let bind = {};

const keyCodes = {
    0: 'None',
    3: 'Break',
    //8: 'backspace',
    9: 'Tab',
    12: 'Clear',
    //13: 'enter',
    16: 'Shift',
    17: 'Ctrl',
    18: 'Alt',
    19: 'Pause',
    20: 'Caps Lock',
    21: 'Hangul',
    25: 'Hanja',
    //27: 'Escape',
    28: 'Convert',
    29: 'Non-Convert',
    32: 'Space',
    33: 'Page Up',
    34: 'Page Down',
    35: 'End',
    36: 'Home',
    /*37: 'left arrow',
    38: 'up arrow',
    39: 'right arrow',
    40: 'down arrow',*/
    41: 'Select',
    42: 'Print',
    43: 'Execute',
    44: 'Print Screen',
    45: 'Insert',
    46: 'Delete',
    47: 'Help',
    48: '0',
    49: '1',
    50: '2',
    51: '3',
    52: '4',
    53: '5',
    54: '6',
    55: '7',
    56: '8',
    57: '9',
    58: ':',
    59: 'Semicolon',
    60: '<',
    61: 'Equals',
    63: 'ß',
    64: '@',
    65: 'A',
    66: 'B',
    67: 'C',
    68: 'D',
    //69: 'E',
    70: 'F',
    71: 'G',
    72: 'H',
    73: 'I',
    74: 'J',
    75: 'K',
    76: 'L',
    //77: 'm',
    78: 'N',
    79: 'O',
    80: 'P',
    81: 'Q',
    82: 'R',
    83: 'S',
    84: 'T',
    85: 'U',
    86: 'V',
    87: 'W',
    88: 'X',
    89: 'Y',
    90: 'Z',
    91: 'Windows Key',
    92: 'Right window key',
    93: 'Windows Menu',
    95: 'Sleep',
    96: 'Numpad 0',
    97: 'Numpad 1',
    98: 'Numpad 2',
    99: 'Numpad 3',
    100: 'Numpad 4',
    101: 'Numpad 5',
    102: 'Numpad 6',
    103: 'Numpad 7',
    104: 'Numpad 8',
    105: 'Numpad 9',
    106: '*',
    107: '+',
    108: 'Numpad period',
    109: '-',
    110: 'Del',
    111: '/',
    112: 'F1',
    113: 'F2',
    114: 'F3',
    115: 'F4',
    116: 'F5',
    117: 'F6',
    118: 'F7',
    119: 'F8',
    120: 'F9',
    121: 'F10',
    122: 'F11',
    123: 'F12',
    124: 'F13',
    125: 'F14',
    126: 'F15',
    127: 'F16',
    128: 'F17',
    129: 'F18',
    130: 'F19',
    131: 'F20',
    132: 'F21',
    133: 'F22',
    134: 'F23',
    135: 'F24',
    144: 'Num Lock',
    145: 'Scroll Lock',
    151: 'Airplane Mode',
    160: '^',
    161: '!',
    162: '؛',
    163: '#',
    164: '$',
    165: 'ù',
    166: 'Backward',
    167: 'Forward',
    168: 'Refresh',
    169: 'Closing Paren',
    170: '*',
    171: 'Ё',
    172: '+',
    173: '-',
    /*174: 'decrease volume level',
    175: 'increase volume level',*/
    176: 'Next',
    177: 'Previous',
    178: 'Stop',
    179: 'Play/Pause',
    180: 'E-mail',
    181: 'Mute/Unmute',
    /*182: 'decrease volume level (firefox)',
    183: 'increase volume level (firefox)',*/
    186: ';:',
    187: '=',
    188: '<',
    189: '_',
    190: '>',
    191: '/',
    192: 'Ё',
    193: '?,',
    //194: 'Numpad period',
    219: '[',
    220: 'Slash',
    221: ']',
    222: 'Quote',
    223: '`',
    /*224: 'Left or right ⌘ key',
    225: 'Altgr',
    226: '< /git >, left back slash',
    230: 'GNOME Compose Key',
    231: 'ç',
    233: 'XF86Forward',
    234: 'XF86Back',
    235: 'Non-conversion',
    240: 'Alphanumeric',
    242: 'Hiragana/katakana',
    243: 'Half-width/full-width',
    244: 'Kanji',
    251: 'Unlock Trackpad ',
    255: 'Toggle Touchpad',*/
};

bind.isChange = false;
bind.data = '';
bind.lastKey = 0;

bind.isKeyValid = function(keyCode) {
    for(let code in keyCodes) {
        if (methods.parseInt(code) === keyCode)
            return true;
    }
    return false;
};

bind.bindNewKey = function(key) {
    if (bind.data.trim() == '')
        return;
    key = methods.parseInt(key);
    user.set(bind.data, key);
    bind.lastKey = key;
    bind.data = '';
    bind.isChange = false;
};

bind.getKeyName = function(key) {
    return keyCodes[methods.parseInt(key)] ? keyCodes[methods.parseInt(key)] : 'None';
};

bind.getChangeKey = async function(data) {
    bind.data = data;
    bind.isChange = true;
    bind.lastKey = 0;

    while (bind.isChange)
        await methods.sleep(10);

    return bind.lastKey;
};

for(let code in keyCodes) {
    mp.keys.bind(parseInt(code), true, async function() {

        if (!user.isLogin())
            return;

        if (mp.gui.chat.enabled)
            return;

        if (user.getCache('s_bind_voice') == parseInt(code)) {
            voiceRage.enableMic();
        }
        if (user.getCache('s_bind_voice_radio') == parseInt(code)) {
            voiceRage.enableRadioMic();
        }



        if (methods.isBlockKeys()) {}
            return;

        if (user.getCache('s_bind_do') == parseInt(code)) {
            if (user.isCuff() || user.isTie()) {
                mp.game.ui.notifications.show("~r~Вы связаны или в наручниках");
                return;
            }
            if (user.getCache('jail_time') > 0) {
                mp.game.ui.notifications.show("~r~Нельзя пользоваться этим меню, в тюрьме");
                return;
            }
            if (!methods.isBlockKeys()) {
                let targetEntity = user.getTargetEntityValidate();
                if (targetEntity) {
                    inventory.openInventoryByEntity(targetEntity);
                }
            }
        }
        if (user.getCache('s_bind_inv') == parseInt(code)) {
            if (user.isCuff() || user.isTie()) {
                mp.game.ui.notifications.show("~r~Вы связаны или в наручниках");
                return;
            }
            if (user.getCache('jail_time') > 0) {
                mp.game.ui.notifications.show("~r~Нельзя пользоваться инвентарем, в тюрьме");
                return;
            }
            if (!methods.isBlockKeys() && phone.isHide()) {

                if (Container.Data.HasLocally(mp.players.local.remoteId, "isInventoryTimeout"))
                {
                    mp.game.ui.notifications.show("~r~Таймаут на действие 1 секунду");
                    return;
                }
                Container.Data.SetLocally(mp.players.local.remoteId, "isInventoryTimeout", true);
                ui.callCef('inventory', '{"type": "showOrHide"}');
                setTimeout(function () {
                    Container.Data.ResetLocally(mp.players.local.remoteId, "isInventoryTimeout");
                }, 1000);

            }
        }
        if (user.getCache('s_bind_inv_world') == parseInt(code)) {
            if (user.isCuff() || user.isTie()) {
                mp.game.ui.notifications.show("~r~Вы связаны или в наручниках");
                return;
            }
            if (user.getCache('jail_time') > 0) {
                mp.game.ui.notifications.show("~r~Нельзя пользоваться инвентарем, в тюрьме");
                return;
            }
            if (!methods.isBlockKeys() && phone.isHide())
                inventory.getItemList(0, 0);
        }
        if (user.getCache('s_bind_phone') == parseInt(code)) {
            if (!methods.isBlockKeys() && !mp.gui.cursor.visible) {
                if (Container.Data.HasLocally(mp.players.local.remoteId, "isPhoneTimeout"))
                {
                    mp.game.ui.notifications.show("~r~Таймаут на действие 0.5 секунд");
                    return;
                }
                Container.Data.SetLocally(mp.players.local.remoteId, "isPhoneTimeout", true);
                phone.showOrHide();
                setTimeout(function () {
                    Container.Data.ResetLocally(mp.players.local.remoteId, "isPhoneTimeout");
                }, 500);
            }
        }
        //if (user.getCache('s_bind_walkie') == parseInt(code)) {
        if (user.getCache('s_bind_voice_walkie') == parseInt(code)) {
            if (!methods.isBlockKeys() && !mp.gui.cursor.visible) {
                if (Container.Data.HasLocally(mp.players.local.remoteId, "isWalkieTimeout"))
                {
                    mp.game.ui.notifications.show("~r~Таймаут на действие 0.5 секунд");
                    return;
                }
                Container.Data.SetLocally(mp.players.local.remoteId, "isWalkieTimeout", true);
                walkie.showOrHide();
                setTimeout(function () {
                    Container.Data.ResetLocally(mp.players.local.remoteId, "isWalkieTimeout");
                }, 500);
            }
        }
        if (user.getCache('s_bind_stopanim') == parseInt(code)) {
            if (!methods.isBlockKeys())
                user.stopAllAnimation();
        }
        if (user.getCache('s_bind_veh_menu') == parseInt(code)) {
            if (!methods.isBlockKeys())
                mp.events.callRemote('server:showVehMenu');
        }
        if (user.getCache('s_bind_player_menu') == parseInt(code)) {
            if (!methods.isBlockKeys())
                menuList.showPlayerMenu();
        }
        if (user.getCache('s_bind_weapon_slot0') == parseInt(code)) {
            if (!methods.isBlockKeys())
            {
                if (Container.Data.HasLocally(mp.players.local.remoteId, "isGunTimeout"))
                {
                    mp.game.ui.notifications.show("~r~Таймаут 1 сек");
                    return;
                }
                Container.Data.SetLocally(mp.players.local.remoteId, "isGunTimeout", true);
                user.setCurrentWeapon('weapon_unarmed');
                setTimeout(function () {
                    Container.Data.ResetLocally(mp.players.local.remoteId, "isGunTimeout");
                }, 1000);
            }
        }
        if (user.getCache('s_bind_weapon_slot1') == parseInt(code)) {
            if (!methods.isBlockKeys())
            {
                if (Container.Data.HasLocally(mp.players.local.remoteId, "isGunTimeout"))
                {
                    mp.game.ui.notifications.show("~r~Таймаут 1 сек");
                    return;
                }
                Container.Data.SetLocally(mp.players.local.remoteId, "isGunTimeout", true);
                try {
                    weapons.getMapList().forEach(item => {
                        if (mp.game.invoke(methods.HAS_PED_GOT_WEAPON, mp.players.local.handle, (item[1] / 2), false)) {
                            if (weapons.getGunSlotId(item[0]) === 1)
                                user.setCurrentWeapon(item[0]);
                        }
                    });
                }
                catch (e) {
                    
                }
                setTimeout(function () {
                    Container.Data.ResetLocally(mp.players.local.remoteId, "isGunTimeout");
                }, 1000);
            }
        }
        if (user.getCache('s_bind_weapon_slot2') == parseInt(code)) {
            if (!methods.isBlockKeys())
            {
                if (Container.Data.HasLocally(mp.players.local.remoteId, "isGunTimeout"))
                {
                    mp.game.ui.notifications.show("~r~Таймаут 1 сек");
                    return;
                }
                Container.Data.SetLocally(mp.players.local.remoteId, "isGunTimeout", true);
                try {
                    weapons.getMapList().forEach(item => {
                        if (mp.game.invoke(methods.HAS_PED_GOT_WEAPON, mp.players.local.handle, (item[1] / 2), false)) {
                            if (weapons.getGunSlotId(item[0]) === 2)
                                user.setCurrentWeapon(item[0]);
                        }
                    });
                }
                catch (e) {
                    
                }
                setTimeout(function () {
                    Container.Data.ResetLocally(mp.players.local.remoteId, "isGunTimeout");
                }, 1000);
            }
        }
        if (user.getCache('s_bind_weapon_slot3') == parseInt(code)) {
            if (!methods.isBlockKeys())
            {
                if (Container.Data.HasLocally(mp.players.local.remoteId, "isGunTimeout"))
                {
                    mp.game.ui.notifications.show("~r~Таймаут 1 сек");
                    return;
                }
                Container.Data.SetLocally(mp.players.local.remoteId, "isGunTimeout", true);
                try {
                    weapons.getMapList().forEach(item => {
                        if (mp.game.invoke(methods.HAS_PED_GOT_WEAPON, mp.players.local.handle, (item[1] / 2), false)) {
                            if (weapons.getGunSlotId(item[0]) === 3)
                                user.setCurrentWeapon(item[0]);
                        }
                    });
                }
                catch (e) {
                    
                }
                setTimeout(function () {
                    Container.Data.ResetLocally(mp.players.local.remoteId, "isGunTimeout");
                }, 1000);
            }
        }
        if (user.getCache('s_bind_weapon_slot4') == parseInt(code)) {
            if (!methods.isBlockKeys())
            {
                if (Container.Data.HasLocally(mp.players.local.remoteId, "isGunTimeout"))
                {
                    mp.game.ui.notifications.show("~r~Таймаут 1 сек");
                    return;
                }
                Container.Data.SetLocally(mp.players.local.remoteId, "isGunTimeout", true);
                try {
                    weapons.getMapList().forEach(item => {
                        if (mp.game.invoke(methods.HAS_PED_GOT_WEAPON, mp.players.local.handle, (item[1] / 2), false)) {
                            if (weapons.getGunSlotId(item[0]) === 4)
                                user.setCurrentWeapon(item[0]);
                        }
                    });
                }
                catch (e) {
                    
                }
                setTimeout(function () {
                    Container.Data.ResetLocally(mp.players.local.remoteId, "isGunTimeout");
                }, 1000);
            }
        }
        if (user.getCache('s_bind_weapon_slot5') == parseInt(code)) {
            if (!methods.isBlockKeys())
            {
                if (Container.Data.HasLocally(mp.players.local.remoteId, "isGunTimeout"))
                {
                    mp.game.ui.notifications.show("~r~Таймаут 1 сек");
                    return;
                }
                Container.Data.SetLocally(mp.players.local.remoteId, "isGunTimeout", true);
                try {
                    weapons.getMapList().forEach(item => {
                        if (mp.game.invoke(methods.HAS_PED_GOT_WEAPON, mp.players.local.handle, (item[1] / 2), false)) {
                            if (weapons.getGunSlotId(item[0]) === 5)
                                user.setCurrentWeapon(item[0]);
                        }
                    });
                }
                catch (e) {
                    
                }
                setTimeout(function () {
                    Container.Data.ResetLocally(mp.players.local.remoteId, "isGunTimeout");
                }, 1000);
            }
        }
        if (user.getCache('s_bind_animations_all') == parseInt(code)) {
            if (!methods.isBlockKeys())
                menuList.showAnimationTypeListMenu();
        }
        if (user.getCache('s_bind_animations_0') == parseInt(code)) {
            if (!methods.isBlockKeys())
                menuList.showAnimationListMenu('Анимации действий', enums.animActions);
        }
        if (user.getCache('s_bind_animations_1') == parseInt(code)) {
            if (!methods.isBlockKeys())
                menuList.showAnimationListMenu('Позирующие анимации', enums.animPose);
        }
        if (user.getCache('s_bind_animations_2') == parseInt(code)) {
            if (!methods.isBlockKeys())
                menuList.showAnimationListMenu('Положительные эмоции', enums.animPositive);
        }
        if (user.getCache('s_bind_animations_3') == parseInt(code)) {
            if (!methods.isBlockKeys())
                menuList.showAnimationListMenu('Негативные эмоции', enums.animNegative);
        }
        if (user.getCache('s_bind_animations_4') == parseInt(code)) {
            if (!methods.isBlockKeys())
                menuList.showAnimationListMenu('Танцы', enums.animDance);
        }
        if (user.getCache('s_bind_animations_5') == parseInt(code)) {
            if (!methods.isBlockKeys())
                menuList.showAnimationSyncListMenu();
        }
        if (user.getCache('s_bind_animations_6') == parseInt(code)) {
            if (!methods.isBlockKeys())
                menuList.showAnimationOtherListMenu();
        }
        if (user.getCache('s_bind_lock') == parseInt(code)) {
            if (!methods.isBlockKeys())
                mp.events.callRemote('server:vehicle:lockStatus');
        }
        if (user.getCache('s_bind_engine') == parseInt(code)) {
            if (!methods.isBlockKeys())
                vehicles.engineVehicle();
        }
        if (user.getCache('s_bind_belt') == parseInt(code)) {
            if (!methods.isBlockKeys() && mp.players.local.vehicle) {
                mp.players.local.setConfigFlag(32, false);
                mp.game.ui.notifications.show('~g~Вы пристегнули ремень безопасности');
            }
        }
        if (user.getCache('s_bind_pnv') == parseInt(code)) {
            if (!methods.isBlockKeys()) {
                let drawId = mp.players.local.getPropIndex(0);
                let textureId = mp.players.local.getPropTextureIndex(0);
                if (user.getSex() == 1 && (drawId == 116 || drawId == 118)) {
                    user.playAnimation("anim@mp_helmets@on_foot", "visor_down", 48);
                    setTimeout(function () {
                        user.setProp(0, --drawId, textureId);
                        mp.game.graphics.setNightvision(true);
                    }, 400);
                }
                else if (user.getSex() == 1 && (drawId == 115 || drawId == 117)) {
                    user.playAnimation("anim@mp_helmets@on_foot", "visor_up", 48);
                    setTimeout(function () {
                        user.setProp(0, ++drawId, textureId);
                        mp.game.graphics.setNightvision(false);
                    }, 400)
                }

                if (user.getSex() == 0 && (drawId == 117 || drawId == 119)) {
                    user.playAnimation("anim@mp_helmets@on_foot", "visor_down", 48);
                    setTimeout(function () {
                        user.setProp(0, --drawId, textureId);
                        mp.game.graphics.setNightvision(true);
                    }, 400);
                }
                else if (user.getSex() == 0 && (drawId == 116 || drawId == 118)) {
                    user.playAnimation("anim@mp_helmets@on_foot", "visor_up", 48);
                    setTimeout(function () {
                        user.setProp(0, ++drawId, textureId);
                        mp.game.graphics.setNightvision(false);
                    }, 400);
                }
            }
        }
        if (user.getCache('s_bind_megaphone') == parseInt(code)) {
            if (!methods.isBlockKeys()) {
                let veh = mp.players.local.vehicle;
                if (veh && (veh.getPedInSeat(0) == mp.players.local.handle || veh.getPedInSeat(-1) == mp.players.local.handle)) {
                    if (methods.getVehicleInfo(veh.model).class_name == 'Emergency') {
                        user.setVariable('voice.distance', 8000);
                        voiceRage.enableMic();
                    }
                }
            }
        }
        if (user.getCache('s_bind_seat') == parseInt(code)) {

            if (mp.players.local.isInAnyVehicle(true)) {
                return;
            }

            if (Container.Data.HasLocally(mp.players.local.remoteId, "isSeatTimeout"))
            {
                mp.game.ui.notifications.show("~r~Таймаут на действие 2 секунды");
                return;
            }
            Container.Data.SetLocally(mp.players.local.remoteId, "isSeatTimeout", true);
            if (user.getClipset() === 'move_ped_crouched') {
                user.playAnimation("amb@medic@standing@tendtodead@exit", "exit", 8);
                await methods.sleep(200);
                await methods.sleep(mp.players.local.getAnimTotalTime("amb@medic@standing@tendtodead@enter", "enter") - 200);
                user.setClipset(user.getCache('clipset'));
            }
            else {
                user.playAnimation("amb@medic@standing@tendtodead@enter", "enter", 8);
                await methods.sleep(200);
                await methods.sleep(mp.players.local.getAnimTotalTime("amb@medic@standing@tendtodead@exit", "exit") - 200);
                user.setClipset('move_ped_crouched');
            }
            setTimeout(function () {
                Container.Data.ResetLocally(mp.players.local.remoteId, "isSeatTimeout");
            }, 2000);
        }
        if (user.getCache('s_bind_firemod') == parseInt(code)) {
            mp.events.call('client:changeFireMod');
        }
        if (user.getCache('s_bind_fingerpoint') == parseInt(code)) {
            if (!methods.isBlockKeys())
                pSync.pointing.start();
        }
        if (user.getCache('s_bind_helicam') == parseInt(code)) {
            if (!methods.isBlockKeys())
                heliCam.keyPressToggleHeliCam();
        }
        if (user.getCache('s_bind_helicam_vision') == parseInt(code)) {
            if (!methods.isBlockKeys())
                heliCam.keyPressToggleVision();
        }
        if (user.getCache('s_bind_helicam_lock') == parseInt(code)) {
            if (!methods.isBlockKeys())
                heliCam.keyPressToggleLockVehicle();
        }
        if (user.getCache('s_bind_helilight') == parseInt(code)) {
            if (!methods.isBlockKeys())
                heliCam.keyPressToggleSpotLight();
        }
        if (bind.isChange)
            bind.bindNewKey(parseInt(code));
    });

    mp.keys.bind(parseInt(code), false, function() {
        if (!user.isLogin())
            return;

        if (mp.gui.chat.enabled)
            return;

        if (user.getCache('s_bind_megaphone') == parseInt(code)) {
            if (!methods.isBlockKeys()) {
                if (mp.players.local.getVariable('voice.distance') > 25)
                    user.setVariable('voice.distance', 25);
                voiceRage.disableMic();
            }
        }
        if (user.getCache('s_bind_voice') == parseInt(code)) {
            voiceRage.disableMic();
        }
        if (user.getCache('s_bind_voice_radio') == parseInt(code)) {
            voiceRage.disableRadioMic();
        }
        if (user.getCache('s_bind_fingerpoint') == parseInt(code)) {
            pSync.pointing.stop();
        }
    });
}

export default bind;