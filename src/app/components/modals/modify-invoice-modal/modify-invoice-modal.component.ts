import { Component, Input, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormControl, FormGroup } from '@angular/forms';
import { WSFormBuilder } from '@builders/wsformbuilder';
import { WsModalComponent } from '@elements/ws-modal/ws-modal.component';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { AuthCategoryContributorService } from '@services/http/auth-store/contributor/auth-category-contributor.service';
import { AuthItemContributorService } from '@services/http/auth-store/contributor/auth-item-contributor.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import { AuthInvoiceContributorService } from '@services/http/auth-store/contributor/auth-invoice-contributor.service';
import { Invoice } from '@objects/invoice';
import { environment } from '@environments/environment';
import { AuthPromotionContributorService } from '@services/http/auth-store/contributor/auth-promotion-contributor.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import * as moment from 'moment';
import { DateTimeHelper } from '@helpers/datetimehelper/datetime.helper';

@Component({
  selector: 'modify-invoice-modal',
  templateUrl: './modify-invoice-modal.component.html',
  styleUrls: ['./modify-invoice-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModifyInvoiceModalComponent extends WsModalComponent implements OnInit {
  @Input() item: Invoice;
  @Input() closeCallback: Function;
  hours = ['06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '00', '01', '02', '03', '04', '05'];
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
  immutedTodayDate: Date = new Date;
  form: FormGroup;
  categories = [];
  items = [];
  inListItems = [];
  promotions = [];
  itemTypes = [];
  selectedTab = new FormControl(0);
  selectedItem = null;
  delivery: number = 0;
  subtotal: number = 0;
  discount: number = 0;
  total: number = 0;
  categoryId: string = '';
  itemKeyword: string = '';
  page: number = 1;
  open: boolean;
  defaultPrice: number = 0;
  tempInvoice: Invoice = null;
  _previousStatus: boolean;
  isCreateEmptyInvoiceModalOpened: boolean;
  modifyLoading: WsLoading = new WsLoading;
  itemLoading: WsLoading = new WsLoading;
  private ngUnsubscribe: Subject<any> = new Subject;
  
  constructor(private authCategoryContributorService: AuthCategoryContributorService,
    private authItemContributorService: AuthItemContributorService,
    private authInvoiceContributorService: AuthInvoiceContributorService,
    private authPromotionContributorService: AuthPromotionContributorService) {
    super();
  }
  ngOnInit() {
    super.ngOnInit();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['isOpened']) {
      this.getCatalogue();
      this.getPromotions();
      this.getItems(this.categoryId);
      if (this.item) {
        this.setupItem();
      } else if (!this.tempInvoice) {
        this.form = WSFormBuilder.createInvoiceForm();
        this.inListItems = [];
      }
    }
  }
  setupItem() {
    this.form = WSFormBuilder.createInvoiceForm();
    this.resetForm();
    if (this.item) {
      this.form.patchValue({
        status: this.item.status,
        remark: this.item.remark,
        deliveryOption: this.item.deliveryOption,
        paymentMethod: this.item.paymentMethod || ''
      });
      if (!this.isEditable()) {
        this.disableAllFields()
      }
      this.inListItems = this.item.items;
      if (this.item.delivery) {
        if (this.item.delivery.fee) {
          this.form.patchValue({
            deliveryFee: this.item.delivery.fee
          });
        }
        if (this.item.delivery.etaDate) {
          let etaDateTimeHour = this.item.delivery.etaHour;
          let etaDateTimeMin = this.item.delivery.etaMin;
          this.form.patchValue({
            etaDate: this.item.delivery.etaDate,
            etaDateTimeHour: etaDateTimeHour !== null && etaDateTimeHour !== undefined ? ("0" + etaDateTimeHour).slice(-2): null,
            etaDateTimeMin: etaDateTimeMin !== null && etaDateTimeMin !== undefined ? ("0" + etaDateTimeMin).slice(-2): null
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
      if (this.item.completedAt) {
        this.form.patchValue({
          completedAt: this.item.completedAt,
          isCompletedChecked: true,
        })
      }
      if (this.item.promotions?.length) {
        this.form.patchValue({
          promotion: this.item.promotions[0]['_id']
        })
      }
      this.notifyCalculation();
    }
  }
  resetForm() {
    this.form.reset({
      deliveryFee: '',
      status: 'new',
      country: 'MYS',
      deliveryOption: 'delivery'
    });
    this.inListItems = [];
    this.notifyCalculation();
  }
  addItem() {
    if (!this.form.controls['itemName'].value || !this.form.controls['itemName'].value.trim()) {
      WsToastService.toastSubject.next({ content: 'Please select an item!', type: 'danger'});
      return;
    }
    if (this.form.controls['itemPrice'].value == undefined || 
        this.form.controls['itemPrice'].value == null || 
        ('' + this.form.controls['itemPrice'].value).trim() == '') {
      WsToastService.toastSubject.next({ content: 'Please enter the price!', type: 'danger'});
      return;
    }
    if (this.form.controls['itemPrice'].errors && this.form.controls['itemPrice'].errors.pattern) {
      WsToastService.toastSubject.next({ content: 'Please enter a valid price!', type: 'danger'});
      return;
    }
    if (this.form.controls['itemQuantity'].value == undefined || 
        this.form.controls['itemQuantity'].value == null || 
        ('' + this.form.controls['itemQuantity'].value).trim() == '') {
      WsToastService.toastSubject.next({ content: 'Please enter the quantity!', type: 'danger'});
      return;
    }
    if (this.form.controls['itemQuantity'].errors && this.form.controls['itemQuantity'].errors.pattern) {
      WsToastService.toastSubject.next({ content: 'Please enter a valid quantity!', type: 'danger'});
      return;
    }
    this.inListItems.push({
      name: this.form.controls['itemName'].value,
      type: this.form.controls['itemType'].value ? this.form.controls['itemType'].value.name : 'Default',
      quantity: +this.form.controls['itemQuantity'].value || 1,
      price: +this.form.controls['itemPrice'].value,
    });
    this.notifyCalculation();
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
    this.open = event;
    if(event && !this.items.length) {
      this.page = 1;
      this.itemKeyword = '';
      this.items = [];
      this.getItems(this.categoryId);
    }
  }
  searchItemValueChange = _.debounce((event) => {
    if (this.open) {
      this.page = 1;
      this.itemKeyword = event;
      this.getItems(this.categoryId);
    }
  }, 500);
  selectionChange(event) {
    this.selectedItem = event;
    this.itemTypes = [
      {
        name: 'Default',
        price: this.getPriceAfterDiscount(this.selectedItem.price, this.selectedItem.discount)
      },
      ...this.selectedItem.types];
    this.getItemType(this.selectedItem);
  }
  getItemType(item) {
    let priceAfterDiscount = this.getPriceAfterDiscount(item.price, item.discount);
    this.selectedItem = item;
    this.defaultPrice = priceAfterDiscount;
    this.form.patchValue({
      itemType: this.itemTypes[0],
      itemName: item.name,
      itemPrice: priceAfterDiscount.toFixed(2),
      itemQuantity: 1
    });
  }
  selectItemType(itemType) {
    if (itemType) {
      if (itemType.price) {
        let priceAfterDiscount = this.getPriceAfterDiscount(itemType.price, itemType.discount);
        this.form.patchValue({
          itemPrice: priceAfterDiscount
        });
      } else if (itemType.amount !== undefined && itemType.incrementType !== undefined) {
        let price = itemType.incrementType ? this.selectedItem.price + itemType.amount: this.selectedItem.price - itemType.amount;
        let priceAfterDiscount = this.getPriceAfterDiscount(price, this.selectedItem.discount);
        this.form.patchValue({
          itemPrice: priceAfterDiscount
        });
      }
    }
  }
  getPromotions() {
    let obj = {
      isShownExpiry: true,
      isShownEnabled: true
    };
    this.authPromotionContributorService.getPromotions(obj).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result && result['result']) {
        this.promotions = result['result'];
        if (this.item && this.item.promotions && this.item.promotions.length) {
          this.promotions = [...this.promotions, ...this.item.promotions];
        }
        this.notifyCalculation();
      }
    })
  }
  private validatePickup() {
    let form = this.form;
    return form.controls['isCustomerSaved'].value && form.controls['firstName'].value && form.controls['lastName'].value && form.controls['phoneNumber'].value ||
          (!form.controls['isCustomerSaved'].value && form.controls['firstName'].value && form.controls['lastName'].value && form.controls['phoneNumber'].value) ||
          (!form.controls['isCustomerSaved'].value && !form.controls['phoneNumber'].value);
  }
  private validateDelivery() {
    let form = this.form;
    return form.controls['isCustomerSaved'].value && form.controls['firstName'].value && form.controls['lastName'].value && form.controls['phoneNumber'].value ||
           (!form.controls['isCustomerSaved'].value && (form.controls['phoneNumber'].value || form.controls['address'].value || form.controls['postcode'].value ||form.controls['state'].value) && form.controls['lastName'].value && form.controls['firstName'].value) ||
           (!form.controls['isCustomerSaved'].value && !(form.controls['phoneNumber'].value || form.controls['address'].value || form.controls['postcode'].value ||form.controls['state'].value));
  }
  private getPriceAfterDiscount(price, discount) {
    let _discount = 0;
    let _price = 0;
    if (discount) {
      _discount = discount;
    }
    if (price) {
      _price = price;
    }
    return _price * (100 - _discount)/ 100;
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
    if (!this.validatePickup() || !this.validateDelivery()) {
      WsToastService.toastSubject.next({ content: 'Customer name and contact is required!', type: 'danger'});
      return;
    }
    if (form.controls['address'].errors || 
      form.controls['postcode'].errors || 
      form.controls['state'].errors) {
      WsToastService.toastSubject.next({ content: 'All related address fields must be filled!', type: 'danger'});
      return;
    }
    else if (form.controls['address'].errors && form.controls['address'].errors.maxlength) {
      WsToastService.toastSubject.next({ content: 'Address must be less than 128 characters!', type: 'danger'});
      return;
    }
    if (this.isValidatedEtaDate()) {
      if (etaDate == null) {
        etaDate = null;
        etaDateTimeHour = null;
        etaDateTimeMin = null
      }
    } else {
      return;
    }
    if (form.controls['isCompletedChecked'].value && !form.controls['completedAt'].value) {
      WsToastService.toastSubject.next({ content: 'Please enter completion date!', type: 'danger'});
      return;
    }
    
    let invoice: Invoice = {
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
        etaDate: etaDate,
        etaHour: etaDateTimeHour,
        etaMin: etaDateTimeMin
      },
      items: this.inListItems,
      remark: form.controls['remark'].value,
      status: form.controls['status'].value,
      paymentMethod: form.controls['paymentMethod'].value,
      deliveryOption: form.controls['deliveryOption'].value,
      isCustomerSaved: form.controls['isCustomerSaved'].value
    }
    if (this.item) {
      invoice['_id'] =  this.item._id
    }
    if (form.controls['promotion'].value) {
      invoice['promotions'] = form.controls['promotion'].value;
    }
    if (form.controls['isCompletedChecked'].value) {
      invoice['completedAt'] = DateTimeHelper.getDateWithCurrentTimezone(new Date(form.controls['completedAt'].value));
    }
    if (form.valid) {
      invoice = this.removeEmpty(invoice);
      if (!invoice.items.length) {
        this.isCreateEmptyInvoiceModalOpened = true;
        this.isOpened = false;
        this.tempInvoice = invoice;
        return;
      } 
      this.modifyCallback(invoice);
    }
  }
  modifyCallback(invoice) {
    if (this.item) {
      this.modifyLoading.start();
      this.authInvoiceContributorService.editInvoice(invoice).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.modifyLoading.stop())).subscribe(result => {
        if (result && result['result']) {
          this.authInvoiceContributorService.refreshInvoices.next(true);
          this.close();
          this.isCreateEmptyInvoiceModalOpened = false;
          this.resetForm();
        }
      });
    } else {
      this.modifyLoading.start();
      this.authInvoiceContributorService.addInvoice(invoice).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.modifyLoading.stop())).subscribe(result => {
        if (result && result['result']) {
          this.authInvoiceContributorService.refreshInvoices.next(true);
          if (result['data'] && invoice.status !== 'completed') {
            this.copy(result['data']);
          }
          this.close();
          this.isCreateEmptyInvoiceModalOpened = false;
          this.resetForm();
        }
      });
    }   
  }
  updateInvoiceStatus(status) {
    this.authInvoiceContributorService.updateInvoiceStatus(this.item._id, {fromStatus: this.item.status, status}).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result && result['result']) {
        WsToastService.toastSubject.next({content: 'Status is updated!', type: 'success'});
        this.authInvoiceContributorService.refreshInvoices.next(true);
        this.item.status = status;
        this._previousStatus = status;
        if (this.isEditable()) {
          this.enableAllFields();
          if (status == 'new') {
            this.form.controls['isCompletedChecked'].setValue(false);
          }
        } else if (!this.isEditable()) {
          this.disableAllFields();
          if (status == 'completed') {
            this.form.controls['isCompletedChecked'].setValue(true);
            this.form.controls['completedAt'].setValue(new Date());
          }
        }
        return true;
      }
    }, err => {
      WsToastService.toastSubject.next({content: 'Status cannot be updated!', type: 'danger'});
      if (this.form.controls['isCompletedChecked'].value) {
        this.form.patchValue({
          status: 'completed'
        });
        return false;
      }
      this.form.patchValue({
        status: this.item.status
      });
      return false;
    });
  }
  copy(item) {
    var tempInput = document.createElement("input");
    tempInput.style.cssText = "position: absolute; left: -1000px; top: -1000px";
    tempInput.value = environment.URL + 'invoice/?s_id=' + item._id + '&r_id=' + item.receiptId;
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
    if (!etaDate && (etaDateTimeHour || etaDateTimeMin)) {
      WsToastService.toastSubject.next({ content: 'Please set estimated date!', type: 'danger'});
      return false;
    }
    if ((etaDateTimeHour && !etaDateTimeMin) || (etaDateTimeMin && !etaDateTimeHour)) {
      WsToastService.toastSubject.next({ content: 'Please set a valid estimated time!', type: 'danger'});
      return false;
    }
    if (etaDate && etaDateTimeHour && etaDateTimeMin) {
      if (typeof etaDate !== typeof Date) {
        etaDate = new Date(etaDate);
      }
      let estimatedDateTime = new Date(etaDate.getFullYear(), etaDate.getMonth(), etaDate.getDate(), etaDateTimeHour, etaDateTimeMin);
      if (estimatedDateTime < new Date && !this.form.controls['isCompletedChecked'].value) {
        WsToastService.toastSubject.next({ content: 'Estimated date time must be later than now!', type: 'danger'});
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
  disableAllFields() {
    this.form.get('deliveryFee').disable();
    this.form.get('deliveryOption').disable();
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
    this.form.get('remark').disable();
    this.form.get('isCompletedChecked').disable();
    this.form.get('completedAt').disable();
    this.form.get('paymentMethod').disable();
  }
  enableAllFields() {
    this.form.get('deliveryFee').enable();
    this.form.get('deliveryOption').enable();
    this.form.get('firstName').enable();
    this.form.get('lastName').enable();
    this.form.get('address').enable();
    this.form.get('postcode').enable();
    this.form.get('state').enable();
    this.form.get('country').enable();
    this.form.get('phoneNumber').enable();
    this.form.get('isCustomerSaved').enable();
    this.form.get('etaDate').enable();
    this.form.get('etaDateTimeHour').enable();
    this.form.get('etaDateTimeMin').enable();
    this.form.get('promotion').enable();
    this.form.get('itemName').enable();
    this.form.get('itemType').enable();
    this.form.get('itemPrice').enable();
    this.form.get('itemQuantity').enable();
    this.form.get('remark').enable();
    this.form.get('isCompletedChecked').enable();
    this.form.get('completedAt').enable();
    this.form.get('paymentMethod').enable();
  }
  returnToModifyInvoice() {
    this.isOpened = true;
    this.isCloseIconDisplayed = false;
  }
  setDefaultPrice() {
    this.form.patchValue({
      itemPrice: this.defaultPrice.toFixed(2)
    });
  }
  changeToCompletedStatus(event) {
    if (event.checked) {
      this._previousStatus = this.form.controls['status'].value;
      if (this.isEditable()) {
        this.form.controls['status'].setValue('completed');
        if (!this.form.controls['completedAt'].value) {
          this.form.controls['completedAt'].setValue(this.immutedTodayDate);
        }
      }
    } else {
      this.form.controls['status'].setValue(this._previousStatus);
    }
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.inListItems, event.previousIndex, event.currentIndex);
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }
  close() {
    super.close();
    this.tempInvoice = null;
    this.categoryId = '';
    if (this.closeCallback) {
      this.closeCallback();
    }
  }
}
