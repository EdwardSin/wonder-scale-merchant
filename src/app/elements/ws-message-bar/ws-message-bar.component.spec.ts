import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WsMessageBarComponent } from './ws-message-bar.component';

describe('WsMessageBarComponent', () => {
  let component: WsMessageBarComponent;
  let fixture: ComponentFixture<WsMessageBarComponent>;

  beforeEach(waitForAsync(() => {
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
