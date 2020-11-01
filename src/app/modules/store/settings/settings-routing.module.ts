import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from '@components/store/settings/settings/settings.component';
import { StoreResolver } from '@components/resolvers/store-resolver.service';
import { StaffSettingsComponent } from '@components/store/settings/staff-settings/staff-settings.component';
import { AdvancedComponent } from '@components/store/settings/advanced/advanced.component';
import { SettingsListComponent } from '@components/store/settings/settings-list/settings-list.component';


const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
    {
      path: '',
      component: SettingsListComponent,
      resolve: { store: StoreResolver },
      data: { title: '', breadcrumb: '' }
    },
    {
      path: 'general',
      loadChildren: () => import('./general/general.module').then(m => m.GeneralModule),
      resolve: { store: StoreResolver },
      data: { title: 'general', breadcrumb: 'General' }
    }, 
    {
      path: 'staff',
      loadChildren: () => import('./staff-settings/staff-settings.module').then(m => m.StaffSettingsModule),
      resolve: { store: StoreResolver },
      data: { title: 'staff', breadcrumb: 'Staff' }
    },
    {
      path: 'advanced',
      loadChildren: () => import('./advanced/advanced.module').then(m => m.AdvancedModule),
      resolve: { store: StoreResolver },
      data: { title: 'advanced', breadcrumb: 'Advanced' }
    }
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
