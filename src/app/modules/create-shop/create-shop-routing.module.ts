import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateShopComponent } from '../../components/shop/create-shop/create-shop.component';

const routes: Routes = [{ path: '', component: CreateShopComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateShopRoutingModule { }
