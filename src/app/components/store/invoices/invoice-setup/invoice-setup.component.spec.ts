import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceSetupComponent } from './invoice-setup.component';

describe('InvoiceSetupComponent', () => {
  let component: InvoiceSetupComponent;
  let fixture: ComponentFixture<InvoiceSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
