import user from "./user";
import items from "./items";

let weapons = {};

weapons.hashesMap = [
    ["weapon_dagger", -1834847097],
    ["weapon_bat", -1786099057],
    ["weapon_bottle", -102323637],
    ["weapon_crowbar", -2067956739],
    ["weapon_unarmed", -1569615261],
    ["weapon_flashlight", -1951375401],
    ["weapon_golfclub", 1141786504],
    ["weapon_hammer", 1317494643],
    ["weapon_hatchet", -102973651],
    ["weapon_knuckle", -656458692],
    ["weapon_knife", -1716189206],
    ["weapon_machete", -581044007],
    ["weapon_switchblade", -538741184],
    ["weapon_nightstick", 1737195953],
    ["weapon_wrench", 419712736],
    ["weapon_battleaxe", -853065399],
    ["weapon_poolcue", -1810795771],
    ["weapon_stone_hatchet", 940833800],
    ["weapon_pistol", 453432689],
    ["weapon_pistol_mk2", -1075685676],
    ["weapon_combatpistol", 1593441988],
    ["weapon_appistol", 584646201],
    ["weapon_stungun", 911657153],
    ["weapon_pistol50", -1716589765],
    ["weapon_snspistol", -1076751822],
    ["weapon_snspistol_mk2", -2009644972],
    ["weapon_heavypistol", -771403250],
    ["weapon_vintagepistol", 137902532],
    ["weapon_flaregun", 1198879012],
    ["weapon_marksmanpistol", -598887786],
    ["weapon_revolver", -1045183535],
    ["weapon_revolver_mk2", -879347409],
    ["weapon_doubleaction", -1746263880],
    ["weapon_raypistol", -1355376991],
    ["weapon_ceramicpistol", 727643628],
    ["weapon_navyrevolver", -1853920116],
    ["weapon_microsmg", 324215364],
    ["weapon_smg", 736523883],
    ["weapon_smg_mk2", 2024373456],
    ["weapon_assaultsmg", -270015777],
    ["weapon_combatpdw", 171789620],
    ["weapon_machinepistol", -619010992],
    ["weapon_minismg", -1121678507],
    ["weapon_raycarbine", 1198256469],
    ["weapon_pumpshotgun", 487013001],
    ["weapon_pumpshotgun_mk2", 1432025498],
    ["weapon_sawnoffshotgun", 2017895192],
    ["weapon_assaultshotgun", -494615257],
    ["weapon_bullpupshotgun", -1654528753],
    ["weapon_musket", -1466123874],
    ["weapon_heavyshotgun", 984333226],
    ["weapon_dbshotgun", -275439685],
    ["weapon_autoshotgun", 317205821],
    ["weapon_assaultrifle", -1074790547],
    ["weapon_assaultrifle_mk2", 961495388],
    ["weapon_carbinerifle", -2084633992],
    ["weapon_carbinerifle_mk2", -86904375],
    ["weapon_advancedrifle", -1357824103],
    ["weapon_specialcarbine", -1063057011],
    ["weapon_specialcarbine_mk2", -1768145561],
    ["weapon_bullpuprifle", 2132975508],
    ["weapon_bullpuprifle_mk2", -2066285827],
    ["weapon_compactrifle", 1649403952],
    ["weapon_mg", -1660422300],
    ["weapon_combatmg", 2144741730],
    ["weapon_combatmg_mk2", -608341376],
    ["weapon_gusenberg", 1627465347],
    ["weapon_sniperrifle", 100416529],
    ["weapon_heavysniper", 205991906],
    ["weapon_heavysniper_mk2", 177293209],
    ["weapon_marksmanrifle", -952879014],
    ["weapon_marksmanrifle_mk2", 1785463520],
    ["weapon_rpg", -1312131151],
    ["weapon_grenadelauncher", -1568386805],
    ["weapon_grenadelauncher_smoke", 1305664598],
    ["weapon_minigun", 1119849093],
    ["weapon_firework", 2138347493],
    ["weapon_railgun", 1834241177],
    ["weapon_hominglauncher", 1672152130],
    ["weapon_compactlauncher", 125959754],
    ["weapon_rayminigun", -1238556825],
    ["weapon_grenade", -1813897027],
    ["weapon_bzgas", -1600701090],
    ["weapon_smokegrenade", -37975472],
    ["weapon_flare", 1233104067],
    ["weapon_molotov", 615608432],
    ["weapon_stickybomb", 741814745],
    ["weapon_proxmine", -1420407917],
    ["weapon_snowball", 126349499],
    ["weapon_pipebomb", -1169823560],
    ["weapon_ball", 600439132],
    ["weapon_petrolcan", 883325847],
    ["weapon_fireextinguisher", 101631238],
    ["weapon_parachute", -196322845],
    ["weapon_hazardcan", -1168940174],
];

weapons.getGunSlotId = function(name) {
    switch (name) {
        case 'weapon_microsmg':
        case 'weapon_smg':
        case 'weapon_smg_mk2':
        case 'weapon_assaultsmg':
        case 'weapon_combatpdw':
        case 'weapon_machinepistol':
        case 'weapon_minismg':
        case 'weapon_raycarbine':

        case 'weapon_assaultrifle':
        case 'weapon_assaultrifle_mk2':
        case 'weapon_carbinerifle':
        case 'weapon_carbinerifle_mk2':
        case 'weapon_advancedrifle':
        case 'weapon_specialcarbine':
        case 'weapon_specialcarbine_mk2':
        case 'weapon_bullpuprifle':
        case 'weapon_bullpuprifle_mk2':
        case 'weapon_compactrifle':

        case 'weapon_mg':
        case 'weapon_combatmg':
        case 'weapon_combatmg_mk2':
        case 'weapon_gusenberg':

        case 'weapon_rpg':
        case 'weapon_grenadelauncher':
        case 'weapon_grenadelauncher_smoke':
        case 'weapon_minigun':
        case 'weapon_firework':
        case 'weapon_railgun':
        case 'weapon_hominglauncher':
        case 'weapon_compactlauncher':
        case 'weapon_rayminigun':

        case 'weapon_sniperrifle':
        case 'weapon_heavysniper':
        case 'weapon_heavysniper_mk2':
        case 'weapon_marksmanrifle':
        case 'weapon_marksmanrifle_mk2':
            return 1;
        case 'weapon_pumpshotgun':
        case 'weapon_pumpshotgun_mk2':
        case 'weapon_sawnoffshotgun':
        case 'weapon_assaultshotgun':
        case 'weapon_bullpupshotgun':
        case 'weapon_musket':
        case 'weapon_heavyshotgun':
        case 'weapon_dbshotgun':
        case 'weapon_autoshotgun':
            return 2;
        case 'weapon_grenade':
        case 'weapon_bzgas':
        case 'weapon_molotov':
        case 'weapon_stickybomb':
        case 'weapon_proxmine':
        case 'weapon_snowball':
        case 'weapon_pipebomb':
        case 'weapon_ball':
        case 'weapon_smokegrenade':
        case 'weapon_flare':
            return 3;
        case 'weapon_pistol':
        case 'weapon_pistol_mk2':
        case 'weapon_combatpistol':
        case 'weapon_appistol':
        case 'weapon_stungun':
        case 'weapon_pistol50':
        case 'weapon_snspistol':
        case 'weapon_snspistol_mk2':
        case 'weapon_heavypistol':
        case 'weapon_vintagepistol':
        case 'weapon_flaregun':
        case 'weapon_marksmanpistol':
        case 'weapon_revolver':
        case 'weapon_revolver_mk2':
        case 'weapon_doubleaction':
        case 'weapon_raypistol':
        case 'weapon_ceramicpistol':
        case 'weapon_navyrevolver':
            return 4;
        case 'weapon_dagger':
        case 'weapon_bat':
        case 'weapon_bottle':
        case 'weapon_crowbar':
        case 'weapon_flashlight':
        case 'weapon_golfclub':
        case 'weapon_hammer':
        case 'weapon_hatchet':
        case 'weapon_knuckle':
        case 'weapon_knife':
        case 'weapon_machete':
        case 'weapon_switchblade':
        case 'weapon_nightstick':
        case 'weapon_wrench':
        case 'weapon_battleaxe':
        case 'weapon_poolcue':
        case 'weapon_stone_hatchet':
        case 'weapon_petrolcan':
        case 'weapon_hazardcan':
        case 'weapon_fireextinguisher':
            return 5;
    }
    return 1;
};

weapons.getGunSlotIdByItem = function(itemId) {
    return weapons.getGunSlotId(items.getItemNameHashById(itemId));
};

weapons.getGunAmmoName = function(name) {
    switch (name) {
        case 'weapon_appistol':
        case 'weapon_assaultsmg':
        case 'weapon_advancedrifle':
        case 'weapon_assaultrifle':
        case 'weapon_specialcarbine':
        case 'weapon_specialcarbine_mk2':
            return 284; //5.56mm

        case 'weapon_compactrifle':
            return 283; //5.45mm

        case 'weapon_heavysniper_mk2':
        case 'weapon_heavysniper':
            return 285; //12.7mm

        case 'weapon_compactlauncher':
        case 'weapon_grenadelauncher':
        case 'weapon_railgun':
            return 290; //Грантамет подствольный

        case 'weapon_firework':
            return 289; //Феерверк

        case 'weapon_hominglauncher':
            return 292; //Stringer

        case 'weapon_rpg':
            return 291; //RPG

        case 'weapon_combatmg':
        case 'weapon_combatmg_mk2':
        case 'weapon_mg':
        case 'weapon_gusenberg':
        case 'weapon_assaultrifle_mk2':
        case 'weapon_marksmanrifle':
        case 'weapon_marksmanrifle_mk2':
        case 'weapon_sniperrifle':
        case 'weapon_minigun':
            return 282; //7.62mm

        case 'weapon_assaultshotgun':
        case 'weapon_bullpupshotgun':
        case 'weapon_dbshotgun':
        case 'weapon_heavyshotgun':
        case 'weapon_musket':
        case 'weapon_pumpshotgun':
        case 'weapon_pumpshotgun_mk2':
        case 'weapon_sawnoffshotgun':
        case 'weapon_autoshotgun':
            return 281; //12 калибр

        case 'weapon_combatpistol':
        case 'weapon_pistol':
        case 'weapon_pistol_mk2':
        case 'weapon_snspistol':
        case 'weapon_snspistol_mk2':
        case 'weapon_combatpdw':
        case 'weapon_machinepistol':
        case 'weapon_microsmg':
        case 'weapon_minismg':
        case 'weapon_smg':
        case 'weapon_smg_mk2':
            return 280; //9mm

        case 'weapon_heavypistol':
        case 'weapon_vintagepistol':
        case 'weapon_doubleaction':
            return 286; //.45 ACP

        case 'weapon_revolver':
        case 'weapon_revolver_mk2':
        case 'weapon_marksmanpistol':
        case 'weapon_pistol50':
            return 288; //.44 Magnum

        case 'weapon_flaregun':
            return 287; //Патроны сигнального пистолета

        default:
            return -1;
    }
};

export default weapons;