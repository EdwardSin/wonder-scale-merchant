import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WSFormBuilder } from '@builders/wsformbuilder';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { environment } from '@environments/environment';
import { Searchbar } from '@objects/searchbar';
import { AuthPromotionContributorService } from '@services/http/auth-store/contributor/auth-promotion-contributor.service';
import { SharedNavbarService } from '@services/shared/shared-nav-bar.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.scss']
})
export class PromotionsComponent implements OnInit {
  form: FormGroup;
  promotions = [];
  selectedPromotion;
  queryParams = { page: 1, keyword: '', order: '', orderBy: 'asc' };
  numberOfAllItems = 0;
  numberOfCurrentTotalItems = 0;
  isNavOpen: Boolean = false;
  currentPage: number = 1;
  today = new Date;
  loading: WsLoading = new WsLoading;
  itemLoading: WsLoading = new WsLoading;
  isModifyPromotionModalOpened: boolean;
  searchController: Searchbar = new Searchbar;
  modifyLoading: WsLoading = new WsLoading;
  environment = environment;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private authPromotionContributorService: AuthPromotionContributorService,
    private sharedNavbarService: SharedNavbarService,
    private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef) {
    this.form = WSFormBuilder.createAddPromotionForm();
  }
  ngOnInit(): void {
    this.loading.start();
    this.authPromotionContributorService.refreshPromotions.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.getPromotions({
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
        this.getPromotions({
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
  setupPromotion() {
    if (this.selectedPromotion) {
      this.form.patchValue({
        isEnabled: this.selectedPromotion.isEnabled,
        title: this.selectedPromotion.title,
        discountOption: this.selectedPromotion.option,
        discountValue: (this.selectedPromotion.value || 0).toFixed(2),
        activeDate: this.selectedPromotion.activeDate,
        expiryDate: this.selectedPromotion.expiryDate,
        isActiveToday: this.selectedPromotion.activeDate == this.today.toISOString(),
        isExpiryDate: this.selectedPromotion.isExpiryDate
      });
      if (this.selectedPromotion.activeDate) {
        if (this.selectedPromotion.activeDate == this.today.toISOString()) {
          this.form.controls['activeDate'].disable();
        }
        this.today = new Date(this.selectedPromotion.activeDate);
      }
    }
  }
  getPromotions({ keyword, page }) {
    this.itemLoading.start();
    this.authPromotionContributorService.getPromotions({ keyword, page }).pipe(takeUntil(this.ngUnsubscribe), finalize(() => { this.loading.stop(); this.itemLoading.stop() })).subscribe(result => {
      if (result) {
        this.promotions = result['result'];
        this.numberOfAllItems = result['total'];
        this.numberOfCurrentTotalItems = result['total'];
      }
    });
  }
  modifyPromotion() {
    if (this.form.valid) {
      let obj = {
        isEnabled: this.form.controls['isEnabled'].value,
        title: this.form.controls['title'].value,
        option: this.form.controls['discountOption'].value,
        value: this.form.controls['discountValue'].value,
        activeDate: this.form.controls['activeDate'].value,
        expiryDate: this.getExpiryDate(this.form.controls['expiryDate'].value),
        isExpiryDate: this.form.controls['isExpiryDate'].value
      }
      if (this.form.controls['isActiveToday'].value) {
        let today = new Date();
        obj['activeDate'] = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      }
      if (this.form.controls['isExpiryDate'].value) {
        obj['expiryDate'] = null;
      }
      if (this.form.controls['isEnabled'].value && !this.form.controls['activeDate'].value) {
        WsToastService.toastSubject.next({ content: 'Please enter active date!', type: 'danger' });
        return;
      }
      if (this.form.controls['isEnabled'].value && !this.form.controls['isExpiryDate'].value && !this.form.controls['expiryDate'].value) {
        WsToastService.toastSubject.next({ content: 'Please enter expiry date!', type: 'danger' });
        return;
      }
      this.modifyLoading.start();
      if (this.selectedPromotion) {
        obj['_id'] = this.selectedPromotion._id;
        this.authPromotionContributorService.updatePromotion(obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.modifyLoading.stop())).subscribe(result => {
          if (result && result['result']) {
            WsToastService.toastSubject.next({ content: 'Promotion is updated!', type: 'success' });
            this.isModifyPromotionModalOpened = false;
            this.selectedPromotion = null;
            this.authPromotionContributorService.refreshPromotions.next(true);
          }
        });
      } else {
        this.authPromotionContributorService.addPromotion(obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.modifyLoading.stop())).subscribe(result => {
          if (result && result['result']) {
            WsToastService.toastSubject.next({ content: 'Promotion is added!', type: 'success' });
            this.isModifyPromotionModalOpened = false;
            this.authPromotionContributorService.refreshPromotions.next(true);
          }
        });
      }
    } else {
      if (this.form.controls['title'].errors && this.form.controls['title'].errors.required) {
        WsToastService.toastSubject.next({ content: 'Please enter title!', type: 'danger' });
      }
      else if (this.form.controls['discountValue'].errors && this.form.controls['discountValue'].errors.required) {
        WsToastService.toastSubject.next({ content: 'Please enter discount value!', type: 'danger' });
      }
      else if (this.form.controls['activeDate'].errors && this.form.controls['activeDate'].errors.matDatepickerMin) {
        WsToastService.toastSubject.next({ content: 'Active date is invalid!', type: 'danger' });
      }
      else if (this.form.controls['expiryDate'].errors && this.form.controls['expiryDate'].errors.matDatepickerMin) {
        WsToastService.toastSubject.next({ content: 'Expiry date is invalid!', type: 'danger' });
      }
    }
  }
  removePromotion() {
    this.modifyLoading.start();
    if (this.selectedPromotion) {
      this.authPromotionContributorService.removePromotion(this.selectedPromotion._id).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.modifyLoading.stop())).subscribe(result => {
        this.isModifyPromotionModalOpened = false;
        this.authPromotionContributorService.refreshPromotions.next(true);
        this.form.reset();
      });
    }
  }
  updateActiveDateToToday(event) {
    if (event.checked) {
      this.form.patchValue({
        activeDate: new Date(),
        isActiveToday: true
      })
      this.form.controls['activeDate'].disable();
      if (new Date(this.form.controls['expiryDate'].value) < new Date()) {
        this.form.controls['expiryDate'].setValue('');
      }
    } else {
      this.form.patchValue({
        isActiveToday: false
      })
      this.form.controls['activeDate'].enable();
    }
  }
  updateActiveDate(event) {
    if (event.value) {
      this.form.patchValue({
        isActiveToday: event.value.toISOString() == this.today.toISOString()
      });
      if (new Date(this.form.controls['expiryDate'].value) < event.value) {
        this.form.controls['expiryDate'].setValue('');
      }
    }
  }
  clickDiscountOption(event) {
    if (event) {
      this.form.patchValue({
        discountOption: event.value
      });
    }
  }
  navigate(event) {
    this.router.navigate([], { queryParams: { page: event }, queryParamsHandling: 'merge' });
  }
  resetForm() {
    this.form = WSFormBuilder.createAddPromotionForm();
    this.today = new Date;
    this.today.setHours(0, 0, 0, 0);
    this.selectedPromotion = null;
  }
  openModifyPromotionModal(obj?) {
    this.resetForm();
    if (obj) {
      this.selectedPromotion = obj;
      this.setupPromotion();
    }
    this.isModifyPromotionModalOpened = true;
  }
  valueToDecimal(event) {
    if (!isNaN(event.target.value) && (event.target.value >= 0)) {
      this.form.patchValue({
        discountValue: (+event.target.value).toFixed(2)
      });
    } else {
      this.form.patchValue({
        discountValue: 0
      });
    }
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
  getExpiryDate(date) {
    if (date) {
      date = new Date(date);
      date.setHours(23, 59, 59, 59);
      return date;
    }
    return null;
  }
  isExpired(promotion) {
    if (promotion.isExpiryDate || !promotion.expiryDate || new Date() < new Date(promotion.expiryDate)) {
      return false;
    }
    return true;
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
