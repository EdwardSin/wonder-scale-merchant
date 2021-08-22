import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BusinessLocationComponent } from './business-location.component';

describe('BusinessLocationComponent', () => {
  let component: BusinessLocationComponent;
  let fixture: ComponentFixture<BusinessLocationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
