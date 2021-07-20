import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { environment } from '@environments/environment';
import { Subject } from 'rxjs';
import { Item } from '@objects/item';
import { takeUntil } from 'rxjs/operators';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import * as _ from 'lodash';
import { OnSellingItem } from '@objects/on-selling-item';
import { CartItem } from '@objects/cart-item';
import { ScreenService } from '@services/general/screen.service';

@Component({
  selector: 'menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {
  @Input() onSellingItem: OnSellingItem;
  @Input() isAddedToCart: boolean;
  item: Item;
  type: string = '';
  remark: string;
  @Input() isShown: boolean;
  @Input() isEditable: boolean;
  @Input() isOpenedAuto: boolean;
  @Input() isImageShown: boolean = true;
  @Input() onAddExtraItemClickedCallback: Function;
  @Input() onAddExtraItemGroupClickedCallback: Function;
  @Input() onRemoveExtraitemClickedCallback: Function;
  @Input() onRemoveExtraItemGroupClickedCallback: Function;
  @Output() onAddToCartClicked: EventEmitter<CartItem> = new EventEmitter();
  isImagesOpened: boolean;
  selectedImagesIndex: number = 0;
  environment = environment;
  selectedType;
  currencies = [];
  images = [];
  imageIndex: number = 0;
  isMobileSize: boolean;
  ngUnsubscribe: Subject<any> = new Subject;
  constructor(private screenService: ScreenService) {
    this.screenService.isMobileSize.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.isMobileSize = result;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes && changes['onSellingItem']) {
      if (!this.onSellingItem.quantity) {
        this.onSellingItem.quantity = 1;
      }
      this.onSellingItem.subItemGroups.forEach(itemGroup => {
        itemGroup.isSelected = true;
      });;
      this.item = this.onSellingItem.item as Item;
      // this.item.isDiscountExisting = this.item.isOffer && (this.item.types.find(type => type.discount > 0) != null || this.item.discount > 0);
      this.images = _.union(_.flattenDeep([this.item.profileImages, this.item?.types?.map(type => type.images), (this.item.descriptionImages || [])]));
      this.images = _.filter(this.images, image => !_.isEmpty(image));
      this.imageIndex = this.item.profileImageIndex > -1 ? this.item.profileImageIndex : 0;
    }
  }
  ngOnInit(): void {
  }
  onSubItemChange(subItemGroup, event) {
    subItemGroup.subItems.forEach(item => {
      if (item.name === event.value.name) {
        item.quantity = 1;
      } else {
        item.quantity = 0;
      }
    });
  }
  addToCart() {
    if (this.onSellingItem.isTypeShown && this.onSellingItem?.item['types']?.length > 0 && !this.selectedType) {
      WsToastService.toastSubject.next({ content: 'Please select a type!', type: 'danger'});
      this.isShown = true;
      return;
    }
    for (let i = 0; i < this.onSellingItem.subItemGroups.length; i++) {
      let subItemGroup = this.onSellingItem.subItemGroups[i];
      if (subItemGroup.isSelected) {
        if (subItemGroup.isMultiSelect && subItemGroup.minSubItem == 0 && this.totalGroupQuantity(subItemGroup) == 0) {
          WsToastService.toastSubject.next({ content: `${subItemGroup.name} - Please select at least 1 item or uncheck to not select.`, type: 'danger'});
          this.isShown = true;
          return;
        }
        else if (subItemGroup.isMultiSelect && subItemGroup.minSubItem > this.totalGroupQuantity(subItemGroup)) {
          WsToastService.toastSubject.next({ content: `${subItemGroup.name} - Please select at least ${subItemGroup.minSubItem} item(s).`, type: 'danger'});
          this.isShown = true;
          return;
        } else if (!subItemGroup.isMultiSelect && this.totalGroupQuantity(subItemGroup) == 0) {
          WsToastService.toastSubject.next({ content: `${subItemGroup.name} - Please select an item.`, type: 'danger'});
          this.isShown = true;
          return;
        }
      }
    }
    let cartItem: CartItem = new CartItem();
    let item = this.onSellingItem.item as Item;
    cartItem.itemId = this.onSellingItem?._id;
    cartItem.name = this.onSellingItem?.name || item?.name;
    cartItem.price = item?.price;
    if (this.selectedType) {
      cartItem.type = this.selectedType?.name;
      if (this.selectedType?.price !== null && this.selectedType?.price !== undefined) {
        cartItem.price = this.selectedType?.price
      }
    }
    cartItem.quantity = this.onSellingItem.quantity;
    cartItem.discount = 0;
    if (this.onSellingItem?.subItemGroups?.length) {
      cartItem.subItems = _.flattenDeep(this.onSellingItem?.subItemGroups.map(group => {
        return _.cloneDeep(group.subItems);
      })).filter(subItem => {
        return subItem.quantity > 0;
      });
    }
    cartItem.currency = item?.currency;
    if (this.images.length && this.imageIndex > -1) {
      cartItem.profileImage = this.images[this.imageIndex];
    }
    WsToastService.toastSubject.next({ content: 'Item is added into cart!', type: 'success'});
    this.onAddToCartClicked.emit(cartItem);
    this.reset();
  }
  increase() {
    if (!this.onSellingItem.quantity) {
      this.onSellingItem.quantity = 1;
    }
    if (this.onSellingItem.quantity < 99) {
      this.onSellingItem.quantity++;
    }
  }
  decrease() {
    if (!this.onSellingItem.quantity || this.onSellingItem.quantity < 2) {
      this.onSellingItem.quantity = 1;
    } else {
      this.onSellingItem.quantity--;
    }
  }
  extraItemIncrease(group, item) {
    if (!item.quantity) {
      item.quantity = 0;
    }
    if (group.isOnePerSubItem) {
      return item.quantity = 1;
    }
    if (group.maxSubItem > this.totalGroupQuantity(group)) {
      item.quantity++;
    }
  }
  extraItemDecrease(group, item) {
    if (!item.quantity) {
      item.quantity = 1;
    }
    item.quantity--;
  }
  maxSubItemChange(group) {
    if (group.maxSubItem < group.minSubItem) {
      group.minSubItem = group.maxSubItem;
    }
  }
  minSubItemChange(group) {
    if (group.maxSubItem < group.minSubItem) {
      group.minSubItem = group.maxSubItem;
    }
  }
  totalGroupQuantity(group) {
    return  _.sumBy(group.subItems, (item) => {
      return item.quantity || 0;
    });
  }
  onDetailsClick() {
    if (this.hasDetails()) {
      this.isShown = !this.isShown;
    }
  }
  hasDetails() {
    return this.onSellingItem?.subItemGroups?.length ||
      (this.item?.types?.length && this.onSellingItem?.isTypeShown) ||
      this.item?.description
  }
  reset() {
    this.onSellingItem.quantity = 1;
    this.onSellingItem?.subItemGroups?.forEach(group => {
      group?.subItems?.forEach(item => {
        item.quantity = 0;
      });
    });
    this.isShown = false;
  }
  ngOnDestroy(){
  }
}
