let methods = require('./modules/methods');
let mysql = require('./modules/mysql');

let user = require('./user');
let enums = require('./enums');

let phone = exports;

phone.memberAction = function(player, id) {
    if (!user.isLogin(player))
        return;

    methods.debug('phone.memberAction');

    let fractionId = user.get(player, 'fraction_id');
    mysql.executeQuery(`SELECT id, social, name, fraction_id, rank, rank_type FROM users WHERE id = '${methods.parseInt(id)}'`, (err, rows, fields) => {

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

            if (user.isLeader(player) || user.isSubLeader(player)) {

            }

            items.push(phone.getMenuItem(
                'Повысить',
                '',
                { name: 'memberUninvite', memberId: row['id'] },
                1,
                '',
                true,
                true
            ));

            items.push(phone.getMenuItem(
                'Перевести в другой отдел',
                '',
                { name: 'memberUninvite', memberId: row['id'] },
                1,
                '',
                true,
                true
            ));

            items.push(phone.getMenuItem(
                'Уволить',
                '',
                { name: 'memberUninvite', memberId: row['id'] },
                1,
                '',
                true,
                true,
                '#ffcdd2',
            ));

            phone.showMenu(player, 'fraction', 'Действия', [phone.getMenuMainItem('', items)]);
        });
    });
};

phone.fractionList = function(player) {
    if (!user.isLogin(player))
        return;
    methods.debug('phone.fractionList');

    let fractionId = user.get(player, 'fraction_id');

    mysql.executeQuery(`SELECT id, name, fraction_id, rank, rank_type, is_leader, is_sub_leader, is_online FROM users WHERE fraction_id = '${fractionId}' ORDER BY is_leader ASC, rank_type ASC, is_online ASC, rank ASC, name ASC`, (err, rows, fields) => {
        let items = [];
        let depName = '';
        let depList = [];
        let depPrev = -1;

        let isLeader = user.isLeader(player);
        let isSubLeader = user.isSubLeader(player);

        let fractionItem = enums.fractionListId[fractionId];

        let leaderItem = null;
        let subLeaderItem = null;

        let rankType = user.get(player, 'rank_type');
        let canEdit = user.get(player, 'rank') == 0 || user.get(player, 'rank') == 1;

        rows.forEach(row => {

            if (row['is_leader']) {
                leaderItem = phone.getMenuItem(
                    row['name'],
                    fractionItem.leaderName,
                    { name: 'none' },
                    1,
                    row['is_online'] === 1 ? 'green' : 'red',
                );
            }
            else if (row['is_leader']) {
                if (isLeader) {
                    subLeaderItem = phone.getMenuItem(
                        row['name'],
                        fractionItem.subLeaderName,
                        { name: 'memberAction', memberId: row['id'] },
                        1,
                        row['is_online'] === 1 ? 'green' : 'red',
                        true
                    );
                }
                else {
                    subLeaderItem = phone.getMenuItem(
                        row['name'],
                        fractionItem.subLeaderName,
                        { name: 'none' },
                        1,
                        row['is_online'] === 1 ? 'green' : 'red',
                    );
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
                    depList.push(phone.getMenuItem(
                        row['name'],
                        fractionItem.rankList[row['rank_type']][row['rank']],
                        { name: 'memberAction', memberId: row['id'] },
                        1,
                        row['is_online'] === 1 ? 'green' : 'red',
                        true
                    ));
                }
                else {
                    depList.push(phone.getMenuItem(
                        row['name'],
                        fractionItem.rankList[row['rank_type']][row['rank']],
                        { name: 'none' },
                        1,
                        row['is_online'] === 1 ? 'green' : 'red',
                    ));
                }

                depPrev = row['rank_type'];
            }
        });

        if (depList.length > 0)
            items.push(phone.getMenuMainItem(`${depName} | ${depList.length} чел.`, depList));

        let newItems = [];
        let leaderItems = [];
        if (leaderItem)
            leaderItems.push(leaderItem);
        if (subLeaderItem)
            leaderItems.push(subLeaderItem);

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

phone.getMenuItem = function(title, text, params = { name: "null" }, type = 1, img = undefined, clickable = false, value = undefined, background = undefined) {
    return {
        title: title,
        text: text,
        type: type,
        img: img,
        background: background,
        clickable: clickable,
        value: value,
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