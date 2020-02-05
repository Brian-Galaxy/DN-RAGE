import user from '../user';
import Container from '../modules/data';
import methods from '../modules/methods';
import enums from '../enums';

let stocks = {};

stocks.boxList = [
    ['Малая коробка', 1165008631, 400000, 0, true, 10000, 'Стандарт'],
    ['Средняя коробка', 1875981008, 600000, 0, true, 20000, 'Стандарт'],
    ['Большая коробка', -1322183878, 800000, 0, true, 30000, 'Стандарт'],

    ['Малая коробка1', 1165008631, 400000, -0.12, false, 10000, 'Стандарт'],
    ['Средняя коробка1', 1875981008, 600000, -0.12, false, 20000, 'Стандарт'],
    ['Большая коробка1', -1322183878, 800000, -0.12, false, 30000, 'Стандарт'],

    ['Малая коробка2', 1165008631, 400000, -0.12, false, 10000, 'Стандарт'],
    ['Средняя коробка2', 1875981008, 600000, -0.12, false, 20000, 'Стандарт'],
    ['Большая коробка2', -1322183878, 800000, -0.12, false, 30000, 'Стандарт'],

    ['Малая коробка3', 1165008631, 400000, -0.12, false, 10000, 'Стандарт'],
    ['Средняя коробка3', 1875981008, 600000, -0.12, false, 20000, 'Стандарт'],
    ['Большая коробка3', -1322183878, 800000, -0.12, false, 30000, 'Стандарт'],
];

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
        mp.game.ui.notifications.show('~r~У Вас уже есть склад');
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

stocks.upgradeAdd = function (id, slot, box) {
    mp.events.callRemote('server:stocks:upgradeAdd', id, slot, box);
};

export default stocks;