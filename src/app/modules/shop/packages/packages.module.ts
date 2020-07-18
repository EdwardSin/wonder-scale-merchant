import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PackagesRoutingModule } from './packages-routing.module';
import { PackagesComponent } from '@components/shop/packages/packages.component';
import { SharedModule } from '../../public/shared/shared.module';
import { PackageListComponent } from '@components/shop/packages/package-list/package-list.component';


@NgModule({
  declarations: [PackagesComponent,
    PackageListComponent],
  imports: [
    CommonModule,
    SharedModule,
    PackagesRoutingModule
  ]
})
export class PackagesModule { }
