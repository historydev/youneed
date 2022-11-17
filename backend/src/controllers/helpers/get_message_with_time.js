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
exports.get_message_with_time = void 0;
function get_message_with_time(el) {
    var date = el['date'];
    var curr_date = date.getDate();
    var hours = date.getHours().toString();
    var minutes = date.getMinutes().toString();
    var valid_hours = "".concat(hours.length > 1 ? hours : '0' + hours);
    var valid_minutes = "".concat(minutes.length > 1 ? minutes : '0' + minutes);
    var time = valid_hours + ':' + valid_minutes;
    return __assign(__assign({}, el), { _id: undefined, time: time, is_owner: el['sender_id'] === '1' });
}
exports.get_message_with_time = get_message_with_time;
