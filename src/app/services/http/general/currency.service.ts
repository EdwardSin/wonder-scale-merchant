import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  currencyRate: BehaviorSubject<any> = new BehaviorSubject(null);
  currencyName: BehaviorSubject<any> = new BehaviorSubject(null);
  selectedCurrency = new BehaviorSubject('MYR');

  constructor(private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId) {
    const platform = isPlatformBrowser(this.platformId);
    if (platform) {
      this.selectedCurrency = new BehaviorSubject(localStorage.getItem('currency') || 'MYR');
    }
  }

  getCurrency() {
    return this.http.get('/api/currency');
  }
}
