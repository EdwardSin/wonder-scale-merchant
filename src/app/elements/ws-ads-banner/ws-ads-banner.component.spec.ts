import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WsAdsBannerComponent } from './ws-ads-banner.component';

describe('WsAdsBannerComponent', () => {
  let component: WsAdsBannerComponent;
  let fixture: ComponentFixture<WsAdsBannerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WsAdsBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsAdsBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
