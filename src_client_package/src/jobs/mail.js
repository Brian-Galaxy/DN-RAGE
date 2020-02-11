import Container from '../modules/data';
import methods from '../modules/methods';
import user from '../user';

let mail = {};

mail.sendMail = function(houseId) {
    try {
        methods.debug('Execute: mail.sendMail');
        if (Container.Data.HasLocally(mp.players.local.id, 'mail')) {
            if (Container.Data.GetLocally(mp.players.local.id, 'mail') > 0) {
                Container.Data.Set(houseId, 'isMail', true);
                Container.Data.SetLocally(mp.players.local.id, 'mail', Container.Data.GetLocally(mp.players.local.id, 'mail') - 1);
                mp.game.ui.notifications.show(`~g~Вы отнесли почту ${Container.Data.GetLocally(mp.players.local.id, 'mail')}/10`);
                user.giveJobSkill();
                user.giveJobMoney(11);
                user.addRep(1);
                return;
            }
        }
        mp.game.ui.notifications.show('~r~У Вас нет почты, возьмите из авто');
    } catch (e) {
        methods.debug('Exception: mail.sendMail');
        methods.debug(e);
    }
};

mail.sendMail2 = function(houseId) {
    try {
        methods.debug('Execute: mail.sendMail2');
        if (Container.Data.HasLocally(mp.players.local.id, 'mail')) {
            if (Container.Data.GetLocally(mp.players.local.id, 'mail') > 0) {
                Container.Data.Set(houseId, 'isMail2', true);
                Container.Data.SetLocally(mp.players.local.id, 'mail', Container.Data.GetLocally(mp.players.local.id, 'mail') - 1);
                mp.game.ui.notifications.show(`~g~Вы отнесли почту ${Container.Data.GetLocally(mp.players.local.id, 'mail')}/10`);
                user.giveJobSkill();
                user.giveJobMoney(11);
                user.addRep(1);
                return;
            }
        }
        mp.game.ui.notifications.show('~r~У Вас нет почты, возьмите из авто');
    } catch (e) {
        methods.debug('Exception: mail.sendMail2');
        methods.debug(e);
    }
};

mail.takeMail = function() {
    try {
        methods.debug('Execute: mail.takeMail');
        Container.Data.SetLocally(mp.players.local.id, 'mail', 10);
        mp.game.ui.notifications.show("~g~Вы взяли почту из транспорта");
    } catch (e) {
        methods.debug('Exception: mail.takeMail');
        methods.debug(e);
    }
};

export default mail;