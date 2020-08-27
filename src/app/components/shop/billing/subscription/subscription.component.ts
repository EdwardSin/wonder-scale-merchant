import { Component, OnInit } from '@angular/core';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { Subject } from 'rxjs';

@Component({
  selector: 'subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private sharedShopService: SharedShopService) { }

  ngOnInit() {
    let shop_name = this.sharedShopService.shop_name;
    DocumentHelper.setWindowTitleWithWonderScale('Subscription - ' + shop_name);
  }

}
