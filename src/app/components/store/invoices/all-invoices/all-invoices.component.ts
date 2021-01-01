import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { ScreenHelper } from '@helpers/screenhelper/screen.helper';
import { Invoice } from '@objects/invoice';
import { ScreenService } from '@services/general/screen.service';
import { AuthInvoiceContributorService } from '@services/http/auth-store/contributor/auth-invoice-contributor.service';
import { SharedNavbarService } from '@services/shared/shared-nav-bar.service';
import { interval, Subject, Subscription } from 'rxjs';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';

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
  constructor(private authInvoiceControbutorService: AuthInvoiceContributorService, private ref: ChangeDetectorRef,
    private router: Router, private route: ActivatedRoute,
    private screenService: ScreenService,
    private sharedNavbarService: SharedNavbarService
    ) { 
    this.allInvoices = this.authInvoiceControbutorService.allInvoices;
  }
  ngOnInit(): void {
    this.isMobileSize = ScreenHelper.isMobileSize();
    this.selectedTab = this.route.snapshot.queryParams['tab'] || 'new';
    this.keyword = this.route.snapshot.queryParams['s_keyword'] || '';
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(queryParams => {
      this.selectedTab = queryParams['tab'] || 'new';
      this.keyword = queryParams['s_keyword'] || '';
      this.page = queryParams['page'] || 1;
      this.getInvoices(true);
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
    this.refreshInvoices();
  }
  getInvoices(loading=false) {
    let statuses = this.selectedTab == 'all' ? this.statusColumns: [this.selectedTab];
    if (loading) {
      this.loading.start();
    }
    this.authInvoiceControbutorService.getInvoices({statuses, keyword: this.keyword, page: this.page}).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop())).subscribe(result => {
      if (result) {
        this.allInvoices = result['result'];
        if (result['meta']) {
          this.numberOfAllItems = result['meta']['numberOfTotal'];
          this.numberOfCurrentTotalItems = result['meta']['numberOfTotal'];
          this.numberOfNewInvoices = result['meta']['numberOfNewInvoices'];
          this.numberOfPaidInvoices = result['meta']['numberOfPaidInvoices'];
          this.numberOfInProgressInvoices = result['meta']['numberOfInProgressInvoices'];
          this.numberOfDeliveryInvoices = result['meta']['numberOfDeliveryInvoices'];
        }
      }
    });
  }
  refreshInvoices() {
    this.refreshInvoicesInterval = interval(60 * 1000).pipe(switchMap(() => {
      let statuses = this.selectedTab == 'all' ? this.statusColumns: [this.selectedTab];
      return this.authInvoiceControbutorService.getInvoices({statuses: statuses, keyword: this.keyword})}),
    takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.allInvoices = result['result'];
        if (result['meta']) {
          this.numberOfAllItems = result['meta']['numberOfTotal'];
          this.numberOfCurrentTotalItems = result['meta']['numberOfTotal'];
          this.numberOfNewInvoices = result['meta']['numberOfNewInvoices'];
          this.numberOfPaidInvoices = result['meta']['numberOfPaidInvoices'];
          this.numberOfInProgressInvoices = result['meta']['numberOfInProgressInvoices'];
          this.numberOfDeliveryInvoices = result['meta']['numberOfDeliveryInvoices'];
        }
      }
    });
  }
  selectTabAndRefreshReceipts(tab) {
    this.selectedTab = tab;
    this.router.navigate([], {queryParams: {tab}});
  }
  openCreateInvoiceModal() {
    this.isModifyInvoiceModalOpened = true;
    this.selectedItem = null;
  }
  openEditInvoiceModal(invoice) {
    this.isInvoiceInfoModalOpened = true;
    this.selectedItem = invoice;
    this.ref.detectChanges();
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
  navigate(event) {
    this.router.navigate([], { queryParams: {page: event}, queryParamsHandling: 'merge' });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
