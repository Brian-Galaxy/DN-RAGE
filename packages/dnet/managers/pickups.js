let methods = require('../modules/methods');

let enums = require('../enums');
let user = require('../user');

let cloth = require('../business/cloth');
let tattoo = require('../business/tattoo');
let lsc = require('../business/lsc');
let gun = require('../business/gun');
let vShop = require('../business/vShop');
let carWash = require('../business/carWash');
let rent = require('../business/rent');
let bar = require('../business/bar');

let business = require('../property/business');

let pickups = exports;
let distanceCheck = 1.4;

pickups.Red = [244, 67, 54, 100];
pickups.Green = [139, 195, 74, 100];
pickups.Blue = [33, 150, 243, 100];
pickups.Yellow = [255, 235, 59, 100];
pickups.Blue100 = [187, 222, 251, 100];
pickups.White = [255, 255, 255, 100];

pickups.PrintShopPos = new mp.Vector3(-1234.7786865234375, -1477.7230224609375, 3.324739933013916);

pickups.StockSapdPos = new mp.Vector3(477.2227, -984.3262, 23.91476);

pickups.BankMazeLiftOfficePos = new mp.Vector3(-77.77799, -829.6542, 242.3859);
pickups.BankMazeLiftStreetPos = new mp.Vector3(-66.66476, -802.0474, 43.22729);
pickups.BankMazeLiftRoofPos = new mp.Vector3(-67.13605, -821.9, 320.2874);
pickups.BankMazeLiftGaragePos = new mp.Vector3(-84.9765, -818.7122, 35.02804);
pickups.BankMazeOfficePos = new mp.Vector3(-72.80013, -816.4397, 242.3859);

pickups.CasinoLiftStreetPos = new mp.Vector3(935.5374755859375, 46.44008255004883, 80.09577178955078);
pickups.CasinoLiftBalconPos = new mp.Vector3(964.3539428710938, 58.81953048706055, 111.5530014038086);
pickups.CasinoLiftRoofPos = new mp.Vector3(972.0299072265625, 52.14411163330078, 119.24087524414062);

pickups.LifeInvaderShopPos = new mp.Vector3(-1083.074, -248.3521, 36.76329);
pickups.HackerSpaceShopPos = new mp.Vector3(522.0684, 167.0983, 98.38704);

pickups.HackerSpaceOutPos = new mp.Vector3(1672.243, -26.09709, 172.7747);
pickups.HackerSpaceInPos = new mp.Vector3(1671.604, -23.82703, 177.2864);

pickups.MeriaUpPos = new mp.Vector3(-1395.997, -479.8439, 71.04215);
pickups.MeriaDownPos = new mp.Vector3(-1379.659, -499.748, 32.15739);
pickups.MeriaRoofPos = new mp.Vector3(-1369, -471.5994, 83.44699);
pickups.MeriaGarPos = new mp.Vector3(-1360.679, -471.8841, 30.59572);
pickups.MeriaGarderobPos = new mp.Vector3(-1380.995, -470.7387, 71.04216);
pickups.MeriaHelpPos = new mp.Vector3(-1381.844, -477.9523, 71.04205);
//pickups.MeriaKeyPos = new mp.Vector3(-1381.507, -466.2556, 71.04215);

pickups.SapdDutyPos = new mp.Vector3(457.5687, -992.9395, 29.69);
pickups.SapdGarderobPos = new mp.Vector3(455.5185, -988.6027, 29.6896);
pickups.SapdArsenalPos = new mp.Vector3(452.057, -980.2347, 29.6896);
pickups.SapdClearPos = new mp.Vector3(440.5925, -975.6348, 29.69);
pickups.SapdArrestPos = new mp.Vector3(459.6778, -989.071, 23.91487);
pickups.SapdToCyberRoomPos = new mp.Vector3(464.357, -983.8818, 34.89194);
pickups.SapdFromCyberRoomPos = new mp.Vector3(463.7193, -1003.186, 31.7847);
pickups.SapdToBalconPos = new mp.Vector3(463.0852, -1009.47, 31.78511);
pickups.SapdFromBalconPos = new mp.Vector3(463.5898, -1012.111, 31.9835);
pickups.SapdToBalcon2Pos = new mp.Vector3(428.4888, -995.2952, 34.68689);
pickups.SapdFromBalcon2Pos = new mp.Vector3(464.1708, -984.0346, 38.89184);
pickups.SapdToInterrogationPos = new mp.Vector3(404.0302, -997.302, -100.004);
pickups.SapdFromInterrogationPos = new mp.Vector3(446.7996, -985.8127, 25.67422);

pickups.SheriffGarderobPos = new mp.Vector3(-452.945, 6013.818, 30.716);
pickups.SheriffGarderobPos2 = new mp.Vector3(1849.775390625, 3695.501953125, 33.26706314086914);
pickups.SheriffArsenalPos = new mp.Vector3(-437.330, 6001.264, 30.716);
pickups.SheriffArsenalPos2 = new mp.Vector3(1845.992431640625, 3692.927734375, 33.26704406738281);
pickups.SheriffClearPos = new mp.Vector3(-448.6859, 6012.703, 30.71638);
pickups.SheriffArrestPos = new mp.Vector3(-441.605, 6012.786, 26.985);
pickups.SheriffArrestPos2 = new mp.Vector3(1856.632080078125, 3685.5849609375, 29.259225845336914);

pickups.PrisonArrestPos = new mp.Vector3(1690.606, 2591.926, 44.83793);
pickups.PrisonPos1 = new mp.Vector3(1846.5198, 2585.9008, 44.6720);
pickups.PrisonPos2 = new mp.Vector3(1774.8231, 2552.00925, 44.5649);

/*pickups.UsmcPos1 = new mp.Vector3(556.8799, -3119.107, 17.76859);
pickups.UsmcPos2 = new mp.Vector3(556.9783, -3120.458, 17.76858);
pickups.UsmcPos11 = new mp.Vector3(581.3184, -3119.271, 17.76858);
pickups.UsmcPos22 = new mp.Vector3(581.518, -3120.49, 17.76858);

pickups.UsmcArsenal1Pos = new mp.Vector3(467.5390319824219, -3212.447509765625, 6.056999683380127);
pickups.UsmcArsenal2Pos = new mp.Vector3(3095.916259765625, -4707.67138671875, 11.24404525756836);*/

//pickups.FibDutyPos = new mp.Vector3(131.0169, -729.158, 257.1521);
//pickups.FibArsenalPos = new mp.Vector3(129.3821, -730.57, 257.1521);
pickups.FibLift0StationPos = new mp.Vector3(122.9873, -741.1865, 32.13323);
pickups.FibLift1StationPos = new mp.Vector3(136.2213, -761.6816, 44.75201);
pickups.FibLift2StationPos = new mp.Vector3(136.2213, -761.6816, 241.152);
pickups.FibLift3StationPos = new mp.Vector3(114.9807, -741.8279, 257.1521);
pickups.FibLift4StationPos = new mp.Vector3(141.4099, -735.3376, 261.8516);

pickups.LicUpPos = new mp.Vector3(-1580.642, -561.7131, 107.523);
pickups.LicDownPos = new mp.Vector3(-1581.576, -557.9908, 33.953);
pickups.LicRoofPos = new mp.Vector3(-1581.576, -557.9908, 33.953);
pickups.LicGaragePos = new mp.Vector3(-1540.117, -576.3737, 24.70784);
pickups.LicBuyPos = new mp.Vector3(-1576.237, -579.495, 107.523);

/*Keys*/
pickups.GovKeyPos = new mp.Vector3(-1397.35693359375, -464.54345703125, 33.4775505065918);
pickups.SapdKeyPos = new mp.Vector3(458.65, -1007.944, 27.27073);
pickups.FibKeyPos = new mp.Vector3(138.4407, -702.3063, 32.12376);
pickups.SheriffKeyPos = new mp.Vector3(-453.48065185546875, 6031.2314453125, 30.340538024902344);
pickups.InvaderKeyPos = new mp.Vector3(-1095.8746337890625, -254.6504669189453, 36.68137741088867);
pickups.Ems1KeyPos = new mp.Vector3(293.5118, -1447.379, 28.96659);
pickups.Usmc1KeyPos = new mp.Vector3(468.5301818847656, -3205.692138671875, 5.069559097290039);
pickups.Usmc2KeyPos = new mp.Vector3(3080.830810546875, -4693.53515625, 14.262321472167969);

/*EMS*/
pickups.EmsGarderobPos1 = new mp.Vector3(299.0457458496094, -598.6067504882812, 42.28403091430664);
pickups.EmsGarderobPos2 = new mp.Vector3(-244.68588256835938, 6318.1396484375, 31.44457244873047);
pickups.EmsTakeMedPos = new mp.Vector3(251.6622, -1346.598, 23.53781);
//pickups.EmsAptekaPos = new mp.Vector3(260.5087, -1358.359, 23.53779);

pickups.EmsInPos = new mp.Vector3(275.4971, -1361.269, 23.53781);
pickups.EmsOutPos = new mp.Vector3(344.0675, -1397.467, 31.50924);
pickups.EmsIn1Pos = new mp.Vector3(306.6194, -1432.875, 28.93673);
pickups.EmsOut1Pos = new mp.Vector3(279.6934, -1349.311, 23.53781);

pickups.EmsElevatorRoofPos = new mp.Vector3(334.7327, -1432.775, 45.51179);
pickups.EmsElevatorParkPos = new mp.Vector3(406.5373, -1347.918, 40.05356);
pickups.EmsElevatorPos = new mp.Vector3(247.0811, -1371.92, 23.53779);

//Apteka
pickups.AptekaPos = new mp.Vector3(318.3438, -1078.762, 18.68166);

pickups.BahamaPos1 = new mp.Vector3(-1387.69, -588.719, 29.3198);
pickups.BahamaPos2 = new mp.Vector3(-1388.88, -586.291, 29.2198);

pickups.TheLostPos1 = new mp.Vector3(982.47, -103.51, 73.848);
pickups.TheLostPos2 = new mp.Vector3(981.03, -101.79, 73.845);

/*ElShop*/
pickups.ElShopPos1 = new mp.Vector3(-658.8024, -855.8863, 23.50986);
pickups.ElShopPos2 = new mp.Vector3(-658.6975, -854.5909, 23.50342);

pickups.ElShopPos11 = new mp.Vector3(1137.675, -470.7754, 65.66285);
pickups.ElShopPos12 = new mp.Vector3(1136.156, -470.4759, 65.70986);

/*Club*/
pickups.ClubGalaxyUserPos1 = new mp.Vector3(-1569.33, -3016.98, -75.40616);
pickups.ClubGalaxyUserPos2 = new mp.Vector3(4.723007, 220.3487, 106.7251);

pickups.ClubGalaxyVPos1 = new mp.Vector3(-1640.193, -2989.592, -78.22095);
pickups.ClubGalaxyVPos2 = new mp.Vector3(-22.13015, 217.3953, 105.5861);

/*ArcMotors*/
pickups.ArcMotorsPos1 = new mp.Vector3(-142.2805, -590.9449, 166);
pickups.ArcMotorsPos2 = new mp.Vector3(-144.3968, -577.2031, 31.42448);

/*Apart*/
pickups.Apart19RoofPos = new mp.Vector3(109.9076, -867.6014, 133.7701);
pickups.Apart16RoofPos = new mp.Vector3(-902.897, -369.9444, 135.2822);
pickups.Apart5GaragePos = new mp.Vector3(-761.8995, 352.0111, 86.99801);
pickups.Apart0GaragePos = new mp.Vector3(-15.46794, -612.5906, 34.86151);

/*Other*/
pickups.WzlInPos = new mp.Vector3(-569.2264, -927.8373, 35.83355);
pickups.WzlOutPos = new mp.Vector3(-598.7546, -929.9592, 22.86355);
pickups.Ems1InPos = new mp.Vector3(-292.4272, -602.7892, 47.43756);
pickups.Ems1OutPos = new mp.Vector3(-292.3299, -600.8806, 32.55319);

/*Bar*/
pickups.BannanaInPos = new mp.Vector3(-1387.63, -588.0929, 29.31953);
pickups.BannanaOutPos = new mp.Vector3(-1388.737, -586.4232, 29.21938);
pickups.ComedyInPos = new mp.Vector3(-458.3946, 284.7393, 77.52148);
pickups.ComedyOutPos = new mp.Vector3(-430.0718, 261.1223, 82.00773);

/*AutoRepairs*/
pickups.AutoRepairsPos1 = new mp.Vector3(1130.324, -776.4052, 56.61017);
pickups.AutoRepairsPos2 = new mp.Vector3(1130.287, -778.5369, 56.62984);
pickups.AutoRepairsPosShop = new mp.Vector3(1128.081, -780.6564, 56.62164);
pickups.AutoRepairsPosCarShop = new mp.Vector3(1154.168, -785.3322, 56.59872);
pickups.AutoRepairsPosCarPos = new mp.Vector3(1150.372, -776.313, 56.59872);

/*Eat Prison*/
pickups.EatPrisonPos = new mp.Vector3(1753.543, 2566.54, 44.56501);

/*Cloth*/
pickups.ClothMaskPos = new mp.Vector3(-1337.255, -1277.948, 3.872962);

/*Jobs*/
pickups.RoadWorkerStartPos = new mp.Vector3(52.84556, -722.4211, 30.7647);
pickups.MainerStartPos = new mp.Vector3(2947.1118, 2745.2358, 42.37148);

pickups.BuilderStartPos = new mp.Vector3(-142.2255, -936.2115, 28.29189);
pickups.BuilderUpPos = new mp.Vector3(-155.5601, -945.4041, 268.1353);
pickups.BuilderDownPos = new mp.Vector3(-163.4722, -942.6283, 28.28476);

pickups.CleanerStartPos = new mp.Vector3(-1539.165, -448.0839, 34.88203);

pickups.SpawnHelpPos = new mp.Vector3(-1026.957, -2734.395, 13.75665);

/*Biz*/
pickups.InvaderPos1 = new mp.Vector3(-1078.19, -254.3557, 43.02112);
pickups.InvaderPos2 = new mp.Vector3(-1072.305, -246.3927, 53.00602);

/*NPC*/
pickups.StartHelpPos = new mp.Vector3(-1033.243, -2735.249, 19.16927);

/*Grab*/
pickups.GrabPos = new mp.Vector3(973.4865, -2190.531, 29.55157);

/*Jobs*/
pickups.Gr6Pos = new mp.Vector3(484.4730224609375, -1094.7589111328125, 28.202163696289062);
pickups.MailPos = new mp.Vector3(78.78807067871094, 111.90670013427734, 80.16815948486328);
pickups.Bus1Pos = new mp.Vector3(461.0713806152344, -573.357666015625, 27.499807357788086);
pickups.Bus2Pos = new mp.Vector3(471.4545593261719, -576.7513427734375, 27.499744415283203);
pickups.Bus3Pos = new mp.Vector3(466.4013671875, -576.0244140625, 27.499794006347656);

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

    if (methods.distanceToPos(pickups.CasinoLiftStreetPos, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.CasinoLiftBalconPos, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.CasinoLiftRoofPos, playerPos) < distanceCheck)
        player.call('client:menuList:showCasinoLiftTeleportMenu');

    if (methods.distanceToPos(pickups.FibLift0StationPos, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.FibLift1StationPos, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.FibLift2StationPos, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.FibLift3StationPos, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.FibLift4StationPos, playerPos) < distanceCheck)
        player.call('client:menuList:showFibOfficeTeleportMenu');

    if (methods.distanceToPos(pickups.MeriaDownPos, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.MeriaGarPos, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.MeriaRoofPos, playerPos) < distanceCheck ||
        methods.distanceToPos(pickups.MeriaUpPos, playerPos) < distanceCheck)
        player.call('client:menuList:showGovOfficeTeleportMenu');

    //if (methods.distanceToPos(pickups.GrabPos, playerPos) < distanceCheck)
    //   player.call('client:clearGrabMoney');

    //if (user.isGos(player))
    //    methods.checkTeleport(player, pickups.PrisonPos1, pickups.PrisonPos2);

    methods.checkTeleport(player, pickups.BahamaPos1, pickups.BahamaPos2);
    //methods.checkTeleport(player, pickups.TheLostPos1, pickups.TheLostPos2);
    /*methods.checkTeleport(player, pickups.UsmcPos1, pickups.UsmcPos2);
    methods.checkTeleport(player, pickups.UsmcPos11, pickups.UsmcPos22);*/
    methods.checkTeleport(player, pickups.EmsInPos, pickups.EmsOutPos);
    methods.checkTeleport(player, pickups.EmsIn1Pos, pickups.EmsOut1Pos);
    //methods.checkTeleport(player, pickups.SapdFromBalconPos, pickups.SapdToCyberRoomPos);
    //methods.checkTeleport(player, pickups.SapdToBalconPos, pickups.SapdFromBalconPos);
    //methods.checkTeleport(player, pickups.SapdToBalcon2Pos, pickups.SapdFromBalcon2Pos);
    //methods.checkTeleport(player, pickups.SapdToInterrogationPos, pickups.SapdFromInterrogationPos);
    //methods.checkTeleport(player, pickups.ComedyInPos, pickups.ComedyOutPos);
    methods.checkTeleport(player, pickups.ClubGalaxyUserPos1, pickups.ClubGalaxyUserPos2);
    methods.checkTeleport(player, pickups.Ems1OutPos, pickups.Ems1InPos);
    methods.checkTeleport(player, pickups.WzlInPos, pickups.WzlOutPos);
    methods.checkTeleport(player, pickups.LicDownPos, pickups.LicUpPos);
    methods.checkTeleport(player, pickups.BuilderDownPos, pickups.BuilderUpPos);
    methods.checkTeleport(player, pickups.InvaderPos2, pickups.InvaderPos1);

    //gr6
    methods.checkTeleport(player, new mp.Vector3(486.0731, -1075.497, 28.00087), new mp.Vector3(486.0519, -1078.475, 28.19953));

    methods.checkTeleportVeh(player, pickups.ArcMotorsPos1, pickups.ArcMotorsPos2);
    methods.checkTeleportVeh(player, pickups.ClubGalaxyVPos1, pickups.ClubGalaxyVPos2);
};

pickups.checkPressE = function(player) {
    methods.debug('pickups.checkPressE');
    if (!user.isLogin(player))
        return;

    let playerPos = player.position;

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
    carWash.checkPosForOpenMenu(player);
    rent.checkPosForOpenMenu(player);
    bar.checkPosForOpenMenu(player);

    if (methods.distanceToPos(pickups.LifeInvaderShopPos, playerPos) < distanceCheck)
        player.call('client:menuList:showInvaderShopMenu');

    if (methods.distanceToPos(pickups.PrintShopPos, playerPos) < distanceCheck)
        player.call('client:menuList:showPrintShopMenu');

    if (methods.distanceToPos(pickups.BankMazeOfficePos, playerPos) < distanceCheck)
        player.call('client:menuList:showMazeOfficeMenu');
    if (methods.distanceToPos(pickups.MeriaHelpPos, playerPos) < distanceCheck)
        player.call('client:menuList:showMeriaMainMenu');

    if (methods.distanceToPos(pickups.GovKeyPos, playerPos) < distanceCheck && user.isGov(player))
        player.call('client:menuList:showFractionKeyMenu', [methods.getFractionAllowCarList(1)]);
    else if (methods.distanceToPos(pickups.SapdKeyPos, playerPos) < distanceCheck && user.isSapd(player))
        player.call('client:menuList:showFractionKeyMenu', [methods.getFractionAllowCarList(2)]);
    else if (methods.distanceToPos(pickups.FibKeyPos, playerPos) < distanceCheck && user.isFib(player))
        player.call('client:menuList:showFractionKeyMenu', [methods.getFractionAllowCarList(3)]);
    else if (methods.distanceToPos(pickups.SheriffKeyPos, playerPos) < distanceCheck && user.isSheriff(player))
        player.call('client:menuList:showFractionKeyMenu', [methods.getFractionAllowCarList(7)]);
    else if (methods.distanceToPos(pickups.InvaderKeyPos, playerPos) < distanceCheck && user.isPrison(player))
        player.call('client:menuList:showFractionKeyMenu', [methods.getFractionAllowCarList(5)]);
    else if (methods.distanceToPos(pickups.Ems1KeyPos, playerPos) < distanceCheck && user.isEms(player))
        player.call('client:menuList:showFractionKeyMenu', [methods.getFractionAllowCarList(16)]);
    else if (methods.distanceToPos(pickups.Usmc1KeyPos, playerPos) < distanceCheck && user.isUsmc(player))
        player.call('client:menuList:showFractionKeyMenu', [methods.getFractionAllowCarList(4)]);
    else if (methods.distanceToPos(pickups.Usmc2KeyPos, playerPos) < distanceCheck && user.isUsmc(player))
        player.call('client:menuList:showFractionKeyMenu', [methods.getFractionAllowCarList(104)]);

    if (player.dimension > 0) {
        if (methods.distanceToPos(business.BusinessBotPos, playerPos) < distanceCheck)
            player.call('client:menuList:showBusinessMenu', [Array.from(business.getData(player.dimension))]);
    }
    if (user.isGov(player)) {
        if (methods.distanceToPos(pickups.MeriaGarderobPos, playerPos) < distanceCheck)
            player.call('client:menuList:showGovGarderobMenu');
    }
    if (user.isSapd(player)) {
        if (methods.distanceToPos(pickups.SapdGarderobPos, playerPos) < distanceCheck)
            player.call('client:menuList:showSapdGarderobMenu');
        if (methods.distanceToPos(pickups.SapdClearPos, playerPos) < distanceCheck)
            player.call('client:menuList:showSapdClearMenu');
        if (methods.distanceToPos(pickups.SapdArrestPos, playerPos) < distanceCheck)
            player.call('client:menuList:showSapdArrestMenu');
        if (methods.distanceToPos(pickups.SapdArsenalPos, playerPos) < distanceCheck)
            player.call('client:menuList:showSapdArsenalMenu');
    }
    if (user.isEms(player)) {
        if (methods.distanceToPos(pickups.EmsGarderobPos1, playerPos) < distanceCheck)
            player.call('client:menuList:showEmsGarderobMenu');
        if (methods.distanceToPos(pickups.EmsGarderobPos2, playerPos) < distanceCheck)
            player.call('client:menuList:showEmsGarderobMenu');
    }
    if (user.isSheriff(player)) {
        if (methods.distanceToPos(pickups.SheriffGarderobPos, playerPos) < distanceCheck)
            player.call('client:menuList:showSheriffGarderobMenu');
        if (methods.distanceToPos(pickups.SheriffGarderobPos2, playerPos) < distanceCheck)
            player.call('client:menuList:showSheriffGarderobMenu');
        if (methods.distanceToPos(pickups.SheriffArsenalPos, playerPos) < distanceCheck)
            player.call('client:menuList:showSheriffArsenalMenu');
        if (methods.distanceToPos(pickups.SheriffArsenalPos2, playerPos) < distanceCheck)
            player.call('client:menuList:showSheriffArsenalMenu');
        if (methods.distanceToPos(pickups.SapdClearPos, playerPos) < distanceCheck)
            player.call('client:menuList:showSapdClearMenu');
        if (methods.distanceToPos(pickups.SheriffClearPos, playerPos) < distanceCheck)
            player.call('client:menuList:showSapdClearMenu');
        if (methods.distanceToPos(pickups.SheriffArrestPos, playerPos) < distanceCheck)
            player.call('client:menuList:showSapdArrestMenu');
        if (methods.distanceToPos(pickups.SheriffArrestPos2, playerPos) < distanceCheck)
            player.call('client:menuList:showSapdArrestMenu');
    }
    if (user.isSheriff(player) || user.isFib(player) || user.isSapd(player)) {
        if (methods.distanceToPos(pickups.PrisonArrestPos, playerPos) < distanceCheck)
            player.call('client:menuList:showSapdArrestMenu');
    }
    /*if (user.isFib(player)) {
        if (methods.distanceToPos(pickups.FibArsenalPos, playerPos) < distanceCheck)
            player.call('client:menuList:showFibArsenalMenu');
    }
    if (user.isUsmc(player)) {
        if (methods.distanceToPos(pickups.UsmcArsenal1Pos, playerPos) < distanceCheck)
            player.call('client:menuList:showUsmcArsenalMenu');
        if (methods.distanceToPos(pickups.UsmcArsenal2Pos, playerPos) < distanceCheck)
            player.call('client:menuList:showUsmcArsenalMenu');
    }*/

    try {
        if (user.isJobMail(player) && methods.distanceToPos(pickups.MailPos, playerPos) < distanceCheck)
            player.call('client:menuList:showSpawnJobCarMailMenu');
        if (user.isJobGr6(player) && methods.distanceToPos(pickups.Gr6Pos, playerPos) < distanceCheck)
            player.call('client:menuList:showSpawnJobCarMenu', [500, 484.1923522949219, -1103.3271484375, 28.807828903198242, 128.7122802734375, 'Stockade', 10]);
        if (user.isJobBus1(player) && methods.distanceToPos(pickups.Bus1Pos, playerPos) < distanceCheck)
            player.call('client:menuList:showSpawnJobCarMenu', [150, 459.72247314453125, -582.0006103515625, 28.495769500732422, 170.3814697265625, 'Bus', 6]);
        if (user.isJobBus2(player) && methods.distanceToPos(pickups.Bus2Pos, playerPos) < distanceCheck)
            player.call('client:menuList:showSpawnJobCarMenu', [100, 471.0755920410156, -583.989501953125, 28.49574089050293, 173.3385009765625, 'Airbus', 7]);
        if (user.isJobBus3(player) && methods.distanceToPos(pickups.Bus3Pos, playerPos) < distanceCheck)
            player.call('client:menuList:showSpawnJobCarMenu', [200, 465.9425048828125, -582.1303100585938, 29.325841903686523, 173.46160888671875, 'Coach', 8]);
    }
    catch (e) {
        methods.debug('TEST', e);
    }

};

pickups.createPickups = function() {
    methods.debug('pickups.createPickups');
    //NPC
    //methods.createStaticCheckpointV(pickups.StartHelpPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Yellow);

    //AutoRepairs
    //methods.createStaticCheckpointV(pickups.AutoRepairsPosShop, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    //methods.createStaticCheckpointV(pickups.AutoRepairsPosCarShop, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    //methods.createStaticCheckpointV(pickups.AutoRepairsPosCarPos, 'Место для ремонта транспорта', 1, -1, pickups.Blue);

    //Eat Prison
    methods.createStaticCheckpointV(pickups.EatPrisonPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);

    //EMS
    methods.createStaticCheckpointV(pickups.EmsGarderobPos1, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createStaticCheckpointV(pickups.EmsGarderobPos2, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    //methods.createStaticCheckpointV(pickups.EmsTakeMedPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    //methods.createStaticCheckpointV(pickups.EmsAptekaPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);

    //Apteka
    //methods.createStaticCheckpointV(pickups.AptekaPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    //methods.createStaticCheckpointV(pickups.TheLostPos1, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    //methods.createStaticCheckpointV(pickups.TheLostPos2, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.BahamaPos1, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.BahamaPos2, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.PrisonPos1, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.PrisonPos2, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    //methods.createStaticCheckpointV(pickups.AptekaEnterPos1, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);

    /*methods.createStaticCheckpointV(pickups.UsmcPos1, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.UsmcPos2, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.UsmcPos11, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.UsmcPos22, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);*/

    //Keys
    methods.createStaticCheckpointV(pickups.Ems1KeyPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    //methods.createStaticCheckpointV(pickups.Usmc1KeyPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    //methods.createStaticCheckpointV(pickups.Usmc2KeyPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createStaticCheckpointV(pickups.GovKeyPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    //methods.createStaticCheckpointV(pickups.FibKeyPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);

    //Hackerspace
    methods.createStaticCheckpointV(pickups.HackerSpaceShopPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    //Hackerspace
    methods.createStaticCheckpointV(pickups.PrintShopPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);

    //Invader
    methods.createStaticCheckpointV(pickups.LifeInvaderShopPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);

    //EMS
    methods.createStaticCheckpointV(pickups.EmsInPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.EmsOutPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);

    methods.createStaticCheckpointV(pickups.EmsIn1Pos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.EmsOut1Pos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);

    methods.createStaticCheckpointV(pickups.EmsElevatorPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.EmsElevatorParkPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.EmsElevatorRoofPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);

    //SAPD
    /*methods.createStaticCheckpointV(pickups.SapdFromCyberRoomPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.SapdToCyberRoomPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.SapdToBalconPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.SapdFromBalconPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.SapdToBalcon2Pos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.SapdFromBalcon2Pos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.SapdFromInterrogationPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.SapdToInterrogationPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);*/

    //methods.createStaticCheckpointV(pickups.SapdToInterrogationPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    //Checkpoint.Create(SapdToInterrogationPos, 1.4, "pickup:teleport");

    //methods.createStaticCheckpointV(pickups.SapdFromInterrogationPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    //Checkpoint.Create(SapdFromInterrogationPos, 1.4, "pickup:teleport");

    //Maze Bank
    methods.createStaticCheckpointV(pickups.BankMazeLiftOfficePos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.BankMazeLiftStreetPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.BankMazeLiftRoofPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.BankMazeLiftGaragePos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.BankMazeOfficePos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);

    methods.createStaticCheckpointV(pickups.CasinoLiftStreetPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.CasinoLiftBalconPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.CasinoLiftRoofPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);

    //Meria
    methods.createStaticCheckpointV(pickups.MeriaUpPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.MeriaDownPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.MeriaRoofPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.MeriaGarPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.MeriaGarderobPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createStaticCheckpointV(pickups.MeriaHelpPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);

    //SAPD
    //methods.createStaticCheckpointV(pickups.SapdDutyPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createStaticCheckpointV(pickups.SapdGarderobPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createStaticCheckpointV(pickups.SapdArsenalPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    //methods.createStaticCheckpointV(pickups.StockSapdPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createStaticCheckpointV(pickups.SapdClearPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createStaticCheckpointV(pickups.SapdArrestPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createStaticCheckpointV(pickups.SapdKeyPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);

    methods.createStaticCheckpointV(pickups.SheriffKeyPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createStaticCheckpointV(pickups.InvaderKeyPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createStaticCheckpointV(pickups.SheriffClearPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createStaticCheckpointV(pickups.SheriffGarderobPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createStaticCheckpointV(pickups.SheriffGarderobPos2, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createStaticCheckpointV(pickups.SheriffArrestPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createStaticCheckpointV(pickups.SheriffArrestPos2, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createStaticCheckpointV(pickups.SheriffArsenalPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createStaticCheckpointV(pickups.SheriffArsenalPos2, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);

    methods.createStaticCheckpointV(pickups.PrisonArrestPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);

    //FIB
    //methods.createStaticCheckpointV(pickups.FibDutyPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);

   /* methods.createStaticCheckpointV(pickups.UsmcArsenal1Pos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createStaticCheckpointV(pickups.UsmcArsenal2Pos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);

    methods.createStaticCheckpointV(pickups.FibArsenalPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);*/
    methods.createStaticCheckpointV(pickups.FibLift0StationPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.FibLift1StationPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.FibLift2StationPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.FibLift3StationPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.FibLift4StationPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);

    //Bar
    /*methods.createStaticCheckpointV(pickups.BannanaInPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    Checkpoint.Create(BannanaInPos, 1.4, "pickup:teleport:menu");

    methods.createStaticCheckpointV(pickups.BannanaOutPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    Checkpoint.Create(BannanaOutPos, 1.4, "pickup:teleport:menu");*/

    /*methods.createStaticCheckpointV(pickups.ComedyInPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.ComedyOutPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);*/

    //methods.createStaticCheckpointV(pickups.AutoRepairsPos1, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    //methods.createStaticCheckpointV(pickups.AutoRepairsPos2, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);

    //Apart
    methods.createStaticCheckpointV(pickups.Apart0GaragePos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createStaticCheckpointV(pickups.Apart5GaragePos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createStaticCheckpointV(pickups.Apart16RoofPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createStaticCheckpointV(pickups.Apart19RoofPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);

    //ElShop

    //ClubGalaxy
    methods.createStaticCheckpointV(pickups.ClubGalaxyUserPos1, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.ClubGalaxyUserPos2, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    //methods.createStaticCheckpointV(pickups.ClubGalaxyVPos1, 4, 0.3, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.ClubGalaxyVPos2, "Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом", 4, -1, pickups.Blue100, 0.3);

    //ArcMotors
    methods.createStaticCheckpointV(pickups.ArcMotorsPos1, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 4, -1, pickups.Blue100, 0.3);
    methods.createStaticCheckpointV(pickups.ArcMotorsPos2, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 4, -1, pickups.Blue100, 0.3);

    //Other
    methods.createStaticCheckpointV(pickups.Ems1OutPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.Ems1InPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);

    methods.createStaticCheckpointV(pickups.WzlInPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.WzlOutPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);

    //Business
    methods.createStaticCheckpointV(business.BusinessOfficePos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(business.BusinessStreetPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(business.BusinessMotorPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(business.BusinessRoofPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(business.BusinessGaragePos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(business.BusinessBotPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);

    //Lic
    methods.createStaticCheckpointV(pickups.LicUpPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.LicDownPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.LicRoofPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.LicGaragePos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.LicBuyPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);

    //Cloth
    //methods.createStaticCheckpointV(pickups.ClothMaskPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);

    //RoadWorker
    methods.createStaticCheckpointV(pickups.RoadWorkerStartPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createStaticCheckpointV(pickups.MainerStartPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);

    //Builder
    methods.createStaticCheckpointV(pickups.BuilderStartPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);
    methods.createStaticCheckpointV(pickups.BuilderUpPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.BuilderDownPos, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.CleanerStartPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);

    //
    //methods.createStaticCheckpointV(pickups.GrabPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, pickups.Blue);

    methods.createStaticCheckpointV(pickups.InvaderPos1, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);
    methods.createStaticCheckpointV(pickups.InvaderPos2, 'Нажмите ~g~Left Alt~s~ чтобы воспользоваться пикапом', 1, -1, pickups.Blue100);

    //JOBS
    methods.createStaticCheckpointV(pickups.Gr6Pos, 'Нажмите ~g~E~s~ чтобы открыть меню инкассатора', 1, -1, pickups.Blue);
    methods.createStaticCheckpointV(pickups.MailPos, 'Нажмите ~g~E~s~ чтобы открыть меню почтальона', 1, -1, pickups.Blue);
    methods.createStaticCheckpointV(pickups.Bus1Pos, 'Нажмите ~g~E~s~ чтобы открыть меню городского рейса', 1, -1, pickups.Blue);
    methods.createStaticCheckpointV(pickups.Bus2Pos, 'Нажмите ~g~E~s~ чтобы открыть меню трансферного рейса', 1, -1, pickups.Blue);
    methods.createStaticCheckpointV(pickups.Bus3Pos, 'Нажмите ~g~E~s~ чтобы открыть меню рейсового рейса', 1, -1, pickups.Blue);
};