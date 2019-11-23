"use strict";

let methods = exports;

methods.debug = function (message) {
    try {
        console.log(`[DEBUG-SERVER]: ${message}`)
    } catch (e) {
        console.log(e)
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
