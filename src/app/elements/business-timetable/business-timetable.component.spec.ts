import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTimetableComponent } from './business-timetable.component';

describe('BusinessTimetableComponent', () => {
  let component: BusinessTimetableComponent;
  let fixture: ComponentFixture<BusinessTimetableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessTimetableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessTimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
