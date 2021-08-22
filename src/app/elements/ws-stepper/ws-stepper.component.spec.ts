import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WsStepperComponent } from './ws-stepper.component';

describe('WsStepperComponent', () => {
  let component: WsStepperComponent;
  let fixture: ComponentFixture<WsStepperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WsStepperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
