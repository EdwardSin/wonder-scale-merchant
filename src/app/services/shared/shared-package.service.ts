import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedPackageService {
  selectedPackage: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  subscribingPackage: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor() { }
  getTrialPackage() {
    return {
      name: "Trial package - 6 months",
      type: "trial_6_months",
      month: 6,
      ori_price_per_unit: 18.8,
      price: 0
    };
  }
}
