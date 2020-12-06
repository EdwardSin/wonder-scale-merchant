import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UnitAnimation } from '@animations/unit.animation';
import { Constants } from '@constants/constants';
import { Role } from '@enum/Role.enum';
import { ContributorController } from '@objects/contributor.controller';
import { AuthStoreContributorService } from '@services/http/auth-store/contributor/auth-store-contributor.service';
import { CurrencyService } from '@services/http/general/currency.service';
import { StoreAuthorizationService } from '@services/http/general/store-authorization.service';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { SharedUserService } from '@services/shared/shared-user.service';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { PriceHelper } from '@helpers/pricehelper/price.helper';
import { ScreenHelper } from '@helpers/screenhelper/screen.helper';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import _ from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SharedNavbarService } from '@services/shared/shared-nav-bar.service';
import { ScreenService } from '@services/general/screen.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [UnitAnimation.slideDown(-200)]
})
export class MainComponent implements OnInit {

  isNavOpen: boolean;
  storeUsername: string;
  store;
  user;
  loading: WsLoading = new WsLoading;
  isAdminAuthorized: boolean;
  isMobileSize: boolean;
  contributorController: ContributorController = new ContributorController;
  unreplied_quotations = [];

  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private router: Router, private route: ActivatedRoute,
    private authStoreContributorService: AuthStoreContributorService,
    private currencyService: CurrencyService,
    private sharedStoreService: SharedStoreService,
    private sharedUserService: SharedUserService,
    private storeAuthorizationService: StoreAuthorizationService,
    private screenService: ScreenService,
    private sharedNavbarService: SharedNavbarService,
    private ref: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.storeUsername = this.route.snapshot.params['username'];
    this.isNavOpen = !ScreenHelper.isMobileSize();
    this.loading.start();
    this.router.events.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          if (this.isMobileSize) {
            this.isNavOpen = false;
            this.sharedNavbarService.isNavSubject.next(this.isNavOpen);
          }
        }
      })
    this.screenService.isMobileSize.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.isMobileSize = result;
      if (this.isMobileSize) {
        this.sharedNavbarService.isNavSubject.next(this.isNavOpen);
      }
    })
    this.sharedUserService.user.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          this.user = result;
        }
      })

    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          DocumentHelper.setWindowTitleWithWonderScale(result.name);
          this.store = result;
          this.sharedStoreService.store_id = this.store._id;
          this.sharedStoreService.store_name = this.store.name;
          this.sharedStoreService.storeUsername = this.store.username;
          this.storeUsername = this.store.username;
          this.refreshContributors();
        }
        this.loading.stop();
      })
    this.sharedStoreService.contributorRefresh.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          this.contributorController = result;
          this.isAdminAuthorizedRefresh(this.user._id);
        }
      })
    this.storeAuthorizationService.isAdminAuthorized.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.isAdminAuthorized = result;
    });
    this.sharedStoreService.refreshContributor.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          this.refreshContributors()
        }
      })
    this.sharedNavbarService.isNavSubject.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(res => {
      this.isNavOpen = res;
    });
    this.sharedStoreService.quotations.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      if (res) {
        this.unreplied_quotations = res;
      }
    })
    this.currencyService.currencyRate
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          PriceHelper.currencies = result;
          this.currencyService.selectedCurrency
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(result => {
              if (result) {
                PriceHelper.currencySymbols = Constants.currencySymbols;
                PriceHelper.targetCurrency = result;
                PriceHelper.rate = PriceHelper.currencies[PriceHelper.targetCurrency];
                PriceHelper.symbol = PriceHelper.currencySymbols[PriceHelper.targetCurrency];
                this.ref.detectChanges();
              }
            });
          this.ref.detectChanges();
        }
      });
  }
  refreshContributors() {
    this.authStoreContributorService.getContributors().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.contributorController.existsContributors = result['result'];
        this.sharedStoreService.contributorRefresh.next(this.contributorController);
      })
  }
  isAdminAuthorizedRefresh(userId: string) {
    let isAdminAuthorized = this.contributorController.existsContributors.some(x => x.user == userId && x.role == Role.Admin);
    this.storeAuthorizationService.isAdminAuthorized.next(isAdminAuthorized);
  }
  // getUnrepliedRequests() {
  //   this.authRequestContributorService.getUnrepliedRequests().pipe(takeUntil(this.ngUnsubscribe))
  //     .subscribe(results => {
  //       this.sharedStoreService.quotations.next(results);
  //     })
  // }
  isNavOpenChange(event){
    this.isNavOpen = event;
    this.sharedNavbarService.isNavSubject.next(event);
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.storeAuthorizationService.isAdminAuthorized.next(false);
  }
}
