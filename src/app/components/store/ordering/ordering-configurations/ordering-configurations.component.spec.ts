import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderingConfigurationsComponent } from './ordering-configurations.component';

describe('OrderingConfigurationsComponent', () => {
  let component: OrderingConfigurationsComponent;
  let fixture: ComponentFixture<OrderingConfigurationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderingConfigurationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderingConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
