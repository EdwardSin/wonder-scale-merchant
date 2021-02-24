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
import { BusinessTimetableComponent } from '@elements/business-timetable/business-timetable.component';
import { ConfirmModalComponent } from '@components/modals/confirm-modal/confirm-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { MatNativeDateModule } from '@angular/material/core';
import { BusinessLocationComponent } from '@elements/business-location/business-location.component';
import { DirectiveModule } from '../directive/directive.module';
import { WsInvoiceCardComponent } from '@elements/ws-invoice-card/ws-invoice-card.component';
import { WsSearchSelectComponent } from '@elements/ws-search-select/ws-search-select.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectInfiniteScrollModule } from 'ng-mat-select-infinite-scroll';
import { WsInvoiceComponent } from '@elements/ws-invoice/ws-invoice.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { RouterModule } from '@angular/router';
import { WsMessageBarComponent } from '@elements/ws-message-bar/ws-message-bar.component';
import { WsPriceListComponent } from '@elements/ws-price-list/ws-price-list.component';
import { WsStepperComponent } from '@elements/ws-stepper/ws-stepper.component';


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
    WsInvoiceCardComponent,
    WsPaginationComponent,
    WsUploaderComponent,
    WsMultipleInputComponent,
    WsSearchSelectComponent,
    WsDropdownComponent,
    SearchBarComponent,
    BusinessTimetableComponent,
    ConfirmModalComponent,
    BusinessLocationComponent,
    WsInvoiceComponent,
    WsMessageBarComponent,
    WsPriceListComponent,
    WsStepperComponent
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
    MatTabsModule,
    MatNativeDateModule,
    NgxMatSelectSearchModule,
    MatSelectInfiniteScrollModule,
    DirectiveModule,
    RouterModule
  ],
  exports: [
    WsSpinnerComponent,
    WsLoadingComponent,
    WsLoadingButtonComponent,
    WsLoadingScreenComponent,
    WsSpinnerBarComponent,
    WsSpinnerDotComponent,
    WsSpinnerHDotComponent,
    WsModalComponent,
    WsToastComponent,
    WsInvoiceCardComponent,
    WsPaginationComponent,
    WsUploaderComponent,
    WsMultipleInputComponent,
    WsSearchSelectComponent,
    WsDropdownComponent,
    SearchBarComponent,
    BusinessTimetableComponent,
    ConfirmModalComponent,
    BusinessLocationComponent,
    WsInvoiceComponent,
    WsMessageBarComponent,
    WsPriceListComponent,
    WsStepperComponent
  ]
})
export class ElementModule { }
