import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuickMenuComponent } from '@components/store/quick-menu/quick-menu.component';


const routes: Routes = [{
  path: '',
  component: QuickMenuComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuickMenuRoutingModule { }
