import {Component, HostListener, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {LoggerService} from "../../../services/logger/logger.service";
import {IconsModel} from "../../../models/UI/button/icons.model";
import {IconDefinition} from "@fortawesome/free-solid-svg-icons";
import {IconProp} from "@fortawesome/fontawesome-svg-core";

@Component({
	selector: 'app-button',
	templateUrl: './button.component.html',
	styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

	public statusClick?: boolean = false;
	public currentIcon?: IconDefinition | IconProp;
	public statusClass: string = 'not-active';

	@Input() icons?: IconsModel;
	@Input() text?: string;
	@Output() onClick = new EventEmitter<void>();

	@HostListener('click') changeIcon() {
		this.statusClick = !this.statusClick;
		this.onClick.emit();
		if(!this.statusClick) {
			this.statusClass = 'not-active';
			this.currentIcon = this.icons?.defaultIcon;

			return;
		}
		if(this.icons?.clickedIcon) {
			this.statusClass = 'active';
			this.currentIcon = this.icons?.clickedIcon;
		}
	}

	constructor(
		private Logger: LoggerService
	) {}

	ngOnInit(): void {
		this.currentIcon = this.icons?.defaultIcon;
	}

}
