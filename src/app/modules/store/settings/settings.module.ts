import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from '@components/store/settings/settings/settings.component';
import { SharedModule } from '../../public/shared/shared.module';
import { SettingsListComponent } from '@components/store/settings/settings-list/settings-list.component';


@NgModule({
  declarations: [
    SettingsComponent,
    SettingsListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule { }
