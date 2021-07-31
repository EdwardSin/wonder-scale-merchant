import { Component, OnInit } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { AuthReviewContributorService } from '@services/http/auth-store/contributor/auth-review-contributor.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {
  reviews = [];
  reviewPage: number = 1;
  totalReviews: number = 0;
  loading: WsLoading = new WsLoading();
  lazyLoading: WsLoading = new WsLoading();

  private ngUnsubscribe: Subject<any> = new Subject();
  constructor(private authReviewContributorService: AuthReviewContributorService) { 
    this.getReviews();
  }
  ngAfterViewInit() {
    window.addEventListener('scroll', (event) => {
        const scrollTop = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        if ((scrollHeight - clientHeight - scrollTop) < 50) {
          if (!this.lazyLoading.isRunning() && this.totalReviews > this.reviews.length) {
            this.reviewPage++;
            this.getReviews(true);
          }
        }
    });
  }
  getReviews(lazyLoad=false) {
    if (lazyLoad) {
      this.lazyLoading.start();
    } else {
      this.loading.start();
    }
    this.authReviewContributorService.getReviews().pipe(takeUntil(this.ngUnsubscribe),
    finalize(() => {this.lazyLoading.stop(); this.loading.stop()})).subscribe(result => {
      this.totalReviews = result['total'];
      if (lazyLoad) {
        this.reviews = [...this.reviews, ...result['result']];
      } else {
        this.reviews = result['result'] || [];
      }
    }); 
  }
  ngOnInit(): void {
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
