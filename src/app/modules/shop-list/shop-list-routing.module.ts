import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShopListComponent } from '@components/shop-list/shop-list.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { AllShopsComponent } from '@components/shop-list/all-shops/all-shops.component';
import { PendingShopsComponent } from '@components/shop-list/pending-shops/pending-shops.component';


const routes: Routes = [
  {
    path: '',
    component: ShopListComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', redirectTo: 'all', pathMatch: 'full', },
    { path: 'all', component: AllShopsComponent },
    { path: 'pending', component: PendingShopsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopListRoutingModule { }
