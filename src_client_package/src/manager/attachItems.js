import methods from '../modules/methods';

let attachItems = {};

attachItems.registerAttaches = function () {
    try {
        mp.attachmentMngr.register("phone1", -1038739674, 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
        mp.attachmentMngr.register("phone2", 1907022252, 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
        mp.attachmentMngr.register("phone3", -2017357667, 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));

        mp.attachmentMngr.register("ems_-1903396261", -1903396261, 'bodyshell', new mp.Vector3(0, -2.5, 0), new mp.Vector3(0, 0, 0)); //Вертолёт
        mp.attachmentMngr.register("ems_1069797899", 1069797899, 'bodyshell', new mp.Vector3(0, -2.5, 0.4), new mp.Vector3(0, 0, 0)); //Машина1
        mp.attachmentMngr.register("ems_1434516869", 1434516869, 'bodyshell', new mp.Vector3(0, -2.5, 0.4), new mp.Vector3(0, 0, 0)); //Машина2
        mp.attachmentMngr.register("ems_-896997473", -896997473, 'bodyshell', new mp.Vector3(0, -2.5, 0.4), new mp.Vector3(0, 0, 0)); //Машина3
        mp.attachmentMngr.register("ems_1898296526", 1898296526, 'bodyshell', new mp.Vector3(0, -2.0, 0.3), new mp.Vector3(0, 0, 0)); //Машина4

        mp.attachmentMngr.register(`loader`, mp.game.joaat("prop_cardbordbox_02a"), 28422, new mp.Vector3(0, -0.18, -0.18), new mp.Vector3(0, 0, 0));
    }
    catch (e) {
        methods.debug(e);
    }
};

export default attachItems;