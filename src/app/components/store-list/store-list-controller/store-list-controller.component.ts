import { ChangeDetectorRef, Component, OnInit, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedLoadingService } from '@services/shared/shared-loading.service';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { Subject, interval, combineLatest, timer } from 'rxjs';
import { takeUntil, switchMap, map } from 'rxjs/operators';
import { AuthStoreUserService } from '@services/http/auth-user/auth-store-user.service';
import { SharedUserService } from '@services/shared/shared-user.service';

@Component({
  selector: 'store-list-controller',
  templateUrl: './store-list-controller.component.html',
  styleUrls: ['./store-list-controller.component.scss']
})
export class StoreListControllerComponent implements OnInit {

  private ngUnsubscribe: Subject<any> = new Subject;
  user;
  activeStoreList: Array<any> = [];
  pendingStoreList: Array<any> = [];
  REFREASH_PENDING_STORE_INTERVAL = 2 * 60 * 1000;
  loading: WsLoading = new WsLoading;

  constructor(
    private route: ActivatedRoute,
    private viewContainerRef: ViewContainerRef,
    private cfr: ComponentFactoryResolver,
    private authStoreUserService: AuthStoreUserService,
    private sharedLoadingService: SharedLoadingService,
    private ref: ChangeDetectorRef,
    private sharedUserService: SharedUserService,
    private sharedStoreService: SharedStoreService) { }

  ngOnInit() {
    this.sharedLoadingService.loading.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        result ? this.loading.start() : this.loading.stop();
        this.ref.detectChanges();
      })
    this.sharedStoreService.refresh.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      if (result) {
        this.getPendingStores();
      }
    });
    this.sharedUserService.user.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      if (result) {
        this.user = result;
        this.getPendingStores();
      }
    })
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(queryParams => {
        if (queryParams['modal']) {
          if (queryParams['modal'] == 'new-store') {
            this.createLazyNewStoreComponent();
          }
        } else {
          this.viewContainerRef.clear();
        }
      });
    this.intervalGetPendingStores();
  }
  getPendingStores() {
    this.sharedLoadingService.loading.next(this.loading.isRunning());
    combineLatest(timer(500),
    this.authStoreUserService.getInvitationStoresByUserId())
    .pipe(
      map(x => x[1]),
      takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.pendingStoreList = result['result'];
        this.pendingStoreList.forEach(store => {
          store.currentContributor = this.authStoreUserService.getContributorRole(store, this.user);
        })
        this.sharedStoreService.pendingStoreList.next(this.pendingStoreList);
        this.loading.stop();
        this.sharedLoadingService.loading.next(this.loading.isRunning());
      })
  }
  async createLazyNewStoreComponent() {
    this.viewContainerRef.clear();
    await import ('../../../modules/create-store/create-store.module');
    const { CreateStoreComponent } = await import('@components/store/create-store/create-store.component');
    this.viewContainerRef.createComponent(this.cfr.resolveComponentFactory(CreateStoreComponent));
  }
  intervalGetPendingStores() {
    interval(this.REFREASH_PENDING_STORE_INTERVAL).pipe(switchMap(() => {return this.authStoreUserService.getInvitationStoresByUserId()}),
    takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      this.pendingStoreList = result['result'];
        this.pendingStoreList.forEach(store => {
          store.currentContributor = this.authStoreUserService.getContributorRole(store, this.user);
        })
    });
  }
  refresh() {
    this.loading.start();
    this.sharedStoreService.refresh.next(true);
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
