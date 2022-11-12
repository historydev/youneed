"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basic_authentication_controller = void 0;
function basic_authentication_controller(req, res, next) {
    const authheader = req.headers.authorization;
    if (!authheader) {
        res.sendStatus(401);
        res.end();
        return;
    }
    const auth = Buffer.from(authheader.split(' ')[1], 'base64').toString().split(':');
    const user = auth[0];
    const pass = auth[1];
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
//# sourceMappingURL=basic_authentication.controller.js.map