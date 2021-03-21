import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { AuthAnalysisContributorService } from '@services/http/auth-store/contributor/auth-analysis-contributor.service';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent implements OnInit {
  analysisType: string = '';
  store;
  selectedPackage: string;
  isExportSalesModalOpened: boolean;
  loading: WsLoading = new WsLoading();
  refreshFunction: Function;
  refreshLoading: boolean;
  private ngUnsubscribe: Subject<any> = new Subject();
  constructor(private router: Router,
    private route: ActivatedRoute,
    private authAnalysisContributorService: AuthAnalysisContributorService,
    private sharedStoreService: SharedStoreService) {
    if (this.route.snapshot['_urlSegment'].segments.length == 4) {
      this.analysisType = this.route.snapshot['_urlSegment'].segments[3].path;
    }
    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.store = result;
      DocumentHelper.setWindowTitleWithWonderScale('Analysis - ' + result.name);
      if (result && result.package) {
        this.selectedPackage = result.package.name;
      }
    })
    this.router.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe(event => {
        if (event instanceof NavigationEnd) {
          if (this.route.snapshot['_urlSegment'].segments.length == 4) {
            this.analysisType = this.route.snapshot['_urlSegment'].segments[3].path;
          }
        }
    });
  }

  ngOnInit(): void {
    this.authAnalysisContributorService.refreshFunction.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.refreshFunction = result;
    });
    this.authAnalysisContributorService.refreshLoading.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.refreshLoading = result;
    });
  }
  changeAnalysisType(event) {
    this.router.navigate(['/stores', this.store.username, 'analysis', event.value]);
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
