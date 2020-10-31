import { Component, OnInit } from '@angular/core';
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
    });
    this.storeAuthorizationService.isAdminAuthorized.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.isAdminAuthorized = result;
    });
  }
  ngOnInit(): void {
  }

}
