import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthPackageAdminService } from '@services/http/auth-shop/admin/auth-package-admin.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PackageGuard implements CanActivate {
  constructor(private authPackageAdminService: AuthPackageAdminService,
    private router: Router) {

    }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return new Promise((resolve) => {
        let username = next.parent.paramMap.get('username');
        let subscribeObj = this.authPackageAdminService.isShopExpiredByUsername(username);
        subscribeObj.pipe(take(1)).subscribe(result => {
          if(result['result']) {
            this.router.navigate(['/shops', username, 'packages']);
            resolve(false);
          } else {
            resolve(true);
          }
        })
      })
  }
  
}
