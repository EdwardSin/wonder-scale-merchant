import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QrcodeRoutingModule } from './qrcode-routing.module';
import { QrcodeComponent } from '@components/store/tracking/qrcode/qrcode.component';
import { SharedModule } from '../../../public/shared/shared.module';


@NgModule({
  declarations: [QrcodeComponent],
  imports: [
    CommonModule,
    SharedModule,
    QrcodeRoutingModule
  ]
})
export class QrcodeModule { }
