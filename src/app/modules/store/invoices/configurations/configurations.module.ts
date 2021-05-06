import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationsRoutingModule } from './configurations-routing.module';
import { ConfigurationsComponent } from '@components/store/invoices/configurations/configurations.component';
import { SharedModule } from 'src/app/modules/public/shared/shared.module';


@NgModule({
  declarations: [ConfigurationsComponent],
  imports: [
    CommonModule,
    SharedModule,
    ConfigurationsRoutingModule
  ]
})
export class ConfigurationsModule { }
