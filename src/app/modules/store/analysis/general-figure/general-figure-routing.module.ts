import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeneralFigureComponent } from '@components/store/analysis/general-figure/general-figure.component';


const routes: Routes = [{
  path: '',
  component: GeneralFigureComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralFigureRoutingModule { }
