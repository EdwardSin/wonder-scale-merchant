import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { AuthShopUserService } from '@services/http/auth-user/auth-shop-user.service';
import { SharedLoadingService } from '@services/shared/shared-loading.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { SharedUserService } from '@services/shared/shared-user.service';
import { WsLoading } from '@components/elements/ws-loading/ws-loading';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-pending-shops',
  templateUrl: './pending-shops.component.html',
  styleUrls: ['./pending-shops.component.scss']
})
export class PendingShopsComponent implements OnInit {
  user;
  loading: WsLoading = new WsLoading;
  pendingShopList: Array<any> = [];
  environment = environment;
  private ngUnsubscribe: Subject<any> = new Subject;

  constructor(private sharedUserService: SharedUserService,
    private authShopUserService: AuthShopUserService,
    private sharedLoadingService: SharedLoadingService,
    private sharedShopService: SharedShopService,
    private router: Router) { }

  ngOnInit() {
    DocumentHelper.setWindowTitleWithWonderScale('Pending Shops');
    this.sharedUserService.user.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          this.user = result;
          this.getPendingShops();
        }
      })
    this.sharedShopService.refresh.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          this.getPendingShops();
        }
      })
  }
  getPendingShops() {
    this.loading.start();
    this.sharedLoadingService.loading.next(this.loading.isRunning());
    this.authShopUserService.getInvitationShopsByUserId().pipe(takeUntil(this.ngUnsubscribe), finalize(() => { this.loading.stop(); this.sharedLoadingService.loading.next(this.loading.isRunning()); }))
      .subscribe(result => {
        this.pendingShopList = result['result'];
        this.pendingShopList.forEach(shop => {
          shop.current_contributor = this.authShopUserService.getContributorRole(shop, this.user);
        })
      })
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
