'use strict';

const path = require('path');
const fs = require('fs');

var jwt = require('jsonwebtoken');


var privateKey = fs.readFileSync('./private.key','utf8');
var publicKey = fs.readFileSync('./public.key','utf8');

var payload = { };

payload.tokenfpi = "tokenfbapi";


console.log("Payload: " + JSON.stringify(payload));

/*
    Sign
*/

console.log(" ");




var exp = "24h";


var signOptions = {

    expiresIn: exp,
    algorithm: "RS256"
};
console.log("Options: " + JSON.stringify(signOptions));

var token = jwt.sign(payload, privateKey, signOptions);
console.log("Token: " + token);

/*
    Verify
*/

console.log(" ");


var verifyOptions = {

    maxAge: exp,
    algorithms: ["RS256"]
};

var verified = jwt.verify(token, publicKey, verifyOptions);
console.log("Verified: " + JSON.stringify(verified));

/*
    Decode
*/

console.log(" ");

var decoded = jwt.decode(token, {complete: true});
console.log("Docoded Header: " + JSON.stringify( decoded.header));
console.log("Docoded Payload: " +  JSON.stringify(decoded.payload));

process.exitCode = 1;