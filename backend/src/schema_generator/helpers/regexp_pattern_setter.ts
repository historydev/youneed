import * as TJS from "typescript-json-schema";
import {Pattern} from "../../models/schema_generator/generate_schema_options.model";

export function set_regexp_pattern(schema: TJS.Definition | null, reg_exp_patterns: Pattern[]): TJS.Definition | null {
	const s = JSON.parse(JSON.stringify(schema));
	if(s) {
		reg_exp_patterns.forEach(el => {
			const f = s.properties[el.field];
			if(f) f.pattern = el.pattern;
		});
	}
	return s;
}
