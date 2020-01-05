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

weapons.components = [
    ["weapon_knuckle", "Base Model", -1730887612, 0],
    ["weapon_knuckle", "The Pimp", 657662643, 0],
    ["weapon_knuckle", "The Ballas", 968858616, 0],
    ["weapon_knuckle", "The Hustler", 628592716, 0],
    ["weapon_knuckle", "The Rock", 671076448, 0],
    ["weapon_knuckle", "The Hater", -1599864416, 0],
    ["weapon_knuckle", "The Lover", -1978808075, 0],
    ["weapon_knuckle", "The Player", 182201846, 0],
    ["weapon_knuckle", "The King", 1261033236, 0],
    ["weapon_knuckle", "The Vagos", -80320317, 0],

    ["weapon_switchblade", "Default Handle", -1405472384, 0],
    ["weapon_switchblade", "VIP Variant", 1939054485, 0],
    ["weapon_switchblade", "Bodyguard Variant", -809429375, 0],

    ["weapon_pistol", "Flashlight", 1974553188, 2],
    ["weapon_pistol", "Suppressor", -250096568, 1],
    ["weapon_pistol", "Yusuf Amir Luxury Finish", 412244022, 0],

    ["weapon_combatpistol", "Flashlight", 1974553188, 2],
    ["weapon_combatpistol", "Suppressor", 1587929861, 1],
    ["weapon_combatpistol", "Yusuf Amir Luxury Finish", 1763972279, 0],

    ["weapon_appistol", "Flashlight", 1974553188, 2],
    ["weapon_appistol", "Suppressor", 1587929861, 1],
    ["weapon_appistol", "Gilded Gun Metal Finish", -1088687135, 0],

    ["weapon_pistol50", "Flashlight", 1974553188, 2],
    ["weapon_pistol50", "Suppressor", 1608387546, 1],
    ["weapon_pistol50", "Platinum Pearl Deluxe Finish", -624894839, 0],

    ["weapon_revolver", "VIP Variant", 2063564857, 0],
    ["weapon_revolver", "Bodyguard Variant", -679610898, 0],

    ["weapon_snspistol", "Etched Wood Grip Finish", 1386313408, 0],

    ["weapon_heavypistol", "Flashlight", 1974553188, 2],
    ["weapon_heavypistol", "Suppressor", 1587929861, 1],
    ["weapon_heavypistol", "Etched Wood Grip Finish", -1558944424, 0],

    ["weapon_revolver_mk2", "Default Rounds", -1650954930, 4],
    ["weapon_revolver_mk2", "Tracer Rounds", -143962776, 4],
    ["weapon_revolver_mk2", "Incendiary Rounds", 1155137459, 4],
    ["weapon_revolver_mk2", "Hollow Point Rounds", 1118269039, 4],
    ["weapon_revolver_mk2", "Full Metal Jacket Rounds", 130514024, 4],
    ["weapon_revolver_mk2", "Holographic Sight", -2112353998, 3],
    ["weapon_revolver_mk2", "Small Scope", 341085901, 3],
    ["weapon_revolver_mk2", "Flashlight", 1974553188, 2],
    ["weapon_revolver_mk2", "Compensator", -725371920, 1],
    ["weapon_revolver_mk2", "Digital Camo", -1692608462, 0],
    ["weapon_revolver_mk2", "Brushstroke Camo", -1469146185, 0],
    ["weapon_revolver_mk2", "Woodland Camo", 1931146704, 0],
    ["weapon_revolver_mk2", "Skull", -871964019, 0],
    ["weapon_revolver_mk2", "Sessanta Nove", -1115947218, 0],
    ["weapon_revolver_mk2", "Perseus", 942143030, 0],
    ["weapon_revolver_mk2", "Leopard", 450666022, 0],
    ["weapon_revolver_mk2", "Zebra", 568147052, 0],
    ["weapon_revolver_mk2", "Geometric", -1433236875, 0],
    ["weapon_revolver_mk2", "Boom!", -1744190424, 0],
    ["weapon_revolver_mk2", "Patriotic", -686103990, 0],

    ["weapon_snspistol_mk2", "Tracer Rounds", -1293505742, 4],
    ["weapon_snspistol_mk2", "Incendiary Rounds", -244872371, 4],
    ["weapon_snspistol_mk2", "Hollow Point Rounds", 206438146, 4],
    ["weapon_snspistol_mk2", "Full Metal Jacket Rounds", -227298616, 4],
    ["weapon_snspistol_mk2", "Flashlight", -924264795, 2],
    ["weapon_snspistol_mk2", "Mounted Scope", 1400905814, 3],
    ["weapon_snspistol_mk2", "Suppressor", -250096568, 1],
    ["weapon_snspistol_mk2", "Compensator", -2045704289, 1],
    ["weapon_snspistol_mk2", "Digital Camo", -170847076, 0],
    ["weapon_snspistol_mk2", "Brushstroke Camo", -1555502003, 0],
    ["weapon_snspistol_mk2", "Woodland Camo", -450254240, 0],
    ["weapon_snspistol_mk2", "Skull", -1612691043, 0],
    ["weapon_snspistol_mk2", "Sessanta Nove", -943868063, 0],
    ["weapon_snspistol_mk2", "Perseus", 1850333593, 0],
    ["weapon_snspistol_mk2", "Leopard", -102787816, 0],
    ["weapon_snspistol_mk2", "Zebra", 1214625774, 0],
    ["weapon_snspistol_mk2", "Geometric", -2117180315, 0],
    ["weapon_snspistol_mk2", "Boom!", -2042468371, 0],
    ["weapon_snspistol_mk2", "Digital Camo 2", -1326168890, 0],
    ["weapon_snspistol_mk2", "Brushstroke Camo 2", -1300902682, 0],
    ["weapon_snspistol_mk2", "Woodland Camo 2", 2045505426, 0],
    ["weapon_snspistol_mk2", "Skull 2", 83088938, 0],
    ["weapon_snspistol_mk2", "Sessanta Nove 2", -788801099, 0],
    ["weapon_snspistol_mk2", "Perseus 2", -747856326, 0],
    ["weapon_snspistol_mk2", "Leopard 2", -179326243, 0],
    ["weapon_snspistol_mk2", "Zebra 2", 118103145, 0],
    ["weapon_snspistol_mk2", "Geometric 2", -2019374262, 0],
    ["weapon_snspistol_mk2", "Boom! 2", 1155115291, 0],
    ["weapon_snspistol_mk2", "Boom! 3", 1624298455, 0],
    ["weapon_snspistol_mk2", "Patriotic", 802484176, 0],

    ["weapon_pistol_mk2", "Tracer Rounds", 1396101239, 4],
    ["weapon_pistol_mk2", "Incendiary Rounds", 1796921793, 4],
    ["weapon_pistol_mk2", "Hollow Point Rounds", 654606365, 4],
    ["weapon_pistol_mk2", "Full Metal Jacket Rounds", 434544854, 4],
    ["weapon_pistol_mk2", "Mounted Scope", -788156085, 3],
    ["weapon_pistol_mk2", "Flashlight", 961552128, 2],
    ["weapon_pistol_mk2", "Suppressor", -250096568, 1],
    ["weapon_pistol_mk2", "Compensator", -1541128191, 1],
    ["weapon_pistol_mk2", "Digital Camo", 1858928084, 0],
    ["weapon_pistol_mk2", "Brushstroke Camo", -1418266050, 0],
    ["weapon_pistol_mk2", "Woodland Camo", -1960687319, 0],
    ["weapon_pistol_mk2", "Skull", -1136124515, 0],
    ["weapon_pistol_mk2", "Sessanta Nove", -738316250, 0],
    ["weapon_pistol_mk2", "Perseus", -1505982040, 0],
    ["weapon_pistol_mk2", "Leopard", -586120733, 0],
    ["weapon_pistol_mk2", "Zebra", -1873715542, 0],
    ["weapon_pistol_mk2", "Geometric", 437775580, 0],
    ["weapon_pistol_mk2", "Boom!", -1196724546, 0],
    ["weapon_pistol_mk2", "Patriotic", 1940494621, 0],
    ["weapon_pistol_mk2", "Patriotic 2", -259893615, 0],
    ["weapon_pistol_mk2", "Digital Camo 2", 1004109093, 0],
    ["weapon_pistol_mk2", "Digital Camo 3", -518631280, 0],
    ["weapon_pistol_mk2", "Digital Camo 4", 1810057598, 0],
    ["weapon_pistol_mk2", "Digital Camo 5", 438688905, 0],
    ["weapon_pistol_mk2", "Digital Camo 6", -1723439187, 0],
    ["weapon_pistol_mk2", "Digital Camo 7", -1055183434, 0],
    ["weapon_pistol_mk2", "Digital Camo 8", 657907325, 0],
    ["weapon_pistol_mk2", "Digital Camo 9", 189299113, 0],
    ["weapon_pistol_mk2", "Digital Camo 10", -1136895729, 0],
    ["weapon_pistol_mk2", "Digital Camo 11", 1700073421, 0],

    ["weapon_vintagepistol", "Suppressor", 1587929861, 1],

    ["weapon_ceramicpistol", "Suppressor", -888921276, 1],

    ["weapon_microsmg", "Flashlight", 1974553188, 2],
    ["weapon_microsmg", "Scope", -763558181, 3],
    ["weapon_microsmg", "Suppressor", 1608387546, 1],
    ["weapon_microsmg", "Yusuf Amir Luxury Finish", 1830526106, 0],

    ["weapon_smg", "Scope", 278163211, 3],
    ["weapon_smg", "Suppressor", 1587929861, 1],
    ["weapon_smg", "Yusuf Amir Luxury Finish", -417090734, 0],

    ["weapon_assaultsmg", "Flashlight", 1870107773, 2],
    ["weapon_assaultsmg", "Scope", -763558181, 3],
    ["weapon_assaultsmg", "Suppressor", 1608387546, 1],
    ["weapon_assaultsmg", "Yusuf Amir Luxury Finish", 787794802, 0],

    ["weapon_smg_mk2", "Tracer Rounds", -1345572061, 4],
    ["weapon_smg_mk2", "Incendiary Rounds", -840202578, 4],
    ["weapon_smg_mk2", "Hollow Point Rounds", -1450935291, 4],
    ["weapon_smg_mk2", "Full Metal Jacket Rounds", -446088812, 4],
    ["weapon_smg_mk2", "Flashlight", 1870107773, 2],
    ["weapon_smg_mk2", "Holographic Sight", -1874335793, 3],
    ["weapon_smg_mk2", "Small Scope", -323176858, 3],
    ["weapon_smg_mk2", "Medium Scope", 1406097909, 3],
    ["weapon_smg_mk2", "Suppressor", 1587929861, 1],
    ["weapon_smg_mk2", "Flat Muzzle Brake", 465989778, 1],
    ["weapon_smg_mk2", "Tactical Muzzle Brake", -767681276, 1],
    ["weapon_smg_mk2", "Fat-End Muzzle Brake", -1782476467, 1],
    ["weapon_smg_mk2", "Precision Muzzle Brake", -304332706, 1],
    ["weapon_smg_mk2", "Heavy Duty Muzzle Brake", -1576090190, 1],
    ["weapon_smg_mk2", "Slanted Muzzle Brake", 1583181328, 1],
    ["weapon_smg_mk2", "Split-End Muzzle Brake", 1426715661, 1],
    ["weapon_smg_mk2", "Digital Camo", 1010100070, 0],
    ["weapon_smg_mk2", "Brushstroke Camo", 954476070, 0],
    ["weapon_smg_mk2", "Woodland Camo", -1225737174, 0],
    ["weapon_smg_mk2", "Skull", -803347135, 0],
    ["weapon_smg_mk2", "Sessanta Nove", 1288756829, 0],
    ["weapon_smg_mk2", "Perseus", 1671435514, 0],
    ["weapon_smg_mk2", "Leopard", 1889358557, 0],
    ["weapon_smg_mk2", "Zebra", 732653609, 0],
    ["weapon_smg_mk2", "Geometric", 1538175168, 0],
    ["weapon_smg_mk2", "Boom!", 1619980705, 0],
    ["weapon_smg_mk2", "Patriotic", -2044145270, 0],

    ["weapon_machinepistol", "Suppressor", 1587929861, 1],

    ["weapon_combatpdw", "Flashlight", 1870107773, 2],
    ["weapon_combatpdw", "Grip", -1916872402, 5],
    ["weapon_combatpdw", "Scope", 1682474483, 3],

    ["weapon_pumpshotgun", "Flashlight", 1870107773, 2],
    ["weapon_pumpshotgun", "Suppressor", -1042047090, 1],
    ["weapon_pumpshotgun", "Yusuf Amir Luxury Finish", 913632160, 0],

    ["weapon_sawnoffshotgun", "Gilded Gun Metal Finish", 1021377713, 0],

    ["weapon_assaultshotgun", "Flashlight", 1870107773, 2],
    ["weapon_assaultshotgun", "Suppressor", -572233346, 1],
    ["weapon_assaultshotgun", "Grip", -1916872402, 5],

    ["weapon_bullpupshotgun", "Flashlight", 1870107773, 2],
    ["weapon_bullpupshotgun", "Suppressor", 1608387546, 1],
    ["weapon_bullpupshotgun", "Grip", -1916872402, 5],

    ["weapon_pumpshotgun_mk2", "Default Shells", 676391519, 4],
    ["weapon_pumpshotgun_mk2", "Dragon's Breath Shells", -1622116624, 4],
    ["weapon_pumpshotgun_mk2", "Steel Buckshot Shells", 2023024637, 4],
    ["weapon_pumpshotgun_mk2", "Flechette Shells", -433273230, 4],
    ["weapon_pumpshotgun_mk2", "Explosive Slugs", -156593874, 4],
    ["weapon_pumpshotgun_mk2", "Holographic Sight", -2112353998, 3],
    ["weapon_pumpshotgun_mk2", "Small Scope", 341085901, 3],
    ["weapon_pumpshotgun_mk2", "Medium Scope", 1550206013, 3],
    ["weapon_pumpshotgun_mk2", "Flashlight", 1870107773, 2],
    ["weapon_pumpshotgun_mk2", "Suppressor", -1361345988, 1],
    ["weapon_pumpshotgun_mk2", "Squared Muzzle Brake", 221569923, 1],
    ["weapon_pumpshotgun_mk2", "Digital Camo", -2025071518, 0],
    ["weapon_pumpshotgun_mk2", "Brushstroke Camo", 1680176327, 0],
    ["weapon_pumpshotgun_mk2", "Woodland Camo", -543609971, 0],
    ["weapon_pumpshotgun_mk2", "Skull", -246568992, 0],
    ["weapon_pumpshotgun_mk2", "Sessanta Nove", 947730390, 0],
    ["weapon_pumpshotgun_mk2", "Perseus", 1354427488, 0],
    ["weapon_pumpshotgun_mk2", "Leopard", -790249979, 0],
    ["weapon_pumpshotgun_mk2", "Zebra", 1494441679, 0],
    ["weapon_pumpshotgun_mk2", "Geometric", -1985950647, 0],
    ["weapon_pumpshotgun_mk2", "Boom!", 1810996241, 0],
    ["weapon_pumpshotgun_mk2", "Patriotic", 750425409, 0],

    ["weapon_heavyshotgun", "Flashlight", 1870107773, 2],
    ["weapon_heavyshotgun", "Suppressor", 1608387546, 1],
    ["weapon_heavyshotgun", "Grip", -1916872402, 5],

    ["weapon_assaultrifle", "Flashlight", 1870107773, 2],
    ["weapon_assaultrifle", "Scope", -763558181, 3],
    ["weapon_assaultrifle", "Suppressor", 1608387546, 1],
    ["weapon_assaultrifle", "Grip", -1916872402, 5],
    ["weapon_assaultrifle", "Yusuf Amir Luxury Finish", -1731493963, 0],

    ["weapon_carbinerifle", "Flashlight", 1870107773, 2],
    ["weapon_carbinerifle", "Scope", -1571684688, 3],
    ["weapon_carbinerifle", "Suppressor", -572233346, 1],
    ["weapon_carbinerifle", "Grip", -1916872402, 5],
    ["weapon_carbinerifle", "Yusuf Amir Luxury Finish", 1844938950, 0],

    ["weapon_advancedrifle", "Flashlight", 1870107773, 2],
    ["weapon_advancedrifle", "Scope", 1682474483, 3],
    ["weapon_advancedrifle", "Suppressor", -572233346, 1],
    ["weapon_advancedrifle", "Gilded Gun Metal Finish", 1207192489, 0],

    ["weapon_specialcarbine", "Flashlight", 1870107773, 2],
    ["weapon_specialcarbine", "Scope", -1571684688, 3],
    ["weapon_specialcarbine", "Suppressor", 1608387546, 1],
    ["weapon_specialcarbine", "Grip", -1916872402, 5],
    ["weapon_specialcarbine", "Etched Gun Metal Finish", 104339577, 0],

    ["weapon_bullpuprifle", "Flashlight", 1870107773, 2],
    ["weapon_bullpuprifle", "Scope", 1682474483, 3],
    ["weapon_bullpuprifle", "Suppressor", -572233346, 1],
    ["weapon_bullpuprifle", "Grip", -1916872402, 5],
    ["weapon_bullpuprifle", "Gilded Gun Metal Finish", -1691163884, 0],

    ["weapon_bullpuprifle_mk2", "Tracer Rounds", -664485941, 4],
    ["weapon_bullpuprifle_mk2", "Incendiary Rounds", -846958947, 4],
    ["weapon_bullpuprifle_mk2", "Armor Piercing Rounds", 1202355186, 4],
    ["weapon_bullpuprifle_mk2", "Full Metal Jacket Rounds", 1975219268, 4],
    ["weapon_bullpuprifle_mk2", "Flashlight", 1870107773, 2],
    ["weapon_bullpuprifle_mk2", "Holographic Sight", -2112353998, 3],
    ["weapon_bullpuprifle_mk2", "Small Scope", 592249704, 3],
    ["weapon_bullpuprifle_mk2", "Medium Scope", 1550206013, 3],
    ["weapon_bullpuprifle_mk2", "Suppressor", -572233346, 1],
    ["weapon_bullpuprifle_mk2", "Flat Muzzle Brake", 465989778, 1],
    ["weapon_bullpuprifle_mk2", "Tactical Muzzle Brake", -767681276, 1],
    ["weapon_bullpuprifle_mk2", "Fat-End Muzzle Brake", -1782476467, 1],
    ["weapon_bullpuprifle_mk2", "Precision Muzzle Brake", -304332706, 1],
    ["weapon_bullpuprifle_mk2", "Heavy Duty Muzzle Brake", -1576090190, 1],
    ["weapon_bullpuprifle_mk2", "Slanted Muzzle Brake", 1583181328, 1],
    ["weapon_bullpuprifle_mk2", "Split-End Muzzle Brake", 1426715661, 1],
    ["weapon_bullpuprifle_mk2", "Grip", -863102506, 5],
    ["weapon_bullpuprifle_mk2", "Digital Camo", 486948398, 0],
    ["weapon_bullpuprifle_mk2", "Brushstroke Camo", 1548500409, 0],
    ["weapon_bullpuprifle_mk2", "Woodland Camo", -1571526888, 0],
    ["weapon_bullpuprifle_mk2", "Skull", 441747264, 0],
    ["weapon_bullpuprifle_mk2", "Sessanta Nove", 611910571, 0],
    ["weapon_bullpuprifle_mk2", "Perseus", -1579909200, 0],
    ["weapon_bullpuprifle_mk2", "Leopard", 1616970940, 0],
    ["weapon_bullpuprifle_mk2", "Zebra", -1228601976, 0],
    ["weapon_bullpuprifle_mk2", "Geometric", 1383101698, 0],
    ["weapon_bullpuprifle_mk2", "Boom!", -1177471357, 0],
    ["weapon_bullpuprifle_mk2", "Patriotic", -1089942295, 0],

    ["weapon_specialcarbine_mk2", "Tracer Rounds", 1627896902, 4],
    ["weapon_specialcarbine_mk2", "Incendiary Rounds", -598143522, 4],
    ["weapon_specialcarbine_mk2", "Armor Piercing Rounds", 1492744330, 4],
    ["weapon_specialcarbine_mk2", "Full Metal Jacket Rounds", -31368107, 4],
    ["weapon_specialcarbine_mk2", "Flashlight", 1870107773, 2],
    ["weapon_specialcarbine_mk2", "Holographic Sight", -2112353998, 3],
    ["weapon_specialcarbine_mk2", "Small Scope", 341085901, 3],
    ["weapon_specialcarbine_mk2", "Large Scope", 120419074, 3],
    ["weapon_specialcarbine_mk2", "Suppressor", 1608387546, 1],
    ["weapon_specialcarbine_mk2", "Flat Muzzle Brake", 465989778, 1],
    ["weapon_specialcarbine_mk2", "Tactical Muzzle Brake", -767681276, 1],
    ["weapon_specialcarbine_mk2", "Fat-End Muzzle Brake", -1782476467, 1],
    ["weapon_specialcarbine_mk2", "Precision Muzzle Brake", -304332706, 1],
    ["weapon_specialcarbine_mk2", "Heavy Duty Muzzle Brake", -1576090190, 1],
    ["weapon_specialcarbine_mk2", "Slanted Muzzle Brake", 1583181328, 1],
    ["weapon_specialcarbine_mk2", "Split-End Muzzle Brake", 1426715661, 1],
    ["weapon_specialcarbine_mk2", "Grip", -863102506, 5],
    ["weapon_specialcarbine_mk2", "Digital Camo", -1307667605, 0],
    ["weapon_specialcarbine_mk2", "Brushstroke Camo", 550033337, 0],
    ["weapon_specialcarbine_mk2", "Woodland Camo", 1401671982, 0],
    ["weapon_specialcarbine_mk2", "Skull", 22577348, 0],
    ["weapon_specialcarbine_mk2", "Sessanta Nove", -1674804809, 0],
    ["weapon_specialcarbine_mk2", "Perseus", -554001678, 0],
    ["weapon_specialcarbine_mk2", "Leopard", 249091585, 0],
    ["weapon_specialcarbine_mk2", "Zebra", -1919658222, 0],
    ["weapon_specialcarbine_mk2", "Geometric", -1581104520, 0],
    ["weapon_specialcarbine_mk2", "Boom!", -77690999, 0],
    ["weapon_specialcarbine_mk2", "Patriotic", 1354258082, 0],

    ["weapon_assaultrifle_mk2", "Tracer Rounds", -1907801826, 4],
    ["weapon_assaultrifle_mk2", "Incendiary Rounds", -863059414, 4],
    ["weapon_assaultrifle_mk2", "Armor Piercing Rounds", 1408333227, 4],
    ["weapon_assaultrifle_mk2", "Full Metal Jacket Rounds", -692190661, 4],
    ["weapon_assaultrifle_mk2", "Flashlight", 1870107773, 2],
    ["weapon_assaultrifle_mk2", "Holographic Sight", -2112353998, 3],
    ["weapon_assaultrifle_mk2", "Small Scope", 341085901, 3],
    ["weapon_assaultrifle_mk2", "Large Scope", 120419074, 3],
    ["weapon_assaultrifle_mk2", "Suppressor", 1608387546, 1],
    ["weapon_assaultrifle_mk2", "Flat Muzzle Brake", 465989778, 1],
    ["weapon_assaultrifle_mk2", "Tactical Muzzle Brake", -767681276, 1],
    ["weapon_assaultrifle_mk2", "Fat-End Muzzle Brake", -1782476467, 1],
    ["weapon_assaultrifle_mk2", "Precision Muzzle Brake", -304332706, 1],
    ["weapon_assaultrifle_mk2", "Heavy Duty Muzzle Brake", -1576090190, 1],
    ["weapon_assaultrifle_mk2", "Slanted Muzzle Brake", 1583181328, 1],
    ["weapon_assaultrifle_mk2", "Split-End Muzzle Brake", 1426715661, 1],
    ["weapon_assaultrifle_mk2", "Grip", -863102506, 5],
    ["weapon_assaultrifle_mk2", "Digital Camo", 1332420929, 0],
    ["weapon_assaultrifle_mk2", "Brushstroke Camo", -1581556061, 0],
    ["weapon_assaultrifle_mk2", "Woodland Camo", 881444266, 0],
    ["weapon_assaultrifle_mk2", "Skull", -426831496, 0],
    ["weapon_assaultrifle_mk2", "Sessanta Nove", -821974601, 0],
    ["weapon_assaultrifle_mk2", "Perseus", 1404221038, 0],
    ["weapon_assaultrifle_mk2", "Leopard", -770178531, 0],
    ["weapon_assaultrifle_mk2", "Zebra", 263621435, 0],
    ["weapon_assaultrifle_mk2", "Geometric", -1856171657, 0],
    ["weapon_assaultrifle_mk2", "Boom!", 408109124, 0],
    ["weapon_assaultrifle_mk2", "Patriotic", 603795410, 0],

    ["weapon_carbinerifle_mk2", "Tracer Rounds", -1016920421, 4],
    ["weapon_carbinerifle_mk2", "Incendiary Rounds", 61836152, 4],
    ["weapon_carbinerifle_mk2", "Armor Piercing Rounds", 2116272652, 4],
    ["weapon_carbinerifle_mk2", "Full Metal Jacket Rounds", -251158767, 4],
    ["weapon_carbinerifle_mk2", "Flashlight", 1870107773, 2],
    ["weapon_carbinerifle_mk2", "Holographic Sight", -2112353998, 3],
    ["weapon_carbinerifle_mk2", "Small Scope", 341085901, 3],
    ["weapon_carbinerifle_mk2", "Large Scope", 120419074, 3],
    ["weapon_carbinerifle_mk2", "Suppressor", -572233346, 1],
    ["weapon_carbinerifle_mk2", "Flat Muzzle Brake", 465989778, 1],
    ["weapon_carbinerifle_mk2", "Tactical Muzzle Brake", -767681276, 1],
    ["weapon_carbinerifle_mk2", "Fat-End Muzzle Brake", -1782476467, 1],
    ["weapon_carbinerifle_mk2", "Precision Muzzle Brake", -304332706, 1],
    ["weapon_carbinerifle_mk2", "Heavy Duty Muzzle Brake", -1576090190, 1],
    ["weapon_carbinerifle_mk2", "Slanted Muzzle Brake", 1583181328, 1],
    ["weapon_carbinerifle_mk2", "Split-End Muzzle Brake", 1426715661, 1],
    ["weapon_carbinerifle_mk2", "Grip", -863102506, 5],
    ["weapon_carbinerifle_mk2", "Digital Camo", 573444658, 0],
    ["weapon_carbinerifle_mk2", "Brushstroke Camo", -25209965, 0],
    ["weapon_carbinerifle_mk2", "Woodland Camo", 263830889, 0],
    ["weapon_carbinerifle_mk2", "Skull", -1227419918, 0],
    ["weapon_carbinerifle_mk2", "Sessanta Nove", 1649098295, 0],
    ["weapon_carbinerifle_mk2", "Perseus", -524886411, 0],
    ["weapon_carbinerifle_mk2", "Leopard", -1493990850, 0],
    ["weapon_carbinerifle_mk2", "Zebra", 1966801321, 0],
    ["weapon_carbinerifle_mk2", "Geometric", -461348801, 0],
    ["weapon_carbinerifle_mk2", "Boom!", 2046113057, 0],
    ["weapon_carbinerifle_mk2", "Patriotic", 302760261, 0],

    ["weapon_mg", "Scope", 888974180, 3],
    ["weapon_mg", "Yusuf Amir Luxury Finish", 36190390, 0],

    ["weapon_combatmg", "Scope", -1571684688, 3],
    ["weapon_combatmg", "Grip", -1916872402, 5],
    ["weapon_combatmg", "Etched Gun Metal Finish", 837751027, 0],

    ["weapon_combatmg_mk2", "Tracer Rounds", 633965580, 4],
    ["weapon_combatmg_mk2", "Incendiary Rounds", 822936413, 4],
    ["weapon_combatmg_mk2", "Armor Piercing Rounds", 1018259847, 4],
    ["weapon_combatmg_mk2", "Full Metal Jacket Rounds", 105547033, 4],
    ["weapon_combatmg_mk2", "Holographic Sight", -2112353998, 3],
    ["weapon_combatmg_mk2", "Medium Scope", 1550206013, 3],
    ["weapon_combatmg_mk2", "Large Scope", 120419074, 3],
    ["weapon_combatmg_mk2", "Flat Muzzle Brake", 465989778, 1],
    ["weapon_combatmg_mk2", "Tactical Muzzle Brake", -767681276, 1],
    ["weapon_combatmg_mk2", "Fat-End Muzzle Brake", -1782476467, 1],
    ["weapon_combatmg_mk2", "Precision Muzzle Brake", -304332706, 1],
    ["weapon_combatmg_mk2", "Heavy Duty Muzzle Brake", -1576090190, 1],
    ["weapon_combatmg_mk2", "Slanted Muzzle Brake", 1583181328, 1],
    ["weapon_combatmg_mk2", "Split-End Muzzle Brake", 1426715661, 1],
    ["weapon_combatmg_mk2", "Grip", -863102506, 5],
    ["weapon_combatmg_mk2", "Digital Camo", -1477177792, 0],
    ["weapon_combatmg_mk2", "Brushstroke Camo", 1677554653, 0],
    ["weapon_combatmg_mk2", "Woodland Camo", 970889420, 0],
    ["weapon_combatmg_mk2", "Skull", -1428969121, 0],
    ["weapon_combatmg_mk2", "Sessanta Nove", 112303179, 0],
    ["weapon_combatmg_mk2", "Perseus", -554218250, 0],
    ["weapon_combatmg_mk2", "Leopard", -1985697391, 0],
    ["weapon_combatmg_mk2", "Zebra", -557752253, 0],
    ["weapon_combatmg_mk2", "Geometric", -592614666, 0],
    ["weapon_combatmg_mk2", "Boom!", 1764985426, 0],
    ["weapon_combatmg_mk2", "Patriotic", -1205514588, 0],

    ["weapon_sniperrifle", "Scope", 448626319, 3],
    ["weapon_sniperrifle", "Advanced Scope", 333103223, 3],
    ["weapon_sniperrifle", "Etched Gun Metal Finish", -1179855747, 0],

    ["weapon_heavysniper", "Scope", 448626319, 3],
    ["weapon_heavysniper", "Advanced Scope", 333103223, 3],

    ["weapon_marksmanrifle_mk2", "Tracer Rounds", 1306793902, 4],
    ["weapon_marksmanrifle_mk2", "Incendiary Rounds", -38523191, 4],
    ["weapon_marksmanrifle_mk2", "Armor Piercing Rounds", 1885071836, 4],
    ["weapon_marksmanrifle_mk2", "Full Metal Jacket Rounds", -415579811, 4],
    ["weapon_marksmanrifle_mk2", "Flashlight", 1870107773, 2],
    ["weapon_marksmanrifle_mk2", "Holographic Sight", -2112353998, 3],
    ["weapon_marksmanrifle_mk2", "Zoom Scope", 1639753119, 3],
    ["weapon_marksmanrifle_mk2", "Large Scope", 120419074, 3],
    ["weapon_marksmanrifle_mk2", "Suppressor", -572233346, 1],
    ["weapon_marksmanrifle_mk2", "Flat Muzzle Brake", 465989778, 1],
    ["weapon_marksmanrifle_mk2", "Tactical Muzzle Brake", -767681276, 1],
    ["weapon_marksmanrifle_mk2", "Fat-End Muzzle Brake", -1782476467, 1],
    ["weapon_marksmanrifle_mk2", "Precision Muzzle Brake", -304332706, 1],
    ["weapon_marksmanrifle_mk2", "Heavy Duty Muzzle Brake", -1576090190, 1],
    ["weapon_marksmanrifle_mk2", "Slanted Muzzle Brake", 1583181328, 1],
    ["weapon_marksmanrifle_mk2", "Split-End Muzzle Brake", 1426715661, 1],
    ["weapon_marksmanrifle_mk2", "Grip", -863102506, 5],
    ["weapon_marksmanrifle_mk2", "Digital Camo", -1948664752, 0],
    ["weapon_marksmanrifle_mk2", "Brushstroke Camo", 418685078, 0],
    ["weapon_marksmanrifle_mk2", "Woodland Camo", 194734438, 0],
    ["weapon_marksmanrifle_mk2", "Skull", -527245926, 0],
    ["weapon_marksmanrifle_mk2", "Sessanta Nove", 411498053, 0],
    ["weapon_marksmanrifle_mk2", "Perseus", 1144040861, 0],
    ["weapon_marksmanrifle_mk2", "Leopard", -1671095419, 0],
    ["weapon_marksmanrifle_mk2", "Zebra", -1931527311, 0],
    ["weapon_marksmanrifle_mk2", "Geometric", 950622935, 0],
    ["weapon_marksmanrifle_mk2", "Boom!", 2043612596, 0],
    ["weapon_marksmanrifle_mk2", "Boom! 2", -704081657, 0],

    ["weapon_heavysniper_mk2", "Incendiary Rounds", 2144034455, 4],
    ["weapon_heavysniper_mk2", "Armor Piercing Rounds", 1263328607, 4],
    ["weapon_heavysniper_mk2", "Full Metal Jacket Rounds", -300115410, 4],
    ["weapon_heavysniper_mk2", "Explosive Rounds", -1789283773, 4],
    ["weapon_heavysniper_mk2", "Thermal Scope", 409548479, 3],
    ["weapon_heavysniper_mk2", "Night Vision Scope", -1504835639, 3],
    ["weapon_heavysniper_mk2", "Zoom Scope", -1235771981, 3],
    ["weapon_heavysniper_mk2", "Advanced Scope", 333103223, 3],
    ["weapon_heavysniper_mk2", "Suppressor", -1361345988, 1],
    ["weapon_pumpshotgun_mk2", "Squared Muzzle Brake", 221569923, 1],
    ["weapon_pumpshotgun_mk2", "Bell-End Muzzle Brake", 1881868627, 1],
    ["weapon_heavysniper_mk2", "Digital Camo", -1828924223, 0],
    ["weapon_heavysniper_mk2", "Brushstroke Camo", 488267895, 0],
    ["weapon_heavysniper_mk2", "Woodland Camo", -236573119, 0],
    ["weapon_heavysniper_mk2", "Skull", 785134077, 0],
    ["weapon_heavysniper_mk2", "Sessanta Nove", 803658090, 0],
    ["weapon_heavysniper_mk2", "Perseus", -463243063, 0],
    ["weapon_heavysniper_mk2", "Leopard", -1292932408, 0],
    ["weapon_heavysniper_mk2", "Zebra", -55472691, 0],
    ["weapon_heavysniper_mk2", "Geometric", 635161787, 0],
    ["weapon_heavysniper_mk2", "Boom!", 1643233435, 0],
    ["weapon_heavysniper_mk2", "Patriotic", 1585608149, 0],

    ["weapon_marksmanrifle", "Flashlight", 1870107773, 2],
    ["weapon_marksmanrifle", "Scope", 1601796279, 3],
    ["weapon_marksmanrifle", "Suppressor", -572233346, 1],
    ["weapon_marksmanrifle", "Grip", -1916872402, 5],
    ["weapon_marksmanrifle", "Yusuf Amir Luxury Finish", -593235658, 0],

    ["weapon_grenadelauncher", "Flashlight", 1870107773, 2],
    ["weapon_grenadelauncher", "Grip", -1916872402, 5],
    ["weapon_grenadelauncher", "Scope", 1682474483, 3],
];

weapons.getHashByName = function(name) {
    let hash = 0;
    weapons.hashesMap.forEach(item => {
        if (item[0] == name)
            hash = item[1] / 2;
    });
    return hash;
};

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