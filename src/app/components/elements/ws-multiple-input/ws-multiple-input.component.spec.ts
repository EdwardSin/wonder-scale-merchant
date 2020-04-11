import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsMultipleInputComponent } from './ws-multiple-input.component';

describe('WsMultipleInputComponent', () => {
  let component: WsMultipleInputComponent;
  let fixture: ComponentFixture<WsMultipleInputComponent>;

  beforeEach(async(() => {
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
