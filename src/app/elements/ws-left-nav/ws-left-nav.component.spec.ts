import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WsLeftNavComponent } from './ws-left-nav.component';

describe('WsLeftNavComponent', () => {
  let component: WsLeftNavComponent;
  let fixture: ComponentFixture<WsLeftNavComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WsLeftNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsLeftNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
