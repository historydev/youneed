"use strict";
exports.__esModule = true;
exports.validation_middleware = void 0;
var express_json_validator_middleware_1 = require("express-json-validator-middleware");
function validation_middleware(error, req, res, next) {
    var _a;
    // Check the error is a validation error
    if (error instanceof express_json_validator_middleware_1.ValidationError) {
        var err_data_1 = (_a = error['validationErrors'].body) === null || _a === void 0 ? void 0 : _a[0];
        var message = (function () {
            switch (err_data_1 === null || err_data_1 === void 0 ? void 0 : err_data_1.keyword) {
                case 'type': return ((err_data_1 === null || err_data_1 === void 0 ? void 0 : err_data_1.instancePath) || 'Object') + ' ' + (err_data_1 === null || err_data_1 === void 0 ? void 0 : err_data_1.message);
                case 'additionalProperties': return ((err_data_1 === null || err_data_1 === void 0 ? void 0 : err_data_1.instancePath) || 'Object') + ' ' + err_data_1.message + ': ' + (err_data_1 === null || err_data_1 === void 0 ? void 0 : err_data_1.params['additionalProperty']);
                default: return ((err_data_1 === null || err_data_1 === void 0 ? void 0 : err_data_1.instancePath) || 'Object') + ' ' + (err_data_1 === null || err_data_1 === void 0 ? void 0 : err_data_1.message);
            }
        })();
        res.status(400).send({
            error: err_data_1 === null || err_data_1 === void 0 ? void 0 : err_data_1.keyword,
            message: 'Validation failed'
            // message: message,
        });
        res.end();
    }
    else {
        // Pass error on if not a validation error
        next(error);
    }
}
exports.validation_middleware = validation_middleware;
