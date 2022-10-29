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
exports.__esModule = true;
var socket_io_1 = require("socket.io");
function default_1(http_server) {
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
}
exports["default"] = default_1;
