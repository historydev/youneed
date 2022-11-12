"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_generator_1 = require("./schema_generator");
const models = [
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
(0, schema_generator_1.default)(models[1]);
//# sourceMappingURL=create_schema.js.map