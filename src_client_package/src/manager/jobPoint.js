import ui from '../modules/ui';
import methods from '../modules/methods';

let jobPoint = {};

let _checkpoint = null;
let _marker = null;
let _blip = null;
let _blip1 = null;
let _blip2 = null;
let _blip3 = null;
let _lastPos = new mp.Vector3(0, 0, 0);

let list = [];

jobPoint.create = function(pickupPos, route = false, radius = 1, color = ui.MarkerRed) {

    jobPoint.delete();

    _lastPos = pickupPos;

    _marker = mp.markers.new(1, pickupPos, radius,
        {
            color: color,
            dimension: -1
        });

    _checkpoint = mp.checkpoints.new(1, pickupPos, radius + 0.2,
        {
            direction: new mp.Vector3(0, 0, 0),
            color: [ 33, 150, 243, 0 ],
            visible: true,
            dimension: -1
        });

    _blip = mp.blips.new(1, pickupPos,
        {
            color: 59,
            scale: 0.8,
            name: 'Работа',
            drawDistance: 100,
            shortRange: false,
            dimension: -1
        });

    _blip.setRoute(route);

    return _checkpoint.id;
};

jobPoint.createBlip1 = function(pickupPos, blipId = 1, blipColor = 0, route = false) {

    jobPoint.deleteBlip1();

    _blip1 = mp.blips.new(blipId, pickupPos,
        {
            color: blipColor,
            scale: 0.8,
            name: 'Цель',
            dimension: -1
        });

    _blip1.setRoute(route);

    return _blip1.id;
};

jobPoint.deleteBlip1 = function() {
    try {
        if (typeof _blip1 == 'object' && mp.blips.exists(_blip1))
            _blip1.destroy();
    }
    catch (e) {
        console.log(e);
    }
};

jobPoint.createBlip2 = function(pickupPos, blipId = 1, blipColor = 0, route = false) {

    jobPoint.deleteBlip2();

    _blip2 = mp.blips.new(blipId, pickupPos,
        {
            color: blipColor,
            scale: 0.8,
            name: 'Цель',
            dimension: -1
        });

    _blip2.setRoute(route);

    return _blip2.id;
};

jobPoint.deleteBlip2 = function() {
    try {
        if (typeof _blip2 == 'object' && mp.blips.exists(_blip2))
            _blip2.destroy();
    }
    catch (e) {
        console.log(e);
    }
};

jobPoint.createBlip3 = function(pickupPos, blipId = 1, blipColor = 0, route = false) {

    jobPoint.deleteBlip3();

    _blip3 = mp.blips.new(blipId, pickupPos,
        {
            color: blipColor,
            scale: 0.8,
            name: 'Цель',
            dimension: -1
        });

    _blip3.setRoute(route);

    return _blip3.id;
};

jobPoint.deleteBlip3 = function() {
    try {
        if (typeof _blip3 == 'object' && mp.blips.exists(_blip3))
            _blip3.destroy();
    }
    catch (e) {
        console.log(e);
    }
};

jobPoint.delete = function() {
    try {
        if (typeof _blip == 'object' && mp.blips.exists(_blip))
            _blip.destroy();
        else {
            mp.blips.forEach(function (blip) {
                if (mp.blips.exists(blip) && blip.getSprite() == 1)
                    blip.destroy();
            });
        }
    }
    catch (e) {
        console.log(e);
        mp.blips.forEach(function (blip) {
            if (mp.blips.exists(blip) && blip.getSprite() == 1)
                blip.destroy();
        });
    }

    try {
        if (typeof _marker == 'object' && mp.markers.exists(_marker))
            _marker.destroy();
        else {
            mp.markers.forEach(function (marker) {
                if (mp.markers.exists(marker) && marker.getColor() === ui.ColorRed)
                    marker.destroy();
            });
        }
    }
    catch (e) {
        console.log(e);
        mp.markers.forEach(function (marker) {
            if (mp.markers.exists(marker) && marker.getColor() === ui.ColorRed)
                marker.destroy();
        });
    }

    try {
        if (typeof _checkpoint == 'object' && mp.checkpoints.exists(_checkpoint))
            _checkpoint.destroy();
        else {
            mp.checkpoints.forEach(function (cp) {
                if (methods.distanceToPos(_lastPos, cp.position) < 3)
                    cp.destroy();
            });
        }
    }
    catch (e) {
        console.log(e);
        mp.checkpoints.forEach(function (cp) {
            if (methods.distanceToPos(_lastPos, cp.position) < 3)
                cp.destroy();
        });
    }

    _checkpoint = null;
    _marker = null;
    _blip = null;
};


jobPoint.createList = function(pickupPos, route = false, radius = 1, color = ui.MarkerRed) {


    let marker = mp.markers.new(1, pickupPos, radius,
        {
            color: color,
            dimension: -1
        });

    let checkpoint = mp.checkpoints.new(1, pickupPos, radius + 0.2,
        {
            direction: new mp.Vector3(0, 0, 0),
            color: [ 33, 150, 243, 0 ],
            visible: true,
            dimension: -1
        });

    let blipColor = 1;
    if (color == ui.MarkerGreen)
        blipColor = 2;
    if (color == ui.MarkerBlue)
        blipColor = 3;

    let blip = mp.blips.new(1, pickupPos,
        {
            color: blipColor,
            scale: 0.8,
            name: 'Работа',
            drawDistance: 100,
            shortRange: false,
            dimension: -1
        });

    blip.setRoute(route);

    list.push({blip: blip, marker: marker, checkpoint: checkpoint});

    return checkpoint.id;
};

jobPoint.deleteById = function(id) {
    try {
        let newList = [];
        list.forEach(item => {
            try {
                if (item.checkpoint.id == id) {
                    item.marker.destroy();
                    item.blip.destroy();
                    item.checkpoint.destroy();
                }
                else
                    newList.push({blip: item.blip, marker: item.marker, checkpoint: item.checkpoint});
            }
            catch (e) {
                console.log(e);
            }
        });
        list = newList;
    }
    catch (e) {
        console.log(e);
    }
};

export default jobPoint;