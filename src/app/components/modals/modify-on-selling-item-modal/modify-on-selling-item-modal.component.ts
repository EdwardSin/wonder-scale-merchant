import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { WsModalComponent } from '@elements/ws-modal/ws-modal.component';
import { OnSellingItem } from '@objects/on-selling-item';
import { AuthCategoryContributorService } from '@services/http/auth-store/contributor/auth-category-contributor.service';
import { AuthItemContributorService } from '@services/http/auth-store/contributor/auth-item-contributor.service';
import { Subject } from 'rxjs';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { SharedCategoryService } from '@services/shared/shared-category.service';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { AuthOnSellingItemContributorService } from '@services/http/auth-store/contributor/auth-on-selling-item-contributor.service';
import { of } from 'rxjs';

@Component({
  selector: 'modify-on-selling-item-modal',
  templateUrl: './modify-on-selling-item-modal.component.html',
  styleUrls: ['./modify-on-selling-item-modal.component.scss']
})
export class ModifyOnSellingItemModalComponent extends WsModalComponent implements OnInit {
  @Input() closeCallback: Function;
  @Input() onSellingItem: OnSellingItem = {
    item: '',
    categories: [],
    store: '',
    isTypeShown: true,
    subItemGroups: [],
  };
  selectedActionType = 'add_main_sub';
  maxWidth = 400;
  categoryId: string = '';
  categories;
  items = [];
  page: number = 1;
  itemKeyword: string = '';
  selectedItem;
  open;
  isSubItemOpened: boolean;
  itemLoading: WsLoading = new WsLoading;
  selectedSubItem;
  selectedItemType;
  extraItemPrice: number = 0;
  itemTypes = [];
  selectedGroup;
  store;
  category;
  modifyLoading: WsLoading = new WsLoading;
  isEditMode: boolean;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private authItemContributorService: AuthItemContributorService,
    private authCategoryContributorService: AuthCategoryContributorService,
    private authOnSellingItemContributorService: AuthOnSellingItemContributorService,
    private sharedStoreService: SharedStoreService,
    private sharedCategoryService: SharedCategoryService) {
    super();
    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.store = result;
      } else {
        this.store = null;
      }
    });
    this.sharedCategoryService.category.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.category = result;
    });
  }
  ngOnInit(): void {
    super.ngOnInit();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['isOpened']) {
      this.maxWidth = this.onSellingItem?.item ? 800 : 400;
      if (this.onSellingItem?.item) {
        this.isEditMode = true;
      }
      this.getCategories();
    }
  }
  saveItem() {
    let obj = {
      _id: this.onSellingItem._id,
      item: this.onSellingItem.item,
      store: this.onSellingItem.store,
      categories: [this.category._id],
      subItemGroups: this.onSellingItem.subItemGroups,
      isTypeShown: this.onSellingItem.isTypeShown
    }
    if (this.validate(obj)) {
      this.modifyLoading.start();
      this.authOnSellingItemContributorService.saveItem(obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.modifyLoading.stop())).subscribe(result => {
        super.close();
      });
    }
  }
  validate(obj) {
    for (let i = 0; i < obj.subItemGroups.length; i++) {
      let group = obj.subItemGroups[i];
      if (!group.name || !group.name.trim().length) {
        WsToastService.toastSubject.next({ content: `Group ${i + 1} - title is invalid!`, type: 'danger'});
        return false;
      }
      if (!group.subItems.length) {
        WsToastService.toastSubject.next({ content: `Group ${i + 1} - min 1 item is added!`, type: 'danger'});
        return false;
      }
      if (group.isOnePerSubItem && group.minSubItem > group.subItems.length) {
        WsToastService.toastSubject.next({ content: `Group ${i + 1} - subitems must be more than min (${group.minSubItem}) selected items!`, type: 'danger'});
        return false;
      }
    }
    return true;
  }
  selectActionType(item) {
    this.selectedActionType = item;
  }
  confirmMainItem() {
    this.onSellingItem.item = this.selectedItem;
    this.categoryId = '';
    this.maxWidth = 800;
  }
  close() {
    this.isOpened = false;
  }
  getItems(categoryId=null, isNextPage?) {
    if (isNextPage) {
      this.page++;
    }
    this.categoryId = categoryId;
    this.itemLoading.start();
    if (categoryId == 'uncategorized') {
      this.authItemContributorService.getAuthenticatedUncategorizedItemCategoryByStoreId({keyword: this.itemKeyword, page: this.page}).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.itemLoading.stop()))
      .subscribe(result => {
        if (result) {
          if (isNextPage) {
            this.items = this.items.concat(result['result']);
          } else {
            this.items = result['result'];
          }
        }
      })
    } else if (categoryId) {
      this.authItemContributorService.getItemsByCategoryId(categoryId, this.itemKeyword, this.page, 'alphabet', false).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.itemLoading.stop())).subscribe(result => {
        if (result) {
          if (isNextPage) {
            this.items = this.items.concat(result['result']);
          } else {
            this.items = result['result'];
          }
        }
      });
    }
    else {
      this.authItemContributorService.getAuthenticatedAllItemsByStoreId({keyword: this.itemKeyword, page: this.page}).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.itemLoading.stop())).subscribe(result => {
        if (result) {
          if (isNextPage) {
            this.items = this.items.concat(result['result']);
          } else {
            this.items = result['result'];
          }
        }
      })
    }
  }
  selectItemType(event) {
    this.selectedItemType = event;
    this.extraItemPrice = this.selectedItemType.price || 0;
  }
  searchItemValueChange = _.debounce((event) => {
    if (this.open) {
      this.page = 1;
      this.itemKeyword = event;
      this.getItems(this.categoryId);
    }
  }, 500);
  openItemChange(event) {
    this.open = event;
    if(event && !this.items.length) {
      this.page = 1;
      this.itemKeyword = '';
      this.items = [];
      this.getItems(this.categoryId);
    }
  }
  onAddSubItemClickedCallback(group) {
    this.isSubItemOpened = true;
    this.selectedGroup = group;
  }
  onAddSubItemGroupClickedCallback() {
    if (this.onSellingItem.subItemGroups.length > 9) {
      WsToastService.toastSubject.next({ content: 'Currently only support max 10 groups!', type: 'danger'});
      return ;
    }
    this.onSellingItem.subItemGroups.push({
      name: '',
      isMultiSelect: false,
      maxSubItem: 5,
      minSubItem: 1,
      isOnePerSubItem: false,
      subItems: []
    });
  }
  selectionChange(event) {
    this.selectedItem = event;
  }
  selectionChangeSubItem(event) {
    this.selectedSubItem = event;
    this.itemTypes = [
      {
        name: '',
        price: this.selectedSubItem.price
      },
      ...this.selectedSubItem.types];
    this.selectedItemType = this.itemTypes[0];
    this.extraItemPrice = this.itemTypes[0].price;
  }
  addSubItem() {
    if (this.selectedGroup.subItems.length > 14) {
      WsToastService.toastSubject.next({ content: 'Currently only support max 15 items in a group!', type: 'danger'});
      return ;
    }
    this.selectedGroup.subItems.push({
      _id: this.selectedSubItem._id,
      name: this.selectedSubItem.name + (this.selectedItemType && this.selectedItemType?.name ? ' - ' + this.selectedItemType?.name : ''),
      price: this.extraItemPrice
    } as any);
    this.isSubItemOpened = false;
  }
  getCategories() {
    this.authCategoryContributorService.getAuthenticatedCategoriesByStoreId().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.categories = result['result'];
      }
    });
  }
  onDeleteSubItemGroupClickedCallback(index) {
    if (index > -1) {
      this.onSellingItem.subItemGroups.splice(index, 1);
    }
  }
  onRemoveSubitemClickedCallback(group, index) {
    if (index > -1) {
      group.subItems.splice(index, 1);
    }
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
