import { Component, OnInit } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { AuthBillContributorService } from '@services/http/auth-store/contributor/auth-bill-contributor.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss']
})
export class BillsComponent implements OnInit {
  bills = [];
  loading: WsLoading = new WsLoading();
  private ngUnsubscribe: Subject<any> = new Subject();
  constructor(private authBillContributorService: AuthBillContributorService) { }

  ngOnInit(): void {
    this.getBills();
  }
  getBills() {
    this.loading.start();
    this.authBillContributorService.getBills().pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop())).subscribe(result => {
      this.bills = result['result'];
    });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
