import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BusinessTimetableComponent } from './business-timetable.component';

describe('BusinessTimetableComponent', () => {
  let component: BusinessTimetableComponent;
  let fixture: ComponentFixture<BusinessTimetableComponent>;

  beforeEach(waitForAsync(() => {
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
