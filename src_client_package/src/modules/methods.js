"use strict";

let methods = {};

methods.debug = function (message) {
    mp.events.callRemote('clientDebug', message)
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