import Container from '../modules/data';
import methods from '../modules/methods';
import user from '../user';
import inventory from "../inventory";
import ui from "../modules/ui";
import vehicles from "../property/vehicles";
import phone from "../phone";
import voice from "../voice";

let bind = {};

const keyCodes = {
    0: 'Unk',
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
    89: 'U',
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
    186: 'Semi-colon / ñ',
    187: '=',
    188: 'Comma',
    189: '_',
    190: 'Period',
    191: 'Forward Slash',
    192: 'Ё',
    193: '?, / or °',
    /*194: 'Numpad period',
    219: 'Open bracket',*/
    220: '\\',
    /*221: 'Close bracket / å',
    222: 'Single quote / ø / ä',*/
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
    return keyCodes[methods.parseInt(key)];
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
    mp.keys.bind(parseInt(code), true, function() {

        if (!user.isLogin())
            return;

        if (user.getCache('s_bind_inv') == parseInt(code)) {
            if (!methods.isBlockKeys()) {
                ui.callCef('inventory', '{"type": "showOrHide"}')
            }
        }
        if (user.getCache('s_bind_inv_world') == parseInt(code)) {
            inventory.getItemList(0, 0);
        }
        if (user.getCache('s_bind_phone') == parseInt(code)) {
            if (!methods.isBlockKeys())
                phone.showOrHide();
        }
        if (user.getCache('s_bind_lock') == parseInt(code)) {
            if (!methods.isBlockKeys())
                mp.events.callRemote('onKeyPress:L');
        }
        if (user.getCache('s_bind_engine') == parseInt(code)) {
            if (!methods.isBlockKeys())
                vehicles.engineVehicle();
        }
        if (user.getCache('s_bind_pnv') == parseInt(code)) {
            if (!methods.isBlockKeys()) {
                let drawId = mp.players.local.getPropIndex(0);
                let textureId = mp.players.local.getPropTextureIndex(0);
                if (user.getSex() == 1 && (drawId == 116 || drawId == 118)) {
                    user.setProp(0, --drawId, textureId);
                    mp.game.graphics.setNightvision(true);
                }
                else if (user.getSex() == 1 && (drawId == 115 || drawId == 117)) {
                    user.setProp(0, ++drawId, textureId);
                    mp.game.graphics.setNightvision(false);
                }

                if (user.getSex() == 0 && (drawId == 117 || drawId == 119)) {
                    user.setProp(0, --drawId, textureId);
                    mp.game.graphics.setNightvision(true);
                }
                else if (user.getSex() == 0 && (drawId == 116 || drawId == 118)) {
                    user.setProp(0, ++drawId, textureId);
                    mp.game.graphics.setNightvision(false);
                }
            }
        }
        if (user.getCache('s_bind_megaphone') == parseInt(code)) {
            if (!methods.isBlockKeys()) {
                let veh = mp.players.local.vehicle;
                if (veh && veh.getPedInSeat(0) == mp.players.local.handle) {
                    if (methods.getVehicleInfo(veh.model).class_name == 'Emergency') {
                        user.setVariable('voice.distance', 7000);
                        voice.enableMicrophone();
                    }
                }
            }
        }
        if (user.getCache('s_bind_voice') == parseInt(code)) {
            voice.enableMicrophone();
        }
        if (user.getCache('s_bind_firemod') == parseInt(code)) {
            mp.events.call('client:changeFireMod');
        }
        if (bind.isChange)
            bind.bindNewKey(parseInt(code));
    });

    mp.keys.bind(parseInt(code), false, function() {
        if (!user.isLogin())
            return;
        if (user.getCache('s_bind_megaphone') == parseInt(code)) {
            if (!methods.isBlockKeys()) {
                user.setVariable('voice.distance', 25);
                voice.disableMicrophone();
            }
        }
        if (user.getCache('s_bind_voice') == parseInt(code)) {
            voice.disableMicrophone();
        }
    });
}

export default bind;