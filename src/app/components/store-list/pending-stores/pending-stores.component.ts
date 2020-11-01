import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WsLoading } from '@elements/ws-loading/ws-loading';

@Component({
  selector: 'app-pending-stores',
  templateUrl: './pending-stores.component.html',
  styleUrls: ['./pending-stores.component.scss']
})
export class PendingStoresComponent implements OnInit {
  user;
  loading: WsLoading = new WsLoading;
  pendingStoreList: Array<any> = [];
  environment = environment;
  private ngUnsubscribe: Subject<any> = new Subject;

  constructor(
    private sharedStoreService: SharedStoreService) { }

  ngOnInit() {
    DocumentHelper.setWindowTitleWithWonderScale('Pending Stores');
    this.sharedStoreService.pendingStoreList.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      if (result) {
        this.pendingStoreList = result;
        this.loading.stop();
      }
    });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
