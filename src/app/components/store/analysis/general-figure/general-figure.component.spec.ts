import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralFigureComponent } from './general-figure.component';

describe('GeneralFigureComponent', () => {
  let component: GeneralFigureComponent;
  let fixture: ComponentFixture<GeneralFigureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralFigureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralFigureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
