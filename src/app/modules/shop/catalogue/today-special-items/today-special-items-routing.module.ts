import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TodaySpecialItemsComponent } from '@components/shop/catalogue/today-special-items/today-special-items.component';


const routes: Routes = [{
  path: '',
  component: TodaySpecialItemsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TodaySpecialItemsRoutingModule { }
