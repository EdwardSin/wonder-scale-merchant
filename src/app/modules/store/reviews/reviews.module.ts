import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewsRoutingModule } from './reviews-routing.module';
import { ReviewsComponent } from '@components/store/reviews/reviews.component';
import { ElementModule } from '../../public/element/element.module';


@NgModule({
  declarations: [ReviewsComponent],
  imports: [
    CommonModule,
    ElementModule,
    ReviewsRoutingModule
  ]
})
export class ReviewsModule { }
