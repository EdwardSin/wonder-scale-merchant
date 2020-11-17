import { Component, OnInit } from '@angular/core';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { Store } from '@objects/store';
import { StoreAuthorizationService } from '@services/http/general/store-authorization.service';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-settings-list',
  templateUrl: './settings-list.component.html',
  styleUrls: ['./settings-list.component.scss']
})
export class SettingsListComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject;
  store: Store;
  isAdminAuthorized: boolean;
  constructor(private sharedStoreService: SharedStoreService,
    private storeAuthorizationService: StoreAuthorizationService) { 
    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.store = result;
      DocumentHelper.setWindowTitleWithWonderScale('Settings - ' + this.store.name);
    });
    this.storeAuthorizationService.isAdminAuthorized.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.isAdminAuthorized = result;
    });
  }
  ngOnInit(): void {
  }

}
