import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffSettingsRoutingModule } from './staff-settings-routing.module';
import { SharedModule } from 'src/app/modules/public/shared/shared.module';
import { StaffSettingsComponent } from '@components/store/settings/staff-settings/staff-settings.component';
import { PermissionListComponent } from '@elements/permission-list/permission-list.component';
import { EditContributorModalComponent } from '@components/modals/edit-contributor-modal/edit-contributor-modal.component';


@NgModule({
  declarations: [
    StaffSettingsComponent,
    PermissionListComponent,
    EditContributorModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    StaffSettingsRoutingModule
  ]
})
export class StaffSettingsModule { }
