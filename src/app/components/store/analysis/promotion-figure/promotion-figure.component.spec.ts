import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PromotionFigureComponent } from './promotion-figure.component';

describe('PromotionFigureComponent', () => {
  let component: PromotionFigureComponent;
  let fixture: ComponentFixture<PromotionFigureComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionFigureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionFigureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
