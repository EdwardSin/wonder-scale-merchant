import { Component, OnInit } from '@angular/core';
import { AuthStoreUserService } from '@services/http/auth-user/auth-store-user.service';
import { SharedLoadingService } from '@services/shared/shared-loading.service';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { SharedUserService } from '@services/shared/shared-user.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { Subject, combineLatest, timer } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

@Component({
  selector: 'app-all-stores',
  templateUrl: './all-stores.component.html',
  styleUrls: ['./all-stores.component.scss']
})
export class AllStoresComponent implements OnInit {
  user;
  activeStoreList: Array<any> = [];
  loading: WsLoading = new WsLoading;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private sharedUserService: SharedUserService,
    private sharedLoadingService: SharedLoadingService,
    private sharedStoreService: SharedStoreService,
    private authStoreUserService: AuthStoreUserService) { 
      sessionStorage.removeItem('qrcodeTipsClear');
    }

  ngOnInit() {
    DocumentHelper.setWindowTitleWithWonderScale('All Stores');
    this.loading.start();
    this.sharedUserService.user.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          this.user = result;
          this.getActiveStores();
        }
      })
    this.sharedStoreService.refresh.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          this.getActiveStores();
        }
      })
  }
  getActiveStores() {
    this.loading.start();
    this.sharedLoadingService.loading.next(this.loading.isRunning());
    combineLatest(timer(500), this.authStoreUserService.getStoresByUserId())
    .pipe(
      map(x => x[1]),
      takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.activeStoreList = result['result'];
        this.activeStoreList.forEach(store => {
          store.currentContributor = this.authStoreUserService.getContributorRole(store, this.user);
        });
        this.loading.stop();
        this.sharedLoadingService.loading.next(this.loading.isRunning());
      })
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
