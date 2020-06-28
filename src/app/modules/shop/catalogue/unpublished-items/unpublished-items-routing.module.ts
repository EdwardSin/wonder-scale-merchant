import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnpublishedItemsComponent } from '@components/shop/catalogue/unpublished-items/unpublished-items.component';


const routes: Routes = [{
  path: '',
  component: UnpublishedItemsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnpublishedItemsRoutingModule { }
