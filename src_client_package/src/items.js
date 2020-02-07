let items = {};

items.defaultModelHash = 1108364521;

/*Имя, хеш объекта, может экипировать, вес, объем (ширина * на длинну * на высоту) */
let ItemList = [];

items.updateItems = function(data)
{
    ItemList = data;
};

items.isWeapon = function(itemId) {
    return itemId >= 54 && itemId <= 138 || itemId == 146 || itemId == 147;
};

items.isAmmo = function(itemId) {
    return itemId >= 279 && itemId <= 292;
};

items.getAmmoCount = function(itemId) {
    switch (itemId) {
        case 279:
        case 288:
        case 290:
            return 10;
        case 280:
            return 140;
        case 281:
            return 120;
        case 282:
            return 130;
        case 283:
        case 284:
            return 260;
        case 285:
        case 286:
        case 287:
            return 60;
        case 289:
        case 291:
        case 292:
            return 1;
    }
    return 10;
};

items.getWeaponIdByName = function(name)
{
    let id = -1;
    ItemList.forEach((item, i) => {
        if (item[1] == name && item[2] == 0)
            id = i;
    });
    return id;
};

items.getWeaponComponentIdByHash = function(hash, wpName)
{
    let id = -1;
    ItemList.forEach((item, i) => {
        if (item[2] == hash && item[1] == wpName)
            id = i;
    });
    return id;
};

items.getWeaponNameByName = function(name)
{
    let normalName = "";
    ItemList.forEach((item, i) => {
        if (item[1] == name && item[2] == 0)
            normalName = item[0];
    });
    return normalName;
};

items.getItemNameById = function(id)
{
    try
    {
        return ItemList[id][0];
    }
    catch
    {
        return "UNKNOWN";
    }
};

items.getItemNameHashById = function(id)
{
    try
    {
        return ItemList[id][1];
    }
    catch
    {
        return "UNKNOWN";
    }
};

items.getItemPrice = function(id) {
    try
    {
        return ItemList[id][6];
    }
    catch
    {
        return 0;
    }
};

items.getItemHashModiferById = function(id)
{
    try
    {
        return ItemList[id][2];
    }
    catch
    {
        return "UNKNOWN";
    }
};

items.getItemHashById = function(id)
{
    try
    {
        return ItemList[id][3];
    }
    catch
    {
        return 1108364521;
    }
};

items.getItemWeightById = function(id)
{
    try
    {
        return ItemList[id][4];
    }
    catch
    {
        return -1;
    }
};

items.getItemWeightKgById = function(id)
{
    try
    {
        return Math.Round(ItemList[id][4] / 1000.0);
    }
    catch
    {
        return -1;
    }
};

items.getItemAmountById = function(id)
{
    try
    {
        return ItemList[id][5];
    }
    catch
    {
        return -1;
    }
};

export default items;