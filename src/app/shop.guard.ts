import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthShopUserService } from '@services/http/auth-user/auth-shop-user.service';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';

@Injectable({
  providedIn: 'root'
})
export class ShopGuard implements CanActivate {
  constructor(private router: Router,
    private authShopUserService: AuthShopUserService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return new Promise<boolean>((resolve, reject) => {
        let username = next.parent.paramMap.get('username');
        this.authShopUserService.isAuthenticatedShopByShopUsername(username).subscribe(result => {
          if (!result['result']) {
            WsToastService.toastSubject.next({ content: 'Unauthorized to access shop!', type: 'danger'});
            this.router.navigate(['shops']);
          }
          resolve(result['result']);
        }, err => {
          console.log(err);
          WsToastService.toastSubject.next({ content: 'Unauthorized to access shop!', type: 'danger'});
          this.router.navigate(['shops']);
          resolve(false);
        });
    });   
  }
  
}
