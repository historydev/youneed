
import { resolve } from "path";
import * as TJS from "../../typescript-json-schema";
import * as fs from 'fs';
import {SchemaGeneratorOptionsModel} from "../models/schema_generator/schema_generator_options.model";
import {generate_schema} from "./helpers/generator";
import {base_path, compiler_options, settings} from "./config";

export default (model: SchemaGeneratorOptionsModel) => {
	const path = base_path + model.path;
	const { model_name, reg_exp_patterns } = model;
    const program = TJS.getProgramFromFiles(
        [resolve(path + model.input_file_name)],
        compiler_options,
        base_path
    );
    const schema = TJS.generateSchema(program, "*", settings);
	const schema_options = {
		program,
		settings,
		model_name: model_name || '-1',
		reg_exp_patterns
	}
	const model_schema = generate_schema(schema_options);

	console.log(model_schema);

	try {
        if(!model_schema) {
			Object.keys(schema?.definitions || {}).forEach(def => {
				fs.writeFile(path + `${def.toLowerCase()}.schema.json`.replace('model', ''), JSON.stringify(schema?.definitions?.[def]), err => {
					if(err) {
						console.error(err);
						return;
					}
					console.log('File write! (schema)');
				});
			});

			return;
		}
		fs.writeFile(path + model.output_file_name, JSON.stringify(model_schema), err => {
			if(err) {
				console.error(err);
				return;
			}
			console.log('File write! (model schema)');
		});
    } catch (e) {
        console.error(e);
    }
    return schema;
}
