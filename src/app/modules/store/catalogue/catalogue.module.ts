import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogueRoutingModule } from './catalogue-routing.module';
import { CatalogueComponent } from '@components/store/catalogue/catalogue.component';
import { SharedModule } from '../../public/shared/shared.module';


@NgModule({
  declarations: [
    CatalogueComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CatalogueRoutingModule
  ]
})
export class CatalogueModule { }
