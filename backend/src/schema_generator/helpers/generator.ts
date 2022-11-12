import {GenerateSchemaOptionsModel} from "../../models/schema_generator/generate_schema_options.model";
import * as TJS from "../../../../src/assets/typescript-json-schema";
import {set_regexp_pattern} from "./regexp_pattern_setter";

export function generate_schema(options: GenerateSchemaOptionsModel): TJS.Definition | null {
	if(options.model_name) {
		const schema = TJS.generateSchema(options.program, options.model_name, options.settings);
		if(options.reg_exp_patterns) {
			return set_regexp_pattern(schema, options.reg_exp_patterns);
		}
		return TJS.generateSchema(options.program, options.model_name, options.settings);
	}
	return null;
}
