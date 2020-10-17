import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingFigureComponent } from './tracking-figure.component';

describe('TrackingFigureComponent', () => {
  let component: TrackingFigureComponent;
  let fixture: ComponentFixture<TrackingFigureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackingFigureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingFigureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
