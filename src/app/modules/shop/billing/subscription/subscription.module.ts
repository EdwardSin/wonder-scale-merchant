import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubscriptionRoutingModule } from './subscription-routing.module';
import { SubscriptionComponent } from '@components/shop/billing/subscription/subscription.component';
import { SharedModule } from 'src/app/modules/public/shared/shared.module';


@NgModule({
  declarations: [SubscriptionComponent],
  imports: [
    CommonModule,
    SharedModule,
    SubscriptionRoutingModule
  ]
})
export class SubscriptionModule { }
