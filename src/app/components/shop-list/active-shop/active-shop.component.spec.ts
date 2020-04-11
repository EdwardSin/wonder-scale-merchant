import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveShopComponent } from './active-shop.component';

describe('ActiveShopComponent', () => {
  let component: ActiveShopComponent;
  let fixture: ComponentFixture<ActiveShopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveShopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
