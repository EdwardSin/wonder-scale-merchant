import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrackingComponent } from '@components/store/tracking/tracking.component';
import { StoreGuard } from 'src/app/guards/store.guard';


const routes: Routes = [{
    path: '',
    component: TrackingComponent,
    children: [
      { path: '', redirectTo: 'figure', pathMatch: 'full' },
      {
        path: 'figure',
        data: { title: 'figure', breadcrumb: 'Figure' },
        loadChildren: () => import('../tracking/tracking-figure/tracking-figure.module').then(m => m.TrackingFigureModule)
      }, {
        path: 'qrcode',
        data: { title: 'qrcode', breadcrumb: 'Qr Code' },
        loadChildren: () => import('../tracking/qrcode/qrcode.module').then(m => m.QrcodeModule)
      }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackingRoutingModule { }
