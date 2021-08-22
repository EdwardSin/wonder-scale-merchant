import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SalesFigureComponent } from './sales-figure.component';

describe('SalesFigureComponent', () => {
  let component: SalesFigureComponent;
  let fixture: ComponentFixture<SalesFigureComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesFigureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesFigureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
