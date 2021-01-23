import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageviewFigureComponent } from '@components/store/analysis/pageview-figure/pageview-figure.component';


const routes: Routes = [
  {
    path: '',
    component: PageviewFigureComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageViewFigureRoutingModule { }
