import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModifyInvoiceModalComponent } from './modify-invoice-modal.component';

describe('ModifyInvoiceModalComponent', () => {
  let component: ModifyInvoiceModalComponent;
  let fixture: ComponentFixture<ModifyInvoiceModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyInvoiceModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyInvoiceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
