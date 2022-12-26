import {SchemaGeneratorOptionsModel} from "./models/schema_generator/schema_generator_options.model";

export const models: SchemaGeneratorOptionsModel[] = [
	{
		input_file_name: 'post.request.model.ts',
		output_file_name: 'request.schema.json',
		model_name: 'RegisterRequestModel',
		path: '/register/',
		reg_exp_patterns: [
			{
				field: 'first_name',
				pattern: '^[a-zA-Zа-яА-Я]+$'
			},
			{
				field: 'last_name',
				pattern: '^[a-zA-Zа-яА-Я]+$'
			},
			{
				field: 'email',
				pattern: '^[a-zA-Zа-яА-Я0-9_@.-]+$'
			}
		]
	},
	{
		input_file_name: 'post.request.model.ts',
		output_file_name: 'request.schema.json',
		model_name: 'AuthenticationRequestModel',
		path: '/authentication/',
		reg_exp_patterns: [
			{
				field: 'email',
				pattern: '^[a-zA-Zа-яА-Я0-9_@.-]+$'
			}
		]
	}
];
