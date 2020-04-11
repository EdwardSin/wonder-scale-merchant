import { Component, OnInit } from '@angular/core';
import { AuthShopUserService } from '@services/http/auth-user/auth-shop-user.service';
import { SharedLoadingService } from '@services/shared/shared-loading.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { SharedUserService } from '@services/shared/shared-user.service';
import { WsLoading } from '@components/elements/ws-loading/ws-loading';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-all-shops',
  templateUrl: './all-shops.component.html',
  styleUrls: ['./all-shops.component.scss']
})
export class AllShopsComponent implements OnInit {
  user;
  activeShopList: Array<any> = [];
  loading: WsLoading = new WsLoading;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private sharedUserService: SharedUserService,
    private sharedLoadingService: SharedLoadingService,
    private sharedShopService: SharedShopService,
    private authShopUserService: AuthShopUserService) { }

  ngOnInit() {
    DocumentHelper.setWindowTitleWithWonderScale('Joined Shops');

    this.sharedUserService.user.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          this.user = result;
          this.getActiveShops();
        }
      })
    this.sharedShopService.refresh.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          this.getActiveShops();
        }
      })
  }
  getActiveShops() {
    this.loading.start();
    this.sharedLoadingService.loading.next(this.loading.isRunning());
    this.authShopUserService.getShopsByUserId().pipe(takeUntil(this.ngUnsubscribe), finalize(() => {
      this.loading.stop();
      this.sharedLoadingService.loading.next(this.loading.isRunning());
    }))
      .subscribe(result => {
        this.activeShopList = result['result'];
        this.activeShopList.forEach(shop => {
          shop.current_contributor = this.authShopUserService.getContributorRole(shop, this.user);
        });
      })
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
