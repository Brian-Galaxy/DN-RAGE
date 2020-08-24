let methods = require('../modules/methods');

let enums = require('../enums');
let user = require('../user');
let inventory = require('../inventory');

let cloth = require('../business/cloth');
let tattoo = require('../business/tattoo');
let lsc = require('../business/lsc');
let gun = require('../business/gun');
let vShop = require('../business/vShop');
let carWash = require('../business/carWash');
let rent = require('../business/rent');
let bar = require('../business/bar');
let barberShop = require('../business/barberShop');
let bank = require('../business/bank');
let shop = require('../business/shop');

let gangZone = require('./gangZone');
let racer = require('./racer');

let wheel = require('../casino/wheel');

let business = require('../property/business');
let vehicles = require('../property/vehicles');

let pickups = exports;
let distanceCheck = 1.4;

pickups.Red = [244, 67, 54, 100];
pickups.Green = [139, 195, 74, 100];
pickups.Blue = [33, 150, 243, 100];
pickups.Yellow = [255, 235, 59, 100];
pickups.Blue100 = [187, 222, 251, 100];
pickups.White = [255, 255, 255, 100];
pickups.Tranparent = [255, 255, 255, 0];

pickups.BotRole0 = new mp.Vector3(-414.9725036621094, -2644.56201171875, 5.000218868255615);
pickups.BotRoleAll = new mp.Vector3(-1287.615, -561.1155, 30.71216);
pickups.QuestBotGang = new mp.Vector3(-219.3651123046875, -1367.4730224609375, 30.25823402404785);

pickups.BotSellGun = new mp.Vector3(1073.064453125, -2008.584228515625, 31.08465576171875);
pickups.BotSellCloth = new mp.Vector3(707.1924438476562, -966.2482299804688, 29.412853240966797);

pickups.SellVehicle = new mp.Vector3(-1654.048583984375, -947.2221069335938, 6.747209548950195);

pickups.FixWeapon1 = new mp.Vector3(2710.799560546875, -354.3301696777344, -56.18671798706055);
pickups.FixWeapon2 = new mp.Vector3(203.61666870117188, 5192.0439453125, -89.5973129272461);

pickups.PrintShopPos = new mp.Vector3(-1234.7786865234375, -1477.7230224609375, 3.324739933013916);
pickups.MazeBankLobby = new mp.Vector3(-252.2621, -2003.149, 29.1459);
pickups.WheelLuckyPos = new mp.Vector3(1109.76, 227.89, -49.64);

pickups.BankMazeLiftOfficePos = new mp.Vector3(-77.77799, -829.6542, 242.3859);
pickups.BankMazeLiftStreetPos = new mp.Vector3(-66.66476, -802.0474, 43.22729);
pickups.BankMazeLiftRoofPos = new mp.Vector3(-67.13605, -821.9, 320.2874);
pickups.BankMazeLiftGaragePos = new mp.Vector3(-84.9765, -818.7122, 35.02804);
pickups.BankMazeOfficePos1 = new mp.Vector3(-72.80013, -816.4397, 242.3859);
pickups.BankMazeOfficePos2 = new mp.Vector3(-1381.6627197265625, -477.76763916015625, 71.04210662841797);

pickups.Gov1LiftPos1 = new mp.Vector3(-1307.21, -557.8224, 19.80232);
pickups.Gov1LiftPos2 = new mp.Vector3(-1307.158, -562.1249, 29.57268);
pickups.Gov1LiftPos3 = new mp.Vector3(-1307.158, -562.1249, 33.37);
pickups.Gov1LiftPos4 = new mp.Vector3(-1307.158, -562.1249, 36.37);

pickups.Gov2LiftPos1 = new mp.Vector3(-1309.314, -559.36, 19.80251);
pickups.Gov2LiftPos2 = new mp.Vector3(-1309.117, -563.9031, 29.57294);
pickups.Gov2LiftPos3 = new mp.Vector3(-1309.117, -563.9031, 33.37);
pickups.Gov2LiftPos4 = new mp.Vector3(-1309.117, -563.9031, 36.37);
pickups.Gov2LiftPos5 = new mp.Vector3(-1309.117, -563.9031, 40.19);

pickups.Builder3Pos1 = new mp.Vector3(-158.1335, -940.4475, 29.07765);
pickups.Builder3Pos2 = new mp.Vector3(-158.1225, -940.4036, 113.3513);
pickups.Builder3Pos3 = new mp.Vector3(-158.0644, -940.4244, 268.2277);

pickups.Builder4Pos1 = new mp.Vector3(-159.4984, -944.1298, 29.07765);
pickups.Builder4Pos2 = new mp.Vector3(-159.3199, -944.1606, 113.3277);
pickups.Builder4Pos3 = new mp.Vector3(-159.5894, -944.1558, 268.2277);

pickups.DispatcherPos1 = new mp.Vector3(443.6864013671875, -975.92333984375, 34.93109130859375);
pickups.DispatcherPos2 = new mp.Vector3(437.31390380859375, -983.1475830078125, 34.93111038208008);
pickups.DispatcherPos3 = new mp.Vector3(443.7832946777344, -983.318603515625, 34.931121826171875);
pickups.DispatcherPos4 = new mp.Vector3(437.0284118652344, -975.5953369140625, 34.93110275268555);
pickups.DispatcherPos5 = new mp.Vector3(-450.4728088378906, 6009.7578125, 35.50712966918945);
pickups.DispatcherPos6 = new mp.Vector3(-449.068115234375, 6008.1572265625, 35.5079460144043);

pickups.CasinoLiftStreetPos = new mp.Vector3(935.5374755859375, 46.44008255004883, 80.09577178955078);
pickups.CasinoLiftBalconPos = new mp.Vector3(964.3539428710938, 58.81953048706055, 111.5530014038086);
pickups.CasinoLiftRoofPos = new mp.Vector3(972.0299072265625, 52.14411163330078, 119.24087524414062);
pickups.CasinoLiftInPos = new mp.Vector3(1089.85009765625, 206.42514038085938, -49.99974822998047);
pickups.CasinoLiftCondoPos = new mp.Vector3(2518.663330078125, -259.46478271484375, -40.122894287109375);

pickups.UsmcPickupPos1 = new mp.Vector3(556.7109375, -3119.0224609375, 17.768596649169922);
pickups.UsmcPickupPos2 = new mp.Vector3(556.9027709960938, -3120.732177734375, 17.76858139038086);
pickups.UsmcPickupPos11 = new mp.Vector3(581.3382568359375, -3119.184814453125, 17.76858901977539);
pickups.UsmcPickupPos12 = new mp.Vector3(581.3219604492188, -3120.65625, 17.768583297729492);

pickups.EmsPickupPos1 = new mp.Vector3(321.07550048828125, -558.7384033203125, 27.743440628051758);
pickups.EmsPickupPos2 = new mp.Vector3(329.96148681640625, -600.9091796875, 42.284019470214844);

pickups.LifeInvaderShopPos = new mp.Vector3(-1083.074, -248.3521, 36.76329);

pickups.MeriaUpPos = new mp.Vector3(-1395.997, -479.8439, 71.04215);
pickups.MeriaDownPos = new mp.Vector3(-1379.659, -499.748, 32.15739);
pickups.MeriaRoofPos = new mp.Vector3(-1369, -471.5994, 83.44699);
pickups.MeriaGarPos = new mp.Vector3(-1360.679, -471.8841, 30.59572);
pickups.MeriaGarderobPos = new mp.Vector3(-1300.886, -555.9606, 29.56678);
pickups.MeriaHelpPos = new mp.Vector3(-1290.544, -571.1852, 29.57288);
//pickups.MeriaKeyPos = new mp.Vector3(-1381.507, -466.2556, 71.04215);

pickups.FibArsenalPos = new mp.Vector3(130.9275665283203, -762.3977661132812, 241.15185546875);
pickups.FibLift0StationPos = new mp.Vector3(122.9873, -741.1865, 32.13323);
pickups.FibLift1StationPos = new mp.Vector3(136.2213, -761.6816, 44.75201);
pickups.FibLift2StationPos = new mp.Vector3(136.2213, -761.6816, 241.152);
pickups.FibLift3StationPos = new mp.Vector3(114.9807, -741.8279, 257.1521);
pickups.FibLift4StationPos = new mp.Vector3(141.4099, -735.3376, 261.8516);

pickups.Garage11Pos = new mp.Vector3(-852.534912109375, 284.400146484375, 32.934879302978516);
pickups.Garage12Pos = new mp.Vector3(-852.5341186523438, 284.3998718261719, 27.59111976623535);
pickups.Garage13Pos = new mp.Vector3(-852.533935546875, 284.3995056152344, 22.23737335205078);

pickups.Garage21Pos = new mp.Vector3(-812.2706909179688, 313.9342346191406, 32.92332458496094);
pickups.Garage22Pos = new mp.Vector3(-812.27001953125, 313.9339294433594, 27.591726303100586);
pickups.Garage23Pos = new mp.Vector3(-812.2694091796875, 313.9336242675781, 22.237457275390625);

pickups.SapdGarderobPos = new mp.Vector3(455.5185, -988.6027, 29.6896);
pickups.SapdArsenalPos = new mp.Vector3(452.057, -980.2347, 29.6896);
pickups.SapdClearPos = new mp.Vector3(440.5925, -975.6348, 29.69);
pickups.SapdArrestPos = new mp.Vector3(459.6778, -989.071, 23.91487);

pickups.SapdGarderobPos2 = new mp.Vector3(-1624.0841064453125, -1034.327880859375, 12.145439147949219);
pickups.SapdArsenalPos2 = new mp.Vector3(-1622.6483154296875, -1026.671630859375, 12.145439147949219);
pickups.SapdClearPos2 = new mp.Vector3(-1635.525634765625, -1023.0807495117188, 12.145432472229004);
pickups.SapdArrestPos2 = new mp.Vector3(-1635.100830078125, -1025.2091064453125, 12.145439147949219);

pickups.SapdGarderobPos3 = new mp.Vector3(-1097.8690185546875, -831.8457641601562, 13.282807350158691);
pickups.SapdArsenalPos3 = new mp.Vector3(-1102.858154296875, -829.5343627929688, 13.282805442810059);
pickups.SapdClearPos3 = new mp.Vector3(-1097.077392578125, -818.5704956054688, 18.036235809326172);
pickups.SapdArrestPos3 = new mp.Vector3(-1092.097900390625, -825.7545166015625, 18.0374774932861338);

pickups.SapdToCyberRoomPos = new mp.Vector3(464.357, -983.8818, 34.89194);
pickups.SapdFromCyberRoomPos = new mp.Vector3(463.7193, -1003.186, 31.7847);
pickups.SapdToBalconPos = new mp.Vector3(464.63787841796875, -983.9490966796875, 34.891876220703125);
pickups.SapdFromBalconPos = new mp.Vector3(463.5898, -1012.111, 31.9835);
pickups.SapdToBalcon2Pos = new mp.Vector3(428.4888, -995.2952, 34.68689);
pickups.SapdFromBalcon2Pos = new mp.Vector3(464.1708, -984.0346, 38.89184);
pickups.SapdToInterrogationPos = new mp.Vector3(404.0302, -997.302, -100.004);
pickups.SapdFromInterrogationPos = new mp.Vector3(446.7996, -985.8127, 25.67422);
pickups.SapdToVespucci1Pos = new mp.Vector3(-1057.84033203125, -841.1256103515625, 4.042362689971924);
pickups.SapdToVespucci2Pos = new mp.Vector3(-1096.1251220703125, -850.3330688476562, 37.242401123046875);
pickups.SapdToVespucci21Pos = new mp.Vector3(-1048.919677734375, -831.666015625, 9.877243041992188);
pickups.SapdToVespucci22Pos = new mp.Vector3(-1066.0433349609375, -833.7608032226562, 18.035497665405273);

pickups.UsmcArsenalPos1 = new mp.Vector3(467.41082763671875, -3212.53857421875, 6.056998729705816);
pickups.UsmcArsenalPos2 = new mp.Vector3(3095.942626953125, -4707.86181640625, 11.244044303894043);

pickups.SapdStockPos = new mp.Vector3(458.4720764160156, -993.0488891601562, 29.689321517944336);
pickups.SapdStockPos2 = new mp.Vector3(-1622.5550537109375, -1035.54931640625, 12.145441055297852);
pickups.SapdStockPos3 = new mp.Vector3(-1093.514892578125, -832.4876708984375, 13.283369064331055);
pickups.Bcsd1StockPos = new mp.Vector3(-439.0313720703125, 6010.5322265625, 26.985639572143555);
pickups.Bcsd2StockPos = new mp.Vector3(1855.5472412109375, 3699.1943359375, 33.267086029052734);
pickups.UsmcStockPos = new mp.Vector3(467.45806884765625, -3220.532958984375, 6.056998252868652);
pickups.FibStockPos = new mp.Vector3(127.0777587890625, -761.8219604492188, 241.15211486816406);

pickups.SheriffGarderobPos = new mp.Vector3(-452.945, 6013.818, 30.716);
pickups.SheriffGarderobPos2 = new mp.Vector3(1849.775390625, 3695.501953125, 33.26706314086914);
pickups.SheriffGarderobPos3 = new mp.Vector3(381.8980407714844, -1610.0821533203125, 28.29205322265625);
pickups.SheriffArsenalPos = new mp.Vector3(-437.330, 6001.264, 30.716);
pickups.SheriffArsenalPos2 = new mp.Vector3(1845.992431640625, 3692.927734375, 33.26704406738281);
pickups.SheriffArsenalPos3 = new mp.Vector3(370.192626953125, -1597.8590087890625, 28.29205894470215);

pickups.SheriffClearPos = new mp.Vector3(-448.6859, 6012.703, 30.71638);
pickups.SheriffClearPos2 = new mp.Vector3(370.0141906738281, -1585.6617431640625, 28.29206085205078);
pickups.SheriffArrestPos = new mp.Vector3(-441.605, 6012.786, 26.985);
pickups.SheriffArrestPos2 = new mp.Vector3(1856.632080078125, 3685.5849609375, 29.259225845336914);
pickups.SheriffArrestPos3 = new mp.Vector3(360.8938293457031, -1597.5963134765625, 28.292055130004883);

pickups.PrisonArrestPos = new mp.Vector3(1690.606, 2591.926, 44.83793);

pickups.EmsArsenalPos = new mp.Vector3(311.363037109375, -563.9005737304688, 42.28398895263672);
pickups.EmsArsenalPos2 = new mp.Vector3(-258.50933837890625, 6308.8623046875, 31.426040649414062);
pickups.EmsArsenalPos3 = new mp.Vector3(1206.7628173828125, -1478.664794921875, 33.85951614379883);
pickups.EmsArsenalPos4 = new mp.Vector3(1822.641357421875, 3676.248046875, 33.270057678222656);
pickups.EmsArsenalPos5 = new mp.Vector3(-377.16534423828125, 6110.66552734375, 30.44953155517578);

/*Keys*/
pickups.GovKeyPos = new mp.Vector3(-1312.9268798828125, -550.072265625, 19.802770614624023);
pickups.SapdKeyPos = new mp.Vector3(-1078.491943359375, -856.7177734375, 4.042818546295166);
pickups.SheriffKeyPos = new mp.Vector3(-453.48065185546875, 6031.2314453125, 30.340538024902344);
pickups.InvaderKeyPos = new mp.Vector3(-1095.8746337890625, -254.6504669189453, 36.68137741088867);
pickups.EmsKeyPos = new mp.Vector3(319.167236328125, -559.7047119140625, 27.743427276611328);
pickups.UsmcKeyPos = new mp.Vector3(468.67388916015625, -3205.725830078125, 5.069557189941406);
pickups.FibKeyPos = new mp.Vector3(127.6114273071289, -742.7451782226562, 32.133235931396484);

/*Info*/

pickups.GovInfoPos1 = new mp.Vector3(-1301.586, -572.8552, 40.18815);
pickups.GovInfoPos2 = new mp.Vector3(-1287.264, -590.3502, 40.18817);
pickups.GovInfoPos3 = new mp.Vector3(-1298.756, -572.7356, 33.37488);
pickups.SapdInfoPos = new mp.Vector3(447.4615783691406, -973.3896484375, 29.689332962036133);
pickups.SapdInfoPos2 = new mp.Vector3(-1617.1435546875, -1017.6526489257812, 12.145439147949219);
pickups.SapdInfoPos3 = new mp.Vector3( -1084.4210205078125, -822.102294921875, 18.03700828552246);
pickups.SheriffInfo1Pos = new mp.Vector3(-447.1171569824219, 6014.25732421875, 35.50706481933594);
pickups.SheriffInfo2Pos = new mp.Vector3(1861.929931640625, 3689.359375, 33.26704788208008);
pickups.InvaderInfoPos = new mp.Vector3(-1082.346923828125, -245.2889404296875, 36.763282775878906);
pickups.EmsInfo1Pos = new mp.Vector3(334.723876953125, -594.0081176757812, 42.28398895263672);
pickups.EmsInfo2Pos = new mp.Vector3(-268.90997314453125, 6321.72802734375, 31.47595977783203);
pickups.FibInfoPos = new mp.Vector3(155.91026306152344, -738.9337768554688, 241.15208435058594);
pickups.UsmcInfoPos = new mp.Vector3(562.8510131835938, -3124.137939453125, 17.768630981445312);

/*Invader*/
pickups.InvaderWorkPos1 = new mp.Vector3(-1055.5491943359375, -242.51651000976562, 43.021060943603516);
pickups.InvaderWorkPos2 = new mp.Vector3(-1050.10302734375, -242.052734375, 43.02106475830078);
pickups.InvaderWorkPos3 = new mp.Vector3(-1059.9254150390625, -246.7880096435547, 43.021060943603516);
pickups.InvaderWorkPos4 = new mp.Vector3(-1056.6370849609375, -245.4740447998047, 43.021060943603516);

/*EMS*/
pickups.EmsGarderobPos1 = new mp.Vector3(299.0457458496094, -598.6067504882812, 42.28403091430664);
pickups.EmsGarderobPos2 = new mp.Vector3(-244.68588256835938, 6318.1396484375, 31.44457244873047);
pickups.EmsGarderobPos3 = new mp.Vector3(1206.7554931640625, -1465.3013916015625, 33.85951614379883);
pickups.EmsGarderobPos4 = new mp.Vector3(1838.8011474609375, 3689.89111328125, 33.27003479003906);
pickups.EmsGarderobPos5 = new mp.Vector3(-372.43133544921875, 6106.17626953125, 30.449552536010742);

pickups.EmsFreePos1 = new mp.Vector3(1835.09423828125, 3683.8740234375, 33.2700309753418);
pickups.EmsFreePos2 = new mp.Vector3(-248.40432739257812, 6321.85546875, 31.420692443847656);
pickups.EmsFreePos3 = new mp.Vector3(308.6158752441406, -595.1431274414062, 42.28403091430664);

pickups.EmsElevatorRoofPos = new mp.Vector3(334.7327, -1432.775, 45.51179);
pickups.EmsElevatorParkPos = new mp.Vector3(406.5373, -1347.918, 40.05356);
pickups.EmsElevatorPos = new mp.Vector3(247.0811, -1371.92, 23.53779);

pickups.EmsRoofPos1 = new mp.Vector3(338.9745788574219, -584.0857543945312, 73.16557312011719);
pickups.EmsRoofPos2 = new mp.Vector3(327.2897644042969, -603.27734375, 42.28400802612305);

pickups.BahamaPos1 = new mp.Vector3(-1387.69, -588.719, 29.3198);
pickups.BahamaPos2 = new mp.Vector3(-1388.88, -586.291, 29.2198);

pickups.TheLostPos1 = new mp.Vector3(982.47, -103.51, 73.848);
pickups.TheLostPos2 = new mp.Vector3(981.03, -101.79, 73.845);

pickups.Builder1Pos1 = new mp.Vector3(-184.0954, -1015.952, 29.07095);
pickups.Builder1Pos2 = new mp.Vector3(-184.0501, -1015.777, 113.2077);

pickups.Builder2Pos1 = new mp.Vector3(-180.3233, -1017.127, 29.06766);
pickups.Builder2Pos2 = new mp.Vector3(-180.3119, -1017.069, 113.2165);

/*ElShop*/
pickups.ElShopPos1 = new mp.Vector3(-658.8024, -855.8863, 23.50986);
pickups.ElShopPos2 = new mp.Vector3(-658.6975, -854.5909, 23.50342);

pickups.ElShopPos11 = new mp.Vector3(1137.675, -470.7754, 65.66285);
pickups.ElShopPos12 = new mp.Vector3(1136.156, -470.4759, 65.70986);

/*Club*/
pickups.ClubUserPos = new mp.Vector3(-1569.33, -3016.98, -75.40616);
pickups.ClubTehUserPos = new mp.Vector3(4.723007, 220.3487, 106.7251);
pickups.ClubGalaxyUserPos = new mp.Vector3(355.362, 302.1856, 102.7556);
pickups.ClubLsUserPos = new mp.Vector3(-1173.9403076171875, -1153.419189453125, 4.657954216003418);

pickups.ClubVPos = new mp.Vector3(-1640.193, -2989.592, -78.22095);
pickups.ClubVPos.rot = 267.697265625;

pickups.ClubTehVPos = new mp.Vector3(-22.223295211791992, 216.72283935546875, 105.57382202148438);
pickups.ClubTehVPos.rot = 170.98104858398438;

pickups.ClubGalaxyVPos = new mp.Vector3(336.3491, 267.4991, 102.684);
pickups.ClubGalaxyVPos.rot = 132.8008;

pickups.ClubLsVPos = new mp.Vector3(-1169.167236328125, -1159.6075439453125, 4.643235683441162);
pickups.ClubLsVPos.rot = 283.82879638671875;

/*Gang*/
pickups.GangUserPos1 = new mp.Vector3(-10.36269, -1827.974, 24.3937);
pickups.GangUserPos2 = new mp.Vector3(-185.1627, -1702.005, 31.76884);
pickups.GangUserPos3 = new mp.Vector3(1332.022, -1642.544, 51.1209);
pickups.GangUserPos4 = new mp.Vector3(484.9742431640625, -1876.2430419921875, 25.157236099243164);
pickups.GangUserPos5 = new mp.Vector3(465.1705, -1672.832, 28.29149);
pickups.GangUserPosInt = new mp.Vector3(2737.886, -374.227, -48.98799);

pickups.GangVehPos1 = new mp.Vector3(7.4240, -1809.3, 25.01075, -50.742);
pickups.GangVehPos1.rot = -50.742;

pickups.GangVehPos2 = new mp.Vector3(-196.5648, -1717.631, 32.3554);
pickups.GangVehPos2.rot = 134.5378;

pickups.GangVehPos3 = new mp.Vector3(1329.077, -1661.631, 50.92767);
pickups.GangVehPos3.rot = 125.741;

pickups.GangVehPos4 = new mp.Vector3(-1136.517, -1591.871, 3.397047);
pickups.GangVehPos4.rot = 35.16928;

pickups.GangVehPos5 = new mp.Vector3(476.4883, -1690.043, 28.9059);
pickups.GangVehPos5.rot = 139.95;

pickups.GangVehPosInt = new mp.Vector3(2681.32, -361.2303, -55.49273);
pickups.GangVehPosInt.rot = -88.86639;

/*Biz*/
pickups.InvaderPos1 = new mp.Vector3(-1078.19, -254.3557, 43.02112);
pickups.InvaderPos2 = new mp.Vector3(-1072.305, -246.3927, 53.00602);

/*Jobs*/
pickups.Gr6Pos = new mp.Vector3(-20.93047523498535, -660.4189453125, 32.48031997680664);
pickups.MailPos = new mp.Vector3(78.78807067871094, 111.90670013427734, 80.16815948486328);
pickups.Bus1Pos = new mp.Vector3(461.0713806152344, -573.357666015625, 27.499807357788086);
pickups.Bus2Pos = new mp.Vector3(471.4545593261719, -576.7513427734375, 27.499744415283203);
pickups.Bus3Pos = new mp.Vector3(466.4013671875, -576.0244140625, 27.499794006347656);
pickups.Mech3Pos = new mp.Vector3(548.5404052734375, -172.61703491210938, 53.4813346862793);
pickups.TaxiPos = new mp.Vector3(895.2080078125, -179.82662963867188, 73.69615936279297);
pickups.TreePos = new mp.Vector3(-1585.625, -234.0653, 53.35091);
pickups.AvePos = new mp.Vector3(-1667.178466796875, -290.8775634765625, 51.1727409362793);
pickups.AveVehPos = new mp.Vector3(-1665.1044921875, -281.63458251953125, 50.85293197631836);
pickups.BuilderPos = new mp.Vector3(-1159.201, -740.0846, 18.88993);

pickups.checkPressLAlt = function(player) {

    methods.debug('pickups.checkPressLAlt');

    if (!user.isLogin(player))
        return;
    let playerPos = player.position;

    lsc.checkPosForOpenMenu(player);

    if (methods.distanceToPos(business.BusinessStreetPos, playerPos) < distanceCheck ||
        methods.distanceToPos(business.BusinessMotorPos, playerPos) < distanceCheck ||
        methods.distanceToPos(business.BusinessRoofPos, playerPos) < distanceCheck ||
        methods.distanceToPos(business.BusinessGaragePos, playerPos) < distanceCheck ||
        methods.distanceToPos(business.BusinessOfficePos, playerPos) < distanceCheck)
        player.call('client:menuList:showBusinessTeleportMenu');

    if (methods.distanceToPos(pickups.BankMazeLiftGaragePos, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.BankMazeLiftOfficePos, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.BankMazeLiftStreetPos, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.BankMazeLiftRoofPos, playerPos) < distanceCheck)
        player.call('client:menuList:showMazeOfficeTeleportMenu');

    if (methods.distanceToPos(pickups.Gov1LiftPos1, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.Gov1LiftPos2, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.Gov1LiftPos3, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.Gov1LiftPos4, playerPos) < distanceCheck)
        player.call('client:menuList:showGovLift1OfficeTeleportMenu');

    if (methods.distanceToPos(pickups.Gov2LiftPos1, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.Gov2LiftPos2, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.Gov2LiftPos3, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.Gov2LiftPos4, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.Gov2LiftPos5, playerPos) < distanceCheck)
        player.call('client:menuList:showGovLift2OfficeTeleportMenu');

    if (methods.distanceToPos(pickups.Builder3Pos1, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.Builder3Pos2, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.Builder3Pos3, playerPos) < distanceCheck)
        player.call('client:menuList:showBuilder3TeleportMenu');

    if (methods.distanceToPos(pickups.Builder4Pos1, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.Builder4Pos2, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.Builder4Pos3, playerPos) < distanceCheck)
        player.call('client:menuList:showBuilder4TeleportMenu');

    if (methods.distanceToPos(pickups.CasinoLiftStreetPos, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.CasinoLiftBalconPos, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.CasinoLiftInPos, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.CasinoLiftCondoPos, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.CasinoLiftRoofPos, playerPos) < distanceCheck)
        player.call('client:menuList:showCasinoLiftTeleportMenu');

    if (methods.distanceToPos(pickups.FibLift0StationPos, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.FibLift1StationPos, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.FibLift2StationPos, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.FibLift3StationPos, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.FibLift4StationPos, playerPos) < distanceCheck)
        player.call('client:menuList:showFibOfficeTeleportMenu');

    if (methods.distanceToPos(pickups.Garage11Pos, playerPos) < 3 ||
        methods.distanceToPos(pickups.Garage12Pos, playerPos) < 3 ||
        methods.distanceToPos(pickups.Garage13Pos, playerPos) < 3)
        player.call('client:menuList:showGarage1TeleportMenu');

    if (methods.distanceToPos(pickups.Garage21Pos, playerPos) < 3 ||
        methods.distanceToPos(pickups.Garage22Pos, playerPos) < 3 ||
        methods.distanceToPos(pickups.Garage23Pos, playerPos) < 3)
        player.call('client:menuList:showGarage2TeleportMenu');

    if (methods.distanceToPos(pickups.MeriaDownPos, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.MeriaGarPos, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.MeriaRoofPos, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.MeriaUpPos, playerPos) < distanceCheck)
        player.call('client:menuList:showGovOfficeTeleportMenu');

    //methods.checkTeleport(player, pickups.BahamaPos1, pickups.BahamaPos2);
    methods.checkTeleport(player, pickups.Builder1Pos1, pickups.Builder1Pos2);
    methods.checkTeleport(player, pickups.Builder2Pos1, pickups.Builder2Pos2);
    methods.checkTeleport(player, pickups.EmsRoofPos1, pickups.EmsRoofPos2);
    methods.checkTeleport(player, pickups.InvaderPos2, pickups.InvaderPos1);

    methods.checkTeleport(player, pickups.UsmcPickupPos1, pickups.UsmcPickupPos2);
    methods.checkTeleport(player, pickups.UsmcPickupPos11, pickups.UsmcPickupPos12);
    methods.checkTeleport(player, pickups.EmsPickupPos1, pickups.EmsPickupPos2);

    methods.checkTeleport(player, pickups.SapdFromInterrogationPos, pickups.SapdToInterrogationPos);
    methods.checkTeleport(player, pickups.SapdToVespucci1Pos, pickups.SapdToVespucci2Pos);
    methods.checkTeleport(player, pickups.SapdToVespucci21Pos, pickups.SapdToVespucci22Pos);
    methods.checkTeleport(player, pickups.SapdFromBalconPos, pickups.SapdToBalconPos);
    methods.checkTeleport(player, pickups.SapdFromBalcon2Pos, pickups.SapdToBalcon2Pos);

    if (methods.distanceToPos(pickups.GangUserPosInt, playerPos) < distanceCheck && player.dimension === 1) {
        player.dimension = 0;
        user.teleport(player, pickups.GangUserPos1.x, pickups.GangUserPos1.y, pickups.GangUserPos1.z + 1);
    }
    if (methods.distanceToPos(pickups.GangUserPosInt, playerPos) < distanceCheck && player.dimension === 2) {
        player.dimension = 0;
        user.teleport(player, pickups.GangUserPos2.x, pickups.GangUserPos2.y, pickups.GangUserPos2.z + 1);
    }
    if (methods.distanceToPos(pickups.GangUserPosInt, playerPos) < distanceCheck && player.dimension === 3) {
        player.dimension = 0;
        user.teleport(player, pickups.GangUserPos3.x, pickups.GangUserPos3.y, pickups.GangUserPos3.z + 1);
    }
    if (methods.distanceToPos(pickups.GangUserPosInt, playerPos) < distanceCheck && player.dimension === 4) {
        player.dimension = 0;
        user.teleport(player, pickups.GangUserPos4.x, pickups.GangUserPos4.y, pickups.GangUserPos4.z + 1);
    }
    if (methods.distanceToPos(pickups.GangUserPosInt, playerPos) < distanceCheck && player.dimension === 5) {
        player.dimension = 0;
        user.teleport(player, pickups.GangUserPos5.x, pickups.GangUserPos5.y, pickups.GangUserPos5.z + 1);
    }

    if (methods.distanceToPos(pickups.GangUserPos1, playerPos) < distanceCheck) {
        player.dimension = 1;
        user.teleport(player, pickups.GangUserPosInt.x, pickups.GangUserPosInt.y, pickups.GangUserPosInt.z + 1);
    }
    if (methods.distanceToPos(pickups.GangUserPos2, playerPos) < distanceCheck) {
        player.dimension = 2;
        user.teleport(player, pickups.GangUserPosInt.x, pickups.GangUserPosInt.y, pickups.GangUserPosInt.z + 1);
    }
    if (methods.distanceToPos(pickups.GangUserPos3, playerPos) < distanceCheck) {
        player.dimension = 3;
        user.teleport(player, pickups.GangUserPosInt.x, pickups.GangUserPosInt.y, pickups.GangUserPosInt.z + 1);
    }
    if (methods.distanceToPos(pickups.GangUserPos4, playerPos) < distanceCheck) {
        player.dimension = 4;
        user.teleport(player, pickups.GangUserPosInt.x, pickups.GangUserPosInt.y, pickups.GangUserPosInt.z + 1);
    }
    if (methods.distanceToPos(pickups.GangUserPos5, playerPos) < distanceCheck) {
        player.dimension = 5;
        user.teleport(player, pickups.GangUserPosInt.x, pickups.GangUserPosInt.y, pickups.GangUserPosInt.z + 1);
    }

    if (methods.distanceToPos(pickups.ClubUserPos, playerPos) < distanceCheck && player.dimension === 49) {
        player.dimension = 0;
        user.teleport(player, pickups.ClubTehUserPos.x, pickups.ClubTehUserPos.y, pickups.ClubTehUserPos.z + 1);
    }
    if (methods.distanceToPos(pickups.ClubUserPos, playerPos) < distanceCheck && player.dimension === 131) {
        player.dimension = 0;
        user.teleport(player, pickups.ClubGalaxyUserPos.x, pickups.ClubGalaxyUserPos.y, pickups.ClubGalaxyUserPos.z + 1);
    }
    if (methods.distanceToPos(pickups.ClubUserPos, playerPos) < distanceCheck && player.dimension === 130) {
        player.dimension = 0;
        user.teleport(player, pickups.ClubLsUserPos.x, pickups.ClubLsUserPos.y, pickups.ClubLsUserPos.z + 1);
    }

    if (methods.distanceToPos(pickups.ClubTehUserPos, playerPos) < distanceCheck) {
        player.dimension = 49;
        user.teleport(player, pickups.ClubUserPos.x, pickups.ClubUserPos.y, pickups.ClubUserPos.z + 1);
    }
    if (methods.distanceToPos(pickups.ClubGalaxyUserPos, playerPos) < distanceCheck) {
        player.dimension = 131;
        user.teleport(player, pickups.ClubUserPos.x, pickups.ClubUserPos.y, pickups.ClubUserPos.z + 1);
    }
    if (methods.distanceToPos(pickups.ClubLsUserPos, playerPos) < distanceCheck) {
        player.dimension = 130;
        user.teleport(player, pickups.ClubUserPos.x, pickups.ClubUserPos.y, pickups.ClubUserPos.z + 1);
    }

    if (methods.distanceToPos(pickups.ClubVPos, playerPos) < distanceCheck && player.dimension === 49) {
        player.dimension = 0;
        if (player.vehicle)
            player.vehicle.dimension = 0;
        user.teleportVeh(player, pickups.ClubTehVPos.x, pickups.ClubTehVPos.y, pickups.ClubTehVPos.z + 1, pickups.ClubTehVPos.rot);
    }
    if (methods.distanceToPos(pickups.ClubVPos, playerPos) < distanceCheck && player.dimension === 131) {
        player.dimension = 0;
        if (player.vehicle)
            player.vehicle.dimension = 0;
        user.teleportVeh(player, pickups.ClubGalaxyVPos.x, pickups.ClubGalaxyVPos.y, pickups.ClubGalaxyVPos.z + 1, pickups.ClubGalaxyVPos.rot);
    }
    if (methods.distanceToPos(pickups.ClubVPos, playerPos) < distanceCheck && player.dimension === 130) {
        player.dimension = 0;
        if (player.vehicle)
            player.vehicle.dimension = 0;
        user.teleportVeh(player, pickups.ClubLsVPos.x, pickups.ClubLsVPos.y, pickups.ClubLsVPos.z + 1, pickups.ClubLsVPos.rot);
    }

    if (methods.distanceToPos(pickups.ClubTehVPos, playerPos) < distanceCheck) {
        player.dimension = 49;
        if (player.vehicle)
            player.vehicle.dimension = 49;
        user.teleportVeh(player, pickups.ClubVPos.x, pickups.ClubVPos.y, pickups.ClubVPos.z + 1, pickups.ClubVPos.rot);
    }
    if (methods.distanceToPos(pickups.ClubGalaxyVPos, playerPos) < distanceCheck) {
        player.dimension = 131;
        if (player.vehicle)
            player.vehicle.dimension = 131;
        user.teleportVeh(player, pickups.ClubVPos.x, pickups.ClubVPos.y, pickups.ClubVPos.z + 1, pickups.ClubVPos.rot);
    }
    if (methods.distanceToPos(pickups.ClubLsVPos, playerPos) < distanceCheck) {
        player.dimension = 130;
        if (player.vehicle)
            player.vehicle.dimension = 130;
        user.teleportVeh(player, pickups.ClubVPos.x, pickups.ClubVPos.y, pickups.ClubVPos.z + 1, pickups.ClubVPos.rot);
    }

    //gr6
    methods.checkTeleport(player, new mp.Vector3(486.0731, -1075.497, 28.00087), new mp.Vector3(486.0519, -1078.475, 28.19953));
};

pickups.checkPressE = function(player) {
    methods.debug('pickups.checkPressE');
    if (!user.isLogin(player))
        return;

    let playerPos = player.position;

    carWash.checkPosForOpenMenu(player);

    if (player.vehicle)
        return;

    if (methods.distanceToPos(business.BusinessStreetPos, playerPos) < distanceCheck ||
        methods.distanceToPos(business.BusinessMotorPos, playerPos) < distanceCheck ||
        methods.distanceToPos(business.BusinessRoofPos, playerPos) < distanceCheck ||
        methods.distanceToPos(business.BusinessGaragePos, playerPos) < distanceCheck ||
        methods.distanceToPos(business.BusinessOfficePos, playerPos) < distanceCheck)
        player.call('client:menuList:showBusinessTeleportMenu');

    /*if (player.dimension > 0) {
        player.notify('~r~Это действие не доступно');
        return;
    }*/

    cloth.checkPosForOpenMenu(player);
    tattoo.checkPosForOpenMenu(player);
    gun.checkPosForOpenMenu(player);
    vShop.checkPosForOpenMenu(player);
    rent.checkPosForOpenMenu(player);
    bar.checkPosForOpenMenu(player);
    barberShop.checkPosForOpenMenu(player);
    bank.checkPosForOpenMenu(player);
    bank.hackFleecaDoor(player);
    shop.checkPosForOpenMenu(player);

    if (methods.distanceToPos(pickups.LifeInvaderShopPos, playerPos) < distanceCheck)
        player.call('client:menuList:showInvaderShopMenu');

    if (methods.distanceToPos(pickups.PrintShopPos, playerPos) < distanceCheck)
        player.call('client:menuList:showPrintShopMenu');
    if (methods.distanceToPos(pickups.SellVehicle, playerPos) < distanceCheck)
        player.call('client:menuList:showSellVehMenu');
    if (methods.distanceToPos(pickups.MazeBankLobby, playerPos) < distanceCheck)
        player.call('client:menuList:showMazeBankLobbyMenu', [gangZone.currentLobby(), gangZone.currentWeapon(), racer.getLobbyCount(), racer.getLobbyName(), racer.getLobbyVehicle()]);
    if (methods.distanceToPos(pickups.WheelLuckyPos, playerPos) < distanceCheck)
    {
        setTimeout(function () {
            try {
                wheel.start(player);
            }
            catch (e) {}
        }, methods.getRandomInt(0, 500));
    }

    if (methods.distanceToPos(pickups.BotRole0, playerPos) < distanceCheck)
        player.call('client:menuList:showBotQuestRole0Menu');
    if (methods.distanceToPos(pickups.BotRoleAll, playerPos) < distanceCheck)
        player.call('client:menuList:showBotQuestRoleAllMenu');
    if (methods.distanceToPos(pickups.QuestBotGang, playerPos) < distanceCheck)
        player.call('client:menuList:showBotQuestGangMenu');
    if (methods.distanceToPos(pickups.BotSellGun, playerPos) < distanceCheck)
        inventory.getItemListGunTranferSell(player);
    if (methods.distanceToPos(pickups.BotSellCloth, playerPos) < distanceCheck)
        inventory.getItemListClothTranferSell(player);
    if (methods.distanceToPos(pickups.FixWeapon1, playerPos) < distanceCheck || methods.distanceToPos(pickups.FixWeapon2, playerPos) < distanceCheck)
        inventory.getItemListGunFix(player);

    if (methods.distanceToPos(pickups.BankMazeOfficePos1, playerPos) < distanceCheck)
        player.call('client:menuList:showMazeOfficeMenu');
    if (methods.distanceToPos(pickups.BankMazeOfficePos2, playerPos) < distanceCheck)
        player.call('client:menuList:showMazeOfficeMenu');
    if (methods.distanceToPos(pickups.MeriaHelpPos, playerPos) < distanceCheck)
        player.call('client:menuList:showMeriaMainMenu');

    if (user.isLeader(player) || user.isSubLeader(player) || user.isDepLeader(player) || user.isDepSubLeader(player)) {
        if (methods.distanceToPos(pickups.GovInfoPos1, playerPos) < distanceCheck)
            player.call('client:menuList:showFractionInfoMenu');
        if (methods.distanceToPos(pickups.GovInfoPos2, playerPos) < distanceCheck)
            player.call('client:menuList:showFractionInfoMenu');
        if (methods.distanceToPos(pickups.GovInfoPos3, playerPos) < distanceCheck)
            player.call('client:menuList:showFractionInfoMenu');
        if (methods.distanceToPos(pickups.SapdInfoPos, playerPos) < distanceCheck)
            player.call('client:menuList:showFractionInfoMenu');
        if (methods.distanceToPos(pickups.SapdInfoPos2, playerPos) < distanceCheck)
            player.call('client:menuList:showFractionInfoMenu');
        if (methods.distanceToPos(pickups.SapdInfoPos3, playerPos) < distanceCheck)
            player.call('client:menuList:showFractionInfoMenu');
        if (methods.distanceToPos(pickups.SheriffInfo1Pos, playerPos) < distanceCheck)
            player.call('client:menuList:showFractionInfoMenu');
        if (methods.distanceToPos(pickups.SheriffInfo2Pos, playerPos) < distanceCheck)
            player.call('client:menuList:showFractionInfoMenu');
        if (methods.distanceToPos(pickups.InvaderInfoPos, playerPos) < distanceCheck)
            player.call('client:menuList:showFractionInfoMenu');
        if (methods.distanceToPos(pickups.EmsInfo1Pos, playerPos) < distanceCheck)
            player.call('client:menuList:showFractionInfoMenu');
        if (methods.distanceToPos(pickups.EmsInfo2Pos, playerPos) < distanceCheck)
            player.call('client:menuList:showFractionInfoMenu');
        if (methods.distanceToPos(pickups.UsmcInfoPos, playerPos) < distanceCheck)
            player.call('client:menuList:showFractionInfoMenu');
        if (methods.distanceToPos(pickups.FibInfoPos, playerPos) < distanceCheck)
            player.call('client:menuList:showFractionInfoMenu');
    }

    if (user.isNews(player)) {
        if (methods.distanceToPos(pickups.InvaderWorkPos1, playerPos) < distanceCheck)
            player.call('client:menuList:showFractionInvaderMenu');
        if (methods.distanceToPos(pickups.InvaderWorkPos2, playerPos) < distanceCheck)
            player.call('client:menuList:showFractionInvaderMenu');
        if (methods.distanceToPos(pickups.InvaderWorkPos3, playerPos) < distanceCheck)
            player.call('client:menuList:showFractionInvaderMenu');
        if (methods.distanceToPos(pickups.InvaderWorkPos4, playerPos) < distanceCheck)
            player.call('client:menuList:showFractionInvaderMenu');
    }

    if (methods.distanceToPos(pickups.GovKeyPos, playerPos) < distanceCheck && user.isGov(player))
        player.call('client:menuList:showFractionKeyMenu', [vehicles.getFractionAllowCarList(1, user.isLeader(player) || user.isSubLeader(player) || user.isDepLeader(player) || user.isSubLeader(player) ? -1 : user.get(player, 'rank_type'))]);

    else if (methods.distanceToPos(pickups.SapdKeyPos, playerPos) < distanceCheck && user.isSapd(player))
        player.call('client:menuList:showFractionKeyMenu', [vehicles.getFractionAllowCarList(2, user.isLeader(player) || user.isSubLeader(player) || user.isDepLeader(player) || user.isSubLeader(player) ? -1 : user.get(player, 'rank_type'))]);

    else if (methods.distanceToPos(pickups.UsmcKeyPos, playerPos) < distanceCheck && user.isUsmc(player))
        player.call('client:menuList:showFractionKeyMenu', [vehicles.getFractionAllowCarList(4, user.isLeader(player) || user.isSubLeader(player) || user.isDepLeader(player) || user.isSubLeader(player) ? -1 : user.get(player, 'rank_type'))]);

    else if (methods.distanceToPos(pickups.SheriffKeyPos, playerPos) < distanceCheck && user.isSheriff(player))
        player.call('client:menuList:showFractionKeyMenu', [vehicles.getFractionAllowCarList(5, user.isLeader(player) || user.isSubLeader(player) || user.isDepLeader(player) || user.isSubLeader(player) ? -1 : user.get(player, 'rank_type'))]);

    else if (methods.distanceToPos(pickups.EmsKeyPos, playerPos) < distanceCheck && user.isEms(player))
        player.call('client:menuList:showFractionKeyMenu', [vehicles.getFractionAllowCarList(6, user.isLeader(player) || user.isSubLeader(player) || user.isDepLeader(player) || user.isSubLeader(player) ? -1 : user.get(player, 'rank_type'))]);

    else if (methods.distanceToPos(pickups.FibKeyPos, playerPos) < distanceCheck && user.isFib(player))
        player.call('client:menuList:showFractionKeyMenu', [vehicles.getFractionAllowCarList(3, user.isLeader(player) || user.isSubLeader(player) || user.isDepLeader(player) || user.isSubLeader(player) ? -1 : user.get(player, 'rank_type'))]);

    else if (methods.distanceToPos(pickups.InvaderKeyPos, playerPos) < distanceCheck && user.isNews(player))
        player.call('client:menuList:showFractionKeyMenu', [vehicles.getFractionAllowCarList(7, user.isLeader(player) || user.isSubLeader(player) || user.isDepLeader(player) || user.isSubLeader(player) ? -1 : user.get(player, 'rank_type'))]);

    if (player.dimension > 0) {
        if (methods.distanceToPos(business.BusinessBotPos, playerPos) < distanceCheck)
            player.call('client:menuList:showBusinessMenu', [Array.from(business.getData(player.dimension))]);
    }
    if (user.isGov(player)) {
        if (methods.distanceToPos(pickups.MeriaGarderobPos, playerPos) < distanceCheck)
            player.call('client:menuList:showGovGarderobMenu');
    }


    if (methods.distanceToPos(pickups.SapdStockPos, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.SapdStockPos2, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.SapdStockPos3, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.UsmcStockPos, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.FibStockPos, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.Bcsd1StockPos, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.Bcsd2StockPos, playerPos) < distanceCheck
    )
        inventory.getItemList(player, inventory.types.StockGov, user.getId(player));

    if (user.isSapd(player)) {
        if (methods.distanceToPos(pickups.SapdGarderobPos, playerPos) < distanceCheck)
            player.call('client:menuList:showSapdGarderobMenu');
        if (methods.distanceToPos(pickups.SapdGarderobPos2, playerPos) < distanceCheck)
            player.call('client:menuList:showSapdGarderobMenu');
        if (methods.distanceToPos(pickups.SapdGarderobPos3, playerPos) < distanceCheck)
            player.call('client:menuList:showSapdGarderobMenu');
        if (methods.distanceToPos(pickups.SapdArsenalPos, playerPos) < distanceCheck)
            player.call('client:menuList:showSapdArsenalMenu');
        if (methods.distanceToPos(pickups.SapdArsenalPos2, playerPos) < distanceCheck)
            player.call('client:menuList:showSapdArsenalMenu');
        if (methods.distanceToPos(pickups.SapdArsenalPos3, playerPos) < distanceCheck)
            player.call('client:menuList:showSapdArsenalMenu');
    }
    if (user.isEms(player)) {
        if (methods.distanceToPos(pickups.EmsGarderobPos1, playerPos) < distanceCheck)
            player.call('client:menuList:showEmsGarderobMenu');
        if (methods.distanceToPos(pickups.EmsGarderobPos2, playerPos) < distanceCheck)
            player.call('client:menuList:showEmsGarderobMenu');
        if (methods.distanceToPos(pickups.EmsGarderobPos3, playerPos) < distanceCheck)
            player.call('client:menuList:showEmsGarderobMenu');
        if (methods.distanceToPos(pickups.EmsGarderobPos4, playerPos) < distanceCheck)
            player.call('client:menuList:showEmsGarderobMenu');
        if (methods.distanceToPos(pickups.EmsGarderobPos5, playerPos) < distanceCheck)
            player.call('client:menuList:showEmsGarderobMenu');
        if (methods.distanceToPos(pickups.EmsArsenalPos, playerPos) < distanceCheck)
            player.call('client:menuList:showEmsArsenalMenu');
        if (methods.distanceToPos(pickups.EmsArsenalPos2, playerPos) < distanceCheck)
            player.call('client:menuList:showEmsArsenalMenu');
        if (methods.distanceToPos(pickups.EmsArsenalPos3, playerPos) < distanceCheck)
            player.call('client:menuList:showEmsArsenalMenu');
        if (methods.distanceToPos(pickups.EmsArsenalPos4, playerPos) < distanceCheck)
            player.call('client:menuList:showEmsArsenalMenu');
        if (methods.distanceToPos(pickups.EmsArsenalPos5, playerPos) < distanceCheck)
            player.call('client:menuList:showEmsArsenalMenu');
        if (methods.distanceToPos(pickups.EmsFreePos1, playerPos) < distanceCheck)
            player.call('client:menuList:showEmsFreeMenu');
        if (methods.distanceToPos(pickups.EmsFreePos2, playerPos) < distanceCheck)
            player.call('client:menuList:showEmsFreeMenu');
        if (methods.distanceToPos(pickups.EmsFreePos3, playerPos) < distanceCheck)
            player.call('client:menuList:showEmsFreeMenu');
    }
    if (user.isSheriff(player)) {
        if (methods.distanceToPos(pickups.SheriffGarderobPos, playerPos) < distanceCheck)
            player.call('client:menuList:showSheriffGarderobMenu');
        if (methods.distanceToPos(pickups.SheriffGarderobPos2, playerPos) < distanceCheck)
            player.call('client:menuList:showSheriffGarderobMenu');
        if (methods.distanceToPos(pickups.SheriffGarderobPos3, playerPos) < distanceCheck)
            player.call('client:menuList:showSheriffGarderobMenu');
        if (methods.distanceToPos(pickups.SheriffArsenalPos, playerPos) < distanceCheck)
            player.call('client:menuList:showSheriffArsenalMenu');
        if (methods.distanceToPos(pickups.SheriffArsenalPos2, playerPos) < distanceCheck)
            player.call('client:menuList:showSheriffArsenalMenu');
        if (methods.distanceToPos(pickups.SheriffArsenalPos3, playerPos) < distanceCheck)
            player.call('client:menuList:showSheriffArsenalMenu');
    }
    if (user.isSheriff(player) || user.isFib(player) || user.isSapd(player)) {
        if (methods.distanceToPos(pickups.PrisonArrestPos, playerPos) < distanceCheck)
            player.call('client:menuList:showSapdArrestMenu');
        if (methods.distanceToPos(pickups.SapdClearPos, playerPos) < distanceCheck)
            player.call('client:menuList:showSapdClearMenu');
        if (methods.distanceToPos(pickups.SheriffClearPos, playerPos) < distanceCheck)
            player.call('client:menuList:showSapdClearMenu');
        if (methods.distanceToPos(pickups.SheriffClearPos2, playerPos) < distanceCheck)
            player.call('client:menuList:showSapdClearMenu');
        if (methods.distanceToPos(pickups.SheriffArrestPos, playerPos) < distanceCheck)
            player.call('client:menuList:showSapdArrestMenu');
        if (methods.distanceToPos(pickups.SheriffArrestPos2, playerPos) < distanceCheck)
            player.call('client:menuList:showSapdArrestMenu');
        if (methods.distanceToPos(pickups.SheriffArrestPos3, playerPos) < distanceCheck)
            player.call('client:menuList:showSapdArrestMenu');
        if (methods.distanceToPos(pickups.SapdClearPos, playerPos) < distanceCheck)
            player.call('client:menuList:showSapdClearMenu');
        if (methods.distanceToPos(pickups.SapdClearPos2, playerPos) < distanceCheck)
            player.call('client:menuList:showSapdClearMenu');
        if (methods.distanceToPos(pickups.SapdClearPos3, playerPos) < distanceCheck)
            player.call('client:menuList:showSapdClearMenu');
        if (methods.distanceToPos(pickups.SapdArrestPos, playerPos) < distanceCheck)
            player.call('client:menuList:showSapdArrestMenu');
        if (methods.distanceToPos(pickups.SapdArrestPos2, playerPos) < distanceCheck)
            player.call('client:menuList:showSapdArrestMenu');
        if (methods.distanceToPos(pickups.SapdArrestPos3, playerPos) < distanceCheck)
            player.call('client:menuList:showSapdArrestMenu');
    }
    if (user.isUsmc(player)) {
        if (methods.distanceToPos(pickups.UsmcArsenalPos1, playerPos) < distanceCheck)
            player.call('client:menuList:showUsmcArsenalMenu');
        if (methods.distanceToPos(pickups.UsmcArsenalPos2, playerPos) < distanceCheck)
            player.call('client:menuList:showUsmcArsenalMenu');
    }
    if (user.isFib(player)) {
        if (methods.distanceToPos(pickups.FibArsenalPos, playerPos) < distanceCheck)
            player.call('client:menuList:showFibArsenalMenu');
    }

    try {
        if (user.isJobMail(player) && methods.distanceToPos(pickups.MailPos, playerPos) < distanceCheck)
            player.call('client:menuList:showSpawnJobCarMailMenu');
        if (methods.distanceToPos(pickups.TaxiPos, playerPos) < distanceCheck)
            player.call('client:menuList:showSpawnJobCarTaxiMenu');
        if (user.isJobGr6(player) && methods.distanceToPos(pickups.Gr6Pos, playerPos) < distanceCheck)
            player.call('client:menuList:showSpawnJobGr6Menu');
        if (user.isJobMech(player) && methods.distanceToPos(pickups.Mech3Pos, playerPos) < distanceCheck)
            player.call('client:menuList:showSpawnJobCarMenu', [150, 534.3485107421875, -170.06861877441406, 54.39955139160156, 180.3535614013672, 'Sadler', 5]);
        if (user.isJobBus1(player) && methods.distanceToPos(pickups.Bus1Pos, playerPos) < distanceCheck)
            player.call('client:menuList:showSpawnJobCarMenu', [150, 459.72247314453125, -582.0006103515625, 28.495769500732422, 170.3814697265625, 'Bus', 6]);
        if (user.isJobBus2(player) && methods.distanceToPos(pickups.Bus2Pos, playerPos) < distanceCheck)
            player.call('client:menuList:showSpawnJobCarMenu', [100, 471.0755920410156, -583.989501953125, 28.49574089050293, 173.3385009765625, 'Airbus', 7]);
        if (user.isJobBus3(player) && methods.distanceToPos(pickups.Bus3Pos, playerPos) < distanceCheck)
            player.call('client:menuList:showSpawnJobCarMenu', [200, 465.9425048828125, -582.1303100585938, 29.325841903686523, 173.46160888671875, 'Coach', 8]);
        if (user.isJobTree(player) && methods.distanceToPos(pickups.TreePos, playerPos) < distanceCheck)
            player.call('client:menuList:showSpawnJobCarMenu', [100, -1590.850341796875, -230.34060668945312, 53.86422348022461, 330.6097412109375, 'Bison3', 1]);
        if (user.isJobAve(player) && methods.distanceToPos(pickups.AveVehPos, playerPos) < distanceCheck)
            player.call('client:menuList:showSpawnJobCarMenu', [100, -1656.8006591796875, -289.6989440917969, 51.106414794921875, 229.14739990234375, 'Romero', 12]);
        if (user.isJobAve(player) && methods.distanceToPos(pickups.AvePos, playerPos) < distanceCheck)
            player.call('client:menuList:showAveMenu');
        if (user.isJobBuilder(player) && methods.distanceToPos(pickups.BuilderPos, playerPos) < distanceCheck)
            player.call('client:menuList:showSpawnJobCarMenu', [100, -1201.99267578125, -729.6393432617188, 20.672805786132812, 308.53955078125, 'Bison2', 2]);
    }
    catch (e) {
        methods.debug('PICKUP', e);
    }

};

pickups.createAll = function() {
    methods.debug('pickups.createPickups');

    methods.createCpVector(pickups.EmsGarderobPos1, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.EmsGarderobPos2, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.EmsGarderobPos3, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.EmsGarderobPos4, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.EmsGarderobPos5, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);

    methods.createCpVector(pickups.EmsFreePos1, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.EmsFreePos2, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.EmsFreePos3, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);

    //methods.createStaticCheckpointV(pickups.TheLostPos1, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    //methods.createStaticCheckpointV(pickups.TheLostPos2, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
   /* methods.createCpVector(pickups.BahamaPos1, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.BahamaPos2, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);*/

    methods.createCpVector(pickups.SapdToInterrogationPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.SapdFromInterrogationPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.SapdToVespucci1Pos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.SapdToVespucci2Pos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.SapdToVespucci21Pos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.SapdToVespucci22Pos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.SapdToBalconPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.SapdFromBalconPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.SapdToBalcon2Pos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.SapdFromBalcon2Pos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);

    methods.createCpVector(pickups.Builder1Pos1, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.Builder1Pos2, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);

    methods.createCpVector(pickups.Builder2Pos1, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.Builder2Pos2, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);

    methods.createCpVector(pickups.EmsRoofPos1, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.EmsRoofPos2, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);

    methods.createCpVector(pickups.EmsKeyPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.GovKeyPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.UsmcKeyPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);

    methods.createCpVector(pickups.FibInfoPos, 'Нажмите ~g~E~s~ чтобы открыть меню руководства', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.UsmcInfoPos, 'Нажмите ~g~E~s~ чтобы открыть меню руководства', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.GovInfoPos1, 'Нажмите ~g~E~s~ чтобы открыть меню руководства', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.GovInfoPos2, 'Нажмите ~g~E~s~ чтобы открыть меню руководства', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.GovInfoPos3, 'Нажмите ~g~E~s~ чтобы открыть меню руководства', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.SapdInfoPos, 'Нажмите ~g~E~s~ чтобы открыть меню руководства', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.SapdInfoPos2, 'Нажмите ~g~E~s~ чтобы открыть меню руководства', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.SapdInfoPos3, 'Нажмите ~g~E~s~ чтобы открыть меню руководства', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.SheriffInfo1Pos, 'Нажмите ~g~E~s~ чтобы открыть меню руководства', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.SheriffInfo2Pos, 'Нажмите ~g~E~s~ чтобы открыть меню руководства', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.InvaderInfoPos, 'Нажмите ~g~E~s~ чтобы открыть меню руководства', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.EmsInfo1Pos, 'Нажмите ~g~E~s~ чтобы открыть меню руководства', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.EmsInfo2Pos, 'Нажмите ~g~E~s~ чтобы открыть меню руководства', 1, -1, pickups.Blue);

    methods.createCpVector(pickups.InvaderWorkPos1, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.InvaderWorkPos2, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.InvaderWorkPos3, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.InvaderWorkPos4, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);

    methods.createCpVector(pickups.BotSellGun, 'Нажмите ~g~E~s~ чтобы взаимодействовать с NPC', 1, -1, pickups.Yellow);
    methods.createCpVector(pickups.BotSellCloth, 'Нажмите ~g~E~s~ чтобы взаимодействовать с NPC', 1, -1, pickups.Yellow);
    methods.createCpVector(pickups.BotRole0, 'Нажмите ~g~E~s~ чтобы взаимодействовать с NPC', 1, -1, pickups.Yellow);
    methods.createCpVector(pickups.BotRoleAll, 'Нажмите ~g~E~s~ чтобы взаимодействовать с NPC', 1, -1, pickups.Yellow);
    methods.createCpVector(pickups.QuestBotGang, 'Нажмите ~g~E~s~ чтобы взаимодействовать с NPC', 1, -1, pickups.Yellow);

    methods.createCpVector(pickups.MazeBankLobby, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.WheelLuckyPos, 'Нажмите ~g~E~s~ чтобы крутить колесо', 1, -1, [33, 150, 243, 0]);

    methods.createCpVector(pickups.LifeInvaderShopPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.SellVehicle, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);

    methods.createCpVector(pickups.FixWeapon1, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.FixWeapon2, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);

    methods.createCpVector(pickups.EmsElevatorPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.EmsElevatorParkPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.EmsElevatorRoofPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);

    methods.createCpVector(pickups.BankMazeLiftOfficePos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.BankMazeLiftStreetPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.BankMazeLiftRoofPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.BankMazeLiftGaragePos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.BankMazeOfficePos1, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.BankMazeOfficePos2, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);

    methods.createCpVector(pickups.Gov1LiftPos1, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.Gov1LiftPos2, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.Gov1LiftPos3, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.Gov1LiftPos4, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);

    methods.createCpVector(pickups.Gov2LiftPos1, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.Gov2LiftPos2, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.Gov2LiftPos3, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.Gov2LiftPos4, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.Gov2LiftPos5, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);

    methods.createCpVector(pickups.CasinoLiftStreetPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.CasinoLiftBalconPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.CasinoLiftRoofPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.CasinoLiftCondoPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.CasinoLiftInPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);

    methods.createCpVector(pickups.Builder4Pos1, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.Builder4Pos2, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.Builder4Pos3, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.Builder3Pos1, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.Builder3Pos2, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.Builder3Pos3, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);

    methods.createCpVector(pickups.UsmcPickupPos1, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.UsmcPickupPos2, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.UsmcPickupPos11, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.UsmcPickupPos12, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.EmsPickupPos1, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.EmsPickupPos2, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);

    methods.createCpVector(pickups.Garage11Pos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться лифтом', 3, -1, pickups.Tranparent);
    methods.createCpVector(pickups.Garage12Pos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться лифтом', 3, -1, pickups.Tranparent);
    methods.createCpVector(pickups.Garage13Pos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться лифтом', 3, -1, pickups.Tranparent);

    methods.createCpVector(pickups.Garage21Pos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться лифтом', 3, -1, pickups.Tranparent);
    methods.createCpVector(pickups.Garage22Pos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться лифтом', 3, -1, pickups.Tranparent);
    methods.createCpVector(pickups.Garage23Pos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться лифтом', 3, -1, pickups.Tranparent);

    methods.createCpVector(pickups.FibLift0StationPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.FibLift1StationPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.FibLift2StationPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.FibLift3StationPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.FibLift4StationPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.FibArsenalPos, 'Нажмите ~g~E~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue);

    methods.createCpVector(pickups.MeriaUpPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.MeriaDownPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.MeriaRoofPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.MeriaGarPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.MeriaGarderobPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.MeriaHelpPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);

    methods.createCpVector(pickups.SapdStockPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.SapdStockPos2, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.SapdStockPos3, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.UsmcStockPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.FibStockPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.SapdGarderobPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.SapdGarderobPos2, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.SapdGarderobPos3, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.SapdArsenalPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.SapdArsenalPos2, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.SapdArsenalPos3, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.SapdClearPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.SapdClearPos2, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.SapdClearPos3, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.SapdArrestPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.SapdArrestPos2, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.SapdArrestPos3, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.SapdKeyPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);

    methods.createCpVector(pickups.UsmcArsenalPos1, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.UsmcArsenalPos2, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);

    methods.createCpVector(pickups.DispatcherPos1, 'Диспетчерская', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.DispatcherPos2, 'Диспетчерская', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.DispatcherPos3, 'Диспетчерская', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.DispatcherPos4, 'Диспетчерская', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.DispatcherPos5, 'Диспетчерская', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.DispatcherPos6, 'Диспетчерская', 1, -1, pickups.Blue);

    methods.createCpVector(pickups.SheriffKeyPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.InvaderKeyPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.SheriffClearPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.SheriffClearPos2, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.SheriffGarderobPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.SheriffGarderobPos2, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.SheriffGarderobPos3, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.SheriffArrestPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.SheriffArrestPos2, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.SheriffArrestPos3, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.SheriffArsenalPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.SheriffArsenalPos2, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.SheriffArsenalPos3, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);

    methods.createCpVector(pickups.EmsArsenalPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.EmsArsenalPos2, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.EmsArsenalPos3, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.EmsArsenalPos4, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.EmsArsenalPos5, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);

    methods.createCpVector(pickups.PrisonArrestPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);

    methods.createCpVector(pickups.ClubLsUserPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.ClubTehUserPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.ClubGalaxyUserPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.ClubUserPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.ClubGalaxyVPos, "Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом", 4, -1, pickups.Blue100, 0.3);
    methods.createCpVector(pickups.ClubTehVPos, "Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом", 4, -1, pickups.Blue100, 0.3);
    methods.createCpVector(pickups.ClubLsVPos, "Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом", 4, -1, pickups.Blue100, 0.3);

    methods.createCpVector(business.BusinessOfficePos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(business.BusinessStreetPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(business.BusinessMotorPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(business.BusinessRoofPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(business.BusinessGaragePos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(business.BusinessBotPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);

    methods.createCpVector(pickups.InvaderPos1, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.InvaderPos2, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);

    methods.createCpVector(pickups.GangUserPosInt, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.GangUserPos1, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.GangUserPos2, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.GangUserPos3, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.GangUserPos4, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createCpVector(pickups.GangUserPos5, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);

    methods.createCpVector(pickups.Gr6Pos, 'Нажмите ~g~E~s~ чтобы открыть меню инкассатора', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.Mech3Pos, 'Нажмите ~g~E~s~ чтобы открыть меню аренды транспорта', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.MailPos, 'Нажмите ~g~E~s~ чтобы открыть меню аренты транспорта', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.TaxiPos, 'Нажмите ~g~E~s~ чтобы открыть меню аренды такси', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.Bus1Pos, 'Нажмите ~g~E~s~ чтобы открыть меню городского маршрута', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.Bus2Pos, 'Нажмите ~g~E~s~ чтобы открыть меню трансферного маршрута', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.Bus3Pos, 'Нажмите ~g~E~s~ чтобы открыть меню рейсового маршрута', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.TreePos, 'Нажмите ~g~E~s~ чтобы открыть меню садовника', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.AvePos, 'Нажмите ~g~E~s~ чтобы открыть меню священника', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.AveVehPos, 'Нажмите ~g~E~s~ чтобы открыть меню священника', 1, -1, pickups.Blue);
    methods.createCpVector(pickups.BuilderPos, 'Нажмите ~g~E~s~ чтобы открыть меню разнорабочего', 1, -1, pickups.Blue);
};