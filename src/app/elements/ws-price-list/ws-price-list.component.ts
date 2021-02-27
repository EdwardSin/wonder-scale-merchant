import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ws-price-list',
  templateUrl: './ws-price-list.component.html',
  styleUrls: ['./ws-price-list.component.scss']
})
export class WsPriceListComponent implements OnInit {
  @Input() selectedPackage;
  @Output('onPackageClicked') onPackageClickedEvent: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
  onPackageClicked(value) {
    this.onPackageClickedEvent.emit(value);
  }
}
