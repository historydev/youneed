"use strict";
exports.__esModule = true;
exports.jwt_authentication_controller = void 0;
var JWT = require("jsonwebtoken");
function user_undefined(res) {
    res.locals['user'] = undefined;
}
function jwt_authentication_controller(req, res, next) {
    var header = req.headers['authentication'];
    var JWT_secret = process.env['JWT_SECRET'];
    console.log(req.method, req.originalUrl, !!header);
    if (JWT_secret) {
        JWT.verify((header === null || header === void 0 ? void 0 : header.toString()) || '', JWT_secret, function (err, data) {
            if (err) {
                switch (req.method) {
                    case 'GET':
                        if (req.originalUrl !== '/auth') {
                            user_undefined(res);
                            res.redirect('/auth');
                            res.end();
                            return;
                        }
                        return next();
                    case 'POST':
                        switch (req.originalUrl) {
                            case '/auth':
                                next();
                                return;
                            case '/register':
                                next();
                                return;
                            default:
                                user_undefined(res);
                                res.sendStatus(401);
                                res.end();
                                return;
                        }
                    default:
                        user_undefined(res);
                        res.sendStatus(401);
                        res.end();
                }
            }
            console.log(data);
            res.locals['user'] = data;
            return next();
        });
        return;
    }
    user_undefined(res);
    res.sendStatus(502);
    res.end();
    return;
}
exports.jwt_authentication_controller = jwt_authentication_controller;
