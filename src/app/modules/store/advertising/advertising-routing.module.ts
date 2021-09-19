import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdvertisingComponent } from '@components/store/advertising/advertising.component';


const routes: Routes = [
  {
    path: '',
    component: AdvertisingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvertisingRoutingModule { }
