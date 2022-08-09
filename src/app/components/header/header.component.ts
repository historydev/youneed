import { Component, OnInit } from '@angular/core';
import {GlobalStoreService} from "../../services/global-store/global-store.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
	  public globalStore: GlobalStoreService
  ) {}

  ngOnInit(): void {
  }

}
