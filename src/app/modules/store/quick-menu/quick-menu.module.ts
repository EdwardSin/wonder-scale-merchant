import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuickMenuRoutingModule } from './quick-menu-routing.module';
import { QuickMenuComponent } from '@components/store/quick-menu/quick-menu.component';
import { SharedModule } from '../../public/shared/shared.module';


@NgModule({
  declarations: [QuickMenuComponent],
  imports: [
    CommonModule,
    SharedModule,
    QuickMenuRoutingModule
  ]
})
export class QuickMenuModule { }
