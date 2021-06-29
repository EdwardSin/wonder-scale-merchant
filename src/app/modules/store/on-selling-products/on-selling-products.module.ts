import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnSellingProductsRoutingModule } from './on-selling-products-routing.module';
import { OnSellingProductsComponent } from '@components/store/on-selling-products/on-selling-products.component';
import { SharedModule } from '../../public/shared/shared.module';
import { ElementModule } from '../../public/element/element.module';



@NgModule({
  declarations: [
    OnSellingProductsComponent
  ],
  imports: [
    CommonModule,
    ElementModule,
    SharedModule,
    OnSellingProductsRoutingModule
  ]
})
export class OnSellingProductsModule { }
