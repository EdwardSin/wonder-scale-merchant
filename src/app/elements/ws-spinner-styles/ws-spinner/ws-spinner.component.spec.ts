import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WsSpinnerComponent } from './ws-spinner.component';

describe('WsSpinnerComponent', () => {
  let component: WsSpinnerComponent;
  let fixture: ComponentFixture<WsSpinnerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WsSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
