import {Pattern} from "./generate_schema_options.model";

export interface SchemaGeneratorOptionsModel {
	input_file_name: string;
	output_file_name: string;
	model_name: string;
	path: string;
	reg_exp_patterns?: Pattern[];
}
