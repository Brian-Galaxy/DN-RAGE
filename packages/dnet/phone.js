let methods = require('./modules/methods');
let mysql = require('./modules/mysql');

let user = require('./user');
let enums = require('./enums');

let phone = exports;

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
        img: img,
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
        img: img,
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