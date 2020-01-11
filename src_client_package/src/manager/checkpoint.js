import methods from '../modules/methods';
import user from '../user';
import UIMenu from '../modules/menu';

let itemList = [];
let entityList = new Map();

let checkpoint = {};

checkpoint.checkPosition = function() {

    let playerPos = mp.players.local.position;
    //methods.debug('Execute: checkpoint.checkPosition');
    itemList.forEach((item, idx) => {
        try {
            if (methods.distanceToPos(playerPos, new mp.Vector3(item.x, item.y, item.z)) <= item.scale + 0.4) {
                if (!entityList.has(idx)) {
                    entityList.set(idx, true);
                    mp.events.callRemote('client:enterStaticCheckpoint', item.id);
                }
            }
            else {
                if (entityList.has(idx)) {
                    entityList.delete(idx);
                    UIMenu.Menu.HideMenu();
                    mp.events.callRemote('client:exitStaticCheckpoint', item.id);
                }
            }
        } catch (e) {
            methods.debug('Exception: checkpoint.checkPosition.forEach IDX:' + idx);
            methods.debug(e);
        }
    });

    if (itemList.length < 1000) { //TODO
        checkpoint.fixCheckpointList();
        setTimeout(checkpoint.checkPosition, 5000);
    }
    else
        setTimeout(checkpoint.checkPosition, 1000);
};

checkpoint.updateCheckpointList = function(data) {
    try {
        methods.debug('Execute: checkpoint.updateCheckpointList');
        itemList = itemList.concat(data);
    } catch (e) {
        methods.debug('Exception: checkpoint.updateCheckpointList');
        methods.debug(e);
        //TODO очистить выполнить еще раз
    }
};

checkpoint.fixCheckpointList = function() {
    try {
        methods.debug('Execute: checkpoint.fixCheckpointList');
        itemList = [];
        mp.events.callRemote('server:fixCheckpointList');
        //mp.events.callRemote('server:updateGangZoneList');
    } catch (e) {
        methods.debug('Exception: checkpoint.fixCheckpointList');
        methods.debug(e);
    }
};

mp.events.add('render', () => {
    let playerPos = mp.players.local.position;

    if (itemList.length > 0) {
        itemList.forEach(function (item, idx) {
            if (methods.distanceToPos(playerPos, new mp.Vector3(item.x, item.y, item.z)) <= 100) {
                mp.game.graphics.drawMarker(
                    1,
                    item.x, item.y, item.z,
                    0, 0, 0,
                    0, 0, 0,
                    item.scale, item.scale, item.height,
                    item.color[0], item.color[1], item.color[2], item.color[3],
                    false, false, 2,
                    false, "", "",false
                );
            }
        });
    }

});

export default checkpoint;