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

dispatcher.sendLocalPos = function (title, desc, pos, fractionId = 0, withCoord = true) {
    if (fractionId === 0)
        return;
    mp.events.callRemote("server:dispatcher:sendLocalPos", title, desc, pos.x, pos.y, pos.z, fractionId, withCoord);
};

dispatcher.codeDep = function (code, name, withCoord = true) {
    if (code === 0 || code === 2 || code === 3)
        dispatcher.send(`Код ${code}`, `${name} - запрашивает поддержку по коду ${code}`, withCoord);
    else if (code === 1)
        dispatcher.send(`Код ${code}`, `${name} - информацию принял`, withCoord);
    else if (code === 4)
        dispatcher.send(`Код ${code}`, `${name} - помощь не требуется/все спокойно`, withCoord);
    else if (code === 5)
        dispatcher.send(`Код ${code}`, `${name} - просит держаться подальше`, withCoord);
    else if (code === 6)
        dispatcher.send(`Код ${code}`, `${name} - задерживается на месте`, withCoord);
    else if (code === 7)
        dispatcher.send(`Код ${code}`, `${name} - вышел на перерыв`, withCoord);
    else if (code === 8)
        dispatcher.send(`Код ${code}`, `${name} - необходимы сотрудники пожарного департамента`, withCoord);
    else if (code === 9)
        dispatcher.send(`Код ${code}`, `${name} - необходимы сотрудники EMS`, withCoord);
    else if (code === 77)
        dispatcher.send(`Код ${code}`, `${name} - осторожно, возможна засада`, withCoord);
    else if (code === 99)
        dispatcher.send(`Код ${code}`, `${name} - докладывает о черезвычайной ситуации`, withCoord);
    else if (code === 100)
        dispatcher.send(`Код ${code}`, `${name} - находится в состоянии перехвата`, withCoord);
    else
        dispatcher.send(`Код ${code}`, `${name} - запрашивает поддержку`, withCoord);
};

dispatcher.codeLocal = function (code, name, withCoord = true) {
    if (code === 0 || code === 2 || code === 3)
        dispatcher.sendLocal(`Код ${code}`, `${name} - запрашивает поддержку по коду ${code}`, withCoord);
    else if (code === 1)
        dispatcher.sendLocal(`Код ${code}`, `${name} - информацию принял`, withCoord);
    else if (code === 4)
        dispatcher.sendLocal(`Код ${code}`, `${name} - помощь не требуется/все спокойно`, withCoord);
    else if (code === 5)
        dispatcher.sendLocal(`Код ${code}`, `${name} - просит держаться подальше`, withCoord);
    else if (code === 6)
        dispatcher.sendLocal(`Код ${code}`, `${name} - задерживается на месте`, withCoord);
    else if (code === 7)
        dispatcher.sendLocal(`Код ${code}`, `${name} - вышел на перерыв`, withCoord);
    else if (code === 8)
        dispatcher.sendLocal(`Код ${code}`, `${name} - необходимы сотрудники пожарного департамента`, withCoord);
    else if (code === 9)
        dispatcher.sendLocal(`Код ${code}`, `${name} - необходимы сотрудники EMS`, withCoord);
    else if (code === 77)
        dispatcher.sendLocal(`Код ${code}`, `${name} - осторожно, возможна засада`, withCoord);
    else if (code === 99)
        dispatcher.sendLocal(`Код ${code}`, `${name} - докладывает о черезвычайной ситуации`, withCoord);
    else if (code === 100)
        dispatcher.sendLocal(`Код ${code}`, `${name} - находится в состоянии перехвата`, withCoord);
    else
        dispatcher.sendLocal(`Код ${code}`, `${name} - запрашивает поддержку`, withCoord);
};

dispatcher.addDispatcherList = function (title, desc, time, x, y, z, withCoord) {
    let getStreet = mp.game.pathfind.getStreetNameAtCoord(x, y, z, 0, 0);
    let street1 = mp.game.ui.getLabelText(mp.game.zone.getNameOfZone(x, y, z));
    let street2 = mp.game.ui.getStreetNameFromHashKey(getStreet.streetName);

    itemList.push({title: title, desc: desc, street1: street1, street2: street2, time: time, x: x, y: y, z: z,  withCoord: withCoord});

    let subLabel = `\n~y~Район:~s~ ${street1}\n~y~Улица:~s~ ${street2}`;

    user.sendPhoneNotify(`Диспетчер [${time}]`, title, desc + subLabel, "CHAR_CALL911");
};

dispatcher.addDispatcherTaxiList = function (count, title, desc, time, price, x, y, z) {
    let getStreet = mp.game.pathfind.getStreetNameAtCoord(x, y, z, 0, 0);
    let street1 = mp.game.ui.getLabelText(mp.game.zone.getNameOfZone(x, y, z));
    let street2 = mp.game.ui.getStreetNameFromHashKey(getStreet.streetName);

    itemTaxiList.push({count: count, title: title, desc: desc, street1: street1, street2: street2, time: time, price: price, x: x, y: y, z: z});

    let icon = user.getCache('job') == 'taxi1' ? 'CHAR_TAXI' : 'CHAR_TAXI_LIZ';

    user.sendPhoneNotify(`Диспетчер [${time}]`, title, desc + `\n~y~Район:~s~ ${street1}\n~y~Улица:~s~ ${street2}`, icon);
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