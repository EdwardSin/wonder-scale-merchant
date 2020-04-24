import { Component, HostListener, OnInit } from '@angular/core';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { ScreenHelper } from '@helpers/screenhelper/screen.helper';
import { SharedNavbarService } from '@services/shared/shared-nav-bar.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.scss']
})
export class MainContainerComponent implements OnInit {
  shop;
  isNavOpen: boolean;
  isMobileSize: boolean;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private sharedShopService: SharedShopService,
    private sharedNavbarService: SharedNavbarService) { }

  ngOnInit() {
    this.shop = this.sharedShopService.shop.getValue();
    this.isMobileSize = ScreenHelper.isMobileSize();
    this.sharedNavbarService.isNavSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.isNavOpen = res;
    });
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobileSize = ScreenHelper.isMobileSize();
  }
  onNavbarOpen () {
    this.isNavOpen = !this.isNavOpen
    this.sharedNavbarService.isNavSubject.next(this.isNavOpen);
  }
}
