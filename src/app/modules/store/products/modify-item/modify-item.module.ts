import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModifyItemRoutingModule } from './modify-item-routing.module';
import { ModifyItemComponent } from '@components/store/products/modify-item/modify-item.component';
import { SharedModule } from 'src/app/modules/public/shared/shared.module';
import { ElementModule } from 'src/app/modules/public/element/element.module';
import { ModifyItemTypeComponent } from '@components/store/products/modify-item-type/modify-item-type.component';


@NgModule({
  declarations: [ModifyItemComponent, ModifyItemTypeComponent],
  imports: [
    CommonModule,
    ElementModule,
    SharedModule,
    ModifyItemRoutingModule
  ]
})
export class ModifyItemModule { }
