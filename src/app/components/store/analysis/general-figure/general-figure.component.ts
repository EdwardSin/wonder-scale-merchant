import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { AuthAnalysisContributorService } from '@services/http/auth-store/contributor/auth-analysis-contributor.service';
import { AuthTrackContributorService } from '@services/http/auth-store/contributor/auth-track-contributor.service';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { Subject, timer } from 'rxjs';
import { delay, finalize, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-general-figure',
  templateUrl: './general-figure.component.html',
  styleUrls: ['./general-figure.component.scss']
})
export class GeneralFigureComponent implements OnInit {
  @ViewChild('salesFigureRef', { static: true }) salesFigureRef: ElementRef;
  @ViewChild('pageViewFigureRef', { static: true }) pageViewFigureRef: ElementRef;
  @ViewChild('deliveryFigureRef', { static: true }) deliveryFigureRef: ElementRef;
  REFRESH_INTERVAL = 10 * 1000;
  analysis = {
    totalMonthlySales: 0,
    lastMonthSales: 0,
    averageMonthlySales: 0,
    totalPageview: 0,
    currentMonthPageview: 0,
    lastMonthPageview: 0,
    totalMonthlyDelivery: 0,
    lastMonthDelivery: 0,
    totalMonthlyInvoices: 0,
    lastMonthInvoices: 0
  }
  generalAnalysisSubscription;
  loading: WsLoading = new WsLoading;
  store;
  private ngUnsubscribe: Subject<any> = new Subject();
  constructor(
    private authAnalysisContributorService: AuthAnalysisContributorService,
    private sharedStoreService: SharedStoreService) {
    
    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.store = result;
    })
  }

  ngOnInit(): void {
    this.loading.start();
    this.getGeneralAnalysis();
  }
  getGeneralAnalysis() {
    if (this.generalAnalysisSubscription) {
      this.generalAnalysisSubscription.unsubscribe();
    }
    this.generalAnalysisSubscription = timer(0, this.REFRESH_INTERVAL).pipe(switchMap(() => this.authAnalysisContributorService.getGeneralAnalysis()), takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.analysis = result['result'];
      this.authAnalysisContributorService.increment(this.salesFigureRef.nativeElement, 500, this.analysis.totalMonthlySales, true);
      this.authAnalysisContributorService.increment(this.pageViewFigureRef.nativeElement, 500, this.analysis.totalPageview);
      this.authAnalysisContributorService.increment(this.deliveryFigureRef.nativeElement, 500, this.analysis.totalMonthlyDelivery);
      this.loading.stop();
    });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
