import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsOrderCardComponent } from './ws-order-card.component';

describe('WsOrderCardComponent', () => {
  let component: WsOrderCardComponent;
  let fixture: ComponentFixture<WsOrderCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsOrderCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsOrderCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
