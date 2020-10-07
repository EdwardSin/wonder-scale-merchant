import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { SharedModule } from 'src/app/modules/public/shared/shared.module';
import { AboutComponent } from '@components/store/settings/about/about.component';
import { PermissionListComponent } from '@elements/permission-list/permission-list.component';
import { EditContributorModalComponent } from '@components/modals/edit-contributor-modal/edit-contributor-modal.component';


@NgModule({
  declarations: [
    AboutComponent,
    PermissionListComponent,
    EditContributorModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AboutRoutingModule
  ]
})
export class AboutModule { }
