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
var socket_io_1 = require("socket.io");
var mongodb_1 = require("../databases/mongodb");
function default_1(http_server) {
    var _this = this;
    var io = new socket_io_1.Server(http_server, {
        cors: {
            origin: 'http://localhost:4200'
        }
    });
    io.on('connection', function (socket) {
        console.log(socket.id, ' connected');
        socket.emit('connected', socket.id);
        socket.on('toServer', function (msg) {
            socket.emit('fromServer', msg);
        });
        socket.on('mediaStreamInfo', function (_a) {
            var id = _a.id, video = _a.video;
            socket.to(id).emit('mediaStreamInfo', video);
        });
        socket.on('call', function (data) {
            socket.to(data.call.receiver_id).emit('call', data);
        });
        socket.on('accept-call', function (data) {
            socket.to(data.call.sender_id).emit('accept-call', data);
        });
        socket.on('message', function (meeting_id) { return __awaiter(_this, void 0, void 0, function () {
            var meetings, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, mongodb_1.query)('meetings')];
                    case 1:
                        meetings = _a.sent();
                        return [4 /*yield*/, meetings.collection.findOne({ id: meeting_id })];
                    case 2:
                        response = _a.sent();
                        console.log(response);
                        response === null || response === void 0 ? void 0 : response['members'].forEach(function (user_id) {
                            console.log(user_id);
                            socket.to(user_id).emit('message', meeting_id);
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        socket.on('p2p-accept-call', function (data) {
            socket.to(data.call.sender_id).emit('p2p-accept-call', data);
        });
        socket.on('decline-call', function (data) {
            socket.to(data.call.sender_id).emit('decline-call', data);
        });
        socket.on('joinRoom', function (id) {
            console.log('Join room: ', id);
            socket.join(id);
        });
        socket.on('leaveRoom', function (id) {
            console.log('Leave room: ', id);
            socket.leave(id);
        });
        socket.on('pushNotification', function (data) {
            socket.to(data.recipient).emit('pushNotification', data);
        });
        socket.on('p2p_user_media_message', function (data) {
            console.log(data);
            socket.to(data.id).emit('p2p_user_media_message', {
                type: data.type,
                message: __assign({ type: data.type }, data.message)
            });
        });
        socket.on('p2p_display_media_message', function (data) {
            console.log('display ', data);
            socket.to(data.id).emit('p2p_display_media_message', {
                type: data.type,
                message: __assign({ type: data.type }, data.message)
            });
        });
    });
    return;
}
exports["default"] = default_1;
