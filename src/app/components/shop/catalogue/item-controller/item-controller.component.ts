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
import { WsLoading } from '@components/elements/ws-loading/ws-loading';
import { ArrayHelper } from '@helpers/arrayhelper/array.helper';
import { ScreenHelper } from '@helpers/screenhelper/screen.helper';
import { WsModalService } from '@components/elements/ws-modal/ws-modal.service';
import { WsToastService } from '@components/elements/ws-toast/ws-toast.service';
import _ from 'lodash';
import * as moment from 'moment';
import { forkJoin as observableForkJoin, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

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
  shop_username = '';
  category_name = '';
  categoryList: Array<any> = [];
  selectedCategory = '';
  is_publish: boolean;
  loading: WsLoading = new WsLoading;
  environment = environment;

  searchController: Searchbar = new Searchbar;
  tag: Tag = new Tag();

  message = '';
  editCategory = {};
  editCategoryList: Array<any> = [];
  displayCategoryList: Array<any> = [];

  btnSelectedItemList: Array<any> = [];
  info_message: string = '';
  isMobileSize: boolean;
  previousEditedItems: Array<any> = [];
  action: Function;

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private modalService: WsModalService,
    private authShopContributorService: AuthShopContributorService,
    private sharedCategoryService: SharedCategoryService,
    private sharedShopService: SharedShopService,
    private sharedItemService: SharedItemService,
    private authItemContributorService: AuthItemContributorService,
    private authCategoryContributorService: AuthCategoryContributorService,
    private router: Router,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.param = this.route.snapshot['url'] && this.route.snapshot['url'][0] && this.route.snapshot['url'][0]['path'];
    this.searchController.order = this.route.snapshot.queryParams['order'];
    this.searchController.orderBy = this.route.snapshot.queryParams['by'];
    this.searchController.display = this.route.snapshot.queryParams['display'];
    this.shop_username = this.route.snapshot.params['username'];
    this.category_name = this.route.snapshot.params['name'];
    this.getPublishInfo();

    this.sharedItemService.allItems.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      if (res) {
        this.allItems = res;
      }
    })
    this.sharedItemService.editItems.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      if (res) {
        this.editItems = res;
      }
    })
    this.sharedItemService.displayItems.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      if (res) {
        this.displayItems = res;
      }
    })
    this.btnSelectedItemList = [
      {
        spanClass: 'fa-bullhorn',
        title: 'Publish',
        trigger: () => {
          return this.activateItems();
        },
        displayed: true
      },
      {
        spanClass: 'fa-unbullhorn',
        title: 'Unpublish',
        trigger: () => {
          return this.inactivateItems();
        },
        displayed: true
      },
      {
        spanClass: 'fa-tags',
        title: 'Mark as New',
        trigger: () => {
          return this.markAsNew();
        },
        displayed: this.param != 'new'
      },
      {
        spanClass: 'fa-untags',
        title: 'Unmark from New',
        trigger: () => {
          return this.unmarkNew();
        },
        displayed: true
      },
      {
        spanClass: 'fa-edit',
        title: 'Edit Multiple Items',
        trigger: () => {
          this.action = this.editMultipleItems.bind(this);
          return this.openModal('editMultipleItemsModal');
        },
        displayed: true
      },
      {
        spanClass: 'fa-plus-square',
        title: 'Add To',
        trigger: () => {
          this.getCategoryByShopId();
          this.action = this.onAddItemToCategory.bind(this, this.editItems);
          this.openModal('addToCategoriesModal');
        },
        displayed: true
      },
      {
        spanClass: 'fa-arrows-alt',
        title: 'Move To',
        trigger: () => {
          this.getCategoryByShopId();
          this.action = this.onMoveCategory.bind(this, this.editItems);
          this.openModal('moveToCategoriesModal');
        },
        displayed: this.param == 'custom'
      },
      {
        spanClass: 'fa-trash',
        title: 'Remove',
        trigger: () => {
          this.action = this.param == 'uncategoried' ? this.removeItemsPermanantly.bind(this) : this.removeItemsFromCategory.bind(this);
          this.openModal('removeItemsModal');
        },
        displayed: true
      }
    ];
    this.isMobileSize = ScreenHelper.isMobileSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobileSize = ScreenHelper.isMobileSize();
  }
  activateItems() {
    var editItems = this.editItems;
    this.previousEditedItems = _.clone(editItems);
    if (editItems.length) {
      this.authItemContributorService.activateItems(editItems)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          this.refreshCategories(() => {
            WsToastService.toastSubject.next({ content: "Items have been activated!", type: 'success' });
          })
        }, (err) => {
          WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
        });
    }
  }
  inactivateItems() {
    var editItems = this.editItems;
    this.previousEditedItems = _.clone(editItems);
    if (editItems.length) {
      this.authItemContributorService.inactivateItems(editItems)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(results => {
          this.refreshCategories(() => {
            WsToastService.toastSubject.next({ content: "Items have been inactivated!", type: 'success' });
          })
        }, (err) => {
          WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
        });
    }
  }

  changeMessage() {
    this.authShopContributorService
      .changeNewItemMessage(this.message)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.shop.new.message = this.message;
        this.sharedShopService.shop.next(this.shop);
        WsToastService.toastSubject.next({ content: "Message is updated!", type: 'success' });
      });
  }
  advertiseItems() {
    var publishDate = this.getPublishDate(this.shop);
    if (!this.isPublish(publishDate)) {
      var obj = {
        message: this.message,
        items: this.displayItems.map(x => x['_id'])
      };
      this.authShopContributorService
        .advertiseItems(obj)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          WsToastService.toastSubject.next({ content: "Shop is advertised!", type: 'success' });
          this.is_publish = true;
          this.shop.new = result['new'];
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
  markAsNew() {
    this.previousEditedItems = [...this.editItems];
    this.authItemContributorService.markAsNew(this.editItems)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(results => {
        this.refreshCategories(() => {
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
        this.refreshCategories(() => {
          WsToastService.toastSubject.next({ content: "Unmark from new!", type: 'success' });
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
      edit_item_list: this.editCategoryList.map(x => x['_id']),
      edit_category_list: editCategoryList.map(x => x['_id'])
    };

    this.authCategoryContributorService
      .addItemsToCategory(itemAndCategoryList)
      .pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop()))
      .subscribe(result => {

        this.refreshCategories(() => {
          this.deselectCategories();
          this.closeModal('addToCategoriesModal');
          WsToastService.toastSubject.next({ content: "Added to category!", type: 'success' });
        })
      });
  }
  getSearchItems(event) {
    this.sharedItemService.displayItems.next(event);
  }
  onMoveCategory(editItems) {
    var editCategory = this.editCategory;
    this.loading.start();
    var itemAndCategoryList = {
      move_to_category_id: editCategory['_id'],
      item_list: editItems.map(x => x._id)
    };

    this.authCategoryContributorService
      .moveCategory(this.selectedCategory['_id'], itemAndCategoryList)
      .pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop()))
      .subscribe(result => {
        this.refreshCategories(() => {
          this.deselectCategories();
          this.closeModal('moveToCategoriesModal');
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
          this.refreshCategories(() => {
            this.closeModal('editMultipleItemsModal');
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
    observableForkJoin(editItems.map(item => {
      return this.authCategoryContributorService.removeItemsFromCategory({
        items: editItems.map(x => x['_id']),
        categories: this.selectedCategory ? [this.selectedCategory['_id']] : item.categories ? item.categories : []
      })
    }))
      .pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop()))
      .subscribe(results => {
        let tempAllItems = this.allItems.filter(x => !_.includes(editItems, x));
        let tempDisplayItems = this.displayItems.filter(x => !_.includes(editItems, x));
        this.refreshCategories(() => {
          WsToastService.toastSubject.next({ content: "Items have been removed from category!", type: 'success' });
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
      item_ids: editItems.map(x => x['_id'])
    })
      .pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop()))
      .subscribe(result => {
        this.refreshCategories(() => {
          WsToastService.toastSubject.next({ content: "Removed from category!", type: 'success' });
        })
      }, (err) => {
        WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
      });
  }
  getCategoryByShopId() {
    this.authCategoryContributorService.getAuthenticatedCategoriesByShopId()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        var categoryList = result['result'];
        this.categoryList = result['result'];
        this.selectedCategory = this.categoryList.find(x => x.name === this.category_name);
        this.displayCategoryList = this.getOtherCategoryByName(categoryList, this.category_name);
      })
  }
  getOtherCategoryByName(categoryList, name) {
    return categoryList.filter(x => x['name'] !== name);
  }
  isCategoryInCategoryList(category) {
    var editCategoryList = this.editCategoryList;
    return _.includes(editCategoryList, category);
  }
  openModal(id) {
    this.modalService.open(id);
  }
  closeModal(id: string) {
    this.modalService.close(id);
  }
  removeItem() {
    this.modalService.open('deleteModal');
    this.modalService.close('editItemModal');
  }
  backToEdit() {
    this.modalService.close('confirmationModal');
    this.modalService.open('editItemModal');
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
  refreshCategories(callback) {
    this.sharedCategoryService.refreshCategories(callback);
  }
  navigateTo(order, orderBy, display) {
    //alphabet
    this.router.navigate([], {
      queryParams: { order: order, by: orderBy, display: display },
      queryParamsHandling: 'merge'
    });
  }
  getPublishInfo() {
    let publishDate = this.getPublishDate(this.shop);
    this.is_publish = this.isPublish(publishDate);
    if (this.shop && this.shop.new) {
      this.message = this.shop.new.message;
    }
  }
  // Tested
  getPublishDate(shop) {
    var returnDate;
    if (shop && shop.new && shop.new.publish_at) {
      returnDate = new Date(shop.new.publish_at);
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
  isPublish(publishDate) {
    var publishAt = this.getDate(publishDate);
    return this.isDateToday(publishAt);
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
