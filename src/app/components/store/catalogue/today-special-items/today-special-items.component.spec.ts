import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodaySpecialItemsComponent } from './today-special-items.component';

describe('TodaySpecialItemsComponent', () => {
  let component: TodaySpecialItemsComponent;
  let fixture: ComponentFixture<TodaySpecialItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodaySpecialItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodaySpecialItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
