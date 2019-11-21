"use strict";

let methods = {};

methods.debug = function (message) {
    console.log(`[DEBUG-SERVER]: ${message}`)
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