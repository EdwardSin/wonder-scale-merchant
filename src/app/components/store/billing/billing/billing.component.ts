import { Component, OnInit } from '@angular/core';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { Subject } from 'rxjs';

@Component({
  selector: 'billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private sharedStoreService: SharedStoreService) { }

  ngOnInit() {
    let store_name = this.sharedStoreService.store_name;
    DocumentHelper.setWindowTitleWithWonderScale('Billing - ' + store_name);
  }

}
