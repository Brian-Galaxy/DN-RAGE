import Container from './modules/data';
import UIMenu from './modules/menu';
import methods from './modules/methods';
import ui from './modules/ui';
import user from './user';

let menuList = {};

menuList.showAuthMenu = function() {

    let menu = UIMenu.Menu.Create("Авторизация", "~b~Авторизация на сервере");

    let rpNameItem = UIMenu.Menu.AddMenuItem("Имя Фамилия", "Введите ваш ник через пробел");
    let passItem = UIMenu.Menu.AddMenuItem("Пароль", "Введите ваш пароль");
    let authBtn = UIMenu.Menu.AddMenuItem("~g~Авторизоваться");
    let regBtn = UIMenu.Menu.AddMenuItem("~y~Регистрация", "Перейти к регистрации");
    let closeItem = UIMenu.Menu.AddMenuItem("~r~Закрыть и выйти");


    menu.ItemSelect.on(async item => {

    });
    //mp.events.call('client:user:auth:show');
};

export default menuList;