import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShopGuard } from 'src/app/shop.guard';
import { QrcodeComponent } from '@components/shop/qrcode/qrcode.component';


const routes: Routes = [
  {
    path: '',
    component: QrcodeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QrcodeRoutingModule { }
