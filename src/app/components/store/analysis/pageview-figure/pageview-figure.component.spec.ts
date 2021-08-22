import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PageviewFigureComponent } from './pageview-figure.component';

describe('PageviewFigureComponent', () => {
  let component: PageviewFigureComponent;
  let fixture: ComponentFixture<PageviewFigureComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PageviewFigureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageviewFigureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
