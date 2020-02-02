let methods = require('./modules/methods');
let mysql = require('./modules/mysql');

let vehicles = require('./property/vehicles');

let user = require('./user');
let enums = require('./enums');
let coffer = require('./coffer');

let phone = exports;

phone.getUserInfo = function(player, text) {
    if (!user.isLogin(player))
        return;

    methods.debug('phone.memberAction');

    text = methods.removeQuotes(text);

    mysql.executeQuery(`SELECT * FROM users WHERE id = '${methods.parseInt(text)}' OR name = '${text}'`, (err, rows, fields) => {

        rows.forEach(row => {
            let subItems = [];
            let items = [];

            subItems.push(phone.getMenuItem(
                row['name'],
                'ID: ' + row['id'],
                { name: 'none' },
                0,
                '',
                false,
                'https://a.rsg.sc//n/' + row['social'].toLowerCase(),
            ));

            subItems.push(phone.getMenuItemButton(
                'Личная история',
                '',
                { name: 'none' },
                '',
                true,
            ));

            subItems.push(phone.getMenuItemButton(
                'Возраст',
                row['age'],
                { name: 'none' },
            ));

            let regName = '';

            switch (row['reg_status'])
            {
                case 1:
                    regName = "Регистрация";
                    break;
                case 2:
                    regName = "Гражданство США";
                    break;
                default:
                    regName = "Нет";
                    break;
            }

            subItems.push(phone.getMenuItemButton(
                'Вид на жительство',
                regName,
                { name: 'none' },
            ));

            if (row['phone'] != '') {
                subItems.push(phone.getMenuItemButton(
                    'Мобильный телефон',
                    row['phone'],
                    { name: 'none' },
                ));
            }

            if (row['bank_card'] > 0) {
                subItems.push(phone.getMenuItemButton(
                    'Банковская карта',
                    methods.bankFormat(row['bank_card']),
                    { name: 'none' },
                ));
            }

            items.push(phone.getMenuMainItem('Основной раздел', subItems));

            subItems = [];

            let label = 'Отсутствует';
            if (row['a_lic']) {
                label = `С ${row['a_lic_create']} по ${row['a_lic_end']}`;
            }

            subItems.push(phone.getMenuItemButton(
                'Лицензия категории А',
                label,
                { name: 'none' },
            ));

            label = 'Отсутствует';
            if (row['b_lic'])
            {
                label = `С ${row['b_lic_create']} по ${row['b_lic_end']}`;
            }

            subItems.push(phone.getMenuItemButton(
                'Лицензия категории B',
                label,
                { name: 'none' },
            ));

            label = 'Отсутствует';
            if (row['c_lic'])
            {
                label = `С ${row['c_lic_create']} по ${row['c_lic_end']}`;
            }

            subItems.push(phone.getMenuItemButton(
                'Лицензия категории C',
                label,
                { name: 'none' },
            ));

            label = 'Отсутствует';
            if (row['air_lic'])
            {
                label = `С ${row['air_lic_create']} по ${row['air_lic_end']}`;
            }

            subItems.push(phone.getMenuItemButton(
                'Лицензия на воздушный транспорт',
                label,
                { name: 'none' },
            ));

            label = 'Отсутствует';
            if (row['ship_lic'])
            {
                label = `С ${row['ship_lic_create']} по ${row['ship_lic_end']}`;
            }

            subItems.push(phone.getMenuItemButton(
                'Лицензия на водный транспорт',
                label,
                { name: 'none' },
            ));

            label = 'Отсутствует';
            if (row['gun_lic'])
            {
                label = `С ${row['gun_lic_create']} по ${row['gun_lic_end']}`;
            }

            subItems.push(phone.getMenuItemButton(
                'Лицензия на оружие',
                label,
                { name: 'none' },
            ));

            label = 'Отсутствует';
            if (row['taxi_lic'])
            {
                label = `С ${row['taxi_lic_create']} по ${row['taxi_lic_end']}`;
            }

            subItems.push(phone.getMenuItemButton(
                'Лицензия на перевозку пассажиров',
                label,
                { name: 'none' },
            ));

            label = 'Отсутствует';
            if (row['law_lic'])
            {
                label = `С ${row['law_lic_create']} по ${row['law_lic_end']}`;
            }

            subItems.push(phone.getMenuItemButton(
                'Лицензия на юриста',
                label,
                { name: 'none' },
            ));

            label = 'Отсутствует';
            if (row['biz_lic'])
            {
                label = `С ${row['biz_lic_create']} по ${row['biz_lic_end']}`;
            }

            subItems.push(phone.getMenuItemButton(
                'Лицензия на предпринимательство',
                label,
                { name: 'none' },
            ));

            label = 'Отсутствует';
            if (row['fish_lic'])
            {
                label = `С ${row['fish_lic_create']} по ${row['fish_lic_end']}`;
            }

            subItems.push(phone.getMenuItemButton(
                'Разрешение на рыболовство',
                label,
                { name: 'none' },
            ));

            label = 'Отсутствует';
            if (row['med_lic'])
            {
                label = `С ${row['med_lic_create']} по ${row['med_lic_end']}`;
            }

            subItems.push(phone.getMenuItemButton(
                'Мед. страховка',
                label,
                { name: 'none' },
            ));

            items.push(phone.getMenuMainItem('Лицензии', subItems));

            phone.showMenu(player, 'userInfo', 'База данных', items);
        });

        if (rows.length == 0) {
            let items = [];
            items.push(phone.getMenuMainItem(`Список пуст`, [
                phone.getMenuItemButton(
                    `Поиск ничего не нашел`,
                    ``
                )
            ]));
            phone.showMenu(player, 'userInfo', 'База данных', items);
        }
    });
};

phone.memberAction = function(player, id) {
    if (!user.isLogin(player))
        return;

    if (user.getId(player) == id) {
        player.notify('~r~Данный профиль для просмотра не доступен');
        return;
    }

    methods.debug('phone.memberAction');
    let fractionId = user.get(player, 'fraction_id');
    mysql.executeQuery(`SELECT id, social, name, fraction_id, rank, rank_type, is_sub_leader FROM users WHERE id = '${methods.parseInt(id)}'`, (err, rows, fields) => {

        rows.forEach(row => {

            let fractionItem = enums.fractionListId[fractionId];
            let items = [];

            items.push(phone.getMenuItem(
                row['name'],
                '',
                { name: 'none' },
                0,
                '',
                false,
                'https://a.rsg.sc//n/' + row['social'].toLowerCase(),
            ));

            if (!row['is_sub_leader']) {
                if (user.isLeader(player)) {
                    items.push(phone.getMenuItemModal(
                        'Выдать должность заместителя',
                        '',
                        'Заместитель',
                        `Вы точно хотите выдать должность ${row['name']}?`,
                        'Выдать',
                        'Отмена',
                        { name: 'memberGiveSubLeader', memberId: row['id'] },
                        '',
                        true
                    ));
                }

                let rankList = [];
                fractionItem.rankList[row['rank_type']].forEach((item, id) => {
                    if (id == row['rank'])
                        rankList.push({title: item, checked: true, params: { name: 'memberNewRank', memberId: row['id'], rankId: id }})
                    else
                        rankList.push({title: item, params: { name: 'memberNewRank', memberId: row['id'], rankId: id }})
                });

                items.push(phone.getMenuItemRadio(
                    'Изменить должность',
                    'Текущая должность: ' + fractionItem.rankList[row['rank_type']][row['rank']],
                    'Выберите должность',
                    rankList,
                    { name: 'none' },
                    '',
                    true
                ));

                if (user.isLeader(player) || user.isSubLeader(player)) {
                    let depList = [];

                    fractionItem.departmentList.forEach((item, id) => {
                        if (id == row['rank_type'])
                            depList.push({title: item, checked: true, params: { name: 'memberNewDep', memberId: row['id'], depId: id }})
                        else
                            depList.push({title: item, params: { name: 'memberNewDep', memberId: row['id'], depId: id }})
                    });

                    items.push(phone.getMenuItemRadio(
                        'Перевести в другой отдел',
                        'Текущий отдел: ' + fractionItem.departmentList[row['rank_type']],
                        'Выберите отдел',
                        depList,
                        { name: 'none' },
                        '',
                        true
                    ));
                }
            }
            else {
                if (user.isLeader(player)) {
                    items.push(phone.getMenuItemModal(
                        'Снять с должности заместителя',
                        '',
                        'Заместитель',
                        `Вы точно хотите снять с должности ${row['name']}?`,
                        'Снять',
                        'Отмена',
                        { name: 'memberTakeSubLeader', memberId: row['id'] },
                        '',
                        true
                    ));
                }
            }

            if (user.isLeader(player) || user.isSubLeader(player)) {
                items.push(phone.getMenuItemModal(
                    'Уволить',
                    '',
                    'Уволить',
                    `Вы точно хотите уволить ${row['name']}?`,
                    'Уволить',
                    'Отмена',
                    { name: 'memberUninvite', memberId: row['id'] },
                    '',
                    true
                ));
            }

            phone.showMenu(player, 'fraction', 'Действия', [phone.getMenuMainItem('', items)]);
        });
    });
};

phone.fractionVehicleAction = function(player, id) {
    if (!user.isLogin(player))
        return;

    methods.debug('phone.fractionVehicleAction');
    let fractionId = user.get(player, 'fraction_id');

    let fractionItem = enums.fractionListId[fractionId];
    let items = [];

    let veh = vehicles.getFractionVehicleInfo(id);

    items.push(phone.getMenuItemImg(
        undefined,
        { name: "none" },
        enums.getVehicleImg(veh.name)
    ));

    let rankList = [];
    fractionItem.rankList[veh.rank_type].forEach((item, id) => {
        if (id == veh.rank)
            rankList.push({title: item, checked: true, params: { name: 'vehicleNewRank', memberId: veh.id, rankId: id }});
        else
            rankList.push({title: item, params: { name: 'vehicleNewRank', memberId: veh.id, rankId: id }});
    });

    items.push(phone.getMenuItemRadio(
        'Изменить доступ',
        'Текущий доступ: ' + fractionItem.rankList[veh.rank_type][veh.rank],
        'Выберите доступ',
        rankList,
        { name: 'none' },
        '',
        true
    ));

    if (user.isLeader(player) || user.isSubLeader(player)) {
        let depList = [];

        fractionItem.departmentList.forEach((item, id) => {
            if (id == veh.rank_type)
                depList.push({title: item, checked: true, params: { name: 'vehicleNewDep', memberId: veh.id, depId: id }});
            else
                depList.push({title: item, params: { name: 'vehicleNewDep', memberId: veh.id, depId: id }});
        });

        items.push(phone.getMenuItemRadio(
            'Перевести в другой отдел',
            'Текущий отдел: ' + fractionItem.departmentList[veh.rank_type],
            'Выберите отдел',
            depList,
            { name: 'none' },
            '',
            true
        ));

        if (user.isLeader(player) && !veh.is_default) {
            items.push(phone.getMenuItemModal(
                'Продать',
                'По цене: ' + methods.moneyFormat(methods.getVehicleInfo(veh.name).price / 2),
                'Продажа',
                `Вы точно хотите продать ${veh.name}?`,
                'Продать',
                'Отмена',
                { name: 'fractionVehicleSell', vehId: veh.id, price: veh.price / 2 },
                '',
                true
            ));
        }
    }

    phone.showMenu(player, 'fraction', 'Действия', [phone.getMenuMainItem(`${veh.name} | ${veh.number}`, items)]);
};

phone.fractionMoney = function(player) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.fractionMoney');
    let fractionId = user.get(player, 'fraction_id');
    let cofferId = coffer.getIdByFraction(fractionId);

    let items = [];

    items.push(phone.getMenuItemButton(
        'Текущее состояние бюджета',
        '' + methods.moneyFormat(coffer.getMoney(cofferId)),
        { name: 'log' },
        '',
        true
    ));

    items.push(phone.getMenuItemModalInput(
        'Прибавка к зарплате',
        'Текущее значение: ' + methods.moneyFormat(coffer.getBenefit(cofferId)),
        'Введите значение',
        coffer.getBenefit(cofferId).toString(),
        'Применить',
        'Отмена',
        { name: 'fractionBenefit' },
        '',
        true
    ));

    phone.showMenu(player, 'fractionMoney', 'Управление бюджетом', [phone.getMenuMainItem(`Основной раздел`, items)]);
};

phone.fractionList = function(player) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.fractionList');

    let fractionId = user.get(player, 'fraction_id');

    mysql.executeQuery(`SELECT id, social, name, fraction_id, rank, rank_type, is_leader, is_sub_leader, is_online FROM users WHERE fraction_id = '${fractionId}' ORDER BY is_leader ASC, is_sub_leader ASC, rank_type ASC, is_online DESC, rank ASC, name ASC`, (err, rows, fields) => {
        let items = [];
        let depName = '';
        let depList = [];
        let depPrev = -1;

        let isLeader = user.isLeader(player);
        let isSubLeader = user.isSubLeader(player);

        let fractionItem = enums.fractionListId[fractionId];

        let leaderItem = [];
        let subLeaderItem = [];

        let rankType = user.get(player, 'rank_type');
        let canEdit = user.get(player, 'rank') == 0 || user.get(player, 'rank') == 1;

        rows.forEach(row => {

            if (row['is_leader']) {
                leaderItem.push(phone.getMenuItemUser(
                    row['name'],
                    fractionItem.leaderName,
                    row['is_online'] === 1,
                    { name: 'none' },
                    'https://a.rsg.sc//n/' + row['social'].toLowerCase(),
                ));
            }
            else if (row['is_sub_leader']) {
                if (isLeader) {
                    subLeaderItem.push(phone.getMenuItemUser(
                        row['name'],
                        fractionItem.subLeaderName,
                        row['is_online'] === 1,
                        { name: 'memberAction', memberId: row['id'] },
                        'https://a.rsg.sc//n/' + row['social'].toLowerCase(),
                        true,
                    ));
                }
                else {
                    subLeaderItem.push(phone.getMenuItemUser(
                        row['name'],
                        fractionItem.subLeaderName,
                        row['is_online'] === 1,
                        { name: 'none' },
                        'https://a.rsg.sc//n/' + row['social'].toLowerCase()
                    ));
                }

            }
            else {
                if (depPrev != row['rank_type']) {
                    if (depList.length > 0)
                        items.push(phone.getMenuMainItem(`${depName} | ${depList.length} чел.`, depList));
                    depName = fractionItem.departmentList[row['rank_type']];
                    depList = [];
                }

                if (isLeader || isSubLeader || (canEdit && rankType == row['rank_type'])) {
                    depList.push(phone.getMenuItemUser(
                        row['name'],
                        fractionItem.rankList[row['rank_type']][row['rank']],
                        row['is_online'] === 1,
                        { name: 'memberAction', memberId: row['id'] },
                        'https://a.rsg.sc//n/' + row['social'].toLowerCase(),
                        true,
                    ));
                }
                else {
                    depList.push(phone.getMenuItemUser(
                        row['name'],
                        fractionItem.rankList[row['rank_type']][row['rank']],
                        row['is_online'] === 1,
                        { name: 'none' },
                        'https://a.rsg.sc//n/' + row['social'].toLowerCase()
                    ));
                }

                depPrev = row['rank_type'];
            }
        });

        if (depList.length > 0)
            items.push(phone.getMenuMainItem(`${depName} | ${depList.length} чел.`, depList));

        let newItems = [];
        let leaderItems = [];
        if (leaderItem.length > 0)
            leaderItems = leaderItems.concat(leaderItem);
        if (subLeaderItem.length > 0)
            leaderItems = leaderItems.concat(subLeaderItem);

        if (leaderItems.length > 0)
            newItems.push(phone.getMenuMainItem('Руководство', leaderItems));

        phone.showMenu(player, 'fraction', `Список членов организации | ${rows.length} чел.`, newItems.concat(items));
    });
};

phone.fractionVehicles = function(player) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.fractionList');

    let fractionId = user.get(player, 'fraction_id');

    let items = [];
    let depName = '';
    let depList = [];
    let depPrev = -1;

    let isLeader = user.isLeader(player);
    let isSubLeader = user.isSubLeader(player);
    let isDepLeader = user.isDepLeader(player);

    let fractionItem = enums.fractionListId[fractionId];

    let rankType = user.get(player, 'rank_type');
    let canEdit = isSubLeader || isLeader;

    if (isLeader) {
        items.push(phone.getMenuMainItem(`Основной раздел`, [
            phone.getMenuItemButton(
                'Покупка транспорта',
                '',
                { name: 'vehicleBuyList' },
                '',
                true,
            )
        ]));
    }

    mysql.executeQuery(`SELECT * FROM cars_fraction WHERE fraction_id = '${fractionId}' AND is_buy = '1' ORDER BY rank_type ASC, rank DESC, name ASC`, (err, rows, fields) => {
        rows.forEach(veh => {
            if (depPrev != veh['rank_type']) {
                if (depList.length > 0)
                    items.push(phone.getMenuMainItem(`${depName} | ${depList.length} шт.`, depList));
                depName = fractionItem.departmentList[veh['rank_type']];
                depList = [];
            }

            let rankName = fractionItem.rankList[veh['rank_type']][veh['rank']];

            if (isDepLeader && veh['rank_type'] == rankType || canEdit) {
                let item = phone.getMenuItemTitle(
                    `${veh['name']} | ${veh['number']}`,
                    `Доступно с ${rankName}`,
                    { name: 'fractionVehicleAction', vehId: veh['id'] },
                    enums.getVehicleImg(veh['name']),
                    true,
                );
                depList.push(item);
            }
            else {
                let item = phone.getMenuItemTitle(
                    `${veh['name']} | ${veh['number']}`,
                    `Доступно с ${rankName}`,
                    { name: 'none' },
                    enums.getVehicleImg(veh['name'])
                );
                depList.push(item);
            }

            depPrev = veh['rank_type'];
        });

        if (depList.length > 0)
            items.push(phone.getMenuMainItem(`${depName} | ${depList.length} шт.`, depList));

        phone.showMenu(player, 'fraction', `Автопарк организации`, items);
    });
};

phone.fractionVehiclesBuyList = function(player) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.fractionVehiclesBuyList');
    let fractionId = user.get(player, 'fraction_id');

    mysql.executeQuery(`SELECT * FROM cars_fraction WHERE fraction_id = '${fractionId}' AND is_buy = '0' ORDER BY name ASC, price ASC`, (err, rows, fields) => {

        let items = [];

        if (rows.length > 0) {
            let subItems = [];
            let name = '';

            rows.forEach(row => {

                if (name != row['name']) {
                    if (subItems.length > 0)
                        items.push(phone.getMenuMainItem(`${name} | ${subItems.length} шт.`, subItems));
                    name = row['name'];
                    subItems = [];
                }

                let item = phone.getMenuItemTitle(
                    `${row['name']} | ${row['number']}`,
                    `Цена: ${methods.moneyFormat(row['price'], 1)}`,
                    { name: 'fractionVehicleBuyInfo', id: row['id'] },
                    enums.getVehicleImg(row['name']),
                    true,
                );
                subItems.push(item);
            });

            if (subItems.length > 0)
                items.push(phone.getMenuMainItem(`${name} | ${subItems.length} шт.`, subItems));
        }
        else {
            items.push(phone.getMenuMainItem(`Список пуст`, [
                phone.getMenuItemButton(
                    `Нет доступных вариантов`,
                    ``
                )
            ]));
        }

        phone.showMenu(player, 'fraction', `Покупка транспорта`, items);
    });
};

phone.userAdList = function(player) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.userAdList');

    mysql.executeQuery(`SELECT * FROM rp_inv_ad ORDER BY id DESC LIMIT 50`, (err, rows, fields) => {

        let items = [];

        if (rows.length > 0) {
            rows.forEach(row => {

                let subItems = [];
                let item = phone.getMenuItemButton(
                    `${row['text']}`,
                    ``,
                    { name: 'none' }
                );
                subItems.push(item);

                item = phone.getMenuItemButton(
                    `${row['phone']} (${row['name']})`,
                    `${row['rp_datetime']}`,
                    { name: 'none' }
                );
                subItems.push(item);

                item = phone.getMenuItemButton(
                    `${row['editor']}`,
                    `Редактор`,
                    { name: 'none' }
                );
                subItems.push(item);

                items.push(phone.getMenuMainItem(`${row['title']}`, subItems));
            });

        }
        else {
            items.push(phone.getMenuMainItem(`Список пуст`, [
                phone.getMenuItemButton(
                    `Нет доступных объявлений`,
                    ``
                )
            ]));
        }

        phone.showMenu(player, 'adList', `Список объявлений`, items);
    });
};

phone.userNewsList = function(player) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.userAdList');

    mysql.executeQuery(`SELECT * FROM rp_inv_news ORDER BY id DESC LIMIT 50`, (err, rows, fields) => {

        let items = [];

        if (rows.length > 0) {
            rows.forEach(row => {

                let subItems = [];
                let item = phone.getMenuItemButton(
                    `${row['text']}`,
                    ``,
                    { name: 'none' }
                );
                subItems.push(item);

                item = phone.getMenuItemButton(
                    `${row['name']}`,
                    `Автор | ${row['rp_datetime']}`,
                    { name: 'none' }
                );
                subItems.push(item);

                items.push(phone.getMenuMainItem(`${row['title']}`, subItems));
            });

        }
        else {
            items.push(phone.getMenuMainItem(`Список пуст`, [
                phone.getMenuItemButton(
                    `Нет доступных новостей`,
                    ``
                )
            ]));
        }

        phone.showMenu(player, 'adList', `Список объявлений`, items);
    });
};

phone.userVehicleAppMenu = function(player) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.fractionVehiclesBuyList');

    mysql.executeQuery(`SELECT * FROM cars WHERE user_id = '${user.getId(player)}' ORDER BY name ASC`, (err, rows, fields) => {

        let items = [];

        if (rows.length > 0) {

            rows.forEach(row => {

                let subItems = [];
                let name = row['name'];

                let item = phone.getMenuItemTitle(
                    `${row['name']}`,
                    `Гос. цена: ${methods.moneyFormat(row['price'], 1)}`,
                    { name: 'none' },
                    enums.getVehicleImg(row['name'])
                );
                subItems.push(item);

                item = phone.getMenuItemButton(
                    'Вызвать эвакуатор',
                    'Стоимость: $500',
                    { name: "respawn", id: row['id'] },
                    '',
                    true,
                );
                subItems.push(item);

                item = phone.getMenuItemButton(
                    'Узнать местоположение',
                    '',
                    { name: "getPos", id: row['id'] },
                    '',
                    true,
                );
                subItems.push(item);

                if (row['is_special'])
                {
                    item = phone.getMenuItemButton(
                        'Открыть / Закрыть двери',
                        'Удаленное управление транспортом',
                        { name: "lock", id: row['id'] },
                        '',
                        true,
                    );
                    subItems.push(item);

                    item = phone.getMenuItemButton(
                        'Запустить / Заглушить двигатель',
                        'Удаленное управление транспортом',
                        { name: "engine", id: row['id'] },
                        '',
                        true,
                    );
                    subItems.push(item);

                    if (row['neon_r'] > 0) {
                        item = phone.getMenuItemButton(
                            'Вкл / Выкл неон',
                            'Удаленное управление транспортом',
                            { name: "neon", id: row['id'] },
                            '',
                            true,
                        );
                        subItems.push(item);
                    }
                }

                items.push(phone.getMenuMainItem(`${name} | ${row['number']}`, subItems));
            });
        }
        else {
            items.push(phone.getMenuMainItem(`Список пуст`, [
                phone.getMenuItemButton(
                    `У вас нет транспорта`,
                    ``
                )
            ]));
        }

        phone.showMenu(player, 'uvehicle', `UVehicle`, items);
    });
};

phone.fractionVehicleBuyInfo = function(player, id) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.fractionVehicleBuyInfo');

    mysql.executeQuery(`SELECT * FROM cars_fraction WHERE id = '${id}'`, (err, rows, fields) => {
        let items = [];
        let subItems = [];
        let name = '';

        rows.forEach(row => {

            let vInfo = methods.getVehicleInfo(row['name']);

            let item = phone.getMenuItemImg(
                undefined,
                { name: 'none' },
                enums.getVehicleImg(row['name']),
            );
            subItems.push(item);

            item = phone.getMenuItemButton(
                vInfo.display_name,
                row['number'],
            );
            subItems.push(item);

            item = phone.getMenuItemButton(
                'Топливо',
                `${vehicles.getFuelLabel(vInfo.fuel_type)}/${vInfo.fuel_min}${vehicles.getFuelPostfix(vInfo.fuel_type)}/${vInfo.fuel_full}${vehicles.getFuelPostfix(vInfo.fuel_type)}`,
            );
            subItems.push(item);

            item = phone.getMenuItemButton(
                'Стоимость обслуживания',
                `${methods.moneyFormat(vehicles.getFractionDay(vInfo.price))} в неделю (( В день ))`,
            );
            subItems.push(item);

            item = phone.getMenuItemModal(
                'Купить',
                `Цена: ${methods.moneyFormat(vInfo.price)}`,
                'Покупка',
                `Вы точно хотите купить ${vInfo.display_name}?`,
                'Купить',
                'Отмена',
                { name: 'fractionVehicleBuy', vehId: row['id'], price: vInfo.price },
                '',
                true
            );
            subItems.push(item);
        });

        items.push(phone.getMenuMainItem(`${name}`, subItems));
        phone.showMenu(player, 'fraction', `Покупка транспорта`, items);
    });
};

phone.showMenu = function(player, uuid, title, items) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.showMenu');

    let menu = {
        UUID: uuid,
        title: title,
        items: items,
    };

    player.call('client:phone:showMenu', [JSON.stringify(menu)]);
};

phone.getMenuItem = function(title, text, params = { name: "null" }, type = 1, img = undefined, clickable = false, value = undefined, background = undefined, online = false) {
    return {
        title: title,
        text: text,
        type: type,
        img: img,
        background: background,
        clickable: clickable,
        value: value,
        online: online,
        params: params
    };
};

phone.getMenuItemTitle = function(title, text, params = { name: "null" }, img = undefined, clickable = false, background = undefined) {
    return {
        title: title,
        text: text,
        type: 0,
        value: img,
        background: background,
        clickable: clickable,
        params: params
    };
};

phone.getMenuItemButton = function(title, text, params = { name: "null" }, img = undefined, clickable = false, background = undefined) {
    return {
        title: title,
        text: text,
        type: 1,
        img: img,
        background: background,
        clickable: clickable,
        params: params
    };
};

phone.getMenuItemCheckbox = function(title, text, checked = false, params = { name: "null" }, img = undefined, clickable = false, background = undefined) {
    return {
        title: title,
        text: text,
        type: 2,
        img: img,
        value: checked,
        background: background,
        clickable: clickable,
        params: params
    };
};

phone.getMenuItemUser = function(title, text, isOnline = false, params = { name: "null" }, img = undefined, clickable = false, background = undefined) {
    return {
        title: title,
        text: text,
        type: 4,
        img: img,
        online: isOnline,
        background: background,
        clickable: clickable,
        params: params
    };
};

phone.getMenuItemRadio = function(title, text, selectTitle, selectItems, params = { name: "null" }, img = undefined, clickable = false, background = undefined) {
    return {
        title: title,
        text: text,
        type: 5,
        img: img,
        background: background,
        clickable: clickable,
        scrollbarTitle: selectTitle,
        scrollbar: selectItems,
        params: params
    };
};

phone.getMenuItemImg = function(height = 150, params = { name: "null" }, img = undefined, clickable = false, background = undefined) {
    return {
        type: 6,
        value: img,
        background: background,
        clickable: clickable,
        height: height,
        params: params
    };
};

phone.getMenuItemModal = function(title, text, modalTitle, modalText, modalYes = 'Применить', modalNo = 'Отмена', params = { name: "null" }, img = undefined, clickable = false, background = undefined) {
    return {
        title: title,
        text: text,
        type: 7,
        modalTitle: modalTitle,
        modalText: modalText,
        modalButton: [modalNo, modalYes],
        img: img,
        background: background,
        clickable: clickable,
        params: params
    };
};

phone.getMenuItemModalInput = function(title, text, modalTitle, modalValue = '', modalYes = 'Применить', modalNo = 'Отмена', params = { name: "null" }, img = undefined, clickable = false, background = undefined) {
    return {
        title: title,
        text: text,
        type: 8,
        modalTitle: modalTitle,
        modalValue: modalValue,
        modalButton: [modalNo, modalYes],
        img: img,
        background: background,
        clickable: clickable,
        params: params
    };
};

phone.getMenuMainItem = function(title, items) {
    return {
        title: title,
        umenu: items,
    };
};

phone.types = {
    title: 0,
    default: 1,
    checkbox: 2,
    user: 3,
    select: 4,
    accept: 5,
};