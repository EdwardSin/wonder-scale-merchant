import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { ScreenHelper } from '@helpers/screenhelper/screen.helper';
import { Invoice } from '@objects/invoice';
import { ScreenService } from '@services/general/screen.service';
import { AuthInvoiceContributorService } from '@services/http/auth-store/contributor/auth-invoice-contributor.service';
import { SharedNavbarService } from '@services/shared/shared-nav-bar.service';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { interval, Subject, Subscription } from 'rxjs';
import { delay, finalize, switchMap, takeUntil } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import * as _ from 'lodash';
import * as moment from 'moment';
import { WsMessageBarService } from '@elements/ws-message-bar/ws-message-bar.service';

export const DAY_FORMATS = {
  parse: {
    dateInput: 'MMM/YYYY',
  },
  display: {
    dateInput: 'DD/MMM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-all-invoices',
  templateUrl: './all-invoices.component.html',
  styleUrls: ['./all-invoices.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: DAY_FORMATS}
  ],
})
export class AllInvoicesComponent implements OnInit {
  allInvoices = [];
  keyword: string = '';
  page: number = 1;
  selectedTab: string = 'wait_for_approval';
  selectedDate = null;
  isHelpModalOpened: boolean;
  isModifyInvoiceModalOpened: boolean;
  isInvoiceInfoModalOpened: boolean;
  isAnalysisInvoiceModalOpened: boolean;
  selectedItem: any;
  loading: WsLoading = new WsLoading;
  invoiceLoading: WsLoading = new WsLoading;
  analysisLoading: WsLoading = new WsLoading;
  _statusColumns = sessionStorage.getItem('shownStatusColumns') || '["new", "paid", "in_progress", "delivered"]';
  statusColumns = JSON.parse(this._statusColumns);
  numberOfAllItems = 0;
  numberOfCurrentTotalItems = 0;
  isNavOpen: Boolean = false;
  numberOfNewInvoices: number = 0;
  numberOfWaitForApprovalInvoices: number = 0;
  numberOfPaidInvoices: number = 0;
  numberOfInProgressInvoices: number = 0;
  numberOfReadyInvoices: number = 0;
  numberOfDeliveryInvoices: number = 0;
  invoiceGroups = [];
  analysis = {
    target: 'items',
    status: ['new', 'paid', 'in_progress'],
    fromDate: moment().subtract(2, 'days').format('YYYY-MM-DD'),
    toDate: moment().add(7, 'days').format('YYYY-MM-DD'),
    isIncludedWithoutEta: true,
    isShownAllSubItems: false
  }
  currentAnalysis;
  itemsAnalysis = [];
  deliveryAnalysis = [];
  private ngUnsubscribe: Subject<any> = new Subject;
  refreshInvoicesInterval: Subscription;
  REFRESH_ALL_INVOICES_INTERVAL: number = 2 * 60 * 1000;
  isMobileSize: boolean;
  store;
  updatedAt;
  constructor(
    private authInvoiceContributorService: AuthInvoiceContributorService, private ref: ChangeDetectorRef,
    private router: Router, private route: ActivatedRoute,
    private screenService: ScreenService,
    private sharedNavbarService: SharedNavbarService,
    private sharedStoreService: SharedStoreService
    ) {
      this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(queryParams => {
        if (queryParams.page > 0 && (
          this.selectedTab !== queryParams['tab'] ||
          this.keyword !== queryParams['s_keyword'] ||
          this.page !== queryParams['page']
        )) {
          this.selectedDate = null;
          this.selectedTab = queryParams['tab'] || 'wait_for_approval';
          this.keyword = queryParams['s_keyword'] || '';
          this.page = queryParams['page'] || 1;
          this.getInvoices(true);
          this.router.navigate([], {queryParams: {tab: this.selectedTab, page: this.page, s_keyword: this.keyword}, queryParamsHandling: 'merge'});
        }
        if (queryParams.invoiceId && !queryParams.paid) {
          this.openEditInvoiceModal(queryParams.invoiceId);
        }
      });
  }
  ngOnInit(): void {
    this.isMobileSize = ScreenHelper.isMobileSize();
    this.selectedTab = this.route.snapshot.queryParams['tab'] || 'wait_for_approval';
    this.keyword = this.route.snapshot.queryParams['s_keyword'] || '';
    if (!this.route.snapshot.queryParams['page']) {
      this.router.navigate([], { queryParams: {page: 1}, queryParamsHandling: 'merge'});
    }
    this.authInvoiceContributorService.refreshInvoices.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.getInvoices();
      }
    });
    this.screenService.isMobileSize.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.isMobileSize = result;
    });
    if (this.refreshInvoicesInterval) {
      this.refreshInvoicesInterval.unsubscribe();
    }
    this.sharedNavbarService.isNavSubject.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.isNavOpen = res;
        this.ref.detectChanges();
      });
    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        DocumentHelper.setWindowTitleWithWonderScale('All Invoices - ' + result.name);
        this.store = result;
      }
    });
    this.authInvoiceContributorService.allInvoices.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.allInvoices = result.filter(invoice => {
        if (this.selectedTab === 'cancelled') {
          return invoice.status === 'cancelled' || invoice.status === 'refunded';
        } else if (this.selectedTab !== 'all') {
          return this.selectedTab === invoice.status;
        } else {
          return true;
        }
      })
      let invoiceGroup = this.invoiceGroups.find(invoice => invoice._id === this.selectedDate);
      if (invoiceGroup) {
        invoiceGroup.numberOfInvoices = this.allInvoices.length;
      }
    });
    this.authInvoiceContributorService.numberOfAllItems.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.numberOfAllItems = result;
    })
    this.authInvoiceContributorService.numberOfCurrentTotalItems.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.numberOfCurrentTotalItems = result;
    })
    this.authInvoiceContributorService.numberOfNewInvoices.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.numberOfNewInvoices = result;
    })
    this.authInvoiceContributorService.numberOfWaitForApprovalInvoices.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.numberOfWaitForApprovalInvoices = result;
    })
    this.authInvoiceContributorService.numberOfPaidInvoices.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.numberOfPaidInvoices = result;
    })
    this.authInvoiceContributorService.numberOfInProgressInvoices.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.numberOfInProgressInvoices = result;
    })
    this.authInvoiceContributorService.numberOfReadyInvoices.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.numberOfReadyInvoices = result;
    })
    this.authInvoiceContributorService.numberOfDeliveryInvoices.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.numberOfDeliveryInvoices = result;
    })
    this.authInvoiceContributorService.updatedAt.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.updatedAt = result;
    });
    this.refreshInvoices();
  }
  @HostListener('window:focus', ['$event'])
  onFocus(event) {
    this.getUnseenInvoicesSubscription().subscribe(result => {
      if (result['result']) {
        this.getRefreshNotification();
      }
    });
  }
  getInvoices(loading=false) {
    if (loading) {
      this.loading.start();
    }
    let isGroup = this.selectedTab === 'delivered' || this.selectedTab === 'in_progress' || this.selectedTab === 'ready' || this.selectedTab === 'completed';
    if (!isGroup) {
      let subscription = this.getInvoicesSubscription();
      subscription.pipe(finalize(() => {
        this.loading.stop();
        WsMessageBarService.close.next();
      })).subscribe(result => {
        if (result) {
          this.authInvoiceContributorService.allInvoices.next(result['result']);
          this.authInvoiceContributorService.updatedAt.next(new Date);
          if (result['meta']) {
            this.authInvoiceContributorService.numberOfAllItems.next(result['meta']['numberOfTotal']);
            this.authInvoiceContributorService.numberOfCurrentTotalItems.next(result['meta']['numberOfTotal']);
            this.authInvoiceContributorService.numberOfNewInvoices.next(result['meta']['numberOfNewInvoices']);
            this.authInvoiceContributorService.numberOfWaitForApprovalInvoices.next(result['meta']['numberOfWaitForApprovalInvoices']);
            this.authInvoiceContributorService.numberOfPaidInvoices.next(result['meta']['numberOfPaidInvoices']);
            this.authInvoiceContributorService.numberOfInProgressInvoices.next(result['meta']['numberOfInProgressInvoices']);
            this.authInvoiceContributorService.numberOfReadyInvoices.next(result['meta']['numberOfReadyInvoices']);
            this.authInvoiceContributorService.numberOfDeliveryInvoices.next(result['meta']['numberOfDeliveryInvoices']);
          }
        }
      });
    } else {
      let subscription = this.getInvoiceGroupSubscription()
      subscription.pipe(finalize(() => {
        this.loading.stop();
        WsMessageBarService.close.next();
      })).subscribe(result => {
        this.invoiceGroups = result['result'];
        this.authInvoiceContributorService.numberOfNewInvoices.next(result['meta']['numberOfNewInvoices']);
        this.authInvoiceContributorService.numberOfWaitForApprovalInvoices.next(result['meta']['numberOfWaitForApprovalInvoices']);
        this.authInvoiceContributorService.numberOfPaidInvoices.next(result['meta']['numberOfPaidInvoices']);
        this.authInvoiceContributorService.numberOfInProgressInvoices.next(result['meta']['numberOfInProgressInvoices']);
        this.authInvoiceContributorService.numberOfReadyInvoices.next(result['meta']['numberOfReadyInvoices']);
        this.authInvoiceContributorService.numberOfDeliveryInvoices.next(result['meta']['numberOfDeliveryInvoices']);
        if (this.selectedDate) {
          this.refreshDateGroup(this.selectedDate);
        }
      });
    }
  }
  triggerNotification () {
    WsMessageBarService.toastSubject.next({
      type: 'info',
      message: 'This board has been updated: ',
      linkLabel: 'Refresh',
      onLinkClick: this.getInvoices.bind(this)
    });
  }
  refreshInvoices() {
    this.refreshInvoicesInterval = interval(this.REFRESH_ALL_INVOICES_INTERVAL).pipe(switchMap(() => {
      return this.getUnseenInvoicesSubscription();
    }), takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result['result']) {
        this.getRefreshNotification();
      }
    });
  }
  getInvoicesSubscription() {
    let statuses = this.selectedTab == 'all' ? this.statusColumns : [this.selectedTab];
    return this.authInvoiceContributorService.getInvoices({ statuses, keyword: this.keyword, page: this.page, updatedAt: this.updatedAt }).pipe(
      takeUntil(this.ngUnsubscribe));
  }
  getInvoiceGroupSubscription() {
    let obj = {
      status: this.selectedTab,
      keyword: this.keyword,
      updatedAt: this.updatedAt
    }
    return this.authInvoiceContributorService.getInvoiceGroup(obj).pipe(takeUntil(this.ngUnsubscribe));
  }
  getUnseenInvoicesSubscription() {
    let obj = {updatedAt: this.updatedAt};
    return this.authInvoiceContributorService.getUnseenInvoices(obj).pipe(takeUntil(this.ngUnsubscribe));
  }
  getRefreshNotification () {
    WsMessageBarService.toastSubject.next({
      type: 'info',
      message: 'This board has been updated: ',
      linkLabel: 'Refresh',
      onLinkClick: this.getInvoices.bind(this)
    });
  }
  selectTabAndRefreshReceipts(tab) {
    this.router.navigate([], {queryParams: {tab, page: 1}});
  }
  openCreateInvoiceModal() {
    this.isModifyInvoiceModalOpened = true;
    this.selectedItem = null;
  }
  openAnalysisInvoiceModal() {
    this.isAnalysisInvoiceModalOpened = true;
  }
  openEditInvoiceModal(invoiceId) {
    this.selectedItem = null;
    this.isInvoiceInfoModalOpened = true;
    this.authInvoiceContributorService.getInvoice(invoiceId).pipe(delay(500), takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result['result']) {
        this.selectedItem = result['result'];
        this.ref.detectChanges();
      }
    });
  }
  closeInvoiceInfo() {
    this.router.navigate([], { queryParams: {invoiceId: null}, queryParamsHandling: 'merge'});
  }
  triggerStatusColumns(value) {
    if (this.statusColumns.includes(value)) {
      this.statusColumns = this.statusColumns.filter(x => x != value);
    } else {
      this.statusColumns.push(value);
    }
    this.router.navigate([], {queryParams: {page: 1}, queryParamsHandling: 'merge'});
    this.getInvoices(true);
    sessionStorage.setItem('shownStatusColumns', JSON.stringify(this.statusColumns));
  }
  trackInvoiceId(index: number, invoiceReceipt: Invoice) {
    return invoiceReceipt._id;
  }
  getAnalysis() {
    this.currentAnalysis = _.cloneDeep(this.analysis);
    this.itemsAnalysis = [];
    switch (this.currentAnalysis.target) {
      case 'items': this.getItemsAnalysis(); break;
      case 'delivery': this.getDeliveryAnalysis(); break;
    }
  }
  getItemsAnalysis() {
    let obj = {
      ...this.currentAnalysis
    };
    this.analysisLoading.start();
    this.authInvoiceContributorService.getInvoicesAnalysis(obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.analysisLoading.stop())).subscribe(result => {
      this.itemsAnalysis = result['result'];
    });
  }
  getDeliveryAnalysis() {
    let obj = {
      ...this.currentAnalysis
    }
    this.analysisLoading.start();
    this.authInvoiceContributorService.getInvoicesAnalysis(obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.analysisLoading.stop())).subscribe(result => {
      this.itemsAnalysis = result['result'];
    });
  }
  onDateGroupClicked(date) {
    if (this.selectedDate == date) {
      this.selectedDate = null;
    } else {
      this.selectedDate = date;
      this.invoiceLoading.start();
      this.refreshDateGroup(date);
    }
  }
  refreshDateGroup(date) {
    let targetDate: any = {etaDate: date};
    if (this.selectedTab === 'completed') {
      targetDate = { completedAt: date };
    }
    this.authInvoiceContributorService.getInvoices({statuses: [this.selectedTab], ...targetDate, keyword: this.keyword, numberPerPage: -1, page: 1, updatedAt: this.updatedAt }).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.invoiceLoading.stop())).subscribe(result => {
      this.authInvoiceContributorService.allInvoices.next(result['result']);
    });
  }
  navigate(event) {
    this.router.navigate([], { queryParams: {page: event}, queryParamsHandling: 'merge' });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
