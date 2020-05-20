import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsLoadingScreenComponent } from './ws-loading-screen.component';

describe('WsLoadingScreenComponent', () => {
  let component: WsLoadingScreenComponent;
  let fixture: ComponentFixture<WsLoadingScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsLoadingScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsLoadingScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
