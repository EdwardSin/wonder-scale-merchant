import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthShopUserService } from '@services/http/auth-user/auth-shop-user.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'package-result',
  templateUrl: './package-result.component.html',
  styleUrls: ['./package-result.component.scss']
})
export class PackageResultComponent implements OnInit {
  @Input() selectedPackage;
  private ngUnsubscribe: Subject<any> = new Subject();
  constructor(private sharedShopService: SharedShopService,
    private ref: ChangeDetectorRef,
    private router: Router,
    private authShopUserService: AuthShopUserService,
    private route: ActivatedRoute) { 
  }

  ngOnInit(): void {
  }
  navigateToContinue() {
    let shop_username = this.sharedShopService.shop_username;
    this.authShopUserService.getAuthenticatedShopByShopUsername(shop_username).pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.router.navigate(['/shops', this.sharedShopService.shop.getValue().username, 'dashboard']);
    });
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
