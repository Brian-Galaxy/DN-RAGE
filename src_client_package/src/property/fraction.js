import Container from '../modules/data';
import methods from '../modules/methods';
import enums from '../enums';

let fraction = {};

fraction.addMoney = function(id, money, itemName = 'Операция со счетом') {
    mp.events.callRemote('server:fraction:addMoney', id, money, itemName);
};

fraction.removeMoney = function(id, money, itemName = 'Операция со счетом') {
    mp.events.callRemote('server:fraction:removeMoney', id, money, itemName);
};

fraction.setMoney = function(id, money) {
    mp.events.callRemote('server:fraction:setMoney', id, money);
};

fraction.getMoney = async function(id) {
    try {
        return methods.parseFloat(await Container.Data.Get(enums.offsets.fraction + id, 'money'));
    }
    catch (e) {
        methods.debug(e);
        return 0;
    }
};

fraction.getData = async function(id) {
    return await Container.Data.GetAll(enums.offsets.fraction + methods.parseInt(id));
};

export default fraction;