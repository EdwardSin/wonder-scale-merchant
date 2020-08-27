import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModifyMenuItemComponent } from '@components/shop/catalogue/modify-menu-item/modify-menu-item.component';


const routes: Routes = [{
  path: '',
  component: ModifyMenuItemComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModifyMenuItemRoutingModule { }
