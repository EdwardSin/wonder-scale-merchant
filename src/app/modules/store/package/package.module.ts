import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PackageRoutingModule } from './package-routing.module';
import { PackageComponent } from '@components/store/package/package.component';
import { ElementModule } from '../../public/element/element.module';
import { SharedModule } from '../../public/shared/shared.module';


@NgModule({
  declarations: [PackageComponent],
  imports: [
    CommonModule,
    SharedModule,
    ElementModule,
    PackageRoutingModule
  ]
})
export class PackageModule { }
