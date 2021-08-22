import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WsToastComponent } from './ws-toast.component';

describe('WsToastComponent', () => {
  let component: WsToastComponent;
  let fixture: ComponentFixture<WsToastComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WsToastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
