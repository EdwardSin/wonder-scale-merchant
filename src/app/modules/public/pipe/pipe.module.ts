import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WsPassDatePipe } from '../../../pipes/ws-pass-date.pipe';
import { WsCurrencyPipe } from '../../../pipes/ws-currency.pipe';
import { WsLimitCtrlPipe } from '../../../pipes/ws-limit-ctrl.pipe';
import { WsDiscountconverterPipe } from '../../../pipes/ws-discountconverter.pipe';
import { PipeRoutingModule } from './pipe-routing.module';


@NgModule({
  declarations: [
    WsPassDatePipe,
    WsCurrencyPipe,
    WsDiscountconverterPipe,
    WsLimitCtrlPipe,
  ],
  imports: [
    CommonModule,
    PipeRoutingModule
  ],
  exports: [
    WsPassDatePipe,
    WsCurrencyPipe,
    WsDiscountconverterPipe,
    WsLimitCtrlPipe,
  ]
})
export class PipeModule { }
