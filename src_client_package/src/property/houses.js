import user from '../user';
import Container from '../modules/data';
import methods from '../modules/methods';

let houses = {};

houses.enter = function (id) {
    mp.events.callRemote('server:houses:enter', id);
};

houses.exit = function (x, y, z) {
    user.setVirtualWorld(0);
    user.teleport(x, y, z);
};

houses.getData = async function(id) {
    return await Container.Data.GetAll(100000 + methods.parseInt(id));
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