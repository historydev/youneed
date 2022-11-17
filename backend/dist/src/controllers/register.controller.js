"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register_controller = void 0;
const uuid_1 = require("uuid");
const argon2 = require("argon2");
const mongodb_1 = require("../databases/mongodb");
async function register_controller(req, res, next) {
    if (req.body) {
        const default_image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Faenza-avatar-default-symbolic.svg/1024px-Faenza-avatar-default-symbolic.svg.png';
        const user = {
            id: (0, uuid_1.v4)(),
            ...req.body,
            image: default_image,
            password: await argon2.hash(req.body.password),
            service_price: 2000,
            access: true,
            access_rights: 'user'
        };
        console.log(user);
        (0, mongodb_1.query)('users').then(async (data) => {
            const userFound = await data.collection.findOne({ email: req.body.email });
            if (!userFound) {
                const response = await data.collection.insertOne(user);
                res.status(200);
                res.send({
                    message: 'User register successful'
                });
                res.end();
            }
            else {
                res.status(200);
                res.send({
                    error: 'Email already exist',
                    message: 'Denied'
                });
                res.end();
            }
            return data;
        })
            .then(async (data) => {
            await data.client.close();
        })
            .catch(e => {
            console.error(e.errInfo.details.clausesNotSatisfied[0]);
            res.status(502);
            res.end();
            return new Error('Any error');
        }).finally(() => console.log('Users register finally'));
    }
}
exports.register_controller = register_controller;
//# sourceMappingURL=register.controller.js.map