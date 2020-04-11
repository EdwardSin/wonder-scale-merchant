import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopListControllerComponent } from './shop-list-controller.component';

describe('ShopListControllerComponent', () => {
  let component: ShopListControllerComponent;
  let fixture: ComponentFixture<ShopListControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopListControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopListControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
