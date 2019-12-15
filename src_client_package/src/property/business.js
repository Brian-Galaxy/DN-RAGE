import Container from '../modules/data';
import methods from '../modules/methods';

let business = {};

business.typeList = [
    "Банки", //0
    "Автомастерские", //1
    "Пункты аренды", //2
    "Заправочные станции", //3
    "Парикмахерские", //4
    "Тату салоны", //5
    "Развлечения", //6
    "Компании", //7
    "Остальное", //8
    "Магазины", //9
    "Магазины продуктов", //10
    "Магазины одежды", //11
    "Магазины оружия" //12
];

business.interiorList = [
    "ex_dt1_02_office_02b",
    "ex_dt1_02_office_02c",
    "ex_dt1_02_office_02a",
    "ex_dt1_02_office_01a",
    "ex_dt1_02_office_01b",
    "ex_dt1_02_office_01c",
    "ex_dt1_02_office_03a",
    "ex_dt1_02_office_03b",
    "ex_dt1_02_office_03c"
];

business.BusinessOfficePos = new mp.Vector3(-140.7121, -617.3683, 167.8204);
business.BusinessMotorPos = new mp.Vector3(-138.6593, -592.6267, 166.0002);
business.BusinessStreetPos = new mp.Vector3(-116.8427, -604.7336, 35.28074);
business.BusinessGaragePos = new mp.Vector3(-155.6696, -577.3766, 31.42448);
business.BusinessRoofPos = new mp.Vector3(-136.6686, -596.3055, 205.9157);
business.BusinessBotPos = new mp.Vector3(-139.2922, -631.5964, 167.8204);

business.addMoney = function(id, money) {
    mp.events.callRemote('server:business:addMoney', id, money);
};

business.removeMoney = function(id, money) {
    mp.events.callRemote('server:business:removeMoney', id, money);
};

business.setMoney = function(id, money) {
    mp.events.callRemote('server:business:setMoney', id, money);
};

business.getMoney = async function(id) {
    try {
        return methods.parseInt(await Container.Data.Get(-20000 + id, 'bank'));
    }
    catch (e) {
        methods.debug(e);
        return 0;
    }
};

business.getPrice = async function(id) {
    try {
        return methods.parseInt(await Container.Data.Get(-20000 + id, 'price_product'));
    }
    catch (e) {
        methods.debug(e);
        return 0;
    }
};

business.setPrice = function(id, price) {
    Container.Data.Set(-20000 + id, 'price_product', methods.parseInt(price));
};

business.setName = function(id, name) {
    name = methods.removeQuotes(name);
    name = methods.removeQuotes2(name);
    Container.Data.Set(-20000 + id, 'name', name);
};

business.getData = async function(id) {
    return await Container.Data.GetAll(-20000 + methods.parseInt(id));
};

export default business;