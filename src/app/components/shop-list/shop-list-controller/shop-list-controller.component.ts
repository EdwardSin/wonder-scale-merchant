import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedLoadingService } from '@services/shared/shared-loading.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { WsLoading } from '@components/elements/ws-loading/ws-loading';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'shop-list-controller',
  templateUrl: './shop-list-controller.component.html',
  styleUrls: ['./shop-list-controller.component.scss']
})
export class ShopListControllerComponent implements OnInit {

  private ngUnsubscribe: Subject<any> = new Subject;
  user;
  activeShopList: Array<any> = [];
  pendingShopList: Array<any> = [];
  loading: WsLoading = new WsLoading;

  constructor(private router: Router,
    private sharedLoadingService: SharedLoadingService,
    private ref: ChangeDetectorRef,
    private sharedShopService: SharedShopService) { }

  ngOnInit() {
    this.sharedLoadingService.loading.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        result ? this.loading.start() : this.loading.stop();
        this.ref.detectChanges();
      })
    this.sharedShopService.activeShopList.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          this.activeShopList = result;
        }
      })
    this.sharedShopService.pendingShopList.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          this.pendingShopList = result;
        }
      })
  }
  refresh() {
    this.sharedShopService.refresh.next(true);
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
