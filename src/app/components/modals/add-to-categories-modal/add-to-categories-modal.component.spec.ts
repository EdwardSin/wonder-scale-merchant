import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddToCategoriesModalComponent } from './add-to-categories-modal.component';

describe('AddToCategoriesModalComponent', () => {
  let component: AddToCategoriesModalComponent;
  let fixture: ComponentFixture<AddToCategoriesModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddToCategoriesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToCategoriesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
