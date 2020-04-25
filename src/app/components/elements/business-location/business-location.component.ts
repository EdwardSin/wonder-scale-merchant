import { Component, Input, OnInit } from '@angular/core';
import { Constants } from '@constants/constants';
import { environment } from '@environments/environment';
import { Address } from '@objects/address';
import { MapController } from '@objects/map.controller';
import _ from "lodash";

@Component({
  selector: 'business-location',
  templateUrl: './business-location.component.html',
  styleUrls: ['./business-location.component.scss'],
})
export class BusinessLocationComponent implements OnInit {
  @Input() address: Address;
  @Input() mapController: MapController;
  @Input() disabled: boolean = true;
  environment = environment;
  data = {
    countries: Constants.countries,
    value: _.values(Constants.countries)
  }

  constructor() {
    this.address = new Address();
  }

  ngOnInit() {
  }

  clear() {
    this.mapController.displayed = false;
  }
}
