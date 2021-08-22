import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AllInvoicesComponent } from './all-invoices.component';

describe('AllInvoicesComponent', () => {
  let component: AllInvoicesComponent;
  let fixture: ComponentFixture<AllInvoicesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AllInvoicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
