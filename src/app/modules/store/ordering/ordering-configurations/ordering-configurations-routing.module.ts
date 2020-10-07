import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderingConfigurationsComponent } from '@components/store/ordering/ordering-configurations/ordering-configurations.component';


const routes: Routes = [{ path: '', component: OrderingConfigurationsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderingConfigurationsRoutingModule { }
