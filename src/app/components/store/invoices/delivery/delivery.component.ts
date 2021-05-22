import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WsFormBuilder } from '@builders/wsformbuilder';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { environment } from '@environments/environment';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { Delivery } from '@objects/delivery';
import { Searchbar } from '@objects/searchbar';
import { ScreenService } from '@services/general/screen.service';
import { AuthDeliveryContributorService } from '@services/http/auth-store/contributor/auth-delivery-contributor.service';
import { SharedNavbarService } from '@services/shared/shared-nav-bar.service';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent implements OnInit {
  form: FormGroup;
  store;
  deliveries: Array<Delivery> = [];
  displayedDeliveries: Array<Delivery> = [];
  selectedDelivery;
  queryParams = { page: 1, keyword: '', order: '', orderBy: 'asc'};
  numberOfAllItems = 0;
  numberOfCurrentTotalItems = 0;
  isNavOpen: boolean = false;
  currentPage: number = 1;
  locationName: Array<string> = [];
  loading: WsLoading = new WsLoading;
  itemLoading: WsLoading = new WsLoading;
  isModifyDeliveryModalOpened: boolean;
  isPreviewDeliveryModalOpened: boolean;
  isMobileSize: boolean;
  searchController: Searchbar = new Searchbar;
  modifyLoading: WsLoading = new WsLoading;
  createDeliveryLoading: WsLoading = new WsLoading;
  environment = environment;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private authDeliveryContributorService: AuthDeliveryContributorService,
    private sharedNavbarService: SharedNavbarService,
    private route: ActivatedRoute,
    private router: Router,
    private screenService: ScreenService,
    private sharedStoreService: SharedStoreService,
    private ref: ChangeDetectorRef) { 
      this.form = WsFormBuilder.createDeliveryForm();
  }

  ngOnInit(): void {
    this.loading.start();
    this.authDeliveryContributorService.refreshDeliveries.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.getDeliveries({
          keyword: this.queryParams.keyword || '',
          page: this.queryParams.page
        });
      }
    });
    this.searchController.searchKeyword = this.route.snapshot['queryParams']['s_keyword'];
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(queryParam => {
      if (this.queryParams.keyword != queryParam.s_keyword || this.queryParams.page != queryParam.page || this.queryParams.order != queryParam.order || this.queryParams.orderBy != queryParam.by) {
        this.currentPage = queryParam['page'] || 1;
        this.queryParams = { keyword: queryParam['s_keyword'], page: queryParam['page'], order: queryParam['order'], orderBy: queryParam['by'] };
        this.loading.start();
        this.getDeliveries({
          keyword: this.queryParams.keyword || '',
          page: this.queryParams.page
        });
      }
    });
    this.screenService.isMobileSize.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.isMobileSize = result;
    })
    this.sharedNavbarService.isNavSubject.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.isNavOpen = res;
        this.ref.detectChanges();
      });
    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.store = result;
        DocumentHelper.setWindowTitleWithWonderScale('Delivery - ' + result.name);
      }
    });
  }
  setupDelivery() {
    if (this.selectedDelivery) {
      this.form.patchValue({
        isEnabled: this.selectedDelivery.isEnabled,
        fee: (this.selectedDelivery.fee).toFixed(2)
      });
      this.locationName = this.selectedDelivery.name;
    }
  }
  modifyDelivery() {
    if (!this.form.valid) {
      if (this.form.controls['name'].errors && this.form.controls['name'].errors.required) {
        WsToastService.toastSubject.next({ content: 'Please enter a location name!', type: 'danger' });
      }
      else if (this.form.controls['fee'].errors && this.form.controls['fee'].errors.required) {
        WsToastService.toastSubject.next({ content: 'Please enter delivery fee!', type: 'danger' });
      }
    } else {
      this.modifyDeliveryCallback();
    }
  }
  removeDelivery() {
    this.modifyLoading.start();
    if (this.selectedDelivery) {
      this.authDeliveryContributorService.removeDelivery(this.selectedDelivery._id).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.modifyLoading.stop())).subscribe(result => {
        this.isModifyDeliveryModalOpened = false;
        this.authDeliveryContributorService.refreshDeliveries.next(true);
        this.form.reset();
      });
    }
  }
  getDeliveries({ keyword, page }) {
    this.itemLoading.start();
    this.authDeliveryContributorService.getDeliveries({ keyword, page }).pipe(takeUntil(this.ngUnsubscribe), finalize(() => { this.loading.stop(); this.itemLoading.stop() })).subscribe(result => {
      if (result) {
        this.deliveries = result['result'];
        this.numberOfAllItems = result['total'];
        this.numberOfCurrentTotalItems = result['total'];
        this.store.deliveries = this.deliveries;
        this.sharedStoreService.store.next(this.store);
      }
    });
  }
  navigate(event) {
    this.router.navigate([], { queryParams: { page: event }, queryParamsHandling: 'merge' });
  }
  resetForm() {
    this.form = WsFormBuilder.createDeliveryForm();
    this.selectedDelivery = null;
    this.locationName = [];
  }
  openModifyDeliveryModal(obj?) {
    this.resetForm();
    if (obj) {
      this.selectedDelivery = obj;
      this.setupDelivery();
    }
    this.isModifyDeliveryModalOpened = true;
  }
  openPreviewDeliveryModal() {
    this.isPreviewDeliveryModalOpened = true;
    this.displayedDeliveries = this.deliveries.filter(delivery => delivery.isEnabled);
  }
  modifyDeliveryCallback() {
    if (this.form.valid && this.validateLocationName()) {
      let obj = {
        isEnabled: this.form.value.isEnabled,
        name: _.compact(this.locationName),
        fee: this.form.controls['fee'].value || 0
      }
      this.modifyLoading.start();
      if (this.selectedDelivery) {
        obj['_id'] = this.selectedDelivery._id;
        this.authDeliveryContributorService.updateDelivery(obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.modifyLoading.stop())).subscribe(result => {
          if (result && result['result']) {
            WsToastService.toastSubject.next({ content: 'Delivery is updated!', type: 'success' });
            this.isModifyDeliveryModalOpened = false;
            this.selectedDelivery = null;
            this.authDeliveryContributorService.refreshDeliveries.next(true);
          }
        });
      } else {
        this.authDeliveryContributorService.addDelivery(obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.modifyLoading.stop())).subscribe(result => {
          if (result && result['result']) {
            WsToastService.toastSubject.next({ content: 'Delivery is added!', type: 'success' });
            this.isModifyDeliveryModalOpened = false;
            this.authDeliveryContributorService.refreshDeliveries.next(true);
          }
        });
      }
    }
  }
  validateLocationName() {
    let locationName = this.locationName.filter(name => name.trim());
    if (locationName.length) {
      return _.compact(locationName);
    } else {
      WsToastService.toastSubject.next({ content: 'Please enter a valid location name!', type: 'danger'});
      return false;
    }
  }
  valueToDecimal(event) {
    if (!isNaN(event.target.value) && (event.target.value >= 0)) {
      this.form.patchValue({
        fee: (+event.target.value).toFixed(2)
      });
    } else {
      this.form.patchValue({
        fee: 0
      });
    }
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
