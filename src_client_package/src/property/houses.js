import user from '../user';
import Container from '../modules/data';
import methods from '../modules/methods';
import enums from '../enums';

let houses = {};

houses.enter = function (id) {
    mp.events.callRemote('server:houses:enter', id);
};

houses.exit = function (x, y, z, rot) {
    user.setVirtualWorld(0);
    user.teleport(x, y, z + 1, rot);
};

houses.getData = async function(id) {
    return await Container.Data.GetAll(enums.offsets.house + methods.parseInt(id));
};

houses.buy = function (id) {
    if (user.getCacheData().get('house_id') > 0) {
        mp.game.ui.notifications.show('~r~У Вас уже есть дом');
        return false;
    }
    mp.events.callRemote('server:houses:buy', id);
    return true;
};

houses.updatePin = function (id, pin) {
    mp.events.callRemote('server:houses:updatePin', id, pin);
};

houses.lockStatus = function (id, lockStatus) {
    mp.events.callRemote('server:houses:lockStatus', id, lockStatus);
};

export default houses;