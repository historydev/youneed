import {Component, Input, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {SearchEngineModel} from "../../models/search-engine/search-engine.model";
import {LoggerService} from "../../services/logger/logger.service";

@Component({
	selector: 'app-search-engine',
	templateUrl: './search-engine.component.html',
	styleUrls: ['./search-engine.component.scss']
})
export class SearchEngineComponent implements OnInit {

	@Input() collection?:any[];
	public searchResult?:Object[];
	public model?:string[];
	public Object = Object;

	constructor(
		private Logger: LoggerService
	) {}

	public find( element:SearchEngineModel = { key: '', searchValue: '' } ): void {
		if(element.searchValue) {
			this.searchResult = this.collection?.filter(el => {
				if(element.key.length > 0 && el[element.key]?.toLowerCase().indexOf(element.searchValue.toLowerCase()) > -1) {
					return el
				}
			});

			return
		}

		this.searchResult = [];
	}

	public filter(options:Object[]): void {
		this.collection?.filter(el => {

		})
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.model = Object.keys(changes['collection'].currentValue[0]);
	}

	ngOnInit(): void {

	}

}
