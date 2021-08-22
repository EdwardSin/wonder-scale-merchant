import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WsUploaderComponent } from './ws-uploader.component';

describe('WsUploaderComponent', () => {
  let component: WsUploaderComponent;
  let fixture: ComponentFixture<WsUploaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WsUploaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
