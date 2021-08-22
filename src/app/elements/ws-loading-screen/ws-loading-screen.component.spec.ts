import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WsLoadingScreenComponent } from './ws-loading-screen.component';

describe('WsLoadingScreenComponent', () => {
  let component: WsLoadingScreenComponent;
  let fixture: ComponentFixture<WsLoadingScreenComponent>;

  beforeEach(waitForAsync(() => {
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
