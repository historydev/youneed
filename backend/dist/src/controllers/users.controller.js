"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users_controller = void 0;
const mongodb_1 = require("../databases/mongodb");
async function users_controller(req, res, next) {
    (0, mongodb_1.query)('users').then(async (data) => {
        const response = await data.collection.find({ id: { $ne: res.locals['user'].id } }, { projection: { _id: 0, password: 0 } }).toArray();
        if (response) {
            res.send({
                message: response
            });
            res.end();
            return;
        }
        res.sendStatus(404);
        res.end();
    });
}
exports.users_controller = users_controller;
//# sourceMappingURL=users.controller.js.map