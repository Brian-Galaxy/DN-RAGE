import './modules/data';
import './modules/events';
import './manager/vSync';
import './betternotifs';
import './voice';
import './manager/wcSync';

import business from "./property/business";

import ui from "./modules/ui";
import methods from "./modules/methods";

import checkpoint from "./manager/checkpoint";

import user from "./user";
import enums from "./enums";
import weapons from "./weapons";

try {
    mp.gui.chat.show(false);
    mp.gui.chat.activate(false);

    /*enums.customIpl.forEach(item => {
        object.createIpl(item[0], new mp.Vector3(item[1], item[2], item[3]), item[4]);
    });*/

    mp.game.ped.setAiMeleeWeaponDamageModifier(1.5);
    mp.game.player.setMeleeWeaponDefenseModifier(1.5);
    mp.game.player.setWeaponDefenseModifier(1.5);

    mp.gui.cursor.show(true, true);

    try {
        user.init();
        methods.requestIpls();
        checkpoint.checkPosition();
        enums.loadCloth();
        business.loadScaleform();
    }
    catch (e) {
        methods.debug(e);
    }

    mp.events.add('guiReady', () => {
        ui.create();
    });
}
catch (e) {
}

/*mp.events.add('guiReady', () => {
    mp.events.add('browserDomReady', (browser) => {
        //mp.events.callRemote("playerJoined");
    });
});*/