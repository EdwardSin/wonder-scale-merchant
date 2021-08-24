import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { SharedLoadingService } from '@services/shared/shared-loading.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ScreenService } from '@services/general/screen.service';
import { ScreenHelper } from '@helpers/screenhelper/screen.helper';
import SwiperCode, {Navigation, Pagination} from 'swiper/core';

SwiperCode.use([Navigation, Pagination]);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'wonder-scale-merchant';
  screenLoading: Boolean;
  loadingLabel: string;
  isMoblieSize: boolean;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(
    private ref: ChangeDetectorRef,
    private screenService: ScreenService,
    private sharedLoadingService: SharedLoadingService) {
    this.screenService.isMobileSize.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.isMoblieSize = result;
    });
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenService.isMobileSize.next(ScreenHelper.isMobileSize());
  }
  ngOnInit() {
    this.sharedLoadingService.screenLoading.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (!result.loading) {
          setTimeout(() => {
            this.screenLoading = result.loading;
            this.ref.detectChanges();
          }, 500);
        } else {
          this.screenLoading = result.loading;
          this.loadingLabel = result.label;
          this.ref.detectChanges();
        }
      })
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
