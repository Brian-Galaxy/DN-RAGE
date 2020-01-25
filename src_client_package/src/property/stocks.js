import user from '../user';
import Container from '../modules/data';
import methods from '../modules/methods';
import enums from '../enums';

let stocks = {};

stocks.enter = function (id) {
    mp.events.callRemote('server:stocks:enter', id);
};

stocks.enterv = function (id) {
    mp.events.callRemote('server:stocks:enterv', id);
};

stocks.exit = function (x, y, z, rot) {
    user.setVirtualWorld(0);
    user.teleport(x, y, z + 1, rot);
};

stocks.exitv = function (x, y, z, rot) {
    user.setVirtualWorld(0);
    user.setVirtualWorldVeh(0);
    user.teleportVeh(x, y, z, rot);
};

stocks.getData = async function(id) {
    return await Container.Data.GetAll(enums.offsets.stock + methods.parseInt(id));
};

stocks.buy = function (id) {
    if (user.getCacheData().get('stock_id') > 0) {
        mp.game.ui.notifications.show('~r~У Вас уже есть дом');
        return false;
    }
    mp.events.callRemote('server:stocks:buy', id);
    return true;
};

stocks.updatePin = function (id, pin) {
    mp.events.callRemote('server:stocks:updatePin', id, pin);
};

stocks.updatePin1 = function (id, pin) {
    mp.events.callRemote('server:stocks:updatePin1', id, pin);
};

stocks.updatePin2 = function (id, pin) {
    mp.events.callRemote('server:stocks:updatePin2', id, pin);
};

stocks.updatePin3 = function (id, pin) {
    mp.events.callRemote('server:stocks:updatePin3', id, pin);
};

export default stocks;