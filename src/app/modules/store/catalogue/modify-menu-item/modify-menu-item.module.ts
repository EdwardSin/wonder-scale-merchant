import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModifyMenuItemRoutingModule } from './modify-menu-item-routing.module';
import { ModifyMenuItemComponent } from '@components/store/catalogue/modify-menu-item/modify-menu-item.component';
import { SharedModule } from 'src/app/modules/public/shared/shared.module';

@NgModule({
  declarations: [ModifyMenuItemComponent],
  imports: [
    CommonModule,
    SharedModule,
    ModifyMenuItemRoutingModule
  ]
})
export class ModifyMenuItemModule { }
