"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_schema = void 0;
const TJS = require("../../../../src/assets/typescript-json-schema");
const regexp_pattern_setter_1 = require("./regexp_pattern_setter");
function generate_schema(options) {
    if (options.model_name) {
        const schema = TJS.generateSchema(options.program, options.model_name, options.settings);
        if (options.reg_exp_patterns) {
            return (0, regexp_pattern_setter_1.set_regexp_pattern)(schema, options.reg_exp_patterns);
        }
        return TJS.generateSchema(options.program, options.model_name, options.settings);
    }
    return null;
}
exports.generate_schema = generate_schema;
//# sourceMappingURL=generator.js.map