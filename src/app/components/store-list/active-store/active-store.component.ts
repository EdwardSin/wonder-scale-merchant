import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';

@Component({
  selector: 'active-store',
  templateUrl: './active-store.component.html',
  styleUrls: ['./active-store.component.scss']
})
export class ActiveStoreComponent implements OnInit {
  @Input() store;
  environment = environment;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  navigateToStore(username) {
    this.router.navigate(['stores', username]);
  }
  get isExpired() {
    if (this.store && this.store.package && this.store.package.length) {
      return new Date(this.store.package[0].expiryDate) < new Date();
    }
    return true;
  }
}
