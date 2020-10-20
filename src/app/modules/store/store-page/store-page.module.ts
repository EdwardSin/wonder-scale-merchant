import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StorePageRoutingModule } from './store-page-routing.module';
import { StorePageComponent } from '@components/store/store-page/store-page.component';
import { SharedModule } from '../../public/shared/shared.module';
import { MerchantPageComponent } from '@elements/merchant-page/merchant-page.component';


@NgModule({
  declarations: [StorePageComponent, MerchantPageComponent],
  imports: [
    CommonModule,
    SharedModule,
    StorePageRoutingModule
  ]
})
export class StorePageModule { }
