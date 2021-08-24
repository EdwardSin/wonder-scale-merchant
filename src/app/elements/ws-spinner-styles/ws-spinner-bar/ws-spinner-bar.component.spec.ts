import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WsSpinnerBarComponent } from './ws-spinner-bar.component';

describe('WsSpinnerBarComponent', () => {
  let component: WsSpinnerBarComponent;
  let fixture: ComponentFixture<WsSpinnerBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WsSpinnerBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsSpinnerBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
