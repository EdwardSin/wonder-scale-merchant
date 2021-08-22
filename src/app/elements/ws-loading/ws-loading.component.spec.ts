import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WsLoadingComponent } from './ws-loading.component';

describe('WsLoadingComponent', () => {
  let component: WsLoadingComponent;
  let fixture: ComponentFixture<WsLoadingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WsLoadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
