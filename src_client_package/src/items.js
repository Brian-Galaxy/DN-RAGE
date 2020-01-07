let items = {};

items.defaultModelHash = 1108364521;

/*Имя, хеш объекта, может экипировать, вес, объем (ширина * на длинну * на высоту) */
let ItemList = [];

items.updateItems = function(data)
{
    ItemList = data;
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