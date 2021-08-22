import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WsMultipleInputComponent } from './ws-multiple-input.component';

describe('WsMultipleInputComponent', () => {
  let component: WsMultipleInputComponent;
  let fixture: ComponentFixture<WsMultipleInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WsMultipleInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsMultipleInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
