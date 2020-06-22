import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../../public/shared/shared.module';
import { DashboardComponent } from '@components/shop/dashboard/dashboard.component';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ChartsModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
