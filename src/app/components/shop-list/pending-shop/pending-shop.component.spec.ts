import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingShopComponent } from './pending-shop.component';

describe('PendingShopComponent', () => {
  let component: PendingShopComponent;
  let fixture: ComponentFixture<PendingShopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingShopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
