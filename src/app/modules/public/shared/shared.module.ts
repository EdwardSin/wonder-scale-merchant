import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxDropzoneModule } from 'ngx-dropzone';
import { SortablejsModule } from 'ngx-sortablejs';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { AgmCoreModule } from '@agm/core';
import { MatNativeDateModule } from '@angular/material/core';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { PipeModule } from '../pipe/pipe.module';
import { DirectiveModule } from '../directive/directive.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ElementModule } from '../element/element.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PipeModule,
    DirectiveModule,
    MatInputModule,
    MatSelectModule,
    DragDropModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    LazyLoadImageModule,
    MDBBootstrapModule.forRoot(),
    NgxDropzoneModule,
    SortablejsModule.forRoot({
      animation: 150
    }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBTVuemjzI8vqXoCPeJhtt0WgFQ9TNizLQ'
    })
  ],
  exports: [
    AgmCoreModule,
    FormsModule,
    ReactiveFormsModule,
    ElementModule,
    PipeModule,
    SwiperModule,
    DirectiveModule,
    DragDropModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    LazyLoadImageModule,
    MDBBootstrapModule,
    NgxDropzoneModule,
    SortablejsModule
  ]
})
export class SharedModule { }
