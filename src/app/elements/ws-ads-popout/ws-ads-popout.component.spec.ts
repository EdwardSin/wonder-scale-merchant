import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WsAdsPopoutComponent } from './ws-ads-popout.component';

describe('WsAdsPopoutComponent', () => {
  let component: WsAdsPopoutComponent;
  let fixture: ComponentFixture<WsAdsPopoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WsAdsPopoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsAdsPopoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
