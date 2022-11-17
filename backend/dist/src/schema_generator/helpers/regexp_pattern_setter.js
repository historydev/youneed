"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.set_regexp_pattern = void 0;
function set_regexp_pattern(schema, reg_exp_patterns) {
    const s = JSON.parse(JSON.stringify(schema));
    if (s) {
        reg_exp_patterns.forEach(el => {
            const f = s.properties[el.field];
            if (f)
                f.pattern = el.pattern;
        });
    }
    return s;
}
exports.set_regexp_pattern = set_regexp_pattern;
//# sourceMappingURL=regexp_pattern_setter.js.map