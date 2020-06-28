import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WsLoading } from '@elements/ws-loading/ws-loading';

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
