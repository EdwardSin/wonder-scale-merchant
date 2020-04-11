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
          this.currencyService.currencyName.next(Currency.currenciesAsArray);
        }
      });
  }
  ngOnInit() {
    this.sharedLoadingService.screenLoading.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.screenLoading = result;
        this.ref.detectChanges();
      })
  }
  ngOnDestory() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
