import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModifyItemRoutingModule } from './modify-item-routing.module';
import { ModifyItemComponent } from '@components/store/catalogue/modify-item/modify-item.component';
import { SharedModule } from 'src/app/modules/public/shared/shared.module';


@NgModule({
  declarations: [ModifyItemComponent],
  imports: [
    CommonModule,
    SharedModule,
    ModifyItemRoutingModule
  ]
})
export class ModifyItemModule { }
