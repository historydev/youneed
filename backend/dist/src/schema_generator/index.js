"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const TJS = require("../../../src/assets/typescript-json-schema");
const fs = require("fs");
const generator_1 = require("./helpers/generator");
const config_1 = require("./config");
exports.default = (model) => {
    const path = config_1.base_path + model.path;
    const { model_name, reg_exp_patterns } = model;
    const program = TJS.getProgramFromFiles([(0, path_1.resolve)(path + model.input_file_name)], config_1.compiler_options, config_1.base_path);
    const schema = TJS.generateSchema(program, "*", config_1.settings);
    const schema_options = {
        program,
        settings: config_1.settings,
        model_name: model_name || '-1',
        reg_exp_patterns
    };
    const model_schema = (0, generator_1.generate_schema)(schema_options);
    console.log(model_schema);
    try {
        if (!model_schema) {
            Object.keys(schema?.definitions || {}).forEach(def => {
                fs.writeFile(path + `${def.toLowerCase()}.schema.json`.replace('model', ''), JSON.stringify(schema?.definitions?.[def]), err => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log('File write! (schema)');
                });
            });
            return;
        }
        fs.writeFile(path + model.output_file_name, JSON.stringify(model_schema), err => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('File write! (model schema)');
        });
    }
    catch (e) {
        console.error(e);
    }
    return schema;
};
//# sourceMappingURL=index.js.map