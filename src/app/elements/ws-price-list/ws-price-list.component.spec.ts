import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WsPriceListComponent } from './ws-price-list.component';

describe('WsPriceListComponent', () => {
  let component: WsPriceListComponent;
  let fixture: ComponentFixture<WsPriceListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WsPriceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsPriceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
