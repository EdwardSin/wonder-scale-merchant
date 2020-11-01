import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrackingFigureComponent } from '@components/store/tracking/tracking-figure/tracking-figure.component';


const routes: Routes = [
  {
    path: '',
    component: TrackingFigureComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackingFigureRoutingModule { }
