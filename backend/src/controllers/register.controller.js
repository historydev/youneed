"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.register_controller = void 0;
var uuid_1 = require("uuid");
var argon2 = require("argon2");
var mongodb_1 = require("../databases/mongodb");
function register_controller(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var default_image, user_1, _a;
        var _b;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!req.body) return [3 /*break*/, 2];
                    default_image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Faenza-avatar-default-symbolic.svg/1024px-Faenza-avatar-default-symbolic.svg.png';
                    _a = [__assign({ id: (0, uuid_1.v4)() }, req.body)];
                    _b = { image: default_image };
                    return [4 /*yield*/, argon2.hash(req.body.password)];
                case 1:
                    user_1 = __assign.apply(void 0, _a.concat([(_b.password = _c.sent(), _b.service_price = 2000, _b.access = true, _b.access_rights = 'user', _b)]));
                    console.log(user_1);
                    (0, mongodb_1.query)('users').then(function (data) { return __awaiter(_this, void 0, void 0, function () {
                        var userFound, response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, data.collection.findOne({ email: req.body.email })];
                                case 1:
                                    userFound = _a.sent();
                                    if (!!userFound) return [3 /*break*/, 3];
                                    return [4 /*yield*/, data.collection.insertOne(user_1)];
                                case 2:
                                    response = _a.sent();
                                    res.status(200);
                                    res.send({
                                        message: 'User register successful'
                                    });
                                    res.end();
                                    return [3 /*break*/, 4];
                                case 3:
                                    res.status(200);
                                    res.send({
                                        error: 'Email already exist',
                                        message: 'Denied'
                                    });
                                    res.end();
                                    _a.label = 4;
                                case 4: return [2 /*return*/, data];
                            }
                        });
                    }); })
                        .then(function (data) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, data.client.close()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })["catch"](function (e) {
                        console.error(e.errInfo.details.clausesNotSatisfied[0]);
                        res.status(502);
                        res.end();
                        return new Error('Any error');
                    })["finally"](function () { return console.log('Users register finally'); });
                    _c.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
exports.register_controller = register_controller;
