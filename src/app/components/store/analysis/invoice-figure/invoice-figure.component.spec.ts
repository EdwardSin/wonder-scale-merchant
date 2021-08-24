import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InvoiceFigureComponent } from './invoice-figure.component';

describe('InvoiceFigureComponent', () => {
  let component: InvoiceFigureComponent;
  let fixture: ComponentFixture<InvoiceFigureComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceFigureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceFigureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
