import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AllItemsComponent } from './all-items.component';

describe('AllItemsComponent', () => {
  let component: AllItemsComponent;
  let fixture: ComponentFixture<AllItemsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AllItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
