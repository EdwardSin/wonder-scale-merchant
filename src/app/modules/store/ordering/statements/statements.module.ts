import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatementsRoutingModule } from './statements-routing.module';
import { StatementsComponent } from '@components/store/ordering/statements/statements.component';
import { SharedModule } from 'src/app/modules/public/shared/shared.module';


@NgModule({
  declarations: [StatementsComponent],
  imports: [
    CommonModule,
    SharedModule,
    StatementsRoutingModule
  ]
})
export class StatementsModule { }
