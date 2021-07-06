import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModifyItemComponent } from '@components/store/products/modify-item/modify-item.component';


const routes: Routes = [{
  path: '',
  component: ModifyItemComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModifyItemRoutingModule { }
