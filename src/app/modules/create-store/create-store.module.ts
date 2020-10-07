import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateStoreRoutingModule } from './create-store-routing.module';
import { CreateStoreComponent } from '../../components/store/create-store/create-store.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ElementModule } from '../public/element/element.module';
import { SharedModule } from '../public/shared/shared.module';


@NgModule({
  declarations: [
    CreateStoreComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CreateStoreRoutingModule,
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
    CreateStoreRoutingModule,
    MDBBootstrapModule
  ]
})
export class CreateStoreModule { }
