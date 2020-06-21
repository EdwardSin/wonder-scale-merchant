import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UnitAnimation } from '@animations/unit.animation';
import { environment } from '@environments/environment';
import { Item } from '@objects/item';
import { Searchbar } from '@objects/searchbar';
import { Tag } from '@objects/tag';
import { AuthCategoryContributorService } from '@services/http/auth-shop/contributor/auth-category-contributor.service';
import { AuthItemContributorService } from '@services/http/auth-shop/contributor/auth-item-contributor.service';
import { AuthShopContributorService } from '@services/http/auth-shop/contributor/auth-shop-contributor.service';
import { SharedCategoryService } from '@services/shared/shared-category.service';
import { SharedItemService } from '@services/shared/shared-item.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { ArrayHelper } from '@helpers/arrayhelper/array.helper';
import { ScreenHelper } from '@helpers/screenhelper/screen.helper';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import _ from 'lodash';
import * as moment from 'moment';
import { forkJoin as observableForkJoin, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { ScreenService } from '@services/general/screen.service';

@Component({
  selector: 'item-controller',
  templateUrl: './item-controller.component.html',
  styleUrls: ['./item-controller.component.scss'],
  animations: [UnitAnimation.slideDown(-50)]
})
export class ItemControllerComponent implements OnInit {
  allItems: Item[] = [];
  displayItems: Item[] = [];
  editItems: Item[] = [];
  searchItems: Item[] = [];

  shop;
  param = '';
  categoryName = '';
  categoryList: Array<any> = [];
  selectedCategory = '';
  isAdvertised: boolean;
  categoriesLoading: WsLoading = new WsLoading;
  loading: WsLoading = new WsLoading;
  environment = environment;

  searchController: Searchbar = new Searchbar;
  tag: Tag = new Tag();
  categories = [];
  message = '';
  editCategory = {};
  editCategoryList: Array<any> = [];
  displayCategoryList: Array<any> = [];
  info_message: string = '';
  isMobileSize: boolean;
  isRemoveAllSelectedItemModalConfirmationOpened: boolean;
  isAddToCategoriesModalOpened: boolean;
  isMoveToCategoriesModalOpened: boolean;
  isEditMultipleItemsModalOpened: boolean;
  isImportItemsModalOpened: boolean;
  moment = moment;
  columns = [];
  previousEditedItems: Array<any> = [];
  isAdvertiseDropdownOpened: boolean;
  action: Function;

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private authShopContributorService: AuthShopContributorService,
    private sharedCategoryService: SharedCategoryService,
    private sharedShopService: SharedShopService,
    private sharedItemService: SharedItemService,
    private authItemContributorService: AuthItemContributorService,
    private authCategoryContributorService: AuthCategoryContributorService,
    private router: Router,
    private screenService: ScreenService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.param = this.route.snapshot['url'] && this.route.snapshot['url'][0] && this.route.snapshot['url'][0]['path'];
    this.searchController.order = this.route.snapshot.queryParams['order'];
    this.searchController.orderBy = this.route.snapshot.queryParams['by'];
    this.searchController.display = this.route.snapshot.queryParams['display'];
    this.searchController.searchKeyword = this.route.snapshot['queryParams']['s_keyword'];
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(queryParams => {
      this.searchController.searchKeyword = queryParams['s_keyword'];
    })
    this.sharedShopService.shop.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          this.shop = result;
          this.getPublishedInfo();
        }
    });
    this.sharedItemService.editItems.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      if (res) {
        this.editItems = res;
      }
    })
    this.sharedItemService.displayItems.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      if (res) {
        this.displayItems = res;
        if(!this.displayItems.length) {
          _.delay(() => {
            this.router.navigate([], {queryParams: {page: 1}, queryParamsHandling: 'merge'});
          }, 500);
        }
      }
    })
    this.screenService.isMobileSize.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.isMobileSize = result;
    })
    this.sharedCategoryService.categories.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        if (res) {
          this.categories = res;
        }
    })
    this.sharedItemService.shownColumns.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.columns = result;
      this.ref.detectChanges();
    })
  }
  publishItems() {
    var editItems = this.editItems;
    this.previousEditedItems = _.clone(editItems);
    if (editItems.length) {
      this.authItemContributorService.publishItems(editItems)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          this.sharedCategoryService.refreshCategories(() => {
            WsToastService.toastSubject.next({ content: "Items have been published!", type: 'success' });
          }, false)
        }, (err) => {
          WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
        });
    }
  }
  unpublishItems() {
    var editItems = this.editItems;
    this.previousEditedItems = _.clone(editItems);
    if (editItems.length) {
      this.authItemContributorService.unpublishItems(editItems)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(results => {
          this.sharedCategoryService.refreshCategories(() => {
            WsToastService.toastSubject.next({ content: "Items have been unpublished!", type: 'success' });
          }, false)
        }, (err) => {
          WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
        });
    }
  }
  updateMessage() {
    this.authShopContributorService
      .updateNewItemMessage({message: this.message})
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.shop.new.message = this.message;
        this.sharedShopService.shop.next(this.shop);
        this.isAdvertiseDropdownOpened = false;
        WsToastService.toastSubject.next({ content: "Message is updated!", type: 'success' });
      });
  }
  advertiseItems() {
    var publishedDate = this.getPublishedDate(this.shop);
    if (!this.isPublishedFunc(publishedDate)) {
      var obj = {
        message: this.message
      };
      this.authShopContributorService
        .advertiseItems(obj)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          WsToastService.toastSubject.next({ content: "New items are advertised and notify your customers!", type: 'success' });
          this.isAdvertised = true;
          this.shop.new = result['data'];
          this.isAdvertiseDropdownOpened = false;
          this.sharedShopService.shop.next(this.shop);
        }, err => {
          WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
        });
    } else {
      WsToastService.toastSubject.next({
        content: 'Shop has been published today. Try it tomorrow.', type: 'danger'
      });
    }
  }
  // openMultipleEditModal() {
  //   this.action = this.editMultipleItems.bind(this);
  // }
  openAddToModal() {
    this.getCategoriesByShopId();
    this.isAddToCategoriesModalOpened = true;
    this.action = this.onAddItemToCategory.bind(this, this.editItems);
  }
  openMoveModal() {
    this.getCategoriesByShopId();
    this.isMoveToCategoriesModalOpened = true;
    this.action = this.onMoveCategory.bind(this, this.editItems);
  }
  openRemoveModal() {
    this.action = this.param == 'uncategorized' ? this.removeItemsPermanantly.bind(this) : this.removeItemsFromCategory.bind(this);
    this.isRemoveAllSelectedItemModalConfirmationOpened = true;
  }
  checkSelectedItems() {
    if (!this.editItems.length) {
      WsToastService.toastSubject.next({ content: 'Please select items!', type: 'danger'})
    }
  }
  markAsNew() {
    this.previousEditedItems = [...this.editItems];
    this.authItemContributorService.markAsNew(this.editItems)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(results => {
        this.sharedCategoryService.refreshCategories(() => {
          WsToastService.toastSubject.next({ content: "Mark as new!", type: 'success' });
        })
      }, (err) => {
        WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
      });
  }
  unmarkNew() {
    this.previousEditedItems = [...this.editItems];
    this.authItemContributorService.unmarkNew(this.editItems)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(results => {
        this.sharedCategoryService.refreshCategories(() => {
          WsToastService.toastSubject.next({ content: "Unmark from new!", type: 'success' });
        })
      }, (err) => {
        WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
      });
  }
  markAsTodaySpecial() {
    this.previousEditedItems = [...this.editItems];
    this.authItemContributorService.markAsTodaySpecial(this.editItems)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(results => {
        this.sharedCategoryService.refreshCategories(() => {
          WsToastService.toastSubject.next({ content: "Mark as today special!", type: 'success' });
        })
      }, (err) => {
        WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
      });
  }
  unmarkTodaySpecial() {
    this.previousEditedItems = [...this.editItems];
    this.authItemContributorService.unmarkTodaySpecial(this.editItems)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(results => {
        this.sharedCategoryService.refreshCategories(() => {
          WsToastService.toastSubject.next({ content: "Unmark from today special!", type: 'success' });
        })
      }, (err) => {
        WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
      });
  }
  markAsOffer() {
    this.previousEditedItems = [...this.editItems];
    this.authItemContributorService.markAsOffer(this.editItems)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(results => {
        let items = this.editItems.filter(item => !item.discount);
        this.sharedCategoryService.refreshCategories(() => {
          WsToastService.toastSubject.next({ content: "Mark as discount!", type: 'success' });
          if (items.length > 1) {
            WsToastService.toastSubject.next({ content: items.length + " items don't have discount value!", type: 'warning' });
          } else if (items.length == 1) {
            WsToastService.toastSubject.next({ content: "Item doesn't have discount value!", type: 'warning' });
          }
        })
      }, (err) => {
        WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
      });
  }
  unmarkOffer() {
    this.previousEditedItems = [...this.editItems];
    this.authItemContributorService.unmarkOffer(this.editItems)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(results => {
        this.sharedCategoryService.refreshCategories(() => {
          WsToastService.toastSubject.next({ content: "Unmark from offer!", type: 'success' });
        })
      }, (err) => {
        WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
      });
  }
  onAddItemToCategory() {
    this.previousEditedItems = [...this.editItems];
    var editCategoryList = this.editCategoryList;
    this.loading.start();
    var itemAndCategoryList = {
      edit_item_list: this.previousEditedItems.map(x => x['_id']),
      edit_category_list: editCategoryList.map(x => x['_id'])
    };

    this.authCategoryContributorService
      .addItemsToCategory(itemAndCategoryList)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.sharedCategoryService.refreshCategories(() => {
          WsToastService.toastSubject.next({ content: "Added to category!", type: 'success' });
          this.deselectCategories();
          this.isAddToCategoriesModalOpened = false;
          this.loading.stop()
        })
      });
  }
  triggerColumns(value) {
    if (this.columns.includes(value)) {
      this.columns = this.columns.filter(x => x != value);
    } else {
      this.columns.push(value);
    }
    sessionStorage.setItem('shownColumns', JSON.stringify(this.columns));
    this.sharedItemService.shownColumns.next(this.columns);
  }
  // getSearchItems(event) {
  //   this.sharedItemService.displayItems.next(event);
  // }
  onMoveCategory(editItems) {
    var editCategory = this.editCategory;
    this.loading.start();
    var itemAndCategoryList = {
      moveFromCategoryId: this.selectedCategory['_id'],
      moveToCategoryId: editCategory['_id'],
      items: editItems.map(x => x._id)
    };

    this.authCategoryContributorService
      .moveCategory(itemAndCategoryList)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.sharedCategoryService.refreshCategories(() => {
          this.deselectCategories();
          this.isMoveToCategoriesModalOpened = false;
          this.loading.stop();
          WsToastService.toastSubject.next({ content: "Moved to category!", type: 'success' });
        })
      }, (err) => {
        WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
      });
  }

  editMultipleItems(form) {
    var editItems = this.editItems;
    this.previousEditedItems = _.clone(editItems);
    var obj = {
      request: {}
    };
    this.loading.start();
    obj['editItemList'] = editItems.map(x => x['_id']);
    if (form.value.edit_displayed_discount) {
      obj['request']['$set'] = {
        isOffer: form.value.item_check || false
      };
      editItems.forEach(x => {
        x['isOffer'] = obj['request']['$set']['isOffer'];
      });
    }
    if (form.value.edit_discount) {
      obj['request']['$set'] = Object.assign({}, obj['request']['$set'], {
        discount: form.value.discount || 0
      });
      editItems.forEach(x => {
        x['discount'] = obj['request']['$set']['discount'];
      });
    }
    if (form.value.edit_tag) {
      obj['request']['$pushAll'] = { tags: this.tag.tags || [] };
      editItems.forEach(x => {
        (x['tags'] || []).push(obj['request']['$pushAll']['tags']);
      });
    }

    if (form.value.edit_displayed_discount || form.value.edit_discount || form.value.edit_tag) {
      this.authItemContributorService
        .editMultipleItems(obj)
        .pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop()))
        .subscribe(result => {
          ArrayHelper.clear(this.tag.tags);
          this.sharedCategoryService.refreshCategories(() => {
            WsToastService.toastSubject.next({ content: "Items are edited!", type: 'success' });
          })
        }, (err) => {
          WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
        });
    }
  }
  removeItemsFromCategory() {
    var editItems = this.editItems;
    this.previousEditedItems = [];
    this.loading.start();
    let categoryName = this.route.snapshot.params['name'];
    let selectedCategory = this.categories.find(x => x.name === categoryName);
    observableForkJoin(editItems.map(item => {
      return this.authCategoryContributorService.removeItemsFromCategory({
        items: editItems.map(x => x['_id']),
        categories: selectedCategory ? [selectedCategory['_id']] : item.categories ? item.categories : []
      })
    }))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(results => {
        this.sharedCategoryService.refreshCategories(() => {
          WsToastService.toastSubject.next({ content: "Items have been removed from category!", type: 'success' });
          this.isRemoveAllSelectedItemModalConfirmationOpened = false;
          this.loading.stop();
        })
      }, (err) => {
        WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
      });
  }
  removeItemsPermanantly() {
    var editItems = this.editItems;
    this.previousEditedItems = [];
    this.loading.start();
    this.authItemContributorService.removeItemsPermanantly({
      items: editItems.map(x => x['_id'])
    })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.sharedCategoryService.refreshCategories(() => {
          WsToastService.toastSubject.next({ content: "Removed from category!", type: 'success' });
          this.isRemoveAllSelectedItemModalConfirmationOpened = false;
          this.loading.stop();
        })
      }, (err) => {
        WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
      });
  }
  getCategoriesByShopId() {
    this.categoryName = this.route.snapshot.params['name'];
    this.categoriesLoading.start();
    this.authCategoryContributorService.getAuthenticatedCategoriesByShopId()
      .pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.categoriesLoading.stop()))
      .subscribe(result => {
        var categoryList = result['result'];
        this.categoryList = result['result'];
        this.selectedCategory = this.categoryList.find(x => x.name === this.categoryName);
        this.displayCategoryList = this.getOtherCategoryByName(categoryList, this.categoryName);
      })
  }
  getOtherCategoryByName(categoryList, name) {
    return categoryList.filter(x => x['name'] !== name);
  }
  isCategoryInCategoryList(category) {
    var editCategoryList = this.editCategoryList;
    return _.includes(editCategoryList, category);
  }
  isOrder(order) {
    return this.searchController.order === order;
  }
  isDisplay(display) {
    return this.searchController.display === display;
  }
  setOrder(myorder) {
    this.searchController.order = myorder;
  }
  setDisplay(display) {
    this.searchController.display = display;
    this.navigateTo(
      this.searchController.order,
      this.searchController.orderBy,
      this.searchController.display
    );
  }
  setOrderAndSwitchAscending(myorder, orderBy?) {
    if (this.searchController.order === myorder && myorder != 'price_high_to_low' && myorder != 'price_low_to_high') {
      this.searchController.orderBy =
        orderBy || this.searchController.orderBy === 'desc' ? 'asc' : 'desc';
    } else {
      this.setOrder(myorder);
    }
    this.navigateTo(
      this.searchController.order,
      this.searchController.orderBy,
      this.searchController.display
    );
  }
  deselectCategories() {
    ArrayHelper.clear(this.editCategoryList);
  }
  selectPrevious() {
    this.sharedItemService.editItems.next(this.previousEditedItems);
  }
  selectAll() {
    this.sharedItemService.editItems.next(this.allItems);
  }
  deselectAll() {
    this.sharedItemService.editItems.next([]);
  }
  navigateTo(order, orderBy, display) {
    //alphabet
    this.router.navigate([], {
      queryParams: { order: order, by: orderBy, display: display },
      queryParamsHandling: 'merge'
    });
  }
  getPublishedInfo() {
    let publishedDate = this.getPublishedDate(this.shop);
    this.isAdvertised = this.isPublishedFunc(publishedDate);
    if (this.shop && this.shop.new) {
      this.message = this.shop.new.message;
    }
  }
  // Tested
  getPublishedDate(shop) {
    var returnDate;
    if (shop && shop.new && shop.new.publishedAt) {
      returnDate = new Date(shop.new.publishedAt);
    } else {
      returnDate = this.getYesterdayDate(new Date()).toDate();
    }
    return returnDate;
  }

  // Tested
  getYesterdayDate(date) {
    return moment(date).add(-1, 'days');
  }
  // Tested
  isPublishedFunc(publishedDate) {
    var publishedAt = this.getDate(publishedDate);
    return this.isDateToday(publishedAt);
  }
  // Tested
  isDateToday(compareDate) {
    var today = new Date();
    var todayDate = this.getDate(today);
    return compareDate === todayDate;
  }
  // Tested
  getDate(date: Date) {
    return (
      '' +
      date.getDate() +
      '-' +
      (date.getMonth() + 1) +
      '-' +
      date.getFullYear()
    );
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
