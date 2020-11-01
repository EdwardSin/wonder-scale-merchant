import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { Store } from '@objects/store';
import { AuthStoreAdminService } from '@services/http/auth-store/admin/auth-store-admin.service';
import { AuthStoreContributorService } from '@services/http/auth-store/contributor/auth-store-contributor.service';
import { StoreAuthorizationService } from '@services/http/general/store-authorization.service';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-advanced',
  templateUrl: './advanced.component.html',
  styleUrls: ['./advanced.component.scss']
})
export class AdvancedComponent implements OnInit {
  store: Store;
  isAdminAuthorized: boolean;
  isConfirmCloseStoreModalOpened: boolean;
  isConfirmReactivateModalOpened: boolean;
  isConfirmQuitStoreModalOpened: boolean;
  timeDifference: number;
  timeDifferenceString: string;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private sharedStoreService: SharedStoreService,
    private authStoreContributorService: AuthStoreContributorService,
    private authStoreAdminService: AuthStoreAdminService,
    private storeAuthorizationService: StoreAuthorizationService,
    private router: Router) {
    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.store = result;
    })
    this.storeAuthorizationService.isAdminAuthorized.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.isAdminAuthorized = result;
        if (this.store.status.status == 'closed' && this.store.status.expiryDate) {
          this.timeDifference = moment(this.store.status.expiryDate).diff(moment());
          this.timeDifferenceString = moment(this.store.status.expiryDate).fromNow();
          interval(2000).pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
            this.timeDifference = moment(this.store.status.expiryDate).diff(moment());
            this.timeDifferenceString = moment(this.store.status.expiryDate).fromNow();
          });
        }
      })
  }

  ngOnInit(): void {
  }
  closePermanently() {
    this.authStoreAdminService
      .closePermanently()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        let date = new Date;
        date.setHours(date.getHours() + 1);
        this.store.status.status = 'closed';
        this.store.status.expiryDate = date;
        this.sharedStoreService.store.next(this.store);
        this.isConfirmCloseStoreModalOpened = false;
        this.router.navigate(['/stores/' + this.store.username + '']);
      }, err => {
        WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
      });
  }
  reactivateFromInactive() {
    this.authStoreAdminService
      .reactivateStore()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.store.status.status = 'active';
        this.store.status.expiryDate = null;
        this.sharedStoreService.store.next(this.store);
        this.isConfirmReactivateModalOpened = false;
        this.router.navigate(['/stores/' + this.store.username + '']);
      });
  }
  quitStore() {
    this.authStoreContributorService.leaveStore()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.isConfirmQuitStoreModalOpened = false;
        this.router.navigate(['stores/all']);
      }, err => {
        WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
      })
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
