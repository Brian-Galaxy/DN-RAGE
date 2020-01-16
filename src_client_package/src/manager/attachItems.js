import methods from '../modules/methods';

let attachItems = {};

attachItems.registerAttaches = function () {
    try {
        mp.attachmentMngr.register("phone1", -1038739674, 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
        mp.attachmentMngr.register("phone2", 1907022252, 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
        mp.attachmentMngr.register("phone3", -2017357667, 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
    }
    catch (e) {
        methods.debug(e);
    }
};

export default attachItems;