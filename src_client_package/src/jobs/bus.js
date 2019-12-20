import methods from '../modules/methods';
import user from '../user';
import jobPoint from '../manager/jobPoint';

let bus = {};

let _isBus1 = false;
let _isBus2 = false;
let _isBus3 = false;
let _checkpointId = -1;
let _currentId = 0;

bus.markers1 = [[-1032.266,-2724.416,12.65254],[189.878,-1988.402,17.70164],[146.5654,-1734.431,28.08748],[-214.3812,-1003.525,28.17548],[-72.5507,-618.2736,35.09362],[-503.8881,20.96746,43.68846],[-1191.871,-270.6994,36.61627],[-1619.696,-531.4001,33.41887],[-1231.549,-1134.148,6.699632],[-658.9761,-1400.086,9.50183],[-556.3972,-1753.336,20.77087]];
bus.markers2 = [
    [-925.1628, -2320.734, 20.11593],
    [-1032.885, -2729.676, 20.11244],
    [-809.0793, -2466.783, 13.85843],
    [-686.7441, -2128.663, 13.62766],
    [-347.187, -2111.682, 24.03776],
    [-168.0055, -2108.106, 24.79468],
    [117.9054, -2044.946, 18.37168],
    [215.6207, -1954.056, 21.51428],
    [267.7746, -1891.401, 26.65105],
    [365.6594, -1775.07, 29.16373],
    [454.3903, -1661.197, 29.29699],
    [350.7339, -1532.453, 29.30629],
    [257.7349, -1453.839, 29.33812],
    [182.2527, -1404.326, 29.34013],
    [22.58355, -1355.378, 29.16117],
];
bus.markers3 = [[-214.3812,-1003.525,28.17548],[2761.002,4618.438,43.94569],[-216.0822,6172.684,30.2277],[-2275.199,4255.438,42.92985],[-3014.472,368.9521,13.75097]];

bus.start = function(busType) {
    try {
        methods.debug('Execute: bus.start');
        switch (busType) {
            case 1: {
                if (_isBus1) break;
                _isBus1 = true;
                _currentId = 0;
                _checkpointId = jobPoint.create(new mp.Vector3(bus.markers1[_currentId][0], bus.markers1[_currentId][1], bus.markers1[_currentId][2]), true, 3);
                _currentId++;
                mp.game.ui.notifications.show('~g~Вы начали рейс, не выходите из автобуса до конца поездки');
                break;
            }
            case 2: {
                if (_isBus2) break;
                _isBus2 = true;
                _currentId = 0;
                _checkpointId = jobPoint.create(new mp.Vector3(bus.markers2[_currentId][0], bus.markers2[_currentId][1], bus.markers2[_currentId][2]), true, 3);
                _currentId++;
                mp.game.ui.notifications.show('~g~Вы начали рейс, не выходите из автобуса до конца поездки');
                break;
            }
            case 3: {
                if (_isBus3) break;
                _isBus3 = true;
                _currentId = 0;
                _checkpointId = jobPoint.create(new mp.Vector3(bus.markers3[_currentId][0], bus.markers3[_currentId][1], bus.markers3[_currentId][2]), true, 3);
                _currentId++;
                mp.game.ui.notifications.show('~g~Вы начали рейс, не выходите из автобуса до конца поездки');
                break;
            }
        }

    } catch (e) {
        methods.debug('Exception: bus.start');
        methods.debug(e);
    }
};

bus.nextCheckpoint = function() {
    mp.game.ui.notifications.show('~g~Ожидайте 10 секунд');
    jobPoint.delete();
    mp.players.local.freezePosition(true);

    setTimeout(function () {
        mp.players.local.freezePosition(false);
        try {
            methods.debug('Execute: bus.nextCheckpoint');
            if (mp.players.local.vehicle) {
                switch (mp.players.local.vehicle.model) {
                    case mp.game.joaat('bus'): {
                        if (!_isBus1) {
                            bus.stop();
                            break;
                        }

                        if (_currentId > 10) {
                            user.giveJobMoney(250);
                            user.giveJobSkill();
                            mp.game.ui.notifications.show('~g~Вы закончили свой рейс');

                            _isBus1 = false;
                            _currentId = 0;
                            _checkpointId = -1;
                            break;
                        }

                        _checkpointId = jobPoint.create(new mp.Vector3(bus.markers1[_currentId][0], bus.markers1[_currentId][1], bus.markers1[_currentId][2]), true, 3);
                        _currentId++;
                        mp.game.ui.notifications.show('~b~Двигайтесь к следующей остановке');
                        break;
                    }
                    case mp.game.joaat('airbus'): {
                        if (!_isBus2) {
                            bus.stop();
                            break;
                        }

                        if (_currentId > 1) {
                            user.giveJobMoney(79);
                            user.giveJobSkill();
                            mp.game.ui.notifications.show('~g~Вы закончили свой рейс');

                            _isBus2 = false;
                            _currentId = 0;
                            _checkpointId = -1;
                            break;
                        }

                        _checkpointId = jobPoint.create(new mp.Vector3(bus.markers2[_currentId][0], bus.markers2[_currentId][1], bus.markers2[_currentId][2]), true, 3);
                        _currentId++;
                        mp.game.ui.notifications.show('~b~Двигайтесь к следующей остановке');
                        break;
                    }
                    case mp.game.joaat('coach'): {
                        if (!_isBus3) {
                            bus.stop();
                            break;
                        }

                        if (_currentId > 4) {
                            user.giveJobMoney(321);
                            user.giveJobSkill();
                            mp.game.ui.notifications.show('~g~Вы закончили свой рейс');

                            _isBus3 = false;
                            _currentId = 0;
                            _checkpointId = -1;
                            break;
                        }

                        _checkpointId = jobPoint.create(new mp.Vector3(bus.markers3[_currentId][0], bus.markers3[_currentId][1], bus.markers3[_currentId][2]), true, 3);
                        _currentId++;
                        mp.game.ui.notifications.show('~b~Двигайтесь к следующей остановке');
                        break;
                    }
                    default:
                        bus.stop();
                        break;
                }
            }
            else
                bus.stop();



        } catch (e) {
            methods.debug('Exception: bus.nextCheckpoint');
            methods.debug(e);
        }
    }, 10000);
};

bus.stop = function() {
    jobPoint.delete();
    mp.players.local.freezePosition(false);

    _isBus1 = false;
    _isBus2 = false;
    _isBus3 = false;
    _checkpointId = -1;
    _currentId = 0;

    mp.game.ui.notifications.show('~r~Ваш рейс досрочно завершен');
};

mp.events.add("playerEnterCheckpoint", (checkpoint) => {
    if (_checkpointId == -1 || _checkpointId == undefined)
        return;
    if (checkpoint.id == _checkpointId)
        bus.nextCheckpoint();
});

export default bus;