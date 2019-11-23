"use strict";

let methods = {};

methods.debug = function (message) {
    try {
        mp.events.callRemote('server:clientDebug', `${message}`)
    } catch (e) {
    }
};

methods.isValidJSON = function(value){
    try{
        JSON.parse(value);
        return true;
    }
    catch (error){
        methods.debug(`Invalid JSON string\n${error}`);
        return false;
    }
};

export default methods;