import { PipeTransform, Pipe } from '@angular/core';
import {LogsModel} from "../../models/logger/logs.model";

@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
	transform(value:any, ...args:any[]) : any {
		return value.item[value.key]
	}
}
