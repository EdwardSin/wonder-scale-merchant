import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceInfoModalComponent } from './invoice-info-modal.component';

describe('InvoiceInfoModalComponent', () => {
  let component: InvoiceInfoModalComponent;
  let fixture: ComponentFixture<InvoiceInfoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceInfoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
