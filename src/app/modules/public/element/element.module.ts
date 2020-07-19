import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WsSpinnerComponent } from '@elements/ws-spinner-styles/ws-spinner/ws-spinner.component';
import { WsLoadingComponent } from '@elements/ws-loading/ws-loading.component';
import { WsLoadingButtonComponent } from '@elements/ws-loading-button/ws-loading-button.component';
import { WsSpinnerBarComponent } from '@elements/ws-spinner-styles/ws-spinner-bar/ws-spinner-bar.component';
import { WsSpinnerDotComponent } from '@elements/ws-spinner-styles/ws-spinner-dot/ws-spinner-dot.component';
import { WsSpinnerHDotComponent } from '@elements/ws-spinner-styles/ws-spinner-h-dot/ws-spinner-h-dot.component';
import { WsModalComponent } from '@elements/ws-modal/ws-modal.component';
import { SearchBarComponent } from '@elements/search-bar/search-bar.component';
import { WsUploaderComponent } from '@elements/ws-uploader/ws-uploader.component';
import { WsPaginationComponent } from '@elements/ws-pagination/ws-pagination.component';
import { WsDropdownComponent } from '@elements/ws-dropdown/ws-dropdown.component';
import { WsLoadingScreenComponent } from '@elements/ws-loading-screen/ws-loading-screen.component';
import { WsToastComponent } from '@elements/ws-toast/ws-toast.component';
import { WsMultipleInputComponent } from '@elements/ws-multiple-input/ws-multiple-input.component';
import { BusinessLocationComponent } from '@elements/business-location/business-location.component';
import { BusinessTimetableComponent } from '@elements/business-timetable/business-timetable.component';
import { ConfirmModalComponent } from '@components/modals/confirm-modal/confirm-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PackageListComponent } from '@components/shop/packages/package-list/package-list.component';



@NgModule({
  declarations: [
    WsSpinnerComponent,
    WsLoadingComponent,
    WsLoadingButtonComponent,
    WsLoadingScreenComponent,
    WsSpinnerBarComponent,
    WsSpinnerDotComponent,
    WsSpinnerHDotComponent,
    WsModalComponent,
    WsToastComponent,
    WsPaginationComponent,
    WsUploaderComponent,
    WsMultipleInputComponent,
    WsDropdownComponent,
    SearchBarComponent,
    BusinessLocationComponent,
    BusinessTimetableComponent,
    ConfirmModalComponent,
    PackageListComponent
  ],
  imports: [
    AgmCoreModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  exports: [WsSpinnerComponent,
    WsLoadingComponent,
    WsLoadingButtonComponent,
    WsLoadingScreenComponent,
    WsSpinnerBarComponent,
    WsSpinnerDotComponent,
    WsSpinnerHDotComponent,
    WsModalComponent,
    WsToastComponent,
    WsPaginationComponent,
    WsUploaderComponent,
    WsMultipleInputComponent,
    WsDropdownComponent,
    SearchBarComponent,
    BusinessLocationComponent,
    BusinessTimetableComponent,
    ConfirmModalComponent,
    PackageListComponent
  ]
})
export class ElementModule { }
