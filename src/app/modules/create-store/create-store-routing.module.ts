import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateStoreComponent } from '../../components/store/create-store/create-store.component';

const routes: Routes = [{ path: '', component: CreateStoreComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateStoreRoutingModule { }
