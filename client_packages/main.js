!function(e){var t={};function a(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,a),i.l=!0,i.exports}a.m=e,a.c=t,a.d=function(e,t,n){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)a.d(n,i,function(t){return e[t]}.bind(null,i));return n},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="",a(a.s=0)}([function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}var i=n(a(1)),r=n(a(2));try{for(let e=0;e<i.default.hashesMap.length;e++)i.default.hashesMap[e][1]*=2;mp.game.ped.setAiMeleeWeaponDamageModifier(1.5),mp.game.player.setMeleeWeaponDefenseModifier(1.5),mp.game.player.setWeaponDefenseModifier(1.5),mp.events.add("guiReady",()=>{r.default.create()})}catch(e){}},function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});let n={hashesMap:[["SniperRifle",100416529],["FireExtinguisher",101631238],["CompactGrenadeLauncher",1980066947],["Snowball",126349499],["VintagePistol",137902532],["CombatPDW",171789620],["HeavySniper_Mk2",1429927647],["HeavySniper",205991906],["SweeperShotgun",-1652067232],["MicroSMG",324215364],["Wrench",419712736],["Pistol",453432689],["PumpShotgun",487013001],["APPistol",584646201],["Ball",600439132],["Molotov",615608432],["SMG",736523883],["StickyBomb",741814745],["PetrolCan",883325847],["StunGun",911657153],["AssaultRifle_Mk2",961495388],["HeavyShotgun",984333226],["Minigun",1119849093],["GolfClub",1141786504],["FlareGun",1198879012],["Flare",1233104067],["GrenadeLauncherSmoke",-275866417],["Hammer",1317494643],["CombatPistol",1593441988],["Gusenberg",1627465347],["CompactRifle",1649403952],["HomingLauncher",1672152130],["Nightstick",1737195953],["Railgun",1834241177],["SawnOffShotgun",2017895192],["SMG_Mk2",166524245],["BullpupRifle",2132975508],["Firework",2138347493],["CombatMG",2144741730],["CarbineRifle",-2084633992],["Crowbar",-2067956739],["Flashlight",-1951375401],["Dagger",-1834847097],["Grenade",-1813897027],["PoolCue",-1810795771],["Bat",-1786099057],["Pistol50",-1716589765],["Knife",-1716189206],["MG",-1660422300],["BullpupShotgun",-1654528753],["BZGas",-1600701090],["Unarmed",-1569615261],["GrenadeLauncher",-1568386805],["NightVision",-1843655570],["Musket",-1466123874],["ProximityMine",986082911],["AdvancedRifle",-1357824103],["RPG",-1312131151],["PipeBomb",-1169823560],["MiniSMG",-1121678507],["SNSPistol",-1076751822],["PistolMk2",-1075685676],["AssaultRifle",-1074790547],["SpecialCarbine",-1063057011],["Revolver",-1045183535],["MarksmanRifle",-952879014],["BattleAxe",-853065399],["HeavyPistol",-771403250],["Knuckle",-656458692],["MachinePistol",-619010992],["CombatMG_Mk2",-439798208],["MarksmanPistol",-598887786],["Machete",-581044007],["SwitchBlade",-538741184],["AssaultShotgun",-494615257],["DoubleBarrelShotgun",-275439685],["AssaultSMG",-270015777],["Hatchet",-102973651],["Bottle",-102323637],["CarbineRifle_Mk2",1085370391],["BullpupRifle_Mk2",-2066285827],["Parachute",-196322845],["SmokeGrenade",-37975472]],hashes:{SniperRifle:100416529,FireExtinguisher:101631238,CompactGrenadeLauncher:125959754,Snowball:126349499,VintagePistol:137902532,CombatPDW:171789620,HeavySniperMk2:177293209,HeavySniper:205991906,SweeperShotgun:317205821,MicroSMG:324215364,Wrench:419712736,Pistol:453432689,PumpShotgun:487013001,APPistol:584646201,Ball:600439132,Molotov:615608432,SMG:736523883,StickyBomb:741814745,PetrolCan:883325847,StunGun:911657153,AssaultRifleMk2:961495388,HeavyShotgun:984333226,Minigun:1119849093,GolfClub:1141786504,FlareGun:1198879012,Flare:1233104067,GrenadeLauncherSmoke:1305664598,Hammer:1317494643,CombatPistol:1593441988,Gusenberg:1627465347,CompactRifle:1649403952,HomingLauncher:1672152130,Nightstick:1737195953,Railgun:1834241177,SawnOffShotgun:2017895192,SMGMk2:2024373456,BullpupRifle:2132975508,Firework:2138347493,CombatMG:2144741730,CarbineRifle:2210333304,Crowbar:2227010557,Flashlight:2343591895,Dagger:2460120199,Grenade:2481070269,PoolCue:2484171525,Bat:2508868239,Pistol50:2578377531,Knife:2578778090,MG:2634544996,BullpupShotgun:2640438543,BZGas:2694266206,Unarmed:2725352035,GrenadeLauncher:2726580491,NightVision:2803906140,Musket:2828843422,ProximityMine:2874559379,AdvancedRifle:2937143193,RPG:2982836145,PipeBomb:3125143736,MiniSMG:3173288789,SNSPistol:3218215474,PistolMk2:3219281620,AssaultRifle:3220176749,SpecialCarbine:3231910285,Revolver:3249783761,MarksmanRifle:3342088282,BattleAxe:3441901897,HeavyPistol:3523564046,Knuckle:3638508604,MachinePistol:3675956304,CombatMGMk2:3686625920,MarksmanPistol:3696079510,Machete:3713923289,SwitchBlade:3756226112,AssaultShotgun:3800352039,DoubleBarrelShotgun:4019527611,AssaultSMG:4024951519,Hatchet:4191993645,Bottle:4192643659,CarbineRifleMk2:4208062921,Parachute:4222310262,SmokeGrenade:4256991824}};t.default=n},function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});let n={},i=null;n.create=function(){i=mp.browsers.new("package://cef/index.html")},mp.events.add("onMessageFromServer",e=>{i.execute(`trigger('onMessageFromClient', '${e}')`)}),mp.events.add("showUrl",e=>{mp.gui.chat.push(e)}),mp.events.add("chatMsg",e=>{mp.gui.chat.push(e)}),mp.keys.bind(123,!0,()=>{let e=!mp.gui.cursor.visible;mp.gui.cursor.show(e,e)}),mp.keys.bind(122,!0,()=>{i.execute("trigger('onMessageFromClient', {type: 'show'})"),mp.gui.chat.push("F11!")}),t.default=n}]);