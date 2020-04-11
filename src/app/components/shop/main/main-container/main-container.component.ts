import { Component, HostListener, OnInit } from '@angular/core';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { ScreenHelper } from '@helpers/screenhelper/screen.helper';

@Component({
  selector: 'main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.scss']
})
export class MainContainerComponent implements OnInit {
  shop;
  isMobileSize: boolean;
  constructor(private sharedShopService: SharedShopService) { }

  ngOnInit() {
    this.shop = this.sharedShopService.shop.getValue();
    this.isMobileSize = ScreenHelper.isMobileSize();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobileSize = ScreenHelper.isMobileSize();
  }

}
