import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StaffSettingsComponent } from '@components/store/settings/staff-settings/staff-settings.component';


const routes: Routes = [{
  path: '',
  component: StaffSettingsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffSettingsRoutingModule { }
