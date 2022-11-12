"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meetings_controller = void 0;
const mongodb_1 = require("../databases/mongodb");
async function meetings_controller(req, res, next) {
    const users = await (0, mongodb_1.query)('users');
    const meetings = await (0, mongodb_1.query)('meetings');
    const response = await meetings.collection.find({ members: { $in: [res.locals['user'].id] } }, { projection: { _id: 0 } }).toArray();
    for (let i = 0; i < response.length; i++) {
        for (let m = 0; m < response[i]['members'].length; m++) {
            response[i]['members'][m] = await users.collection.findOne({ id: response[i]['members'][m] }, { projection: { _id: 0, password: 0 } });
        }
    }
    console.log(response);
    res.send({
        message: response
    });
}
exports.meetings_controller = meetings_controller;
//# sourceMappingURL=meetings.controller.js.map