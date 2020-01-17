import weather from '../manager/weather';
import user from '../user';

let license = {};

let licenseList = [
    "a_lic",
    "b_lic",
    "c_lic",
    "air_lic",
    "taxi_lic",
    "ship_lic",
    "gun_lic",
    "law_lic",
    "med_lic",
    "biz_lic",
    "fish_lic"
];

license.checker = function() {
    if (user.isLogin()) {
        licenseList.forEach(lic => {

            let licEnd = weather.strDateToTime(user.getCache(lic + '_end'));
            let current = weather.strDateToTime(weather.getFullRpDate());

            if (user.getCache(lic) && licEnd < current) {

                let licName = '';

                switch (lic) {
                    case 'a_lic':
                        licName = 'категории А';
                        break;
                    case 'b_lic':
                        licName = 'категории B';
                        break;
                    case 'c_lic':
                        licName = 'категории C';
                        break;
                    case 'air_lic':
                        licName = 'пилота';
                        break;
                    case 'ship_lic':
                        licName = 'на водный транспорт';
                        break;
                    case 'taxi_lic':
                        licName = 'на перевозку пассажиров';
                        break;
                    case 'law_lic':
                        licName = 'адвоката';
                        break;
                    case 'gun_lic':
                        licName = 'на оружие';
                        break;
                    case 'biz_lic':
                        licName = 'на бизнес';
                        break;
                    case 'fish_lic':
                        licName = 'на рыбалку';
                        break;
                }

                user.set(lic, false);
                if (lic == 'med_lic') {
                    user.sendSms('Правительство', 'Срок лицензии истёк', 'Ваш срок мед. страховки истёк', 'CHAR_DAVE');
                    return;
                }
                user.sendSms('Правительство', 'Срок лицензии истёк', `Ваш срок лицензии ${licName} истёк`, 'CHAR_DAVE');
            }
        });
    }
};

export default license;