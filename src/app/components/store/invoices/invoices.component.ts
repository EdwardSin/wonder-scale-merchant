import { Component, OnInit } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { Phase } from '@objects/phase';
import { AuthInvoiceConfigurationContributorService } from '@services/http/auth-store/contributor/auth-invoice-configuration-contributor.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {
  isInvoiceEnabled: boolean;
  phase: Phase<number> = new Phase(0, 2);
  loading: WsLoading = new WsLoading;
  addLoading: WsLoading = new WsLoading;
  prefix: string = 'R';
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private authInvoiceConfigurationContributorService: AuthInvoiceConfigurationContributorService) { }
  ngOnInit(): void {
    this.loading.start();
    this.authInvoiceConfigurationContributorService.isInvoiceEnabled.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result !== null) {
        this.isInvoiceEnabled = result;
        this.loading.stop();
      }
    });
  }
  addInvoiceConfiguration() {
    let obj = {
      prefix: this.prefix
    };
    this.addLoading.start();
    this.authInvoiceConfigurationContributorService.addInvoiceConfiguration(obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.addLoading.stop())).subscribe(result => {
      this.authInvoiceConfigurationContributorService.isInvoiceEnabled.next(true);
    });
  }
  ngOnDestoy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
