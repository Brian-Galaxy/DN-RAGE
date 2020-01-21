let methods = require('../modules/methods');

let shop = exports;

shop.list = [
    [-3041.126, 585.5155, 6.908929, 82, "shopui_title_conveniencestore"],
    [-3038.86, 586.2693, 6.908929, 82, "shopui_title_conveniencestore"],
    [-3243.896, 1001.722, 11.83071, 83, "shopui_title_conveniencestore"],
    [-3241.574, 1001.538, 11.83071, 83, "shopui_title_conveniencestore"],
    [374.5105, 327.7635, 102.5664, 84, "shopui_title_conveniencestore"],
    [373.9542, 325.4406, 102.5664, 84, "shopui_title_conveniencestore"],
    [2677.278, 3281.584, 54.24113, 85, "shopui_title_conveniencestore"],
    [2679.303, 3280.479, 54.24113, 85, "shopui_title_conveniencestore"],
    [547.6848, 2669.328, 41.15649, 86, "shopui_title_conveniencestore"],
    [547.3407, 2671.746, 41.15649, 86, "shopui_title_conveniencestore"],
    [1730.041, 6416.11, 34.03722, 87, "shopui_title_conveniencestore"],
    [1728.93, 6414.032, 34.03722, 87, "shopui_title_conveniencestore"],
    [1960.621, 3742.39, 31.34375, 88, "shopui_title_conveniencestore"],
    [1961.797, 3740.326, 31.34375, 88, "shopui_title_conveniencestore"],
    [25.96342, -1345.609, 28.49702, 89, "shopui_title_conveniencestore"],
    [26.02901, -1347.894, 28.49702, 89, "shopui_title_conveniencestore"],
    [2555.484, 382.4021, 107.6229, 90, "shopui_title_conveniencestore"],
    [2557.867, 382.3204, 107.6229, 90, "shopui_title_conveniencestore"],
    [1394.001, 3605.032, 33.98092, 91, "shopui_title_liqourstore"],
    [-2968.287, 391.614, 14.04331, 92, "shopui_title_liqourstore2"],
    [-1488.082, -378.9411, 39.16343, 93, "shopui_title_liqourstore2"],
    [1136.161, -982.821, 45.41585, 94, "shopui_title_liqourstore2"],
    [-1222.552, -906.4139, 11.32636, 95, "shopui_title_liqourstore2"],
    [1165.307, 2709.018, 37.15771, 96, "shopui_title_liqourstore3"],
    [-47.49747, -1756.332, 28.42101, 104, "shopui_title_gasstation"],
    [-48.75316, -1757.672, 28.42101, 104, "shopui_title_gasstation"],
    [1699.679, 4923.871, 41.06363, 105, "shopui_title_gasstation"],
    [1698.219, 4924.843, 41.06363, 105, "shopui_title_gasstation"],
    [-47.49747, -1756.332, 28.42101, 106, "shopui_title_gasstation"],
    [48.75316, -1757.672, 28.42101, 106, "shopui_title_gasstation"],
    [1163.038, -322.3109, 68.20506, 107, "shopui_title_gasstation"],
    [1163.371, -324.0874, 68.20506, 107, "shopui_title_gasstation"],
    [-1821.729, 793.7563, 137.1204, 108, "shopui_title_gasstation"],
    [-1820.643, 792.3428, 137.117, 108, "shopui_title_gasstation"]
];

//1339433404

shop.loadAll = function() {
    methods.debug('shop.loadAll');
    shop.list.forEach(function (item) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        methods.createBlip(shopPos, 415, 0, 0.6, 'Заправка');
    });
};

shop.getInRadius = function(pos, radius = 2) {
    methods.debug('shop.fuel');
    let shopId = -1;
    shop.list.forEach(function (item, idx) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(pos, shopPos) < radius)
            shopId = methods.parseInt(item[3]);
    });
    return shopId;
};

shop.findNearest = function(pos) {
    methods.debug('shop.findNearest');
    let prevPos = new mp.Vector3(9999, 9999, 9999);
    shop.list.forEach(function (item) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(shopPos, pos) < methods.distanceToPos(prevPos, pos))
            prevPos = shopPos;
    });
    return prevPos;
};