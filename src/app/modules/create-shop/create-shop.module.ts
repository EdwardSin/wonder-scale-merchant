import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateShopRoutingModule } from './create-shop-routing.module';
import { CreateShopComponent } from '../../components/shop/create-shop/create-shop.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ElementModule } from '../public/element/element.module';
import { SharedModule } from '../public/shared/shared.module';
import { PackageListComponent } from '@components/shop/packages/package-list/package-list.component';


@NgModule({
  declarations: [
    CreateShopComponent,
    PackageListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CreateShopRoutingModule,
    MDBBootstrapModule.forRoot(),
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    ElementModule,
    SharedModule,
    CreateShopRoutingModule,
    MDBBootstrapModule
  ]
})
export class CreateShopModule { }
