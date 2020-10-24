import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdvancedRoutingModule } from './advanced-routing.module';
import { SharedModule } from 'src/app/modules/public/shared/shared.module';
import { AdvancedComponent } from '@components/store/settings/advanced/advanced.component';


@NgModule({
  declarations: [
    AdvancedComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdvancedRoutingModule
  ]
})
export class AdvancedModule { }
