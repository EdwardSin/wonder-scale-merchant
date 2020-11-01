import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StoreListComponent } from '@components/store-list/store-list.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { AllStoresComponent } from '@components/store-list/all-stores/all-stores.component';
import { PendingStoresComponent } from '@components/store-list/pending-stores/pending-stores.component';


const routes: Routes = [
  {
    path: '',
    component: StoreListComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', redirectTo: 'all', pathMatch: 'full', },
    { path: 'all', component: AllStoresComponent },
    { path: 'pending', component: PendingStoresComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreListRoutingModule { }
