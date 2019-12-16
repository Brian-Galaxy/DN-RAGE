import Container from './modules/data';
import methods from "./modules/methods";

let coffer = {};
let containerId = 99999;

coffer.addMoney = function(id, money) {
    mp.events.callRemote('server:coffer:addMoney', id, money);
};

coffer.removeMoney = function(id, money) {
    mp.events.callRemote('server:coffer:removeMoney', id, money);
};

coffer.setMoney = function(id, money) {
    mp.events.callRemote('server:coffer:setMoney', id, money);
};

coffer.getMoney = async function(id = 1) {
    return methods.parseFloat(await Container.Data.Get(containerId + id, 'cofferMoney'));
};

coffer.getAllData = async function(id = 1) {
    return await Container.Data.GetAll(containerId + id);
};

coffer.getScore = async function(id = 1) {
    return methods.parseInt(await Container.Data.Get(containerId + id, 'cofferScore'));
};

coffer.getTaxProperty = async function(id = 1) {
    return methods.parseInt(await Container.Data.Get(containerId + id, 'cofferTaxProperty'));
};

coffer.getTaxPayDay = async function(id = 1) {
    return methods.parseInt(await Container.Data.Get(containerId + id, 'cofferTaxPayDay'));
};

coffer.getTaxBusiness = async function(id = 1) {
    return methods.parseInt(await Container.Data.Get(containerId + id, 'cofferTaxBusiness'));
};

coffer.getTaxIntermediate = async function(id = 1) {
    return methods.parseInt(await Container.Data.Get(containerId + id, 'cofferTaxIntermediate'));
};

coffer.getBenefit = async function(id = 1) {
    return methods.parseFloat(await Container.Data.Get(containerId + id, 'cofferBenefit'));
};

export default coffer;