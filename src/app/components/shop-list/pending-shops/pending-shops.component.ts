import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { AuthShopUserService } from '@services/http/auth-user/auth-shop-user.service';
import { SharedLoadingService } from '@services/shared/shared-loading.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { SharedUserService } from '@services/shared/shared-user.service';
import { WsLoading } from '@components/elements/ws-loading/ws-loading';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { Subject, combineLatest, timer, interval } from 'rxjs';
import { finalize, takeUntil, map, switchMap } from 'rxjs/operators';

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

  constructor(
    private sharedShopService: SharedShopService) { }

  ngOnInit() {
    DocumentHelper.setWindowTitleWithWonderScale('Pending Shops');
    this.sharedShopService.pendingShopList.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      if (result) {
        this.pendingShopList = result;
        this.loading.stop();
      }
    });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
