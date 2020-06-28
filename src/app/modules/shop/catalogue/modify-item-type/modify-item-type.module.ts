import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModifyItemTypeRoutingModule } from './modify-item-type-routing.module';
import { ModifyItemTypeComponent } from '@components/shop/catalogue/modify-item-type/modify-item-type.component';
import { SharedModule } from 'src/app/modules/public/shared/shared.module';


@NgModule({
  declarations: [ModifyItemTypeComponent],
  imports: [
    CommonModule,
    SharedModule,
    ModifyItemTypeRoutingModule
  ]
})
export class ModifyItemTypeModule { }
