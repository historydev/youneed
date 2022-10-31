import {ValidationError, Validator} from "express-json-validator-middleware";
import {NextFunction, Request, Response} from "express";

export function validation_middleware(error: any, req: Request, res: Response, next: NextFunction) {
	// Check the error is a validation error
	if (error instanceof ValidationError) {
		const err_data = error['validationErrors'].body?.[0];

		const message = ((): string => {
			switch (err_data?.keyword) {
				case 'type': return (err_data?.instancePath || 'Object') + ' ' + err_data?.message;
				case 'additionalProperties': return (err_data?.instancePath || 'Object') + ' ' + err_data.message + ': ' + err_data?.params['additionalProperty'];
				default: return (err_data?.instancePath || 'Object') + ' ' + err_data?.message;
			}
		})();

		res.status(400).send({
			error: err_data?.keyword,
			message: 'Validation failed'
			// message: message,
		});
		res.end();
	} else {
		// Pass error on if not a validation error
		next(error);
	}
}
