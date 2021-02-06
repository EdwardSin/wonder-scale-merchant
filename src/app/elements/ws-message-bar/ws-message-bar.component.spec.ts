import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsMessageBarComponent } from './ws-message-bar.component';

describe('WsMessageBarComponent', () => {
  let component: WsMessageBarComponent;
  let fixture: ComponentFixture<WsMessageBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsMessageBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsMessageBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
