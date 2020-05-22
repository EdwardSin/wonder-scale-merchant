import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { AuthShopContributorService } from '@services/http/auth-shop/contributor/auth-shop-contributor.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SharedUserService } from '@services/shared/shared-user.service';
import { Contributor } from '@objects/contributor';

@Component({
  selector: 'pending-shop',
  templateUrl: './pending-shop.component.html',
  styleUrls: ['./pending-shop.component.scss']
})
export class PendingShopComponent implements OnInit {
  @Input() shop;
  isRemoveModalOpen: boolean;
  environment = environment;
  contributor: Contributor;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(
    private router: Router,
    private ref: ChangeDetectorRef,
    private sharedUserService: SharedUserService,
    private sharedShopService: SharedShopService,
    private authShopContributorService: AuthShopContributorService) { }

  ngOnInit() {
  }
  accept(shop) {
    this.authShopContributorService.joinContributor(shop._id).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        WsToastService.toastSubject.next({ content: "You joined " + shop.name + "!", type: 'success' });
        this.sharedShopService.refresh.next(true);
      }, err => {
        WsToastService.toastSubject.next({ content: err.error, type: 'danger' })
      })
  }
  reject(shop) {
    this.authShopContributorService.rejectContributor(shop._id).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        WsToastService.toastSubject.next({ content: "You rejected to join " + shop.name + "!", type: 'success' });
        this.isRemoveModalOpen = false;
        this.sharedShopService.refresh.next(true);
      }, err => {
        WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
      })
  }
}
