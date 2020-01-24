import './modules/data';
import './modules/events';

import './manager/vSync';
import './manager/pSync';
import './manager/wpSync';
import './manager/shoot';
import './manager/attachWeapons';

import './betternotifs';
import './voice';

import business from "./property/business";

import ui from "./modules/ui";
import methods from "./modules/methods";

import checkpoint from "./manager/checkpoint";
import timer from "./manager/timer";
import vBreakLight from "./manager/vBreakLight";
import object from "./manager/object";
import npc from "./manager/npc";
import skill from "./manager/skill";
import attach from "./manager/attach";
import attachItems from "./manager/attachItems";

import user from "./user";
import enums from "./enums";
import weather from "./manager/weather";
import hosp from "./manager/hosp";
import jail from "./manager/jail";

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

    ui.create();

    hosp.timer();
    jail.timer();

    user.init();
    methods.requestIpls();
    setTimeout(checkpoint.checkPosition, 10000);
    enums.loadCloth();
    business.loadScaleform();

    object.load();
    npc.loadAll();
    skill.loadAll();

    attach.init();
    attachItems.registerAttaches();

    timer.loadAll();
    vBreakLight.timer();

    weather.secSyncTimer();

    /*mp.events.add('guiReady', () => {
        ui.create();
    });*/
}
catch (e) {
    methods.debug('ERROR INIT CLIENT', e);
    methods.debug('ERROR INIT CLIENT', e);
    methods.debug(e);
    methods.debug('ERROR INIT CLIENT', e);
    methods.debug('ERROR INIT CLIENT', e);
}

/*mp.events.add('guiReady', () => {
    mp.events.add('browserDomReady', (browser) => {
        //mp.events.callRemote("playerJoined");
    });
});*/