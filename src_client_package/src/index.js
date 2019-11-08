//import enums from './enums';

try {
    mp.gui.chat.show(false); //Disables default RageMP Chat

    //TODO Сделать нормальное шифрование
    for (let i = 0; i < weapons.hashesMap.length; i++)
        weapons.hashesMap[i][1] *= 2;
/*
    enums.customIpl.forEach(item => {
        object.createIpl(item[0], new mp.Vector3(item[1], item[2], item[3]), item[4]);
    });*/

    mp.game.ped.setAiMeleeWeaponDamageModifier(1.5);
    mp.game.player.setMeleeWeaponDefenseModifier(1.5);
    mp.game.player.setWeaponDefenseModifier(1.5);

}
catch (e) {
    /*methods.debug('Exception: index');
    methods.debug(e);*/
}

/*mp.events.add('guiReady', () => {
    mp.events.add('browserDomReady', (browser) => {
        //mp.events.callRemote("playerJoined");
    });
});*/