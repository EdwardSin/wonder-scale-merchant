import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WsSpinnerHDotComponent } from './ws-spinner-h-dot.component';

describe('WsSpinnerHDotComponent', () => {
  let component: WsSpinnerHDotComponent;
  let fixture: ComponentFixture<WsSpinnerHDotComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WsSpinnerHDotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsSpinnerHDotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
