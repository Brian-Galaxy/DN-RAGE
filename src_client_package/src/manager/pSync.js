import methods from "../modules/methods";

let pSync = exports;

mp.events.add('entityStreamIn', (entity) => {
    if (entity.type === 'player') {
        let remotePlayer = entity;
        if (mp.players.exists(remotePlayer)) {
            for(let i = 0; i < 8; i++) {
                try {
                    let propType = remotePlayer.getVariable('propType' + i);
                    let propColor = remotePlayer.getVariable('propColor' + i);

                    if (propType >= 0)
                        remotePlayer.setPropIndex(i, propType, propColor, true);
                    else
                        remotePlayer.clearProp(i);
                }
                catch (e) {
                    methods.debug(e);
                }
            }

            try {
                let topsDraw = remotePlayer.getVariable('topsDraw');
                let topsColor = remotePlayer.getVariable('topsColor');
                remotePlayer.setComponentVariation(11, topsDraw, topsColor, 2);
            }
            catch (e) {
                methods.debug(e);
            }
        }
    }
});

mp.events.add('client:syncComponentVariation', (playerId, component, drawableId, textureId) => {
    try {
        let remotePlayer = mp.players.atRemoteId(playerId);
        if (remotePlayer && mp.players.exists(remotePlayer)) {
            remotePlayer.setComponentVariation(component, drawableId, textureId, 2);
        }
    }
    catch (e) {
        methods.debug('Exception: events:client:syncComponentVariation');
        methods.debug(e);
    }
});