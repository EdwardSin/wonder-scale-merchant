import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsLoadingButtonComponent } from './ws-loading-button.component';

describe('WsLoadingButtonComponent', () => {
  let component: WsLoadingButtonComponent;
  let fixture: ComponentFixture<WsLoadingButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsLoadingButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsLoadingButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
