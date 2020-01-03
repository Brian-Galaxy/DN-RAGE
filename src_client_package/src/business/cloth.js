import methods from '../modules/methods';
import enums from '../enums';

let cloth = {};

var clothM = [];
var clothF = [];
var propM = [];
var propF = [];
var shopList = [];
var initCloth = false;

cloth.initCloth = function() {
    clothM = enums.get('clothM');
    clothF = enums.get('clothF');
    propM = enums.get('propM');
    propF = enums.get('propF');
    shopList = enums.get('shopList');
    methods.debug('Execute: cloth.initCloth');
};

let checkInit = function(){
    if(!initCloth){
        cloth.initCloth();
        initCloth = !initCloth;
    }
};

cloth.getShopIdInRadius = function(pos, radius, id){
    checkInit();
    for (var i = 0; i < shopList.length; i++){
        if(shopList[i][2] != id) continue;
        if(methods.distanceToPos(pos, new mp.Vector3(shopList[i][3], shopList[i][4], shopList[i][5])) < radius)
            return ~~shopList[i][1];
    }
    return -1;
};

cloth.findNearest = function (pos) {
    checkInit();
    var shopPosPrew = new mp.Vector3(shopList[0][3], shopList[0][4], shopList[0][5]);
    for (var i = 0; i < shopList.length; i++){
        if(shopList[i][2] != 0) continue;
        var shopPos = new mp.Vector3(shopList[i][3], shopList[i][4], shopList[i][5]);
        if (methods.distanceToPos(shopPos, pos) < methods.distanceToPos(shopPosPrew, pos))
            shopPosPrew = shopPos;
    }
    return shopPosPrew;
};

cloth.buy = function(price, body, cloth, color, torso, torsoColor, parachute, parachuteColor, itemName = "Одежда", shopId = 0, isFree = false){
    checkInit();
    methods.debug('cloth', price, body, cloth, color, torso, torsoColor, parachute, parachuteColor);
    mp.events.callRemote('server:business:cloth:buy', price, body, cloth, color, torso, torsoColor, parachute, parachuteColor, itemName, shopId, isFree);
};

cloth.changeMask = function(cloth, color){
    checkInit();
    mp.events.callRemote('server:business:cloth:changeMask', cloth, color);
};

cloth.buyMask = function(price, cloth, color, itemName = "Маска", shopId = 0){
    checkInit();
    mp.events.callRemote('server:business:cloth:buyMask', price, cloth, color, itemName, shopId);
};

cloth.change = function(body, cloth, color, torso, torsoColor, parachute, parachuteColor) {
    checkInit();
    mp.events.callRemote('server:business:cloth:change', body, cloth, color, torso, torsoColor, parachute, parachuteColor);
};

cloth.buyProp = function(price, body, cloth, color, itemName = "Аксессуар", shopId = 0, isFree = false){
    checkInit();
    mp.events.callRemote('server:business:cloth:buyProp', price, body, cloth, color, itemName, shopId, isFree);
};

cloth.changeProp = function(body, cloth, color){
    checkInit();
    mp.events.callRemote('server:business:cloth:changeProp', body, cloth, color);
};

export default cloth;
