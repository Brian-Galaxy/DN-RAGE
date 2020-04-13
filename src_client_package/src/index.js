import './modules/data';
import './modules/events';

import './manager/vSync';
import './manager/pSync';
import './manager/wpSync';
import './manager/shoot';
import './manager/heliCam';
import './manager/attachWeapons';
import './manager/cameraRotator';
import './manager/racer';

import './betternotifs';
//import './voice';

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
import weather from "./manager/weather";
import hosp from "./manager/hosp";
import jail from "./manager/jail";

import wheel from "./casino/wheel";

import user from "./user";
import enums from "./enums";
import phone from "./phone";
import chat from "./chat";
import voiceRage from "./voiceRage";

import "./antiCheat";

try {

    mp.gui.chat.show(false);
    mp.gui.chat.activate(false);
    for (let i = 0; i < 50; i++)
        mp.gui.chat.push('');

    chat.show(false);
    chat.activate(false);

    /*enums.customIpl.forEach(item => {
        object.createIpl(item[0], new mp.Vector3(item[1], item[2], item[3]), item[4]);
    });*/

    mp.game.ped.setAiMeleeWeaponDamageModifier(1);
    mp.game.player.setMeleeWeaponDefenseModifier(1);
    mp.game.player.setWeaponDefenseModifier(1);
    mp.game.player.setVehicleDefenseModifier(.1);
    mp.game.player.setVehicleDamageModifier(.1);

    mp.gui.cursor.show(true, true);

    ui.create();

    timer.createInterval('hosp.timer', hosp.timer, 1000);
    timer.createInterval('jail.timer', jail.timer, 1000);
    timer.createInterval('voiceRage.timer', voiceRage.timer, 5);

    user.init();
    try {
        methods.requestIpls();
    }
    catch (e) {
        methods.saveFile('errorIpl', e);
    }
    setTimeout(checkpoint.checkPosition, 10000);

    enums.loadCloth();
    business.loadScaleform();

    object.load();
    npc.loadAll();
    skill.loadAll();

    wheel.loadAll();

    attach.init();
    attachItems.registerAttaches();

    timer.loadAll();
    vBreakLight.timer();

    weather.secSyncTimer();

    timer.createInterval('phone.findNetworkTimer', phone.findNetworkTimer, 1000);

    if(!mp.game.streaming.isIplActive("int_magazel1_milo_"))
    {
        user.showCustomNotify('Возможно некоторые интерьеры у вас не подгрузятся, поэтому перезайдите, фикс будет в следующей версии мультиплеера', 0, 1000);
        setTimeout(function () {
            mp.game.invoke("0xD7C10C4A637992C9"); // _LOAD_SP_DLC_MAPS
            mp.game.invoke("0x0888C3502DBBEEF5"); // _LOAD_MP_DLC_MAPS

            //mp.game.invoke("0xD7C10C4A637992C9"); mp.game.invoke("0x0888C3502DBBEEF5"); // _LOAD_MP_DLC_MAPS
        }, 5000);
    }

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