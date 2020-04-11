import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { AuthShopContributorService } from '@services/http/auth-shop/contributor/auth-shop-contributor.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { WsToastService } from '@components/elements/ws-toast/ws-toast.service';
import { WsModalService } from '@components/elements/ws-modal/ws-modal.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'pending-shop',
  templateUrl: './pending-shop.component.html',
  styleUrls: ['./pending-shop.component.scss']
})
export class PendingShopComponent implements OnInit {
  @Input() shop;
  isRemoveModalOpen: Boolean;
  environment = environment;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(
    private modalService: WsModalService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private sharedShopService: SharedShopService,
    private authShopContributorService: AuthShopContributorService) { }

  ngOnInit() {
  }
  accept(shop_name, shop_id) {
    this.authShopContributorService.joinContributor({ shop_id }).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        WsToastService.toastSubject.next({ content: "You joined " + shop_name + "!", type: 'success' });
        this.router.navigate([this.shop.username]);
      }, err => {
        WsToastService.toastSubject.next({ content: err.error, type: 'danger' })
      })
  }
  reject(shop_name, shop_id) {
    this.authShopContributorService.rejectContributor({ shop_id }).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.sharedShopService.refresh.next(true);
        WsToastService.toastSubject.next({ content: "You rejected to join " + shop_name + "!", type: 'success' });
      }, err => {
        WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
      })
  }
  blockMessage() {
    WsToastService.toastSubject.next({ content: "Shop can only be viewed by contributor!", type: 'danger' });
  }
  openModal(id) {
    this.isRemoveModalOpen = true;
    this.ref.detectChanges();
    this.modalService.open(id);
  }
  closeModal() {
    this.isRemoveModalOpen = false;
  }
}
