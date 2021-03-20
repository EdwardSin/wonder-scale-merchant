import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PromotionFigureComponent } from '@components/store/analysis/promotion-figure/promotion-figure.component';


const routes: Routes = [{
  path: '',
  component: PromotionFigureComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotionFigureRoutingModule { }
