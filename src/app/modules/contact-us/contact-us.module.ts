import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactUsRoutingModule } from './contact-us-routing.module';
import { SharedModule } from '../public/shared/shared.module';
import { ElementModule } from '../public/element/element.module';
import { ContactUsComponent } from '@components/public/contact-us/contact-us.component';


@NgModule({
  declarations: [ContactUsComponent],
  imports: [
    CommonModule,
    ElementModule,
    SharedModule,
    ContactUsRoutingModule
  ]
})
export class ContactUsModule { }
