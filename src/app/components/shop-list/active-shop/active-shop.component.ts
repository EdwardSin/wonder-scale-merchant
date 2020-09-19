import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';

@Component({
  selector: 'active-shop',
  templateUrl: './active-shop.component.html',
  styleUrls: ['./active-shop.component.scss']
})
export class ActiveShopComponent implements OnInit {
  @Input() shop;
  environment = environment;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  navigateToShop(username) {
    this.router.navigate(['shops', username]);
  }
  get isExpired() {
    if (this.shop && this.shop.package && this.shop.package.length) {
      return new Date(this.shop.package[0].expiryDate) < new Date();
    }
    return true;
  }
}
