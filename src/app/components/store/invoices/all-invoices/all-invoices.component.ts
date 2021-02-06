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
  selectedDate;
  isHelpModalOpened: boolean;
  isModifyInvoiceModalOpened: boolean;
  isInvoiceInfoModalOpened: boolean;
  selectedItem: any;
  loading: WsLoading = new WsLoading;
  _statusColumns = sessionStorage.getItem('shownStatusColumns') || '["new", "paid", "in_progress", "delivered"]';
  statusColumns = JSON.parse(this._statusColumns);
  numberOfAllItems = 0;
  numberOfCurrentTotalItems = 0;
  isNavOpen: Boolean = false;
  numberOfNewInvoices: number = 0;
  numberOfPaidInvoices: number = 0;
  numberOfInProgressInvoices: number = 0;
  numberOfDeliveryInvoices: number = 0;
  private ngUnsubscribe: Subject<any> = new Subject;
  refreshInvoicesInterval: Subscription;
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
        } else {
          return this.selectedTab === invoice.status;
        }
      })
      this.allInvoices = this.groupInvoices(this.allInvoices);
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
          this.authInvoiceControbutorService.numberOfDeliveryInvoices.next(result['meta']['numberOfDeliveryInvoices']);
        }
      }
    });
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
    this.refreshInvoicesInterval = interval(120*1000).pipe(switchMap(() => {
      return this.getUnseenInvoicesSubscription();
    }), takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result['result']) {
        this.getRefreshNotification();
      }
    });
  }
  getInvoicesSubscription() {
    let statuses = this.selectedTab == 'all' ? this.statusColumns : [this.selectedTab];
    let numberPerPage = -1;
    return this.authInvoiceControbutorService.getInvoices({ statuses, keyword: this.keyword, page: this.page, numberPerPage, updatedAt: this.updatedAt }).pipe(
      takeUntil(this.ngUnsubscribe));
  }
  groupInvoices(invoices) {
    let tempInvoices = [];
    if (this.selectedTab == 'delivered' || this.selectedTab == 'in_progress') {
      invoices = _.chain(invoices).sortBy(invoice => {
        return invoice.deliveryOption
      })
        .sortBy((invoice) => {
          if (invoice && invoice.delivery && invoice.delivery.etaDate) {
            let deliveryDate = new Date(invoice.delivery.etaDate);
            if (invoice.delivery.etaHour > -1) {
              deliveryDate.setHours(invoice.delivery.etaHour);
              deliveryDate.setMinutes(invoice.delivery.etaMin);
            }
            return deliveryDate;
          }
        }).value();
      invoices = _.groupBy(invoices, (invoice) => {
        if (invoice && invoice.delivery && invoice.delivery.etaDate) {
          return new Date(invoice.delivery.etaDate)
        }
      });
      for (let date of Object.keys(invoices)) {
        tempInvoices.push({
          date: date !== 'undefined' ? date : 'others',
          data: invoices[date]
        })
      }
      invoices = tempInvoices;
    }
    return invoices;
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
    this.router.navigate([], {queryParams: {tab}});
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
