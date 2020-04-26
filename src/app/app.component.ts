import { ChangeDetectorRef, Component } from '@angular/core';
import { CurrencyService } from '@services/http/general/currency.service';
import { SharedLoadingService } from '@services/shared/shared-loading.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Currency } from './objects/currency';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'wonder-scale-merchant';
  screenLoading: Boolean;
  loadingLabel: string;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private currencyService: CurrencyService,
    private ref: ChangeDetectorRef,
    private sharedLoadingService: SharedLoadingService) {
    this.currencyService
      .getCurrency()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          let rates = result['rates'];
          this.currencyService.currencyRate.next(rates);
        }
      });
  }
  ngOnInit() {
    this.sharedLoadingService.screenLoading.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (!result.loading) {
          setTimeout(() => {
            this.screenLoading = result.loading;
            this.ref.detectChanges();
          }, 500);
        } else {
          this.screenLoading = result.loading;
          this.loadingLabel = result.label;
          this.ref.detectChanges();
        }
      })
  }
  ngOnDestory() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
