import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WSFormBuilder } from '@builders/wsformbuilder';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { environment } from '@environments/environment';
import { Searchbar } from '@objects/searchbar';
import { AuthCustomerContributorService } from '@services/http/auth-store/contributor/auth-customer-contributor.service';
import { SharedNavbarService } from '@services/shared/shared-nav-bar.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  form: FormGroup;
  customers = [];
  selectedCustomer;
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
  queryParams = { page: 1, keyword: '', order: '', orderBy: 'asc' };
  numberOfAllItems = 0;
  numberOfCurrentTotalItems = 0;
  isNavOpen: Boolean = false;
  currentPage: number = 1;
  today = new Date;
  loading: WsLoading = new WsLoading;
  itemLoading: WsLoading = new WsLoading;
  isDefaultCustomerDetailsChecked: boolean;
  isModifyCustomerModalOpened: boolean;
  searchController: Searchbar = new Searchbar;
  modifyLoading: WsLoading = new WsLoading;
  environment = environment;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private authCustomerContributorService: AuthCustomerContributorService,
    private sharedNavbarService: SharedNavbarService,
    private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef) { 
    this.form = WSFormBuilder.createAddCustomerForm();
  }
  ngOnInit(): void {
    this.loading.start();
    this.authCustomerContributorService.refreshCustomers.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.getCustomers({
          keyword: this.queryParams.keyword || '',
          page: this.queryParams.page
        });
      }
    });
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(queryParam => {
      if (this.queryParams.keyword != queryParam.s_keyword || this.queryParams.page != queryParam.page || this.queryParams.order != queryParam.order || this.queryParams.orderBy != queryParam.by) {
        this.currentPage = queryParam['page'] || 1;
        this.queryParams = { keyword: queryParam['s_keyword'], page: queryParam['page'], order: queryParam['order'], orderBy: queryParam['by'] };
        this.getCustomers({
          keyword: this.queryParams.keyword || '',
          page: this.queryParams.page
        });
      }
    });
    this.sharedNavbarService.isNavSubject.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.isNavOpen = res;
        this.ref.detectChanges();
      });
  }
  setupCustomer() {
    if (this.selectedCustomer) {
      this.form.patchValue({
        firstName: this.selectedCustomer.firstName,
        lastName: this.selectedCustomer.lastName,
        email: this.selectedCustomer.email,
        phoneNumber: this.selectedCustomer.phoneNumber,
        dateOfBirth: this.selectedCustomer.dateOfBirth,
        gender: this.selectedCustomer.gender,
        deliveryFirstName: this.selectedCustomer.deliveryFirstName,
        deliveryLastName: this.selectedCustomer.deliveryLastName
      });
      if (!this.selectedCustomer.deliveryFirstName && !this.selectedCustomer.deliveryLastName) {
        this.isDefaultCustomerDetailsChecked = true;
        this.form.get('deliveryFirstName').disable();
        this.form.get('deliveryLastName').disable();
        this.form.patchValue({
          deliveryFirstName: this.form.controls['firstName'].value,
          deliveryLastName: this.form.controls['lastName'].value
        });
      }
      if (this.selectedCustomer.address) {
        this.form.patchValue({
          address: this.selectedCustomer.address.address,
          postcode: this.selectedCustomer.address.postcode,
          state: this.selectedCustomer.address.state,
          country: this.selectedCustomer.address.country
        })
      }
      this.ref.detectChanges();
    }
  }
  getCustomers({keyword, page}) {
    this.itemLoading.start();
    this.authCustomerContributorService.getCustomers({ keyword, page}).pipe(takeUntil(this.ngUnsubscribe), finalize(() => { this.loading.stop(); this.itemLoading.stop() })).subscribe(result => {
      if (result) {
        this.customers = result['result'];
        this.numberOfAllItems = result['total'];
        this.numberOfCurrentTotalItems = result['total'];
      }
    });
  }
  modifyCustomer() {
    let address = this.form.controls['address'].value;
    let postcode = this.form.controls['postcode'].value;
    let state = this.form.controls['state'].value;
    let country = this.form.controls['country'].value;
    if (this.form.status == 'VALID') {
      let obj = {
        firstName: this.form.controls['firstName'].value,
        lastName: this.form.controls['lastName'].value,
        email: this.form.controls['email'].value,
        phoneNumber: this.form.controls['phoneNumber'].value,
        dateOfBirth: this.form.controls['dateOfBirth'].value
      }
      if (this.form.controls['gender'].value) {
        obj['gender'] = this.form.controls['gender'].value;
      }
      if (!this.isDefaultCustomerDetailsChecked) {
        obj['deliveryFirstName'] = this.form.controls['deliveryFirstName'].value;
        obj['deliveryLastName'] = this.form.controls['deliveryLastName'].value;
      }
      if (address) {
        obj['address'] = {
          address,
          postcode,
          state,
          country
        }
      }
      this.modifyLoading.start();
      if (this.selectedCustomer) {
        obj['_id'] = this.selectedCustomer._id;
        this.authCustomerContributorService.updateCustomer(obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.modifyLoading.stop())).subscribe(result => {
          if (result && result['result']) {
            WsToastService.toastSubject.next({ content:'Customer is updated!', type: 'success'});
            this.isModifyCustomerModalOpened = false;
            this.selectedCustomer = null;
            this.authCustomerContributorService.refreshCustomers.next(true);
            this.form.reset();
          }
        });
      } else {
        this.authCustomerContributorService.addCustomer(obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.modifyLoading.stop())).subscribe(result => {
          if (result && result['result']) {
            WsToastService.toastSubject.next({ content:'Customer is added!', type: 'success'});
            this.isModifyCustomerModalOpened = false;
            this.authCustomerContributorService.refreshCustomers.next(true);
            this.form.reset();
          }
        });
      }
    } else {
      if (this.form.controls['firstName'].errors && this.form.controls['firstName'].errors.required) {
        WsToastService.toastSubject.next({ content: 'Please enter first name!', type: 'danger'});
      }
      else if (this.form.controls['firstName'].errors && this.form.controls['firstName'].errors.maxlength) {
        WsToastService.toastSubject.next({ content: 'First name must be less than 36 characters!', type: 'danger'});
      }
      else if (this.form.controls['lastName'].errors && this.form.controls['lastName'].errors.required) {
        WsToastService.toastSubject.next({ content: 'Please enter last name!', type: 'danger'});
      }
      else if (this.form.controls['lastName'].errors && this.form.controls['lastName'].errors.maxlength) {
        WsToastService.toastSubject.next({ content: 'Last name must be less than 36 characters!', type: 'danger'});
      }
      else if (this.form.controls['email'].errors && this.form.controls['email'].errors.email) {
        WsToastService.toastSubject.next({ content: 'Please enter a valid email!', type: 'danger'});
      }
      else if (this.form.controls['address'].errors || 
          this.form.controls['postcode'].errors || 
          this.form.controls['state'].errors || 
          this.form.controls['country'].errors) {
          WsToastService.toastSubject.next({ content: 'All related address fields must be filled!', type: 'danger'});
      }
      else if (this.form.controls['address'].errors && this.form.controls['address'].errors.maxlength) {
        WsToastService.toastSubject.next({ content: 'Address must be less than 128 characters!', type: 'danger'});
      }
    }
  }
  removeCustomer() {
    this.modifyLoading.start();
    if (this.selectedCustomer) {
      this.authCustomerContributorService.removeCustomer(this.selectedCustomer._id).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.modifyLoading.stop())).subscribe(result => {
        this.isModifyCustomerModalOpened = false;
        this.authCustomerContributorService.refreshCustomers.next(true);
        this.form.reset();
      });
    }
  }
  onDefaultCustomerDetailsCheck(event) {
    this.isDefaultCustomerDetailsChecked = event.checked;
    if (this.isDefaultCustomerDetailsChecked) {
      this.form.get('deliveryFirstName').disable();
      this.form.get('deliveryLastName').disable();
      this.form.patchValue({
        deliveryFirstName: this.form.controls['firstName'].value,
        deliveryLastName: this.form.controls['lastName'].value
      });
    } else {
      this.form.get('deliveryFirstName').enable();
      this.form.get('deliveryLastName').enable();
      this.form.patchValue({
        deliveryFirstName: '',
        deliveryLastName: ''
      });
    }
  }
  updateDeliveryFirstName(event) {
    if (this.isDefaultCustomerDetailsChecked) {
      this.form.controls['deliveryFirstName'].setValue(event.target.value);
    }
  }
  updateDeliveryLastName(event) {
    if (this.isDefaultCustomerDetailsChecked) {
      this.form.controls['deliveryLastName'].setValue(event.target.value);
    }
  }
  navigate(event) {
    this.router.navigate([], { queryParams: {page: event}, queryParamsHandling: 'merge' });
  }
  resetForm() {
    this.form.reset();
    this.selectedCustomer = null;
    this.isDefaultCustomerDetailsChecked = false;
    this.form.get('deliveryFirstName').enable();
    this.form.get('deliveryLastName').enable();
  }
  openModifyCustomerModal(obj?) {
    this.resetForm();
    if (obj) {
      this.selectedCustomer = obj
      this.setupCustomer();
    }
    this.isModifyCustomerModalOpened = true;
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
