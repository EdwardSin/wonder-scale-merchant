import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WSFormBuilder } from '@builders/wsformbuilder';
import { WsModalComponent } from '@elements/ws-modal/ws-modal.component';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { AuthCategoryContributorService } from '@services/http/auth-store/contributor/auth-category-contributor.service';
import { AuthItemContributorService } from '@services/http/auth-store/contributor/auth-item-contributor.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import { AuthOrderContributorService } from '@services/http/auth-store/contributor/auth-order-contributor.service';
import { OrderReceipt } from '@objects/order-receipt';
import { environment } from '@environments/environment';
import { AuthPromotionContributorService } from '@services/http/auth-store/contributor/auth-promotion-contributor.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';

@Component({
  selector: 'modify-order-modal',
  templateUrl: './modify-order-modal.component.html',
  styleUrls: ['./modify-order-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModifyOrderModalComponent extends WsModalComponent implements OnInit {
  @Input() item: OrderReceipt;
  @Input() closeCallback: Function;
  hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
  mins = ['00', '15', '30', '45'];
  states = [
    'Johor',
    'Kedah',
    'Kelantan',
    'Kuala Lumpur',
    'Malacca',
    'Negeri Sembilan',
    'Pahang',
    'Penang',
    'Perak',
    'Perlis',
    'Sabah',
    'Sarawak',
    'Selangor',
    'Terengganu'
  ]
  todayDate: Date = new Date;
  form: FormGroup;
  categories = [];
  items = [];
  inListItems = [];
  promotions = [];
  selectedItem = null;
  delivery: number = 0;
  subtotal: number = 0;
  discount: number = 0;
  total: number = 0;
  categoryId: string = '';
  itemKeyword: string = '';
  page: number = 1;
  tempOrder: OrderReceipt = null;
  isCreateEmptyOrderModalOpened: boolean;
  modifyLoading: WsLoading = new WsLoading;
  itemLoading: WsLoading = new WsLoading;
  private ngUnsubscribe: Subject<any> = new Subject;
  
  constructor(private authCategoryContributorService: AuthCategoryContributorService,
    private authItemContributorService: AuthItemContributorService,
    private authOrderContributorService: AuthOrderContributorService,
    private authPromotionContributorService: AuthPromotionContributorService) {
    super();
    this.form = WSFormBuilder.createOrderForm();
  }
  ngOnInit() {
    super.ngOnInit();
    this.getCatalogue();
    this.getPromotions();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['isOpened'] && this.item) {
      this.setupItem();
    }
  }
  setupItem() {
    this.form = WSFormBuilder.createOrderForm();
    this.resetForm();
    if (this.item) {
      this.form.patchValue({
        status: this.item.status,
        remark: this.item.remark,
      });
      if (!this.isEditable()) {
        this.form.get('deliveryFee').disable();
        this.form.get('deliveryFee').disable();
        this.form.get('firstName').disable();
        this.form.get('lastName').disable();
        this.form.get('address').disable();
        this.form.get('postcode').disable();
        this.form.get('state').disable();
        this.form.get('country').disable();
        this.form.get('phoneNumber').disable();
        this.form.get('isCustomerSaved').disable();
        this.form.get('etaDate').disable();
        this.form.get('etaDateTimeHour').disable();
        this.form.get('etaDateTimeMin').disable();
        this.form.get('promotion').disable();
        this.form.get('itemName').disable();
        this.form.get('itemType').disable();
        this.form.get('itemPrice').disable();
        this.form.get('itemQuantity').disable();
        this.form.get('status').disable();
        this.form.get('remark').disable();
      }
      this.inListItems = this.item.items;
      if (this.item.delivery) {
        if (this.item.delivery.fee) {
          this.form.patchValue({
            deliveryFee: this.item.delivery.fee
          });
        }
        if (this.item.delivery.etaDate) {
          let etaDate = new Date(this.item.delivery.etaDate);
          this.form.patchValue({
            etaDate: this.item.delivery.etaDate,
            etaDateTimeHour: ("0" + etaDate.getHours()).slice(-2),
            etaDateTimeMin: ("0" + etaDate.getMinutes()).slice(-2),
          })
        }
      }
      if (this.item.customer) {
        this.form.patchValue({
          firstName: this.item.customer['firstName'],
          lastName: this.item.customer['lastName'],
          phoneNumber: this.item.customer['phoneNumber']
        })
        if (this.item.customer['address']) {
          this.form.patchValue({
            address: this.item.customer['address'].address,
            postcode: this.item.customer['address'].postcode,
            state: this.item.customer['address'].state,
            country: this.item.customer['address'].country,
          })
        }
      }
      if (this.item.customerId) {
        this.form.patchValue({
          isCustomerSaved: true
        });
      }
      this.notifyCalculation();
    }
  }
  resetForm() {
    this.form.reset({
      deliveryFee: '',
      status: 'new',
      itemType: 'default',
      country: 'MYS'
    });
    this.inListItems = [];
    this.notifyCalculation();
  }
  addItem() {
    if (!this.form.controls['itemName'].value || !this.form.controls['itemName'].value.trim()) {
      WsToastService.toastSubject.next({ content: 'Please select an item!', type: 'danger'});
      return;
    }
    if (!this.form.controls['itemPrice'].value || !('' + this.form.controls['itemPrice'].value).trim()) {
      WsToastService.toastSubject.next({ content: 'Please enter the price!', type: 'danger'});
      return;
    }
    if (this.form.controls['itemPrice'].errors && this.form.controls['itemPrice'].errors.pattern) {
      WsToastService.toastSubject.next({ content: 'Please enter a valid price!', type: 'danger'});
      return;
    }
    if (!this.form.controls['itemQuantity'].value || !('' + this.form.controls['itemQuantity'].value).trim()) {
      WsToastService.toastSubject.next({ content: 'Please enter the quantity!', type: 'danger'});
      return;
    }
    if (this.form.controls['itemQuantity'].errors && this.form.controls['itemQuantity'].errors.pattern) {
      WsToastService.toastSubject.next({ content: 'Please enter a valid quantity!', type: 'danger'});
      return;
    }
    if (this.form.status == 'VALID') {
      this.inListItems.push({
        name: this.form.controls['itemName'].value,
        type: this.form.controls['itemType'].value || 'Default',
        quantity: this.form.controls['itemQuantity'].value || 1,
        price: +this.form.controls['itemPrice'].value,
      });
      this.notifyCalculation();
    }
  }
  isEditable() {
    return (!this.item) ||
          this.item.status !== 'completed' &&
          this.item.status !== 'refunded' &&
          this.item.status !== 'cancelled'
  }
  removeItem(item) {
    let index = this.inListItems.indexOf(item);
    if (index > -1) {
      this.inListItems.splice(index, 1);
      this.notifyCalculation();
    }
  }
  notifyCalculation() {
    let discountValue = 0;
    let promotionId = this.form.controls['promotion'].value;
    let promotion = this.promotions.find(promotion => promotion._id == promotionId);
    
    this.delivery = this.isCalculateDeliveryFee() ? +this.form.controls['deliveryFee'].value: 0;
    this.subtotal = _.sumBy(this.inListItems, function (x) {
      return x.price * x.quantity;
    });
    
    if (promotion) {
      if (promotion.option == 'percentage') {
        discountValue = promotion.value;
        this.discount = this.subtotal * discountValue / 100;
      }
      if (promotion.option == 'fixed_amount') {
        discountValue = promotion.value;
        this.discount = discountValue;
      }
    } else {
      this.discount = 0;
    }
    this.total = this.delivery + this.subtotal - this.discount;
  }
  isCalculateDeliveryFee() {
    let deliveryFee = this.form.controls['deliveryFee'].value;
    if (deliveryFee && /^\d+$/.test(deliveryFee)) {
      return true;
    }
    return false;
  }
  getCatalogue() {
    this.authCategoryContributorService.getAuthenticatedCategoriesByStoreId().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.categories = result['result'];
      }
    });
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
  openItemChange(event) {
    if(event) {
      this.page = 1;
      this.itemKeyword = '';
      this.items = [];
      this.getItems(this.categoryId);
    }
  }
  searchItemValueChange = _.debounce((event) => {
    this.page = 1;
    this.itemKeyword = event;
    this.getItems(this.categoryId);
  }, 500);
  selectionChange(event) {
    this.selectedItem = event;
    this.getItemType(this.selectedItem);
  }
  getItemType(item) {
    let discount = 0;
    let price = 0;
    let priceAfterDiscount = 0;
    if (item.discount) {
      discount = item.discount;
    }
    if (item.price) {
      price = item.price;
    }
    priceAfterDiscount = price * (100 - discount)/ 100;
    this.selectedItem = item;
    
    this.form.patchValue({
      itemType: this.selectedItem.types.length ? this.selectedItem.types[0].name : '',
      itemName: item.name,
      itemPrice: priceAfterDiscount,
      itemQuantity: 1
    });
  }
  selectItemType(itemType) {
    if (itemType) {
      let discount = 0;
      let price = 0;
      let priceAfterDiscount = 0;

      if (itemType.name) {
        this.form.patchValue({
          itemName: itemType.name
        });
      }
      if (itemType.discount) {
        discount = itemType.discount;
      }
      if (itemType.price) {
        priceAfterDiscount = price * (100 - discount) / 100;
        this.form.patchValue({
          itemPrice: priceAfterDiscount
        });
      }
    }
  }
  getPromotions() {
    let obj = {};
    this.authPromotionContributorService.getPromotions(obj).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result && result['result']) {
        this.promotions = result['result'];
      }
    })
  }
  modifyItem() {
    let form = this.form;
    let etaDate = this.form.controls['etaDate'].value;
    let etaDateTimeHour = this.form.controls['etaDateTimeHour'].value;
    let etaDateTimeMin = this.form.controls['etaDateTimeMin'].value;
    
    if (form.controls['firstName'].value && !form.controls['lastName'].value) {
      WsToastService.toastSubject.next({ content: 'Please enter last name!', type: 'danger'});
      return;
    }
    else if (!form.controls['firstName'].value && form.controls['lastName'].value) {
      WsToastService.toastSubject.next({ content: 'Please enter first name!', type: 'danger'});
      return;
    }
    if (form.controls['isCustomerSaved'].value == true || (form.controls['phoneNumber'].value || form.controls['address'].value || form.controls['postcode'].value ||form.controls['state'].value) && !form.controls['firstName'].value && !form.controls['lastName'].value) {
      WsToastService.toastSubject.next({ content: 'Customer name is required!', type: 'danger'});
      return;
    }
    if (this.form.controls['address'].errors || 
      this.form.controls['postcode'].errors || 
      this.form.controls['state'].errors) {
      WsToastService.toastSubject.next({ content: 'All related address fields must be filled!', type: 'danger'});
      return;
    }
    else if (this.form.controls['address'].errors && this.form.controls['address'].errors.maxlength) {
      WsToastService.toastSubject.next({ content: 'Address must be less than 128 characters!', type: 'danger'});
      return;
    }
    if (this.isValidatedEtaDate()) {
      if (etaDate !== null) {
        etaDate = new Date(etaDate);
        etaDate.setHours(etaDateTimeHour);
        etaDate.setMinutes(etaDateTimeMin);
      } else {
        etaDate = null;
      }
    } else {
      return;
    }
    
    let order: OrderReceipt = {
      customer: {
        firstName: form.controls['firstName'].value,
        lastName: form.controls['lastName'].value,
        address: {
          address: form.controls['address'].value,
          postcode: form.controls['postcode'].value,
          state: form.controls['state'].value,
          country: form.controls['country'].value,
        },
        phoneNumber: form.controls['phoneNumber'].value
      },
      delivery: {
        fee: form.controls['deliveryFee'].value,
        etaDate: etaDate
      },
      items: this.inListItems,
      remark: form.controls['remark'].value,
      status: form.controls['status'].value,
      isCustomerSaved: form.controls['isCustomerSaved'].value
    }
    if (this.item) {
      order['_id'] =  this.item._id
    }
    if (form.controls['promotion'].value) {
      order['promotions'] = form.controls['promotion'].value;
    }
    if (form.valid) {
      order = this.removeEmpty(order);
      if (!order.items.length) {
        this.isCreateEmptyOrderModalOpened = true;
        this.isOpened = false;
        this.tempOrder = order;
        return;
      } 
      this.modifyCallback(order);
    }
  }
  modifyCallback(order) {
    if (this.item) {
      this.modifyLoading.start();
      this.authOrderContributorService.editOrderReceipt(order).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.modifyLoading.stop())).subscribe(result => {
        if (result && result['result']) {
          this.authOrderContributorService.refreshOrderReceipts.next(true);
          this.close();
          this.isCreateEmptyOrderModalOpened = false;
          this.resetForm();
        }
      });
    } else {
      this.modifyLoading.start();
      this.authOrderContributorService.addOrderReceipt(order).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.modifyLoading.stop())).subscribe(result => {
        if (result && result['result']) {
          this.authOrderContributorService.refreshOrderReceipts.next(true);
          if (result['data'] && result['id']) {
            this.copy(result['data']['id']);
          }
          this.close();
          this.isCreateEmptyOrderModalOpened = false;
          this.resetForm();
        }
      });
    }   
  }
  updateOrderReceiptStatus(status) {
    this.authOrderContributorService.updateOrderReceiptStatus(this.item._id, {status}).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result && result['result']) {
        WsToastService.toastSubject.next({content: 'Status is updated!', type: 'success'});
        this.authOrderContributorService.refreshOrderReceipts.next(true);
        this.item.status = status;
        return true;
      }
    }, err => {
      WsToastService.toastSubject.next({content: 'Status cannot be updated!', type: 'danger'});
      this.form.patchValue({
        status: this.item.status
      });
      return false;
    });
  }
  copy(id) {
    var tempInput = document.createElement("input");
    tempInput.style.cssText = "position: absolute; left: -1000px; top: -1000px";
    tempInput.value = environment.URL + 'order/?receiptId=' + id;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    WsToastService.toastSubject.next({ content: 'URL is copied!\n Send the link to your customer!', type: 'success'}); 
  }
  isValidatedEtaDate(): boolean {
    let etaDate = this.form.controls['etaDate'].value;
    let etaDateTimeHour = this.form.controls['etaDateTimeHour'].value;
    let etaDateTimeMin = this.form.controls['etaDateTimeMin'].value;
    if ((etaDate && (!etaDateTimeHour || !etaDateTimeMin)) ||
        (etaDateTimeHour && (!etaDate || !etaDateTimeMin)) ||
        etaDateTimeMin && (!etaDate || !etaDateTimeHour)) {
      WsToastService.toastSubject.next({ content: 'Please set a valid estimated date time!', type: 'danger'});
      return false;
    } else if (etaDate) {
      if (typeof etaDate !== typeof Date) {
        etaDate = new Date(etaDate);
      }
      let estimatedDateTime = new Date(etaDate.getFullYear(), etaDate.getMonth(), etaDate.getDate(), etaDateTimeHour, etaDateTimeMin);
      if (estimatedDateTime < new Date) {
        WsToastService.toastSubject.next({ content: 'Estimated date time must later than now!', type: 'danger'});
        return false;
      }
    }
    return true;
  }
  removeEmpty(obj) {
    Object.keys(obj).forEach(key => {
      if (obj[key] && typeof obj[key] === 'object') {
        this.removeEmpty(obj[key]);
      }
      else if (obj[key] === undefined || obj[key] === null) {
        delete obj[key];
      }
    });
    return obj;
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }
  close() {
    super.close();
    if (this.closeCallback) {
      this.closeCallback();
    }
  }
}
