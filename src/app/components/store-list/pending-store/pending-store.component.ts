import { Component, Input, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { AuthStoreContributorService } from '@services/http/auth-store/contributor/auth-store-contributor.service';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Contributor } from '@objects/contributor';

@Component({
  selector: 'pending-store',
  templateUrl: './pending-store.component.html',
  styleUrls: ['./pending-store.component.scss']
})
export class PendingStoreComponent implements OnInit {
  @Input() store;
  isRemoveModalOpen: boolean;
  environment = environment;
  contributor: Contributor;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(
    private sharedStoreService: SharedStoreService,
    private authStoreContributorService: AuthStoreContributorService) { }

  ngOnInit() {
  }
  accept(store) {
    this.authStoreContributorService.joinContributor(store._id).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        WsToastService.toastSubject.next({ content: "You joined " + store.name + "!", type: 'success' });
        this.sharedStoreService.refresh.next(true);
      }, err => {
        WsToastService.toastSubject.next({ content: err.error, type: 'danger' })
      })
  }
  reject(store) {
    this.authStoreContributorService.rejectContributor(store._id).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        WsToastService.toastSubject.next({ content: "You rejected to join " + store.name + "!", type: 'success' });
        this.isRemoveModalOpen = false;
        this.sharedStoreService.refresh.next(true);
      }, err => {
        WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
      })
  }
}
