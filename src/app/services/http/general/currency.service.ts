import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Constants } from '@constants/constants';
import { Currency } from '@objects/currency';
import { CurrencyUrl } from '@enum/url.enum';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  currenciesBehaviourSubject: BehaviorSubject<any[]> = new BehaviorSubject([]);
  _currencies: Array<Currency> = [];
  currencyFullnameArray = Object.keys(Constants.currencyFullnames);
  currencyFullnames = Constants.currencyFullnames;
  currencySymbols = Constants.currencySymbols;
  currencyRate: BehaviorSubject<any> = new BehaviorSubject(null);
  selectedCurrency: BehaviorSubject<string> = new BehaviorSubject('MYR');
  get currencies(): Array<Currency> {
    return this._currencies;
}

  constructor(private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId) {
    const platform = isPlatformBrowser(this.platformId);
    if (platform) {
      this.selectedCurrency = new BehaviorSubject(localStorage.getItem('currency') || 'MYR');
    }
  }
  getCurrencyWithCode(code='MYR') {
    let currencies = this.currenciesBehaviourSubject.getValue();
    return currencies.find(currency => currency.code == code);
  }

  getCurrency() {
    return this.http.get(CurrencyUrl.getCurrencyUrl);
  }
}
