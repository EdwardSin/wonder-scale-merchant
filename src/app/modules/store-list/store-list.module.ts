import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreListRoutingModule } from './store-list-routing.module';
import { StoreListComponent } from '@components/store-list/store-list.component';
import { SharedModule } from '../public/shared/shared.module';
import { AllStoresComponent } from '@components/store-list/all-stores/all-stores.component';
import { PendingStoresComponent } from '@components/store-list/pending-stores/pending-stores.component';
import { PendingStoreComponent } from '@components/store-list/pending-store/pending-store.component';
import { StoreListControllerComponent } from '@components/store-list/store-list-controller/store-list-controller.component';
import { ActiveStoreComponent } from '@components/store-list/active-store/active-store.component';

@NgModule({
  declarations: [
    StoreListComponent,
    AllStoresComponent,
    PendingStoresComponent,
    PendingStoreComponent,
    ActiveStoreComponent,
    StoreListControllerComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    StoreListRoutingModule
  ]
})
export class StoreListModule { }
