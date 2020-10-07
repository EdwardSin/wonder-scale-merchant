import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModifyItemTypeComponent } from '@components/store/catalogue/modify-item-type/modify-item-type.component';


const routes: Routes = [{
  path: '',
  component: ModifyItemTypeComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModifyItemTypeRoutingModule { }
