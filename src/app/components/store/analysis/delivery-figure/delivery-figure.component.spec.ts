import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryFigureComponent } from './delivery-figure.component';

describe('DeliveryFigureComponent', () => {
  let component: DeliveryFigureComponent;
  let fixture: ComponentFixture<DeliveryFigureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryFigureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryFigureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
