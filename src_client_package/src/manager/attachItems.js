import methods from '../modules/methods';

let attachItems = {};

attachItems.registerAttaches = function () {
    try {
        mp.attachmentMngr.register("phone1", -1038739674, 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
        mp.attachmentMngr.register("phone2", 1907022252, 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
        mp.attachmentMngr.register("phone3", -2017357667, 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));

        mp.attachmentMngr.register("mic", mp.game.joaat("p_ing_microphonel_01"), 60309, new mp.Vector3(0.055, 0.05, 0.0), new mp.Vector3(240.0, 0.0, 0.0));
        mp.attachmentMngr.register("cam", mp.game.joaat("prop_v_cam_01"), 28422, new mp.Vector3(0.0, 0.0, 0.0), new mp.Vector3(0.0, 0.0, 0.0));

        mp.attachmentMngr.register("ems_-1903396261", -1903396261, 'bodyshell', new mp.Vector3(0, -2.5, 0), new mp.Vector3(0, 0, 0)); // Разбитый вертолёт
        mp.attachmentMngr.register("ems_1898296526", 1898296526, 'bodyshell', new mp.Vector3(0, -2.0, 0.3), new mp.Vector3(0, 0, 0)); // Разбитое авто 1
        mp.attachmentMngr.register("ems_1069797899", 1069797899, 'bodyshell', new mp.Vector3(0, -2.5, 0.4), new mp.Vector3(0, 0, 0)); // Разбитое авто 2
        mp.attachmentMngr.register("ems_1434516869", 1434516869, 'bodyshell', new mp.Vector3(0, -2.5, 0.4), new mp.Vector3(0, 0, 0)); // Разбитое авто 3
        mp.attachmentMngr.register("ems_-896997473", -896997473, 'bodyshell', new mp.Vector3(0, -2.5, 0.4), new mp.Vector3(0, 0, 0)); // Разбитое авто 4
        mp.attachmentMngr.register("ems_-1748303324", -1748303324, 'bodyshell', new mp.Vector3(0, -2.5, 0.4), new mp.Vector3(0, 0, 0)); // Разбитое авто 5
        mp.attachmentMngr.register("ems_-1366478936", -1366478936, 'bodyshell', new mp.Vector3(0, -2.5, 0.4), new mp.Vector3(0, 0, 0)); // Разбитое авто 6
        mp.attachmentMngr.register("ems_2090224559", 2090224559, 'bodyshell', new mp.Vector3(0, -2.5, 0.4), new mp.Vector3(0, 0, 0)); // Разбитое авто 7
        mp.attachmentMngr.register("ems_-52638650", -52638650, 'bodyshell', new mp.Vector3(0, -2.5, 0.4), new mp.Vector3(0, 0, 0)); // Разбитое авто 8
        mp.attachmentMngr.register("ems_591265130", 591265130, 'bodyshell', new mp.Vector3(0, -2.5, 0.4), new mp.Vector3(0, 0, 0)); // Разбитое авто 9
        mp.attachmentMngr.register("ems_-915224107", -915224107, 'bodyshell', new mp.Vector3(0, -2.5, 0.4), new mp.Vector3(0, 0, 0)); // Разбитое авто 10
        mp.attachmentMngr.register("ems_-273279397", -273279397, 'bodyshell', new mp.Vector3(0, -2.5, 0.4), new mp.Vector3(0, 0, 0)); // Разбитое авто 11
        mp.attachmentMngr.register("ems_322493792", 322493792, 'bodyshell', new mp.Vector3(0, -2.5, 0.4), new mp.Vector3(0, 0, 0)); // Разбитое авто 12
        mp.attachmentMngr.register("ems_10106915", 10106915, 'bodyshell', new mp.Vector3(0, -2.5, 0.4), new mp.Vector3(0, 0, 0)); // Разбитое авто 13
        mp.attachmentMngr.register("ems_1120812170", 1120812170, 'bodyshell', new mp.Vector3(0, -2.5, 0.4), new mp.Vector3(0, 0, 0)); // Разбитое авто 14

        mp.attachmentMngr.register(`loader`, mp.game.joaat("prop_cardbordbox_02a"), 28422, new mp.Vector3(0, -0.18, -0.18), new mp.Vector3(0, 0, 0));
    }
    catch (e) {
        methods.debug(e);
    }
};

export default attachItems;