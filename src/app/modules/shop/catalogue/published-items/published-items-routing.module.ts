import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublishedItemsComponent } from '@components/shop/catalogue/published-items/published-items.component';


const routes: Routes = [{
  path: '',
  component: PublishedItemsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublishedItemsRoutingModule { }
