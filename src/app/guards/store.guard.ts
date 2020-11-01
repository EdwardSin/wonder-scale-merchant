import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthStoreUserService } from '@services/http/auth-user/auth-store-user.service';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';

@Injectable({
  providedIn: 'root'
})
export class StoreGuard implements CanActivate {
  constructor(private router: Router,
    private authStoreUserService: AuthStoreUserService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return new Promise<boolean>((resolve, reject) => {
        let username = next.parent.paramMap.get('username');
        this.authStoreUserService.isAuthenticatedStoreByStoreUsername(username).subscribe(result => {
          if (!result['result']) {
            WsToastService.toastSubject.next({ content: 'Unauthorized to access store!', type: 'danger'});
            this.router.navigate(['stores']);
          }
          resolve(result['result']);
        }, err => {
          console.log(err);
          WsToastService.toastSubject.next({ content: 'Unauthorized to access store!', type: 'danger'});
          this.router.navigate(['stores']);
          resolve(false);
        });
    });   
  }
  
}
