import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StorePageRoutingModule } from './store-page-routing.module';
import { StorePageComponent } from '@components/store/store-page/store-page.component';
import { SharedModule } from '../../public/shared/shared.module';
import { MerchantPageComponent } from '@elements/merchant-page/merchant-page.component';
import { MerchantFooterComponent } from '@elements/mobile/merchant-footer/merchant-footer.component';
import { MerchantInfoComponent } from '@elements/mobile/merchant-info/merchant-info.component';
import { MerchantMenuComponent } from '@elements/mobile/merchant-menu/merchant-menu.component';
import { MerchantShareComponent } from '@elements/mobile/merchant-share/merchant-share.component';



@NgModule({
  declarations: [StorePageComponent, MerchantPageComponent, MerchantInfoComponent,
    MerchantFooterComponent,
    MerchantMenuComponent,
    MerchantShareComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    SharedModule,
    StorePageRoutingModule
  ]
})
export class StorePageModule { }
