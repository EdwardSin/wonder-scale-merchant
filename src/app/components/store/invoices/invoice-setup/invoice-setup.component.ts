import { Component, OnInit } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { Store } from '@objects/store';
import { AuthStoreContributorService } from '@services/http/auth-store/contributor/auth-store-contributor.service';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-invoice-setup',
  templateUrl: './invoice-setup.component.html',
  styleUrls: ['./invoice-setup.component.scss']
})
export class InvoiceSetupComponent implements OnInit {
  store: Store;
  loading: WsLoading = new WsLoading;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private sharedStoreService: SharedStoreService, private authStoreContributorService: AuthStoreContributorService) { }

  ngOnInit(): void {
    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.store = result;
        DocumentHelper.setWindowTitleWithWonderScale('Get Started - ' + this.store.name);
      }
    });
    this.refreshStore();
  }
  refreshStore() {
    this.loading.start();
    let username = this.sharedStoreService.storeUsername;
    this.authStoreContributorService.getStoreByUsername(username).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop())).subscribe(result => {
      this.sharedStoreService.store.next(result);
    });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}