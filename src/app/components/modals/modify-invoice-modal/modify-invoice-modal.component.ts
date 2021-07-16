import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormControl, FormGroup } from '@angular/forms';
import { WsFormBuilder } from '@builders/wsformbuilder';
import { WsModalComponent } from '@elements/ws-modal/ws-modal.component';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import { AuthInvoiceContributorService } from '@services/http/auth-store/contributor/auth-invoice-contributor.service';
import { Invoice } from '@objects/invoice';
import { environment } from '@environments/environment';
import { AuthPromotionContributorService } from '@services/http/auth-store/contributor/auth-promotion-contributor.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { DateTimeHelper } from '@helpers/datetimehelper/datetime.helper';
import { AuthDeliveryContributorService } from '@services/http/auth-store/contributor/auth-delivery-contributor.service';
import { Delivery } from '@objects/delivery';
import { AuthOnSellingCategoryContributorService } from '@services/http/auth-store/contributor/auth-on-selling-category-contributor.service';
import { AuthOnSellingItemContributorService } from '@services/http/auth-store/contributor/auth-on-selling-item-contributor.service';
import { CartItem } from '@objects/cart-item';
import { Cashier } from '@objects/cashier';

@Component({
  selector: 'modify-invoice-modal',
  templateUrl: './modify-invoice-modal.component.html',
  styleUrls: ['./modify-invoice-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModifyInvoiceModalComponent extends WsModalComponent implements OnInit {
  @Input() item: Invoice;
  @Input() closeCallback: Function;
  @ViewChild('recipientName', {static: false}) recipientName: ElementRef;
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
  focusCompletedDate: Date;
  form: FormGroup;
  categories = [];
  items = [];
  promotions = [];
  deliveries: Array<Delivery> = [];
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
  selectedPromotion;
  tempInvoice: Invoice = null;
  _previousStatus: boolean;
  isCreateEmptyInvoiceModalOpened: boolean;
  modifyLoading: WsLoading = new WsLoading;
  itemLoading: WsLoading = new WsLoading;
  cartItems: Array<CartItem> = [];
  cashier: Cashier = new Cashier();
  private ngUnsubscribe: Subject<any> = new Subject;
  
  constructor(private authDeliveryContributorService: AuthDeliveryContributorService, 
    private authOnSellingCategoryContributorService: AuthOnSellingCategoryContributorService,
    private authOnSellingItemContributorService: AuthOnSellingItemContributorService,
    private authInvoiceContributorService: AuthInvoiceContributorService,
    private authPromotionContributorService: AuthPromotionContributorService) {
    super();
  }
  ngOnInit() {
    super.ngOnInit();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['isOpened']) {
      this.selectedTab.setValue(0);
      this.getCatalogue();
      this.getPromotions();
      this.getDeliveries();
      this.getItems(this.categoryId);
      if (this.item) {
        this.setupItem();
      } else if (!this.tempInvoice) {
        this.form = WsFormBuilder.createInvoiceForm();
        this.cartItems = [];
      }
    }
  }
  setupItem() {
    this.form = WsFormBuilder.createInvoiceForm();
    this.focusCompletedDate = this.immutedTodayDate;
    this.resetForm();
    if (this.item) {
      this.form.patchValue({
        status: this.item.status,
        remark: this.item.remark,
        deliveryOption: this.item.deliveryOption,
        paymentMethod: this.item.paymentMethod || '',
        numberOfPromotion: '1'
      });
      if (!this.isEditable()) {
        this.disableAllFields()
      }
      this.cartItems = this.item.items;
      if (this.item.delivery) {
        if (this.item.delivery.fee !== null) {
          this.form.patchValue({
            deliveryFee: this.item.delivery.fee
          });
        }
        if (this.item.delivery._id) {
          this.form.patchValue({
            deliveryId: this.item.delivery._id
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
          recipientName: this.item.customer['recipientName'],
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
        this.focusCompletedDate = this.item.completedAt;
      }
      if (this.item.promotions?.length && this.item.promotions[0]['_id']) {
        this.form.patchValue({
          promotion: this.item.promotions[0]['_id']['_id'],
          numberOfPromotion: this.item.promotions[0]['quantity'] || 1
        })
      }
      this.notifyCalculation();
    }
  }
  resetForm() {
    this.form.reset({
      deliveryId: '',
      deliveryFee: '',
      status: 'new',
      country: 'MYS',
      deliveryOption: 'delivery'
    });
    this.cartItems = [];
    this.notifyCalculation();
  }
  addItem(item) {
    this.cartItems.push(item);
    this.notifyCalculation();
  }
  isEditable() {
    return (!this.item) ||
          this.item.status !== 'completed' &&
          this.item.status !== 'refunded' &&
          this.item.status !== 'cancelled' &&
          this.item.status !== 'rejected';
  }
  removeItem(item) {
    let index = this.cartItems.indexOf(item);
    if (index > -1) {
      this.cartItems.splice(index, 1);
      this.notifyCalculation();
    }
  }
  totalOfItem(item) {
    return item.quantity * item.price + _.sumBy(item.subItems, function (subItem) {
      return subItem?.quantity * subItem?.price * item?.quantity;
    });
  }
  notifyCalculation() {
    let promotionId = this.form.controls['promotion'].value;
    let promotion = this.promotions.find(promotion => promotion._id == promotionId);
    this.selectedPromotion = promotion;
    if (this.selectedPromotion) {
      this.cashier.promotions = [{...this.selectedPromotion, quantity: this.form.value.numberOfPromotion || 1}];
    } else {
      this.cashier.promotions = [];
    }
    this.cashier.cartItems = <CartItem[]>this.cartItems;
    this.cashier.delivery = this.isCalculateDeliveryFee() ? +this.form.controls['deliveryFee'].value: 0;
    this.discount = this.cashier.getPromotionDiscount();
    this.delivery = this.cashier.getDelivery();
    this.subtotal = this.cashier.getSubtotal();
    this.total = this.cashier.getTotal();
  }
  isCalculateDeliveryFee() {
    let deliveryFee = this.form.controls['deliveryFee'].value;
    if (deliveryFee && /^\d+$/.test(deliveryFee)) {
      return true;
    }
    return false;
  }
  getCatalogue() {
    this.authOnSellingCategoryContributorService.getAuthenticatedCategoriesByStoreId().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
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
    this.authOnSellingItemContributorService.getAuthenticatedAllItemsByStoreId({keyword: this.itemKeyword, page: this.page}).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.itemLoading.stop())).subscribe(result => {
      if (result) {
        if (isNextPage) {
          this.items = this.items.concat(this.mapItems(result['result']));
        } else {
          this.items = this.mapItems(result['result']);
        }
      }
    })
  }
  getDeliveries() {
    this.authDeliveryContributorService.getDeliveries(null).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.deliveries = result['result'];
    });
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
  mapItems(items) {
    return items.map(item => {
      return {
        id: item._id,
        name: item?.item?.name || '',
        ...item
      }
    });
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
  }
  onPromotionChange() {
    this.notifyCalculation();
  }
  onDeliveryChange(event) {
    if (event.value) {
      this.form.patchValue({
        deliveryId: event.value
      });
      let delivery = this.deliveries.find(delivery => {
        return delivery._id === event.value
      });
      if (delivery) {
        this.form.patchValue({
          deliveryFee: delivery.fee
        });
      }
      this.notifyCalculation();
    }
  }
  onDeliveryOptionChange(event) {
    if (event.value == 'self_pickup') {
      this.form.patchValue({
        deliveryFee: ''
      });
      this.notifyCalculation();
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
          this.promotions.concat(this.item.promotions);
        }
        this.notifyCalculation();
      }
    })
  }
  private validatePickup() {
    let form = this.form;
    return form.controls['isCustomerSaved'].value && form.controls['recipientName'].value && form.controls['phoneNumber'].value ||
          (!form.controls['isCustomerSaved'].value && form.controls['recipientName'].value && form.controls['phoneNumber'].value) ||
          (!form.controls['isCustomerSaved'].value && !form.controls['phoneNumber'].value);
  }
  private validateDelivery() {
    let form = this.form;
    return form.controls['isCustomerSaved'].value && form.controls['recipientName'].value && form.controls['phoneNumber'].value ||
           (!form.controls['isCustomerSaved'].value && 
              (form.controls['phoneNumber'].value || form.controls['address'].value || form.controls['postcode'].value || form.controls['state'].value) && 
                form.controls['recipientName'].value) ||
           (!form.controls['isCustomerSaved'].value && !(form.controls['phoneNumber'].value || form.controls['address'].value || form.controls['postcode'].value || form.controls['state'].value));
  }
  modifyItem() {
    let form = this.form;
    let etaDate = this.form.controls['etaDate'].value;
    let etaHour = this.form.controls['etaDateTimeHour'].value;
    let etaMin = this.form.controls['etaDateTimeMin'].value;
    
    if (!form.controls['recipientName'].value) {
      WsToastService.toastSubject.next({ content: 'Please enter recipient\'s name in delivery!', type: 'danger'});
      this.selectedTab.setValue(1);
      setTimeout(() => {
        this.recipientName.nativeElement.focus();
      }, 500);
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
        etaHour = null;
        etaMin = null
      }
    } else {
      return;
    }
    if (form.controls['isCompletedChecked'].value && !form.controls['completedAt'].value) {
      WsToastService.toastSubject.next({ content: 'Please enter completion date!', type: 'danger'});
      return;
    }
    if (form.value.promotion && (!form.value.numberOfPromotion || form.value.numberOfPromotion < 1 || form.value.numberOfPromotion > 10)) {
      WsToastService.toastSubject.next({ content: 'Number of promotion should be between 1 to 10!', type: 'danger'});
      return;
    }
    
    let invoice: Invoice = {
      customer: {
        recipientName: form.controls['recipientName'].value,
        address: {
          address: form.controls['address'].value,
          postcode: form.controls['postcode'].value,
          state: form.controls['state'].value,
          country: form.controls['country'].value,
        },
        phoneNumber: form.controls['phoneNumber'].value
      },
      delivery: {
        _id: form.value.deliveryId || undefined,
        fee: form.controls['deliveryFee'].value,
        etaDate: DateTimeHelper.getDateWithCurrentTimezone(new Date(etaDate)),
        etaHour: etaHour !== '' && etaHour > -1 && etaHour < 24 ? etaHour : null,
        etaMin: etaMin !== '' && etaMin > -1 && etaMin < 60 ? etaMin : null
      },
      items: this.cartItems,
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
      invoice['promotions'] = [{_id: form.controls['promotion'].value, quantity: +form.controls['numberOfPromotion'].value}];
    } else {
      invoice['promotions'] = []
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
    this.form.get('deliveryId').disable();
    this.form.get('deliveryFee').disable();
    this.form.get('deliveryOption').disable();
    this.form.get('recipientName').disable();
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
    this.form.get('deliveryId').enable();
    this.form.get('deliveryFee').enable();
    this.form.get('deliveryOption').enable();
    this.form.get('recipientName').enable();
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
    moveItemInArray(this.cartItems, event.previousIndex, event.currentIndex);
  }
  promotionDecrease() {
    let numberOfPromotion = this.form.value.numberOfPromotion || 1;
    numberOfPromotion--;
    if (numberOfPromotion < 1) {
      numberOfPromotion = 1;
    }
    this.form.patchValue({
      numberOfPromotion
    })
    this.notifyCalculation();
  }
  promotionIncrease() {
    let numberOfPromotion = this.form.value.numberOfPromotion || 1;
    numberOfPromotion++;
    if (numberOfPromotion <= 10) {
      this.form.patchValue({
        numberOfPromotion
      })
    }
    this.notifyCalculation();
  }
  promotionChange() {
    let numberOfPromotion = this.form.value.numberOfPromotion;
    if (numberOfPromotion > 10) {
      this.form.patchValue({
        numberOfPromotion: 10
      })
    }
    if (numberOfPromotion < 1) {
      this.form.patchValue({
        numberOfPromotion: 1
      })
    }
    this.notifyCalculation();
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
