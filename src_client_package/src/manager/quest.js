import user from '../user';
import ui from "../modules/ui";
import edu from "./edu";

let quest = {};

quest.role0 = function(start = -1) {

    if (start < 0)
        start = user.getCache('quest_role_0');

    switch (start) {
        case 0: {
            user.showCustomNotify('Список ваших квестов можно посмотреть через M -> Квесты', 0, 5, 30000);
            ui.showDialog('Привет, я смотрю ты только приехал, у меня для тебя работка есть, уверен лишние деньги тебе не помешают.', 'Каспер');
            break;
        }
    }
};

quest.getQuestName = function(type) {
    if (type === 'quest_role_0')
        return 'Иммигрант';
    else if (type === 'quest_standart')
        return 'Первый шаг';
    else if (type === 'quest_gang')
        return 'Тёмная сторона';
    return '';
};

quest.getQuestLineMax = function(type) {
    if (type === 'quest_role_0')
        return 2;
    else if (type === 'quest_standart')
        return 0;
    else if (type === 'quest_gang')
        return 0;
    return 0;
};

quest.getQuestLineName = function(type, lineId) {
    if (type === 'quest_role_0') {
        switch (lineId) {
            case 0:
                return 'Подработка';
            case 1:
                return 'Work ID';
        }
    }
    else if (type === 'quest_standart')
        return 'Первый шаг';
    else if (type === 'quest_gang')
        return 'Тёмная сторона';
    return 'Квест завершён';
};

quest.getQuestLineInfo = function(type, lineId) {
    if (type === 'quest_role_0') {
        switch (lineId) {
            case 0:
                return 'Перенесите 30 ящиков';
            case 1:
                return 'Получить Work ID в здании правительства';
        }
    }
    else if (type === 'quest_standart')
        return 'Первый шаг';
    else if (type === 'quest_gang')
        return 'Тёмная сторона';
    return 'Квест завершён';
};

mp.events.add('client:events:dialog:onClose', function () {

});

mp.events.add('client:events:dialog:click', function () {

});

export default quest;