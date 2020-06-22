import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UncategorizedItemsComponent } from '@components/shop/catalogue/uncategorized-items/uncategorized-items.component';


const routes: Routes = [{
  path: '',
  component: UncategorizedItemsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UncategorizedItemsRoutingModule { }
