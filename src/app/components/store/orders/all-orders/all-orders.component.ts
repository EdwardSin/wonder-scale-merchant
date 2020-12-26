import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { OrderReceipt } from '@objects/order-receipt';
import { Searchbar } from '@objects/searchbar';
import { AuthItemContributorService } from '@services/http/auth-store/contributor/auth-item-contributor.service';
import { AuthOrderContributorService } from '@services/http/auth-store/contributor/auth-order-contributor.service';
import { interval, Subject, Subscription } from 'rxjs';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.scss']
})
export class AllOrdersComponent implements OnInit {
  allOrders = [];
  keyword: string = '';
  selectedTab: string = 'new';
  searchController: Searchbar = new Searchbar;
  isHelpModalOpened: boolean;
  isModifyOrderModalOpened: boolean;
  isOrderInfoModalOpened: boolean;
  selectedItem: any;
  loading: WsLoading = new WsLoading;
  numberOfNewOrders: number = 0;
  numberOfPaidOrders: number = 0;
  numberOfInProgressOrders: number = 0;
  numberOfDeliveryOrders: number = 0;
  private ngUnsubscribe: Subject<any> = new Subject;
  refreshOrderReceiptsInterval: Subscription;
  constructor(private authOrderControbutorService: AuthOrderContributorService, private ref: ChangeDetectorRef,
    private router: Router, private route: ActivatedRoute,
    private authItemContributorService: AuthItemContributorService
    ) { 
    this.allOrders = this.authOrderControbutorService.allOrders;
    
  }
  ngOnInit(): void {
    this.selectedTab = this.route.snapshot.queryParams['tab'] || 'new';
    this.keyword = this.route.snapshot.queryParams['s_keyword'] || '';
    this.getOrderReceipts();
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(queryParams => {
      this.selectedTab = queryParams['tab'] || 'new';
      this.keyword = queryParams['s_keyword'] || '';
      this.loading.start();
      this.getOrderReceipts();
    });
    this.authOrderControbutorService.refreshOrderReceipts.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.getOrderReceipts();
      }
    });
    if (this.refreshOrderReceiptsInterval) {
      this.refreshOrderReceiptsInterval.unsubscribe();
    }
    this.refreshOrderReceipts();
  }
  getOrderReceipts() {
    this.authOrderControbutorService.getOrderReceipts({status: this.selectedTab, keyword: this.keyword}).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop())).subscribe(result => {
      if (result ) {
        this.allOrders = result['result'];
        if (result['meta']) {
          this.numberOfNewOrders = result['meta']['numberOfNewOrders'];
          this.numberOfPaidOrders = result['meta']['numberOfPaidOrders'];
          this.numberOfInProgressOrders = result['meta']['numberOfInProgressOrders'];
          this.numberOfDeliveryOrders = result['meta']['numberOfDeliveryOrders'];
        }
      }
    });
  }
  refreshOrderReceipts() {
    this.refreshOrderReceiptsInterval = interval(60 * 1000).pipe(switchMap(() => {return this.authOrderControbutorService.getOrderReceipts({status: this.selectedTab, keyword: this.keyword})}),
    takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result ) {
        this.allOrders = result['result'];
        if (result['meta']) {
          this.numberOfNewOrders = result['meta']['numberOfNewOrders'];
          this.numberOfPaidOrders = result['meta']['numberOfPaidOrders'];
          this.numberOfInProgressOrders = result['meta']['numberOfInProgressOrders'];
          this.numberOfDeliveryOrders = result['meta']['numberOfDeliveryOrders'];
        }
      }
    });
  }
  selectTabAndRefreshReceipts(tab) {
    this.selectedTab = tab;
    this.router.navigate([], {queryParams: {tab}});
  }
  openCreateOrderModal() {
    this.isModifyOrderModalOpened = true;
    this.selectedItem = null;
  }
  openEditOrderModal(order) {
    this.isOrderInfoModalOpened = true;
    this.selectedItem = order;
    this.ref.detectChanges();
  }
  trackOrderId(index: number, orderReceipt: OrderReceipt) {
    return orderReceipt._id;
  }
}
