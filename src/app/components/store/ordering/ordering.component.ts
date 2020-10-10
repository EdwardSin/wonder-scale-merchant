import { Component, OnInit } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { Store } from '@objects/store';
import { AuthOrderingConfigurationContributorService } from '@services/http/auth-store/ordering-contributor/auth-ordering-configuration-contributor.service';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ordering',
  templateUrl: './ordering.component.html',
  styleUrls: ['./ordering.component.scss']
})
export class OrderingComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  store: Store;
  startLoading: WsLoading = new WsLoading;
  loading: WsLoading = new WsLoading;

  constructor(private authOrderingConfigurationContributorService: AuthOrderingConfigurationContributorService, 
    private sharedStoreService: SharedStoreService) { 
    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.store = result;
    })
  }

  ngOnInit(): void {
  }

  startOrderingService() {
    this.startLoading.start();
    this.authOrderingConfigurationContributorService.startOrderingService().pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.startLoading.stop())).subscribe(result => {
      if (result['result']) {
        this.store.isOrderingOn = true;
        this.sharedStoreService.store.next(this.store);
      }
    });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
