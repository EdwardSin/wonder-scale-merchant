import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { WsModalComponent } from '@elements/ws-modal/ws-modal.component';
import { OnSellingItem } from '@objects/on-selling-item';
import { AuthCategoryContributorService } from '@services/http/auth-store/contributor/auth-category-contributor.service';
import { AuthItemContributorService } from '@services/http/auth-store/contributor/auth-item-contributor.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { SharedCategoryService } from '@services/shared/shared-category.service';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { AuthOnSellingItemContributorService } from '@services/http/auth-store/contributor/auth-on-selling-item-contributor.service';
import { Item } from '@objects/item';

@Component({
  selector: 'modify-on-selling-item-modal',
  templateUrl: './modify-on-selling-item-modal.component.html',
  styleUrls: ['./modify-on-selling-item-modal.component.scss']
})
export class ModifyOnSellingItemModalComponent extends WsModalComponent implements OnInit {
  @Input() closeCallback: Function;
  @Input() onSellingItem: OnSellingItem = {
    item: '',
    name: '',
    categories: [],
    store: '',
    isTypeShown: true,
    subItemGroups: [],
  };
  selectedActionType = 'add_main_sub';
  maxWidth = 400;
  categoryId: string = '';
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
    private sharedCategoryService: SharedCategoryService,
    private ref: ChangeDetectorRef) {
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
    this.itemLoading.start();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['isOpened']) {
      this.maxWidth = this.onSellingItem?.item ? 800 : 400;
      if (this.onSellingItem?.item) {
        this.isEditMode = true;
        if (!this.onSellingItem?.name) {
          this.onSellingItem.name = (<Item>this.onSellingItem?.item)?.name;
        }
      }
    }
  }
  saveItem() {
    let obj = {
      _id: this.onSellingItem._id,
      name: this.onSellingItem.name,
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
    if (!this.onSellingItem?.name) {
      this.onSellingItem.name = this.selectedItem.name;
    }
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
    this.authItemContributorService.getAuthenticatedAllItemsByStoreId({keyword: this.itemKeyword, page: this.page}).pipe(takeUntil(this.ngUnsubscribe), finalize(() => {
      this.itemLoading.stop();
      this.ref.detectChanges();
    })).subscribe(result => {
      if (result) {
        if (isNextPage) {
          this.items = this.items.concat(result['result']);
        } else {
          this.items = result['result'];
        }
        this.items = this.items.filter(x => x._id !== this.selectedItem?._id);
      }
    })
  }
  selectItemType(event) {
    this.selectedItemType = event;
    this.extraItemPrice = this.selectedItemType.price || this.selectedSubItem.price || 0;
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
    if(event) {
      this.page = 1;
      this.itemKeyword = '';
      this.items = [];
      this.getItems(this.categoryId);
    } else {
      this.itemLoading.start();
      this.items = [];
    }
  }
  onAddSubItemClickedCallback(group) {
    this.isSubItemOpened = true;
    this.selectedGroup = group;
    this.items = [];
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
    if (this.selectedSubItem?.types?.length) {
      this.itemTypes = [
        ...this.selectedSubItem.types];
      this.selectedItemType = this.itemTypes[0];
    } else {
      this.itemTypes = [];
      this.selectedItemType = null;
    }
    if (this.selectedSubItem) {
      this.extraItemPrice = this.selectedItemType?.price || this.selectedSubItem?.price || 0;
    }
  }
  addSubItem() {
    if (this.selectedGroup.subItems.length > 14) {
      WsToastService.toastSubject.next({ content: 'Currently only support max 15 items in a group!', type: 'danger'});
      return ;
    }
    if (!this.selectedSubItem) {
      WsToastService.toastSubject.next({ content: 'Please select a subitem!', type: 'danger'});
      return;
    }
    if (this.extraItemPrice == null || this.extraItemPrice == undefined) {
      WsToastService.toastSubject.next({ content: 'Please enter the price!', type: 'danger'});
      return;
    }
    this.selectedGroup.subItems.push({
      _id: this.selectedItemType?._id,
      name: this.selectedSubItem.name + (this.selectedItemType && this.selectedItemType?.name ? ' - ' + this.selectedItemType?.name : ''),
      price: this.extraItemPrice
    } as any);
    this.isSubItemOpened = false;
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
  onSellingItemNameChanged() {
    if (!this.onSellingItem?.name) {
      this.onSellingItem.name = (<Item>this.onSellingItem?.item).name;
    }
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
