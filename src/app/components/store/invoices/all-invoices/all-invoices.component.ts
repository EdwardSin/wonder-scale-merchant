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
import { delay, finalize, map, switchMap, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import { WsMessageBarService } from '@elements/ws-message-bar/ws-message-bar.service';

@Component({
  selector: 'app-all-invoices',
  templateUrl: './all-invoices.component.html',
  styleUrls: ['./all-invoices.component.scss']
})
export class AllInvoicesComponent implements OnInit {
  allInvoices = [];
  keyword: string = '';
  page: number = 1;
  selectedTab: string = 'new';
  selectedDate = null;
  isHelpModalOpened: boolean;
  isModifyInvoiceModalOpened: boolean;
  isInvoiceInfoModalOpened: boolean;
  selectedItem: any;
  loading: WsLoading = new WsLoading;
  invoiceLoading: WsLoading = new WsLoading;
  _statusColumns = sessionStorage.getItem('shownStatusColumns') || '["new", "paid", "in_progress", "delivered"]';
  statusColumns = JSON.parse(this._statusColumns);
  numberOfAllItems = 0;
  numberOfCurrentTotalItems = 0;
  isNavOpen: Boolean = false;
  numberOfNewInvoices: number = 0;
  numberOfPaidInvoices: number = 0;
  numberOfInProgressInvoices: number = 0;
  numberOfReadyInvoices: number = 0;
  numberOfDeliveryInvoices: number = 0;
  invoiceGroups = [];
  private ngUnsubscribe: Subject<any> = new Subject;
  refreshInvoicesInterval: Subscription;
  REFRESH_ALL_INVOICES_INTERVAL: number = 2 * 60 * 1000;
  isMobileSize: boolean;
  updatedAt;
  constructor(private authInvoiceControbutorService: AuthInvoiceContributorService, private ref: ChangeDetectorRef,
    private router: Router, private route: ActivatedRoute,
    private screenService: ScreenService,
    private sharedNavbarService: SharedNavbarService,
    private sharedStoreService: SharedStoreService
    ) {
  }
  ngOnInit(): void {
    this.isMobileSize = ScreenHelper.isMobileSize();
    this.selectedTab = this.route.snapshot.queryParams['tab'] || 'new';
    this.keyword = this.route.snapshot.queryParams['s_keyword'] || '';
    this.getInvoices(true);
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(queryParams => {
      if (this.selectedTab !== queryParams['tab'] ||
          this.keyword !== queryParams['s_keyword'] ||
          this.page !== queryParams['page']) {
        this.selectedDate = null;
        this.selectedTab = queryParams['tab'] || 'new';
        this.keyword = queryParams['s_keyword'] || '';
        this.page = queryParams['page'] || 1;
        this.getInvoices(true);
      }
    });
    this.authInvoiceControbutorService.refreshInvoices.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
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
      }
    });
    this.authInvoiceControbutorService.allInvoices.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
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
    this.authInvoiceControbutorService.numberOfAllItems.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.numberOfAllItems = result;
    })
    this.authInvoiceControbutorService.numberOfCurrentTotalItems.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.numberOfCurrentTotalItems = result;
    })
    this.authInvoiceControbutorService.numberOfNewInvoices.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.numberOfNewInvoices = result;
    })
    this.authInvoiceControbutorService.numberOfPaidInvoices.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.numberOfPaidInvoices = result;
    })
    this.authInvoiceControbutorService.numberOfInProgressInvoices.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.numberOfInProgressInvoices = result;
    })
    this.authInvoiceControbutorService.numberOfReadyInvoices.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.numberOfReadyInvoices = result;
    })
    this.authInvoiceControbutorService.numberOfDeliveryInvoices.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.numberOfDeliveryInvoices = result;
    })
    this.authInvoiceControbutorService.updatedAt.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
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
    let isGroup = this.selectedTab === 'delivered' || this.selectedTab === 'in_progress' || this.selectedTab === 'ready';
    if (!isGroup) {
      let subscription = this.getInvoicesSubscription();
      subscription.pipe(finalize(() => {
        this.loading.stop();
        WsMessageBarService.close.next();
      })).subscribe(result => {
        if (result) {
          this.authInvoiceControbutorService.allInvoices.next(result['result']);
          this.authInvoiceControbutorService.updatedAt.next(new Date);
          if (result['meta']) {
            this.authInvoiceControbutorService.numberOfAllItems.next(result['meta']['numberOfTotal']);
            this.authInvoiceControbutorService.numberOfCurrentTotalItems.next(result['meta']['numberOfTotal']);
            this.authInvoiceControbutorService.numberOfNewInvoices.next(result['meta']['numberOfNewInvoices']);
            this.authInvoiceControbutorService.numberOfPaidInvoices.next(result['meta']['numberOfPaidInvoices']);
            this.authInvoiceControbutorService.numberOfInProgressInvoices.next(result['meta']['numberOfInProgressInvoices']);
            this.authInvoiceControbutorService.numberOfReadyInvoices.next(result['meta']['numberOfReadyInvoices']);
            this.authInvoiceControbutorService.numberOfDeliveryInvoices.next(result['meta']['numberOfDeliveryInvoices']);
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
        this.authInvoiceControbutorService.numberOfNewInvoices.next(result['meta']['numberOfNewInvoices']);
        this.authInvoiceControbutorService.numberOfPaidInvoices.next(result['meta']['numberOfPaidInvoices']);
        this.authInvoiceControbutorService.numberOfInProgressInvoices.next(result['meta']['numberOfInProgressInvoices']);
        this.authInvoiceControbutorService.numberOfReadyInvoices.next(result['meta']['numberOfReadyInvoices']);
        this.authInvoiceControbutorService.numberOfDeliveryInvoices.next(result['meta']['numberOfDeliveryInvoices']);
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
    return this.authInvoiceControbutorService.getInvoices({ statuses, keyword: this.keyword, page: this.page, updatedAt: this.updatedAt }).pipe(
      takeUntil(this.ngUnsubscribe));
  }
  getInvoiceGroupSubscription() {
    let obj = {
      status: this.selectedTab
    }
    return this.authInvoiceControbutorService.getInvoiceGroup(obj).pipe(takeUntil(this.ngUnsubscribe));
  }
  getUnseenInvoicesSubscription() {
    let obj = {updatedAt: this.updatedAt};
    return this.authInvoiceControbutorService.getUnseenInvoices(obj).pipe(takeUntil(this.ngUnsubscribe));
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
  openEditInvoiceModal(invoice) {
    this.selectedItem = null;
    this.isInvoiceInfoModalOpened = true;
    this.authInvoiceControbutorService.getInvoice(invoice).pipe(delay(500), takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result['result']) {
        this.selectedItem = result['result'];
        this.ref.detectChanges();
      }
    });
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
  onDateGroupClicked(date) {
    if (this.selectedDate == date) {
      this.selectedDate = null;
    } else {
      this.selectedDate = date;
      this.invoiceLoading.start();
      this.authInvoiceControbutorService.getInvoices({statuses: [this.selectedTab], etaDate: date, keyword: this.keyword, numberPerPage: -1, page: 1, updatedAt: this.updatedAt }).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.invoiceLoading.stop())).subscribe(result => {
        this.authInvoiceControbutorService.allInvoices.next(result['result']);
      });
    }
  }
  navigate(event) {
    this.router.navigate([], { queryParams: {page: event}, queryParamsHandling: 'merge' });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
