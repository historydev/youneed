"use strict";
exports.__esModule = true;
exports.basic_authentication_controller = void 0;
function basic_authentication_controller(req, res, next) {
    var authheader = req.headers.authorization;
    if (!authheader) {
        res.sendStatus(401);
        res.end();
        return;
    }
    var auth = Buffer.from(authheader.split(' ')[1], 'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];
    if (user == 'admin' && pass == 'password') {
        // If Authorized user
        return next();
    }
    else {
        res.sendStatus(401);
        res.end();
    }
}
exports.basic_authentication_controller = basic_authentication_controller;
