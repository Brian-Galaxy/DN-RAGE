import user from '../user';
import methods from '../modules/methods';

let dispatcher = {};

let itemList = [];
let itemTaxiList = [];

dispatcher.send = function (title, desc, withCoord = true) {
    dispatcher.sendPos(title, desc, mp.players.local.position, withCoord);
};

dispatcher.sendPos = function (title, desc, pos, withCoord = true) {
    mp.events.callRemote("server:dispatcher:sendPos", title, desc, pos.x, pos.y, pos.z, withCoord);
};

dispatcher.sendLocal = function (title, desc, withCoord = true) {
    dispatcher.sendLocalPos(title, desc, mp.players.local.position, user.getCache('fraction_id'), withCoord);
};

dispatcher.sendLocalPos = function (title, desc, pos, fractionId, withCoord = true) {
    mp.events.callRemote("server:dispatcher:sendLocalPos", title, desc, pos.x, pos.y, pos.z, fractionId, withCoord);
};

dispatcher.addDispatcherList = function (title, desc, time, x, y, z, withCoord) {
    let getStreet = mp.game.pathfind.getStreetNameAtCoord(x, y, z, 0, 0);
    let street1 = mp.game.ui.getLabelText(mp.game.zone.getNameOfZone(x, y, z));
    let street2 = mp.game.ui.getStreetNameFromHashKey(getStreet.streetName);

    itemList.push({title: title, desc: desc, street1: street1, street2: street2, time: time, x: x, y: y, z: z,  withCoord: withCoord});

    let subLabel = `\n~y~Район:~s~ ${street1}\n~y~Улица:~s~ ${street2}`;
    mp.game.ui.notifications.showWithPicture(title, `Диспетчер [${time}]`, desc + subLabel, "CHAR_CALL911", 1);
};

dispatcher.addDispatcherTaxiList = function (count, title, desc, time, price, x, y, z) {
    let getStreet = mp.game.pathfind.getStreetNameAtCoord(x, y, z, 0, 0);
    let street1 = mp.game.ui.getLabelText(mp.game.zone.getNameOfZone(x, y, z));
    let street2 = mp.game.ui.getStreetNameFromHashKey(getStreet.streetName);

    itemTaxiList.push({count: count, title: title, desc: desc, street1: street1, street2: street2, time: time, price: price, x: x, y: y, z: z});

    let icon = user.getCache('job') == 'taxi1' ? 'CHAR_TAXI' : 'CHAR_TAXI_LIZ';
    mp.game.ui.notifications.showWithPicture(title, `Диспетчер [${time}]`, desc + `\n~y~Район:~s~ ${street1}\n~y~Улица:~s~ ${street2}`, icon, 1);
};

dispatcher.sendNotification = function (title, desc, desc2, desc3) {
    methods.notifyWithPictureToFraction(title, "Диспетчер", `${desc}\n${desc2}\n${desc3}`, "CHAR_CALL911", 2, 1);
    methods.notifyWithPictureToFraction(title, "Диспетчер", `${desc}\n${desc2}\n${desc3}`, "CHAR_CALL911", 3, 1);
    methods.notifyWithPictureToFraction(title, "Диспетчер", `${desc}\n${desc2}\n${desc3}`, "CHAR_CALL911", 7, 1);
    methods.notifyWithPictureToFraction(title, "Диспетчер", `${desc}\n${desc2}\n${desc3}`, "CHAR_CALL911", 16, 1);
};

dispatcher.sendNotificationFraction = function (title, desc, desc2, desc3, fractionId) {
    methods.notifyWithPictureToFraction(title, "Диспетчер", `${desc}\n${desc2}\n${desc3}`, "CHAR_CALL911", fractionId, 1);
};

dispatcher.getItemList = function () {
    return itemList.reverse();
};

dispatcher.getItemTaxiList = function () {
    return itemTaxiList.reverse();
};

export default dispatcher;