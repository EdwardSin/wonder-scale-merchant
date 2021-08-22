import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WsSpinnerDotComponent } from './ws-spinner-dot.component';

describe('WsSpinnerDotComponent', () => {
  let component: WsSpinnerDotComponent;
  let fixture: ComponentFixture<WsSpinnerDotComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WsSpinnerDotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsSpinnerDotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
