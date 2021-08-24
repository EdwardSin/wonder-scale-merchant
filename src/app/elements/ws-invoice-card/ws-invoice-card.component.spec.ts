import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WsInvoiceCardComponent } from './ws-invoice-card.component';

describe('WsInvoiceCardComponent', () => {
  let component: WsInvoiceCardComponent;
  let fixture: ComponentFixture<WsInvoiceCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WsInvoiceCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsInvoiceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
