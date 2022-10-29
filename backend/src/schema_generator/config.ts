import * as TJS from "typescript-json-schema";

export const settings: TJS.PartialArgs = { required: true, noExtraProps: true };
export const compiler_options: TJS.CompilerOptions = { strictNullChecks: true };
export const base_path = './backend/src/models';
