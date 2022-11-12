"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation_middleware = void 0;
const express_json_validator_middleware_1 = require("express-json-validator-middleware");
function validation_middleware(error, req, res, next) {
    // Check the error is a validation error
    if (error instanceof express_json_validator_middleware_1.ValidationError) {
        const err_data = error['validationErrors'].body?.[0];
        const message = (() => {
            switch (err_data?.keyword) {
                case 'type': return (err_data?.instancePath || 'Object') + ' ' + err_data?.message;
                case 'additionalProperties': return (err_data?.instancePath || 'Object') + ' ' + err_data.message + ': ' + err_data?.params['additionalProperty'];
                default: return (err_data?.instancePath || 'Object') + ' ' + err_data?.message;
            }
        })();
        res.status(400).send({
            error: err_data?.keyword,
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
//# sourceMappingURL=validator.controller.js.map