let user = require('../user');
let methods = require('../modules/methods');

let wheel = exports;

wheel.isBlock = false;

wheel.start = function (player) {
    if (user.isLogin(player)) {
        if (wheel.isBlock) {
            player.notify('~r~Таймаут 60 секунд, подождите');
            return;
        }
        if (user.get(player, 'online_wheel') < 21) {
            player.notify(`~r~Вы еще не отыграли 3 часа на сервере\nВам осталось: ${((21 - user.get(player, 'online_wheel')) * 8.5).toFixed(1)} мин.`);
            return;
        }
        if (user.get(player, 'online_wheel') > 999) {
            player.notify(`~r~Вы уже крутили колесо сегодня.`);
            return;
        }
        wheel.isBlock = true;

        try {
            player.call('client:casino:wheel:start');
            user.set(player, 'online_wheel', 1000);
        }
        catch (e) {
            
        }

        setTimeout(function () {
            wheel.isBlock = false;
        }, 60000)
    }
};

mp.events.add('server:casino:wheel:doRoll', (player) => {
    if (!user.isLogin(player))
        return;
    try {
        let userWin = methods.getRandomInt(0, 20);
        user.set(player, 'wheelWin', userWin);
        mp.players.callInRange(player.position, 100, 'client:casino:wheel:doRoll', [userWin, player.id]);
    }
    catch (e) {
        
    }
    //player.call('client:casino:wheel:doRoll', [userWin]);
});

mp.events.add('server:casino:wheel:block', (player) => {
    wheel.isBlock = true;
});

mp.events.add('server:casino:wheel:unblock', (player) => {
    wheel.isBlock = false;
});

mp.events.add('server:casino:wheel:finalRoll', (player) => {
    if (!user.isLogin(player) || !user.has(player, 'wheelWin'))
        return;

    try {
        let win = user.get(player, 'wheelWin');
        if (win < 1) {
            user.addCashMoney(player, 40000, 'Колесо удачи');
            player.notifyWithPicture('Diamond Casino', '~g~Колесо Удачи', `Вы выиграли ~g~$40,000`, 'CHAR_CASINO');
        }
        else if (win < 3) {
            user.addCashMoney(player, 20000, 'Колесо удачи');
            player.notifyWithPicture('Diamond Casino', '~g~Колесо Удачи', `Вы выиграли ~g~$20,000`, 'CHAR_CASINO');
        }
        else if (win < 10) {
            user.addCashMoney(player, 5000, 'Колесо удачи');
            player.notifyWithPicture('Diamond Casino', '~g~Колесо Удачи', `Вы выиграли ~g~$5,000`, 'CHAR_CASINO');
        }
        else {
            user.addCashMoney(player, 2000, 'Колесо удачи');
            player.notifyWithPicture('Diamond Casino', '~g~Колесо Удачи', `Вы выиграли ~g~$2,000`, 'CHAR_CASINO');
        }
    }
    catch (e) {
        
    }
});