import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderingConfigurationsRoutingModule } from './ordering-configurations-routing.module';
import { OrderingConfigurationsComponent } from '@components/store/ordering/ordering-configurations/ordering-configurations.component';
import { SharedModule } from 'src/app/modules/public/shared/shared.module';


@NgModule({
  declarations: [OrderingConfigurationsComponent],
  imports: [
    CommonModule,
    SharedModule,
    OrderingConfigurationsRoutingModule
  ]
})
export class OrderingConfigurationsModule { }
