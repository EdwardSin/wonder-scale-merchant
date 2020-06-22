import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewItemsComponent } from '@components/shop/catalogue/new-items/new-items.component';


const routes: Routes = [{
  path: '',
  component: NewItemsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewItemsRoutingModule { }
