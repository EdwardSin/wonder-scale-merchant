import { Component, OnInit } from '@angular/core';
import { AuthPackageAdminService } from '@services/http/auth-shop/admin/auth-package-admin.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { WsLoading } from '@elements/ws-loading/ws-loading';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss']
})
export class PackagesComponent implements OnInit {
  package;
  loading: WsLoading = new WsLoading;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private authPackageAdminService: AuthPackageAdminService) { 
  }

  ngOnInit(): void {
    this.getShopPackage();
  }
  getShopPackage() {
    this.loading.start();
    this.authPackageAdminService.getShopPackages().pipe(takeUntil(this.ngUnsubscribe)).
    subscribe(result => {
      this.package = result['result'];
      this.loading.stop();
    })
  }
}
