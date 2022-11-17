"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messages_controller = void 0;
const mongodb_1 = require("../databases/mongodb");
function messages_controller(req, res, next) {
    if (req.body) {
        const { meeting_id } = req.body;
        if (!meeting_id) {
            console.log('meeting_id not found');
            return;
        }
        (0, mongodb_1.query)('messages').then(async (data) => {
            const response = await data.collection.find({ meeting_id }).toArray();
            res.status(200);
            res.send(response);
            res.end();
            return data;
        })
            .then(async (data) => {
            await data.client.close();
        })
            .catch(e => {
            console.error(e);
            res.status(502);
            res.end();
            return new Error('Any error');
        });
    }
}
exports.messages_controller = messages_controller;
//# sourceMappingURL=messages.controller.js.map