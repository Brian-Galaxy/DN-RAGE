import Container from '../modules/data';
import methods from '../modules/methods';
import jobPoint from '../manager/jobPoint';
import user from '../user';

let loader = {};

let isStart = false;
let isProcess = false;
let count = 0;
let _checkpointId = -1;

let takePos = new mp.Vector3(-422.5669250488281, -2635.786376953125, 7.761137008666992);
let putPos = new mp.Vector3(-402.14495849609375, -2638.96044921875, 5.000218868255615);

loader.startOrEnd = function() {
    try {
        methods.debug('Execute: builder.startOrEnd');


        if (user.getCache('role') != 1) {
            mp.game.ui.notifications.show('~r~Доступно только для иммигрантов');
            return;
        }

        if (user.getCache('job') > 0) {
            mp.game.ui.notifications.show('~r~Вы не можете работать на этой работе сейчас');
            return;
        }

        if (isStart) {

            if (count >= 30 && user.getCache('quest_role_0') === 0) {
                mp.game.ui.notifications.show('~b~Вы выполнили задание от Каспера, в награду получили $100');
                user.addCashMoney(100, 'Работа от Каспера');
                user.set('quest_role_0', 1);
            }

            user.addCashMoney(count, 'Работа от Каспера');
            jobPoint.delete();
            user.updateCharacterCloth();

            mp.game.ui.notifications.show('~b~Вы закончили рабочий день');

            isStart = false;
            isProcess = false;
            count = 0;
            _checkpointId = -1;
        }
        else {

            mp.game.ui.notifications.show('~b~Вы начали рабочий день');

            if (user.getSex() == 1)
            {
                user.setComponentVariation(3, 55, 0);
                user.setComponentVariation(8, 36, 0);
                user.setComponentVariation(11, 0, 0);
            }
            else
            {
                user.setComponentVariation(3, 30, 0);
                user.setComponentVariation(8, 59, methods.getRandomInt(0, 2));
                user.setComponentVariation(11, 0, 0);
            }

            isStart = true;

            _checkpointId = jobPoint.create(takePos);
        }

    } catch (e) {
        methods.debug('Exception: builder.startOrEnd');
        methods.debug(e);
    }
};

loader.workProcess = function() {
    try {
        methods.debug('Execute: builder.findRandomPickup');

        jobPoint.delete();
        if (isProcess) {
            isProcess = false;
            count++;
            mp.attachmentMngr.removeLocal('loader');
            user.stopAllAnimation();
            _checkpointId = jobPoint.create(takePos);
            mp.game.ui.notifications.show(`~b~Вы перенесли ~s~${count}~b~ ящиков`);
            return;
        }

        isProcess = true;
        user.playAnimation("anim@heists@box_carry@", "idle", 49);
        mp.attachmentMngr.addLocal('loader');
        _checkpointId = jobPoint.create(putPos);
    } catch (e) {
        methods.debug('Exception: builder.findRandomPickup');
        methods.debug(e);
    }
};

mp.events.add("playerEnterCheckpoint", (checkpoint) => {
    if (!isStart)
        return;
    if (_checkpointId == -1 || _checkpointId == undefined)
        return;
    if (checkpoint.id == _checkpointId)
        loader.workProcess();
});

export default loader;