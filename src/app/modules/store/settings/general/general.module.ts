import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralRoutingModule } from './general-routing.module';
import { SharedModule } from 'src/app/modules/public/shared/shared.module';
import { GeneralComponent } from '@components/store/settings/general/general.component';


@NgModule({
  declarations: [
    GeneralComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    GeneralRoutingModule
  ]
})
export class GeneralModule { }
