import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvertisingComponent } from '@components/store/advertising/advertising.component';
import { AdvertisingRoutingModule } from './advertising-routing.module';
import { SharedModule } from '../../public/shared/shared.module';



@NgModule({
  declarations: [AdvertisingComponent],
  imports: [
    CommonModule,
    SharedModule,
    AdvertisingRoutingModule
  ]
})
export class AdvertisingModule { }
