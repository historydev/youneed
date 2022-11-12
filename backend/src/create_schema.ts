import schema_generator from "./schema_generator";
import {SchemaGeneratorOptionsModel} from "./models/schema_generator/schema_generator_options.model";

const models: SchemaGeneratorOptionsModel[] = [
	{
		input_file_name: 'register_input.model.ts',
		output_file_name: 'register_input.schema.json',
		model_name: 'RegisterInputModel',
		path: '/authentication/',
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
			},
			{
				field: 'password',
				pattern: '^[a-zA-Zа-яА-Я0-9_@.+!#$%^&*(){}-]+$'
			}
		]
	},
	{
		input_file_name: 'authorization_input.model.ts',
		output_file_name: 'authorization_input.schema.json',
		model_name: 'AuthorizationInputModel',
		path: '/authentication/',
		reg_exp_patterns: [
			{
				field: 'email',
				pattern: '^[a-zA-Zа-яА-Я0-9_@.-]+$'
			},
			{
				field: 'password',
				pattern: '^[a-zA-Zа-яА-Я0-9_@.+!#$%^&*(){}-]+$'
			}
		]
	},
	{
		input_file_name: 'register_output.model.ts',
		output_file_name: 'register_output.schema.json',
		model_name: 'RegisterOutputModel',
		path: '/authentication/',
		reg_exp_patterns: [
			{
				field: 'first_name',
				pattern: '^[a-zA-Zа-яА-Я]+$'
			},
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
			},
			{
				field: 'password',
				pattern: '^[a-zA-Zа-яА-Я0-9_@.+!#$%^&*(){}-]+$'
			}
		]
	},
];

// models.forEach(schema_generator);

schema_generator(models[1]);
