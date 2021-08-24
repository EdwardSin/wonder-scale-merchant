import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AllStoresComponent } from './all-stores.component';

describe('AllStoresComponent', () => {
  let component: AllStoresComponent;
  let fixture: ComponentFixture<AllStoresComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AllStoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllStoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
