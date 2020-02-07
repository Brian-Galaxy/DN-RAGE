let methods = require('./modules/methods');

let weather = require('./managers/weather');

let items = require('./items');

let weapons = exports;

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
    ["weapon_knuckle", "The Pimp", -971770235, 0],
    ["weapon_knuckle", "The Ballas", -287703709, 0],
    ["weapon_knuckle", "The Hustler", 1351683121, 0],
    ["weapon_knuckle", "The Rock", -1755194916, 0],
    ["weapon_knuckle", "The Hater", 2112683568, 0],
    ["weapon_knuckle", "The Lover", 1062111910, 0],
    ["weapon_knuckle", "The Player", 146278587, 0],
    ["weapon_knuckle", "The King", -494162961, 0],
    ["weapon_knuckle", "The Vagos", 2062808965, 0],

    ["weapon_switchblade", "Default Handle", -1858624256, 0],
    ["weapon_switchblade", "VIP Variant", 1530822070, 0],
    ["weapon_switchblade", "Bodyguard Variant", -409758110, 0],

    ["weapon_pistol", "Flashlight", 899381934, 2],
    ["weapon_pistol", "Suppressor", 1709866683, 1],
    ["weapon_pistol", "Yusuf Amir Luxury", -684126074, 0],

    ["weapon_combatpistol", "Flashlight", 899381934, 2],
    ["weapon_combatpistol", "Suppressor", -1023114086, 1],
    ["weapon_combatpistol", "Yusuf Amir Luxury", -966439566, 0],

    ["weapon_appistol", "Flashlight", 899381934, 2],
    ["weapon_appistol", "Suppressor", -1023114086, 1],
    ["weapon_appistol", "Gilded Gun Metal", -1686714580, 0],

    ["weapon_pistol50", "Flashlight", 899381934, 2],
    ["weapon_pistol50", "Suppressor", -1489156508, 1],
    ["weapon_pistol50", "Platinum Pearl Deluxe", 2008591151, 0],

    ["weapon_revolver", "VIP Variant", 384708672, 0],
    ["weapon_revolver", "Bodyguard Variant", -1802258419, 0],

    ["weapon_snspistol", "Etched Wood Grip", -2144080721, 0],

    ["weapon_heavypistol", "Flashlight", 899381934, 2],
    ["weapon_heavypistol", "Suppressor", -1023114086, 1],
    ["weapon_heavypistol", "Etched Wood Grip", 2053798779, 0],

    ["weapon_revolver_mk2", "Default Rounds", -1172055874, 4],
    ["weapon_revolver_mk2", "Tracer Rounds", -958864266, 4],
    ["weapon_revolver_mk2", "Incendiary Rounds", 15712037, 4],
    ["weapon_revolver_mk2", "Hollow Point Rounds", 284438159, 4],
    ["weapon_revolver_mk2", "Full Metal Jacket Rounds", 231258687, 4],
    ["weapon_revolver_mk2", "Holographic Sight", 1108334355, 3],
    ["weapon_revolver_mk2", "Small Scope", 77277509, 3],
    ["weapon_revolver_mk2", "Flashlight", 899381934, 2],
    ["weapon_revolver_mk2", "Compensator", 654802123, 1],
    ["weapon_revolver_mk2", "Digital Camo", -1069552225, 0],
    ["weapon_revolver_mk2", "Brushstroke Camo", 11918884, 0],
    ["weapon_revolver_mk2", "Woodland Camo", 176157112, 0],
    ["weapon_revolver_mk2", "Skull", 774121627, 0],
    ["weapon_revolver_mk2", "Sessanta Nove", 288456487, 0],
    ["weapon_revolver_mk2", "Perseus", 398658626, 0],
    ["weapon_revolver_mk2", "Leopard", 628697006, 0],
    ["weapon_revolver_mk2", "Zebra", 925911836, 0],
    ["weapon_revolver_mk2", "Geometric", 1222307441, 0],
    ["weapon_revolver_mk2", "Boom!", 552442715, 0],
    ["weapon_revolver_mk2", "Patriotic", -648943513, 0],

    ["weapon_snspistol_mk2", "Tracer Rounds", -1876057490, 4],
    ["weapon_snspistol_mk2", "Incendiary Rounds", -424845447, 4],
    ["weapon_snspistol_mk2", "Hollow Point Rounds", -1928301566, 4],
    ["weapon_snspistol_mk2", "Full Metal Jacket Rounds", -1055790298, 4],
    ["weapon_snspistol_mk2", "Flashlight", 1246324211, 2],
    ["weapon_snspistol_mk2", "Mounted Scope", 2112431491, 3],
    ["weapon_snspistol_mk2", "Suppressor", 1709866683, 1],
    ["weapon_snspistol_mk2", "Compensator", -1434287169, 1],
    ["weapon_snspistol_mk2", "Digital Camo", 259780317, 0],
    ["weapon_snspistol_mk2", "Brushstroke Camo", -1973342474, 0],
    ["weapon_snspistol_mk2", "Woodland Camo", 1996130345, 0],
    ["weapon_snspistol_mk2", "Skull", -1455657812, 0],
    ["weapon_snspistol_mk2", "Sessanta Nove", -1668263084, 0],
    ["weapon_snspistol_mk2", "Perseus", 1308243489, 0],
    ["weapon_snspistol_mk2", "Leopard", 1122574335, 0],
    ["weapon_snspistol_mk2", "Zebra", 1420313469, 0],
    ["weapon_snspistol_mk2", "Geometric", 109848390, 0],
    ["weapon_snspistol_mk2", "Boom!", 593945703, 0],
    ["weapon_snspistol_mk2", "Digital Camo 2", -403805974, 0],
    ["weapon_snspistol_mk2", "Brushstroke Camo 2", 691432737, 0],
    ["weapon_snspistol_mk2", "Woodland Camo 2", 987648331, 0],
    ["weapon_snspistol_mk2", "Skull 2", -431680535, 0],
    ["weapon_snspistol_mk2", "Sessanta Nove 2", -847582310, 0],
    ["weapon_snspistol_mk2", "Perseus 2", -92592218, 0],
    ["weapon_snspistol_mk2", "Leopard 2", -494548326, 0],
    ["weapon_snspistol_mk2", "Zebra 2", 730876697, 0],
    ["weapon_snspistol_mk2", "Geometric 2", 583159708, 0],
    ["weapon_snspistol_mk2", "Boom! 2", 1142457062, 0],
    ["weapon_snspistol_mk2", "Boom! 3", -1928503603, 0],
    ["weapon_snspistol_mk2", "Patriotic", 520557834, 0],

    ["weapon_pistol_mk2", "Tracer Rounds", 634039983, 4],
    ["weapon_pistol_mk2", "Incendiary Rounds", 733837882, 4],
    ["weapon_pistol_mk2", "Hollow Point Rounds", -2046910199, 4],
    ["weapon_pistol_mk2", "Full Metal Jacket Rounds", 1329061674, 4],
    ["weapon_pistol_mk2", "Mounted Scope", -1898661008, 3],
    ["weapon_pistol_mk2", "Flashlight", 1140676955, 2],
    ["weapon_pistol_mk2", "Suppressor", 1709866683, 1],
    ["weapon_pistol_mk2", "Compensator", 568543123, 1],
    ["weapon_pistol_mk2", "Digital Camo", 1550611612, 0],
    ["weapon_pistol_mk2", "Brushstroke Camo", 368550800, 0],
    ["weapon_pistol_mk2", "Woodland Camo", -1769069349, 0],
    ["weapon_pistol_mk2", "Skull", 24902297, 0],
    ["weapon_pistol_mk2", "Sessanta Nove", -228041614, 0],
    ["weapon_pistol_mk2", "Perseus", -584961562, 0],
    ["weapon_pistol_mk2", "Leopard", -1153175946, 0],
    ["weapon_pistol_mk2", "Zebra", 1301287696, 0],
    ["weapon_pistol_mk2", "Geometric", 1597093459, 0],
    ["weapon_pistol_mk2", "Boom!", 1769871776, 0],
    ["weapon_pistol_mk2", "Patriotic", -1827882671, 0],
    ["weapon_pistol_mk2", "Patriotic 2", 1253942266, 0],
    ["weapon_pistol_mk2", "Digital Camo 2", -1258515792, 0],
    ["weapon_pistol_mk2", "Digital Camo 3", 438243936, 0],
    ["weapon_pistol_mk2", "Digital Camo 4", -455079056, 0],
    ["weapon_pistol_mk2", "Digital Camo 5", 740920107, 0],
    ["weapon_pistol_mk2", "Digital Camo 6", -541616347, 0],
    ["weapon_pistol_mk2", "Digital Camo 7", 1809261196, 0],
    ["weapon_pistol_mk2", "Digital Camo 8", -1646538868, 0],
    ["weapon_pistol_mk2", "Digital Camo 9", -1290164948, 0],
    ["weapon_pistol_mk2", "Digital Camo 10", -964465134, 0],
    ["weapon_pistol_mk2", "Digital Camo 11", 1135718771, 0],

    ["weapon_vintagepistol", "Suppressor", -1023114086, 1],
    ["weapon_ceramicpistol", "Suppressor", -1828202758, 1],

    ["weapon_microsmg", "Flashlight", 899381934, 2],
    ["weapon_microsmg", "Scope", -1657815255, 3],
    ["weapon_microsmg", "Suppressor", -1489156508, 1],
    ["weapon_microsmg", "Yusuf Amir Luxury", 1215999497, 0],

    ["weapon_smg", "Scope", 1019656791, 3],
    ["weapon_smg", "Suppressor", -1023114086, 1],
    ["weapon_smg", "Yusuf Amir Luxury", 663170192, 0],

    ["weapon_assaultsmg", "Flashlight", 2076495324, 2],
    ["weapon_assaultsmg", "Scope", -1657815255, 3],
    ["weapon_assaultsmg", "Suppressor", -1489156508, 1],
    ["weapon_assaultsmg", "Yusuf Amir Luxury", 663517359, 0],

    ["weapon_smg_mk2", "Tracer Rounds", 2146055916, 4],
    ["weapon_smg_mk2", "Incendiary Rounds", -644734235, 4],
    ["weapon_smg_mk2", "Hollow Point Rounds", 974903034, 4],
    ["weapon_smg_mk2", "Full Metal Jacket Rounds", 190476639, 4],
    ["weapon_smg_mk2", "Flashlight", 2076495324, 2],
    ["weapon_smg_mk2", "Holographic Sight", -1613015470, 3],
    ["weapon_smg_mk2", "Small Scope", -452809877, 3],
    ["weapon_smg_mk2", "Medium Scope", 1038927834, 3],
    ["weapon_smg_mk2", "Suppressor", -1023114086, 1],
    ["weapon_smg_mk2", "Flat Muzzle Brake", -1181482284, 1],
    ["weapon_smg_mk2", "Tactical Muzzle Brake", -932732805, 1],
    ["weapon_smg_mk2", "Fat-End Muzzle Brake", -569259057, 1],
    ["weapon_smg_mk2", "Precision Muzzle Brake", -326080308, 1],
    ["weapon_smg_mk2", "Heavy Duty Muzzle Brake", 48731514, 1],
    ["weapon_smg_mk2", "Slanted Muzzle Brake", 880736428, 1],
    ["weapon_smg_mk2", "Split-End Muzzle Brake", 1303784126, 1],
    ["weapon_smg_mk2", "Digital Camo", -996700057, 0],
    ["weapon_smg_mk2", "Brushstroke Camo", 940943685, 0],
    ["weapon_smg_mk2", "Woodland Camo", 1263226800, 0],
    ["weapon_smg_mk2", "Skull", -328035840, 0],
    ["weapon_smg_mk2", "Sessanta Nove", 1224100642, 0],
    ["weapon_smg_mk2", "Perseus", 899228776, 0],
    ["weapon_smg_mk2", "Leopard", 616006309, 0],
    ["weapon_smg_mk2", "Zebra", -1561952511, 0],
    ["weapon_smg_mk2", "Geometric", 572063080, 0],
    ["weapon_smg_mk2", "Boom!", 1170588613, 0],
    ["weapon_smg_mk2", "Patriotic", 966612367, 0],

    ["weapon_machinepistol", "Suppressor", -1023114086, 1],

    ["weapon_combatpdw", "Flashlight", 2076495324, 2],
    ["weapon_combatpdw", "Grip", 202788691, 5],
    ["weapon_combatpdw", "Scope", -1439939148, 3],

    ["weapon_pumpshotgun", "Flashlight", 2076495324, 2],
    ["weapon_pumpshotgun", "Suppressor", -435637410, 1],
    ["weapon_pumpshotgun", "Yusuf Amir Luxury", -1562927653, 0],

    ["weapon_sawnoffshotgun", "Gilded Gun Metal", -2052698631, 0],

    ["weapon_assaultshotgun", "Flashlight", 2076495324, 2],
    ["weapon_assaultshotgun", "Suppressor", -2089531990, 1],
    ["weapon_assaultshotgun", "Grip", 202788691, 5],

    ["weapon_bullpupshotgun", "Flashlight", 2076495324, 2],
    ["weapon_bullpupshotgun", "Suppressor", -1489156508, 1],
    ["weapon_bullpupshotgun", "Grip", 202788691, 5],

    ["weapon_pumpshotgun_mk2", "Default Shells", -845938367, 4],
    ["weapon_pumpshotgun_mk2", "Dragon's Breath Shells", -1618338827, 4],
    ["weapon_pumpshotgun_mk2", "Steel Buckshot Shells", 1315288101, 4],
    ["weapon_pumpshotgun_mk2", "Flechette Shells", -380098265, 4],
    ["weapon_pumpshotgun_mk2", "Explosive Slugs", 1004815965, 4],
    ["weapon_pumpshotgun_mk2", "Holographic Sight", 1108334355, 3],
    ["weapon_pumpshotgun_mk2", "Small Scope", 77277509, 3],
    ["weapon_pumpshotgun_mk2", "Medium Scope", 1060929921, 3],
    ["weapon_pumpshotgun_mk2", "Flashlight", 2076495324, 2],
    ["weapon_pumpshotgun_mk2", "Suppressor", -1404903567, 1],
    ["weapon_pumpshotgun_mk2", "Squared Muzzle Brake", 1602080333, 1],
    ["weapon_pumpshotgun_mk2", "Digital Camo", -474112444, 0],
    ["weapon_pumpshotgun_mk2", "Brushstroke Camo", 387223451, 0],
    ["weapon_pumpshotgun_mk2", "Woodland Camo", 617753366, 0],
    ["weapon_pumpshotgun_mk2", "Skull", -222378256, 0],
    ["weapon_pumpshotgun_mk2", "Sessanta Nove", 8741501, 0],
    ["weapon_pumpshotgun_mk2", "Perseus", -601286203, 0],
    ["weapon_pumpshotgun_mk2", "Leopard", -511433605, 0],
    ["weapon_pumpshotgun_mk2", "Zebra", -655387818, 0],
    ["weapon_pumpshotgun_mk2", "Geometric", -282476598, 0],
    ["weapon_pumpshotgun_mk2", "Boom!", 1739501925, 0],
    ["weapon_pumpshotgun_mk2", "Patriotic", 1178671645, 0],

    ["weapon_heavyshotgun", "Flashlight", 2076495324, 2],
    ["weapon_heavyshotgun", "Suppressor", -1489156508, 1],
    ["weapon_heavyshotgun", "Grip", 202788691, 5],

    ["weapon_assaultrifle", "Flashlight", 2076495324, 2],
    ["weapon_assaultrifle", "Scope", -1657815255, 3],
    ["weapon_assaultrifle", "Suppressor", -1489156508, 1],
    ["weapon_assaultrifle", "Grip", 202788691, 5],
    ["weapon_assaultrifle", "Yusuf Amir Luxury", 1319990579, 0],

    ["weapon_carbinerifle", "Flashlight", 2076495324, 2],
    ["weapon_carbinerifle", "Scope", -1596416958, 3],
    ["weapon_carbinerifle", "Suppressor", -2089531990, 1],
    ["weapon_carbinerifle", "Grip", 202788691, 5],
    ["weapon_carbinerifle", "Yusuf Amir Luxury", -660892072, 0],

    ["weapon_advancedrifle", "Flashlight", 2076495324, 2],
    ["weapon_advancedrifle", "Scope", -1439939148, 3],
    ["weapon_advancedrifle", "Suppressor", -2089531990, 1],
    ["weapon_advancedrifle", "Gilded Gun Metal", 930927479, 0],

    ["weapon_specialcarbine", "Flashlight", 2076495324, 2],
    ["weapon_specialcarbine", "Scope", -1596416958, 3],
    ["weapon_specialcarbine", "Suppressor", -1489156508, 1],
    ["weapon_specialcarbine", "Grip", 202788691, 5],
    ["weapon_specialcarbine", "Etched Gun Metal", 1929467122, 0],

    ["weapon_bullpuprifle", "Flashlight", 2076495324, 2],
    ["weapon_bullpuprifle", "Scope", -1439939148, 3],
    ["weapon_bullpuprifle", "Suppressor", -2089531990, 1],
    ["weapon_bullpuprifle", "Grip", 202788691, 5],
    ["weapon_bullpuprifle", "Gilded Gun Metal", -1470645128, 0],

    ["weapon_bullpuprifle_mk2", "Tracer Rounds", -2111807319, 4],
    ["weapon_bullpuprifle_mk2", "Incendiary Rounds", -1449330342, 4],
    ["weapon_bullpuprifle_mk2", "Armor Piercing Rounds", -89655827, 4],
    ["weapon_bullpuprifle_mk2", "Full Metal Jacket Rounds", 1130501904, 4],
    ["weapon_bullpuprifle_mk2", "Flashlight", 2076495324, 2],
    ["weapon_bullpuprifle_mk2", "Holographic Sight", 1108334355, 3],
    ["weapon_bullpuprifle_mk2", "Small Scope", -944910075, 3],
    ["weapon_bullpuprifle_mk2", "Medium Scope", 1060929921, 3],
    ["weapon_bullpuprifle_mk2", "Suppressor", -2089531990, 1],
    ["weapon_bullpuprifle_mk2", "Flat Muzzle Brake", -1181482284, 1],
    ["weapon_bullpuprifle_mk2", "Tactical Muzzle Brake", -932732805, 1],
    ["weapon_bullpuprifle_mk2", "Fat-End Muzzle Brake", -569259057, 1],
    ["weapon_bullpuprifle_mk2", "Precision Muzzle Brake", -326080308, 1],
    ["weapon_bullpuprifle_mk2", "Heavy Duty Muzzle Brake", 48731514, 1],
    ["weapon_bullpuprifle_mk2", "Slanted Muzzle Brake", 880736428, 1],
    ["weapon_bullpuprifle_mk2", "Split-End Muzzle Brake", 1303784126, 1],
    ["weapon_bullpuprifle_mk2", "Grip", -1654288262, 5],
    ["weapon_bullpuprifle_mk2", "Digital Camo", -1371515465, 0],
    ["weapon_bullpuprifle_mk2", "Brushstroke Camo", -1190793877, 0],
    ["weapon_bullpuprifle_mk2", "Woodland Camo", -1497085720, 0],
    ["weapon_bullpuprifle_mk2", "Skull", -1803148180, 0],
    ["weapon_bullpuprifle_mk2", "Sessanta Nove", -1975971886, 0],
    ["weapon_bullpuprifle_mk2", "Perseus", 36929477, 0],
    ["weapon_bullpuprifle_mk2", "Leopard", -268444834, 0],
    ["weapon_bullpuprifle_mk2", "Zebra", -574769446, 0],
    ["weapon_bullpuprifle_mk2", "Geometric", -882699739, 0],
    ["weapon_bullpuprifle_mk2", "Boom!", -1468181474, 0],
    ["weapon_bullpuprifle_mk2", "Patriotic", -974541230, 0],

    ["weapon_specialcarbine_mk2", "Tracer Rounds", -2023373174, 4],
    ["weapon_specialcarbine_mk2", "Incendiary Rounds", -570355066, 4],
    ["weapon_specialcarbine_mk2", "Armor Piercing Rounds", 1362433589, 4],
    ["weapon_specialcarbine_mk2", "Full Metal Jacket Rounds", 1346235024, 4],
    ["weapon_specialcarbine_mk2", "Flashlight", 2076495324, 2],
    ["weapon_specialcarbine_mk2", "Holographic Sight", 1108334355, 3],
    ["weapon_specialcarbine_mk2", "Small Scope", 77277509, 3],
    ["weapon_specialcarbine_mk2", "Large Scope", -966040254, 3],
    ["weapon_specialcarbine_mk2", "Suppressor", -1489156508, 1],
    ["weapon_specialcarbine_mk2", "Flat Muzzle Brake", -1181482284, 1],
    ["weapon_specialcarbine_mk2", "Tactical Muzzle Brake", -932732805, 1],
    ["weapon_specialcarbine_mk2", "Fat-End Muzzle Brake", -569259057, 1],
    ["weapon_specialcarbine_mk2", "Precision Muzzle Brake", -326080308, 1],
    ["weapon_specialcarbine_mk2", "Heavy Duty Muzzle Brake", 48731514, 1],
    ["weapon_specialcarbine_mk2", "Slanted Muzzle Brake", 880736428, 1],
    ["weapon_specialcarbine_mk2", "Split-End Muzzle Brake", 1303784126, 1],
    ["weapon_specialcarbine_mk2", "Grip", -1654288262, 5],
    ["weapon_specialcarbine_mk2", "Digital Camo", -737430213, 0],
    ["weapon_specialcarbine_mk2", "Brushstroke Camo", 1125852043, 0],
    ["weapon_specialcarbine_mk2", "Woodland Camo", 886015732, 0],
    ["weapon_specialcarbine_mk2", "Skull", -1262287139, 0],
    ["weapon_specialcarbine_mk2", "Sessanta Nove", -295208411, 0],
    ["weapon_specialcarbine_mk2", "Perseus", -544154504, 0],
    ["weapon_specialcarbine_mk2", "Leopard", 172765678, 0],
    ["weapon_specialcarbine_mk2", "Zebra", -1982877449, 0],
    ["weapon_specialcarbine_mk2", "Geometric", 2072122460, 0],
    ["weapon_specialcarbine_mk2", "Boom!", -1986220171, 0],
    ["weapon_specialcarbine_mk2", "Patriotic", 1377355801, 0],

    ["weapon_assaultrifle_mk2", "Tracer Rounds", -282298175, 4],
    ["weapon_assaultrifle_mk2", "Incendiary Rounds", -76490669, 4],
    ["weapon_assaultrifle_mk2", "Armor Piercing Rounds", -1478681000, 4],
    ["weapon_assaultrifle_mk2", "Full Metal Jacket Rounds", 1675665560, 4],
    ["weapon_assaultrifle_mk2", "Flashlight", 2076495324, 2],
    ["weapon_assaultrifle_mk2", "Holographic Sight", 1108334355, 3],
    ["weapon_assaultrifle_mk2", "Small Scope", 77277509, 3],
    ["weapon_assaultrifle_mk2", "Large Scope", -966040254, 3],
    ["weapon_assaultrifle_mk2", "Suppressor", -1489156508, 1],
    ["weapon_assaultrifle_mk2", "Flat Muzzle Brake", -1181482284, 1],
    ["weapon_assaultrifle_mk2", "Tactical Muzzle Brake", -932732805, 1],
    ["weapon_assaultrifle_mk2", "Fat-End Muzzle Brake", -569259057, 1],
    ["weapon_assaultrifle_mk2", "Precision Muzzle Brake", -326080308, 1],
    ["weapon_assaultrifle_mk2", "Heavy Duty Muzzle Brake", 48731514, 1],
    ["weapon_assaultrifle_mk2", "Slanted Muzzle Brake", 880736428, 1],
    ["weapon_assaultrifle_mk2", "Split-End Muzzle Brake", 1303784126, 1],
    ["weapon_assaultrifle_mk2", "Grip", -1654288262, 5],
    ["weapon_assaultrifle_mk2", "Digital Camo", -1860492113, 0],
    ["weapon_assaultrifle_mk2", "Brushstroke Camo", 937772107, 0],
    ["weapon_assaultrifle_mk2", "Woodland Camo", 1401650071, 0],
    ["weapon_assaultrifle_mk2", "Skull", 628662130, 0],
    ["weapon_assaultrifle_mk2", "Sessanta Nove", -985047251, 0],
    ["weapon_assaultrifle_mk2", "Perseus", -812944463, 0],
    ["weapon_assaultrifle_mk2", "Leopard", -1447352303, 0],
    ["weapon_assaultrifle_mk2", "Zebra", -60338860, 0],
    ["weapon_assaultrifle_mk2", "Geometric", 2088750491, 0],
    ["weapon_assaultrifle_mk2", "Boom!", -1513913454, 0],
    ["weapon_assaultrifle_mk2", "Patriotic", -1179558480, 0],

    ["weapon_carbinerifle_mk2", "Tracer Rounds", 391640422, 4],
    ["weapon_carbinerifle_mk2", "Incendiary Rounds", 1025884839, 4],
    ["weapon_carbinerifle_mk2", "Armor Piercing Rounds", 626875735, 4],
    ["weapon_carbinerifle_mk2", "Full Metal Jacket Rounds", 1141059345, 4],
    ["weapon_carbinerifle_mk2", "Flashlight", 2076495324, 2],
    ["weapon_carbinerifle_mk2", "Holographic Sight", 1108334355, 3],
    ["weapon_carbinerifle_mk2", "Small Scope", 77277509, 3],
    ["weapon_carbinerifle_mk2", "Large Scope", -966040254, 3],
    ["weapon_carbinerifle_mk2", "Suppressor", -2089531990, 1],
    ["weapon_carbinerifle_mk2", "Flat Muzzle Brake", -1181482284, 1],
    ["weapon_carbinerifle_mk2", "Tactical Muzzle Brake", -932732805, 1],
    ["weapon_carbinerifle_mk2", "Fat-End Muzzle Brake", -569259057, 1],
    ["weapon_carbinerifle_mk2", "Precision Muzzle Brake", -326080308, 1],
    ["weapon_carbinerifle_mk2", "Heavy Duty Muzzle Brake", 48731514, 1],
    ["weapon_carbinerifle_mk2", "Slanted Muzzle Brake", 880736428, 1],
    ["weapon_carbinerifle_mk2", "Split-End Muzzle Brake", 1303784126, 1],
    ["weapon_carbinerifle_mk2", "Grip", -1654288262, 5],
    ["weapon_carbinerifle_mk2", "Digital Camo", 1272803094, 0],
    ["weapon_carbinerifle_mk2", "Brushstroke Camo", 1080719624, 0],
    ["weapon_carbinerifle_mk2", "Woodland Camo", 792221348, 0],
    ["weapon_carbinerifle_mk2", "Skull", -452181427, 0],
    ["weapon_carbinerifle_mk2", "Sessanta Nove", -746774737, 0],
    ["weapon_carbinerifle_mk2", "Perseus", -2044296061, 0],
    ["weapon_carbinerifle_mk2", "Leopard", -199171978, 0],
    ["weapon_carbinerifle_mk2", "Zebra", -1428075016, 0],
    ["weapon_carbinerifle_mk2", "Geometric", -1735153315, 0],
    ["weapon_carbinerifle_mk2", "Boom!", 1796459838, 0],
    ["weapon_carbinerifle_mk2", "Patriotic", -631911105, 0],

    ["weapon_mg", "Scope", 1006677997, 3],
    ["weapon_mg", "Yusuf Amir Luxury", -690308418, 0],

    ["weapon_combatmg", "Scope", -1596416958, 3],
    ["weapon_combatmg", "Grip", 202788691, 5],
    ["weapon_combatmg", "Etched Gun Metal", -1828795171, 0],

    ["weapon_combatmg_mk2", "Tracer Rounds", -161179835, 4],
    ["weapon_combatmg_mk2", "Incendiary Rounds", -1020871238, 4],
    ["weapon_combatmg_mk2", "Armor Piercing Rounds", 696788003, 4],
    ["weapon_combatmg_mk2", "Full Metal Jacket Rounds", 1475288264, 4],
    ["weapon_combatmg_mk2", "Holographic Sight", 1108334355, 3],
    ["weapon_combatmg_mk2", "Medium Scope", 1060929921, 3],
    ["weapon_combatmg_mk2", "Large Scope", -966040254, 3],
    ["weapon_combatmg_mk2", "Flat Muzzle Brake", -1181482284, 1],
    ["weapon_combatmg_mk2", "Tactical Muzzle Brake", -932732805, 1],
    ["weapon_combatmg_mk2", "Fat-End Muzzle Brake", -569259057, 1],
    ["weapon_combatmg_mk2", "Precision Muzzle Brake", -326080308, 1],
    ["weapon_combatmg_mk2", "Heavy Duty Muzzle Brake", 48731514, 1],
    ["weapon_combatmg_mk2", "Slanted Muzzle Brake", 880736428, 1],
    ["weapon_combatmg_mk2", "Split-End Muzzle Brake", 1303784126, 1],
    ["weapon_combatmg_mk2", "Grip", -1654288262, 5],
    ["weapon_combatmg_mk2", "Digital Camo", 1249283253, 0],
    ["weapon_combatmg_mk2", "Brushstroke Camo", -857707587, 0],
    ["weapon_combatmg_mk2", "Woodland Camo", -1097543898, 0],
    ["weapon_combatmg_mk2", "Skull", 1980349969, 0],
    ["weapon_combatmg_mk2", "Sessanta Nove", 1219453777, 0],
    ["weapon_combatmg_mk2", "Perseus", -1853459190, 0],
    ["weapon_combatmg_mk2", "Leopard", -2074781016, 0],
    ["weapon_combatmg_mk2", "Zebra", 457967755, 0],
    ["weapon_combatmg_mk2", "Geometric", 235171324, 0],
    ["weapon_combatmg_mk2", "Boom!", 42685294, 0],
    ["weapon_combatmg_mk2", "Patriotic", -687617715, 0],

    ["weapon_sniperrifle", "Scope", -767279652, 3],
    ["weapon_sniperrifle", "Advanced Scope", -1135289737, 3],
    ["weapon_sniperrifle", "Etched Gun Metal", 1077065191, 0],

    ["weapon_heavysniper", "Scope", -767279652, 3],
    ["weapon_heavysniper", "Advanced Scope", -1135289737, 3],

    ["weapon_marksmanrifle_mk2", "Tracer Rounds", -679861550, 4],
    ["weapon_marksmanrifle_mk2", "Incendiary Rounds", 1842849902, 4],
    ["weapon_marksmanrifle_mk2", "Armor Piercing Rounds", -193998727, 4],
    ["weapon_marksmanrifle_mk2", "Full Metal Jacket Rounds", -515203373, 4],
    ["weapon_marksmanrifle_mk2", "Flashlight", 2076495324, 2],
    ["weapon_marksmanrifle_mk2", "Holographic Sight", 1108334355, 3],
    ["weapon_marksmanrifle_mk2", "Zoom Scope", 1528590652, 3],
    ["weapon_marksmanrifle_mk2", "Large Scope", -966040254, 3],
    ["weapon_marksmanrifle_mk2", "Suppressor", -2089531990, 1],
    ["weapon_marksmanrifle_mk2", "Flat Muzzle Brake", -1181482284, 1],
    ["weapon_marksmanrifle_mk2", "Tactical Muzzle Brake", -932732805, 1],
    ["weapon_marksmanrifle_mk2", "Fat-End Muzzle Brake", -569259057, 1],
    ["weapon_marksmanrifle_mk2", "Precision Muzzle Brake", -326080308, 1],
    ["weapon_marksmanrifle_mk2", "Heavy Duty Muzzle Brake", 48731514, 1],
    ["weapon_marksmanrifle_mk2", "Slanted Muzzle Brake", 880736428, 1],
    ["weapon_marksmanrifle_mk2", "Split-End Muzzle Brake", 1303784126, 1],
    ["weapon_marksmanrifle_mk2", "Grip", -1654288262, 5],
    ["weapon_marksmanrifle_mk2", "Digital Camo", -1869284448, 0],
    ["weapon_marksmanrifle_mk2", "Brushstroke Camo", 1931539634, 0],
    ["weapon_marksmanrifle_mk2", "Woodland Camo", 1624199183, 0],
    ["weapon_marksmanrifle_mk2", "Skull", -26834113, 0],
    ["weapon_marksmanrifle_mk2", "Sessanta Nove", -210406055, 0],
    ["weapon_marksmanrifle_mk2", "Perseus", 423313640, 0],
    ["weapon_marksmanrifle_mk2", "Leopard", 276639596, 0],
    ["weapon_marksmanrifle_mk2", "Zebra", -991356863, 0],
    ["weapon_marksmanrifle_mk2", "Geometric", -1682848301, 0],
    ["weapon_marksmanrifle_mk2", "Boom!", 996213771, 0],
    ["weapon_marksmanrifle_mk2", "Boom! 2", -1214048550, 0],

    ["weapon_heavysniper_mk2", "Incendiary Rounds", 247526935, 4],
    ["weapon_heavysniper_mk2", "Armor Piercing Rounds", -130689324, 4],
    ["weapon_heavysniper_mk2", "Full Metal Jacket Rounds", 1005144310, 4],
    ["weapon_heavysniper_mk2", "Explosive Rounds", -1981031769, 4],
    ["weapon_heavysniper_mk2", "Thermal Scope", 776198721, 3],
    ["weapon_heavysniper_mk2", "Night Vision Scope", -1233121104, 3],
    ["weapon_heavysniper_mk2", "Zoom Scope", -2101279869, 3],
    ["weapon_heavysniper_mk2", "Advanced Scope", -1135289737, 3],
    ["weapon_heavysniper_mk2", "Suppressor", -1404903567, 1],

    ["weapon_heavysniper_mk2", "Digital Camo", -130843390, 0],
    ["weapon_heavysniper_mk2", "Brushstroke Camo", -977347227, 0],
    ["weapon_heavysniper_mk2", "Woodland Camo", -378461067, 0],
    ["weapon_heavysniper_mk2", "Skull", 329939175, 0],
    ["weapon_heavysniper_mk2", "Sessanta Nove", 643374672, 0],
    ["weapon_heavysniper_mk2", "Perseus", 807875052, 0],
    ["weapon_heavysniper_mk2", "Leopard", -1401804168, 0],
    ["weapon_heavysniper_mk2", "Zebra", -1096495395, 0],
    ["weapon_heavysniper_mk2", "Geometric", -847811454, 0],
    ["weapon_heavysniper_mk2", "Boom!", -1413108537, 0],
    ["weapon_heavysniper_mk2", "Patriotic", 1815270123, 0],

    ["weapon_marksmanrifle", "Flashlight", 2076495324, 2],
    ["weapon_marksmanrifle", "Scope", 471997210, 3],
    ["weapon_marksmanrifle", "Suppressor", -2089531990, 1],
    ["weapon_marksmanrifle", "Grip", 202788691, 5],
    ["weapon_marksmanrifle", "Yusuf Amir Luxury", 371102273, 0],

    ["weapon_grenadelauncher", "Flashlight", 2076495324, 2],
    ["weapon_grenadelauncher", "Grip", 202788691, 5],
    ["weapon_grenadelauncher", "Scope", -1439939148, 3],
];

weapons.getHashByName = function(name) {
    let hash = 0;
    weapons.hashesMap.forEach(item => {
        if (item[0] == name)
            hash = item[1] / 2;
    });
    return hash;
};

/*
1 - Надульник (Глушитель, Компенсатор и тд) - Suppressor / Compensator
2 - Фонарик, Лазерный прицел (Если есть) - Flashlight
3 - Прицел - Scope
5 - Рукоятка - Grip
* */

weapons.getUpgradeSlot = function(weaponName, hash) {

    let result = -1;
    weapons.components.forEach(item => {
        if (item[0] == weaponName && hash == item[2])
            result = item[3];
    });

    switch (result) {
        case 1:
            return 1;
        case 2:
            return 2;
        case 5:
            return 3;
        case 3:
            return 4;
    }
    return -1;
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

weapons.getGunAmmoNameByItemId = function(itemId) {
    return weapons.getGunAmmoId(items.getItemNameHashById(itemId));
};

weapons.getWeaponSerial = function(itemId) {
    let slot = weapons.getGunSlotIdByItem(itemId);
    let prefix = 'UN';

    switch (slot) {
        case 1:
            prefix = 'RL';
            break;
        case 2:
            prefix = 'SG';
            break;
        case 3:
            prefix = 'HG';
            break;
        case 4:
            prefix = 'SM';
            break;
        case 5:
            prefix = 'HD';
            break;
    }

    prefix = prefix + weather.getYear();
    let number = methods.getTimeStampFull().toString().substr(2);
    return `${prefix}-${number}`;
};

weapons.getGunAmmoId = function(name) {
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
        case 'weapon_ceramicpistol':
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