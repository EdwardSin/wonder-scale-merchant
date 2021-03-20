import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionFigureComponent } from './promotion-figure.component';

describe('PromotionFigureComponent', () => {
  let component: PromotionFigureComponent;
  let fixture: ComponentFixture<PromotionFigureComponent>;

  beforeEach(async(() => {
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
