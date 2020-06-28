import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopListRoutingModule } from './shop-list-routing.module';
import { ShopListComponent } from '../../components/shop-list/shop-list.component';
import { SharedModule } from '../public/shared/shared.module';
import { AllShopsComponent } from '@components/shop-list/all-shops/all-shops.component';
import { PendingShopsComponent } from '@components/shop-list/pending-shops/pending-shops.component';
import { PendingShopComponent } from '@components/shop-list/pending-shop/pending-shop.component';
import { ShopListControllerComponent } from '@components/shop-list/shop-list-controller/shop-list-controller.component';
import { ActiveShopComponent } from '@components/shop-list/active-shop/active-shop.component';

@NgModule({
  declarations: [
    ShopListComponent,
    AllShopsComponent,
    PendingShopsComponent,
    PendingShopComponent,
    ActiveShopComponent,
    ShopListControllerComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ShopListRoutingModule
  ]
})
export class ShopListModule { }
