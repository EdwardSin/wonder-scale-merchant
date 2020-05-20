import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsLeftNavComponent } from './ws-left-nav.component';

describe('WsLeftNavComponent', () => {
  let component: WsLeftNavComponent;
  let fixture: ComponentFixture<WsLeftNavComponent>;

  beforeEach(async(() => {
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
