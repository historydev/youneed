
import * as TJS from 'typescript-json-schema';

export type Pattern = {
	field: string;
	pattern: string;
}

export interface GenerateSchemaOptionsModel {
	program: TJS.Program;
	settings: TJS.PartialArgs;
	model_name: string;
	reg_exp_patterns?: Pattern[];
}
