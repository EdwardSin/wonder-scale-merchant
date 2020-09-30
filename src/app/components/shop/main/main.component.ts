import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UnitAnimation } from '@animations/unit.animation';
import { Constants } from '@constants/constants';
import { Role } from '@enum/Role.enum';
import { environment } from '@environments/environment';
import { ContributorController } from '@objects/contributor.controller';
import { AuthCategoryContributorService } from '@services/http/auth-shop/contributor/auth-category-contributor.service';
import { AuthShopContributorService } from '@services/http/auth-shop/contributor/auth-shop-contributor.service';
import { CurrencyService } from '@services/http/general/currency.service';
import { RoutePartsService } from '@services/general/route-parts.service';
import { ShopAuthorizationService } from '@services/http/general/shop-authorization.service';
import { UserService } from '@services/http/general/user.service';
import { SharedCategoryService } from '@services/shared/shared-category.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { SharedUserService } from '@services/shared/shared-user.service';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { PriceHelper } from '@helpers/pricehelper/price.helper';
import { ScreenHelper } from '@helpers/screenhelper/screen.helper';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import _ from 'lodash';
import { Subject, BehaviorSubject, interval, of } from 'rxjs';
import { takeUntil, switchMap, finalize } from 'rxjs/operators';
import { SharedLoadingService } from '../../../services/shared/shared-loading.service';
import { Shop } from '@objects/shop';
import { SharedItemService } from '@services/shared/shared-item.service';
import { SharedNavbarService } from '@services/shared/shared-nav-bar.service';
import * as moment from 'moment';
import { AuthShopUserService } from '@services/http/auth-user/auth-shop-user.service';
import { ScreenService } from '@services/general/screen.service';
import { AuthPackageAdminService } from '@services/http/auth-shop/admin/auth-package-admin.service';
import { SharedPackageService } from '@services/shared/shared-package.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [UnitAnimation.slideDown(-200)]
})
export class MainComponent implements OnInit {

  isNavOpen: boolean;
  shop_username: string;
  shop;
  user;
  numberOfAllItems: number = 0;
  numberOfDiscountItems: number = 0;
  numberOfNewItems: number = 0;
  numberOfTodaySpecialItems: number = 0;
  numberOfPublishedItems: number = 0;
  numberOfUnpublishedItems: number = 0;
  numberOfUncategorizedItems: number = 0;
  loading: WsLoading = new WsLoading;
  removeLoading: WsLoading = new WsLoading;
  displayPreview: boolean;
  isRemoveCategoryConfirmationModalOpened: boolean;
  categories: Array<any> = [];
  displayCategories: Array<any> = [];

  category_name: string;
  search_keyword: string = '';
  isAdminAuthorized: boolean;
  selectedCategory;
  new_name: string = '';
  editname: string;
  edit_new_name: string = '';
  categoryDropdown: boolean;
  isMobileSize: boolean;
  routeParts = [];
  environment = environment;
  contributorController: ContributorController = new ContributorController;

  btnSelectedItemList = [];
  unreplied_quotations = [];
  isServiceExpired: boolean = true;

  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private router: Router, private route: ActivatedRoute,
    private authShopContributorService: AuthShopContributorService,
    private authCategoryContributorService: AuthCategoryContributorService,
    private currencyService: CurrencyService,
    private sharedCategoryService: SharedCategoryService,
    private sharedShopService: SharedShopService,
    private sharedUserService: SharedUserService,
    private routePartsService: RoutePartsService,
    private shopAuthorizationService: ShopAuthorizationService,
    private authPackageAdminService: AuthPackageAdminService,
    private sharedPackageService: SharedPackageService,
    private activeRoute: ActivatedRoute,
    private screenService: ScreenService,
    private sharedNavbarService: SharedNavbarService,
    private ref: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.shop_username = this.route.snapshot.params['username'];
    this.isNavOpen = !ScreenHelper.isMobileSize();
    this.router.events.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          if (this.isMobileSize) {
            this.isNavOpen = false;
            this.sharedNavbarService.isNavSubject.next(this.isNavOpen);
          }
          this.routeParts = this.routePartsService.generateRouteParts(this.activeRoute.snapshot);
          if (this.routeParts[1]['title'] == 'cat') {
            this.category_name = RoutePartsService.parseText(this.routeParts[0]);
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

    this.sharedShopService.shop.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          DocumentHelper.setWindowTitleWithWonderScale(result.name);
          this.shop = result;
          this.sharedShopService.shop_id = this.shop._id;
          this.sharedShopService.shop_name = this.shop.name;
          this.sharedShopService.shop_username = this.shop.username;
          this.numberOfAllItems = this.shop.number_of_all_items;
          this.numberOfDiscountItems = this.shop.number_of_discount_items;
          this.numberOfNewItems = this.shop.number_of_new_items;
          this.numberOfTodaySpecialItems = this.shop.number_of_today_special_items;
          this.numberOfPublishedItems = this.shop.number_of_published_items;
          this.numberOfUnpublishedItems = this.shop.number_of_unpublished_items;
          this.numberOfUncategorizedItems = this.shop.number_of_uncategorized_items;
          this.shop_username = this.shop.username;
          this.refreshContributors();
          // this.getUnrepliedRequests();
          this.refreshCategories();
          this.sharedPackageService.subscribingPackage.next(result._package);
        if (result._package) {
          this.isServiceExpired = new Date(result._package.expiryDate) < new Date;
        }
        }
      })
    this.sharedCategoryService.numberOfAllItems.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.numberOfAllItems = res;
      })
    this.sharedCategoryService.numberOfDiscountItems.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.numberOfDiscountItems = res;
      })
    this.sharedCategoryService.numberOfNewItems.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.numberOfNewItems = res;
      })
    this.sharedCategoryService.numberOfTodaySpecialItems.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.numberOfTodaySpecialItems = res;
      })
    this.sharedCategoryService.numberOfPublishedItems.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.numberOfPublishedItems = res;
      })
    this.sharedCategoryService.numberOfUnpublishedItems.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.numberOfUnpublishedItems = res;
      })
    this.sharedCategoryService.numberOfUncategorizedItems.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.numberOfUncategorizedItems = res;
      })
    this.sharedShopService.contributorRefresh.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          this.contributorController = result;
          this.isAdminAuthorizedRefresh(this.user._id);
        }
      })
    this.shopAuthorizationService.isAdminAuthorized.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.isAdminAuthorized = result;
    });
    this.sharedShopService.refreshContributor.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          this.refreshContributors()
        }
      })

    this.sharedCategoryService.categories.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        if (res) {
          this.categories = res;
        }
      })
    this.sharedNavbarService.isNavSubject.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(res => {
      this.isNavOpen = res;
    });
    this.sharedShopService.quotations.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
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
  getContributors() {
    if (this.shop) {
      this.contributorController.existsContributors = this.shop.contributors;
      this.sharedShopService.contributorRefresh.next(this.contributorController);
    }
  }
  refreshContributors() {
    this.authShopContributorService.getContributors().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.contributorController.existsContributors = result['result'];
        this.sharedShopService.contributorRefresh.next(this.contributorController);
      })
  }
  isAdminAuthorizedRefresh(userId: string) {
    let isAdminAuthorized = this.contributorController.existsContributors.some(x => x.user == userId && x.role == Role.Admin);
    this.shopAuthorizationService.isAdminAuthorized.next(isAdminAuthorized);
  }
  addCategory() {
    if (this.isValidated(this.new_name)) {
      let obj = {
        name: this.new_name
      };
      this.authCategoryContributorService
        .addCategory(obj)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          WsToastService.toastSubject.next({ content: 'Category is added!', type: 'success' });
          this.new_name = '';
          result['result'].items = [];
          this.categories.push(result['result']);
        }, (err) => {
          WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
        });
    }
  }
  editCategory(category) {
    if (this.isValidated(this.edit_new_name)) {
      let category_id = category['_id'];
      var obj = {
        category_id,
        name: this.edit_new_name || category['name']
      };
      this.authCategoryContributorService
        .editCategory(obj)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          WsToastService.toastSubject.next({ content: 'Category is edited!', type: 'success' });
          if (this.category_name === this.editname) {
            this.router.navigate(['catalogue', 'custom', obj.name], {relativeTo: this.route});
          }
          category['name'] = this.edit_new_name;
          this.setEditCategory('');
        }, (err) => {
          WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
        });
    }
  }
  removeCategory() {
    this.removeLoading.start();
    this.authCategoryContributorService
      .removeCategories({categories: [this.selectedCategory['_id']]})
      .pipe(takeUntil(this.ngUnsubscribe), finalize(() => {this.removeLoading.stop()}))
      .subscribe(result => {
        WsToastService.toastSubject.next({ content: "Category is removed!", type: 'success' });
        _.remove(this.categories, (x) => this.selectedCategory['_id'] === x._id);
        if (this.selectedCategory.name === this.category_name) {
          this.router.navigate(['catalogue', 'all'], {relativeTo: this.route});
        }
        this.isRemoveCategoryConfirmationModalOpened = false;
        this.sharedCategoryService.refreshCategories(null, false, true);
      }, (err) => {
        WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
      });
  }
  openRemoveModal(category) {
    this.selectedCategory = category;
    this.isRemoveCategoryConfirmationModalOpened = true;
  }
  setEditCategory(name) {
    this.editname = name;
    this.edit_new_name = name;
    this.ref.detectChanges();
  }
  isEditCategory(name) {
    return this.editname == name;
  }
  isValidated(name) {
    if (name == '' || name.trim() == '') {
      WsToastService.toastSubject.next({ content: 'Category name is invalid!', type: 'danger' });
      return false;
    } else if (name.length > 30) {
      WsToastService.toastSubject.next({ content: 'Category name is too long!', type: 'danger' });
      return false;
    }
    return true;
  }

  refreshCategories() {
    this.sharedCategoryService.refreshCategories(null, false, false);
  }
  // getUnrepliedRequests() {
  //   this.authRequestContributorService.getUnrepliedRequests().pipe(takeUntil(this.ngUnsubscribe))
  //     .subscribe(results => {
  //       this.sharedShopService.quotations.next(results);
  //     })
  // }
  dropOrder(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.categories, event.previousIndex, event.currentIndex);
    this.authCategoryContributorService
      .rearrangeCategories({ categories: this.categories.map(x => x._id) })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
      });
  }
  isNavOpenChange(event){
    this.isNavOpen = event;
    this.sharedNavbarService.isNavSubject.next(event);
  }
  isLinkActive(url): boolean {
    const queryParamsIndex = this.router.url.indexOf('?');
    const baseUrl = queryParamsIndex === -1 ? this.router.url : this.router.url.slice(0, queryParamsIndex);
    return decodeURIComponent(baseUrl) === url;
 }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
