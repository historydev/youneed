import {RequestHandler} from "express";

export interface ValidatorModel {
	[method: string]: RequestHandler;
}
