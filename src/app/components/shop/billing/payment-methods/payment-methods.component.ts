import { Component, OnInit } from '@angular/core';
import { PaymentCard } from '@objects/payment-card';
import { AuthCardContributorService } from '@services/http/auth-shop/contributor/auth-card-contributor.service';
import { SharedCardService } from '@services/shared/shared-card.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import _ from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss']
})
export class PaymentMethodsComponent implements OnInit {
  cards: PaymentCard[] = [];
  loading: WsLoading = new WsLoading;
  currency: string = '';
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(
    private authCardContributorService: AuthCardContributorService,
    private sharedCardService: SharedCardService,
    private sharedShopService: SharedShopService) { }

  ngOnInit() {
    let shop_name = this.sharedShopService.shop_name;
    DocumentHelper.setWindowTitleWithWonderScale('Payment Methods - ' + shop_name);
    this.getCardsByShopId();
    this.sharedCardService.cards.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          this.cards = result;
        }
      })
  }
  getCardsByShopId() {
    this.loading.start();
    this.authCardContributorService.getCardsByShopId().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.sharedCardService.cards.next(result.result);
        this.loading.stop();
      }, err => {
        this.loading.stop();
      })
  }
  deleteCard(id) {
    if (confirm('Are you sure to delete the card?')) {
      this.authCardContributorService.deleteCard(id).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          _.remove(this.cards, card => card._id == id);
          WsToastService.toastSubject.next({ content: 'Card is deleted successfully!', type: 'success' });
        })
    }
  }
  setDefault(id) {
    if (confirm('Are you sure to set the card as default?')) {
      this.authCardContributorService.setDefault(id).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          this.getCardsByShopId();
          WsToastService.toastSubject.next({ content: 'Card is set as default!', type: 'success' });
        })
    }
  }
}
