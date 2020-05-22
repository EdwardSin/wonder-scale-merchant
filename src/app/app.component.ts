import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { CurrencyService } from '@services/http/general/currency.service';
import { SharedLoadingService } from '@services/shared/shared-loading.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Currency } from './objects/currency';
import { ScreenService } from '@services/general/screen.service';
import { ScreenHelper } from '@helpers/screenhelper/screen.helper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'wonder-scale-merchant';
  screenLoading: Boolean;
  loadingLabel: string;
  isMoblieSize: boolean;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private currencyService: CurrencyService,
    private ref: ChangeDetectorRef,
    private screenService: ScreenService,
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
    this.screenService.isMobileSize.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.isMoblieSize = result;
    });
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenService.isMobileSize.next(ScreenHelper.isMobileSize());
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
