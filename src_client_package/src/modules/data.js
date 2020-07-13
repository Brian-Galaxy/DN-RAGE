"use strict";
import methods from './methods';

let _data = new Map();
let Debug = false;

const UUID = a => (
    a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11)
        .replace(/[018]/g, UUID)
);

const uniqueIds = new Set();

const createId = () => {
    let id = UUID();

    while (uniqueIds.has(id)) {
        id = UUID();
    }

    uniqueIds.add(id);
    return id;
};

let promises = new Map();
let dataSetterList = [];

let handlerHas = (uuid, data) => {

    methods.debug('Event: modules:client:data:Has', uuid, data);
    uniqueIds.delete(uuid);
    if (promises.has(uuid)) {
        const promise = promises.get(uuid);
        promise.resolve(data);
    }
    promises.delete(uuid);
};

let handlerGet = (uuid, data) => {

    methods.debug('Event: modules:client:data:Get', uuid, data);
    uniqueIds.delete(uuid);
    if (promises.has(uuid)) {
        const promise = promises.get(uuid);
        promise.resolve(data);
    }
    promises.delete(uuid);
};

let handlerGetAll = (uuid, data) => {

    methods.debug('Event: modules:client:data:GetAll', uuid, data);
    uniqueIds.delete(uuid);
    if (promises.has(uuid)) {
        const promise = promises.get(uuid);
        promise.resolve(new Map(data));
    }
    promises.delete(uuid);
};

let setterChecker = () => {
    if (dataSetterList.length > 0) {
        mp.events.callRemote('modules:server:data:SetGroup', JSON.stringify(dataSetterList));
        dataSetterList = [];
    }
};

//setInterval(setterChecker, 5000);

mp.events.add('modules:client:data:Has', handlerHas);
mp.events.add('modules:client:data:Get', handlerGet);
mp.events.add('modules:client:data:GetAll', handlerGetAll);

class Data {
    static SetLocally(id, key, value) {
        try {
            if (_data.has(id) && _data.get(id) !== undefined && _data.get(id) !== null) {
                _data.set(id, _data.get(id).set(key, value));
            } else {
                var _values = new Map();
                _values.set(key, value);
                _data.set(id, _values);
            }
            if (Debug) {
                methods.debug(`CLNT: [SET-LOCALLY] ID: ${id}, KEY: ${key}, OBJECT: ${value}`);
            }
        } catch (e) {
            methods.debug(`CLNT: [SET-LOCALLY] ERR: ${e}`);
        }
    }

    static ResetLocally(id, key){
        try {
            if (!_data.has(id)) return;
            if (!_data.get(id).has(key) || _data.get(id) == undefined || _data.get(id) == null) return;
            _data.get(id).delete(key);
            if (Debug) {
                methods.debug(`CLNT: [RESET-LOCALLY] ID: ${id}, KEY: ${key}`);
            }
        } catch (e) {
            methods.debug(`CLNT: [RESET-LOCALLY] ERR: ${e}`);
        }
    }

    static GetLocally(id, key) {
        try {
            if (Debug) {
                methods.debug(`CLNT: [GET-LOCALLY] ID: ${id}, KEY: ${key}`);
            }
            if (!_data.has(id)) return null;
            return _data.get(id).get(key);
        } catch (e) {
            methods.debug(`CLNT: [GET-LOCALLY] ERR: ${e}`);
        }
    }

    static HasLocally(id, key) {
        try {
            if (Debug) {
                methods.debug(`CLNT: [HAS] ID: ${id}, KEY: ${key}`);
            }
            if (!_data.has(id)) return false;
            return _data.get(id).has(key);
        } catch (e) {
            methods.debug(`CLNT: [HAS] ERR: ${e}`);
        }
    }

    static GetAllLocally(id) {
        try {
            if (Debug) {
                methods.debug(`CLNT: [GET-ALL-LOCALLY] ID: ${id}`);
            }
            if (!_data.has(id)) return new Map();
            return _data.get(id);
        } catch (e) {
            methods.debug(`CLNT: [GET-ALL-LOCALLY] ERR: ${e}`);
        }
    }

    static Set(id, key, value) {
        try {
            if (Debug) {
                methods.debug(`CLNT: [SET] ID: ${id}, KEY: ${key}, OBJECT: ${value}`);
            }
            let isInt = false;
            if (typeof value == "number") {
                isInt = true;
                value = value.toString();
            }

            //dataSetterList.push({id: id, key: key, value: value, isInt: isInt});
            mp.events.callRemote('modules:server:data:Set', id, key, value, isInt);
            //mp.events.callRemote('modules:server:data:Set', 800000 + 30, 'orderLamarM', 100, true);

        } catch (e) {
            methods.debug(`CLNT: [SET] ERR: ${e}`);
        }
    }

    static Reset(id, key) {
        try {
            if (Debug) {
                methods.debug(`CLNT: [RESET] ID: ${id}, KEY: ${key}`);
            }
            mp.events.callRemote('modules:server:data:Reset', id, key);
        } catch (e) {
            methods.debug(`CLNT: [RESET] ERR: ${e}`);
        }
    }

    static async Get(id, key) {
        try {
            return new Promise((resolve, reject) => {
                const promiseId = createId();
                promises.set(promiseId, {resolve, reject});
                methods.debug(`CLNT: [GET]`, id, key);
                mp.events.callRemote('modules:server:data:Get', promiseId, id, key);
            });
        } catch (e) {
            methods.debug(`CLNT: [GET] ERR: ${e}`);
            return null;
        }
    }

    static async GetAll(id) {

        try {
            return new Promise((resolve, reject) => {
                const promiseId = createId();
                promises.set(promiseId, {resolve, reject});
                mp.events.callRemote('modules:server:data:GetAll', promiseId, id);
            });
        } catch (e) {
            methods.debug(`CLNT: [GETALL] ERR: ${e}`);
            return null;
        }
    }

    static async Has(id, key) {
        try {
            return new Promise((resolve, reject) => {
                const promiseId = createId();
                promises.set(promiseId, {resolve, reject});
                mp.events.callRemote('modules:server:data:Has', promiseId, id, key);
            });
        } catch (e) {
            methods.debug(`CLNT: [HAS] ERR: ${e}`);
            return false;
        }
    }
}

export default {Data: Data};